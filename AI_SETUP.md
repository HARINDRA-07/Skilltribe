# SherpAI Setup Instructions

## OpenAI API Configuration

To enable AI responses from SherpAI, you need to set up an OpenAI API key.

### Steps:

1. **Get an OpenAI API Key:**
   - Go to https://platform.openai.com/
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key

2. **Add API Key to messages.js:**
   - Open `miniproj/messages.js`
   - Find the line: `const OPENAI_API_KEY = '';`
   - Add your API key between the quotes:
     ```javascript
     const OPENAI_API_KEY = 'your-api-key-here';
     ```

3. **Important Notes:**
   - Never commit your API key to version control (Git)
   - The API key will be visible in the client-side code (not recommended for production)
   - For production use, create a backend proxy server to handle API calls securely

### Fallback Mode

If no API key is configured, SherpAI will use intelligent pattern-based responses as a fallback. This allows the chat to function even without an API key, though responses will be more limited.

### Alternative AI Services

You can modify the `generateSherpAIResponse` function in `messages.js` to use other AI services:
- Google Gemini API
- Anthropic Claude API
- Cohere API
- Hugging Face Inference API

Just update the API URL and request format accordingly.

