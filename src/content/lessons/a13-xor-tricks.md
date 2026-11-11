---
summary: XOR cancels equal values, so a whole array can be folded into one number in which every paired element has disappeared. You will learn the algebra behind that, and use it to solve Single Number I, II and III, Missing Number, range XOR and subarray-XOR counting in linear time with constant or small extra space.
difficulty: intermediate
minutes: 45
objectives:
  - Explain why XOR-ing a collection leaves exactly the values that occur an odd number of times
  - Implement Single Number and Missing Number with O(1) extra space and trace them on paper
  - Split a problem by a differing bit to find two unique values (Single Number III)
  - Count bits modulo 3 to handle values that appear three times (Single Number II), including negatives
  - Use prefix XOR and the 0..n pattern to answer range and subarray XOR questions
  - Decide when an XOR trick applies and when a hash map is the honest solution
---

## Introduction

Here is a problem that appears in almost every interview list: *an array contains integers in which every value appears exactly twice, except one value that appears once. Find it.* A hash map that counts occurrences solves it in O(n) time and O(n) space. Sorting and scanning for a value without a twin solves it in O(n log n) time. But there is a solution with O(n) time and **O(1)** extra space, and it is one line: XOR all the numbers together.

That one line works because of the algebra of XOR, and the same algebra solves a family of related problems — a missing number, two unique numbers, a value appearing once among triples, the XOR of a range, the number of subarrays with a given XOR. This lesson builds that family from the ground up. Each trick is presented as a derivation from a few facts you can check by hand, so that when an interview gives you a variant you have not seen, you can reason your way to it.

## Before you start

- **XOR and two's complement** — `^` gives 1 where bits differ. See [[a13-and-or-xor]].
- **Isolating the lowest set bit with `n & -n`** and checking a bit — see [[a13-unset-bit]] and [[a13-check-bit]].
- **Hash maps** for the prefix-XOR section. See [[a1-hashmap]] and, for the analogous prefix-sum technique, [[a2-prefix-suffix]].

## The intuition: a pile of light switches

Imagine 32 light switches, all off. Each number in the array is a set of instructions: "flip switches 0 and 2" for 5 (`101`), "flip switch 1" for 2 (`010`). Processing a number means flipping the switches where it has a 1 — that is exactly `x ^= n`.

Flip a switch twice and it is back where it started. So every number that appears twice flips its switches twice and leaves no trace. Whatever pattern of lights remains at the end comes only from numbers that were processed an **odd** number of times. If only one number appeared once, the remaining lights spell out that number.

The order of processing does not matter either: each switch only cares how many times it was flipped, not when. That is why the array does not need to be sorted.

## The algebra that makes it work

Four properties of XOR, each checkable one bit at a time with the truth table from [[a13-and-or-xor]]:

| Property | Statement | Why (one bit) |
|---|---|---|
| Identity | `a ^ 0 == a` | `0 ^ 0 = 0`, `1 ^ 0 = 1` |
| Self-inverse | `a ^ a == 0` | Equal bits give 0 |
| Commutative | `a ^ b == b ^ a` | The table is symmetric |
| Associative | `(a ^ b) ^ c == a ^ (b ^ c)` | Each result bit is 1 when an odd number of inputs are 1 |

Together they mean you can **rearrange any XOR expression freely**, pair up equal terms, cancel them to 0, and drop the zeros. For `4 ^ 1 ^ 2 ^ 1 ^ 2`:

```text
4 ^ 1 ^ 2 ^ 1 ^ 2  =  4 ^ (1 ^ 1) ^ (2 ^ 2)  =  4 ^ 0 ^ 0  =  4
```

Two consequences you will use constantly:

- **Undo:** `a ^ b ^ b == a`. XOR-ing with `b` twice is a no-op, so XOR is its own inverse operation.
- **Solve for one unknown:** if `a ^ b == c`, then `a == c ^ b`. You can move a term to the other side by XOR-ing both sides with it.

