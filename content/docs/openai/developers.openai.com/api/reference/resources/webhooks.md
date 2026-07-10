# Webhooks events

Webhooks are HTTP requests sent by OpenAI to a URL you specify when certain
events happen during the course of API usage.

[Learn more about webhooks](https://platform.openai.com/docs/guides/webhooks).

## response.completed

Sent when a background response has been completed.

### Schema

Schema name: `WebhookResponseCompleted`

```json
{
  "(resource) webhooks > (model) response_completed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_completed/post/requestBody/content/application%2Fjson/schema",
    "ident": "ResponseCompletedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a background response has been completed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the model response was completed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `response.completed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.completed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the model response.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseCompleted/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.completed"
    }
  },
  "(resource) webhooks > (model) response_completed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.completed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.cancelled

Sent when a background response has been cancelled.

### Schema

Schema name: `WebhookResponseCancelled`

```json
{
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_cancelled/post/requestBody/content/application%2Fjson/schema",
    "ident": "ResponseCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a background response has been cancelled.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the model response was cancelled.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `response.cancelled`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.cancelled"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the model response.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseCancelled/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.cancelled"
    }
  },
  "(resource) webhooks > (model) response_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.failed

Sent when a background response has failed.

### Schema

Schema name: `WebhookResponseFailed`

```json
{
  "(resource) webhooks > (model) response_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_failed/post/requestBody/content/application%2Fjson/schema",
    "ident": "ResponseFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a background response has failed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the model response failed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `response.failed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.failed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseFailed/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseFailed/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the model response.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseFailed/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.failed"
    }
  },
  "(resource) webhooks > (model) response_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.failed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## response.incomplete

Sent when a background response has been interrupted.

### Schema

Schema name: `WebhookResponseIncomplete`

```json
{
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/response_incomplete/post/requestBody/content/application%2Fjson/schema",
    "ident": "ResponseIncompleteWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a background response has been interrupted.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the model response was interrupted.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `response.incomplete`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "response.incomplete"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the model response.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookResponseIncomplete/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "response.incomplete"
    }
  },
  "(resource) webhooks > (model) response_incomplete_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.incomplete",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

## safety_identifier.blocked

Sent when a request associated with a safety identifier has been blocked.

### Schema

Schema name: `WebhookSafetyIdentifierBlocked`

```json
{
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/safety_identifier_blocked/post/requestBody/content/application%2Fjson/schema",
    "ident": "SafetyIdentifierBlockedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a request associated with a safety identifier has been blocked.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the request was blocked.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "safety_category"
        },
        {
          "ident": "safety_identifier"
        },
        {
          "ident": "model"
        },
        {
          "ident": "project_id"
        },
        {
          "ident": "request_id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) safety_category",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) safety_identifier",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) model",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) project_id",
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) request_id"
    ]
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `safety_identifier.blocked`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "safety_identifier.blocked"
        }
      ],
      "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) safety_category": {
    "kind": "HttpDeclProperty",
    "docstring": "The safety category that triggered the block, such as `bio` or `cyber`.\n",
    "key": "safety_category",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data/properties/safety_category",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) safety_identifier": {
    "kind": "HttpDeclProperty",
    "docstring": "The stable safety identifier associated with the blocked request.\n",
    "key": "safety_identifier",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "constraints": {
      "maxLength": 64
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data/properties/safety_identifier",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) model": {
    "kind": "HttpDeclProperty",
    "docstring": "The model used for the blocked request, if available.\n",
    "key": "model",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data/properties/model",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) project_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The project associated with the blocked request, if available.\n",
    "key": "project_id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data/properties/project_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) data > (property) request_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The OpenAI request ID for the blocked request, if available.\n",
    "key": "request_id",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookSafetyIdentifierBlocked/properties/data/properties/request_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "safety_identifier.blocked"
    }
  },
  "(resource) webhooks > (model) safety_identifier_blocked_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "safety_identifier.blocked",
  "created_at": 1719168000,
  "data": {
    "safety_identifier": "safety-identifier-1234",
    "safety_category": "cyber",
    "request_id": "req_abc123",
    "project_id": "proj_abc123",
    "model": "gpt-4.1"
  }
}
```

## batch.completed

Sent when a batch API request has been completed.

### Schema

Schema name: `WebhookBatchCompleted`

```json
{
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_completed/post/requestBody/content/application%2Fjson/schema",
    "ident": "BatchCompletedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a batch API request has been completed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request was completed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `batch.completed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.completed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the batch API request.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchCompleted/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.completed"
    }
  },
  "(resource) webhooks > (model) batch_completed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.completed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.cancelled

