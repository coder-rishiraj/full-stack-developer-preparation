---
summary: Time complexity describes how the number of steps an algorithm performs grows as its input grows, and space complexity does the same for the extra memory it uses. You will learn to count both from code, account for hidden library costs, and use a problem's constraints to decide which solutions can possibly pass before you write them.
difficulty: beginner
minutes: 55
objectives:
  - Count the steps of loops, nested loops, halving loops and recursive calls, and express the result as a growth class
  - Distinguish best, worst, average and amortized cost, and say which one a claim refers to
  - Include the hidden cost of library calls such as sorting, hash maps, trees and string building
  - Use an input bound such as n ≤ 10⁵ to rule out solutions before coding them
  - Calculate auxiliary space, including the recursion stack, and separate it from input and output space
---

## Introduction

Two solutions to the same problem can both be correct and still be very different programs. Give them an array of ten elements and both answer instantly. Give them an array of one hundred thousand elements and one still answers in a few milliseconds while the other runs for minutes. Nothing about the code changed; only the input grew. **Time complexity** is the tool that predicts this difference before you run anything.

The idea is to stop asking "how many seconds does this take?" — which depends on the machine, the JVM, the other programs running and the phase of the moon — and ask instead "**how does the number of basic steps grow when the input grows?**". If doubling the input doubles the steps, the algorithm is *linear*. If doubling the input multiplies the steps by four, it is *quadratic*. If adding a single element doubles the steps, it is *exponential*. That growth pattern is a property of the algorithm itself, so it holds on your laptop, on the judge's server and in production.

**Space complexity** asks the same question about memory: how much extra memory does the solution allocate as the input grows? It is taught in its own section below, because a solution that is fast enough can still fail by running out of memory or overflowing the call stack.

You need this for three practical reasons. In an interview, "what is the time and space complexity?" follows almost every solution, and the interviewer expects you to derive the answer, not guess it. On an online judge, the input limits tell you which complexities can pass, so complexity analysis is how you choose an approach before writing code. And in real systems, an accidental quadratic loop over a list that grows with your user base is one of the most common causes of a service that worked fine in testing and collapses in production.

This lesson teaches you to *count*. The formal notation — what `O`, `Ω` and `Θ` mean precisely, and why it is legitimate to drop constants — is the subject of the next lesson, [[a1-big-o]]. Here we use `O(...)` informally to mean "grows like".

## Before you start

You need only a little:

- **Basic Java** — `for` and `while` loops, arrays, methods and recursion at the level of a method calling itself. See [[a1-java-syntax-competitive]] and, for recursion, [[a1-recursion]].
- **Powers and logarithms** — that 2¹⁰ is 1,024, and that log₂ n is "how many times you can halve n before reaching 1". The lesson explains the second idea again when it is needed.

## The intuition: count steps, not seconds

Imagine you are asked to find a name in a stack of exam papers. If the stack is unsorted, you look at each paper in turn. With 30 papers that is at most 30 looks; with 300 papers, at most 300. The work grows in proportion to the stack. Now imagine you must check whether any two papers in the stack have the same score. The obvious method compares every paper with every other paper. With 30 papers that is 435 comparisons; with 300 papers it is 44,850. Ten times more papers caused roughly a hundred times more work.

Neither of these descriptions mentions seconds. They describe *how the work scales*, and that scaling is what decides whether a method is usable on large inputs. A fast computer only changes the constant — it might do each comparison ten times faster — but it cannot rescue a method whose work grows a hundredfold every time the input grows tenfold.

To make this concrete, here is a program that does no useful work at all. It only counts how many times the innermost statement of four common loop shapes executes.

```java title="LoopShapes.java"
public class LoopShapes {

    static long single(int n) {
        long steps = 0;
        for (int i = 0; i < n; i++) steps++;
        return steps;
    }

    static long nested(int n) {
        long steps = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) steps++;
        return steps;
    }

    static long triangle(int n) {
        long steps = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) steps++;   // every pair (i, j) with i < j
        return steps;
    }

    static long halving(int n) {
        long steps = 0;
        while (n > 0) {
            n /= 2;
            steps++;
        }
        return steps;
    }

    public static void main(String[] args) {
        System.out.printf("%8s %10s %14s %14s %8s%n",
                "n", "single", "nested", "triangle", "halving");
        for (int n : new int[] {10, 100, 1_000, 10_000}) {
            System.out.printf("%8d %10d %14d %14d %8d%n",
                    n, single(n), nested(n), triangle(n), halving(n));
        }
    }
}
```

```output
       n     single         nested       triangle  halving
      10         10            100             45        4
     100        100          10000           4950        7
    1000       1000        1000000         499500       10
   10000      10000      100000000       49995000       14
```

