import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**Recursion** solves a problem by calling the same method on a smaller input, and it stops at a **base case**. In interviews that is tree and graph DFS, backtracking, divide-and-conquer, and a recurrence you later memoize.',
  whyExists:
    'A tree is already “a node plus two smaller trees.” Combinations are “use this element, or skip it, then the rest.” The code that says that directly is recursive. A loop can do the same work, but it has to manage the stack by hand.',
  mentalModel:
    'Each call is a frame on a stack: the parameters and the local variables. The frame waits while the smaller calls run, then combines what they return. The deepest chain of frames is the extra memory. A chain near **10⁵** frames can throw **StackOverflowError**.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'A smaller problem, and a base case that does not call again.',
        'The call stack, and how deep it gets.',
        'A tree, which is recursion with two children.',
        'Backtracking: choose, recurse, undo.',
        'Copy the path you save, and memoize repeated work.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Smaller, then stop',
    },
    {
      type: 'list',
      items: [
        'The recursive case calls the same method on a strictly smaller input: **n - 1**, the left child, index **i + 1**.',
        'The **base case** answers without another call. Empty tree, **i == n**, **n == 0**. If this is missing, the calls never end.',
        'Every call must move toward that base. A call that does not shrink the input is an infinite loop written as a method.',
        'The return can be a number (a depth, a count), a boolean (a path exists), or void (the interesting work is the side effect of filling a list).',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — The stack is the memory you did not allocate',
    },
    {
      type: 'list',
      items: [
        'Calling **f(n)** pushes a frame. The frame holds **n** and any locals. It stays alive until **f(n)** returns.',
        '**f(n)** calls **f(n - 1)**, which calls **f(n - 2)**, and so on. You have **n** frames at the deepest point. That is **O(n)** stack space, even if you allocate nothing on the heap.',
        'A balanced tree of **n** nodes has height about **log n**, so the stack is **O(log n)**. A stick-shaped tree has height **n**, so the stack is **O(n)**.',
        'Around **10⁵** frames, a typical JVM stack overflows. Then write the same search with an explicit **ArrayDeque**, or with a loop. Do not hope the judge raised the stack.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — A tree is the shape recursion expects',
    },
    {
      type: 'list',
      items: [
        '**null** is the base. A missing child is not a call.',
        'The size of a tree is 1 plus the size of the left plus the size of the right. That sentence is the method.',
        'The call on the left finishes completely, including its own children, before the call on the right starts, if you wrote it that way. That is DFS.',
        'The same walk finds a path, a depth, or a lowest common ancestor. The combine step is the only part that changes.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Size of a tree, and every subset',
      code: `int dfs(TreeNode root) {
    if (root == null) return 0;
    return 1 + dfs(root.left) + dfs(root.right);
}

void subsets(int[] nums, int i, List<Integer> path, List<List<Integer>> ans) {
    if (i == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }
    path.add(nums[i]);
    subsets(nums, i + 1, path, ans);
    path.remove(path.size() - 1);
    subsets(nums, i + 1, path, ans);
}`,
    },
    {
      type: 'heading',
      text: 'Step 4 — Backtracking undoes the choice',
    },
    {
      type: 'list',
      items: [
        'At index **i** you have two futures: take **nums[i]**, or skip it. Both futures must see a clean **path**.',
        '**path.add**, recurse, then **path.remove** the last element. The remove is the undo. The skip-call then runs as if the add never happened.',
        'Forget the remove and every later subset still contains the element. The bug looks like wrong answers, not a crash.',
        'Permutations are the same rhythm with a used-flag: mark, recurse, unmark.',
        'The recursion tree has one level per index. Without sharing work, subsets are **O(2ⁿ)** calls. That is acceptable near **n ≤ 20**, not near **n = 40**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Save a copy, and cache repeated calls',
    },
    {
      type: 'list',
      items: [
        '**ans.add(path)** stores the same list object you keep editing. Every saved answer changes when **path** changes. **new ArrayList<>(path)** copies the contents at the leaf.',
        'Naive Fibonacci calls **f(n-1)** and **f(n-2)**, and those calls repeat the same **n** an exponential number of times.',
        'A memo map from the arguments to the result computes each distinct state once. The recursion is then top-down dynamic programming. A loop that fills a table from the small cases up is the same recurrence, bottom-up.',
        'Memo helps when the same smaller problem appears more than once. Subsets of distinct indexes usually do not overlap. Fibonacci and grid paths do.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Depth near 10⁵',
      text: 'A linked-list-shaped recursion of length about **10⁵** can throw **StackOverflowError** before it times out. Use an explicit stack or a loop. A balanced tree of the same size is fine, because the depth is logarithmic.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — recursion',
      questions: [
        {
          prompt: 'What two parts does every recursive method need?',
          options: [
            'A loop and a HashMap',
            'A base case, and a call on a smaller input',
            'Two base cases and no recursive call',
            'A StringBuilder and a return',
          ],
          answer: 1,
          explanation: 'The base case returns without calling again. The recursive case must get closer to that base, or the calls do not stop.',
        },
        {
          prompt: 'Why **ans.add(new ArrayList<>(path))** instead of **ans.add(path)**?',
          options: [
            'The copy is faster',
            'path is reused and mutated. A stored reference would change every saved answer.',
            'ArrayList cannot be stored',
            'The judge rejects a shared list',
          ],
          answer: 1,
          explanation: 'One **path** list is edited for every branch. Copying at the leaf freezes that subset. The later undo would otherwise rewrite answers you already stored.',
        },
        {
          prompt: 'A balanced binary tree has n nodes. What recursion stack do you pay for a DFS?',
          options: [
            'O(1)',
            'O(log n), the height',
            'O(n²)',
            'O(2ⁿ)',
          ],
          answer: 1,
          explanation: 'The deepest chain of frames is the height. Balanced height is about **log n**. A skewed tree is height **n**, which is the dangerous one.',
        },
        {
          prompt: 'Naive recursive Fibonacci is slow. What changes the time to O(n)?',
          options: [
            'Adding another recursive call',
            'Memoizing the result for each n',
            'Removing the base case',
            'Using StringBuilder',
          ],
          answer: 1,
          explanation: 'The recurrence is fine. The waste is recomputing the same **n**. A map or an array from **n** to the answer computes each value once. A bottom-up loop does the same.',
        },
        {
          prompt: 'In the subsets code, what does **path.remove** at the end of the take-branch do?',
          options: [
            'Deletes the answer from ans',
            'Undoes the choice so the skip-branch does not still contain nums[i]',
            'Stops the recursion',
            'Sorts the path',
          ],
          answer: 1,
          explanation: 'Choose, recurse, undo. Without the undo, the skip call inherits the element you meant to leave out.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  C[call f n] --> B{n base?}
  B -->|yes| R[return base value]
  B -->|no| S[split into subcalls]
  S --> C1[f smaller 1]
  S --> C2[f smaller 2]
  C1 --> Combine[combine results]
  C2 --> Combine
  Combine --> Ret[return to parent]`,
    caption: 'Each call either stops or waits for smaller calls',
    explanation:
      'If the input is a base, return immediately. Otherwise split into smaller calls. Those calls do the same thing. When they return, this frame combines the results and returns to its parent. The frames that are still waiting are the stack.',
  },
  example: [
    {
      type: 'heading',
      text: 'Fibonacci, counted twice or counted once',
    },
    {
      type: 'list',
      items: [
        '**f(5)** calls **f(4)** and **f(3)**. **f(4)** calls **f(3)** again. The same **f(2)** is computed many times. The call tree is **O(2ⁿ)**.',
        'Store **memo[n]** the first time you finish **f(n)**. Later calls return the stored number. Each **n** is computed once, so the time is **O(n)**, plus **O(n)** stack if you still recurse from **n** down to 0 in one chain.',
        'The loop version fills **dp[1], dp[2], …** and uses **O(1)** extra stack. Same answers, no depth problem.',
      ],
    },
  ],
  complexity: {
    notes: 'Without memo, time is often branching-factor to the power of depth. Space is O(depth) for the stack, plus O(number of states) if you cache.',
  },
  patternRecognition: [
    'A tree or a graph DFS.',
    'All combinations or permutations → backtracking.',
    'The problem talks about the prefix ending at i → recurse on the index.',
    'The same smaller state appears twice → memoize.',
  ],
  commonMistakes: [
    'No base case, so the recursion never returns.',
    'Forgetting path.remove after the recursive call.',
    'ans.add(path) instead of a copy.',
    'A long chain that overflows the stack instead of being written as a loop.',
  ],
  tradeoffs: {
    advantages: ['The code matches the definition', 'Trees and backtracking stay short', 'A memo map turns it into top-down DP'],
    disadvantages: ['Stack overflow on a deep chain', 'Call overhead', 'A deep stack is harder to print and inspect'],
    alternatives: ['An explicit stack for DFS', 'A bottom-up loop', 'BFS when you need an unweighted shortest path'],
    whenToUse: ['Trees', 'Backtracking', 'Divide and conquer', 'Top-down DP'],
    whenNotToUse: ['A straight scan', 'A recursion whose depth is the full n and n is 10⁵'],
  },
  failureModes: [
    'StackOverflowError on a long chain.',
    'Exponential time with no memo and no pruning.',
    'Every saved subset is the same list, mutated after it was stored.',
  ],
  interview: {
    expectations: ['Say the base case and the recurrence', 'Say the stack depth', 'Rewrite it iteratively if asked'],
    commonQuestions: ['Subsets', 'Permutations', 'Maximum depth of a binary tree', 'Climbing Stairs'],
    followUps: ['Does Java optimize tail recursion?', 'Memo versus a table?'],
    misconceptions: ['Recursion is always a worse Big-O. With memo it is often the same as the loop.'],
    traps: ['Not copying the path'],
    strongSignals: ['Draws the two branches and mentions O(h) stack'],
  },
  keyTakeaways: [
    'Base case, and every call gets closer to it.',
    'Backtracking is choose, recurse, undo.',
    'Copy the path when you store it.',
    'Memoize when the same subproblem repeats.',
    'A skewed depth near 10⁵ needs a loop or an explicit stack.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What two parts does a recursive function need?',
      answerHint: 'A base case that returns without another call, and a recursive case that shrinks the input.',
    },
    {
      level: 'intermediate',
      question: 'Why new ArrayList<>(path) when saving a subset?',
      answerHint: 'path is one list you keep editing. Storing that reference makes every saved answer change later. The copy freezes the current contents.',
    },
    {
      level: 'advanced',
      question: 'What stack space does DFS use on a binary tree of height h?',
      answerHint: 'O(h) frames. Balanced h is O(log n). Skewed h is O(n), which can overflow.',
    },
  ],
  flashcards: [
    { front: 'The undo in backtracking', back: 'After the recursive call returns, remove the choice you just added.' },
    { front: 'Stack space', back: 'O(depth) frames, even when you allocate nothing else.' },
  ],
  quickRevision: [
    'Base case stops the calls',
    'Each call makes progress',
    'Choose, recurse, undo',
    'Copy the path at the leaf',
    'Memo when states repeat',
    'Deep chain → explicit stack or loop',
  ],
}
