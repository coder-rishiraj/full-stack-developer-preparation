import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Context window is max tokens (input + output) an LLM can process in one request. Fixed by architecture and memory — e.g. 8K, 128K, 1M variants across models.',
  whyExists: 'Attention memory scales with sequence length. Hard cap bounds GPU RAM and latency. Engineers must fit system prompt, history, RAG chunks, and answer inside the budget.',
  mentalModel: 'Fixed-size whiteboard. Everything you write — instructions, docs, chat — must fit. Overflow falls off the edge unless you summarize or retrieve selectively.',
  howItWorks: [
    { type: 'list', items: [
      'Model card lists context limit in tokens not chars.',
      'Input tokens + max_output_tokens must fit window.',
      'Long-context models use sparse/ring attention or more hardware.',
      'Truncation drops oldest or middle per API policy.',
      'RAG and summarization exist partly to stay in window.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '128K window: 2K system, 90K retrieved docs, 30K chat history, 4K completion budget — must count tokens proactively or API errors.' },
  ],
  tradeoffs: {
    advantages: [
      'Larger window = more in-context reasoning',
      'Simpler than external memory for short tasks',
    ],
    disadvantages: [
      'Cost/latency grow with length',
      'Lost in the middle effect',
      'Not infinite memory',
    ],
    alternatives: [
      'RAG for unbounded corpora',
      'Summarize rolling history',
      'External vector memory',
    ],
    whenToUse: [
      'Multi-doc reasoning within limit',
    ],
    whenNotToUse: [
      'Entire enterprise wiki in prompt',
    ],
  },
  failureModes: [
    'Silent truncation drops system instructions',
    'Underestimating output token reserve',
    'Stuffing irrelevant chunks — quality drops before hard limit',
    'Assuming chars ≈ tokens',
  ],
  production: {
    cost: [
      'Bill per input token — long context expensive',
    ],
    reliability: [
      'Token budget allocator in middleware',
      'Fail fast when over budget',
    ],
    performance: [
      'Prefer smaller window model when sufficient',
    ],
  },
  interview: {
    expectations: [
      'Token budget math',
      'Truncation strategies',
      'RAG relationship',
    ],
    commonQuestions: [
      'What is context window?',
      '100-page PDF in prompt?',
    ],
    followUps: [
      'Lost in the middle?',
      'Count tokens how?',
    ],
    misconceptions: [
      'Unlimited with RAG in prompt',
      'Window = knowledge cutoff date',
    ],
    traps: [
      'Put full codebase every request',
    ],
    strongSignals: [
      'Budget system+RAG+history+output',
      'Summarize/RAG for overflow',
    ],
  },
  keyTakeaways: [
    'Hard token cap per request',
    'Input + output share window',
    'Long context costs more',
    'Use RAG/summary beyond cap',
    'Count tokens before call',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Context window?', answerHint: 'Max tokens model processes in one call.' },
    { level: 'intermediate', question: 'PDF exceeds window?', answerHint: 'Chunk, retrieve relevant, summarize, multi-turn — not dump all.' },
    { level: 'advanced', question: 'Lost in the middle?', answerHint: 'Models attend poorly to middle of very long prompts; put key info at edges.' },
  ],
  flashcards: [
    { front: 'Context window', back: 'Max input+output tokens per request' },
    { front: 'Truncation', back: 'Drop tokens when over limit — often oldest' },
    { front: 'Lost in the middle', back: 'Lower recall for info in long prompt middle' },
  ],
  quickRevision: [
    'Token cap',
    'Input+output budget',
    'RAG if too big',
    'Count pre-call',
    'Middle attention weak',
  ],
}
