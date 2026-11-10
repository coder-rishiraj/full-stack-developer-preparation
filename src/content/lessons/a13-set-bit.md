---
summary: Setting, clearing, toggling and testing a single bit are the four basic moves of bit manipulation. You will learn to build the one-bit mask `1 << k`, why each move uses the operator it does, the lowest-set-bit tricks `n & (n - 1)` and `n & -n`, and the overflow and precedence traps that break these one-liners in Java.
difficulty: beginner
minutes: 45
objectives:
  - Build a single-bit mask with 1 << k and a range mask for bits i..j, using long where the width requires it
  - Implement set, clear, toggle and test for bit k and justify why each uses |, & ~, ^ or & respectively
  - Explain why n & (n - 1) clears the lowest set bit and why n & -n isolates it
  - Count and list set bits in time proportional to the number of ones
  - Debug the classic mistakes - XOR used to set, missing parentheses around ~, == 1 tests and 1 << 31
---

## Introduction

Suppose an application stores a user's permissions as one integer: bit 0 means "can read", bit 1 "can write", bit 2 "can execute", bit 3 "is admin". Granting admin rights should turn on bit 3 *and leave every other permission exactly as it was*. Revoking write access should turn off bit 1 and nothing else. Before showing a "Delete" button, the interface needs to ask whether bit 1 is on.

Those are the four basic operations on a single bit:

| Operation | Effect on bit `k` | Expression |
|---|---|---|
| **Set** | Force to 1 | `n \| (1 << k)` |
| **Clear** (unset) | Force to 0 | `n & ~(1 << k)` |
| **Toggle** | Flip | `n ^ (1 << k)` |
| **Check** (test) | Read without changing | `(n & (1 << k)) != 0` |

Each is one or two CPU instructions. They are the building blocks of flag fields, compact sets ([[a13-bitmasking]]), bitmask dynamic programming ([[a11-bitmask-dp]]) and most bit-trick interview problems. This lesson teaches setting and toggling first, then gives clearing ([[a13-unset-bit]]) and checking ([[a13-check-bit]]) their own sections, because each has tricks of its own.

## Before you start

- **AND, OR, XOR, NOT and shifts** — what each operator does to one column of bits, and two's complement. See [[a13-and-or-xor]]; this lesson uses all of it.
- **Basic Java** — `int`, `long`, methods. See [[a1-java-syntax-competitive]].

## The intuition: a mask with one hole

Think of `n` as a row of 32 switches and imagine a stencil — a **mask** — laid over it. The stencil for "bit `k`" has exactly one hole, at position `k`. Each operation decides what happens under the hole while guaranteeing that nothing outside the hole changes:

- OR pushes the switch under the hole **on**. Everywhere else the stencil has 0, and `x | 0 == x`.
- XOR **flips** the switch under the hole. Everywhere else `x ^ 0 == x`.
- AND with the *inverted* stencil (1 everywhere except the hole) pushes the switch under the hole **off**. Everywhere else `x & 1 == x`.
- AND with the stencil itself shows only the switch under the hole: the result is either 0 or the mask.

That "nothing outside the hole changes" guarantee is the whole reason these expressions are correct. When you are unsure whether an expression is right, check two things: what happens at position `k`, and whether the other positions are left alone.

## Building the mask: `1 << k`

The number with only bit `k` set is 2ᵏ, and the quickest way to write it is `1 << k`: take `1` (bit 0 set) and shift it left `k` places. `1 << 0 == 1`, `1 << 3 == 8` (`1000`), `1 << 10 == 1024`.

Bits are numbered from **0 at the least significant (rightmost) end**. If a problem says "the 3rd bit" check whether it counts from 0 or 1; a one-based position `p` is `1 << (p - 1)`.

Two width limits apply in Java:

- `1 << 31` is `Integer.MIN_VALUE`, a negative number. The bit pattern is right — only bit 31 is set — so it works as a mask, but any test written as `> 0` will misread it.
- `int` shifts use only the low 5 bits of the distance, so `1 << 32 == 1` and `1 << 35 == 8`. For a `long` value, or any position from 32 to 63, write `1L << k`.

### Masks for several bits

Combine single-bit masks with OR: `(1 << 2) | (1 << 5)` is the mask for bits 2 and 5. A mask of the **lowest `k` bits** is `(1 << k) - 1`: subtracting one from `1000` gives `0111`. A mask for the **range `i..j` inclusive** shifts that block up into place: `((1 << (j - i + 1)) - 1) << i`.

