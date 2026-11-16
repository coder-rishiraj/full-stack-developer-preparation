---
problemId: cses-missing-number
title: Missing Number
source: cses
sourceUrl: https://cses.fi/problemset/task/1083
difficulty: easy
patterns: [introductory, mathematics, bit-manipulation, hashing, cyclic-sort]
relatedLessons: [a1-java-syntax-competitive, a1-big-o, a1-time-complexity, a13-xor-tricks, a2-array-string-traversal, a14-brute-force-first, a14-deriving-optimization]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

You get an integer n, then n − 1 different numbers, each between 1 and n. Exactly one number of 1, 2, …, n is not among them. Print it. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `5` on the first line, `2 3 1 5` on the second
- Output: `4`
- Why: of 1, 2, 3, 4, 5, the input has 1, 2, 3 and 5. Only 4 is absent.

**Example 2** (an extra example: the CSES statement has only one)

- Input: `2` on the first line, `2` on the second
- Output: `1`
- Why: the smallest input. Of 1 and 2, only 2 was given.

**What the problem statement guarantees**

- 2 ≤ n ≤ 2 · 10^5.
- The second line has exactly n − 1 numbers, all distinct, each between 1 and n inclusive.
- So exactly one value of 1..n is missing, and the answer always exists and is unique.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. The problem looks too easy to need practice, but an interviewer will push you for several different solutions and ask where each one breaks. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 10 minutes.
2. Write the slowest solution you are sure is correct, and its cost at n = 2 · 10^5.
3. Find at least three faster ideas, each using a different tool, and say what each one costs in time and memory.
4. For your fastest idea, work out the largest number your program ever holds, and check that its type holds it.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> Before you read a single input number, you already know a lot: the full list 1, 2, …, n. What could you compute about that full list, and about the numbers you read, so that comparing the two tells you which one is missing?

> [!HINT] Hint 2: the kind of tool you need
> Removing one number from 1..n changes the total 1 + 2 + … + n by exactly that number. The total has a closed form. (A second tool with the same property: an operation under which every value present twice cancels to nothing.)

> [!HINT] Hint 3: almost the whole plan
> Start from n(n + 1)/2 and subtract each number as you read it; what is left is the answer. Compute the start value in a 64-bit type: at n = 2 · 10^5 it is about 2 · 10^10. Read with a buffered reader, since there can be 2 · 10^5 numbers.

**Check yourself before revealing the walkthrough**

- [ ] I can name at least four correct approaches and their time and memory
- [ ] I know the largest value my program computes, and my type holds it
- [ ] My program prints 1 for `2` / `2`, and 2 for `2` / `1`
- [ ] My program prints n when the numbers given are exactly 1..n − 1

## 3. Interview script: understand the problem (≈1 min)

Treat it as if an interviewer had said "I give you all the numbers from 1 to n except one; find the missing one." The questions are about the input format, the size of n, and what is guaranteed.

**Me:** I read n, then n − 1 numbers, and print the one value of 1..n that is not there. Are the numbers on one line, and how many exactly?

**Interviewer:** n on the first line, then n − 1 numbers on the second line, separated by spaces.

**Me:** Are they distinct, and all within 1..n? So exactly one value is missing, never zero or two?

**Interviewer:** Yes. Distinct and between 1 and n inclusive.

**Me:** In any order? Not sorted?

**Interviewer:** Any order.

**Me:** And n goes up to?

**Interviewer:** 2 · 10^5, with a one-second limit.

**Me:** Then up to 199,999 numbers to read, so I'll use a buffered reader, not `Scanner`. Quadratic would be about 2 · 10^10 basic steps, far too many for a second; n log n or n is fine. And if I add numbers up, 1 + 2 + … + 2 · 10^5 is about 2 · 10^10, beyond an `int`, so any total goes in a `long`.

**Me:** Let me do the example by hand. n = 5, numbers 2, 3, 1, 5. I'll tick them off: 1 yes, 2 yes, 3 yes, 4 no. So 4. Ticking off is one idea; another is that 1 + … + 5 = 15, the input sums to 11, and 15 − 11 = 4.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 2 ≤ n ≤ 2 · 10^5 | O(n²), about 2 · 10^10 steps, is far too slow; O(n log n) and O(n) are fine. The input is never empty (at least one number). |
| n − 1 distinct numbers in 1..n | Exactly one value is missing. Every approach can rely on that: a counting or arithmetic trick returns the right value only because of this promise. |
| Values at most 2 · 10^5 | A table indexed by value has only n + 1 entries, so a direct array is affordable. |
| Time limit 1 s | Up to 199,999 numbers to read: `BufferedReader` with `StringTokenizer`, not `Scanner`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| n on its own line, then the numbers on the next line | Read the first line for n, then read exactly n − 1 tokens. I read tokens across lines anyway, so a different line split would not break it. |
| The numbers are in no particular order | No early stop on a sorted sequence; any approach must look at all the numbers. |
| Output: the number alone | One `println`; no extra text. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may store the numbers or not, as I like | The input is mine to read; whether I keep it in an array is a design choice, and the best approaches do not need to. |
| Bad input (duplicates, a value outside 1..n) does not need handling | The statement rules it out. I will say which approaches would silently give a wrong answer on it, because that comes up as a follow-up. |

