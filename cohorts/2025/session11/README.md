# Local LLMs with Ollama — Mini Workshop

This repo is a beginner-friendly demo to run open-source Large Language Models (LLMs) locally with [Ollama](https://ollama.com/) and build tiny apps:

- Check if Ollama is running and which models are installed
- Chat with a local model (e.g., `gpt-oss:20b`)
- Create embeddings and do a tiny in-memory RAG example
- Build a custom model using a `Modelfile`
- Optional: browser-side embeddings (transformers.js) and HuggingFace Inference

The UI is a simple React app (Vite). The API is a tiny Express server that talks to your local Ollama.

## Prerequisites

- macOS/Windows/Linux
- Node.js 18+
- Ollama installed and running locally
  - Download from https://ollama.com/ and open the app (or run `ollama serve`)
  - Pull at least one chat model, e.g.:
    - `ollama pull gpt-oss:20b`
  - Pull an embeddings model:
    - `ollama pull nomic-embed-text`

## Install & Run

1. Install dependencies

```bash
npm install
```

2. Start both the API server and the Vite dev server

```bash
npm run dev:all
```

- UI: http://localhost:5173
- API: http://localhost:5175 (proxied at `/api` from the UI)

If you prefer running separately:

```bash
npm run server
npm run dev
```

## What’s Inside

- `server/index.js` — Express API for:
  - `GET /api/ollama/health` — check Ollama and list models
  - `POST /api/ollama/chat` — simple non-streaming chat
  - `POST /api/ollama/embeddings` — text → vector
  - RAG demo:
    - `POST /api/rag/reset` — clear in-memory store
    - `POST /api/rag/add` — add texts, store embeddings
    - `POST /api/rag/query` — search by similarity and answer with context
- `src/App.jsx` — Minimal UI panels (Status, Chat, RAG, Extras)
- `ollama/Modelfile` — Example of building a custom model
- `vite.config.js` — Dev server proxy `/api` → `http://localhost:5175`

## Quick API Tests (curl)

Health:

```bash
curl http://localhost:5175/api/ollama/health | jq
```

Chat:

```bash
curl -s http://localhost:5175/api/ollama/chat \
	-H 'content-type: application/json' \
	-d '{
		"model": "gpt-oss:20b",
		"messages": [
			{"role":"user","content":"Say hi in one sentence"}
		]
	}' | jq
```

Embeddings:

```bash
curl -s http://localhost:5175/api/ollama/embeddings \
	-H 'content-type: application/json' \
	-d '{"input":"Embeddings are useful for search."}' | jq
```

RAG (reset, add, query):

```bash
curl -s -X POST http://localhost:5175/api/rag/reset | jq
curl -s -X POST http://localhost:5175/api/rag/add -H 'content-type: application/json' \
	-d '{"texts":["Ollama runs AI models locally.","Embeddings map text to vectors."]}' | jq
curl -s -X POST http://localhost:5175/api/rag/query -H 'content-type: application/json' \
	-d '{"query":"How do I run models locally?"}' | jq
```

## Build a Custom Model (Modelfile)

`ollama/Modelfile` shows how to base on `gpt-oss:20b` and set a helpful system prompt. To build and run:

```bash
cd ollama
ollama create workshop-assistant -f Modelfile
ollama run workshop-assistant
```

Then use it in the app by setting the model to `workshop-assistant` in the Chat panel.

## Notes

- Ollama: A local runtime for open models. Good for privacy, offline use, and fast experimentation.
- Models: Try different ones (Mistral, LLaMA, CodeLlama). Larger models need more RAM/VRAM.
- Embeddings: Turn text into vectors. Similar text → similar vectors. Enables semantic search.
- Vector DB: Specialized stores for vectors (e.g., Pinecone, Chroma, Weaviate). Here we use an in-memory array for clarity.
- RAG: Retrieve relevant chunks (via embeddings) and pass them into the model as context.

## Extras (Optional)

Browser embeddings with transformers.js:

```bash
npm i @xenova/transformers
```

Example code (very simplified):

```js
import { pipeline } from "@xenova/transformers";
const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);
const output = await extractor("hello world");
// output.data is a Float32Array. Do mean-pooling across tokens to get a single vector.
```

HuggingFace Inference API:

```bash
export HF_TOKEN=your_token_here
```

Then call their endpoints (see https://huggingface.co/docs/api-inference). Keep tokens private.

## Troubleshooting

- If health check shows `{ ok: false }`, ensure the Ollama app is open or run `ollama serve`.
- If chat fails, confirm the model name exists (`ollama list`). Pull it if needed.
- If ports conflict, edit `vite.config.js` (5173) or `server/index.js` (5175).

---

Have fun exploring local LLMs!
