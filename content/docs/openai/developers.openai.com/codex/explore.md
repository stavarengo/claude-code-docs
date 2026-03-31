# Explore

## Get started

<ExampleGallery>
  <ExampleTask
    client:load
    id="snake-game"
    shortDescription="Build a classic Snake game in this repo."
    prompt={[
      "Build a classic Snake game in this repo.",
      "",
      "Scope & constraints:",
      "- Implement ONLY the classic Snake loop: grid movement, growing snake, food spawn, score, game-over, restart.",
      "- Reuse existing project tooling/frameworks; do NOT add new dependencies unless truly required.",
      "- Keep UI minimal and consistent with the repo’s existing styles (no new design systems, no extra animations).",
      "",
      "Implementation plan:",
      "1) Inspect the repo to find the right place to add a small interactive game (existing pages/routes/components).",
      "2) Implement game state (snake positions, direction, food, score, tick timer) with deterministic, testable logic.",
      "3) Render: simple grid + snake + food; support keyboard controls (arrow keys/WASD) and on-screen controls if mobile is present in the repo.",
      "4) Add basic tests for the core game logic (movement, collisions, growth, food placement) if the repo has a test runner.",
      "",
      "Deliverables:",
      "- A small set of files/changes with clear names.",
      "- Short run instructions (how to start dev server + where to navigate).",
      "- A brief checklist of what to manually verify (controls, pause/restart, boundaries).",
    ].join("\n")}
    iconName="gamepad"
  />
  <ExampleTask
    client:load
    id="fix-bugs"
    shortDescription="Find and fix bugs in my codebase with minimal, high-confidence changes."
    prompt={[
      "Find and fix bugs in my codebase with minimal, high-confidence changes.",
      "",
      "Method (grounded + disciplined):",
      "1) Reproduce: run tests/lint/build (or follow the existing repo scripts). If I provided an error, reproduce that exact failure.",
      "2) Localize: identify the smallest set of files/lines involved (stack traces, failing tests, logs).",
      "3) Fix: implement the minimal change that resolves the issue without refactors or unrelated cleanup.",
      "4) Prove: add/update a focused test (or a tight repro) that fails before and passes after.",
      "",
      "Constraints:",
      "- Do NOT invent errors or pretend to run commands you cannot run.",
      "- No scope drift: no new features, no UI embellishments, no style overhauls.",
      "- If information is missing, state what you can confirm from the repo and what remains unknown.",
      "",
      "Output:",
      "- Summary (3–6 sentences max): what was broken, why, and the fix.",
      "- Then ≤5 bullets: What changed, Where (paths), Evidence (tests/logs), Risks, Next steps.",
    ].join("\n")}
    iconName="search"
  />
  <ExampleTask
    client:load
    id="viral-feature"
    shortDescription="Propose and implement one high-leverage viral feature for my app."
    prompt={[
      "Propose AND implement one high-leverage viral feature for my app.",
      "",
      "Rules:",
      "- Pick ONE feature that fits the app’s existing product surface (no multi-feature bundles).",
      "- Optimize for minimal engineering scope and measurable impact.",
      "- Reuse existing patterns, auth, analytics, and UI components.",
      "- Do NOT introduce a new design system or a complex growth framework.",
      "",
      "Process:",
      "1) Quickly infer the app’s core loop and shareable moment from repo signals (routes, copy, analytics, existing flows).",
      "2) Choose one feature (e.g., share link/referral/invite loop) and state assumptions clearly if the repo doesn’t reveal intent.",
      "3) Implement the end-to-end slice: UI entry point → backend/API (if needed) → tracking (if present) → success state.",
      "4) Add a small measurement hook: define 1–2 concrete events/metrics (e.g., share_clicked, invite_accepted).",
      "",
      "Output:",
      "- 1 short overview paragraph.",
      "- Then ≤5 bullets: Feature, Why (evidence/assumptions), Implementation plan, Files changed, How to verify.",
    ].join("\n")}
    iconName="sparkles"
  />
  <ExampleTask
    client:load
    id="dashboard"
    shortDescription="Create a dashboard for …."
    prompt={[
      "Create a dashboard for ….",
      "",
      "Interpretation rule:",
      "- If the exact metrics/entities are not specified, build the simplest valid dashboard shell that’s easy to extend (layout + placeholders + wiring points), and clearly label assumptions.",
      "",
      "Implementation requirements:",
      "- Reuse the repo’s existing UI components, charts, and data-fetch patterns.",
      "- No new charting libraries unless the repo has none and the dashboard cannot be built otherwise.",
      "- Provide a clean information hierarchy: headline KPIs → trends → breakdown table.",
      "",
      "Output:",
      "- ≤5 bullets: What you built, Where it lives (routes/components), Data sources used (or TODOs), Risks, Next steps.",
      "- Include a short “How to view” instruction.",
    ].join("\n")}
    iconName="tab-layout"
  />
  <ExampleTask
    client:load
    id="interactive-prototype"
    shortDescription="Create an interactive prototype based on my meeting notes."
    prompt={[
      "Create an interactive prototype based on my meeting notes.",
      "",
      "Requirements:",
      "- Extract the core user flow and acceptance criteria from the notes.",
      "- Build a minimal clickable prototype (happy path + 1–2 key edge states).",
      "- Keep styling consistent with the repo; do not introduce new UI systems.",
      "",
      "Output:",
      "- 1 short overview paragraph.",
      "- Then ≤5 bullets: Flow, Screens/components, Key interactions, Files/paths, How to run/view.",
      "- If notes are ambiguous, choose the simplest interpretation and label assumptions.",
    ].join("\n")}
    iconName="wand"
  />
  <ExampleTask
    client:load
    id="sales-call-features"
    shortDescription="Analyze a sales call and implement the highest-impact missing features."
    prompt={[
      "Analyze a sales call and implement the highest-impact missing features.",
      "",
      "Method:",
      "- Extract customer pain points and explicit feature requests.",
      "- Map them to the current product (repo evidence), then select 1–2 features with best ROI.",
      "- Implement minimal end-to-end slices with clear acceptance criteria.",
      "",
      "Constraints:",
      "- No broad product rewrites.",
      "- If the call notes are ambiguous, present 2–3 interpretations with labeled assumptions and pick the simplest build.",
      "",
      "Output:",
      "- ≤5 bullets: Requests, Chosen features, Implementation plan, Files changed, How to verify.",
    ].join("\n")}
    iconName="briefcase"
  />
  <ExampleTask
    client:load
    id="architecture-failure-modes"
    shortDescription="Explain the top failure modes of my application's architecture."
    prompt={[
      "Explain the top failure modes of my application's architecture.",
      "",
      "Approach:",
      "- Derive the architecture from repo evidence (services, DBs, queues, network calls, critical paths).",
      "- Identify realistic failure modes (availability, data loss, latency, scaling, consistency, security, dependency outages).",
      "",
      "Output:",
      "- 1 short overview paragraph.",
      "- Then ≤5 bullets: Failure mode, Trigger, Symptoms, Detection, Mitigation.",
      "- If key architecture details are missing, state what you inferred vs. what you confirmed.",
    ].join("\n")}
    iconName="brain"
  />
  <ExampleTask
    client:load
    id="architecture-bedtime-story"
    shortDescription="Write a bedtime story for a 5-year-old about my system's architecture."
    prompt={[
      "Write a bedtime story for a 5-year-old about my system's architecture.",
      "",
      "Constraints:",
      "- Keep it comforting and simple.",
      "- Use friendly analogies for core components (e.g., “mail carrier” for queues) grounded in the app’s real pieces.",
      "",
      "Output:",
      "- 8–12 short paragraphs.",
      "- A tiny glossary at the end mapping each character to a real system component (2–6 entries).",
    ].join("\n")}
    iconName="book"
  />