### Edge cases I will keep in mind

- n = 2: one number, so the answer is the other of 1 and 2.
- The missing number is 1, the smallest.
- The missing number is n: the input is exactly 1..n − 1, so an approach that looks for a "gap" between the numbers finds none.
- n = 2 · 10^5: reading speed, and the total 20,000,100,000 beyond `int`.

## 4. Think out loud: from first idea to best solution

The answer is one value of 1..n. Every approach below finds it by recording which values were seen, either explicitly (a scan, a sort, a set, an array of flags, marks in the input) or implicitly (a sum or an XOR that "remembers" everything except the missing value). They are ordered from the most direct to the most compact. n is the number from the first line; the input has n − 1 numbers.

**Measured cost:** each program was run as `java Main < input` on my machine (JDK 26) with n = 2 · 10^5 and the missing value n. Approaches 1 to 6 each took 0.06 to 0.09 s, JVM start-up included (an empty program takes about 0.02 s). The first idea below took about 7 s.

### Alternative: check each candidate in turn

This rung is too slow for the largest tests (about 7 s measured at n = 2 · 10^5), so it is not a numbered approach, but it is the baseline every interviewer expects you to state.

#### What I say out loud

> "The direct way: for each candidate v from 1 to n, look through the numbers for v. The first candidate I can't find is the answer. It's certainly correct, but each lookup is a scan of up to n − 1 numbers, so up to n candidates times n numbers: quadratic. At 2 · 10^5 that's around 2 · 10^10 comparisons."

#### Intuition

"Missing" means "not found by a search". Search for each possible value and report the one the search fails on.

#### Algorithm

1. Read n and the n − 1 numbers into an array `a`.
2. For v = 1, 2, …, n: scan `a` for v. If the scan does not find it, print v and stop.

#### Why it is correct

- **It prints only a missing value:** it prints v only after a full scan of the input failed to find v.
- **It prints the right one:** exactly one value of 1..n is missing, so exactly one scan fails, and every candidate is tried.

#### Dry run

Input `5` / `2 3 1 5`

| Candidate | Numbers compared | Found? |
|---|---|---|
| 1 | 2, 3, 1 | yes, 3rd number |
| 2 | 2 | yes, 1st |
| 3 | 2, 3 | yes, 2nd |
| 4 | 2, 3, 1, 5 | no: print `4` |

Ten comparisons for n = 5.

#### Java code

```java title="Alternative: scan once per candidate (too slow at n = 2 · 10^5)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n - 1);

        for (int candidate = 1; candidate <= n; candidate++) {
            boolean found = false;
            for (int x : a) {                  // linear scan for this candidate
                if (x == candidate) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                System.out.println(candidate);
                return;
            }
        }
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

#### Time complexity

**O(n²) in the worst case.** A successful scan for v stops at v's position, so the work is the sum of the positions of every value smaller than the answer, plus one full scan for the answer. When n is missing, every other value is searched for, and their positions are a permutation of 1..n − 1, so the total is (n − 1)n/2 + (n − 1) comparisons: about 2 · 10^10 at n = 2 · 10^5. Measured: **about 7 s** for that input, seven times the limit. When 1 is missing it stops after one scan, O(n); this is why the test file for this page keeps the missing value small at the largest n.

#### Space complexity

**O(n)** for the array of n − 1 numbers.

#### The bridge to the next approach

> "The waste is that each scan starts from nothing: finding 3 teaches me nothing about where 4 is. If the numbers were sorted, I wouldn't need to search at all. Walking up the sorted list, value i + 1 should sit at position i, and the first place where it doesn't is the gap. Sorting costs n log n, which is already a big improvement."

### Approach 1: Sort, then find the first gap

#### What I say out loud

> "I sort the numbers. If nothing is missing up to some point, the sorted list reads 1, 2, 3, … with value i + 1 at index i. The first index where that fails tells me i + 1 is missing. If it never fails, the list is exactly 1..n − 1, and the missing number is n: I must not forget that case."

#### Intuition

In sorted order the input is 1..n with one value cut out. Before the cut, every value sits at its "home" index (value = index + 1); after the cut, every value is shifted one place left. The first index where the value is wrong is the cut.

#### Algorithm

1. Read the n − 1 numbers into `a` and sort it.
2. For i from 0 to n − 2: if `a[i] != i + 1`, print i + 1 and stop.
3. Otherwise print n.

#### Why it is correct

- **Invariant of the scan:** when the loop reaches index i, `a[0..i−1]` is exactly 1..i, so none of 1..i is missing.
- **When `a[i] != i + 1`:** the values are distinct and sorted, and 1..i are already used, so `a[i] > i + 1`, and i + 1 appears nowhere (everything after index i is even bigger). So i + 1 is the missing number.
- **When no index fails:** the array holds exactly 1..n − 1, so the missing value is n.

#### Dry run

Input `5` / `2 3 1 5`; after sorting, `a = [1, 2, 3, 5]`.

| i | a[i] | Expected i + 1 | Match? |
|---|---|---|---|
| 0 | 1 | 1 | yes |
| 1 | 2 | 2 | yes |
| 2 | 3 | 3 | yes |
| 3 | 5 | 4 | no: print `4` |

For `4` / `3 1 2` the sorted array is `[1, 2, 3]`, every index matches, and the fallback prints 4.

#### Java code

```java title="Approach 1: sort, then the first gap"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n - 1);

        Arrays.sort(a);
        for (int i = 0; i < n - 1; i++) {
            if (a[i] != i + 1) {               // 1..i are all present, so i + 1 is the gap
                System.out.println(i + 1);
                return;
            }
        }
        System.out.println(n);                 // 1..n-1 all present
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

