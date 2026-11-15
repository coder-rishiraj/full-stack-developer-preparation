---
problemId: cses-permutations
title: Permutations
source: cses
sourceUrl: https://cses.fi/problemset/task/1070
difficulty: easy
patterns: [introductory, construction, mathematics]
relatedLessons: [a1-java-syntax-competitive, a14-brute-force-first, a14-edge-cases, a2-array-string-traversal]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get one integer n. Arrange the numbers 1, 2, …, n in a row so that no two neighbours differ by exactly 1. Such an arrangement is called *beautiful*. Print any beautiful arrangement, or the exact text `NO SOLUTION` if none exists. This is a whole program: it reads n from standard input and writes the answer to standard output.

**Example 1**

- Input: `5`
- Output: `4 2 5 3 1` (any beautiful arrangement is accepted)
- Why: the neighbouring differences are 2, 3, 2 and 2. None of them is 1, and every number from 1 to 5 appears once.

**Example 2**

- Input: `3`
- Output: `NO SOLUTION`
- Why: whatever the order, the number 2 ends up next to 1 or 3.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^6.
- If several beautiful arrangements exist, any of them is accepted.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The code is a few lines; the work is finding a rule that always works and convincing yourself that it does. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. With pen and paper, find a beautiful arrangement for every n from 1 to 6, or decide that none exists.
3. Look for a rule that produces your arrangements, and check it on the smallest n where it could break.
4. Write the full program, including input and output, and say how long printing a million numbers takes.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Two numbers differ by exactly 1 only if one is even and the other is odd. What does that tell you about two neighbours that have the same parity?

> [!HINT] Hint 2: the kind of tool you need
> Group the numbers by parity and write one group after the other. Inside a group, neighbours differ by 2. The only place that can go wrong is the single spot where the two groups meet, so choose the order of the groups with that spot in mind.

> [!HINT] Hint 3: almost the whole plan
> Print all even numbers in increasing order, then all odd numbers in increasing order. Check the meeting point for n = 4 and n = 5, and compare with writing the odd numbers first. Then settle n = 1, 2 and 3 separately by trying every order. Build the output in one buffer and print it once.

**Check yourself before revealing the walkthrough**

- [ ] I have an answer, or a proof that there is none, for every n from 1 to 6
- [ ] My program prints `1` for n = 1, not `NO SOLUTION`
- [ ] I checked the point where my rule joins two parts, for the smallest n where both parts have two or more numbers
- [ ] My program prints a million numbers well within one second

## 3. Interview script: understand the problem (≈2 min)

CSES problems come without an interviewer, so treat this as if one had posed it. The questions to ask are about the exact output and the size of n; the algorithm questions come later.

**Me:** Let me restate it. I print the numbers 1 to n, each exactly once, in an order where no two adjacent numbers differ by 1. If no such order exists I print `NO SOLUTION`. Is any valid order accepted?

**Interviewer:** Any one. The judge checks it.

**Me:** Output format: numbers on one line separated by spaces? And `NO SOLUTION` in capitals with one space?

**Interviewer:** Yes to both. Trailing spaces and the final newline do not matter.

**Me:** And n goes up to a million in one second. So the algorithm has to be about linear, and printing a million numbers is itself something I need to do carefully in Java.

**Interviewer:** Right.

**Me:** Let me try small cases by hand. n = 1: just `1`; there are no neighbours, so nothing can differ by 1. n = 2: `1 2` and `2 1` both have a difference of 1, so no solution. n = 3: wherever 2 goes, it has at least one neighbour, and that neighbour is 1 or 3. No solution. n = 4: `2 4 1 3` has differences 2, 3, 2. That works.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | Trying all n! orders is impossible beyond about n = 10. I need a direct construction, O(n). |
| Time limit 1 s | The output is up to about 6.9 million characters. One `print` per number is too slow in Java (measured below), so I build the whole line in one `StringBuilder`. |
| Any beautiful permutation is accepted | I do not have to match the sample `4 2 5 3 1`. I can choose the construction that is easiest to prove. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Output on one line, separated by spaces; whitespace at the end is ignored | I can append `x + ' '` for every number, without special-casing the last one. |
| The failure text is exactly `NO SOLUTION` | Copy it from the statement; `NO` or `No solution` is a wrong answer. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input is a single integer, possibly followed by a newline | I read one line and trim it. The input is one number, so the reading method hardly matters; the output does. |

