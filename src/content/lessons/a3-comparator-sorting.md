---
summary: Comparator-based sorting lets you sort anything — records, intervals, strings, indices — by rules you define, using the library's O(n log n) sort. You will learn the comparator contract and why breaking it produces wrong results, how to build multi-key orderings safely in Java, and how a well-chosen ordering turns problems such as Largest Number and meeting-room scheduling into a sort plus a scan.
difficulty: intermediate
minutes: 40
objectives:
  - State the comparator contract and explain what goes wrong when a comparator violates it
  - Write overflow-safe comparators with Integer.compare and build multi-key orderings with Comparator.comparing and thenComparing
  - Sort arrays of arrays, boxed values and index arrays, and explain why int[] has no comparator overload
  - Design a custom ordering for a problem, such as concatenation order or event tie-breaking, and justify that it is transitive
  - Use stability to combine orderings, and avoid comparator bugs in TreeSet, TreeMap and PriorityQueue
---

## Introduction

Library sorts know how to order numbers and strings. Real data is rarely that simple. You sort meetings by start time, employees by department and then salary, points by distance from a target, search results by score with ties broken by recency, and strings by rules no library has heard of. In every case the sorting *algorithm* is the same — a tested O(n log n) sort such as [[a3-merge-sort]] or a Timsort variant — and what changes is the **ordering**: the rule that decides, for any two items, which one comes first.

In Java that rule is a **comparator**: a function `compare(a, b)` that returns a negative number if `a` should come before `b`, zero if they are tied, and a positive number if `a` should come after `b`. You hand it to `Arrays.sort`, `List.sort`, `Collections.sort`, a `PriorityQueue` or a `TreeMap`, and the library does the rest.

Writing a comparator looks easy, and that is the trap. A comparator that overflows, contradicts itself, or ties things that should not tie produces sorted-looking output that is quietly wrong — or, sometimes, an exception from deep inside the sort. And in interviews, many problems reduce to "find the right ordering, then do one pass": merging intervals, scheduling, *Largest Number*, *Custom Sort String*. This lesson is about designing orderings that are correct and expressing them clearly. The Java interfaces themselves are introduced in [[a1-comparable-comparator]]; here the focus is on using them to solve problems.

## Before you start

- [[a1-comparable-comparator]] — the `Comparable` and `Comparator` interfaces and lambda syntax.
- [[a3-merge-sort]] — what **stability** means and why Java's object sort guarantees it.
- [[a1-custom-classes]] — records and classes whose fields you will sort by.
- [[a1-big-o]] — for the cost analysis.

## The intuition

Think of the sort as a tournament organiser and the comparator as the referee. The organiser decides which pairs meet; the referee only ever looks at two items and says "this one first", "that one first" or "tie". The organiser never inspects the items itself. It trusts the referee completely.

That trust is the key point. A good organiser is efficient precisely because it *infers* results it never checked: if the referee said A beats B and B beats C, the organiser concludes A beats C without asking. If the referee is inconsistent — A before B, B before C, but C before A — those inferences are wrong, and the final ranking is nonsense. The sort does not detect most of these contradictions. It just produces an order that does not mean anything.

So the job of a comparator is not only to answer each question sensibly, but to answer *all* questions **consistently**.

## The comparator contract

Java's `Comparator` documentation defines what "consistent" means. For all `x`, `y` and `z`:

1. **Antisymmetry.** `compare(x, y)` and `compare(y, x)` have opposite signs (or are both zero). If `x` comes before `y`, then `y` comes after `x`.
2. **Transitivity.** If `compare(x, y) > 0` and `compare(y, z) > 0`, then `compare(x, z) > 0`.
3. **Consistent ties.** If `compare(x, y) == 0`, then `x` and `y` compare the same way against every `z`.

Together these mean the comparator describes a genuine **total order** (allowing ties): every item has a place, and the places agree with each other. The simplest way to guarantee all three is to **compare keys**: compute some value for each item — a number, a string, a tuple of fields — and order by that value. Numbers and strings already obey the contract, so any comparator of the form "compare `key(a)` with `key(b)`" obeys it too. When a problem seems to need a cleverer rule, the work is to show that it is secretly a key comparison, as the *Largest Number* example below does.

