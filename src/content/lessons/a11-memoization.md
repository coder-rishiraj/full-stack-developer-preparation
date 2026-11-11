---
summary: Dynamic programming makes slow recursive searches fast by solving each distinct subproblem once. You will learn to spot repeated work, derive a DP from a problem through five decisions — state, recurrence, base cases, order of computation and answer — and implement it either top-down with memoization or bottom-up with tabulation, knowing when each is the better choice.
difficulty: intermediate
minutes: 60
objectives:
  - Explain overlapping subproblems and optimal substructure, and test a recursion for both
  - Derive a DP from a problem by fixing the state, recurrence, base cases, order of computation and answer
  - Implement memoization with an array or a map, choosing a complete key and a safe "not computed" sentinel
  - Convert a memoized recursion into a bottom-up table and reduce its memory with rolling variables
  - Compare memoization and tabulation on stack depth, reachable states and space, and choose between them
  - Verify a DP solution against a brute force on random inputs
---

## Introduction

Here is a small puzzle. You start with a positive integer `n` and want to reach 1. In one step you may subtract 1, divide by 2 if the number is even, or divide by 3 if it is divisible by 3. What is the fewest number of steps?

For `n = 10`, a sensible-looking rule — "always make the biggest cut available" — goes 10 → 5 → 4 → 2 → 1, four steps. But 10 → 9 → 3 → 1 takes three. Subtracting first, which looks like the weakest move, sets up two divisions by 3. So you cannot decide each step by looking only at the current number; you have to compare the consequences of every choice. A recursive function can do that by trying all moves and keeping the best, and it gets the right answer. The trouble is speed: for `n = 400` that recursion makes over fifty million calls.

The reason is not that the problem is large. There are only 400 different numbers it could ever be asked about. The recursion is slow because it asks about the *same* numbers again and again along different paths. **Dynamic programming (DP)** is the technique of solving each distinct subproblem once, storing the answer, and reusing it. Applied to this puzzle, it answers `n = 400` in 733 calls.

There are two ways to organise that reuse. **Memoization** keeps the recursive function and adds a cache: before computing a subproblem, look it up; after computing it, store it. **Tabulation** drops the recursion and fills a table of answers in a loop, smallest subproblems first. Both rest on the same thinking — deciding what a subproblem is and how it relates to smaller ones — and that thinking is what this lesson teaches. Every later DP lesson, from [[a11-1d-dp]] to [[a11-knapsack]] and [[a11-lis]], applies it.

DP is one of the most important topics in coding interviews because it separates candidates who remember solutions from candidates who can derive them. It is also everywhere in real software: text diff tools, spell checkers, DNA sequence alignment, speech recognition and database query planners all run dynamic programmes.

## Before you start

- **Recursion** — base cases, the call stack and recursion trees. See [[a1-recursion]]; its memoized Fibonacci example is the starting point here.
- **Time complexity** — counting operations and reading Big-O. See [[a1-time-complexity]].
- **HashMap** — storing and looking up values by key, and why keys need correct `equals` and `hashCode`. See [[a1-hashmap]].
- **Choice recursions** — recursion that tries each option at each step, as in [[a9-subsets]]. A DP usually starts life as one of these.

## The intuition: a notebook of solved subproblems

Imagine a researcher who must answer a big question that breaks into smaller questions, which break into smaller ones still. Without notes, every time a small question comes up again she works it out from scratch, even though she solved it an hour ago. With a notebook, she writes down each answer the first time she finds it and checks the notebook before starting any question. The total work becomes "one unit per distinct question" rather than "one unit per time a question is asked".

Memoization is that notebook. Tabulation is the same notebook filled in a planned order: she lists every small question up front and answers them from the smallest up, so that whenever a bigger question needs a smaller answer, it is already written down.

The analogy has one important limit. A notebook entry is only reusable if **the same question always has the same answer**. If the answer to "how many steps from 6?" depended on how you got to 6 — say, on a running total that is not part of the question — then writing down "6 → 2" would be wrong. Making sure the question captures everything its answer depends on is the central skill of DP, and it is the first of the five decisions below.

## Seeing the repeated work

The Fibonacci numbers show the problem in its purest form: `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n − 1) + F(n − 2)`. The direct recursion calls itself twice per call. This program counts how many times each value is computed while evaluating `F(30)`:

```java title="FibRepeats.java"
public class FibRepeats {
    static long[] timesAsked = new long[31];

    static long fib(int n) {
        timesAsked[n]++;                                   // how often is fib(n) requested?
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("fib(30) = " + fib(30));
        for (int k : new int[] {30, 29, 25, 20, 10, 2, 1})
            System.out.println("fib(" + k + ") computed " + timesAsked[k] + " times");
    }
}
```

```output
fib(30) = 832040
fib(30) computed 1 times
fib(29) computed 1 times
fib(25) computed 8 times
fib(20) computed 89 times
fib(10) computed 10946 times
fib(2) computed 514229 times
fib(1) computed 832040 times
```

There are only 31 different questions — `F(0)` to `F(30)` — but `F(2)` alone is recomputed over half a million times. The counts are themselves Fibonacci numbers, which is why the total grows like φⁿ with φ ≈ 1.618: each step up in `n` multiplies the work by about 1.6. The recursion tree for `F(5)` already shows the duplication:

```mermaid title="Naive recursion for F(5): the subtree for F(3) is built twice"
flowchart TD
    A["F(5)"] --> B["F(4)"]
    A --> C["F(3)"]
    B --> D["F(3)"]
    B --> E["F(2)"]
    D --> F["F(2)"]
    D --> G["F(1)"]
    C --> H["F(2)"]
    C --> I["F(1)"]
    E --> J["F(1)"]
    E --> K["F(0)"]
```

Caching each `F(k)` the first time it is computed collapses this tree: the second request for `F(3)` returns immediately. [[a1-recursion]] measures the result — 179 calls for `F(90)`.

## When dynamic programming applies

Caching helps a recursion when two properties hold.

**Overlapping subproblems.** The recursion must ask the same question more than once. Fibonacci does. Merge sort does not: it splits an array into halves, and each half is a different piece of data, so no subproblem ever repeats and a cache would only cost memory. Generating all subsets does not either — each partial choice is visited once — which is why listing every subset stays exponential no matter what you cache. A quick test: draw two or three levels of the recursion tree and look for a repeated argument list.

**Optimal substructure.** The best answer to the whole problem must be built from best answers to subproblems. In the steps-to-1 puzzle, if the best route from 10 starts with 10 → 9, the rest of it must be a best route from 9; if it were not, you could swap in a better route from 9 and improve the whole. Most counting and optimisation problems over sequences, grids and capacities have this property. A classic problem that does not is the **longest simple path** in a general graph: the longest path from A to C through B is not necessarily the longest path from A to B followed by the longest path from B to C, because the two pieces might reuse a vertex. The subproblem "longest path from B to C" would have to know which vertices were already used, so it is no longer a small, self-contained question.

A third requirement is implicit in the first two: the function must be **pure** in its state. Its result must depend only on its arguments, not on a global counter, a list being built on the side, or the order of earlier calls. A backtracking function that appends to a shared `path` list is not cacheable as written; one that returns a number computed from its arguments is.

## Deriving a DP: the five decisions

A DP solution is fully specified by five decisions. Writing them down in words *before* writing code is what turns DP from template-matching into a method you can apply to problems you have never seen.

1. **State.** What does a subproblem look like? Write a sentence of the form "`dp[...]` is the [best value / number of ways / whether it is possible] for [this exact piece of the problem]". The arguments are whatever the remaining decisions depend on, and nothing else.
2. **Recurrence.** How does a state's answer follow from smaller states? Look at **one decision** — usually the first or the last choice — and, for each option, combine the option's cost with the answer to the smaller state it leaves.
3. **Base cases.** Which states can be answered without the recurrence? These are where the recursion stops, such as an empty prefix, a zero capacity, or the target itself.
4. **Order of computation.** In what order can states be computed so that every state's dependencies are ready? Memoization discovers this order automatically; tabulation needs you to choose it.
5. **Answer.** Which state, or which combination of states, is the answer to the original problem?

Then the complexity follows from a formula: **time = number of states × work per state**, and **space = number of states** (plus recursion depth for memoization).

The best source of the five decisions is a brute-force recursion. Write the recursion that tries every choice, look at which arguments change between calls — those are the state — and the recursion's body is already the recurrence. Here is the procedure applied to the puzzle from the introduction.

### Step 1: brute force over the choices

From `n`, there are up to three moves. Try each and keep the best:

```java
static int brute(int n) {
    if (n == 1) return 0;                                  // already there
    int best = 1 + brute(n - 1);
    if (n % 2 == 0) best = Math.min(best, 1 + brute(n / 2));
    if (n % 3 == 0) best = Math.min(best, 1 + brute(n / 3));
    return best;
}
```

This is correct, because it compares every route. It is slow because `brute(5)` is reached from 10 by halving and from 6 by subtracting, and `brute(3)` from 9, 6 and 4, and so on — every repeated call re-explores the whole subtree below it.

### Step 2: name the state

The only argument that changes is `n`, and nothing else influences the answer — how you reached `n` does not change how many steps remain. So:

> `dp[k]` = the fewest steps needed to turn `k` into 1.

### Step 3: the recurrence

The decision is the first move from `k`. Each move costs one step and leaves a smaller number, whose best remaining cost is its own `dp` value:

```text
dp[k] = 1 + min( dp[k − 1],  dp[k / 2] if k is even,  dp[k / 3] if k % 3 == 0 )
```

This is the brute-force body with `brute(...)` replaced by `dp[...]`. Optimal substructure is what makes it correct: whatever the best first move is, the rest of the best route must be a best route from where that move lands.

### Step 4: base cases

`dp[1] = 0`. Every move strictly decreases `k`, so every chain of recurrences eventually reaches 1.

### Step 5: order and answer

`dp[k]` reads only smaller indices, so any increasing order works. The answer is `dp[n]`. There are `n` states and each does constant work, so the time is **O(n)** and the space is **O(n)**.

## Memoization in Java

Memoization keeps the brute-force recursion and adds a cache keyed by the state. This program counts calls for both versions and shows the greedy rule failing:

```java title="MinSteps.java"
import java.util.Arrays;

public class MinSteps {
    static long calls = 0;

    // Try every allowed move from n and keep the best: correct but exponential
    static int brute(int n) {
        calls++;
        if (n == 1) return 0;
        int best = 1 + brute(n - 1);
        if (n % 2 == 0) best = Math.min(best, 1 + brute(n / 2));
        if (n % 3 == 0) best = Math.min(best, 1 + brute(n / 3));
        return best;
    }

    // Same recursion; memo[n] holds the answer once known, -1 means "not computed yet"
    static int memo(int n, int[] memo) {
        calls++;
        if (n == 1) return 0;
        if (memo[n] != -1) return memo[n];
        int best = 1 + memo(n - 1, memo);
        if (n % 2 == 0) best = Math.min(best, 1 + memo(n / 2, memo));
        if (n % 3 == 0) best = Math.min(best, 1 + memo(n / 3, memo));
        memo[n] = best;                                    // store before returning
        return best;
    }

    // Greedy: always make the biggest cut available. Fast, and wrong.
    static int greedy(int n) {
        int steps = 0;
        while (n > 1) {
            if (n % 3 == 0) n /= 3;
            else if (n % 2 == 0) n /= 2;
            else n -= 1;
            steps++;
        }
        return steps;
    }

    public static void main(String[] args) {
        System.out.println("greedy(10) = " + greedy(10));
        for (int n : new int[] {10, 100, 200, 400}) {
            calls = 0;
            int b = brute(n);
            long bruteCalls = calls;
            int[] m = new int[n + 1];
            Arrays.fill(m, -1);
            calls = 0;
            int v = memo(n, m);
            System.out.println("n = " + n + ": answer " + b + " | brute force " + bruteCalls
                + " calls | memoized " + v + " in " + calls + " calls");
        }
    }
}
```

```output
greedy(10) = 4
n = 10: answer 3 | brute force 47 calls | memoized 3 in 18 calls
n = 100: answer 7 | brute force 58140 calls | memoized 7 in 183 calls
n = 200: answer 8 | brute force 1343053 calls | memoized 8 in 366 calls
n = 400: answer 9 | brute force 52302124 calls | memoized 9 in 733 calls
```

Doubling `n` multiplies the brute-force calls by twenty to forty, while the memoized calls only double. The memoized count is a little under `2n`: each state is computed once, and each computation makes one to three calls, most of which are cache hits that return immediately.

The memoized function has four parts in a fixed order, and each order matters:

1. **Base case first.** It answers states that need no cache.
2. **Cache lookup.** If the state was solved, return the stored answer before doing any work.
3. **Compute** from smaller states exactly as the brute force did.
4. **Store, then return.** Forgetting the store is a common bug: the code stays correct but silently remains exponential.

The **sentinel** `-1` means "not computed yet". It must be a value no real answer can take. `0` would be a bad choice here, because `dp[1] = 0` is a real answer; in a counting problem, 0 ways is a common real answer. When no value is safe, use a separate `boolean[] known`, or a boxed `Integer[]` whose `null` means "not computed".

### Dry run: the order memoization fills the cache

Trace `memo(10)`. The first move tried is always `k − 1`, so the recursion dives straight down to `memo(1)` before anything is stored, and then the answers are stored on the way back up:

| `k` stored | `1 + dp[k − 1]` | `1 + dp[k / 2]` | `1 + dp[k / 3]` | `dp[k]` |
|---|---|---|---|---|
| 2 | 1 + 0 = 1 | 1 + 0 = 1 | — | 1 |
| 3 | 1 + 1 = 2 | — | 1 + 0 = 1 | 1 |
| 4 | 1 + 1 = 2 | 1 + 1 = 2 | — | 2 |
| 5 | 1 + 2 = 3 | — | — | 3 |
| 6 | 1 + 3 = 4 | 1 + 1 = 2 | 1 + 1 = 2 | 2 |
| 7 | 1 + 2 = 3 | — | — | 3 |
| 8 | 1 + 3 = 4 | 1 + 2 = 3 | — | 3 |
| 9 | 1 + 3 = 4 | — | 1 + 1 = 2 | 2 |
| 10 | 1 + 2 = 3 | 1 + 3 = 4 | — | 3 |

Every value in the `k / 2` and `k / 3` columns came from the cache: by the time `memo(10)` asks for `dp[5]`, the descent through 9, 8, 7, 6 has already stored it. Notice the row for 10: the winning move is to subtract (`dp[9] = 2`), not to halve (`dp[5] = 3`), which is exactly the case the greedy rule got wrong.

## How memoization works internally

Think of every state as a node and draw an arrow from each state to the states its recurrence reads. For the puzzle with `n = 6`:

```mermaid title="Subproblem graph for n = 6: each arrow points to a state that must be solved first"
flowchart LR
    S6["6"] --> S5["5"]
    S6 --> S3["3"]
    S6 --> S2["2"]
    S5 --> S4["4"]
    S4 --> S3
    S4 --> S2
    S3 --> S2
    S3 --> S1["1"]
    S2 --> S1
```

This is the **subproblem graph**, and for any correct DP it is a **directed acyclic graph** (DAG): following arrows always leads to strictly smaller subproblems, so there are no cycles. The naive recursion explores this graph as if it were a tree, walking every path separately — that is why it is exponential, since a DAG can have exponentially many paths. Memoization visits each node once and each arrow once. That gives the general cost of a memoized DP:

- **Time** = O(number of states × arrows per state). Here, O(n × 3) = O(n).
- **Space** = O(number of states) for the cache, **plus O(maximum recursion depth)** for the call stack.

The second space term is the one that bites in Java. Each pending call holds a stack frame, and the thread's stack has a fixed size. The puzzle's recursion first walks the chain `n, n − 1, n − 2, …, 1`, so its depth is about `n`:

```java title="DeepMemo.java"
import java.util.Arrays;

public class DeepMemo {
    static int[] memo;

    static int steps(int n) {
        if (n == 1) return 0;
        if (memo[n] != -1) return memo[n];
        int best = 1 + steps(n - 1);                       // recursion depth grows with n
        if (n % 2 == 0) best = Math.min(best, 1 + steps(n / 2));
        if (n % 3 == 0) best = Math.min(best, 1 + steps(n / 3));
        return memo[n] = best;
    }

    static void run(int n) {
        memo = new int[n + 1];
        Arrays.fill(memo, -1);
        try {
            System.out.println("steps(" + n + ") = " + steps(n));
        } catch (StackOverflowError e) {
            System.out.println("steps(" + n + "): StackOverflowError");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        run(1_000);
        run(1_000_000);
        // Same code on a thread with a 512 MB stack: deep, but it fits
        Thread big = new Thread(null, () -> run(1_000_000), "big-stack", 512L << 20);
        big.start();
        big.join();
    }
}
```

```output
steps(1000) = 9
steps(1000000): StackOverflowError
steps(1000000) = 19
```

This output was produced on a 64-bit JDK with default settings; the exact depth at which the main thread overflows depends on the JVM, the platform's default stack size (commonly 512 KB to 1 MB for the main thread) and how much each frame holds, so treat the boundary as "somewhere in the tens of thousands". The last line shows one workaround: the `Thread` constructor accepts a requested stack size, which competitive programmers use to run deep recursions. The more robust fix is to remove the recursion altogether, which is exactly what tabulation does.

> [!WARNING] Recursion depth is part of the cost
> A memoized solution with O(n) states can still crash if its recursion is O(n) deep and `n` is large. Before choosing memoization, estimate the depth: chains like `n → n − 1` are as deep as the input, while halving (`n → n / 2`) or tree recursions on balanced trees stay shallow.

## Choosing the memo key

With one integer argument, an array indexed by that argument is the fastest cache. With several arguments, the key must include **every argument that affects the answer**. Consider counting the ways to roll `d` dice, each with faces 1 to `f`, so that they sum to `target` — a common DP whose answer is reported modulo 10⁹ + 7 because it grows fast (see [[a1-java-syntax-competitive]] for why that modulus is used).

```java title="DiceWays.java"
import java.util.HashMap;
import java.util.Map;

public class DiceWays {
    static final int MOD = 1_000_000_007;

    // A record gets equals() and hashCode() from its components, so it is a safe map key
    record State(int dice, int target) {}

    static Map<State, Integer> memo = new HashMap<>();

    // Ways to roll `dice` dice with faces 1..faces so that they sum to exactly `target`
    static int ways(int dice, int faces, int target) {
        if (dice == 0) return target == 0 ? 1 : 0;         // no dice left: only sum 0 works
        if (target <= 0) return 0;                         // each die adds at least 1
        State key = new State(dice, target);
        Integer cached = memo.get(key);
        if (cached != null) return cached;
        long total = 0;
        for (int face = 1; face <= faces && face <= target; face++)
            total += ways(dice - 1, faces, target - face); // this die shows `face`
        int ans = (int) (total % MOD);
        memo.put(key, ans);
        return ans;
    }

    public static void main(String[] args) {
        System.out.println(ways(2, 6, 7));
        memo.clear();                                      // faces changed: old entries are wrong
        System.out.println(ways(30, 30, 500));
        System.out.println("states stored: " + memo.size());
    }
}
```

```output
6
222616187
states stored: 10162
```

Two dice with six faces reach 7 in six ways (1+6, 2+5, …, 6+1). The state is the pair `(dice left, target left)`, captured in a Java `record`; records generate `equals` and `hashCode` from their components, so two `State` objects with the same numbers find the same entry. A `long` key such as `((long) dice << 32) | target` works too and avoids allocating objects, and a 2D array `int[d + 1][target + 1]` is faster still when the ranges are known and dense.

Look at the `memo.clear()` line. The parameter `faces` affects the answer but is **not in the key**. That is safe only while `faces` stays fixed for the whole computation. Reusing the cache for a call with a different `faces` would return answers for the wrong dice. This is the most common memoization bug in its general form: **a key that omits something the answer depends on**. The fix is either to put the parameter in the key or to clear the cache whenever it changes — including between test cases when the memo is a `static` field.

Two more key mistakes are worth knowing. Using a **mutable object** such as an `ArrayList` as a key breaks the map if the list is modified after insertion, because its hash code changes and the entry can no longer be found. And encoding a state as a `String` (`dice + "," + target`) works but is slow, because every lookup builds and hashes a new string.

## When memoization beats tabulation: sparse states

Memoization computes only the states the recursion actually reaches. Usually that is most of them, but sometimes it is a tiny fraction — and then memoization can solve problems a table cannot even allocate.

Return to the steps-to-1 puzzle with `n = 2,000,000,000`. A table of two billion `int`s needs 8 GB. But a little reasoning shrinks the problem. Suppose a best route subtracts 1 at least twice in a row and then divides by 2. Replacing "subtract 2, then halve" with "halve, then subtract 1" reaches the same number one step sooner, since `(m − 2) / 2 = m / 2 − 1`. So a best route never subtracts more than `n % 2` times before halving, and by the same argument never more than `n % 3` times before dividing by 3. The recurrence becomes:

```text
steps(n) = min( n % 2 + 1 + steps(n / 2),  n % 3 + 1 + steps(n / 3) )     for n ≥ 4
```

