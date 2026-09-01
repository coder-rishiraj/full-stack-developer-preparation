import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Array/string traversal is the systematic scan of sequential elements—forward, backward, or in-place—using indices or iterators to read, transform, compare, or rewrite data without changing the underlying linear structure.',
  whyExists:
    'Most DSA problems reduce to visiting each element a bounded number of times. Mastering traversal patterns (single pass, two-pass, in-place write pointer) avoids O(n²) re-scans and is the foundation for pointers, windows, and prefix techniques.',
  mentalModel:
    'Walk a hallway of lockers: read each locker once, or use a read finger and a write finger when compacting. Strings behave like char arrays—immutable in Java, so “in-place” often means building a StringBuilder or char buffer.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose direction: left→right (default), right→left (suffix tricks), or both (palindrome).',
        'Decide read-only vs in-place: separate output array, or write index for compaction.',
        'Maintain running state: current char, digit, carry, or segment boundary.',
        'Handle boundaries: empty, length 1, trailing spaces, non-ASCII if stated.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Read/write split',
      text: 'Use read to scan all elements; write only advances when you keep an element. Classic for remove-element, move-zeroes, and filter-in-place.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  R[read index] --> Proc[process a read]
  Proc --> Keep{keep?}
  Keep -->|yes| W[write index++]
  Keep -->|no| Skip[skip write]
  R --> Next[read++]`,
    caption: 'In-place compaction with read/write pointers',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Remove vowels from "leetcode": read scans each char; write copies only consonants → "ltcd". Both pointers move O(n); result length = write.',
    },
    {
      type: 'table',
      headers: ['read', 'char', 'write', 'buffer'],
      rows: [
        ['0', 'l', '0', 'l'],
        ['1', 'e', '0', 'l (skip vowel)'],
        ['2', 'e', '0', 'l'],
        ['3', 't', '1', 'lt'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Read/write in-place filter',
      code: `int write = 0;
for (int read = 0; read < n; read++) {
    if (keep(a[read])) {
        a[write++] = a[read];
    }
}
return write; // new logical length`,
    },
    {
      language: 'java',
      caption: 'Reverse string (char array)',
      code: `void reverse(char[] s, int l, int r) {
    while (l < r) {
        char t = s[l]; s[l] = s[r]; s[r] = t;
        l++; r--;
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Rotate array by k (reverse triple',
      code: `public void rotate(int[] nums, int k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
}
void reverse(int[] a, int l, int r) {
    while (l < r) { int t = a[l]; a[l++] = a[r]; a[r--] = t; }
}`,
    },
  ],
  complexity: {
    best: 'O(n) single pass',
    average: 'O(n)',
    worst: 'O(n) per pass; O(n²) if nested scans per element',
    space: 'O(1) in-place; O(n) if new array/string built',
  },
  patternRecognition: [
    'Transform/filter array or string in one or two passes.',
    'In-place compaction, rotation, or reversal without extra structure.',
    'Parse digits, words, or CSV-like segments while scanning.',
    'Compare characters from both ends (palindrome, symmetric).',
    'Build result with StringBuilder while scanning input once.',
  ],
  commonMistakes: [
    'Off-by-one on substring bounds (inclusive vs exclusive end).',
    'Mutating String directly in Java (immutable)—use char[] or StringBuilder.',
    'Forgetting to trim or skip whitespace in parsing problems.',
    'Using nested loops when read/write or prefix pass suffices.',
    'Not handling empty input or k > n in rotation.',
  ],
  variations: [
    'Backward traversal for suffix DP or “next greater from right”.',
    'Multi-array synchronized traversal (merge-style).',
    'Char-class toggling (case flip, vowel/consonant maps).',
    'Simulated traversal on matrix flattened row-major.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) time with O(1) extra space for in-place variants',
      'Foundation for all linear-structure patterns',
      'Easy to reason about in interviews',
    ],
    disadvantages: [
      'In-place mutation destroys original order/data',
      'Immutable strings require O(n) auxiliary buffer',
    ],
    alternatives: ['Stream API for clarity (not in interviews)', 'Recursion for divide segments', 'Two pointers for pair constraints'],
    whenToUse: ['Single-pass transform', 'In-place filter/compact', 'Parse while scanning'],
    whenNotToUse: ['Need random access to arbitrary historical indices without recomputation', 'Structure is not linear'],
  },
  failureModes: [
    'Integer overflow when accumulating large numeric strings.',
    'Index out of bounds when advancing read/write without checking length.',
  ],
  interview: {
    expectations: [
      'State traversal direction and whether in-place is allowed',
      'Handle empty, single element, all filtered out',
      'Clarify string mutability in Java',
    ],
    commonQuestions: [
      'Reverse String / Reverse Words',
      'Remove Element / Move Zeroes',
      'Valid Palindrome',
      'String to Integer (atoi)',
    ],
    followUps: ['Can you do it in O(1) space?', 'What about Unicode code points?'],
    misconceptions: ['Every string problem needs a char array conversion'],
    traps: ['Palindrome with non-alphanumeric—forget to skip', 'Rotate array with k % n forgotten'],
    strongSignals: ['Separates read vs write roles clearly', 'States O(n) time and space upfront'],
  },
  keyTakeaways: [
    'Default: one left→right pass with O(1) state.',
    'In-place filter → read/write two indices.',
    'Reverse subranges for rotation and palindrome tricks.',
    'Java strings are immutable; use StringBuilder or char[].',
    'Always handle empty and boundary indices.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How do read/write pointers compact an array in-place?',
      answerHint: 'Read scans all; write advances only when element is kept; return write as new length.',
    },
    {
      level: 'intermediate',
      question: 'Rotate array by k in O(n) time and O(1) space?',
      answerHint: 'k %= n; reverse whole, reverse first k, reverse rest.',
    },
    {
      level: 'advanced',
      question: 'When does backward traversal beat forward for arrays?',
      answerHint: 'When answer at i depends on suffix (e.g., product except self from right, daily temperatures from right).',
    },
  ],
  flashcards: [
    { front: 'In-place filter space', back: 'O(1) extra; O(n) time single pass.' },
    { front: 'Java string in-place edit', back: 'Use char[] or StringBuilder; String is immutable.' },
  ],
  quickRevision: [
    'Linear scan = foundation pattern',
    'read/write for in-place filter',
    'Reverse subarray for rotate-by-k',
    'Palindrome = two ends inward',
    'StringBuilder for building output',
    'Check empty and bounds every loop',
  ],
}
