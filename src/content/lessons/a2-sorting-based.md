---
summary: Many array problems become easy once the data is in order — duplicates sit next to each other, the closest values become neighbours, and a greedy choice or a two-pointer scan becomes provably correct. You will learn what sorting buys you, what it costs, how to choose the sort key, and how to recognise "sort first, then scan" problems.
difficulty: beginner
minutes: 50
objectives:
  - Explain the four properties sorted order gives you and match each to a family of problems
  - Implement sort-then-scan solutions in Java and derive their O(n log n) running time
  - Sort indices or canonical keys when the answer needs original positions or grouping
  - Write correct comparators and explain why subtraction-based comparators and non-transitive rules break sorting
  - Decide when sorting is the right tool and when hashing, counting sort or a heap is better
---

## Introduction

Here is a small question: given a list of 100,000 user IDs, does any ID appear twice? Without any cleverness you compare every ID with every other ID. That is about n²/2 comparisons — five billion for 100,000 IDs — and most of that work compares values that have nothing to do with each other.

Now imagine the same list **sorted**. Two equal IDs can no longer hide at opposite ends of the list; sorting forces them into adjacent positions. One pass that compares each element with the one before it answers the question. The sort costs O(n log n) and the scan costs O(n), so the whole solution is O(n log n) — around 1.7 million basic steps instead of five billion.

That is the idea behind **sorting-based problems**: pay once to put the data in order, and the order exposes structure that a single linear pass can use. It is one of the most frequently useful moves in problem solving because it changes the question. "Is there any pair with property X?" over all n² pairs becomes "is there a *neighbouring* pair with property X?" over n − 1 pairs, or "can two pointers find it?" over a sorted range.

You will meet this pattern constantly. Merging calendar entries, finding the closest pair of prices, grouping words that are anagrams, assigning people to boats, ranking scores, and the k-sum family all start with a sort. In real systems the same move appears as `ORDER BY`, sort-merge joins in databases, and the Unix pipeline `sort | uniq`.

## Before you start

- **Array traversal** — single passes, comparing `a[i]` with `a[i - 1]`, running state. See [[a2-array-string-traversal]].
- **Big-O** — why O(n log n) beats O(n²) and how to add the cost of two phases. See [[a1-time-complexity]].
- **Comparators in Java** — `Comparator`, lambdas, `Integer.compare`. See [[a1-comparable-comparator]]; this lesson recaps the parts you need.
- **How sorting works** — helpful but not required. [[a3-merge-sort]] and [[a3-quick-sort]] explain the algorithms behind `Arrays.sort`.

## The intuition

Picture a library where returned books are piled on a table in random order. If someone asks "do we have two copies of *Dune*?", you have to dig through the whole pile, comparing each book with every other. Once the books are shelved alphabetically, both copies of *Dune* stand side by side; you can answer by walking along the shelf once. Asking "which two titles are alphabetically closest?" is just as easy: the answer is some pair of neighbours on the shelf.

The shelving step does not answer any question by itself. It is **preprocessing**: work done once that makes many later questions cheap. The skill this lesson teaches is spotting *which* order makes the question cheap — alphabetical, by price, by start time, by length — and then proving that after sorting you only need to look at neighbours, or only need to move pointers inwards.

The analogy stops working in one place. Shelving books keeps each book's identity; sorting an array of numbers throws away where each number originally was. When the answer needs original positions, you must carry them along — a technique covered below.

## What sorted order gives you

Sorting is useful for four distinct reasons. Naming them helps you recognise which one a problem needs.

| Property after sorting | What it enables | Typical problems |
|---|---|---|
| Equal values are adjacent | Detect, count or skip duplicates in one pass | Contains Duplicate, remove duplicates, skipping repeats in 3Sum |
| Values that are close are adjacent | The best pair for "smallest gap" is a neighbouring pair | Minimum Absolute Difference, closest pair of prices |
| The sequence is monotonic | Two pointers and binary search work | Two Sum II, 3Sum, counting pairs below a target |
| A processing order exists | Greedy choices can be proven safe | Boats to Save People, Assign Cookies, Merge Intervals |

