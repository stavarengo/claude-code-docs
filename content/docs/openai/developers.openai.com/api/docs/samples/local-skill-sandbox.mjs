import { spawn } from "node:child_process";

export const sandboxImage =
  "python@sha256:a6e34c598f2467ed0e9a8d349809fcd8b5c603269512df273a0bb1784edc11b1";
const outputLimit = 64 * 1024;

// Drain both pipes while retaining only bounded prefixes. Killing the Docker
// client does not stop a command in the container; callers handle that separately.
/**
 * @param {string[]} args
 * @param {{signal?: AbortSignal, timeoutMs?: number, input?: string}} [options]
 */
function docker(args, { signal, timeoutMs = 10_000, input = "" } = {}) {
  signal?.throwIfAborted();
  return new Promise((resolve, reject) => {
    const child = spawn("docker", args, { stdio: ["pipe", "pipe", "pipe"] });
    const stdout = [];
    const stderr = [];
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let truncated = false;
    let timedOut = false;
    let failure;
    const capture = (chunks, chunk, size) => {
      const remaining = outputLimit - size;
      if (chunk.length > remaining) truncated = true;
      if (remaining > 0) chunks.push(chunk.subarray(0, remaining));
      return Math.min(outputLimit, size + chunk.length);
    };
    child.stdout.on("data", (chunk) => {
      stdoutBytes = capture(stdout, chunk, stdoutBytes);
    });
    child.stderr.on("data", (chunk) => {
      stderrBytes = capture(stderr, chunk, stderrBytes);
    });
    const abort = () => child.kill("SIGKILL");
    const timer = setTimeout(() => {
      timedOut = true;
      abort();
    }, timeoutMs);
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) abort();
    child.on("error", (error) => {
      failure = error;
    });
    child.stdin.on("error", (error) => {
      if (!("code" in error) || error.code !== "EPIPE") {
        failure = error;
        abort();
      }
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      if (signal?.aborted) return reject(signal.reason);
      if (failure) return reject(failure);
      if (code === null && !timedOut)
        return reject(new Error("Docker terminated unexpectedly"));
      resolve({
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        code,
        timedOut,
        truncated,
      });
    });
    child.stdin.end(input);
  });
}

async function requireDocker(args, options = {}) {
  const result = await docker(args, options);
  if (result.timedOut || result.code !== 0 || result.truncated)
    throw new Error(`Docker operation failed: ${result.stderr}`);
  return result.stdout;
}

export async function withLocalSkillSandbox(name, workflow) {
  const signal = AbortSignal.timeout(60_000);
  const errors = [];
  let result;
  try {
    // No host mounts, networking, credentials, or Docker socket enter the sandbox.
    // Auto-removal after 80 seconds also covers termination of this Node process.
    await requireDocker(
      [
        "run",
        "-d",
        "--rm",
        "--name",
        name,
        "--label",
        "openai-docs-sample=local-skill",
        "--network=none",
        "--read-only",
        "--cap-drop=ALL",
        "--security-opt=no-new-privileges",
        "--pids-limit=64",
        "--memory=256m",
        "--cpus=1",
        "--user=65534:65534",
        "--tmpfs",
        "/workspace:rw,nosuid,nodev,size=16m,mode=1777",
        "--tmpfs",
        "/tmp:rw,nosuid,nodev,size=16m,mode=1777",
        "--workdir=/workspace",
        sandboxImage,
        "sleep",
        "80",
      ],
      { signal }
    );
    await requireDocker(["exec", "-i", name, "python", "-I", "-"], {
      signal,
      input: `from pathlib import Path
p = Path("/workspace/skills/csv-insights")
p.mkdir(parents=True)
(p / "SKILL.md").write_text("---\\nname: csv-insights\\ndescription: Summarize CSV files and produce a markdown report.\\n---\\nRead /workspace/reports.csv with Python csv. Sum the amount column and write /workspace/report.md with the total.\\n")
Path("/workspace/reports.csv").write_text("item,amount\\nA,125\\nB,75\\n")
`,
    });
    result = await workflow(signal);
  } catch (error) {
    errors.push(error);
  } finally {
    try {
      await requireDocker(["rm", "-f", name], { timeoutMs: 20_000 });
    } catch (cleanupError) {
      errors.push(cleanupError);
    }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1)
    throw new AggregateError(errors, "Workflow and sandbox cleanup failed");
  return result;
}

/** @param {import("openai").OpenAI.Responses.ResponseFunctionShellToolCall} call */
export async function executeShellCall(name, call, signal) {
  if (
    !call.call_id ||
    call.action.commands.length < 1 ||
    call.action.commands.length > 8
  )
    throw new Error(
      "Shell call needs an identity and between one and eight commands"
    );
  const limit = call.action.max_output_length;
  if (limit != null && (!Number.isSafeInteger(limit) || limit < 0))
    throw new Error("Shell output limit must be a nonnegative integer");
  /** @type {import("openai").OpenAI.Responses.ResponseInputItem.ShellCallOutput} */
  const result = {
    type: "shell_call_output",
    call_id: call.call_id,
    output: [],
  };
  if (limit != null) result.max_output_length = limit;
  // Share the character limit across stdout, stderr, and all commands.
  let remaining = limit;
  const take = (text) => {
    if (remaining == null) return text;
    const characters = Array.from(text).slice(0, remaining);
    remaining -= characters.length;
    return characters.join("");
  };
  for (const command of call.action.commands) {
    const requestedTimeout = call.action.timeout_ms;
    const timeoutMs =
      requestedTimeout > 0 ? Math.min(requestedTimeout, 10_000) : 10_000;
    const output = await docker(["exec", name, "sh", "-c", command], {
      signal,
      timeoutMs,
    });
    if (output.timedOut) {
      // Linux kill(-1) excludes PID 1 and the sender. Stop remaining generated
      // processes before continuing, preserving workspace files for the next turn.
      await requireDocker(
        [
          "exec",
          name,
          "python",
          "-I",
          "-c",
          "import os,signal\ntry: os.kill(-1,signal.SIGKILL)\nexcept ProcessLookupError: pass",
        ],
        { signal, timeoutMs: 5_000 }
      );
    }
    result.output.push({
      stdout: take(output.stdout),
      stderr: take(output.stderr),
      outcome: output.timedOut
        ? { type: "timeout" }
        : { type: "exit", exit_code: output.code },
    });
  }
  return result;
}

export async function readSkillReport(name, signal) {
  // Isolated Python mode prevents generated modules from replacing standard
  // library imports. Refuse links, devices, FIFOs, and oversized or growing files.
  return requireDocker(
    [
      "exec",
      name,
      "python",
      "-I",
      "-c",
      `import os, stat, sys
fd = os.open("/workspace/report.md", os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
try:
    info = os.fstat(fd)
    if not stat.S_ISREG(info.st_mode) or info.st_size > 65536:
        raise ValueError("report must be a regular file of at most 65536 bytes")
    with os.fdopen(fd, "rb", closefd=False) as report:
        data = report.read(65537)
    if len(data) > 65536:
        raise ValueError("report grew beyond 65536 bytes")
    sys.stdout.buffer.write(data)
finally:
    os.close(fd)
`,
    ],
    { signal }
  );
}
