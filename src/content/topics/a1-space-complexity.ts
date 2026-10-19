import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**Space complexity** counts the extra memory a solution uses as **n** grows: maps, queues, the recursion stack, a DP table, and sometimes the output. It is reported in the same Big-O language as time.',
  whyExists:
    'A judge also caps memory, often a few hundred megabytes. Storing every subset, an **n × n** table, or a recursion **n** frames deep can fail even when the time looks fine. “What is the space?” checks that you counted the map and the stack, not only the loops.',
  mentalModel:
    'The input is already in memory. Count what **you** allocate on top of it. A **HashMap** of **n** entries is **O(n)**. A recursion of depth **d** is **O(d)** stack frames. Two indexes walking an array allocate nothing that grows with **n**.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Extra memory, not the input.',
        'Auxiliary space and output space, said separately.',
        'The usual structures and what they cost.',
        'In-place work, and the sort’s hidden stack.',
        'Dropping a DP dimension you no longer read.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — What counts',
    },
    {
      type: 'list',
      items: [
        'Time asks how many steps. Space asks how many extra cells, objects, or stack frames.',
        'The input array is given to you. Interviewers usually do not charge it as your algorithm’s space, unless you copy it.',
        '**toCharArray()**, **clone()**, and **new int[n]** are copies. Each is **O(n)** extra.',
        'A few local variables, **int l** and **int r**, are **O(1)**. They do not grow with **n**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Say auxiliary and output apart',
    },
    {
      type: 'list',
      items: [
        '**Auxiliary** space is the working memory: the map, the queue, the stack frames, the DP table.',
        '**Output** space is the list you return. A problem that asks for every subset returns **O(2ⁿ)** lists. That memory is real. Say so, and also say what you used besides the answer.',
        'The useful sentence is specific. “**O(n)** time, **O(1)** auxiliary” means a few pointers on the input array. “**O(n)** auxiliary for the HashMap” means the map is the extra memory.',
        '“**O(1)** space” while a **HashMap** holds **n** keys is the mistake this page exists to prevent.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'The sentence to say out loud',
      text: '**O(n)** auxiliary for the HashMap, and **O(k)** for the answer list. If the answer is every subset, **k** is **2ⁿ**. Naming both numbers is clearer than one unlabeled **O** .',
    },
    {
      type: 'heading',
      text: 'Step 3 — What each structure costs',
    },
    {
      type: 'table',
      headers: ['What you allocated', 'Space'],
      rows: [
        ['**HashMap** or **HashSet** with n entries', '**O(n)**'],
        ['Adjacency lists, V vertices and E edges', '**O(V + E)**'],
        ['Recursion of depth d', '**O(d)** stack frames'],
        ['An n by n DP table', '**O(n²)**'],
        ['Two pointers on the input', '**O(1)** auxiliary'],
        ['**Arrays.sort** (TimSort)', '**O(log n)** stack, typically'],
      ],
    },
    {
      type: 'list',
      items: [
        'A stack frame holds the parameters and locals of one call. Depth **d** means **d** of those frames are alive at once. A balanced tree is about **log n** frames. A skewed tree is **n** frames.',
        'BFS stores a queue. On a tree the widest level can be **O(n)** nodes, so the queue is **O(n)** in the worst case, even though the recursion version would only have been **O(h)** stack.',
        'A boxed **Integer** inside a **HashMap** is much larger than one slot of an **int[]**. If the values are a small range, a frequency array is less memory and usually faster.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — In place means a handful of variables',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A swap uses the array you were given',
      code: `// O(1) auxiliary: reverse in place
void reverse(int[] a) {
    for (int l = 0, r = a.length - 1; l < r; l++, r--) {
        int t = a[l]; a[l] = a[r]; a[r] = t;
    }
}

// O(n) auxiliary: one entry per distinct value you store
Map<Integer, Integer> freq = new HashMap<>();

// O(h) stack: one frame per ancestor on the path
int depth(TreeNode n) {
    if (n == null) return 0;
    return 1 + Math.max(depth(n.left), depth(n.right));
}`,
    },
    {
      type: 'list',
      items: [
        'Reversing by swapping writes into the input. The only extras are **l**, **r**, and **t**. That is **O(1)** auxiliary. The array itself is the input, and here it is also the output.',
        '**Arrays.sort** on an **int[]** does not allocate a second copy of the array, but **TimSort** uses a small run stack, **O(log n)** in the usual case. If you need to claim **O(1)** extra and the judge cares, say that the sort’s stack is **O(log n)**, or sort with a method you know is in place.',
        'Building the frequency map allocates one entry per distinct key you insert. Up to **n** keys means **O(n)**, even though the loop that fills it looks like “just a scan.”',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Keep only the row you still read',
    },
    {
      type: 'list',
      items: [
        'A DP table of **n** rows and **m** columns is **O(nm)** memory.',
        'If row **i** is computed only from row **i - 1**, the older rows are dead. Keep two arrays of length **m**, the previous row and the current row. The table drops from **O(nm)** to **O(m)**.',
        'If you only need one rolling value, such as a Fibonacci pair, two variables replace the whole array and the auxiliary space is **O(1)** besides the output.',
        'You cannot drop a row you will read again later. The transition decides whether the roll is legal.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — space',
      questions: [
        {
          prompt: 'Two Sum stores every value in a HashMap. What space do you report?',
          options: [
            'O(1), because get is O(1)',
            'O(n) auxiliary for up to n map entries',
            'O(n²), because you might look at every pair',
            'O(log n), because the map is a tree',
          ],
          answer: 1,
          explanation: '**HashMap** is not a balanced tree. It stores up to **n** entries, so the extra memory is **O(n)**. The **O(1)** claim is about average time per operation.',
        },
        {
          prompt: 'DFS on a binary tree uses recursion. What is the extra space?',
          options: [
            'Always O(1)',
            'O(h) stack frames. h is log n when balanced and n when skewed.',
            'O(n²) for the two children',
            'Only the heap objects. The stack is free.',
          ],
          answer: 1,
          explanation: 'Each call waits on the stack until its children return. The deepest chain is the height. A stick-shaped tree keeps **n** frames alive.',
        },
        {
          prompt: 'You build a HashMap of size n and say the algorithm is O(1) space. What is wrong?',
          options: [
            'Nothing, if the loop is a single pass',
            'The map is O(n) auxiliary. O(1) would be a few variables.',
            'HashMap space is O(log n)',
            'O(1) means one map',
          ],
          answer: 1,
          explanation: '**O(1)** auxiliary means the extra memory does not grow with **n**. **n** entries grow with **n**.',
        },
        {
          prompt: 'A method returns every subset of an n-element set. What must you mention?',
          options: [
            'Only the recursion depth',
            'The output itself is O(2ⁿ) lists, on top of the O(n) path',
            'Output never counts',
            'The space is O(n) because the input has n elements',
          ],
          answer: 1,
          explanation: 'There are **2ⁿ** subsets, and storing them is the dominant memory. The path you build along the way is only **O(n)**. Say both.',
        },
        {
          prompt: 'A 2D DP uses only the previous row. How do you cut the memory?',
          options: [
            'You cannot. Tables are always O(nm).',
            'Keep one or two arrays of the row length, O(m) instead of O(nm)',
            'Recurse so the table disappears and the stack is free',
            'Store the table in a HashSet',
          ],
          answer: 1,
          explanation: 'Dead rows do not need to stay allocated. Two rolling arrays of length **m** are enough when the transition reads only the previous row.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Merge intervals, counted carefully',
    },
    {
      type: 'list',
      items: [
        'Sorting the **n** intervals is **O(n log n)** time. **TimSort** uses **O(log n)** extra stack in the usual case.',
        'The list you return holds up to **n** merged intervals. That is **O(n)** output.',
        'Besides the sort’s stack and that answer list, the scan only keeps the interval you are currently extending. Say **O(n)** output, and **O(log n)** auxiliary for the sort, instead of a flat “**O(1)**.”',
      ],
    },
  ],
  complexity: {
    space: 'Report auxiliary space separately from the output when the output can be large.',
    notes: 'A boxed Integer inside a HashMap is far larger than one slot of an int[] frequency table. Prefer the array when the values sit in a small range.',
  },
  patternRecognition: [
    'A memo or DP table is one cell per state. The space is the number of states.',
    'A BFS queue can hold a whole level, O(n) on a wide tree.',
    'Backtracking keeps a path of length O(n), and the stored answers can be exponential.',
    'If only the previous row is read, roll the table down to O(m) or O(1).',
  ],
  commonMistakes: [
    'Claiming O(1) while a HashMap holds n entries.',
    'Ignoring the recursion stack on a chain of length n.',
    'Forgetting that “return all subsets” stores O(2ⁿ) output.',
    'Charging the input array as auxiliary when you only read it.',
  ],
  tradeoffs: {
    advantages: ['A map often buys linear time with linear space', 'A rolling row cuts a DP table by a whole dimension'],
    disadvantages: ['In-place code is easier to get wrong, because the input is also the scratch space'],
    alternatives: ['A sorted array when a map’s overhead is too high', 'An explicit heap stack instead of deep recursion'],
    whenToUse: ['Next to the time, on every solution you present'],
    whenNotToUse: ['Do not skip it on an in-place solution either. Say O(1) auxiliary out loud.'],
  },
  failureModes: [
    'Memory limit exceeded from storing every subset.',
    'StackOverflowError from O(n) recursion, especially if each frame also holds an array.',
  ],
  interview: {
    expectations: ['Separate auxiliary space from the output', 'Include the recursion stack'],
    commonQuestions: ['What is the space of your Two Sum?', 'Can you shrink the DP table?'],
    followUps: ['Can this be in place?', 'Why does the rolling array work?'],
    misconceptions: ['Only heap objects count. Stack frames count too.'],
    traps: ['The subsets problem, where the output is the expensive part'],
    strongSignals: ['Says O(n) for the map and O(k) for the answer, separately'],
  },
  keyTakeaways: [
    'Auxiliary space is what you allocate beyond the input. Say it separately from the output.',
    'A map or set of n entries is O(n).',
    'Recursion adds O(depth) stack frames.',
    'Two pointers that only swap the input are O(1) auxiliary.',
    'A DP row you will never reread does not need to stay allocated.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Space of the HashMap Two Sum?',
      answerHint: 'O(n) auxiliary. The map stores up to n entries. The two indexes themselves are O(1).',
    },
    {
      level: 'intermediate',
      question: 'Space of a DFS on a binary tree?',
      answerHint: 'O(h) recursion stack. Balanced height is O(log n). A skewed tree is O(n).',
    },
    {
      level: 'advanced',
      question: 'How do you take an O(nm) DP table down to O(m)?',
      answerHint: 'If row i depends only on row i - 1, keep the previous row and the current row. Two arrays of length m replace the full table.',
    },
  ],
  flashcards: [
    { front: 'Recursion space', back: 'O(depth) stack frames. They are not free.' },
    { front: 'In-place auxiliary space', back: 'O(1) when the only extras are a few indexes and a temporary swap.' },
  ],
  quickRevision: [
    'Auxiliary versus output',
    'Map or set of n is O(n)',
    'Stack depth is recursion space',
    'In-place swaps are O(1) auxiliary',
    'All subsets: output is O(2ⁿ)',
    'Rolling row drops a DP dimension',
  ],
}
