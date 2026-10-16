---
title: Coordinates and bounding boxes
url: https://platform.claude.com/docs/en/build-with-claude/vision-coordinates
description: How Claude resizes images, and how to work with the pixel coordinates it returns for bounding boxes, points, and UI elements.
---

Claude can locate and label regions of an image (for example, returning bounding boxes for tables, form fields, chart elements, or UI components). This guide covers how Claude resizes images before processing them and how to work with the pixel coordinates it returns, so that boxes and points line up with your original image.

You'll need this for OCR pipelines, form extraction, chart parsing, UI element location, and any task where you act on a specific region of an image. For sending images, supported formats, and per-model resolution limits, see [Vision](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli).

<Note>
  **Claude works best with absolute pixel coordinates.** Ask for them explicitly in your prompt. For example: *"Return the bounding box of each table as `[x1, y1, x2, y2]` (top-left and bottom-right corners) in pixel coordinates."* Claude does not work well when you ask for normalized coordinates, for example: *"Return bounding box coordinates between `0` and `1000`."* Always ask for pixel coordinates and normalize in your own code if you need to. To get coordinates as machine-readable JSON instead of prose, define a schema with [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs?sdk_languages=cli), for example an object with an `[x1, y1, x2, y2]` array per detected element.
</Note>

Coordinates follow the standard image convention: the origin `(0, 0)` is the top-left corner of the image, with x increasing to the right and y increasing downward. The coordinates Claude returns are pixel positions in the image Claude sees: your image after Claude resizes it to fit the model's native resolution (see [How Claude resizes and pads images](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#how-claude-resizes-and-pads-images)). To get coordinates you can use directly, either pre-resize your image so the coordinates map one-to-one onto the image you have (see [Resize your image before uploading](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#resize-your-image-before-uploading)), or rescale the coordinates Claude returns (see [Rescale coordinates when you cannot pre-resize](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#rescale-coordinates-when-you-cannot-pre-resize)).

<Note>
  Claude's spatial reasoning has limits (see [Limitations](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#limitations)). Coordinate accuracy is best when you state the expected coordinate format in your prompt and spot-check results visually before processing at scale. Small elements lose precision when an image is downscaled: for fine targets, crop the region of interest and send the crop (offset returned coordinates by the crop origin), or use a high-resolution-tier model. For [PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli), pages are rasterized to images server-side at dimensions you don't control, so the returned coordinates can't be reliably mapped back onto the page. To work with coordinates on PDF content, rasterize the pages to images yourself and use the pre-resize approach.
</Note>

## How Claude resizes and pads images

Claude finds the largest aspect-preserving size that satisfies both of the model's image limits:

1. **Edge limit:** neither side exceeds the maximum edge length (1568 px on the standard tier, 2576 px on the high-resolution tier).
2. **Visual token limit:** the image's token cost `⌈width / 28⌉ × ⌈height / 28⌉` does not exceed the model's visual token budget (1568 tokens on the standard tier, 4784 on the high-resolution tier).

See [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size) for which models are in which tier.