The first two properties are about **adjacency**: in sorted order, the elements that matter to each other are next to each other. The third is about **monotonicity**: moving right never decreases the value, so a pointer movement has a predictable effect on a sum. The fourth is about **order of decisions**: handling the heaviest person first, or the earliest-starting meeting first, lets a greedy algorithm commit to a choice without regret.

## The cost model

Before using sorting as a tool, know exactly what it costs in Java 21.

`Arrays.sort(int[])` and the other primitive overloads use a **dual-pivot quicksort**. It runs in O(n log n) time; since JDK 14 the implementation falls back to heapsort if partitioning goes badly, so O(n log n) holds in the worst case too. It uses O(log n) stack space. It is not stable, but stability is meaningless for primitives — two equal `int`s are indistinguishable.

`Arrays.sort(T[], Comparator)` and `Collections.sort` / `List.sort` use **TimSort**, a merge-sort hybrid. It is O(n log n) in the worst case, close to O(n) on input that is already mostly sorted, and **stable**: elements that compare equal keep their original relative order. It may allocate up to about n/2 temporary references.

Two consequences follow. First, a sort-then-scan solution costs **O(n log n) + O(n) = O(n log n)**; the scan is almost never the bottleneck. Second, there is a floor: any algorithm that sorts only by comparing elements needs Ω(n log n) comparisons in the worst case. The argument is short. There are n! possible orderings of n distinct items, and each comparison has two outcomes, so k comparisons can tell apart at most 2ᵏ orderings. Distinguishing all n! needs 2ᵏ ≥ n!, that is k ≥ log₂(n!), which is about n log₂ n. If you need to beat O(n log n), sorting by comparison is the wrong tool — see the trade-offs section.

> [!NOTE] Sorting mutates
> `Arrays.sort` rearranges the array you pass in. If the caller still needs the original order, sort a copy (`nums.clone()`) and say so in an interview; it costs O(n) extra space, which you must then include in your space analysis.

## Adjacency problem 1: Contains Duplicate

**Problem.** Return `true` if any value appears at least twice in the array.

**Naive approach.** Compare every pair `(i, j)` with `i < j`: O(n²) time, O(1) space.

**Derivation.** If two positions hold equal values, then after sorting, every value between them is also equal (nothing can be strictly between `x` and `x`). So some duplicate pair is adjacent. Checking the n − 1 adjacent pairs is therefore enough.

```java title="ContainsDuplicate.java"
import java.util.Arrays;

public class ContainsDuplicate {
    static boolean containsDuplicate(int[] nums) {
        int[] a = nums.clone();          // sort a copy so the caller's array is untouched
        Arrays.sort(a);
        for (int i = 1; i < a.length; i++) {
            if (a[i] == a[i - 1]) {
                return true;             // equal values are now neighbours
            }
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{7, 3, 9, 1, 3}));
        System.out.println(containsDuplicate(new int[]{7, 3, 9, 1}));
        System.out.println(containsDuplicate(new int[]{}));
    }
}
```

```output
true
false
false
```

The first array sorts to `[1, 3, 3, 7, 9]`, and the scan stops at index 2. The loop starts at `i = 1` because index 0 has no left neighbour; for the empty array the loop does not run at all. Time is O(n log n) for the sort plus O(n) for the scan. Space is O(n) for the copy — O(log n) if you are allowed to sort in place.

A `HashSet` solves this in O(n) average time and O(n) space, so the sort is not the fastest option here. It is still worth knowing: it uses no hashing, works for any type with an ordering, and the same scan extends to "count how many distinct values" or "find the value that repeats most" with no extra memory.

## Adjacency problem 2: the closest pair

**Problem (Minimum Absolute Difference).** Return every pair `[a, b]` with `a < b` whose difference `b − a` is the smallest among all pairs, in ascending order.

**Naive approach.** Compute all n(n − 1)/2 differences: O(n²).

**Derivation.** Claim: in sorted order, the closest pair is always a pair of neighbours. Suppose the best pair is `s[i]` and `s[j]` with `j > i + 1`. Then `s[i + 1]` lies between them, so `s[i + 1] − s[i] ≤ s[j] − s[i]`. The neighbouring pair is at least as close, so we never need to look past neighbours. That one-line argument is the entire algorithm.