Every state is now `n` divided by some mix of 2s and 3s, so only a few hundred distinct values can ever appear. Nobody can list those states in a sensible order in advance — but a memoized recursion with a `HashMap` does not need to:

```java title="MinStepsHuge.java"
import java.util.HashMap;
import java.util.Map;

public class MinStepsHuge {
    static Map<Long, Long> memo = new HashMap<>();

    // Only reduce by the remainder before dividing; see the exchange argument in the text
    static long steps(long n) {
        if (n <= 3) return n == 1 ? 0 : 1;                 // 1 -> 0 steps; 2 and 3 -> 1 step
        Long cached = memo.get(n);
        if (cached != null) return cached;
        long viaTwo = n % 2 + 1 + steps(n / 2);
        long viaThree = n % 3 + 1 + steps(n / 3);
        long best = Math.min(viaTwo, viaThree);
        memo.put(n, best);
        return best;
    }

    public static void main(String[] args) {
        // Bottom-up table for every n up to a million, to check the shortcut
        int limit = 1_000_000;
        int[] dp = new int[limit + 1];
        for (int n = 2; n <= limit; n++) {
            int best = dp[n - 1] + 1;
            if (n % 2 == 0) best = Math.min(best, dp[n / 2] + 1);
            if (n % 3 == 0) best = Math.min(best, dp[n / 3] + 1);
            dp[n] = best;
        }
        for (int n = 1; n <= limit; n++)
            if (steps(n) != dp[n]) throw new AssertionError("mismatch at " + n);
        System.out.println("shortcut matches the table for n = 1.." + limit);

        memo.clear();
        long n = 2_000_000_000L;
        System.out.println("steps(" + n + ") = " + steps(n) + ", states stored: " + memo.size());
    }
}
```

```output
shortcut matches the table for n = 1..1000000
steps(2000000000) = 31, states stored: 255
```

Two billion possible states, 255 visited, and a recursion only about 30 levels deep because every call divides `n`. The program also checks the shortcut against the plain table for every `n` up to a million — a reasoning step like the exchange argument above deserves a test. This "minimum days" pattern appears in interviews as *Minimum Number of Days to Eat N Oranges*, and it is the clearest example of a problem where memoization is the right tool rather than a matter of taste.

## Tabulation {#a11-tabulation}

**Tabulation** is bottom-up dynamic programming: instead of starting from the original problem and recursing down to smaller ones, you start from the base cases and fill a table of answers in an order where every entry's dependencies are already filled. It uses the same state and the same recurrence as memoization — only the order of evaluation is planned by you rather than discovered by the call stack. There is no recursion, so there is no stack-depth limit and no function-call overhead, and the explicit order often lets you throw away parts of the table you no longer need.

### Converting a recurrence into a loop

Take the five decisions for the steps-to-1 puzzle from [[a11-memoization]] — state `dp[k]` = fewest steps from `k` to 1, recurrence `dp[k] = 1 + min(dp[k − 1], dp[k / 2], dp[k / 3])` over the allowed moves, base case `dp[1] = 0`, answer `dp[n]`. Tabulation needs one more thing made explicit: decision 4, the **order of computation**. Each `dp[k]` reads only smaller indices, so filling `k = 2, 3, …, n` in increasing order guarantees every read finds a finished value.

```java title="MinStepsTable.java"
import java.util.ArrayList;
import java.util.List;

public class MinStepsTable {

    public static void main(String[] args) {
        int n = 10;
        int[] dp = new int[n + 1];        // dp[k] = fewest steps to turn k into 1
        int[] next = new int[n + 1];      // next[k] = where the best first step from k goes
        dp[1] = 0;                        // base case: already at 1
        for (int k = 2; k <= n; k++) {    // increasing k: k-1, k/2, k/3 are all done
            dp[k] = dp[k - 1] + 1;
            next[k] = k - 1;
            if (k % 2 == 0 && dp[k / 2] + 1 < dp[k]) { dp[k] = dp[k / 2] + 1; next[k] = k / 2; }
            if (k % 3 == 0 && dp[k / 3] + 1 < dp[k]) { dp[k] = dp[k / 3] + 1; next[k] = k / 3; }
        }
        System.out.println("dp   = " + java.util.Arrays.toString(dp));
        List<Integer> path = new ArrayList<>();
        for (int k = n; k != 1; k = next[k]) path.add(k);
        path.add(1);
        System.out.println("steps(" + n + ") = " + dp[n] + " via " + path);
    }
}
```

```output
dp   = [0, 0, 1, 1, 2, 3, 2, 3, 3, 2, 3]
steps(10) = 3 via [10, 9, 3, 1]
```

Index 0 of the array is unused; the values from index 1 onward are exactly the values the memoized version stores (see the dry run in [[a11-memoization]]), filled in the same order. That is not a coincidence for this problem — the recursion happened to dive to the bottom first — but in general memoization may fill states in a scattered order while tabulation always fills them in the order you chose.

The second array, `next`, records **which choice won** at each state. The table of values tells you *how good* the best answer is; the table of choices lets you *reconstruct* it by following the choices from the answer state. Most "return the actual path / items / string" follow-ups are solved this way.

### Choosing the order: follow the arrows backwards

The order rule is the same in every problem: **a state must be computed after every state it reads**. In the subproblem graph, where arrows point from a state to the states it needs, any order that processes arrow targets before arrow sources works — in graph terms, a reverse topological order of the DAG. In practice you read the order off the recurrence:

| Recurrence reads | A valid order |
|---|---|
| `dp[i − 1]`, `dp[i − 2]`, `dp[i / 2]` | `i` increasing |
| `dp[i + 1]`, `dp[i + 2]` (suffix states) | `i` decreasing |
| `dp[i − 1][j]`, `dp[i][j − 1]`, `dp[i − 1][j − 1]` | rows top to bottom, each left to right |
| `dp[i + 1][j − 1]` (intervals) | by interval length, shortest first |

The two-dimensional cases are developed in [[a11-2d-dp]]. If you cannot find an order — the arrows form a cycle — then the "subproblems" depend on each other, and the problem is not a DP over that state as defined. It may need a different state, or a graph algorithm such as shortest paths.

Base cases become **initial values in the table**: `dp[1] = 0` before the loop, a first row of zeros, `ways[0] = 1`. A loop that starts at the wrong index, or a table left at Java's default 0 where 0 is not the right base value, are the typical tabulation bugs. For minimum problems the unfilled cells usually need "infinity" rather than 0, and for "is it possible" problems they need `false` with only the true bases set.

### Saving space with rolling variables

A table keeps every state forever, but often each state reads only a few recent ones. Fibonacci's `dp[i]` reads `dp[i − 1]` and `dp[i − 2]` and nothing older, so two variables can stand in for the whole array:

```java title="FibRolling.java"
public class FibRolling {

    // dp[i] needs only dp[i-1] and dp[i-2], so two variables replace the array
    static long fib(int n) {
        if (n <= 1) return n;
        long prev2 = 0, prev1 = 1;                         // fib(0), fib(1)
        for (int i = 2; i <= n; i++) {
            long cur = prev1 + prev2;
            prev2 = prev1;                                 // shift the window by one
            prev1 = cur;
        }
        return prev1;
    }

    public static void main(String[] args) {
        System.out.println(fib(10) + " " + fib(50) + " " + fib(90));
    }
}
```

```output
55 12586269025 2880067194370816120
```

Space drops from O(n) to O(1). The order of the two assignments at the end of the loop matters: `prev2` must take the old `prev1` before `prev1` is overwritten. In two-dimensional tables the same idea keeps only the previous row, reducing O(m · n) memory to O(n); the knapsack lesson shows how the *direction* of the inner loop decides whether one row can be updated in place ([[a11-knapsack]]).

Rolling has two costs. It only works when the dependency window is short and fixed — the steps-to-1 puzzle reads `dp[k / 2]`, which can be far behind, so it cannot be rolled. And it discards the information needed to reconstruct the answer, so if you need the path, keep the table or a separate choice array.

### Memoization or tabulation?

Both compute the same states with the same recurrence, so their time complexity is the same in the typical case. They differ in practical ways:

| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| Starting point | The original problem, recursing down | The base cases, looping up |
| Order of computation | Discovered automatically by the recursion | Must be chosen so dependencies come first |
| States computed | Only those reachable from the start | Every state in the table |
| Stack depth | Up to the longest dependency chain; can overflow | None |
| Overhead per state | A call, a lookup, sometimes a hash | An array read |
| Space reduction | Hard | Often easy with rolling rows or variables |
| Easiest to write when | The recursion is natural, or the state space is sparse or irregular | The order is obvious and every state is needed |

In interviews, a sound default is: derive the recursion, memoize it to get a correct solution quickly, then convert to tabulation if the interviewer asks about stack depth or space, or if `n` is large enough that recursion depth is a risk. Choose memoization from the start when only a small, hard-to-predict set of states is reachable, as in the sparse-state example in [[a11-memoization]], where 255 of two billion possible states are ever reached.

## Checking a DP against brute force

A DP that is wrong usually produces numbers that look perfectly plausible, so testing it on two or three hand-picked examples catches little. A much stronger check costs a few minutes: run the slow brute force, the memoized version and the table on many small random inputs and compare them.

```java title="MinStepsCheck.java"
import java.util.Arrays;
import java.util.Random;

public class MinStepsCheck {

    static int brute(int n) {                              // every move, no cache
        if (n == 1) return 0;
        int best = 1 + brute(n - 1);
        if (n % 2 == 0) best = Math.min(best, 1 + brute(n / 2));
        if (n % 3 == 0) best = Math.min(best, 1 + brute(n / 3));
        return best;
    }

    static int memo(int n, int[] memo) {
        if (n == 1) return 0;
        if (memo[n] != -1) return memo[n];
        int best = 1 + memo(n - 1, memo);
        if (n % 2 == 0) best = Math.min(best, 1 + memo(n / 2, memo));
        if (n % 3 == 0) best = Math.min(best, 1 + memo(n / 3, memo));
        return memo[n] = best;
    }

    static int table(int n) {
        int[] dp = new int[n + 1];
        for (int k = 2; k <= n; k++) {
            dp[k] = dp[k - 1] + 1;
            if (k % 2 == 0) dp[k] = Math.min(dp[k], dp[k / 2] + 1);
            if (k % 3 == 0) dp[k] = Math.min(dp[k], dp[k / 3] + 1);
        }
        return dp[n];
    }

    public static void main(String[] args) {
        Random rnd = new Random(7);
        int trials = 1000;
        for (int t = 0; t < trials; t++) {
            int n = 1 + rnd.nextInt(150);                  // small enough for the brute force
            int[] m = new int[n + 1];
            Arrays.fill(m, -1);
            int expected = brute(n), a = memo(n, m), b = table(n);
            if (a != expected || b != expected)
                throw new AssertionError("n = " + n + ": brute " + expected
                    + ", memo " + a + ", table " + b);
        }
        System.out.println("random tests passed: " + trials);
    }
}
```

