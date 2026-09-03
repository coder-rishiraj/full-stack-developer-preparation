import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_CORE: ReactInterviewItem[] = [
  {
    id: 'equals-hashcode',
    question: 'State the equals/hashCode contract.',
    relatedTopicIds: ['c1-equals', 'c1-hashcode', 'c1-hashmap-internals'],
    answer: [
      {
        type: 'paragraph',
        text: 'If `a.equals(b)` then `a.hashCode() == b.hashCode()`. Equal hash codes do not imply equals. HashMap uses hashCode to find a bucket, then equals to find the entry. Mutating a field that participates in either after insert loses the key. Override both together; include the same fields.',
      },
    ],
  },
  {
    id: 'hashmap-put',
    question: 'What happens on HashMap.put in Java 8+?',
    relatedTopicIds: ['c1-hashmap-internals', 'c1-hash-collision', 'c1-hashmap-resize'],
    answer: [
      {
        type: 'paragraph',
        text: 'The key’s hash is mixed, then masked onto the table length (power of two). Empty bucket stores a node. Collision uses a linked list, treeified at 8 nodes if the table is large enough. Load factor 0.75 triggers resize (usually 2×) and rehash. Keys must be stable.',
      },
    ],
  },
  {
    id: 'hashset-vs-treeset',
    question: 'HashSet vs TreeSet vs LinkedHashSet?',
    relatedTopicIds: ['c1-hashset', 'c1-treeset', 'c1-linkedhashset'],
    answer: [
      {
        type: 'paragraph',
        text: 'HashSet is a HashMap of keys to a dummy value — unordered, O(1) average. LinkedHashSet keeps insertion order. TreeSet is a red-black tree — sorted, O(log n), needs Comparable or a Comparator. Do not put mutable keys in any of them.',
      },
    ],
  },
  {
    id: 'arraylist-linkedlist',
    question: 'When is LinkedList the wrong default vs ArrayList?',
    relatedTopicIds: ['c1-arraylist', 'c1-linkedlist'],
    answer: [
      {
        type: 'paragraph',
        text: 'ArrayList wins on random access and iteration (contiguous memory). LinkedList wins only if you already hold a node and do many add/remove there — index-based `get(i)` is O(n). For queues, ArrayDeque usually beats LinkedList. Default to ArrayList unless you measured otherwise.',
      },
    ],
  },
  {
    id: 'fail-fast',
    question: 'What does fail-fast mean for iterators?',
    relatedTopicIds: ['c1-fail-fast', 'c1-iterator'],
    answer: [
      {
        type: 'paragraph',
        text: 'ArrayList’s iterator snapshots a `modCount`. Structural add/remove through the collection (not `iterator.remove`) throws ConcurrentModificationException. It is a best-effort bug detector, not a lock. ConcurrentHashMap iterators are weakly consistent instead.',
      },
    ],
  },
  {
    id: 'collection-collections',
    question: 'Collection vs Collections?',
    relatedTopicIds: ['c1-collection-vs-collections', 'c1-list-set-map'],
    answer: [
      {
        type: 'paragraph',
        text: '`java.util.Collection` is the root interface for List/Set/Queue. `java.util.Collections` is a utility class: `sort`, `unmodifiableList`, `synchronizedMap`. Synchronized wrappers lock the whole collection — still not enough for compound check-then-act.',
      },
    ],
  },
  {
    id: 'integer-cache',
    question: 'Why can Integer 20 == Integer 20 be true but 1000 == 1000 be false?',
    relatedTopicIds: ['c1-integer-cache', 'c1-autoboxing', 'c1-wrappers'],
    answer: [
      {
        type: 'paragraph',
        text: '`Integer.valueOf` (used by autoboxing) caches −128..127 by default. Those boxes are interned; larger values allocate new objects, so `==` is false. Always `equals` for wrappers. The cache range is configurable; do not write code that depends on it.',
      },
    ],
  },
  {
    id: 'generics-erasure',
    question: 'What is type erasure?',
    relatedTopicIds: ['c1-generics', 'c1-type-erasure', 'c1-wildcards'],
    answer: [
      {
        type: 'paragraph',
        text: 'The compiler checks `List<String>` vs `List<Integer>`, then bytecode mostly sees `List`. You cannot `new T()` or inspect `T` at runtime without a Class token. Wildcards (`? extends`, `? super`) encode producer/consumer. Overloads cannot differ only by generic type.',
      },
    ],
  },
  {
    id: 'comparable',
    question: 'Comparable vs Comparator?',
    relatedTopicIds: ['c1-comparable-comparator', 'c1-comparable-equals'],
    answer: [
      {
        type: 'paragraph',
        text: '`Comparable.compareTo` is the type’s natural order. `Comparator` is an external strategy (`Comparator.comparing(User::age)`). TreeMap/TreeSet use one of them. `compareTo` should be consistent with `equals` or you get surprises in sorted sets.',
      },
    ],
  },
  {
    id: 'varargs',
    question: 'How do varargs work, and what is the overload trap?',
    relatedTopicIds: ['c1-varargs', 'c1-methods'],
    answer: [
      {
        type: 'paragraph',
        text: '`void f(String... xs)` is a `String[]` at the call site. The compiler prefers a fixed arity match over varargs. `f(null)` can be ambiguous or pick Object vs String[] depending on overloads — be explicit with `f((String) null)` or pass an array.',
      },
    ],
  },
  {
    id: 'serialization',
    question: 'What must be true to serialize an object?',
    relatedTopicIds: ['c1-serialization', 'c1-transient', 'c1-serialversionuid'],
    answer: [
      {
        type: 'paragraph',
        text: 'The class implements Serializable (or Externalizable). static fields are not part of instance state. `transient` skips a field. Subclass of a non-serializable type needs an accessible no-arg super constructor. `serialVersionUID` should be explicit so class evolution does not break streams.',
      },
    ],
  },
  {
    id: 'try-resources',
    question: 'What does try-with-resources actually close?',
    relatedTopicIds: ['c1-try-with-resources', 'c1-io-files', 'c1-buffered-io'],
    answer: [
      {
        type: 'paragraph',
        text: 'Any AutoCloseable declared in the resource list is closed in reverse order, even if the body throws. Close exceptions are suppressed on the primary throwable. Prefer it over a manual finally for files and JDBC statements.',
      },
    ],
  },
]
