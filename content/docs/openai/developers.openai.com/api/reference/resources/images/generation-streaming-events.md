# Image generation streaming events

Stream image generation and editing in real time with server-sent events.
[Learn more about image streaming](https://platform.openai.com/docs/guides/image-generation).

## image_generation.partial_image

Emitted when a partial image is available during image generation streaming.

### Schema

Schema name: `ImageGenPartialImageEvent`

```json
{
  "(resource) images > (model) image_gen_partial_image_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent",
    "ident": "ImageGenPartialImageEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "b64_json"
        },
        {
          "ident": "background"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "output_format"
        },
        {
          "ident": "partial_image_index"
        },
        {
          "ident": "quality"
        },
        {
          "ident": "size"
        },
        {
          "ident": "type"
        }
      ]
    },
    "docstring": "Emitted when a partial image is available during image generation streaming.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) b64_json",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) created_at",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) partial_image_index",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) type"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) b64_json": {
    "kind": "HttpDeclProperty",
    "docstring": "Base64-encoded partial image data, suitable for rendering as an image.\n",
    "key": "b64_json",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/b64_json",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background": {
    "kind": "HttpDeclProperty",
    "docstring": "The background setting for the requested image.\n",
    "key": "background",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transparent"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "opaque"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/background"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/background",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 0",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 1",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 2"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp when the event was created.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format": {
    "kind": "HttpDeclProperty",
    "docstring": "The output format for the requested image.\n",
    "key": "output_format",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "png"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "webp"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "jpeg"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/output_format"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/output_format",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 0",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 1",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 2"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) partial_image_index": {
    "kind": "HttpDeclProperty",
    "docstring": "0-based index for the partial image (streaming).\n",
    "key": "partial_image_index",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/partial_image_index",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality": {
    "kind": "HttpDeclProperty",
    "docstring": "The quality setting for the requested image.\n",
    "key": "quality",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "low"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "medium"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "high"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/quality"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/quality",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 0",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 1",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 2",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 3"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size": {
    "kind": "HttpDeclProperty",
    "docstring": "The size of the requested image.\n",
    "key": "size",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1536"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1536x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/size"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/size",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 0",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 1",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 2",
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 3"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `image_generation.partial_image`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "image_generation.partial_image"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/type"
    },
    "oasRef": "#/components/schemas/ImageGenPartialImageEvent/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transparent"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "opaque"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) background > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "png"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "webp"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) output_format > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "jpeg"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "low"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "medium"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "high"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) quality > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1024"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1536"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1536x1024"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) size > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_partial_image_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image_generation.partial_image"
    }
  }
}
```

### Example

```json
{
  "type": "image_generation.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

## image_generation.completed

Emitted when image generation has completed and the final image is available.

### Schema

Schema name: `ImageGenCompletedEvent`

```json
{
  "(resource) images > (model) image_gen_completed_event > (schema)": {
    "kind": "HttpDeclTypeAlias",
    "oasRef": "#/components/schemas/ImageGenCompletedEvent",
    "ident": "ImageGenCompletedEvent",
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "b64_json"
        },
        {
          "ident": "background"
        },
        {
          "ident": "created_at"
        },
        {
          "ident": "output_format"
        },
        {
          "ident": "quality"
        },
        {
          "ident": "size"
        },
        {
          "ident": "type"
        },
        {
          "ident": "usage"
        }
      ]
    },
    "docstring": "Emitted when image generation has completed and the final image is available.\n",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) b64_json",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) background",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) created_at",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) size",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) type",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) b64_json": {
    "kind": "HttpDeclProperty",
    "docstring": "Base64-encoded image data, suitable for rendering as an image.\n",
    "key": "b64_json",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeString"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/b64_json",
    "deprecated": false,
    "schemaType": "string",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) background": {
    "kind": "HttpDeclProperty",
    "docstring": "The background setting for the generated image.\n",
    "key": "background",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "transparent"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "opaque"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/background"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/background",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 0",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 1",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 2"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) created_at": {
    "kind": "HttpDeclProperty",
    "docstring": "The Unix timestamp when the event was created.\n",
    "key": "created_at",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "constraints": {
      "format": "unixtime"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/created_at",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format": {
    "kind": "HttpDeclProperty",
    "docstring": "The output format for the generated image.\n",
    "key": "output_format",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "png"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "webp"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "jpeg"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/output_format"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/output_format",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 0",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 1",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 2"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality": {
    "kind": "HttpDeclProperty",
    "docstring": "The quality setting for the generated image.\n",
    "key": "quality",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "low"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "medium"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "high"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/quality"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/quality",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 0",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 1",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 2",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 3"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) size": {
    "kind": "HttpDeclProperty",
    "docstring": "The size of the generated image.\n",
    "key": "size",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1024x1536"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "1536x1024"
        },
        {
          "kind": "HttpTypeLiteral",
          "literal": "auto"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/size"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/size",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 0",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 1",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 2",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 3"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) type": {
    "kind": "HttpDeclProperty",
    "docstring": "The type of the event. Always `image_generation.completed`.\n",
    "key": "type",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeUnion",
      "types": [
        {
          "kind": "HttpTypeLiteral",
          "literal": "image_generation.completed"
        }
      ],
      "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/type"
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/type",
    "deprecated": false,
    "schemaType": "enum",
    "childrenParentSchema": "enum",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) type > (member) 0"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage": {
    "kind": "HttpDeclProperty",
    "docstring": "For the GPT image models only, the token usage information for the image generation.\n",
    "key": "usage",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "input_tokens"
        },
        {
          "ident": "input_tokens_details"
        },
        {
          "ident": "output_tokens"
        },
        {
          "ident": "total_tokens"
        }
      ]
    },
    "oasRef": "#/components/schemas/ImageGenCompletedEvent/properties/usage",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) output_tokens",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) total_tokens"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "transparent"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "opaque"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) background > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "png"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "webp"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) output_format > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "jpeg"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "low"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "medium"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "high"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) quality > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1024"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 1": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1024x1536"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 2": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "1536x1024"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) size > (member) 3": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "auto"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) type > (member) 0": {
    "kind": "HttpDeclReference",
    "type": {
      "kind": "HttpTypeLiteral",
      "literal": "image_generation.completed"
    }
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The number of tokens (images and text) in the input prompt.",
    "key": "input_tokens",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details": {
    "kind": "HttpDeclProperty",
    "docstring": "The input tokens detailed information for the image generation.",
    "key": "input_tokens_details",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeObject",
      "members": [
        {
          "ident": "image_tokens"
        },
        {
          "ident": "text_tokens"
        }
      ]
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details",
    "deprecated": false,
    "schemaType": "object",
    "childrenParentSchema": "object",
    "children": [
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) image_tokens",
      "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) text_tokens"
    ]
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) output_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The number of image tokens in the output image.",
    "key": "output_tokens",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/output_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) total_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The total number of tokens (images and text) used for the image generation.\n",
    "key": "total_tokens",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/total_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) image_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The number of image tokens in the input prompt.",
    "key": "image_tokens",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details/properties/image_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  },
  "(resource) images > (model) image_gen_completed_event > (schema) > (property) usage > (property) input_tokens_details > (property) text_tokens": {
    "kind": "HttpDeclProperty",
    "docstring": "The number of text tokens in the input prompt.",
    "key": "text_tokens",
    "optional": false,
    "nullable": false,
    "type": {
      "kind": "HttpTypeNumber"
    },
    "oasRef": "#/components/schemas/ImagesUsage/properties/input_tokens_details/properties/text_tokens",
    "deprecated": false,
    "schemaType": "integer",
    "children": []
  }
}
```

### Example

```json
{
  "type": "image_generation.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```
