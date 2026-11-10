---
summary: Before optimising, a strong candidate states the simplest correct solution and its exact cost. You will learn how to find the brute force for any problem by naming its candidate space, how to state its complexity honestly, how to present it in under two minutes, and how it becomes both the starting point for optimisation and a trusted test oracle.
difficulty: beginner
minutes: 40
objectives:
  - Describe the brute force for a new problem by naming what a candidate answer is and how to enumerate and check every candidate
  - Derive the brute force's time and space complexity, including the cost of checking each candidate
  - Point at the redundant work inside a brute force that an optimisation should remove
  - Decide when to code the brute force, when to describe it only, and when to skip it
  - Use a brute-force implementation as an oracle to test an optimised solution
---

## Introduction

You have clarified the problem. You understand what goes in and what comes out. Now the interviewer waits for an approach. If the optimal idea comes to you immediately, it is tempting to announce it and start typing. Strong candidates usually do something that looks slower: they first say, in a sentence or two, the most obvious correct solution and what it costs — and only then improve it.

That obvious solution is the **brute force**: an algorithm that tries every possible candidate answer and checks each one. It is almost always too slow for the real constraints, and that is not the point. Its value lies elsewhere:

- **It proves you understand the problem.** You cannot enumerate every candidate unless you know exactly what a candidate is and what makes it correct.
- **It gives you a correct fallback.** If the optimal idea does not come, a working brute force with a clear complexity analysis earns far more credit than half-written clever code.
- **It is where optimisations come from.** An optimisation removes work. You can only see which work is wasted once you have written down the algorithm that does all of it.
- **It is a test oracle.** A slow but obviously correct solution can check a fast but subtle one on thousands of inputs.

This lesson covers how to find a brute force for any problem, how to state its cost correctly, how to present it without wasting time, and how to use it. The next lesson, [[a14-deriving-optimization]], picks up exactly where this one ends: with a brute force on the table and its wasted work identified.

## Before you start

- **Clarified requirements** — you need to know the input shape, output and constraints first. See [[a14-clarifying-requirements]].
- **Big-O analysis** — counting loop iterations and recognising O(n²), O(2ⁿ) and O(n!). See [[a1-big-o]] and [[a1-time-complexity]].
- **Recursion** — some brute forces enumerate choices recursively. See [[a1-recursion]].
- **Prefix sums and hashing** appear in the worked example's final step; [[a2-prefix-suffix]] and [[a2-hashing]] teach them, but you can follow this lesson without them.

## The intuition

Imagine you have lost a key somewhere in your house. The brute force is to search every room, every drawer, every pocket. It is slow, but it is guaranteed to work, and — importantly — describing it forces you to define the search: which rooms exist, what counts as "searched". Once you have that list, improvements become obvious. "I only went into three rooms today, so I only need to search those" is a pruning of the brute force. "I always drop my keys by the door" is a better order. Neither idea makes sense until the full search is defined.

Algorithms work the same way. The brute force defines the **search space** — the set of all candidate answers. Optimisations are ways of searching less of it, or of searching it without repeating work.

## What a brute force is

Every brute force has the same three-part shape. Learning to fill in these three parts is how you find one for a problem you have never seen.

1. **What is a candidate answer?** A pair of indices? A contiguous subarray? A subset of items? An ordering of tasks? A number in some range?
2. **How do I enumerate every candidate?** Nested loops for pairs and subarrays, recursion for subsets and permutations, a loop over a numeric range.
3. **How do I check a candidate?** Compute its sum, check its validity, compare it with the best seen so far.

For Two Sum, a candidate is a pair of indices `(i, j)` with `i < j`; enumerate with two nested loops; check whether `nums[i] + nums[j] == target`. For "longest substring without repeating characters", a candidate is a substring `s[i..j]`; enumerate all start and end pairs; check that it has no repeats. For "minimum coins to make an amount", a candidate is a multiset of coins; enumerate recursively by choosing the next coin; check whether the total equals the amount.

If you cannot fill in all three parts, you do not yet understand the problem well enough to optimise it — go back to the examples.

### Common candidate spaces and their costs

Most brute forces enumerate one of a handful of spaces. Knowing their sizes lets you state the complexity immediately.