XOR on integers never overflows: there are no carries, so every result fits in the same 32 bits. That is one practical advantage over tricks based on sums.

## Single Number: one value without a twin

**Problem.** Every value appears twice except one. Return it.

**Naive approach.** Count with a `HashMap<Integer, Integer>` and return the key with count 1: O(n) time, O(n) space. Or sort and look for a value that differs from both neighbours: O(n log n) time.

**XOR approach.** Fold the array with XOR. Pairs cancel; the single remains.

```java title="XorBasics.java"
public class XorBasics {

    // Every value appears twice except one.
    static int singleNumber(int[] nums) {
        int x = 0;
        for (int n : nums) x ^= n;       // pairs cancel, order does not matter
        return x;
    }

    // nums holds n distinct values from 0..n with one missing.
    static int missingNumber(int[] nums) {
        int x = nums.length;              // n itself has no index to pair with
        for (int i = 0; i < nums.length; i++) {
            x ^= i ^ nums[i];             // XOR every index and every value
        }
        return x;
    }

    // 0 ^ 1 ^ ... ^ n in O(1); the pattern repeats every 4.
    static int xorUpTo(int n) {
        switch (n & 3) {
            case 0:  return n;
            case 1:  return 1;
            case 2:  return n + 1;
            default: return 0;
        }
    }

    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{4, 1, 2, 1, 2}));
        System.out.println(singleNumber(new int[]{-7, 3, 3}));
        System.out.println(missingNumber(new int[]{3, 0, 1}));
        System.out.println(missingNumber(new int[]{0}));
        for (int n = 0; n <= 7; n++) System.out.print(xorUpTo(n) + " ");
        System.out.println();
        System.out.println("xor of 5..9 = " + (xorUpTo(9) ^ xorUpTo(4)));
    }
}
```

```output
4
-7
2
1
0 1 3 0 4 1 7 0 
xor of 5..9 = 5
```

Dry run of `singleNumber([4, 1, 2, 1, 2])`, with `x` in binary:

| Step | `n` | `x` before | `x ^ n` |
|---|---|---|---|
| 1 | 4 (`100`) | `000` | `100` (4) |
| 2 | 1 (`001`) | `100` | `101` (5) |
| 3 | 2 (`010`) | `101` | `111` (7) |
| 4 | 1 (`001`) | `111` | `110` (6) |
| 5 | 2 (`010`) | `110` | `100` (4) |

The intermediate values (5, 7, 6) are meaningless on their own — they are a mix of unfinished pairs — but once every pair has been seen twice, only 4 is left. Negative numbers need no special case: −7 is just a bit pattern, and its pair-free bits survive in the same way.

**Complexity.** One pass, O(n) time; one variable, O(1) space.

**What the trick really computes.** The result is the XOR of all values that occur an *odd* number of times. That is the single value only when the problem guarantees "exactly one odd count". If a value appears three times, it does not cancel (`a ^ a ^ a == a`): an array like `[2, 1, 4, 2, 1, 2]` folds to `4 ^ 2 = 6`, not 4. Read the constraints before reaching for this.

## Missing Number: pair indices with values

**Problem.** An array of length `n` holds distinct numbers from `0..n`, so exactly one value in that range is missing. Find it.

**Idea.** Build a collection in which every present value appears twice and the missing value appears once, then apply the Single Number trick. The indices `0..n-1` plus the number `n` are exactly `0..n`, each once. The array values are `0..n` minus the missing one. XOR them all together: every present value meets itself, and the missing value is left.

That is what `missingNumber` does. It starts with `x = n` (the one number with no index), then XORs each index with its value. Dry run for `[3, 0, 1]`, so `n = 3`:

| `i` | `nums[i]` | `x` before | `x ^ i ^ nums[i]` |
|---|---|---|---|
| start | | | 3 |
| 0 | 3 | 3 | `3 ^ 0 ^ 3` = 0 |
| 1 | 0 | 0 | `0 ^ 1 ^ 0` = 1 |
| 2 | 1 | 1 | `1 ^ 2 ^ 1` = 2 |

