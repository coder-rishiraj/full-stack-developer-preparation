import type { SystemDesignSections, TopicContent } from '@/domain/types'

type AppliedAiTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

type Focus = {
  capability: string
  build: string
  measure: string
  failure: string
}

function focusFor(sectionTitle: string): Focus {
  const title = sectionTitle.toLowerCase()

  if (title.includes('project:') || title.includes('capstone:')) {
    return {
      capability: 'integrating model, retrieval, tool, data, UX, and control-plane boundaries',
      build: 'a vertical slice with authentication, typed contracts, telemetry, and one realistic failure path',
      measure: 'task success, groundedness, tool correctness, p95 latency, and cost per completed task',
      failure: 'a portfolio demo whose happy path works but has no evals, permissions, recovery, or operating model',
    }
  }
  if (title.includes('rag') || title.includes('retrieval') || title.includes('chunk')) {
    return {
      capability: 'building grounded answers from an external, access-controlled knowledge source',
      build: 'an ingestion → chunking → indexing → retrieval → reranking → citation pipeline',
      measure: 'retrieval recall, context relevance, faithfulness, citation accuracy, latency, and index freshness',
      failure: 'tuning prompts to hide weak retrieval, stale indexes, missing ACL filters, or unsupported claims',
    }
  }
  if (title.includes('agent') || title.includes('mcp') || title.includes('workflow')) {
    return {
      capability: 'turning model decisions into bounded, observable, recoverable actions',
      build: 'a stateful decide → act → observe loop with typed tools, checkpoints, limits, and approval gates',
      measure: 'task completion, tool/argument accuracy, steps, side effects, latency, cost, and safety violations',
      failure: 'giving probabilistic output broad authority, unbounded loops, shared credentials, or irreversible tools',
    }
  }
  if (title.includes('security') || title.includes('injection') || title.includes('safety')) {
    return {
      capability: 'containing untrusted model inputs and outputs inside deterministic trust boundaries',
      build: 'least-privilege tools, ACL-aware data access, typed validation, approvals, isolation, and audit logs',
      measure: 'blocked exfiltration/abuse cases, false positives, privilege scope, and incident detectability',
      failure: 'treating a system prompt as a security boundary or the model response as authorization',
    }
  }
  if (title.includes('evaluation') || title.includes('regression') || title.includes('experiment')) {
    return {
      capability: 'measuring probabilistic quality before and after system changes',
      build: 'versioned datasets, explicit rubrics, component metrics, end-to-end checks, and production feedback',
      measure: 'quality by slice plus latency, tokens, cost, judge agreement, and confidence intervals',
      failure: 'optimizing anecdotes, leaking answers into eval data, or trusting an uncalibrated model judge',
    }
  }
  if (
    title.includes('production') ||
    title.includes('reliability') ||
    title.includes('observability') ||
    title.includes('cost') ||
    title.includes('performance')
  ) {
    return {
      capability: 'operating probabilistic model calls as one dependency in a reliable distributed system',
      build: 'deadlines, retries, routing, queues, caches, traces, budgets, fallbacks, and graceful degradation',
      measure: 'task success, p50/p95/p99 latency, availability, token/cost budgets, saturation, and failure rate',
      failure: 'monitoring only HTTP status while quality, provider drift, runaway context, or tool failures regress',
    }
  }
  if (
    title.includes('open-weight') ||
    title.includes('local model') ||
    title.includes('inference') ||
    title.includes('hardware') ||
    title.includes('fine-tun')
  ) {
    return {
      capability: 'choosing and operating model weights under quality, privacy, latency, cost, and control constraints',
      build: 'a benchmarked serving path with representative prompts, memory sizing, batching, and quality regression tests',
      measure: 'time to first token, tokens/sec, throughput, VRAM, quality by slice, availability, and unit cost',
      failure: 'selecting a model or optimization by leaderboard alone without workload, license, or quality validation',
    }
  }
  if (
    title.includes('multimodal') ||
    title.includes('voice') ||
    title.includes('speech') ||
    title.includes('vision')
  ) {
    return {
      capability: 'reasoning across text, image, document, audio, or video while preserving modality-specific evidence',
      build: 'a streaming multimodal pipeline with validation, interruptions, source grounding, and accessible fallbacks',
      measure: 'task accuracy, end-to-end latency, interruption handling, modality quality, safety, and cost',
      failure: 'flattening every modality to unverified text and ignoring timing, provenance, privacy, or accessibility',
    }
  }
  if (
    title.includes('embedding') ||
    title.includes('vector') ||
    title.includes('semantic') ||
    title.includes('similarity')
  ) {
    return {
      capability: 'mapping content to a vector space for semantic matching and candidate retrieval',
      build: 'an embedding/version pipeline, ANN index, metadata filters, hybrid search, reranker, and relevance set',
      measure: 'Recall@K, NDCG/MRR, filter correctness, p95 query latency, memory, and re-index cost',
      failure: 'assuming vector distance equals truth or changing embedding models without rebuilding the index',
    }
  }
  if (title.includes('prompt') || title.includes('context') || title.includes('conversation')) {
    return {
      capability: 'supplying the objective, evidence, constraints, state, and output contract needed now',
      build: 'versioned prompts with representative examples, typed outputs, explicit trust boundaries, and regression evals',
      measure: 'task success, schema validity, context utilization, injection resistance, latency, tokens, and cost',
      failure: 'collecting magic phrases while sending irrelevant context, ambiguous goals, or untrusted instructions',
    }
  }
  if (title.includes('api') || title.includes('tool') || title.includes('structured output')) {
    return {
      capability: 'integrating changing model providers through typed, observable application boundaries',
      build: 'a direct SDK integration with streaming, schemas, retries, usage accounting, and provider fallback',
      measure: 'schema/tool accuracy, task success, latency, retry rate, tokens, cost, and provider errors',
      failure: 'building an unvalidated API wrapper that cannot recover, route, trace, or explain its model choice',
    }
  }
  if (
    title.includes('machine learning') ||
    title.includes('neural') ||
    title.includes('transformer') ||
    title.includes('llm') ||
    title.includes('math')
  ) {
    return {
      capability: 'explaining what the model learns, computes during inference, and cannot guarantee',
      build: 'a small experiment or implementation that makes the mechanism and metric observable',
      measure: 'held-out task metrics, calibration/generalization, compute, memory, latency, and error slices',
      failure: 'memorizing vocabulary without connecting objective, data, representation, inference, and failure behavior',
    }
  }

  return {
    capability: 'turning an uncertain model capability into a useful, measurable software feature',
    build: 'the smallest end-to-end application slice with a typed boundary, eval case, trace, and failure fallback',
    measure: 'task success, latency, cost, user acceptance, safety, and operational reliability',
    failure: 'shipping a fluent demo without evidence that it is correct, safe, affordable, and supportable',
  }
}

