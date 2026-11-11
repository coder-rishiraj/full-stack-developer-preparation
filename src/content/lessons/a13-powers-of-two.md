---
summary: A power of two is a number with exactly one bit set, and that one fact gives O(1) tests, fast rounding, cheap modulo and integer logarithms. You will learn why n > 0 && (n & (n - 1)) == 0 works, how to round to the neighbouring powers of two, and why hash tables and many data structures size themselves in powers of two.
difficulty: beginner
minutes: 35
objectives:
  - Explain why a positive integer is a power of two exactly when it has one set bit
  - Implement and justify the test n > 0 && (n & (n - 1)) == 0, including its behaviour on 0 and Integer.MIN_VALUE
  - Compute the largest power of two at most n, the smallest at least n, and floor(log2 n) with bit operations
  - Replace modulo and division by a power of two with & and >>, and state when that is unsafe for negative numbers
  - Recognise power-of-two structure in hash tables, Fenwick trees, sparse tables and binary lifting
---

## Introduction

Ask a hash table how many buckets it has and the answer will usually be 16, 32, 64 or some other power of two. Ask a memory allocator how big its blocks are: 8, 16, 32, 64 bytes. Look at a heap stored in an array, a segment tree, a Fenwick tree, a sparse table: their indexing schemes all lean on powers of two. Powers of two are special because in binary they are as simple as a number can be — a single 1 followed by zeros — and that simplicity makes several otherwise costly operations cost one instruction.

This lesson covers the bit-level facts about powers of two that you need in interviews and in real code: how to test whether a number is one, how to round to the nearest one, how to find the exponent, and how to use them to replace division and modulo. Each is derived from the bit operations in [[a13-set-bit]] rather than memorised.

## Before you start

- **Bitwise operators and two's complement** — see [[a13-and-or-xor]].
- **Clearing the lowest set bit with `n & (n - 1)`** and isolating it with `n & -n` — see [[a13-unset-bit]]. The power-of-two test is a one-line application of it.
- **Logarithms in Big-O** — what O(log n) means. See [[a1-time-complexity]].

## The intuition

In decimal, multiplying by 10 appends a zero: 7, 70, 700. Powers of ten are 1, 10, 100, 1000 — a single 1 and then zeros. Binary works the same way with 2: multiplying by 2 shifts every bit left by one, and the powers of two are 1, 10, 100, 1000 in binary, which are 1, 2, 4, 8 in decimal.

```text
 1 = 0000 0001        2^0
 2 = 0000 0010        2^1
 4 = 0000 0100        2^2
 8 = 0000 1000        2^3
12 = 0000 1100        not a power of two: two bits set
```

So the question "is `n` a power of two?" is really "**does `n` have exactly one set bit?**" And 2ᵏ is `1 << k`: the number whose only set bit is at position `k`. The exponent `k` is simply the position of that bit.

## Testing for a power of two

### The naive approach

Keep dividing by 2 while the number is even. If you end at 1, every factor was a 2:

```java
static boolean isPowerOfTwoLoop(int n) {
    if (n <= 0) return false;
    while (n % 2 == 0) n /= 2;
    return n == 1;
}
```

This is correct, but takes one iteration per factor of two — up to 30 for an `int`, O(log n) in general. A precomputed set of the 31 positive powers of two also works but needs memory and a lookup. Both are fine; the bit trick is shorter, faster and expected in interviews.

### Deriving the bit trick

We want to know whether `n` has exactly one set bit. From [[a13-unset-bit]], `n & (n - 1)` removes the lowest set bit. If `n` had exactly one set bit, nothing is left; if it had two or more, at least one survives:

```text
n = 16:   n     = 1 0000
          n - 1 = 0 1111
          and   = 0 0000    -> one bit, power of two

n = 12:   n     = 1100
          n - 1 = 1011
          and   = 1000      -> a second bit survived, not a power of two
```

So "exactly one set bit" is "`n` is not zero, and `n & (n - 1)` is zero". There is one more case to rule out: negative numbers. In two's complement, `Integer.MIN_VALUE` is `1000...0`, which also has exactly one set bit — but it is −2³¹, not a power of two. The positivity check handles both zero and negatives at once:

```java title="PowerOfTwo.java"
public class PowerOfTwo {

    // Naive: keep halving while even. O(log n) iterations.
    static boolean isPowerOfTwoLoop(int n) {
        if (n <= 0) return false;
        while (n % 2 == 0) n /= 2;
        return n == 1;
    }

    // Bit trick: exactly one set bit, and positive. O(1).
    static boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    // Missing the n > 0 guard: accepts 0 and Integer.MIN_VALUE.
    static boolean isPowerOfTwoBroken(int n) {
        return (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        int[] tests = {1, 2, 16, 12, 0, -8, 1 << 30, Integer.MAX_VALUE, Integer.MIN_VALUE};
        System.out.println("          n   loop  trick  broken  bitCount==1");
        for (int n : tests) {
            System.out.printf("%11d   %-5b %-6b %-7b %b%n", n, isPowerOfTwoLoop(n),
                    isPowerOfTwo(n), isPowerOfTwoBroken(n), Integer.bitCount(n) == 1);
        }
    }
}
```

```output
          n   loop  trick  broken  bitCount==1
          1   true  true   true    true
          2   true  true   true    true
         16   true  true   true    true
         12   false false  false   false
          0   false false  true    false
         -8   false false  false   false
 1073741824   true  true   true    true
 2147483647   false false  false   false
-2147483648   false false  true    true
```

The table shows why the guard matters. Without `n > 0`, zero passes (`0 & -1 == 0`) and so does `Integer.MIN_VALUE` (`MIN_VALUE - 1` wraps to `MAX_VALUE`, which shares no bits with it). The equally popular `Integer.bitCount(n) == 1` also accepts MIN_VALUE, so it needs the same guard. `1` passes correctly, because 1 = 2⁰.

Two equivalent tests are `n > 0 && (n & -n) == n` (the isolated lowest bit is the whole number) and `n > 0 && Integer.bitCount(n) == 1`. All three agreed with a brute-force comparison against the list `1 << 0` through `1 << 30` over two hundred thousand random inputs plus the edge values `0`, `1`, `-1`, `Integer.MIN_VALUE` and `Integer.MAX_VALUE`.

**Complexity:** O(1) time, O(1) space — one subtraction, one AND and two comparisons.

For a `long`, write the same test with `long` arithmetic: `n > 0 && (n & (n - 1)) == 0` with `n` declared `long` covers 2⁰ to 2⁶².

### Variation: power of four

A power of four is a power of two whose single bit sits at an **even** position (4⁰ = bit 0, 4¹ = bit 2, 4² = bit 4…). Add one more mask test: `0x55555555` is `0101...0101`, ones at every even position.

```java title="PowerOfFour.java"
public class PowerOfFour {
    // 0x55555555 = 0101...0101: ones at the even positions 0, 2, 4, ..., 30.
    static boolean isPowerOfFour(int n) {
        return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
    }
    public static void main(String[] args) {
        int[] tests = {1, 2, 4, 8, 16, 64, 0, -4, 1 << 30, Integer.MIN_VALUE};
        for (int n : tests) System.out.println(n + " -> " + isPowerOfFour(n));
    }
}
```

```output
1 -> true
2 -> false
4 -> true
8 -> false
16 -> true
64 -> true
0 -> false
-4 -> false
1073741824 -> true
-2147483648 -> false
```

The pattern generalises: "single set bit" plus "at a permitted position". This version was checked against repeated multiplication by 4 on two million inputs with no mismatches.

## Rounding to powers of two, and integer logarithms

Three related questions come up whenever you size a buffer or a table:

- The **largest power of two ≤ n** (round down). This is the highest set bit of `n` on its own.
- The **smallest power of two ≥ n** (round up). Needed when a capacity must be a power of two but at least `n`.
- **⌊log₂ n⌋**, the exponent of the round-down. This is the *position* of the highest set bit.

Java has library methods for the hard parts: `Integer.highestOneBit(n)` returns the highest set bit alone, and `Integer.numberOfLeadingZeros(n)` counts the zero bits above it, so the highest bit is at position `31 - numberOfLeadingZeros(n)`. For a power of two, `Integer.numberOfTrailingZeros(n)` gives the same exponent from the other side.

Rounding up takes one more idea. Subtract 1 (so that an exact power of two maps to itself), then "smear" the highest set bit into every lower position with ORs and right shifts, and finally add 1, which carries through the run of ones into the next power:

```java title="Rounding.java"
public class Rounding {

    // Largest power of two <= n, for n >= 1.
    static int floorPow2(int n) {
        return Integer.highestOneBit(n);
    }

    // Smallest power of two >= n, for 1 <= n <= 2^30 (2^31 does not fit in an int).
    static int ceilPow2(int n) {
        if (n <= 1) return 1;
        int x = n - 1;          // so that exact powers map to themselves
        x |= x >>> 1;           // copy the highest 1 into the next bit
        x |= x >>> 2;           // ... into the next 2 bits
        x |= x >>> 4;
        x |= x >>> 8;
        x |= x >>> 16;          // now every bit below the highest 1 is set
        return x + 1;           // 0..0111..1 + 1 = 0..1000..0
    }

    // floor(log2(n)) for n >= 1: the index of the highest set bit.
    static int log2Floor(int n) {
        return 31 - Integer.numberOfLeadingZeros(n);
    }

    public static void main(String[] args) {
        int[] tests = {1, 2, 3, 5, 16, 17, 100, 1000, 1 << 30};
        System.out.println("         n  floorPow2   ceilPow2  log2Floor");
        for (int n : tests) {
            System.out.printf("%10d %10d %10d %10d%n", n, floorPow2(n), ceilPow2(n), log2Floor(n));
        }
        System.out.println("ceilPow2((1 << 30) + 1) = " + ceilPow2((1 << 30) + 1));
        System.out.println("trailing zeros of 64    = " + Integer.numberOfTrailingZeros(64));
    }
}
```

```output
         n  floorPow2   ceilPow2  log2Floor
         1          1          1          0
         2          2          2          1
         3          2          4          1
         5          4          8          2
        16         16         16          4
        17         16         32          4
       100         64        128          6
      1000        512       1024          9
1073741824 1073741824 1073741824         30
ceilPow2((1 << 30) + 1) = -2147483648
trailing zeros of 64    = 6
```

Trace `ceilPow2(100)`. `x = 99 = 1100011`. After `x |= x >>> 1`, the two top bits have spread one place: `1110011`. After `x |= x >>> 2`: `1111111`. The remaining shifts change nothing for such a small number, but are needed for large ones — after shifting by 1, 2, 4, 8 and 16, the highest bit has been copied into all 31 positions below it. Adding 1 gives `10000000` = 128.

The last line of output is a warning: the smallest power of two ≥ 2³⁰ + 1 is 2³¹, which does not fit in a positive `int`, so the result wraps to `Integer.MIN_VALUE`. Real code clamps to a maximum capacity or uses `long`. The method is only defined for `1 ≤ n ≤ 2³⁰`, and in that range it matched a brute-force "double until ≥ n" loop for every tested input. A shorter form that you will also see, `Integer.highestOneBit(n - 1) << 1` (for `n > 1`), gives the same results.

**Why not use `Math.log`?** `(int) (Math.log(n) / Math.log(2))` goes through floating point, and the rounding error can land just below an integer exponent for exact powers. The bit methods are exact, and HotSpot compiles `numberOfLeadingZeros` and `numberOfTrailingZeros` to single instructions on common CPUs.

## Modulo and division by a power of two

If `m` is a power of two, `m - 1` is a block of ones below `m`'s bit: for `m = 8`, `m - 1 = 0111`. AND with it keeps the low three bits of `x`, which is exactly the remainder when dividing by 8 — the higher bits are all multiples of 8. Likewise, shifting right by 3 drops those low bits and divides by 8. These replacements are why power-of-two sizes are popular. But negative numbers expose a difference:

```java title="ModPow2.java"
public class ModPow2 {
    public static void main(String[] args) {
        int m = 8;                                   // a power of two
        int[] xs = {13, 8, 0, -1, -13};
        System.out.println("   x   x % 8   x & 7   floorMod   x >> 3   x / 8");
        for (int x : xs) {
            System.out.printf("%4d %7d %7d %10d %8d %7d%n",
                    x, x % m, x & (m - 1), Math.floorMod(x, m), x >> 3, x / m);
        }
    }
}
```

```output
   x   x % 8   x & 7   floorMod   x >> 3   x / 8
  13       5       5          5        1       1
   8       0       0          0        1       1
   0       0       0          0        0       0
  -1      -1       7          7       -1       0
 -13      -5       3          3       -2      -1
```

For non-negative `x` the columns agree. For negative `x`, Java's `%` follows truncating division and can return a negative remainder, while `x & (m - 1)` always returns a value in `0..m-1` — the same as `Math.floorMod(x, m)`. Similarly `x >> k` is floor division and `x / m` truncates towards zero. Neither pair is "wrong"; they answer different questions. For an array index you want the non-negative result, which is why `hash & (length - 1)` is safe even for negative hash codes while `hash % length` is not. A brute-force check over all `k` from 0 to 30 confirmed `x & ((1 << k) - 1) == Math.floorMod(x, 1 << k)` and `x >> k == Math.floorDiv(x, 1 << k)` for every tested `int`, including `Integer.MIN_VALUE`.

