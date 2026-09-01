import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Hybrid retrieval combines lexical search (BM25/keyword) with dense vector similarity, then fuses rankings—commonly Reciprocal Rank Fusion (RRF) or weighted score merge—to capture both exact token matches and semantic paraphrases.",
  whyExists: "Vectors miss rare SKUs, acronyms, and exact codes; BM25 misses paraphrases. Hybrid improves recall on real queries mixing both styles without maintaining two separate user-facing search paths.",
  mentalModel: "Two librarians: one finds exact words (BM25), one finds meaning (embeddings). Fusion merges their ranked lists—document strong in either channel can surface.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Index same chunks in inverted index (BM25) and vector store (HNSW).",
        "Query: embed query + tokenize for BM25 in parallel.",
        "Retrieve top-k from each channel (e.g. k=50 each).",
        "RRF: score(d) = Σ 1/(rank_i(d) + c) across lists; c≈60.",
        "Optional cross-encoder rerank on fused top-N.",
      ],
    },
    {
      type: "table",
      headers: [
        "Method",
        "Strength",
      ],
      rows: [
        [
          "BM25",
          "Exact terms, rare tokens",
        ],
        [
          "Dense",
          "Paraphrase, semantic",
        ],
        [
          "RRF",
          "Robust fusion without score calibration",
        ],
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Query \"error 0x803\" → BM25 ranks log doc #1; vector ranks troubleshooting guide #1. RRF promotes both; reranker picks log snippet with exact code.",
    },
  ],
  production: {
    performance: [
      "Parallel BM25 + vector queries",
      "Cache query embeddings",
    ],
    scalability: [
      "Shard both indexes consistently by chunk_id",
    ],
    cost: [
      "Two indexes increase storage ~1.5–2x",
    ],
  },
  tradeoffs: {
    advantages: [
      "Better recall than either alone",
      "Handles codes + natural language",
    ],
    disadvantages: [
      "Dual index maintenance",
      "Tuning fusion weights",
      "Higher query latency",
    ],
    alternatives: [
      "Sparse-dense single model (SPLADE)",
      "Learned fusion",
    ],
    whenToUse: [
      "Enterprise search",
      "Support KB with SKUs",
    ],
    whenNotToUse: [
      "Tiny corpus where BM25 alone suffices",
    ],
  },
  failureModes: [
    "Duplicate chunks inflate RRF",
    "BM25 stopwords dominate short queries",
    "Mismatched chunk boundaries between indexes",
  ],
  interview: {
    expectations: [
      "Explain RRF formula intuition",
      "When hybrid beats pure vector",
    ],
    commonQuestions: [
      "BM25 vs embeddings?",
      "How fuse rankings?",
    ],
    followUps: [
      "SPLADE vs dual index?",
      "Weight tuning?",
    ],
    misconceptions: [
      "Always weighted average of raw scores works",
      "Hybrid doubles latency always",
    ],
    traps: [
      "Different chunk splits per index",
    ],
    strongSignals: [
      "RRF with c=60",
      "Same chunk_id in both indexes",
    ],
  },
  keyTakeaways: [
    "BM25 + dense = hybrid recall",
    "RRF fuses ranks without score scale",
    "Same chunk boundaries in both indexes",
    "Rerank after fusion",
    "Parallel query both channels",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why hybrid over vector only?",
      answerHint: "Exact tokens, SKUs, rare terms BM25 catches; vectors catch paraphrase.",
    },
    {
      level: "intermediate",
      question: "RRF formula?",
      answerHint: "Sum 1/(rank+c) per list; documents appearing in both lists score higher.",
    },
    {
      level: "advanced",
      question: "SPLADE vs dual-index hybrid?",
      answerHint: "SPLADE learned sparse+dense in one model; dual-index simpler ops, proven BM25.",
    },
  ],
  flashcards: [
    {
      front: "RRF",
      back: "Reciprocal Rank Fusion: score = Σ 1/(rank+c)",
    },
    {
      front: "Hybrid retrieval",
      back: "BM25 lexical + dense vector, fused rankings",
    },
  ],
  quickRevision: [
    "BM25 exact + vector semantic",
    "RRF rank fusion",
    "Same chunk_id both indexes",
    "Parallel retrieve",
    "Rerank top-N",
    "Watch duplicate chunks",
    "Tune k per channel",
  ],
}
