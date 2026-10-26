---
summary: Small custom types — a grid cell, an edge, an interval, a tree or trie node — make solutions readable and are required whenever an object becomes a map key or a heap element. You will learn when to write one, how records and static nested classes work, and the equals/hashCode and ordering rules that decide whether collections treat your objects correctly.
difficulty: beginner
minutes: 45
objectives:
  - Decide when a named type is clearer than an `int[]` and write it as a record or a static nested class
  - Explain the `equals`/`hashCode` contract and predict how a `HashMap` behaves when it is broken
  - Explain why keys must not change after insertion and design immutable key types
  - Explain why node classes should be `static` nested classes and build tree and trie nodes
  - Give a custom type an order with `Comparable` or a `Comparator` for heaps and sorted collections
---

## Introduction

Problems hand you bundles of related values. A grid search moves between cells that each have a row and a column. A weighted graph has edges with two endpoints and a weight. Dijkstra's algorithm keeps pairs of node and distance in a heap. You can store each bundle in an `int[]` — `new int[]{node, dist}` — and many solutions do. But six lines later, `cur[0]` and `cur[1]` are easy to swap, and nothing in the code says which slot means what.

A small **custom class** names the fields: `cur.node()` and `cur.dist()` cannot be confused. That is the readability argument, and in a long interview solution it alone is worth a few lines. There is also a correctness argument, which is the real reason this topic matters. As soon as your object is used as a **`HashMap` key** or a **`HashSet` element**, Java needs to know when two objects count as equal — and the default answer, "only if they are the same object", is almost never what you want. As soon as it goes into a **`PriorityQueue`** or a **`TreeSet`**, Java needs to know which of two objects comes first. Get either wrong and collections silently misbehave: visited cells are revisited, lookups miss, elements vanish.

This lesson shows how to write these types with the least ceremony — Java **records** for value bundles and **static nested classes** for nodes — and the rules that make them behave correctly inside collections.

## Before you start

- **Java classes and methods** — fields, constructors and `static`. See [[a1-java-syntax-competitive]].
- **HashMap and HashSet** — and the idea that `hashCode` picks a bucket and `equals` picks the entry. See [[a1-hashmap]] and [[a1-hashset]].
- **Comparators** — for the ordering section. See [[a1-comparable-comparator]].

## The intuition: labelled boxes

An `int[]` is a row of unlabelled boxes; you must remember that box 0 holds the row and box 1 the column. A custom type is the same boxes with labels printed on them. The labels cost nothing at run time worth worrying about in an interview, and they let the compiler catch mistakes such as passing a column where a row was expected.

Collections need two more things that labels alone do not give: a rule for "are these two boxes the same?" (`equals` and `hashCode`) and, sometimes, a rule for "which box comes first?" (`compareTo` or a `Comparator`). A record supplies the first rule automatically; ordering is always your decision.

## When to write a custom type

You do not need a class for every pair. A good rule of thumb:

| Situation | Reasonable choice |
|---|---|
| A short, hot loop where the meaning is obvious (`int[]{r, c}` used in three lines) | `int[]` |
| The bundle is read in many places, or the solution is long | A record or class with named fields |
| The object is a `HashMap` key or `HashSet` element | A record (value equality), never an `int[]` |
| The object goes in a heap or sorted set | A record with `Comparable`, or a `Comparator` |
| A node that links to other nodes (tree, trie, linked list, graph) | A `static` nested class with mutable fields |

The middle rows are not about style. An `int[]` *cannot* be a correct hash key, as the next sections show.

## Records: value bundles in one line

A **record** (Java 16 and later) declares an immutable data carrier. This single line:

```java
record Edge(int u, int v, int w) {}
```

generates `private final` fields `u`, `v` and `w`; a constructor `Edge(int u, int v, int w)`; accessor methods `u()`, `v()` and `w()` (note: methods, not fields, so `e.w()` with parentheses); and `equals`, `hashCode` and `toString` based on all three fields. The fields cannot be reassigned after construction.