What happens when the contract is broken? Java's object sort (Timsort) checks some of its assumptions while merging, and if it notices a contradiction it throws `IllegalArgumentException: Comparison method violates its general contract!`. It does not check everything, so often there is no exception at all — just a wrong order. Either outcome may depend on the input size and order, which makes these bugs hard to reproduce.

## Never compare by subtraction

The most common broken comparator is also the most tempting: `(a, b) -> a - b`. It returns a negative number when `a < b` — until the subtraction overflows.

```java title="SubtractionBug.java"
import java.util.Arrays;

public class SubtractionBug {
    public static void main(String[] args) {
        Integer[] a = {5, Integer.MIN_VALUE, -3, Integer.MAX_VALUE, 0};
        Integer[] b = a.clone();

        Arrays.sort(a, (x, y) -> x - y);                 // overflows for far-apart values
        Arrays.sort(b, (x, y) -> Integer.compare(x, y)); // always correct

        System.out.println(Arrays.toString(a));
        System.out.println(Arrays.toString(b));
        System.out.println(5 - Integer.MIN_VALUE);       // should be positive
    }
}
```

```output
[0, 5, 2147483647, -2147483648, -3]
[-2147483648, -3, 0, 5, 2147483647]
-2147483643
```

`5 - Integer.MIN_VALUE` is mathematically about 2.1 billion, which does not fit in an `int`, so it wraps around to a negative number. The comparator therefore claims `5` comes *before* `Integer.MIN_VALUE`, while also (correctly) claiming `MIN_VALUE` comes before `-3` and `-3` before `5`. That is a cycle, and the "sorted" result is garbage. No exception was thrown.

The fix is `Integer.compare(a, b)` (and `Long.compare`, `Double.compare`), which compares without arithmetic. With realistic small values subtraction happens to work, which is exactly why the bug survives code review and then fails on edge-case data. Use the `compare` methods every time.

Subtraction is even worse with floating-point keys: `(int) (a.price() - b.price())` truncates `0.4` to `0`, declaring items that differ by less than one to be tied. `Double.compare` also handles the special values (`NaN`, `-0.0`) consistently.

## Building multi-key orderings

Most real orderings have several keys: sort by city, then by age (oldest first), then by name to make the order fully deterministic. Since Java 8, `Comparator` has factory and combinator methods that build these without hand-written `if` chains:

```java title="People.java"
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class People {

    record Person(String name, String city, int age) {}

    public static void main(String[] args) {
        List<Person> people = new ArrayList<>(List.of(
            new Person("Priya", "Pune", 31),
            new Person("Arjun", "Delhi", 25),
            new Person("Meera", "Pune", 25),
            new Person("Kabir", "Delhi", 31),
            new Person("Asha", "Pune", 31)));

        // city A-Z, then age oldest first, then name A-Z
        Comparator<Person> order = Comparator
            .comparing(Person::city)
            .thenComparing(Person::age, Comparator.reverseOrder())
            .thenComparing(Person::name);

        people.sort(order);
        people.forEach(p -> System.out.println(p.city() + " " + p.age() + " " + p.name()));
    }
}
```

```output
Delhi 31 Kabir
Delhi 25 Arjun
Pune 31 Asha
Pune 31 Priya
Pune 25 Meera
```

Read the chain left to right as a priority list. `comparing(Person::city)` orders by city. `thenComparing` is consulted **only when the earlier keys tie**: among people in Pune, age decides, and `Comparator.reverseOrder()` makes it descending. Among Pune residents aged 31, name decides, so Asha comes before Priya. Each step is a key comparison, so the chain automatically satisfies the contract.

Useful pieces of the API:

| Method | Meaning |
|---|---|
| `Comparator.comparing(key)` | Order by a `Comparable` key such as a `String` |
| `comparingInt(key)`, `comparingLong`, `comparingDouble` | Order by a primitive key without boxing |
| `.thenComparing(key)` / `.thenComparingInt(key)` | Tie-breaker used only when earlier keys are equal |
| `.thenComparing(key, Comparator.reverseOrder())` | Tie-breaker in descending order |
| `.reversed()` | Reverse the **entire** comparator built so far |
| `Comparator.nullsFirst(c)` / `nullsLast(c)` | Allow `null` items or keys without `NullPointerException` |
| `String.CASE_INSENSITIVE_ORDER` | Ignore case when comparing strings |