Read the table down each column. Every time `n` grows by a factor of ten, the `single` column grows by ten — **linear** growth, written O(n). The `nested` column grows by a hundred — **quadratic** growth, O(n²). The `triangle` column is always about half of `nested`, so it grows by a hundred too; it is still quadratic, only with a smaller constant. The `halving` column barely moves: it grows by three or four each time, because it counts how many times `n` can be halved, which is the **logarithm** of `n`, written O(log n).

Those four columns are the core of this lesson. Most of complexity analysis is recognising which column a piece of code belongs to.

## What a step is, and what n is

A **basic step** is any operation whose cost does not depend on the input size: an arithmetic operation, a comparison, an assignment, reading `a[i]`, calling a method that itself does constant work. We do not care whether a step takes one nanosecond or five; we care how many of them happen.

The **input size**, usually called `n`, is whatever measure of the input drives the work. For an array or string it is the length. For a tree it is the number of nodes. For a number-theory problem it might be the value of the number itself, or the number of digits — and those give very different answers, so say which one you mean.

Many problems have **more than one size**. A grid has `rows` and `cols`; a graph has `V` vertices and `E` edges; a problem comparing two strings has lengths `n` and `m`. Keep each one as its own variable. Visiting every cell of a grid is O(rows × cols), not O(n), and calling it O(n²) is only correct when the grid is square. Graph traversals are O(V + E), because a sparse graph with a million vertices and a million edges is very different from a dense one with a million vertices and a trillion edges.

## Best, worst and average case

Even for a fixed `n`, the number of steps can depend on *which* input you receive. Linear search for a target in an array of length `n` stops as soon as it finds the target:

- In the **best case** the target is the first element: one comparison.
- In the **worst case** the target is absent or last: `n` comparisons.
- In the **average case**, if the target is present and equally likely to be anywhere, about `n / 2` comparisons.

The worst case is the default in interviews and on judges, because it is a *guarantee*: no input of size `n` can make the algorithm slower. The best case is almost useless as a description — nearly every algorithm is fast on some lucky input. The average case matters when worst cases are rare and not under an adversary's control. The best-known example is a hash table: `HashMap.get` is O(1) on average, but if many keys land in the same bucket a single lookup degrades. When you claim O(1) for a hash map, say "average".

> [!TIP] Name the case
> "Quicksort is O(n log n)" and "quicksort is O(n²)" are both true statements about different cases. Say "O(n log n) on average, O(n²) in the worst case", and the ambiguity disappears.

## Counting loops

Almost all analysis reduces to four rules. Learn them as reasoning, not as slogans.

**One loop.** A loop that runs `n` times with a constant-cost body does `n` constant steps: O(n). The loop's bookkeeping — incrementing `i` and comparing it with `n` — is also a constant per iteration, so it does not change the class.

**Sequential blocks add, and the largest term wins.** Code that first runs an O(n log n) sort and then an O(n) scan costs `n log n + n` steps. For large `n` the `n log n` term is so much larger that the `n` term stops mattering, so the total is O(n log n). Sequential means *add*, and adding a smaller term does not change the class.

**Nested loops multiply.** If an outer loop runs `n` times and, on each of those iterations, an inner loop runs `m` times, the inner body runs `n × m` times. With both bounds equal to `n`, that is n². The multiplication only applies when the inner loop is *inside* the outer one; two loops one after the other are sequential and add.

**Dependent nested loops still usually multiply to the same class.** In the `triangle` loop above, the inner loop starts at `i + 1`, so it runs `n - 1` times, then `n - 2`, and so on down to zero. The total is

```text
(n - 1) + (n - 2) + ... + 1 + 0 = n(n - 1) / 2
```

which is about n²/2. Halving a quadratic is a constant factor, so this is still O(n²). This shape appears whenever you examine every *pair* of elements, and recognising it saves you from claiming that "the inner loop gets shorter, so it must be faster than quadratic".

**A loop that halves or doubles runs O(log n) times.** In `while (n > 0) n /= 2;`, the value goes `n, n/2, n/4, …, 1, 0`. The number of iterations is the number of times you can halve `n` before it reaches zero, which is ⌊log₂ n⌋ + 1 — exactly the 4, 7, 10 and 14 in the table. A loop of the form `for (int i = 1; i < n; i *= 2)` is the same shape run in the other direction. Binary search ([[a3-binary-search]]) is a halving loop over an index range.

The base of the logarithm does not matter for the class: log₂ n and log₁₀ n differ only by a constant factor (about 3.32), so both are O(log n).