```java title="Edges.java"
import java.util.*;

public class Edges {
    record Edge(int u, int v, int w) {}

    public static void main(String[] args) {
        List<Edge> edges = new ArrayList<>(List.of(
                new Edge(0, 1, 7), new Edge(1, 2, 3), new Edge(0, 2, 5)));
        edges.sort(Comparator.comparingInt(Edge::w));      // by weight, as Kruskal needs
        for (Edge e : edges) System.out.println(e.u() + "-" + e.v() + " w=" + e.w());
        System.out.println(edges.get(0));                  // generated toString
        System.out.println(new Edge(1, 2, 3).equals(edges.get(0)));
    }
}
```

```output
1-2 w=3
0-2 w=5
0-1 w=7
Edge[u=1, v=2, w=3]
true
```

The generated `toString` is a quiet bonus: printing a record while debugging shows its fields instead of something like `Edge@1b6d3586`. And `equals` compares field values, so a freshly constructed `Edge(1, 2, 3)` equals the one in the list.

A record can also validate its input with a **compact constructor** — a constructor without a parameter list that runs before the fields are assigned — and can declare extra methods:

```java title="Intervals.java"
public class Intervals {
    record Interval(int start, int end) {
        Interval {                                   // compact constructor
            if (start > end) throw new IllegalArgumentException(start + " > " + end);
        }
        int length() { return end - start; }
        boolean overlaps(Interval o) { return start < o.end && o.start < end; }
    }

    public static void main(String[] args) {
        Interval a = new Interval(1, 5), b = new Interval(4, 9);
        System.out.println(a.length() + " " + a.overlaps(b));
        try {
            new Interval(7, 2);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
```

```output
4 true
rejected: 7 > 2
```

Records cannot extend other classes and cannot have extra instance fields, which is exactly right for a value bundle. If a judge runs a JDK older than 16, write the same thing as a `final` class with `final` fields and hand-written `equals` and `hashCode` (shown below). Records in depth are covered in [[c1-records]].

## Equality: what makes two objects "the same"

Every Java class inherits `equals` and `hashCode` from `Object`. The inherited `equals` is **identity**: `a.equals(b)` is true only when `a` and `b` are the same object, exactly like `a == b`. The inherited `hashCode` is derived from the object's identity too. So with a plain class, two objects holding the same values are *different* as far as a `HashSet` is concerned. Arrays behave the same way.

```java title="EqualityDemo.java"
import java.util.*;

public class EqualityDemo {
    static class PlainPos {                        // inherits identity equals/hashCode
        final int r, c;
        PlainPos(int r, int c) { this.r = r; this.c = c; }
    }

    record Pos(int r, int c) {}                    // value-based equals/hashCode

    public static void main(String[] args) {
        Set<PlainPos> plain = new HashSet<>();
        plain.add(new PlainPos(0, 0));
        plain.add(new PlainPos(0, 0));
        System.out.println("plain class: " + plain.size());

        Set<int[]> arrays = new HashSet<>();
        arrays.add(new int[]{0, 0});
        arrays.add(new int[]{0, 0});
        System.out.println("int[]:       " + arrays.size());

        Set<Pos> records = new HashSet<>();
        records.add(new Pos(0, 0));
        records.add(new Pos(0, 0));
        System.out.println("record:      " + records.size());
    }
}
```

```output
plain class: 2
int[]:       2
record:      1
```

In a grid BFS, the first two versions mean a visited set that never recognises a cell it has seen — the search revisits cells forever or runs out of memory, with no error message pointing at the cause.

### The equals/hashCode contract

A `HashMap` finds an entry in two steps: `hashCode()` chooses a bucket, then `equals()` finds the matching key inside that bucket. For that to work, the two methods must agree. The **contract** (from the `Object` documentation) is:

1. If `a.equals(b)` is true, then `a.hashCode() == b.hashCode()` must be true.
2. `equals` must be reflexive, symmetric and transitive, and give the same answer each time as long as the objects do not change.
3. Unequal objects *may* share a hash code — that is just a collision — but fewer collisions mean faster maps.

