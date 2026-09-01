import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python syntax: indentation blocks, dynamic typing, statements vs expressions, and readable minimal punctuation structure.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. syntax fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: "Whitespace defines scope. Everything is object. import binds names. falsy values: None, False, 0, \"\", [], {}.",
  howItWorks: [
    { type: 'paragraph', text: "Whitespace defines scope. Everything is object. import binds names. falsy values: None, False, 0, \"\", [], {}." },
  ],
  example: [
    { type: 'code', language: 'python', code: "if score >= 60:\n    print(\"pass\")\nelse:\n    print(\"fail\")" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of syntax?', answerHint: 'Python syntax: indentation blocks, dynamic typing, statements vs expressions, and readable minimal p' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'syntax', back: 'Python syntax: indentation blocks, dynamic typing, statement' },
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
