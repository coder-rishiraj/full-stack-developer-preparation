import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Planning decomposes user goal into steps before execution — plan-and-execute, ReAct reasoning, or explicit todo list the agent updates as subtasks complete.',
  whyExists: 'Complex tasks fail without structure. Planning reduces wrong tool order and missed dependencies.',
  mentalModel: 'Architect blueprint before construction: LLM outputs numbered plan → execute step 1 tool → revise plan if blocked.',
  howItWorks: [
    { type: 'list', items: [
      'Prompt for explicit plan JSON or markdown checklist',
      'Execute one step per loop iteration',
      'Replan on tool failure or new info',
      'Optional human approve plan upfront',
      'Keep plan in context for grounding',
    ] },
  ],
  example: [
    { type: 'code', language: 'markdown', code: 'Plan:\n1. Search KB for refund policy\n2. Call billing API get_invoice\n3. Draft response with citations' },
  ],
  tradeoffs: {
    advantages: [
      'Better multi-step success',
      'Debuggable intermediate state',
    ],
    disadvantages: [
      'Planning overhead tokens/latency',
      'Rigid plan misses dynamic info',
    ],
    alternatives: [
      'Pure reactive ReAct only',
      'Hardcoded workflow graph',
    ],
    whenToUse: [
      'Open-ended multi-tool tasks',
    ],
    whenNotToUse: [
      'Single lookup',
    ],
  },
  failureModes: [
    'Plan never updated after failure',
    'Steps too vague to execute',
    'Plan stored but ignored in loop',
  ],
  production: {
    observability: [
      'Log plan revisions',
      'Compare planned vs executed steps',
    ],
  },
  interview: {
    expectations: [
      'Plan-and-execute pattern',
      'Replan on failure',
    ],
    commonQuestions: [
      'Explain Planning',
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
      'Decompose before act',
      'Explicit checklist in context',
      'Replan dynamically',
    ],
  },
  keyTakeaways: [
    'Decompose before act',
    'Explicit checklist in context',
    'Replan dynamically',
    'One step per iteration',
    'Human approve risky plans',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why plan first?', answerHint: 'Structure multi-step tasks; reduce wrong tool order.' },
    { level: 'intermediate', question: 'ReAct vs plan-execute?', answerHint: 'ReAct interleaves thought/action; plan-execute batch plan then run.' },
    { level: 'advanced', question: 'When replan?', answerHint: 'Tool error, missing data, user correction mid-task.' },
  ],
  flashcards: [
    { front: 'Plan-and-execute', back: 'Generate plan then execute steps sequentially' },
    { front: 'Replan', back: 'Revise remaining steps after new information' },
  ],
  quickRevision: [
    'Decompose goal',
    'Plan in context',
    'Step-wise execute',
    'Replan on failure',
    'ReAct alternative',
    'Log plan vs done',
  ],
}
