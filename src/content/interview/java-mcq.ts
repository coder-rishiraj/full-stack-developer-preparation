import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_MCQ: ReactInterviewItem[] = [
  {
    id: 'mcq-string-pool',
    question: 'String a = "x"; String b = "x"; a == b is typically:',
    relatedTopicIds: ['c1-string-pool'],
    answer: [],
    mcq: {
      options: ['false, because new objects are always allocated', 'true, both refer to the pooled literal', 'a compile error', 'true only if intern() is called'],
      correctIndex: 1,
      explanation:
        'Equal string literals are interned. new String("x") would not share that object unless interned.',
    },
  },
  {
    id: 'mcq-parent-ref',
    question: 'A a = new B(); a.m2() when m2 exists only on B:',
    relatedTopicIds: ['c1-polymorphism', 'c1-dynamic-binding'],
    answer: [],
    mcq: {
      options: ['Runs B.m2', 'Compile error — m2 is not on A', 'Runtime error', 'Runs A.m2 after a cast'],
      correctIndex: 1,
      explanation:
        'The compiler only allows methods declared on the reference type. Cast to B to call m2.',
    },
  },
  {
    id: 'mcq-checked-override',
    question: 'Parent throws IOException; child throws Exception. The override:',
    relatedTopicIds: ['c1-checked-unchecked'],
    answer: [],
    mcq: {
      options: ['Compiles', 'Does not compile — checked exception is broader', 'Fails only at runtime', 'Is fine because Exception is unchecked'],
      correctIndex: 1,
      explanation:
        'An override cannot introduce a wider checked exception. Exception is a superclass of IOException.',
    },
  },
  {
    id: 'mcq-runtime-override',
    question: 'Parent throws ArrayIndexOutOfBoundsException; child throws IndexOutOfBoundsException:',
    relatedTopicIds: ['c1-exceptions'],
    answer: [],
    mcq: {
      options: ['Compile error', 'Compiles — both are unchecked', 'Only works if the parent is abstract', 'Requires throws on main'],
      correctIndex: 1,
      explanation: 'Unchecked exceptions are not part of the override checked-exception rule.',
    },
  },
  {
    id: 'mcq-sync-instance',
    question: 'T1 holds synchronized m1(); can T2 call unsynchronized m2() on the same instance?',
    relatedTopicIds: ['c3-synchronized'],
    answer: [],
    mcq: {
      options: ['No — the object lock blocks all methods', 'Yes — m2 does not need the monitor', 'Only if m2 is static', 'Only after T1 calls wait'],
      correctIndex: 1,
      explanation: 'synchronized methods lock this. Unsynchronized methods do not wait for that lock.',
    },
  },
  {
    id: 'mcq-sync-both',
    question: 'Both m1 and m2 are synchronized instance methods. T1 in m1; T2 calling m2:',
    relatedTopicIds: ['c3-synchronized'],
    answer: [],
    mcq: {
      options: ['T2 proceeds immediately', 'T2 blocks until T1 releases this', 'T2 uses a different lock', 'Deadlock always'],
      correctIndex: 1,
      explanation: 'Both methods synchronize on the same instance monitor.',
    },
  },
  {
    id: 'mcq-class-vs-object-lock',
    question: 'T1 in synchronized static m1; T2 calling synchronized instance m2:',
    relatedTopicIds: ['c3-synchronized'],
    answer: [],
    mcq: {
      options: ['T2 always waits', 'T2 can run — Class lock vs this lock', 'Illegal in Java', 'T2 waits only on HotSpot'],
      correctIndex: 1,
      explanation: 'static synchronized locks the Class object; instance synchronized locks this.',
    },
  },
  {
    id: 'mcq-hashset-no-equals',
    question: 'Two Customer objects with the same fields, no equals/hashCode, added to a HashSet. size is:',
    relatedTopicIds: ['c1-hashset', 'c1-equals'],
    answer: [],
    mcq: {
      options: ['1', '2', '0', 'Compile error'],
      correctIndex: 1,
      explanation: 'Identity equality: two instances are two keys without a value-based equals.',
    },
  },
  {
    id: 'mcq-mutated-key',
    question: 'Put Employee in a HashMap, then mutate a field used by hashCode. get(emp) often returns:',
    relatedTopicIds: ['c1-hashmap-internals', 'c1-equals'],
    answer: [],
    mcq: {
      options: ['The original value', 'null or a missed entry', 'Always ConcurrentModificationException', 'The map rehashes automatically'],
      correctIndex: 1,
      explanation: 'The key is in the old bucket. Lookup uses the new hash and misses.',
    },
  },
  {
    id: 'mcq-cme',
    question: 'Iterating HashMap.keySet() and put() a new key in the loop typically:',
    relatedTopicIds: ['c1-fail-fast'],
    answer: [],
    mcq: {
      options: ['Succeeds silently', 'Throws ConcurrentModificationException', 'Blocks until the iterator finishes', 'Removes the current key'],
      correctIndex: 1,
      explanation: 'Fail-fast iterators detect structural modification via modCount.',
    },
  },
]
