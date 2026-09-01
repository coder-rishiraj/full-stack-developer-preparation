import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Workflow orchestration frameworks (Temporal, LangGraph, Airflow, Step Functions) coordinate durable multi-step LLM pipelines with retries, timers, human tasks, and state persistence.',
  whyExists: 'Long RAG ingest, human approval, and multi-agent flows need reliable state beyond one HTTP request. Orchestrators survive crashes and resume.',
  mentalModel: 'Conductor score with checkpoints — if musician stops, resume measure 42 not restart symphony.',
  howItWorks: [
    { type: 'list', items: [
      'Define workflow as DAG or state machine.',
      'Activities: embed, LLM call, human approval task.',
      'Durable timers and retry policies per step.',
      'Idempotent activities for at-least-once delivery.',
      'Visibility UI for running workflows.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Temporal workflow: ingest doc → wait OCR → embed → index → notify; human approval activity for publish; survives worker restart mid-embed.' },
  ],
  tradeoffs: {
    advantages: [
      'Reliability and visibility',
      'Complex branching',
    ],
    disadvantages: [
      'Infra and learning curve',
    ],
    alternatives: [
      'SQS chained lambdas',
      'Cron + queue DIY',
    ],
    whenToUse: [
      'Multi-day human-in-loop',
      'Critical pipelines',
    ],
    whenNotToUse: [
      'Single sync chat turn',
    ],
  },
  failureModes: [
    'Non-idempotent activity double charge',
    'Huge history payload in workflow state',
    'Wrong timeout on human step',
  ],
  production: {
    reliability: [
      'Idempotent activities',
      'Version workflows safely',
    ],
    observability: [
      'Workflow metrics and search',
    ],
    scalability: [
      'Worker pool per task queue',
    ],
  },
  interview: {
    expectations: [
      'Durable execution',
      'Idempotent activities',
    ],
    commonQuestions: [
      'Temporal vs queue?',
    ],
    followUps: [
      'LLM step in workflow?',
    ],
    misconceptions: [
      'Same as cron',
    ],
    traps: [
      'Store megabyte prompts in workflow state',
    ],
    strongSignals: [
      'Durable timer + idempotent + human task pattern',
    ],
  },
  keyTakeaways: [
    'Durable multi-step workflows',
    'Idempotent activities',
    'Human tasks first-class',
    'Temporal/LangGraph/Step Functions',
    'Not for single chat turn',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Workflow orchestration for LLM?', answerHint: 'Durable coordinated steps with retries and state.' },
    { level: 'intermediate', question: 'Temporal vs SQS?', answerHint: 'Temporal keeps workflow state and timers; SQS is message pass only.' },
    { level: 'advanced', question: 'Version workflow change?', answerHint: 'Temporal patch/versioning; drain old runs; compat activities.' },
  ],
  flashcards: [
    { front: 'Durable workflow', back: 'Survives process crash; resumes from last step' },
    { front: 'Activity idempotency', back: 'Safe retry without duplicate side effects' },
    { front: 'Human task', back: 'Workflow waits for external approval signal' },
  ],
  quickRevision: [
    'Durable state',
    'Idempotent steps',
    'Human approval',
    'Temporal/StepFn',
    'Not sync chat',
  ],
}
