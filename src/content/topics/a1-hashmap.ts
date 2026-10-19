import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**HashMap<K,V>** stores **key → value** pairs. **get**, **put**, and **remove** are about **O(1)** on average, because the key is hashed into a bucket. In problems it is the tool for frequency counts, “have I seen this complement?”, first index, and grouping.',
  whyExists:
    'An array is perfect when the key is **0 … n−1**. Many problems use an arbitrary integer, a string, or a pair as the label. **HashMap** is the constant-time lookup for those labels.',
  mentalModel:
    '**hash(key)** picks a drawer. **equals** decides which item in that drawer is the one you asked for. Two different keys can land in the same drawer. That is a **collision**. You still just call **get** and **put**; Java walks the drawer for you.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'The problem an array cannot solve.',
        'Hash, bucket, **equals**.',
        'The methods you will actually type.',
        'Two Sum, walked one index at a time.',
        'Counting with **merge**.',
        'Keys you must not change, and the **null** trap.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — The problem an array cannot solve',
    },
    {
      type: 'list',
      items: [
        '**int[] freq = new int[n]** works when every key is a small index.',
        'If the key is **10^9**, a string, or a pair **(r, c)**, you cannot use it as an array index.',
        '**HashMap** answers “what value did I store under this label?” without scanning a list.',
        'Average **get** / **put** / **remove** are **O(1)**. A full scan of the pairs would be O(n) every time.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Hash, then bucket, then equals',
    },
    {
      type: 'list',
      items: [
        '**hashCode()** turns the key into a number. Java spreads that number onto a bucket index.',
        'The bucket may hold one entry, or several, if different keys hashed to the same slot. Those extras sit in a chain. A very long chain becomes a tree.',
        '**equals** decides which entry in the bucket is your key. Same hash is not enough; the keys must be equal.',
        'The contract: if **a.equals(b)**, then **a.hashCode() == b.hashCode()**. Break that and **get** looks in the wrong bucket and misses the entry.',
        'You almost never write the hash table in an interview. You do have to pick keys that obey the contract.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — The methods you will actually type',
    },
    {
      type: 'list',
      items: [
        '**put(k, v)** inserts the pair, or replaces the value if **k** is already there.',
        '**get(k)** returns the value, or **null** if the key is missing.',
        '**getOrDefault(k, d)** returns **d** instead of **null**. That is the safe read when you are counting.',
        '**containsKey(k)** is the question “is the key present?” Use it when a stored value might itself be **null**, because **get** cannot tell “missing” from “stored null.”',
        '**merge(k, v, howToCombine)** updates in one step. For counts, **freq.merge(x, 1, Integer::sum)** means “add 1, or start at 1.”',
        '**putIfAbsent(k, v)** keeps the first value and ignores later ones.',
        '**computeIfAbsent(k, function)** creates the value only if the key is new. The usual line is a graph node: **adj.computeIfAbsent(u, x -> new ArrayList<>()).add(v)**.',
      ],
    },
    {
      type: 'table',
      headers: ['Method', 'When you type it'],
      rows: [
        ['**merge(k, 1, Integer::sum)**', 'Frequency, or any tally'],
        ['**computeIfAbsent**', 'Create a list the first time you see a key'],
        ['**putIfAbsent**', 'First occurrence should win'],
        ['**containsKey** before **get**', 'You must not treat a missing key as a value'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — Two Sum, one pass',
    },
    {
      type: 'list',
      items: [
        'You want two indexes **i** and **j** with **nums[i] + nums[j] = target**.',
        'At index **i**, the partner you still need is **target - nums[i]**.',
        'The map stores **value → index** for numbers already seen.',
        'If **containsKey(need)** is true, you have both indexes. Otherwise **put** the current value and move on.',
        'One pass is O(n). Checking every pair is O(n²).',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Frequency count, then the Two Sum scan',
      code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);

Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);
}`,
    },
    {
      type: 'heading',
      text: 'Step 5 — Counting, and the prefix-sum pattern',
    },
    {
      type: 'list',
      items: [
        '**merge** is the counting idiom. Do not write **get**, then **null**-check, then **put**, unless you need the old value for something else.',
        'Subarray sum equals **k**: keep a running prefix **s**. The map counts how many times each prefix has appeared.',
        'At the current prefix **s**, every earlier prefix **s - k** closes a subarray that sums to **k**. Add **map.getOrDefault(s - k, 0)** to the answer.',
        'Then **map.merge(s, 1, Integer::sum)** records this prefix for later indexes.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 6 — Keys you must not change, and null',
    },
    {
      type: 'list',
      items: [
        'After **put**, the key’s **hashCode** and **equals** must stay the same. If you change a field that those methods use, the entry is stuck in the old bucket and **get** cannot find it.',
        'Prefer keys that cannot change: **Integer**, **String**, or a **record**.',
        '**HashMap** allows one **null** key, and it allows **null** values. **get** returning **null** might mean “missing” or “the value is null.” **containsKey** separates those.',
        '**int x = map.get(k)** throws **NullPointerException** when the key is missing, because unboxing **null** fails. Use **getOrDefault** or check **containsKey** first.',
        'Iteration order is not insertion order and not sorted order. If you need insertion order, that is **LinkedHashMap**. If you need sorted keys, that is **TreeMap**.',
        'If every key is a dense integer in **0 … n**, an **int[]** is faster and uses less memory than boxing into a map.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Do not edit the key',
      text: 'A custom class used as a key must keep the same **hashCode** and **equals** for as long as it sits in the map. Change those fields and the lookup misses, even though the object is still inside.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — HashMap',
      questions: [
        {
          prompt: 'What do **get** and **put** cost on average, with a normal key?',
          options: ['O(n) always', 'O(log n)', 'About O(1)', 'O(n log n)'],
          answer: 2,
          explanation: 'Hashing jumps to a bucket. A bad hash that dumps every key in one bucket degrades toward O(n). That is rare with **Integer** and **String**.',
        },
        {
          prompt: '**get(k)** returns **null**. What can that mean?',
          options: [
            'Only that the key is missing',
            'The key is missing, or the stored value is null — containsKey tells them apart',
            'The map is full',
            'The key’s hashCode changed and Java threw',
          ],
          answer: 1,
          explanation: '**HashMap** allows **null** values. **containsKey** is the membership test. **getOrDefault** avoids the null when you just want a count of 0.',
        },
        {
          prompt: 'Which line counts how many times **x** appears?',
          options: [
            'freq.add(x)',
            'freq.merge(x, 1, Integer::sum)',
            'freq.get(x)++',
            'freq.putIfAbsent(x, 0)',
          ],
          answer: 1,
          explanation: '**merge** inserts 1 the first time and adds 1 after that. **get(x)++** does not compile usefully when **get** can be null, and it does not write the new count back by itself.',
        },
        {
          prompt: 'You **put** a custom object, then change a field that **hashCode** uses. What happens on the next **get**?',
          options: [
            'The map updates the bucket for you',
            'get can miss the entry, because it looks in the new bucket',
            'Java throws ConcurrentModificationException',
            'The value becomes null',
          ],
          answer: 1,
          explanation: 'The entry stays in the bucket chosen by the old hash. **equals** is only checked inside the bucket **get** actually visits.',
        },
        {
          prompt: 'Keys are integers from 0 to n−1, and you only store counts. What is usually better than a HashMap?',
          options: ['TreeMap', 'int[] of length n', 'PriorityQueue', 'ArrayDeque'],
          answer: 1,
          explanation: 'A dense range is an array index. **int[]** skips hashing and boxing. Use the map when the keys are sparse or not small integers.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  K[key] --> H[hashCode spread]
  H --> B[bucket]
  B --> E{equals match?}
  E -->|yes| V[value]
  E -->|no| Next[next in chain]`,
    caption: 'How a lookup finds the value',
    explanation:
      '**hashCode** chooses the bucket. Inside that bucket, **equals** finds the matching key and returns its value. If nothing matches, the key is absent. A collision only means more than one key shares the bucket; it does not mean the lookup scans the whole map.',
  },
  example: [
    {
      type: 'heading',
      text: 'Subarray sum equals k',
    },
    {
      type: 'list',
      items: [
        'Let **s** be the sum from the start of the array up to the current index.',
        'Any earlier prefix **s − k** means the piece between those two prefixes sums to **k**.',
        'The map stores how many times each prefix sum has already appeared.',
        'Add **getOrDefault(s - k, 0)** to the answer, then **merge** the current **s** with 1.',
      ],
    },
  ],
  complexity: {
    average: 'O(1) get, put, and remove',
    worst: 'O(n) if every key lands in one bucket',
    space: 'O(n) entries',
    notes: 'Walking the map is O(capacity + size). A huge, nearly empty map is slower to iterate than its size suggests.',
  },
  patternRecognition: [
    'You need O(1) lookup by a value, an index, or a state.',
    'Count frequency, remember the first or last index, or group anagrams.',
    'Prefix sum plus a target difference → a map of prefix counts.',
    'Complement: store what you have seen while you scan.',
  ],
  commonMistakes: [
    'Changing a key after insert when hashCode or equals depends on those fields.',
    'Treating get() == null as “missing” when null is also a legal value.',
    'Unboxing a null get into an int, which throws NullPointerException.',
    'Hand-rolling a null check instead of merge or getOrDefault for a count.',
  ],
  tradeoffs: {
    advantages: ['Expected O(1) operations', 'A rich Map API', 'Any key type with a correct hashCode and equals'],
    disadvantages: ['No order', 'Not safe for concurrent writes', 'A bad hash can degrade to O(n)'],
    alternatives: ['int[] when keys sit in a small range', 'TreeMap when the keys must stay sorted', 'HashSet when there is no value'],
    whenToUse: ['Frequency', 'Complement lookup', 'A memoization cache'],
    whenNotToUse: ['You need sorted traversal', 'The key would change while it is in the map'],
  },
  failureModes: [
    'A custom key with a wrong hashCode makes equal keys miss each other.',
    'Too many distinct states blow the memory limit.',
  ],
  interview: {
    expectations: [
      'Say why the map is O(n) and the pair scan is O(n²)',
      'Use merge or getOrDefault for counts',
      'Mention that custom keys must stay unchanged',
    ],
    commonQuestions: ['Two Sum', 'Group Anagrams', 'Subarray Sum Equals K'],
    followUps: ['What if duplicates are allowed?', 'Why not a TreeMap?'],
    misconceptions: ['HashMap walks in insertion order — that is LinkedHashMap'],
    traps: ['One null key is allowed; null values are allowed; get cannot tell them from “missing” by itself'],
    strongSignals: ['Writes the prefix-sum map without mixing the update and the query'],
  },
  keyTakeaways: [
    'Average O(1) get and put when hashCode and equals agree.',
    'merge and getOrDefault are the counting idioms.',
    'Do not change a key after it is inserted.',
    'Two Sum and prefix sums are the classic map patterns.',
    'Use int[] when the keys are a small dense range.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'HashMap get vs getOrDefault?',
      answerHint: 'get returns null when the key is missing. getOrDefault returns the fallback you pass, which is what counting wants instead of a null.',
    },
    {
      level: 'intermediate',
      question: 'Why must equal keys have equal hashCodes?',
      answerHint: 'get uses the hash to choose a bucket, then equals inside that bucket. If equal keys hash differently, the lookup never inspects the bucket that holds the entry.',
    },
    {
      level: 'advanced',
      question: 'When is TreeMap the better map?',
      answerHint: 'When you need sorted keys, or floor and ceiling: the largest key ≤ x, or the smallest key ≥ x, in O(log n).',
    },
  ],
  flashcards: [
    { front: 'Count with one call', back: 'freq.merge(x, 1, Integer::sum);' },
    { front: 'HashMap get and put', back: 'O(1) expected. O(n) if every key collides in one bucket.' },
  ],
  quickRevision: [
    'Key → hash → bucket → equals',
    'merge / getOrDefault for counts',
    'Keys stay immutable',
    'Two Sum and prefix sums',
    'Not ordered, not thread-safe',
    'int[] when keys are 0 … n',
  ],
}
