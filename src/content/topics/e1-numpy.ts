import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'NumPy provides ndarrays — homogeneous N-dimensional arrays with vectorized C-backed operations, broadcasting, linear algebra, and slicing without Python loops.',
  whyExists: 'Pure Python lists are slow for numeric workloads. NumPy enables ML, science, and data prep with memory-efficient contiguous arrays.',
  mentalModel: 'Spreadsheet matrix in RAM: shape (rows, cols); operations apply element-wise or along axes without explicit loops.',
  howItWorks: [
    { type: 'list', items: [
      'np.array creates ndarray with dtype (float64, int32)',
      'Shape, reshape, transpose manipulate layout without copy when possible',
      'Broadcasting aligns shapes for element-wise ops',
      'Vectorized ufuncs (np.sin, np.dot) run in C',
      'Boolean masking and fancy indexing select subsets',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'import numpy as np\na = np.array([[1,2],[3,4]])\nb = a * 2          # broadcast\nm = a @ a.T        # matrix multiply\nm[a > 2]           # mask', caption: 'Basics' },
  ],
  tradeoffs: {
    advantages: [
      'Fast vectorized ops',
      'Ecosystem hub for pandas/sklearn',
    ],
    disadvantages: [
      'Homogeneous dtypes only',
      'Memory copies on bad slicing',
    ],
    alternatives: [
      'Pure Python',
      'JAX/Torch tensors',
    ],
    whenToUse: [
      'Numeric preprocessing',
      'Linear algebra',
    ],
    whenNotToUse: [
      'Heterogeneous records — use pandas',
    ],
  },
  failureModes: [
    'Unexpected copy on reshape vs view',
    'dtype overflow int32',
    'Broadcasting shape mismatch silent errors in older code',
  ],
  production: {
    performance: [
      'Prefer views; avoid Python loops on elements',
      'Use float32 when precision allows',
    ],
  },
  interview: {
    expectations: [
      'ndarray vs list',
      'Broadcasting rules',
    ],
    commonQuestions: [
      'What is broadcasting?',
    ],
    followUps: [
      'View vs copy?',
    ],
    misconceptions: [
      'NumPy multi-threaded Python loops',
    ],
    traps: [
      'Modifying view affects original',
    ],
    strongSignals: [
      'Axis parameter, dtype awareness',
    ],
  },
  keyTakeaways: [
    'ndarray homogeneous fast arrays',
    'Vectorization not loops',
    'Broadcasting aligns shapes',
    'Watch view vs copy',
    'Foundation for pandas/ML',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'NumPy vs list?', answerHint: 'Typed contiguous array; vectorized C ops.' },
    { level: 'intermediate', question: 'Broadcasting?', answerHint: 'Align trailing dims; stretch size-1 axes.' },
    { level: 'advanced', question: 'View vs copy?', answerHint: 'Slice often view; fancy index copies.' },
  ],
  flashcards: [
    { front: 'ndarray', back: 'Homogeneous N-D array core type' },
    { front: 'Broadcasting', back: 'Align shapes for element-wise ops without copy' },
  ],
  quickRevision: [
    'np.array dtype',
    'Shape reshape',
    'Vectorize not loop',
    'Broadcast rules',
    'Mask indexing',
    'View vs copy',
  ],
}
