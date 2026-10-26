---
summary: Sorting, TreeMap, TreeSet and PriorityQueue all depend on one question — which of two objects comes first? You will learn how Java's Comparable and Comparator answer it, how to write comparisons that are correct for every input, and why a wrong comparator silently breaks sorts, trees and heaps.
difficulty: beginner
minutes: 40
objectives:
  - Explain the negative / zero / positive contract of `compare` and `compareTo`
  - Choose between Comparable (a natural order) and Comparator (an external order) for a given problem
  - Build multi-key and reversed orders with `Comparator.comparingInt`, `thenComparing` and `reversed`
  - Explain why `a - b` is a broken comparator and replace it with `Integer.compare`
  - Predict how ties behave in a stable sort versus a TreeSet, and add tie-breakers where needed
---

## Introduction

Sorting an array of numbers needs no instructions: everyone agrees that 3 comes before 7. Sorting meetings is different. Should they be ordered by start time, by end time, by duration, or by the number of attendees? A sorting algorithm cannot guess. It needs a rule that, given any two meetings, says which one comes first.

Java expresses that rule in two ways. A class can declare its own **natural order** by implementing the **`Comparable`** interface and its `compareTo` method — this is how `Integer` and `String` know how to sort themselves. Or you can supply an order from outside the class with a **`Comparator`** object and its `compare` method — this is how you sort the same meetings by start time in one place and by end time in another.

The same rule is used far beyond `sort`. `TreeMap` and `TreeSet` consult it on every insert to place keys in their tree, and `PriorityQueue` consults it to decide what sits at the root of its heap. A correct comparator is therefore the foundation of a large share of interview solutions: every "sort, then scan" greedy, every custom heap, every ordered set. A subtly wrong one produces wrong answers without any exception, which is why this lesson spends as much time on the traps as on the syntax.

## Before you start

- **Java classes and methods** — defining a class with fields and a method. See [[a1-java-syntax-competitive]] and [[a1-custom-classes]].
- **The collections** — `ArrayList`, `TreeSet`, `TreeMap` and `PriorityQueue`, at least by name. See [[a1-arraylist]].
- **Lambdas** — the short `(a, b) -> ...` syntax for a function. This lesson explains each lambda it uses; a fuller treatment is in [[c1-lambdas]].

## The intuition: a referee for pairs

Think of a comparator as a referee who is shown two contestants and must announce one of three verdicts: the first one goes ahead, the second one goes ahead, or it is a tie. The referee never sees the whole field. Sorting algorithms, trees and heaps are built entirely out of these pairwise verdicts — a sort of `n` elements asks the referee about O(n log n) pairs, and a tree insert asks about O(log n) pairs.

Two consequences follow from that picture. First, the referee must be **consistent**: if A beats B and B beats C, then A must beat C, or no sensible ranking exists and algorithms built on the verdicts misbehave. Second, a "tie" verdict means different things to different consumers. A sort just leaves tied contestants next to each other. A `TreeSet`, which stores each element once, treats a tie as "these are the same element" and keeps only one.

## The comparison contract

Both `compare(a, b)` and `a.compareTo(b)` return an `int`, not a `boolean`, because there are three possible answers:

| Return value | Meaning |
|---|---|
| negative (any value < 0) | `a` comes **before** `b` |
| zero | `a` and `b` are **tied** in this order |
| positive (any value > 0) | `a` comes **after** `b` |

Only the sign matters; `-1` and `-999` mean the same thing. A good memory aid: `compare(a, b)` behaves like the sign of `a − b` *for small numbers* — negative when `a` is smaller. (As you will see, actually computing `a − b` is a bug.)

For an order to be usable, the rule must satisfy three properties for all inputs:

- **Antisymmetry** — `compare(a, b)` and `compare(b, a)` have opposite signs (or are both zero).
- **Transitivity** — if `a` comes before `b` and `b` before `c`, then `a` comes before `c`.
- **Consistency of ties** — if `a` ties with `b`, then `a` and `b` compare the same way against every other element.