```java title="MinimumAbsDifference.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MinimumAbsDifference {
    static List<List<Integer>> minimumAbsDifference(int[] nums) {
        int[] a = nums.clone();
        Arrays.sort(a);
        long best = Long.MAX_VALUE;                  // long: a[i] - a[i-1] can exceed int range
        List<List<Integer>> pairs = new ArrayList<>();
        for (int i = 1; i < a.length; i++) {
            long diff = (long) a[i] - a[i - 1];
            if (diff < best) {                       // strictly better: restart the list
                best = diff;
                pairs.clear();
            }
            if (diff == best) {
                pairs.add(List.of(a[i - 1], a[i]));
            }
        }
        return pairs;
    }

    public static void main(String[] args) {
        System.out.println(minimumAbsDifference(new int[]{4, 2, 1, 3}));
        System.out.println(minimumAbsDifference(new int[]{3, 8, -10, 23, 19, -4, -14, 27}));
        System.out.println(minimumAbsDifference(new int[]{Integer.MIN_VALUE, Integer.MAX_VALUE}));
    }
}
```

```output
[[1, 2], [2, 3], [3, 4]]
[[-14, -10], [19, 23], [23, 27]]
[[-2147483648, 2147483647]]
```

Dry run on the second input. After sorting it is `[-14, -10, -4, 3, 8, 19, 23, 27]`.

| `i` | Pair | `diff` | `best` after | `pairs` after |
|---|---|---|---|---|
| 1 | (−14, −10) | 4 | 4 | `[[-14, -10]]` |
| 2 | (−10, −4) | 6 | 4 | unchanged |
| 3 | (−4, 3) | 7 | 4 | unchanged |
| 4 | (3, 8) | 5 | 4 | unchanged |
| 5 | (8, 19) | 11 | 4 | unchanged |
| 6 | (19, 23) | 4 | 4 | `[[-14, -10], [19, 23]]` |
| 7 | (23, 27) | 4 | 4 | adds `[23, 27]` |

Two details deserve attention. The output is already in ascending order because we scanned the sorted array left to right — sorting gave us the required output order for free. And the difference is computed in `long`: the third test sorts to `[MIN_VALUE, MAX_VALUE]`, whose true difference is 4,294,967,295. In `int` arithmetic that wraps to −1, which would be reported as the "smallest" gap. Sorted order guarantees differences are non-negative mathematically, not that they fit in an `int`.

## Sorting to a canonical key: Group Anagrams

Sometimes you sort not the array but **each element**, to give equal-in-some-sense items an identical representation. Two words are **anagrams** when they contain the same letters with the same counts — `"listen"` and `"silent"`. Sorting the letters of each word maps every anagram to the same string: both become `"eilnst"`. That sorted string is a **canonical key**, and a hash map from key to list groups the words.

```java title="GroupAnagrams.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class GroupAnagrams {
    static List<List<String>> groupAnagrams(String[] words) {
        // LinkedHashMap keeps groups in first-seen order so the output is predictable
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : words) {
            char[] letters = w.toCharArray();
            Arrays.sort(letters);                    // "tea" -> "aet": the canonical form
            String key = new String(letters);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }

    public static void main(String[] args) {
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(words));
    }
}
```

```output
[[eat, tea, ate], [tan, nat], [bat]]
```

For n words of length up to k, each key costs O(k log k) to build, so the total is **O(n · k log k)** time and O(n · k) space for the map. If the alphabet is small and fixed (26 lowercase letters), a 26-entry letter count is an alternative key that costs O(k) per word, giving O(n · k) — this is counting sort applied to each word, see [[a3-counting-sort]]. The general lesson is that "sort to canonicalise" turns an equivalence question ("are these the same up to rearrangement?") into an equality question that hashing can answer. Hash maps themselves are covered in [[a2-hashing]].

## When the answer needs original positions

Sorting loses each element's original index. Many problems ask about positions — "replace each element by its rank", "return the indices of the two numbers" — so you need to sort while remembering where each value came from. There are two standard ways.

