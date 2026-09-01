import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Hallucination is confident LLM output that is factually wrong, unsupported, or fabricated — fake citations, wrong API params, invented policies. Inherent to probabilistic generation without grounding.',
  whyExists: 'Models optimize plausible text not truth. Training cannot verify every fact at infer time. Production must detect, constrain, and recover — especially legal/medical/finance.',
  mentalModel: 'Fluent improviser not database. Will fill gaps with convincing fiction unless grounded on retrieved evidence and validated downstream.',
  howItWorks: [
    { type: 'list', items: [
      'Autoregressive sampling picks likely tokens — not fact-checked.',
      'RAG reduces but does not eliminate hallucination.',
      'Structured outputs + schema validation catch format lies.',
      'Lower temperature reduces creativity not fabrication fully.',
      'Human review on high-stakes paths.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Support bot cites non-existent refund section 7.4 — plausible legalese, zero retrieval hit. Fix: require citation chunk IDs, reject if no source.' },
  ],
  tradeoffs: {
    advantages: [
      'Awareness sets correct trust boundaries',
      'Drives RAG/guardrail investment',
    ],
    disadvantages: [
      'Mitigation adds latency and cost',
      'Over-correction makes answers vague',
    ],
    alternatives: [
      'Retrieval-only templates',
      'Human-in-loop',
      'Smaller domain fine-tune',
    ],
    whenToUse: [
      'Always plan mitigations in prod LLM apps',
    ],
    whenNotToUse: [
      'Never trust raw LLM for compliance facts alone',
    ],
  },
  failureModes: [
    'No source grounding on factual Q&A',
    'Trusting JSON tool args without verify',
    'Citation without chunk binding',
    'Users treat confidence as correctness',
  ],
  production: {
    reliability: [
      'Ground with RAG + require citations',
      'Output validators and tool confirm steps',
    ],
    security: [
      'Do not expose unverified medical/legal advice',
    ],
    observability: [
      'Log retrieval hits vs claims',
      'Hallucination rate in eval sets',
    ],
  },
  interview: {
    expectations: [
      'Define hallucination',
      'Mitigations not just lower temperature',
    ],
    commonQuestions: [
      'What is hallucination?',
      'How reduce in RAG?',
    ],
    followUps: [
      'Detect programmatically?',
      'Tradeoff with creativity?',
    ],
    misconceptions: [
      'RAG eliminates hallucinations',
      'GPT-4 never hallucinates',
    ],
    traps: [
      'Temperature zero fixes all',
    ],
    strongSignals: [
      'RAG + cite + validate + eval + abstain',
    ],
  },
  keyTakeaways: [
    'Plausible ≠ true',
    'RAG + citations reduce not remove',
    'Validate structured outputs',
    'Eval hallucination rate',
    'Abstain when no evidence',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM hallucination?', answerHint: 'Confident false or unsupported generated content.' },
    { level: 'intermediate', question: 'RAG mitigation?', answerHint: 'Retrieve evidence, cite chunks, reject low-similarity answers.' },
    { level: 'advanced', question: 'Detect in production?', answerHint: 'NLI/consistency checks, citation verify, golden eval, user feedback loops.' },
  ],
  flashcards: [
    { front: 'Hallucination', back: 'Fluent but false or ungrounded model output' },
    { front: 'Abstain', back: 'Refuse answer when retrieval confidence low' },
    { front: 'Citation binding', back: 'Link claims to specific source chunk IDs' },
  ],
  quickRevision: [
    'Plausible not true',
    'RAG+citations',
    'Validate outputs',
    'Eval rate',
    'Abstain if no evidence',
  ],
}
