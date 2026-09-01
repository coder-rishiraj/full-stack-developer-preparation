import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Metadata filtering applies structured predicates (tenant, date range, product, ACL) before or during vector search so retrieval returns only chunks the user may access and that match business constraints.",
  whyExists: "Semantic search alone retrieves semantically similar but wrong-tenant or outdated docs. Filters enforce security, freshness, and domain scope—critical in multi-tenant enterprise RAG.",
  mentalModel: "Pre-filter narrows the search space to allowed docs; post-filter drops hits failing predicates. Vector DBs support filter + ANN in one query when metadata is indexed.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Store filterable fields on each vector payload (tenant_id, category, valid_until).",
        "Query: embed + filter expression e.g. tenant_id = X AND date > Y.",
        "Pre-filter: bitmap/postings restrict ANN graph traversal.",
        "Post-filter fallback if DB lacks native pre-filter.",
        "Never rely on LLM to enforce ACL—filter at retrieval.",
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Support bot: filter product=Widget AND region=EU before top-k; prevents US policy chunks answering EU users.",
    },
  ],
  production: {
    security: [
      "ACL filter mandatory",
      "Deny by default",
    ],
    performance: [
      "Index filter columns",
      "Avoid post-filter on huge k",
    ],
    reliability: [
      "Validate filter schema at ingest",
    ],
  },
  tradeoffs: {
    advantages: [
      "Security + relevance",
      "Smaller search space",
    ],
    disadvantages: [
      "Over-filter → empty results",
      "Schema rigidity",
    ],
    alternatives: [
      "Separate index per tenant",
      "Metadata as query prefix",
    ],
    whenToUse: [
      "Multi-tenant RAG",
      "Time-sensitive docs",
    ],
    whenNotToUse: [
      "Single public corpus",
    ],
  },
  failureModes: [
    "Missing ACL field → leak",
    "Too many filters → zero hits silently",
    "Timezone bugs on date filters",
  ],
  interview: {
    expectations: [
      "Pre vs post filter",
      "ACL at retrieval not generation",
    ],
    commonQuestions: [
      "Multi-tenant RAG isolation?",
    ],
    followUps: [
      "Filter + HNSW together?",
    ],
    misconceptions: [
      "Prompt can enforce security",
    ],
    traps: [
      "Post-filter only with large k",
    ],
    strongSignals: [
      "Indexed metadata fields",
      "Deny default ACL",
    ],
  },
  keyTakeaways: [
    "Filter at retrieval for ACL",
    "Pre-filter in vector DB preferred",
    "Metadata indexed with vectors",
    "Over-filter risks empty context",
    "Never trust LLM for authZ",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why metadata filters in RAG?",
      answerHint: "Tenant isolation, freshness, product scope; security before generation.",
    },
    {
      level: "intermediate",
      question: "Pre-filter vs post-filter?",
      answerHint: "Pre-filter during ANN saves work; post-filter after k retrieval if DB limited.",
    },
    {
      level: "advanced",
      question: "Empty results after filter?",
      answerHint: "Relax filters progressively; broaden date; fallback message; log filter stats.",
    },
  ],
  flashcards: [
    {
      front: "Metadata filtering",
      back: "Structured predicates on vector payload before/during search",
    },
    {
      front: "ACL in RAG",
      back: "Enforce at retrieval index query, not in LLM prompt",
    },
  ],
  quickRevision: [
    "Filter tenant ACL date",
    "Pre-filter in ANN",
    "Index metadata fields",
    "Deny by default",
    "Relax if empty",
    "No LLM authZ",
    "Log filter misses",
  ],
}