```output
random tests passed: 1000
```

The fixed seed (`new Random(7)`) makes a failure reproducible: if a trial fails, rerunning gives the same input. The brute force must be the most plainly correct code you can write, even if it is exponential, and the inputs must be small enough for it to finish — here `n ≤ 150`. Include the edge of the domain (`n = 1`, where the loop in `table` never runs) by letting the random range reach it. This habit catches wrong base cases, wrong loop bounds and wrong recurrences long before an interviewer or a judge does, and every DP lesson in this module uses it.

## In real systems

**Caching pure functions.** Memoization in production is ordinary caching applied to a pure function: compile caches, memoized selectors in front-end state libraries, and `computeIfAbsent` on a `ConcurrentHashMap` in Java services. The DP rules carry over: the key must include everything the result depends on, and the cache must be invalidated when an input outside the key changes. (Avoid calling `computeIfAbsent` recursively on the same `HashMap` to memoize a recursion; since Java 9 `HashMap` throws `ConcurrentModificationException` when the mapping function modifies the map.)

**Parsing.** Packrat parsers memoize "does rule R match at position p?" so that backtracking grammars run in linear time instead of exponential time. The state is the pair (rule, position).

**Text and sequence comparison.** Diff tools, spell checkers and DNA alignment tools compute edit-distance-style tables; [[a11-2d-dp]] and [[a11-lcs]] show the recurrences.

**Query optimisation.** The classic System R optimiser chooses the order in which to join tables with a DP over subsets of tables: the best plan for joining `{A, B, C}` is built from best plans for its smaller subsets. PostgreSQL still uses this kind of DP when a query joins a moderate number of tables, and switches to a randomised genetic search (GEQO) once the number of tables reaches a configurable threshold (`geqo_threshold`, 12 by default), because the number of subsets grows exponentially.

**Speech and sequence models.** The Viterbi algorithm, which finds the most likely sequence of hidden states in a hidden Markov model, is a tabulated DP over (time step, state).

## Trade-offs and alternatives

DP trades memory for time: it stores one answer per state to avoid recomputing it. That trade is worth it when states repeat heavily and the state space fits in memory. When the state space is too large, DP is the wrong tool, or the state needs rethinking — the sparse-state example shows that a smarter recurrence can turn an impossible table into a few hundred entries.

Some neighbours to know:

- **Plain recursion or backtracking** is right when subproblems do not repeat, or when the output itself is exponential (listing every subset). Caching cannot shrink an output that large.
- **Greedy algorithms** make one choice per step without comparing futures. They are faster and simpler, but correct only when an exchange argument proves the local choice is safe ([[a10-local-vs-global]]). The steps-to-1 puzzle is a case where the obvious greedy fails.
- **Divide and conquer** also splits a problem into subproblems, but the subproblems are disjoint, so there is nothing to cache.
- **Shortest-path algorithms** solve problems whose subproblem graph has cycles, where no DP order exists. Conversely, a DP is a shortest- or longest-path computation on an acyclic subproblem graph.

## Common mistakes

> [!MISTAKE] A key that leaves something out
> If the answer depends on a value that is not in the memo key — a parameter, a global, the path taken so far — two different subproblems share one cache entry and one of them gets the wrong answer. List every input the function reads; each one is either in the key or provably constant for the whole computation.

**Using 0 (or `false`) to mean "not computed".** If 0 is a valid answer, every subproblem whose answer is 0 is recomputed each time it is asked — correct but possibly exponential — and in some code shapes it is returned as a wrong cached value. Use `-1`, a `boolean[] known`, or `null` in an `Integer[]`.

**Forgetting to store.** Returning the computed value without writing it to the cache leaves the program correct and exponential. Write `return memo[k] = best;` so the store cannot be skipped.

**Caching an impure function.** A recursion that modifies a shared list, reads a counter, or depends on the order of earlier calls cannot be memoized safely. Rewrite it so the result depends only on the arguments.

**Reusing a static memo across test cases.** A `static` cache filled for one input answers the next input with stale values. Reallocate or clear it per input.

**Wrong tabulation order.** Filling `dp[i]` before a state it reads gives the default value (0) instead of the real one, and the program runs without any error. Derive the order from the recurrence's arrows, not from habit.

**Ignoring recursion depth.** O(n) states with an O(n)-deep recursion can throw `StackOverflowError` for `n` in the tens of thousands. Switch to tabulation for deep chains.

## Interview perspective

Interviewers rarely ask "what is memoization?" They give a problem whose brute force is exponential and watch how you get from there to a polynomial solution. The strongest signal is a clear derivation spoken aloud.

> [!INTERVIEW] A derivation that lands well
> "Let me write the brute force first: from `n` I try each move and take the best. The only thing that changes between calls is `n`, and the answer doesn't depend on how I got there, so `dp[n]` is the fewest steps from `n`. Each call does constant work and there are `n` states, so memoizing gives O(n) time and space. If the recursion depth is a concern, I can fill the same table bottom-up because every state only reads smaller values."

Questions to prepare for:

- **What two properties does a problem need for DP?** Overlapping subproblems (otherwise caching saves nothing) and optimal substructure (otherwise combining sub-answers does not give the answer). Give merge sort and longest simple path as the counterexamples.
- **Memoization versus tabulation?** Same states and recurrence; memo computes only reachable states and finds the order automatically but uses stack; tabulation needs an explicit order, avoids recursion, and makes space reduction easy.
- **What is the time complexity of a memoized solution?** Number of states times the work per state — and be ready to count both.
- **How would you return the actual solution, not only its value?** Store the winning choice per state, or recompute it by checking which option produced the stored value, then follow choices from the answer state.
- **Can you reduce the space?** Look at how far back the recurrence reads. A fixed small window allows rolling variables or rows; reads like `dp[n / 2]` do not.
- **Follow-up: `n` is now 10⁹.** A table is impossible; look for a recurrence whose reachable states are sparse and memoize with a map, as in the two-billion example.

## Practice

1. **Fibonacci three ways.** Write naive, memoized and tabulated versions; count calls; then roll the table to two variables.
2. **Steps to 1 with costs.** Change the puzzle so that subtracting costs 1, halving costs 2 and dividing by 3 costs 3. Redo the five decisions and check against a brute force.
3. **Climbing stairs with forbidden steps.** Count ways to climb `n` stairs taking 1 or 2 steps at a time when some steps are broken. Write it top-down, then bottom-up.
4. **Dice rolls.** Rewrite `DiceWays` with a 2D array memo, then as a table. Which loop order is valid?
5. **Minimum days to eat oranges.** Solve it for `n` up to 2 × 10⁹ with the remainder argument and a map-based memo.
6. **Spot the non-DP.** For merge sort, generating permutations and longest simple path, explain which property fails.

The DSA explorer lists the matching problems under this topic; start with *Fibonacci Number*, *Climbing Stairs*, *Number of Dice Rolls With Target Sum* and *Minimum Number of Days to Eat N Oranges*.

```quiz
Q: A recursive function `f(i, total)` reads a static field `limit` that never changes during the computation. Which memo key is correct?
- [ ] `i` alone, because `total` is derived from `i`
- [x] The pair `(i, total)`; `limit` can stay out of the key while it stays constant
- [ ] `(i, total, limit)` is required in every case
- [ ] No key works; static fields make memoization impossible
> The key must contain every input that affects the answer and varies between calls. Both arguments vary, so both belong in the key. A constant field cannot cause two different subproblems to collide — but if the same cache is reused with a different limit, it must be cleared or the limit added to the key.

Q: Why does the naive recursive Fibonacci take exponential time while the memoized version takes linear time?
- [ ] The memoized version uses a faster addition
- [ ] The memoized version avoids the base cases
- [x] The naive version explores every path through the subproblem graph; the memoized version computes each of the n + 1 states once
- [ ] The naive version recurses deeper
> There are only n + 1 distinct questions, but the naive recursion re-solves each one every time it is reached, and the number of paths grows like 1.6 to the power n. Both versions have the same recursion depth, about n.

Q: The recurrence is `dp[i] = dp[i + 1] + dp[i + 3]` with bases at the end of the array. In which order must a table be filled?
- [ ] `i` from 0 upward
- [x] `i` from the end downward
- [ ] Any order
- [ ] It cannot be tabulated
> Each state reads larger indices, so those must be filled first. Filling upward would read dp[i + 1] while it still holds the default 0.

Q: When is memoization clearly better than tabulation?
- [ ] Whenever the recurrence has two parameters
- [ ] Whenever the answer must be reconstructed
- [x] When only a small, hard-to-predict subset of a huge state space is reachable from the start
- [ ] When the recursion is very deep
> Memoization computes only reachable states and needs no planned order, so a sparse state space (like 255 of two billion values) costs almost nothing. Very deep recursion is a reason to prefer tabulation, not memoization.
```

## Quick revision {#quick-revision}

- DP = solve each distinct subproblem once and reuse it. Needs overlapping subproblems and optimal substructure, and a function whose result depends only on its state.
- The five decisions: **state** (a sentence for what `dp[...]` means), **recurrence** (from one decision), **base cases**, **order of computation**, **answer**.
- Get them from a brute-force recursion: the changing arguments are the state; the body is the recurrence.
- Time = states × work per state. Space = states, plus recursion depth for memoization.
- Memoization: base case → lookup → compute → store → return. Sentinel must not be a real answer.
- Memo key must include every varying input; records, packed `long`s or arrays make good keys; clear static memos between inputs.
- Tabulation: same recurrence, explicit order where dependencies come first (reverse topological order of the subproblem DAG); bases become initial table values.
- Rolling variables or rows cut space when the recurrence reads a short fixed window; they lose reconstruction information.
- Choose memoization for sparse or irregular reachable states; tabulation for deep chains, full tables and space optimisation.
- Verify with a brute force on many small random inputs with a fixed seed.

## Key takeaways {#key-takeaways}

- Exponential recursions are often exponential only because they re-solve the same subproblems; caching turns the number of paths into the number of states.
- A DP is defined by its state, recurrence, base cases, order and answer — write them in words before code.
- Memoization and tabulation compute the same thing; memoization finds the order for you and skips unreachable states, while tabulation avoids the call stack and makes space savings easy.
- The cache key must capture everything the answer depends on, or different subproblems will share wrong answers.
- Recursion depth is a real cost in Java; deep chains call for a bottom-up table.
- A brute force on small random inputs is the cheapest way to prove a DP right before you trust it.