`.reversed()` deserves a warning. `comparing(Person::city).thenComparing(Person::age).reversed()` reverses *both* keys — cities Z to A as well as ages. To make only one key descending, reverse that key alone, as the example does.

The hand-written equivalent of a two-key comparator is a chain of comparisons on each key in turn:

```java
(p, q) -> {
    int c = p.city().compareTo(q.city());
    if (c != 0) return c;                       // the primary key decides
    return Integer.compare(q.age(), p.age());   // swapped arguments: descending
}
```

Swapping the arguments (`compare(q, p)`) is the idiomatic way to reverse one key by hand. Negating the result (`-Integer.compare(...)`) also works, but negating a raw `compareTo` result is fragile in general: if a comparator ever returned `Integer.MIN_VALUE`, its negation would still be negative.

## Arrays, boxed values and indices

Three practical situations come up constantly in Java problem solving.

```java title="ArraysAndIndices.java"
import java.util.Arrays;
import java.util.Collections;

public class ArraysAndIndices {
    public static void main(String[] args) {
        // intervals: sort by start, then by end
        int[][] intervals = {{5, 8}, {1, 4}, {5, 6}, {2, 3}};
        Arrays.sort(intervals, (p, q) -> p[0] != q[0] ? Integer.compare(p[0], q[0])
                                                      : Integer.compare(p[1], q[1]));
        System.out.println(Arrays.deepToString(intervals));

        // descending order needs boxed values: int[] has no comparator overload
        Integer[] boxed = {3, 9, 1, 7};
        Arrays.sort(boxed, Collections.reverseOrder());
        System.out.println(Arrays.toString(boxed));

        // "argsort": indices of scores from highest to lowest, scores left untouched
        int[] scores = {70, 95, 82, 95};
        Integer[] idx = {0, 1, 2, 3};
        Arrays.sort(idx, (i, j) -> Integer.compare(scores[j], scores[i]));
        System.out.println(Arrays.toString(idx) + " " + Arrays.toString(scores));
    }
}
```

```output
[[1, 4], [2, 3], [5, 6], [5, 8]]
[9, 7, 3, 1]
[1, 3, 2, 0] [70, 95, 82, 95]
```

**Arrays of arrays.** An `int[][]` is an array of objects (each row is an `int[]`), so `Arrays.sort` accepts a comparator for it. This is the standard representation of intervals and points in interview problems.

**No comparator for `int[]`.** `Arrays.sort(int[])` exists, but there is no `Arrays.sort(int[], Comparator)`, because a `Comparator` works on objects and generics cannot take primitive types. To sort primitives in a custom order, either box them into an `Integer[]` (costing memory and speed), sort ascending and reverse the array, or sort an index array as in the third example. For descending order of plain numbers, "sort then reverse" is simplest and fastest.

**Sorting indices ("argsort").** When you need to know *where* each element was originally — to report positions, or to keep several parallel arrays in step — sort an array of indices by the values they point to. The values stay put. Notice that the two indices with score 95 come out as `1, 3`, in their original order: Java's object sort is **stable**, so ties keep their input order.

## Stability: ties keep their input order

Java documents that `Arrays.sort(Object[])`, `Arrays.sort(T[], Comparator)`, `List.sort` and `Collections.sort` are **stable**. Equal elements — those the comparator calls tied — stay in the order they had before sorting. (`Arrays.sort` on primitive arrays makes no such promise, and does not need to: equal primitives are indistinguishable.)

Stability gives you two ways to get the same multi-key result. You can sort once with a chained comparator, or you can sort several times with single-key comparators, **from the least important key to the most important**. Sorting by name, then stably by city, leaves each city's people in name order. Spreadsheet column sorting and UI tables rely on this: clicking "City" after "Name" gives city-then-name. A chained comparator is clearer and does one sort instead of several, so prefer it in code; but understanding the multi-pass version explains why stable sorts are the default for objects.

