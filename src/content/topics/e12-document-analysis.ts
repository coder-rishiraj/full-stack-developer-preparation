import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Document-analysis platform design: ingest PDFs/contracts/invoices, OCR/layout parse, structured extraction, Q&A, and workflow integration with validation and human review queues.',
  whyExists: 'Enterprises process millions of documents needing extraction and search beyond naive chat — pipeline quality, audit, and compliance dominate.',
  mentalModel: 'Document factory line — scan, OCR, chunk, classify, extract fields, human QC station, export to ERP.',
  howItWorks: [
    { type: 'list', items: [
      'Upload → virus scan → OCR/layout (tables).',
      'Classify doc type → schema-specific extract prompt.',
      'Structured JSON output + confidence scores.',
      'Low confidence → human review UI.',
      'Index for semantic Q&A over corpus.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Invoice PDF → detect tables → extract line items JSON → validate totals → 0.92 confidence auto-approve → else reviewer fixes fields → sync to NetSuite.' },
  ],
  tradeoffs: {
    advantages: [
      'Automation of paper workflows',
      'Searchable archive',
    ],
    disadvantages: [
      'OCR errors propagate',
      'Schema maintenance',
    ],
    alternatives: [
      'Rules+OCR without LLM',
      'Manual BPO',
    ],
    whenToUse: [
      'High-volume semi-structured docs',
    ],
    whenNotToUse: [
      'Fully structured EDI already',
    ],
  },
  failureModes: [
    'Table structure garbled',
    'Hallucinated line items',
    'PII in shared index',
  ],
  production: {
    reliability: [
      'Schema validation + HITL queue',
      'Versioned extract prompts',
    ],
    security: [
      'Tenant isolation',
      'Encryption at rest',
    ],
    observability: [
      'Field-level accuracy metrics',
    ],
  },
  interview: {
    expectations: [
      'Ingest pipeline',
      'HITL',
      'Validation',
    ],
    commonQuestions: [
      'Design doc analysis platform?',
    ],
    followUps: [
      'Table extraction?',
    ],
    misconceptions: [
      'Single LLM call on raw PDF bytes',
    ],
    traps: [
      'No human review on money fields',
    ],
    strongSignals: [
      'OCR+layout → schema extract → validate → HITL → audit',
    ],
  },
  keyTakeaways: [
    'OCR/layout before LLM',
    'Schema per doc type',
    'Confidence → human review',
    'Validate before ERP write',
    'Audit trail per field',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Doc analysis pipeline?', answerHint: 'Ingest, OCR, classify, extract, validate, optional Q&A index.' },
    { level: 'intermediate', question: 'Table extraction approach?', answerHint: 'Layout model or Textract → markdown tables → LLM structured extract.' },
    { level: 'advanced', question: 'Measure extraction quality?', answerHint: 'Field F1 vs gold set; human review rate; $/doc processed.' },
  ],
  flashcards: [
    { front: 'Layout parse', back: 'Preserve tables/headings before LLM extract' },
    { front: 'HITL queue', back: 'Human review for low-confidence extractions' },
    { front: 'Schema extract', back: 'Structured JSON output per document type' },
  ],
  quickRevision: [
    'OCR+layout',
    'Type schema',
    'Validate JSON',
    'HITL low conf',
    'Audit fields',
  ],
  systemDesign: {
    problem: 'Design document platform processing 5M pages/month, 50 doc types, extraction accuracy 98% on key fields, human review <10%, HIPAA option.',
    requirements: {
      functional: [
        'Bulk upload and API ingest',
        'OCR and layout',
        'Structured extraction',
        'Semantic search Q&A',
        'Review UI and ERP webhooks',
      ],
      nonFunctional: [
        'Process standard doc <60s',
        'Audit every field change',
        'Tenant isolation',
        'HIPAA tier available',
        '99.9% ingest durability',
      ],
    },
    scaleAssumptions: [
      '5M pages/month',
      'Peak 500 concurrent uploads',
      '100TB object storage growth/year',
    ],
    capacityEstimates: [
      'OCR workers GPU optional',
      'LLM extract batch with rate limits',
      'Postgres job queue + workers',
    ],
    dataFlow: [
      'Upload S3 → job queue → OCR → markdown/json layout → classify → LLM extract → validate → auto or review → webhook',
      'Approved docs → embed for Q&A',
    ],
    storage: [
      'S3 originals and derivatives',
      'Postgres jobs and extracted fields',
      'pgvector Q&A index',
      'Audit log immutable store',
    ],
    caching: [
      'Layout cache by doc hash',
      'Schema prompt template cache',
    ],
    asyncProcessing: [
      'Entire ingest pipeline queued',
      'Batch re-extract on schema version bump',
    ],
    scaling: [
      'Horizontal stateless tier; shard by tenant.',
    ],
    consistency: [
      'Strong for auth/billing; eventual for analytics.',
    ],
    reliability: [
      'Retries, idempotency keys, DLQ for async.',
    ],
    failureScenarios: [
      'Provider outage; hot tenant; index lag.',
    ],
    security: [
      'KMS encryption',
      'HIPAA VPC for tier',
      'PII redaction option',
      'RBAC on docs',
    ],
    observability: [
      'Field accuracy, review rate, pipeline stage latency, $/page',
    ],
    bottlenecks: [
      'OCR on scanned low-quality PDFs',
      'LLM cost on long contracts',
      'Review queue staffing',
    ],
    alternatives: [
      'Traditional IDP vendors',
      'Template regex only',
    ],
    tradeoffs: [
      'Auto-approve threshold vs error cost',
      'Multi-model vs single extract LLM',
    ],
    interviewFollowUps: [
      'Handwritten docs?',
      'Multi-language?',
      'Active learning from reviewer edits?',
    ],
    api: [
      { type: 'code', language: 'http', code: 'POST /v1/documents\nGET /v1/documents/{id}/extraction\nPOST /v1/documents/{id}/approve\nPOST /v1/search/query' },
    ],
    dataModel: [
      { type: 'list', items: [
        'Document(tenant, type, status, s3_key)',
        'ExtractionField(name, value, confidence)',
        'ReviewTask(assignee, corrections)',
        'ProcessingJob(stage, error, duration_ms)',
      ] },
    ],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Clients → API gateway → stateless services → data stores + async workers.' },
    ],
    diagram: { mermaid: "flowchart LR\n  Up[Upload] --> S3[(S3)]\n  S3 --> Q[Job Queue]\n  Q --> OCR[OCR/Layout]\n  OCR --> EX[Extract LLM]\n  EX --> VAL[Validator]\n  VAL -->|ok| ERP[Webhook ERP]\n  VAL -->|low| HITL[Review UI]", caption: 'Document processing pipeline' },
    evolution: [
      { stage: '1. MVP', description: 'Single model + basic RAG.', bottleneck: 'Cost and quality variance.' },
      { stage: '2. Production', description: 'Routing, eval, observability.', bottleneck: 'Ops complexity.' },
      { stage: '3. Enterprise', description: 'Multi-tenant ACL, audit, fallbacks.', bottleneck: 'Compliance overhead.' },
    ],
  },
}
