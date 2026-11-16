---
problemId: cses-range-xor-queries
title: Range Xor Queries
source: cses
sourceUrl: https://cses.fi/problemset/task/1650
difficulty: easy
patterns: [range-queries, prefix-sum, bit-manipulation]
relatedLessons: [a2-prefix-suffix, a13-and-or-xor, a13-xor-tricks, a1-java-syntax-competitive, a12-fenwick, a14-deriving-optimization]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of n positive integers x_1, …, x_n and then q questions. Each question names two positions a ≤ b and asks for x_a ⊕ x_(a+1) ⊕ … ⊕ x_b, where ⊕ is bitwise exclusive or (`^` in Java): the "xor sum" of the range. Print one answer per line. The array never changes. This is a whole program: it reads standard input and writes standard output.

**Example** (the one in the CSES statement)

Input:

```text
8 4
3 2 4 5 1 1 5 3
2 4
5 6
1 8
3 3
```

Output:

```text
3
0
6
4
```

- `2 4` is 2 ⊕ 4 ⊕ 5. In binary, 010 ⊕ 100 = 110, and 110 ⊕ 101 = 011, which is 3.
- `5 6` is 1 ⊕ 1 = 0: a value XORed with itself gives 0, even though every value is at least 1.
- `1 8` is the whole array, 6, and `3 3` is the single value 4.

**What the problem statement guarantees**

- 1 ≤ n, q ≤ 2 · 10^5.
- 1 ≤ x_i ≤ 10^9.
- 1 ≤ a ≤ b ≤ n for every question.
- Time limit 1 second, memory limit 512 MB.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. Everything below this section stays hidden until you ask for it. The interviewer wants more than a fast program here: they want you to say *why* the fast program is correct, in terms of what XOR does.

**How to practise**

1. Set a timer for 15 minutes.
2. Write the direct solution and count its worst-case operations at n = q = 2 · 10^5.
3. Find a way to answer each question in constant time after one pass of preparation.
4. Write down, in two or three sentences, why your formula gives exactly the XOR of positions a..b and nothing else.
5. Work out the largest value any XOR in your program can take, and pick a type.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> What is v ⊕ v? And v ⊕ 0? If you XOR a long list of values and then XOR some of them in a second time, what happens to those?

> [!HINT] Hint 2: the kind of tool you need
> Precompute, for every position i, the XOR of the first i values. Combine two of these to get any range.

> [!HINT] Hint 3: almost the whole plan
> Let p[0] = 0 and p[i] = p[i − 1] ⊕ x_i. The answer to (a, b) is p[b] ⊕ p[a − 1]: the values before position a appear in both and cancel. Every value is below 2^30, so every XOR is too, and an `int` holds it. Read with a buffered reader and print through one buffer.

**Check yourself before revealing the walkthrough**

- [ ] I know the cost of XORing each range directly, and why it is too slow
- [ ] I can prove my O(1) formula from the properties of XOR, not only test it
- [ ] I know why my type cannot overflow
- [ ] My program prints 0 for the range `1 2` over the values 6 and 6

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had said: "Many questions, one fixed array, each question wants the XOR of a range."

**Me:** I read n and q, n values, then q pairs (a, b), 1-based, and print the XOR of positions a through b inclusive. One answer per line?

**Interviewer:** Yes.

**Me:** "Xor sum" means bitwise exclusive or of all the values, not an arithmetic sum?

**Interviewer:** Right, bitwise XOR of every value in the range.

**Me:** Is a ≤ b always, and does the array stay fixed?

**Interviewer:** Yes to both.

**Me:** And the sizes?

**Interviewer:** n and q up to 2 · 10^5, values from 1 to 10^9, one second.

**Me:** 10^9 is below 2^30 = 1,073,741,824, so every value has at most 30 bits. XOR never creates a bit that none of its inputs has, so every answer is also below 2^30, and an `int` is enough. Unlike a sum, nothing grows with the length of the range.

**Me:** Let me do `5 6` by hand: 1 ⊕ 1 = 0. That's worth noticing: XOR "undoes" a repeated value. And `2 4`: 2 ⊕ 4 = 6, 6 ⊕ 5 = 3. Matches the expected 3.