If you override `equals` but not `hashCode`, rule 1 breaks: two equal positions get identity-based hash codes, land in different buckets, and `get` never even looks at the bucket that holds the matching key. When you write the methods yourself, base both on exactly the same fields:

```java title="ManualKey.java"
import java.util.*;

public class ManualKey {
    static final class Pos {
        final int r, c;
        Pos(int r, int c) { this.r = r; this.c = c; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Pos p)) return false;     // pattern matching, Java 16+
            return r == p.r && c == p.c;
        }

        @Override
        public int hashCode() {
            return 31 * r + c;                           // same fields as equals
        }
    }

    public static void main(String[] args) {
        Map<Pos, String> m = new HashMap<>();
        m.put(new Pos(2, 3), "wall");
        System.out.println(m.get(new Pos(2, 3)));
        System.out.println(m.containsKey(new Pos(3, 2)));
    }
}
```

```output
wall
false
```

Three details are worth copying. `equals` takes an `Object` parameter — writing `equals(Pos p)` creates an *overload* that collections never call, a classic bug the `@Override` annotation catches at compile time. The `instanceof` check handles `null` and other types. And `31 * r + c` mixes the fields so that `(2, 3)` and `(3, 2)` usually get different hashes; `Objects.hash(r, c)` does the same with less typing (and a little boxing overhead). A record writes all of this for you, which is why records are the default choice for keys. The details are covered in [[c1-equals]] and [[c1-hashcode]].

### Keys must not change

The bucket for an entry is chosen from the key's hash code *at the moment it is inserted*. The map never recomputes it. If you then change a field that `hashCode` depends on, the entry stays in its old bucket while every new lookup computes the new hash and searches a different one:

```java title="MutableKey.java"
import java.util.*;

public class MutableKey {
    static final class Cell {
        int r, c;                                    // NOT final: this is the bug
        Cell(int r, int c) { this.r = r; this.c = c; }
        @Override public boolean equals(Object o) {
            return o instanceof Cell x && x.r == r && x.c == c;
        }
        @Override public int hashCode() { return 31 * r + c; }
    }

    public static void main(String[] args) {
        Set<Cell> visited = new HashSet<>();
        Cell cell = new Cell(1, 1);
        visited.add(cell);
        cell.r = 5;                                  // mutate after insertion
        System.out.println(visited.contains(cell));               // looks in the new bucket
        System.out.println(visited.contains(new Cell(1, 1)));     // right bucket, unequal key
        System.out.println(visited.size());                       // still holds the object
    }
}
```

```output
false
false
1
```

The object is still in the set, yet it cannot be found by its new value or its old one: lookups for `(5, 1)` search the wrong bucket, and lookups for `(1, 1)` find the right bucket but the stored key no longer equals `(1, 1)`. The cure is to make key fields `final` — which records do automatically — and to create a new key object for each new position rather than moving an old one.

## Static nested classes for nodes

Linked structures need objects whose fields *do* change: a tree node gains children, a linked-list node's `next` is rewired. These are not keys, so mutability is fine. The usual home for such a class in a single-file solution is a **nested class** declared inside your main class — and it should be declared **`static`**.

A nested class without `static` is an **inner class**. Every inner-class object secretly stores a reference to an instance of the enclosing class, so it can only be created from an instance context. From the `static` `main` method, there is no enclosing instance, and the code does not compile:

```java
public class Main {
    class Node { int val; Node next; }          // inner class: needs a Main instance

    public static void main(String[] args) {
        Node n = new Node();   // error: non-static variable this cannot be referenced
    }                          //        from a static context
}
```

Even where it does compile (inside instance methods), every node carries that hidden extra reference — memory you did not ask for — and keeps the outer object alive. A **static nested class** has no hidden reference; it is an ordinary class that happens to be declared inside another for convenience. Write `static class Node`, and the problem disappears. See [[c1-static-nested]] and [[c1-inner-classes]] for the full rules.

### Worked example: a trie node