> [!WARNING] The body is not always constant
> "One loop" is O(n) only if the body is O(1). A loop that calls `list.contains(x)` on an `ArrayList`, `treeMap.get(k)`, or `s.substring(...)` inside it has a non-constant body. Multiply the number of iterations by the cost of the body.

## Hidden costs in library calls

The most common wrong analysis in interviews is not a misunderstanding of loops. It is treating a single line of library code as if it were free. Every call has a cost, and you are expected to know the costs of the standard collections.

| Operation (Java 21) | Time | Note |
|---|---|---|
| `Arrays.sort(int[])` and other primitive arrays | O(n log n) | Dual-pivot quicksort; since JDK 14 it falls back to heapsort so the worst case is also O(n log n) |
| `Arrays.sort(Object[])`, `Collections.sort`, `List.sort` | O(n log n) | TimSort, which is stable (equal elements keep their original order); nearly sorted input runs close to O(n) |
| `HashMap` / `HashSet` `get`, `put`, `contains`, `remove` | O(1) average | Many colliding keys degrade a bucket; since Java 8 large buckets become trees, so the worst case is O(log n) for `Comparable` keys |
| `TreeMap` / `TreeSet` `get`, `put`, `floorKey`, `remove` | O(log n) worst case | Red-black tree, always balanced |
| `ArrayList.get(i)`, `set(i, x)` | O(1) | Backed by an array |
| `ArrayList.add(x)` at the end | O(1) amortized | Occasionally copies everything; see the amortized section |
| `ArrayList.add(0, x)`, `remove(0)`, `contains(x)` | O(n) | Shifts or scans elements |
| `LinkedList.get(i)` | O(n) | Walks from the nearer end |
| `ArrayDeque` push, pop, offer, poll at either end | O(1) amortized | The right choice for stacks and queues |
| `PriorityQueue` `offer`, `poll` | O(log n) | `peek` is O(1); `remove(Object)` and `contains` are O(n) |
| `String.substring`, `toCharArray`, `+` of two strings | O(length) | Since Java 7u6, `substring` copies its characters |
| `StringBuilder.append(c)` | O(1) amortized | Use it instead of `+=` in a loop |

Two examples show why this table matters. First, building a string with `s += c` inside a loop of `n` iterations creates a brand-new string each time and copies all characters so far: 1 + 2 + … + n copies, which is O(n²). Replacing it with a `StringBuilder` makes the same loop O(n). Second, a loop that removes from the front of an `ArrayList` — `while (!list.isEmpty()) list.remove(0);` — shifts every remaining element on every removal, which is again O(n²). An `ArrayDeque` does the same job in O(n).

Recursion has a hidden cost too: **the number of calls multiplied by the work per call**. The naive recursive Fibonacci makes two calls per call and does not share any work, so the number of calls grows exponentially — roughly 1.6ⁿ, which is still exponential and usually loosely written O(2ⁿ). Storing each result the first time it is computed ([[a11-memoization]]) means each of the `n` distinct subproblems is solved once, so the cost falls to O(n). The general rule for a memoised recursion is *number of distinct states × work per state*.

For recursive algorithms that split the input, draw the **recursion tree**. Merge sort ([[a3-merge-sort]]) splits an array of size `n` into two halves, sorts each recursively and merges them in O(n). At the top level there is one merge of size `n`; at the next level, two merges of size `n/2`, still `n` work in total; then four merges of size `n/4`, again `n` in total. There are about log₂ n levels before the pieces have size 1, and each level does `n` work, so the total is O(n log n).

```mermaid title="Merge sort: every level of the recursion tree does n work"
flowchart TD
    A["n"] --> B["n/2"]
    A --> C["n/2"]
    B --> D["n/4"]
    B --> E["n/4"]
    C --> F["n/4"]
    C --> G["n/4"]
    D --> H["... log n levels ..."]
    G --> H
```

## Amortized cost: averaging over a sequence

Some operations are usually cheap and occasionally expensive. **Amortized** cost spreads the occasional expensive step over the many cheap ones and reports the average cost *per operation over any long sequence*. It is not a probability claim like the average case: amortized O(1) is guaranteed for every sequence of operations, however unlucky.

**`ArrayList.add`** is the standard example. An `ArrayList` stores its elements in an array with spare room. When the array is full, the next `add` allocates a larger array and copies every element across — an O(n) step. In OpenJDK the new capacity is the old capacity plus half of it, so the capacity grows by 1.5× each time. The following program simulates that growth and counts every element copy.

