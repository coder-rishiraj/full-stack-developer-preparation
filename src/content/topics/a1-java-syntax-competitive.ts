import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The minimal Java subset you need to read, write, and debug competitive solutions fast: I/O, arrays, loops, collections imports, and the boilerplate judges expect—without enterprise Java noise.',
  whyExists:
    'Interview platforms and ICPC-style judges compile a single Main class. Knowing Scanner vs BufferedReader, primitive arrays vs boxed lists, and static method structure saves minutes per problem and prevents TLE from slow I/O.',
  mentalModel:
    'One file, one public class matching the filename, static main entry. Read input once, store in arrays/collections, run algorithm, print answers. Prefer primitives and known APIs over custom parsing unless the problem demands it.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'File skeleton: public class Main { public static void main(String[] args) { ... } }',
        'Fast input: BufferedReader + StringTokenizer (or Scanner for small n).',
        'Output: System.out.println / StringBuilder + one println at end.',
        'Data: int[] / long[] for numeric; ArrayList, HashMap, Deque from java.util.',
        'Avoid: System.out in inner loops; autoboxing in hot paths; creating new Scanner per token.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Competitive I/O template',
      code: `import java.io.*;
import java.util.*;

public class Main {
    static final int MOD = 1_000_000_007;
    static final long INF = (long) 4e18;

    public static void main(String[] args) throws Exception {
        var br = new BufferedReader(new InputStreamReader(System.in));
        var st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        // solve...
        System.out.println(answer);
    }
}`,
    },
    {
      type: 'table',
      headers: ['Need', 'Use', 'Avoid'],
      rows: [
        ['Fast read many ints', 'BufferedReader + StringTokenizer', 'Scanner in tight loop'],
        ['Modular arithmetic', 'long for products; (x % MOD + MOD) % MOD', 'int overflow on multiply'],
        ['Infinity sentinel', 'long INF = 4e18', 'Integer.MAX_VALUE + 1 overflow'],
        ['Sort pairs', 'Arrays.sort(a, (i,j) -> ...)', 'Manual bubble sort'],
        ['Debug locally', 'assert, print to stderr', 'Leaving debug prints in submit'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Overflow',
      text: 'Products and prefix sums often need long. Intermediate values in counting problems may need BigInteger—rare in interviews but common on CSES.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  In[stdin] --> BR[BufferedReader]
  BR --> Parse[parse to arrays / lists]
  Parse --> Algo[algorithm]
  Algo --> Out[StringBuilder or println]`,
    caption: 'Typical competitive solution pipeline',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Sum n integers: read n, read line of tokens into int[], accumulate in long, print. Using long avoids overflow when n and values are near 10⁹.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Multi-testcase loop',
      code: `int t = Integer.parseInt(br.readLine());
while (t-- > 0) {
    int n = Integer.parseInt(st.nextToken());
    // solve one case
}`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Graph edge list read',
      code: `List<int[]> edges = new ArrayList<>();
for (int i = 0; i < m; i++) {
    st = new StringTokenizer(br.readLine());
    int u = Integer.parseInt(st.nextToken()) - 1;
    int v = Integer.parseInt(st.nextToken()) - 1;
    edges.add(new int[]{u, v});
}`,
    },
  ],
  complexity: {
    notes: 'I/O dominates for small n; BufferedReader O(total input length). System.out in loop can TLE—batch with StringBuilder.',
  },
  patternRecognition: [
    'Problem gives n, m up to 10⁵–10⁶ → fast I/O and O(n log n) or O(n) algorithm.',
    'Mod 10⁹+7 in statement → use long, normalize negatives.',
    '1-indexed nodes → subtract 1 when storing in 0-indexed arrays.',
  ],
  commonMistakes: [
    'Integer overflow in intermediate arithmetic.',
    'Scanner TLE on large input.',
    'Forgetting to handle t test cases.',
    'Public class name not matching filename.',
    'Using == on Integer objects instead of .equals or unboxing.',
  ],
  tradeoffs: {
    advantages: [
      'Rich stdlib: sort, PQ, maps, deques',
      'Predictable JVM semantics',
      'Strong typing catches many bugs early',
    ],
    disadvantages: [
      'Verbose boilerplate vs Python',
      'No global recursion depth guarantee—watch stack on deep DFS',
      'Slower constant factors than C++ for same algorithm',
    ],
    alternatives: ['Python for prototyping', 'C++ for max speed contests'],
    whenToUse: ['FAANG DSA interviews in Java', 'CSES / Codeforces in chosen language'],
    whenNotToUse: ['When team standard is another language—match interview language'],
  },
  failureModes: [
    'TLE from Scanner or println per element.',
    'WA from int overflow or wrong modulo on subtraction.',
    'RE from ArrayIndexOutOfBounds on 1-indexed assumptions.',
  ],
  interview: {
    expectations: [
      'Write compilable class with main or method signature given',
      'Choose appropriate types (long vs int)',
      'Mention time/space after coding',
    ],
    commonQuestions: [
      'Implement solution with given constraints',
      'Explain why you used HashMap vs array',
    ],
    followUps: ['What if n is 10⁶?', 'How would you parse custom format?'],
    misconceptions: ['Must use Scanner because it is simpler'],
    traps: ['Off-by-one in loops', 'Modulo on negative numbers'],
    strongSignals: ['Uses fast I/O when n is large', 'Names constants MOD, INF'],
  },
  keyTakeaways: [
    'BufferedReader + StringTokenizer for bulk input.',
    'long for sums/products; watch overflow.',
    'One public class, static main, java.util imports.',
    'Batch output; no println in hot loops.',
    '0-index internally; convert 1-indexed input.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why prefer BufferedReader over Scanner for competitive input?',
      answerHint: 'Lower overhead per token; avoids TLE on large n.',
    },
    {
      level: 'intermediate',
      question: 'How do you safely compute (a - b) mod MOD when a < b?',
      answerHint: '(a - b % MOD + MOD) % MOD or add MOD before final mod.',
    },
    {
      level: 'advanced',
      question: 'When would you use BigInteger in an interview problem?',
      answerHint: 'Factorials/combinatorics beyond 64-bit, exact integer arithmetic without mod.',
    },
  ],
  flashcards: [
    {
      front: 'Fast Java competitive read pattern',
      back: 'BufferedReader + StringTokenizer; parseInt on nextToken().',
    },
    {
      front: 'Safe modular subtraction',
      back: '(a - b % MOD + MOD) % MOD.',
    },
  ],
  quickRevision: [
    'Main class + static main',
    'BufferedReader for large input',
    'long for accumulation',
    'MOD / INF constants',
    'StringBuilder for output batching',
    '0-index arrays, 1-index input often',
    'java.util: ArrayList, HashMap, Deque, PQ',
  ],
}