Comparators that break these rules make results depend on the order in which the algorithm happened to ask its questions. Java's object sort (TimSort) sometimes detects the inconsistency and throws `IllegalArgumentException: Comparison method violates its general contract!`; more often it simply returns a wrongly ordered result.

## Comparable: the natural order

A class implements `Comparable<T>` when it has one obvious, canonical order. It provides a single method, `compareTo`, that compares `this` with another object of the same type. Many library types already do: numbers compare by value, `String` compares **lexicographically** (character by character, by Unicode value, the way a dictionary orders words), and `LocalDate` compares chronologically.

```java title="NaturalOrder.java"
import java.util.*;

public class NaturalOrder {
    record Version(int major, int minor) implements Comparable<Version> {
        @Override
        public int compareTo(Version o) {
            if (major != o.major) return Integer.compare(major, o.major);
            return Integer.compare(minor, o.minor);     // tie on major: compare minor
        }
    }

    public static void main(String[] args) {
        List<String> words = new ArrayList<>(List.of("pear", "Apple", "apple", "10", "9"));
        Collections.sort(words);                         // String's natural order
        System.out.println(words);

        List<Version> vs = new ArrayList<>(List.of(
                new Version(2, 0), new Version(1, 10), new Version(1, 2)));
        Collections.sort(vs);                            // uses Version.compareTo
        System.out.println(vs);
        System.out.println(new Version(1, 2).compareTo(new Version(1, 10)) < 0);
    }
}
```

```output
[10, 9, Apple, apple, pear]
[Version[major=1, minor=2], Version[major=1, minor=10], Version[major=2, minor=0]]
true
```

The string output surprises people twice. `"10"` sorts before `"9"` because strings compare character by character and `'1'` comes before `'9'` — strings of digits are not numbers. And `"Apple"` sorts before `"apple"` because every uppercase letter has a smaller Unicode value than every lowercase one. (For case-insensitive order, use `String.CASE_INSENSITIVE_ORDER`.)

The `Version` record shows the shape of a multi-field `compareTo`: compare the most important field first, and only when it ties, compare the next one. That is **lexicographic order** over fields. Note that `1.2` correctly comes before `1.10` because the minor versions are compared as numbers — exactly the case that string comparison gets wrong.

Once a class is `Comparable`, everything that needs an order can use it with no extra code: `Collections.sort(list)`, `new TreeSet<>()`, `new TreeMap<>()` and `new PriorityQueue<>()` all pick up `compareTo` automatically. Without it, `TreeSet.add` throws `ClassCastException`, because the tree has no way to compare elements.

## Comparator: an order from outside

A class gets only one `compareTo`. But the same intervals often need sorting by start in one algorithm and by end in another, and you may want to sort a library class whose code you cannot change. A **`Comparator<T>`** is a separate object whose job is `compare(a, b)`. You pass it to whatever needs an order: `list.sort(cmp)`, `Arrays.sort(array, cmp)`, `new TreeSet<>(cmp)`, `new TreeMap<>(cmp)`, `new PriorityQueue<>(cmp)`.

You rarely write a `Comparator` class by hand. A lambda works, and the `Comparator` interface provides factory methods that build comparators from **key extractors** — functions that pull out the value to compare:

| Building block | Meaning |
|---|---|
| `Comparator.comparingInt(x -> key)` | Order by an `int` key (also `comparingLong`, `comparingDouble`) |
| `Comparator.comparing(x -> key)` | Order by any `Comparable` key, such as a `String` |
| `.thenComparingInt(x -> key2)` | If the first key ties, order by a second key |
| `.reversed()` | Reverse the whole comparator built so far |
| `Comparator.reverseOrder()` | The reverse of the natural order |
| `Comparator.naturalOrder()` | The natural order, as a comparator |