The answer is 2. The `[0]` case returns 1: `n = 1`, and `1 ^ 0 ^ 0 == 1`.

**Why not use the sum formula?** `n * (n + 1) / 2 - sum(nums)` is also O(n) time and O(1) space and is easier to read. Its weakness in Java is overflow: with `int`, `n * (n + 1)` overflows once `n` is above about 46,340, and because the division comes after the overflowed multiplication, the answer is garbage.

```java title="SumOverflow.java"
public class SumOverflow {
    public static void main(String[] args) {
        int n = 50_000, missing = 12_345;
        int intSum = n * (n + 1) / 2;                  // multiply overflows before dividing
        long longSum = (long) n * (n + 1) / 2;
        long actual = longSum - missing;
        System.out.println("int formula:  " + (intSum - (int) actual));
        System.out.println("long formula: " + (longSum - actual));
        int x = 0;
        for (int i = 0; i <= n; i++) if (i != missing) x ^= i;
        System.out.println("xor:          " + (x ^ xorUpTo(n)));
    }

    static int xorUpTo(int n) {                       // same as in XorBasics
        switch (n & 3) {
            case 0:  return n;
            case 1:  return 1;
            case 2:  return n + 1;
            default: return 0;
        }
    }
}
```

```output
int formula:  -2147471303
long formula: 12345
xor:          12345
```

Computing the sum in `long` fixes it. XOR never needs the fix. Both are acceptable answers in an interview if you mention the overflow.

### XOR of `0..n` in O(1)

The loop prints `0 1 3 0 4 1 7 0` for `n = 0..7`: the running XOR of `0..n` follows a cycle of length 4. When `n` is a multiple of 4 the result is `n`; one more and it is 1; one more and it is `n + 1`; one more and it is 0. The reason is that every aligned group of four consecutive numbers `4k, 4k+1, 4k+2, 4k+3` XORs to 0 (their low two bits are `00, 01, 10, 11`, which cancel, and their high bits are all equal and appear four times). So only the tail after the last complete group matters. This formula was checked against a direct loop for every `n` from 0 to 2,000.

Combined with "undo", it gives the XOR of any range: `xor(L..R) == xorUpTo(R) ^ xorUpTo(L - 1)`, because XOR-ing `0..L-1` a second time removes it. The output shows `5 ^ 6 ^ 7 ^ 8 ^ 9 == 5`.

## Single Number III: two values without twins

**Problem.** Every value appears twice except **two** distinct values `a` and `b`, which appear once. Return both.

**Where the basic trick gets stuck.** Folding the array gives `a ^ b`, not `a` and `b` separately. With one equation and two unknowns, you need more information.

**Deriving the split.** Because `a != b`, `a ^ b` is not zero, so it has at least one set bit. A set bit in `a ^ b` is a position where `a` and `b` **differ**: one has a 1 there, the other a 0. Use that bit to divide the whole array into two groups — numbers with the bit set and numbers with it clear. Then:

- `a` and `b` land in different groups, because they differ at that bit.
- Each duplicated value lands entirely in one group, because both copies have the same bit.

Each group is now a Single Number problem: everything is paired except one value. Fold each group separately.

Any set bit of `a ^ b` will do; the lowest is the easiest to get, with `xor & -xor` from [[a13-unset-bit]].

```java title="TwoSingles.java"
import java.util.Arrays;

public class TwoSingles {

    // Exactly two values appear once; every other value appears twice.
    static int[] singleNumberIII(int[] nums) {
        int xor = 0;
        for (int n : nums) xor ^= n;          // = a ^ b, nonzero because a != b
        int lowbit = xor & -xor;              // a bit where a and b differ
        int a = 0, b = 0;
        for (int n : nums) {
            if ((n & lowbit) != 0) a ^= n;    // group with that bit set
            else b ^= n;                      // group with that bit clear
        }
        return new int[]{a, b};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(singleNumberIII(new int[]{1, 2, 1, 3, 2, 5})));
        System.out.println(Arrays.toString(singleNumberIII(new int[]{-1, 0})));
        System.out.println(Arrays.toString(
                singleNumberIII(new int[]{Integer.MIN_VALUE, 7, 9, 7, 9, 0})));
    }
}
```

