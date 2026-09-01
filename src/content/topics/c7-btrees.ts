import type { TopicContent } from '@/domain/types'

export const btreesContent: TopicContent = {
  whatIsIt:
    'B-trees and B+ trees are balanced multi-way search trees used by PostgreSQL (B-tree index access method) to index ordered keys — each node holds many keys reducing tree height; B+ trees store all data in leaves with linked sibling pointers for efficient range scans.',
  whyExists:
    'Binary trees degenerate and cause many disk seeks. B/B+ trees match disk page size — high fanout (hundreds of keys per node) keeps height O(log n) with small constant, enabling fast point lookups and sequential leaf scans for ranges.',
  mentalModel:
    'Root → internal nodes (keys only guide search) → leaf level. Search: compare key, follow child pointer. B+: all keys duplicated in leaves; leaves chained for ORDER BY range. PostgreSQL "B-tree" is B+-tree variant. Height ~ log_B(N) — rarely more than 3–4 levels for millions of rows.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Node = disk page (~8KB default); keys sorted within node.',
        'Insert: find leaf, insert; split node if overflow propagating split up.',
        'Delete: remove; merge or borrow from sibling if underfull.',
        'Point query: traverse from root — O(log n) page reads.',
        'Range query: find start leaf, scan along leaf linked list.',
      ],
    },
    {
      type: 'table',
      headers: ['Concept', 'B-tree', 'B+ tree (PostgreSQL)'],
      rows: [
        ['Data in leaves', 'May appear in internal nodes', 'All records/key-TIDs in leaves'],
        ['Range scan', 'Less efficient', 'Leaf sibling links — efficient'],
        ['Fanout', 'High', 'High — shallow tree'],
        ['Use in PG', 'Named B-tree access method', 'Actual structure B+-like'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Root[Root node keys]
  Root --> I1[Internal node]
  Root --> I2[Internal node]
  I1 --> L1[Leaf TID]
  I1 --> L2[Leaf TID]
  I2 --> L3[Leaf TID]
  L1 --> L2
  L2 --> L3`,
    caption: 'B+ tree: internal keys route; leaves hold TIDs and link for ranges',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Index seek vs range on B-tree',
      code: `-- Point lookup — tree descent to leaf
EXPLAIN SELECT * FROM users WHERE id = 42;
-- Index Scan using users_pkey

-- Range — leaf chain scan
EXPLAIN SELECT * FROM orders
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31'
ORDER BY created_at;
-- Index Scan on idx_orders_created_at`,
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Conceptual 3-level tree (millions of rows)',
      code: `Root (1 page, ~500 pointers)
  → Internal (~500 keys each)
    → Leaves (~500 TIDs each)
Height 3 ≈ 500³ ≈ 125M entries max rough fanout illustration`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'PostgreSQL B-tree page types: meta, root, internal, leaf; high key in internal nodes.',
        'Heap TID (block, offset) stored in index leaf — index is separate from heap unless CLUSTER.',
        'Page splits cause index bloat; VACUUM reclaims dead index tuples.',
        'Fillfactor (default 90) leaves space for HOT updates without split.',
        'Multicolumn B-tree: keys compared lexicographically (a, b, c).',
      ],
    },
  ],
  complexity: {
    average: 'Point lookup O(log n) page fetches',
    worst: 'Tree height growth on insert; split propagation rare amortized O(log n)',
    space: 'O(n) index pages proportional to row count and key width',
    notes: 'Cache hit ratio keeps hot root/internal in shared_buffers',
  },
  tradeoffs: {
    advantages: [
      'Fast equality and range queries',
      'Supports ORDER BY on indexed column',
      'Predictable logarithmic depth',
    ],
    disadvantages: [
      'Write amplification on insert/update indexed columns',
      'Not ideal for low-cardinality alone or full-text (use GIN)',
    ],
    alternatives: [
      'Hash index — equality only PostgreSQL',
      'BRIN for naturally ordered huge tables',
      'GIN/GiST for non-scalar types',
    ],
    whenToUse: [
      'Default OLTP indexes on FK, PK, filter columns',
      'Range and sort on timestamps, IDs',
    ],
    whenNotToUse: [
      'Pure equality low-cardinality enum alone sometimes seq scan wins',
      'Unindexed pattern LIKE %suffix',
    ],
  },
  failureModes: [
    'Assuming index is clustered with heap in PostgreSQL (not by default).',
    'Wide VARCHAR keys — large index pages, fewer keys per page, taller tree.',
    'Random UUID insert — page splits and fragmentation vs sequential IDs.',
    'Ignoring buffer cache — cold index still O(log n) but disk bound.',
  ],
  production: {
    performance: ['Monitor index bloat; REINDEX CONCURRENTLY if needed'],
    scalability: ['Sequential IDs or time-ordered keys reduce split churn vs random UUID'],
  },
  interview: {
    expectations: [
      'B+ tree vs binary tree disk rationale',
      'Why high fanout',
      'Point vs range query path',
    ],
    commonQuestions: [
      'How B-tree index works?',
      'B-tree vs B+ tree?',
      'Why PostgreSQL uses B-tree for default index?',
    ],
    followUps: [
      'Index page split impact?',
      'UUID vs serial primary key index perf?',
    ],
    misconceptions: [
      'B-tree is binary tree',
      'Index stores full row copy always (heap TID pointer)',
      'More index levels always mean broken index',
    ],
    traps: ['Confusing B-tree with binary search tree performance on disk'],
    strongSignals: [
      'Leaf linked list for range scans',
      'O(log n) with large fanout per page',
      'TID points to heap row',
    ],
  },
  keyTakeaways: [
    'B+ tree: internal routing keys; data in leaves.',
    'High fanout matches disk pages — shallow tree.',
    'Point = root-to-leaf; range = leaf chain scan.',
    'PostgreSQL default B-tree index access method.',
    'Splits on insert; VACUUM maintains index health.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why B-tree for databases not binary tree?',
      answerHint: 'High fanout per disk page → low height → fewer I/Os.',
    },
    {
      level: 'intermediate',
      question: 'B+ tree leaf sibling links purpose?',
      answerHint: 'Efficient range scans and ORDER BY without climbing tree.',
    },
    {
      level: 'advanced',
      question: 'What does index leaf store in PostgreSQL?',
      answerHint: 'Index key columns + heap TID (block, offset) to fetch row.',
    },
  ],
  flashcards: [
    { front: 'B+ tree leaves', back: 'Hold all keys/TIDs; linked for range scan' },
    { front: 'PostgreSQL default index', back: 'B-tree access method (B+-tree structure)' },
    { front: 'Tree height driver', back: 'Fanout keys per page — typically 3-4 levels for millions' },
  ],
  quickRevision: [
    'B+ not binary',
    'High fanout per page',
    'Leaves linked for range',
    'O(log n) lookups',
    'TID → heap row',
    'Splits on insert',
    'Default PG index type',
  ],
}

export const content = btreesContent