```java title="ComparatorDemo.java"
import java.util.*;

public class ComparatorDemo {
    public static void main(String[] args) {
        List<int[]> iv = new ArrayList<>(List.of(
                new int[]{5, 8}, new int[]{1, 9}, new int[]{1, 3}, new int[]{4, 6}));

        iv.sort(Comparator.comparingInt((int[] a) -> a[0])     // by start...
                          .thenComparingInt(a -> a[1]));       // ...then by end
        print("by start, end:", iv);

        iv.sort(Comparator.comparingInt((int[] a) -> a[1]));   // by end only
        print("by end:       ", iv);

        iv.sort(Comparator.comparingInt((int[] a) -> a[1] - a[0]).reversed());
        print("longest first:", iv);

        List<String> names = new ArrayList<>(List.of("Bo", "Alexandra", "Cy", "Dmitri"));
        names.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.reverseOrder()));
        System.out.println(names);
    }

    static void print(String label, List<int[]> list) {
        StringBuilder sb = new StringBuilder(label);
        for (int[] a : list) sb.append(" [").append(a[0]).append(',').append(a[1]).append(']');
        System.out.println(sb);
    }
}
```

```output
by start, end: [1,3] [1,9] [4,6] [5,8]
by end:        [1,3] [4,6] [5,8] [1,9]
longest first: [1,9] [5,8] [1,3] [4,6]
[Cy, Bo, Dmitri, Alexandra]
```

Read the first comparator as a sentence: "compare by `a[0]`, then by `a[1]`". The type annotation `(int[] a)` in the first lambda is needed because Java infers types left to right through a chain, and without it the compiler cannot tell what `a` is when it reaches `.thenComparingInt`. In the third sort, `[1,3]` and `[4,6]` both have length 2; they keep the order they had after the previous sort because Java's object sort is stable (more on that below). In the last example, names are ordered by length, and names of equal length in reverse alphabetical order — `"Cy"` before `"Bo"`. `String::length` is a **method reference**, shorthand for `s -> s.length()`.

`.reversed()` applies to everything chained before it, which is a common source of confusion: `comparingInt(a).thenComparingInt(b).reversed()` reverses *both* keys. To reverse only one key, reverse inside it, for example `.thenComparing(key, Comparator.reverseOrder())`, or write an explicit lambda.

When the logic is easier to say in code than in a chain, write the lambda directly. This sorts points by `x` descending, then `y` ascending:

```java
points.sort((p, q) -> {
    if (p[0] != q[0]) return Integer.compare(q[0], p[0]);   // swapped: descending x
    return Integer.compare(p[1], q[1]);                     // ascending y
});
```

Swapping the arguments, `Integer.compare(q, p)` instead of `Integer.compare(p, q)`, is the general way to reverse one key.

### Sorting primitives with a custom order

`Arrays.sort(int[])` sorts ascending and accepts no comparator, because comparators work on objects and `int` is a primitive. To sort numbers in a custom order you have three options: sort ascending and read the array backwards; use an `Integer[]` (boxed) with a comparator; or, very often the best choice, sort an array of **indices** by the values they point to:

```java
Integer[] idx = new Integer[n];
for (int i = 0; i < n; i++) idx[i] = i;
Arrays.sort(idx, (i, j) -> Integer.compare(score[j], score[i]));   // highest score first
```

`int[][]`, by contrast, *can* take a comparator directly — each row is an `int[]`, which is an object.

## Never compare by subtracting

The most famous comparator bug looks perfectly reasonable:

```java title="SubtractionBug.java"
import java.util.*;

public class SubtractionBug {
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<>(List.of(3, Integer.MIN_VALUE, -7, Integer.MAX_VALUE, 0));
        List<Integer> b = new ArrayList<>(a);

        a.sort((x, y) -> x - y);                  // looks fine, is broken
        b.sort((x, y) -> Integer.compare(x, y));  // correct
        System.out.println(a);
        System.out.println(b);

        System.out.println(Integer.MIN_VALUE - 1);   // "MIN_VALUE comes after 1"?
    }
}
```