#### Time complexity

**O(n log n)** for the sort, plus O(n) for reading and the scan. `Arrays.sort(int[])` is a dual-pivot quicksort; the implementation note in recent JDK documentation says it offers O(n log n) performance on all data sets, which is a description of the current implementation rather than a contract. The final scan could be a binary search (the "value = index + 1" property holds on a prefix and fails on the rest), but the sort already costs n log n, so that would not change the bound.

#### Space complexity

**O(n)** for the array; the sort works inside it (its own working memory is an implementation detail and is small next to the array).

#### The bridge to the next approach

> "Sorting puts everything in order, but I never use the order except to ask 'is value v present?'. That's a membership question, and a hash set answers it in expected constant time without sorting anything. So: put every number in a set, then ask for 1, 2, … until one is absent."

### Approach 2: Hash set of the values seen

#### What I say out loud

> "I add every number to a `HashSet`, then test 1, 2, … , n for membership. The first one that is not in the set is the answer. Building the set and the n lookups are each expected O(n)."

#### Intuition

This is the brute force with its slow part replaced: the scan "is v in the input?" becomes a set lookup.

#### Algorithm

1. Read each number and add it to a `HashSet<Integer>`.
2. For v = 1..n: if the set does not contain v, print v and stop.

#### Why it is correct

The set contains exactly the input values. The loop tries every value of 1..n in order, so it reaches the one missing value, and it prints only a value the set does not contain, which is a value not in the input.

#### Dry run

Input `5` / `2 3 1 5`: the set ends as {1, 2, 3, 5}. Tests: 1 present, 2 present, 3 present, 4 absent: print `4`.

#### Java code

```java title="Approach 2: hash set"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        Set<Integer> seen = new HashSet<>();
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n - 1; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            seen.add(Integer.parseInt(st.nextToken()));
        }
        for (int v = 1; v <= n; v++) {
            if (!seen.contains(v)) {
                System.out.println(v);
                return;
            }
        }
    }
}
```

#### Time complexity

**O(n) expected,** assuming the hash codes spread well: n − 1 inserts and at most n lookups, each O(1) on average. Here they do: an `Integer`'s hash code is its value, and consecutive values land in different buckets. The worst case of a hash table with many colliding keys is worse; current Java versions turn a heavily collided bucket into a balanced tree, which for `Integer` keys limits a lookup to about O(log n), but that is implementation behaviour, not a guarantee of the `HashSet` API.

#### Space complexity

**O(n),** and with a large constant: each entry is a boxed `Integer` plus a hash-table node, roughly 50 bytes per value on a typical 64-bit JVM, against 1 byte for a `boolean`.

#### The bridge to the next approach

> "Why hash at all? The keys are 1..n, small and dense. A hash table exists to map a huge or unknown key range onto a small table; here the key range already is a small table. An array of n + 1 booleans indexed by the value gives the same membership test with no hashing, no boxing, a worst-case guarantee, and about fifty times less memory."

### Approach 3: Boolean presence array

#### What I say out loud

> "I keep `seen[v]` for v from 1 to n. Reading a number sets its flag. Then the first v with `seen[v]` false is the answer. Two linear passes, deterministic, n + 1 bytes of memory."

#### Intuition

A direct-address table: the value itself is the index. It is the hash set from Approach 2 with the identity function as the hash and no collisions possible.

#### Algorithm

1. `seen = new boolean[n + 1]` (index 0 unused, so that value v uses index v).
2. For each number x read: `seen[x] = true`.
3. For v = 1..n: if `!seen[v]`, print v and stop.

#### Why it is correct

After step 2, `seen[v]` is true exactly when v is in the input, because every input value is in 1..n (the array is large enough) and each one sets its own flag. Step 3 checks every v of 1..n, so it finds the only unflagged one.

#### Dry run

Input `5` / `2 3 1 5`

| After reading | seen[1..5] |
|---|---|
| 2 | F T F F F |
| 3 | F T T F F |
| 1 | T T T F F |
| 5 | T T T F T |

Scan: v = 1, 2, 3 flagged; v = 4 not flagged: print `4`.

#### Java code

```java title="Approach 3: boolean presence array"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        boolean[] seen = new boolean[n + 1];   // seen[v] for v in 1..n; index 0 unused
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n - 1; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            seen[Integer.parseInt(st.nextToken())] = true;
        }
        for (int v = 1; v <= n; v++) {
            if (!seen[v]) {
                System.out.println(v);
                return;
            }
        }
    }
}
```

#### Time complexity

**O(n) in the worst case:** one pass to set flags, one pass of at most n checks. No hashing, so nothing is only "expected".