</ExampleGallery>

## Use skills

<ExampleGallery>
  <ExampleTask
    client:load
    id="one-page-pdf"
    shortDescription="Create a one-page $pdf that summarizes this app."
    prompt={[
      "Create a one-page $pdf that summarizes this app.",
      "",
      "Content requirements (1 page total):",
      "- What it is: 1–2 sentence description.",
      "- Who it’s for: primary user/persona.",
      "- What it does: 5–7 crisp bullets of key features.",
      "- How it works: a compact architecture overview (components/services/data flow) based ONLY on repo evidence.",
      "- How to run: the minimal “getting started” steps.",
      "",
      "Formatting constraints:",
      "- Must fit on a single page (no overflow).",
      "- Prefer a clean, scannable layout: headings + bullets; avoid long paragraphs.",
      "- If the repo lacks key info, explicitly mark those items as “Not found in repo.”",
      "",
      "Deliverable:",
      "- Output a generated $pdf and include its filename/path.",
    ].join("\n")}
    iconName="poem"
  />
  <ExampleTask
    client:load
    id="figma-implementation"
    shortDescription="Implement designs from my Figma file in this codebase using $figma-implement-design."
    prompt={[
      "Implement designs from my Figma file in this codebase using $figma-implement-design.",
      "",
      "Design-system & scope discipline:",
      "- Match the existing design system/tokens exactly; do NOT invent new colors, shadows, spacing scales, or animations.",
      "- Implement ONLY what’s in the provided Figma frames (no extra UX features).",
      "",
      "Workflow:",
      "1) Identify target screens/components in Figma and map them to existing routes/components.",
      "2) Reuse existing primitives; create new components only when reuse is clearly impossible.",
      "3) Ensure responsive behavior consistent with the repo’s conventions.",
      "4) Validate: pixel-ish alignment where feasible, but prioritize correctness and consistency over overfitting.",
      "",
      "Output:",
      "- A compact change summary: What changed + file paths.",
      "- A checklist of what to verify in the UI (states, responsiveness, accessibility basics).",
      "- If any Figma detail is ambiguous, pick the simplest interpretation and note it briefly.",
    ].join("\n")}
    iconName="design"
  />
  <ExampleTask
    client:load
    id="deploy-vercel"
    shortDescription="Deploy this project to Vercel with $vercel-deploy and a safe, minimal setup."
    prompt={[
      "Deploy this project to Vercel with $vercel-deploy and a safe, minimal setup.",
      "",
      "Requirements:",
      "- Detect existing deployment configuration (vercel.json, build settings, env vars) and reuse it.",
      "- Ensure the project builds successfully with the repo’s standard commands.",
      "- Identify required environment variables from the repo and document them clearly.",
      "",
      "Constraints:",
      "- No code changes unless required to make the build/deploy succeed.",
      "- Do not guess secrets or values.",
      "",
      "Output:",
      "- Step-by-step deployment instructions.",
      "- A concise list of required env vars (name + where referenced).",
      "- A short validation checklist after deploy (key routes, smoke checks).",
    ].join("\n")}
    iconName="rocket"
  />
  <ExampleTask
    client:load
    id="roadmap-doc"
    shortDescription="Create a $doc with a 6-week roadmap for my app."
    prompt={[
      "Create a $doc with a 6-week roadmap for my app.",
      "",
      "Requirements:",
      "- Base the roadmap on what the repo indicates (current features, TODOs, architecture constraints).",
      "- Include milestones, weekly goals, and clear deliverables.",
      "- Call out dependencies and risks explicitly.",
      "",
      "Formatting:",
      "- Keep it scannable: headings + bullets + a simple week-by-week table.",
      "",
      "Output:",
      "- Provide the generated $doc and include the filename/path.",
    ].join("\n")}
    iconName="maps"
  />
  <ExampleTask
    client:load
    id="investor-video"
    shortDescription="Analyze my codebase and create an investor/influencer-style ad concept for it using $sora."
    prompt={[
      "Analyze my codebase and create an investor/influencer-style ad concept for it using $sora.",
      "",
      "Constraints:",
      "- Do not fabricate product claims. If the repo doesn’t support a claim, phrase it as a possibility or omit it.",
      "- Keep it punchy: one clear narrative and one clear CTA.",
      "",
      "Output:",
      "- A 20–45 second script (spoken narration + on-screen text cues).",
      "- A shot list (5–8 shots) with visuals, motion, and what’s on screen.",
      "- A short set of safe claims grounded in repo evidence (features, differentiators) + assumptions labeled.",
    ].join("\n")}
    iconName="video"
  />
  <ExampleTask
    client:load
    id="gh-fix-ci"
    shortDescription="$gh-fix-ci iterate on my PR until CI is green."
    prompt={[
      "$gh-fix-ci iterate on my PR until CI is green.",
      "",
      "Constraints:",
      "- Make the smallest set of changes required to fix failures.",
      "- Prefer targeted fixes over refactors.",
      "",
      "Output:",
      "- ≤5 bullets: Failures observed, Root cause (with evidence), Patch summary, Tests/CI rerun results, Remaining risks.",
    ].join("\n")}
    iconName="tab-search"
  />
  <ExampleTask
    client:load
    id="sentry-monitor"
    shortDescription="Monitor incoming bug reports on $sentry and attempt fixes."
    prompt={[
      "Monitor incoming bug reports on $sentry and attempt fixes.",
      "",
      "Rules:",
      "- Triage by severity and frequency.",
      "- Do not guess root cause without stack traces/log evidence.",
      "- Prefer minimal fixes and add regression tests when possible.",
      "",
      "Output:",
      "- ≤5 bullets: Top issues, Evidence (error + path), Proposed fix, Risk, Next steps.",
    ].join("\n")}
    iconName="medical"
  />
  <ExampleTask
    client:load
    id="bedtime-story-pdf"
    shortDescription="Generate a $pdf bedtime story children's book."
    prompt={[
      "Generate a $pdf bedtime story children’s book.",
      "",
      "Requirements:",
      "- Target age: ~4–7.",
      "- Warm, gentle tone; simple vocabulary; clear moral.",
      "- 10–14 short pages with one scene per page.",
      "",
      "Output:",
      "- A page-by-page layout with: Page title, 2–4 sentences of story text, and a simple illustration prompt.",
      "- Export as a single $pdf and include the filename/path.",
    ].join("\n")}
    iconName="child"
  />
  <ExampleTask
    client:load
    id="top-customers-spreadsheet"
    shortDescription="Query my database and create a $spreadsheet with my top 10 customers."
    prompt={[
      "Query my database and create a $spreadsheet with my top 10 customers.",
      "",
      "Requirements:",
      "- Define “top” using the most reliable available metric (e.g., revenue, ARR, usage), and state which one you used.",
      "- Include consistent columns (name, metric, period, segment, notes) and clear units.",
      "",
      "Constraints:",
      "- Do not guess missing values; leave blanks or mark as N/A.",
      "",
      "Output:",
      "- Generate the $spreadsheet and include the filename/path.",
      "- Add a short note explaining the ranking logic and any data caveats.",
    ].join("\n")}
    iconName="connectors"
  />