```java title="GrowthCost.java"
public class GrowthCost {

    // Simulates the copying an ArrayList does as it grows: capacity starts at 10
    // and each resize grows it by half (newCapacity = old + old / 2).
    static long copiesFor(int n) {
        long copies = 0;
        int capacity = 10;
        for (int size = 0; size < n; size++) {
            if (size == capacity) {
                copies += size;                 // move every existing element
                capacity += capacity >> 1;
            }
        }
        return copies;
    }

    public static void main(String[] args) {
        for (int n : new int[] {1_000, 1_000_000, 100_000_000}) {
            long copies = copiesFor(n);
            System.out.printf("n=%,d copies=%,d copies per add=%.2f%n",
                    n, copies, (double) copies / n);
        }
    }
}
```

```output
n=1,000 copies=2,456 copies per add=2.46
n=1,000,000 copies=2,430,972 copies per add=2.43
n=100,000,000 copies=210,273,213 copies per add=2.10
```

The number of copies per `add` stays a small constant however large `n` becomes. The reason is a geometric series: the resizes copy roughly `n`, then `2n/3`, then `4n/9` elements and so on (reading backwards from the last resize), and that sum never exceeds `3n`. So `n` additions cost O(n) in total, and each one costs O(1) amortized. Any growth factor greater than 1 gives the same result; `HashMap`, which doubles its table, is O(1) amortized per insert for the same reason. A growth policy that added a *fixed* number of slots each time would not: it would copy 10 + 20 + 30 + … elements, which is O(n²) in total.

**The sliding window** is the other amortized pattern you meet constantly in interviews ([[a2-sliding-window]]). Its code has an outer loop that moves the right edge and an inner `while` loop that moves the left edge:

```java
int left = 0, best = 0, sum = 0;
for (int right = 0; right < a.length; right++) {
    sum += a[right];
    while (sum > limit) {        // looks nested...
        sum -= a[left];
        left++;
    }
    best = Math.max(best, right - left + 1);
}
```

It looks like a nested loop and therefore O(n²), but count differently: instead of asking how many times the inner loop runs *per outer iteration*, ask how many times it runs *in total*. Each inner iteration increments `left`, and `left` only ever moves forward from 0 to at most `n`. So across the whole run, the inner body executes at most `n` times, and the total work is O(n) + O(n) = O(n). This "each element enters once and leaves once" argument is the key to analysing two pointers ([[a2-two-pointers]]) and monotonic stacks ([[a5-monotonic-stack]]) as well.

## Constraints are a budget

On an online judge, a typical time limit is one to two seconds. A modern judge machine executing simple Java operations manages very roughly **10⁸ simple operations per second** — treat that as an order-of-magnitude estimate, not a promise. Combine it with the input bound and the problem statement tells you which complexities can possibly pass:

| Largest `n` | Steps you can afford | Complexities that usually fit | Typical technique |
|---|---|---|---|
| ≤ 10–11 | ~10⁷ | O(n!) | All permutations |
| ≤ 20–25 | ~10⁷ | O(2ⁿ), O(2ⁿ · n) | Subsets, bitmask DP |
| ≤ 500 | ~10⁸ | O(n³) | Triple loops, interval DP |
| ≤ 5,000 | ~2.5 × 10⁷ | O(n²) | Pairs, 2D DP |
| ≤ 10⁵ – 10⁶ | ~2 × 10⁷ | O(n log n), O(n) | Sorting, heaps, binary search, hashing |
| ≥ 10⁸ or a single huge value | — | O(log n), O(√n), O(1) | Math, binary search on the answer |

The table is used in reverse: read the bound first, then decide. If `n ≤ 10⁵`, an O(n²) solution performs about 10¹⁰ steps — a hundred seconds at our estimate — so do not even start writing it; look for sorting, hashing or a two-pointer idea. If `n ≤ 20`, the problem is probably *inviting* you to try all 2²⁰ ≈ one million subsets. The bound is part of the problem statement, and often the strongest hint it contains.

> [!INTERVIEW] Tie the class to the constraint
> After presenting a solution, say both halves: "This is O(n log n) because of the sort, and the scan afterwards is O(n). With n up to 10⁵ that is around two million steps, so it fits comfortably." Interviewers listen for that link.

## Worked example: Two Sum, two ways

Given an array of integers and a target, return the indices of two numbers that add up to the target. Here are the brute-force and the hash-map solutions side by side.

```java title="TwoSum.java"
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class TwoSum {

    // O(n^2) time, O(1) auxiliary space: try every pair.
    static int[] bruteForce(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) return new int[] {i, j};
            }
        }
        return new int[0];
    }

    // O(n) average time, O(n) auxiliary space: remember what we have seen.
    static int[] withMap(int[] nums, int target) {
        Map<Integer, Integer> indexOf = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = indexOf.get(target - nums[i]);   // O(1) average
            if (j != null) return new int[] {j, i};
            indexOf.put(nums[i], i);                      // O(1) amortized
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {11, 7, 2, 15, 4};
        System.out.println(Arrays.toString(bruteForce(nums, 9)));
        System.out.println(Arrays.toString(withMap(nums, 9)));
        System.out.println(Arrays.toString(withMap(nums, 100)));
    }
}
```