#### Space complexity

**O(n):** n + 1 booleans, about 200 KB at the largest n. The numbers themselves are never stored.

#### The bridge to the next approach

> "The flags record which of the n values I saw, but I only need to know one thing at the end: which value I didn't see. Is there a single number I can keep that changes by a known amount for each value I read? Yes: a running total. I know the total of all of 1..n in closed form, n(n + 1)/2. Subtract everything I read, and what's left is exactly the value I never read. Constant memory."

### Approach 4: Sum formula (recommended)

#### What I say out loud

> "1 + 2 + … + n is n(n + 1)/2. The input is that set minus one value, so its total is n(n + 1)/2 minus the missing value. So: start from n(n + 1)/2 and subtract each number as I read it. What's left is the answer. At n = 2 · 10^5 the start value is 20,000,100,000, about ten times what an `int` holds, so it's a `long`, and I cast before I multiply."

#### Intuition

Sum is a fingerprint of the set that changes by exactly the removed value when a value is removed. Since we know the fingerprint of the full set without reading anything, the difference reveals the missing value.

#### Algorithm

1. Read n. `missing = (long) n * (n + 1) / 2`.
2. For each of the n − 1 numbers x: `missing -= x`.
3. Print `missing`.

#### Why it is correct

The input is {1, …, n} without the missing value m, so the sum of the input is n(n + 1)/2 − m. Step 2 subtracts exactly that sum, leaving m. The order of the numbers does not matter, since addition is commutative.

**Where the overflow is, exactly.** 2^31 − 1 = 2,147,483,647.

- The product n(n + 1) first exceeds it at n = 46,341 (46,341 · 46,342 = 2,147,534,622; at n = 46,340 it is 2,147,441,940).
- The total n(n + 1)/2 first exceeds it at n = 65,536 (2,147,516,416).
- At the largest n the total is 20,000,100,000, which a `long` (up to about 9.2 · 10^18) holds easily, as do all intermediate values.

So `int missing = n * (n + 1) / 2` is wrong long before the total itself overflows, because the product wraps first. I ran it: for n = 46,341 with 7 missing it prints −2147483641 (that is, 7 − 2^31), and at n = 2 · 10^5 it prints the right answer minus 2^31. It is wrong for every n from 46,341 to 80,264, then right or wrong depending on n, which is why a few random tests can miss the bug. `long missing = n * (n + 1) / 2`, without the cast, fails in the same places: the product is still computed in `int` before it is widened.

**The "subtract as you go" variant.** Pair each input number with an index instead of computing the total first: `missing = n`, then `missing += i − x_i` for i = 1..n − 1. It needs no multiplication and no division. People say it "stays in range", but that depends on the order: in descending order the running value drops to −9,999,800,000 at n = 2 · 10^5 (computed), far outside `int`. In Java an `int` version still prints the right answer (I ran it on that input), because `int` addition and subtraction wrap around modulo 2^32, as the Java Language Specification defines, and the true answer lies in 1..n, so the wrapped result equals it. The same reasoning makes an `int` total built by a loop (`for v in 1..n: total += v`) correct. The `int` formula fails only because it divides a wrapped product by 2, and division does not survive wrapping. I still write `long`: it is correct for a reason everyone can see, not because of a property of two's-complement arithmetic that the reader has to trust.

**The 20-second version:** "The numbers 1 to n add up to n(n + 1)/2. The input is all of them except one, so it adds up to that minus the missing number. I start from n(n + 1)/2 in a `long` and subtract every number I read; what's left is the answer. O(n) time, O(1) memory, and I don't even store the input."

#### Dry run

Input `5` / `2 3 1 5`: start at 5 · 6 / 2 = 15.

| Read | missing after |
|---|---|
| (start) | 15 |
| 2 | 13 |
| 3 | 10 |
| 1 | 9 |
| 5 | 4 |

Print `4`.

#### Java code

```java title="Approach 4: n(n + 1)/2 minus the input (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        long missing = (long) n * (n + 1) / 2;  // 1 + 2 + ... + n, up to about 2 * 10^10
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n - 1; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            missing -= Integer.parseInt(st.nextToken());
        }
        System.out.println(missing);
    }
}
```

#### Time complexity

**O(n) in the worst case:** one constant-time subtraction per number. In the worst case a correct algorithm must read essentially every number (any unread number could be the one that rules out a candidate), so Ω(n) is a lower bound and this is optimal.

#### Space complexity

**O(1) auxiliary space** for the algorithm: n and one `long`. The numbers are never stored. The reader does hold the current input line, which on CSES is the whole second line (about 1.3 million characters at the largest n); a byte-level reader would avoid even that.

#### The bridge to the next approach

> "The sum works because adding a value and subtracting it again cancel. The only nuisance is that the running values get large. Is there an operation where a value cancels with itself and nothing ever gets large? XOR: x ^ x = 0, x ^ 0 = x, and it's associative and commutative. If I XOR together all of 1..n and all the input numbers, every present value appears twice and vanishes, and the missing one is left. And XOR never produces a number with more bits than its inputs."

### Approach 5: XOR of 1..n and the input

#### What I say out loud

