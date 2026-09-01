import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Structured prompting uses clear sections, headings, XML/markdown tags, and step lists to organize instructions — improves model adherence vs wall of text.',
  whyExists: 'Ambiguous prompts cause skipped steps and format drift. Structure reduces parse errors for both model and engineers.',
  mentalModel: 'Fill structured form not rambling email. Sections: Task, Context, Constraints, Output Format.',
  howItWorks: [
    { type: 'list', items: [
      'Delimiters: ###, <context>, <rules> tags.',
      'Numbered steps for multi-step reasoning.',
      'Explicit output format section.',
      'Separate context from instructions.',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: '<task>Summarize ticket</task>\n<context>{{chunks}}</context>\n<rules>Max 3 bullets. Cite chunk id.</rules>\n<format>JSON: { summary, citations[] }</format>', caption: 'Structured prompt skeleton' },
  ],
  tradeoffs: {
    advantages: [
      'Higher adherence',
      'Easier debugging',
    ],
    disadvantages: [
      'Verbose token use',
      'Over-structure small tasks',
    ],
    alternatives: [
      'JSON schema only',
    ],
    whenToUse: [
      'Complex multi-constraint prompts',
      'RAG QA',
    ],
    whenNotToUse: [
      'Trivial one-liner tasks',
    ],
  },
  failureModes: [
    'Tag mismatch confusing model',
    'Buried critical rule in middle',
    'Duplicate conflicting sections',
  ],
  production: {
    maintainability: [
      'Prompt templates with variables',
      'Lint template required sections',
    ],
    reliability: [
      'Same structure across locales',
    ],
  },
  interview: {
    expectations: [
      'Section delimiters',
      'Why structure helps',
    ],
    commonQuestions: [
      'Structured prompting?',
    ],
    followUps: [
      'XML tags vs markdown?',
    ],
    misconceptions: [
      'Longer always worse — structure helps',
    ],
    traps: [
      'Unlabeled context blob',
    ],
    strongSignals: [
      'Task/context/rules/format sections',
    ],
  },
  keyTakeaways: [
    'Sections and delimiters',
    'Explicit output format',
    'Separate context from rules',
    'Templates with variables',
    'Easier eval and debug',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why structure prompts?', answerHint: 'Clear boundaries improve instruction following and parsing.' },
    { level: 'intermediate', question: 'RAG prompt layout?', answerHint: 'Task, retrieved context block, rules, output format — ordered.' },
    { level: 'advanced', question: 'Template governance?', answerHint: 'Versioned templates, required fields, CI render tests.' },
  ],
  flashcards: [
    { front: 'Delimiters', back: 'Tags/headers separating prompt sections' },
    { front: 'Output format section', back: 'Explicit expected response shape' },
    { front: 'Prompt template', back: 'Parameterized reusable structure' },
  ],
  quickRevision: [
    'Section tags',
    'Task/context/rules',
    'Output format',
    'Templates',
    'Debug easier',
  ],
}