The range formula breaks when the block is 32 bits wide, because `1 << 32` is `1`, so `(1 << 32) - 1` is `0` instead of all ones. Doing the arithmetic in `long` avoids that: `(int) (((1L << (j - i + 1)) - 1) << i)` is correct for every `0 ≤ i ≤ j ≤ 31`. Another correct form uses an unsigned shift of all ones: `(-1 >>> (31 - (j - i))) << i`. Both were checked against a bit-by-bit brute force for every `i` and `j`.

## Setting a bit

To set bit `k` of `n` — make it 1 whatever it was — OR with the mask:

```java
int setBit(int n, int k) { return n | (1 << k); }
```

Column by column: at position `k` the mask has 1, and `anything | 1 == 1`. Everywhere else the mask has 0, and `x | 0 == x`. So bit `k` becomes 1 and every other bit is unchanged. Setting a bit that is already set does nothing, which is exactly what "grant admin" should do when the user is already an admin. Setting is **idempotent**.

Two tempting alternatives are wrong:

```java title="SetPitfalls.java"
public class SetPitfalls {
    public static void main(String[] args) {
        int n = 10;                                 // 1010, bit 1 already set
        System.out.println("n | (1 << 1)  = " + (n | (1 << 1)));   // stays 10
        System.out.println("n ^ (1 << 1)  = " + (n ^ (1 << 1)));   // toggles it off: 8
        System.out.println("n + (1 << 1)  = " + (n + (1 << 1)));   // carries: 12

        int i = 2, j = 5;                           // set bits 2..5 inclusive
        int mask = ((1 << (j - i + 1)) - 1) << i;
        System.out.println("mask 2..5     = " + Integer.toBinaryString(mask));
        System.out.println("0 | mask      = " + (0 | mask));

        int all = (int) ((1L << 32) - 1);          // bits 0..31: needs long arithmetic
        System.out.println("(1 << 32) - 1 = " + ((1 << 32) - 1));
        System.out.println("via long      = " + all);
    }
}
```

```output
n | (1 << 1)  = 10
n ^ (1 << 1)  = 8
n + (1 << 1)  = 12
mask 2..5     = 111100
0 | mask      = 60
(1 << 32) - 1 = 0
via long      = -1
```

`n` is `1010`, so bit 1 is already on. OR leaves it at 10. XOR *toggles*, so it turns bit 1 off and gives 8. Addition carries: `1010 + 0010 = 1100`, which clears bit 1 and sets bit 2. Addition and XOR only coincide with OR when the bit was 0 beforehand — a condition that is easy to forget and hard to spot in testing.

## Toggling a bit

To flip bit `k`, XOR with the mask: `n ^ (1 << k)`. At position `k`, `0 ^ 1 == 1` and `1 ^ 1 == 0`; elsewhere `x ^ 0 == x`. Toggling twice restores the original value, so toggle is its own inverse. Use it when the operation genuinely means "switch state", such as flipping a light in a puzzle or moving between two states in a [[a13-bitmasking]] search. Do not use it when you mean set or clear.

## Unset Bit {#a13-unset-bit}

**Unsetting** (or **clearing**) bit `k` means forcing it to 0 while leaving every other bit unchanged. Revoking one permission, removing an element from a bitmask set, and marking a node as no longer visited are all clears.

### Clearing bit `k`: `n & ~(1 << k)`

AND can only turn bits off, so it is the right operator — but AND with the plain mask `1 << k` would keep bit `k` and clear everything *else*. You need the opposite stencil: 1 everywhere except position `k`. That is `~(1 << k)`. For `k = 3`:

```text
1 << 3      = 00000000 00000000 00000000 00001000
~(1 << 3)   = 11111111 11111111 11111111 11110111
```

Now `n & ~(1 << k)` keeps every bit where the inverted mask has 1 (all positions except `k`) and forces position `k` to 0. Clearing an already-clear bit changes nothing.

The parentheses matter. `~` is a unary operator and binds tighter than `<<`, so `~1 << k` means `(~1) << k` — all ones shifted left — which clears bits 0 through `k`, not just bit `k`:

```java title="UnsetDemo.java"
public class UnsetDemo {
    public static void main(String[] args) {
        int n = 44;                                   // 101100
        int k = 3;
        System.out.println("~(1 << 3)        = " + Integer.toBinaryString(~(1 << k)));
        System.out.println("n & ~(1 << 3)    = " + (n & ~(1 << k)));   // 100100 = 36
        System.out.println("n & ~1 << 3      = " + (n & ~1 << k));     // wrong mask
        System.out.println("n & (n - 1)      = " + (n & (n - 1)));     // 101000 = 40
        System.out.println("n & -n           = " + (n & -n));          // 000100 = 4
        System.out.println("n & ~0 << 4      = " + (n & ~0 << 4));     // clear bits 0..3
        System.out.println("MIN & (MIN - 1)  = " + (Integer.MIN_VALUE & (Integer.MIN_VALUE - 1)));
        System.out.println("MIN & -MIN       = " + (Integer.MIN_VALUE & -Integer.MIN_VALUE));
    }
}
```

```output
~(1 << 3)        = 11111111111111111111111111110111
n & ~(1 << 3)    = 36
n & ~1 << 3      = 32
n & (n - 1)      = 40
n & -n           = 4
n & ~0 << 4      = 32
MIN & (MIN - 1)  = 0
MIN & -MIN       = -2147483648
```

`44` is `101100`. Clearing bit 3 gives `100100` (36). The unparenthesised version cleared bits 0–3 and produced `100000` (32). XOR is also wrong for clearing: if the bit was already 0, `n ^ (1 << k)` turns it *on*.

To clear several bits, clear a whole mask at once: `n & ~mask`. To clear everything **below** bit `k`, AND with all ones shifted left: `n & (~0 << k)` (shown above with `k = 4`; `<<` binds tighter than `&`, so the parentheses are optional there but help readers). To keep *only* the low `k` bits, AND with `(1 << k) - 1`.

### Clearing the lowest set bit: `n & (n - 1)`

Often you do not know which bit to clear; you want to remove the **lowest set bit** (the rightmost 1), whatever position it is at. The expression `n & (n - 1)` does that.

Why: subtracting 1 borrows from the lowest 1. That bit becomes 0 and every 0 below it becomes 1; bits above it are untouched.

```text
n       = 1011 0100
n - 1   = 1011 0011     lowest 1 became 0, the zeros below became 1
n & n-1 = 1011 0000     lowest 1 is gone, everything above survives
```

In the AND, the positions at and below the old lowest 1 disagree between `n` and `n - 1`, so they all become 0. The positions above agree, so they survive. This works for negative numbers too, because two's complement subtraction is the same bit operation. Even `Integer.MIN_VALUE` behaves: `MIN_VALUE - 1` wraps to `MAX_VALUE` (`0111...1`), and the AND is 0, which is right because MIN_VALUE has only one set bit.

A close relative is `n & -n`, which **isolates** the lowest set bit — keeps it and clears everything else. Since `-n == ~n + 1`, negating flips every bit and the `+ 1` carries through the flipped trailing zeros back to the position of the lowest 1. So `-n` agrees with `n` at that bit and below, and is the exact opposite above it; the AND keeps just that one bit. For 44 (`101100`) the result is `100` (4). For `Integer.MIN_VALUE` it returns MIN_VALUE, which is correct as a bit pattern (bit 31 alone). Java's `Integer.lowestOneBit(n)` computes the same value, and `n ^ (n & -n)` equals `n & (n - 1)`.

### Counting set bits with Kernighan's loop

Because each `n &= n - 1` removes exactly one 1, the number of iterations until `n` becomes zero is the number of set bits. This is **Brian Kernighan's method**:

```java title="Kernighan.java"
public class Kernighan {

    static int countSetBits(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;        // removes exactly the lowest 1 bit
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int[] tests = {44, 0, 1, -1, Integer.MIN_VALUE, Integer.MAX_VALUE};
        for (int t : tests) {
            System.out.printf("%11d -> %2d (Integer.bitCount: %d)%n",
                    t, countSetBits(t), Integer.bitCount(t));
        }
    }
}
```

```output
         44 ->  3 (Integer.bitCount: 3)
          0 ->  0 (Integer.bitCount: 0)
          1 ->  1 (Integer.bitCount: 1)
         -1 -> 32 (Integer.bitCount: 32)
-2147483648 ->  1 (Integer.bitCount: 1)
 2147483647 -> 31 (Integer.bitCount: 31)
```

Dry run for 44:

| Iteration | `n` before | `n - 1` | `n & (n - 1)` | `count` |
|---|---|---|---|---|
| 1 | `101100` (44) | `101011` | `101000` (40) | 1 |
| 2 | `101000` (40) | `100111` | `100000` (32) | 2 |
| 3 | `100000` (32) | `011111` | `000000` (0) | 3 |

The loop runs once per set bit, so its time is **O(number of set bits)**, at most 32 for an `int`. Unlike a loop that shifts with `>>`, it terminates for negative inputs: `-1` takes 32 iterations, not forever. In production code call `Integer.bitCount`, which the JIT compiler replaces with the CPU's population-count instruction on hardware that has one; the loop is what interviewers want you to be able to derive.

## Check Bit {#a13-check-bit}

**Checking** (or **testing**) bit `k` means reading whether it is 1 without changing `n`. "Can this user write?", "is element `k` in this subset?" and "is this number odd?" are all bit checks. There are two standard forms.

**Mask form:** `(n & (1 << k)) != 0`. The AND keeps only bit `k`; the result is either `0` or exactly `1 << k`. Compare with `!= 0`, never with `== 1`: when bit 3 is set, the AND gives 8, not 1.

**Shift form:** `(n >> k) & 1`. Shift bit `k` down to position 0, then keep only position 0. The result is the bit's value, `0` or `1`, which is convenient when you want to add it to a count or use it as an index. `(n >>> k) & 1` gives the same result for every `k` from 0 to 31: the two shifts only differ in what they fill in at the top, and `& 1` discards the top. Many people write `>>>` anyway so the intent ("raw bits") is clear.

Bit 0 is the common special case: `(n & 1) != 0` means `n` is odd, for negative numbers too.

```java title="CheckDemo.java"
public class CheckDemo {
    public static void main(String[] args) {
        int n = 12;                                         // 1100
        for (int k = 0; k < 4; k++) {
            System.out.println("bit " + k + ": " + ((n >> k) & 1)
                    + "  isSet=" + ((n & (1 << k)) != 0)
                    + "  (n & (1 << k)) == 1 -> " + ((n & (1 << k)) == 1));
        }
        int neg = -1;                                       // all 32 bits set
        System.out.println("bit 31 of -1, != 0 test: " + ((neg & (1 << 31)) != 0));
        System.out.println("bit 31 of -1, > 0 test:  " + ((neg & (1 << 31)) > 0));
        long big = 1L << 40;
        System.out.println("bit 40 of long, int mask: " + ((big & (1 << 40)) != 0));
        System.out.println("bit 40 of long, 1L mask:  " + ((big & (1L << 40)) != 0));
    }
}
```

```output
bit 0: 0  isSet=false  (n & (1 << k)) == 1 -> false
bit 1: 0  isSet=false  (n & (1 << k)) == 1 -> false
bit 2: 1  isSet=true  (n & (1 << k)) == 1 -> false
bit 3: 1  isSet=true  (n & (1 << k)) == 1 -> false
bit 31 of -1, != 0 test: true
bit 31 of -1, > 0 test:  false
bit 40 of long, int mask: false
bit 40 of long, 1L mask:  true
```

The output shows three bugs at once. `== 1` is false for every bit of 12, even the set ones. `> 0` fails at bit 31, because the isolated bit is `Integer.MIN_VALUE`, which is negative. And the `int` mask `1 << 40` is really `1 << 8` (shift distances wrap at 32), so it tests the wrong bit of the `long`. The fixes are `!= 0` and `1L << k` for `long` values.

### Visiting every set bit

To list the positions of all set bits you can check each of the 32 positions, or — faster when few bits are set — repeatedly isolate and remove the lowest one:

```java title="SetBitsList.java"
import java.util.ArrayList;
import java.util.List;

public class SetBitsList {

    // Checks every position: always 32 iterations.
    static List<Integer> positionsByScan(int n) {
        List<Integer> out = new ArrayList<>();
        for (int k = 0; k < 32; k++) {
            if (((n >>> k) & 1) == 1) out.add(k);
        }
        return out;
    }

    // Visits only the set bits: one iteration per 1.
    static List<Integer> positionsByLowBit(int n) {
        List<Integer> out = new ArrayList<>();
        while (n != 0) {
            int low = n & -n;                                  // isolate lowest 1
            out.add(Integer.numberOfTrailingZeros(low));       // its position
            n ^= low;                                          // remove it
        }
        return out;
    }

    static int[] countBits(int max) {                          // LeetCode 338
        int[] bits = new int[max + 1];
        for (int i = 1; i <= max; i++) {
            bits[i] = bits[i >> 1] + (i & 1);                  // drop bit 0, add it back
        }
        return bits;
    }

    public static void main(String[] args) {
        System.out.println(positionsByScan(44));
        System.out.println(positionsByLowBit(44));
        System.out.println(positionsByLowBit(-8));
        System.out.println(java.util.Arrays.toString(countBits(8)));
    }
}
```