function projectSystemDesign(title: string, focus: Focus): SystemDesignSections {
  return {
    problem: `Design ${title} as a secure, evaluated production AI product—not merely a model API demo.`,
    requirements: {
      functional: [
        `Deliver the primary user outcome represented by ${title}.`,
        'Ground responses in authorized data and expose sources where applicable.',
        'Support typed model outputs, tool actions, and human approval where needed.',
      ],
      nonFunctional: [
        'Define task-quality, p95 latency, availability, privacy, and cost-per-task targets.',
        'Prevent cross-tenant access and unauthorized consequential actions.',
        'Trace and reproduce every model, retrieval, tool, and policy decision.',
      ],
    },
    scaleAssumptions: [
      'State tenants, active users, peak requests, concurrency, corpus size, and modality mix.',
      'Separate interactive requests from long-running ingestion or agent work.',
      'Quantify context/token size and provider quotas at peak.',
    ],
    capacityEstimates: [
      'Estimate requests and model tokens per second at peak.',
      'Estimate embeddings, vector-index growth, object storage, and retention.',
      'Estimate model, retrieval, tool, and egress cost per successful task.',
    ],
    api: [
      {
        type: 'list',
        items: [
          'POST /sessions or /tasks with idempotency key and tenant identity.',
          'GET event stream for tokens, tool proposals, approvals, progress, sources, and terminal state.',
          'POST approval/cancel endpoints guarded by authorization and optimistic concurrency.',
        ],
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Tenant, user, session/task, message, model call, tool call, approval, source, eval, and audit event.',
          'Store prompt/model/index/tool versions and immutable provenance for replay.',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text:
          'Client → authenticated AI gateway → orchestrator → model router, retrieval, memory, and policy-controlled tools. ' +
          'Queues isolate long-running work; traces, evals, budgets, and audit events form the control plane.',
      },
    ],
    diagram: {
      caption: `${title} production reference architecture`,
      mermaid: `flowchart LR
  U[Web / Mobile / Voice] --> G[Auth + AI Gateway]
  G --> O[AI Orchestrator]
  O --> MR[Model Router]
  O --> R[RAG / Search]
  O --> M[(Memory / State)]
  O --> P[Policy + Approval]
  P --> T[Tools / MCP]
  O --> Q[Queue / Workers]
  O --> X[Evals / Traces / Cost]`,
    },
    dataFlow: [
      'Authorize tenant/user and validate the typed request before model access.',
      'Assemble bounded context from conversation state, retrieval, memory, and tool results.',
      'Route to a model, validate output/tool proposals, execute only through policy and approval gates.',
      'Stream progress and citations; persist versions, metrics, audit trail, and final outcome.',
    ],
    storage: [
      'PostgreSQL for tenant/task/approval/audit state; object storage for source artifacts.',
      'Vector index for semantic retrieval with tenant and ACL filters.',
      'Keep secrets in a dedicated manager; avoid storing hidden provider reasoning.',
    ],
    caching: [
      'Use exact/prompt caching for immutable prefixes and version cache keys by model and policy.',
      'Use semantic caching only where stale or cross-user answers cannot violate correctness or privacy.',
    ],
    asyncProcessing: [
      'Queue ingestion, embedding, large-document analysis, evals, and long-running agent steps.',
      'Make workers idempotent and persist checkpoints for retry/resume.',
    ],
    scaling: [
      'Scale stateless gateways/orchestrators horizontally and isolate provider-specific concurrency pools.',
      'Partition vector/document data by tenant or corpus where access patterns justify it.',
    ],
    consistency: [
      'Require strong consistency for permissions, approvals, budgets, and committed side effects.',
      'Allow bounded staleness for search indexes only with visible freshness semantics.',
    ],
    reliability: [
      'Use deadline budgets, jittered retries, circuit breakers, provider fallbacks, and graceful degradation.',
      'Separate model completion from tool side effects with idempotency records.',
    ],
    failureScenarios: [
      'Provider timeout or rate limit during a streamed response.',
      'Retrieval returns irrelevant, stale, poisoned, or unauthorized evidence.',
      'Tool succeeds but the response is lost, causing a duplicate retry.',
      'Agent loops, exceeds budget, or requests an unsafe action.',
    ],
    security: [
      'Treat prompts, retrieved documents, tool output, and model output as untrusted data.',
      'Enforce identity, least privilege, tenant ACLs, output validation, sandboxing, approvals, and audit.',
    ],
    observability: [
      'Trace request → prompt/context → model → retrieval → tool → response → eval.',
      'Record quality, tool success, latency, tokens, cost, errors, versions, and user feedback.',
    ],
    bottlenecks: [
      'Model queue time and generation dominate interactive latency.',
      'Poor retrieval/reranking can dominate quality even with a stronger model.',
      'Long context and serial tool calls inflate latency and cost.',
    ],
    alternatives: [
      'Deterministic workflow with search and templates instead of an agent.',
      'Hosted frontier model vs self-hosted open-weight model.',
      'Direct function integration vs MCP; RAG vs fine-tuning.',
    ],
    tradeoffs: [
      `${focus.capability} increases usefulness but also expands the evaluation and security surface.`,
      'More autonomy can reduce user effort while increasing blast radius and recovery complexity.',
      'Larger models/context may improve difficult cases but increase tail latency and unit cost.',
    ],
    interviewFollowUps: [
      'How do you prove that retrieved evidence was authorized and actually supported the answer?',
      'How do you prevent duplicate external actions after retries?',
      'What degrades when the primary model, vector store, or tool provider is unavailable?',
      'How do you compare a model/prompt/index change before rollout?',
    ],
    evolution: [
      {
        stage: '1. Evaluated vertical slice',
        description: 'One model, typed output, small trusted corpus, explicit golden dataset, and traces.',
        bottleneck: 'Manual operations and provider/corpus coupling.',
      },
      {
        stage: '2. Production controls',
        description: 'Add auth, tenant ACLs, tool policies, approvals, queues, retries, budgets, and dashboards.',
        bottleneck: 'Quality drift and rising model/retrieval cost.',
      },
      {
        stage: '3. Optimized platform',
        description: 'Add routing, caching, online evals, multimodal inputs, open models, and self-service integrations.',
        bottleneck: 'Platform complexity, governance, and organization-wide change management.',
      },
    ],
  }
}