### Given constraints

These are in the CSES statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 2 · 10^5 | One precomputed `int` per position is 0.8 MB. |
| 1 ≤ q ≤ 2 · 10^5 | O(n) per question is up to 4 · 10^10 operations in total; the per-question work must be O(1) or close to it. |
| 1 ≤ x_i ≤ 10^9 | Every value is below 2^30, so every XOR of values is below 2^30: an `int` suffices, no overflow is possible. |
| 1 ≤ a ≤ b ≤ n | No empty range; the boundary to handle is a = 1. |
| Time limit 1 s | About 6 · 10^5 numbers in, 2 · 10^5 lines out: buffered input, one buffered output. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| "Xor sum" is bitwise XOR | The operation is `^` on `int`; there is no carry between bits, which is why the bound above holds. |
| The array never changes | Preparation is paid once. |
| Positions are 1-based, answers in order | I keep the precomputed values at indices 0..n, with index 0 for "nothing yet". |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input matches the statement | I do not validate a ≤ b. |
| O(n) extra memory is fine | The limit is 512 MB. |

### Edge cases I will keep in mind

- n = 1, and a = b: the answer is the value itself.
- a = 1: nothing comes before the range.
- A range whose values cancel, like `6 6`: the answer is 0, although no value is 0.
- Values near 10^9: the result still fits in 30 bits.

## 4. Think out loud: from first idea to best solution

The ladder is the same as for range sums: compute every range from scratch, then cache block results, then cache "everything up to i". What changes is the reason the last step is allowed. Subtraction undoes addition; for XOR, XOR undoes itself. n is the array length, q the number of questions.

**Measured cost:** each program was run as `java Main < input` on my machine (JDK 26), JVM start-up included (an empty program takes about 0.03 s), at n = q = 2 · 10^5 with values up to 10^9: every question `1 n`, random ranges, and every question `2 n−1` (the worst case for blocks).

### Alternative: XOR each range on demand

Too slow for the largest tests (about 26 s measured), so it is not a numbered approach.

#### What I say out loud

> "For each question, start from 0 and XOR in x_a through x_b. It's right by construction, and the cost is the length of the range: n · q = 4 · 10^10 operations if every question is the whole array."

#### Intuition

0 is the neutral value for XOR (v ⊕ 0 = v), so start there and fold in every value of the range.

#### Algorithm

1. Read the values into `x[1..n]`.
2. For each question (a, b): `xor = 0`; for i = a..b, `xor ^= x[i]`; print `xor`.

#### Why it is correct

The loop visits each position from a to b exactly once and folds its value into the result. XOR is associative, so folding left to right gives the XOR of the whole range.

#### Dry run

| Question | Steps | Answer |
|---|---|---|
| `2 4` | 0 ⊕ 2 = 2, 2 ⊕ 4 = 6, 6 ⊕ 5 = 3 | 3 |
| `5 6` | 0 ⊕ 1 = 1, 1 ⊕ 1 = 0 | 0 |
| `1 8` | 3, 1, 5, 0, 1, 0, 5, 6 | 6 |
| `3 3` | 0 ⊕ 4 = 4 | 4 |

The `1 8` row lists the running XOR after each of the 8 values. Keep it in mind: it reappears in Approach 2.

#### Java code

