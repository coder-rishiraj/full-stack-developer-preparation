---
summary: AND, OR and XOR combine two integers one binary digit at a time. You will learn how Java stores integers in two's complement, what each bitwise operator (and NOT and the shifts) does to those bits, and the handful of algebraic facts that turn up in almost every bit-manipulation problem.
difficulty: beginner
minutes: 45
objectives:
  - Explain how Java represents an int in 32-bit two's complement and predict the bits of small negative numbers
  - Trace &, |, ^, ~, <<, >> and >>> on concrete values, including negative ones
  - Choose AND to test or keep bits, OR to turn bits on, and XOR to flip bits or detect differences
  - Apply the identities a ^ a = 0, a ^ 0 = a, -a = ~a + 1 and a + b = (a ^ b) + 2(a & b)
  - Debug precedence mistakes, & versus && confusion, and signed versus unsigned shifts
---

## Introduction

Every `int` in a Java program is stored as 32 binary digits — 32 tiny switches that are either 0 or 1. Most of the time you never think about them: you add, compare and print numbers as numbers. But a surprising number of problems become easier if you can look at those switches directly. "Is this number odd?" is a question about the last switch. "Which of these 20 features has the user enabled?" can be answered with one integer whose switches stand for the features. "Which number in this array appears only once?" has a one-line answer if you can combine numbers switch by switch.

The tools for this are the **bitwise operators**. Three of them combine two numbers bit by bit: **AND** (`&`), **OR** (`|`) and **XOR** (`^`, exclusive or). One flips every bit of a single number: **NOT** (`~`). Three slide bits left or right: `<<`, `>>` and `>>>`. They all run in a single CPU instruction, which is why low-level code, compression, cryptography, graphics, networking and databases use them heavily.

This lesson is the foundation for the whole bit-manipulation module. It explains how Java stores integers, what each operator does, and the small set of identities you will use again and again. The later lessons — [[a13-set-bit]], [[a13-powers-of-two]], [[a13-xor-tricks]] and [[a13-bitmasking]] — are applications of what you learn here.

## Before you start

- **Basic Java syntax** — `int`, `long`, loops and `System.out.println`. See [[a1-java-syntax-competitive]].
- **Binary numbers** — that `13` in base 2 is `1101` because 13 = 8 + 4 + 1. If this is new, the next section walks through it.
- **Big-O notation** helps for the complexity remarks. See [[a1-time-complexity]].

If you have met JavaScript's bitwise operators, [[b1-bitwise-operators]] covers the same operators in that language; the ideas carry over, but the numeric types differ.

## The intuition: a row of switches

Picture a number as a row of light switches, numbered from the right starting at 0. Switch `k` is worth 2ᵏ when it is on. The number 13 has switches 3, 2 and 0 on, because 8 + 4 + 1 = 13:

```text
position:  3  2  1  0
value:     8  4  2  1
13:        1  1  0  1
```

A bitwise operator takes two rows of switches, lines them up by position, and decides each output switch by looking **only at the two switches in the same column**. Column 0 never influences column 3. That independence is the key property: there are no carries, unlike addition, so you can reason about one column at a time and then apply the same reasoning to all 32.

Each operator gives a different rule for a column:

- **AND** — the output is on only if *both* inputs are on. Think "filter": a 0 in either input forces the output off.
- **OR** — the output is on if *at least one* input is on. Think "combine": a 1 in either input forces the output on.
- **XOR** — the output is on if the inputs *differ*. Think "flip" or "spot the difference".

The switch picture stops working in one place: the leftmost switch of a Java `int` is not worth +2³¹. It is worth −2³¹, which is how negative numbers are stored. The next section explains why.

## How Java stores integers: two's complement

Java's `int` is 32 bits and `long` is 64 bits. Both are **signed**: they hold negative as well as positive values. Java fixes the encoding in the language specification — it is always **two's complement**, on every platform.

In two's complement, bit 31 of an `int` (the **sign bit**) has the place value −2³¹ instead of +2³¹. Every other bit keeps its usual positive weight. So:

- `0` is all zeros.
- `-1` is all ones: −2³¹ + (2³¹ − 1) = −1.
- `Integer.MAX_VALUE` (2,147,483,647) is a 0 followed by 31 ones.
- `Integer.MIN_VALUE` (−2,147,483,648) is a 1 followed by 31 zeros.

To negate a number, flip every bit and add one: **`-x == ~x + 1`**. For example, 13 is `...0001101`; flipping gives `...1110010`, and adding one gives `...1110011`, which is −13. This rule explains a fact that surprises many people: `-Integer.MIN_VALUE` is `Integer.MIN_VALUE`. Flipping `1000...0` gives `0111...1` (`MAX_VALUE`), and adding one overflows back to `1000...0`. The range is lopsided — there is one more negative value than positive — so the most negative number has no positive partner. That is also why `Math.abs(Integer.MIN_VALUE)` returns a negative number.

Why use such an odd encoding? Because with it, the CPU's ordinary binary adder works unchanged for negative numbers. Adding `-1` (all ones) to `5` produces `4` with the extra carry falling off the top. Hardware needs one adder, not separate signed and unsigned ones.

You can see the bits with `Integer.toBinaryString`, which prints the 32-bit pattern without leading zeros (so negative numbers always print 32 digits).

## The three combining operators

Here are the rules for one column, which is all you need to memorise:

| `x` | `y` | `x & y` | `x \| y` | `x ^ y` |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

And here they are applied to whole numbers, together with NOT:

```java title="BitBasics.java"
public class BitBasics {

    // Pads Integer.toBinaryString to a fixed width so columns line up.
    static String bin(int x, int width) {
        String s = Integer.toBinaryString(x);
        if (s.length() > width) s = s.substring(s.length() - width);
        return "0".repeat(width - s.length()) + s;
    }

    public static void main(String[] args) {
        int a = 12;   // 1100
        int b = 10;   // 1010
        System.out.println("a      = " + bin(a, 4) + "  (" + a + ")");
        System.out.println("b      = " + bin(b, 4) + "  (" + b + ")");
        System.out.println("a & b  = " + bin(a & b, 4) + "  (" + (a & b) + ")");
        System.out.println("a | b  = " + bin(a | b, 4) + "  (" + (a | b) + ")");
        System.out.println("a ^ b  = " + bin(a ^ b, 4) + "  (" + (a ^ b) + ")");
        System.out.println("~a     = " + (~a));
        System.out.println("~a bits: " + bin(~a, 32));
    }
}
```

```output
a      = 1100  (12)
b      = 1010  (10)
a & b  = 1000  (8)
a | b  = 1110  (14)
a ^ b  = 0110  (6)
~a     = -13
~a bits: 11111111111111111111111111110011
```

Read the columns from the right. Column 0: `a` has 0, `b` has 0, so every result has 0. Column 1: `a` has 0, `b` has 1 — AND gives 0, OR and XOR give 1. Column 2: `a` has 1, `b` has 0 — same as column 1. Column 3: both have 1 — AND and OR give 1, XOR gives 0 because the bits are equal. That is the whole of `8`, `14` and `6`.

`~a` flips all 32 bits, including the 28 leading zeros you do not normally see. The result has the sign bit on, so it is negative: `~12 == -13`. In general **`~x == -x - 1`**, which is the negation rule rearranged.

### AND: keep only the bits you ask for

AND with a **mask** — a number you build to select certain positions — keeps the bits of `x` where the mask has 1 and forces the rest to 0. `x & 1` keeps only bit 0, so it is `1` for odd numbers and `0` for even ones. `x & 0xFF` keeps the lowest 8 bits, which is how you extract one byte from a larger number. `x & (1 << k)` keeps only bit `k`, which tests whether it is set — the subject of [[a13-check-bit]].

AND can only turn bits off, never on: every 1 in `x & m` is a 1 in both `x` and `m`. That makes it the natural tool for **testing** and **clearing**.

### OR: turn bits on

