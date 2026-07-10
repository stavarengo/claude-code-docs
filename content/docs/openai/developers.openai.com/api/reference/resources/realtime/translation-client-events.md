# Realtime translation client events

These are events that the OpenAI Realtime Translation WebSocket server will accept from the client.

## session.update

Send this event to update the translation session configuration. Translation
sessions support updates to `audio.output.language`, `audio.input.transcription`,
and `audio.input.noise_reduction`.

### Schema

Schema name: `RealtimeTranslationClientEventSessionUpdate`

```json
{
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate",
    "ident": "RealtimeTranslationSessionUpdateEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "session"
        },
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "docstring": "Send this event to update the translation session configuration. Translation\nsessions support updates to `audio.output.language`, `audio.input.transcription`,\nand `audio.input.noise_reduction`.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) session",
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) session": {
    "kind": "HttpDeclProperty",
    "title": "Realtime translation session update",
    "docstring": "Translation session fields to update. The session `type` and `model` are set\nat creation and cannot be changed with `session.update`.\n",
    "key": "session",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeReference",
      "ident": "RealtimeTranslationSessionUpdateRequest",
      "$ref": "(resource) realtime > (model) realtime_translation_session_update_request > (schema)"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/session",
    "deprecated": false,
    "schemaType": "object",
    "modelImplicit": false,
    "modelPath": "(resource) realtime > (model) realtime_translation_session_update_request",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.update`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.update"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional client-generated ID used to identify this event.",
    "key": "event_id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionUpdate/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "docstring": "Configuration for translation input and output audio.\n",
    "key": "audio",
    "optional": true,
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input",
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest",
    "ident": "RealtimeTranslationSessionUpdateRequest",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio"
        }
      ]
    },
    "docstring": "Realtime translation session fields that can be updated with `session.update`.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.update"
    }
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input": {
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction",
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output": {
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/output",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output > (property) language"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional input noise reduction. Set to `null` to disable it.\n",
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/noise_reduction",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription": {
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/transcription",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription > (property) model"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) output > (property) language": {
    "kind": "HttpDeclProperty",
    "docstring": "Target language for translated output audio and transcript deltas.\n",
    "key": "language",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/output/properties/language",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) noise_reduction > (property) type": {
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
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/noise_reduction/anyOf/0/properties/type",
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
  "(resource) realtime > (model) realtime_translation_session_update_request > (schema) > (property) audio > (property) input > (property) transcription > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The transcription model to use for source transcript deltas.",
    "key": "model",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationSessionUpdateRequest/properties/audio/properties/input/properties/transcription/anyOf/0/properties/model",
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
  "type": "session.update",
  "session": {
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper"
        },
        "noise_reduction": null
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

## session.input_audio_buffer.append

Send this event to append audio bytes to the translation session input audio buffer.

WebSocket translation sessions accept base64-encoded 24 kHz PCM16 mono
little-endian raw audio bytes. Unsupported websocket audio formats return a
validation error because lower-quality audio materially degrades translation
quality.

Translation consumes 200 ms engine frames. For best realtime behavior, append
audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
has enough audio for one frame. If a chunk is longer, the server splits it into
200 ms frames and enqueues them back-to-back.

Keep appending silence while the session is active. If a client stops sending
audio and later resumes, model time treats the resumed audio as contiguous with
the previous audio rather than as a real-world pause.

### Schema

Schema name: `RealtimeTranslationClientEventInputAudioBufferAppend`

```json
{
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend",
    "ident": "RealtimeTranslationInputAudioBufferAppendEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "audio"
        },
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "docstring": "Send this event to append audio bytes to the translation session input audio buffer.\n\nWebSocket translation sessions accept base64-encoded 24 kHz PCM16 mono\nlittle-endian raw audio bytes. Unsupported websocket audio formats return a\nvalidation error because lower-quality audio materially degrades translation\nquality.\n\nTranslation consumes 200 ms engine frames. For best realtime behavior, append\naudio in 200 ms chunks. If a chunk is shorter, the server buffers it until it\nhas enough audio for one frame. If a chunk is longer, the server splits it into\n200 ms frames and enqueues them back-to-back.\n\nKeep appending silence while the session is active. If a client stops sending\naudio and later resumes, model time treats the resumed audio as contiguous with\nthe previous audio rather than as a real-world pause.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) audio",
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) audio": {
    "kind": "HttpDeclProperty",
    "docstring": "Base64-encoded 24 kHz PCM16 mono audio bytes.",
    "key": "audio",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/audio",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.input_audio_buffer.append`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.input_audio_buffer.append"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional client-generated ID used to identify this event.",
    "key": "event_id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventInputAudioBufferAppend/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_input_audio_buffer_append_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.input_audio_buffer.append"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_456",
  "type": "session.input_audio_buffer.append",
  "audio": "Base64EncodedAudioData"
}
```

## session.close

Gracefully close the realtime translation session. The server flushes pending
input audio and emits any remaining translated output before closing the
session.

### Schema

Schema name: `RealtimeTranslationClientEventSessionClose`

```json
{
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose",
    "ident": "RealtimeTranslationSessionCloseEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "type"
        },
        {
          "ident": "event_id"
        }
      ]
    },
    "docstring": "Gracefully close the realtime translation session. The server flushes pending\ninput audio and emits any remaining translated output before closing the\nsession.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type",
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) event_id"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The event type, must be `session.close`.",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "session.close"
        }
      ],
      "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/type"
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) event_id": {
    "kind": "HttpDeclProperty",
    "docstring": "Optional client-generated ID used to identify this event.",
    "key": "event_id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 512
    },
    "oasRef": "#/components/schemas/RealtimeTranslationClientEventSessionClose/properties/event_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) realtime > (model) realtime_translation_session_close_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "session.close"
    }
  }
}
```

### Example

```json
{
  "event_id": "event_789",
  "type": "session.close"
}
```
