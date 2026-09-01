import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bucket sort is a non-comparison distribution sort: map each element to a bucket index by key range, sort each bucket individually (often insertion sort), then concatenate buckets in order. Average O(n) when n buckets receive roughly uniform distribution.',
  whyExists:
    'Comparison sorts have an Ω(n log n) lower bound. When keys are uniformly distributed over a known range—especially floats in [0,1) or integers in a small span—bucket sort avoids comparisons across the full array and achieves linear average time.',
  mentalModel:
    'Sort mail into zip-code bins; each bin holds a small pile you sort by hand; stack bins left-to-right for global order. Bad day: every letter lands in one bin and you are back to O(n²).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose bucket count m ≈ n (or fixed for known range).',
        'Compute index: for [0,1) floats, idx = (int)(n * val); for integers, idx = (val - min) * m / (max - min + 1).',
        'Scatter each element into buckets[idx].',
        'Sort each bucket with insertion sort (small) or merge sort (stable).',
        'Concatenate buckets from index 0 to m-1 into output.',
        'Stability preserved if bucket sorts are stable and scatter preserves order within bucket.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Uniform distribution assumption',
      text: 'If all keys hash to one bucket, inner sort dominates at O(n²). Bucket sort is not a general-purpose replacement for merge/quick sort.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Floats [0.42, 0.12, 0.91, 0.23] with n=4 buckets: bucket 0 gets 0.12, bucket 1 gets 0.23, bucket 2 gets 0.42, bucket 3 gets 0.91—each bucket size 1, no inner sort work, output sorted.',
    },
    {
      type: 'table',
      headers: ['variant', 'bucket index', 'inner sort'],
      rows: [
        ['Floats [0,1)', '(int)(n * val)', 'insertion sort per bucket'],
        ['Integers [min,max]', '(val-min)*m/(max-min+1)', 'counting sort if bucket range tiny'],
        ['Radix companion', 'digit bucket', 'radix uses fixed-width digit buckets'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Bucket sort for floats in [0, 1)',
      code: `void bucketSort(float[] a) {
    int n = a.length;
    List<List<Float>> buckets = new ArrayList<>();
    for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());
    for (float v : a) {
        int idx = Math.min(n - 1, (int)(n * v));
        buckets.get(idx).add(v);
    }
    for (List<Float> b : buckets) Collections.sort(b);
    int i = 0;
    for (List<Float> b : buckets)
        for (float v : b) a[i++] = v;
}`,
    },
    {
      language: 'java',
      caption: 'Integer bucket sort with min/max shift',
      code: `void bucketSortInt(int[] a) {
    int min = Arrays.stream(a).min().getAsInt();
    int max = Arrays.stream(a).max().getAsInt();
    int n = a.length, range = max - min + 1;
    int bucketCount = Math.max(1, n);
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < bucketCount; i++) buckets.add(new ArrayList<>());
    for (int v : a) {
        int idx = range == 1 ? 0 : (v - min) * (bucketCount - 1) / (range - 1);
        buckets.get(idx).add(v);
    }
    int i = 0;
    for (List<Integer> b : buckets) {
        Collections.sort(b);
        for (int v : b) a[i++] = v;
    }
}`,
    },
  ],
  complexity: {
    best: 'O(n) when each bucket holds O(1) elements',
    average: 'O(n) with uniform distribution and m ≈ n',
    worst: 'O(n²) when all elements land in one bucket',
    space: 'O(n + m) buckets plus elements',
  },
  patternRecognition: [
    'Sort floats uniformly in [0, 1) — classic LeetCode variant.',
    'External sort chunks: bucket by hash/range then sort chunks.',
    'Combine with radix: bucket by digit, not full range.',
    'When interviewer says "uniformly distributed keys" — bucket sort signal.',
  ],
  commonMistakes: [
    'Index (int)(n * v) without clamping v=1.0 → ArrayIndexOutOfBounds.',
    'Using bucket sort on adversarial clustered data without acknowledging worst case.',
    'Forgetting negative numbers—shift by min before indexing.',
    'Unstable inner sort when stability required.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) average on uniform data',
      'Non-comparison sort bypasses Ω(n log n) bound',
      'Stable with stable bucket sorts',
      'Simple to implement for [0,1) floats',
    ],
    disadvantages: [
      'Worst case O(n²) on clustered keys',
      'Requires knowledge of key range/distribution',
      'Extra space for bucket lists',
      'Poor cache locality vs in-place sorts',
    ],
    alternatives: ['Counting sort for small integer range', 'Radix sort for fixed-width digits', 'Merge sort general purpose'],
    whenToUse: ['Uniform float keys in known range', 'External sort by range partition', 'Interview "uniform distribution" hint'],
    whenNotToUse: ['Unknown or skewed distribution', 'Comparison-only requirement without range info', 'Memory-constrained in-place need'],
  },
  failureModes: [
    'All elements in one bucket → quadratic inner sort.',
    'Wrong bucket formula for negatives or max==min.',
    'Float precision: 1.0 maps to bucket n without min(n-1, ...) clamp.',
  ],
  interview: {
    expectations: [
      'Explain non-comparison nature and uniform assumption',
      'O(n) average, O(n²) worst case',
      'Float [0,1) index formula',
    ],
    commonQuestions: ['Sort Array of floats in [0,1)', 'Bucket sort vs counting sort', 'When is bucket sort linear?'],
    followUps: ['What if distribution not uniform?', 'How to make stable?', 'Relation to radix sort?'],
    misconceptions: ['Always O(n) regardless of input', 'Same as counting sort', 'Works on any comparable keys without range'],
    traps: ['Forgetting clamp at n-1 for v=1.0', 'Not handling empty array or single bucket'],
    strongSignals: ['States uniform distribution prerequisite', 'Mentions insertion sort for small buckets', 'Contrasts with radix digit buckets'],
  },
  keyTakeaways: [
    'Non-comparison distribution sort—scatter, sort buckets, concatenate.',
    'O(n) average when buckets evenly sized; O(n²) worst if one bucket.',
    'Float [0,1): idx = min(n-1, (int)(n * val)).',
    'Stable if bucket sorts stable.',
    'Needs known range and roughly uniform keys.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Bucket sort average time complexity?', answerHint: 'O(n) when n buckets each hold O(1) elements on uniform input.' },
    { level: 'intermediate', question: 'Why is bucket sort not comparison-based?', answerHint: 'Elements placed by range index, not pairwise compare; beats n log n only under distribution assumptions.' },
    { level: 'advanced', question: 'Bucket sort vs radix sort?', answerHint: 'Bucket sort one pass by full range; radix multiple passes by digit; radix for fixed-width integers, bucket for continuous uniform range.' },
  ],
  flashcards: [
    { front: 'Bucket sort average time', back: 'O(n) with uniform distribution and m ≈ n buckets.' },
    { front: 'Bucket sort worst case', back: 'O(n²) when all elements in one bucket.' },
    { front: 'Float bucket index [0,1)', back: 'idx = min(n-1, (int)(n * val))' },
  ],
  quickRevision: [
    'Non-comparison distribution sort',
    'Scatter → sort buckets → concat',
    'O(n) avg uniform; O(n²) one bucket',
    'Float idx: (int)(n*v), clamp n-1',
    'Shift negatives by min',
    'Stable if inner sort stable',
    'Needs range + uniform keys',
  ],
}