| Candidate is… | Number of candidates | Typical enumeration | Brute-force time |
|---|---|---|---|
| A single element | n | one loop | O(n × check) |
| A pair of elements | n(n − 1)/2 | two nested loops | O(n²) if the check is O(1) |
| A contiguous subarray or substring | n(n + 1)/2 | start and end loops | O(n²) to O(n³), depending on the check |
| A subset | 2ⁿ | include/exclude recursion ([[a9-subsets]]) | O(2ⁿ × n) |
| An ordering | n! | swap or used-array recursion ([[a9-permutations]]) | O(n! × n) |
| A value in a range of size V | V | loop over values | O(V × check) — often improved with [[a3-binary-search-on-answer]] |

The last column has a factor beyond the candidate count: **the cost of checking one candidate**. This is the part beginners forget, and it is often where the first optimisation hides.

### Stating the complexity honestly

Say the brute force's complexity out loud, and derive it rather than guess. "Two loops, so O(n²)" is wrong if the body of the inner loop is itself a loop. For subarray sums, enumerating all `(start, end)` pairs is O(n²) pairs, but if you add up each subarray from scratch, each check costs up to O(n), and the total is O(n³). Stating O(n²) for that code is a visible error, and interviewers notice it.

State space too. Most loop-based brute forces use O(1) extra space; recursive ones use stack space proportional to the recursion depth, and enumerations that build each candidate (a subset, a permutation) need O(n) for the current candidate.

## Worked walkthrough: Subarray Sum Equals K

The prompt: *"Given an integer array `nums` and an integer `k`, return the number of contiguous subarrays whose sum equals `k`."*

After clarification you know: the array is not sorted, **values can be negative**, `n` is up to 2 × 10⁴, and you return a count. Negative values are the important answer. With only positive values, a sliding window would work, because extending a window always increases its sum and shrinking always decreases it ([[a2-sliding-window]]). With negatives, a window's sum can go down when it grows, so the window cannot tell which way to move. That rules out the pattern many candidates reach for first, which is exactly why a brute force is a safer starting point here than a guessed pattern.

### Version 1: the literal brute force

Fill in the three parts. A candidate is a subarray `nums[start..end]`. Enumerate all `start ≤ end`. Check by summing its elements.

> "The brute force is to try every start and every end, add up the subarray, and count it if the sum is k. There are about n²/2 subarrays and summing each is up to O(n), so that's O(n³) time and O(1) space."

### Version 2: remove the obvious repetition

Look at what version 1 recomputes. With `start = 0`, it sums `nums[0..0]`, then `nums[0..1]` from scratch, then `nums[0..2]` from scratch. But `sum(0..2)` is just `sum(0..1) + nums[2]`. If you keep a running sum as `end` moves right, each check becomes O(1).

> "Each time end moves right, the new subarray is the old one plus one element, so I can keep a running sum. That makes it O(n²)."

This step is still a brute force — it still visits every subarray — but it no longer repeats the inner summation. It is common for the first improvement to be this kind of "stop recomputing what you just computed" change.

### The program

```java title="SubarraySumK.java"
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class SubarraySumK {

    // Brute force 1: enumerate every (start, end) pair and re-add the elements. O(n^3).
    static int countCubic(int[] nums, int k) {
        int count = 0;
        for (int start = 0; start < nums.length; start++) {
            for (int end = start; end < nums.length; end++) {
                int sum = 0;
                for (int i = start; i <= end; i++) sum += nums[i];
                if (sum == k) count++;
            }
        }
        return count;
    }

    // Brute force 2: same pairs, but extend the running sum instead of re-adding. O(n^2).
    static int countQuadratic(int[] nums, int k) {
        int count = 0;
        for (int start = 0; start < nums.length; start++) {
            int sum = 0;
            for (int end = start; end < nums.length; end++) {
                sum += nums[end];
                if (sum == k) count++;
            }
        }
        return count;
    }

    // Optimised: prefix sums with a count map. O(n). Derived in the next lesson.
    static int countLinear(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);
        int prefix = 0, count = 0;
        for (int x : nums) {
            prefix += x;
            count += seen.getOrDefault(prefix - k, 0);
            seen.merge(prefix, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        int[] nums = {3, 4, 7, 2, -3, 1, 4, 2};
        System.out.println(countCubic(nums, 7) + " " + countQuadratic(nums, 7) + " "
                + countLinear(nums, 7));

        // Use the brute force as a trusted oracle for the fast version.
        Random rng = new Random(42);
        for (int test = 1; test <= 500; test++) {
            int n = rng.nextInt(9);                        // includes n = 0
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = rng.nextInt(7) - 3;   // values -3..3
            int k = rng.nextInt(7) - 3;
            int expected = countQuadratic(a, k), actual = countLinear(a, k);
            if (expected != actual) {
                System.out.println("Mismatch on test " + test);
                return;
            }
        }
        System.out.println("500 random tests agree");
    }
}
```

