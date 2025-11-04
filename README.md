# Lab 8 – AI Service Layer (Eliza, OpenAI, Gemini R&D)

## Overview

This lab demonstrates building a modular chat application that uses a Service Layer pattern to switch between multiple AI providers. The project shows how a frontend (MVC) interacts with a backend service layer that dynamically selects an AI provider implementation.

- The main backend integrates three providers: Mock, Eliza, and OpenAI.
- The `r-n-d` folder contains experimental Gemini testing code for research and is not wired into the main application.

## Architecture

Frontend (MVC)
- Model: `src/js/model.js` — app state and data structures.
- View: `src/index.html`, `src/js/view.js`, `src/styles.css` — UI rendering and styling.
- Controller: `src/js/controller.js`, `src/js/app.js` — user interactions, provider selection, and requests to the backend.

Backend
- Entry: `backend/src/index.js` — starts the Express server and mounts routes.
- Routes: `backend/src/routes/aiRouter.js` — receives client requests at `/api/ai/respond`.
- Providers: `backend/src/providers/` contains implementations:
	- `mockProvider.js` — deterministic/mock responses for testing.
	- `elizaProvider.js` — an Eliza-style chatbot implementation.
	- `openaiProvider.js` — a thin wrapper that forwards requests to the OpenAI API.
- Provider Hub: `backend/src/providers/providerHub.js` dynamically loads and returns the appropriate provider implementation based on input (e.g., `mock`, `eliza`, `openai`).

Client-to-backend flow
- The frontend lets the user choose a provider from a dropdown. When a message is sent, the frontend calls `fetch('/api/ai/respond', ...)` with the selected provider and message payload. The backend resolves the provider via `providerHub` and returns the provider response.

## Bring-Your-Own-Key (BYOK)

OpenAI API keys are handled on the client only. Important details:

- When a user selects the OpenAI provider, the UI prompts the user once to paste their OpenAI key.
- The client validates that the key begins with the `sk-` prefix before accepting it.
- The key is stored locally in `localStorage` (so it persists across page reloads) and is never sent to the server except when making OpenAI requests.
- For requests that target OpenAI, the client sends the key in a custom header: `x-user-openai-key: <user-key>`.
- The backend never stores or persists user API keys — it only reads the header for a single request cycle and passes the key to the provider's outgoing API call.

Security note: Since keys exist only in the browser `localStorage` and are sent per-request, do not paste or share your key in public repos or screenshots.

## Installation & Running

1. Install dependencies in the project root and backend:

```bash
npm install
cd backend
npm install
cd ..
```

2. Run the backend server:

```bash
node backend/src/index.js
```

3. Start the frontend dev server (project uses a simple static server / dev script):

```bash
npm run dev
```

4. Open the app in your browser:

```
http://localhost:8787
```

(If your environment uses a different port, use that port instead.)

## Testing (Playwright)

This project includes Playwright-based end-to-end tests located in `tests/`:

- `ai-mock.spec.js` — tests using the mock provider.
- `ai-eliza.spec.js` — tests Eliza provider behavior.
- `ai-openai.spec.js` — tests OpenAI usage with mocked responses.
- `ai-openai-live.spec.js` — an integration test that calls the real OpenAI API (requires a real API key).

To run tests:

```bash
npx playwright test
```

Notes:
- The live OpenAI test requires you to set `OPENAI_API_KEY` in your environment prior to running tests (see below). Keep in mind live tests will use real API quota and may be slower.

## Gemini R&D (experimental)

The `r-n-d/gemini` folder contains an experimental script `testGemini.js` that demonstrates using the `@google/generative-ai` client library. This is research code only and is not integrated into the main app.

To run the experiment:

```bash
cd r-n-d/gemini
npm install @google/generative-ai
export GEMINI_API_KEY="your-key"
node testGemini.js
```

If you are on Windows PowerShell, set the environment variable like this instead:

```powershell
$env:GEMINI_API_KEY = "your-key"
node testGemini.js
```

This script is not wired to the main frontend/backend — it is for exploration only.

## Security Notes

- Never commit API keys or secrets to version control.
- Ensure your local `.gitignore` covers local environment or config files that may contain secrets.
- The backend is designed to avoid persisting user-supplied API keys; if you change this behavior, perform a security review.

## Credits / Author

Yesin Qasem 