### Edge cases I will keep in mind

- n = 1: the answer is `1`. A careless `if (n < 4)` prints `NO SOLUTION` here.
- n = 2 and n = 3: no solution.
- n = 4: the smallest n with an answer beyond 1, and the one where a natural rule breaks (section 4).
- n = 10^6: speed of output.

## 4. Think out loud: from first idea to best solution

The search space is the n! orders. For small n, a backtracking search (place numbers left to right, skip any number that differs by 1 from the last one placed, undo when stuck) answers the question exactly. Running it for n = 1 to 9 says that only n = 2 and n = 3 have no solution; the test file for this page does exactly that. It is the right tool for *discovering* the pattern, but it is exponential in the worst case and has no place in the final program, so it is not a numbered approach. Everything below is a direct construction.

### Approach 1: Odd numbers first, then even numbers, with n = 4 patched

#### What I say out loud

> "Neighbours that differ by 1 always have different parity. So if I put all odd numbers together and all even numbers together, the only risky spot is where the two groups meet. Let me write the odds first: 1 3 5 … then 2 4 6 …. The join is the largest odd number followed by 2."

#### Intuition

Inside the odd group, consecutive entries differ by exactly 2; the same holds inside the even group. So the whole question reduces to one pair: the last odd number and the first even number, which is 2. The last odd number is n or n − 1, whichever is odd. That is at least 5 when n ≥ 5, so its difference from 2 is at least 3. At n = 4, though, the last odd number is 3, and `1 3 2 4` puts 3 next to 2. That case gets a hard-coded answer.

#### Algorithm

1. Read n.
2. If n is 2 or 3, print `NO SOLUTION`.
3. If n is 4, print `2 4 1 3`.
4. Otherwise append 1, 3, 5, … up to n, then 2, 4, 6, … up to n, to one `StringBuilder`, and print it.

#### Why it is correct

- **It prints a permutation.** The two loops visit every odd and every even number from 1 to n once.
- **No neighbours inside a group differ by 1.** They differ by exactly 2.
- **The join is safe for n ≥ 5.** It is (largest odd ≤ n, 2), and the largest odd is at least 5, so the difference is at least 3. For n = 1 there is no even group and no join at all.
- **n = 4 is handled by hand,** and `2 4 1 3` has differences 2, 3, 2.
- **n = 2 and n = 3 truly have no answer.** For n = 2 both orders contain the pair (1, 2). For n = 3, the number 2 has at least one neighbour, which is 1 or 3, both one away.

#### Dry run

n = 7

| Step | Appended | Output so far |
|---|---|---|
| odd loop | 1, 3, 5, 7 | `1 3 5 7` |
| even loop | 2, 4, 6 | `1 3 5 7 2 4 6` |

The join is 7 → 2, a difference of 5. All other neighbours differ by 2. For n = 4 the general rule would print `1 3 2 4`; the patch prints `2 4 1 3` instead.

#### Java code

```java title="Approach 1: odds then evens, n = 4 patched"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        if (n == 2 || n == 3) {               // no beautiful permutation exists
            System.out.println("NO SOLUTION");
            return;
        }
        if (n == 4) {                         // odds-then-evens would put 3 next to 2
            System.out.println("2 4 1 3");
            return;
        }
        StringBuilder out = new StringBuilder();
        for (int x = 1; x <= n; x += 2) out.append(x).append(' ');   // 1 3 5 ...
        for (int x = 2; x <= n; x += 2) out.append(x).append(' ');   // 2 4 6 ...
        System.out.println(out);
    }
}
```

#### Time complexity

**O(n).** Each loop runs about n/2 times and appends one number. `StringBuilder` grows its buffer by copying when it fills up; the total copying stays proportional to the final length, so building the line is O(n) overall.

#### Space complexity