export function createAppliedAiTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: AppliedAiTopicInput): TopicContent {
  const focus = focusFor(sectionTitle)
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''
  const isProject = sectionTitle.startsWith('Project:') || sectionTitle.startsWith('Capstone:')

  return {
    whatIsIt:
      `${title} is an Applied AI engineering topic in ${sectionTitle}.${parent} ` +
      `Study it as a capability for ${focus.capability}, not as provider-specific vocabulary.`,
    whyExists:
      `AI outputs are probabilistic and model/provider behavior changes. ${title} exists so engineers can build useful systems ` +
      'with explicit evidence, deterministic controls, evaluation, security, observability, and cost boundaries.',
    mentalModel:
      'Learn → build → evaluate → deploy → observe failures → study internals → rebuild better. ' +
      'For every AI feature ask: what is deterministic, what is probabilistic, what context/data may it access, what action may it take, and how will we know it worked?',
    architecture: {
      caption: `${title} inside an evaluated AI system`,
      mermaid: `flowchart LR
  U[User / Event] --> A[Typed Application Boundary]
  A --> C[Context + Policy]
  C --> M[Model]
  M --> V[Validation / Tools]
  V --> R[Result]
  A -. trace .-> E[Evals + Observability]
  M -. trace .-> E
  V -. trace .-> E`,
    },
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define the user outcome and place ${title} in the end-to-end request or learning path.`,
          `Build ${focus.build}.`,
          'Use typed inputs/outputs and deterministic checks around every model, retrieval, and tool boundary.',
          `Measure ${focus.measure}.`,
          'Inspect failures by dataset slice; change one component at a time and rerun regression evals.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Applied-engineering bar',
        text:
          'Do not stop at “the response looks good.” Keep a reproducible test case, model/prompt/index/tool versions, ' +
          'a trace, an explicit permission boundary, and a fallback for the failure that matters most.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Models predict outputs from tokens or multimodal representations; fluent output is not proof of truth or authorization.',
          'Context quality often matters more than prompt ornamentation: select only relevant instructions, evidence, state, and tool results.',
          'RAG changes accessible knowledge, tools change external capabilities, and fine-tuning primarily changes learned behavior.',
          'Agent loops amplify both capability and errors; checkpoints, budgets, idempotency, permissions, and termination are architecture—not polish.',
          'Evals are executable product requirements. Production telemetry supplies the next failure cases for those evals.',
        ],
      },
    ],
    tradeoffs: {
      advantages: [
        `${title} can improve task completion, automation, or decision support when ${focus.capability} is actually required.`,
        'Explicit contracts and evals make model/provider changes safer.',
      ],
      disadvantages: [
        'Probabilistic behavior adds test, security, latency, cost, and operational complexity.',
        'Provider/model evolution can change quality without an application code change.',
      ],
      alternatives: [
        'Deterministic software, rules, search, or a human workflow.',
        'A simpler prompt, retrieval pipeline, or tool workflow before adding an autonomous agent.',
      ],
      whenToUse: [
        'The task tolerates bounded uncertainty and success can be evaluated on representative examples.',
        'Language, semantic matching, generation, or multimodal reasoning creates measurable value.',
      ],
      whenNotToUse: [
        'A deterministic implementation is simpler, safer, cheaper, and meets the requirement.',
        'You cannot define acceptable failure, protect the data/action boundary, or evaluate the result.',
      ],
    },
    failureModes: [
      focus.failure,
      'Changing model, prompt, embedding, index, or tool schema without a versioned regression eval.',
      'Using a framework abstraction before understanding the raw request, state, tool, and failure loop.',
      'Conflating a confident response with grounded correctness or permission to act.',
      'Ignoring tail latency, token growth, provider limits, tenant isolation, and cost per successful task.',
    ],
    production: {
      performance: [
        'Track time to first token plus p50/p95/p99 end-to-end latency; parallelize only independent work.',
        'Bound context and tool steps; use streaming, caching, batching, and smaller models where evals show no harmful regression.',
      ],
      reliability: [
        'Set deadline budgets, retry only safe operations, checkpoint long work, and provide deterministic or human fallbacks.',
        'Version prompts, models, schemas, indexes, tools, policies, and eval datasets for replay.',
      ],
      maintainability: [
        'Keep provider adapters thin and business policy outside prompts.',
        'Record architecture decisions with quality, latency, security, privacy, and cost evidence.',
      ],
      observability: [
        `Measure ${focus.measure}.`,
        'Trace request, context, retrieval, model, tool, validation, response, outcome, and artifact versions.',
      ],
      security: [
        'Treat user input, retrieved content, tool output, and model output as untrusted.',
        'Enforce authentication, authorization, tenant ACLs, least privilege, typed validation, approval, isolation, and audit in code.',
      ],
      cost: [
        'Track cost per successful task—not only cost per token—and enforce per-request and per-tenant budgets.',
        'Route by measured capability need; reduce context and cache only when correctness/privacy semantics allow it.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} and place it within ${sectionTitle}.`,
        'Explain one concrete build, metric, failure mode, and deterministic control.',
        'Compare the simplest viable alternative and state when added AI complexity is justified.',
      ],
      commonQuestions: [
        `How would you use ${title} in a production AI application?`,
        'How would you evaluate it before and after changing the model or prompt?',
        'Where are the trust, data, authorization, and failure boundaries?',
      ],
      followUps: [
        'What changes at 10× traffic, corpus size, context length, or tool count?',
        'How would you lower latency/cost without silently lowering quality?',
        'What is the rollback or degraded mode when a provider or model behavior changes?',
      ],
      misconceptions: [
        'A stronger or larger model automatically fixes architecture, retrieval, or product problems.',
        'The LLM can enforce authorization because the system prompt told it to.',
        'An LLM-as-judge score is objective ground truth.',
      ],
      traps: [
        'Naming SDKs/frameworks without tracing data flow, state, side effects, or failures.',
        'Proposing an agent where a deterministic workflow is safer and sufficient.',
      ],
      strongSignals: [
        'Starts from a user outcome and representative eval set, then chooses the simplest capable architecture.',
        'Treats quality, security, reliability, observability, latency, and cost as one engineering problem.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Primary capability: ${focus.capability}.`,
      `Measure: ${focus.measure}.`,
      'Model output is probabilistic data; deterministic application code owns policy and authorization.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which problem does it solve?`,
        answerHint: `Place it in ${sectionTitle} and describe ${focus.capability}.`,
      },
      {
        level: 'intermediate',
        question: `How would you build and evaluate ${title}?`,
        answerHint: `${focus.build}; then measure ${focus.measure}.`,
      },
      {
        level: 'advanced',
        question: `How can ${title} fail or be abused in production, and what is the fallback?`,
        answerHint: `Start with ${focus.failure}; add typed controls, least privilege, traces, regression evals, and graceful degradation.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus.capability}.` },
      {
        front: `${title} production loop`,
        back: 'Outcome → typed boundary → context/model/tools → validation → eval → trace → improve.',
      },
      {
        front: 'Knowledge vs behavior vs action',
        back: 'New knowledge → RAG; behavior/style → prompting then fine-tuning if justified; external action → tools/agent.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Build: ${focus.build}`,
      `Measure: ${focus.measure}`,
      `Avoid: ${focus.failure}`,
      'Probabilistic model; deterministic policy and authorization',
    ],
    ...(isProject ? { systemDesign: projectSystemDesign(title, focus) } : {}),
  }
}