```java title="Alternative: XOR each range again (too slow at n = q = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt();
        int q = nextInt();
        int[] x = new int[n + 1];              // 1-indexed, like the queries
        for (int i = 1; i <= n; i++) {
            x[i] = nextInt();
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int a = nextInt();
            int b = nextInt();
            int xor = 0;                       // XOR never exceeds 2^30 - 1 here
            for (int i = a; i <= b; i++) {     // walks the whole range every time
                xor ^= x[i];
            }
            out.append(xor).append('\n');
        }
        System.out.print(out);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n · q) in the worst case:** every question can be `1 n`. Measured with every question `1 n` at n = q = 2 · 10^5: **about 26 s**.

#### Space complexity

**O(n)** for the values; the output buffer is O(q) characters in every approach.

#### The bridge to the next approach

> "Every question re-XORs values that other questions already combined. The array is fixed, so I can combine chunks of it once. Blocks of about √n values, each with its stored XOR: a question becomes at most two partial blocks and the whole blocks between them."

### Approach 1: Block XORs (square-root decomposition)

#### What I say out loud

> "I cut the array into blocks of ⌊√n⌋ + 1 values and store each block's XOR. A question walks single values up to a block boundary, takes whole blocks by their stored XOR, then walks the remaining single values. About 3√n steps per question, around 1,300 at the limits."

#### Intuition

The same ruler idea as for sums: count the small units only near the ends, and the big units in between. XOR is associative and commutative, so the grouping into blocks does not change the result.

#### Algorithm

1. `size = ⌊√n⌋ + 1`; `block[i / size] ^= x[i]` for every 0-based i.
2. For each question, l = a − 1, r = b − 1:
   - while l ≤ r and l % size ≠ 0: `xor ^= x[l++]`;
   - while l + size − 1 ≤ r: `xor ^= block[l / size]`, l += size;
   - while l ≤ r: `xor ^= x[l++]`.
3. Print `xor`.

#### Why it is correct

The three loops cover l..r once, left to right, without gaps: each step consumes either one position or one whole block that lies inside the range (the middle loop starts on a block boundary and checks that the block ends by r). Because XOR is associative, XORing a block's stored value equals XORing its values one by one.

#### Dry run

n = 8, so size = 3; blocks `[3, 2, 4]`, `[5, 1, 1]`, `[5, 3]` with XORs 3 ⊕ 2 ⊕ 4 = 5, 5 ⊕ 1 ⊕ 1 = 5, 5 ⊕ 3 = 6.

| Question | 0-based l..r | Left singles | Whole blocks | Right singles | Answer |
|---|---|---|---|---|---|
| `2 4` | 1..3 | 2, 4 | none | 5 | 2 ⊕ 4 ⊕ 5 = 3 |
| `5 6` | 4..5 | 1, 1 | none | none | 0 |
| `1 8` | 0..7 | none | 5, 5 | 5, 3 | 5 ⊕ 5 ⊕ 5 ⊕ 3 = 6 |
| `3 3` | 2..2 | 4 | none | none | 4 |

#### Java code

```java title="Approach 1: block XORs, about 3√n steps per question"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt();
        int q = nextInt();
        int size = (int) Math.sqrt(n) + 1;     // block length, about sqrt(n)
        int[] x = new int[n];                  // 0-indexed inside the program
        int[] block = new int[n / size + 1];   // block[j] = XOR of x[j*size .. j*size+size-1]
        for (int i = 0; i < n; i++) {
            x[i] = nextInt();
            block[i / size] ^= x[i];
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int l = nextInt() - 1;
            int r = nextInt() - 1;
            int xor = 0;
            while (l <= r && l % size != 0) {  // left partial block
                xor ^= x[l++];
            }
            while (l + size - 1 <= r) {        // whole blocks
                xor ^= block[l / size];
                l += size;
            }
            while (l <= r) {                   // right partial block
                xor ^= x[l++];
            }
            out.append(xor).append('\n');
        }
        System.out.print(out);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

#### Time complexity

**O(n + q√n) in the worst case:** at most size − 1 single values on each side and n/size blocks per question. Measured over several runs: **0.25 to 0.3 s** with every question `1 n` or random ranges, and **0.35 to 0.45 s** with every question `2 n−1`.

#### Space complexity

**O(n)** for the values plus **O(√n)** for the block XORs.

#### The bridge to the next approach

> "Partial blocks are the leftover cost. For sums I'd store 'everything up to i' and subtract. XOR has no minus sign, but it doesn't need one: XOR is its own inverse. If p[i] is the XOR of the first i values, then p[b] ⊕ p[a − 1] XORs the first a − 1 values in twice, and anything XORed in twice disappears."

### Approach 2: Prefix XOR (recommended)

#### What I say out loud