**O(n) for the output buffer,** about 6.9 million characters at n = 10^6. That buffer is the output itself; apart from it the program uses O(1).

#### The bridge to the next approach

> "It works, but a special case for n = 4 is a smell: it means the rule is fragile at its join. The join is fragile because 2, the smallest even number, sits next to the largest odd number, and for n = 4 those are 2 and 3. What if I swap the groups? Then the join is the largest even number followed by 1."

### Approach 2: Even numbers first, then odd numbers (recommended)

#### What I say out loud

> "I print 2 4 6 … first, then 1 3 5 …. Inside each group the gap is 2. The join is the largest even number followed by 1. For n ≥ 4 the largest even number is at least 4, so the gap at the join is at least 3. n = 1 prints just `1`. Only n = 2 and n = 3 need `NO SOLUTION`, and I've shown by hand that those have none."

#### Intuition

Putting the even group first moves 1, the smallest number, to the join. The number next to it is the largest even number, which is far from 1 as soon as there are two even numbers. The rule no longer has a weak case at n = 4: `2 4 1 3` comes out of the general loops.

#### Algorithm

1. Read n.
2. If n is 2 or 3, print `NO SOLUTION`.
3. Otherwise append 2, 4, 6, … up to n, then 1, 3, 5, … up to n, to one `StringBuilder`, and print it once.

#### Why it is correct

- **Valid output only.** Every number 1..n appears exactly once (one loop per parity). Neighbours in the same group differ by 2. The single cross-group pair is (largest even ≤ n, 1); for n ≥ 4 the largest even is at least 4, so the difference is at least 3. For n = 1 the even group is empty, the output is `1`, and there is no pair to check.
- **No missed answers.** The program prints `NO SOLUTION` only for n = 2 and n = 3, and exhaustion shows those have none: for n = 2 both orders put 1 next to 2; for n = 3 the middle value 2 always has a neighbour from {1, 3}. For every other n it prints a valid arrangement.

**The 20-second version:** "Same-parity numbers never differ by 1, so I print the evens then the odds. Inside a group the gap is 2. The only cross pair is the largest even next to 1, which is at least 4 next to 1 once n ≥ 4. n = 1 is just `1`, and n = 2 and 3 are impossible because 2 always touches 1 or 3."

#### Dry run

n = 6

| Step | Appended | Output so far |
|---|---|---|
| even loop | 2, 4, 6 | `2 4 6` |
| odd loop | 1, 3, 5 | `2 4 6 1 3 5` |

Differences: 2, 2, 5, 2, 2. For n = 4 the same code prints `2 4 1 3` (join 4 → 1), and for n = 5 it prints `2 4 1 3 5`, which is a different answer from the sample but equally valid.

#### Java code

```java title="Approach 2: evens then odds (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        if (n == 2 || n == 3) {               // proved impossible by checking every order
            System.out.println("NO SOLUTION");
            return;
        }
        StringBuilder out = new StringBuilder();
        for (int x = 2; x <= n; x += 2) out.append(x).append(' ');   // evens: 2 4 6 ...
        for (int x = 1; x <= n; x += 2) out.append(x).append(' ');   // odds:  1 3 5 ...
        System.out.println(out);
    }
}
```

#### Time complexity

**O(n),** for the same reason as Approach 1: n appends in total, and the buffer's growth copies add up to O(n). Measured on my machine (JDK 26, output to `/dev/null`), the whole program at n = 10^6, JVM start included, takes about 0.06 s.

#### Space complexity

**O(n) for the output buffer;** O(1) besides it.

## 5. Comparison table

n is the input number. Nothing here is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Backtracking over orders (prose only, small n) | exponential | exponential | O(n) recursion |
| 1. Odds then evens, n = 4 patched | O(n) | O(n) | O(n) output buffer |
| 2. Evens then odds | O(n) | O(n) | O(n) output buffer |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Backtracking over orders | Decides existence exactly, finds the pattern | Useless beyond n ≈ 10 | On paper or in a scratch file, to discover which n fail |
| 1. Odds then evens | Same speed | Needs a special case at n = 4 that is easy to forget | Only if you have already written it and the case is handled |
| 2. Evens then odds | No special case beyond the impossible n; short proof | None worth noting | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is O(n), and any correct program must print n numbers, so nothing faster exists in the sense that matters. The only real optimization left is constant-factor output speed, and one `StringBuilder` printed once already brings the whole run to about 0.06 s on my machine.