> "I XOR together the numbers 1 to n and all n − 1 input numbers. Each present value occurs twice and cancels; the missing one occurs once and survives. I can fold it into one loop: start from n, and for i = 1..n − 1 XOR in both i and the i-th number. No overflow at all: everything stays below 2^18."

#### Intuition

XOR is addition without carries, bit by bit, modulo 2. A value XORed in twice contributes nothing to any bit. So XOR is a "sum" where every value is its own negative, and no total can grow.

#### Algorithm

1. Read n. `x = n` (n is the one value of 1..n that has no index among 1..n − 1).
2. For i = 1..n − 1: read the i-th number a_i and do `x ^= i ^ a_i`.
3. Print `x`.

#### Why it is correct

After the loop, x is the XOR of the multiset {1, 2, …, n} ∪ {a_1, …, a_{n−1}}: n from the start value, every i from 1 to n − 1 from the loop, and every input number from the loop. XOR is associative and commutative, so the order of the terms does not matter, and we can group equal values. Every present value v appears twice (once as part of 1..n, once in the input), and v ^ v = 0. The missing value m appears once. What remains is 0 ^ 0 ^ … ^ m = m.

**No overflow:** every value is at most 2 · 10^5 < 2^18 = 262,144, so every XOR of them is below 2^18 too: XOR cannot set a bit that none of its operands has.

#### Dry run

Input `5` / `2 3 1 5`: start at x = 5.

| i | a_i | i ^ a_i | x after (decimal, binary) |
|---|---|---|---|
| (start) | | | 5 = 101 |
| 1 | 2 | 3 | 6 = 110 |
| 2 | 3 | 1 | 7 = 111 |
| 3 | 1 | 2 | 5 = 101 |
| 4 | 5 | 1 | 4 = 100 |

Print `4`.

#### Java code

```java title="Approach 5: XOR of 1..n and the input"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());

        int x = n;                             // start with the one value that has no partner index
        StringTokenizer st = new StringTokenizer("");
        for (int i = 1; i <= n - 1; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            x ^= i ^ Integer.parseInt(st.nextToken());
        }
        System.out.println(x);                 // every present value cancelled out
    }
}
```

#### Time complexity

**O(n) in the worst case:** one pass, two XORs per number.

#### Space complexity

**O(1) auxiliary space,** with the same remark about the reader's line buffer as Approach 4. The numbers are not stored.

#### The bridge to the next approach

> "Sum and XOR are the best answers here, but they only work because exactly one value is missing and nothing is repeated: with two missing values a single sum can't separate them. The presence-array idea doesn't have that weakness, it just costs n flags. Can I get the flags for free? If the numbers are stored in an array anyway, each slot can carry one extra bit: its sign. All values are positive, so making slot v − 1 negative can mean 'v was seen' without losing the value stored there."

### Approach 6: Mark presence in the input array by sign

#### What I say out loud

> "I store the numbers in an array of n − 1 slots and use slot v − 1 as the flag for value v, by making it negative. The value in a slot is still recoverable with `Math.abs`. Value n has no slot, so I skip it. Then the first slot that is still positive names the missing value; if every slot is negative, 1..n − 1 are all present and the answer is n."

#### Intuition

This is Approach 3's flag array, folded into the input. A slot's sign is a bit the input never uses, because every value is at least 1.

#### Algorithm

1. Read the n − 1 numbers into `a`.
2. For each i: `v = |a[i]|` (the slot may already have been marked); if v ≤ n − 1, set `a[v − 1] = −|a[v − 1]|`.
3. For each i: if `a[i] > 0`, print i + 1 and stop.
4. Otherwise print n.

#### Why it is correct

- **Marks never destroy data:** a mark only changes a sign, and every read goes through `Math.abs`, so step 2 always sees the original values. Writing `−|…|` instead of negating keeps a slot negative if two values tried to mark it (impossible here, since values are distinct, but harmless).
- **After step 2, slot j is negative exactly when value j + 1 is in the input:** every present value v ≤ n − 1 marks slot v − 1, and nothing else marks it.
- **Step 3 and 4:** the first positive slot j means j + 1 is absent. If no slot is positive, all of 1..n − 1 are present and n is missing.

#### Dry run

Input `5` / `2 3 1 5`: `a = [2, 3, 1, 5]`, 4 slots, so values 1..4 have slots.

| i | v = abs(a[i]) | Action | a after |
|---|---|---|---|
| 0 | 2 | mark slot 1 | [2, −3, 1, 5] |
| 1 | 3 | mark slot 2 | [2, −3, −1, 5] |
| 2 | 1 | mark slot 0 | [−2, −3, −1, 5] |
| 3 | 5 | 5 > 4, no slot | [−2, −3, −1, 5] |

Slot 3 is the first positive one: print `4`.

#### Java code