The first is to **sort indices instead of values**: build an array `idx = [0, 1, …, n − 1]` and sort it with a comparator that compares `arr[i]` with `arr[j]`. After sorting, `idx[p]` is the original position of the p-th smallest value. The second is to sort an array of pairs, such as `int[][] pairs = {{value, index}, …}`, by the first component. Both need an object array, because `Arrays.sort(int[])` accepts no comparator; the index version has to use `Integer[]`, which boxes each index.

**Problem (Rank Transform of an Array).** Replace each element with its rank: the smallest value gets rank 1, equal values share a rank, and ranks have no gaps.

```java title="RankTransform.java"
import java.util.Arrays;

public class RankTransform {
    static int[] arrayRankTransform(int[] arr) {
        int n = arr.length;
        Integer[] idx = new Integer[n];              // boxed: Arrays.sort(int[]) takes no comparator
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (i, j) -> Integer.compare(arr[i], arr[j]));

        int[] rank = new int[n];
        int current = 0;
        for (int p = 0; p < n; p++) {
            // a new distinct value starts a new rank; equal values share one
            if (p == 0 || arr[idx[p]] != arr[idx[p - 1]]) current++;
            rank[idx[p]] = current;                  // write back to the ORIGINAL position
        }
        return rank;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(arrayRankTransform(new int[]{40, 10, 20, 30})));
        System.out.println(Arrays.toString(arrayRankTransform(new int[]{100, 100, 100})));
        System.out.println(Arrays.toString(
                arrayRankTransform(new int[]{37, 12, 28, 9, 100, 56, 80, 5, 12})));
    }
}
```

```output
[4, 1, 2, 3]
[1, 1, 1]
[5, 3, 4, 2, 8, 6, 7, 1, 3]
```

For `[40, 10, 20, 30]` the sorted index array is `[1, 2, 3, 0]` — the 10 lives at index 1, the 20 at index 2, and so on. Walking it in order hands out ranks 1, 2, 3, 4, and each rank is written to `rank[idx[p]]`, the element's original slot. In the third test both 12s receive rank 3 because the "new distinct value" check compares each value with the previous one in sorted order — the adjacency property again. Note `arr[idx[p]] != arr[idx[p - 1]]` compares two `int`s; if you had stored boxed `Integer` values instead, `!=` would compare references and break for values outside the small-integer cache. Time O(n log n), space O(n).

Ranking like this is also called **coordinate compression**: it maps values from a huge range (say up to 10⁹) onto 1..n while keeping their order, so they can index an array. Fenwick trees and segment trees ([[a12-fenwick]], [[a12-segment-trees]]) rely on it.

## Sort to enable two pointers

The third property, monotonicity, is what makes the **converging two-pointer** technique work: with the array sorted, moving the left pointer right can only increase a sum and moving the right pointer left can only decrease it, so each comparison eliminates one candidate for good. The full treatment, including Two Sum II and the duplicate-skipping in **3Sum**, is in [[a2-two-pointers]]. The key point for this lesson is the cost accounting: 3Sum sorts once for O(n log n) and then runs an O(n) scan for each of n starting elements, so the total is O(n²) and the sort is not the bottleneck. Paying O(n log n) to unlock a two-pointer scan is almost always worth it when the brute force is O(n²) or worse.

## Sort to enable a greedy choice

The fourth property is the subtlest. A **greedy algorithm** makes the locally best decision at each step and never revisits it. Greedy algorithms are only correct when you can argue that the local choice never hurts, and that argument usually depends on handling items in a particular order. Sorting provides the order.

**Problem (Boats to Save People).** Each boat carries at most two people and at most `limit` weight. Every person weighs at most `limit`. Return the minimum number of boats.

**Naive approach.** Try all ways of pairing people: exponential.

