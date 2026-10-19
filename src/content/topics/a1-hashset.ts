import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**HashSet<E>** stores unique elements and answers **add**, **remove**, and **contains** in about **O(1)**. It is the “have I seen this?” tool: duplicates, visited nodes, and a cycle in a graph.',
  whyExists:
    'Some problems never need a value, only membership. A **HashMap<E, Boolean>** works, but a **HashSet** says the intent in the type: this collection is a set of things, not a table of answers.',
  mentalModel:
    'A **HashSet** is a **HashMap** whose values are ignored. Only the key matters. Each element appears once. One **null** is allowed. The iteration order is not a promise.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '**Set** versus **List** versus a count.',
        'What **add** returns, and why that return value is the algorithm.',
        'The patterns: duplicates, visited, algebra.',
        'Order, mutability, and arrays as elements.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Set versus List',
    },
    {
      type: 'list',
      items: [
        'A **List** allows duplicates and cares about index. **get(i)** is the point.',
        'A **Set** answers one question: “is this element in here?” Each value appears at most once.',
        '**HashSet** is the fast, unordered set. **contains** does not scan from the start the way **ArrayList.contains** does.',
        'If you also need a count, or a value attached to the element, that is a **HashMap**, not a set.',
        'If you need the elements in sorted order, or the next larger element, that is a **TreeSet**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — add tells you whether it was new',
    },
    {
      type: 'list',
      items: [
        '**add(e)** returns **true** when **e** was not in the set and is now inserted.',
        '**add(e)** returns **false** when **e** was already there. The set does not change. That **false** is how you detect a duplicate in one line.',
        '**contains(e)** is the same membership test without inserting. Average **O(1)**.',
        '**remove(e)** deletes it, also about **O(1)**.',
        'Under the hood this is the **HashMap** path: **hashCode** picks a bucket, **equals** decides a match. The same key contract applies.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A duplicate in an array, and a cycle in a linked list',
      code: `Set<Integer> seen = new HashSet<>();
for (int x : nums) {
    if (!seen.add(x)) { /* duplicate */ }
}

Set<ListNode> visited = new HashSet<>();
while (head != null) {
    if (!visited.add(head)) return true; // cycle
    head = head.next;
}`,
    },
    {
      type: 'heading',
      text: 'Step 3 — The patterns',
    },
    {
      type: 'list',
      items: [
        '**Duplicate detection:** **!seen.add(x)** means you have met **x** before.',
        '**Visited in DFS or BFS:** **add** the node before you walk its neighbors. A failed **add** means you already entered it.',
        'For a linked-list cycle, the element is the **node object**, not the number in the node. Two different nodes can hold the same value.',
        '**addAll** pours another collection in. **retainAll** keeps the intersection. **removeAll** subtracts a set.',
        'When the output must be in a particular order, copy the set into a list and sort it. The set itself will not do that.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'What you call'],
      rows: [
        ['Duplicate detection', '**add** returns **false** on a repeat'],
        ['DFS visited', '**add(node)** before you recurse'],
        ['Union of two arrays', '**addAll** both into one set'],
        ['Intersection', '**retainAll**'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — Longest consecutive sequence',
    },
    {
      type: 'list',
      items: [
        'Put every number in the set. **contains** is now O(1).',
        'A streak should start only at a number **x** whose predecessor **x − 1** is absent. Otherwise you would recount the same run from the middle.',
        'From that start, walk **x, x+1, x+2…** while **contains** stays true, and keep the best length.',
        'Each number is the start of at most one walk, and each number is visited a constant number of times inside walks. The whole algorithm is O(n), not O(n²).',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Order, and elements you must not change',
    },
    {
      type: 'list',
      items: [
        'Do not assume the loop order is insertion order or sorted order. **LinkedHashSet** remembers insertion. **TreeSet** stays sorted.',
        'The same mutability rule as **HashMap**: if **equals** or **hashCode** depends on a field, do not change that field while the object is in the set.',
        '**int[]** uses identity, not contents. Two arrays with the same numbers are different elements. Wrap them, or use a key whose **equals** and **hashCode** look at the contents.',
        'A small dense range, such as “have I seen this letter a–z?”, is often a **boolean[]** rather than a set.',
        '“At most K distinct in a window” usually wants counts, so a **HashMap**, not a set. A set cannot tell you that a value appears twice.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — HashSet',
      questions: [
        {
          prompt: '**seen.add(x)** returns **false**. What does that mean?',
          options: [
            'The set is full',
            'x was already in the set, so nothing was inserted',
            'x was inserted at the front',
            'x failed equals',
          ],
          answer: 1,
          explanation: '**add** returns whether the element is new. **false** means it was already a member. That is the duplicate check.',
        },
        {
          prompt: 'You only need “have I seen this node?” Which type matches the job?',
          options: ['HashMap<Node, Integer>', 'HashSet<Node>', 'ArrayList<Node>', 'TreeMap<Node, Node>'],
          answer: 1,
          explanation: 'There is no value to store. **HashSet** is the membership tool. A map is for a count or a payload. A list’s **contains** is O(n).',
        },
        {
          prompt: 'A for-each over a HashSet prints 3, then 1, then 2. You inserted 1, then 2, then 3. Is that a bug?',
          options: [
            'Yes. HashSet must keep insertion order',
            'No. HashSet does not promise an order',
            'Yes. It must be sorted',
            'Yes. add failed for 1',
          ],
          answer: 1,
          explanation: 'Order is undefined. Use **LinkedHashSet** for insertion order, or **TreeSet** for sorted order.',
        },
        {
          prompt: 'A nested loop calls **list.contains** on a large ArrayList and times out. What is the usual fix?',
          options: [
            'Switch the list to LinkedList',
            'Put the values in a HashSet and call contains on the set',
            'Sort the list inside the inner loop',
            'Use PriorityQueue.contains',
          ],
          answer: 1,
          explanation: '**ArrayList.contains** is O(n) per call. **HashSet.contains** is about O(1). Build the set once, then test membership against it.',
        },
        {
          prompt: 'Two **int[]** with the same numbers are both added to a HashSet. How many elements do you get?',
          options: [
            'One, because the contents match',
            'Two, because arrays use reference equality unless you wrap them',
            'Zero, because arrays are not allowed',
            'One, but only if the lengths match',
          ],
          answer: 1,
          explanation: 'The default **equals** and **hashCode** for an array are identity, not deep contents. Equal contents still look like different keys.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Visited is the node, not the value',
    },
    {
      type: 'list',
      items: [
        'In a linked-list cycle, values can repeat without a cycle. The set must hold the **node**.',
        '**visited.add(head)** fails exactly when this node object was seen on an earlier step. Then you have looped.',
      ],
    },
  ],
  complexity: {
    average: 'O(1) add, contains, and remove',
    worst: 'O(n) if every element collides in one bucket',
    space: 'O(n) unique elements',
  },
  patternRecognition: [
    'Detect a duplicate in an array or a stream.',
    'Track visited states in BFS or DFS: a node, a cell, a coordinate.',
    'Need the unique elements before you sort or count something else.',
    'A window that limits distinct values usually wants a map of counts, not a set.',
  ],
  commonMistakes: [
    'Expecting a particular iteration order. Use LinkedHashSet if you need insertion order.',
    'Calling List.contains inside a loop instead of a HashSet.',
    'Mutating an object after it was added, when equals or hashCode uses those fields.',
    'Ignoring the return value of add. false means “already present.”',
  ],
  tradeoffs: {
    advantages: ['O(1) membership', 'The type says “no value,” which a dummy-value map does not'],
    disadvantages: ['No order', 'No frequency — a map is required for counts'],
    alternatives: ['HashMap<E, Integer> for counts', 'TreeSet for a sorted unique set', 'boolean[] when the range is small'],
    whenToUse: ['Visited or seen', 'A unique collection', 'A duplicate check'],
    whenNotToUse: ['You need counts or associated data', 'You need the current minimum'],
  },
  failureModes: [
    'Time limit from List.contains in a nested loop.',
    'A custom element with a wrong equals or hashCode, or an int[] used as if contents mattered.',
  ],
  interview: {
    expectations: ['Contrast an O(n) set scan with an O(n²) nested loop', 'Explain what add returns'],
    commonQuestions: ['Contains Duplicate', 'Longest Consecutive Sequence', 'Cycle in a linked list or a graph'],
    followUps: ['LinkedHashSet versus HashSet?', 'When is TreeSet the one?'],
    misconceptions: ['A Set can hold duplicates'],
    traps: ['Arrays as elements use reference equality'],
    strongSignals: ['Reaches for a set only when the problem is membership, not counting'],
  },
  keyTakeaways: [
    'Average O(1) add, contains, and remove.',
    'add returns false when the element was already present.',
    'A visited set holds nodes or states for DFS and BFS.',
    'No ordering. TreeSet is the sorted set. LinkedHashSet keeps insertion order.',
    'Frequencies belong in a HashMap.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'HashSet or HashMap for “already seen”?',
      answerHint: 'HashSet when there is no value. The hash performance is the same. The set API says membership.',
    },
    {
      level: 'intermediate',
      question: 'How does Longest Consecutive Sequence stay O(n)?',
      answerHint: 'Every number goes in a set. A streak starts only when x − 1 is absent, so each element is walked a constant number of times.',
    },
    {
      level: 'advanced',
      question: 'Can an int[] be a HashSet element if you care about its contents?',
      answerHint: 'Not by default. Arrays compare by reference. Use a wrapper whose equals and hashCode read the contents, or a different key.',
    },
  ],
  flashcards: [
    { front: 'What add returns', back: 'true if the element is new. false if it was already in the set.' },
    { front: 'HashSet instead of HashMap', back: 'When you only need membership or dedup, and no count or payload.' },
  ],
  quickRevision: [
    'Unique elements only',
    'O(1) average contains',
    'Visited in graph search',
    'add false means duplicate',
    'No order and no counts',
    'LinkedHashSet for insertion order',
  ],
}
