# Realtime translation server events

These are events emitted from the OpenAI Realtime Translation WebSocket server to the client.

## error

Returned when an error occurs, which could be a client problem or a server
problem. Most errors are recoverable and the session will stay open, we
recommend to implementors to monitor and log error messages by default.

### Schema

Schema name: `RealtimeServerEventError`

```json
{
  "(resource) realtime > (model) realtime_error_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeServerEventError",
    "ident": "RealtimeErrorEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "error"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Returned when an error occurs, which could be a client problem or a server\nproblem. Most errors are recoverable and the session will stay open, we\nrecommend to implementors to monitor and log error messages by default.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) error",
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) error": {
    "kind": "HttpDeclProperty",
    "docstring": "Details of the error.",
    "key": "error",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeError",
      "$ref": "(resource) realtime > (model) realtime_error > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error",
    "deprecated": false,
    "schemaType": "object",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) realtime_error",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error > (schema) > (property) message",
      "(resource) realtime > (model) realtime_error > (schema) > (property) type",
      "(resource) realtime > (model) realtime_error > (schema) > (property) code",
      "(resource) realtime > (model) realtime_error > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error > (schema) > (property) param"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `error`.",
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
      "oasRef": "#/components/schemas/RealtimeServerEventError/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_error_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) message": {
    "kind": "HttpDeclProperty",
    "docstring": "A human-readable error message.",
    "key": "message",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/message",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of error (e.g., \"invalid_request_error\", \"server_error\").\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/type",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) code": {
    "kind": "HttpDeclProperty",
    "docstring": "Error code, if any.",
    "key": "code",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/code",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The event_id of the client event that caused the error, if applicable.\n",
    "key": "event_id",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema) > (property) param": {
    "kind": "HttpDeclProperty",
    "docstring": "Parameter related to the error, if any.",
    "key": "param",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error/properties/param",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_error > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeServerEventError/properties/error",
    "ident": "RealtimeError",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "message"
        },
        {
          "ident": "type"
        },
        {
          "ident": "code"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "param"
        }
      ]
    },
    "docstring": "Details of the error.",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_error > (schema) > (property) message",
      "(resource) realtime > (model) realtime_error > (schema) > (property) type",
      "(resource) realtime > (model) realtime_error > (schema) > (property) code",
      "(resource) realtime > (model) realtime_error > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_error > (schema) > (property) param"
    ]
  },
  "(resource) realtime > (model) realtime_error_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "error"
    }
  }
}
```

### Example

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

## session.created

Returned when a translation session is created. Emitted automatically when a
new connection is established as the first server event. This event contains
the default translation session configuration.

### Schema

Schema name: `RealtimeTranslationServerEventSessionCreated`