```output
[3, 5]
[-1, 0]
[-2147483648, 0]
```

Walk through `[1, 2, 1, 3, 2, 5]`. The fold gives `3 ^ 5 = 011 ^ 101 = 110` (6). Its lowest set bit is `010` (2) — position 1, where 3 has a 1 and 5 has a 0. The "bit 1 set" group is `2, 3, 2`, which folds to 3. The "bit 1 clear" group is `1, 1, 5`, which folds to 5.

The last test is the awkward edge case: `a ^ b` is `Integer.MIN_VALUE`, and `-MIN_VALUE` is MIN_VALUE itself, so `lowbit` is MIN_VALUE — still the correct single-bit mask (bit 31). The `!= 0` test (not `> 0`) is what makes it work. A randomised comparison against expected answers over twenty thousand arrays, including MIN_VALUE, MAX_VALUE, 0 and −1 as singles, found no failures.

**Complexity.** Two passes, O(n) time, O(1) space. The order of the two returned values depends on the chosen bit; sort them if the problem requires an order.

## Single Number II: everything else appears three times

**Problem.** Every value appears exactly three times except one, which appears once.

**Why XOR alone fails.** `a ^ a ^ a == a`, so tripled values do not cancel; the fold gives the XOR of *all* distinct values.

**Deriving the bit-count approach.** Go back to individual bits. Fix a position `k` and count how many numbers in the array have bit `k` set. Each tripled value contributes 0 or 3 to that count. The single value contributes 0 or 1. So the count modulo 3 is exactly the single value's bit `k`. Do this for all 32 positions and assemble the answer. XOR is really "count each bit modulo 2"; this generalises it to modulo 3.

```java title="SingleII.java"
public class SingleII {

    // Every value appears three times except one, which appears once.
    static int singleNumberII(int[] nums) {
        int result = 0;
        for (int k = 0; k < 32; k++) {
            int count = 0;
            for (int n : nums) count += (n >>> k) & 1;   // how many have bit k set
            if (count % 3 != 0) result |= 1 << k;        // the leftover belongs to the single
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(singleNumberII(new int[]{2, 2, 3, 2}));
        System.out.println(singleNumberII(new int[]{0, 1, 0, 1, 0, 1, 99}));
        System.out.println(singleNumberII(new int[]{-2, -2, 1, 1, 4, 1, 4, 4, -4, -2}));
        System.out.println(singleNumberII(new int[]{Integer.MIN_VALUE, 5, 5, 5}));
    }
}
```

```output
3
99
-4
-2147483648
```

Negative answers come out right with no special handling because the loop covers bit 31 too: `1 << 31` sets the sign bit, and two's complement does the rest. Using `>>>` makes the intent ("treat as raw bits") clear, though `>>` would give the same `& 1` result here.

**Complexity.** 32 passes over the array: O(32 · n) = O(n) time, O(1) space. For `long` values, loop to 64.

**The constant-factor version.** A well-known refinement keeps two masks, `ones` and `twos`, which together act as a 2-bit counter per position that wraps at 3. It processes the array in a single pass:

```java
int ones = 0, twos = 0;
for (int x : nums) {
    ones = (ones ^ x) & ~twos;   // bits seen once (mod 3)
    twos = (twos ^ x) & ~ones;   // bits seen twice (mod 3)
}
return ones;
```

It gives the same answers as the counting version (both were checked on twenty thousand random arrays with negative values and MIN_VALUE), but it is harder to derive under pressure. In an interview, the bit-count version with a clear explanation is the stronger answer; mention the state-machine version as an optimisation.

## Prefix XOR: ranges and subarrays