Sent when a batch API request has been cancelled.

### Schema

Schema name: `WebhookBatchCancelled`

```json
{
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_cancelled/post/requestBody/content/application%2Fjson/schema",
    "ident": "BatchCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a batch API request has been cancelled.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request was cancelled.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `batch.cancelled`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.cancelled"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the batch API request.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchCancelled/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.cancelled"
    }
  },
  "(resource) webhooks > (model) batch_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.expired

Sent when a batch API request has expired.

### Schema

Schema name: `WebhookBatchExpired`

```json
{
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_expired/post/requestBody/content/application%2Fjson/schema",
    "ident": "BatchExpiredWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a batch API request has expired.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request expired.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `batch.expired`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.expired"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchExpired/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchExpired/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the batch API request.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchExpired/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.expired"
    }
  },
  "(resource) webhooks > (model) batch_expired_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.expired",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## batch.failed

Sent when a batch API request has failed.

### Schema

Schema name: `WebhookBatchFailed`

```json
{
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/batch_failed/post/requestBody/content/application%2Fjson/schema",
    "ident": "BatchFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a batch API request has failed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the batch API request failed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `batch.failed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "batch.failed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchFailed/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookBatchFailed/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the batch API request.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookBatchFailed/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "batch.failed"
    }
  },
  "(resource) webhooks > (model) batch_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.failed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

## fine_tuning.job.succeeded

Sent when a fine-tuning job has succeeded.

### Schema

Schema name: `WebhookFineTuningJobSucceeded`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_succeeded/post/requestBody/content/application%2Fjson/schema",
    "ident": "FineTuningJobSucceededWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a fine-tuning job has succeeded.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job succeeded.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `fine_tuning.job.succeeded`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.succeeded"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobSucceeded/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.succeeded"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_succeeded_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## fine_tuning.job.failed

Sent when a fine-tuning job has failed.

### Schema

Schema name: `WebhookFineTuningJobFailed`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_failed/post/requestBody/content/application%2Fjson/schema",
    "ident": "FineTuningJobFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a fine-tuning job has failed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job failed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `fine_tuning.job.failed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.failed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobFailed/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.failed"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.failed",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## fine_tuning.job.cancelled

Sent when a fine-tuning job has been cancelled.

### Schema

Schema name: `WebhookFineTuningJobCancelled`

```json
{
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/fine_tuning_job_cancelled/post/requestBody/content/application%2Fjson/schema",
    "ident": "FineTuningJobCancelledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when a fine-tuning job has been cancelled.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the fine-tuning job was cancelled.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `fine_tuning.job.cancelled`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "fine_tuning.job.cancelled"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the fine-tuning job.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookFineTuningJobCancelled/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "fine_tuning.job.cancelled"
    }
  },
  "(resource) webhooks > (model) fine_tuning_job_cancelled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

## eval.run.succeeded

Sent when an eval run has succeeded.

### Schema

Schema name: `WebhookEvalRunSucceeded`

```json
{
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_succeeded/post/requestBody/content/application%2Fjson/schema",
    "ident": "EvalRunSucceededWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when an eval run has succeeded.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the eval run succeeded.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `eval.run.succeeded`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.succeeded"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the eval run.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunSucceeded/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.succeeded"
    }
  },
  "(resource) webhooks > (model) eval_run_succeeded_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## eval.run.failed