```json
{
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated",
    "ident": "RealtimeTranslationSessionCreatedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "session"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Returned when a translation session is created. Emitted automatically when a\nnew connection is established as the first server event. This event contains\nthe default translation session configuration.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "title": "Realtime translation session",
    "docstring": "The translation session configuration.",
    "key": "session",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSession",
      "$ref": "(resource) realtime > (model) realtime_translation_session > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/session",
    "deprecated": false,
    "schemaType": "object",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) realtime_translation_session",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.created`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.created"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionCreated/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "Unique identifier for the session that looks like `sess_1234567890abcdef`.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "docstring": "Configuration for translation input and output audio.\n",
    "key": "audio",
    "optional": false,
    "nullable": false,
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
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at": {
    "kind": "HttpDeclProperty",
    "docstring": "Expiration timestamp for the session, in seconds since epoch.",
    "key": "expires_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/expires_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The Realtime translation model used for this session. This field is set at\nsession creation and cannot be changed with `session.update`.\n",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The session type. Always `translation` for Realtime translation sessions.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "translation"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSession",
    "ident": "RealtimeTranslationSession",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "audio"
        },
        {
          "ident": "expires_at"
        },
        {
          "ident": "model"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "A Realtime translation session. Translation sessions continuously translate input\naudio into the configured output language.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_created_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.created"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input": {
    "kind": "HttpDeclProperty",
    "key": "input",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "noise_reduction"
        },
        {
          "ident": "transcription"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output": {
    "kind": "HttpDeclProperty",
    "key": "output",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "language"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "translation"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional input noise reduction.\n",
    "key": "noise_reduction",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "type"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional source-language transcription. When configured, the server emits\n`session.input_transcript.delta` events. Translation itself still runs from\nthe input audio stream.\n",
    "key": "transcription",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "docstring": "Target language for translated output audio and transcript deltas.\n",
    "key": "language",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output/properties/language",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "NoiseReductionType",
      "$ref": "(resource) realtime > (model) noise_reduction_type > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) noise_reduction_type",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The transcription model used for source transcript deltas.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "near_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "far_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/NoiseReductionType",
    "ident": "NoiseReductionType",
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "near_field"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "far_field"
        }
      ],
      "oasRef": "#/components/schemas/NoiseReductionType"
    },
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  }
}
```

### Example

```json
{
  "type": "session.created",
  "event_id": "event_123",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "fr"
      }
    }
  }
}
```

## session.updated

Returned when a translation session is updated with a `session.update` event,
unless there is an error.

### Schema

Schema name: `RealtimeTranslationServerEventSessionUpdated`

```json
{
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated",
    "ident": "RealtimeTranslationSessionUpdatedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "session"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Returned when a translation session is updated with a `session.update` event,\nunless there is an error.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "title": "Realtime translation session",
    "docstring": "The translation session configuration.",
    "key": "session",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSession",
      "$ref": "(resource) realtime > (model) realtime_translation_session > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/session",
    "deprecated": false,
    "schemaType": "object",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) realtime_translation_session",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.updated`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.updated"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionUpdated/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "Unique identifier for the session that looks like `sess_1234567890abcdef`.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "docstring": "Configuration for translation input and output audio.\n",
    "key": "audio",
    "optional": false,
    "nullable": false,
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
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at": {
    "kind": "HttpDeclProperty",
    "docstring": "Expiration timestamp for the session, in seconds since epoch.",
    "key": "expires_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/expires_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The Realtime translation model used for this session. This field is set at\nsession creation and cannot be changed with `session.update`.\n",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The session type. Always `translation` for Realtime translation sessions.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "translation"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSession",
    "ident": "RealtimeTranslationSession",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "audio"
        },
        {
          "ident": "expires_at"
        },
        {
          "ident": "model"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "A Realtime translation session. Translation sessions continuously translate input\naudio into the configured output language.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) id",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) expires_at",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) model",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_updated_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.updated"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input": {
    "kind": "HttpDeclProperty",
    "key": "input",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "noise_reduction"
        },
        {
          "ident": "transcription"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output": {
    "kind": "HttpDeclProperty",
    "key": "output",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "language"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "translation"
    }
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional input noise reduction.\n",
    "key": "noise_reduction",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "type"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional source-language transcription. When configured, the server emits\n`session.input_transcript.delta` events. Translation itself still runs from\nthe input audio stream.\n",
    "key": "transcription",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "model"
        }
      ]
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "docstring": "Target language for translated output audio and transcript deltas.\n",
    "key": "language",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/output/properties/language",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "NoiseReductionType",
      "$ref": "(resource) realtime > (model) noise_reduction_type > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) noise_reduction_type",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The transcription model used for source transcript deltas.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSession/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "near_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "far_field"
    }
  },
  "(resource) realtime > (model) noise_reduction_type > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/NoiseReductionType",
    "ident": "NoiseReductionType",
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "near_field"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "far_field"
        }
      ],
      "oasRef": "#/components/schemas/NoiseReductionType"
    },
    "docstring": "Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.\n",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 0",
      "(resource) realtime > (model) noise_reduction_type > (schema) > (member) 1"
    ]
  }
}
```

### Example

```json
{
  "type": "session.updated",
  "event_id": "event_124",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

## session.closed

Returned when a realtime translation session is closed.

### Schema

Schema name: `RealtimeTranslationServerEventSessionClosed`

```json
{
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed",
    "ident": "RealtimeTranslationSessionClosedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Returned when a realtime translation session is closed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.closed`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.closed"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionClosed/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_closed_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.closed"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_987",
  "type": "session.closed"
}
```

## session.input_transcript.delta

Returned when optional source-language transcript text is available. This event
is emitted only when `audio.input.transcription` is configured.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionInputTranscriptDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta",
    "ident": "RealtimeTranslationInputTranscriptDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "elapsed_ms"
        }
      ]
    },
    "docstring": "Returned when optional source-language transcript text is available. This event\nis emitted only when `audio.input.transcription` is configured.\n\nTranscript deltas are append-only text fragments. Clients should not insert\nunconditional spaces between deltas.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) elapsed_ms"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "docstring": "Append-only source-language transcript text.",
    "key": "delta",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/delta",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.input_transcript.delta`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.input_transcript.delta"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. It advances in 200 ms increments, but multiple transcript\ndeltas may share the same `elapsed_ms`. Treat it as alignment metadata,\nnot a unique transcript-delta identifier.\n",
    "key": "elapsed_ms",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionInputTranscriptDelta/properties/elapsed_ms",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_transcript_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.input_transcript.delta"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_125",
  "type": "session.input_transcript.delta",
  "delta": " hear",
  "elapsed_ms": 1200
}
```

## session.output_transcript.delta

Returned when translated transcript text is available.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputTranscriptDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta",
    "ident": "RealtimeTranslationOutputTranscriptDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "elapsed_ms"
        }
      ]
    },
    "docstring": "Returned when translated transcript text is available.\n\nTranscript deltas are append-only text fragments. Clients should not insert\nunconditional spaces between deltas.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) elapsed_ms"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "docstring": "Append-only transcript text for the translated output audio.",
    "key": "delta",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/delta",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.output_transcript.delta`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.output_transcript.delta"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. It advances in 200 ms increments, but multiple transcript\ndeltas may share the same `elapsed_ms`. Treat it as alignment metadata,\nnot a unique transcript-delta identifier.\n",
    "key": "elapsed_ms",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputTranscriptDelta/properties/elapsed_ms",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_transcript_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.output_transcript.delta"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_124",
  "type": "session.output_transcript.delta",
  "delta": " escuch",
  "elapsed_ms": 1200
}
```

## session.output_audio.delta

Returned when translated output audio is available. Output audio deltas are
200 ms frames of PCM16 audio.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputAudioDelta`