```output
[2, 3, 5]
[2, 3, 5]
[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
[0, 1, 1, 2, 1, 2, 2, 3, 1]
```

`Integer.numberOfTrailingZeros(low)` turns the isolated bit back into its index. The `-8` case shows negative inputs are handled: −8 is all ones except the lowest three bits. A loop condition of `n > 0` instead of `n != 0` would have stopped immediately on it.

`countBits` checks bit 0 of every number from 0 to `max` with `i & 1`, and reuses the answer for `i >> 1` (the same number with bit 0 removed). That builds the whole table in O(max) time, a small example of dynamic programming over bits.

## Worked example: a permission field

Putting set, clear, toggle and check together on the scenario from the introduction:

```java title="Permissions.java"
public class Permissions {
    static final int READ    = 1 << 0;   // bit 0
    static final int WRITE   = 1 << 1;   // bit 1
    static final int EXECUTE = 1 << 2;   // bit 2
    static final int ADMIN   = 1 << 3;   // bit 3

    static int setBit(int n, int k)       { return n | (1 << k); }
    static int clearBit(int n, int k)     { return n & ~(1 << k); }
    static int toggleBit(int n, int k)    { return n ^ (1 << k); }
    static boolean isSet(int n, int k)    { return (n & (1 << k)) != 0; }

    static String show(int perms) {
        return String.format("%4s", Integer.toBinaryString(perms)).replace(' ', '0')
                + " (" + perms + ")";
    }

    public static void main(String[] args) {
        int perms = READ | WRITE;                  // start with read and write
        System.out.printf("%-18s%s%n", "start", show(perms));
        perms = setBit(perms, 3);                  // grant admin
        System.out.printf("%-18s%s%n", "set bit 3", show(perms));
        perms = setBit(perms, 3);                  // granting again changes nothing
        System.out.printf("%-18s%s%n", "set bit 3 again", show(perms));
        perms = clearBit(perms, 1);                // revoke write
        System.out.printf("%-18s%s%n", "clear bit 1", show(perms));
        perms = clearBit(perms, 1);                // revoking again changes nothing
        System.out.printf("%-18s%s%n", "clear bit 1 again", show(perms));
        perms = toggleBit(perms, 2);               // flip execute on
        System.out.printf("%-18s%s%n", "toggle bit 2", show(perms));
        System.out.printf("%-18s%s%n", "can write?", isSet(perms, 1));
        System.out.printf("%-18s%s%n", "is admin?", ((perms & ADMIN) != 0));
    }
}
```

```output
start             0011 (3)
set bit 3         1011 (11)
set bit 3 again   1011 (11)
clear bit 1       1001 (9)
clear bit 1 again 1001 (9)
toggle bit 2      1101 (13)
can write?        false
is admin?         true
```

Follow the bits. `READ | WRITE` combines bits 0 and 1 into `0011`. Setting bit 3 adds the admin flag; doing it again is harmless. Clearing bit 1 removes write; clearing it again is harmless. Toggling bit 2 turns execute on because it was off. The checks read single bits without modifying the field. Because the helper methods return new values instead of changing their argument (Java passes `int` by value anyway), the calling code must assign the result back — forgetting `perms = ...` is a common bug.

Each operation is O(1) time and O(1) space. Every one of these helpers was compared with a version that converts the number to an array of 32 bits, edits the array and converts back, across all `k` from 0 to 31 and over two hundred thousand inputs including `0`, `-1`, `Integer.MIN_VALUE` and `Integer.MAX_VALUE`; they agreed everywhere except the deliberately broken `> 0` test at bit 31.

