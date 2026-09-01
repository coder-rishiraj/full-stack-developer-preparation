import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python classes: __init__, self, inheritance, @classmethod/@staticmethod, dataclasses, and dunder methods.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. classes fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: 'self explicit instance reference. MRO for inheritance. dataclass reduces boilerplate for data holders.',
  howItWorks: [
    { type: 'paragraph', text: 'self explicit instance reference. MRO for inheritance. dataclass reduces boilerplate for data holders.' },
  ],
  example: [
    { type: 'code', language: 'python', code: "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of classes?', answerHint: 'Python classes: __init__, self, inheritance, @classmethod/@staticmethod, dataclasses, and dunder met' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'classes', back: 'Python classes: __init__, self, inheritance, @classmethod/@s' },
    { front: 'PEP 8', back: 'Style guide — indentation 4 spaces' },
    { front: 'venv', back: 'Isolated Python environment per project' },
  ],
  quickRevision: [
    'Indent blocks',
    'Objects everywhere',
    'venv + pip',
    'mypy optional',
    'async I/O bound',
    'dataclass for data',
  ],
  tradeoffs: {
    advantages: [
    'Readable rapid development',
    ],
    disadvantages: [
    'GIL limits CPU threads',
    'Dynamic typing runtime errors',
    ],
    alternatives: [
    'Go/Rust for CPU hot paths',
    ],
    whenToUse: [
    'Backend, scripts, ML glue',
    ],
    whenNotToUse: [
    'Hard real-time embedded',
    ],
  },
  failureModes: [
    'Mutable default arg bug',
    'Blocking call inside async',
    'Unpinned pip dependencies',
  ],
  production: {
    reliability: [
      'Pin dependencies in lock file',
    ],
    maintainability: [
      'ruff/black/mypy in CI',
    ],
  },
  interview: {
    expectations: [
      'Syntax clarity',
      'Common gotchas',
    ],
    commonQuestions: [
      'list vs tuple?',
      'GIL?',
    ],
    followUps: [
      'async vs threading?',
    ],
    misconceptions: [
      'Type hints slow runtime',
    ],
    traps: [
      'def append(item, lst=[])',
    ],
    strongSignals: [
      'Explicit gotchas, venv, typing story',
    ],
  },
}