```output
[0, 3, 2147483647, -2147483648, -7]
[-2147483648, -7, 0, 3, 2147483647]
2147483647
```

The first list is not sorted at all — `Integer.MIN_VALUE` and `-7` ended up after the largest value. The last line shows why. The explanation is integer overflow ([[a1-java-syntax-competitive]]): `Integer.MIN_VALUE - 1` cannot be represented, wraps to `Integer.MAX_VALUE`, and is positive, so the comparator claims that the smallest possible `int` comes *after* 1. Whenever the two values can be more than about 2.1 billion apart — large positive against large negative — subtraction flips the sign and the order is wrong, with no exception.

`Integer.compare(x, y)` never subtracts; it returns `(x < y) ? -1 : ((x == y) ? 0 : 1)`. Use it, or `Long.compare` and `Double.compare`, for every numeric key. It costs nothing, and it removes an entire class of bug from your solutions. (`Double.compare` additionally handles `NaN` and `-0.0` consistently, which `<` does not.)

## Ties: stable sorts versus sets

What happens when the comparator returns 0 depends on who is asking.

**Sorting keeps both elements.** Java's object sort (used by `List.sort`, `Collections.sort` and `Arrays.sort` on object arrays) is TimSort, which is **stable**: elements that tie keep the relative order they had before the sort. That property is useful — sort people by name, then stably by age, and people of the same age stay alphabetical. (Sorting a primitive `int[]` uses a different, unstable algorithm, but equal `int`s are indistinguishable, so it does not matter.)

**Sorted sets and maps keep one.** A `TreeSet` or `TreeMap` uses the comparator to decide whether two elements are *the same*. A result of 0 means "already present", and the second element is dropped:

```java title="TieDrop.java"
import java.util.*;

public class TieDrop {
    record Task(String name, int deadline) {}

    public static void main(String[] args) {
        List<Task> tasks = List.of(new Task("write", 3), new Task("test", 1), new Task("ship", 3));

        TreeSet<Task> byDeadline = new TreeSet<>(Comparator.comparingInt(Task::deadline));
        byDeadline.addAll(tasks);
        System.out.println(byDeadline.size() + " " + byDeadline);    // "ship" vanished

        TreeSet<Task> withTieBreak = new TreeSet<>(
                Comparator.comparingInt(Task::deadline).thenComparing(Task::name));
        withTieBreak.addAll(tasks);
        System.out.println(withTieBreak.size() + " " + withTieBreak);
    }
}
```

```output
2 [Task[name=test, deadline=1], Task[name=write, deadline=3]]
3 [Task[name=test, deadline=1], Task[name=ship, deadline=3], Task[name=write, deadline=3]]
```

The fix is a **tie-breaker**: extend the comparator with further keys until it returns 0 only for elements that really are the same — a name, an index, an ID. `PriorityQueue` does not drop tied elements, but it returns them in an unspecified order, so add a tie-breaker there too when the problem specifies one ("if two tasks have the same priority, pick the one with the smaller index").

> [!WARNING] compare returning 0 means duplicate in a TreeSet
> The tree consults only the comparator, never `equals`. Two objects that `equals` says are different will still collapse into one if the comparator calls them tied.

### Consistency with equals

The Java documentation recommends that a natural order be **consistent with equals**: `a.compareTo(b) == 0` exactly when `a.equals(b)`. Most library types follow it. `BigDecimal` famously does not — `1.0` and `1.00` compare as equal but are not `equals`, because their scales differ:

```java title="ConsistentWithEquals.java"
import java.math.BigDecimal;
import java.util.*;

public class ConsistentWithEquals {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("1.0"), b = new BigDecimal("1.00");
        System.out.println(a.equals(b) + " " + a.compareTo(b));
        System.out.println(new HashSet<>(List.of(a, b)).size());   // uses equals
        System.out.println(new TreeSet<>(List.of(a, b)).size());   // uses compareTo
    }
}
```

```output
false 0
2
1
```