A **trie** (prefix tree) stores words letter by letter: each node has up to 26 children, one per lowercase letter, and a flag marking whether a word ends there. Words that share a prefix share the path for that prefix.

```java title="TrieDemo.java"
public class TrieDemo {
    static class Node {
        Node[] child = new Node[26];     // child[c - 'a'], null if absent
        boolean end;                     // a word ends at this node
    }

    static final Node root = new Node();

    static void insert(String w) {
        Node cur = root;
        for (char ch : w.toCharArray()) {
            int i = ch - 'a';
            if (cur.child[i] == null) cur.child[i] = new Node();   // create on demand
            cur = cur.child[i];
        }
        cur.end = true;
    }

    static Node walk(String s) {         // node reached by following s, or null
        Node cur = root;
        for (char ch : s.toCharArray()) {
            cur = cur.child[ch - 'a'];
            if (cur == null) return null;
        }
        return cur;
    }

    public static void main(String[] args) {
        for (String w : new String[]{"car", "card", "care", "dog"}) insert(w);
        Node n = walk("car");
        System.out.println(n != null && n.end);           // "car" is a word
        Node m = walk("ca");
        System.out.println(m != null && m.end);           // "ca" is only a prefix
        System.out.println(walk("ca") != null);           // but some word starts with it
        System.out.println(walk("cat") != null);
    }
}
```

```output
true
false
true
false
```

The node class needs no `equals` or `hashCode`, because nodes are never compared by value or used as keys — they are containers reached by following references. Insert and search cost O(L) for a word of length `L`, independent of how many words are stored. Tries are taught fully in [[a12-trie]]; tree nodes (`static class TreeNode { int val; TreeNode left, right; }`) in [[a6-binary-trees]]; and graph nodes with neighbour lists, as in clone-graph problems, in [[a8-clone-graph]].

```quiz
Q: A plain class `Pos` with fields `r` and `c` does not override `equals` or `hashCode`. Two `new Pos(1, 2)` objects are added to a `HashSet`. What is the set's size?
- [ ] 1, because the field values match
- [x] 2, because the inherited `equals` compares object identity
- [ ] 0, because classes without `equals` cannot be stored in a set
- [ ] It does not compile
> `Object.equals` is identity, and `Object.hashCode` is identity-based, so the two objects are distinct elements. A record, or overriding both methods on the same fields, gives value equality.

Q: You override `equals` on `r` and `c` but forget `hashCode`. What goes wrong in a `HashMap`?
- [ ] Nothing, because `HashMap` only uses `equals`
- [x] Equal keys usually get different hash codes, land in different buckets, and lookups miss
- [ ] The compiler rejects the class
- [ ] `HashMap` switches to a tree and still finds the key
> A lookup first selects a bucket by `hashCode`, and only then compares with `equals` inside that bucket. With identity-based hash codes, the equal key sits in a bucket the lookup never visits.

Q: Why should a tree node class nested in your solution be declared `static`?
- [ ] `static` classes get `equals` generated automatically
- [ ] Only `static` classes may have fields of their own type
- [x] A non-static inner class holds a hidden reference to an outer instance and cannot be created from `static main`
- [ ] `static` makes the node immutable
> An inner class object needs an enclosing instance, so `new Node()` in a static method does not compile, and where it does compile each node carries an extra reference. A static nested class is an ordinary class with no hidden link.
```

## Giving a type an order

Equality and order are separate decisions. A record knows when two instances are equal, but it does not know which one comes first, so putting it in a `PriorityQueue` or `TreeSet` without an order throws `ClassCastException`. You have two choices, both covered in [[a1-comparable-comparator]]: implement `Comparable` when the type has one natural order, or pass a `Comparator` when the order belongs to the algorithm.

### Worked example: a Dijkstra state

Dijkstra's algorithm repeatedly polls the closest unprocessed node from a heap. A record with `Comparable` makes the heap code read like the algorithm:

```java title="DijkstraState.java"
import java.util.*;

public class DijkstraState {
    record Edge(int to, int w) {}

    record State(int node, long dist) implements Comparable<State> {
        public int compareTo(State o) { return Long.compare(dist, o.dist); }
    }

    public static void main(String[] args) {
        int n = 5;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[][] es = {{0, 1, 4}, {0, 2, 1}, {2, 1, 2}, {1, 3, 1}, {2, 3, 5}, {3, 4, 3}};
        for (int[] e : es) adj.get(e[0]).add(new Edge(e[1], e[2]));

        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[0] = 0;
        PriorityQueue<State> pq = new PriorityQueue<>();       // uses State.compareTo
        pq.offer(new State(0, 0));
        while (!pq.isEmpty()) {
            State cur = pq.poll();
            if (cur.dist() != dist[cur.node()]) continue;      // stale entry
            for (Edge e : adj.get(cur.node())) {
                long nd = cur.dist() + e.w();
                if (nd < dist[e.to()]) {
                    dist[e.to()] = nd;
                    pq.offer(new State(e.to(), nd));
                }
            }
        }
        System.out.println(Arrays.toString(dist));
    }
}
```

```output
[0, 3, 1, 4, 7]
```

`cur.node()` and `cur.dist()` cannot be mixed up the way `cur[0]` and `cur[1]` can, and `Long.compare` avoids the overflow that subtraction would risk. Notice what this record's `compareTo` does *not* do: it is not consistent with `equals` (two states with the same distance but different nodes compare as 0 but are not equal). That is harmless in a `PriorityQueue`, which tolerates ties, but would make a `TreeSet<State>` silently drop states — add `.node` as a tie-breaker if you ever store states in a sorted set. The algorithm itself is taught in [[a8-dijkstra]].

## How it works internally

Every Java object carries a **header** — on a typical 64-bit JVM about 12 bytes with compressed pointers — holding identity hash and locking information and a pointer to its class. Fields follow, padded to a multiple of 8 bytes. A `Pos(int r, int c)` record therefore occupies about 24 bytes, and an `int[2]` about the same (its header also stores the length). Neither is free compared with two raw `int`s, which is why tight inner loops of contest solutions sometimes encode a cell as a single `int`, `r * cols + c`, and use arrays instead of sets.

A record's generated `equals` compares each component (with `==` for primitives and `equals` for references), and its `hashCode` combines the components' hash codes. The exact formula is unspecified, but it is guaranteed to agree with `equals`. Because components are `final`, a record is shallowly immutable — but a component that is itself a mutable object (a `List` or an array) can still be changed through the reference, and an array component still uses identity in the generated `equals`. Keep key components primitive, `String`, or other immutable types.

## In real systems

Production code is built from exactly these pieces. Records represent Data Transfer Objects (DTOs) in REST APIs, events in message queues, and composite keys in caches (`record CacheKey(String tenant, long userId)`). The mutable-key bug appears in real incidents — an entity stored in a `HashSet` whose `hashCode` uses a database ID that is assigned only after it is saved, so the object "disappears" from the set after persistence. Object-oriented design adds encapsulation (private fields, validation, behaviour on the class) that interview code usually skips for brevity; the reasons behind it are covered in [[d1-encapsulation]] and immutability in [[c1-immutability]].

## Trade-offs and alternatives

| Representation | Strengths | Weaknesses |
|---|---|---|
| `int[]` / `long[]` | Shortest to write, no declaration | Unnamed slots, identity equality, cannot be a key |
| Record | Named, immutable, `equals`/`hashCode`/`toString` generated | Java 16+, immutable (not for nodes) |
| Hand-written final class | Works on any Java version | Boilerplate; easy to get `equals`/`hashCode` wrong |
| Static nested mutable class | Right for nodes and linked structures | Must not be used as a key while it changes |
| Encoded `long`, e.g. `(long) r << 32 \| c` | Fast keys with no object per entry | Unreadable; easy to get the encoding wrong |

Prefer clarity first. Switch to encodings or parallel arrays only when the profile or the constraints show that object allocation is the bottleneck.

## Common mistakes

**Using `int[]` as a map key or set element.** Arrays use identity equality. Use a record or an encoded number.

