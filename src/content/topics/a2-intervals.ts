import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Interval problems represent ranges [start, end] on a line, using sort-merge, sweep lines, or greedy selection to detect overlap, union, intersection, or minimum resource coverage.',
  whyExists:
    'Calendars, IP ranges, and time windows are intervals. Once sorted by start (or end), overlapping ranges become adjacent comparisons—avoiding O(n²) pairwise checks.',
  mentalModel:
    'Timeline with colored segments: sort by when events start, merge touching segments, or count how many overlap at once with a sweep.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Sort intervals—usually by start ascending; for “max non-overlapping,” often by end ascending.',
        'Linear merge: if current start ≤ last end, extend last end; else append new interval.',
        'Overlap test: a overlaps b iff a.start ≤ b.end && b.start ≤ a.end (after sort, compare with last only).',
        'Sweep: convert to events (start +1, end −1), sort by time, track running count.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Start vs end sort',
      text: 'Merge/minimum rooms → sort by start. Activity selection (max intervals) → sort by end time greedy.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Sort[sort by start] --> Loop[for each interval]
  Loop --> Over{start <= lastEnd?}
  Over -->|yes| Extend[max end]
  Over -->|no| Push[new interval]`,
    caption: 'Merge overlapping intervals',
  },
  example: [
    {
      type: 'paragraph',
      text: '[[1,3],[2,6],[8,10],[15,18]] → merge [2,6] into [1,6] → [[1,6],[8,10],[15,18]].',
    },
    {
      type: 'table',
      headers: ['interval', 'last in result', 'action'],
      rows: [
        ['[1,3]', '—', 'add'],
        ['[2,6]', '[1,3]', 'extend to [1,6]'],
        ['[8,10]', '[1,6]', 'add (no overlap)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Merge overlapping intervals',
      code: `Arrays.sort(intervals, (a,b) -> Integer.compare(a[0], b[0]));
List<int[]> res = new ArrayList<>();
for (int[] iv : intervals) {
    if (res.isEmpty() || res.get(res.size()-1)[1] < iv[0])
        res.add(new int[]{iv[0], iv[1]});
    else
        res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], iv[1]);
}`,
    },
    {
      language: 'java',
      caption: 'Max non-overlapping (greedy by end',
      code: `Arrays.sort(intervals, (a,b) -> Integer.compare(a[1], b[1]));
int count = 0, end = Integer.MIN_VALUE;
for (int[] iv : intervals) {
    if (iv[0] >= end) { count++; end = iv[1]; }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Meeting rooms II (min rooms = max overlap',
      code: `public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] start = new int[n], end = new int[n];
    for (int i = 0; i < n; i++) { start[i] = intervals[i][0]; end[i] = intervals[i][1]; }
    Arrays.sort(start); Arrays.sort(end);
    int rooms = 0, i = 0, j = 0;
    while (i < n) {
        if (start[i] < end[j]) { rooms++; i++; }
        else { j++; }
    }
    return rooms;
}`,
    },
  ],
  complexity: {
    best: 'O(n log n) sort dominates',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n) for output or event lists',
  },
  patternRecognition: [
    'Input is list of [start, end] or meetings.',
    'Merge, insert, or remove covered range.',
    'Minimum rooms/coverage = peak concurrent intervals.',
    'Intersection of two interval lists (two pointers).',
    'Point query: is x covered? → merged list + binary search.',
  ],
  commonMistakes: [
    'Using strict overlap when touching should merge (≤ vs < on ends—read problem).',
    'Sorting by start when greedy needs sort by end.',
    'Off-by-one on inclusive/exclusive interval endpoints.',
    'Meeting rooms: two-pointer on unsorted paired starts/ends incorrectly.',
    'Forgetting empty interval list edge case.',
  ],
  variations: [
    'Insert interval into merged list',
    'Interval intersection of two sorted lists',
    'Sweep line with TreeMap for dynamic overlap',
    'Employee free time via merge + gaps',
  ],
  tradeoffs: {
    advantages: [
      'Sort + O(n) scan is interview-friendly',
      'Greedy by end proven optimal for activity selection',
      'Two-pointer merge of sorted lists is O(n+m)',
    ],
    disadvantages: [
      'Endpoint semantics must match problem statement',
      'Sweep with many events needs careful sorting tie-break',
    ],
    alternatives: ['Segment tree for dynamic interval stabbing', 'Priority queue for online meeting scheduling'],
    whenToUse: ['Calendar merge', 'Resource allocation', 'Coverage queries on static set'],
    whenNotToUse: ['High-dimensional boxes without reduction to 1D'],
  },
  failureModes: [
    'Integer overflow on large timestamps (use long if needed).',
    'Event sort tie-break: process end before start at same time for min rooms.',
  ],
  interview: {
    expectations: [
      'Clarify inclusive vs exclusive endpoints',
      'Pick correct sort key for greedy proof',
      'State O(n log n) complexity',
    ],
    commonQuestions: [
      'Merge Intervals',
      'Insert Interval',
      'Non-overlapping Intervals',
      'Meeting Rooms II',
    ],
    followUps: ['Stream of intervals online?', 'Interval intersection of k lists?'],
    misconceptions: ['Always sort by start'],
    traps: ['Non-overlapping: sort by start not end', 'Merge: use < not <= for separate intervals that touch'],
    strongSignals: ['Explains greedy by earliest finish time', 'Handles touching intervals per spec'],
  },
  keyTakeaways: [
    'Merge → sort by start, extend max end.',
    'Max count non-overlap → sort by end, greedy.',
    'Min rooms → two pointers on sorted starts/ends.',
    'Overlap: start ≤ other.end after sort check last.',
    'Clarify inclusive endpoints every time.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When do two intervals overlap?',
      answerHint: 'max(start1,start2) ≤ min(end1,end2) for inclusive; adjust for exclusive.',
    },
    {
      level: 'intermediate',
      question: 'Why sort by end for maximum non-overlapping intervals?',
      answerHint: 'Earliest finish leaves most room—classic greedy exchange argument.',
    },
    {
      level: 'advanced',
      question: 'Meeting Rooms II without explicit sweep events?',
      answerHint: 'Sort starts and ends separately; if next start < earliest end, need new room; else reuse.',
    },
  ],
  flashcards: [
    { front: 'Merge intervals sort key', back: 'Start time ascending.' },
    { front: 'Activity selection sort key', back: 'End time ascending (greedy).' },
  ],
  quickRevision: [
    'Sort by start → merge overlap',
    'Sort by end → max non-overlap',
    'Min rooms = peak overlap',
    'Two-pointer on sorted A,B lists',
    'Clarify inclusive endpoints',
    'O(n log n) typical',
  ],
}