```quiz
Q: `n = 10` (binary `1010`). What does `n ^ (1 << 1)` return, and why is it the wrong way to "set" bit 1?
- [ ] 10, because XOR sets bits that are already set
- [x] 8, because XOR toggles: bit 1 was already 1, so it is turned off
- [ ] 12, because XOR carries into bit 2
- [ ] 11, because XOR sets bit 0
> XOR flips the bit under the mask. Setting must leave an already-set bit at 1, which only OR guarantees: `10 | 2 == 10`. Carrying into bit 2 is what `+` does, giving 12.

Q: Which expression clears only bit `k` of `n`?
- [ ] `n & ~1 << k`
- [ ] `n ^ (1 << k)`
- [x] `n & ~(1 << k)`
- [ ] `n & (1 << k)`
> `~(1 << k)` has a single 0 at position k, so the AND forces that bit off and keeps the rest. `~1 << k` is parsed as `(~1) << k` and clears bits 0..k. XOR turns the bit on when it was 0. `n & (1 << k)` keeps bit k and clears everything else.

Q: `int x = -1;` Which test correctly reports that bit 31 is set?
- [ ] `(x & (1 << 31)) > 0`
- [ ] `(x & (1 << 31)) == 1`
- [x] `(x & (1 << 31)) != 0`
- [ ] `(x & (1 << 32)) != 0`
> The isolated bit 31 is `Integer.MIN_VALUE`, which is negative, so `> 0` is false and `== 1` is false. `!= 0` works for every position. `1 << 32` equals `1 << 0` because int shift distances wrap at 32, so it tests bit 0.

Q: How many times does the loop `while (n != 0) { n &= n - 1; count++; }` run for `n = -8`?
- [ ] Forever, because n is negative
- [ ] 3
- [x] 29
- [ ] 32
> -8 in two's complement is all ones except bits 0, 1 and 2, so it has 29 set bits. Each iteration removes exactly one of them, and the loop ends when none remain. Kernighan's loop terminates for negative numbers; it is the `>>` shifting loop that can run forever.
```

## In real systems

**Flags in the JDK and operating systems.** `java.lang.reflect.Modifier.isStatic(int mod)` is a bit check against the modifier field of a class file. Linux `open()` takes `O_RDONLY | O_CREAT | O_TRUNC`; file permission changes such as `chmod g-w` clear one bit of the mode. Network code reads TCP flags such as SYN and ACK with masks.