```json
{
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta",
    "ident": "RealtimeTranslationOutputAudioDeltaEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "delta"
        },
        {
          "ident": "event_id"
        },
        {
          "ident": "type"
        },
        {
          "ident": "channels"
        },
        {
          "ident": "elapsed_ms"
        },
        {
          "ident": "format"
        },
        {
          "ident": "sample_rate"
        }
      ]
    },
    "docstring": "Returned when translated output audio is available. Output audio deltas are\n200 ms frames of PCM16 audio.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) delta",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) event_id",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) channels",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) elapsed_ms",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format",
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) sample_rate"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) delta": {
    "kind": "HttpDeclProperty",
    "docstring": "Base64-encoded translated audio data.",
    "key": "delta",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/delta",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the server event.",
    "key": "event_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.output_audio.delta`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.output_audio.delta"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) channels": {
    "kind": "HttpDeclProperty",
    "docstring": "Number of audio channels.",
    "key": "channels",
    "optional": true,
    "nullable": false,
    "default": 1,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/channels",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) elapsed_ms": {
    "kind": "HttpDeclProperty",
    "docstring": "Timing metadata for stream alignment, derived from the translation frame\nwhen available. Treat `elapsed_ms` as alignment metadata, not a unique\nevent identifier.\n",
    "key": "elapsed_ms",
    "optional": true,
    "nullable": true,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/elapsed_ms",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format": {
    "kind": "HttpDeclProperty",
    "docstring": "Audio encoding for `delta`.",
    "key": "format",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "pcm16"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/format"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/format",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) sample_rate": {
    "kind": "HttpDeclProperty",
    "docstring": "Sample rate of the audio delta.",
    "key": "sample_rate",
    "optional": true,
    "nullable": false,
    "default": 24000,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationServerEventSessionOutputAudioDelta/properties/sample_rate",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.output_audio.delta"
    }
  },
  "(resource) realtime > (model) realtime_translation_output_audio_delta_event > (schema) > (property) format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "pcm16"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_123",
  "type": "session.output_audio.delta",
  "delta": "Base64EncodedAudioDelta",
  "sample_rate": 24000,
  "channels": 1,
  "format": "pcm16",
  "elapsed_ms": 1200
}
```