```output
[1, 2]
[1, 2]
[]
```

**Analysing `bruteForce`.** The outer loop runs `n` times. The inner loop starts at `i + 1`, so this is the triangle shape: in the worst case — no pair exists, as with target 100 — the comparison runs n(n − 1)/2 times. That is O(n²) time. The only extra memory is two loop variables and the small result array, so the auxiliary space is O(1).

**Analysing `withMap`.** There is a single loop of at most `n` iterations. Each iteration does one `get` and one `put`, both O(1) on average, so the time is O(n) on average. The map can end up holding all `n` values — that is exactly what happens when no pair exists — so the auxiliary space is O(n).

**Comparing them.** At `n = 10⁵`, the brute force performs about 5 × 10⁹ comparisons in the worst case, far beyond the budget; the map version performs about 10⁵ map operations. The improvement was bought with memory: we traded O(1) space for O(n) space to go from quadratic to linear time. That trade — spending memory to avoid repeated work — is the single most common optimisation in interview problems, and it is why time and space are always discussed together.

```quiz
Q: A method sorts an array of length n with `Arrays.sort`, then makes one pass over it with a constant-cost body. What is its time complexity?
- [ ] O(n), because there is only one loop
- [x] O(n log n), because the sort dominates the scan
- [ ] O(n² log n), because the loop runs after the sort
- [ ] O(log n)
> Sequential blocks add: n log n + n. For large n the sort term dominates, so the total is O(n log n). Calling it O(n) forgets that the library sort is itself the most expensive line.

Q: A loop runs `for (int i = 0; i < n; i++)` and its body calls `list.contains(x)` on an `ArrayList` of size n. What is the time?
- [ ] O(n), because there is one loop
- [ ] O(n log n), because `contains` uses binary search
- [x] O(n²), because each `contains` scans up to n elements
- [ ] O(1) average, like a `HashSet`
> `ArrayList.contains` is a linear scan; it neither hashes nor binary searches. n iterations times an O(n) body is O(n²). Switching to a `HashSet` makes each check O(1) on average and the loop O(n).

Q: In a sliding-window solution, the outer `for` moves `right` from 0 to n − 1 and an inner `while` moves `left` forward. Why is the total O(n)?
- [ ] Because `while` loops always run in constant time
- [ ] Because the inner loop is skipped most of the time
- [x] Because `left` only increases and can increase at most n times over the whole run
- [ ] Because the hash map makes it linear
> Count the inner loop's iterations in total, not per outer step. Every inner iteration moves `left` forward by one, and `left` never moves backwards, so all inner iterations together number at most n. O(n) outer plus O(n) inner is O(n).

Q: The input bound is n ≤ 2 × 10⁵. Which approach should you rule out before coding?
- [ ] Sorting followed by two pointers
- [ ] One pass with a hash map
- [x] Checking every pair of elements
- [ ] A binary search inside a loop over n
> Checking every pair is about n²/2 = 2 × 10¹⁰ steps, far beyond the roughly 10⁸ a second allows. The others are O(n log n) or O(n) and fit.
```

## Space complexity {#a1-space-complexity}

**Space complexity** measures how much *extra* memory an algorithm needs as its input grows, expressed with the same growth classes as time: O(1), O(log n), O(n), O(n²) and so on. Where time complexity counts steps, space complexity counts memory cells — array slots, objects, map entries and stack frames — that are alive at the same moment. It matters because programs have memory limits too: an online judge typically allows 256 MB, a container in production has a fixed allowance, and the call stack of a Java thread is far smaller than either. A solution can be fast enough and still fail with `OutOfMemoryError` or `StackOverflowError`.

### What counts: auxiliary, input and output space

The question "how much memory does it use?" has three different parts, and good answers keep them apart.

- **Input space** is the memory holding the input you were given. The array exists before your method runs, so it is normally *not* charged to your algorithm — unless you copy it. `toCharArray()`, `clone()`, `Arrays.copyOf` and `new ArrayList<>(list)` each create an O(n) copy, and that copy is yours.
- **Auxiliary space** is the working memory you allocate on top of the input: a hash map, a queue, a DP table, a visited array, and the recursion stack. This is what people usually mean by "the space complexity".
- **Output space** is the memory for the answer you return. If a problem asks you to return all subsets of an n-element set, there are 2ⁿ subsets with up to `n` elements each, so the output alone is O(n · 2ⁿ). That memory is real and unavoidable, and saying "O(n) space" while ignoring it would mislead.