**Derivation.** Consider the heaviest person. They must go in some boat. If the lightest person can ride with them, pair them; if not, nobody can (everyone else is at least as heavy as the lightest), so the heaviest goes alone. Why is pairing the heaviest with the lightest safe? This is an **exchange argument**: take any optimal solution. If the heaviest person `H` shares with someone `X` and the lightest `L` is elsewhere, swap `X` and `L`. `H + L ≤ H + X ≤ limit`, so `H`'s boat is still legal, and `X ≥ L` moves into `L`'s old boat — which might now be overweight, so let us check: `L`'s old partner `Y` satisfies `Y ≤ H`, so `X + Y ≤ X + H ≤ limit`. The swap keeps every boat legal and the count unchanged. (If `H` rides alone in the optimal solution, moving `L` into `H`'s boat is legal and cannot increase the count.) So some optimal solution pairs `H` with `L` whenever possible. Sorting puts the lightest at one end and the heaviest at the other, and two pointers walk inwards.

```java title="BoatsToSavePeople.java"
import java.util.Arrays;

public class BoatsToSavePeople {
    static int numRescueBoats(int[] people, int limit) {
        int[] w = people.clone();
        Arrays.sort(w);
        int light = 0, heavy = w.length - 1, boats = 0;
        while (light <= heavy) {
            if (w[light] + w[heavy] <= limit) {
                light++;                 // the lightest person rides with the heaviest
            }
            heavy--;                     // the heaviest person always leaves on this boat
            boats++;
        }
        return boats;
    }

    public static void main(String[] args) {
        System.out.println(numRescueBoats(new int[]{3, 2, 2, 1}, 3));
        System.out.println(numRescueBoats(new int[]{3, 5, 3, 4}, 5));
        System.out.println(numRescueBoats(new int[]{1, 2}, 3));
    }
}
```

```output
3
4
1
```

Trace the first case: sorted weights `[1, 2, 2, 3]`, limit 3.

| Step | `light` | `heavy` | Check | Boat carries | `boats` |
|---|---|---|---|---|---|
| 1 | 0 (1) | 3 (3) | 1 + 3 = 4 > 3 | 3 alone | 1 |
| 2 | 0 (1) | 2 (2) | 1 + 2 = 3 ≤ 3 | 2 and 1 | 2 |
| 3 | 1 (2) | 1 (2) | 2 + 2 = 4 > 3 | 2 alone | 3 |

The loop condition is `light <= heavy`, not `<`: when both pointers meet, one person is left and still needs a boat. Each iteration moves `heavy` left, so there are at most n iterations: O(n log n) overall, dominated by the sort. Greedy proofs of this kind are studied systematically in [[a10-sorting-greedy]].

## Custom orders: Largest Number

The sort key is not always "the value". **Largest Number** asks you to arrange non-negative integers so their concatenation is as large as possible: `[3, 30, 34, 5, 9]` should give `"9534330"`. Sorting by numeric value fails (30 > 9, but 9 must come first), and sorting the strings in reverse lexicographic order also fails: `"30"` > `"3"` lexicographically, yet `"3" + "30" = "330"` beats `"30" + "3" = "303"`.

The right rule compares the two possible concatenations directly: put `a` before `b` when `a + b > b + a`. This rule is a valid total order (it can be shown to be transitive), so sorting with it is safe.

```java title="LargestNumber.java"
import java.util.Arrays;

public class LargestNumber {
    static String largestNumber(int[] nums) {
        String[] s = new String[nums.length];
        for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
        // a goes before b when the concatenation a+b is larger than b+a
        Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));
        if (s[0].equals("0")) return "0";          // every number was zero
        return String.join("", s);
    }

    public static void main(String[] args) {
        System.out.println(largestNumber(new int[]{3, 30, 34, 5, 9}));
        System.out.println(largestNumber(new int[]{10, 2}));
        System.out.println(largestNumber(new int[]{0, 0}));
    }
}
```

```output
9534330
210
0
```

The comparator returns a negative number when `b + a` is smaller than `a + b`, which tells the sort that `a` comes first. Comparing the two strings with `compareTo` is correct here because `a + b` and `b + a` always have the same length, so lexicographic order equals numeric order. The `"0"` check handles `[0, 0]`, which would otherwise produce `"00"`. Each comparison builds strings of length up to 2k for k-digit numbers, so time is O(n log n · k). Writing comparators in general is covered in [[a3-comparator-sorting]].

