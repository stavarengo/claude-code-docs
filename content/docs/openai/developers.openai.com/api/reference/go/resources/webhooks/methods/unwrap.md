## 

`client.Webhooks.Unwrap(ctx) error`

**** ``

Validates that the given payload was sent by OpenAI and parses the payload.

### Example

```go
package main

import (
  "context"

  "github.com/openai/openai-go"
  "github.com/openai/openai-go/option"
)

func main() {
  client := openai.NewClient(
    option.WithAPIKey("My API Key"),
  )
  err := client.Webhooks.Unwrap(context.TODO())
  if err != nil {
    panic(err.Error())
  }
}
```
