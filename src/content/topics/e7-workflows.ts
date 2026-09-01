import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Multi-step workflows orchestrate fixed or dynamic DAG of LLM/tool/human steps — LangGraph, Temporal, state machines with checkpoints vs free-form agent loop.',
  whyExists: 'Ad hoc loops hard to audit and recover. Workflows encode business process with retries, branching, persistence.',
  mentalModel: 'Flowchart with checkpoints: each node LLM or tool; edges on success/failure; resume from last checkpoint.',
  howItWorks: [
    { type: 'list', items: [
      'Define nodes: prompt, tool, human, branch',
      'Persist checkpoint after each node',
      'Retry policies per node type',
      'Dynamic agents as single node in larger DAG',
      'Visual editor for ops team',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: ' ingest → classify → [billing|support] branch → tool → human_review? → respond' },
  ],
  tradeoffs: {
    advantages: [
      'Auditable processes',
      'Resume after failure',
    ],
    disadvantages: [
      'Rigid vs adaptive tradeoff',
      'Workflow engine ops',
    ],
    alternatives: [
      'Free agent loop only',
      'Hardcoded if/else scripts',
    ],
    whenToUse: [
      'Regulated pipelines',
      'Order processing bots',
    ],
    whenNotToUse: [
      'Exploratory research chat',
    ],
  },
  failureModes: [
    'No checkpoint → restart from scratch',
    'Dynamic loop bypasses workflow guards',
    'Circular graph deadlocks',
  ],
  production: {
    reliability: [
      'Idempotent nodes',
      'Checkpoint store',
    ],
    observability: [
      'Visual run trace per workflow id',
    ],
  },
  interview: {
    expectations: [
      'Workflow vs agent loop',
      'Checkpoint resume',
    ],
    commonQuestions: [
      'Explain Multi-Step Workflows',
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
      'DAG of steps',
      'Checkpoints persist',
      'Branch on outcome',
    ],
  },
  keyTakeaways: [
    'DAG of steps',
    'Checkpoints persist',
    'Branch on outcome',
    'Retry per node',
    'Combine with agents',
    'Audit visual trace',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Workflow vs agent loop?', answerHint: 'Workflow predefined graph; loop free-form LLM driven.' },
    { level: 'intermediate', question: 'Checkpoint why?', answerHint: 'Resume after crash/HITL without redo all steps.' },
    { level: 'advanced', question: 'Embed agent in workflow?', answerHint: 'Agent node with bounded tools inside DAG step.' },
  ],
  flashcards: [
    { front: 'Checkpoint', back: 'Persisted state after workflow node completes' },
    { front: 'DAG workflow', back: 'Directed graph of orchestrated steps' },
  ],
  quickRevision: [
    'Nodes + edges',
    'Checkpoints',
    'Branch retry',
    'Agent as node',
    'Temporal/LangGraph',
    'Ops visibility',
  ],
}
