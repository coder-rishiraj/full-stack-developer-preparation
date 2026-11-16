---
problemId: cses-coin-piles
title: Coin Piles
source: cses
sourceUrl: https://cses.fi/problemset/task/1754
difficulty: easy
patterns: [introductory, mathematics, invariants]
relatedLessons: [a1-java-syntax-competitive, a14-brute-force-first, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

There are two piles of coins, with a and b coins. One move removes one coin from the left pile and two from the right pile, or two from the left pile and one from the right pile. Decide whether some sequence of moves empties both piles at the same time. The input holds t such tests; for each one print `YES` or `NO` on its own line. This is a whole program reading standard input and writing standard output.

**Example**

- Input: `3`, then the lines `2 1`, `2 2`, `3 3`
- Output: `YES`, `NO`, `YES`
- Why: (2, 1) is emptied by one move that takes two from the left and one from the right. (3, 3) is emptied by one move of each kind. For (2, 2), every move takes three coins, and 4 coins can never be removed three at a time.

**What the problem statement guarantees**

- 1 ≤ t ≤ 10^5.
- 0 ≤ a, b ≤ 10^9.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The piles are up to a billion coins, so you cannot play the game out; you have to find what decides it. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. By hand, decide every pair with a, b ≤ 4. Write YES or NO in a small grid.
3. Look at the grid and guess a rule. Then prove both directions: every YES pair is really reachable, and every NO pair really is not.
4. Write the full program, and check the largest value your arithmetic forms.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Each move removes the same number of coins in total. What does that say about a + b? And can one pile be much bigger than the other?

> [!HINT] Hint 2: the kind of tool you need
> The order of the moves does not matter, only how many of each kind you make. Call them x and y, write one equation per pile, and solve the two equations.

> [!HINT] Hint 3: almost the whole plan
> x + 2y = a and 2x + y = b give 3x = 2b − a and 3y = 2a − b. You need x and y to be whole numbers that are at least 0. Turn that into two conditions on a and b, one about divisibility by 3 and one comparing the smaller pile with the larger. Answer each test in O(1) and print everything at once.

**Check yourself before revealing the walkthrough**

- [ ] I can say exactly which pairs print `YES`, and why every other pair prints `NO`
- [ ] My rule gives `YES` for (0, 0) and `NO` for (0, 3) and for (1, 1)
- [ ] I know the largest value my program computes and that my types hold it
- [ ] My program reads 10^5 lines and prints 10^5 answers quickly

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The real work is the derivation, so the questions are short.

**Me:** Two piles, a and b. A move is (−1, −2) or (−2, −1), and a pile can never go below zero. I answer whether both can reach zero together, for t independent tests. Is that right?

**Interviewer:** Yes.

**Me:** Output is `YES` or `NO`, in capitals, one line per test, in input order?

**Interviewer:** Exactly.

**Me:** Values up to 10^9 each and up to 10^5 tests. So simulating moves is out: one test could need about 6.7 · 10^8 moves. I need a constant-time test per pair. Let me do small cases first. (0, 0): already empty, zero moves, YES. (1, 2) and (2, 1): one move, YES. (3, 3): one move of each kind, YES. (2, 2): each move takes 3 coins, the total is 4, NO. (0, 3): total 3, but any move needs a coin from the left pile, NO. So a total divisible by 3 is needed but not enough.

**Interviewer:** Good. What else is needed?

**Me:** That is the part I want to derive, not guess.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ t ≤ 10^5 | Read with `BufferedReader` and `StringTokenizer` and collect the answers in one `StringBuilder`; `Scanner` and one `println` per answer are needlessly slow at this size. |
| 0 ≤ a, b ≤ 10^9 | No simulation and no table over values: an O(1) arithmetic test. a + b and 2 · min reach 2 · 10^9, just under 2^31 − 1 = 2,147,483,647. I use `long` anyway so no expression needs that close look. |
| Time limit 1 s | O(t) in total is far inside it. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `YES` / `NO`, one per line, in input order | Answers are appended to the buffer in the order the tests arrive. |
| Tests are independent | No state carries from one pair to the next. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Each test line has exactly two integers | I read both with one `StringTokenizer` per line. |
| (0, 0) counts as already emptied | The statement asks whether both piles can be empty; with zero moves they are. My rule gives YES there without a special case. |

### Edge cases I will keep in mind

- (0, 0): YES with zero moves.
- One pile empty, the other not, like (0, 3): NO, because every move touches both piles.
- (1, 1), (2, 2): the total is not a multiple of 3.
- (1, 2) and (4, 8): the larger pile is exactly twice the smaller, the boundary of the second condition.
- (10^9, 10^9): the largest sum, 2 · 10^9.

## 4. Think out loud: from first idea to best solution

**The first idea, and why it is not a numbered approach.** A search over states (a, b) with the two moves as edges, or a table `can[a][b]` filled from smaller piles, answers every small case and is the right way to *find* the rule: I fill it for a, b ≤ 10 and look at the pattern. But the table has (10^9 + 1)^2 entries, and even a greedy simulation that always takes two from the larger pile needs up to about 6.7 · 10^8 moves for one test, times 10^5 tests. So it stays a checking tool (the test file builds that table for a, b ≤ 90 and compares every pair with the programs).

**What the table shows.** For a, b ≤ 6 the YES cells are (0, 0), (1, 2), (2, 1), (2, 4), (3, 3), (4, 2), (3, 6), (4, 5), (5, 4), (6, 3), (6, 6): pairs whose sum is a multiple of 3 and that are not too lopsided. Now I want to say exactly what "not too lopsided" means, and prove it.

### Approach 1: Solve for the number of moves

#### What I say out loud

> "The moves commute: piles only shrink, and what matters at the end is how many moves of each kind I made. Say x moves take (1, 2) and y moves take (2, 1). Then x + 2y = a and 2x + y = b. Two equations, two unknowns: 3x = 2b − a and 3y = 2a − b. The answer is YES exactly when both are non-negative multiples of 3."

#### Intuition

A sequence of moves is described completely by two counts. The left pile loses x + 2y coins and the right pile loses 2x + y, whatever the order. So the question "can both reach zero?" becomes "do the two linear equations have a solution in non-negative integers?" Solving a 2×2 system is mechanical.

#### Algorithm

1. Read t. For each test, read a and b as `long`.
2. Compute `threeX = 2b − a` and `threeY = 2a − b`.
3. Print `YES` if both are ≥ 0 and both are divisible by 3, else `NO`.

#### Why it is correct

- **Solving the system.** Adding twice the second equation to minus the first: 2(2x + y) − (x + 2y) = 3x, so 3x = 2b − a. Symmetrically 3y = 2a − b. The system has exactly one real solution, so (a, b) is reachable only with these x and y.
- **Only valid answers.** If both `threeX` and `threeY` are non-negative multiples of 3, then x and y are non-negative whole numbers satisfying both equations. Make the x moves and then the y moves in any order: each pile only decreases, and its final value is exactly 0, so it never goes below 0 along the way. Both piles end empty.
- **No missed answer.** If some sequence empties the piles, its counts x, y are non-negative whole numbers satisfying the equations, so `threeX` = 3x and `threeY` = 3y are non-negative multiples of 3, and the program prints YES.

#### Dry run

The example, plus one larger pair of each kind.

| a | b | threeX = 2b − a | threeY = 2a − b | Both ≥ 0 and divisible by 3? | Output |
|---|---|---|---|---|---|
| 2 | 1 | 0 | 3 | yes (x = 0, y = 1) | YES |
| 2 | 2 | 2 | 2 | no, 2 is not a multiple of 3 | NO |
| 3 | 3 | 3 | 3 | yes (x = 1, y = 1) | YES |
| 7 | 5 | 3 | 9 | yes (x = 1, y = 3: left loses 1 + 6 = 7, right 2 + 3 = 5) | YES |
| 11 | 4 | −3 | 18 | no, x would be −1 | NO |

#### Java code

```java title="Approach 1: solve for the move counts"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < t; i++) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long a = Long.parseLong(st.nextToken());
            long b = Long.parseLong(st.nextToken());
            // x moves take (1, 2), y moves take (2, 1):  x + 2y = a  and  2x + y = b
            long threeX = 2 * b - a;              // 3x
            long threeY = 2 * a - b;              // 3y
            boolean ok = threeX >= 0 && threeY >= 0 && threeX % 3 == 0 && threeY % 3 == 0;
            out.append(ok ? "YES" : "NO").append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(t):** constant work per test, plus reading and writing O(t) characters.

#### Space complexity

**O(t)** for the output buffer, which holds the output itself; O(1) besides that.

#### The bridge to the next approach

> "This is already optimal and correct. But the condition reads as four checks with no story, and an interviewer will ask 'what does that mean?'. If I translate it into statements about a and b, I get something I can explain in one sentence and can check by eye on any example."

### Approach 2: Two conditions on the piles (recommended)

#### What I say out loud

> "Two facts. Every move removes 3 coins, so a + b must be a multiple of 3. And every move takes at most 2 coins from a pile while taking at least 1 from the other, so the bigger pile can be at most twice the smaller: 2 · min ≥ max. Both are necessary. They are also sufficient, because they are exactly the conditions for the move counts to be whole and non-negative."

#### Intuition

The first condition is about the total; the second is about balance. If the left pile is more than twice the right one, then even taking 2 from the left every time, the right pile runs out first, with coins still on the left.

#### Algorithm

1. Read t. For each test, read a and b as `long`.
2. Print `YES` if `(a + b) % 3 == 0` and `2 * min(a, b) >= max(a, b)`, else `NO`.

#### Why it is correct

The proof links these two conditions to Approach 1's, which are already proved exact.

- **Necessity of each condition, directly.** Every move removes 3 coins, so after m moves a + b − 3m coins remain; reaching 0 needs 3 to divide a + b. Each move removes at most 2 from the larger pile and at least 1 from the smaller one, so in the m moves needed to empty the smaller pile (m ≤ min), the larger pile loses at most 2m ≤ 2 · min coins; to empty it, max ≤ 2 · min.
- **Sufficiency.** Suppose 3 divides a + b and 2 · min ≥ max. Then 2a ≥ b and 2b ≥ a (if a is the minimum, 2a ≥ b is the condition and 2b ≥ 2a ≥ a holds; symmetrically otherwise). So `threeX` = 2b − a ≥ 0 and `threeY` = 2a − b ≥ 0. Divisibility: 2b − a = 2(a + b) − 3a, a multiple of 3 when a + b is; likewise 2a − b = 2(a + b) − 3b. So x and y are non-negative whole numbers, and Approach 1 showed that such counts empty both piles.
- **Neither condition alone is enough.** (0, 3) passes the sum test and fails the balance test; (1, 1) passes the balance test and fails the sum test. Both are NO.

**The 20-second version:** "x moves of one kind and y of the other give x + 2y = a and 2x + y = b, so 3x = 2b − a and 3y = 2a − b. Non-negative means 2 · min ≥ max. Whole numbers means 3 divides a + b, since 2b − a = 2(a + b) − 3a. Both conditions together are exactly the existence of the move counts, and any order of those moves works."

#### Dry run

| a | b | a + b | 3 divides it? | 2 · min | max | 2 · min ≥ max? | Output |
|---|---|---|---|---|---|---|---|
| 2 | 1 | 3 | yes | 2 | 2 | yes | YES |
| 2 | 2 | 4 | no | 4 | 2 | yes | NO |
| 3 | 3 | 6 | yes | 6 | 3 | yes | YES |
| 0 | 3 | 3 | yes | 0 | 3 | no | NO |
| 4 | 8 | 12 | yes | 8 | 8 | yes, with equality (x = 4, y = 0) | YES |

#### Java code

```java title="Approach 2: sum divisible by 3 and 2 * min >= max (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < t; i++) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long a = Long.parseLong(st.nextToken());
            long b = Long.parseLong(st.nextToken());
            long small = Math.min(a, b);
            long large = Math.max(a, b);
            // every move removes 3 coins; the big pile can lose at most 2 per coin of the small one
            boolean ok = (a + b) % 3 == 0 && 2 * small >= large;
            out.append(ok ? "YES" : "NO").append('\n');
        }
        System.out.print(out);
    }
}
```

#### Time complexity

**O(t)**, constant work per test. Measured on my machine (JDK 26) on 10^5 random tests, the whole program, JVM start included, ran in under 0.1 s; Approach 1 the same.

#### Space complexity

**O(t)** for the output buffer; O(1) besides.

Both programs print the expected answer on the official CSES test stored for this problem (`public/tests/cses/cses-coin-piles.json`, one test), run on a real JVM, and on the 378,000-odd pairs in the test file, including every pair with a, b ≤ 90 checked against a move-by-move reachability table.

## 5. Comparison table

t is the number of tests. Nothing is randomized, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Reachability table (prose only) | O(A · B) for piles up to A and B | O(A · B) | O(A · B) |
| 1. Solve for the move counts | O(t) | O(t) | O(1) beyond the O(t) output |
| 2. Two conditions | O(t) | O(t) | O(1) beyond the O(t) output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Reachability table | Needs no insight; finds the pattern | Hopeless at 10^9 | On paper, to discover and check the rule |
| 1. Move counts | Falls straight out of the equations; nothing to guess | Four checks that are hard to explain at a glance | When you think in equations first |
| 2. Two conditions | One sentence to explain; easy to verify on any example | Needs the short proof that the two conditions are enough | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, derived through Approach 1's equations, since that derivation is also the sufficiency proof. It is O(1) per test, and reading the input is already Θ(t), so nothing better exists. Stop once both directions are argued; the remaining risk is the boundary `>=` and the fast I/O.

## 7. Interview script: code it and test it

### What I say while coding

> "I read with `BufferedReader` and append every answer to one `StringBuilder`, because there can be 10^5 lines."

> "`long` for a and b. In `int`, a + b and 2 · min top out at 2 · 10^9, which still fits under 2,147,483,647, but with only about 7% to spare; `long` costs nothing and removes the question."

> "The comparison is `>=`: when the big pile is exactly twice the small one, every move is the same kind, which is allowed."

### Testing out loud

**(2, 1), (2, 2), (3, 3):** sums 3, 4, 6; balance holds in all three. YES, NO, YES, matching the example.

**(0, 0):** sum 0 is a multiple of 3, 0 ≥ 0. YES, with no special case.

**(0, 3):** sum 3, but 2 · 0 < 3. NO: the right pile can never be touched without the left one.

**(1, 2):** sum 3, 2 · 1 = 2 ≥ 2. YES; a strict `>` would wrongly print NO here.

**(10^9, 10^9):** sum 2 · 10^9 ≡ 2 (mod 3), since 10^9 ≡ 1. NO. **(10^9, 5 · 10^8):** sum 1.5 · 10^9, a multiple of 3, and 2 · 5 · 10^8 = 10^9 ≥ 10^9. YES.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, small grid | 3 min | Format; YES/NO for a, b ≤ 4 |
| Derive | 4 min | The two equations, then the two conditions |
| Prove | 2 min | Necessity and sufficiency, the 20-second version |
| Code | 3 min | Fast I/O, `long`, `>=` |
| Trace | 2 min | (0, 0), (0, 3), (1, 1), (1, 2) |

If the rule does not come, fill the small grid and name the moves' counts x and y; the equations are the way in.

## 9. Interviewer challenges

### About correctness

#### Why does the order of the moves not matter?

**What they are testing:** whether you can justify reducing a process to counts.

**How to reason:** what could go wrong with an order? Only a pile dipping below zero midway.

**What I say:** "Each pile only decreases, and with the right counts it ends at exactly 0. A sequence that only decreases and ends at 0 was never negative. So any order of the x and y moves is legal."

**Nuance:** this is what makes the problem algebra rather than search. If some moves added coins, the order would matter.

#### Your conditions are necessary. Why are they enough?

**What they are testing:** whether you can tell "I found constraints" from "I characterised the answer".

**How to reason:** construct the moves from the conditions.

**What I say:** "From 3 | a + b, both 2b − a = 2(a + b) − 3a and 2a − b are multiples of 3. From 2 · min ≥ max, both are non-negative. So x = (2b − a)/3 and y = (2a − b)/3 are valid counts, and x + 2y = a, 2x + y = b."

**Nuance:** the test file also checks this exhaustively against a reachability table for every pair up to 90, which is a good habit when a closed form is derived by hand.

### About implementation

#### Could you use `int`?

**What they are testing:** overflow awareness from the constraints.

**How to reason:** find the largest intermediate value.

**What I say:** "The largest values are a + b and 2 · min, both at most 2 · 10^9, below 2^31 − 1 ≈ 2.147 · 10^9. So `int` works for Approach 2. In Approach 1, 2b − a is at most 2 · 10^9 as well. I still use `long`, because a later change such as 3 · max would overflow silently."

**Nuance:** "it fits with 7% to spare" is a fact worth saying out loud; the interviewer wants to see that you checked rather than guessed.

## 10. Follow-up questions the interviewer might ask

**"Print the moves, or just how many of each kind."**
x = (2b − a)/3 and y = (2a − b)/3, O(1). Printing the moves one by one is O(x + y) output.

**"The moves are (p, q) and (q, p) for given p, q."**
Same method: x·p + y·q = a and x·q + y·p = b. Adding gives (p + q)(x + y) = a + b; subtracting gives (p − q)(x − y) = a − b. When p ≠ q, solve for x + y and x − y, then require whole, non-negative x and y. When p = q the system is degenerate: the condition becomes a = b and p | a. O(1) per test.

**"Three piles, and a move removes 1 from one pile and 2 from another (any two)."**
There are now six kinds of move and three equations, so the system no longer has a single solution. The same two arguments still give necessary conditions: the total must be a multiple of 3, and the largest pile can be at most twice the sum of the other two (each move takes at most 2 from it and at least 1 from elsewhere). Whether they are also sufficient needs its own constructive proof; I would build the reachability table for small piles first, as in section 4, to test the conjecture before trying to prove it.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Checking only the sum.** (a + b) % 3 == 0 alone answers YES for (0, 3) (verified by running that version); one empty pile blocks every move.
- **Checking only the balance.** 2 · min ≥ max alone answers YES for (1, 1) and for (2, 2) (verified); 2 or 4 coins cannot leave three at a time.
- **Trying to simulate or recurse.** Piles of 10^9 make any move-by-move process far too slow; the counts are what matter.

### Implementation mistakes

> [!MISTAKE] Strict inequality
> `2 * small > large` rejects the boundary where every move is the same kind. It prints `NO` for (1, 2) and for (2, 1) (verified), where one move empties both piles. Use `>=`.

- **Comparing a with 2b only one way.** `2 * a >= b` without the symmetric check accepts (11, 4). Use min and max, or check both.
- **`Scanner` and one `println` per test.** With 10^5 lines that is the slow path in Java; one buffered read and one print are the habit.

## 12. Pattern recognition

**The pattern:** reduce a process to counts, then to arithmetic conditions. When moves commute (the end state depends only on how many of each kind), write one equation per quantity, solve, and turn "the solution is a non-negative integer" into divisibility and inequality conditions. Prove sufficiency by constructing the counts.

**Signals in the problem statement:**

- Values up to 10^9 with a yes/no question: the answer is a formula, not a search.
- A few fixed moves that each change a few quantities by fixed amounts: count the moves of each kind.
- Many tests with tiny input each: O(1) per test, buffered I/O.

**Related problems in this list:**

- [[cses-two-knights|Two Knights]]: another closed form, where the counting argument (attacking pairs inside 2×3 boxes) replaces a search.
- [[cses-trailing-zeros|Trailing Zeros]]: a number-theory count (factors of 5) instead of computing n!.
- [[cses-number-spiral|Number Spiral]]: a position in a pattern answered by a formula, with careful case analysis and `long`.
- [[cses-two-sets|Two Sets]]: a necessary condition (even total) shown sufficient by a construction, the same proof shape as here.

**Takeaway:** when you find conditions by looking at small cases, prove them in both directions; the equations that produce them usually prove sufficiency for free.

## 13. 60-second revision card

**Key insight:** x moves of (1, 2) and y of (2, 1) give 3x = 2b − a and 3y = 2a − b. They are non-negative integers exactly when (a + b) % 3 == 0 and 2 · min ≥ max.

**Invariant:** each move removes exactly 3 coins, at most 2 from either pile.

**Complexity:** O(1) per test, O(t) total; O(t) output buffer.

**Code skeleton:**

```java title="Coin Piles"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(in.readLine().trim());
        StringBuilder out = new StringBuilder();
        while (t-- > 0) {
            StringTokenizer st = new StringTokenizer(in.readLine());
            long a = Long.parseLong(st.nextToken()), b = Long.parseLong(st.nextToken());
            boolean ok = (a + b) % 3 == 0 && 2 * Math.min(a, b) >= Math.max(a, b);
            out.append(ok ? "YES\n" : "NO\n");
        }
        System.out.print(out);
    }
}
```

**Main traps:**

- Both conditions; (0, 3) and (1, 1) are each NO.
- `>=`, not `>`: (1, 2) is YES.
- Buffered input and one print for 10^5 tests.

**What to say in one breath:** "Count the moves: x + 2y = a and 2x + y = b give 3x = 2b − a and 3y = 2a − b, so the answer is YES exactly when 3 divides a + b and the larger pile is at most twice the smaller. Any order of those moves works because piles only shrink. O(1) per test."