OR with a mask forces the mask's positions to 1 and leaves the rest alone. `x | (1 << k)` sets bit `k`. Combining two sets of flags is OR: if `READ = 1` and `WRITE = 2`, then `READ | WRITE` is `3`, meaning "both". OR can only turn bits on, so applying it twice changes nothing — it is **idempotent**.

### XOR: flip bits, find differences

XOR with a mask flips the mask's positions: a 1 in the mask toggles the bit, a 0 leaves it alone. `x ^ (1 << k)` toggles bit `k`. Seen another way, `x ^ y` has a 1 exactly where `x` and `y` disagree, so `Integer.bitCount(x ^ y)` counts the positions where two numbers differ — the **Hamming distance**.

XOR has algebraic properties that make it uniquely useful:

- `a ^ 0 == a` — 0 is the identity.
- `a ^ a == 0` — every value cancels itself.
- `a ^ b == b ^ a` and `(a ^ b) ^ c == a ^ (b ^ c)` — order and grouping do not matter.

Put together, `a ^ b ^ b == a`: XOR-ing the same value twice undoes it. If you XOR a long list of numbers in any order, every value that appears an even number of times cancels out. This is the basis of [[a13-xor-tricks]], including the classic "every number appears twice except one" problem.

## NOT and the shift operators

**NOT** (`~`) is a unary operator that flips every bit. Its main use is building "everything except" masks: `~(1 << k)` has a 0 only at position `k`, so `x & ~(1 << k)` clears that one bit (see [[a13-unset-bit]]).

The **shift** operators move every bit a number of positions:

- `x << k` moves bits left by `k`, filling with zeros on the right. Each step left doubles the value (as long as nothing important falls off the top), so `5 << 3 == 40`.
- `x >> k` is the **arithmetic** (signed) right shift. It fills on the left with copies of the sign bit, so negative numbers stay negative.
- `x >>> k` is the **logical** (unsigned) right shift. It always fills with zeros, so the result is never negative for `k > 0`.

```java title="Shifts.java"
public class Shifts {
    public static void main(String[] args) {
        int x = -20;
        System.out.println("x        = " + Integer.toBinaryString(x));
        System.out.println("x >> 2   = " + (x >> 2) + "   " + Integer.toBinaryString(x >> 2));
        System.out.println("x >>> 2  = " + (x >>> 2) + "   " + Integer.toBinaryString(x >>> 2));
        System.out.println("x / 4    = " + (x / 4));
        System.out.println("-7 >> 1  = " + (-7 >> 1) + ",  -7 / 2 = " + (-7 / 2));
        System.out.println("5 << 3   = " + (5 << 3));
        System.out.println("1 << 31  = " + (1 << 31));
        System.out.println("1 << 32  = " + (1 << 32));
        System.out.println("1L << 32 = " + (1L << 32));
    }
}
```

```output
x        = 11111111111111111111111111101100
x >> 2   = -5   11111111111111111111111111111011
x >>> 2  = 1073741819   111111111111111111111111111011
x / 4    = -5
-7 >> 1  = -4,  -7 / 2 = -3
5 << 3   = 40
1 << 31  = -2147483648
1 << 32  = 1
1L << 32 = 4294967296
```

Four details in this output are worth slowing down for.

First, `x >> 2` kept the leading ones, so −20 became −5: an arithmetic shift by `k` divides by 2ᵏ. But it rounds **towards negative infinity** (floor), while Java's `/` rounds **towards zero**. For −20 they agree because the division is exact; for −7 they do not: `-7 >> 1` is −4 but `-7 / 2` is −3. Replacing `/ 2` with `>> 1` is only safe when the value cannot be negative.

Second, `x >>> 2` filled with zeros, turning a small negative number into a large positive one. Use `>>>` when you are treating the int as 32 raw bits rather than as a signed number — for example when walking through all bits of a value that might be negative.

Third, `1 << 31` is negative: shifting a 1 into the sign bit gives `Integer.MIN_VALUE`. That is the correct bit pattern for "bit 31 only", but comparisons like `> 0` will treat it as negative.