When the ordering must be fully deterministic regardless of input order — for example, when results are paginated or compared in tests — add a final tie-breaker on a unique field such as an id. Then no two distinct items are ever tied, and stability stops mattering.

## Designing a custom order: Largest Number

Given non-negative integers, arrange them to form the largest possible number. For `[3, 30, 34, 5, 9]` the answer is `9534330`.

Sorting by numeric value descending fails: it puts `34, 30, 9, 5, 3` in the wrong order entirely. Sorting the decimal strings in reverse alphabetical order is closer (`9, 5, 34, 30, 3`) but still wrong: `30` before `3` gives `...303...`, whereas `3` before `30` gives `...330...`, which is larger.

The right question to ask about any two numbers `a` and `b` is local: which arrangement of just these two is better, `a` then `b` or `b` then `a`? Compare the strings `a + b` and `b + a`. For `3` and `30`, `"330" > "303"`, so `3` goes first. Both strings have the same length, so comparing them alphabetically is the same as comparing them numerically.

```java title="LargestNumber.java"
import java.util.Arrays;

public class LargestNumber {

    static String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);

        // a goes first if the concatenation a+b is larger than b+a
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));

        if (s[0].equals("0")) return "0";   // every number was zero
        return String.join("", s);
    }

    public static void main(String[] args) {
        System.out.println(largestNumber(new int[] {3, 30, 34, 5, 9}));
        System.out.println(largestNumber(new int[] {10, 2}));
        System.out.println(largestNumber(new int[] {0, 0}));
        System.out.println(largestNumber(new int[] {121, 12}));
    }
}
```

```output
9534330
210
0
12121
```

The comparator returns `(b + a).compareTo(a + b)`: negative (so `a` first) exactly when `a + b` is the larger concatenation. The `"0"` check handles inputs like `[0, 0]`, which would otherwise produce `"00"`.

**Is this comparator transitive?** It does not look like a key comparison, so we have to check — a pairwise rule that is not transitive would make the sort meaningless. Write `|a|` for the number of digits in `a`. Placing `a` before `b` produces the number `a · 10^|b| + b`, and `b` before `a` produces `b · 10^|a| + a`. The first is larger exactly when `a · (10^|b| − 1) > b · (10^|a| − 1)`, that is, when

`a / (10^|a| − 1)  >  b / (10^|b| − 1)`.

So the rule is secretly "sort by the key `a / (10^|a| − 1)`, descending" — a comparison of real numbers, which is transitive. (For example, `3` has key `3/9 = 0.333…` and `30` has key `30/99 = 0.3030…`, so `3` comes first.) The code never computes this key, because string concatenation is exact and avoids floating point; the key only proves that the ordering is consistent. Being able to give this kind of argument — or at least to say that you checked transitivity — is what interviewers look for in custom-order problems.

## Tie-breaking changes answers: events on a timeline

Many scheduling problems turn intervals into **events** — "a meeting starts at 10", "a meeting ends at 10" — sort them by time, and sweep through them in order, keeping a running count. When two events happen at the same time, the tie-breaker is part of the problem's meaning, not a detail.

```java title="MeetingRooms.java"
import java.util.ArrayList;
import java.util.List;

public class MeetingRooms {

    /** Maximum number of meetings in progress at once. Meetings are [start, end). */
    static int maxRooms(int[][] meetings, boolean endsFirst) {
        List<int[]> events = new ArrayList<>();          // {time, +1 start / -1 end}
        for (int[] m : meetings) {
            events.add(new int[] {m[0], +1});
            events.add(new int[] {m[1], -1});
        }
        events.sort((x, y) -> {
            if (x[0] != y[0]) return Integer.compare(x[0], y[0]);
            // same time: -1 before +1 frees a room before it is needed again
            return endsFirst ? Integer.compare(x[1], y[1]) : Integer.compare(y[1], x[1]);
        });
        int inUse = 0, best = 0;
        for (int[] e : events) {
            inUse += e[1];
            best = Math.max(best, inUse);
        }
        return best;
    }

    public static void main(String[] args) {
        int[][] meetings = {{9, 10}, {10, 11}, {10, 12}};
        System.out.println("ends first:   " + maxRooms(meetings, true));
        System.out.println("starts first: " + maxRooms(meetings, false));
    }
}
```

