---
title: Migrating to API version 2026-10-21
url: https://platform.claude.com/docs/en/api/migration-2026-10-21
description: "Upgrade a Claude API integration from API version 2023-06-01 to 2026-10-21: the SDK version to install and the code changes to make."
---

This guide lists the code changes for moving from API version `2023-06-01` to `2026-10-21`. The [upgrade steps](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#migration-checklist) say what to do, in order.

## Upgrade steps

<Steps>
  <Step title="Switch to 2026-10-21">
    If you use an SDK, your requests use the API version that was current when your SDK’s major version was released. The versions shown for your language are the first to use `2026-10-21`, so upgrade to them. If you call the API without an SDK, set the `anthropic-version` header to `2026-10-21`.

    <Tabs>
      <Tab title="CLI">
        Upgrade the `ant` CLI to version 2.0.0. The Homebrew command and the release downloads stay the same.

        Go requires the path of a module at major version 2 or later to end in that version, so the CLI’s module path is now `github.com/anthropics/anthropic-cli/v2`. If you install with `go install`, add `/v2` to the path:

        ```bash
        # Before
        go install 'github.com/anthropics/anthropic-cli/cmd/ant@latest'

        # After
        go install 'github.com/anthropics/anthropic-cli/v2/cmd/ant@latest'
        ```

        The old path keeps installing the latest v1 release, with no error or warning.
      </Tab>
    </Tabs>

    <Warning>
      On Amazon Bedrock, `2026-10-21` is available only for Claude 4.7 and later models. If you call an older model on Bedrock, listed in [Claude on Amazon Bedrock (Opus 4.6 and earlier)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), stay on the SDK version you use today, or, if you set the API version yourself, keep sending the version you send today. To move those calls to `2026-10-21`, first switch them to a Claude 4.7 or later model.
    </Warning>

    Release the upgrade together with your fixes from the next step.
  </Step>

  <Step title="Update your code for the breaking changes">
    Go through the [breaking changes](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#breaking-changes), and update your code for each one that affects you. Also make the [code changes that the new SDK or CLI version needs](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#sdk-changes).
  </Step>

  <Step title="Test against 2026-10-21">
    Test your integration against `2026-10-21` before you release.
  </Step>
</Steps>

## Breaking changes

### Messages API

These changes apply to requests to the Messages API (`POST /v1/messages`), to [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli), and to each request in a [Message Batch](https://platform.claude.com/docs/en/build-with-claude/batch-processing?sdk_languages=cli) created with `2026-10-21`.

#### Document blocks in assistant messages return an error

Affects you if you send `document` blocks directly in `assistant` messages.

In `2026-10-21`, a request that places a `document` block directly in an `assistant` message returns a 400 error. Send documents in `user` messages instead. A document nested inside another block, such as a web fetch tool result that Claude returned, is still accepted.

#### Citations in user messages return an error

Affects you if you send `citations` on `text` blocks in `user` messages, including inside `search_result` blocks.

In `2026-10-21`, a request that sends a `text` block with a non-empty `citations` array in a `user` message returns a 400 error. Remove `citations` from those blocks. Citations on `text` blocks in `assistant` messages, such as Claude’s earlier replies that you send back, are still accepted, and so is the `"citations": {"enabled": true}` setting on documents and search results.

#### Sampling parameters are removed

Affects you if you send `temperature`, `top_p`, or `top_k` in Messages requests or Message Batch requests.

In `2026-10-21`, a request that sends `temperature`, `top_p`, or `top_k` returns a 400 error, even at the parameter’s default value.

Remove the three parameters from your requests.

As of the latest major versions, the SDK and the CLI no longer have the three parameters.

Without these parameters, a request samples with their defaults, including a `temperature` of 1.0, the same as a `2023-06-01` request that leaves them out. Models that already accept only the defaults, such as Claude 4.7 and later models, sample as before. On models that accept other values, such as Claude Sonnet 4.6, a request that lowered `temperature` for more consistent output loses that effect. No other setting replaces it. If a request relies on a non-default value, either stop sending the parameter, or keep that request on `2023-06-01`.

### Admin API and Claude Enterprise Analytics API

Affects you if your code reads the Admin API or Claude Enterprise Analytics API response fields in the following tables.

In `2026-10-21`, responses from the Admin API and the [Claude Enterprise Analytics API](https://platform.claude.com/docs/en/manage-claude/analytics-api?sdk_languages=cli) no longer include the old names of renamed fields. Use the new names instead.

Admin API:

| Endpoints                                                                                                                                                                                                                                                                                            | Old name       | New name                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [RBAC groups](https://platform.claude.com/docs/en/api/beta/organization/rbac_groups/list?sdk_languages=cli): create, list, retrieve, and update                                                                                                                                                      | `roles`        | `role_ids`                                                                                                                                                        |
| [RBAC group members](https://platform.claude.com/docs/en/api/beta/organization/rbac_groups/members/list?sdk_languages=cli): list and add, and the response to [removing a member](https://platform.claude.com/docs/en/api/beta/organization/rbac_groups/members/remove?sdk_languages=cli)            | `group_id`     | `rbac_group_id`                                                                                                                                                   |
| [RBAC roles](https://platform.claude.com/docs/en/api/beta/organization/rbac_roles/list?sdk_languages=cli): list and retrieve                                                                                                                                                                         | `name`         | `display_name`                                                                                                                                                    |
| [Organization](https://platform.claude.com/docs/en/api/organization/rate_limits/list?sdk_languages=cli) and [workspace](https://platform.claude.com/docs/en/api/organization/workspaces/rate_limits/list?sdk_languages=cli) rate limits: list, and the response to setting a workspace’s rate limits | `group_type`   | `group.type`                                                                                                                                                      |
| [API keys](https://platform.claude.com/docs/en/api/organization/api_keys/list?sdk_languages=cli): list, retrieve, and update                                                                                                                                                                         | `workspace_id` | `scope` (different values; see [`workspace_id` on API keys](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#api-key-workspace-id)) |

Claude Enterprise Analytics API:

| Endpoints                                                                                                                                                                                                                                                      | Old name      | New name              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------- |
| Per-user [usage](https://platform.claude.com/docs/en/api/beta/organization/analytics/user_usage_report/list?sdk_languages=cli) and [cost](https://platform.claude.com/docs/en/api/beta/organization/analytics/user_cost_report/list?sdk_languages=cli) reports | `actor.email` | `actor.email_address` |
| [Activity summaries](https://platform.claude.com/docs/en/api/beta/organization/analytics/summaries/list?sdk_languages=cli)                                                                                                                                     | `summaries`   | `data`                |

The `group_type` query parameter on the rate-limit list endpoints and the `workspace_id` filter on the API key list endpoint are unchanged.

#### `workspace_id` on API keys

Affects you if your code reads `workspace_id` on API keys.

In `2023-06-01`, an API key’s `workspace_id` is the ID of the workspace the key is bound to, or `null` for a key bound to the Default Workspace and for a key that isn’t bound to one workspace (an all-workspaces key).

In `2026-10-21`, `workspace_id` is removed. Read `scope` instead: for a key bound to a workspace, including the Default Workspace, `scope.workspace_id` is that workspace’s real ID, and an all-workspaces key has a `scope` of `{"type": "organization"}`, with no `workspace_id`.

If your code treated a `null` `workspace_id` as the Default Workspace, compare `scope.workspace_id` with your Default Workspace’s ID instead. To find that ID, call [List Workspaces](https://platform.claude.com/docs/en/api/organization/workspaces/list?sdk_languages=cli) with `include_default=true` and take the workspace named `"Default"`.

## SDK and CLI changes

Earlier SDK and CLI versions sent `anthropic-version: 2023-06-01` with every request. The versions under [Switch to 2026-10-21](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#upgrade) send `2026-10-21`, including their Amazon Bedrock and Google Cloud clients. The changes in [Breaking changes](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#breaking-changes) apply to them too: the removed parameters and the old field names are also gone from the SDK’s types and from the CLI’s flags and output.

### `MessageParam` is a union with one type for each role

In earlier versions, `MessageParam` was one type for all roles. Each role now has a type of its own: `UserMessageParam`, `AssistantMessageParam`, and `SystemMessageParam`. `BetaMessageParam` is split the same way, into `BetaUserMessageParam`, `BetaAssistantMessageParam`, and `BetaSystemMessageParam`. The requests that the SDK sends have the same fields and values as before.

<Tabs exclude="shell">
  <Tab title="Python">
    A message written as a dict literal, such as `{"role": "user", "content": "Hello"}`, needs no change.

    In v1, `anthropic.types.MessageParam` was one `TypedDict`. In v2 it is a union of the three types, and `anthropic.types.beta.BetaMessageParam` is a union of its three. Both names still work in annotations, such as `list[MessageParam]`.

    Calling either name now raises a `TypeError`, and a type checker flags it. Write the message as a dict:

    ```python
    # Before
    message = MessageParam(role="user", content="Hello")

    # After
    message: MessageParam = {"role": "user", "content": "Hello"}
    ```

    Subclassing either name also raises a `TypeError`. Subclass the type for the role, such as `UserMessageParam`.

    The remaining changes affect type checking only. A dict whose `role` is a variable that can hold more than one role matches no type in the union, so build the dict for one role at a time:

    ```python
    # Before
    def to_message(role: Literal["user", "assistant"], text: str) -> MessageParam:
        return {"role": role, "content": text}


    # After
    def to_message(role: Literal["user", "assistant"], text: str) -> MessageParam:
        if role == "user":
            return {"role": "user", "content": text}
        return {"role": "assistant", "content": text}
    ```

    Two more apply to `BetaMessageParam` only:

    * `clear_at` and `output_config` are keys of `BetaSystemMessageParam`, so a user or assistant message can’t have them.
    * `content` is optional in `BetaSystemMessageParam`, so pyright reports `message["content"]`. Read it with `message.get("content")`, or check first that `message["role"]` is not `"system"`.
  </Tab>

  <Tab title="TypeScript">
    `MessageParam` was one interface. It is now `UserMessageParam | AssistantMessageParam | SystemMessageParam`, and `BetaMessageParam` is the same union of its three types. Only the types changed. A message literal that names its role, such as `{ role: "user", content: "Hello, Claude" }`, type-checks as it did, so most code needs no change.

    The system type differs from the other two. Its `content` is a string or text blocks, plus `tool_addition` and `tool_removal` blocks in `beta`, so an image block there no longer compiles. In `beta`, only it has `clear_at` and `output_config`, and its `content` is optional.

    Code that handles a message of any role has to check `role` before it replaces or adds content blocks, and before it reads `clear_at` or `output_config`:

    ```typescript
    // Before
    const copy: Anthropic.MessageParam = { ...message, content: blocks };

    // After
    const copy: Anthropic.MessageParam =
      message.role === "system" ? message : { ...message, content: blocks };
    ```

    The `content` of a `BetaMessageParam` can be `undefined`:

    ```typescript
    // Before
    const types =
      typeof message.content === "string" ? [] : message.content.map((block) => block.type);

    // After
    const types = Array.isArray(message.content) ? message.content.map((block) => block.type) : [];
    ```

    The type `BetaMessageParam["content"]` includes `undefined` too. For the content of a user or assistant message, use `BetaMessageContentParam`.

    An interface can’t extend a union, and a class can’t implement one. Use a type alias, or name the type of one role instead.

    ```typescript
    // Before
    interface StoredMessage extends Anthropic.MessageParam {
      id: string;
    }

    // After
    type StoredMessage = Anthropic.MessageParam & { id: string };
    ```
  </Tab>

  <Tab title="C#">
    In v12, `MessageParam` and `BetaMessageParam` were classes whose `Role` and `Content` you set. In v13 each is a union of the three classes for its roles, and the `Role` enums in `Anthropic.Models.Messages` and `Anthropic.Models.Beta.Messages` are gone.

    When you build a message, name the class for its role and delete `Role`. Each class converts to the union implicitly:

    ```csharp
    // Before
    Messages = [new() { Role = Role.User, Content = "Hello, Claude" }],

    // After
    Messages = [new UserMessageParam { Content = "Hello, Claude" }],
    ```

    `new UserMessageParam("Hello, Claude")` works too.

    The classes that hold `Content` change as well:

    * `MessageParamContent` is now `MessageContentParam`, and `BetaMessageParamContent` is now `BetaMessageContentParam`.
    * A system message has a content class of its own. A `SystemMessageParamContent` holds a string or a list of `TextBlockParam`, and a `BetaSystemMessageParamContent` holds a string or a list of `SystemMessageContentBlock`. A `List<ContentBlockParam>` or a `List<BetaContentBlockParam>` no longer converts to it.
    * `ClearAt` and `OutputConfig` are on `BetaSystemMessageParam` only.

    When you read a message, the union still has `Role` and `Content`, but you can’t set them, so a `with` expression goes on the class for the role. `Role` now holds a `MessageParamRole` or a `BetaMessageParamRole`. `BetaMessageParam.Content` can be `null`, because `Content` is optional on `BetaSystemMessageParam`.

    ```csharp
    // Before
    if (message.Role.Value() == Role.Assistant) { }

    // After
    if (message.Role.Value() == MessageParamRole.Assistant) { }
    ```

    `TryPickUser`, `TryPickAssistant`, `TryPickSystem`, `Switch`, and `Match` give you the class for the role.
  </Tab>

  <Tab title="Go">
    In v1, `MessageParam` was one struct with a `Role` and a `Content` field. In v2 it is a union: `OfUser` holds a `*UserMessageParam`, `OfAssistant` an `*AssistantMessageParam`, and `OfSystem` a `*SystemMessageParam`. `BetaMessageParam` changes in the same way. The SDK sends the same JSON as before, apart from the order of the keys in a beta system message.

    `NewUserMessage`, `NewAssistantMessage`, `NewBetaUserMessage`, and the `ToParam` methods of `Message` and `BetaMessage` work as before, so code that builds its messages with them needs no change.

    A struct literal names the type for its role. Leave `Role` out, because each type marshals its own:

    ```go
    // Before
    anthropic.MessageParam{
    	Role:    anthropic.MessageParamRoleAssistant,
    	Content: blocks,
    }

    // After
    anthropic.MessageParam{OfAssistant: &anthropic.AssistantMessageParam{
    	Content: blocks,
    }}
    ```

    Code that reads a message checks which field is set:

    ```go
    // Before
    if message.Role == anthropic.MessageParamRoleUser {
    	blocks = message.Content
    }

    // After
    if message.OfUser != nil {
    	blocks = message.OfUser.Content
    }
    ```

    * The `MessageParamRole` and `BetaMessageParamRole` types and their constants are gone. `message.GetRole()` returns a pointer to the role as a `string`, or `nil` when no field is set.
    * `ClearAt` and `OutputConfig` moved from `BetaMessageParam` to `BetaSystemMessageParam`. The names of the `BetaMessageParamClearAt` type and its constants now start with `BetaSystemMessageParamClearAt`.
    * `SystemMessageParam.Content` is a `[]TextBlockParam`. `BetaSystemMessageParam.Content` is a `[]BetaSystemMessageParamContentUnion`, which holds `text`, `tool_addition`, and `tool_removal` blocks. `NewBetaSystemMessage` takes blocks of that type, so `anthropic.NewBetaTextBlock("Be brief.")` becomes `anthropic.BetaSystemMessageParamContentUnion{OfText: &anthropic.BetaTextBlockParam{Text: "Be brief."}}`.
    * A copy of a `MessageParam` points to the same message as the original. Setting `duplicate.OfUser.Content` changes both, where setting `duplicate.Content` in v1 changed only the copy.
    * `mcp.ToMessage` returns an `*mcp.UnsupportedValueError` for a role other than `user` or `assistant`. v1 copied any role into the message.
  </Tab>

  <Tab title="Java">
    In v2, `MessageParam` was a single class with a `role` and a `content`. In v3 it is a union of the three classes, and `MessageParam.Content` is now the top-level `MessageContentParam`. `BetaMessageParam` changes the same way, and its classes have the same names with a `Beta` prefix. The JSON that the SDK sends is the same, except that a beta system message now has `role` before `content`.

    `addUserMessage`, `addAssistantMessage`, and `addSystemMessage` with a `String`, `addMessage` with a `Message` or a `MessageParam`, and `Message.toParam()` don’t change.

    `MessageParam.builder()` and `toBuilder()` are gone. Call the factory method for the role, which is `ofUser`, `ofAssistant`, or `ofSystem`:

    ```java
    // Before
    MessageParam message = MessageParam.builder()
        .role(MessageParam.Role.USER)
        .content("Hello, Claude")
        .build();

    // After
    MessageParam message = MessageParam.ofUser("Hello, Claude");
    ```

    The methods that take a list of content blocks have new names on the builders of `MessageCreateParams`, `StructuredMessageCreateParams`, `MessageCountTokensParams`, and `BatchCreateParams.Request.Params`:

    | v2                                 | v2 beta                                       | v3                                        |
    | ---------------------------------- | --------------------------------------------- | ----------------------------------------- |
    | `addUserMessageOfBlockParams`      | `addUserMessageOfBetaContentBlockParams`      | `addUserMessageOfContentBlockParams`      |
    | `addAssistantMessageOfBlockParams` | `addAssistantMessageOfBetaContentBlockParams` | `addAssistantMessageOfContentBlockParams` |
    | `addSystemMessageOfBlockParams`    | `addSystemMessageOfBetaContentBlockParams`    | `addSystemMessageOfBlocks`                |

    On the content class, `BlockParams` (`BetaContentBlockParams` in beta) becomes `ContentBlockParams` in `ofBlockParams`, `blockParams()`, `isBlockParams()`, `asBlockParams()`, and the visitor’s `visitBlockParams`.

    A system message has its own content class, `SystemMessageParam.Content`, which `addSystemMessage` now takes. Its blocks are `TextBlockParam`, not `ContentBlockParam`. In beta they are `BetaSystemMessageParam.Content.SystemMessageContentBlock`, which has `ofText`, `ofToolAddition`, and `ofToolRemoval`.

    ```java
    // Before
    builder.addSystemMessageOfBlockParams(List.of(ContentBlockParam.ofText(textBlock)));

    // After
    builder.addSystemMessageOfBlocks(List.of(textBlock));
    ```

    When you read a message, `role()` doesn’t change. `content()` returns a `MessageContentParam`, or an `Optional<BetaMessageContentParam>` in beta, where a system message can have no content. `_role()`, `_content()`, and `_additionalProperties()` are now on the class for the role, which `asUser()`, `asAssistant()`, or `asSystem()` returns.
  </Tab>

  <Tab title="PHP">
    The classes are in `Anthropic\Messages`, and the beta classes in `Anthropic\Beta\Messages`. Messages you write as arrays don’t change, and still need their `'role'`.

    `MessageParam::with()` and `BetaMessageParam::with()` remain, and return the class that goes with `role`. A call with named arguments needs no change. `role` is now the first parameter, so in a positional call swap `content` and `role`, or call `with()` on the role’s class, which takes no `role`. For arguments in the old order PHP throws `UnhandledMatchError`, which PHPStan does not warn about, or a `TypeError` if `content` is a list or `role` is an enum case.

    ```php
    // Before
    MessageParam::with('Hello, Claude', 'user');

    // After
    UserMessageParam::with('Hello, Claude');
    ```

    No object is a `MessageParam` any more: `instanceof MessageParam` is false, and PHP throws a `TypeError` where a parameter or return type names it. Name the three classes instead:

    ```php
    // Before
    function send(MessageParam $message): void {}

    // After
    function send(UserMessageParam|AssistantMessageParam|SystemMessageParam $message): void {}
    ```

    * `MessageParam::fromArray()` and `(new MessageParam())->withContent()` throw “Call to undefined method”. Call them on the role’s class, which sets `role` itself.
    * `withRole()` takes only the string now: PHP throws a `TypeError` for a `Role` case. To give a message another role, build that role’s class.
    * `clearAt` and `outputConfig` exist only on `BetaSystemMessageParam`, and `BetaMessageParam::with()` drops them for the other two roles. The `BetaMessageParam\ClearAt` enum is now `BetaSystemMessageParam\ClearAt`.
    * `MessageParam\Content` is now `MessageContentParam`, and `BetaMessageParam\Content` is now `BetaMessageContentParam`. Their PHPStan types take the new name too: `ContentShape` is now `MessageContentParamShape`.
    * An array whose `'role'` is a `Role` case still works, but PHPStan now reports it. Write the string.
  </Tab>

  <Tab title="Ruby">
    Messages you write as hashes don’t change.

    In v2, `Anthropic::MessageParam` is a union of `Anthropic::UserMessageParam`, `Anthropic::AssistantMessageParam`, and `Anthropic::SystemMessageParam`. In the same way, `Anthropic::Beta::BetaMessageParam` is a union of its three classes.

    `Anthropic::MessageParam.new(role: :user, content: "Hello, Claude")` still works, and returns an instance of the class for that role. You can also build that class yourself, with no `role:`, as `Anthropic::UserMessageParam.new(content: "Hello, Claude")`. Four things change for code that builds or inspects these instances:

    * `MessageParam.new` takes keywords only, so pass a hash as `MessageParam.new(**hash)`. It raises an `ArgumentError` when `role:` is missing or isn’t one of the three roles.
    * `message.is_a?(Anthropic::MessageParam)` is `false`. A `when Anthropic::MessageParam` branch and `messages.grep(Anthropic::MessageParam)` still match.
    * An instance built with `.new` has no `:role` in its `to_h`, and `message[:role]` is `nil`. `message.role` still returns the role.
    * Only `BetaSystemMessageParam` has `clear_at` and `output_config`. On a user or assistant message they returned `nil`, and now raise a `NoMethodError`.

    ```ruby
    # Before
    typed = messages.select { _1.is_a?(Anthropic::MessageParam) }
    roles = typed.map { _1[:role] }

    # After
    typed = messages.grep(Anthropic::MessageParam)
    roles = typed.map(&:role)
    ```

    The `Role` enum modules stay. These constants moved. The names that start with `Beta` are under `Anthropic::Beta`, and the others are under `Anthropic`:

    | Removed                     | Use instead                                                                          |
    | --------------------------- | ------------------------------------------------------------------------------------ |
    | `MessageParam::Content`     | `MessageContentParam`, or `SystemMessageParam::Content` for a system message         |
    | `BetaMessageParam::Content` | `BetaMessageContentParam`, or `BetaSystemMessageParam::Content` for a system message |
    | `BetaMessageParam::ClearAt` | `BetaSystemMessageParam::ClearAt`                                                    |

    If you type-check with Sorbet, `MessageParam::OrHash` is gone, and `Anthropic::MessageParam` as a type no longer accepts an instance. Use `Anthropic::MessageParam::Variants` for the three classes, each of which has its own `OrHash`. In RBS, a value typed `Anthropic::MessageParam` has no `role` or `content`. Use the `Anthropic::Models::message_param` alias, which was the hash form of a message and is now the union of the three classes. The beta names are `BetaMessageParam::Variants` and `Anthropic::Models::Beta::beta_message_param`.
  </Tab>
</Tabs>

### One-value enums are constants

This affects the C#, Go, Java, PHP, and Ruby SDKs and one CLI flag. In earlier versions, a required field that can hold only one value had an enum type of its own with a single member. These fields are now constants, and the enum types are gone. The JSON that the SDK sends and reads is the same.

<Tabs exclude="shell:cURL, python, typescript">
  <Tab title="CLI">
    `--type` is optional on `ant beta:sessions:resources add`. `file` is the only value `--type` can take there, so v2 sends it for you. Commands that still pass `--type file` keep working, so there is nothing to change.
  </Tab>
</Tabs>

### Client-side compaction is removed from the tool runner

This affects the TypeScript and Ruby SDKs. Client-side compaction in the tool runner is removed in favor of server-side compaction, which summarizes the conversation inside the API instead of with an extra request from the client.

<Tabs exclude="shell, python, csharp, go, java, php">
  <Tab title="TypeScript">
    The `compactionControl` option and the `@anthropic-ai/sdk/lib/tools/CompactionControl` module are gone. The option stopped working in v0.129.0, where passing it threw an `AnthropicError`. It isn’t in the tool runner’s parameters type, so TypeScript reports it as an unknown property.

    To keep compacting automatically at a token threshold:

    ```typescript
    // Before
    const runner = client.beta.messages.toolRunner({
      // ...
      compactionControl: { enabled: true, contextTokenThreshold: 100_000 }
    });

    // After
    const runner = client.beta.messages.toolRunner({
      // ...
      betas: ["compact-2026-01-12"],
      context_management: {
        edits: [{ type: "compact_20260112", trigger: { type: "input_tokens", value: 100_000 } }]
      }
    });
    ```

    To decide yourself when the conversation is compacted, call [`runner.compactBeforeNextTurn()`](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#compaction).
  </Tab>

  <Tab title="Ruby">
    The `compaction_control:` option is gone. It stopped working in v1.74.0, where passing it raised an `ArgumentError`.

    To keep compacting automatically at a token threshold:

    ```ruby
    # Before
    runner = client.beta.messages.tool_runner(
      # ...
      compaction_control: {enabled: true, context_token_threshold: 100_000}
    )

    # After
    runner = client.beta.messages.tool_runner(
      # ...
      betas: ["compact-2026-01-12"],
      context_management: {
        edits: [{type: :compact_20260112, trigger: {type: :input_tokens, value: 100_000}}]
      }
    )
    ```

    To decide yourself when the conversation is compacted, call [`#compact_before_next_turn`](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#compact_before_next_turn---compact-the-conversation) on the runner.
  </Tab>
</Tabs>

The trigger threshold must be at least 50,000 tokens. See [compaction](https://platform.claude.com/docs/en/build-with-claude/compaction-threshold?sdk_languages=cli) for the other options (`pause_after_compaction`, custom `instructions`).

### Text Completions is removed

The legacy Text Completions API is removed from the TypeScript, Go, Java, and Ruby SDKs and from the CLI. Newer models and features don’t support it. Use the [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli) instead.

### `betas` is removed from the non-beta Models methods

The non-beta Models methods no longer take `betas`, and the `ant models` commands no longer take `--beta`. To send beta headers, call the same methods on `client.beta.models`, or `ant beta:models` in the CLI. In the SDK, those methods return `BetaModelInfo` where the non-beta ones return `ModelInfo`.

<Tabs exclude="shell:cURL">
  <Tab title="CLI">
    ```bash
    # Before
    ant models list --beta "$BETA"

    # After
    ant beta:models list --beta "$BETA"
    ```
  </Tab>
</Tabs>

### API keys are sent as `Authorization: Bearer`

The SDK and the CLI send your API key as `Authorization: Bearer <key>` instead of in the `X-Api-Key` header, so change any proxy or gateway that reads or sets `X-Api-Key` to use `Authorization`, or [send the key in `X-Api-Key` yourself](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#sdk-proxy-x-api-key). Also change code in your own program that reads `X-Api-Key`, such as middleware, a log filter, or a test stub. The Claude API accepts a key in either header.

```text wrap
# Before
X-Api-Key: <key>

# After
Authorization: Bearer <key>
```

<Tabs>
  <Tab title="CLI">
    This applies to a key in `ANTHROPIC_API_KEY` and to one piped to `--api-key-stdin`.

    With `--debug`, the request log now shows `Authorization: Bearer <REDACTED>` where it showed `X-Api-Key: <REDACTED>`.
  </Tab>
</Tabs>

#### If a proxy or gateway reads `X-Api-Key`

<Tabs exclude="shell:cURL">
  <Tab title="CLI">
    If `--base-url` or `ANTHROPIC_BASE_URL` points `ant` at a proxy or gateway that reads `X-Api-Key`, change it to read the key from `Authorization`. `ant` has no flag or environment variable for adding a header of your own, so it can’t send `X-Api-Key`.
  </Tab>
</Tabs>

#### If you set or removed `X-Api-Key` on a request

This affects the Python, TypeScript, Go, PHP, and Ruby SDKs.

If you removed `X-Api-Key` so that a request sent only an authentication token, delete that code instead of changing it, because removing `Authorization` would remove the token. [A client holds one credential](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#sdk-one-credential), so make sure that it’s the token: with none passed in code and both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` set, the client uses the key.

<Tabs exclude="shell, csharp, java">
  <Tab title="Python">
    Code that passes `extra_headers={"X-Api-Key": omit}` to keep the key off a request no longer does that. Pass `extra_headers={"Authorization": omit}` instead.

    `extra_headers={"X-Api-Key": other_key}` no longer replaces the client’s key: both keys go out. To send another key with one request, pass `extra_headers={"Authorization": f"Bearer {other_key}"}`.
  </Tab>

  <Tab title="TypeScript">
    `headers: { "X-Api-Key": otherKey }` in a request’s options no longer replaces the client’s key: both keys go out. To send another key with one request, pass ``headers: { Authorization: `Bearer $\{otherKey}` }``.
  </Tab>

  <Tab title="Go">
    `option.WithHeaderDel("X-Api-Key")` no longer keeps the key off a request. Delete `Authorization` instead:

    ```go
    // Before
    client.Messages.New(ctx, params, option.WithHeaderDel("X-Api-Key"))

    // After
    client.Messages.New(ctx, params, option.WithHeaderDel("Authorization"))
    ```

    `option.WithHeader("X-Api-Key", otherKey)` no longer replaces the client’s key: both keys go out. To send another key with one request, pass `option.WithAPIKey(otherKey)`.
  </Tab>

  <Tab title="PHP">
    `'extraHeaders' => ['X-Api-Key' => null]` no longer keeps the key off a request. To send a request with no credential, set `Authorization` to `null` instead, or remove it in a middleware if you did this for the whole client.

    `'extraHeaders' => ['X-Api-Key' => $otherKey]` no longer replaces the client’s key: both keys go out. To send another key with one request, set `Authorization` to `"Bearer {$otherKey}"`.
  </Tab>

  <Tab title="Ruby">
    `extra_headers: {"x-api-key" => nil}` no longer keeps the key off a request. Set `"authorization"` to `nil` instead. To send another key with one request, set `"authorization"` to `"Bearer #{other_key}"`, not `"x-api-key"`.
  </Tab>
</Tabs>

### A client holds one credential

An API key and an authentication token now share a header, so an SDK client holds one credential. With none passed in code, it follows the [credential precedence](https://platform.claude.com/docs/en/manage-claude/wif-reference?sdk_languages=cli#credential-precedence) order.

<Tabs exclude="shell">
  <Tab title="Python">
    v1 sent both an API key and an authentication token when the client had both, each in its own header. The credential is one of `api_key`, `auth_token`, `credentials`, `config`, or `profile`.

    * **Pass at most one.** Two or more in the constructor, or in one `copy()` or `with_options()` call, raise `ValueError`. `None` doesn’t count. v1 raised `TypeError`, and only for two of `credentials`, `config`, and `profile`.
    * **The one you pass is the only one.** As in v1, the client does not look for another in the environment or on disk.
    * **With none passed, only the first of these that is set is used:** `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, the profile that `ANTHROPIC_PROFILE` names, the workload identity federation variables, the active profile on disk (the one the `active_config` file names, otherwise `default`). When both of the first two are set, the client logs a warning once. v1 used the active profile ahead of the federation variables when `ANTHROPIC_CONFIG_DIR` was set or an `active_config` file existed; set `ANTHROPIC_PROFILE` to keep using it.
    * **`copy()` and `with_options()` replace.** A credential you pass replaces the client’s own, whichever kind either one is. A base URL and headers that came from the old credential’s config or profile go with it, and the new credential’s are used. A base URL you passed stays.

    ```python
    client = Anthropic(api_key=key, auth_token=token)

    # Before: sent `X-Api-Key: <key>` and `Authorization: Bearer <token>`
    # After:  raises `ValueError`
    ```

    The platform clients keep their own rules. `AnthropicAWS` takes `auth_token` next to `api_key` without an error, and sends the key.

    The docstrings of `Anthropic.__init__` and `Anthropic.copy` in [`_client.py`](https://github.com/anthropics/anthropic-sdk-python/blob/main/src/anthropic/_client.py) have the details.

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, pass the token as `auth_token` and set `X-Api-Key` in `default_headers`. Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.
  </Tab>

  <Tab title="TypeScript">
    In v0 a client that had both an API key and an authentication token sent both, each in its own header. The credential is one of `apiKey`, `authToken`, `credentials`, `config`, or `profile`.

    * **Pass at most one.** Two or more in `new Anthropic()`, or in one `withOptions()` call, throw a `TypeError`. `null` and `undefined` don’t count.
    * **The one you pass is the only one.** The client does not look for another in the environment or on disk.
    * **With none passed, the first of these is used:** `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, the profile that `ANTHROPIC_PROFILE` names, the workload identity federation variables, the active profile on disk (the one the `active_config` file names, otherwise `default`). When both of the first two are set, the client logs a warning once. In v0 the active profile came before the federation variables. An `ANTHROPIC_PROFILE` that names a missing profile was skipped in v0, and now the first request throws an `AnthropicError`. `loadConfig()` with no argument follows the same order and throws the same error.
    * **`withOptions` replaces.** A credential you pass replaces the one of the client you copy, so `client.withOptions({ authToken })` no longer needs `apiKey: null` next to it.
    * **A platform client takes only its platform’s credentials.** The AWS, Bedrock, and Foundry clients and `AnthropicVertex` throw an `AnthropicError` for a credential option they don’t authenticate with, as `AnthropicGoogleCloud` already did. On the AWS and Bedrock clients `apiKey: null` now clears the key, so the client signs with AWS credentials. `AnthropicBedrock` keeps its key in `client.apiKey`, where v0 kept it in `client.authToken`.

    ```typescript
    // Before: sent the API key and ignored `credentials`
    const client = new Anthropic({ apiKey, credentials });

    // After: the previous line throws a TypeError
    const client = new Anthropic({ credentials });
    ```

    The doc comments on `ClientOptions` in [`client.ts`](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/src/client.ts) say how each option behaves, and the doc comment on each of those platform clients’ constructors lists the options it rejects.

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, set `X-Api-Key` in `defaultHeaders` and keep `authToken`. Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.
  </Tab>

  <Tab title="C#">
    In v12 a client that had both an API key and an authentication token sent both, each in its own header. The credential is one of `ApiKey`, `AuthToken`, or `ClientOptions.Credentials`.

    * **Passing two is an error.** Setting a second one throws an `ArgumentException`. `null` doesn’t count, so to swap the credential in `ClientOptions` that you built yourself, set the old one to `null` first.
    * **Passing one uses it and ignores the environment.** No credential environment variable or profile on disk is read. In the same way, `AnthropicCredentials.Resolve(profile: "name")` now returns that profile’s credentials when `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` is set.
    * **Passing none uses the first match in the environment:** `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_PROFILE`, the workload identity federation variables, then the active profile on disk. An empty `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` counts as unset. When both of the first two are set, a warning goes to stderr once. The client looks when it is first used, so an `ANTHROPIC_PROFILE` that doesn’t exist now throws from the first request instead of the constructor.
    * **`WithOptions` replaces.** A credential you pass in the modifier replaces the client’s, whichever kind that was, so `AuthToken = token` no longer needs `ApiKey = null` next to it. With none passed, the copy keeps the client’s credential, `BaseUrl`, and `ExtraHeaders`, even when the modifier returns new `ClientOptions`.

    ```csharp
    // Before: sent both, each in its own header
    AnthropicClient client = new() { ApiKey = apiKey, AuthToken = token };

    // After: the previous line throws an ArgumentException
    AnthropicClient client = new() { AuthToken = token };
    ```

    The XML docs on those three properties of [`ClientOptions`](https://github.com/anthropics/anthropic-sdk-csharp/blob/main/src/Anthropic/Core/ClientOptions.cs) have the details.

    Cloud platform clients keep the credentials they were built with. The Bedrock, Bedrock Mantle, Foundry, Google Cloud, and AWS clients and `AnthropicVertexClient` determine how to authenticate when you build them, and most of them use the `Authorization` header for it. The releases of these packages that depend on v13 ignore an `ApiKey` or `AuthToken` that you set through `WithOptions`. To use another key with `AnthropicAwsClient`, build a new client with `ApiKey` in `AwsClientOptions`.

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, set `X-Api-Key` with `ExtraHeaders` and keep `AuthToken`. Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.
  </Tab>

  <Tab title="Go">
    In v1 a client that had both an API key and an authentication token sent both, each in its own header. The credential comes from `option.WithAPIKey`, `option.WithAuthToken`, `option.WithConfig`, `option.WithProfile`, or `option.WithFederationTokenProvider`.

    * **Two of them passed to `anthropic.NewClient` are an error.** `NewClient` returns no error, so every request the client makes fails with it. `NewClient` already applies `anthropic.DefaultClientOptions()`, so don’t pass its result as well: the credential it finds in the environment then counts as one you passed.
    * **One of them is used as it is.** No credential is read from the environment or from a profile on disk. In v1 `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` won over the last three.
    * **With none of them, the first of these that is set is used,** in the same order as v1: `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_PROFILE`, the workload identity federation variables, the active profile on disk. When both of the first two are set, the SDK logs a warning once.
    * **One of them on a request replaces the client’s credential for that request,** so `option.WithAuthToken` no longer needs `option.WithHeaderDel("X-Api-Key")` next to it.

    ```go
    // Before: the API key was sent and a warning was logged
    client := anthropic.NewClient(
    	option.WithAPIKey(apiKey),
    	option.WithProfile("work"),
    )

    // After: every request the previous client makes fails, so pass the one you want
    client := anthropic.NewClient(option.WithAPIKey(apiKey))
    ```

    The warning that v1 logged is gone, so `option.WithConfigQuiet`, which suppressed it, now does what `option.WithConfig` does and is deprecated.

    The doc comments on `anthropic.NewClient` and `anthropic.DefaultClientOptions` in [`client.go`](https://github.com/anthropics/anthropic-sdk-go/blob/main/client.go) have the details.

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, set `X-Api-Key` with `option.WithHeader` and keep `option.WithAuthToken`. Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.

    `ANTHROPIC_CUSTOM_HEADERS` and `ANTHROPIC_WEBHOOK_SIGNING_KEY` now apply to every client that `anthropic.NewClient` builds. In v1 they were read only when neither the environment nor a profile on disk held a credential.
  </Tab>

  <Tab title="Java">
    In v2 a client that had both an API key and an authentication token sent both, each in its own header. The credential is one of `apiKey`, `authToken`, or `configurationProvider` on the `AnthropicOkHttpClient`, `AnthropicOkHttpClientAsync`, and `AnthropicBackend` builders.

    * **Set at most one.** With two on one builder, `build()` throws an `IllegalStateException` that names them. `null` or an empty `Optional` does not count.
    * **The one you set is the only one.** `fromEnv()`, called before or after, takes no credential from the environment or from a profile on disk. In v2, a key or token that `fromEnv()` found could be sent as well, or instead.
    * **With none set, `fromEnv()` uses the first of these that it finds:** `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_PROFILE`, the workload identity federation variables, the active profile on disk. When both of the first two are set, a warning goes to `System.err` once. The `anthropic.apiKey` and `anthropic.authToken` system properties count as the environment. An empty key or token, in a variable or a system property, counts as unset. In v2, `fromEnv()` used the empty value as the key or token.

    ```java
    // Before: both were sent. In v3, build() throws an IllegalStateException
    AnthropicClient client = AnthropicOkHttpClient.builder()
        .apiKey(apiKey)
        .authToken(authToken)
        .build();

    // After
    AnthropicClient client = AnthropicOkHttpClient.builder()
        .apiKey(apiKey)
        .build();
    ```

    The documentation of `fromEnv()` on those builders has the details.

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, set both headers yourself:

    ```java
    AnthropicClient client = AnthropicOkHttpClient.builder()
        .putHeader("Authorization", "Bearer " + gatewayToken)
        .putHeader("X-Api-Key", apiKey)
        .build();
    ```

    Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.
  </Tab>

  <Tab title="PHP">
    Earlier versions sent both an API key and an authentication token when the client had both, each in its own header. `Anthropic\Client` takes one credential, from `apiKey`, `authToken`, or `credentials`:

    * Passing more than one of them throws `\InvalidArgumentException`. Only `null` counts as not passed. An empty string counts as passed, so `new Client(apiKey: '')` sends no credential.
    * Passing one uses it, and no credential is read from the environment or from a profile on disk. With `ANTHROPIC_API_KEY` set, `new Client(authToken: $token)` sends the token. Earlier versions sent the environment’s key with it.
    * Passing none uses the first of these that is set: `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, the profile named by `ANTHROPIC_PROFILE`, the workload identity federation variables, the active profile on disk (the one the `active_config` file names, otherwise `default`). Earlier versions used the active profile before the federation variables, and used no profile when there was no `active_config` file. They also skipped an `ANTHROPIC_PROFILE` that named a missing or invalid profile. For that, `new Client()` now throws `Anthropic\Core\Exceptions\AnthropicException`. With both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` set, the client sends the key and its `authToken` property is empty. The first client built that way also writes a warning with `error_log()`, once for each process, which on a web server means once for each request: `Anthropic: ANTHROPIC_API_KEY and ANTHROPIC_AUTH_TOKEN are both set. Using ANTHROPIC_API_KEY.` To stop it, unset the variable you don’t use.

    ```php
    // Before: sent the key as X-Api-Key and the token as Authorization.
    // After: throws "Pass at most one of `apiKey`, `authToken`, or `credentials`. Received `apiKey`, `authToken`."
    $client = new Client(apiKey: $key, authToken: $token);
    ```

    If you relied on sending both, for example a token for a gateway and a key for the API behind it, pass the token as `authToken` and add `X-Api-Key` in a middleware like the one under [If a proxy or gateway reads `X-Api-Key`](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#sdk-proxy-x-api-key), without the `withoutHeader` call. Have the gateway remove its `Authorization` header before it forwards the request. The Claude API expects one credential for each request.
  </Tab>

  <Tab title="Ruby">
    The credential arguments of `Anthropic::Client.new` are `api_key:`, `auth_token:`, `credentials:`, and `config:`. A `nil` argument counts as not passed. The platform clients keep their own rules.

    * **Two or more passed:** `Anthropic::Client.new` raises `ArgumentError`. Earlier versions raised only for `credentials:` with `config:`, and otherwise sent the key if there was one, then the token.
    * **One passed:** The client uses it, and does not fall back to a credential from the environment or from a profile on disk.
    * **None passed:** The client uses the first of these it finds: `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_PROFILE`, the workload identity federation variables, the active profile on disk. The order has not changed, but with both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` set, `client.auth_token` is now `nil`. An empty `ANTHROPIC_API_KEY` or `ANTHROPIC_AUTH_TOKEN` now counts as unset, where earlier versions let an empty `ANTHROPIC_API_KEY` hide the token and everything after it.

    When no credential is passed and both `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN` are set, the SDK also warns once for each process, on standard error through `Kernel#warn`: `Anthropic: ANTHROPIC_API_KEY and ANTHROPIC_AUTH_TOKEN are both set. Using ANTHROPIC_API_KEY.` Unset the variable you don’t use to silence it.

    ```ruby
    # Before: sent the key and ignored the token.
    # After: ArgumentError, "Pass at most one of `api_key:`, `auth_token:`, `credentials:`, or `config:`. Received `api_key:`, `auth_token:`."
    Anthropic::Client.new(api_key: api_key, auth_token: auth_token)

    # Pass the one you want sent.
    Anthropic::Client.new(api_key: api_key)
    ```
  </Tab>
</Tabs>

### Changes in one SDK or the CLI

These changes each affect one SDK or the CLI.

<Tabs exclude="shell:cURL, python, typescript">
  <Tab title="CLI">
    **`--api-key` and `--auth-token` are removed.** `ant` no longer takes an API key or authentication token as a flag value, because a value on the command line is visible in shell history and process listings. Both flags have printed a deprecation warning since v1.27.0. A command that still passes one stops with `flag provided but not defined`.

    | Removed                | Use instead                                                 |
    | ---------------------- | ----------------------------------------------------------- |
    | `--api-key <key>`      | `ANTHROPIC_API_KEY`, `--api-key-stdin`, or `ant auth login` |
    | `--auth-token <token>` | `ANTHROPIC_AUTH_TOKEN` or `--auth-token-stdin`              |

    ```bash
    # Before
    ant --api-key "$KEY" models list

    # After, from the environment
    export ANTHROPIC_API_KEY="$KEY"
    ant models list

    # After, from a secret manager
    op read op://vault/anthropic/api-key | ant --api-key-stdin models list
    ```

    `--api-key-stdin` and `--auth-token-stdin` read all of standard input, so a command that uses one takes its request body from flags.

    `ant auth status`, the first-run prompt of `ant apply`, and the note about multiple authentication sources now call these credentials `ANTHROPIC_API_KEY` and `ANTHROPIC_AUTH_TOKEN`, where they printed `--api-key / ANTHROPIC_API_KEY` and `--auth-token / ANTHROPIC_AUTH_TOKEN`.
  </Tab>
</Tabs>

### The license is Apache 2.0

Starting with the versions under [Switch to 2026-10-21](https://platform.claude.com/docs/en/api/migration-2026-10-21?sdk_languages=cli#upgrade), the SDK and the CLI are licensed under the Apache License, Version 2.0. Earlier versions remain under the MIT License. No code changes are needed. If you track the licenses of your dependencies, update their entries.

* **TypeScript:** The platform packages (`@anthropic-ai/bedrock-sdk`, `@anthropic-ai/vertex-sdk`, `@anthropic-ai/foundry-sdk`, `@anthropic-ai/aws-sdk`, and `@anthropic-ai/google-cloud-sdk`) change license in their own 1.0.0 releases.
* **C#:** The other packages (`Anthropic.Bedrock`, `Anthropic.Vertex`, `Anthropic.Foundry`, `Anthropic.Aws`, `Anthropic.GoogleCloud`, and `Anthropic.Mcp`) change license in their own 1.0.0 releases.
* **Java:** The change covers every `com.anthropic` artifact.