**Overriding `equals` without `hashCode`.** Equal objects land in different buckets. Override both, on the same fields, or use a record.

**Writing `equals(Pos other)` instead of `equals(Object o)`.** That overload is never called by collections. Always add `@Override`.

**Mutating a key after inserting it.** The entry is stranded. Make key fields `final` and create new objects.

**Declaring a node class as an inner class.** It does not compile from `static` code and wastes memory elsewhere. Add `static`.

**Using `double` fields in keys.** Floating-point rounding makes "equal" values differ (`0.1 + 0.2 != 0.3`). Use integers, or scaled integers.

**Assuming equality gives an order.** A record still needs `Comparable` or a `Comparator` for heaps and sorted sets.

> [!WARNING] Accessors are methods
> Record fields are read with parentheses: `p.r()`, not `p.r`. Inside the record's own methods, the plain field name `r` works, which hides the difference until you use the record elsewhere.

## Interview perspective

Interviewers notice whether you can model data cleanly and whether you know the rules that collections impose.

> [!INTERVIEW] What a strong answer sounds like
> "I'll store visited cells as `record Pos(int r, int c)` so the set compares by value — an `int[]` would compare by identity and never recognise a revisit. Records are immutable, so a key can't change after insertion. For the heap I'll make the state `Comparable` on distance using `Long.compare`."

Questions you should be able to answer:

- **When must `equals` and `hashCode` be overridden together?** Whenever objects are compared by value in hash-based collections; equal objects must have equal hash codes.
- **What does a record generate?** Private final fields, a canonical constructor, accessors, and `equals`, `hashCode` and `toString` over all components.
- **Why `static` for nested node classes?** No hidden reference to an outer instance, so they can be created from static code and use less memory.
- **What happens if a key changes inside a `HashMap`?** It stays in the bucket for its old hash and becomes unreachable by lookups.
- **Record versus `int[]` for a heap entry?** The record is readable and type-safe; the array is shorter and slightly cheaper. Either works with a correct comparator.

## Practice

1. **Grid BFS with records.** Find the shortest path in a grid using `record Pos(int r, int c)` in a `HashSet` visited set; then rewrite it with a `boolean[][]` and compare.
2. **Implement a trie** with `insert`, `search` and `startsWith`.
3. **Clone a graph** given nodes with neighbour lists, using a `HashMap<Node, Node>` from original to copy (identity keys are correct here — explain why).
4. **Hand-write a key class** for `(String name, int year)` with correct `equals` and `hashCode`, and test it in a `HashMap`.
5. **Kruskal's edge list.** Represent edges as records and sort them by weight, breaking ties by endpoints.

## Quick revision {#quick-revision}

- Named types beat `int[]` for readability whenever a bundle is used in more than a couple of lines.
- `record Pos(int r, int c) {}` → final fields, constructor, accessors `r()`/`c()`, value-based `equals`/`hashCode`/`toString`. Java 16+.
- Compact constructor `Pos { ... }` validates arguments.
- `Object.equals` is identity; `int[]` and plain classes are never value-equal by default.
- Contract: `a.equals(b)` ⇒ same `hashCode`. Override both on the same fields; signature is `equals(Object o)` with `@Override`.
- Never mutate a key's fields after insertion — make them `final`.
- Node classes: `static class Node { ... }`; an inner class needs an outer instance and won't compile from `static main`.
- Order is separate from equality: `Comparable` or a `Comparator`, using `Integer.compare`/`Long.compare`.
- Trie node: `Node[] child = new Node[26]; boolean end;`.

## Key takeaways {#key-takeaways}

- A small named type makes long solutions readable, and is required whenever an object is a hash key or heap element.
- Records are the default for value bundles and keys: immutable, with correct `equals`, `hashCode` and `toString` generated.
- Hash collections find entries by `hashCode` then `equals`, so the two must agree, and key fields must never change after insertion.
- Nested node classes should be `static`; they are containers linked by references and need no value equality.
- Equality does not imply order — heaps and sorted collections need `Comparable` or a `Comparator`.
