import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The practical Java toolkit for coding interviews and online judges: how a solution file is structured, how input reaches your program, how you store data, and how you print answers—without enterprise frameworks. You learn this gradually: program shape first, then simple I/O, then faster I/O, then the habits that prevent TLE and WA.',
  whyExists:
    'Interview platforms and contests expect a single compilable class with a main method (or a method signature they provide). Slow I/O, wrong types, and messy output waste the time you need for the algorithm. Building the pipeline step by step means you understand every line of the “competitive template” instead of copying it blindly.',
  mentalModel:
    'Think of every problem as a pipeline: take text from stdin → turn it into numbers/arrays → run your algorithm → write text to stdout. Java gives you several ways to do each stage; start with the simplest that works, then upgrade when constraints demand speed.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — What is a Java solution file? Judges compile one public class whose name matches the file (often Main). Execution starts at public static void main(String[] args). Everything you need for the problem—helpers, constants, and the solve logic—lives in that class or in static methods you call from main.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Minimal skeleton (no I/O yet)',
      code: `public class Main {
    public static void main(String[] args) {
        // 1) read input
        // 2) compute answer
        // 3) print answer
        System.out.println(42);
    }
}`,
    },
    {
      type: 'paragraph',
      text: 'Step 2 — What is stdin / stdout? The judge feeds the problem input as a stream of characters on System.in (standard input). Your program writes the answer to System.out (standard output). You never open a file on the judge—you only read/write these streams. Locally you can redirect a file into stdin for testing.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Local practice',
      text: 'Save sample input to input.txt and run: java Main < input.txt. Compare your stdout to the sample output. This habit catches format bugs before you submit.',
    },
    {
      type: 'paragraph',
      text: 'Step 3 — Start with Scanner (beginner-friendly). Scanner wraps System.in and parses tokens (ints, longs, words) for you. It is easy to read and perfect while you learn algorithms. Use it when n is small (roughly ≤ 10⁴–10⁵ depending on work) or in whiteboard-style interviews where clarity beats micro-optimizations.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'First complete program with Scanner',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
        sc.close();
    }
}`,
    },
    {
      type: 'paragraph',
      text: 'Step 4 — Types you will use constantly. Prefer int for indices and values that fit in ~±2×10⁹. Prefer long for sums, products, and anything near 10¹⁸. Use boolean for flags, char for single characters, and String for lines/tokens you keep as text. Autoboxing (Integer vs int) works but costs time and memory in hot loops—prefer primitives for numeric arrays.',
    },
    {
      type: 'table',
      headers: ['Need', 'Type', 'Why'],
      rows: [
        ['Array length, loop index', 'int', 'Fits; matches Java array indices'],
        ['Sum / product / big value', 'long', 'Avoid overflow'],
        ['Many numbers, fixed size', 'int[] / long[]', 'Fast, no boxing'],
        ['Growing list of ints', 'ArrayList<Integer>', 'Unknown length; later convert if needed'],
        ['Text / tokens as words', 'String', 'readLine / next'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Step 5 — Why Scanner can become too slow. Each nextInt() does more work than “read a few characters and parse.” When the input has 10⁵–10⁶ numbers, that overhead can cause Time Limit Exceeded (TLE) even if your algorithm is O(n). That is when you graduate to BufferedReader.',
    },
    {
      type: 'paragraph',
      text: 'Step 6 — What is BufferedReader? It reads large chunks of characters from System.in into an internal buffer, so you are not paying a heavy cost per character. You typically call readLine() to get one line as a String. You still must parse that String into ints yourself.',
    },
    {
      type: 'paragraph',
      text: 'Step 7 — What is StringTokenizer? Given a line like "3 10 20 30", StringTokenizer splits it on whitespace into tokens ("3", "10", …). You then Integer.parseInt(token) each piece. BufferedReader + StringTokenizer together replace Scanner for bulk numeric input: one reads lines fast, the other splits tokens without regex overhead.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Same sum problem with BufferedReader + StringTokenizer',
      code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += Integer.parseInt(st.nextToken());
        }
        System.out.println(sum);
    }
}`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'When to use which',
      text: 'Learning / small n / interview whiteboard → Scanner is fine. Large n (10⁵+) on Codeforces/CSES-style judges → BufferedReader + StringTokenizer (or a FastScanner class). Never create a new Scanner for every token.',
    },
    {
      type: 'paragraph',
      text: 'Step 8 — Output habits. System.out.println is fine for a few lines. Printing inside a tight loop of 10⁶ iterations can TLE—build a StringBuilder and print once (or rarely). For a single number, one println is enough.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Skeleton: public class + static main.',
        'Understand stdin → your variables → stdout.',
        'Master Scanner on tiny problems first.',
        'Learn BufferedReader (fast lines) then StringTokenizer (fast tokens).',
        'Use long for sums/products; batch output when printing a lot.',
      ],
    },
    {
      type: 'table',
      headers: ['Need', 'Use', 'Avoid'],
      rows: [
        ['Learn / small input', 'Scanner', 'Jumping to FastIO before understanding I/O'],
        ['Fast read many ints', 'BufferedReader + StringTokenizer', 'Scanner in a tight loop on huge n'],
        ['Modular arithmetic', 'long products; (x % MOD + MOD) % MOD', 'int overflow on multiply'],
        ['Infinity sentinel', 'long INF = 4e18', 'Integer.MAX_VALUE + 1 (overflows)'],
        ['Debug locally', 'assert or print to System.err', 'Leaving debug prints in the final submit'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Overflow',
      text: 'Products and prefix sums often need long. Intermediate values in counting problems may need BigInteger—rare in interviews, more common on CSES math tasks.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  In[stdin] --> BR[BufferedReader]
  BR --> Parse[parse to arrays / lists]
  Parse --> Algo[algorithm]
  Algo --> Out[StringBuilder or println]`,
    caption: 'Typical competitive solution pipeline',
    explanation:
      'Read the diagram left to right. stdin is the raw character stream the judge sends. BufferedReader pulls that stream efficiently into lines (Scanner would sit in the same slot for small inputs). Parsing turns those lines into structures your algorithm understands—int[], ArrayList, adjacency lists, and so on. The algorithm box is where the actual problem logic lives; I/O should stay out of it. Finally you emit the answer with println for a short result, or StringBuilder when you must print many lines. If any stage is wrong—slow read, wrong parse, off-by-one in the array, or println-per-element—you get TLE, WA, or RE even when the idea is correct.',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Walkthrough: “read n, then n integers, print their sum.” With Scanner you call nextInt in a loop. With fast I/O you readLine for n, then one line (or several) of tokens into an int[], accumulate into a long, and print once. Using long avoids overflow when n and values are near 10⁹.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Reusable competitive template (after you understand each piece)',
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
        System.out.println(/* answer */);
    }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Multi-testcase loop',
      code: `int t = Integer.parseInt(br.readLine().trim());
while (t-- > 0) {
    StringTokenizer st = new StringTokenizer(br.readLine());
    int n = Integer.parseInt(st.nextToken());
    // solve one case; print its answer
}`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Graph edge list read (0-index after 1-index input)',
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
    notes: 'I/O can dominate for small algorithms. BufferedReader is O(total input length). System.out in a hot loop can TLE—batch with StringBuilder.',
  },
  patternRecognition: [
    'Problem gives n, m up to 10⁵–10⁶ → fast I/O and O(n log n) or O(n) algorithm.',
    'Mod 10⁹+7 in statement → use long, normalize negatives.',
    '1-indexed nodes → subtract 1 when storing in 0-indexed arrays.',
    't test cases on first line → loop t times; reset state each case.',
  ],
  commonMistakes: [
    'Jumping to BufferedReader without understanding Scanner and stdin first.',
    'Integer overflow in intermediate arithmetic.',
    'Scanner TLE on large input.',
    'Forgetting to handle t test cases.',
    'Public class name not matching filename.',
    'Using == on Integer objects instead of .equals or unboxing.',
    'NullPointerException from br.readLine() when input format differs from assumption.',
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
      'Slower constant factors than C++ for the same algorithm',
    ],
    alternatives: ['Python for prototyping', 'C++ for max speed contests'],
    whenToUse: ['FAANG DSA interviews in Java', 'CSES / Codeforces in your chosen language'],
    whenNotToUse: ['When the interview language is fixed to something else—match that language'],
  },
  failureModes: [
    'TLE from Scanner or println per element on large n.',
    'WA from int overflow or wrong modulo on subtraction.',
    'RE from ArrayIndexOutOfBounds on 1-indexed assumptions.',
  ],
  interview: {
    expectations: [
      'Write a compilable class with main or the method signature given',
      'Choose appropriate types (long vs int)',
      'Mention time/space after coding',
      'Explain I/O choice if constraints are large',
    ],
    commonQuestions: [
      'Implement the solution with the given constraints',
      'Explain why you used HashMap vs array',
      'Why might Scanner be too slow?',
    ],
    followUps: ['What if n is 10⁶?', 'How would you parse a custom format?'],
    misconceptions: [
      'You must always use BufferedReader',
      'Scanner is always wrong',
      'println in a loop is always fine',
    ],
    traps: ['Off-by-one in loops', 'Modulo on negative numbers'],
    strongSignals: [
      'Starts simple, upgrades I/O when n is large',
      'Names constants MOD, INF when relevant',
      'Uses long for sums without being prompted',
    ],
  },
  keyTakeaways: [
    'Learn the skeleton and stdin/stdout before any FastIO template.',
    'Scanner first; BufferedReader + StringTokenizer when input is huge.',
    'BufferedReader = fast lines; StringTokenizer = fast token split.',
    'long for sums/products; watch overflow.',
    'Batch output; no println in hot loops.',
    '0-index internally; convert 1-indexed input.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between System.in and a file you open yourself on an online judge?',
      answerHint: 'Judges feed input on stdin; you read System.in. You typically do not open named files on the judge.',
    },
    {
      level: 'basic',
      question: 'When is Scanner a good choice, and when should you switch?',
      answerHint: 'Good for learning and small n; switch to BufferedReader + tokenizer when token count is huge and Scanner risks TLE.',
    },
    {
      level: 'intermediate',
      question: 'What job does BufferedReader do vs StringTokenizer?',
      answerHint: 'BufferedReader buffers and reads lines efficiently; StringTokenizer splits a line into tokens for parseInt.',
    },
    {
      level: 'intermediate',
      question: 'How do you safely compute (a - b) mod MOD when a < b?',
      answerHint: '(a - b % MOD + MOD) % MOD or add MOD before the final mod.',
    },
    {
      level: 'advanced',
      question: 'When would you use BigInteger in an interview problem?',
      answerHint: 'Factorials/combinatorics beyond 64-bit, or exact integer arithmetic without a modulus.',
    },
  ],
  flashcards: [
    {
      front: 'Order to learn Java competitive I/O',
      back: 'Skeleton → stdin/stdout → Scanner → BufferedReader → StringTokenizer → batch output.',
    },
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
    'stdin in → stdout out',
    'Scanner for small / learning',
    'BufferedReader for large input',
    'StringTokenizer for tokens',
    'long for accumulation',
    'MOD / INF constants',
    'StringBuilder for output batching',
    '0-index arrays, 1-index input often',
    'java.util: ArrayList, HashMap, Deque, PQ',
  ],
}