The same two values form a set of size 2 or 1 depending on which kind of set holds them. When you write your own `compareTo`, compare the same fields that `equals` uses, so the two notions of "same" agree. The Java track looks at this in [[c1-comparable-equals]].

```quiz
Q: What does a negative return value from `compare(a, b)` mean?
- [ ] `a` and `b` are equal
- [x] `a` comes before `b` in this order
- [ ] `a` comes after `b` in this order
- [ ] The comparison failed
> Negative means the first argument is ordered first, zero means a tie, positive means the first argument comes later. Only the sign matters, not the magnitude.

Q: Why is `(x, y) -> x - y` a broken comparator for arbitrary `int` values?
- [ ] Subtraction is slower than `Integer.compare`
- [x] The difference can overflow and flip sign, giving the wrong order
- [ ] Lambdas cannot return the result of arithmetic
- [ ] It sorts in descending order
> For values far apart, such as `Integer.MIN_VALUE` and 1, the subtraction wraps around and produces a positive number, so the smaller value is placed later. `Integer.compare` never subtracts and is always correct.

Q: A `TreeSet` uses a comparator on `deadline` only. Two different tasks share deadline 3. How many of them does the set keep?
- [ ] Both, because the tasks are different objects
- [x] One, because a comparison result of 0 means "already present"
- [ ] Neither; the set throws an exception on ties
- [ ] Both, but in random order
> Sorted sets decide sameness with the comparator alone. Adding a tie-breaker such as `.thenComparing(Task::name)` makes distinct tasks compare as different, so both are kept.
```

## Worked example: the sort key must match the proof

Many greedy algorithms are "sort, then scan", and the comparator *is* the algorithm's key decision. Two classic problems look alike and need different orders.

**Merge overlapping intervals** sorts by **start**. After sorting, any interval that overlaps the current merged block must start before that block ends, so a single left-to-right scan suffices:

```java title="MergeIntervals.java"
import java.util.*;

public class MergeIntervals {
    static List<int[]> merge(int[][] intervals) {
        int[][] iv = intervals.clone();
        Arrays.sort(iv, Comparator.comparingInt(a -> a[0]));   // by start
        List<int[]> out = new ArrayList<>();
        for (int[] cur : iv) {
            if (out.isEmpty() || out.get(out.size() - 1)[1] < cur[0]) {
                out.add(new int[]{cur[0], cur[1]});            // gap: start a new block
            } else {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], cur[1]);           // overlap: extend the block
            }
        }
        return out;
    }

    public static void main(String[] args) {
        for (int[] a : merge(new int[][]{{8, 10}, {1, 3}, {2, 6}, {15, 18}, {9, 12}})) {
            System.out.print(Arrays.toString(a) + " ");
        }
        System.out.println();
    }
}
```

```output
[1, 6] [8, 12] [15, 18] 
```

| Step | Current interval (sorted order) | Last merged block before | Decision | Blocks after |
|---|---|---|---|---|
| 1 | [1, 3] | none | start new | [1, 3] |
| 2 | [2, 6] | [1, 3] | 2 ≤ 3, extend | [1, 6] |
| 3 | [8, 10] | [1, 6] | 6 < 8, start new | [1, 6] [8, 10] |
| 4 | [9, 12] | [8, 10] | 9 ≤ 10, extend | [1, 6] [8, 12] |
| 5 | [15, 18] | [8, 12] | 12 < 15, start new | [1, 6] [8, 12] [15, 18] |

The sort is O(n log n) and the scan O(n). Sorted by end instead, the same loop would fail: `[1, 9]` would come after `[2, 3]` and `[4, 5]`, which were already closed as separate blocks.

**Choosing the maximum number of non-overlapping meetings** sorts by **end**. The greedy argument is "always take the meeting that finishes first, because it leaves the most room for the rest" — and that argument only works when meetings are considered in order of finishing time. Sorting by start here picks a long early meeting that blocks many short ones.

