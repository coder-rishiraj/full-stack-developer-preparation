import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python packaging: venv, pip, pyproject.toml, requirements.txt, and publishing/installing distributable packages.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. packages fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: 'venv isolates dependencies. pip install from PyPI. pyproject.toml modern standard (PEP 621). Lock versions for reproducible builds.',
  howItWorks: [
    { type: 'paragraph', text: 'venv isolates dependencies. pip install from PyPI. pyproject.toml modern standard (PEP 621). Lock versions for reproducible builds.' },
  ],
  example: [
    { type: 'code', language: 'bash', code: "python -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of packages?', answerHint: 'Python packaging: venv, pip, pyproject.toml, requirements.txt, and publishing/installing distributab' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'packages', back: 'Python packaging: venv, pip, pyproject.toml, requirements.tx' },
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
