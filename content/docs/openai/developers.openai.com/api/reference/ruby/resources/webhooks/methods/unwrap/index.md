## 

`webhooks.unwrap() -> void`

**** ``

Validates that the given payload was sent by OpenAI and parses the payload.

### Example

```ruby
require "openai"

openai = OpenAI::Client.new(api_key: "My API Key")

result = openai.webhooks.unwrap

puts(result)
```