The clearest way to report space is to name each part: "O(n) auxiliary space for the hash map, plus the output list". For an in-place algorithm such as reversing an array by swapping, you would say "O(1) auxiliary space": the only extra memory is two indices and a temporary variable, and none of them grows with `n`.

```java
// O(1) auxiliary: the input array is modified in place
static void reverse(int[] a) {
    for (int l = 0, r = a.length - 1; l < r; l++, r--) {
        int t = a[l];
        a[l] = a[r];
        a[r] = t;
    }
}
```

### The recursion stack counts

Every method call that has not yet returned keeps a **stack frame** — its parameters, local variables and return address — on the thread's call stack. A recursive method whose deepest chain of active calls is `d` deep therefore uses O(d) space, even if it never allocates a single object. This is the cost beginners most often forget, because it does not appear anywhere in the code.

Consider the height of a binary tree, computed recursively:

```java
static int height(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
}
```

At any moment, the active calls form a path from the root to the current node, so the stack holds at most `h + 1` frames, where `h` is the tree's height. For a balanced tree, `h` is about log₂ n, giving O(log n) space. For a tree that is really a linked list — every node has only a right child — `h` is `n - 1`, giving O(n) space. Say both: "O(h) stack, which is O(log n) if balanced and O(n) in the worst case".

The Java stack is small. Its size depends on the platform and the `-Xss` setting (commonly 512 KB to 1 MB per thread on 64-bit systems), and a recursion only tens of thousands of frames deep can throw `StackOverflowError`. On judges where the input can be a path of 10⁵ nodes, a recursive DFS may crash where an iterative version with an explicit `ArrayDeque` would not. The explicit stack does not use less memory in Big-O terms — it is still O(h) — but it lives on the heap, which is much larger. See [[c2-stack-vs-heap]] for how the two memory areas differ.

### What common structures cost

| What you allocate | Auxiliary space |
|---|---|
| A few primitive variables or indices | O(1) |
| `HashMap` / `HashSet` with k entries | O(k), at most O(n) |
| A frequency array over a fixed alphabet, such as `int[26]` | O(1) — its size does not grow with n |
| Adjacency lists for a graph | O(V + E) |
| A `visited` array over the vertices | O(V) |
| Recursion of depth d | O(d) |
| BFS queue on a tree or graph | O(width), up to O(n) |
| A 2D DP table of n × m | O(n · m) |
| A copy of the input (`clone`, `toCharArray`) | O(n) |

Two rows deserve comment. A frequency array of 26 counters is O(1) because its size is fixed by the alphabet, not by the input; the same array indexed by value over a range up to `n` would be O(n). And BFS ([[a6-bfs]]) stores a queue that, on a wide tree, holds an entire level at once — the bottom level of a complete binary tree contains about half the nodes — so a BFS can need O(n) space where a DFS of the same balanced tree needs only O(log n).

Big-O hides how large each cell is, but in Java that difference can be dramatic. An `int[]` stores each value in 4 bytes. A `HashMap<Integer, Integer>` stores each entry as a node object holding references to a boxed `Integer` key and a boxed `Integer` value, each of which is a separate object with its own header. On a typical 64-bit HotSpot JVM that is often more than ten times the memory of the array slot. Both are O(n), but when keys are small non-negative integers, an array indexed by key is far cheaper in memory and usually faster as well. A useful budget figure: 256 MB holds about 67 million `int` values with nothing else allocated.

Sorting also has a space cost. Java's library sorts are not guaranteed to be O(1) extra space: TimSort on object arrays may allocate a temporary buffer of up to n/2 references, and the primitive sort keeps an O(log n) recursion stack and, for input made of a few long sorted runs, merges them using a temporary buffer. If an interviewer insists on O(1) auxiliary space, say that the library sort does not strictly guarantee it, or use an in-place algorithm such as heapsort.

### Reducing space: keep only what you will read again

The commonest space optimisation in dynamic programming is to notice that a table row is only ever read by the next row. Here is "count the paths from the top-left to the bottom-right of a grid, moving only right or down", written two ways.

