// Minimal Express server to talk to a local Ollama instance
// and provide a beginner-friendly REST API for:
// - Health check (is Ollama running? which models are available?)
// - Chat completions (simple, non-streaming)
// - Embeddings (using an embeddings model, e.g. nomic-embed-text)
// - Tiny in-memory RAG demo (add/query text chunks with cosine similarity)
//
// Requirements:
// - Node.js v18+ (uses built-in fetch)
// - Ollama app running locally (macOS: usually auto-starts). Otherwise run: `ollama serve`
// - Ensure you have at least one chat model (e.g. `gpt-oss:20b`) and one embedding model
//   (e.g. `nomic-embed-text`) pulled via `ollama pull <model>`.

import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// Config: Ports and default models
const PORT = process.env.PORT ? Number(process.env.PORT) : 5175
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-oss:20b'
const DEFAULT_EMBED_MODEL = process.env.EMBED_MODEL || 'nomic-embed-text'

// In-memory vector store for the RAG demo
// Each entry: { id: string, text: string, embedding: number[] }
const vectorStore = []

// Helper: cosine similarity between two equal-length vectors
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    const x = a[i]
    const y = b[i]
    dot += x * y
    na += x * x
    nb += y * y
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb)
  return denom ? dot / denom : 0
}

// Helper: POST to Ollama
async function ollama(path, body) {
  const res = await fetch(`${OLLAMA_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ollama error ${res.status}: ${text}`)
  }
  return res
}

// Health: check Ollama and list installed models
app.get('/api/ollama/health', async (req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`)
    if (!r.ok) throw new Error(`status ${r.status}`)
    const data = await r.json()
    res.json({ ok: true, models: data.models || [] })
  } catch (err) {
    res.status(200).json({ ok: false, error: String(err) })
  }
})

// Chat: non-streaming for simplicity
// body: { model?: string, messages: [{role: 'user'|'system'|'assistant', content: string}], options? }
app.post('/api/ollama/chat', async (req, res) => {
  const { model = DEFAULT_CHAT_MODEL, messages = [], options } = req.body || {}
  try {
    const response = await ollama('/api/generate', {
      model,
      messages,
      stream: false,
      options
    })
    const json = await response.json()
    // json: { message: { role, content }, ... }
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Embeddings: returns { embedding: number[] }
// body: { model?: string, input: string }
app.post('/api/ollama/embeddings', async (req, res) => {
  const { model = DEFAULT_EMBED_MODEL, input } = req.body || {}
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Provide { input: string }' })
  }
  try {
    const response = await ollama('/api/embeddings', { model, prompt: input })
    const json = await response.json()
    // json: { embedding: number[] }
    res.json(json)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// RAG: reset store
app.post('/api/rag/reset', (req, res) => {
  vectorStore.length = 0
  res.json({ ok: true })
})

// RAG: add texts -> embed -> store
// body: { texts: string[], model?: string }
app.post('/api/rag/add', async (req, res) => {
  const { texts, model = DEFAULT_EMBED_MODEL } = req.body || {}
  // Validate input and embed each text, then store in vectorStore
  if (!Array.isArray(texts) || texts.length === 0) {
    return res.status(400).json({ error: 'Provide { texts: string[] }' })
  }
  try {
    const results = []
    for (const text of texts) {
      const r = await ollama('/api/embeddings', { model, prompt: text })
      const { embedding } = await r.json()
      // Creates a new object 'item' with a unique 'id' (combining the current timestamp and a random string),
      // and includes the 'text' and 'embedding' properties.
      // Example id: "1717691234567-abc123"
      const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, embedding }
      vectorStore.push(item)
      results.push(item)
    }
    res.json({ added: results.length })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// RAG: query -> find topK by cosine similarity -> optional local answer
// body: { query: string, topK?: number, embedModel?: string, chatModel?: string }
app.post('/api/rag/query', async (req, res) => {
  const { query, topK = 3, embedModel = DEFAULT_EMBED_MODEL, chatModel = DEFAULT_CHAT_MODEL } = req.body || {}
  if (!query) return res.status(400).json({ error: 'Provide { query: string }' })
  if (vectorStore.length === 0) return res.json({ matches: [], answer: null, note: 'Vector store empty. Add some texts first.' })

  try {
    // 1) Embed the query
    const r = await ollama('/api/embeddings', { model: embedModel, prompt: query })
    const { embedding: queryEmb } = await r.json()

    // 2) Score all docs
    // For every stored document, compute how similar it is to the query
    // by using cosine similarity between the query vector and doc vector.
    const scored = vectorStore.map(doc => ({
      // Keep a reference to the original document (so we can return its id/text later)
      doc,
      // Higher score = more similar. Cosine similarity is typically in [-1, 1].
      score: cosineSimilarity(queryEmb, doc.embedding)
    }))
    // Sort from highest score (most similar) to lowest (least similar)
    scored.sort((a, b) => b.score - a.score)
    // Keep only the top K results (or fewer if we have less than K docs)
    const matches = scored.slice(0, Math.min(topK, scored.length))

  // 3) Build a very simple prompt with the top contexts
  // Turn the top-matching documents into a bullet list, each on its own line.
  // Example:
  // - Fact 1
  // - Fact 2
  const context = matches.map(m => `- ${m.doc.text}`).join('\n')
  // Compose the final user message:
  // - Give the model a clear instruction to use only the provided context
  // - Show the Context section (the bullet list we just built)
  // - Ask the actual Question at the end
  const userPrompt = `Use the provided context to answer the question.\n\nContext:\n${context}\n\nQuestion: ${query}`

    const chatRes = await ollama('/api/chat', {
      model: chatModel,
      stream: false,
      messages: [
        { role: 'system', content: 'You are a concise assistant. If context is insufficient, say so.' },
        { role: 'user', content: userPrompt }
      ]
    })
    const chatJson = await chatRes.json()
    const answer = chatJson?.message?.content || ''

    res.json({
      matches: matches.map(m => ({ id: m.doc.id, text: m.doc.text, score: m.score })),
      answer
    })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`)
  console.log(`[server] Using Ollama at ${OLLAMA_URL}`)
  console.log(`[server] Default chat model: ${DEFAULT_CHAT_MODEL}`)
  console.log(`[server] Default embed model: ${DEFAULT_EMBED_MODEL}`)
})
