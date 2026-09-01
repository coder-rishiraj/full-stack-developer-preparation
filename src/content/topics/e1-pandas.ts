import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Pandas provides DataFrame/Series tabular data structures — labeled axes, missing data handling, groupby aggregations, joins, and IO for CSV/Parquet/SQL.',
  whyExists: 'Real data is messy tables with nulls and mixed operations. NumPy alone lacks row labels and SQL-like joins on heterogeneous columns.',
  mentalModel: 'Excel in Python: rows/columns with index; operations vectorized per column; groupby splits-apply-combine.',
  howItWorks: [
    { type: 'list', items: [
      'DataFrame columns can differ dtypes',
      'loc vs iloc label vs integer indexing',
      'groupby().agg() split-apply-combine',
      'merge/join on keys like SQL',
      'handle NaN: isna, fillna, dropna',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'import pandas as pd\ndf = pd.read_csv(\'sales.csv\')\nmonthly = df.groupby(\'region\')[\'revenue\'].sum()', caption: 'Groupby aggregate' },
  ],
  tradeoffs: {
    advantages: [
      'Expressive data wrangling',
      'Rich IO',
    ],
    disadvantages: [
      'Memory heavy',
      'Chained indexing pitfalls',
    ],
    alternatives: [
      'Polars faster',
      'SQL in warehouse',
    ],
    whenToUse: [
      'EDA',
      'Feature prep',
      'CSV pipelines',
    ],
    whenNotToUse: [
      'Big data beyond RAM — Spark',
    ],
  },
  failureModes: [
    'SettingWithCopyWarning silent bugs',
    'Mixed dtypes in column',
    'Loading entire CSV OOM',
  ],
  production: {
    performance: [
      'Use categorical dtypes',
      'Chunk read_csv for large files',
      'Parquet not CSV at scale',
    ],
  },
  interview: {
    expectations: [
      'DataFrame basics',
      'groupby merge',
    ],
    commonQuestions: [
      'groupby explain?',
    ],
    followUps: [
      'loc vs iloc?',
    ],
    misconceptions: [
      'Always faster than SQL',
    ],
    traps: [
      'Chained assignment',
    ],
    strongSignals: [
      'Avoid loops; vectorized ops',
    ],
  },
  keyTakeaways: [
    'DataFrame labeled tables',
    'groupby split-apply-combine',
    'loc label iloc position',
    'Watch SettingWithCopy',
    'Parquet/chunks at scale',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Series vs DataFrame?', answerHint: 'Series 1D labeled; DataFrame 2D columns.' },
    { level: 'intermediate', question: 'groupby purpose?', answerHint: 'Aggregate/transform per group key.' },
    { level: 'advanced', question: 'Avoid SettingWithCopy?', answerHint: 'Use .loc assignment on explicit copy.' },
  ],
  flashcards: [
    { front: 'groupby', back: 'Split data by key; apply; combine results' },
    { front: 'loc', back: 'Label-based row/col selection' },
  ],
  quickRevision: [
    'DataFrame/Series',
    'groupby agg',
    'merge join',
    'loc vs iloc',
    'NaN handling',
    'Parquet scale',
  ],
}