> [!WARNING] The mask only works for powers of two
> `x & (m - 1)` equals `x mod m` only when `m` is a power of two. For `m = 10`, `m - 1 = 1001` and `x & 9` is not a remainder at all. If a capacity can be any number, use `Math.floorMod`.

```quiz
Q: Why does `isPowerOfTwo` need the `n > 0` check in `n > 0 && (n & (n - 1)) == 0`?
- [ ] Because `n & (n - 1)` throws an exception for negative numbers
- [x] Because 0 and Integer.MIN_VALUE also make `n & (n - 1)` zero but are not powers of two
- [ ] Because 1 would otherwise be rejected
- [ ] It is not needed; the AND already handles every case
> For 0, `0 & -1` is 0. For MIN_VALUE (a single 1 in the sign bit), `MIN_VALUE - 1` wraps to MAX_VALUE, which shares no bits with it, so the AND is 0. Bit operations never throw, and 1 passes the test with or without the guard.

Q: What is `-13 & 7` in Java?
- [ ] -5
- [x] 3
- [ ] 5
- [ ] -13
> AND with 7 keeps the low three bits, which gives the mathematical (floor) remainder in 0..7: -13 = -2 * 8 + 3. `-13 % 8` is -5 because Java's `%` truncates towards zero.

Q: Which expression gives floor(log2(n)) exactly for every positive int n?
- [ ] `(int) (Math.log(n) / Math.log(2))`
- [x] `31 - Integer.numberOfLeadingZeros(n)`
- [ ] `Integer.numberOfTrailingZeros(n)`
- [ ] `Integer.bitCount(n) - 1`
> The highest set bit's position is the floor of log2, and it sits below `numberOfLeadingZeros(n)` zero bits. Floating-point logarithms can round down an exact power. Trailing zeros give the exponent only when n is itself a power of two (12 has 2 trailing zeros but floor(log2 12) is 3), and bitCount counts bits, not positions.
```

## In real systems

**Hash tables.** `java.util.HashMap` keeps its table length a power of two so that the bucket index is `(length - 1) & hash` — one AND instead of a division, and never negative. When you pass an initial capacity, `HashMap.tableSizeFor` rounds it up to a power of two; in current JDKs (including 21) it does this with `-1 >>> Integer.numberOfLeadingZeros(cap - 1)`, the library version of the smear trick, then adds one. The trade-off is that with a power-of-two mask only the low bits of the hash choose the bucket, which is why `HashMap` first mixes the high bits in with `h ^ (h >>> 16)`.

**Growable arrays and buffers.** Doubling capacity when full gives amortised O(1) appends, and sizes stay powers of two if they start at one. Ring buffers with power-of-two capacity wrap their indices with `& (capacity - 1)`.

**Memory allocators and alignment.** Allocators commonly hand out blocks in power-of-two size classes (buddy allocation splits and merges them by halves). Aligning an address `a` up to a multiple of a power of two `m` is `(a + m - 1) & -m` — rounding up, then clearing the low bits.

**Index structures.** A Fenwick tree ([[a12-fenwick]]) moves between nodes with `i & -i`, the lowest set bit. Sparse tables ([[a12-sparse-tables]]) precompute answers for ranges of length 2ᵏ and use `⌊log₂ len⌋` to pick two overlapping ranges. Binary lifting for lowest common ancestor ([[a6-lca]]) stores the 2ᵏ-th ancestor of each node. All rely on the fact that any distance can be written as a sum of distinct powers of two — its binary representation.

## Trade-offs and alternatives

| Technique | Cost | Caveat |
|---|---|---|
| `n > 0 && (n & (n - 1)) == 0` | O(1) | Must keep the `n > 0` guard |
| Divide-by-2 loop | O(log n) | Clear to beginners, slower |
| `Integer.bitCount(n) == 1` | O(1) | Accepts MIN_VALUE without a guard |
| `highestOneBit`, `numberOfLeadingZeros` | O(1), intrinsic | Defined edge results for 0 to remember |
| `Math.log` for exponents | O(1) | Floating-point rounding; avoid for exact work |

Power-of-two table sizes make indexing cheap, but they can waste up to half the allocated space (a table for 1,025 entries rounds up to 2,048) and they make the table sensitive to hash functions that vary only in their high bits. Some hash tables use prime sizes for that reason and pay for a real modulo.

## Common mistakes

> [!MISTAKE] Calling zero a power of two
> `(n & (n - 1)) == 0` is true for 0 and for Integer.MIN_VALUE. Always include `n > 0` (or `n > 0L` for `long`).

