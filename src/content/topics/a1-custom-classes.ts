import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A small class, usually a **static** nested one, or a **record**, groups fields that belong together: a grid cell, an edge, an interval, a trie node. If that object is a **HashMap** or **HashSet** key, it needs **equals** and **hashCode**. If it is ordered, it needs **Comparable** or a **Comparator**.',
  whyExists:
    '**int[] {node, dist}** works until you read **a[0]** and cannot remember which slot is the node. A name is the documentation. A **record** also writes **equals** and **hashCode** for you, which a plain class does not.',
  mentalModel:
    'The object is a labeled bundle of fields. A **record** is a bundle that cannot change and already knows how to be a map key. A mutable class is a bundle you must not edit after it has been inserted into a hash structure.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'When an **int[]** becomes hard to read.',
        '**record** versus a class.',
        '**equals** and **hashCode** as a pair.',
        '**static** nested nodes, and a trie.',
        'Order, when the object also goes in a heap or a tree.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Name the fields',
    },
    {
      type: 'list',
      items: [
        '**new int[] {u, dist}** is fine in a tight Dijkstra loop. **state[0]** and **state[1]** are easy to swap.',
        '**class State { int node, dist; }** makes the heap line say **cur.node** and **cur.dist**.',
        'An interval is **start** and **end**, not **a[0]** and **a[1]**, once the solution is long enough to misread.',
        'You do not need a class for every pair. Use one when the indexes have already caused a bug, or when the object is a key.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — A record is an immutable bundle',
    },
    {
      type: 'list',
      items: [
        '**record Pos(int r, int c) {}** declares two fields, a constructor, **equals**, **hashCode**, and **toString**.',
        'The fields cannot be reassigned. That is what you want for a map key.',
        '**new Pos(0, 0)** and another **new Pos(0, 0)** are equal. A **HashSet** keeps one of them. Two **int[]** with the same numbers would not, because arrays use identity.',
        'A **record Edge(int u, int v, int w)** is the same idea for a weighted edge.',
        'Records need Java 16 or newer. Judges that allow a recent JDK accept them. If the environment is older, write the class and the two methods yourself.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A grid cell that is a real key',
      code: `record Pos(int r, int c) {}

Map<Pos, Integer> dist = new HashMap<>();
dist.put(new Pos(0, 0), 0);
// record: canonical equals/hashCode on components`,
    },
    {
      type: 'heading',
      text: 'Step 3 — equals and hashCode travel together',
    },
    {
      type: 'list',
      items: [
        'A plain class inherits **Object.equals**, which is **==**. Two **Pos** objects with the same **r** and **c** look different to a **HashMap**, so the lookup misses.',
        'If you write **equals**, you must write **hashCode** on the same fields. Equal objects are required to have the same hash, or **get** searches the wrong bucket.',
        'Use every field that **equals** uses, and no field that **equals** ignores.',
        'Do not change those fields after **put** or **add**. The bucket was chosen with the old hash. The entry is still in the map and **get** cannot find it.',
        '**TreeSet** is different: it uses **compare**, not **equals**. A comparator that returns 0 for two unequal objects drops one. Keep the two contracts aligned when the same type is used both ways.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not edit a key',
      text: 'After the object is in a **HashMap** or **HashSet**, the fields that **equals** and **hashCode** read are frozen in practice. Change them and the entry is stranded in the old bucket.',
    },
    {
      type: 'heading',
      text: 'Step 4 — Nested nodes should be static',
    },
    {
      type: 'list',
      items: [
        '**static class Node { int val; Node left, right; }** does not point at an outer instance.',
        'A non-static inner class secretly holds the outer object. Every node keeps that extra reference. In a big graph that is memory you did not mean to spend, and it can pin the outer object so it cannot be collected.',
        'A trie node is the same shape: **TrieNode[] child = new TrieNode[26]** and a **boolean end**. The array is the 26 letters. **end** marks a word.',
        'Graph adjacency can stay **List<List<Integer>>**. A **Node** with a neighbor list is the version you want when the problem’s API gives you nodes, as in clone-graph.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Order is a separate decision',
    },
    {
      type: 'list',
      items: [
        'Being a valid hash key does not sort the object. A heap or a **TreeSet** still needs **Comparable** or a **Comparator**.',
        '**compareTo** on **State** by **dist** lets **new PriorityQueue<State>()** be a min-heap of distances. Use **Integer.compare**, not subtraction.',
        'If the same class is sometimes ordered by start and sometimes by end, leave **compareTo** alone and pass a **Comparator** at the call site.',
        'Hot inner loops can stay on **int[]** to avoid the object header. Clarity first. Switch to arrays only when allocation itself is the problem.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A heap state whose order is the distance',
      code: `static class State implements Comparable<State> {
    int node, dist;
    State(int node, int dist) { this.node = node; this.dist = dist; }
    public int compareTo(State o) {
        return Integer.compare(this.dist, o.dist);
    }
}
PriorityQueue<State> pq = new PriorityQueue<>();`,
    },
    {
      type: 'quiz',
      title: 'Check your understanding — custom types',
      questions: [
        {
          prompt: 'A plain class has no equals or hashCode. Two instances with the same fields go into a HashSet. How many are stored?',
          options: [
            'One, because the fields match',
            'Two, because Object.equals is reference identity',
            'Zero. A class cannot be a set element.',
            'One, but only the first field is compared',
          ],
          answer: 1,
          explanation: 'The inherited **equals** is **==**. Same fields are not enough. A **record**, or your own **equals** and **hashCode**, compares the values.',
        },
        {
          prompt: 'You override equals and forget hashCode. What breaks?',
          options: [
            'Nothing, if the fields match',
            'Equal objects can land in different buckets, so the map misses them',
            'The compiler rejects the class',
            'TreeSet starts using equals',
          ],
          answer: 1,
          explanation: '**get** picks a bucket with **hashCode**, then uses **equals** inside it. Different hashes mean the equal key is never inspected.',
        },
        {
          prompt: 'Why prefer **record Pos(int r, int c)** as a visited key?',
          options: [
            'Records are faster than int[] in every loop',
            'It is immutable and equals/hashCode follow r and c',
            'A record is a HashMap by itself',
            'Records allow null keys in a TreeMap',
          ],
          answer: 1,
          explanation: 'Two positions with the same row and column compare equal, and you cannot reassign **r** or **c** and strand the key.',
        },
        {
          prompt: 'Why should a graph **Node** nested inside your solution be **static**?',
          options: [
            'static makes equals automatic',
            'A non-static inner class holds the outer instance, which costs memory',
            'static is required for fields',
            'Only static classes can go in a list',
          ],
          answer: 1,
          explanation: 'Every non-static node points at the outer object. A static nested class does not. That is the one you want for nodes that outlive a single method.',
        },
        {
          prompt: 'The State is in a HashMap, and you then change **dist**, which hashCode uses. What happens?',
          options: [
            'The map moves the entry to the new bucket',
            'Lookups can miss it. The entry stays in the old bucket.',
            'HashMap throws ConcurrentModificationException',
            'dist is restored',
          ],
          answer: 1,
          explanation: 'Nothing rehashes the key for you. Treat key fields as frozen after insertion. A **record** makes that the default.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Dijkstra state, and a trie node',
    },
    {
      type: 'list',
      items: [
        '**int[] {node, dist}** is a valid heap element if the comparator reads index 1. **State** is the same data with names. Pick names when the solution is going to be read by a person.',
        'A trie node is not a key. It is a container: 26 children and a flag. No **equals** is required unless you put the node itself into a set.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'One node per prefix',
      code: `static class TrieNode {
    TrieNode[] child = new TrieNode[26];
    boolean end;
}`,
    },
  ],
  complexity: {
    notes: 'equals and hashCode walk the fields, so a key with k fields costs O(k). Keep keys small. An object header is heavier than a raw int[]. Prefer primitives when the inner loop is allocation-bound.',
  },
  patternRecognition: [
    'A weighted edge → a record or an int[3], and be consistent.',
    'A grid cell in a visited set → a Pos record, not an int[].',
    'Intervals → start and end, plus a Comparator for the sort.',
    'Trie or tree → a static nested class and a children array or list.',
  ],
  commonMistakes: [
    'Relying on Object.equals for a custom key.',
    'hashCode using different fields from equals.',
    'A non-static inner class, so every node retains the outer instance.',
    'Comparing doubles with equals in a key. Contest keys are almost always ints.',
  ],
  tradeoffs: {
    advantages: ['Names instead of indexes', 'A record removes the equals boilerplate', 'The collection is type-safe'],
    disadvantages: ['An object costs more than a few ints', 'You own the equals contract if you do not use a record'],
    alternatives: ['int[] with a written-down convention', 'List of lists for a graph'],
    whenToUse: ['HashMap and HashSet keys', 'A heap state you will reread', 'Trie and tree nodes'],
    whenNotToUse: ['A tiny hot loop where the array is already clear and allocation shows up in the profile'],
  },
  failureModes: [
    'A HashMap miss because hashCode does not match equals.',
    'A TreeSet that drops an object because compare returned 0.',
  ],
  interview: {
    expectations: ['Know when equals and hashCode are required', 'Reach for a record for an immutable pair'],
    commonQuestions: ['Design a graph node', 'An interval type for merging'],
    followUps: ['Why static?', 'record versus class?'],
    misconceptions: ['The compiler writes equals for every class. It writes it for a record.'],
    traps: ['A mutable key'],
    strongSignals: ['Uses record Pos(int r, int c) for a visited set'],
  },
  keyTakeaways: [
    'A record is the immutable pair or key, with equals and hashCode already written.',
    'If you write equals, write hashCode on the same fields.',
    'Nested node classes should be static.',
    'Do not change a key after it is inserted.',
    'Comparable or a Comparator is a separate choice, for heaps and trees.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When do equals and hashCode have to move together?',
      answerHint: 'Whenever the object is a HashMap or HashSet key. Equal objects must share a hashCode, and both methods must use the same fields.',
    },
    {
      level: 'intermediate',
      question: 'Why a record for a grid position?',
      answerHint: 'It is immutable, and equals and hashCode follow r and c, so a HashSet sees two identical cells as one.',
    },
    {
      level: 'advanced',
      question: 'What does a non-static inner Node cost?',
      answerHint: 'Each instance holds a hidden reference to the outer object. That is extra memory and can keep the outer object alive. Use a static nested class.',
    },
  ],
  flashcards: [
    { front: 'Hash key contract', back: 'equals and hashCode on the same fields. Do not mutate those fields after insert.' },
    { front: 'What a record gives you', back: 'An immutable carrier, plus equals, hashCode, and toString from its components.' },
  ],
  quickRevision: [
    'record for a pair or a key',
    'equals and hashCode together',
    'static nested node classes',
    'No mutable map keys',
    'Comparator when the order is not unique',
    'TrieNode: 26 children and an end flag',
  ],
}
