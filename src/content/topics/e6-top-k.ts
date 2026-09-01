import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Top-k retrieval returns the k highest-scoring chunks from search. Choosing k balances context richness vs noise, token cost, and latency—often 3–10 after reranking, higher before rerank.",
  whyExists: "Too few chunks miss evidence; too many dilute attention and blow token budget. k is a primary tuning knob linking retrieval recall to LLM context limits.",
  mentalModel: "k is how many evidence cards you hand the LLM. Start with recall@k on eval set; shrink k after reranking improves precision.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Initial retrieval k_retrieval: 20–100 for reranker input.",
        "Post-rerank k_context: 3–10 into prompt.",
        "Score threshold: drop below min similarity.",
        "Token budget: pack chunks until max tokens.",
        "Deduplicate overlapping chunks from same doc.",
      ],
    },
    {
      type: "table",
      headers: [
        "Stage",
        "Typical k",
      ],
      rows: [
        [
          "ANN retrieve",
          "50–200",
        ],
        [
          "After rerank",
          "5–10",
        ],
        [
          "LLM context",
          "3–7 chunks often",
        ],
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "k=20 without rerank floods prompt with tangential FAQ hits; k=5 after rerank keeps answer focused with citations.",
    },
  ],
  production: {
    cost: [
      "Token cost scales with k_context",
    ],
    performance: [
      "Lower k reduces LLM latency",
    ],
    observability: [
      "Track k vs answer quality A/B",
    ],
  },
  tradeoffs: {
    advantages: [
      "Simple knob",
      "Easy A/B",
    ],
    disadvantages: [
      "Not adaptive to query difficulty",
    ],
    alternatives: [
      "Dynamic k by score gap",
      "Token-budget packing",
    ],
    whenToUse: [
      "All vector retrieval",
    ],
    whenNotToUse: [
      "When fixed k ignores score quality",
    ],
  },
  failureModes: [
    "k=1 misses multi-hop evidence",
    "Large k confuses LLM",
    "Same doc chunks redundant",
  ],
  interview: {
    expectations: [
      "Two-stage k concept",
      "Token budget packing",
    ],
    commonQuestions: [
      "How choose k?",
    ],
    followUps: [
      "Dynamic k?",
    ],
    misconceptions: [
      "Max k always better",
    ],
    traps: [
      "k=1 for multi-source questions",
    ],
    strongSignals: [
      "Retrieve wide context narrow",
      "Eval recall@k",
    ],
  },
  keyTakeaways: [
    "Two k values: retrieve vs context",
    "Rerank then small k to LLM",
    "Score threshold filters weak hits",
    "Token budget caps effective k",
    "Eval recall@k to tune",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "What is top-k retrieval?",
      answerHint: "Return k highest-scoring chunks from similarity search.",
    },
    {
      level: "intermediate",
      question: "k before vs after rerank?",
      answerHint: "Large k retrieve (50+); small k context (5–10) after rerank.",
    },
    {
      level: "advanced",
      question: "Dynamic k?",
      answerHint: "Stop when score gap large or token budget full; MMR diversity.",
    },
  ],
  flashcards: [
    {
      front: "Top-k two stages",
      back: "Large k retrieve; small k after rerank to LLM",
    },
    {
      front: "recall@k",
      back: "Fraction of queries where true doc in top k results",
    },
  ],
  quickRevision: [
    "k retrieve vs k context",
    "Typical 5–10 to LLM",
    "Score threshold",
    "Token budget pack",
    "Dedupe same doc",
    "recall@k eval",
    "MMR diversity optional",
  ],
}