Fourth, `1 << 32` is `1`, not `0`. The Java Language Specification says the shift distance of an `int` shift uses only its low 5 bits (`k & 31`), so shifting by 32 is shifting by 0. For `long` shifts only the low 6 bits are used. When you need bit 32 or higher, the left operand must be a `long`: `1L << 32`.

## How it works internally

Inside the CPU, `&`, `|`, `^` and `~` are single instructions that operate on all 64 bits of a register at once, in parallel, typically in one clock cycle. There is no loop over the bits. Shifts are also single instructions. That is why packing 32 yes/no values into one `int` and testing them with AND is much faster than checking 32 separate `boolean` fields, and why sets of up to 64 small integers fit in one `long` (see [[a13-bitmasking]]).

Java's integer operators never throw on overflow. Bits that move past position 31 (or 63 for `long`) are discarded, and the result is interpreted again as two's complement. For bitwise operators that is the behaviour you want; for arithmetic it is the source of silent overflow bugs.

When you mix `byte`, `short` or `char` with bitwise operators, Java first **promotes** them to `int`, sign-extending `byte` and `short`. A `byte` holding `0xF0` becomes the int `0xFFFFFFF0` (−16). This is why code that reads bytes writes `b & 0xFF`: the AND throws away the 24 copied sign bits and leaves a value from 0 to 255.

## Useful identities

A few identities connect bitwise operators to arithmetic. You will see them in interview problems and in library code, so it pays to know why each holds.

```java title="Identities.java"
public class Identities {
    public static void main(String[] args) {
        int a = 13, b = 6;   // 1101 and 0110
        System.out.println("a ^ b       = " + (a ^ b));
        System.out.println("a & b       = " + (a & b));
        System.out.println("a + b       = " + (a + b));
        System.out.println("(a^b)+2(a&b) = " + ((a ^ b) + 2 * (a & b)));
        System.out.println("-a          = " + (-a) + ", ~a + 1 = " + (~a + 1));
        System.out.println("a ^ a       = " + (a ^ a) + ", a ^ 0 = " + (a ^ 0));
        System.out.println("a ^ b ^ b   = " + (a ^ b ^ b));
    }
}
```

```output
a ^ b       = 11
a & b       = 4
a + b       = 19
(a^b)+2(a&b) = 19
-a          = -13, ~a + 1 = -13
a ^ a       = 0, a ^ 0 = 13
a ^ b ^ b   = 13
```

The most interesting one is **`a + b == (a ^ b) + 2 * (a & b)`**. Think about adding two binary numbers column by column. In each column, XOR gives the sum digit *ignoring the carry* (0+0=0, 0+1=1, 1+1=0 with a carry). AND tells you which columns produce a carry (only 1+1), and a carry moves one column left, which is multiplying by 2. So addition is "XOR plus the shifted carries". A related form is `a + b == (a | b) + (a & b)`. Both hold for all `int` values, including negatives and sums that overflow, because Java's arithmetic wraps the same way on both sides. A brute-force check over two hundred thousand random pairs plus the edge values `0`, `-1`, `Integer.MIN_VALUE` and `Integer.MAX_VALUE` confirms it.

**De Morgan's laws** also hold bit by bit: `~(a & b) == (~a | ~b)` and `~(a | b) == (~a & ~b)`. They are handy when simplifying a mask expression.

## Worked example: adding without `+`

A classic interview problem (LeetCode 371, *Sum of Two Integers*) asks you to add two integers without using `+` or `-`. It is a direct test of the identity above.

**Naive idea.** Simulate schoolbook addition one bit at a time: for each of the 32 positions, compute the sum bit and the carry from the two input bits and the incoming carry. That works, but it is fiddly and always loops 32 times.

**Better idea.** Do all 32 columns at once. `a ^ b` is the sum of every column without carries; `(a & b) << 1` is every carry, already moved to the column it should be added to. Now you need to add those two numbers — which is the same problem again. Repeat until there are no carries left.