```output
ends first:   2
starts first: 3
```

The 9–10 meeting ends exactly when two others begin. If meetings occupy the half-open interval `[start, end)`, the room is free at 10, so the end event must be processed before the start events at the same time, and the answer is 2. Processing starts first briefly counts all three meetings as in progress and answers 3. Neither comparator is buggy; they encode different definitions of overlap. Decide which one the problem means, and make the tie-breaker say so. The broader family of interval problems is covered in [[a2-intervals]] and [[a10-interval-scheduling]].

## Comparators in sorted collections

`TreeSet`, `TreeMap` and `PriorityQueue` take comparators too, and in the tree-based collections the comparator does more than order elements: **it decides which elements are duplicates**. A `TreeSet` treats two elements as the same if `compare` returns 0, even if `equals` says they differ.

```java title="TreeSetDrop.java"
import java.util.Comparator;
import java.util.List;
import java.util.TreeSet;

public class TreeSetDrop {
    public static void main(String[] args) {
        List<String> words = List.of("pear", "fig", "plum", "kiwi", "apple");

        TreeSet<String> byLength = new TreeSet<>(Comparator.comparingInt(String::length));
        byLength.addAll(words);
        System.out.println(byLength);       // equal length means "duplicate" to a TreeSet

        TreeSet<String> fixed = new TreeSet<>(
            Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        fixed.addAll(words);
        System.out.println(fixed);
    }
}
```

```output
[fig, pear, apple]
[fig, kiwi, pear, plum, apple]
```

The first set silently discarded `plum` and `kiwi`, because they have the same length as `pear`, which arrived first. Adding a tie-breaker that distinguishes every distinct element fixes it. The documentation describes this as a comparator being **consistent with equals**: `compare(a, b) == 0` exactly when `a.equals(b)`. Sorting a list does not require it, but `TreeSet` and `TreeMap` behave as sets and maps correctly only when it holds. A `PriorityQueue` keeps duplicates, so ties there only affect which equal-priority element comes out first — which is unspecified. See [[a1-treeset]], [[a1-treemap]] and [[a1-priorityqueue]].

## Cost of sorting with a comparator

A comparison sort makes O(n log n) comparisons, so the total cost is **O(n log n × cost of one comparison)**. For integer keys that cost is constant. For strings it is up to the length of the shorter string; for *Largest Number* each comparison builds two concatenated strings of length up to `2L`, so the sort is O(n log n · L) time and allocates garbage on every comparison.

When computing a key is expensive — parsing a date from a string, computing a distance, looking something up — a comparator like `comparing(item -> expensiveKey(item))` recomputes it on every comparison, about `2 n log₂ n` times. The fix is to **compute each key once**: store the keys in an array (or in a record alongside the item), then sort indices or pairs by the precomputed keys. This technique is old enough to have a name, the decorate–sort–undecorate pattern (also called the Schwartzian transform).

Memory: Timsort may allocate a temporary buffer of up to `n / 2` references, so object sorts use O(n) extra space in the worst case.

## In real systems

**SQL `ORDER BY`.** `ORDER BY department, salary DESC, id` is a chained comparator evaluated by the database. A frequent production bug is paginating with `ORDER BY created_at LIMIT 20 OFFSET 40` when many rows share a timestamp: the database is free to order ties differently on each query, so rows can repeat or vanish between pages. Adding a unique tie-breaker (`ORDER BY created_at, id`) makes the order deterministic — the same lesson as the final tie-breaker above.

**Locale-aware text.** `String.compareTo` compares UTF-16 code units, so `"Zebra"` sorts before `"apple"` and accented letters land in odd places. User-facing lists use `java.text.Collator` (or ICU), which implements language-specific rules — a comparator for human expectations rather than code points.

**Priority scheduling.** Job schedulers, rate limiters and network routers keep work in priority queues ordered by comparators such as "priority descending, then arrival time ascending". The second key prevents starvation among equal-priority jobs and makes behaviour predictable.

**Deterministic output.** Build tools and code generators sort file lists, map keys and dependency names before writing output, so that identical inputs produce byte-identical results. That requires total, fully tie-broken comparators.

## Trade-offs and alternatives