Sent when an eval run has failed.

### Schema

Schema name: `WebhookEvalRunFailed`

```json
{
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_failed/post/requestBody/content/application%2Fjson/schema",
    "ident": "EvalRunFailedWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when an eval run has failed.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the eval run failed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `eval.run.failed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.failed"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the eval run.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunFailed/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.failed"
    }
  },
  "(resource) webhooks > (model) eval_run_failed_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.failed",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## eval.run.canceled

Sent when an eval run has been canceled.

### Schema

Schema name: `WebhookEvalRunCanceled`

```json
{
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/eval_run_canceled/post/requestBody/content/application%2Fjson/schema",
    "ident": "EvalRunCanceledWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when an eval run has been canceled.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the eval run was canceled.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data > (property) id"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `eval.run.canceled`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "eval.run.canceled"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) data > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the eval run.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookEvalRunCanceled/properties/data/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "eval.run.canceled"
    }
  },
  "(resource) webhooks > (model) eval_run_canceled_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.canceled",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

## realtime.call.incoming

Sent when Realtime API Receives a incoming SIP call.

### Schema

Schema name: `WebhookRealtimeCallIncoming`

```json
{
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/webhooks/realtime_call_incoming/post/requestBody/content/application%2Fjson/schema",
    "ident": "RealtimeCallIncomingWebhookEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "id"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "data"
        },
        {
          "ident": "type"
        },
        {
          "ident": "object"
        }
      ]
    },
    "docstring": "Sent when Realtime API Receives a incoming SIP call.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) id",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) created_at",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of the event.\n",
    "key": "id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp (in seconds) of when the model response was completed.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data": {
    "kind": "HttpDeclProperty",
    "docstring": "Event data payload.\n",
    "key": "data",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "call_id"
        },
        {
          "ident": "sip_headers"
        }
      ]
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) call_id",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `realtime.call.incoming`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "realtime.call.incoming"
        }
      ],
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/type"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object": {
    "kind": "HttpDeclProperty",
    "docstring": "The object of the event. Always `event`.\n",
    "key": "object",
    "optional": true,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "event"
        }
      ],
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/object"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/object",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object > (member) 0"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) call_id": {
    "kind": "HttpDeclProperty",
    "docstring": "The unique ID of this call.\n",
    "key": "call_id",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/call_id",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers": {
    "kind": "HttpDeclProperty",
    "docstring": "Headers from the SIP Invite.\n",
    "key": "sip_headers",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeArray",
      "elementType": {
        "kind": "HttpTypeObject",
        "members": [
          {
            "ident": "name"
          },
          {
            "ident": "value"
          }
        ]
      },
      "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers",
    "deprecated": false,
    "schemaType": "array",
    "childrenParentSchema": "object",
    "children": [
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name",
      "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value"
    ]
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "realtime.call.incoming"
    }
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) object > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "event"
    }
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) name": {
    "kind": "HttpDeclProperty",
    "docstring": "Name of the SIP Header.\n",
    "key": "name",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers/items/properties/name",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) webhooks > (model) realtime_call_incoming_webhook_event > (schema) > (property) data > (property) sip_headers > (items) > (property) value": {
    "kind": "HttpDeclProperty",
    "docstring": "Value of the SIP Header.\n",
    "key": "value",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/WebhookRealtimeCallIncoming/properties/data/properties/sip_headers/items/properties/value",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  }
}
```

### Example

```json
{
  "id": "evt_abc123",
  "type": "realtime.call.incoming",
  "created_at": 1719168000,
  "data": {
    "call_id": "rtc_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "Max-Forwards", "value": "63"},
      {"name": "CSeq", "value": "851287 INVITE"},
      {"name": "Content-Type", "value": "application/sdp"},
    ]
  }
}
```
