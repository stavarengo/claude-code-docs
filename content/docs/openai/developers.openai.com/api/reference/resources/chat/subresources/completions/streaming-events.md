# Chat Completions streaming events

Stream Chat Completions in real time. Receive chunks of completions
returned from the model using server-sent events.
[Learn more](https://platform.openai.com/docs/guides/streaming-responses?api-mode=chat).

## chat.completion.chunk

Represents a streamed chunk of a chat completion response returned
by the model, based on the provided input.
[Learn more](https://platform.openai.com/docs/guides/streaming-responses).

### Schema

Schema name: `CreateChatCompletionStreamResponse`

```json
{
  "(resource) chat.completions > (model) chat_completion_chunk > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse",
    "ident": "ChatCompletionChunk",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "choices"
        },
        {
          "ident": "created"
        },
        {
          "ident": "model"
        },
        {
          "ident": "object"
        },
        {
          "ident": "moderation"
        },
        {
          "ident": "service_tier"
        },
        {
          "ident": "system_fingerprint"
        },
        {
          "ident": "usage"
        }
      ]
    },
    "docstring": "Represents a streamed chunk of a chat completion response returned\nby the model, based on the provided input. \n[Learn more](https://platform.openai.com/docs/guides/streaming-responses).\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) id",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) created",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) system_fingerprint",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) usage"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "A unique identifier for the chat completion. Each chunk has the same ID.",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of chat completion choices. Can contain more than one elements if `n` is greater than 1. Can also be empty for the\nlast chunk if you set `stream_options: {\"include_usage\": true}`.\n",
    "key": "choices",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "delta"
          },
          {
            "ident": "finish_reason"
          },
          {
            "ident": "index"
          },
          {
            "ident": "logprobs"
          }
        ]
      },
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) index",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) created": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the chat completion was created. Each chunk has the same timestamp.",
    "key": "created",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/created",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The model to generate the completion.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which is always `chat.completion.chunk`.",
    "key": "object",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "chat.completion.chunk"
        }
      ],
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/object"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation": {
    "kind": "HttpDeclProperty",
    "docstring": "Moderation results for the request input and generated output. Present\non the moderation chunk when moderated completions are requested.\n",
    "key": "moderation",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "input"
        },
        {
          "ident": "output"
        }
      ]
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/moderation",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier": {
    "kind": "HttpDeclProperty",
    "docstring": "Specifies the processing type used for serving the request.\n  - If set to 'auto', then the request will be processed with the service tier configured in the Project settings. Unless otherwise configured, the Project will use 'default'.\n  - If set to 'default', then the request will be processed with the standard pricing and performance for the selected model.\n  - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or '[priority](https://openai.com/api-priority-processing/)', then the request will be processed with the corresponding service tier.\n  - When not set, the default behavior is 'auto'.\n\n  When the `service_tier` parameter is set, the response body will include the `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.\n",
    "key": "service_tier",
    "optional": true,
    "nullable": true,
    "default": "auto",
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "default"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "flex"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "scale"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "priority"
        }
      ],
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/service_tier"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/service_tier",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 4"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) system_fingerprint": {
    "kind": "HttpDeclProperty",
    "docstring": "This fingerprint represents the backend configuration that the model runs with.\nCan be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism.\n",
    "key": "system_fingerprint",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/system_fingerprint",
    "deprecated": true,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) usage": {
    "kind": "HttpDeclProperty",
    "docstring": "An optional field that will only be present when you set\n`stream_options: {\"include_usage\": true}` in your request. When present, it\ncontains a null value **except for the last chunk** which contains the\ntoken usage statistics for the entire request.\n\n**NOTE:** If the stream is interrupted or cancelled, you may not\nreceive the final usage chunk which contains the total token usage for\nthe request.\n",
    "key": "usage",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "CompletionUsage",
      "$ref": "(resource) completions > (model) completion_usage > (schema)"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/usage",
    "deprecated": false,
    "schemaType": "object",
    "modelImplicit": false,
    "modelPath": "(resource) completions > (model) completion_usage",
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta": {
    "kind": "HttpDeclProperty",
    "docstring": "A chat completion delta generated by streamed model responses.",
    "key": "delta",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "content"
        },
        {
          "ident": "function_call"
        },
        {
          "ident": "refusal"
        },
        {
          "ident": "role"
        },
        {
          "ident": "tool_calls"
        }
      ]
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/delta",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) content",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) refusal",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason": {
    "kind": "HttpDeclProperty",
    "docstring": "The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence,\n`length` if the maximum number of tokens specified in the request was reached,\n`content_filter` if content was omitted due to a flag from our content filters,\n`tool_calls` if the model called a tool, or `function_call` (deprecated) if the model called a function.\n",
    "key": "finish_reason",
    "optional": false,
    "nullable": true,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "stop"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "length"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "tool_calls"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "content_filter"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "function_call"
        }
      ],
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/finish_reason"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/finish_reason",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 4"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) index": {
    "kind": "HttpDeclProperty",
    "docstring": "The index of the choice in the list of choices.",
    "key": "index",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/index",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs": {
    "kind": "HttpDeclProperty",
    "docstring": "Log probability information for the choice.",
    "key": "logprobs",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "content"
        },
        {
          "ident": "refusal"
        }
      ]
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) content",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) refusal"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "chat.completion.chunk"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input": {
    "kind": "HttpDeclProperty",
    "docstring": "Moderation for the request input.",
    "key": "input",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "model"
            },
            {
              "ident": "results"
            },
            {
              "ident": "type"
            }
          ]
        },
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "code"
            },
            {
              "ident": "message"
            },
            {
              "ident": "type"
            }
          ]
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input"
    },
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input",
    "deprecated": false,
    "schemaType": "union",
    "childrenParentSchema": "union",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output": {
    "kind": "HttpDeclProperty",
    "docstring": "Moderation for the generated output.",
    "key": "output",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "model"
            },
            {
              "ident": "results"
            },
            {
              "ident": "type"
            }
          ]
        },
        {
          "kind": "HttpTypeObject",
          "members": [
            {
              "ident": "code"
            },
            {
              "ident": "message"
            },
            {
              "ident": "type"
            }
          ]
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output"
    },
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output",
    "deprecated": false,
    "schemaType": "union",
    "childrenParentSchema": "union",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "default"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "flex"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "scale"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) service_tier > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "priority"
    }
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Number of tokens in the generated completion.",
    "key": "completion_tokens",
    "optional": false,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Number of tokens in the prompt.",
    "key": "prompt_tokens",
    "optional": false,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Total number of tokens used in the request (prompt + completion).",
    "key": "total_tokens",
    "optional": false,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/total_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details": {
    "kind": "HttpDeclProperty",
    "docstring": "Breakdown of tokens used in a completion.",
    "key": "completion_tokens_details",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "accepted_prediction_tokens"
        },
        {
          "ident": "audio_tokens"
        },
        {
          "ident": "reasoning_tokens"
        },
        {
          "ident": "rejected_prediction_tokens"
        }
      ]
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) accepted_prediction_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) audio_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) reasoning_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) rejected_prediction_tokens"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details": {
    "kind": "HttpDeclProperty",
    "docstring": "Breakdown of tokens used in the prompt.",
    "key": "prompt_tokens_details",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio_tokens"
        },
        {
          "ident": "cache_write_tokens"
        },
        {
          "ident": "cached_tokens"
        }
      ]
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) audio_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cache_write_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cached_tokens"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/CompletionUsage",
    "ident": "CompletionUsage",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "completion_tokens"
        },
        {
          "ident": "prompt_tokens"
        },
        {
          "ident": "total_tokens"
        },
        {
          "ident": "completion_tokens_details"
        },
        {
          "ident": "prompt_tokens_details"
        }
      ]
    },
    "docstring": "Usage statistics for the completion request.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) total_tokens",
      "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details",
      "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) content": {
    "kind": "HttpDeclProperty",
    "docstring": "The contents of the chunk message.",
    "key": "content",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/content",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call": {
    "kind": "HttpDeclProperty",
    "docstring": "Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.",
    "key": "function_call",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "arguments"
        },
        {
          "ident": "name"
        }
      ]
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call",
    "deprecated": true,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) arguments",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) name"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) refusal": {
    "kind": "HttpDeclProperty",
    "docstring": "The refusal message generated by the model.",
    "key": "refusal",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/refusal",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role": {
    "kind": "HttpDeclProperty",
    "docstring": "The role of the author of this message.",
    "key": "role",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "developer"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "system"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "user"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "assistant"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "tool"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/role"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/role",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 1",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 2",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 3",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 4"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls": {
    "kind": "HttpDeclProperty",
    "key": "tool_calls",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "index"
          },
          {
            "ident": "id"
          },
          {
            "ident": "function"
          },
          {
            "ident": "type"
          }
        ]
      },
      "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/tool_calls"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/tool_calls",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) index",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) id",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "stop"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "length"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "tool_calls"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "content_filter"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) finish_reason > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "function_call"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) content": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of message content tokens with log probability information.",
    "key": "content",
    "optional": false,
    "nullable": true,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeReference",
        "ident": "ChatCompletionTokenLogprob",
        "$ref": "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)"
      },
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/content"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/content",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) logprobs > (property) refusal": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of message refusal tokens with log probability information.",
    "key": "refusal",
    "optional": false,
    "nullable": true,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeReference",
        "ident": "ChatCompletionTokenLogprob",
        "$ref": "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)"
      },
      "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/refusal"
    },
    "oasRef": "#/components/schemas/CreateChatCompletionStreamResponse/properties/choices/items/properties/logprobs/properties/refusal",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input/anyOf/0",
    "ident": "ModerationResults",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        },
        {
          "ident": "results"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Successful moderation results for the request input or generated output.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/input/anyOf/1",
    "ident": "Error",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "code"
        },
        {
          "ident": "message"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "An error produced while attempting moderation.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) code",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) message",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output/anyOf/0",
    "ident": "ModerationResults",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        },
        {
          "ident": "results"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Successful moderation results for the request input or generated output.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionModeration/properties/output/anyOf/1",
    "ident": "Error",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "code"
        },
        {
          "ident": "message"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "An error produced while attempting moderation.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) code",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) message",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type"
    ]
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) accepted_prediction_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "When using Predicted Outputs, the number of tokens in the\nprediction that appeared in the completion.\n",
    "key": "accepted_prediction_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/accepted_prediction_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) audio_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Audio input tokens generated by the model.",
    "key": "audio_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/audio_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) reasoning_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Tokens generated by the model for reasoning.",
    "key": "reasoning_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/reasoning_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) completion_tokens_details > (property) rejected_prediction_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "When using Predicted Outputs, the number of tokens in the\nprediction that did not appear in the completion. However, like\nreasoning tokens, these tokens are still counted in the total\ncompletion tokens for purposes of billing, output, and context window\nlimits.\n",
    "key": "rejected_prediction_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/completion_tokens_details/properties/rejected_prediction_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) audio_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Audio input tokens present in the prompt.",
    "key": "audio_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/audio_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cache_write_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The unadjusted number of prompt tokens written to cache.",
    "key": "cache_write_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/cache_write_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) completions > (model) completion_usage > (schema) > (property) prompt_tokens_details > (property) cached_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "Cached tokens present in the prompt.",
    "key": "cached_tokens",
    "optional": true,
    "nullable": false,
    "default": 0,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/CompletionUsage/properties/prompt_tokens_details/properties/cached_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) arguments": {
    "kind": "HttpDeclProperty",
    "docstring": "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.",
    "key": "arguments",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call/properties/arguments",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) function_call > (property) name": {
    "kind": "HttpDeclProperty",
    "docstring": "The name of the function to call.",
    "key": "name",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionStreamResponseDelta/properties/function_call/properties/name",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "developer"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "system"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "user"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "assistant"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) role > (member) 4": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "tool"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) index": {
    "kind": "HttpDeclProperty",
    "key": "index",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/index",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The ID of the tool call.",
    "key": "id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function": {
    "kind": "HttpDeclProperty",
    "key": "function",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "arguments"
        },
        {
          "ident": "name"
        }
      ]
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) arguments",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) name"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the tool. Currently, only `function` is supported.",
    "key": "type",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "function"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/type"
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token": {
    "kind": "HttpDeclProperty",
    "docstring": "The token.",
    "key": "token",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/token",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.",
    "key": "bytes",
    "optional": false,
    "nullable": true,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeNumber"
      },
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/bytes"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/bytes",
    "deprecated": false,
    "schemaType": "array",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "docstring": "The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.",
    "key": "logprob",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/logprob",
    "deprecated": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs": {
    "kind": "HttpDeclProperty",
    "docstring": "List of the most likely tokens and their log probability, at this token position. The number of entries may be fewer than the requested `top_logprobs`.",
    "key": "top_logprobs",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "token"
          },
          {
            "ident": "bytes"
          },
          {
            "ident": "logprob"
          }
        ]
      },
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) logprob"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob",
    "ident": "ChatCompletionTokenLogprob",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "token"
        },
        {
          "ident": "bytes"
        },
        {
          "ident": "logprob"
        },
        {
          "ident": "top_logprobs"
        }
      ]
    },
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) token",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) bytes",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) logprob",
      "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The moderation model used to generate the results.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of moderation results.",
    "key": "results",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "categories"
          },
          {
            "ident": "category_applied_input_types"
          },
          {
            "ident": "category_scores"
          },
          {
            "ident": "flagged"
          },
          {
            "ident": "model"
          },
          {
            "ident": "type"
          }
        ]
      },
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) categories",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_scores",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) flagged",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which is always `moderation_results`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_results"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) code": {
    "kind": "HttpDeclProperty",
    "docstring": "The error code.",
    "key": "code",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/code",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) message": {
    "kind": "HttpDeclProperty",
    "docstring": "The error message.",
    "key": "message",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/message",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which is always `error`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "error"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The moderation model used to generate the results.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of moderation results.",
    "key": "results",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "categories"
          },
          {
            "ident": "category_applied_input_types"
          },
          {
            "ident": "category_scores"
          },
          {
            "ident": "flagged"
          },
          {
            "ident": "model"
          },
          {
            "ident": "type"
          }
        ]
      },
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/results",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) categories",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_scores",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) flagged",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) model",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which is always `moderation_results`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_results"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationResults/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) code": {
    "kind": "HttpDeclProperty",
    "docstring": "The error code.",
    "key": "code",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/code",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) message": {
    "kind": "HttpDeclProperty",
    "docstring": "The error message.",
    "key": "message",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/message",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which is always `error`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "error"
        }
      ],
      "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type"
    },
    "oasRef": "#/components/schemas/ChatCompletionModerationError/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) arguments": {
    "kind": "HttpDeclProperty",
    "docstring": "The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.",
    "key": "arguments",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function/properties/arguments",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) function > (property) name": {
    "kind": "HttpDeclProperty",
    "docstring": "The name of the function to call.",
    "key": "name",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionMessageToolCallChunk/properties/function/properties/name",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) choices > (items) > (property) delta > (property) tool_calls > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "function"
    }
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) token": {
    "kind": "HttpDeclProperty",
    "docstring": "The token.",
    "key": "token",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/token",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) bytes": {
    "kind": "HttpDeclProperty",
    "docstring": "A list of integers representing the UTF-8 bytes representation of the token. Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation. Can be `null` if there is no bytes representation for the token.",
    "key": "bytes",
    "optional": false,
    "nullable": true,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeNumber"
      },
      "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/bytes"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/bytes",
    "deprecated": false,
    "schemaType": "array",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_token_logprob > (schema) > (property) top_logprobs > (items) > (property) logprob": {
    "kind": "HttpDeclProperty",
    "docstring": "The log probability of this token, if it is within the top 20 most likely tokens. Otherwise, the value `-9999.0` is used to signify that the token is very unlikely.",
    "key": "logprob",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ChatCompletionTokenLogprob/properties/top_logprobs/items/properties/logprob",
    "deprecated": false,
    "schemaType": "number",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) categories": {
    "kind": "HttpDeclProperty",
    "docstring": "A dictionary of moderation categories to booleans, True if the input is flagged under this category.",
    "key": "categories",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeBoolean"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/categories"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
    "deprecated": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types": {
    "kind": "HttpDeclProperty",
    "docstring": "Which modalities of input are reflected by the score for each category.",
    "key": "category_applied_input_types",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeArray",
          "elementType": {
            "kind": "HttpTypeUnion",
            "types": [
              {
                "kind": "HttpTypeLiteral",
                "literal": "text"
              },
              {
                "kind": "HttpTypeLiteral",
                "literal": "image"
              }
            ],
            "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties/items"
          },
          "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
    "deprecated": false,
    "schemaType": "map",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_scores": {
    "kind": "HttpDeclProperty",
    "docstring": "A dictionary of moderation categories to scores.",
    "key": "category_scores",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeNumber"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
    "deprecated": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) flagged": {
    "kind": "HttpDeclProperty",
    "docstring": "A boolean indicating whether the content was flagged by any category.",
    "key": "flagged",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeBoolean"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/flagged",
    "deprecated": false,
    "schemaType": "boolean",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The moderation model that produced this result.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which was always `moderation_result` for successful moderation results.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "default": "moderation_result",
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_result"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/type"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_results"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 1 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) categories": {
    "kind": "HttpDeclProperty",
    "docstring": "A dictionary of moderation categories to booleans, True if the input is flagged under this category.",
    "key": "categories",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeBoolean"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/categories"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/categories",
    "deprecated": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types": {
    "kind": "HttpDeclProperty",
    "docstring": "Which modalities of input are reflected by the score for each category.",
    "key": "category_applied_input_types",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeArray",
          "elementType": {
            "kind": "HttpTypeUnion",
            "types": [
              {
                "kind": "HttpTypeLiteral",
                "literal": "text"
              },
              {
                "kind": "HttpTypeLiteral",
                "literal": "image"
              }
            ],
            "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties/items"
          },
          "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types/additionalProperties"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_applied_input_types",
    "deprecated": false,
    "schemaType": "map",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0",
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_scores": {
    "kind": "HttpDeclProperty",
    "docstring": "A dictionary of moderation categories to scores.",
    "key": "category_scores",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "Record",
      "typeParameters": [
        {
          "kind": "HttpTypeString"
        },
        {
          "kind": "HttpTypeNumber"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/category_scores",
    "deprecated": false,
    "schemaType": "map",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) flagged": {
    "kind": "HttpDeclProperty",
    "docstring": "A boolean indicating whether the content was flagged by any category.",
    "key": "flagged",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeBoolean"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/flagged",
    "deprecated": false,
    "schemaType": "boolean",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The moderation model that produced this result.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The object type, which was always `moderation_result` for successful moderation results.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "default": "moderation_result",
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "moderation_result"
        }
      ],
      "oasRef": "#/components/schemas/ModerationResultBody/properties/type"
    },
    "oasRef": "#/components/schemas/ModerationResultBody/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type > (member) 0"
    ]
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_results"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 1 > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "text"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) input > (variant) 0 > (property) results > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_result"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "text"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) category_applied_input_types > (items) > (items) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image"
    }
  },
  "(resource) chat.completions > (model) chat_completion_chunk > (schema) > (property) moderation > (property) output > (variant) 0 > (property) results > (items) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "moderation_result"
    }
  }
}
```

### Example

```json
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```
