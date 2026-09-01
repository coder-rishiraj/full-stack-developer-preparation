import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Multi-agent architectures coordinate multiple LLM agents — planner/worker, critic/reviewer, specialist routing — with shared memory, message bus, and orchestration policies.',
  whyExists: 'Complex tasks exceed one agent context and skill. Division of labor improves quality but adds coordination overhead and failure modes.',
  mentalModel: 'Team of specialists with project manager — planner breaks task; researchers retrieve; writer drafts; critic revises.',
  howItWorks: [
    { type: 'list', items: [
      'Supervisor agent routes to worker agents.',
      'Shared blackboard or message queue between agents.',
      'Handoff protocols with structured state.',
      'Termination when goal met or budget exhausted.',
      'Human oversight on critical handoffs.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Research report: Planner outlines → Search agent retrieves → Analyst summarizes chunks → Writer composes → Critic checks citations → loop max 3 rounds.' },
  ],
  tradeoffs: {
    advantages: [
      'Higher quality on complex tasks',
      'Modular prompts/tools',
    ],
    disadvantages: [
      'Cost and latency multiply',
      'Coordination bugs',
    ],
    alternatives: [
      'Single agent with many tools',
    ],
    whenToUse: [
      'Multi-step research, codegen pipelines',
    ],
    whenNotToUse: [
      'Simple FAQ bot',
    ],
  },
  failureModes: [
    'Infinite agent ping-pong',
    'Duplicated work no shared memory',
    'Compounding hallucinations',
  ],
  production: {
    cost: [
      'Global token budget across agents',
    ],
    reliability: [
      'Max rounds and supervisor stop',
    ],
    observability: [
      'Trace per agent span',
    ],
  },
  interview: {
    expectations: [
      'Supervisor pattern',
      'Budget caps',
    ],
    commonQuestions: [
      'Multi-agent vs single?',
    ],
    followUps: [
      'Avoid loops?',
    ],
    misconceptions: [
      'More agents always better',
    ],
    traps: [
      'Unbounded critic-writer loop',
    ],
    strongSignals: [
      'Supervisor + shared state + round cap + trace',
    ],
  },
  keyTakeaways: [
    'Specialist agents coordinated',
    'Supervisor routing common',
    'Shared memory essential',
    'Cap rounds and cost',
    'Trace each agent',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Multi-agent architecture?', answerHint: 'Multiple LLM agents with roles coordinated by orchestrator.' },
    { level: 'intermediate', question: 'Supervisor pattern?', answerHint: 'Router agent delegates subtasks to workers and aggregates.' },
    { level: 'advanced', question: 'When single agent enough?', answerHint: 'Linear tool tasks; tight latency; cost sensitive; eval shows no multi-agent gain.' },
  ],
  flashcards: [
    { front: 'Supervisor agent', back: 'Routes tasks to specialist workers' },
    { front: 'Blackboard', back: 'Shared state store for agent handoffs' },
    { front: 'Round cap', back: 'Limit critic-writer loops to control cost' },
  ],
  quickRevision: [
    'Supervisor workers',
    'Shared state',
    'Round cap',
    'Token budget',
    'Per-agent trace',
  ],
}
