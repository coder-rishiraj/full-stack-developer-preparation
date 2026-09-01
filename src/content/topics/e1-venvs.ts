import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'A virtual environment (venv) is an isolated Python runtime with its own site-packages and pip. Each project gets independent dependency versions without polluting system Python.',
  whyExists: 'LLM stacks pin fragile version combos (openai, pydantic, torch). Global pip causes import conflicts and unreproducible CI. venvs are the baseline isolation before Docker.',
  mentalModel: 'Separate toolbox drawer per project. Activate drawer → installs land only there. Delete drawer → deps gone, system untouched.',
  howItWorks: [
    { type: 'list', items: [
      'python -m venv .venv creates bin/python shim and lib/site-packages.',
      'source .venv/bin/activate prepends venv to PATH.',
      'pip install targets active venv only.',
      'pyvenv.cfg links to base interpreter; lightweight not full copy.',
      'Lock with requirements.txt, poetry.lock, or uv.lock for CI parity.',
    ] },
  ],
  example: [
    { type: 'code', language: 'bash', code: 'python3 -m venv .venv\nsource .venv/bin/activate\npip install -U pip\npip install openai pydantic\npip freeze > requirements.txt', caption: 'AI project bootstrap' },
  ],
  tradeoffs: {
    advantages: [
      'Isolated deps',
      'Easy reset',
      'Standard library built-in',
    ],
    disadvantages: [
      'Must remember activate',
      'No CUDA/OS isolation',
      'Disk per project',
    ],
    alternatives: [
      'conda for GPU stacks',
      'Docker for prod parity',
      'uv for faster sync',
    ],
    whenToUse: [
      'Every Python LLM/RAG repo',
    ],
    whenNotToUse: [
      'When Docker-only workflow with no local Python',
    ],
  },
  failureModes: [
    'Forgot activate — global pip pollution',
    'Unpinned requirements — CI drift',
    'Committed .venv to git',
    'Python minor mismatch dev vs prod',
  ],
  production: {
    reliability: [
      'Exact pins in lockfile',
      'Same Python minor in CI and image',
    ],
    maintainability: [
      '.venv in .gitignore',
      'Document setup in README',
    ],
    security: [
      'pip-audit on deps',
    ],
  },
  interview: {
    expectations: [
      'Isolation mechanism',
      'venv vs Docker',
      'Lockfiles',
    ],
    commonQuestions: [
      'Why venv?',
      'What if skip it?',
    ],
    followUps: [
      'uv vs poetry?',
      'Reproduce prod locally?',
    ],
    misconceptions: [
      'venv copies entire Python',
      'global pip OK for one project',
    ],
    traps: [
      'No version pins',
    ],
    strongSignals: [
      'activate + lockfile + gitignore',
    ],
  },
  keyTakeaways: [
    'One venv per project',
    'Activate before pip/run',
    'Commit lockfiles not .venv',
    'Match Python version in prod',
    'venv isolates packages not OS/CUDA',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a Python venv?', answerHint: 'Isolated site-packages per project via interpreter shim.' },
    { level: 'intermediate', question: 'venv vs Docker?', answerHint: 'venv dev speed; Docker prod OS/lib parity. Often both.' },
    { level: 'advanced', question: 'Reproducible builds?', answerHint: 'Hash-pinned lockfile, fixed Python, fresh venv in CI.' },
  ],
  flashcards: [
    { front: 'site-packages', back: 'Where pip installs for active venv' },
    { front: 'activate', back: 'Prepends venv bin to PATH' },
    { front: 'Lockfile', back: 'Exact versions for reproducible installs' },
  ],
  quickRevision: [
    'One venv/project',
    'Activate first',
    'Pin deps',
    'Gitignore .venv',
    'Match Python minor',
  ],
}