```quiz
Q: Why does Minimum Absolute Difference only need to compare neighbouring elements after sorting?
- [ ] Because sorting removes duplicates
- [x] Because for any non-neighbouring pair, an element between them forms a pair that is at least as close
- [ ] Because the smallest difference is always between the first two elements
- [ ] Because Java's sort compares neighbours internally
> If s[i] and s[j] are not neighbours, s[i+1] lies between them, so s[i+1] - s[i] <= s[j] - s[i]. The smallest gap can therefore always be found among the n - 1 neighbouring pairs. Sorting does not remove duplicates, and the closest pair can be anywhere in the array.

Q: In Rank Transform, why is the index array declared as `Integer[]` rather than `int[]`?
- [ ] `Integer` is faster than `int`
- [ ] `int[]` cannot hold indices
- [x] `Arrays.sort` only accepts a comparator for object arrays, and the indices must be ordered by the values they point to
- [ ] It makes the ranks start at 1
> There is no Arrays.sort(int[], Comparator) overload; primitive arrays are always sorted by natural numeric order. To sort indices by arr[i], they must be boxed into an Integer[] (or you sort an int[][] of {value, index} pairs). Boxing is slower, not faster, which is the cost of this technique.

Q: A sort-then-scan solution sorts n elements and then does one pass. What is its time complexity?
- [ ] O(n)
- [x] O(n log n)
- [ ] O(n² log n)
- [ ] O(log n)
> The phases run one after the other, so their costs add: O(n log n) + O(n) = O(n log n). It is a common misconception that the linear scan makes the whole solution linear; the comparison sort sets the floor.
```

## How it works internally: comparators and stability

When you sort objects, the sort algorithm knows nothing about your data. It calls `compare(a, b)` and trusts the answer: negative means `a` first, positive means `b` first, zero means "equal for ordering purposes". The sort is only correct if your comparator obeys the **comparator contract**: it must be consistent (`compare(a, b)` and `compare(b, a)` have opposite signs) and **transitive** (if `a` before `b` and `b` before `c`, then `a` before `c`).

The classic violation is subtraction:

```java title="BadComparator.java"
import java.util.Arrays;

public class BadComparator {
    public static void main(String[] args) {
        Integer[] a = {Integer.MIN_VALUE, 5, -3, Integer.MAX_VALUE, 0};
        Arrays.sort(a, (x, y) -> x - y);          // overflows for far-apart values
        System.out.println(Arrays.toString(a));
        Arrays.sort(a, Integer::compare);         // correct
        System.out.println(Arrays.toString(a));
    }
}
```

```output
[0, 2147483647, -3, 5, -2147483648]
[-2147483648, -3, 0, 5, 2147483647]
```

`Integer.MIN_VALUE - 5` overflows to a large positive number, so the comparator claims `MIN_VALUE` is *greater* than 5. The sort then produces an order that is neither ascending nor descending; the exact garbled result depends on which comparisons the algorithm happens to make, and it was produced here by the JDK's TimSort. No exception is thrown. Always use `Integer.compare`, `Long.compare`, or `Comparator.comparingInt`.

A comparator that is not transitive — for example one that treats values "within 5 of each other" as equal — can do something worse. TimSort sometimes detects the inconsistency and throws `IllegalArgumentException: Comparison method violates its general contract!`, but only for certain inputs, so the bug can pass tests and fail in production.

**Stability** matters when you sort records by one key and want ties to keep an earlier order. Because TimSort is stable, you can sort employees by name and then by department, and within each department they stay alphabetical. More directly, you can write one comparator with a tie-break: `Comparator.comparingInt(Employee::dept).thenComparing(Employee::name)`. For primitive arrays stability is irrelevant, which is why Java is free to use an unstable quicksort there.

## Recognising the pattern

Sorting is a candidate whenever one of these is true:

- The problem asks about **pairs, triples or groups** and the brute force examines all combinations.
- The words **closest, smallest difference, duplicate, distinct, consecutive or kth** appear, and the input order does not matter to the answer.
- The input is a set of **ranges or events** (start/end times) — sorting by start or end is almost always step one; see [[a2-intervals]].
- A **greedy** strategy suggests itself ("always handle the biggest first") and you need an order to process items in.
- The output itself must be **sorted**, so you would pay for the sort anyway.

