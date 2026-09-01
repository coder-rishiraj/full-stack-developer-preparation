import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Prefix matching finds occurrences of pattern P in text T efficiently—KMP uses failure (LPS) array to skip re-comparisons on mismatch; rolling hash (Rabin-Karp) compares substring hashes in O(1) average with modular arithmetic and base powers.',
  whyExists:
    'Naive O(n·m) character-by-character retry wastes work when partial match repeats. KMP guarantees O(n+m); rolling hash enables multiple pattern search and substring equality checks in competitive programming.',
  mentalModel:
    'KMP: when mismatch at j, jump j to lps[j-1]—longest proper prefix that is also suffix of matched part. Rolling hash: treat substring as base-B number mod M; slide window subtract/add one char.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Build LPS: lps[i] = length of longest proper prefix of P[0..i] which is also suffix.',
        'Scan T with i on text, j on pattern; match → i++, j++; mismatch → j=lps[j-1] if j>0 else i++.',
        'Rolling hash: H(s[i..i+L-1]) = (H_prev - s[i-1]*B^(L-1) + s[i+L-1]) mod M; compare H with pattern hash.',
        'Double hash or verify on collision for safety.',
        'KMP finds all occurrences in one pass; return first or list of indices.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'P="ababac", LPS=[0,0,1,2,3,0]: mismatch at T[i] vs P[5] after matching "abab", j jumps lps[4]=3 to resume at P[3] without resetting i.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'KMP search (first occurrence index)',
      code: `int kmpSearch(String text, String pattern) {
    int[] lps = buildLps(pattern);
    int i = 0, j = 0;
    while (i < text.length()) {
        if (text.charAt(i) == pattern.charAt(j)) { i++; j++; }
        else if (j > 0) j = lps[j - 1];
        else i++;
        if (j == pattern.length()) return i - j;
    }
    return -1;
}
int[] buildLps(String p) {
    int[] lps = new int[p.length()];
    for (int i = 1, len = 0; i < p.length(); ) {
        if (p.charAt(i) == p.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return lps;
}`,
    },
    {
      language: 'java',
      caption: 'Rabin-Karp rolling hash',
      code: `List<Integer> rabinKarp(String s, String p) {
    int n = s.length(), m = p.length();
    long B = 31, M = 1_000_000_007;
    long ph = 0, sh = 0, pow = 1;
    List<Integer> ans = new ArrayList<>();
    for (int i = 0; i < m; i++) {
        ph = (ph * B + p.charAt(i)) % M;
        sh = (sh * B + s.charAt(i)) % M;
        if (i > 0) pow = pow * B % M;
    }
    for (int i = 0; i <= n - m; i++) {
        if (sh == ph && s.substring(i, i + m).equals(p)) ans.add(i);
        if (i < n - m) {
            sh = (sh - s.charAt(i) * pow % M + M) % M;
            sh = (sh * B + s.charAt(i + m)) % M;
        }
    }
    return ans;
}`,
    },
  ],
  complexity: {
    average: 'KMP O(n+m); Rabin-Karp O(n+m) with O(1) hash steps',
    worst: 'Rabin-Karp O(n·m) if many hash collisions without verify',
    space: 'O(m) LPS or hash prep',
  },
  patternRecognition: [
    'Implement strStr() / indexOf.',
    'Repeated substring pattern (KMP on s+s).',
    'Longest happy prefix (LPS of full string).',
    'Multiple pattern search with rolling hash.',
  ],
  commonMistakes: [
    'LPS off-by-one: lps[i] for prefix ending at i.',
    'KMP mismatch branch forget j>0 check.',
    'Rolling hash negative mod without +M.',
    'Single hash collision false positive without char verify.',
  ],
  tradeoffs: {
    advantages: [
      'KMP linear deterministic',
      'Rolling hash simple for many patterns',
      'LPS reusable for string structure problems',
    ],
    disadvantages: [
      'KMP harder to code under pressure',
      'Rolling hash needs collision handling',
      'Not for edit distance (use DP)',
    ],
    alternatives: ['Built-in indexOf (Sunday/BM in JDK)', 'Z-algorithm for prefix matching', 'Trie for multiple strings'],
    whenToUse: ['Exact substring search', 'Pattern preprocessing amortized', 'Competitive programming hash slides'],
    whenNotToUse: ['Fuzzy match / edit distance', 'Very short strings naive OK'],
  },
  failureModes: [
    'Empty pattern: define return 0 or -1 consistently.',
    'Integer overflow hash—use long mod.',
    'LPS build infinite loop if i not advanced on len==0 branch.',
  ],
  interview: {
    expectations: [
      'Explain LPS / failure function',
      'KMP O(n+m)',
      'Rolling hash slide window',
    ],
    commonQuestions: ['Implement strStr', 'Explain KMP mismatch jump', 'Rabin-Karp collision?'],
    followUps: ['Build LPS example?', 'Find all occurrences?', 'Z-algorithm comparison?'],
    misconceptions: ['Naive always fine', 'KMP resets i on mismatch', 'Hash compare replaces char check always'],
    traps: ['Off-by-one on return index', 'Mod arithmetic sign'],
    strongSignals: ['Walks LPS construction', 'Knows when to verify hash', 'States linear time proof sketch'],
  },
  keyTakeaways: [
    'LPS[j-1] jump on mismatch—never move i back.',
    'KMP O(n+m) time O(m) space.',
    'Rolling hash: subtract left char, add right, mod M.',
    'Verify hash equality with equals() for correctness.',
    'LPS also solves prefix=suffix problems.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'KMP time complexity?', answerHint: 'O(n + m)—i advances across text, j only moves forward with LPS jumps.' },
    { level: 'intermediate', question: 'What does LPS[i] mean?', answerHint: 'Length of longest proper prefix of P[0..i] that is also suffix of that substring.' },
    { level: 'advanced', question: 'Rabin-Karp why verify match?', answerHint: 'Hash collisions different strings same mod—confirm with direct compare when hashes equal.' },
  ],
  flashcards: [
    { front: 'KMP on mismatch', back: 'j = lps[j-1] if j > 0, else i++.' },
    { front: 'KMP time', back: 'O(n + m).' },
    { front: 'Rolling hash slide', back: 'Remove left char * B^(L-1), add new right char, mod M.' },
  ],
  quickRevision: [
    'Build LPS first',
    'Mismatch: j=lps[j-1]',
    'i never decreases',
    'O(n+m) KMP',
    'Hash slide O(1)',
    'Verify on hash match',
    'long mod arithmetic',
  ],
}