> "p[0] = 0 and p[i] = p[i − 1] ⊕ x_i. The answer to (a, b) is p[b] ⊕ p[a − 1]. The values before position a are inside both p[b] and p[a − 1], so they appear twice and cancel, because v ⊕ v = 0. One pass to build, O(1) per question, everything in `int`."

#### Intuition

Look at a single bit. XOR on that bit is "is the count of 1s odd?". The prefix value p[i] records, for each bit, the parity of the 1s among the first i values. The parity in a..b is the parity up to b, corrected by the parity up to a − 1, and correcting a parity by a parity is again XOR.

#### Algorithm

1. `prefix = new int[n + 1]` (so `prefix[0] = 0`).
2. For i = 1..n: `prefix[i] = prefix[i − 1] ^ x_i`.
3. For each question: append `prefix[b] ^ prefix[a − 1]` to a `StringBuilder`.
4. Print it once.

#### Why it is correct

The proof uses four properties of XOR, each of which holds bit by bit:

- **Associative:** (u ⊕ v) ⊕ w = u ⊕ (v ⊕ w), so a long XOR can be grouped any way.
- **Commutative:** u ⊕ v = v ⊕ u, so it can be reordered.
- **Identity:** v ⊕ 0 = v.
- **Self-inverse:** v ⊕ v = 0, since every bit of v meets an equal bit.

**Invariant of the build:** after step i, `prefix[i] = x_1 ⊕ … ⊕ x_i` (and `prefix[0] = 0`, the XOR of nothing).

**The formula.** Write L = x_1 ⊕ … ⊕ x_(a−1) (L = 0 when a = 1) and R = x_a ⊕ … ⊕ x_b. By associativity, `prefix[b] = L ⊕ R` and `prefix[a − 1] = L`. Then

`prefix[b] ⊕ prefix[a − 1] = (L ⊕ R) ⊕ L = R ⊕ (L ⊕ L) = R ⊕ 0 = R`,

using commutativity and associativity to bring the two L's together, then self-inverse, then identity. So the formula gives exactly the XOR of positions a..b. Nothing from before a survives, and nothing from a..b is lost.

**Compare it with sums:** prefix sums need subtraction to remove L. Here XOR plays both roles, combining and removing, which is why the same operator appears in the build and in the query. Using `-` instead of `^` in the query is a real bug (section 11).

**No overflow:** every x_i < 2^30, and XOR never sets a bit that none of its operands has, so every prefix value and every answer is below 2^30 and fits an `int`.

**The 20-second version:** "I store prefix XORs with prefix[0] = 0. A range a..b is prefix[b] XOR prefix[a − 1], because the first a − 1 values are in both and v XOR v is 0. O(n) build, O(1) per query, and XOR can't overflow because no new bits appear."

#### Dry run

`x = [3, 2, 4, 5, 1, 1, 5, 3]`.

| i | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| x_i | | 3 | 2 | 4 | 5 | 1 | 1 | 5 | 3 |
| prefix[i] | 0 | 3 | 1 | 5 | 0 | 1 | 0 | 5 | 6 |