</ExampleGallery>

## Create automations

Automate recurring tasks. Codex adds findings to the inbox and archives runs with nothing to report.

<ExampleGallery>
  <ExampleTask
    client:load
    id="daily-bug-scan"
    shortDescription="Scan recent commits for likely bugs and propose minimal fixes."
    prompt={[
      "Scan recent commits (since the last run, or last 24h) for likely bugs and propose minimal fixes.",
      "",
      "Grounding rules:",
      "- Use ONLY concrete repo evidence (commit SHAs, PRs, file paths, diffs, failing tests, CI signals).",
      "- Do NOT invent bugs; if evidence is weak, say so and skip.",
      "- Prefer the smallest safe fix; avoid refactors and unrelated cleanup.",
    ].join("\n")}
    iconName="calendar"
  />
  <ExampleTask
    client:load
    id="weekly-release-notes"
    shortDescription="Draft release notes from merged PRs."
    prompt={[
      "Draft weekly release notes from merged PRs (include links when available).",
      "",
      "Scope & grounding:",
      "- Stay strictly within the repo history for the week; do not add extra sections beyond what the data supports.",
      "- Use PR numbers/titles; avoid claims about impact unless supported by PR description/tests/metrics in repo.",
    ].join("\n")}
    iconName="book"
  />
  <ExampleTask
    client:load
    id="daily-standup"
    shortDescription="Summarize yesterday’s git activity for standup."
    prompt={[
      "Summarize yesterday’s git activity for standup.",
      "",
      "Grounding rules:",
      "- Anchor statements to commits/PRs/files; do not speculate about intent or future work.",
      "- Keep it scannable and team-ready.",
    ].join("\n")}
    iconName="chat"
  />
  <ExampleTask
    client:load
    id="nightly-ci-report"
    shortDescription="Summarize CI failures and flaky tests."
    prompt={[
      "Summarize CI failures and flaky tests from the last CI window; suggest top fixes.",
      "",
      "Grounding rules:",
      "- Cite specific jobs, tests, error messages, or log snippets when available.",
      "- Avoid overconfident root-cause claims; separate “observed” vs “suspected.”",
    ].join("\n")}
    iconName="trends"
  />
  <ExampleTask
    client:load
    id="daily-classic-game"
    shortDescription="Create a small classic game with minimal scope."
    prompt={[
      "Create a small classic game with minimal scope.",
      "",
      "Constraints:",
      "- Do NOT add extra features, styling systems, content, or new dependencies unless required.",
      "- Reuse existing repo tooling and patterns.",
    ].join("\n")}
    iconName="trophy"
  />
</ExampleGallery>