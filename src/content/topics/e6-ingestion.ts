import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Document ingestion is the offline pipeline that fetches sources, parses content, chunks text, embeds vectors, and upserts into search indexes—with idempotent job tracking and schema versioning.",
  whyExists: "RAG quality starts before retrieval. Bad ingestion (wrong splits, missing updates, duplicate chunks) poisons every downstream answer. Production needs reliable batch/stream ingestion with observability.",
  mentalModel: "ETL for knowledge: Extract (S3, Confluence, DB) → Transform (parse, clean, chunk) → Load (embed, index metadata + vector). Each document version gets stable chunk_ids.",
  howItWorks: [
    {
      type: "list",
      ordered: true,
      items: [
        "Discover sources (webhook, cron, CDC).",
        "Parse to text (PDF, HTML, DOCX) preserving structure hints.",
        "Chunk with overlap; attach metadata (title, ACL, updated_at).",
        "Embed batch; upsert vector + keyword index.",
        "Mark job complete; tombstone deleted docs.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "text",
      caption: "Chunk metadata payload",
      code: `{
  "chunk_id": "doc42#p3-c2",
  "doc_id": "doc42",
  "text": "...",
  "page": 3,
  "acl": ["team:eng"],
  "updated_at": "2026-01-15T10:00:00Z"
}`,
    },
  ],
  production: {
    reliability: [
      "Idempotent upsert by chunk_id",
      "DLQ for failed parses",
    ],
    observability: [
      "Ingestion lag metric",
      "Chunk count per source",
    ],
    scalability: [
      "Parallel workers per partition",
    ],
    maintainability: [
      "Schema version in metadata",
    ],
  },
  tradeoffs: {
    advantages: [
      "Central quality gate",
      "Replayable pipelines",
    ],
    disadvantages: [
      "Lag until indexed",
      "Complex parsers",
    ],
    alternatives: [
      "Real-time stream per edit",
      "Lazy embed on first query",
    ],
    whenToUse: [
      "Any production RAG corpus",
    ],
    whenNotToUse: [
      "Single static file demo",
    ],
  },
  failureModes: [
    "Partial ingest → missing sections",
    "Duplicate chunks on re-run without idempotency",
    "ACL not copied → data leak",
    "Embedding model change without reindex",
  ],
  interview: {
    expectations: [
      "End-to-end ingest flow",
      "Idempotency and deletes",
    ],
    commonQuestions: [
      "How keep RAG corpus fresh?",
      "Chunking strategy?",
    ],
    followUps: [
      "CDC vs batch?",
      "Handle PDF tables?",
    ],
    misconceptions: [
      "Ingest once is enough",
      "Chunk size one-size-fits-all",
    ],
    traps: [
      "No tombstone on doc delete",
    ],
    strongSignals: [
      "chunk_id scheme",
      "ACL on metadata",
    ],
  },
  keyTakeaways: [
    "Ingest = parse → chunk → embed → index",
    "Idempotent chunk_id upserts",
    "Metadata carries ACL + timestamps",
    "Tombstone deletes",
    "Monitor ingestion lag",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Ingestion pipeline steps?",
      answerHint: "Fetch, parse, chunk, embed, upsert indexes, track job status.",
    },
    {
      level: "intermediate",
      question: "Handle document updates?",
      answerHint: "Version doc; delete old chunk_ids; upsert new; or CDC delta.",
    },
    {
      level: "advanced",
      question: "Idempotent re-ingest?",
      answerHint: "Deterministic chunk_id from doc_id + offset; upsert overwrites same key.",
    },
  ],
  flashcards: [
    {
      front: "Ingestion idempotency",
      back: "Stable chunk_id; upsert same key on re-run",
    },
    {
      front: "Tombstone",
      back: "Delete vectors/metadata when source doc removed",
    },
  ],
  quickRevision: [
    "ETL for RAG",
    "Parse chunk embed index",
    "chunk_id stable",
    "ACL in metadata",
    "Tombstone deletes",
    "Monitor lag",
    "Schema version tags",
  ],
}
