---
summary: Recursion solves a problem by solving smaller copies of the same problem until one is small enough to answer directly. You will learn how to design a recursive method, what the call stack does while it runs, how to analyse its time and space, and how the same idea grows into tree traversal, backtracking and memoized dynamic programming.
difficulty: beginner
minutes: 55
objectives:
  - Design a recursive method by stating its base case, its smaller subproblem and how results combine
  - Trace the call stack for a recursive call and explain where the O(depth) space goes
  - Derive the running time of a recursive method by drawing its recursion tree
  - Implement backtracking with the choose, recurse, undo pattern and save results correctly
  - Recognise overlapping subproblems, add memoization, and convert deep recursion to iteration to avoid StackOverflowError
---

## Introduction

Some problems are naturally described in terms of themselves. The size of a family tree is one person plus the sizes of their children's family trees. The files in a folder are the files directly inside it plus the files in each subfolder. All subsets of `{1, 2, 3}` are the subsets that leave 1 out plus the subsets that put 1 in — and each of those is a question about subsets of `{2, 3}`.

**Recursion** is the programming technique that matches this kind of description: a method that solves a problem by calling itself on a smaller version of the same problem, until it reaches a version so small that the answer is immediate. Written well, recursive code is often a direct translation of the problem's definition, which makes it short and easy to check.

Recursion is one of the most important ideas in a DSA interview because so much is built on it. Tree and graph traversals ([[a6-dfs]]), backtracking searches for subsets and permutations ([[a9-subsets]]), divide-and-conquer algorithms such as merge sort ([[a3-merge-sort]]), and top-down dynamic programming ([[a11-memoization]]) are all recursion with different combine steps. This lesson builds the foundation they share: how to design a recursive method, what actually happens in memory when it runs, how to analyse its cost, and how to avoid its two classic failures — exponential time and stack overflow.

## Before you start

- **Java methods** — parameters, return values and `static` methods. See [[a1-java-syntax-competitive]].
- **Big-O notation** — enough to compare O(n), O(2ⁿ) and O(log n). See [[a1-time-complexity]].
- **`ArrayList`** — used to collect results. See [[a1-arraylist]].

## The intuition: delegate a smaller job

Imagine you are standing in a long queue and want to know your position. You cannot see the front. So you ask the person in front of you, "What is your position?", and plan to add one to their answer. They do the same, and so on, until the question reaches the person at the front, who knows the answer without asking anyone: "1". Then the answers travel back: 2, 3, 4, … until one reaches you.

Every recursive method has the same three parts that this story has:

1. A **base case** — a version of the problem small enough to answer directly (the person at the front).
2. A **recursive case** that reduces the problem to a **strictly smaller** instance of itself (ask the person in front).
3. A **combine step** that builds this answer from the smaller answer (add one).

The mental trick that makes recursion easy to write is sometimes called the **recursive leap of faith**: when writing the recursive case, assume the call on the smaller input already returns the correct answer, and only ask "given that, how do I produce my answer?". You do not trace the whole chain in your head. You check that the base case is right, that each call really gets smaller, and that the combine step is right — and the rest follows by induction.

## Designing a recursive method

Take factorial: `n! = n × (n − 1) × … × 1`, with `0! = 1`. The definition already contains a smaller factorial — `n! = n × (n − 1)!` — so the method writes itself:

```java title="Factorial.java"
public class Factorial {
    static long factorial(int n) {
        if (n == 0) return 1;              // base case: answered directly
        return n * factorial(n - 1);       // smaller problem, then combine
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));
        System.out.println(factorial(5));
        System.out.println(factorial(20));
    }
}
```

```output
1
120
2432902008176640000
```

Check the three parts. The base case `n == 0` returns 1 without another call. The recursive case calls `factorial(n - 1)`, which is strictly closer to the base case. The combine step multiplies by `n`. Trust the leap of faith: *if* `factorial(4)` returns 24, then `factorial(5)` returns 5 × 24 = 120, which is right. (The return type is `long` because 13! already exceeds `int`, and even `long` overflows after 20!.)

A useful way to write any recursive method is to answer three questions in words before coding:

| Question | Factorial | Size of a binary tree |
|---|---|---|
| What does the method return for an input? | `n!` | the number of nodes in the tree rooted at `node` |
| What is the smallest input, and its answer? | `n == 0` → 1 | `node == null` → 0 |
| How does the answer come from smaller answers? | `n * factorial(n − 1)` | `1 + size(left) + size(right)` |

If you cannot state the first answer precisely — what the method *means* — the code will drift. A method that "sort of handles the subtree" is impossible to get right; a method that "returns the number of nodes in this subtree" almost writes itself.

### What can go wrong

A missing base case, or a recursive call that does not move towards it, means the calls never stop. `factorial(-1)` with the code above calls `factorial(-2)`, `factorial(-3)`, and so on until Java runs out of stack space and throws `StackOverflowError`. Every recursive method must have an argument that *strictly decreases* (or a structure that strictly shrinks) towards a base case that is guaranteed to be reached — for factorial, that means rejecting negative input or treating `n <= 0` as the base.

## The call stack: what recursion does in memory

When any method is called, the JVM pushes a **stack frame** onto the current thread's **call stack**. The frame holds that call's parameters, its local variables, and the place to return to. When the method returns, its frame is popped and execution continues in the caller's frame. Recursion uses exactly the same mechanism; the only difference is that many frames belong to the same method, each with its *own* copy of `n`.

Here is `factorial(3)` with a trace that prints on the way down and on the way back up:

```java title="TraceFactorial.java"
public class TraceFactorial {
    static long factorial(int n, int depth) {
        String indent = "  ".repeat(depth);
        System.out.println(indent + "call factorial(" + n + ")");
        if (n == 0) {
            System.out.println(indent + "return 1");
            return 1;
        }
        long result = n * factorial(n - 1, depth + 1);
        System.out.println(indent + "return " + result);
        return result;
    }

    public static void main(String[] args) {
        factorial(3, 0);
    }
}
```

```output
call factorial(3)
  call factorial(2)
    call factorial(1)
      call factorial(0)
      return 1
    return 1
  return 2
return 6
```

| Moment | Frames on the stack (top last) | What happens |
|---|---|---|
| 1 | `f(3)` | `f(3)` needs `f(2)`, so it pauses |
| 2 | `f(3)`, `f(2)` | `f(2)` pauses for `f(1)` |
| 3 | `f(3)`, `f(2)`, `f(1)` | `f(1)` pauses for `f(0)` |
| 4 | `f(3)`, `f(2)`, `f(1)`, `f(0)` | base case: `f(0)` returns 1 and is popped |
| 5 | `f(3)`, `f(2)`, `f(1)` | `f(1)` computes 1 × 1 = 1, returns, popped |
| 6 | `f(3)`, `f(2)` | `f(2)` computes 2 × 1 = 2, returns, popped |
| 7 | `f(3)` | `f(3)` computes 3 × 2 = 6 and returns to `main` |

Two facts follow. First, the work after the recursive call — the multiplication — happens on the way *back up*, in reverse order of the calls. Second, at the deepest moment there were four frames alive at once. The number of simultaneous frames is the **recursion depth**, and the stack space a recursive method uses is O(depth), even if it never allocates an array. For factorial the depth is `n + 1`, so its space is O(n).

### Stack overflow

Each thread's stack has a fixed size, typically 512 KB to 1 MB by default on 64-bit JVMs (configurable with the `-Xss` flag). A simple frame takes on the order of tens of bytes to a hundred bytes, so a recursion depth of roughly 10⁴ to 10⁵ frames — the exact number depends on the JVM, the flags and the size of each frame — exhausts it, and the JVM throws **`StackOverflowError`**.

```java title="DeepRecursion.java"
public class DeepRecursion {
    static int depth = 0;

    static void dive() {
        depth++;
        dive();                              // no base case: never stops
    }

    public static void main(String[] args) {
        try {
            dive();
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError after more than 1000 calls: " + (depth > 1000));
        }
    }
}
```

```output
StackOverflowError after more than 1000 calls: true
```

