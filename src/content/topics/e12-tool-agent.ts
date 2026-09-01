import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "An AI agent with external tools is an LLM-driven system that decides when to invoke APIs, databases, browsers, or code executors to accomplish user goals — looping observe → plan → act → observe until done or limits hit. Tools are schema-defined functions the model calls with structured arguments.",
  whyExists:
    "Many tasks require fresh data and side effects (book a meeting, query CRM, run SQL) that pure text generation cannot perform. Tool-using agents bridge natural language intent with deterministic systems — with guardrails because models can call wrong tools, leak secrets, or enter infinite loops.",
  mentalModel:
    "The LLM is a controller, not the whole app. Each turn: model receives messages + tool schemas → may emit tool_calls → runtime executes tools → results appended as tool messages → model continues. Human approval gates risky actions. Budgets cap steps, cost, and time.",
  howItWorks: [
    {
      type: "paragraph",
      text: "Define tools with JSON Schema (name, description, parameters). Runtime registers executors with auth context. Loop: chat.completions with tools → if tool_calls, execute serially or in parallel where safe → feed results back. Stop on final natural-language answer, max_steps, or human approval timeout. Observability logs every tool invocation with args (redacted) and latency.",
    },
    {
      type: "list",
      items: [
        "Tool design: narrow, idempotent tools beat one giant \"do_anything\" API.",
        "Auth: inject user OAuth tokens server-side — model never sees raw secrets.",
        "Validation: schema-validate args; reject out-of-scope parameters.",
        "Risk tiers: read-only auto; writes need confirmation; destructive blocked.",
        "Parallelism: independent reads parallel; writes serialized with locking.",
        "Recovery: retry transient errors; surface tool error text to model for replanning.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "json",
      caption: "Tool call round-trip (OpenAI-style)",
      code: `Assistant: tool_calls [{ "name": "get_weather", "arguments": {"city": "London"} }]
Runtime executes → tool message: {"temp_c": 18, "condition": "cloudy"}
Assistant: "It's 18°C and cloudy in London."`,
    },
  ],
  keyTakeaways: [
    "Tools extend LLM with actions — schema quality drives success more than prompt prose.",
    "Always cap max_steps, tokens, and wall-clock time per agent run.",
    "Human-in-the-loop for irreversible or high-blast-radius operations.",
    "Log and trace every tool call; redact secrets in args/results.",
    "Evolve: hardcoded if/else → single tool → multi-tool ReAct loop → supervised agent with policies.",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "What is tool calling in LLMs?",
      answerHint: "Model outputs structured function name + JSON args; runtime executes and returns results to continue conversation.",
    },
    {
      level: "intermediate",
      question: "How prevent an agent from deleting production data?",
      answerHint: "Risk-tier policies, read-only default tools, human approval, separate credentials with least privilege, no delete tool in prod.",
    },
    {
      level: "advanced",
      question: "Design agent that uses 10 tools without context window blowup?",
      answerHint: "Summarize old tool results; sliding window; tool result compression; sub-agents with focused tool subsets.",
    },
  ],
  flashcards: [
    { front: "ReAct pattern", back: "Reason + Act loop: think, call tool, observe result, repeat" },
    { front: "Tool schema purpose", back: "Tells model when/how to call; validation boundary for runtime" },
    { front: "Human-in-the-loop gate", back: "Pause before side-effect tools; resume after approval" },
    { front: "max_steps guardrail", back: "Hard cap on agent loop iterations to prevent runaway cost/loops" },
  ],
  quickRevision: [
    "LLM controller + tool runtime executor",
    "JSON Schema tools; validate args server-side",
    "ReAct loop with max_steps and timeouts",
    "Auth injected server-side; never in prompt",
    "Risk tiers + human approval for writes",
    "Trace every tool call; redact secrets",
  ],
  systemDesign: {
    problem:
      "Design a production AI agent platform that lets enterprise users build agents invoking Slack, Google Calendar, internal SQL, and custom webhooks — 100k daily agent runs, avg 6 tool calls each, strict audit and safety requirements.",
    requirements: {
      functional: [
        "Define agents with system prompt + allowed tool set",
        "Multi-turn tool loop until task complete",
        "Built-in connectors (Slack, Calendar, HTTP) + custom OpenAPI tools",
        "Human approval workflow for write/destructive tools",
        "Run history with full tool trace for audit",
      ],
      nonFunctional: [
        "p99 agent run completion < 60s for typical tasks",
        "Zero credential leakage to model or logs",
        "Idempotent retries for safe tools",
        "Tenant isolation for multi-customer SaaS",
      ],
    },
    scaleAssumptions: [
      "100k agent runs/day (~1.2 RPS avg, 20 RPS peak)",
      "Avg 6 tool calls × 3 LLM turns per run",
      "500 enterprise tenants; 50 tools in catalog",
      "30% runs include at least one write tool",
    ],
    capacityEstimates: [
      "100k runs × 6 tools ≈ 600k tool executions/day (~7/s avg)",
      "LLM: 100k × 4 turns × 2k tokens ≈ 800M tokens/day",
      "Webhook latency dominates p99 — need per-tool timeouts (5–15s)",
    ],
    api: [
      {
        type: "code",
        language: "http",
        caption: "Agent run lifecycle",
        code: `POST /v1/agents/{agent_id}/runs
{ "input": "Schedule team sync tomorrow 3pm and notify #eng", "user_id": "u1" }
→ 202 { "run_id": "run_xyz", "status": "running" }

GET  /v1/runs/{run_id}                    # status, steps[], pending_approval?
POST /v1/runs/{run_id}/approve            # human approves pending tool call
GET  /v1/runs/{run_id}/trace              # audit export

POST /v1/tools/register                   # custom OpenAPI → tool schemas`,
      },
    ],
    dataModel: [
      {
        type: "list",
        items: [
          "Agent: id, tenant_id, system_prompt, tool_ids[], policy_json, max_steps",
          "Tool: id, name, schema_json, executor_type, risk_tier (read|write|destructive)",
          "Run: id, agent_id, user_id, status, input, output, token_usage, started_at",
          "RunStep: run_id, step_idx, llm_message, tool_calls[], tool_results[], latency_ms",
          "Approval: run_id, step_idx, tool_call_id, status, approver_id, decided_at",
          "Credential: tenant_id, connector_type, encrypted_token_ref",
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: "paragraph",
        text: "Agent Runtime service owns the ReAct loop. Loads agent config and tool schemas. Each LLM turn calls model with tools parameter. Tool Dispatcher validates args, checks policy (risk tier, tenant allowlist), routes to Connector Workers (Slack, SQL proxy, HTTP). Pending approvals persist run state and notify user. Secrets from vault injected at execution only. Traces to OpenTelemetry; run store in Postgres.",
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  User --> API[Agent API]
  API --> RT[Agent Runtime]
  RT --> LLM[LLM Gateway]
  RT --> TD[Tool Dispatcher]
  TD --> Policy[Policy Engine]
  Policy -->|read| Conn[Connector Workers]
  Policy -->|write| Approve[Approval Service]
  Approve -->|approved| Conn
  Conn --> Slack[Slack API]
  Conn --> SQL[SQL Proxy]
  Conn --> HTTP[HTTP Webhook]
  RT --> Vault[(Secrets Vault)]
  RT --> PG[(Run Store)]
  Conn --> Vault`,
      caption: "Runtime loop with policy gate and connector isolation",
    },
    dataFlow: [
      "User starts run → runtime loads agent + tools + user credentials scope",
      "LLM turn → tool_calls emitted → dispatcher validates schema and policy",
      "Read tools execute immediately; write tools enqueue approval",
      "Tool results appended; loop until final answer or max_steps",
      "Run marked complete; trace available for audit",
    ],
    storage: [
      "Postgres: agents, runs, steps, approvals",
      "Vault/KMS: OAuth tokens, API keys per tenant connector",
      "S3: large tool payloads (file uploads/downloads)",
      "Redis: run locks, idempotency keys, rate limits",
    ],
    caching: [
      "Tool schema registry cached in runtime",
      "Read tool results cache where idempotent (e.g., get_user_profile) with short TTL",
      "LLM response cache disabled for agent runs (non-deterministic)",
    ],
    asyncProcessing: [
      "Approval notifications (email, Slack DM)",
      "Async runs for long workflows with webhook callback on complete",
      "Dead letter for failed connector calls with replay",
    ],
    scaling: [
      "Horizontally scale stateless runtime pods",
      "Per-connector worker pools with bulkheads",
      "Queue approval-heavy runs separately",
      "LLM gateway with tenant rate limits",
    ],
    consistency: [
      "Run state single-writer; optimistic locking on step_idx",
      "At-most-once for destructive tools via idempotency keys",
      "Approval decision exactly-once before execute",
    ],
    reliability: [
      "Per-tool timeouts and circuit breakers",
      "Retry idempotent reads with backoff",
      "Persist run state after each step — resume after crash",
      "Graceful partial output if max_steps exceeded",
    ],
    failureScenarios: [
      "Infinite loop calling same tool → max_steps + duplicate call detection",
      "LLM invents tool name → schema validation rejects; error back to model",
      "SQL tool SQL injection → parameterized queries only; read-only replica for SELECT",
      "OAuth token expired mid-run → refresh connector; fail run with clear error",
      "Prompt injection via Slack message content → sanitize tool outputs before LLM",
    ],
    security: [
      "Least-privilege credentials per connector",
      "Tool allowlist per agent; block arbitrary URL fetch unless scoped",
      "Args and results redacted in logs (PII, tokens)",
      "Tenant isolation on run store and credentials",
      "Audit export immutable for compliance",
    ],
    observability: [
      "Trace: run_id spans for each LLM and tool step",
      "Metrics: tool error rate, approval latency, tokens per run",
      "Alerts on anomaly: spike in destructive tool attempts",
    ],
    bottlenecks: [
      "Human approval latency blocks run",
      "Slow third-party APIs (Calendar, CRM)",
      "Context window growth from large tool JSON results",
      "LLM gateway rate limits",
    ],
    alternatives: [
      "Deterministic workflow engine (Temporal) with LLM for NL input only",
      "Single-purpose bots without general tool loop",
      "RPA for legacy systems without APIs",
    ],
    tradeoffs: [
      "Flexible agent vs predictable workflow graphs",
      "Auto-execute writes vs approval friction",
      "Many small tools vs few powerful ones (error surface)",
      "Sync run UX vs async for long tasks",
    ],
    interviewFollowUps: [
      "How implement custom OpenAPI tool safely?",
      "Compare to LangGraph / Temporal orchestration?",
      "Multi-agent: delegate subtasks to specialist agents?",
      "Eval agent success rate in production?",
    ],
    evolution: [
      {
        stage: "1. Simple design",
        description: "Single chat endpoint with 2 hardcoded tools in code.",
        bottleneck: "Not extensible; no audit; no approval path.",
      },
      {
        stage: "2. Improve",
        description: "Tool registry + JSON Schema; ReAct loop; run history in DB.",
        bottleneck: "Runaway loops; credential leaks in prompts.",
      },
      {
        stage: "3. Improve",
        description: "Policy engine, vault-backed credentials, approvals, max_steps, tracing.",
        bottleneck: "Context bloat; slow connectors dominate latency.",
      },
      {
        stage: "4. Scale further",
        description: "Connector worker pools, result summarization, sub-agents, tenant quotas, async long runs.",
        bottleneck: "Governance of custom tools; compliance across tenants.",
      },
    ],
  },
  tradeoffs: {
    advantages: [
      "Natural language interface to many systems",
      "Adaptable to new tasks without redeploying code paths",
      "Powerful automation for knowledge work",
    ],
    disadvantages: [
      "Non-deterministic; harder to test than workflows",
      "Security surface expands with each tool",
      "Cost unpredictable without budgets",
    ],
    alternatives: [
      "Traditional API + UI automation",
      "Fixed if-this-then-that workflows",
      "Human operator only",
    ],
    whenToUse: [
      "Multi-step tasks across SaaS tools",
      "Internal ops copilots with guardrails",
      "Customer support with CRM + KB lookup",
    ],
    whenNotToUse: [
      "Hard real-time control loops",
      "Fully deterministic financial transaction paths without human review",
      "When API coverage is zero and RPA is simpler",
    ],
  },
  failureModes: [
    "Runaway loop burning tokens until max_steps",
    "Wrong tool selected for task (calendar vs email)",
    "Tool args hallucinated (invalid email, wrong date format)",
    "Secret echoed into model context via tool result",
    "Approval timeout leaves run stuck without cleanup",
  ],
  production: {
    performance: [
      "Parallel independent read tools",
      "Per-tool timeouts; fail fast",
      "Summarize large tool outputs before next LLM turn",
    ],
    scalability: [
      "Bulkhead connector pools",
      "Queue long-running runs",
    ],
    reliability: [
      "Checkpoint after each step",
      "Idempotency keys on writes",
    ],
    security: [
      "Vault credentials; schema validation",
      "Policy engine on risk tiers",
      "SSRF controls on HTTP tool",
    ],
    observability: [
      "Full run trace export",
      "Token and tool cost per tenant",
    ],
    cost: [
      "max_steps and token budgets per run",
      "Cheaper model for planning; capable for final answer",
    ],
    maintainability: [
      "Versioned tool schemas",
      "Golden-run regression suite for critical agents",
    ],
  },
  interview: {
    expectations: [
      "Explain ReAct tool loop with diagrams",
      "Security: credentials, approvals, injection via tool output",
      "Operational guardrails: max_steps, timeouts, tracing",
    ],
    commonQuestions: [
      "Design AI agent with external API tools",
      "How prevent dangerous tool calls?",
      "Handle long tool results in context?",
    ],
    followUps: [
      "Multi-agent delegation?",
      "Custom user-defined tools?",
      "Eval and monitor agent quality?",
    ],
    misconceptions: [
      "Giving the model API keys in system prompt is acceptable",
      "More tools always improve agent capability",
    ],
    traps: [
      "No max_steps limit",
      "Arbitrary HTTP tool without SSRF protection",
    ],
    strongSignals: [
      "Policy engine + risk tiers",
      "Vault-backed auth",
      "Step checkpointing and audit trace",
      "Human approval for writes",
    ],
  },
}
