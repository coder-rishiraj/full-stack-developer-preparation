import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "An AI research assistant helps users explore topics by searching the web and internal corpora, synthesizing findings, citing sources, and iterating through multi-step research plans. It combines RAG, web search APIs, citation grounding, and agentic loops — not a single-shot chat completion.",
  whyExists:
    "Knowledge workers spend hours gathering and cross-checking sources. A research assistant automates retrieval, summarization, and structured reports while keeping claims traceable. Production systems must handle stale web content, paywalled sources, hallucination risk, and cost control across long research sessions.",
  mentalModel:
    "User goal → planner decomposes into sub-questions → parallel retrieval (web + docs) → evidence pool → synthesizer drafts answer with citations → critic/validator checks coverage and faithfulness → optional follow-up loops. Human sees streaming progress, sources, and confidence — not a black-box paragraph.",
  howItWorks: [
    {
      type: "paragraph",
      text: "Orchestrator maintains session state: research plan, collected sources, partial synthesis. Tools: web_search(query), fetch_url(url), search_internal_kb(query), cite(source_id). LLM roles: planner (JSON steps), researcher (tool calls), writer (grounded synthesis), verifier (claim ↔ source alignment). Results stored in session graph for follow-up questions without re-fetching everything.",
    },
    {
      type: "list",
      items: [
        "Plan: break broad question into 3–7 searchable sub-queries with success criteria.",
        "Retrieve: hybrid web API + vector KB; dedupe URLs; extract readable text (readability parser).",
        "Rank sources: recency, domain authority, snippet relevance, diversity of viewpoints.",
        "Synthesize: outline → section drafts with inline [n] citations; abstain if evidence weak.",
        "Verify: NLI or LLM judge maps each claim to supporting span; flag orphans.",
        "Export: markdown report, bibliography, optional slide outline.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "text",
      caption: "Multi-step research session flow",
      code: `User: Compare CRDT vs OT for collaborative editing in 2024

Planner → sub-queries:
  1. "CRDT collaborative editing survey 2023 2024"
  2. "operational transformation limitations scale"
  3. "Figma Google Docs CRDT OT architecture"

Researcher → 12 sources fetched → evidence pool

Writer → report with [1]–[12] citations, executive summary, tradeoff table

Verifier → 2 claims flagged "weak support" → writer revises`,
    },
  ],
  keyTakeaways: [
    "Research is an agent loop (plan → retrieve → synthesize → verify), not one prompt.",
    "Citations and source cards are first-class UI — trust depends on traceability.",
    "Cap tool calls and tokens per session; stream progress to manage latency perception.",
    "Web content is noisy — extract main text, check recency, dedupe mirrors.",
    "Evolve: single RAG chat → web search tool → multi-agent research with verification.",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "How differs from vanilla RAG chatbot?",
      answerHint: "Multi-step planning, web + KB retrieval, iterative synthesis, explicit citations and verification loop.",
    },
    {
      level: "intermediate",
      question: "How reduce hallucination in research reports?",
      answerHint: "Ground every claim to source span; verifier pass; abstain below threshold; show confidence.",
    },
    {
      level: "advanced",
      question: "Design cost controls for 30-minute deep research session?",
      answerHint: "Budget tokens/tool calls; cache fetches; tier models (small planner, large writer); user-visible budget.",
    },
  ],
  flashcards: [
    { front: "Research agent loop", back: "Plan → retrieve (web/KB) → synthesize with citations → verify → iterate" },
    { front: "Source deduplication", back: "Normalize URLs, canonical domain, content hash — avoid duplicate evidence" },
    { front: "Faithfulness check", back: "Map each claim to source span; flag orphan sentences" },
    { front: "Session evidence pool", back: "Reuse fetched sources for follow-ups without re-crawling web" },
  ],
  quickRevision: [
    "Planner + researcher + writer + verifier roles",
    "Web search + internal RAG + fetch_url tools",
    "Inline citations and source cards in UI",
    "Token/tool budgets per session",
    "Extract readable text; rank by recency/relevance",
    "Stream progress; export structured report",
  ],
  systemDesign: {
    problem:
      "Design an AI research assistant (Perplexity/ Elicit-class) for knowledge workers: multi-step web + document research, cited reports, 50k concurrent sessions, average session 8 tool calls and 15k tokens output.",
    requirements: {
      functional: [
        "Natural-language research questions with follow-ups in same session",
        "Web search and optional enterprise document corpus",
        "Structured report with citations and bibliography",
        "Source preview cards with snippet highlights",
        "Export markdown/PDF; share read-only link",
      ],
      nonFunctional: [
        "First useful results streamed within 5s",
        "Full report p95 < 90s for standard depth",
        "Faithfulness: >95% claims with valid citation on eval set",
        "Per-user daily cost cap",
      ],
    },
    scaleAssumptions: [
      "50k concurrent research sessions peak",
      "200k sessions/day",
      "Avg 8 web searches + 4 URL fetches per session",
      "20% sessions use enterprise KB (1M documents)",
    ],
    capacityEstimates: [
      "200k sessions × 8 searches ≈ 1.6M search API calls/day → need caching + query dedupe",
      "LLM: 200k × 15k tokens ≈ 3B tokens/day → tier models; cache planner outputs",
      "URL fetch: 800k/day → headless fetch pool with rate limits and CDN cache",
    ],
    api: [
      {
        type: "code",
        language: "http",
        caption: "Session-based research API",
        code: `POST /v1/research/sessions
{ "query": "...", "depth": "standard", "sources": ["web", "kb"] }
→ 201 { "session_id": "rs_abc", "stream_url": "/v1/research/sessions/rs_abc/stream" }

GET  /v1/research/sessions/{id}/stream   # SSE: plan, sources, draft, final
GET  /v1/research/sessions/{id}/report
POST /v1/research/sessions/{id}/followup { "message": "..." }`,
      },
    ],
    dataModel: [
      {
        type: "list",
        items: [
          "ResearchSession: id, user_id, query, plan_json, status, token_budget_used, created_at",
          "Source: session_id, source_id, url, title, fetched_at, content_hash, snippet_spans[]",
          "Claim: session_id, text, source_ids[], verified_bool",
          "Report: session_id, markdown, bibliography_json, version",
          "SearchCache: query_hash, results[], ttl",
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: "paragraph",
        text: "API creates session and starts orchestrator worker. Orchestrator runs state machine: Planner LLM → Researcher agent with tools (search API, fetcher, KB RAG) → accumulates Source entities → Writer LLM streams sections → Verifier flags weak claims → optional revision loop. SSE gateway streams events to client. Postgres/S3 stores session artifacts; Redis locks session state; object cache for fetched HTML.",
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Client --> API[Research API]
  API --> Orch[Orchestrator Worker]
  Orch --> Planner[Planner LLM]
  Orch --> Researcher[Researcher Agent]
  Researcher --> Search[Web Search API]
  Researcher --> Fetch[URL Fetch Service]
  Researcher --> RAG[Enterprise KB RAG]
  Orch --> Writer[Writer LLM]
  Orch --> Verifier[Verifier LLM]
  Orch --> PG[(Session Store)]
  Fetch --> Cache[(Content Cache)]
  API --> SSE[SSE Stream]
  SSE --> Client`,
      caption: "Session orchestrator with tool-using researcher and streaming output",
    },
    dataFlow: [
      "User submits query → session created with token budget",
      "Planner emits sub-queries and outline → streamed to client",
      "Researcher parallel tool calls → sources normalized and stored",
      "Writer drafts report sections referencing source_ids → streamed tokens",
      "Verifier scores claim-source alignment → revision if orphans > threshold",
      "Final report persisted; follow-up reuses evidence pool + incremental retrieval",
    ],
    storage: [
      "Postgres: session metadata, plan, claims",
      "S3: fetched HTML, PDF extracts, final reports",
      "Vector DB: enterprise KB chunks (tenant-scoped if multi-tenant)",
      "Redis: session state, search cache, fetch dedupe locks",
    ],
    caching: [
      "Search results cache by normalized query (1–24h TTL by topic freshness)",
      "URL content cache by URL + content_hash",
      "Embeddings cache for KB chunks",
    ],
    asyncProcessing: [
      "Background re-fetch for stale sources on report reopen",
      "Batch eval pipeline for faithfulness metrics",
      "PDF OCR pipeline for uploaded attachments",
    ],
    scaling: [
      "Horizontally scale orchestrator workers; one active worker per session",
      "Fetcher pool with per-domain rate limits",
      "Separate LLM routing: fast model for plan/search query gen; capable model for synthesis",
    ],
    consistency: [
      "Session state single-writer per session_id",
      "Sources immutable once fetched (new version on re-fetch)",
      "Report versions monotonic for audit",
    ],
    reliability: [
      "Tool call timeouts; partial report if some fetches fail with disclaimer",
      "Retry search with broadened query on empty results",
      "Idempotent session steps keyed by step_id",
    ],
    failureScenarios: [
      "Search API outage → fallback provider or KB-only mode",
      "Paywall/blocking on fetch → use search snippet only + mark low confidence",
      "LLM verifier too strict → endless loop; cap revision rounds to 2",
      "Prompt injection in malicious webpage → sanitize fetched text; sandbox tools",
    ],
    security: [
      "SSRF protection on URL fetcher (block internal IPs)",
      "AuthZ on enterprise KB documents",
      "Do not exfiltrate session data across users",
      "Log redaction for sensitive queries in enterprise mode",
    ],
    observability: [
      "Per-session trace: plan latency, fetch success rate, tokens, faithfulness score",
      "Search API cost and cache hit rate",
      "User satisfaction signals (copy, export, thumbs)",
    ],
    bottlenecks: [
      "Sequential verifier + revision loops",
      "URL fetch latency and anti-bot blocks",
      "Long context stuffing all sources into writer prompt — need selective context",
    ],
    alternatives: [
      "Single-shot RAG without web (stale for current events)",
      "Human-in-the-loop research only",
      "Pre-indexed web corpus (Common Crawl) instead of live search — freshness tradeoff",
    ],
    tradeoffs: [
      "Depth (more sources) vs latency and cost",
      "Live web vs cached index freshness",
      "Automatic report vs interactive clarifying questions",
      "Strong verification vs faster time-to-first-token",
    ],
    interviewFollowUps: [
      "How select which sources enter writer context window?",
      "Compare to Perplexity architecture at high level?",
      "Handle contradictory sources in synthesis?",
      "Enterprise: research over private SharePoint — how ingest?",
    ],
    evolution: [
      {
        stage: "1. Simple design",
        description: "Chat + single web search tool + paste snippets into prompt.",
        bottleneck: "Shallow answers; no plan; citation chaos.",
      },
      {
        stage: "2. Improve",
        description: "Planner sub-queries; source store; inline citations; SSE streaming.",
        bottleneck: "Hallucinated citations; fetch failures; cost blowups.",
      },
      {
        stage: "3. Improve",
        description: "Verifier loop; fetch cache; selective context ranking; token budgets.",
        bottleneck: "Latency of multi-agent loops; long sessions OOM context.",
      },
      {
        stage: "4. Scale further",
        description: "Parallel researcher workers; KB + web hybrid; eval harness; shared search cache globally.",
        bottleneck: "Faithfulness vs speed; legal/licensing on web content.",
      },
    ],
  },
  tradeoffs: {
    advantages: [
      "Dramatically faster literature/web research",
      "Traceable citations build trust",
      "Session reuse for iterative deep dives",
    ],
    disadvantages: [
      "High token and search API cost",
      "Web noise and paywalls reduce quality",
      "Multi-agent latency harder to predict",
    ],
    alternatives: [
      "Manual research with bookmark tools",
      "Static search engine without synthesis",
      "Analyst-written reports only",
    ],
    whenToUse: [
      "Competitive intelligence",
      "Academic literature surveys",
      "Due diligence and market research",
    ],
    whenNotToUse: [
      "Legal/medical advice requiring licensed professional",
      "Real-time trading decisions on live data",
    ],
  },
  failureModes: [
    "Orphan claims without supporting sources",
    "Citing wrong source index",
    "Stale web results presented as current",
    "Fetcher follows SSRF or malicious redirects",
    "Token budget exhausted mid-report with no graceful partial output",
  ],
  production: {
    performance: [
      "Parallel sub-query retrieval",
      "Stream first sources before full synthesis",
      "Rank-select top-k chunks for writer context",
    ],
    scalability: [
      "Worker pool for sessions; isolate long jobs",
      "Global search and fetch cache",
    ],
    reliability: [
      "Partial reports with explicit gaps",
      "Cap revision loops",
      "Multiple search provider fallback",
    ],
    security: [
      "SSRF-safe fetcher",
      "Sandbox tool outputs",
      "Tenant isolation on KB",
    ],
    observability: [
      "Faithfulness eval on golden queries",
      "Cost per session dashboards",
    ],
    cost: [
      "Model tiering by step",
      "Aggressive search/fetch cache",
      "User daily budgets",
    ],
    maintainability: [
      "Explicit orchestrator state machine",
      "Versioned prompt templates per role",
    ],
  },
  interview: {
    expectations: [
      "Describe multi-agent research loop",
      "Explain citation grounding and verification",
      "Discuss cost and latency controls",
    ],
    commonQuestions: [
      "Design Perplexity-like research assistant",
      "How ensure citations are accurate?",
      "Web vs enterprise KB integration?",
    ],
    followUps: [
      "Contradictory sources?",
      "Context window limits with 50 sources?",
      "Eval faithfulness at scale?",
    ],
    misconceptions: [
      "One big prompt with Google results is sufficient",
      "RAG alone replaces live web for current events",
    ],
    traps: [
      "No fetch sanitization (SSRF)",
      "Unbounded tool calls per session",
    ],
    strongSignals: [
      "Planner/researcher/writer/verifier split",
      "Evidence pool and session reuse",
      "SSE streaming and token budgets",
      "Selective context for writer",
    ],
  },
}
