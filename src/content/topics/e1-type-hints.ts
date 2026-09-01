import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python type hints: annotations for tooling (mypy/pyright), Optional, Union, generics, Protocol, and gradual typing.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. type fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: 'Hints not enforced at runtime by default. mypy static check. Use Optional[T] for None. Generics like list[str] Python 3.9+.',
  howItWorks: [
    { type: 'paragraph', text: 'Hints not enforced at runtime by default. mypy static check. Use Optional[T] for None. Generics like list[str] Python 3.9+.' },
  ],
  example: [
    { type: 'code', language: 'python', code: "def total(prices: list[float]) -> float:\n    return sum(prices)" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of type-hints?', answerHint: 'Python type hints: annotations for tooling (mypy/pyright), Optional, Union, generics, Protocol, and ' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'type-hints', back: 'Python type hints: annotations for tooling (mypy/pyright), O' },
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