| Approach | Time | When to use |
|---|---|---|
| Library sort with a comparator | O(n log n × compare cost) | Default for ordering objects by any rule |
| Sort indices by key | Same, plus O(n) for the index array | Need original positions or parallel arrays |
| Precompute keys, then sort | Key cost paid n times instead of n log n | Keys are expensive to compute |
| Counting or bucket sort | O(n + k) | Keys are small integers in a known range ([[a3-counting-sort]]) |
| Topological sort | O(V + E) | Order is given as pairwise constraints, not as a total order |

The last row matters. In *Alien Dictionary*, you learn some pairs ("`t` comes before `f`") but not a full ranking, and some pairs are unrelated. That is not a total order, so no comparator can express it; it is a dependency graph, and topological sorting is the right tool.

## Common mistakes

> [!MISTAKE] Comparing by subtraction
> `(a, b) -> a - b` overflows when the values are far apart, creating cycles that make the sort return a wrong order without any error. Use `Integer.compare`, `Long.compare` or `Double.compare`, or the `Comparator.comparingInt` family.

**Wrong direction.** Returning `compare(b, a)` when you meant ascending, or reversing an entire chain with `.reversed()` when only one key should be descending. Test with a two-element example and check which comes first.

**Missing tie-breakers.** A comparator that ties distinct items gives an order that depends on input order, breaks pagination and deterministic output, and makes `TreeSet` and `TreeMap` drop elements.

**Non-transitive custom rules.** "Close enough counts as equal" comparators (such as treating numbers within 0.01 as tied) are not transitive: 0.000 ties 0.008, 0.008 ties 0.016, but 0.000 does not tie 0.016. Round to a key first instead.

**Mutating keys after insertion.** Changing a field that a `TreeSet`, `TreeMap` or `PriorityQueue` orders by, while the object is inside the collection, corrupts its structure. Remove the item, change it, and reinsert it.

**Expecting a comparator for `int[]`.** It does not exist. Box, sort and reverse, or sort indices.

## Interview perspective

Interviewers use custom ordering problems to see whether you can find the key that makes a problem easy, and whether you write comparators that are safe.

> [!INTERVIEW] Narrating a comparator
> "I'll sort intervals by start time with `Integer.compare`, not subtraction, so large values can't overflow. For equal starts I'll put the shorter one first, though for merging it doesn't matter. Then one pass merges overlapping neighbours, so the whole thing is O(n log n) for the sort plus O(n)."

Questions to prepare:

- **Largest Number.** Concatenation order, the all-zeros case, and a one-line argument for transitivity.
- **Merge Intervals / Non-overlapping Intervals / Meeting Rooms II.** Sort by start (merging) or by end (greedy selection); state the tie-break for events at the same time.
- **Custom Sort String / Relative Sort Array.** Build a rank map (`char → position` in the given order) and sort by rank; elements not in the order go last. For small alphabets, counting is O(n) and avoids sorting altogether.
- **K Closest Points to Origin.** Compare squared distances with `Long.compare` or `Integer.compare`; avoid `Math.sqrt` and floating point.
- **Sort Characters By Frequency / Top K Frequent Words.** Order by frequency descending, then alphabetically — a two-key comparator, often inside a `PriorityQueue`.
- **What is the comparator contract, and what happens if you break it?** Antisymmetry, transitivity, consistent ties; the result is a wrong order or an `IllegalArgumentException`.

## Practice

1. **Largest Number.** Implement it, then write a brute-force checker that tries every permutation for small inputs and compare results.
2. **Meeting Rooms II** with an event sweep, choosing the tie-breaker for half-open intervals; then solve it again with a min-heap of end times.
3. **Custom Sort String.** Given an order string and a target string, sort the target's characters by the order, first with a comparator and then with counting.
4. **Reorder Data in Log Files.** Letter-logs before digit-logs, letter-logs by content then identifier, digit-logs in original order — and explain how stability handles the last rule.
5. **Find the bug.** Write a comparator that ties doubles within 0.01, and construct three values that break transitivity.

The DSA explorer lists the matching problems under this topic; start with *Largest Number*, *Merge Intervals* and *Custom Sort String*.