```java title="UniquePaths.java"
public class UniquePaths {

    // O(rows * cols) time and O(rows * cols) auxiliary space.
    static long fullTable(int rows, int cols) {
        long[][] dp = new long[rows][cols];
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (r == 0 || c == 0) dp[r][c] = 1;
                else dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
            }
        }
        return dp[rows - 1][cols - 1];
    }

    // Same time, O(cols) auxiliary space: row r only reads row r - 1.
    static long oneRow(int rows, int cols) {
        long[] dp = new long[cols];
        java.util.Arrays.fill(dp, 1);           // row 0
        for (int r = 1; r < rows; r++) {
            for (int c = 1; c < cols; c++) {
                dp[c] = dp[c] + dp[c - 1];      // old dp[c] is "above", dp[c-1] is "left"
            }
        }
        return dp[cols - 1];
    }

    public static void main(String[] args) {
        System.out.println(fullTable(3, 7) + " " + oneRow(3, 7));
        System.out.println(fullTable(10, 10) + " " + oneRow(10, 10));
    }
}
```

```output
28 28
48620 48620
```

In `fullTable`, cell `dp[r][c]` depends only on the cell above it and the cell to its left. So once row `r` is complete, rows `0` to `r - 1` will never be read again. `oneRow` exploits this with a single array: before the update, `dp[c]` still holds the value from the previous row (the cell above), and `dp[c - 1]` has already been updated for the current row (the cell to the left). Overwriting in left-to-right order therefore computes exactly the same numbers in O(cols) memory instead of O(rows × cols). The time is unchanged. The optimisation is only legal because of the dependency pattern — if a cell needed a value from two rows back, you would have to keep two rows. [[a11-tabulation]] develops this technique further.

### Space for time, and time for space

Space and time trade against each other. The hash-map Two Sum spends O(n) memory to save O(n²) − O(n) time. Memoisation spends one table entry per state to avoid recomputing it. In the other direction, an in-place algorithm saves memory at the cost of being harder to write correctly, because the input is also your scratch space and an early overwrite can destroy data you still need. When an interviewer asks "can you do it in O(1) space?", they are usually asking whether you can give up the helper structure — often by sorting first or by using two pointers — and accept a slower or more delicate solution.

> [!MISTAKE] Claiming O(1) space with a map
> "It is O(1) space because `HashMap.get` is O(1)" mixes up time per operation with memory. A map holding up to `n` entries is O(n) auxiliary space, whatever its lookup speed.

```quiz
Q: A recursive DFS visits every node of a binary tree of n nodes. What auxiliary space does it use?
- [ ] O(1), because it allocates no objects
- [x] O(h) for the call stack: O(log n) if balanced, O(n) if the tree is a chain
- [ ] O(n²), because each node has two children
- [ ] O(log n) in every case
> The active calls at any moment form a root-to-node path, so the stack holds at most h + 1 frames. A balanced tree has h ≈ log n; a degenerate chain has h = n − 1. Stack frames are memory even though no `new` appears in the code.

Q: A method returns every subset of an n-element set. How should you describe its space?
- [ ] O(n), because the input has n elements
- [ ] O(1), because output never counts
- [x] O(n) auxiliary for the recursion and current subset, plus O(n · 2ⁿ) for the output
- [ ] O(2ⁿ) auxiliary and no output
> There are 2ⁿ subsets of up to n elements each, so storing the answer dominates. The working memory — the recursion depth and the subset being built — is only O(n). Naming both parts is the precise answer.

Q: A DP table has n rows and m columns, and each row is computed only from the previous row. What is the smallest auxiliary space that still works?
- [ ] O(n · m); a table can never shrink
- [x] O(m), keeping one or two rows
- [ ] O(1), keeping a single cell
- [ ] O(n), keeping one column
> Rows older than the previous one are never read again, so they need not stay allocated. One or two arrays of length m are enough. Keeping a single cell would lose values the next row still needs.
```

## In real systems

Complexity analysis is not only an interview ritual. A few situations come up repeatedly in production code:

- **The accidental quadratic.** A loop over a request's items that calls `list.contains` or `list.remove(0)` is invisible with 50 items and catastrophic with 50,000. Code review that asks "what is this loop's body costing?" catches it.
- **N+1 queries.** Loading 1,000 orders and then running one database query per order inside the loop is O(n) round trips, each costing milliseconds. It is the database version of a loop with an expensive body, and the fix — fetching everything in one query — is the same idea as hoisting work out of a loop.
- **Unbounded memory.** Caching every result in a `HashMap` that never evicts is O(n) memory in the number of distinct requests, which grows forever. Production caches bound their size for exactly this reason.
- **Deep recursion on user data.** Recursive parsers or tree walks over user-supplied JSON or XML can overflow the stack on deeply nested input; robust libraries cap nesting depth or use explicit stacks.

## Common mistakes

**Forgetting the sort.** A solution that sorts and then scans is O(n log n), not O(n). The sort is one line, which is why it is so easy to miss.