In practice this bites in two situations. One is a bug — a missing or unreachable base case. The other is a correct algorithm whose depth is proportional to `n` on a large input: a DFS over a path-shaped graph of 10⁵ nodes, a recursive linked-list traversal, a skewed binary tree. A *balanced* tree of a million nodes is fine (depth about 20); a linked list of a million nodes is not. The fixes are covered below, in "Recursion versus iteration". The JVM's stack is explained in [[c2-stack-frames]] and [[c2-stackoverflow]].

## Recursion on trees

Trees are where recursion feels most natural, because a tree *is* a recursive structure: a node plus a left subtree and a right subtree, each of which is a tree (possibly empty). The base case is the empty tree, `null`.

```java title="TreeRecursion.java"
public class TreeRecursion {
    static class Node {
        int val;
        Node left, right;
        Node(int val, Node left, Node right) { this.val = val; this.left = left; this.right = right; }
    }

    static int size(Node root) {                 // number of nodes in this subtree
        if (root == null) return 0;
        return 1 + size(root.left) + size(root.right);
    }

    static int height(Node root) {               // nodes on the longest root-to-leaf path
        if (root == null) return 0;
        return 1 + Math.max(height(root.left), height(root.right));
    }

    static int sum(Node root) {
        if (root == null) return 0;
        return root.val + sum(root.left) + sum(root.right);
    }

    public static void main(String[] args) {
        //        4
        //      /   \
        //     2     6
        //    / \     \
        //   1   3     9
        Node root = new Node(4,
                new Node(2, new Node(1, null, null), new Node(3, null, null)),
                new Node(6, null, new Node(9, null, null)));
        System.out.println(size(root) + " " + height(root) + " " + sum(root));
    }
}
```

```output
6 3 25
```

The three methods differ only in their combine step: add one, take a maximum, add the value. The traversal — visit the left subtree completely, then the right — is the same depth-first order every time. Each node is visited once, so each method is O(n) time, and its stack depth equals the tree's height `h`, so space is O(h): O(log n) for a balanced tree and O(n) for a skewed one. Tree recursion is developed in [[a6-binary-trees]] and [[a6-height-depth]].

## Analysing recursive methods

Recursive cost is easiest to see by drawing a **recursion tree**: one box per call, with each call's children being the calls it makes. Then:

- **Time** = the total work across all boxes (the work done in each call, excluding its children, summed over the tree).
- **Space** = the longest root-to-leaf path in the tree (the maximum depth), times the space per frame, plus any data structures you allocate.

Some common shapes:

| Recursion | Calls per call | Work per call | Depth | Time | Stack space |
|---|---|---|---|---|---|
| `factorial(n − 1)` | 1 | O(1) | n | O(n) | O(n) |
| Binary search on half the range | 1 | O(1) | log n | O(log n) | O(log n) |
| Tree traversal | 2 (one per child) | O(1) | h | O(n) | O(h) |
| Merge sort | 2 halves | O(n) merge | log n | O(n log n) | O(log n) + O(n) buffer |
| Naive Fibonacci `f(n−1) + f(n−2)` | 2 | O(1) | n | O(2ⁿ) | O(n) |
| Subsets: include or exclude each item | 2 | O(1), O(n) at leaves to copy | n | O(n · 2ⁿ) | O(n) |

The naive Fibonacci row is worth a closer look, because it shows the one way recursion goes badly wrong.

## When recursion repeats itself: memoization

The Fibonacci numbers are defined by `F(0) = 0`, `F(1) = 1` and `F(n) = F(n − 1) + F(n − 2)`. Translating the definition directly gives correct but extraordinarily slow code. The recursion tree for `F(5)` shows why:

```mermaid title="Naive recursion for F(5): the same subproblems are solved again and again"
flowchart TD
    A["F(5)"] --> B["F(4)"]
    A --> C["F(3)"]
    B --> D["F(3)"]
    B --> E["F(2)"]
    C --> F["F(2)"]
    C --> G["F(1)"]
    D --> H["F(2)"]
    D --> I["F(1)"]
    E --> J["F(1)"]
    E --> K["F(0)"]
```