Before reaching for a sort, ask one question: *does the answer depend on the original order of the input?* Maximum subarray, sliding-window problems and "next greater element" all depend on positions, and sorting destroys exactly the information they need. If the answer depends on order but you still want sorting, you must carry indices along, as in Rank Transform.

## In real systems

**Databases.** An `ORDER BY` without a usable index is a sort. PostgreSQL sorts in memory when the data fits in `work_mem` and switches to an external merge sort on disk when it does not. A **sort-merge join** sorts both tables on the join key and then walks them with two pointers — sorting to enable a linear scan, exactly as in this lesson. `SELECT DISTINCT` and `GROUP BY` can likewise be executed by sorting so that equal keys become adjacent.

**Command-line pipelines.** `sort access.log | uniq -c | sort -rn` counts repeated lines by first making equal lines adjacent, which is how `uniq` can work in one pass with almost no memory.

**Big data.** MapReduce and Spark sort (or hash-partition) records by key during the shuffle so that each reducer receives all values for a key together — adjacency at the scale of a cluster.

**Deduplication and diffing.** Comparing two large lists of user IDs to find which were added or removed is usually done by sorting both and merging them, because it works with data that does not fit in a hash table in memory.

## Trade-offs and alternatives

| Need | Sorting | Alternative | Choose the alternative when |
|---|---|---|---|
| Duplicate detection | O(n log n), O(1)–O(n) space | `HashSet`: O(n) average, O(n) space | Speed matters and memory is available |
| Values in a small integer range | O(n log n) | Counting sort: O(n + range) | The range is small, such as ages or letters ([[a3-counting-sort]]) |
| Only the k-th smallest | O(n log n) | Quickselect: O(n) average ([[a3-quickselect]]) | You need one order statistic, not the full order |
| Top k of a stream | Sort everything | Heap of size k: O(n log k) ([[a7-top-k]]) | k is much smaller than n, or data arrives over time |
| Order under frequent inserts | Re-sort each time | `TreeMap` / `TreeSet`: O(log n) per update ([[a1-treemap]]) | The data changes between queries |

Sorting's advantages are that it is simple, needs no hashing, often needs little extra memory, and yields order information (neighbours, ranks, ranges) that a hash set cannot. Its costs are the O(n log n) floor, the loss of original positions, and mutation of the input. It is the wrong tool when the input is already sorted (do not re-sort), when the answer depends on original order, or when data arrives one element at a time and must be answered immediately.

## Common mistakes

> [!MISTAKE] Subtraction comparators
> `(a, b) -> a - b` overflows when the values are far apart and silently produces a wrong order. Use `Integer.compare(a, b)` or `Comparator.comparingInt(...)`. The same applies to sorting `int[][]` rows: `(x, y) -> Integer.compare(x[0], y[0])`, not `x[0] - y[0]`.

**Sorting by the wrong key.** In interval problems, merging needs order by start, while choosing the most non-overlapping intervals needs order by end. Decide the key from the argument you intend to make, not by habit.

**Losing original indices.** If the problem asks for positions, sorting the values directly destroys them. Sort indices or `{value, index}` pairs.

**Forgetting duplicates after sorting.** In k-sum problems, equal neighbours produce repeated answers unless you skip them; in ranking problems, equal neighbours must share a rank.

**Overflow in the scan.** Differences and sums of sorted values can exceed `int` even when each value fits. Use `long` for the arithmetic.

**Assuming sort-then-scan is linear.** The scan is O(n), but the total is O(n log n). Say so when stating complexity.

**Comparing boxed values with `==`.** After sorting an `Integer[]` or `List<Integer>`, `list.get(i) == list.get(i - 1)` compares references and fails for values outside −128..127. Use `equals`, or unbox first.

## Interview perspective

Interviewers use sorting-based problems to see whether you can *justify* a preprocessing step, not just apply it. Saying "I'll sort" is weak; saying why sorting makes the next step correct is strong.