**Treating a library call as constant.** `ArrayList.contains`, `String.substring`, `list.remove(0)` and `s += c` all hide linear work. Multiply by the loop count.

**Collapsing several sizes into one.** A grid is O(rows × cols); a graph traversal is O(V + E); comparing two strings is O(n · m). Writing O(n) hides which input drives the cost.

**Saying "O(1)" for a hash map without "average".** The guarantee is on average over well-distributed keys. It is a different and weaker claim than `TreeMap`'s O(log n) worst case.

**Calling every nested loop quadratic.** A `while` inside a `for` can be O(n) in total if its counter only moves forward. Count total iterations, not iterations per outer step.

**Ignoring the stack.** Recursion uses O(depth) space. A recursive solution on a path-shaped input of 10⁵ nodes uses O(n) stack and may overflow.

## Interview perspective

Interviewers ask for complexity after nearly every solution, and they listen for derivation rather than recall. A strong answer names the dominant operation, counts how often it runs, names the case, and connects the result to the input bound.

- **"What is the complexity of your solution?"** Give time and space separately, each with a reason: "O(n log n) time for the sort; the scan is O(n). O(1) auxiliary space apart from the sort's own stack."
- **"Can you do better?"** Use the constraint as a guide. If you have O(n²) and `n` is 10⁵, the target is O(n log n) or O(n), which usually means sorting, hashing, two pointers or a heap.
- **"Why is this sliding window linear when it has a nested loop?"** Give the amortized argument: the left pointer moves forward at most `n` times in total.
- **"What does amortized mean?"** A guarantee on the average cost per operation over any sequence — `ArrayList.add` copies occasionally, but the copies total at most a constant times `n`.
- **"What about space?"** Mention the map, the queue, the DP table and the recursion stack; separate the output if it is large.

Practise saying the analysis out loud as you finish coding; [[a14-complexity-in-interview]] covers how to present it under time pressure.

## Practice

1. For each snippet, state the time complexity and justify it in one sentence: a loop `for (int i = 1; i < n; i *= 3)`; two nested loops where the inner runs `j < i * i`; a loop over `n` calling `treeSet.add`.
2. Rewrite `String s = ""; for (char c : chars) s += c;` so it runs in O(n), and explain why the original is O(n²).
3. Given `n ≤ 18`, `n ≤ 3,000` and `n ≤ 10⁶`, name the largest complexity that comfortably fits each and one technique that achieves it.
4. Analyse the time and space of naive recursive Fibonacci and of the memoised version.
5. Write a recursive and an iterative DFS for a binary tree and state the auxiliary space of each for a balanced tree and for a chain.
6. Take the 0/1 knapsack table `dp[i][w]` from [[a11-knapsack]] and reduce it to one array; explain why the inner loop must run from high `w` to low `w`.

## Quick revision {#quick-revision}

- Time complexity counts how steps grow with input size; space complexity counts extra memory. Neither measures seconds or bytes exactly.
- Name the input sizes: `n`, `rows × cols`, `V + E`, `n · m`.
- Worst case is the default guarantee; say "average" for hash maps and "amortized" for growing arrays.
- Sequential blocks add and the largest term wins; nested loops multiply; pair loops are n(n − 1)/2 = O(n²); halving loops are O(log n).
- Library costs: sort O(n log n); `HashMap` O(1) average; `TreeMap` O(log n); `ArrayList.add` O(1) amortized, `add(0, x)` and `contains` O(n); `PriorityQueue` offer/poll O(log n); `s += c` in a loop O(n²).
- Recursion: number of calls × work per call; memoised recursion: states × work per state; merge sort: log n levels × n work = O(n log n).
- Amortized: geometric growth makes n appends cost O(n) in total; a forward-only pointer bounds a nested `while` to O(n) total.
- Budget: about 10⁸ simple steps per second. n ≤ 20 → 2ⁿ; n ≤ 5,000 → n²; n ≤ 10⁶ → n log n or n.
- Space: count auxiliary memory, not the input; report the output separately when large; recursion depth d costs O(d) stack.
- A fixed-size alphabet array is O(1); BFS queues can hold O(n); a DP that reads only the previous row can keep O(m) instead of O(n · m).

## Key takeaways {#key-takeaways}

- Complexity describes how cost grows with input, which is what decides whether a correct solution survives large inputs.
- Count by structure: find the innermost work, multiply by how often it runs, and include the true cost of every library call inside it.
- Always say which case you mean — worst, average or amortized — because they are different guarantees.
- Read the input bound before coding; it tells you which complexities can pass and often hints at the technique.
- Space complexity includes every live structure and the recursion stack; report auxiliary and output space separately.
- Most optimisations trade memory for time, so time and space should always be stated together.