`F(3)` is computed twice and `F(2)` three times (the diagram stops before expanding every `F(2)`). The number of calls grows roughly like 1.618ⁿ, so `F(50)` would take tens of billions of calls. These are **overlapping subproblems**: the same input reached by different paths. The fix is **memoization** — store each result the first time it is computed, and return the stored result on every later call.

```java title="Fibonacci.java"
import java.util.Arrays;

public class Fibonacci {
    static long calls = 0;

    static long naive(int n) {
        calls++;
        if (n <= 1) return n;
        return naive(n - 1) + naive(n - 2);
    }

    static long[] memo;

    static long memoized(int n) {
        calls++;
        if (n <= 1) return n;
        if (memo[n] != -1) return memo[n];            // already solved
        return memo[n] = memoized(n - 1) + memoized(n - 2);
    }

    public static void main(String[] args) {
        calls = 0;
        System.out.println("naive F(30) = " + naive(30) + " in " + calls + " calls");

        memo = new long[91];
        Arrays.fill(memo, -1);                        // -1 = not computed yet
        calls = 0;
        System.out.println("memo  F(90) = " + memoized(90) + " in " + calls + " calls");
    }
}
```

```output
naive F(30) = 832040 in 2692537 calls
memo  F(90) = 2880067194370816120 in 179 calls
```

With memoization each `F(k)` is computed once, and every other call returns immediately, so the time drops from exponential to O(n), at the cost of O(n) memory for the table. The sentinel `-1` marks "not computed yet"; `0` would not work, because `F(0)` really is 0. This is **top-down dynamic programming**. The same recurrence can be filled **bottom-up** in a loop — `dp[i] = dp[i − 1] + dp[i − 2]` for `i` from 2 upwards — which uses no recursion at all and therefore no deep stack. Both are developed in [[a11-memoization]] and [[a11-tabulation]].

Memoization only helps when subproblems repeat. Generating subsets visits each distinct partial choice once, so there is nothing to reuse; Fibonacci, grid path counting and most "number of ways" problems repeat heavily.

## Backtracking: choose, recurse, undo

Many problems ask you to *generate* or *search* all possibilities: every subset, every permutation, every valid placement of queens. Recursion handles them by making one decision per level of the recursion tree. At each level you try each option, recurse to make the remaining decisions, and then **undo** the option before trying the next. This is **backtracking**.

For subsets of `nums`, the decision at index `i` is whether `nums[i]` is in or out:

```java title="Subsets.java"
import java.util.*;

public class Subsets {
    static void build(int[] nums, int i, List<Integer> path, List<List<Integer>> out) {
        if (i == nums.length) {                 // every element decided
            out.add(new ArrayList<>(path));     // save a COPY of the current choice
            return;
        }
        path.add(nums[i]);                      // choose: include nums[i]
        build(nums, i + 1, path, out);          // recurse on the rest
        path.remove(path.size() - 1);           // undo the choice
        build(nums, i + 1, path, out);          // the other option: exclude nums[i]
    }

    public static void main(String[] args) {
        List<List<Integer>> out = new ArrayList<>();
        build(new int[]{1, 2, 3}, 0, new ArrayList<>(), out);
        System.out.println(out);
        System.out.println(out.size() + " subsets");
    }
}
```

```output
[[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]
8 subsets
```

```mermaid title="Decision tree for subsets of [1, 2]: one level per element"
flowchart TD
    R["start: path = []"] --> A["take 1: [1]"]
    R --> B["skip 1: []"]
    A --> C["take 2: [1, 2]"]
    A --> D["skip 2: [1]"]
    B --> E["take 2: [2]"]
    B --> F["skip 2: []"]
```

One `path` list is shared by every call. That is efficient, but it creates two rules you must follow.

**Undo after the recursive call.** After exploring everything that includes `nums[i]`, `path.remove(path.size() - 1)` restores `path` to what it was before the choice, so the "exclude" branch starts clean. Forget it and every later subset still contains elements that were supposed to be skipped.

**Copy when you save.** `out.add(path)` would store a reference to the *same* list that the recursion keeps modifying, and at the end every saved entry would be the same (empty) list. `new ArrayList<>(path)` freezes a snapshot. Copying costs O(n) per saved subset, which is why subsets take O(n · 2ⁿ) in total.