For nearly all photos and screenshots, the visual token limit is what determines the final size. The edge limit takes over only for elongated images such as panoramas or tall phone screenshots. Compute the size with the [reference implementation](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#resize-your-image-before-uploading) rather than scaling to the edge length by hand: a 1920×1080 screenshot resizes to 1456×819, not 1568×882, and assuming the edge limit puts every coordinate noticeably off target.

The token limit can also trigger a resize when neither side exceeds the edge limit. Overlooking this is the most common cause of misaligned coordinates. For example, an A4 page scanned at 130 DPI is 1075×1520 pixels: both sides are under 1568 px, but it costs `39 × 55 = 2145` visual tokens, so Claude resizes it to 924×1307.

<Note>
  This example assumes a model on the standard resolution tier. A high-resolution-tier model doesn't resize the same scan: 2145 tokens is within its 4784-token budget, so the coordinates it returns map directly onto the 1075×1520 original. Model tiers are listed in [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size).
</Note>

Claude then pads every image, resized or not, up to the next multiple of 28 pixels on the bottom and right edges (924×1307 becomes 924×1316 in the example). The padding contains no content: Claude perceives the padded image, but the page content only ever occupies the un-padded resized region. **Always normalize or rescale by the resized dimensions, not the padded dimensions**; dividing by the padded dimensions scales every coordinate by a small amount.

## Resize your image before uploading

The most reliable approach is to resize your image yourself before uploading, so the image you have is exactly the image Claude sees and the coordinates Claude returns need no conversion.

First check which resolution tier your model is on (see [Resolution and token cost](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#evaluate-image-size)) and pass the matching edge and token limits. The following reference implementation computes the exact size Claude resizes an image to:

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    Compute this size in code.
  </CodeGroupItem>
</CodeGroup>

1. Resize the image to the dimensions returned by the resize helper. If the image already fits within the model's limits, the helper returns its dimensions unchanged and no resize is needed.
2. [Send the resized image](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#send-images-to-claude) to the API. Don't pad it yourself. Claude handles padding, and padding doesn't shift the coordinate origin.
3. In your prompt, ask explicitly for pixel coordinates. For example: *"Return the click point for the Submit button as `[x, y]` in pixel coordinates."*
4. Use the returned coordinates directly against the image you sent. If you need normalized coordinates, divide by the dimensions of the image you sent, not by the original image's dimensions and not by the padded dimensions.

<Note>
  The [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) endpoint estimates an image's token cost from its dimensions without fully processing it, so a successful count doesn't mean the image is within the Messages API's [request limits](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#request-limits). An image can count successfully and still be rejected when you send it.
</Note>

## Turn resizing into an error with `transformations`

Pre-resizing only protects your coordinates while your pipeline keeps producing the right sizes. A new image source or a switch to a model on a different resolution tier can quietly reintroduce server-side resizing. To turn that silent drift into a visible error, set the optional `transformations` field on an image content block in a [Messages](https://platform.claude.com/docs/en/api/messages?sdk_languages=cli) request:

```json
{
  "type": "image",
  "source": { "type": "base64", "media_type": "image/png", "data": "..." },
  "transformations": { "oversized_image": "error" }
}
```

A request whose marked image (any block that sets `"oversized_image": "error"`) would be resized is rejected with a 400 `invalid_request_error` naming the image's dimensions and the largest dimensions that fit. Whether an image triggers the rejection depends on the [limits of every model the request names](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#how-claude-resizes-and-pads-images): the 1920×1080 example below is rejected by a standard-tier model but fits within the high-resolution tier:

```text wrap
messages.0.content.0: image dimensions 1920x1080 exceed the maximum image size of a model named on this request and would be downsized to 1456x819; scale the image to at most 1456x819 or set the image's oversized_image setting to "downsize"
```

Rescale to the reported target and resend: the target is the largest size, at your image's aspect ratio, that every model named on the request accepts. How marked images interact with the [server-side fallback beta](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback?sdk_languages=cli#server-side-fallback) is described with that feature; in every mode, a marked image is never served resized.

The setting is per image. `"oversized_image": "downsize"` (the default when the field is omitted) keeps automatic resizing as described on this page. Each image block is checked only against its own setting, so one request can mix images whose dimensions are load-bearing (a screenshot you'll click on) with images where resizing is harmless (a logo). What the setting does and does not change:

* Padding ([which never discards content](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#how-claude-resizes-and-pads-images)), format conversion, and orientation correction proceed as usual.
* The hard limits (8000 px on the longest side, and the stricter per-image limit on [many-image requests](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#request-limits)) are separate rejections; this setting never lets an image past them.
* Images supplied by URL or file ID are checked once their bytes have been fetched; those rejections carry the same message without the leading position, so they don't identify which image failed; only embedded base64 images are named by position in the error.
* [PDF pages](https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli) are rasterized server-side at dimensions you don't control; the `document` block does not accept the field (an image block nested inside a document's content accepts it like any other).
* A marked image whose dimensions cannot be determined is rejected rather than passed through: that rejection reports that the image's source dimensions could not be determined, not the resize message quoted above. No image that sets `"error"` reaches the model resized.

The [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli) endpoint honors `transformations` too, rejecting an embedded image exactly as the Messages API would, so you can check whether an embedded image fits without being resized, before running inference. Counting rejects images supplied by URL or file ID rather than fetching them, so a marked image from those sources is checked only at Messages time.

## Rescale coordinates when you cannot pre-resize

If you cannot pre-resize (for example, when the image comes from an upstream system you can't modify), use the resize helper from [Resize your image before uploading](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#resize-your-image-before-uploading) to recover the dimensions Claude saw, then map the coordinates Claude returns into normalized coordinates or back onto your original image. Unless an image [opts into an error instead](https://platform.claude.com/docs/en/build-with-claude/vision-coordinates?sdk_languages=cli#oversized-image-error), Claude resizes oversized images rather than rejecting them, up to the API's [request limits](https://platform.claude.com/docs/en/build-with-claude/vision?sdk_languages=cli#request-limits). Beyond those limits the request fails with a validation error instead. Pass the tier limits that match the model you called: the wrong tier's limits recover the wrong resized dimensions and silently shift every coordinate. This approach requires knowing the pixel dimensions of the image you uploaded, so it does not apply to PDF uploads.

Screenshots and zoom images that you return to the [computer use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#handle-coordinate-scaling-for-higher-resolutions) and [browser use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool?sdk_languages=cli#targets-and-coordinates) toolsets are an exception to automatic resizing. The API rejects a `tool_result` image that exceeds the model's limits with a validation error instead of resizing it. Resize those images in your application before returning them, then scale the coordinates Claude returns back to your screen's dimensions.

<CodeGroup exclude="shell">
  <CodeGroupItem language="CLI">
    Convert the coordinates in code.
  </CodeGroupItem>
</CodeGroup>

Padding is applied only to the bottom and right edges, so the origin doesn't shift and a per-axis linear rescale is sufficient. Clamp returned coordinates to the resized dimensions before rescaling, so a point slightly outside the image can't map outside your original.

The relative coordinates multiply against whatever surface you act on: the original image, a full-resolution scan, or a screen. When you act on a screen and screenshot pixels differ from logical coordinates (HiDPI displays), also divide by the display scale factor. The [Computer use tool's scaling guidance](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli#handle-coordinate-scaling-for-higher-resolutions) covers that pattern.

## Next steps

<CardGroup cols={2}>
  <Card title="Agent Skills" icon="stack" href="https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview?sdk_languages=cli">
    Agent Skills are modular capabilities that extend Claude's functionality. Each Skill packages instructions, metadata, and optional resources (scripts, templates) that Claude uses automatically when relevant.
  </Card>

  <Card title="Computer use tool" icon="computer" href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool?sdk_languages=cli">
    Give Claude screenshot, mouse, and keyboard control of a desktop environment with the computer use tool.
  </Card>

  <Card title="PDF support" icon="file" href="https://platform.claude.com/docs/en/build-with-claude/pdf-support?sdk_languages=cli">
    Process PDFs with Claude. Extract text, analyze charts, and understand visual content from your documents.
  </Card>

  <Card title="Token counting" icon="calculator" href="https://platform.claude.com/docs/en/build-with-claude/token-counting?sdk_languages=cli">
    Count the tokens in a message before you send it to Claude. Use token counts to manage rate limits and costs, make model routing decisions, and fit prompts to a target length.
  </Card>
</CardGroup>
