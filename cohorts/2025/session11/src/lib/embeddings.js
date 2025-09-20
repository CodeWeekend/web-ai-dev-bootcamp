// Optional browser embeddings using transformers.js
// Install first: npm i @xenova/transformers
// This file provides a tiny wrapper that:
// - Lazy-loads the library on first use
// - Builds a feature-extraction pipeline
// - Applies mean pooling to get a single vector per sentence

let extractor = null

export async function getExtractor(modelId = 'Xenova/all-MiniLM-L6-v2') {
  if (extractor) return extractor
  // Dynamic import so the app still runs if package not installed
  const { pipeline } = await import('@xenova/transformers')
  extractor = await pipeline('feature-extraction', modelId)
  return extractor
}

// Compute a single vector embedding for a piece of text
export async function embed(text) {
  if (!text || !text.trim()) return []
  const pipe = await getExtractor()
  const output = await pipe(text)
  // output.data: Float32Array shaped [tokens, dims] or flattened
  // We handle both cases by detecting 2D or 1D and mean-pooling over tokens
  if (Array.isArray(output.data)) {
    // Already array-like; convert to Float32Array
    return meanPoolFlat(new Float32Array(output.data), output.dims)
  } else {
    return meanPoolFlat(output.data, output.dims)
  }
}

function meanPoolFlat(flat, dims) {
  // dims could be [tokens, dim] or just dim
  if (!Array.isArray(dims) || dims.length < 2) {
    // Already a single vector
    return Array.from(flat)
  }
  const [tokens, dim] = dims
  const out = new Float32Array(dim)
  for (let t = 0; t < tokens; t++) {
    for (let d = 0; d < dim; d++) {
      out[d] += flat[t * dim + d]
    }
  }
  for (let d = 0; d < dim; d++) out[d] /= tokens
  return Array.from(out)
}