> [!INTERVIEW] What a strong answer sounds like
> "If I sort by value, the closest pair has to be adjacent, because any element in between would form a closer pair. So the problem reduces to one pass over neighbours. That's O(n log n) for the sort and O(n) for the scan; if the range of values were small I could use counting sort and get O(n)."

Questions you should be ready for:

- **Why is the total O(n log n) and not O(n)?** Costs of sequential phases add; the comparison sort has an Ω(n log n) lower bound.
- **Can you avoid sorting?** For duplicates, a hash set; for bounded integers, counting sort; for the k-th element, quickselect. Discuss the memory cost of each.
- **What if the input must not be modified?** Sort a copy, and count O(n) extra space.
- **What if the data arrives as a stream?** Sorting needs all data first; use a `TreeSet`, a heap, or a sliding structure.
- **Explain your comparator.** Be precise about what negative and positive mean, and about tie-breaking.

A common follow-up on greedy-after-sort problems is "prove it". Have the exchange-argument shape ready: take an optimal solution that differs from the greedy choice, swap to match the greedy choice, and show the solution stays valid and no worse.

## Practice

1. **Contains Duplicate II.** Return whether two equal values exist within distance `k` of each other. Explain why sorting the values alone fails and what you would have to carry along.
2. **H-Index.** Given citation counts, find the largest `h` such that at least `h` papers have at least `h` citations. Sort descending and scan; then improve to O(n) with counting.
3. **Assign Cookies.** Each child needs a cookie of at least their greed factor. Maximise satisfied children, and write the exchange argument.
4. **Valid Anagram.** Solve with sorting, then with a 26-entry count, and compare complexities.
5. **Sort Colors.** Sort an array of 0s, 1s and 2s in one pass without `Arrays.sort` (see the Dutch national flag in [[a2-two-pointers]]).
6. **Largest Number.** Explain why the comparator `a + b` versus `b + a` is safe to sort with, and why `[0, 0]` needs special handling.

The DSA explorer lists matching problems under this topic; start with *Contains Duplicate*, *Minimum Absolute Difference*, *Group Anagrams* and *Boats to Save People*.

## Quick revision {#quick-revision}

- Sorting is preprocessing: O(n log n) once, then usually an O(n) scan. Total O(n log n).
- Four gifts of sorted order: equal values adjacent, close values adjacent, monotonic (two pointers / binary search), and a processing order for greedy.
- Closest pair, duplicates, distinct counts → compare neighbours only.
- Canonical key: sort each element (letters of a word) so equivalent items become equal; then hash.
- Need original positions → sort `Integer[]` indices or `{value, index}` pairs.
- Greedy after sort → justify with an exchange argument.
- Java 21: primitives use dual-pivot quicksort (O(n log n), unstable, irrelevant); objects use TimSort (stable, O(n log n) worst, up to n/2 extra space).
- Comparators: `Integer.compare`, never `a - b`; must be transitive; tie-break with `thenComparing`.
- Beat O(n log n) with hashing, counting sort, quickselect or a heap when the problem allows.

| Problem | Sort by | Then | Time |
|---|---|---|---|
| Contains Duplicate | value | compare neighbours | O(n log n) |
| Minimum Absolute Difference | value | min gap among neighbours | O(n log n) |
| Group Anagrams | letters of each word | hash by sorted key | O(n · k log k) |
| Rank Transform | indices by value | assign ranks, write back | O(n log n) |
| Boats to Save People | weight | two pointers, greedy | O(n log n) |
| Largest Number | `a + b` vs `b + a` | join | O(n log n · k) |

## Key takeaways {#key-takeaways}

- Sorting changes the question: instead of checking all pairs, you check neighbours or move two pointers.
- Always name *why* the order helps — adjacency, monotonicity or a greedy processing order — and prove that looking at neighbours is enough.
- A sort-then-scan solution is O(n log n); the comparison-sort lower bound means you need hashing, counting or selection to go faster.
- Sorting destroys original positions; carry indices when the answer needs them.
- Comparators must be overflow-free and transitive, or the sort silently misbehaves.
- Do not sort when the answer depends on the input's order.