```java title="AddWithoutPlus.java"
public class AddWithoutPlus {

    static int add(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;   // columns where both bits are 1 carry left
            a = a ^ b;                  // sum of each column, ignoring carries
            b = carry;                  // add the carries in the next round
        }
        return a;
    }

    static int hammingDistance(int x, int y) {
        return Integer.bitCount(x ^ y);   // 1 exactly where x and y differ
    }

    public static void main(String[] args) {
        System.out.println(add(13, 6));
        System.out.println(add(-5, 3));
        System.out.println(add(Integer.MAX_VALUE, 1));
        System.out.println(hammingDistance(1, 4));
        System.out.println(hammingDistance(-1, 0));
    }
}
```

```output
19
-2
-2147483648
2
32
```

Dry run of `add(13, 6)`, with `a` and `b` in binary:

| Round | `a` | `b` | `carry = (a & b) << 1` | new `a = a ^ b` | new `b` |
|---|---|---|---|---|---|
| 1 | `01101` (13) | `00110` (6) | `01000` (8) | `01011` (11) | 8 |
| 2 | `01011` (11) | `01000` (8) | `10000` (16) | `00011` (3) | 16 |
| 3 | `00011` (3) | `10000` (16) | `00000` (0) | `10011` (19) | 0 |

After round 3, `b` is 0 and the loop returns 19.

**Why it terminates.** Each round, the lowest position at which a carry can appear moves at least one place left, because `carry` is shifted left. After at most 32 rounds the carry has been shifted out of the `int` entirely and becomes 0. Negative inputs need no special handling: two's complement addition is the same bit operation. `add(Integer.MAX_VALUE, 1)` wraps to `Integer.MIN_VALUE`, exactly as `+` would. A brute-force comparison against `a + b` on two million random pairs (plus the edge values) found no differences and never needed more than 32 rounds.

**Complexity.** O(1) time — at most 32 rounds of constant work for an `int`, 64 for a `long` — and O(1) space.

The `hammingDistance` helper shows the other face of XOR: `1 ^ 4` is `001 ^ 100 = 101`, two differing bits. `-1 ^ 0` is all ones, so every one of the 32 bits differs.

```quiz
Q: What does `-7 >> 1` evaluate to in Java?
- [ ] -3
- [x] -4
- [ ] 2147483644
- [ ] 3
> `>>` is an arithmetic shift: it copies the sign bit, so the result stays negative, and it rounds towards negative infinity. Half of -7 is -3.5, which floors to -4. Integer division `-7 / 2` rounds towards zero and gives -3, which is why the two are not interchangeable for negative numbers. 2147483644 would come from `>>>`.

Q: Why does `Math.abs(Integer.MIN_VALUE)` return a negative number?
- [ ] Because `Math.abs` has a bug for large inputs
- [x] Because two's complement has no positive value of the same size: negating MIN_VALUE (flip all bits, add one) overflows back to MIN_VALUE
- [ ] Because the sign bit cannot be cleared
- [ ] Because Java stores negative numbers as sign and magnitude
> `int` ranges from -2^31 to 2^31 - 1. The value 2^31 does not exist, so `-MIN_VALUE` wraps around to MIN_VALUE itself. Java uses two's complement, not sign and magnitude.

Q: Which expression is `true` exactly when `x` and `y` differ in every one of their 32 bit positions?
- [ ] `(x & y) == 0`
- [ ] `(x | y) == -1`
- [x] `(x ^ y) == -1`
- [ ] `(x ^ y) == 0`
> XOR has a 1 wherever the bits differ, and -1 is all 32 bits set, so `(x ^ y) == -1` means y is exactly `~x`. The other tests let some positions agree: `(x & y) == 0` is true for x = y = 0, and `(x | y) == -1` is true for x = y = -1. `(x ^ y) == 0` means the numbers are equal.
```

## In real systems

**Permission and option flags.** Unix file modes pack read, write and execute permissions for owner, group and others into one number (`0755`). Java's `java.lang.reflect.Modifier` stores `public`, `static`, `final` and so on as bits of an `int`, and you test them with AND. Network protocols do the same: the Transmission Control Protocol (TCP) header has a byte of flags (SYN, ACK, FIN and others) read with masks.

