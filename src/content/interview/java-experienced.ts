import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_EXPERIENCED: ReactInterviewItem[] = [
  {
    id: 'most-specific-overload',
    question: 'Why does someMethod(null) prefer String over Object?',
    relatedTopicIds: ['c1-method-overloading', 'c1-types'],
    answer: [
      {
        type: 'paragraph',
        text: 'null is a valid value for any reference type. JLS overload resolution picks the most specific applicable method. String is more specific than Object, so the String overload wins. Add a StringBuilder overload and the call becomes ambiguous.',
      },
    ],
  },
  {
    id: 'hashmap-multithread',
    question: 'Can you use HashMap with multiple threads?',
    relatedTopicIds: ['c1-hashmap-internals', 'c1-concurrenthashmap', 'c3-concurrent-collections'],
    answer: [
      {
        type: 'paragraph',
        text: 'Safe if it is fully published then only read. Any concurrent put/resize can livelock or lose entries (classic Java 7 issue; Java 8 is still not a concurrent map). Use ConcurrentHashMap for mixed read/write, or confine writes to one thread.',
      },
    ],
  },
  {
    id: 'chm-vs-sync-map',
    question: 'ConcurrentHashMap vs Collections.synchronizedMap?',
    relatedTopicIds: ['c1-concurrenthashmap', 'c3-concurrent-collections'],
    answer: [
      {
        type: 'paragraph',
        text: 'synchronizedMap locks the entire map on every call. ConcurrentHashMap bins (and later trees) allow concurrent readers and a finer write lock. Compound operations (`if (!containsKey) put`) still need `putIfAbsent` / `compute`. CHM does not allow null keys or values.',
      },
    ],
  },
  {
    id: 'vector-arraylist',
    question: 'Why is Vector rarely the right synchronized List?',
    relatedTopicIds: ['c1-vector-vs-arraylist', 'c1-arraylist'],
    answer: [
      {
        type: 'paragraph',
        text: 'Vector synchronizes each method, which is slow and still wrong for iteration (`size` then `get` is two locks). Prefer ArrayList in one thread, or CopyOnWriteArrayList / a queue for concurrency. Mention Vector only as a legacy interview contrast.',
      },
    ],
  },
  {
    id: 'immutable-not-only-final',
    question: 'Does `final` make an object immutable?',
    relatedTopicIds: ['c1-immutability', 'c1-defensive-copies'],
    answer: [
      {
        type: 'paragraph',
        text: 'final only freezes the reference, not the object graph. A final List field can still have elements added. True immutability: private fields, no setters, defensive copies of mutable inputs/outputs, and usually a final class so subclasses cannot break the contract.',
      },
    ],
  },
  {
    id: 'override-exceptions',
    question: 'Can an override throw RuntimeException if the parent throws NullPointerException?',
    relatedTopicIds: ['c1-polymorphism', 'c1-checked-unchecked', 'c1-exceptions'],
    answer: [
      {
        type: 'paragraph',
        text: 'Yes for unchecked types — there is no covariant restriction on RuntimeException. For checked exceptions the override may throw the same type, a subtype, or nothing — not a new sibling or a wider checked type (Exception vs IOException).',
      },
    ],
  },
  {
    id: 'double-min',
    question: 'What does Math.min(Double.MIN_VALUE, 0.0) print?',
    relatedTopicIds: ['c1-wrappers', 'c1-types'],
    answer: [
      {
        type: 'paragraph',
        text: '0.0. Double.MIN_VALUE is the smallest positive magnitude (~2^-1074), not the most negative number. Double.NEGATIVE_INFINITY or -Double.MAX_VALUE is the other end. This is a classic “did you read the Javadoc” trap.',
      },
    ],
  },
  {
    id: 'float-compare',
    question: 'Why is 0.1 * 3 == 0.3 sometimes false?',
    relatedTopicIds: ['c1-types', 'c1-operators'],
    answer: [
      {
        type: 'paragraph',
        text: 'Binary floating point cannot represent 0.1 exactly. 0.1*2 may land on a representable 0.2 while 0.1*3 does not equal the literal 0.3. Compare with an epsilon, or use BigDecimal for money. `1.0/0.0` is Infinity, not an ArithmeticException.',
      },
    ],
  },
  {
    id: 'records-vs-lombok',
    question: 'When do you choose a record over a class?',
    relatedTopicIds: ['c1-records', 'c1-equals'],
    answer: [
      {
        type: 'paragraph',
        text: 'Records are transparent carriers: final fields, canonical constructor, accessors, equals/hashCode/toString generated. Use them for DTOs and keys. Do not use them if you need a mutable JavaBean, inheritance of state, or a hidden representation.',
      },
    ],
  },
  {
    id: 'sealed',
    question: 'What problem do sealed classes solve?',
    relatedTopicIds: ['c1-sealed', 'c1-pattern-matching'],
    answer: [
      {
        type: 'paragraph',
        text: 'They close the set of subtypes (`permits`). Switch over a sealed hierarchy can be exhaustive without a default. That is domain modeling, not a replacement for private constructors on a singleton.',
      },
    ],
  },
  {
    id: 'wait-loop',
    question: 'Why must wait() live in a loop?',
    relatedTopicIds: ['c3-synchronization', 'c3-producer-consumer'],
    answer: [
      {
        type: 'paragraph',
        text: 'wait releases the monitor and can return on spurious wakeup or a notify meant for another condition. Re-check the predicate (`while (!ready) resource.wait()`) inside synchronized. This belongs to the concurrency round; mention it when they ask about producer-consumer.',
      },
    ],
  },
  {
    id: 'volatile-transient',
    question: 'volatile vs transient?',
    relatedTopicIds: ['c3-volatile', 'c1-transient', 'c3-jmm'],
    answer: [
      {
        type: 'paragraph',
        text: 'volatile is a JMM visibility/ordering guarantee for a field (not atomicity of i++). transient means “skip me during default serialization.” They solve different problems; a field can be both. static + transient is redundant for serialization because static is not serialized anyway.',
      },
    ],
  },
]
