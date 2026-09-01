import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'String is immutable in Java; every concat creates a new object. StringBuilder is mutable char buffer for O(1) amortized append. charAt, substring, and toCharArray are core string DSA primitives.',
  whyExists:
    'Building strings in loops with + causes O(n²) copying. Interviews test palindromes, anagrams, parsing, and pattern matching—know immutability, ASCII vs Unicode pitfalls, and StringBuilder for output.',
  mentalModel:
    'String = frozen char sequence; hash cached, equals compares content. StringBuilder = resizable char[] with append/delete; call toString() once at end. toCharArray() copies for in-place char algorithms.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        's.charAt(i) O(1); s.length(); s.substring(begin,end) O(n) copy.',
        'StringBuilder sb = new StringBuilder(); sb.append(c); sb.reverse(); sb.toString().',
        'String.join(",", list) for output formatting.',
        's.toCharArray() for two-pointer in-place on array copy.',
        'String.valueOf(int) for building from numbers without concat in loop.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Efficient build vs quadratic concat',
      code: `// BAD: O(n^2) total copying
String bad = "";
for (int i = 0; i < n; i++) bad += (char)('a' + i);

// GOOD
StringBuilder sb = new StringBuilder(n);
for (int i = 0; i < n; i++) sb.append((char)('a' + i));
String good = sb.toString();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Anagram frequency (26-letter)',
      code: `int[] cnt = new int[26];
for (char c : s.toCharArray()) cnt[c - 'a']++;
// compare cnt arrays for anagram`,
    },
    {
      type: 'table',
      headers: ['Operation', 'String', 'StringBuilder'],
      rows: [
        ['append in loop', 'O(n²) total', 'O(n) amortized'],
        ['charAt', 'O(1)', 'O(1)'],
        ['reverse', 'O(n) new string', 'O(n) in place'],
        ['thread-safe', 'immutable safe', 'StringBuffer sync; SB not'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Valid palindrome: two pointers on char array after filtering alnum lowercase. StringBuilder not needed unless reconstructing; toCharArray or charAt both O(1) per step.',
    },
  ],
  complexity: {
    average: 'StringBuilder append O(1) amortized; String concat n times O(n²)',
    worst: 'substring creates new String O(k)',
    space: 'StringBuilder O(n) buffer',
  },
  patternRecognition: [
    'Building result character-by-character → StringBuilder.',
    'Anagram / frequency → int[26] or HashMap char counts.',
    'Two pointers on string → charAt or char array.',
    'Parsing digits/words → index scan, no split if TLE risk.',
  ],
  commonMistakes: [
    '+= in loop on String.',
    's == t for content equality (use s.equals(t)).',
    'substring(end) off-by-one—end exclusive.',
    'Assuming O(1) substring when copying.',
  ],
  tradeoffs: {
    advantages: ['String immutable → safe keys in HashMap', 'StringBuilder fast build'],
    disadvantages: ['No in-place String edit', 'Unicode code points need codePointAt for full Unicode'],
    alternatives: ['char[] for in-place', 'byte[] for competitive fast IO parsing'],
    whenToUse: ['StringBuilder for output', 'int[26] for lowercase anagrams'],
    whenNotToUse: ['Few fixed concat → literal + ok'],
  },
  failureModes: [
    'TLE from repeated String concat.',
    'Unicode surrogate pair bugs in rare interview edge cases.',
  ],
  interview: {
    expectations: ['Know immutability', 'StringBuilder for construction', 'Anagram counting pattern'],
    commonQuestions: ['Valid Anagram', 'Longest Palindrome', 'String compression'],
    followUps: ['String vs StringBuffer?', 'Handle Unicode code points?'],
    misconceptions: ['String concat in loop is O(n)'],
    traps: ['== vs equals on String'],
    strongSignals: ['Uses StringBuilder(n) with initial capacity hint'],
  },
  keyTakeaways: [
    'String immutable; + in loop is O(n²).',
    'StringBuilder for dynamic build.',
    'equals for content; == for reference.',
    'int[26] anagram trick for lowercase a-z.',
    'substring end index exclusive.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why StringBuilder in loops?',
      answerHint: 'String concat copies entire string each time → O(n²); SB amortized O(n).',
    },
    {
      level: 'intermediate',
      question: 'Check anagram in O(n) for lowercase a-z?',
      answerHint: 'Count array size 26; increment s, decrement t; all zero.',
    },
    {
      level: 'advanced',
      question: 'When does substring copy in Java 7+?',
      answerHint: 'substring creates new char array copy (since Java 7u6); O(k) for length k.',
    },
  ],
  flashcards: [
    {
      front: 'String equality',
      back: 's.equals(t) for content; == compares references.',
    },
    {
      front: 'Anagram count array size',
      back: '26 for lowercase English letters; cnt[c - \'a\'].',
    },
  ],
  quickRevision: [
    'String immutable',
    'StringBuilder for append loops',
    'equals not ==',
    'charAt / toCharArray',
    'int[26] anagram counts',
    'substring end exclusive',
  ],
}
