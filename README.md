# GPT Server

A simple Express.js server that provides an API endpoint for interacting with OpenAI's GPT-4o model.

## Prerequisites

- Node.js 18+ installed on your system
- An OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

   **Note for Windows PowerShell users:** If you encounter an execution policy error, either:
   - Use Command Prompt (cmd.exe) instead, or
   - Run in PowerShell as Administrator:
     ```powershell
     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
     ```

3. **Set up environment variables**

   Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

## Running the Server

**Development mode** (with auto-restart on file changes):
```bash
npm run dev
```

**Production mode**:
```bash
node index.js
```

The server will start on port 5000 (or your specified PORT) and display:
```
Server listening on port 5000
```

## API Endpoints

### GET /
Health check endpoint that lists available endpoints.

**Response:** `"Hello World. Available endpoints: /single-response, /system-context, /conversation"`

---

### POST /single-response

**Example 1: Single Response** - Basic user prompt without conversation history.

This demonstrates the simplest form of interaction with ChatGPT.

**Request body:**
```json
{
  "prompt": "What is JavaScript?"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Single response - basic user prompt",
  "data": "JavaScript is a programming language..."
}
```

**curl example:**
```bash
curl -X POST http://localhost:5000/single-response \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"What is JavaScript?\"}"
```

---

### POST /system-context

**Example 2: System Context** - Using a system message to set AI behavior and personality.

The system message sets the context for how the AI should respond. You can customize the AI's role, tone, and behavior.

**Request body:**
```json
{
  "prompt": "Explain what a variable is",
  "systemContext": "You are a helpful coding instructor. Explain concepts clearly with examples."
}
```

**Note:** If `systemContext` is not provided, it defaults to: "You are a helpful coding instructor. Explain concepts clearly with examples."

**Response (success):**
```json
{
  "success": true,
  "message": "Response with system context",
  "systemContextUsed": "You are a helpful coding instructor...",
  "data": "A variable is a container for storing data..."
}
```

**curl example:**
```bash
curl -X POST http://localhost:5000/system-context \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Explain what a variable is\", \"systemContext\": \"You are a friendly teacher who uses simple language.\"}"
```

---

### POST /conversation

**Example 3: Multi-step Conversation** - Maintains full conversation history for context.

This endpoint accepts an array of messages to maintain conversation context across multiple turns. The AI will remember previous messages and respond accordingly.

**Request body:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful coding instructor."
    },
    {
      "role": "user",
      "content": "What is a function?"
    },
    {
      "role": "assistant",
      "content": "A function is a reusable block of code..."
    },
    {
      "role": "user",
      "content": "Can you show me an example?"
    }
  ]
}
```

**Message roles:**

- `system` - Sets the AI's behavior (optional, but recommended as first message)
- `user` - Messages from the user
- `assistant` - Previous responses from the AI

**Response (success):**
```json
{
  "success": true,
  "message": "Multi-step conversation response",
  "data": "Sure! Here's an example of a function...",
  "fullConversation": [
    // ... all previous messages plus the new assistant response
  ]
}
```

**curl example:**
```bash
curl -X POST http://localhost:5000/conversation \
  -H "Content-Type: application/json" \
  -d "{\"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}, {\"role\": \"assistant\", \"content\": \"Hi! How can I help?\"}, {\"role\": \"user\", \"content\": \"Tell me about arrays\"}]}"
```

**Response (error - all endpoints):**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing

You can test the API using curl, Postman, or any HTTP client:

```bash
curl -X POST http://localhost:5000/letschat \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Hello, how are you?\"}"
```

## Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **dotenv** - Environment variable management
- **openai** - OpenAI API client
- **nodemon** - Development auto-restart (dev dependency)

## Storyline Integration

Three JavaScript trigger files are provided for use with Articulate Storyline:

### 1. storylinetrigger.js - Single Response
**Required Storyline Variables:**
- `userprompt` (Text) - The user's question/prompt
- `gptresponse` (Text) - Will be populated with AI response

**Usage:** Simple one-off questions without conversation history.

### 2. storylinetrigger-systemcontext.js - System Context
**Required Storyline Variables:**
- `userprompt` (Text) - The user's question/prompt
- `systemcontext` (Text) - Optional: Custom system message (uses default if empty)
- `gptresponse` (Text) - Will be populated with AI response
- `systemcontextused` (Text) - Will show which system context was used

**Usage:** Control AI personality/behavior with custom system messages.

### 3. storylinetrigger-conversation.js - Multi-step Conversation
**Required Storyline Variables:**
- `userprompt` (Text) - The user's current question/prompt
- `conversationhistory` (Text) - JSON string of conversation (auto-managed)
- `gptresponse` (Text) - Will be populated with AI response

**Usage:** Maintain context across multiple exchanges. The conversation history is automatically saved and updated.

**Important:** To reset a conversation, set `conversationhistory` to an empty string.

## Configuration

The server uses the following OpenAI API parameters:
- Model: `gpt-4o`
- Max tokens: 500
- Temperature: 0.5-0.7 (varies by endpoint)
- Frequency penalty: 0.5-0.75 (varies by endpoint)

These can be modified in [index.js](index.js).

## License

ISC