Permutations follow the same rhythm with a different decision — "which unused element goes in the next position?" — tracked with a `boolean[] used`:

```java title="Permutations.java"
import java.util.*;

public class Permutations {
    static void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> out) {
        if (path.size() == nums.length) {
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;  path.add(nums[i]);            // choose
            permute(nums, used, path, out);                // recurse
            path.remove(path.size() - 1);  used[i] = false; // undo
        }
    }

    public static void main(String[] args) {
        List<List<Integer>> out = new ArrayList<>();
        permute(new int[]{1, 2, 3}, new boolean[3], new ArrayList<>(), out);
        System.out.println(out);
    }
}
```

```output
[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```

There are n! permutations, each copied in O(n), so the time is O(n · n!) and the stack depth is n. Exponential and factorial running times are inherent to "list every possibility" problems; they are acceptable only for small inputs (subsets up to about n = 20, permutations up to about n = 10). Backtracking becomes powerful when you **prune** — abandon a branch as soon as it cannot lead to a valid answer — which is the subject of [[a9-pruning]] and [[a9-permutations]].

```quiz
Q: What must every recursive method have to guarantee that it terminates?
- [ ] A loop around the recursive call
- [ ] At least two recursive calls
- [x] A base case answered without recursion, and recursive calls that always move strictly towards it
- [ ] A memoization table
> Without a reachable base case the calls never stop and the stack overflows. Each call must shrink the problem — a smaller number, a shorter range, a child node — so that the base case is eventually reached.

Q: In the subsets code, why is the result saved with `out.add(new ArrayList<>(path))` instead of `out.add(path)`?
- [ ] Copying is faster than adding a reference
- [x] `path` is one list shared and modified by every call, so a stored reference would change after it was saved
- [ ] `ArrayList` cannot contain another `ArrayList`
- [ ] Java requires a new list for each recursive level
> Backtracking reuses a single `path`, adding and removing elements as it explores. Saving the reference would make every stored answer the same list, which ends up empty. The copy freezes the subset at the moment it is complete.

Q: A recursive DFS runs on a binary tree with n nodes. What extra space does the recursion use?
- [ ] O(1), because no arrays are allocated
- [x] O(h), where h is the height: O(log n) if balanced, O(n) if skewed
- [ ] O(n²)
- [ ] O(2ⁿ)
> Frames for every call on the current root-to-node path are alive at once, so the stack holds at most h + 1 frames. A balanced tree has height about log n; a tree shaped like a linked list has height n, which is where stack overflow happens.

Q: Naive recursive Fibonacci is exponential. What change makes it O(n)?
- [ ] Making the method `static`
- [ ] Swapping the order of the two recursive calls
- [x] Storing each computed F(k) and returning the stored value on later calls
- [ ] Using `int` instead of `long`
> The recursion recomputes the same subproblems an exponential number of times. Memoization computes each of the n + 1 distinct values once, so the total work is linear.
```

## Recursion versus iteration

Any recursive algorithm can be written iteratively, and some iterative loops can be written recursively. The choice is about clarity and about stack depth.

**Linear recursion is often clearer as a loop.** Factorial, summing an array or walking a linked list have depth `n` and no branching. A loop does the same work in O(1) extra space and cannot overflow.

**Java does not eliminate tail calls.** A call is a **tail call** when it is the very last thing a method does, as in `return helper(n - 1, acc * n);`. Some languages reuse the current frame for tail calls, making such recursion as cheap as a loop. The Java Virtual Machine does not perform this optimisation (as of Java 21), so tail-recursive Java code still uses one frame per call. Write a loop instead.

**Branching recursion can use an explicit stack.** When depth might reach 10⁵ — DFS over a large graph or grid — replace the call stack with your own `ArrayDeque`, which lives on the heap and is limited only by memory:

```java title="IterativeDfs.java"
import java.util.*;

public class IterativeDfs {
    public static void main(String[] args) {
        int n = 200_000;                                   // a path 0-1-2-...-(n-1)
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i + 1 < n; i++) { adj.get(i).add(i + 1); adj.get(i + 1).add(i); }

        boolean[] seen = new boolean[n];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        seen[0] = true;
        int visited = 0;
        while (!stack.isEmpty()) {
            int u = stack.pop();
            visited++;
            for (int v : adj.get(u)) {
                if (!seen[v]) { seen[v] = true; stack.push(v); }
            }
        }
        System.out.println("visited " + visited + " nodes without recursion");
    }
}
```

```output
visited 200000 nodes without recursion
```

A recursive DFS on the same path graph would need 200,000 nested frames and would very likely overflow a default-sized stack. The explicit-stack version visits nodes in a slightly different order from recursive DFS (it marks nodes when pushed and explores the most recently pushed first), which does not matter for reachability, components or counting. Problems that rely on post-order — finishing a node after all its children, as in topological sort — need a little more bookkeeping; see [[a8-iterative-dfs]].

A third option, common in competitive programming, is to run the recursive solution in a new thread with a larger stack: `new Thread(null, () -> solve(), "main", 1 << 26).start();` requests a 64 MB stack. The JVM treats the size as a hint, so this usually works but is not guaranteed on every platform; converting to iteration is the robust fix.

## How it works internally

A stack frame stores the method's parameters and local variables, intermediate values of expressions being evaluated, and the return address. Its size is fixed when the method is compiled, so a method with many locals or large expressions uses bigger frames and overflows at a smaller depth. The just-in-time compiler may inline small methods and shrink frames, which is one reason the maximum depth varies between runs and machines — never design around an exact number.

Because frames are private to each call, every recursive call gets independent copies of its parameters and locals. State that must be *shared* across calls — the `path` list, the `memo` array, a result list — is passed as a parameter that refers to the same object, or kept in a `static` field. Primitive parameters, by contrast, are copied: incrementing `depth` inside a call does not change the caller's `depth`. That is why "undo" is needed for a shared `path` but not for an index `i` passed as `i + 1`.

## In real systems

Recursion appears wherever data is hierarchical. File-system tools walk directory trees; compilers parse nested expressions with recursive-descent parsers and then traverse the resulting syntax tree; JSON and XML libraries serialise nested objects recursively; UI frameworks render component trees; databases evaluate recursive queries (`WITH RECURSIVE`) over hierarchies such as organisation charts. Production code is cautious about depth: a deeply nested JSON document is a known way to crash a recursive parser with a stack overflow, so robust libraries cap nesting depth or use iterative algorithms. Divide-and-conquer algorithms like merge sort and quicksort sit inside standard library sort routines, typically switching to iteration or insertion sort for small inputs.

## Trade-offs and alternatives

| Approach | Strengths | Weaknesses |
|---|---|---|
| Plain recursion | Mirrors the definition; short tree and backtracking code | O(depth) stack; overflow on deep inputs; call overhead |
| Recursion + memoization | Top-down DP; computes only the states actually needed | Memory for the table; still uses the call stack |
| Bottom-up loop (tabulation) | No recursion depth; often fastest | Must find an order in which to fill states |
| Explicit stack | Handles depth limited only by memory | More code; harder to express post-order work |

Use recursion when the problem is recursive in shape — trees, nested structures, choices made one at a time — and its depth is safely bounded. Prefer loops for linear processes, and explicit stacks or bottom-up DP when the depth can reach the size of a large input.

## Common mistakes

**Missing or unreachable base case.** The recursion never ends and throws `StackOverflowError`. Check that every path through the method either returns directly or calls itself on something strictly smaller.

**Base case that is too late.** Checking `root.left == null` instead of `root == null` leads to `NullPointerException` on single-child nodes. Make the empty input the base case wherever possible.

**Forgetting to undo in backtracking.** Later branches inherit choices they should not have. Undo exactly what you did, in reverse order, after the recursive call.

**Saving a shared list instead of a copy.** Every saved answer becomes the same list. Copy at the moment of saving.

**Recomputing overlapping subproblems.** Exponential time on inputs that a memo table would make trivial. Ask whether the same arguments can be reached twice.

