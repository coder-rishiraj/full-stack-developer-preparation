import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Vector indexing structures embeddings for approximate nearest neighbor (ANN) search—HNSW graphs, IVF partitions, or flat brute force—trading build cost, memory, recall@k, and query latency at scale.",
  whyExists: "Brute-force cosine over millions of vectors is O(n) per query. ANN indexes reduce to sublinear search with tunable recall—essential for production RAG latency and cost.",
  mentalModel: "HNSW: multi-layer skip graph—greedy walk from entry to neighbors closer to query. IVF: cluster centroids, search only nearest clusters. More layers/clusters = faster but may miss true nearest.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Embed chunks offline; store vector + metadata payload.",
        "HNSW: M neighbors per node, efConstruction at build, efSearch at query.",
        "IVF: train k centroids; assign vectors; probe nprobe clusters at query.",
        "Rebuild or incremental update on corpus change; version indexes.",
        "Monitor recall@k vs brute force on sample queries.",
      ],
    },
    {
      type: "table",
      headers: [
        "Index",
        "Build",
        "Query",
        "Recall",
      ],
      rows: [
        [
          "Flat",
          "None",
          "Slow exact",
          "100%",
        ],
        [
          "HNSW",
          "Medium",
          "Fast",
          "High tunable",
        ],
        [
          "IVF",
          "Train clusters",
          "Fast large n",
          "Depends nprobe",
        ],
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "1M chunks, 1536-dim: flat ~200ms/query; HNSW ef=128 ~5ms at 98% recall@10. Increase efSearch for critical queries.",
    },
  ],
  production: {
    performance: [
      "Tune efSearch vs latency SLO",
      "Warm index on deploy",
    ],
    scalability: [
      "Shard by tenant or hash",
      "Replicate read replicas",
    ],
    reliability: [
      "Blue-green index swap on reindex",
    ],
  },
  tradeoffs: {
    advantages: [
      "Sublinear ANN query",
      "Mature libraries (FAISS, pgvector HNSW)",
    ],
    disadvantages: [
      "Approximate misses neighbors",
      "Rebuild on major model change",
    ],
    alternatives: [
      "DiskANN for billion scale",
      "Product quantization for memory",
    ],
    whenToUse: [
      ">100k vectors",
      "Interactive RAG",
    ],
    whenNotToUse: [
      "Tiny corpus (<5k) flat is fine",
    ],
  },
  failureModes: [
    "Stale index after ingestion lag",
    "Wrong embedding model dimension",
    "ef too low → wrong context",
    "Hot shard imbalance",
  ],
  interview: {
    expectations: [
      "HNSW vs IVF tradeoffs",
      "Recall-latency knob",
    ],
    commonQuestions: [
      "How vector DB scales?",
      "What is HNSW?",
    ],
    followUps: [
      "Reindex strategy?",
      "PQ compression?",
    ],
    misconceptions: [
      "ANN always exact",
      "Index never needs rebuild",
    ],
    traps: [
      "Mixing embedding models on same index",
    ],
    strongSignals: [
      "efSearch tuning",
      "Recall eval set",
    ],
  },
  keyTakeaways: [
    "ANN for scale; flat for tiny",
    "HNSW: graph greedy search",
    "IVF: cluster probe",
    "Match embedding model to index",
    "Monitor recall@k",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why not brute force all vectors?",
      answerHint: "O(n) per query too slow at millions; ANN sublinear with tunable recall.",
    },
    {
      level: "intermediate",
      question: "HNSW query knobs?",
      answerHint: "efSearch higher → better recall, slower; M at build affects graph quality.",
    },
    {
      level: "advanced",
      question: "Reindex without downtime?",
      answerHint: "Build new index version; dual-write; swap alias; drain old queries.",
    },
  ],
  flashcards: [
    {
      front: "HNSW",
      back: "Hierarchical navigable small world graph for ANN",
    },
    {
      front: "efSearch",
      back: "HNSW query-time beam width; higher = better recall, slower",
    },
  ],
  quickRevision: [
    "ANN not exact",
    "HNSW graph walk",
    "IVF cluster probe",
    "Recall@k eval",
    "Reindex on model change",
    "Shard large indexes",
    "efSearch latency tradeoff",
  ],
}