```java title="Approach 6: sign marking in the stored input"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        int[] a = readNumbers(in, n - 1);      // slot v - 1 stands for value v, v in 1..n-1

        for (int i = 0; i < n - 1; i++) {
            int v = Math.abs(a[i]);            // the value, even if this slot is already marked
            if (v <= n - 1) {                  // value n has no slot
                a[v - 1] = -Math.abs(a[v - 1]);
            }
        }
        for (int i = 0; i < n - 1; i++) {
            if (a[i] > 0) {                    // nobody marked slot i, so i + 1 is missing
                System.out.println(i + 1);
                return;
            }
        }
        System.out.println(n);                 // every slot marked: 1..n-1 present
    }

    static int[] readNumbers(BufferedReader in, int count) throws IOException {
        int[] a = new int[count];
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < count; i++) {
            while (!st.hasMoreTokens()) {
                st = new StringTokenizer(in.readLine());
            }
            a[i] = Integer.parseInt(st.nextToken());
        }
        return a;
    }
}
```

Swapping each value into its home slot (cyclic placement, as in [[nc-first-missing-positive|First Missing Positive]]) is the other in-place way to record presence; a swap version passes the same tests here. Sign marking is shorter when every value is positive.

#### Time complexity

**O(n) in the worst case:** two passes over n − 1 slots.

#### Space complexity

**O(1) beyond the array, but the array is O(n),** and on CSES it is an array this program allocated only for this purpose. That is the honest verdict on this setting: in-place marking saves memory when someone hands you an array that already exists and lets you modify it (the LeetCode version of this problem). When you read the input yourself, Approaches 4 and 5 do not need to store it at all, so marking is strictly more memory, more code and more risk. It belongs in the ladder because it is the technique that still works when sum and XOR stop working (several missing values, or duplicates), as in [[nc-first-missing-positive|First Missing Positive]].

## 5. Comparison table

n is the number on the first line; the input has n − 1 numbers. Only the hash set has an expected time that differs from its worst case.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Scan once per candidate | O(n²) | O(n²), about 7 s at n = 2 · 10^5 | O(n) array |
| 1. Sort, first gap | O(n log n) | O(n log n) per the JDK implementation note | O(n) array |
| 2. Hash set | O(n) | O(n²) in general; about O(n log n) with current Java tree buckets for `Integer` keys (not an API guarantee) | O(n), about 50 bytes per value |
| 3. Boolean presence array | O(n) | O(n) | O(n), 1 byte per value |
| 4. Sum formula (`long`) | O(n) | O(n) | O(1), input not stored |
| 5. XOR | O(n) | O(n) | O(1), input not stored |
| 6. Sign marking | O(n) | O(n) | O(n) array (O(1) beyond it) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Scan per candidate | Needs no idea at all | Quadratic; about 7 s at the limit | Only to state the baseline |
| 1. Sort | Short; easy to argue | n log n; must remember the "missing n" fallback | A first improvement in an interview; when the data must be sorted anyway |
| 2. Hash set | Familiar; works for any key range | Boxing and hashing for nothing; expected time only; heavy memory | When the values are not a small dense range |
| 3. Boolean array | Deterministic O(n); simplest to prove; generalises to several missing values | n flags of memory | When you need the full set of missing values, or want zero arithmetic subtleties |
| 4. Sum formula | One line of logic; O(1) memory; streams the input | Needs `long` and the exact overflow reasoning | The answer to give |
| 5. XOR | O(1) memory; no overflow at any n | The cancellation argument is less familiar to some interviewers | When asked to avoid overflow, or for a bit-manipulation answer |
| 6. Sign marking | The in-place technique that survives harder variants | Needs a stored array: on CSES, more memory than 4 and 5 | When the array already exists and may be modified |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 4, the sum formula with a `long`. It is O(n) time, which is optimal since the input has to be read, and O(1) memory without even storing the input. Its correctness argument is one sentence, and the only trap (overflow) is one an interviewer wants to see you catch: say the bound out loud, 20,000,100,000 at n = 2 · 10^5, and write the cast.

**Equally good:** Approach 5 (XOR). Give it when the interviewer asks "can you avoid the overflow concern entirely?" Mention it in one sentence after the sum either way.

**How to present the ladder:** state the quadratic scan and its cost in one breath, mention sorting and the presence array as the first improvements, then go to the sum. Do not code all seven.

**When to stop:** after the sum or XOR. Nothing beats O(n) time with O(1) memory here. The remaining risks are the `long`, reading n − 1 (not n) numbers, and fast input.

## 7. Interview script: code it and test it

### What I say while coding

> "`(long) n * (n + 1) / 2`: I cast n first, so the multiplication itself happens in 64 bits. `long x = n * (n + 1) / 2` would still multiply in `int`."

> "I read exactly n − 1 numbers. Reading n would wait for a number that never comes: on this input the program would hit the end of input and crash."

> "`BufferedReader` with `StringTokenizer`. `Scanner` would still pass at 2 · 10^5 numbers, but it is the habit that fails on larger CSES inputs."

### Testing out loud

**Example `5` / `2 3 1 5`:** 15 − 2 − 3 − 1 − 5 = 4. Correct.

**`2` / `2`:** 3 − 2 = 1. **`2` / `1`:** 3 − 1 = 2. Both n = 2 cases work.

**Missing n, `4` / `3 1 2`:** 10 − 6 = 4. The sum has no special case for this. (Approaches 1 and 6 reach it through their final fallback line.)

**Missing 1, `3` / `3 2`:** 6 − 5 = 1.