So before writing the comparator, state why the order makes the scan correct. The comparator syntax is easy; choosing the key is the part interviewers are testing. Interval problems are developed in [[a2-intervals]] and [[a10-interval-scheduling]], and comparator-driven sorting in [[a3-comparator-sorting]].

## Ordering heaps and trees

`PriorityQueue` treats whatever the comparator puts *first* as the element to poll first. So the default (natural order) gives a min-heap, and a reversed comparator gives a max-heap:

```java
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
PriorityQueue<int[]> closest = new PriorityQueue<>(            // smallest distance first,
        Comparator.comparingLong((int[] p) -> (long) p[0] * p[0] + (long) p[1] * p[1])
                  .thenComparingInt(p -> p[0]));               // ties broken by x
```

The distance key is computed in `long` because squaring coordinates near 10⁵ already approaches the `int` limit. If computing a key is expensive, the cost multiplies: a sort performs about n log₂ n comparisons, each computing two keys. Precompute keys into an array, or store them in the element, when that matters.

## How it works internally

`Collections.sort(list)` delegates to `list.sort`. An `ArrayList` sorts its backing array directly with `Arrays.sort`; other lists are copied into an array, sorted, and written back. For objects, `Arrays.sort` uses **TimSort**, a hybrid of merge sort and insertion sort that finds already-sorted runs in the input and merges them. It performs O(n log n) comparisons in the worst case and close to O(n) on nearly sorted input, and its merging is what makes it stable. For primitive arrays, `Arrays.sort` uses a dual-pivot quicksort, which is not stable but needs no extra memory per object.

`Comparator.comparingInt(f).thenComparingInt(g)` is ordinary code: it returns a new comparator whose `compare` calls the first comparator and, only when that returns 0, calls the second. `reversed()` returns a comparator that calls the original with its arguments swapped. Trees and heaps call the comparator at every node they pass, so a `TreeMap` lookup asks O(log n) questions and a heap `offer` at most one per level.

## In real systems

Comparators are everywhere in production Java: sorting search results by relevance then recency, ordering a job scheduler's queue by priority then submission time, keeping leaderboards in a `TreeMap`, and defining the order of keys in on-disk indexes. The bugs are the same as in interviews. Ties without tie-breakers make paginated results shuffle between pages (because an unstable order puts tied rows in different positions on each query), and comparators that subtract timestamps stored as `long` milliseconds produce occasional nonsense orderings that are miserable to debug. Databases face the same issue: `ORDER BY score` without a unique tie-breaker column gives no guaranteed order among ties.

## Trade-offs and alternatives

| Approach | Use when | Cost |
|---|---|---|
| `Comparable` / `compareTo` | The type has one canonical order | One order per class |
| `Comparator` | You need several orders, or cannot edit the class | Passed at each use |
| Sort indices by key | Values live in parallel arrays, or you need original positions | An `Integer[]` of indices |
| Counting sort | Keys are small integers in a known range | O(n + range), no comparisons ([[a3-counting-sort]]) |

Comparator chains are concise and hard to get wrong; hand-written lambdas are more flexible but easier to break. Comparison-based sorting cannot beat O(n log n) in general, so when keys are small integers, counting them directly can be the faster algorithm.

## Common mistakes

**Subtracting to compare.** `a - b` overflows for widely separated values. Use `Integer.compare`, `Long.compare` or `Double.compare`.

**Missing tie-breakers in sorted sets and maps.** Distinct elements that compare as 0 are silently merged. Add keys until only truly identical elements tie.

**Reversing more than you meant.** `.reversed()` at the end of a chain reverses every key. Reverse a single key by swapping arguments or with `Comparator.reverseOrder()` for that key.

**Sorting by the wrong key.** The code compiles and runs, and the greedy is wrong. State why the order makes the scan correct.

**Expecting `Arrays.sort(int[], comparator)` to exist.** It does not; use `Integer[]`, an index array, or sort ascending and reverse.

**Treating digit strings as numbers.** `"10"` sorts before `"9"`. Parse to numbers, or compare by length first.

