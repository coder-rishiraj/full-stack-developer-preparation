import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Reranking re-scores initial retrieval candidates with a cross-encoder or lightweight model that jointly encodes query + document—producing better ordering than bi-encoder cosine alone for top-N precision.",
  whyExists: "Bi-encoders embed query and doc separately—fast but shallow interaction. Reranking on top-50→top-5 dramatically improves answer quality before LLM context window fills with noise.",
  mentalModel: "Retrieval casts a wide net (bi-encoder/BM25); reranker reads query+each candidate together like a relevance judge—expensive per pair but only on N candidates.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Retrieve k=50–200 with bi-encoder or hybrid.",
        "Cross-encoder scores each (query, chunk) pair.",
        "Sort by rerank score; take top 5–10 for LLM context.",
        "Optional cascade: cheap reranker then expensive one.",
        "Cache rerank scores for repeated queries if applicable.",
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Query \"disable 2FA\" retrieves generic security pages at rank 1–3; cross-encoder promotes exact \"two-factor settings\" chunk to rank 1.",
    },
  ],
  production: {
    performance: [
      "Budget 100–300ms for rerank stage",
    ],
    cost: [
      "Cross-encoder GPU cost per query",
    ],
  },
  tradeoffs: {
    advantages: [
      "Large precision gain",
      "Fixes bi-encoder misses",
    ],
    disadvantages: [
      "Latency + compute",
      "Not for huge N",
    ],
    alternatives: [
      "ColBERT late interaction",
      "LLM listwise rerank",
    ],
    whenToUse: [
      "Quality-critical RAG",
    ],
    whenNotToUse: [
      "Ultra-low latency without GPU",
    ],
  },
  failureModes: [
    "N too small misses true doc",
    "N too large blows latency",
    "Domain mismatch reranker model",
  ],
  interview: {
    expectations: [
      "Bi vs cross-encoder",
      "Retrieve wide rerank narrow",
    ],
    commonQuestions: [
      "Why rerank after vector search?",
    ],
    followUps: [
      "ColBERT vs cross-encoder?",
    ],
    misconceptions: [
      "Bigger k in LLM replaces rerank",
    ],
    traps: [
      "Rerank entire corpus",
    ],
    strongSignals: [
      "k=50→5 pattern",
      "Latency budget",
    ],
  },
  keyTakeaways: [
    "Bi-encoder fast; cross-encoder accurate",
    "Retrieve many, rerank few",
    "Top-5 to LLM typical",
    "Batch GPU scoring",
    "Domain-tuned reranker helps",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Bi-encoder vs cross-encoder?",
      answerHint: "Bi: separate embeddings, fast ANN; cross: joint encoding, slow, accurate per pair.",
    },
    {
      level: "intermediate",
      question: "Typical k before rerank?",
      answerHint: "50–200 retrieve; rerank to 5–10 for context.",
    },
    {
      level: "advanced",
      question: "ColBERT?",
      answerHint: "Late interaction: token embeddings + MaxSim; middle ground speed/quality.",
    },
  ],
  flashcards: [
    {
      front: "Cross-encoder rerank",
      back: "Joint query+doc scoring on retrieved candidates",
    },
    {
      front: "Retrieve vs rerank k",
      back: "Wide retrieve (50+), narrow rerank (5–10)",
    },
  ],
  quickRevision: [
    "Bi-encoder retrieve",
    "Cross-encoder rerank",
    "k wide → narrow",
    "GPU batch pairs",
    "Latency budget",
    "ColBERT alternative",
    "Domain-tuned model",
  ],
}