**n = 2 · 10^5:** the start value is 20,000,100,000; it is a `long`. If I had used `int`, n = 46,341 would already be wrong.

**Official tests:** all seven programs on this page print the expected answer on the 8 official CSES tests stored with this site (n from 2 to 5,000), run on a real JVM. Those tests stop at n = 5,000, so they would not catch the `int` overflow; the tests for this page go up to n = 2 · 10^5 and include the overflow boundaries.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1 min | Format, distinctness, n up to 2 · 10^5 |
| Ladder | 3 min | Scan per candidate (n²), sort (n log n), flags (n, n memory), then sum |
| Overflow | 1 min | Total 20,000,100,000 > 2^31 − 1: `long`, cast before multiplying |
| Code | 3 min | Fast input, n − 1 numbers, one subtraction per number |
| Test | 2 min | Example, n = 2 both ways, missing n, largest n |

If you get stuck, do the example by hand twice, once ticking values off and once adding them up. The second way is the solution.

## 9. Interviewer challenges

### About correctness

#### Why does the XOR version work? Prove it.

**What they are testing:** whether you can justify a bit trick instead of reciting it.

**How to reason:** list the algebraic properties used, then count how often each value appears in the XOR.

**What I say:** "XOR is associative and commutative, x ^ x = 0 and x ^ 0 = x. My loop XORs every number from 1 to n once and every input number once. A value that is in the input appears twice and cancels to 0; the missing value appears once. So the result is the missing value, whatever the order."

**Nuance:** XOR of 1..n has a closed form by n mod 4 (n, 1, n + 1, 0 for n mod 4 = 0, 1, 2, 3), so you could compute it without a loop, but you still have to read all the input, so the total stays O(n).

#### What if the guarantee were broken, say a duplicate and a missing value?

**What they are testing:** whether you know what your answer relies on.

**How to reason:** sum and XOR compress the input to one number, so they cannot tell different defects apart; flags can.

**What I say:** "The sum and the XOR would print a wrong value without any warning: they assume exactly one value is missing and none repeated. The presence array would still find the missing value, and it would also notice the duplicate when it sets a flag that is already set. If the input can't be trusted, I'd use flags."

**Nuance:** with one duplicate d and one missing m, the sum gives m − d and the sum of squares gives m² − d², so (m + d) = (m² − d²)/(m − d), and the two are recovered in O(1) memory. That variant is LeetCode's "Set Mismatch".

### About implementation

#### Is an `int` enough for the sum?

**What they are testing:** overflow awareness, and whether you compute the bound rather than guess.

**How to reason:** the largest value computed is n(n + 1)/2, or the product n(n + 1) before the division.

**What I say:** "No. At n = 2 · 10^5 the total is 20,000,100,000, and `int` stops at 2,147,483,647. Worse, the product n(n + 1) passes the `int` limit already at n = 46,341. I ran the `int` version: at n = 46,341 with 7 missing it prints −2147483641. So I write `(long) n * (n + 1) / 2`."

**Nuance:** an `int` that only adds and subtracts (a loop-built total, or `missing += i − x`) still prints the right answer, because Java `int` arithmetic wraps modulo 2^32 and the answer fits in an `int`. Dividing a wrapped product is what breaks. That is a fact worth knowing, not a reason to rely on wrapping.

#### Why not `Scanner`?

**What they are testing:** awareness of Java I/O cost in judged programs.

**How to reason:** the input is up to 199,999 tokens; `Scanner` parses each through regular expressions.

**What I say:** "`Scanner` is convenient but slow per token. `BufferedReader` plus `StringTokenizer` is the standard fast pattern in Java, and I use it by habit so I don't have to think about it when the input is ten times larger."

**Nuance:** measured on the largest input, the sum program took 0.14 s with `Scanner` and 0.06 s with `BufferedReader`, JVM start-up included. So at this size `Scanner` would pass; the reader's cost is about twice the whole algorithm's, though, and at 10^6 tokens it starts to matter.

### About the in-place idea

#### Your sign-marking version changes the input. When is that acceptable?

**What they are testing:** whether you treat modifying input as a design decision, not a free trick.

**How to reason:** who owns the array, who reads it afterwards, and whether the memory saving is real.

**What I say:** "Here I read the input into my own array, so changing it bothers nobody, but it also saves nothing: the sum doesn't need the array at all. In a library method that receives someone else's array, I'd only do it if the contract says the array may be modified, or restore the signs afterwards, which costs one more pass."

**Nuance:** sign marking needs a spare bit, which exists here because every value is at least 1. In the 0..n version of this problem, a 0 cannot be marked negative, which is why that page uses swaps instead.

## 10. Follow-up questions the interviewer might ask

**"The numbers are 0..n instead of 1..n, given as an array."**
That is [[nc-missing-number|Missing Number (LeetCode)]]: the same sum and XOR, with 0 included and the array handed to a method. O(n) time, O(1) space.

**"Two numbers are missing."**
Sum and sum of squares give m₁ + m₂ and m₁² + m₂², which determine both (solve the quadratic); the sum of squares reaches about n³/3 ≈ 2.7 · 10^15, still within `long`. Or XOR everything to get m₁ ^ m₂, pick any set bit, and XOR the two groups split by that bit separately, the same trick as for two non-repeating numbers. O(n) time, O(1) space either way. The presence array also works unchanged and generalises to k missing values in O(n) time and O(n) space.