**An inconsistent comparator.** Rules that are not transitive, such as "a before b if they differ by more than 5", produce contract-violation exceptions or wrong orders. Every comparator must define a genuine ranking.

> [!MISTAKE] A comparator that reads mutable state
> If the comparison depends on a field that changes after the element is inserted into a `TreeSet` or `PriorityQueue` — a distance you later improve, for example — the structure is now ordered by stale values. Remove the element, update it, and reinsert it, or (as Dijkstra does) insert a fresh entry.

## Interview perspective

Interviewers expect you to write a comparator lambda fluently, state the sign contract, and use `Integer.compare` without being asked. The deeper signal is explaining *why* a particular order is correct for a greedy algorithm.

> [!INTERVIEW] What a strong answer sounds like
> "I'll sort intervals by start with `Comparator.comparingInt(a -> a[0])`. With starts in order, anything that overlaps the current block must begin before the block's end, so one pass merges everything. That's O(n log n) for the sort plus O(n) for the scan."

Questions you should be able to answer:

- **Comparable versus Comparator?** `Comparable` is the single natural order built into a class; `Comparator` is an external order you can define many times for the same class.
- **Why not `return a - b`?** It can overflow and flip the sign; `Integer.compare` cannot.
- **Is Java's sort stable?** Object sorts (TimSort) are stable; primitive sorts are not, which is harmless because equal primitives are indistinguishable.
- **Must `compareTo` agree with `equals`?** It should. Sorted collections use only the comparison, so disagreement makes a `TreeSet` and a `HashSet` disagree about duplicates.
- **How do you make a max-heap?** Pass `Comparator.reverseOrder()` or a comparator with its arguments swapped.

## Practice

1. **Sort by frequency.** Sort an array so that more frequent values come first, breaking ties by smaller value first.
2. **Largest number.** Arrange non-negative integers to form the largest possible number; the comparator compares `a + b` with `b + a` as strings.
3. **Merge intervals.** Implement it from memory, then explain why sorting by end fails.
4. **Non-overlapping intervals.** Remove the fewest intervals to make the rest non-overlapping; justify sorting by end.
5. **K closest points to the origin.** Use a heap with a `long` distance key and a tie-breaker.
6. **Version comparison.** Compare version strings like `"1.10"` and `"1.2"` correctly.

## Quick revision {#quick-revision}

- `compare(a, b)`: negative = `a` first, zero = tie, positive = `b` first. Only the sign matters.
- A valid order is antisymmetric and transitive, and tied elements compare the same against everything else.
- `Comparable` (`compareTo`) = one natural order inside the class. `Comparator` (`compare`) = any number of external orders.
- Builders: `comparingInt`, `comparing`, `thenComparingInt`, `thenComparing`, `reversed`, `reverseOrder`, `naturalOrder`.
- Never `a - b`; use `Integer.compare`, `Long.compare`, `Double.compare`.
- Reverse one key by swapping arguments; `.reversed()` reverses the whole chain.
- Object sorts are stable (TimSort); a `TreeSet`/`TreeMap` treats compare 0 as the same element — add tie-breakers.
- Strings compare lexicographically by Unicode: `"10" < "9"`, `"Z" < "a"`.
- `Arrays.sort(int[])` takes no comparator; sort an `Integer[]` of indices instead.
- The sort key must match the greedy's proof: merge intervals by start, maximum non-overlapping by end.

## Key takeaways {#key-takeaways}

- Sorting, sorted collections and heaps are all built from one pairwise question, answered by `compareTo` or `compare` with a negative, zero or positive result.
- Use `Comparable` for a type's single natural order and `Comparator` for every other order; comparator chains express multi-key orders clearly.
- Compare numbers with `Integer.compare` and friends, never by subtraction, which overflows silently.
- A tie keeps both elements in a stable sort but drops one in a `TreeSet` or `TreeMap`, so give comparators tie-breakers whenever distinct elements can share a key.
- In greedy algorithms the comparator is the key design decision; be able to say why the chosen order makes the scan correct.
