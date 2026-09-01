import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python collections: list, tuple, dict, set — mutability, hashing, comprehensions, and Big-O for common operations.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. collections fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: 'list ordered mutable; tuple immutable hashable if elements hashable; dict key→value O(1) avg; set unique unordered.',
  howItWorks: [
    { type: 'paragraph', text: 'list ordered mutable; tuple immutable hashable if elements hashable; dict key→value O(1) avg; set unique unordered.' },
  ],
  example: [
    { type: 'code', language: 'python', code: "counts = {}\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of collections?', answerHint: 'Python collections: list, tuple, dict, set — mutability, hashing, comprehensions, and Big-O for comm' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'collections', back: 'Python collections: list, tuple, dict, set — mutability, has' },
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