**Hashing.** `java.util.HashMap` spreads a key's hash with `h ^ (h >>> 16)` so that the high bits influence the bucket index, and then picks the bucket with `hash & (table.length - 1)` — an AND that works because the table length is always a power of two ([[a13-powers-of-two]]).

**Byte handling.** Reading binary files, network packets or image pixels means masking and shifting: `(b & 0xFF)` to get an unsigned byte, `(rgb >> 16) & 0xFF` to get the red channel from a packed colour.

**Checksums and cryptography.** XOR is central to stream ciphers, block-cipher modes and simple parity checks. On its own, XOR with a reused key is *not* secure encryption — it is a building block, not a scheme.

## Trade-offs and alternatives

Bitwise code is fast and compact but harder to read. `if ((flags & ADMIN) != 0)` is less obvious to a newcomer than `if (user.isAdmin())`. In application code, prefer named constants, small helper methods, or Java's `EnumSet` (which uses a bit mask internally but exposes a readable `Set` API). Use raw operators where performance or compactness matters, or where the problem is naturally about bits.

`java.util.BitSet` is the right tool when you need more than 64 bits; it grows as needed and provides `and`, `or`, `xor` on whole sets.

For interview problems, bit operators often give O(1) extra space where a `HashMap` would use O(n). The cost is that the trick only works for problems with the right algebraic structure; a `HashMap` frequency count is the general fallback.

## Common mistakes

> [!MISTAKE] Forgetting that `&` binds more loosely than `==`
> `if (n & 1 == 0)` does not compile in Java: `1 == 0` is evaluated first, giving `int & boolean`, and `javac` reports "bad operand types for binary operator '&'". Always parenthesise: `if ((n & 1) == 0)`. In C, the same mistake compiles and silently does the wrong thing.

**Using `&&` or `||` on integers, or `&` and `|` where you meant short-circuit logic.** `&&` and `||` only accept `boolean` operands and skip the right side when the left decides the answer. `&` and `|` on `boolean`s are legal but evaluate both sides, so `if (obj != null & obj.isReady())` throws `NullPointerException` when `obj` is null.

**Checking oddness with `n % 2 == 1`.** For negative odd numbers `%` returns −1, so the test fails:

```java title="Parity.java"
public class Parity {
    public static void main(String[] args) {
        int[] values = {7, 8, -7, -8, 0};
        for (int n : values) {
            boolean oddByMod = n % 2 == 1;      // wrong for negative n
            boolean oddByBit = (n & 1) == 1;    // looks at bit 0 only
            System.out.printf("%3d  n %% 2 == 1: %-5b  (n & 1) == 1: %b%n", n, oddByMod, oddByBit);
        }
    }
}
```

```output
  7  n % 2 == 1: true   (n & 1) == 1: true
  8  n % 2 == 1: false  (n & 1) == 1: false
 -7  n % 2 == 1: false  (n & 1) == 1: true
 -8  n % 2 == 1: false  (n & 1) == 1: false
  0  n % 2 == 1: false  (n & 1) == 1: false
```

In two's complement every odd number, positive or negative, has bit 0 set, so `(n & 1) == 1` (or `n % 2 != 0`) is correct.

**Using `>>` when you mean "move all bits".** A loop such as `while (n != 0) { ...; n >>= 1; }` never ends for a negative `n`: the sign bit keeps refilling, and `n` gets stuck at −1. Use `n >>>= 1` when walking through bits.

**Shifting an `int` by 32 or more.** `1 << 32` is `1`, and `1 << 40` is `1 << 8`. Use `1L << k` for positions 31 and above when you need a positive value or a 64-bit mask.

**Thinking XOR is addition.** XOR is addition *without carries*: `1 ^ 1 == 0`, not 2. It equals `+` only when the two numbers share no set bits.

## Interview perspective

Bit questions are usually short, and interviewers look for whether you can state *why* a trick works rather than recall it. Expect to be asked:

- **What is `a ^ a`, and why does XOR-ing a whole array find the element that appears once?** Every value cancels with its pair because XOR is commutative and associative and `a ^ a == 0`; what remains is the lone value, since `x ^ 0 == x`.
- **What is the difference between `>>` and `>>>`?** `>>` preserves the sign (arithmetic), `>>>` fills with zeros (logical). Give an example with a negative number.
- **How are negative numbers represented?** Two's complement; `-x == ~x + 1`; the range is −2³¹ to 2³¹ − 1; `Integer.MIN_VALUE` is its own negation.
- **Add two numbers without `+`.** XOR for the carry-free sum, AND shifted left for the carries, loop until the carry is zero; at most 32 iterations.
- **Count the bits that differ between two numbers.** `Integer.bitCount(x ^ y)`.

> [!INTERVIEW] Narrate in binary
> When you explain a bit trick, write two small numbers in binary — four or five digits is enough — and show each column. "Here `12` is `1100` and `10` is `1010`; only column 3 has two ones, so AND gives `1000`." It is the fastest way to convince an interviewer and to catch your own mistakes.

A frequent follow-up is "what changes for 64-bit values?" The operators are identical on `long`, but literal masks must be `long` too (`1L << k`), and shift distances are taken modulo 64.

## Practice

1. Without running code, compute `29 & 15`, `29 | 15`, `29 ^ 15` and `~29`. Then check with Java.
2. Write `isOdd(int n)` using one bitwise operator and test it on `-3`, `0` and `Integer.MIN_VALUE`.
3. Given two `int`s, return the number of bit positions where they differ, without `Integer.bitCount` (loop over bits with `>>>`).
4. Write `getByte(int x, int i)` that returns byte `i` (0 = lowest) of `x` as a value from 0 to 255.
5. Implement subtraction `a - b` using only the `add` method above and bitwise operators.
6. Explain why `(a | b) - (a & b) == (a ^ b)` holds for all `int` values.

The DSA explorer lists matching problems under this topic; start with *Number of 1 Bits*, *Hamming Distance* and *Sum of Two Integers*.

## Quick revision {#quick-revision}

- Java `int` is 32-bit two's complement, `long` is 64-bit. Bit 31 of an `int` weighs −2³¹.
- `-x == ~x + 1` and `~x == -x - 1`. `-Integer.MIN_VALUE == Integer.MIN_VALUE`.
- AND keeps bits where both are 1 (test, extract, clear); OR sets bits (combine flags); XOR flips bits and marks differences.
- XOR algebra: `a ^ 0 == a`, `a ^ a == 0`, commutative and associative, so pairs cancel.
- `a + b == (a ^ b) + 2 * (a & b)`; XOR is addition without carries.
- `<<` multiplies by 2ᵏ (bits fall off the top); `>>` is signed and floors; `>>>` fills with zeros.
- `int` shift distances use only the low 5 bits: `1 << 32 == 1`. Use `1L << k` for 64-bit masks.
- Precedence: `==` binds tighter than `&`, `^`, `|`; always parenthesise `(n & mask) != 0`.
- Odd test: `(n & 1) != 0` works for negatives; `n % 2 == 1` does not.

| Goal | Expression |
|---|---|
| Keep the bits of `mask` | `x & mask` |
| Turn on the bits of `mask` | `x \| mask` |
| Flip the bits of `mask` | `x ^ mask` |
| Turn off the bits of `mask` | `x & ~mask` |
| Count differing bits | `Integer.bitCount(x ^ y)` |

## Key takeaways {#key-takeaways}

- Bitwise operators work on each of the 32 (or 64) bit positions independently, with no carries between columns.
- Java uses two's complement, so negative numbers have the sign bit set and `-x` is `~x + 1`; MIN_VALUE has no positive counterpart.
- AND filters, OR combines, XOR flips and detects differences — choose by what should happen at the mask's 1 bits.
- XOR cancels equal values, which is the root of most XOR tricks.
- Prefer `>>>` when treating an int as raw bits, and use `1L` for shifts that reach bit 31 or beyond.
- Parenthesise every bitwise expression inside a comparison.