**"The numbers arrive as a stream too large to store."**
The sum and XOR already handle it: one pass, O(1) memory. Sorting, the hash set and in-place marking do not.

**"Find the smallest positive number missing from an arbitrary array."**
Sum and XOR no longer apply, because you no longer know which values the full set contains. The presence idea does: that is [[nc-first-missing-positive|First Missing Positive]], solved in O(n) time and O(1) space with in-place marking.

**"One value is repeated instead of missing (n + 1 numbers in 1..n)."**
If exactly one value appears twice and the rest once, the sum minus n(n + 1)/2 gives it. When the duplicate may appear many times and the array is read-only, it becomes [[nc-find-the-duplicate-number|Find the Duplicate Number]], solved with cycle detection.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Forgetting that n itself can be missing.** The approaches that look for a gap (sort, sign marking) find none when the input is 1..n − 1, and need the fallback that prints n.
- **Assuming `long` is needed only when the answer is large.** The answer is at most 2 · 10^5; it is the intermediate total that overflows.
- **Calling the hash set O(n) without qualification.** It is O(n) expected; the presence array is the deterministic version and is simpler here.
- **Picking in-place marking "for O(1) space" on CSES.** You allocate that array yourself; the sum uses no array at all.

### Implementation mistakes

> [!MISTAKE] Computing the total in `int`
> `int missing = n * (n + 1) / 2` (or `long missing = n * (n + 1) / 2`, without a cast) multiplies in `int`. From n = 46,341 the product wraps: for n = 46,341 with 7 missing it prints −2147483641, and at n = 2 · 10^5 it is wrong too (both run). Write `(long) n * (n + 1) / 2`.

- **Reading n numbers instead of n − 1.** The extra read finds no more input: `readLine()` returns `null` and `new StringTokenizer(null)` throws a `NullPointerException` (run on the example).
- **Dropping the fallback after the gap scan.** The sort version without its last `println(n)` prints nothing for `4` / `3 1 2` (run).
- **Reading a marked slot without `Math.abs`.** In sign marking, `int v = a[i]` instead of `Math.abs(a[i])` reads a negative value once that slot has been marked; on the example it throws `ArrayIndexOutOfBoundsException: Index -4` (run).
- **`boolean[n]` instead of `boolean[n + 1]`.** Value n then has no flag, and `seen[n] = true` is out of bounds.

## 12. Pattern recognition

**The pattern:** a known universe minus an unknown part. When the full set of values is known in advance (here 1..n), compute an aggregate of the full set without reading anything, compute the same aggregate of the input, and let the difference name what is missing. Sum and XOR are the two classic aggregates; a presence table is the explicit version that also works when the aggregate is ambiguous.

**Signals in the problem statement:**

- "All numbers from 1 to n except one" (or "0 to n"): a closed-form total exists.
- "Distinct", "exactly one missing": a single aggregate is enough to identify the answer.
- Values bounded by n: a presence array indexed by value is affordable, and so is in-place marking.

**Related problems in this list:**

- [[nc-missing-number|Missing Number (LeetCode)]]: the same problem on 0..n as a method; in-place marking needs swaps there because 0 has no sign.
- [[nc-first-missing-positive|First Missing Positive]]: the harder relative where sum and XOR fail and in-place presence marking is the answer.
- [[nc-single-number|Single Number]]: XOR cancellation, with every value but one appearing twice.
- [[nc-find-the-duplicate-number|Find the Duplicate Number]]: values 1..n with one repeated, read-only, O(1) space.
- [[cses-distinct-numbers|Distinct Numbers]]: presence by sorting or hashing when the values are large and not dense.

**Takeaway:** when you know what the complete set should contain, you rarely need to remember what you saw; you only need a summary that changes by exactly the missing value.

## 13. 60-second revision card

**Key insight:** 1 + 2 + … + n = n(n + 1)/2; subtract every input number and the missing one is left. XOR works the same way with no overflow.

**Invariant:** after reading k numbers, `missing` = n(n + 1)/2 minus the sum of those k numbers; after all n − 1, it is the missing value.

**Complexity:** O(n) time, O(1) memory, input not stored.

**Code skeleton:**

```java title="Missing Number, sum formula"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(in.readLine().trim());
        long missing = (long) n * (n + 1) / 2;
        StringTokenizer st = new StringTokenizer("");
        for (int i = 0; i < n - 1; i++) {
            while (!st.hasMoreTokens()) st = new StringTokenizer(in.readLine());
            missing -= Integer.parseInt(st.nextToken());
        }
        System.out.println(missing);
    }
}
```

**Main traps:**

- `(long) n * (n + 1)`: the product overflows `int` from n = 46,341.
- Read n − 1 numbers, not n.
- Gap-based approaches need the "missing n" fallback.

**What to say in one breath:** "The full set 1..n sums to n(n + 1)/2 and the input is that set minus one value, so the difference is the answer. I keep a `long`, subtract as I read, and never store the input: O(n) time, O(1) memory. XOR gives the same result without any overflow."