**Using `0` as the "not computed" marker when 0 is a valid answer.** Fill the memo with `-1`, or use a `Long[]` with `null`, or a `HashMap`.

**Deep linear recursion on large inputs.** Recursion over 10⁵ elements in a chain overflows. Use a loop or an explicit stack.

> [!MISTAKE] Tracing every call in your head
> Trying to follow the full chain of calls while writing recursive code leads to confusion and extra special cases. Define precisely what the method returns, get the base case right, and trust the smaller call. Trace only afterwards, on a tiny input, to check.

## Interview perspective

Interviewers use recursion to check structured thinking. State what the function returns, the base case and the recurrence before writing code, then give both time and stack space.

> [!INTERVIEW] What a strong answer sounds like
> "`height(node)` returns the number of nodes on the longest path down from `node`. An empty tree has height 0; otherwise it's one plus the larger child height. Each node is visited once, so it's O(n) time, and the recursion depth is the tree height — O(log n) if balanced, O(n) if skewed. If the tree could be 10⁵ deep, I'd switch to an iterative level-order traversal."

Questions you should be able to answer:

- **What are the parts of a recursive function?** A base case, a recursive case on a strictly smaller input, and a combine step.
- **What space does recursion use?** O(maximum depth) stack frames, in addition to any data structures.
- **Does Java optimise tail recursion?** No; each call uses a frame, so prefer a loop for linear recursion.
- **How do you make naive Fibonacci fast?** Memoize (top-down) or tabulate (bottom-up) to compute each value once.
- **Why copy the path in backtracking?** The path is shared and mutated; a saved reference would change later.
- **How would you avoid stack overflow?** Iteration, an explicit stack, bottom-up DP, or (in contests) a thread with a larger stack.

A common follow-up is *"Can you write it iteratively?"* — be ready to replace the call stack with an `ArrayDeque`.

## Practice

1. **Power.** Compute `xⁿ` recursively in O(log n) using `xⁿ = (x^(n/2))²`, handling odd `n`. State the recursion depth.
2. **Reverse a string recursively**, then explain why the iterative version is better in Java.
3. **Maximum depth and balanced check** of a binary tree; make the balanced check O(n) by returning heights.
4. **Climbing stairs.** Count ways to climb `n` steps taking 1 or 2 at a time; write the naive recursion, add memoization, then convert to a loop.
5. **Subsets II.** Generate subsets of an array that contains duplicates, without duplicate subsets.
6. **Generate parentheses.** List all valid strings of `n` pairs of parentheses with backtracking and pruning.

## Quick revision {#quick-revision}

- Three parts: base case (no recursion), recursive case on a strictly smaller input, combine step.
- Define what the method returns before writing it; then trust the smaller call (the leap of faith).
- Each call gets a stack frame with its own parameters and locals; space is O(max depth).
- Default stacks overflow somewhere around 10⁴–10⁵ frames; balanced trees are safe, chains are not.
- Recursion tree: time = total work over all calls, space = deepest path.
- Shapes: linear O(n); halving O(log n); tree traversal O(n) time, O(h) space; naive Fibonacci O(2ⁿ); subsets O(n · 2ⁿ); permutations O(n · n!).
- Overlapping subproblems → memoize (top-down DP) or tabulate (bottom-up). Use `-1`, not `0`, as "not computed".
- Backtracking: choose → recurse → undo; copy the path when saving it.
- Java has no tail-call elimination; use loops for linear recursion and an `ArrayDeque` for deep DFS.

## Key takeaways {#key-takeaways}

- A recursive method solves a problem by solving a strictly smaller instance of the same problem until it reaches a base case it can answer directly.
- Every pending call holds a stack frame, so recursion costs O(depth) memory and overflows when depth approaches the size of a large linear input.
- Draw the recursion tree to analyse cost: total work gives time, the deepest path gives space.
- When the same subproblems recur, memoization turns exponential recursion into polynomial dynamic programming.
- Backtracking explores choices with choose, recurse, undo, sharing one path and copying it only when a complete answer is saved.
- Use recursion where the problem's shape is recursive and its depth is bounded; otherwise prefer loops, explicit stacks or bottom-up tables.