Stop once the proof is clean. The time should go into the two things that actually fail on submission: n = 1 and the join at n = 4.

## 7. Interview script: code it and test it

### What I say while coding

> "One number of input, so a `BufferedReader` and `parseInt` are plenty. The output is the heavy part: up to a million numbers. Calling `System.out.print` once per number goes through the stream's locking and character encoding on every call; I measured about 1.2 s for n = 10^6 that way, which is over the limit. So I append everything to one `StringBuilder` and print once."

> "First the impossible cases: exactly 2 and 3. Not `n < 4`, because n = 1 has an answer."

> "Two loops with step 2: evens from 2, odds from 1. A trailing space is fine."

### Testing out loud

**Normal case, n = 5:** evens 2, 4; odds 1, 3, 5. Output `2 4 1 3 5`. Differences 2, 3, 2, 2. It differs from the sample, which is allowed.

**n = 1:** not 2 or 3. The even loop starts at 2 > 1 and does nothing; the odd loop appends 1. Output `1`. Correct.

**n = 2 and n = 3:** `NO SOLUTION`.

**n = 4:** evens 2, 4; odds 1, 3. Output `2 4 1 3`; the join is 4 → 1. Correct, with no special case.

**n = 10^6:** 500,000 evens then 500,000 odds; the join is 1,000,000 → 1. About 6.9 MB of text, printed once.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, small cases by hand | 3 min | Output format, `NO SOLUTION` text; answers for n = 1 to 5 |
| Find and prove the construction | 4–5 min | Parity grouping, the join, why n = 2 and 3 fail |
| Code | 3 min | Approach 2 with fast output |
| Trace | 2 min | n = 1, 3, 4, 5 |

Most of the time belongs to small cases and the join. If no rule comes to mind, write out the answers you found for n = 4, 5, 6 and look at the parity of each position.

## 9. Interviewer challenges

### About correctness

#### Why not odd numbers first? It is symmetric.

**What they are testing:** whether you checked the join or only the inside of each group.

**How to reason:** the groups are not symmetric at the join: one order puts 2 next to the largest odd, the other puts 1 next to the largest even.

**What I say:** "Odds first gives `1 3 2 4` at n = 4: the largest odd is 3 and it sits next to 2. From n = 5 on it works, so it needs a special case at 4. Evens first puts 1 next to the largest even, which is at least 4 whenever there are two evens, so there is no weak case."

**Nuance:** the sample's own pattern, evens descending then odds descending (`4 2 5 3 1`), fails at n = 4 too: it prints `4 2 3 1`, where 2 and 3 meet.

#### How do you know n = 2 and n = 3 have no solution, and nothing larger?

**What they are testing:** whether "no solution" is proved or guessed.

**How to reason:** small n by exhaustion; every other n by the construction itself.

**What I say:** "For n = 2 both orders contain 1 next to 2. For n = 3, 2 has at least one neighbour and every candidate, 1 or 3, is one away. For n = 1 and every n ≥ 4 my construction prints a valid arrangement, so those all have a solution."

**Nuance:** a backtracking search for n ≤ 9 confirms the same set; the test file runs it.

### About performance

#### Would `Scanner` and `System.out.println` per number pass?

**What they are testing:** awareness that Java I/O can dominate an O(n) program.

**How to reason:** the input is one token, so `Scanner` costs nothing noticeable here. The output is a million tokens.

**What I say:** "Reading is fine either way: one number. Printing a million numbers one call at a time took about 1.2 s on my machine, against 0.06 s with one `StringBuilder`. On a 1-second limit that is the difference between accepted and time limit exceeded."

**Nuance:** a `PrintWriter` wrapped around a `BufferedOutputStream` and flushed once is equally good. The point is one buffered write, not the specific class. Timings depend on the machine and JVM.

