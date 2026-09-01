import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Retrieval is the RAG stage that maps a user query to ranked document chunks from an index—via embedding similarity, keyword search, or hybrid fusion—supplying context for the generator.",
  whyExists: "LLM parametric memory is static and opaque. Retrieval injects fresh, attributable knowledge per query—the core of open-book QA over private corpora.",
  mentalModel: "Question → query representation → search index → ranked evidence list. Garbage retrieval guarantees garbage answers regardless of model size.",
  howItWorks: [
    {
      type: "list",
      ordered: true,
      items: [
        "Rewrite/expand query (optional HyDE, multi-query).",
        "Search vector and/or keyword index with filters.",
        "Fuse and dedupe results.",
        "Rerank top candidates.",
        "Pack chunks into context window budget.",
      ],
    },
    {
      type: "mermaid",
      diagram: `flowchart LR
  Q[Query] --> E[Embed / tokenize]
  E --> V[Vector search]
  E --> B[BM25 search]
  V --> F[Fusion]
  B --> F
  F --> R[Rerank]
  R --> C[Context pack]`,
      caption: "Retrieval pipeline",
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Weak retrieval: top chunk is FAQ intro, not answer paragraph. Fix: better chunking, hybrid search, reranker—not bigger LLM.",
    },
  ],
  production: {
    observability: [
      "Log retrieval scores",
      "Hit rate @k",
      "MRR on eval set",
    ],
    performance: [
      "Cache frequent queries",
    ],
    reliability: [
      "Fallback when empty results",
    ],
  },
  tradeoffs: {
    advantages: [
      "Fresh knowledge",
      "Smaller models viable",
    ],
    disadvantages: [
      "Pipeline complexity",
      "Retrieval errors dominate",
    ],
    alternatives: [
      "Long-context only no RAG",
      "Fine-tune on corpus",
    ],
    whenToUse: [
      "Dynamic private knowledge",
    ],
    whenNotToUse: [
      "Static small doc fits in prompt",
    ],
  },
  failureModes: [
    "Wrong chunk granularity",
    "Semantic drift",
    "No results → hallucination",
    "Duplicate redundant chunks waste tokens",
  ],
  interview: {
    expectations: [
      "Full retrieve pipeline",
      "Diagnose bad answers via retrieval",
    ],
    commonQuestions: [
      "RAG retrieval steps?",
    ],
    followUps: [
      "Query expansion?",
    ],
    misconceptions: [
      "Embedding alone is full RAG",
    ],
    traps: [
      "Skip eval on retrieval metrics",
    ],
    strongSignals: [
      "MRR/recall@k tracking",
      "Hybrid + rerank",
    ],
  },
  keyTakeaways: [
    "Retrieval supplies LLM context",
    "Quality > model size",
    "Hybrid + rerank common",
    "Filter + dedupe chunks",
    "Measure recall@k",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Retrieval role in RAG?",
      answerHint: "Find relevant chunks for query to pass as context to LLM.",
    },
    {
      level: "intermediate",
      question: "Debug wrong RAG answer?",
      answerHint: "Inspect retrieved chunks first; fix chunking/index before prompt.",
    },
    {
      level: "advanced",
      question: "Multi-query retrieval?",
      answerHint: "Generate paraphrases; retrieve each; union + dedupe + rerank.",
    },
  ],
  flashcards: [
    {
      front: "RAG retrieval",
      back: "Query → index search → ranked chunks for context",
    },
    {
      front: "First debug step bad RAG",
      back: "Inspect retrieved chunks quality and rank",
    },
  ],
  quickRevision: [
    "Query → search → rank",
    "Hybrid fusion",
    "Metadata filters",
    "Rerank top-N",
    "Dedupe chunks",
    "Recall@k metric",
    "Empty → abstain",
  ],
}