Because XOR undoes itself, it supports the same **prefix** technique as sums ([[a2-prefix-suffix]]). Let `p[i]` be the XOR of the first `i` elements. The XOR of the subarray from index `j` to `i - 1` is `p[i] ^ p[j]`: the common prefix cancels. Unlike prefix sums, there is no overflow and no subtraction — the same operator builds and undoes.

That turns "count the subarrays whose XOR equals `k`" into a hash map problem. A subarray ending at `i` has XOR `k` exactly when some earlier prefix equals `p ^ k` (solve `p ^ earlier == k` for `earlier`). Count earlier prefixes in a map as you go:

```java title="SubarrayXor.java"
import java.util.HashMap;
import java.util.Map;

public class SubarrayXor {

    // Number of subarrays whose XOR equals k, in O(n).
    static long countSubarraysWithXor(int[] a, int k) {
        Map<Integer, Integer> seen = new HashMap<>();
        seen.put(0, 1);                         // the empty prefix
        int prefix = 0;
        long count = 0;
        for (int x : a) {
            prefix ^= x;                        // XOR of a[0..i]
            // a subarray (j, i] has XOR k exactly when prefix[j] == prefix ^ k
            count += seen.getOrDefault(prefix ^ k, 0);
            seen.merge(prefix, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countSubarraysWithXor(new int[]{4, 2, 2, 6, 4}, 6));
    }
}
```

```output
4
```

The four subarrays are `[4, 2]`, `[2, 2, 6]`, `[6]` and the whole array `[4, 2, 2, 6, 4]`. Seeding the map with the empty prefix (`0` seen once) is what counts subarrays that start at index 0. The method matched an O(n²) brute force on two thousand random arrays. Time is O(n) expected (hash map operations), space O(n).

```quiz
Q: What does XOR-ing every element of `[7, 3, 7, 7, 3]` return?
- [ ] 0
- [ ] 3
- [x] 7
- [ ] 4
> XOR keeps the values that occur an odd number of times. 3 appears twice and cancels; 7 appears three times, so two copies cancel and one remains. The result is 7 — which shows the Single Number trick only works when every other value appears an even number of times.

Q: In Single Number III, why is it safe to split the array by the lowest set bit of `a ^ b`?
- [ ] Because the lowest bit is always bit 0
- [x] Because a and b differ at that bit, while both copies of every duplicate agree at it, so each group contains exactly one single and complete pairs
- [ ] Because it sorts the array into two halves
- [ ] Because a is always smaller than b
> A 1 in `a ^ b` marks a position where a and b differ, so they fall into different groups. Duplicates are identical, so both copies go to the same group and still cancel. Any set bit of `a ^ b` works; the lowest is just convenient.

Q: Why does counting bits modulo 3 find the single value in Single Number II?
- [ ] Because XOR is the same as addition modulo 3
- [ ] Because the single value is always the largest
- [x] Because at every position the tripled values contribute a multiple of 3 to the count, so the remainder is the single value's bit
- [ ] Because 3 is a power of two
> Each value that appears three times adds 0 or 3 to the count of set bits at position k. The single value adds 0 or 1. Taking the count mod 3 strips the triples and leaves the single value's bit. XOR is the same idea modulo 2.

Q: `xorUpTo(n)` returns `0 ^ 1 ^ ... ^ n`. What is `xorUpTo(11)`?
- [x] 0
- [ ] 11
- [ ] 1
- [ ] 12
> 11 leaves remainder 3 when divided by 4, and the pattern n, 1, n + 1, 0 gives 0. Directly: 0..3, 4..7 and 8..11 each XOR to 0.
```

## How XOR swap works, and why you should not use it

The XOR swap exchanges two variables without a temporary:

```java title="XorSwap.java"
import java.util.Arrays;

public class XorSwap {
    static void xorSwap(int[] a, int i, int j) {
        a[i] ^= a[j];
        a[j] ^= a[i];
        a[i] ^= a[j];
    }
    public static void main(String[] args) {
        int[] a = {5, 9, 5};
        xorSwap(a, 0, 1);
        System.out.println(Arrays.toString(a));   // different indices: swapped
        xorSwap(a, 1, 2);
        System.out.println(Arrays.toString(a));   // equal values: still fine
        xorSwap(a, 0, 0);
        System.out.println(Arrays.toString(a));   // same index: element destroyed
    }
}
```

