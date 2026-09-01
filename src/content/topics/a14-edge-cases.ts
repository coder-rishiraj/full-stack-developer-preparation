import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Edge-case identification means systematically listing inputs that break naive code—empty, single element, duplicates, negatives, overflow, null, sorted/reverse sorted, max constraints, and off-by-one boundaries—before and after implementation.',
  whyExists:
    'Most failed interviews pass happy paths but crash on empty array or wrong index. Proactively naming edges signals thoroughness and prevents last-minute panic debugging.',
  mentalModel:
    'QA checklist before ship: what is the smallest, weirdest, and largest input that could break this function?',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Empty collection / null root.',
        'Single element.',
        'All same values / all duplicates.',
        'Already sorted / reverse sorted.',
        'Integer overflow on sum/product.',
        'Off-by-one: first/last index, inclusive ranges.',
      ],
    },
  ],
  example: [
    {
      type: 'table',
      headers: ['Problem type', 'Edge cases'],
      rows: [
        ['Binary search', 'Empty, single, target absent, duplicates'],
        ['Linked list', 'Empty head, single node, cycle'],
        ['Tree', 'Null root, skewed line, all left children'],
        ['Intervals', 'Touching vs overlapping boundaries'],
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Prevents submit bugs', 'Impresses interviewer', 'Guides test design'],
    disadvantages: ['Can paralyze if over-list without coding', 'Not all edges equally likely'],
    alternatives: ['Use problem examples as minimum tests', 'Invariant-based reasoning'],
    whenToUse: ['After clarifying requirements', 'Before saying done'],
    whenNotToUse: ['Do not spend 10 minutes listing without coding'],
  },
  failureModes: [
    'Test only given example.',
    'Miss empty input.',
    'Wrong behavior on duplicate keys in map.',
  ],
  interview: {
    expectations: ['Name 3-5 edges verbally', 'Trace one edge after coding', 'Fix bugs found'],
    commonQuestions: ['What edge cases for X?', 'Evaluate testing thoroughness'],
    followUps: ['Stress max n?', 'Floating point edges?'],
    misconceptions: ['Examples cover all edges', 'Edge cases only at end'],
    traps: ['Integer.MIN_VALUE abs', 'Modulo negative'],
    strongSignals: ['Edges tied to code branches', 'Adds guard clauses cleanly'],
  },
  keyTakeaways: [
    'Always consider empty and single element.',
    'Duplicates and sorted order affect algorithm choice.',
    'Check overflow and boundary indices.',
    'Mention edges early; test after coding.',
    'Problem examples are minimum not exhaustive.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Universal array edge cases?', answerHint: 'Empty, one element, two elements, duplicates, negatives if allowed.' },
    { level: 'intermediate', question: 'Binary search edge cases?', answerHint: 'Empty, single, target before first/after last, exact match at ends.' },
    { level: 'advanced', question: 'Tree recursion edges?', answerHint: 'Null root returns base; single node; skew depth overflow stack.' },
  ],
  flashcards: [
    { front: 'First edge cases to mention', back: 'Empty and single element.' },
    { front: 'When to discuss edges', back: 'During clarify and before declaring done.' },
  ],
  quickRevision: [
    'Empty null single',
    'Duplicates sorted',
    'Overflow boundaries',
    'First last index',
    'Max constraint n',
    'Trace after code',
    'Examples not enough',
  ],
}
