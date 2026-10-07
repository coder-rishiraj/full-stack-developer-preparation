import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Plain Java classes (often static nested) to group fields for graph edges, intervals, pairs, and trie nodes—plus correct equals/hashCode when used as HashMap/HashSet keys.',
  whyExists:
    'int[] pairs work but lack naming and methods. Custom types clarify intent in PQ/TreeSet/HashMap and enable type-safe APIs. Records (Java 16+) reduce boilerplate for immutable data carriers.',
  mentalModel:
    'Data holder + optional compareTo/Comparator. If it goes in HashMap/HashSet, hashCode/equals must match value semantics. If in TreeSet, implement Comparable or supply Comparator.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — When a bare int[] is not enough. Pairing {node, dist} as int[] works, but named fields (node, dist) are easier to read in a PriorityQueue and less error-prone than magic indices. Custom classes (or records) group related fields under one type.',
    },
    {
      type: 'paragraph',
      text: 'Step 2 — Keys need equals and hashCode. If the object goes into a HashMap or HashSet, two equal values must look equal to the map. Prefer record Pos(int r, int c) so equals/hashCode are generated correctly. Never mutate key fields while the object sits in a map.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'static class Node { int val; List<Node> neighbors; } for graphs/trees.',
        'record Edge(int u, int v, int w) {} for immutable triples—auto equals/hashCode.',
        'class Interval { int start, end; } with sort via Comparator.comparingInt(i -> i.start).',
        'Override equals/hashCode together—or use record.',
        'Comparable on the class vs external Comparator for different orders.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Record as HashMap key',
      code: `record Pos(int r, int c) {}

Map<Pos, Integer> dist = new HashMap<>();
dist.put(new Pos(0, 0), 0);
// record: canonical equals/hashCode on components`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'PQ with custom state object',
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
      type: 'callout',
      variant: 'warning',
      title: 'Mutable keys',
      text: 'Never mutate fields used in equals/hashCode while object is in HashMap. Orphaned entries and wrong lookups result.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Dijkstra with int[] {node, dist} works; State record/class reads cleaner in PQ. Trie: class TrieNode { TrieNode[] child = new TrieNode[26]; boolean end; }',
    },
  ],
  complexity: {
    notes: 'equals/hashCode O(k) for k fields; keep keys small. Object overhead vs int[]—prefer primitives in hot paths.',
  },
  patternRecognition: [
    'Graph edge with weight → Edge record or int[3].',
    'Grid BFS key → Pos record in HashSet visited.',
    'Interval problems → class with start/end + Comparator.',
    'Trie / tree node → nested static class with children array/list.',
  ],
  commonMistakes: [
    'Default Object equals (reference) used in HashSet of custom class.',
    'hashCode not consistent with equals fields.',
    'Non-static inner class holding implicit outer reference—memory leak in long-lived structures.',
    'Using float/double in equals without tolerance (rare in CP).',
  ],
  tradeoffs: {
    advantages: ['Readable', 'Records cut boilerplate', 'Type safety in collections'],
    disadvantages: ['Allocation overhead vs raw arrays', 'Must maintain equals contract'],
    alternatives: ['int[] with convention u,v,w', 'List of lists for graphs'],
    whenToUse: ['HashMap/HashSet keys', 'Named fields in PQ', 'Trie/tree nodes'],
    whenNotToUse: ['Tight inner loop micro-optimization—arrays ok'],
  },
  failureModes: [
    'HashMap miss from bad hashCode on custom class.',
    'TreeSet duplicate collapse from compare 0 without equals match.',
  ],
  interview: {
    expectations: ['Know when to override equals/hashCode', 'Use record for immutable pair/key'],
    commonQuestions: ['Design graph node', 'Interval class for merge'],
    followUps: ['Why static nested class?', 'record vs class?'],
    misconceptions: ['Compiler generates equals for plain classes'],
    traps: ['Mutable key in map'],
    strongSignals: ['Uses record Pos(int r,int c) for grid visited'],
  },
  keyTakeaways: [
    'record for immutable map keys and tuples.',
    'equals/hashCode together for HashMap keys.',
    'static nested classes for nodes—no outer ref.',
    'Comparable or Comparator for ordered collections.',
    'int[] ok; classes improve clarity.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When must you override hashCode with equals?',
      answerHint: 'Always together for HashMap/HashSet; equal objects must have same hashCode.',
    },
    {
      level: 'intermediate',
      question: 'Why record for Pos in grid BFS?',
      answerHint: 'Immutable key; auto equals/hashCode on r,c; correct HashSet membership.',
    },
    {
      level: 'advanced',
      question: 'Non-static inner class risk in graph Node?',
      answerHint: 'Holds reference to outer instance; extra memory; prefer static nested Node.',
    },
  ],
  flashcards: [
    {
      front: 'HashMap key class contract',
      back: 'Override equals AND hashCode; do not mutate key fields in map.',
    },
    {
      front: 'Java record benefit',
      back: 'Immutable data carrier; canonical equals/hashCode/toString.',
    },
  ],
  quickRevision: [
    'record for pairs/keys',
    'equals + hashCode together',
    'static nested node classes',
    'No mutable map keys',
    'Comparator for sort order',
    'TrieNode child array',
  ],
}
