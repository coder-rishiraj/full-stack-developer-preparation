import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "A multi-tenant AI platform serves many customer organizations (tenants) from shared infrastructure while isolating data, models, quotas, and configuration. It exposes unified APIs for chat, embeddings, RAG, and fine-tuned models with per-tenant billing and policy enforcement.",
  whyExists:
    "Building one AI stack per customer is uneconomical and slow to operate. SaaS vendors need shared GPU/LLM capacity, strict tenant boundaries for compliance (SOC2, HIPAA), and per-tenant customization without forking the codebase.",
  mentalModel:
    "Every request carries tenant context (tenant_id from JWT/API key). All data paths — vector indexes, object storage prefixes, logs, rate limits — are namespaced. Shared inference pools multiplex tenants; isolation is enforced at the API gateway, DB row level, and vector metadata filters.",
  howItWorks: [
    {
      type: "paragraph",
      text: "Onboarding creates a tenant record with plan, model allowlist, and storage namespace. API gateway resolves tenant from auth, attaches context to all downstream calls. RAG indexes partition by tenant_id metadata. LLM calls include tenant-specific system prompts and usage meters. Admin portal manages per-tenant keys, budgets, and data retention.",
    },
    {
      type: "list",
      items: [
        "Identity: API key or OAuth → tenant_id + roles (admin, user, service).",
        "Data plane: S3 prefix per tenant; vector DB filtered by tenant_id on every query.",
        "Control plane: tenant config (models, limits, prompts) in Postgres with cache.",
        "Billing: token/embedding counters flushed to usage ledger asynchronously.",
        "Noisy-neighbor protection: per-tenant rate limits, concurrency caps, and queue priority by plan tier.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "http",
      caption: "Tenant-scoped chat with usage metadata",
      code: `POST /v1/tenants/acme/chat
Authorization: Bearer sk_tenant_acme_...
{ "messages": [...], "model": "gpt-4o-mini" }

→ 200 { "reply": "...", "usage": { "promptTokens": 120, "completionTokens": 45 } }
→ 429 { "error": "tenant_quota_exceeded", "retryAfterMs": 3600000 }`,
    },
  ],
  keyTakeaways: [
    "tenant_id must propagate through every layer — never trust client-supplied tenant in body alone.",
    "Vector search without tenant filter is a critical data leak.",
    "Shared inference with per-tenant quotas beats dedicated GPU per small customer.",
    "Evolve: single-tenant MVP → row-level isolation → dedicated indexes for enterprise tier.",
    "Observability tags every span/log with tenant_id (careful with PII in high-cardinality metrics).",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "What is multi-tenancy in an AI platform?",
      answerHint: "Many customers on shared infra with logical isolation of data, config, and quotas.",
    },
    {
      level: "intermediate",
      question: "How prevent Tenant A retrieving Tenant B embeddings?",
      answerHint: "Mandatory tenant_id metadata filter on vector queries; separate indexes for strict isolation; authZ at API.",
    },
    {
      level: "advanced",
      question: "Design tiered isolation: shared vs dedicated vs VPC?",
      answerHint: "Shared pool + metadata for SMB; dedicated index/cluster for enterprise; VPC peering or single-tenant deploy for regulated.",
    },
  ],
  flashcards: [
    { front: "Tenant context propagation", back: "JWT/API key → gateway injects tenant_id into all downstream calls" },
    { front: "Vector DB tenant isolation", back: "Metadata filter tenant_id on every query; never global search" },
    { front: "Noisy neighbor control", back: "Per-tenant rate limits, concurrency caps, queue priority by plan" },
    { front: "Usage metering", back: "Async token/embedding counters → billing ledger; sync check for hard caps" },
  ],
  quickRevision: [
    "tenant_id on every request path",
    "RLS or metadata filters on DB and vectors",
    "Per-tenant quotas and model allowlists",
    "Shared inference pool + tiered isolation",
    "Async usage billing; sync quota enforcement",
    "Audit logs per tenant for compliance",
  ],
  systemDesign: {
    problem:
      "Design a B2B multi-tenant AI platform (like OpenAI API + enterprise RAG) serving 10k tenants with chat, embeddings, document ingestion, and per-tenant billing — strict data isolation and fair resource sharing.",
    requirements: {
      functional: [
        "Tenant onboarding, API keys, and admin portal",
        "Chat completions and embeddings APIs scoped per tenant",
        "Document upload → chunk → embed → tenant-scoped vector search (RAG)",
        "Per-tenant model allowlist, system prompts, and usage dashboards",
        "Usage-based billing export",
      ],
      nonFunctional: [
        "Zero cross-tenant data leakage (audit requirement)",
        "p99 chat latency < 3s excluding model time",
        "Support 10k tenants; top tenant 500 RPS, median 2 RPS",
        "99.9% API availability",
        "SOC2-ready audit trails",
      ],
    },
    scaleAssumptions: [
      "10k active tenants",
      "50k aggregate RPS peak (chat + embed)",
      "500M embedding vectors total; avg 50k vectors/tenant",
      "20 TB document storage across tenants",
    ],
    capacityEstimates: [
      "50k RPS × 2 KB avg request ≈ 100 MB/s ingress",
      "Embedding index: 500M × 1536 dims × 4 B ≈ 3 TB vector data + metadata overhead",
      "Usage events: 50k/s → Kafka → aggregate to Postgres billing table (batch hourly)",
    ],
    api: [
      {
        type: "code",
        language: "http",
        caption: "Core tenant APIs",
        code: `POST /v1/chat/completions        # tenant from API key
POST /v1/embeddings
POST /v1/documents                 # upload → async ingest
POST /v1/search                    # RAG retrieval, tenant-scoped
GET  /v1/usage?from=...&to=...
POST /admin/tenants                # provision tenant + namespace`,
      },
    ],
    dataModel: [
      {
        type: "list",
        items: [
          "Tenant: id, plan, model_allowlist[], quota_tokens_month, storage_bytes, created_at",
          "ApiKey: hash, tenant_id, scopes[], expires_at",
          "Document: tenant_id, doc_id, s3_key, status, chunk_count",
          "VectorChunk: tenant_id, doc_id, chunk_id, embedding_ref (in vector DB)",
          "UsageLedger: tenant_id, hour, tokens_in, tokens_out, embed_calls, cost_cents",
          "TenantConfig: tenant_id, system_prompt, retention_days, custom_metadata_schema",
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: "paragraph",
        text: "API Gateway authenticates API keys, resolves tenant, enforces rate limits and quota pre-check. Chat/Embed services call shared LLM provider with tenant context in logs. Ingestion pipeline writes to tenant-prefixed S3, chunks, embeds, upserts to vector DB with tenant_id namespace. Control plane Postgres holds tenant config; Redis caches hot config and quota counters.",
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Client --> GW[API Gateway]
  GW --> Auth[Auth + Tenant Resolver]
  Auth --> RL[Rate Limiter / Quota]
  RL --> Chat[Chat Service]
  RL --> Embed[Embedding Service]
  RL --> Ingest[Ingestion API]
  Chat --> LLM[LLM Provider Pool]
  Embed --> LLM
  Ingest --> S3[(S3 tenant prefixes)]
  Ingest --> Q[Ingest Queue]
  Q --> Worker[Chunk + Embed Worker]
  Worker --> VDB[(Vector DB)]
  Chat --> VDB
  GW --> PG[(Postgres Control Plane)]
  RL --> Redis[(Quota Counters)]`,
      caption: "Shared services with tenant context at gateway and storage layers",
    },
    dataFlow: [
      "Request arrives with API key → hash lookup → tenant_id + plan",
      "Gateway checks rate limit and soft/hard quota",
      "Chat: optional RAG retrieval with mandatory tenant_id filter → LLM → stream response",
      "Ingest: presigned upload → event → worker chunks, embeds, upserts with tenant_id",
      "Usage events emitted async; billing job aggregates hourly",
    ],
    storage: [
      "S3: s3://bucket/{tenant_id}/documents/...",
      "Vector DB: collection per tenant OR shared collection + tenant_id filter (enterprise: dedicated index)",
      "Postgres: tenants, keys, config, usage aggregates",
      "Redis: rate limits, rolling token counters",
    ],
    caching: [
      "Tenant config cached in gateway (60s TTL) with invalidation webhook",
      "Embedding cache keyed by (tenant_id, content_hash) to save cost",
      "Hot retrieval cache for frequent queries per tenant",
    ],
    asyncProcessing: [
      "Document ingestion pipeline (chunk, embed, index)",
      "Usage aggregation and invoice generation",
      "Tenant offboarding: async purge S3 + vector + metadata",
      "Audit log ship to SIEM",
    ],
    scaling: [
      "Horizontally scale stateless gateway and chat services",
      "Shard vector DB by tenant_id hash; move large tenants to dedicated shards",
      "Ingest workers scale on queue depth",
      "LLM provider routing with fallback models per plan",
    ],
    consistency: [
      "Quota counters eventually consistent; hard cap may use sync Redis check before expensive LLM call",
      "Ingestion: at-least-once; idempotent upsert by (tenant_id, doc_id, chunk_idx)",
      "Config changes propagate within cache TTL",
    ],
    reliability: [
      "LLM provider failover per tenant SLA tier",
      "Ingest DLQ for failed documents with tenant-visible status",
      "Graceful degradation: disable RAG if vector DB slow; chat-only mode",
    ],
    failureScenarios: [
      "Missing tenant filter on vector query → cross-tenant leak (prevent with middleware enforcement)",
      "Celebrity tenant exhausts shared GPU → per-tenant concurrency caps",
      "Quota Redis down → fail-closed for new LLM calls or degrade to cached responses only",
      "Slow ingestion backlog → tenant SLA alerts; priority queue for enterprise",
    ],
    security: [
      "API keys hashed at rest; rotate and scope minimally",
      "Row-level security in Postgres where applicable",
      "Encrypt tenant data at rest; KMS per tenant for enterprise tier",
      "Prompt injection defenses on uploaded documents",
      "Audit every admin access to tenant data",
    ],
    observability: [
      "Metrics: latency, tokens, cost by tenant_id (sampled dashboards for cardinality)",
      "Traces with tenant_id baggage",
      "Alerts on cross-tenant query anomalies",
      "Per-tenant error budgets",
    ],
    bottlenecks: [
      "Shared LLM rate limits across all tenants",
      "Vector DB hot shards for large tenants",
      "Ingestion lag during bulk uploads",
      "High-cardinality tenant metrics in Prometheus",
    ],
    alternatives: [
      "Single-tenant deployment per enterprise customer (higher margin, lower density)",
      "Fully siloed AWS accounts per tenant (maximum isolation, high ops cost)",
      "Hosted vector DB multi-tenancy vs self-managed per-tenant indexes",
    ],
    tradeoffs: [
      "Shared pool efficiency vs isolation guarantees",
      "Metadata-filter vectors (simple) vs dedicated indexes (costly, safer)",
      "Sync quota checks (accurate) vs async (cheaper, overshoot risk)",
      "Centralized billing vs tenant-managed BYOK keys",
    ],
    interviewFollowUps: [
      "How onboard a tenant in < 1 minute?",
      "Design data deletion for GDPR within 30 days?",
      "How offer custom fine-tuned model per tenant on shared infra?",
      "BYOK: customer brings OpenAI key — how meter and isolate?",
    ],
    evolution: [
      {
        stage: "1. Simple design",
        description: "Single app + single vector index; tenant_id column in Postgres only.",
        bottleneck: "Easy to forget tenant filter; one bug leaks all data.",
      },
      {
        stage: "2. Improve",
        description: "Gateway tenant resolver; mandatory vector metadata filter middleware; per-tenant S3 prefixes.",
        bottleneck: "Shared LLM quota; noisy neighbors; billing approximations.",
      },
      {
        stage: "3. Improve",
        description: "Redis quotas, ingest queue, usage ledger, plan-based rate limits.",
        bottleneck: "Large tenants contend on shared vector shard.",
      },
      {
        stage: "4. Scale further",
        description: "Dedicated vector shards / VPC deploy for enterprise; embedding cache; multi-region with tenant affinity.",
        bottleneck: "Operational complexity; cross-region consistency for config and usage.",
      },
    ],
  },
  tradeoffs: {
    advantages: [
      "Economies of scale on GPU/LLM spend",
      "Single codebase and faster feature rollout",
      "Centralized observability and billing",
    ],
    disadvantages: [
      "Isolation bugs are catastrophic",
      "Noisy-neighbor tuning is ongoing",
      "Compliance tiers multiply architecture variants",
    ],
    alternatives: [
      "Dedicated single-tenant stacks per customer",
      "White-label on hyperscaler managed AI only",
    ],
    whenToUse: [
      "B2B SaaS AI products",
      "Internal platform teams serving many business units",
    ],
    whenNotToUse: [
      "Single customer with strict air-gapped requirement from day one",
      "When regulatory mandate requires physical separation only",
    ],
  },
  failureModes: [
    "Vector query without tenant_id filter exposes other tenants documents",
    "Shared API key leaked across environments",
    "Quota bypass via embedding abuse or large context stuffing",
    "Incomplete tenant purge leaves orphaned vectors in index",
    "Cache poisoning if cache key omits tenant_id",
  ],
  production: {
    performance: [
      "Embedding cache by content hash per tenant",
      "Batch embed during ingest; stream chat responses",
      "Co-locate gateway with vector DB region",
    ],
    scalability: [
      "Shard vectors by tenant_id; promote hot tenants to dedicated shards",
      "Autoscale ingest workers on queue depth",
    ],
    reliability: [
      "Idempotent ingest upserts",
      "LLM provider circuit breakers with fallback models",
    ],
    security: [
      "Mandatory tenant middleware on all data paths",
      "Encrypt at rest; audit admin actions",
      "Regular penetration tests for cross-tenant access",
    ],
    observability: [
      "Per-tenant dashboards with cost and latency SLOs",
      "Anomaly detection on retrieval patterns",
    ],
    cost: [
      "Pass-through LLM pricing + margin; cache embeddings aggressively",
      "Tier storage: hot vectors vs archive cold documents",
    ],
    maintainability: [
      "Tenant context as first-class request struct in all services",
      "Integration tests that assert isolation on every new endpoint",
    ],
  },
  interview: {
    expectations: [
      "Explain tenant_id propagation end-to-end",
      "Compare shared vs dedicated vector isolation",
      "Discuss quota, billing, and noisy-neighbor controls",
    ],
    commonQuestions: [
      "Design multi-tenant RAG platform",
      "How prevent data leakage between tenants?",
      "How bill for token usage accurately?",
    ],
    followUps: [
      "Enterprise dedicated VPC tier?",
      "Custom model per tenant?",
      "GDPR delete within 30 days?",
    ],
    misconceptions: [
      "Separate Postgres schema equals full isolation for vectors",
      "API key alone is enough without server-side tenant resolution",
    ],
    traps: [
      "Accepting tenant_id from request body without auth binding",
      "Global vector search with post-filter",
    ],
    strongSignals: [
      "Mandatory metadata filters",
      "Async usage ledger + sync hard caps",
      "Evolution from MVP to enterprise tiers",
      "Audit and offboarding purge pipeline",
    ],
  },
}