**Compact sets.** `java.util.EnumSet` stores enums with up to 64 constants as a single `long` (the JDK's `RegularEnumSet`), where `add` is a set-bit, `remove` a clear-bit and `contains` a check-bit. `java.util.BitSet` does the same over an array of `long`s for larger sets. Databases use bitmaps for null tracking and bitmap indexes.

**Hardware and embedded code.** Device registers are controlled by setting and clearing individual bits; the "read, OR or AND-NOT, write back" pattern is everyday embedded C.

**Counting bits.** Hamming weight (`Integer.bitCount`) is used in error-correcting codes, in similarity search over binary fingerprints, and in chess engines that store the board as 64-bit bitboards.

## Trade-offs and alternatives

| Representation | Space for 64 flags | Speed | Readability |
|---|---|---|---|
| `long` with bit operations | 8 bytes | One instruction per operation, whole-set operations in one instruction | Needs named constants and helpers |
| `boolean[]` or 64 `boolean` fields | 64 bytes or more | Fast per flag; no whole-set operations | Very clear |
| `EnumSet` | One `long` internally for up to 64 constants | Close to raw bits | Clear, type-safe |
| `BitSet` | Grows with the highest bit used | Fast; supports `and`, `or`, `xor` across sets | Clear |

Raw bit operations are the right choice for interview problems, performance-critical inner loops and compact storage. In ordinary application code, hide them behind well-named constants or use `EnumSet`, so readers see `perms.contains(ADMIN)` rather than `(perms & 8) != 0`.

## Common mistakes

> [!MISTAKE] Using XOR or + to set or clear
> XOR toggles, so it only "sets" a bit that was 0 and only "clears" a bit that was 1. Addition carries into the next bit when the target bit is already 1. Use `|` to set and `& ~` to clear; reserve `^` for genuine toggles.

**Missing parentheses around the mask.** `~1 << k` is `(~1) << k`. `n & 1 << k == 0` does not compile, because `==` binds tighter than `&`. Write `(n & (1 << k)) == 0`.

**Comparing the masked value with 1.** `(n & (1 << k)) == 1` is only ever true for `k = 0`. Compare with `0`, or shift first: `((n >> k) & 1) == 1`.

**Testing with `> 0`.** Fails for bit 31 of an `int` and bit 63 of a `long`, where the isolated bit is negative.

**Using an `int` mask on a `long`.** `bits & (1 << 40)` tests bit 8. Write `1L << k`.

**Forgetting to assign the result.** `setBit(perms, 3);` on its own does nothing to `perms`. Write `perms = setBit(perms, 3);` or `perms |= 1 << 3;`.

**One-based versus zero-based positions.** The rightmost bit is position 0. If a problem numbers bits from 1, use `1 << (p - 1)`.

## Interview perspective

These operations are rarely the whole question; they are steps inside bigger problems (subset generation, bitmask DP, "Single Number" variants, "Counting Bits", "Power of Two"). Interviewers expect you to write them correctly without hesitation and to explain *why* each operator is the right one.

- **Set, clear, toggle and test bit `k`.** `|`, `& ~`, `^`, `& ... != 0`, each with the reason in one sentence.
- **Why does `n & (n - 1)` clear the lowest set bit?** Subtracting 1 flips the lowest 1 and the zeros beneath it; AND discards exactly those positions.
- **Why does `n & -n` isolate it?** `-n == ~n + 1`; the carry from `+ 1` stops at the lowest 1, so `-n` matches `n` there and is inverted above.
- **Count set bits.** Kernighan's loop, O(set bits); mention `Integer.bitCount` for real code.
- **Set all bits from `i` to `j`.** Build `((1L << (j - i + 1)) - 1) << i` and OR it in; explain why `long` avoids the 32-bit-wide edge case.

> [!INTERVIEW] Show the two checks
> When you write any of these expressions, say aloud what happens at position `k` and why every other position is unchanged. That two-part check is what distinguishes understanding from a memorised one-liner, and it catches the `~` parenthesis bug before the interviewer does.

A common follow-up is "how would you update bits `i..j` of `n` to equal the low bits of `m`?" (insert `m` into `n`): clear the range with `n & ~rangeMask`, then OR in `(m << i) & rangeMask`.

## Practice

1. Write `setBit`, `clearBit`, `toggleBit` and `isSet` for `long` and test them at positions 0, 31, 32 and 63.
2. Write `clearRange(int n, int i, int j)` that clears bits `i..j` inclusive, correct for `i = 0, j = 31`.
3. Write `insertBits(int n, int m, int i, int j)` that replaces bits `i..j` of `n` with the low bits of `m`.
4. Return the positions of the set bits of a `long` in increasing order, visiting only the set bits.
5. Count bits for every number from 0 to `n` in O(n) using `i & (i - 1)` instead of `i >> 1`.
6. Without running code, trace Kernighan's loop on `n = -2`. How many iterations, and why?

In the DSA explorer, start with *Number of 1 Bits*, *Counting Bits* and *Reverse Bits*.

## Quick revision {#quick-revision}

- Mask for bit `k`: `1 << k` (positions from 0 at the right). Use `1L << k` for `long` or `k ≥ 31` when the sign matters.
- Set: `n | (1 << k)`. Clear: `n & ~(1 << k)`. Toggle: `n ^ (1 << k)`. Check: `(n & (1 << k)) != 0` or `(n >> k) & 1`.
- Set and clear are idempotent; toggle is its own inverse.
- Low `k` bits: `(1 << k) - 1`. Range `i..j`: `(int) (((1L << (j - i + 1)) - 1) << i)`.
- Clear bits below `k`: `n & (~0 << k)`. Keep low `k` bits: `n & ((1 << k) - 1)`.
- Clear lowest set bit: `n & (n - 1)`. Isolate it: `n & -n` (= `Integer.lowestOneBit`).
- Kernighan count: loop `n &= n - 1` until zero; O(set bits); terminates for negatives.
- Pitfalls: `~1 << k`, `== 1`, `> 0` at bit 31, `int` mask on `long`, forgetting to assign.

## Key takeaways {#key-takeaways}

- Every single-bit operation is "do something at position `k`, leave the rest alone"; pick the operator whose identity value (`| 0`, `^ 0`, `& 1`) leaves other bits unchanged.
- Set with OR, clear with AND-NOT, toggle with XOR, test with AND compared to zero.
- `n & (n - 1)` removes the lowest set bit and `n & -n` isolates it; both follow from how subtraction borrows in two's complement.
- Kernighan's loop counts set bits in O(number of ones) and is safe for negative numbers.
- Java's shift width rules (`1 << 31` is negative, `1 << 32 == 1`) cause most real bugs; use `1L` and `!= 0`.