```output
4
500 random tests agree
```

Wait — the first line prints three numbers separated by spaces. Here is the exact output:

```output
4 4 4
500 random tests agree
```

All three methods agree that four subarrays of `[3, 4, 7, 2, -3, 1, 4, 2]` sum to 7: `[3, 4]`, `[7]`, `[7, 2, -3, 1]` and `[1, 4, 2]`. Notice that `[7, 2, -3, 1]` only exists because of the negative number — it is the kind of subarray a positive-only sliding window would skip.

Walk through the two brute forces. `countCubic` has three nested loops: `start`, `end`, and the summation `i`. `countQuadratic` deletes the innermost loop and moves `int sum = 0` up one level, so the sum resets once per `start` instead of once per `(start, end)` pair. That one structural change — where the accumulator is initialised — is the whole difference between O(n³) and O(n²).

### Is O(n²) good enough?

Now use the constraint you clarified. With `n = 2 × 10⁴`, the quadratic version checks n(n + 1)/2 ≈ 2 × 10⁸ subarrays. That is borderline: it might pass in a few seconds of Java, and it might not, and an interviewer will ask for better. The cubic version would need about 1.3 × 10¹² additions, which is hopeless.

So you say:

> "O(n²) is around 2 × 10⁸ operations at the upper limit, which is too slow to be comfortable. The remaining waste is that for every end, I'm scanning all starts to see which ones give sum k. If I could look that up instead of scanning, I'd get O(n)."

That last sentence names the bottleneck precisely, and it is the bridge to the optimisation. The third method in the program, `countLinear`, is the result; [[a14-deriving-optimization]] derives it step by step from this exact sentence, and [[a2-hashing]] covers the prefix-sum-with-counts pattern in depth.

## The brute force as a test oracle

The second half of `main` shows the brute force's other job. `countLinear` is short but subtle: it depends on seeding the map with `0 → 1`, on checking before inserting, and on correct behaviour with negative numbers and zeros. `countQuadratic` is so direct that you can believe it is correct by reading it.

**Stress testing** uses that asymmetry. Generate many small random inputs, run both versions, and stop at the first disagreement. The program draws arrays of length 0 to 8 with values from −3 to 3, which makes zeros, negatives, duplicates and the empty array common. Small inputs keep the brute force fast and, if a mismatch appears, make it easy to trace by hand. The fixed seed `42` makes the run reproducible; with a different seed the inputs change, but a correct pair of implementations agrees on all of them.

You will rarely run a stress test in a live interview — there is usually no time and no runner. But it is one of the most effective ways to practise: write the brute force, write your optimised version, and let a few thousand random tests find the case you missed. In the interview itself, the brute force still serves as an oracle for hand-checking: you can compute the answer for a tiny input by brute reasoning and compare it with your trace of the optimised code (see [[a14-manual-testing]]).

> [!TIP] Remove one bug at a time
> If the stress test reports a mismatch, print the failing input and both outputs, then shrink the input by hand until the smallest failing case remains. A three-element counterexample is usually enough to see the bug.

## A second walkthrough: brute force by recursion

Not every brute force is a pair of loops. Consider *"Given coin denominations and an amount, return the fewest coins that make the amount."*

1. A candidate is a sequence of coins.
2. Enumerate by choosing the first coin, then recursively making the rest of the amount.
3. Check: the remaining amount reaches exactly 0. Keep the minimum count.

> "The brute force tries every coin as the first coin and recurses on the remaining amount. With c coin types and an amount A, the recursion can go A levels deep with c choices at each, so it's exponential — roughly O(c^A) in the worst case."

This brute force is valuable because of what it reveals. Draw the recursion for coins `{1, 3, 4}` and amount 6: the subproblem "make 2" appears under "6 − 4", under "6 − 3 − 1" and under "6 − 1 − 3", and under several other paths. The same subproblem is solved again and again. That observation — **overlapping subproblems** — is the signal for dynamic programming, and the fix is to remember each answer once ([[a11-memoization]]). Without the brute-force recursion, there is nothing to memoise.

