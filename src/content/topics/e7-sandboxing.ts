import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Agent sandboxing isolates code execution and tool effects — containers, WASM, seccomp, network egress deny, read-only FS, resource limits for untrusted model output.',
  whyExists: 'Models suggest dangerous commands. Sandboxing limits blast radius of code/run tools.',
  mentalModel: 'Playpen: agent child process cannot touch host network or secrets; timeout kills runaway.',
  howItWorks: [
    { type: 'list', items: [
      'Run code in ephemeral Docker/Firecracker',
      'No env secrets in sandbox',
      'Network allowlist only needed APIs',
      'CPU/memory/time quotas',
      'Separate prod credentials from agent runtime',
    ] },
  ],
  example: [
    { type: 'code', language: 'bash', code: 'docker run --rm --network none --memory 512m sandbox:latest python user_code.py' },
  ],
  tradeoffs: {
    advantages: [
      'Contain RCE from code tools',
      'Audit isolated environment',
    ],
    disadvantages: [
      'Ops complexity',
      'Cold start latency',
    ],
    alternatives: [
      'Trust model output on host',
      'Static analysis only',
    ],
    whenToUse: [
      'Code interpreter tools',
      'Shell command agents',
    ],
    whenNotToUse: [
      'Trusted internal read-only APIs only',
    ],
  },
  failureModes: [
    'Secrets mounted in sandbox',
    'Shared Docker socket escape',
    'No timeout → mining',
  ],
  production: {
    security: [
      'Default deny network',
      'Rotate sandboxes per request',
    ],
    reliability: [
      'Kill after TTL',
    ],
  },
  interview: {
    expectations: [
      'Never run model shell on host',
      'Container isolation',
    ],
    commonQuestions: [
      'Explain Sandboxing/Security',
    ],
    followUps: [
      'Production concerns?',
    ],
    misconceptions: [
      'Works in demo equals prod ready',
    ],
    traps: [
      'Missing security cap',
    ],
    strongSignals: [
      'Isolate code exec',
      'No secrets in sandbox',
      'Network deny default',
    ],
  },
  keyTakeaways: [
    'Isolate code exec',
    'No secrets in sandbox',
    'Network deny default',
    'Resource limits',
    'Ephemeral environments',
    'Audit runs',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why sandbox agent code?', answerHint: 'Model output untrusted; limit RCE blast radius.' },
    { level: 'intermediate', question: 'Sandbox essentials?', answerHint: 'No network/secrets; CPU/mem/time limits.' },
    { level: 'advanced', question: 'Docker enough?', answerHint: 'Harden: non-root, read-only FS, gVisor/Firecracker for multi-tenant.' },
  ],
  flashcards: [
    { front: 'Ephemeral sandbox', back: 'Fresh isolated env per code execution' },
    { front: 'Egress deny', back: 'Block network by default in sandbox' },
  ],
  quickRevision: [
    'Container/WASM isolate',
    'No host secrets',
    'Network allowlist',
    'CPU/mem timeout',
    'Non-root user',
    'Per-request fresh',
  ],
}