## 10. Follow-up questions the interviewer might ask

**"Neighbours must differ by at least k, not just more than 1. For which n is it possible?"**
Generalize the grouping: split by residue mod k, each group has internal gaps of k, and the joins need checking. The pattern of impossible small n changes with k, so I would brute-force small n first, as here. Still O(n) output once the rule is found.

**"Count the beautiful permutations of 1..n."**
Construction no longer helps. A bitmask DP over (set of used numbers, last number) counts them in O(2^n · n^2) time for small n. For large n this is Hertzsprung's problem, a known sequence with a recurrence, which I would look up rather than derive in an interview.

**"n is up to 10^18. Print only the value at position p."**
Do not build the list. With m = ⌊n/2⌋ even numbers in front, position p (1-based) holds 2p when p ≤ m, and 2(p − m) − 1 otherwise. O(1) time and space, using `long`.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Checking only inside the groups.** The join is the one place the construction can fail; odds-then-evens fails there at n = 4.
- **Treating the sample as the required answer.** Any beautiful permutation is accepted. Copying the sample's pattern (evens descending, odds descending) also fails at n = 4.
- **Guessing which n are impossible.** Prove n = 2 and 3 by exhaustion and let the construction cover the rest.

### Implementation mistakes

> [!MISTAKE] `if (n < 4)` instead of `n == 2 || n == 3`
> For n = 1 this prints `NO SOLUTION`, but `1` is a valid answer: a single number has no neighbours.

- **Odds first without the n = 4 case.** Prints `1 3 2 4` (verified), which has 3 next to 2.
- **Printing number by number.** About 1.2 s at n = 10^6 on my machine, over the limit; build one `StringBuilder` and print once.
- **Wrong failure text.** `NO`, `No Solution` or `-1` are all wrong; the judge expects `NO SOLUTION`.

## 12. Pattern recognition

**The pattern:** constructive output. The problem asks for *any* object with a property, so instead of searching, you find a rule that builds one and prove it. Brute force on small inputs is how you find the rule and the exceptions.

**Signals in the problem statement:**

- "Print any …" or "if there are several solutions, print any of them".
- n so large that search is impossible, with an output of size n.
- A local condition on neighbours, which suggests grouping elements so that neighbours share a property (here parity).

**Related problems in this list:**

- [[cses-two-sets|Two Sets]]: another introductory construction, where a parity argument decides when an answer exists.
- [[cses-gray-code|Gray Code]]: build a sequence in which neighbours satisfy a local condition (differ in exactly one bit).
- [[cses-creating-strings|Creating Strings]]: generating every permutation, the brute-force tool used here on small n.
- [[nc-permutations|Permutations]]: backtracking over all orders, the same search written as an interview problem.

**Takeaway:** when any valid answer is accepted, look for a rule, then check where its parts meet, for the smallest input where they meet.

## 13. 60-second revision card

**Key insight:** numbers that differ by 1 have different parity, so evens then odds keeps every same-group pair 2 apart; the one cross pair is (largest even, 1).

**Invariant:** each group is increasing in steps of 2; the join is at least 4 → 1 when n ≥ 4.

**Complexity:** O(n) time; O(n) output buffer, O(1) besides it.

**Code skeleton:**

```java title="Permutations in a few lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        int n = Integer.parseInt(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        if (n == 2 || n == 3) { System.out.println("NO SOLUTION"); return; }
        StringBuilder out = new StringBuilder();
        for (int x = 2; x <= n; x += 2) out.append(x).append(' ');
        for (int x = 1; x <= n; x += 2) out.append(x).append(' ');
        System.out.println(out);
    }
}
```

**Main traps:**

- n = 1 prints `1`; only 2 and 3 are impossible.
- Odds first breaks at n = 4 (`1 3 2 4`).
- One buffered print, not a million.

**What to say in one breath:** "Same parity never differs by 1, so I print the evens then the odds; the only cross pair is the largest even next to 1, safe once n ≥ 4. n = 1 is `1`, and n = 2 and 3 are impossible because 2 always touches 1 or 3. O(n), with one buffered print."