```quiz
Q: Why is `(a, b) -> a - b` an unsafe comparator for `Integer` values?
- [ ] It sorts in descending order
- [ ] It is slower than `Integer.compare`
- [x] The subtraction can overflow, giving the wrong sign and making the ordering inconsistent
- [ ] Comparators must return only -1, 0 or 1
> For values far apart, such as 5 and Integer.MIN_VALUE, a - b exceeds the int range and wraps to a negative number, so the comparator claims the wrong order. That creates cycles, and the sort returns garbage without an error. Comparators may return any negative or positive number; only the sign matters.

Q: Which comparator puts people in ascending order of city and, within a city, descending order of age?
- [ ] `comparing(Person::city).thenComparing(Person::age).reversed()`
- [x] `comparing(Person::city).thenComparing(Person::age, Comparator.reverseOrder())`
- [ ] `comparing(Person::age).reversed().thenComparing(Person::city)`
- [ ] `comparing(Person::city).reversed().thenComparing(Person::age)`
> reversed() applies to the whole comparator built so far, so the first option reverses the city order too. The third makes age the primary key. Passing reverseOrder() as the key comparator of thenComparing reverses only the age tie-breaker.

Q: A `TreeSet<String>` is created with `Comparator.comparingInt(String::length)`, and "pear", "plum" and "kiwi" are added. How many elements does it contain?
- [ ] 3
- [x] 1
- [ ] 0
- [ ] It throws an exception
> A TreeSet treats elements as duplicates when the comparator returns 0. All three strings have length 4, so only the first one added is kept. Adding a tie-breaker such as thenComparing(Comparator.naturalOrder()) makes the comparator consistent with equals.

Q: In the event sweep for meeting rooms with half-open intervals `[start, end)`, why must an end event at time 10 be processed before a start event at time 10?
- [x] A meeting ending at 10 has freed its room by 10, so counting the new meeting first would overstate how many rooms are in use at once
- [ ] Because end events have smaller values in the event array
- [ ] Because Java sorts negative numbers first
- [ ] It does not matter; both orders give the same answer
> With half-open intervals, a meeting ending at 10 and one starting at 10 do not overlap. Processing the start first momentarily counts both, which can raise the maximum by one, as the example shows (3 instead of 2). The tie-breaker encodes the problem's definition of overlap.
```

## Quick revision {#quick-revision}

- A comparator returns negative (`a` first), zero (tie) or positive (`b` first); only the sign matters.
- Contract: antisymmetric, transitive, consistent ties. Safest design: compare keys.
- Never `a - b`; use `Integer.compare`, `Long.compare`, `Double.compare`, `comparingInt`.
- Chains: `comparing(k1).thenComparing(k2, reverseOrder()).thenComparing(k3)`; `.reversed()` flips the whole chain.
- Reverse one key by hand by swapping arguments: `Integer.compare(q.x, p.x)`.
- `int[][]` and `Integer[]` accept comparators; `int[]` does not — sort then reverse, or sort indices.
- Object sorts in Java are stable (Timsort): ties keep input order; add a unique final key for full determinism.
- Largest Number: sort by `(b + a).compareTo(a + b)`; return `"0"` if the first is `"0"`; transitive because it equals sorting by `a / (10^|a| − 1)`.
- Event sweeps: the same-time tie-break encodes the meaning of overlap (ends before starts for `[start, end)`).
- `TreeSet`/`TreeMap` treat `compare == 0` as duplicate — keep comparators consistent with equals.
- Cost O(n log n × compare cost); precompute expensive keys.
- Partial orders (Alien Dictionary) need topological sort, not a comparator.

## Key takeaways {#key-takeaways}

- The sorting algorithm is fixed; your job is to define a correct, consistent ordering.
- A comparator must describe a total order. Comparing keys guarantees that; any cleverer rule needs a transitivity argument.
- Subtraction comparators overflow and fail silently — always use the `compare` methods.
- Multi-key orderings read as a priority list, and Java's stable object sort keeps ties in input order.
- Tie-breakers carry meaning: they decide event order in sweeps, page boundaries in databases, and which elements a `TreeSet` keeps.
- Many problems become "sort by the right key, then scan once", so finding the key is often the whole solution.