(The same running values as the `1 8` row of the alternative's dry run.)

| Question | prefix[b] | prefix[a − 1] | Answer |
|---|---|---|---|
| `2 4` | prefix[4] = 0 | prefix[1] = 3 | 0 ⊕ 3 = 3 |
| `5 6` | prefix[6] = 0 | prefix[4] = 0 | 0 |
| `1 8` | prefix[8] = 6 | prefix[0] = 0 | 6 |
| `3 3` | prefix[3] = 5 | prefix[2] = 1 | 5 ⊕ 1 = 4 |

The first row shows the cancellation at work: prefix[4] = 0 because 3 ⊕ 2 ⊕ 4 ⊕ 5 = 0, and the range 2..4 is "undo the 3", which is 3.

#### Java code

```java title="Approach 2: prefix XOR (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt();
        int q = nextInt();
        int[] prefix = new int[n + 1];         // prefix[i] = x_1 ^ ... ^ x_i, prefix[0] = 0
        for (int i = 1; i <= n; i++) {
            prefix[i] = prefix[i - 1] ^ nextInt();
        }

        StringBuilder out = new StringBuilder();
        for (int k = 0; k < q; k++) {
            int a = nextInt();
            int b = nextInt();
            out.append(prefix[b] ^ prefix[a - 1]).append('\n');  // x_1..x_{a-1} cancel out
        }
        System.out.print(out);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) {
            st = new StringTokenizer(in.readLine());
        }
        return Integer.parseInt(st.nextToken());
    }
}
```

**Why this I/O:** the input has about 6 · 10^5 numbers and the output 2 · 10^5 lines. `BufferedReader` with `StringTokenizer` and one `StringBuilder` printed once keep the I/O to a fraction of a second. On the companion problem Static Range Sum Queries, which has the same input shape, I measured `Scanner` plus a `println` per answer at 0.88 s against 0.18 s for this pattern.

#### Time complexity

**O(n + q) in the worst case**, optimal up to the constant since the input has n + 2q numbers to read. Measured: **0.13 s** with every question `1 n` and **0.13 s** with random ranges.

#### Space complexity

**O(n):** n + 1 `int` values, 0.8 MB at the largest n. The values themselves are not stored.

## 5. Comparison table

n is the array length, q the number of questions. Times are my measurements at n = q = 2 · 10^5, JVM start-up included.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. XOR each range again | O(n · q) | O(n · q): about 26 s measured | O(n) values |
| 1. Block XORs | O(n + q√n) | O(n + q√n): about 0.25 to 0.45 s measured | O(n) values + O(√n) block XORs |
| 2. Prefix XOR | O(n + q) | O(n + q): about 0.13 s measured | O(n): n + 1 `int` values |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. XOR each range again | No preparation, nothing to prove | Quadratic; about 26 s at the limits | To state the baseline |
| 1. Block XORs | O(1) point updates (fix one value and one block XOR); no inverse needed | About 3√n per question; fiddly boundaries | When values can change and you want something simpler than a Fenwick tree |
| 2. Prefix XOR | O(1) per question; tiny code | O(n) to rebuild after a change | The answer for a static array |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, prefix XOR in an `int` array of length n + 1. It is O(n + q), the cost of reading the input, and its proof is three lines.

**What matters most in the interview:** the proof. Say the four properties, then (L ⊕ R) ⊕ L = R. An interviewer who asks this problem is checking that you know *why* the prefix trick extends from sums to XOR (an inverse exists) and does not extend to minimum (no inverse).

**When to stop:** after prefix XOR. If values could change, a Fenwick tree over XOR gives O(log n) updates and queries, with the same p(b) ⊕ p(a − 1) combination; mention it, do not build it here.

## 7. Interview script: code it and test it

### What I say while coding

> "`new int[n + 1]`, because index 0 is the XOR of nothing, which is 0. That handles a = 1."

> "The build and the query use the same operator, `^`. If I catch myself writing a minus sign, it's a bug."

> "`int` is enough: values are below 2^30 and XOR adds no bits."

### Testing out loud

**The example:** prefix = 0, 3, 1, 5, 0, 1, 0, 5, 6. `2 4` → 0 ⊕ 3 = 3; `5 6` → 0 ⊕ 0 = 0; `1 8` → 6 ⊕ 0 = 6; `3 3` → 5 ⊕ 1 = 4. Matches.

**Cancelling values, `6 6` and `1 2`:** prefix = 0, 6, 0; answer 0 ⊕ 0 = 0.

**n = 1, `7`, `1 1`:** prefix = 0, 7; answer 7.

**a = 1:** reads prefix[0] = 0, never index −1.

**Large values:** 10^9 ⊕ 999,999,999 ⊕ 536,870,912 = 536,871,935, still below 2^30.

**Official tests:** all three programs on this page (the slow alternative included) print the expected output on the official CSES test stored with this site (CSES has two tests for this problem; the site stores the small one, n = 8 with all 36 ranges), run on a real JVM. It is small, so the tests for this page add n = q = 2 · 10^5, values near 10^9, and every range of every array up to length 40.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2 min | Bitwise XOR, 1-based, static, values below 2^30 |
| Ladder | 3 min | Direct loop and its n · q cost; prefix XOR |
| Proof | 2 min | The four properties, (L ⊕ R) ⊕ L = R |
| Code | 4 min | `int[n + 1]`, build, query, fast I/O |
| Test | 3 min | The example, a cancelling range, a = 1 |

If you get stuck, write the running XOR of the example under the array: 3, 1, 5, 0, … The fourth value is 0, and the answer to `2 4` is the first value, 3. That is the whole idea.

## 9. Interviewer challenges

### About correctness

#### Prove that `prefix[b] ^ prefix[a − 1]` is the XOR of a..b.

**What they are testing:** whether you can justify the trick from algebra rather than from examples.

**How to reason:** split prefix[b] into the part before a and the range itself.

**What I say:** "Let L be the XOR of x_1..x_(a−1) and R the XOR of x_a..x_b. Then prefix[b] = L ⊕ R and prefix[a − 1] = L. XOR is associative and commutative, so (L ⊕ R) ⊕ L = R ⊕ (L ⊕ L) = R ⊕ 0 = R."

**Nuance:** the same proof works for any operation with an identity and an inverse that can be regrouped and reordered (an abelian group): for sums the inverse is subtraction, for XOR it is XOR itself.

#### Why can't you do the same for minimum or OR?

**What they are testing:** whether you understand the condition the trick needs.

**How to reason:** find the step of the proof that breaks.

**What I say:** "The step L ⊕ L = 0 needs an inverse. OR has none: if the first a − 1 values already set a bit, OR-ing it again leaves it set, and I can't tell whether the range also had it. Minimum is the same. Those need a sparse table or a segment tree."

**Nuance:** OR and AND can still be answered per bit with prefix *counts*: for each of the 30 bits, count how many values in the range have it; the bit is in the OR if the count is positive. That is 30 prefix-count arrays, O(30 · n) memory.

### About implementation

#### Why `int` and not `long`, when the sum version needed `long`?

**What they are testing:** whether your overflow reasoning is specific to the operation.

**How to reason:** sums carry into higher bits; XOR never does.

**What I say:** "A sum of 2 · 10^5 values of 10^9 grows to 2 · 10^14. XOR works on each bit separately with no carry, so the result only has bits that some value has. All values are below 2^30, so every XOR is below 2^30."

**Nuance:** `long` would also be correct here, just twice the memory. Using `long` everywhere out of habit is fine, as long as you can explain why `int` suffices.

#### What if you write `prefix[b] - prefix[a - 1]` by analogy with sums?

**What they are testing:** whether you'd spot the mixed-up operator.

**How to reason:** subtraction is the inverse of addition, not of XOR.

**What I say:** "It's wrong, and sometimes silently. On the example it prints −3, 0, 6, 4 instead of 3, 0, 6, 4. I ran it. Three of four answers are right by coincidence: when prefix[a − 1] is 0, minus and XOR agree, and for `3 3`, 5 − 1 and 5 ⊕ 1 are both 4."

**Nuance:** that is exactly the kind of bug the CSES example alone may not catch. A test with a nonzero prefix[a − 1] whose bits are not a subset of prefix[b]'s catches it.

## 10. Follow-up questions the interviewer might ask

**"The question is a sum instead of a XOR."**
[[cses-static-range-sum-queries|Static Range Sum Queries]]: prefix sums with subtraction, and `long` because sums grow.

**"Values change between questions."**
A [[a12-fenwick|Fenwick tree]] works with XOR in place of addition, because XOR has an inverse: O(log n) per update and per query. A segment tree also works. The sum version of this is [[cses-dynamic-range-sum-queries|Dynamic Range Sum Queries]].

**"Find the XOR of every window of length k."**
Each window is one prefix-XOR query, or a sliding window that XORs in the new value and XORs out the old one: [[cses-sliding-window-xor|Sliding Window Xor]] (CSES generates up to 10^7 values there and asks for the XOR of all the window results). O(n).

**"Find the range with the largest XOR."**
A range XOR is prefix[b] ⊕ prefix[a − 1], so the task is to pick two prefix values with the largest XOR, solved with a binary trie over the prefix values in O(n · 30): [[cses-maximum-xor-subarray|Maximum Xor Subarray]].

**"The question is the OR of a range."**
No inverse, so keep 30 prefix counts, one per bit, and set a bit when its count in the range is positive. O(30 · (n + q)).

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Not being able to say why it works.** "It works like prefix sums" is not a reason; the reason is that XOR is its own inverse.
- **Assuming any bitwise operation behaves the same.** OR and AND have no inverse, so p[b] combined with p[a − 1] does not isolate the range.
- **Reaching for `long` "to be safe" without a reason.** Not wrong, but the interviewer may ask, and the answer is that XOR adds no bits.

### Implementation mistakes

> [!MISTAKE] Subtracting instead of XORing in the query
> `prefix[b] - prefix[a - 1]` prints −3, 0, 6, 4 on the example instead of 3, 0, 6, 4 (run). Three answers are right by coincidence, so a quick look at the output can miss it.

- **`prefix[a]` instead of `prefix[a − 1]`.** That also cancels x_a; on the example it prints 1, 1, 5, 0 (run).
- **No slot at index 0.** Without `prefix[0] = 0`, a question with a = 1 reads index −1 or needs a special case.
- **A `println` per answer and `Scanner`.** Correct but slow; on the same input shape I measured 0.88 s against 0.18 s.

## 12. Pattern recognition

**The pattern:** prefix aggregates for static range queries, valid whenever the operation can be undone. For XOR, undoing is XOR again.

**Signals in the problem statement:**

- "Xor of a range", "parity of a range", many queries, a fixed array.
- An operation that is associative and has an inverse: sum, XOR, count.

**Related problems in this list:**

- [[cses-static-range-sum-queries|Static Range Sum Queries]]: the same structure with addition and subtraction.
- [[cses-forest-queries|Forest Queries]]: prefix counts in two dimensions, with inclusion–exclusion.
- [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]: the 2D prefix idea as a class.
- [[nc-single-number|Single Number]]: v ⊕ v = 0 used to cancel pairs.
- [[cses-missing-number|Missing Number]]: XOR of 1..n against the input, the same cancellation argument.
- [[cses-maximum-xor-subarray|Maximum Xor Subarray]]: every range XOR is a XOR of two prefix values.

**Takeaway:** prefix aggregates work for any operation you can undo; for XOR, the undo is XOR itself, so the build and the query use the same operator.

## 13. 60-second revision card

**Key insight:** xor(a..b) = prefix[b] ^ prefix[a − 1], because the first a − 1 values appear twice and v ^ v = 0.

**Invariant:** prefix[i] = x_1 ^ … ^ x_i, with prefix[0] = 0.

**Complexity:** O(n + q) time, O(n) memory, `int` is enough (values < 2^30).

**Code skeleton:**

```java title="Range Xor Queries, prefix XOR"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    static BufferedReader in;
    static StringTokenizer st;

    public static void main(String[] args) throws IOException {
        in = new BufferedReader(new InputStreamReader(System.in));
        st = new StringTokenizer("");
        int n = nextInt(), q = nextInt();
        int[] prefix = new int[n + 1];
        for (int i = 1; i <= n; i++) prefix[i] = prefix[i - 1] ^ nextInt();
        StringBuilder out = new StringBuilder();
        while (q-- > 0) {
            int a = nextInt(), b = nextInt();
            out.append(prefix[b] ^ prefix[a - 1]).append('\n');
        }
        System.out.print(out);
    }

    static int nextInt() throws IOException {
        while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
        return Integer.parseInt(st.nextToken());
    }
}
```

**Main traps:**

- `^` in the query, not `-`.
- `prefix[a − 1]`, with prefix[0] = 0.
- Fast I/O both ways.

**What to say in one breath:** "Prefix XOR with prefix[0] = 0; the answer is prefix[b] XOR prefix[a − 1], since the shared part cancels because x XOR x is 0. O(n + q), `int` suffices because XOR never adds bits."
