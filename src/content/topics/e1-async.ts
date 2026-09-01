import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Python async: async/await, asyncio event loop, coroutines vs threads, aiohttp, and when async helps I/O-bound work.',
  whyExists: 'Python prioritizes readability and batteries-included stdlib. async fundamentals prevent bugs and enable tooling in backend/ML scripts.',
  mentalModel: 'Single-thread cooperative multitasking. await yields control at I/O. CPU-bound work needs multiprocessing not async.',
  howItWorks: [
    { type: 'paragraph', text: 'Single-thread cooperative multitasking. await yields control at I/O. CPU-bound work needs multiprocessing not async.' },
  ],
  example: [
    { type: 'code', language: 'python', code: "import asyncio\n\nasync def fetch():\n    await asyncio.sleep(1)\n    return \"done\"" },
  ],
  keyTakeaways: [
    'Readability counts — PEP 8 style',
    'Know mutability of collection used',
    'Use venv per project',
    'Type hints for larger codebases',
    'async for I/O concurrency not CPU parallelism',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core idea of async?', answerHint: 'Python async: async/await, asyncio event loop, coroutines vs threads, aiohttp, and when async helps ' },
    { level: 'intermediate', question: 'Python gotcha related to this topic?', answerHint: 'See mental model edge cases' },
    { level: 'advanced', question: 'Production practice?', answerHint: 'Lint, type check, lock deps, test in CI' },
  ],
  flashcards: [
    { front: 'async', back: 'Python async: async/await, asyncio event loop, coroutines vs' },
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
