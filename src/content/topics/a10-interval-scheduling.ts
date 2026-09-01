import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Interval scheduling selects maximum non-overlapping intervals from a set—classic greedy after sorting by end time. Pick earliest-finishing compatible interval, remove overlaps, repeat. Variants sort by start for merging, by end for activity selection, or use heaps for streaming intervals.',
  whyExists:
    'Resource allocation (rooms, CPUs, meeting rooms), merge calendars, and minimum arrows to burst balloons share interval greedy structure. Correct proof: choosing earliest finish leaves maximum room for future intervals.',
  mentalModel:
    'Finish early, free the resource sooner. Sort by end; greedily take next interval that starts after last end.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Sort intervals by end (or start for merge problems).',
        'Initialize count=1, end=first.end (activity selection).',
        'For each interval: if start >= end, take it, update end.',
        'Merge overlapping: if start <= prevEnd, extend prevEnd; else push new.',
        'Meeting rooms II: min-heap of end times for concurrent count.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Maximum non-overlapping intervals',
      code: `int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int end = intervals[0][1], removed = 0;
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) removed++;
        else end = intervals[i][1];
    }
    return removed;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Intervals [1,3], [2,4], [3,5] sorted by end: pick [1,3], skip overlapping [2,4], pick [3,5] → two non-overlapping.',
    },
  ],
  complexity: {
    average: 'O(n log n) sort dominates',
    worst: 'O(n log n)',
    space: 'O(1) excluding sort or O(n) heap variant',
  },
  tradeoffs: {
    advantages: ['Optimal for classic activity selection', 'Simple O(n log n)', 'Heap extends to dynamic streams'],
    disadvantages: ['Wrong sort key breaks optimality', 'Weighted intervals need DP not greedy'],
    alternatives: ['DP for weighted interval scheduling', 'Sweep line for complex overlap queries'],
    whenToUse: ['Max non-overlap count', 'Merge intervals', 'Min meeting rooms'],
    whenNotToUse: ['Weighted intervals → DP', 'Arbitrary profit not length-based'],
  },
  failureModes: [
    'Sort by start for max non-overlap → suboptimal.',
    'Off-by-one on overlap (start == end usually non-overlap).',
    'Confuse min removals vs max kept.',
  ],
  interview: {
    expectations: ['Sort by end for activity selection', 'O(n log n)', 'Heap for meeting rooms II'],
    commonQuestions: ['Non-overlapping Intervals', 'Merge Intervals', 'Meeting Rooms II'],
    followUps: ['Prove greedy by end?', 'Weighted version?'],
    misconceptions: ['Sort by start always', 'Greedy works for weighted'],
    traps: ['Inclusive/exclusive interval boundaries', 'Empty input'],
    strongSignals: ['States exchange argument for end sort', 'Separate merge vs select templates'],
  },
  patternRecognition: [
    'Each item is a start/end interval and the objective is to maximize compatible selections.',
    'Choosing one interval prevents choosing overlapping intervals on a single resource.',
    'The problem asks for minimum removals to eliminate overlaps.',
    'A weighted interval variant explicitly assigns profit or value to each choice.',
  ],
  commonMistakes: [
    'Sorting by start time for maximum non-overlapping selection instead of by end time.',
    'Treating touching intervals as overlapping when start == previous end is allowed.',
    'Applying the unweighted greedy rule to weighted interval scheduling.',
    'Confusing the count of kept intervals with the count of intervals removed.',
  ],
  keyTakeaways: [
    'Max non-overlap: sort by end, greedy take compatible.',
    'Merge: sort by start, extend or append.',
    'Meeting Rooms II: min-heap of end times.',
    'Weighted intervals → DP on sorted ends.',
    'O(n log n) from sorting.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Interval scheduling sort key?', answerHint: 'Sort by finish time (end) for max non-overlapping.' },
    { level: 'intermediate', question: 'Meeting Rooms II approach?', answerHint: 'Sort by start; min-heap of end times; pop if start >= min end; push end; max heap size.' },
    { level: 'advanced', question: 'Why earliest finish is optimal?', answerHint: 'Exchange argument: swapping to earlier finish never reduces feasible future choices.' },
  ],
  flashcards: [
    { front: 'Activity selection sort', back: 'By interval end time ascending.' },
    { front: 'Merge intervals sort', back: 'By start time ascending.' },
  ],
  quickRevision: [
    'End sort → max non-overlap',
    'Start sort → merge',
    'Heap → concurrent meetings',
    'O(n log n)',
    'Weighted → DP not greedy',
    'start >= end non-overlap',
    'Exchange argument proof',
  ],
}