```output
[9, 5, 5]
[9, 5, 5]
[0, 5, 5]
```

With `x` and `y` in two different places: after line 1, `x' = x ^ y`. Line 2 sets `y' = y ^ x' = y ^ x ^ y = x`. Line 3 sets `x'' = x' ^ y' = x ^ y ^ x = y`. Swapped. Equal *values* in different places are fine, as the second call shows. The failure is **aliasing**: when `i == j`, both names refer to the same slot, and the first line computes `v ^ v = 0`, destroying the value. Guard with `if (i != j)`.

In real Java code, use a temporary variable. It is clearer, works for any type, and is at least as fast: the JIT compiler keeps both values in registers either way, and the XOR version creates a chain of dependent instructions. Know the XOR swap for interviews, where it is a common "explain why this works" question.

## In real systems

**Parity and error detection.** A parity bit is the XOR of all data bits; flipping any single bit changes it. RAID 5 stores the XOR of the data blocks in each stripe as a parity block; if one disk fails, XOR-ing the surviving blocks with the parity reconstructs the lost data — the Missing Number trick at the scale of disks.

**Checksums and hashing.** Many hash functions mix bits with XOR and shifts (Java's `HashMap` uses `h ^ (h >>> 16)`). Zobrist hashing in game engines gives each piece-on-square a random 64-bit number and XORs them into the board's hash; moving a piece XORs its old square out and its new square in, so the hash updates in O(1).

**Cryptography.** Stream ciphers and the one-time pad combine plaintext with a key stream using XOR, because XOR with the same key undoes it. XOR with a reused or short key is *not* secure; the security comes from the key stream, not from XOR.

**Diffing.** `a ^ b` marks the bits that changed between two snapshots; `Integer.bitCount(a ^ b)` is the Hamming distance used in similarity search over binary fingerprints.

## Trade-offs and alternatives

| Approach | Time | Extra space | Works when |
|---|---|---|---|
| XOR fold | O(n) | O(1) | Exactly one value has an odd count |
| Split by differing bit | O(n) | O(1) | Exactly two values have odd counts |
| Bit count mod k | O(32 · n) | O(1) | Every other value appears exactly k times |
| Sum formula | O(n) | O(1) | Missing value from a known range; use `long` |
| `HashMap` counting | O(n) expected | O(n) | Any frequency pattern |
| Sort and scan | O(n log n) | O(1) to O(n) | Any pattern, if the array may be reordered |

XOR tricks are elegant but brittle: they rely on an exact promise about frequencies. If the input violates it — a value appearing three times in Single Number I, or two values missing in Missing Number — the result is silently wrong rather than an error. A hash map answers every frequency question and is the right default when the constraints are loose or you must validate the input. Use XOR when the problem's guarantees match and space matters.

Some problems that sound similar need a different tool. *Find the Duplicate Number* (values `1..n` in an array of length `n + 1`, one value repeated possibly many times, array read-only) is solved with Floyd's cycle detection ([[a4-cycle-detection]]), not XOR, because the duplicate may occur more than twice. *Maximum XOR of two numbers in an array* uses a binary [[a12-trie]] that greedily picks opposite bits from the top down.

## Common mistakes

> [!MISTAKE] Using the XOR fold when frequencies are not all even
> The fold returns the XOR of all values with odd counts. If the constraint is "every other value appears three times", or the data may contain an extra copy, the result is a mixture, not an element of the array. Check the frequency guarantee first.

**XOR swap with the same index.** `xorSwap(a, i, i)` zeroes `a[i]`. Equal values at different indices are fine; aliasing is the problem.

**`lowbit > 0` instead of `!= 0` in Single Number III.** If the differing bit is bit 31, the mask is negative.

**Plain XOR for Single Number II.** Triples do not cancel; count bits modulo 3.

**Forgetting `n` in Missing Number.** The loop over indices only covers `0..n-1`; start `x` at `n` (or XOR it in separately), otherwise the answer is off whenever `n` is missing.

**Forgetting the empty prefix in subarray counting.** Without `seen.put(0, 1)`, subarrays starting at index 0 are never counted.

## Interview perspective

Interviewers use XOR problems to check whether you know the algebra and can extend it. A strong answer states the properties, derives the solution from them, and names the precondition.

- **Single Number:** "`a ^ a == 0`, `a ^ 0 == a`, and XOR is commutative and associative, so pairs cancel regardless of order and the single value remains. O(n) time, O(1) space."
- **Missing Number:** "Indices plus `n` form `0..n`; values are `0..n` minus one. XOR everything and only the missing value appears once." Mention the sum alternative and its overflow.
- **Single Number III:** "The fold is `a ^ b`, non-zero; any set bit separates `a` from `b` and keeps pairs together."
- **Single Number II:** "Count each bit mod 3." Then mention the `ones`/`twos` state machine.
- **Follow-ups:** every other value appears `k` times (count mod `k`); XOR of a range in O(1) (prefix pattern with period 4); count subarrays with XOR `k` (prefix XOR plus hash map).

> [!INTERVIEW] Say the precondition out loud
> Before writing `x ^= n`, say "this works because every other value appears an even number of times". It shows you know why the trick works and makes the interviewer's "what if a value appears three times?" follow-up an easy one.

## Practice

1. *Set Mismatch:* an array of `1..n` has one value duplicated and one missing. Find both using XOR and the split-by-bit idea.
2. Return the XOR of all elements in `[L, R]` for up to 10⁵ queries on the range of integers, each in O(1).
3. Generalise Single Number II: every value appears exactly `k` times except one that appears once.
4. *Decode XORed Array:* given `encoded[i] = arr[i] ^ arr[i + 1]` and `arr[0]`, reconstruct `arr`.
5. Count the subarrays whose XOR is zero.
6. Explain why `a + b - 2 * (a & b) == (a ^ b)` holds, using the addition identity from [[a13-and-or-xor]].

In the DSA explorer, start with *Single Number*, *Missing Number*, *Single Number III* and *Single Number II*.

## Quick revision {#quick-revision}

- XOR algebra: `a ^ 0 == a`, `a ^ a == 0`, commutative, associative; `a ^ b ^ b == a`; `a ^ b == c` ⇒ `a == c ^ b`.
- Folding a collection with XOR leaves the XOR of the values with odd counts.
- Single Number: XOR all. O(n) time, O(1) space.
- Missing Number: `x = n; x ^= i ^ nums[i]` for all `i`. The sum formula overflows in `int`; use `long`.
- `0 ^ ... ^ n` by `n % 4`: `n, 1, n + 1, 0`. Range: `xorUpTo(R) ^ xorUpTo(L - 1)`.
- Single Number III: fold to `a ^ b`, `lowbit = x & -x`, split by `(n & lowbit) != 0`, fold each group.
- Single Number II: for each of 32 bits, count set bits mod 3; or the `ones`/`twos` state machine.
- Prefix XOR: subarray XOR is `p[i] ^ p[j]`; count subarrays with XOR `k` using a map of prefixes seeded with `{0: 1}`.
- XOR swap breaks when both operands are the same location; use a temporary in real code.

## Key takeaways {#key-takeaways}

- XOR is addition without carries, so it acts as "count each bit modulo 2": equal values cancel and order never matters.
- Every XOR trick rests on a promise about frequencies; state it before you use the trick, and fall back to a hash map when it does not hold.
- When folding leaves two unknowns mixed together, split the input by a bit where they differ.
- Counting bits modulo k generalises XOR to values that repeat k times.
- XOR supports prefix techniques like sums do, without overflow, which makes range and subarray questions straightforward.