Brute-force recursion also exposes the wrong shortcut. A candidate who skips straight to "always take the biggest coin" will be confidently wrong on `{1, 3, 4}` and 6: greedy picks 4 + 1 + 1 (three coins), while 3 + 3 uses two. [[a14-deriving-optimization]] shows how a counterexample hunt catches this.

## How to present it in the interview

A brute force should take **thirty seconds to two minutes** to present, depending on the problem. The usual shape is three sentences:

1. **What it enumerates and checks:** "Try every pair of indices and check whether they sum to the target."
2. **Its cost:** "That's O(n²) time and O(1) space."
3. **Why that is not enough, and where the waste is:** "With n up to 10⁵ that's 10¹⁰ operations, too slow. The waste is that for each element I scan the rest of the array for its complement."

Then decide whether to write it.

| Situation | What to do |
|---|---|
| Optimal idea is clear and the interviewer nods | Describe the brute force in a sentence, then code the optimal solution |
| Optimal idea is unclear | Code the brute force, so you have a working answer; then optimise |
| Time is running short | Code the brute force cleanly and explain how you would optimise it |
| Very easy warm-up problem | Mention the naive cost in one clause ("rather than nested loops, one pass with a set"), then move on |
| The interviewer says "skip to the optimal" | Do so; the instruction overrides the habit |

Coding the brute force is not wasted when you are stuck. It frequently *is* the route to the optimisation: once loops are on the screen, it is much easier to point at the inner one and ask "what is this loop searching for?"

> [!IMPORTANT] Partial credit is real
> Interview feedback is rarely binary. "Correct O(n²) solution, clearly explained, identified the bottleneck, ran out of time on the O(n) version" is a respectable outcome. "Started on an O(n) idea, never got it working" usually is not.

## When the brute force is the answer

Sometimes the brute force is the intended solution. If clarification revealed `n ≤ 10` for a problem that asks for the best ordering, n! = 3,628,800 orderings is comfortably fast, and building a clever algorithm would waste the interview. Backtracking problems such as [[a9-n-queens]] or [[a9-combination-sum]] are, at heart, brute forces with pruning ([[a9-pruning]]): the exponential search is unavoidable, and the craft lies in enumerating it cleanly and cutting dead branches early. Check the constraint before you assume more is needed.

## Common mistakes

> [!MISTAKE] Stating the wrong complexity for the brute force
> "Two loops, so O(n²)" for code that sums each subarray inside those loops is O(n³). If the brute force's cost is wrong, the optimisation story built on it is wrong too. Count every nested loop, including the one hidden in the check.

**Describing only the optimal solution.** If you announce "use a hash map" with no baseline, the interviewer cannot see why the hash map helps, and if the idea is wrong you have no correct solution to fall back on.

**Getting the brute force itself wrong.** A brute force that misses candidates — skipping single-element subarrays, or the empty subset when it is allowed — is not a correct baseline. Check it on the given example before building on it.

**Staying on the brute force.** Presenting the brute force and then stopping, without naming its waste or attempting anything better, signals that you do not know how to improve it. Always finish with "the bottleneck is…".

**Spending ten minutes on it.** On a problem with an obvious naive approach, a long derivation of the naive approach uses time you will need for the real solution.

## Interview perspective

Interviewers listen for a **progression**: a correct baseline with an honest cost, a diagnosis of where it wastes work, and an improvement that targets that waste. That story is evidence of a transferable method rather than memorised answers.

> [!INTERVIEW] What a strong answer sounds like
> "The simplest correct approach is to try every start and end and sum each subarray — that's O(n³). Keeping a running sum per start gets it to O(n²). For n = 2 × 10⁴ that's still about 2 × 10⁸ steps, and the remaining waste is scanning every start to find the ones that make sum k. If I store prefix sums in a map, that scan becomes a lookup."

Questions you should be able to answer:

- **"Why mention the brute force at all?"** It shows you understand the problem, gives a correct fallback, and the optimisation is derived from its wasted work.
- **"When would you skip it?"** On trivial problems, or when told to — though even then, a one-clause mention of the naive cost is cheap.
- **"What's the brute force for a DP problem?"** The recursion that tries every choice. It is exponential because the same subproblems recur, and memoising those subproblems is the DP.
- **"Your optimised solution gives a different answer from the brute force on this input. Which is right?"** Usually the brute force, because it is simpler — trace both on the input to find out.

## Practice

For each problem, write the three parts (candidate, enumeration, check), state the time and space, and name the redundant work in one sentence.

1. **Contains Duplicate:** does any value appear twice? ([[a2-hashing]])
2. **Longest Substring Without Repeating Characters.** Be careful: checking each substring for repeats is itself O(length).
3. **Maximum Subarray Sum.** Write the O(n³) and O(n²) versions, then read [[a2-kadane]] to see where O(n) comes from.
4. **Subsets that sum to a target** for `n ≤ 20`. Is the brute force acceptable? ([[a9-subsets]])
5. **Stress test.** Implement Two Sum with nested loops and with a hash map, and compare them on 1,000 random arrays of length 0–8 with values −5 to 5. Return the pair of indices with the smallest `j` and, for that `j`, the smallest `i`, so both versions have the same, well-defined answer.

## Quick revision {#quick-revision}

- Brute force = enumerate every candidate answer and check each one.
- Three parts: what a candidate is, how to enumerate all of them, how to check one.
- Candidate spaces: elements n, pairs ~n²/2, subarrays ~n²/2, subsets 2ⁿ, orderings n!, values in a range V.
- Complexity = number of candidates × cost of checking one. Do not forget the check.
- First improvement is often "stop recomputing": a running sum turns O(n³) subarray sums into O(n²).
- Present in three sentences: what it does, its cost, where it wastes work.
- Code it when stuck or short of time; describe it in a sentence when the optimum is clear.
- If constraints are tiny (`n ≤ 10` for orderings, `n ≤ 20` for subsets), the brute force may be the intended answer.
- Brute force = test oracle: stress-test the fast version against it on many small random inputs.

## Key takeaways {#key-takeaways}

- Every problem has a brute force, found by naming what a candidate answer is, how to enumerate candidates and how to check one.
- Its complexity is the number of candidates times the cost of a check; deriving it honestly is part of the answer.
- The brute force is the raw material for optimisation: the work it repeats is the work a better algorithm removes.
- A correct, clearly explained brute force is a real fallback and earns real credit.
- Because it is simple, the brute force is the best oracle for testing a subtle optimised solution.

```quiz
Q: A candidate says "I'll check every subarray by looping over start and end, and summing the elements in between — two loops, so O(n²)." What is wrong?
- [ ] Nothing; two loops always mean O(n²)
- [x] Summing the elements is a third loop of up to n steps, so the code is O(n³)
- [ ] There are 2ⁿ subarrays, so it is exponential
- [ ] It is O(n log n) because the subarrays get shorter
> Complexity is the number of candidates times the cost of checking one. There are about n²/2 subarrays, and summing each from scratch costs up to n, giving O(n³). Keeping a running sum per start removes that inner loop, which is what makes O(n²) achievable. There are n(n+1)/2 contiguous subarrays, not 2ⁿ — 2ⁿ counts subsets.

Q: For Subarray Sum Equals K with negative numbers allowed, why is a brute force a better first step than a sliding window?
- [ ] Sliding windows only work on strings
- [ ] Sliding windows are always slower than brute force
- [x] With negatives, growing a window can lower its sum, so the window cannot decide which end to move and will miss valid subarrays
- [ ] Sliding windows need the array to be sorted
> The sliding window relies on monotonicity: adding an element increases the sum, removing one decreases it. Negative values break that, so a window would skip subarrays like [7, 2, -3, 1]. Starting from a brute force avoids committing to a pattern whose precondition does not hold.

Q: Why does stress testing use many small random inputs rather than a few large ones?
- [ ] Large inputs cannot contain bugs
- [x] Small inputs keep the brute force fast, hit edge cases such as empty arrays and duplicates often, and give counterexamples small enough to trace by hand
- [ ] Java's Random cannot generate large arrays
- [ ] Small inputs make the optimised solution faster
> The brute force is slow, so inputs must stay small for it to finish. Small random inputs with a narrow value range produce zeros, negatives, duplicates and empty arrays frequently, which is where bugs live, and a failing case of three elements is easy to trace by hand.
```