**Confusing "even" with "power of two".** Every power of two except 1 is even, but 6, 10 and 12 are even and are not powers of two. Evenness is bit 0; power-of-two-ness is about how many bits are set.

**Overflow when rounding up or doubling.** The next power of two above 2³⁰ is 2³¹, which is negative as an `int`; `1 << 31` is MIN_VALUE and `1 << 32` is 1. Clamp to a maximum or switch to `long`.

**Using `trailingZeros` as a general log.** `numberOfTrailingZeros` gives the exponent only for exact powers of two. For a general `n`, the floor log is `31 - numberOfLeadingZeros(n)`.

**Replacing `%` with `&` on signed values without thinking.** They differ for negative numbers. That is usually what you want for indexing, but it changes behaviour if the code relied on `%` returning a negative remainder.

**Rounding exact powers up.** Forgetting the `n - 1` in the smear method maps 16 to 32. "Next power of two ≥ n" and "next power strictly greater than n" are different questions; read the problem.

## Interview perspective

"Power of Two" is a warm-up question; the interviewer is listening for the explanation and the edge cases, not the one-liner.

- **Why does `n & (n - 1)` detect powers of two?** It removes the lowest set bit; the result is zero exactly when that was the only set bit.
- **What about 0 and negative inputs?** Rule them out with `n > 0`; mention MIN_VALUE explicitly, since it is the case most candidates miss.
- **Power of four or power of three?** Four: add a mask for even positions. Three is not a bit question: for `int`, `n > 0 && 1162261467 % n == 0` works because 3¹⁹ = 1,162,261,467 is the largest power of three that fits and 3 is prime.
- **Round up to the next power of two.** Subtract one, smear, add one; discuss overflow at 2³⁰.
- **Why are hash table sizes powers of two?** Cheap non-negative indexing with AND; cost is relying on good low bits.

> [!INTERVIEW] Edge cases as a reflex
> For any bit trick on `int`, run through 0, 1, -1, Integer.MIN_VALUE and Integer.MAX_VALUE before you say you are done. For the power-of-two test, 0 and MIN_VALUE are exactly the inputs that break the unguarded version.

## Practice

1. Write `isPowerOfTwo(long n)` and test it on `1L << 62`, `1L << 63` and `0`.
2. Write `largestPowerOfTwoAtMost(int n)` without `Integer.highestOneBit`, using the smear technique.
3. Write `alignUp(long address, long alignment)` for power-of-two alignments, and assert that `alignment` is one.
4. Given `n`, count how many integers in `1..n` are powers of two, in O(1).
5. Return `true` if `n` is a power of two whose exponent is a multiple of 3 (1, 8, 64, ...).
6. Explain in two sentences why `ceilPow2` uses `>>>` rather than `>>`, and whether it matters for its valid inputs.

In the DSA explorer, start with *Power of Two*, *Power of Four* and *Counting Bits*.

## Quick revision {#quick-revision}

- Power of two ⇔ positive and exactly one set bit. 2ᵏ is `1 << k`.
- Test: `n > 0 && (n & (n - 1)) == 0`. Equivalent: `n > 0 && (n & -n) == n`, `n > 0 && Integer.bitCount(n) == 1`.
- Without `n > 0`, 0 and Integer.MIN_VALUE pass wrongly.
- Power of four: also `(n & 0x55555555) != 0`.
- Round down: `Integer.highestOneBit(n)`. ⌊log₂ n⌋: `31 - Integer.numberOfLeadingZeros(n)`. Exponent of an exact power: `Integer.numberOfTrailingZeros(n)`.
- Round up (1 ≤ n ≤ 2³⁰): `x = n - 1`, smear with `x |= x >>> 1, 2, 4, 8, 16`, return `x + 1`.
- `x & (m - 1) == Math.floorMod(x, m)` and `x >> k == Math.floorDiv(x, 1 << k)` for power-of-two `m`; differ from `%` and `/` for negatives.
- Used in HashMap indexing, ring buffers, alignment, Fenwick trees, sparse tables, binary lifting.

## Key takeaways {#key-takeaways}

- In binary, powers of two have exactly one set bit, so most power-of-two questions become single-bit questions.
- `n & (n - 1)` removes the lowest set bit; it is zero exactly for numbers with at most one set bit, so guard with `n > 0`.
- The highest set bit gives the round-down power and the floor logarithm; smearing it downward gives the round-up power.
- AND with `m - 1` and right shifts replace modulo and division by powers of two, with floor semantics for negatives.
- Power-of-two sizing trades some wasted space for very cheap indexing, which is why so many data structures use it.
