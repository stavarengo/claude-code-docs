---
title: Vision
url: https://platform.claude.com/docs/en/build-with-claude/vision
description: Claude's vision capabilities allow it to process and analyze images, opening up exciting possibilities for multimodal interaction.
featureMetadata:
  status: ga
  supportedModels:
    - claude-fable-5-1
    - claude-mythos-5-1
    - claude-fable-5
    - claude-mythos-5
    - claude-mythos-preview
    - claude-opus-5-5
    - claude-opus-5
    - claude-sonnet-5-5
    - claude-sonnet-5
    - claude-haiku-5-5
    - claude-haiku-4-5-20251001
    - claude-opus-4-8
    - claude-opus-4-7
    - claude-opus-4-6
    - claude-sonnet-4-6
    - claude-opus-4-5-20251101
    - claude-sonnet-4-5-20250929
  supportedPlatforms:
    Claude API: ga
    Claude Platform on AWS: ga
    Claude Models on Google Cloud (Anthropic managed): ga
    Amazon Bedrock:
      availability: ga
      note: Only base64 image sources; per-image limit 5 MB (base64-encoded) and a lower total request size.
    Amazon Bedrock (InvokeModel):
      availability: ga
      note: Only base64 image sources; per-image limit 5 MB (base64-encoded) and a lower total request size.
    Claude Models on Google Cloud (Google managed):
      availability: ga
      note: Only base64 image sources; per-image limit 5 MB (base64-encoded) and a lower total request size.
    Microsoft Foundry: ga
---

This guide describes how to send images to Claude, the limits and costs that apply, and where to find guidance for [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli).

***

## Send images to Claude

Use Claude’s vision capabilities through:

* [claude.ai](https://claude.ai/). Upload an image like you would a file, or drag and drop an image directly into the chat window.
* [Playground](https://platform.claude.com/playground) in the Claude Console. Add images directly to any **User** message block.
* API request. See the following examples.

On the API, provide images to Claude as `image` content blocks using one of three source types:

1. A base64-encoded image embedded in the request body
2. A URL reference to an image hosted online
3. A `file_id` returned by the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli) (upload once, reference many times)

<Note>
  On Amazon Bedrock and Claude Models on Google Cloud (Google managed), only base64-encoded sources are currently available.
</Note>

<Tip>
  Just as [placing long documents before your query](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices?sdk_languages=cli#long-context-prompting) improves results in text prompts, Claude works best when images come before text. Images placed after text or interpolated with text still perform well, but if your use case allows it, prefer an image-then-text structure.
</Tip>

### Base64-encoded image example

<CodeGroup>
  ```bash CLI
  curl -sSo ./vision-example.jpg \
    https://platform.claude.com/docs/images/vision-example.jpg

  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: image
          source:
            type: base64
            media_type: image/jpeg
            data: "@./vision-example.jpg"
        - type: text
          text: Describe this image.
  YAML
  ```
</CodeGroup>

### URL-based image example

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: image
          source:
            type: url
            url: https://platform.claude.com/docs/images/vision-example.jpg
        - type: text
          text: Describe this image.
  YAML
  ```
</CodeGroup>

### Files API image example

For images you’ll use repeatedly or when you want to avoid encoding overhead, use the [Files API](https://platform.claude.com/docs/en/build-with-claude/files?sdk_languages=cli). Upload the image once, then reference the returned `file_id` in subsequent messages instead of resending base64 data.

<Tip>
  In multi-turn conversations and agentic workflows, each request resends the full conversation history. If images are base64-encoded, the full image bytes are included in the payload on every turn, which can significantly increase request size and latency as the conversation grows. Uploading images to the Files API and referencing them by `file_id` keeps request payloads small regardless of how many images accumulate in the conversation history.
</Tip>

<CodeGroup>
  ```bash CLI
  curl -sSo vision-example.jpg \
    https://platform.claude.com/docs/images/vision-example.jpg

  # First, upload your image to the Files API
  ant files upload --file ./vision-example.jpg

  # Then use the file_id from the upload response in your message
  ant messages create <<YAML
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: image
          source:
            type: file
            file_id: $FILE_ID
        - type: text
          text: Describe this image.
  YAML
  ```
</CodeGroup>

See [Messages API examples](https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli) for more example code and parameter details.

### Multiple images

You can include multiple images in a single request, and Claude analyzes them jointly. This is useful for comparing images, asking about differences, or working with a sequence such as pages of a document. When sending several images, introduce each one with a short text label (`Image 1:`, `Image 2:`, and so on) so you can refer to them by name in your prompt and in follow-up turns.

<CodeGroup>
  ```bash CLI
  ant messages create <<'YAML'
  model: claude-opus-5-5
  max_tokens: 1024
  messages:
    - role: user
      content:
        - type: text
          text: "Image 1:"
        - type: image
          source:
            type: base64
            media_type: image/png
            data: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC
        - type: text
          text: "Image 2:"
        - type: image
          source:
            type: base64
            media_type: image/png
            data: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYPgPAAEDAQAIicLsAAAAAElFTkSuQmCC
        - type: text
          text: How are these images different?
  YAML
  ```
</CodeGroup>

In a multi-turn conversation, add new images in later `user` turns the same way. Claude has access to every image from earlier turns, so follow-up questions such as “Are these similar to the first two?” work without including the earlier images again in the new turn’s content.

***

## Image limits and costs

### Request limits

The maximum number of images for each message or request is:

* 20 for each message on [claude.ai](https://claude.ai/)
* 100 for each request on the API, for models with a 200k-token context window
* 600 for each request on the API, for all other models

The maximum dimensions for each image are 8000x8000 px.

If a single API request contains more than 20 images, a stricter per-image dimension limit applies to every image in that request. All `image` blocks in the request count toward this threshold, including images from earlier conversation turns that you resend and images nested inside `tool_result` content (for example, screenshots returned to the computer use tool). On Amazon Bedrock and Claude Models on Google Cloud (Google managed), document blocks such as PDFs also count toward this threshold. Images exceeding the stricter limit are rejected with an `invalid_request_error` whose message references “many-image requests” and states the current limit in pixels. To stay under the limit on all platforms, either resize each image so that neither dimension exceeds 3,000 px, or keep the request to 20 or fewer image and document blocks.

The maximum size per image is:

* 10 MB (base64-encoded) on the Claude API and Claude Models on Google Cloud (Google managed).
* 5 MB (base64-encoded) on Amazon Bedrock.
* 10 MB on [claude.ai](https://claude.ai/).

<Note>
  Although the API supports up to 600 images for each request, [request size limits](https://platform.claude.com/docs/en/api/overview?sdk_languages=cli#request-size-limits) can be reached first. The limit is 128 MB on the first-party Claude API, and other platforms have their own limits. For many images, consider [uploading with the Files API](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#files-api-image-example) and referencing by `file_id` to keep request payloads small.

  Even when using the Files API, requests with many large images can fail before reaching the 600-image count. Reduce image dimensions or file sizes (for example, by downsampling) before uploading (see [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size)).
</Note>

### Supported formats

Claude supports JPEG, PNG, GIF, and WebP images (`image/jpeg`, `image/png`, `image/gif`, `image/webp`). Animations are unsupported, and only the first frame is used.

### Resolution and token cost

Claude processes images in patches instead of pixels. Each patch is a 28×28-pixel block of the image, referred to as a visual token. An image, therefore, costs `⌈width / 28⌉ × ⌈height / 28⌉` visual tokens.

Each model has a maximum native image resolution, expressed as a long-edge limit and a visual-token limit. Images larger than either limit are downscaled before processing; see [How Claude resizes and pads images](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#how-claude-resizes-and-pads-images) for the exact rule. The exception is screenshots and zoom images that you return to the [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#handle-coordinate-scaling-for-higher-resolutions) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli#targets-and-coordinates) toolsets: the API rejects a `tool_result` image that exceeds the model’s limits with a validation error instead of downscaling it, so resize those images in your application before returning them. To have any other oversized image rejected with an error instead of downscaled, set the image block’s [`transformations` field](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#oversized-image-error).

| Resolution tier | Models                      | Max long edge | Max visual tokens |
| --------------- | --------------------------- | ------------- | ----------------- |
| High-resolution | Claude 4.7 and later models | 2,576 px      | 4,784             |
| Standard        | All other models            | 1,568 px      | 1,568             |

High-resolution support is automatic on the listed models and requires no beta header or client-side opt-in.

The following table shows the downsized resolution and visual-token cost for several image sizes on each tier:

| Image size                     | Standard tier: downsized to | Standard tier: tokens | High-resolution tier: downsized to | High-resolution tier: tokens |
| ------------------------------ | --------------------------- | --------------------- | ---------------------------------- | ---------------------------- |
| 200x200 px (0.04 megapixels)   | Not resized                 | 64                    | Not resized                        | 64                           |
| 1000x1000 px (1 megapixel)     | Not resized                 | 1,296                 | Not resized                        | 1,296                        |
| 1092x1092 px (1.19 megapixels) | Not resized                 | 1,521                 | Not resized                        | 1,521                        |
| 1920x1080 px (2.07 megapixels) | 1456x819 px                 | 1,560                 | Not resized                        | 2,691                        |
| 2000x1500 px (3 megapixels)    | 1269x952 px                 | 1,564                 | Not resized                        | 3,888                        |
| 3840x2160 px (8.29 megapixels) | 1456x819 px                 | 1,560                 | 2576x1449 px                       | 4,784                        |

When an image is downsized, Claude scales it to the largest size that fits the tier’s limits while preserving its aspect ratio. This caps the token cost. For the precise rule and a reference implementation, see [How Claude resizes and pads images](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#how-claude-resizes-and-pads-images).

To estimate cost, multiply the token count by the [per-token price of the model](https://claude.com/pricing) you’re using. For example, at Claude Haiku 4.5’s $1 USD per million input tokens (standard tier), the 1000×1000 image costs about $1.30 USD per thousand images. At Claude Opus 5.5’s $4 USD per million (high-resolution tier), the same image costs about $5.18 USD per thousand and the 4K image about $19.14 USD per thousand.

High-resolution images can use up to roughly three times more visual tokens than the same image on a standard-tier model. If you don’t need the additional fidelity that high resolution provides for computer use, screenshot understanding, and dense documents, downsample images before sending to control token costs. To minimize latency and to simplify [coordinate-based workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli), prefer resizing images before uploading them.

### Image quality guidance

When providing images to Claude, keep the following in mind for best results:

* **Image clarity:** Ensure images are clear and not too blurry or pixelated.
* **Text:** If the image contains important text, make sure it’s legible and not too small. Avoid cropping out key visual context solely to enlarge the text.
* **Resizing:** Take into account that your image might be resized if it is too large (see [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size)); this might, for example, make text less legible. Consider pre-resizing your images, cropping them, or both. To have an oversized image rejected with an error instead of resized (important for [coordinate workflows](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli)), mark the image block with [`"oversized_image": "error"`](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#oversized-image-error).
* **Image compression:** Compressing images before sending them, using a lossy format such as JPEG or WebP (lossy mode), can reduce latency by reducing the size of requests. However, this can introduce artifacts that are detrimental to model performance, especially when multiple compression passes are applied. For example, heavy JPEG compression can make text difficult to read. Confirm your compression settings are appropriate for the task by inspecting the actual images sent to the API.

***

## Coordinates and bounding boxes

For bounding boxes, points, and pixel coordinates, see [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli). Claude returns absolute pixel coordinates relative to the image it processes after resizing; that guide covers how Claude resizes and pads images and how to pre-resize or rescale so coordinates line up with your original image.

***

## Limitations

Although Claude’s image understanding capabilities are advanced, there are some limitations to be aware of:

* **People identification:** Claude cannot be used to name people in images and refuses to do so (see the [Usage Policy](https://www.anthropic.com/legal/aup)).
* **Accuracy:** Claude might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels.
* **Spatial reasoning:** Claude’s coordinate and localization outputs are approximate. Follow the guidance in [Coordinates and bounding boxes](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli) and verify outputs before relying on them.
* **Counting:** Claude can give approximate counts of objects in an image but might not always be precisely accurate, especially with large numbers of small objects.
* **AI-generated images:** Claude cannot determine whether an image is AI-generated and might be incorrect if asked. Do not rely on it to detect fake or synthetic images.
* **Inappropriate content:** Claude does not process inappropriate or explicit images that violate the [Usage Policy](https://www.anthropic.com/legal/aup).
* **Healthcare applications:** Although Claude can analyze general medical images, it is not designed to interpret complex diagnostic scans such as CTs or MRIs. Claude’s outputs should not be considered a substitute for professional medical advice or diagnosis.

Always carefully review and verify Claude’s image interpretations, especially for high-stakes use cases. Do not use Claude for tasks requiring perfect precision or sensitive image analysis without human oversight.

***

## FAQ

<AccordionGroup>
  <Accordion title="What image file types does Claude support?">
    JPEG, PNG, GIF, and WebP. See [Supported formats](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#supported-formats).
  </Accordion>

  <Accordion title="Can Claude read image URLs?">
    Yes. Use the `url` source type instead of `base64` in the `image` content block. See the [URL-based image example](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#url-based-image-example).
  </Accordion>

  <Accordion title="Is there a limit to the image file size I can upload?">
    Yes. See [Request limits](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#request-limits) for per-image and overall request size limits across the Claude API, Amazon Bedrock, Claude Models on Google Cloud (Google managed), and claude.ai.
  </Accordion>

  <Accordion title="How many images can I include in one request?">
    Up to 600 for each API request (100 for models with a 200k-token context window) and 20 for each turn on claude.ai. See [Request limits](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#request-limits) for details and the lower per-image dimension limit that applies above 20 images.
  </Accordion>

  <Accordion title="Does Claude read image metadata?">
    No, Claude does not parse or receive any metadata from images passed to it.
  </Accordion>

  <Accordion title="Can I delete images I’ve uploaded?">
    No. Image uploads are ephemeral and not stored beyond the duration of the API request. Uploaded images are automatically deleted after they have been processed.
  </Accordion>

  <Accordion title="Where can I find details on data privacy for image uploads?">
    Refer to the Anthropic privacy policy page for information on how uploaded images and other data are handled. Anthropic does not use uploaded images to train models.
  </Accordion>

  <Accordion title="What if Claude’s image interpretation seems wrong?">
    If Claude’s image interpretation seems incorrect:

    1. Ensure the image is clear, high-quality, and correctly oriented.
    2. Try prompt engineering techniques to improve results.
    3. If the issue persists, flag the output in claude.ai (thumbs up/down) or contact the [support team](https://support.claude.com/).

    Your feedback helps improve Claude!
  </Accordion>

  <Accordion title="Can Claude generate or edit images?">
    No, Claude is an image understanding model only. It can interpret and analyze images, but it cannot generate, produce, edit, manipulate, or create images.
  </Accordion>
</AccordionGroup>

***

## Next steps

<CardGroup cols={2}>
  <Card title="Multimodal recipe" icon="image" href="https://platform.claude.com/cookbook/multimodal-getting-started-with-vision">
    Get tips and best-practice techniques for tasks such as interpreting charts and extracting content from forms.
  </Card>

  <Card title="API reference" icon="code" href="https://platform.claude.com/docs/en/api/messages/create?sdk_languages=cli">
    See the Messages API documentation, including example API calls involving images.
  </Card>
</CardGroup>

## Availability

Vision (images) is available on every model.

### API support

#### [Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages?sdk_languages=cli)

* Availability: Always on

| Status                | Cloud platforms                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Available             | Claude API, [Claude Platform on AWS](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws?sdk_languages=cli), [Claude Models on Google Cloud (Anthropic managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/anthropic-managed?sdk_languages=cli), [Microsoft Foundry](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry?sdk_languages=cli) |
| Available<sup>1</sup> | [Amazon Bedrock](https://platform.claude.com/docs/en/build-with-claude/claude-in-amazon-bedrock?sdk_languages=cli), [Amazon Bedrock (InvokeModel)](https://platform.claude.com/docs/en/build-with-claude/claude-on-amazon-bedrock-legacy?sdk_languages=cli), [Claude Models on Google Cloud (Google managed)](https://platform.claude.com/docs/en/build-with-claude/claude-models-on-google-cloud/google-managed?sdk_languages=cli)          |

1. Only base64 image sources; per-image limit 5 MB (base64-encoded) and a lower total request size.

#### [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview?sdk_languages=cli)

* Availability: Always on

| Status    | Cloud platforms         |
| --------- | ----------------------- |
| Available | All supported platforms |
