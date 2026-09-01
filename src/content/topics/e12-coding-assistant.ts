import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Coding assistant system design: IDE integration, repo context retrieval, inline completion vs chat agent, sandboxed execution, and enterprise source-code security boundaries.',
  whyExists: 'Devs want Copilot-class help on private repos without leaking code. Architecture must handle context windows, latency, and safe tool use.',
  mentalModel: 'Pair programmer with library card to your repo — reads relevant files, suggests patches, runs tests in sandbox, never exfiltrates secrets.',
  howItWorks: [
    { type: 'list', items: [
      'IDE plugin sends cursor context + retrieved snippets.',
      'Repo index: AST/chunk embed per file with path ACL.',
      'Inline completion: small fast model low latency.',
      'Agent mode: plan → edit files → run tests in container.',
      'Block secrets and .env from context and uploads.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'User asks fix failing test → retrieve test + impl files → agent proposes diff → run pytest in ephemeral container → show results → user accepts patch.' },
  ],
  tradeoffs: {
    advantages: [
      'Dev velocity',
      'Context-aware suggestions',
    ],
    disadvantages: [
      'IP leakage risk',
      'Bad patch trust',
    ],
    alternatives: [
      'Completion only no agent',
      'On-prem model',
    ],
    whenToUse: [
      'Enterprise dev teams',
    ],
    whenNotToUse: [
      'Air-gapped without approved model',
    ],
  },
  failureModes: [
    'Secret in prompt to cloud',
    'Agent deletes files',
    'Hallucinated API usage merged',
  ],
  production: {
    security: [
      'Secret scanner on context',
      'Sandbox exec',
      'No train on customer code opt-out',
    ],
    performance: [
      'Completion p95 <200ms',
      'Incremental index on git push',
    ],
    reliability: [
      'User confirm before apply patch',
    ],
  },
  interview: {
    expectations: [
      'Repo RAG + sandbox',
      'Completion vs agent',
    ],
    commonQuestions: [
      'Design coding assistant?',
    ],
    followUps: [
      'Enterprise IP concerns?',
    ],
    misconceptions: [
      'Send whole repo each request',
    ],
    traps: [
      'Arbitrary shell on host',
    ],
    strongSignals: [
      'Incremental index + secret scan + sandbox test + diff confirm',
    ],
  },
  keyTakeaways: [
    'Repo-aware retrieval not full dump',
    'Fast model for completion',
    'Sandbox test execution',
    'Secret scanning mandatory',
    'User approves file writes',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Coding assistant components?', answerHint: 'IDE plugin, repo index, LLM gateway, optional sandbox runner.' },
    { level: 'intermediate', question: 'Repo context how?', answerHint: 'Embed chunks per file; retrieve by query+cursor path; respect .gitignore.' },
    { level: 'advanced', question: 'Enterprise code privacy?', answerHint: 'VPC deployment, zero-retention API, BYOK, no training clause, on-prem option.' },
  ],
  flashcards: [
    { front: 'Repo chunk index', back: 'Embedded code snippets with path and commit sha' },
    { front: 'Sandbox run', back: 'Tests/commands in isolated container not host' },
    { front: 'Completion vs agent', back: 'Inline fast predict vs multi-step edit/run loop' },
  ],
  quickRevision: [
    'Chunk repo index',
    'Secret scan',
    'Sandbox tests',
    'User confirm diff',
    'Zero retention',
  ],
  systemDesign: {
    problem: 'Design GitHub Copilot-class assistant for 10K devs, private monorepos, inline completion <200ms p95, agent tasks <30s, zero code retention at provider.',
    requirements: {
      functional: [
        'Inline completion',
        'Chat with repo context',
        'Agent edit+test loop',
        'PR summary generation',
        'Admin policy controls',
      ],
      nonFunctional: [
        'Completion p95 200ms',
        'No provider training on code',
        'SOC2 audit',
        'Per-org model policy',
        '99.5% availability',
      ],
    },
    scaleAssumptions: [
      '10K active devs',
      '100M completion requests/day',
      'Repos up to 10GB indexed',
    ],
    capacityEstimates: [
      'Completion tier GPU/edge cache',
      'Embedding workers on git webhook',
      'Sandbox pool 1K concurrent containers',
    ],
    dataFlow: [
      'Git push → webhook → chunk+embed index update',
      'Keystroke → local context + retrieve top files → completion API',
      'Agent task → plan → propose diffs → sandbox pytest → return patch',
    ],
    storage: [
      'Vector index per org/repo',
      'Metadata Postgres',
      'Ephemeral sandbox no persistent code',
    ],
    caching: [
      'Recent file cache in IDE',
      'Prompt cache for system prefix',
      'Completion debounce',
    ],
    asyncProcessing: [
      'Background repo indexing',
      'Large repo initial crawl queue',
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
      'Secret scanner',
      'Path ACL',
      'Sandbox network egress deny',
      'Customer managed keys',
    ],
    observability: [
      'Accept rate, latency, sandbox fail rate, $/dev/day',
    ],
    bottlenecks: [
      'Huge monorepo index freshness',
      'Completion tail latency',
      'Sandbox cold start',
    ],
    alternatives: [
      'Tabnine on-prem',
      'Completion-only without agent',
    ],
    tradeoffs: [
      'Cloud model quality vs on-prem privacy',
      'Deep index vs IDE-only context',
    ],
    interviewFollowUps: [
      'Multi-repo workspace?',
      'License compliance scan in suggestions?',
    ],
    api: [
      { type: 'code', language: 'http', code: 'POST /v1/complete\nPOST /v1/chat\nPOST /v1/agent/run\nPOST /v1/index/sync' },
    ],
    dataModel: [
      { type: 'list', items: [
        'Organization, Repository, CommitSha',
        'CodeChunk(path, embedding, symbol_tags)',
        'CompletionEvent(accepted, latency_ms)',
        'AgentRun(steps, sandbox_exit_code, diff_patch)',
      ] },
    ],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Clients → API gateway → stateless services → data stores + async workers.' },
    ],
    diagram: { mermaid: "flowchart TB\n  IDE[IDE Plugin] --> GW[Assistant Gateway]\n  GW --> Idx[Repo Indexer/RAG]\n  GW --> LLM[Model Router]\n  GW --> SB[Sandbox Runner]\n  Idx --> VDB[(Code Vectors)]\n  Git[Git Webhook] --> Idx", caption: 'Coding assistant architecture' },
    evolution: [
      { stage: '1. MVP', description: 'Single model + basic RAG.', bottleneck: 'Cost and quality variance.' },
      { stage: '2. Production', description: 'Routing, eval, observability.', bottleneck: 'Ops complexity.' },
      { stage: '3. Enterprise', description: 'Multi-tenant ACL, audit, fallbacks.', bottleneck: 'Compliance overhead.' },
    ],
  },
}
