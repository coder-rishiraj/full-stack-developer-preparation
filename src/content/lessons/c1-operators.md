---
summary: Operators are the verbs of Java expressions. You will learn how arithmetic, assignment, comparison, logical and bitwise operators really behave, including at their edges, and how precedence, associativity and evaluation order decide what a long expression means.
difficulty: beginner
minutes: 70
objectives:
  - Predict the result of integer and floating-point arithmetic, including division, remainder, overflow and the prefix and postfix increment operators
  - Explain the difference between == and equals, and why floating-point and boxed values need care when compared
  - Use short-circuit evaluation to write safe conditions, and choose between &&, & and the ternary operator
  - Read and write bitwise expressions for flags, masks and shifts, and explain how two's complement affects them
  - Apply precedence, associativity and left-to-right evaluation order to work out what any expression computes
---

## Introduction

Almost every line of a Java program computes something. A shop adds tax to a price, a scheduler checks whether a deadline has passed, a login service tests whether an account is locked *and* the password matches, a network library packs four small numbers into one 32-bit header. Each of these is an **expression** — a piece of code that produces a value — and the symbols that do the work inside it, such as `+`, `>`, `&&` and `<<`, are **operators**.

Operators look familiar because many come from school arithmetic, and that familiarity is exactly what makes them dangerous. In Java, `7 / 2` is `3`, not `3.5`. `0.1 + 0.2 == 0.3` is `false`. `i = i++` leaves `i` unchanged. `"Total: " + 1 + 2` prints `Total: 12`. And `x & 1 == 0` does not even compile. None of these are bugs in Java; each follows a precise rule. An engineer who knows the rules reads such code correctly at a glance. One who does not ships the bug and spends an afternoon in a debugger.

This lesson teaches Java's operators in four groups:

- **Arithmetic and assignment** — computing numbers and storing results.
- **Relational and logical** — comparing values and combining true/false conditions.
- **Bitwise** — working directly on the binary digits of integers.
- **Precedence and associativity** — the rules that decide how a long expression is grouped.

The control-flow lesson that follows, [[c1-control-flow]], is built almost entirely on the conditions you will learn to write here.

## Before you start

- **Types and literals** — what `int`, `long`, `double`, `char` and `boolean` hold, integer overflow and numeric promotion. See [[c1-types]]; this lesson builds directly on its sections about integer division and promotion.
- **Running a Java program** — a class with `main`, compiled with `javac` and run with `java`. See [[c1-syntax]].

All examples target Java 21 and were run as complete programs; the outputs shown are what they print.

## The intuition

Think of an expression as a small machine with inputs and one output. The inputs are **operands** — literals like `3`, variables like `price`, or the results of smaller expressions. The operator decides what the machine does with them. In `price * quantity`, the operator `*` takes two operands, so it is a **binary operator**. In `-price` or `!done`, the operator takes one operand, so it is a **unary operator**. Java also has exactly one **ternary operator**, `? :`, which takes three.

Every expression has two properties you should be able to state for any line of code:

1. **Its type.** `price * quantity` with two `int` operands is an `int`. `price * 1.2` is a `double`. `price > 100` is a `boolean`. The type is decided by the compiler from the operands, before the program runs.
2. **Its value.** What it computes at run time, given the current values of the variables.

Some operators also have a **side effect**: they change a variable as well as producing a value. `count++` produces a value *and* adds one to `count`. `total = 5` produces the value `5` *and* stores it. Side effects are why the order in which Java evaluates the pieces of an expression matters, and the last section of this lesson makes that order precise.

Here is the whole family at a glance. Each row is explained in the sections that follow.

| Group | Operators | Operand types | Result |
|---|---|---|---|
| Arithmetic | `+` `-` `*` `/` `%`, unary `+` `-` | numeric (`+` also joins strings) | numeric (or `String`) |
| Increment / decrement | `++` `--` (prefix and postfix) | numeric variable | numeric, plus a side effect |
| Assignment | `=` `+=` `-=` `*=` `/=` `%=` `&=` `\|=` `^=` `<<=` `>>=` `>>>=` | variable on the left | the assigned value |
| Relational | `<` `>` `<=` `>=` `instanceof` | numeric (or reference for `instanceof`) | `boolean` |
| Equality | `==` `!=` | any compatible pair | `boolean` |
| Logical | `&&` `\|\|` `!` | `boolean` | `boolean` |
| Bitwise / boolean | `&` `\|` `^` `~` | integer (or `boolean`, except `~`) | integer (or `boolean`) |
| Shift | `<<` `>>` `>>>` | integer | integer |
| Conditional | `? :` | `boolean` then two values | one of the two values |

## Arithmetic & Assignment {#c1-arithmetic-operators}

**Arithmetic operators** compute with numbers: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division) and `%` (remainder). **Assignment operators** store a value in a variable: `=` replaces it, and **compound assignments** such as `+=` combine an arithmetic operator with assignment. Together they are the most used operators in any program, and almost all of their surprises come from one fact: the type of the result is decided by the types of the operands.

### The five arithmetic operators

Before Java applies a binary arithmetic operator it **promotes** both operands to a common type: `byte`, `short` and `char` become at least `int`, and if either side is `long`, `float` or `double`, the other side is widened to match. The operation is then carried out in that type. (Promotion is explained in detail in [[c1-types]].) Two consequences follow immediately: dividing two integers gives an integer, and mixing an integer with a `double` gives a `double`.

```java title="Arithmetic.java"
public class Arithmetic {
    public static void main(String[] args) {
        System.out.println(17 / 5);
        System.out.println(17 % 5);
        System.out.println(-17 / 5);
        System.out.println(-17 % 5);
        System.out.println(Math.floorDiv(-17, 5));
        System.out.println(Math.floorMod(-17, 5));
        System.out.println(17 / 5.0);
        System.out.println(5.5 % 2);
        System.out.println(1.0 / 0);
        System.out.println(-1.0 / 0);
        System.out.println(0.0 / 0);
    }
}
```

```output
3
2
-3
-2
-4
3
3.4
1.5
Infinity
-Infinity
NaN
```

Walk through it line by line. `17 / 5` is integer division, so the fraction is discarded and the result is `3`. The remainder operator `%` gives what is left over: `17 = 5 × 3 + 2`, so `17 % 5` is `2`. The two always satisfy `(a / b) * b + (a % b) == a`.

With a negative operand, integer division **truncates toward zero**: −3.4 becomes −3, not −4. The remainder then has to be `-2` to keep the identity true, so **the remainder takes the sign of the left operand**. When you need the mathematical "floor" behaviour — for example, wrapping a negative index into a circular buffer — use `Math.floorDiv` and `Math.floorMod`, which round toward negative infinity and give a non-negative remainder for a positive divisor.

`17 / 5.0` has one `double` operand, so `17` is promoted and the division keeps the fraction. `%` also works on floating-point numbers: `5.5 % 2` is `1.5`.

The last three lines show that **floating-point division by zero does not throw**. IEEE 754, the standard Java's `float` and `double` follow, defines `Infinity`, `-Infinity` and `NaN` ("not a number") for these cases. Integer division by zero is different: `17 / 0` and `17 % 0` throw `ArithmeticException: / by zero`, because an `int` has no bit pattern that could mean infinity. A `NaN` silently spreads through later arithmetic — any calculation involving it produces `NaN` — so when a `double` result looks wrong, check where the first `NaN` or `Infinity` appeared.

> [!WARNING] Overflow is silent
> Integer arithmetic that exceeds the type's range wraps around without an error: `Integer.MAX_VALUE + 1` is `-2147483648`. Even `Math.abs(Integer.MIN_VALUE)` returns `-2147483648`, because the positive value 2,147,483,648 does not fit in an `int`. Use `Math.addExact`, `Math.multiplyExact` and `Math.negateExact` when overflow should be an error, and `long` or `BigInteger` when the values are genuinely large.

### Unary plus and minus

`-x` negates its operand and `+x` leaves it unchanged; both promote a `byte`, `short` or `char` to `int`. Unary minus has one edge case worth remembering: for the most negative value of a type, negation overflows back to the same value, so `-Integer.MIN_VALUE == Integer.MIN_VALUE`. That is the same reason `Math.abs` fails on it.

### Increment and decrement

`++` adds one to a variable and `--` subtracts one. Each comes in two forms that do the same thing to the variable but **produce different values**:

- **Prefix** `++a` increments first, then produces the new value.
- **Postfix** `a++` produces the old value, then increments.

```java title="Increment.java"
public class Increment {
    public static void main(String[] args) {
        int a = 5;
        int b = a++;   // b gets the old value, then a becomes 6
        int c = ++a;   // a becomes 7 first, then c gets 7
        System.out.println(a + " " + b + " " + c);

        int i = 10;
        i = i++;       // the classic trap
        System.out.println(i);

        int j = 1;
        int k = j++ + ++j;   // 1 + 3
        System.out.println(j + " " + k);
    }
}
```

```output
7 5 7
10
3 4
```

The first line is the normal case. The second is a famous puzzle: `i = i++` leaves `i` at `10`. Java evaluates the right-hand side first — `i++` produces the old value `10` and sets `i` to `11` — and *then* performs the assignment, which stores the `10` it was given. The increment happened, and was immediately overwritten.

The third line shows that Java defines the result even when a variable changes twice in one expression. Operands are evaluated left to right: `j++` produces `1` and makes `j` equal to `2`; then `++j` makes `j` equal to `3` and produces `3`; `1 + 3` is `4`. In C and C++ the equivalent code has undefined behaviour; in Java it is fully specified. It is still unreadable, and no code review should accept it. Use `++` and `--` as standalone statements (`count++;`) or in a `for` loop header, where prefix and postfix give the same result because the value is discarded.

### Plus joins strings

When either operand of `+` is a `String`, the operator performs **string concatenation** instead of addition: the other operand is converted to text and the two are joined. Because `+` is evaluated left to right, *where* the first string appears changes the meaning:

```java title="Concat.java"
public class Concat {
    public static void main(String[] args) {
        System.out.println(1 + 2 + " items");
        System.out.println("items: " + 1 + 2);
        System.out.println("items: " + (1 + 2));
        System.out.println('a' + 'b');
        System.out.println("" + 'a' + 'b');
        System.out.println('a' + 1);
        System.out.println((char) ('a' + 1));
        String s = null;
        System.out.println("value: " + s);
    }
}
```

```output
3 items
items: 12
items: 3
195
ab
98
b
value: null
```

In `1 + 2 + " items"`, the first `+` sees two `int`s and adds them; only the second `+` sees a string. In `"items: " + 1 + 2`, the first `+` already produces a string, so `2` is appended as text. Parentheses fix it. A `char` is a number to the arithmetic operators — `'a'` has code 97 and `'b'` 98 — so `'a' + 'b'` is the `int` 195, and `'a' + 1` is the `int` 98 until you cast it back to `char`. A `null` reference becomes the text `"null"` rather than throwing.

### Assignment and compound assignment

The simple assignment `x = expr` evaluates `expr` and stores the result in `x`. Assignment is itself an expression whose value is the value stored, and it groups from right to left, which is why `a = b = c = 4` sets all three variables: it means `a = (b = (c = 4))`.

**Compound assignment** `x op= expr` is shorthand for `x = (T) (x op expr)`, where `T` is the type of `x`. That hidden cast is the part people forget:

```java title="Compound.java"
public class Compound {
    public static void main(String[] args) {
        int total = 10;
        total += 5;
        total -= 3;
        total *= 2;
        total /= 5;
        total %= 3;
        System.out.println(total);

        int x = 7;
        x += 2.9;          // means x = (int) (x + 2.9)
        System.out.println(x);

        short s = 32_000;
        s += 1_000;        // compiles, wraps silently
        System.out.println(s);

        int a, b, c;
        a = b = c = 4;     // assignment is right-associative and has a value
        System.out.println(a + b + c);

        System.out.println(Math.abs(Integer.MIN_VALUE));
    }
}
```

```output
1
9
-32536
12
-2147483648
```

Trace `total`: 10 → 15 → 12 → 24 → 4 (integer division) → 1. Then `x += 2.9` computes `9.9` as a `double` and casts it back to `int`, truncating to `9`; the equivalent `x = x + 2.9` would not compile ("possible lossy conversion from double to int"). The same cast lets `s += 1_000` compile for a `short` even though the result, 33,000, does not fit — it wraps to −32,536. Compound assignment is convenient, but it removes the compiler's protection against lossy conversions, so be careful with it on narrow types.

Compound assignment also evaluates the variable on the left **only once**. In `arr[next()] += 1`, `next()` is called once; in `arr[next()] = arr[next()] + 1` it is called twice and may touch two different elements.

```quiz
Q: What does `System.out.println(-7 / 2 + " " + -7 % 2);` print?
- [ ] `-4 1`
- [x] `-3 -1`
- [ ] `-3.5 -1`
- [ ] `-4 -1`
> Both operands are `int`, so `/` truncates toward zero: -3.5 becomes -3, not -4. The remainder takes the sign of the left operand so that (a / b) * b + a % b == a holds: -3 * 2 + (-1) == -7. Floor behaviour (-4 and 1) needs Math.floorDiv and Math.floorMod.

Q: After `int i = 3; i = i++ + i;` what is `i`?
- [ ] 6
- [x] 7
- [ ] 8
- [ ] The result is undefined in Java
> Operands are evaluated left to right. `i++` produces 3 and sets i to 4; the right operand `i` now reads 4; 3 + 4 = 7 is assigned. Unlike C, Java fully defines this, although such code should never pass review.
```

## Relational & Logical {#c1-relational-logical}

**Relational operators** compare two values and produce a `boolean`: `<`, `>`, `<=`, `>=`, plus the **equality operators** `==` and `!=`. **Logical operators** combine booleans: `&&` (and), `||` (or) and `!` (not). They are the raw material of every `if`, every loop condition and every validation rule, so their exact behaviour — especially for floating-point numbers, objects and short-circuiting — matters more than their simple appearance suggests.

### Comparing numbers

`<`, `>`, `<=` and `>=` work on numeric types, including `char` (which compares character codes, so `'a' < 'b'` is `true`). Like arithmetic, they promote their operands first, so `10 == 10.0` compares two `double`s and is `true`. They do not chain: `0 < x < 10` does not compile, because `0 < x` is a `boolean` and a `boolean` cannot be compared with `10`. Write `0 < x && x < 10`.

Comparing floating-point values with `==` is a trap, because most decimal fractions cannot be stored exactly in binary:

```java title="Relational.java"
public class Relational {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2 == 0.3);
        System.out.println(0.1 + 0.2);
        System.out.println(Math.abs((0.1 + 0.2) - 0.3) < 1e-9);

        double nan = 0.0 / 0;
        System.out.println(nan == nan);
        System.out.println(Double.isNaN(nan));

        Integer small1 = 127, small2 = 127;
        Integer big1 = 128, big2 = 128;
        System.out.println(small1 == small2);
        System.out.println(big1 == big2);
        System.out.println(big1.equals(big2));

        String a = "java";
        String b = new String("java");
        System.out.println(a == b);
        System.out.println(a.equals(b));

        System.out.println('a' < 'b');
        System.out.println(10 == 10.0);
    }
}
```

```output
false
0.30000000000000004
true
false
true
true
false
true
false
true
true
true
```

`0.1 + 0.2` is really `0.30000000000000004`, so the exact comparison fails. Compare floating-point results with a tolerance, as the third line does, or — for money — avoid `double` entirely and use `long` cents or `BigDecimal`. `NaN` is the one value that is not equal to itself, so `nan == nan` is `false`; test for it with `Double.isNaN`.

### == on references compares identity

For reference types, `==` asks "are these the **same object**?", not "do they hold equal contents?". The output above shows both cases that catch people out:

- `Integer` values between −128 and 127 are cached by `Integer.valueOf`, which autoboxing uses, so `small1 == small2` happens to be `true`. At 128 each boxing creates a separate object (with default JVM settings) and `==` is `false`. The details are in [[c1-integer-cache]].
- A string literal and a `new String` with the same text are different objects, so `a == b` is `false` while `a.equals(b)` is `true`. See [[c1-string-equals]].

The rule is simple: **compare object contents with `equals`, and use `==` only for primitives, enums, and deliberate identity checks** (such as `x == null`). When one side of `==` is a primitive and the other a wrapper, Java unboxes the wrapper and compares numbers — which throws `NullPointerException` if the wrapper is `null`.

> [!TIP] Comparing for sorting
> Comparators return a negative, zero or positive number. Writing `return a - b;` looks neat but overflows for large values of opposite signs and returns the wrong sign. Use `Integer.compare(a, b)` instead. See [[a1-comparable-comparator]].

### Logical operators and short-circuiting

`!` flips a boolean. `&&` is `true` only when both sides are `true`; `||` is `true` when at least one side is. The important property is that both are **short-circuit** operators: they evaluate the right operand only when the left one has not already decided the answer. If the left side of `&&` is `false`, the result must be `false`, so the right side is skipped. If the left side of `||` is `true`, the right side is skipped.

```java title="ShortCircuit.java"
public class ShortCircuit {
    static boolean check(String label, boolean result) {
        System.out.println("  evaluated " + label);
        return result;
    }

    public static void main(String[] args) {
        System.out.println("&&:");
        boolean r1 = check("left", false) && check("right", true);
        System.out.println("  result " + r1);

        System.out.println("||:");
        boolean r2 = check("left", true) || check("right", false);
        System.out.println("  result " + r2);

        System.out.println("& (no short-circuit):");
        boolean r3 = check("left", false) & check("right", true);
        System.out.println("  result " + r3);

        String name = null;
        if (name != null && name.length() > 3) {
            System.out.println("long name");
        } else {
            System.out.println("no long name");
        }
        System.out.println(true ^ true);
        System.out.println(true ^ false);
    }
}
```

```output
&&:
  evaluated left
  result false
||:
  evaluated left
  result true
& (no short-circuit):
  evaluated left
  evaluated right
  result false
no long name
false
true
```

Short-circuiting is not only an optimisation; correct code depends on it. `name != null && name.length() > 3` is safe precisely because `name.length()` never runs when `name` is `null`. Reverse the two sides and the same line throws `NullPointerException`. The general pattern is **guard first, then use**: put the cheap or protective check on the left. The same reasoning lets you put an expensive check (a database lookup, say) on the right of a cheap one so it runs only when needed.

When applied to `boolean` operands, `&` and `|` compute the same truth values as `&&` and `||` but **always evaluate both sides**. They are rarely what you want in a condition; use them only when the right side has a side effect that must happen regardless, and even then a separate statement is clearer. `^` on booleans is **exclusive or**: `true` when exactly one side is `true`, which is the same as `!=` for booleans.

Two identities, **De Morgan's laws**, help when simplifying negated conditions: `!(a && b)` equals `!a || !b`, and `!(a || b)` equals `!a && !b`. "Not (logged in and verified)" is "not logged in, or not verified". Rewriting a negation this way is a common way to make a guard clause read naturally.

### The conditional (ternary) operator

`condition ? valueIfTrue : valueIfFalse` evaluates the condition, then evaluates and produces **only one** of the two values. It is an expression, so it can appear wherever a value is needed, unlike an `if` statement:

```java title="Ternary.java"
public class Ternary {
    public static void main(String[] args) {
        int stock = 0;
        String label = stock > 0 ? "In stock" : "Sold out";
        System.out.println(label);

        int score = 72;
        String grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "F";
        System.out.println(grade);

        System.out.println(true ? 1 : 2.0);

        Integer cached = null;
        boolean useCache = true;
        try {
            int value = useCache ? cached : 0;   // unboxes null
            System.out.println(value);
        } catch (NullPointerException e) {
            System.out.println("NullPointerException");
        }
    }
}
```

```output
Sold out
C
1.0
NullPointerException
```

The ternary groups from right to left, so the grade chain means `score >= 90 ? "A" : (score >= 75 ? "B" : (...))`. One level of ternary is idiomatic; a chain like this is usually clearer as `if`/`else if` or a `switch` (see [[c1-control-flow]]).

The last two results come from the ternary's **type rule**: when the two branches are different numeric types, the whole expression gets their promoted common type. `true ? 1 : 2.0` therefore has type `double`, and prints `1.0` even though the `int` branch was chosen. If one branch is an `Integer` and the other an `int`, the result type is `int`, so the `Integer` is unboxed — and unboxing `null` throws. Give both branches the same type when in doubt.

### instanceof

`instanceof` is a relational operator that tests a reference's run-time type: `obj instanceof String` is `true` when `obj` refers to a `String` (or a subclass), and always `false` for `null`. Since Java 16 it can also declare a variable, so the test and the cast happen in one step:

```java title="InstanceOf.java"
public class InstanceOf {
    public static void main(String[] args) {
        Object value = "hello";
        if (value instanceof String s && s.length() > 3) {
            System.out.println(s.toUpperCase());
        }
        Object nothing = null;
        System.out.println(nothing instanceof String);
    }
}
```

```output
HELLO
false
```

The variable `s` exists only where the compiler can prove the test succeeded, which is why it is usable on the right of `&&` but would not be on the right of `||`. Pattern matching is taught in full in [[c1-pattern-matching]].

```quiz
Q: Which condition is safe when `user` may be `null`?
- [ ] `user.isActive() && user != null`
- [x] `user != null && user.isActive()`
- [ ] `user != null & user.isActive()`
- [ ] `user.isActive() || user == null`
> `&&` evaluates its right side only if the left side is true, so the null check must come first. Option one calls isActive() before checking. Option three uses `&`, which always evaluates both sides and so still calls isActive() on null. Option four also calls the method first.

Q: Why does `Integer a = 1000, b = 1000; System.out.println(a == b);` print `false` with default settings?
- [ ] `Integer` cannot hold 1000
- [x] `==` compares references, and values outside -128..127 are boxed into separate objects
- [ ] Autoboxing rounds the values differently
- [ ] `==` on wrappers always returns false
> Both variables are references. Autoboxing calls Integer.valueOf, which returns cached objects only for -128 to 127, so 1000 produces two distinct objects and `==` is false. For 100 it would print true, which is why tests with small numbers hide this bug. Use equals.
```

## Bitwise Operators {#c1-bitwise-operators}

**Bitwise operators** treat an integer as a row of binary digits (bits) and work on each bit position separately. `&`, `|`, `^` and `~` combine or flip bits, and the **shift operators** `<<`, `>>` and `>>>` slide all the bits left or right. You will not use them in everyday business logic, but they appear wherever compact data or speed matters — permission flags, network protocols, hash functions, graphics, compression — and they are a staple of interview puzzles.

### How Java stores integers: two's complement

To predict bitwise results you need to know the bit pattern of a number. Java's integer types (`byte`, `short`, `int`, `long`) are signed and use **two's complement**. For an `int`, there are 32 bits; non-negative numbers are written in ordinary binary, and the highest bit (bit 31) is the **sign bit**. A negative number `-n` is stored as the bit pattern of `~n + 1`: flip every bit of `n`, then add one. So `-1` is thirty-two `1` bits, and `-8` is `11111111111111111111111111111000`. `Integer.toBinaryString(x)` prints the pattern (without leading zeros), which is the best way to check your reasoning.

Binary literals make examples easier to read: `0b1100` is 12, and underscores may separate groups, as in `0b1011_0110`. Hexadecimal literals (`0xFF` is 255) are common for masks because each hex digit is exactly four bits.

### AND, OR, XOR and NOT

Each operator looks at the two bits in the same position and produces one result bit:

| `a` bit | `b` bit | `a & b` | `a \| b` | `a ^ b` |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

**AND** keeps a bit only where both inputs have it, **OR** where either has it, and **XOR** (exclusive or) where exactly one has it. The unary **NOT**, `~`, flips every bit; in two's complement that makes `~x` equal to `-x - 1`.

```java title="Bits.java"
public class Bits {
    static String bin(int x) {
        String s = Integer.toBinaryString(x);
        return "0".repeat(Math.max(0, 8 - s.length())) + s;
    }

    public static void main(String[] args) {
        int a = 0b1100;   // 12
        int b = 0b1010;   // 10
        System.out.println(bin(a & b) + " " + (a & b));
        System.out.println(bin(a | b) + " " + (a | b));
        System.out.println(bin(a ^ b) + " " + (a ^ b));
        System.out.println(~a);
        System.out.println(Integer.toBinaryString(~a));

        System.out.println(5 << 3);
        System.out.println(-40 >> 3);
        System.out.println(-40 >>> 28);
        System.out.println(-1 >>> 1);
        System.out.println(1 << 32);
        System.out.println(1 << 31);
        System.out.println(1L << 32);
        System.out.println(Integer.toBinaryString(-8));
    }
}
```

```output
00001000 8
00001110 14
00000110 6
-13
11111111111111111111111111110011
40
-5
15
2147483647
1
-2147483648
4294967296
11111111111111111111111111111000
```

`1100 & 1010` keeps only the bit both share, `1000` (8). OR gives `1110` (14), XOR gives `0110` (6). `~12` flips all 32 bits, giving the pattern ending `0011`, which is −13.

### Shifts

`x << n` moves every bit `n` places to the left and fills the right with zeros, which multiplies by 2ⁿ as long as no significant bits fall off the top: `5 << 3` is 40. Right shifts come in two kinds, and the difference is what fills the vacated high bits:

- **`>>` (arithmetic or signed shift)** copies the sign bit, so negative numbers stay negative. `-40 >> 3` is `-5`. For negative odd numbers it rounds toward negative infinity (`-7 >> 1` is `-4`), unlike `/`, which truncates toward zero.
- **`>>>` (logical or unsigned shift)** always fills with zeros, treating the bits as an unsigned number. `-1 >>> 1` is `Integer.MAX_VALUE`, and `-40 >>> 28` keeps only the top four bits, `1111`, which is 15.

Java masks the shift distance: for an `int` only the lowest five bits of `n` are used (`n & 31`), and for a `long` the lowest six (`n & 63`). That is why `1 << 32` is `1`, not `0` — a shift by 32 is a shift by 0. Use `1L << 32` when you need bit 32 and above. And `1 << 31` lands on the sign bit, giving `Integer.MIN_VALUE`.

Shifts and bitwise operators also apply numeric promotion. A `byte` is widened to `int` (with sign extension) before the operation, which produces this classic surprise:

```java title="ByteShift.java"
public class ByteShift {
    public static void main(String[] args) {
        byte b = (byte) 0xF0;          // -16
        System.out.println(b >>> 4);   // b is promoted to int first
        System.out.println((b & 0xFF) >>> 4);
        System.out.println(b & 0xFF);
    }
}
```

```output
268435455
15
240
```

The byte `11110000` is −16; promoted to `int` it becomes `0xFFFFFFF0`, and the unsigned shift produces a huge positive number rather than `0x0F`. Masking with `0xFF` first keeps only the low eight bits, giving the unsigned value 240, and shifting that gives the expected 15. **`b & 0xFF` is the standard idiom for reading a byte as unsigned**, and you will see it in every piece of Java code that parses binary formats.

### Flags, masks and classic tricks

The most practical use of bitwise operators is packing several yes/no **flags** into one integer, one bit each. A **mask** is a value with ones in exactly the positions you care about.

```java title="Flags.java"
public class Flags {
    static final int READ    = 1;       // 0b001
    static final int WRITE   = 1 << 1;  // 0b010
    static final int EXECUTE = 1 << 2;  // 0b100

    public static void main(String[] args) {
        int perms = READ | WRITE;                    // set two flags
        System.out.println((perms & WRITE) != 0);    // test a flag
        System.out.println((perms & EXECUTE) != 0);

        perms |= EXECUTE;                            // turn a flag on
        perms &= ~WRITE;                             // turn a flag off
        perms ^= READ;                               // toggle a flag
        System.out.println(Integer.toBinaryString(perms));

        int n = 40;
        System.out.println((n & 1) == 0);            // even?
        System.out.println(n > 0 && (n & (n - 1)) == 0);  // power of two?
        System.out.println(Integer.bitCount(0b1011_0110));
        System.out.println(Integer.numberOfTrailingZeros(40));

        int x = 6, y = 9;
        x ^= y; y ^= x; x ^= y;
        System.out.println(x + " " + y);

        int[] nums = {4, 7, 2, 7, 4};
        int unique = 0;
        for (int v : nums) unique ^= v;
        System.out.println(unique);
    }
}
```

```output
true
false
100
true
false
5
3
9 6
2
```

The four flag operations are worth memorising: **set** with `|= mask`, **clear** with `&= ~mask`, **toggle** with `^= mask`, and **test** with `(value & mask) != 0`. Trace `perms`: `011` → set EXECUTE → `111` → clear WRITE → `101` → toggle READ → `100`. The parentheses in `(perms & WRITE) != 0` are required, for reasons the next section explains.

The remaining lines are common tricks. `n & 1` is the lowest bit, so it is `0` for even numbers — and, unlike `n % 2 == 1`, it also works for negative numbers. `n & (n - 1)` clears the lowest set bit, so it is `0` exactly when `n` has a single set bit, that is, when `n` is a power of two (40 is not). `Integer.bitCount` and `Integer.numberOfTrailingZeros` are library methods that the just-in-time (JIT) compiler typically turns into single CPU instructions. XOR has the properties `x ^ x == 0` and `x ^ 0 == x`, so XOR-ing a list where every value appears twice except one leaves that one (`2`). The three-XOR swap works but is slower and less clear than a temporary variable; know it for interviews, do not write it in production. These ideas are developed as problem-solving tools in [[a13-and-or-xor]], [[a13-set-bit]] and [[a13-bitmasking]].

> [!NOTE] Prefer EnumSet for flags in application code
> A raw `int` of flags is compact but untyped: nothing stops you combining a permission flag with an unrelated status flag. In ordinary application code, `EnumSet<Permission>` gives the same bit-vector efficiency internally with type safety and readable `contains` calls. Raw bit flags belong in protocols, file formats and hot inner loops.

```quiz
Q: What is `1 << 33` in Java when the left operand is an `int`?
- [ ] 0, because the bit falls off the end
- [ ] 8589934592
- [x] 2, because the shift distance is taken modulo 32
- [ ] It throws ArithmeticException
> For int shifts Java uses only the low five bits of the distance, so 33 becomes 1 and the result is 1 << 1 = 2. To shift beyond bit 31 the left operand must be a long: 1L << 33 is 8589934592.

Q: A `byte` holds the value `(byte) 0xC8`. Which expression gives its unsigned value, 200?
- [ ] `b >>> 0`
- [ ] `(int) b`
- [x] `b & 0xFF`
- [ ] `~b`
> The byte is -56 as a signed value; widening it to int sign-extends to 0xFFFFFFC8. Masking with 0xFF keeps only the low eight bits, 0xC8 = 200. Casting or shifting by zero keeps the sign-extended value -56.
```

## Precedence & Associativity {#c1-operator-precedence}

When an expression contains several operators, Java needs rules to decide which operands belong to which operator. **Precedence** says which operators bind more tightly: in `2 + 3 * 4`, `*` has higher precedence than `+`, so the expression means `2 + (3 * 4)` and equals 14. **Associativity** settles ties between operators of the same precedence: `20 - 5 - 3` groups as `(20 - 5) - 3` because `-` is **left-associative**. These two rules only decide how the expression is *grouped*. A third rule, **evaluation order**, decides in what order the grouped pieces actually run, and it matters whenever operands have side effects.

### The precedence table

From highest to lowest:

| Level | Operators | Associativity |
|---|---|---|
| 1 | Postfix `expr++` `expr--`; also member access `.`, indexing `[]`, method call `()` | left to right |
| 2 | Unary `++expr` `--expr` `+` `-` `~` `!`, cast `(type)` | right to left |
| 3 | Multiplicative `*` `/` `%` | left to right |
| 4 | Additive `+` `-` | left to right |
| 5 | Shift `<<` `>>` `>>>` | left to right |
| 6 | Relational `<` `>` `<=` `>=` `instanceof` | left to right |
| 7 | Equality `==` `!=` | left to right |
| 8 | Bitwise AND `&` | left to right |
| 9 | Bitwise XOR `^` | left to right |
| 10 | Bitwise OR `\|` | left to right |
| 11 | Logical AND `&&` | left to right |
| 12 | Logical OR `\|\|` | left to right |
| 13 | Conditional `? :` | right to left |
| 14 | Assignment `=` `+=` `-=` and the other compound forms; lambda `->` | right to left |

You do not need to memorise every row. Four landmarks cover nearly all real code: unary operators and casts bind tightest; arithmetic comes before comparison; comparison comes before `&&`, which comes before `||`; and assignment comes last. The one zone where intuition fails is the bitwise operators, which sit *below* the comparison operators.

### Worked examples

```java title="Precedence.java"
public class Precedence {
    static int trace(String name, int value) {
        System.out.print(name + " ");
        return value;
    }

    public static void main(String[] args) {
        System.out.println(2 + 3 * 4);
        System.out.println((2 + 3) * 4);
        System.out.println(20 - 5 - 3);
        System.out.println(64 / 8 / 2);
        System.out.println(1 << 2 + 1);
        System.out.println(-7 / 2 * 2);
        int total = 7, count = 2;
        System.out.println((double) total / count);
        System.out.println((double) (total / count));

        int r = trace("a", 1) + trace("b", 2) * trace("c", 3);
        System.out.println("= " + r);

        int[] arr = {10, 20, 30};
        int i = 0;
        arr[i] = i = 2;      // the index is evaluated before the assignment
        System.out.println(java.util.Arrays.toString(arr) + " i=" + i);

        int x = 5;
        boolean flag = x > 3 && x < 10 || x == 0;
        System.out.println(flag);
        System.out.println(true || false && false);
    }
}
```

```output
14
20
12
4
8
-6
3.5
3.0
a b c = 7
[2, 20, 30] i=2
true
true
```

Take the lines in turn. `64 / 8 / 2` is `(64 / 8) / 2 = 4`, not `64 / 4 = 16`, because `/` is left-associative. `1 << 2 + 1` is `1 << 3 = 8`, because addition binds tighter than shift — a frequent bug when someone writes `1 << n + 1` meaning `(1 << n) + 1`. `-7 / 2 * 2` is `(-7 / 2) * 2 = -3 * 2 = -6`; unary minus applies to the 7 first.

The two cast lines show why **cast precedence** matters. A cast binds tighter than `/`, so `(double) total / count` converts `total` first and then divides in `double`, giving `3.5`. `(double) (total / count)` divides in `int` first, getting `3`, and then converts. The parentheses move the cast to the wrong place.

`&&` binds tighter than `||`, so `x > 3 && x < 10 || x == 0` means `(x > 3 && x < 10) || x == 0`, and `true || false && false` means `true || (false && false)`, which is `true`. If `||` bound tighter, the result would be `false`. When a condition mixes `&&` and `||`, add the parentheses anyway; readers should not have to recall the table.

### Evaluation order is not precedence

Precedence decided that `trace("a", 1) + trace("b", 2) * trace("c", 3)` means `a + (b * c)`. It did **not** decide that `b` and `c` run before `a`. Java guarantees that **operands are evaluated left to right**, and that each operand is fully evaluated before the operator that uses it is applied. So the calls print `a b c` in that order, then the multiplication happens, then the addition.

The array line is a sharper example. In `arr[i] = i = 2`, assignment is right-associative, so it groups as `arr[i] = (i = 2)`. But the left operand `arr[i]` — including the index `i`, which is still `0` — is evaluated *first*. Only then does the right side set `i` to 2 and produce 2, which is stored at index 0. The result is `[2, 20, 30]`, not `[10, 20, 2]`.

Short-circuiting and the ternary operator are the deliberate exceptions to "every operand is evaluated": `&&`, `||` and `? :` may skip an operand entirely, as the previous section showed.

### Associativity in practice

Most binary operators are left-associative, which matches how people read arithmetic. Three groups are right-associative, and in each case it is the useful choice:

- **Assignment**: `a = b = 0` means `a = (b = 0)`. Left association, `(a = b) = 0`, would be meaningless because `a = b` is a value, not a variable.
- **Unary operators and casts**: `-~x` means `-(~x)`, and `(int) -x` casts the negated value.
- **The ternary**: `a ? b : c ? d : e` means `a ? b : (c ? d : e)`, which reads as an else-if chain.

The comparison operators never chain, as you saw: `a < b < c` is a type error, not a range check.

### The bitwise precedence trap

Because `==` and `!=` bind tighter than `&`, `^` and `|`, a bit test without parentheses groups the wrong way:

```java title="BadPrec.java"
public class BadPrec {
    public static void main(String[] args) {
        int x = 6;
        if (x & 1 == 0) {
            System.out.println("even");
        }
    }
}
```

```output
BadPrec.java:4: error: bad operand types for binary operator '&'
        if (x & 1 == 0) {
              ^
  first type:  int
  second type: boolean
1 error
```

`x & 1 == 0` means `x & (1 == 0)`, an `int` combined with a `boolean`, so `javac` rejects it. In C the same mistake compiles and silently misbehaves; Java's type checking catches it here. It cannot catch every case — with `boolean` operands, `a & b == c` compiles as `a & (b == c)`. The fix is always the same: **parenthesise every bitwise sub-expression**, as in `(x & 1) == 0`. The same caution applies to mixing shifts with arithmetic.

> [!TIP] When to add parentheses
> Add them whenever an expression mixes operator groups that a reader might not rank instantly: `&&` with `||`, bitwise with comparison, shift with arithmetic, `+` with string concatenation, or a ternary inside a larger expression. Parentheses cost nothing at run time — the compiler produces identical bytecode.

```quiz
Q: What does `int r = 10 - 4 - 3 * 2;` assign to `r`?
- [ ] 6
- [x] 0
- [ ] 12
- [ ] -2
> Multiplication binds tighter, so 3 * 2 = 6 is computed as a unit. The two subtractions are left-associative: (10 - 4) - 6 = 0. Right association would give 10 - (4 - 6) = 12.

Q: In `f() + g() * h()`, which method runs first?
- [x] `f()`, because Java evaluates operands left to right
- [ ] `g()`, because `*` has higher precedence
- [ ] `h()`, because the rightmost operand of `*` is needed first
- [ ] The order is unspecified
> Precedence decides grouping, f() + (g() * h()), not evaluation order. The Java Language Specification guarantees left-to-right evaluation of operands, so f, g and h run in that order and then the multiplication and addition are applied.
```

## How it works internally

Operators compile down to a small set of Java Virtual Machine (JVM) bytecode instructions. You can see them with `javap -c`, which disassembles a class file. Consider this class:

```java title="Inside.java"
public class Inside {
    static int postfix(int i) {
        i = i++;
        return i;
    }
    static boolean inRange(int x) {
        return x > 0 && x < 10;
    }
    static String label(int n) {
        return "n=" + n;
    }
    static final int SECONDS_PER_DAY = 24 * 60 * 60;
}
```

Running `javap -c Inside` (on a JDK 26 `javac` with `--release 21`) shows, for the three methods:

```text
  static int postfix(int);
         0: iload_0
         1: iinc          0, 1
         4: istore_0
         5: iload_0
         6: ireturn

  static boolean inRange(int);
         0: iload_0
         1: ifle          14
         4: iload_0
         5: bipush        10
         7: if_icmpge     14
        10: iconst_1
        11: goto          15
        14: iconst_0
        15: ireturn

  static java.lang.String label(int);
         0: iload_0
         1: invokedynamic #7,  0   // InvokeDynamic #0:makeConcatWithConstants:(I)Ljava/lang/String;
         6: areturn
```

The JVM is a **stack machine**: instructions push values onto an operand stack and pop them off. `postfix` makes the `i = i++` puzzle visible. `iload_0` pushes the current value of `i` (10, say) onto the stack. `iinc 0, 1` adds one to the local variable slot directly — `i` is now 11 — without touching the stack. `istore_0` then pops the saved 10 and writes it back into `i`. The old value was captured before the increment, and the assignment restores it.

`inRange` shows that **short-circuiting is just jumps**. There is no "and" instruction. `ifle 14` jumps to the code that returns `false` if `x <= 0`, skipping the second comparison entirely. Only if that test falls through does the code compare `x` with 10.

`label` shows that string concatenation with `+` compiles, since Java 9, to a single `invokedynamic` call that the JVM links at run time to an optimised concatenation strategy (`StringConcatFactory`). Before Java 9, `javac` generated a chain of `StringBuilder.append` calls. Either way, `+` inside a loop still creates a new string each iteration; build large strings with a `StringBuilder` (see [[c1-stringbuilder]]).

Finally, `SECONDS_PER_DAY` has no code at all: `24 * 60 * 60` is a **compile-time constant expression**, so `javac` computes 86,400 itself and stores the result in the class file. This **constant folding** is why spelling out a constant as a product costs nothing at run time.

Arithmetic on `int` and `long` maps to instructions such as `iadd`, `imul`, `idiv` and `lshl`, which the JIT compiler translates into the corresponding CPU instructions. That is why integer overflow wraps: the CPU keeps the low 32 or 64 bits, and Java specifies exactly that behaviour instead of trapping.

## Worked example: a small toolkit

This program combines all four groups in three functions you might meet in real code: a leap-year rule (relational and logical operators with precedence), packing a colour into one `int` (shifts and masks), and an overflow-safe midpoint (the same problem binary search faces).

```java title="Toolkit.java"
public class Toolkit {

    // Gregorian rule: divisible by 4, except centuries, except every 400 years.
    static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

    // Packs three 0-255 channels into one int laid out as 0xRRGGBB.
    static int packRgb(int red, int green, int blue) {
        return (red & 0xFF) << 16 | (green & 0xFF) << 8 | (blue & 0xFF);
    }

    static int red(int rgb)   { return (rgb >> 16) & 0xFF; }
    static int green(int rgb) { return (rgb >> 8) & 0xFF; }
    static int blue(int rgb)  { return rgb & 0xFF; }

    // Average of two ints without overflowing, even near Integer.MAX_VALUE.
    static int midpoint(int low, int high) {
        return (low + high) >>> 1;
    }

    public static void main(String[] args) {
        for (int year : new int[] {1900, 2000, 2024, 2026}) {
            System.out.println(year + " leap? " + isLeapYear(year));
        }

        int teal = packRgb(0, 128, 128);
        System.out.printf("packed: 0x%06X%n", teal);
        System.out.println("r=" + red(teal) + " g=" + green(teal) + " b=" + blue(teal));

        int brighter = packRgb(red(teal) + 40, green(teal) + 40, blue(teal) + 40);
        System.out.printf("brighter: 0x%06X%n", brighter);

        int low = 2_000_000_000, high = 2_100_000_000;
        System.out.println("naive:  " + (low + high) / 2);
        System.out.println("safe:   " + midpoint(low, high));
    }
}
```

```output
1900 leap? false
2000 leap? true
2024 leap? true
2026 leap? false
packed: 0x008080
r=0 g=128 b=128
brighter: 0x28A8A8
naive:  -97483648
safe:   2050000000
```

**The leap-year rule.** `%` produces remainders, `==` and `!=` turn them into booleans, and `&&` and `||` combine them. Because `%` binds tighter than `==`, and `==` tighter than `&&`, no parentheses are needed inside each test; the outer parentheses around the `&&` group are not required either (`&&` already binds tighter than `||`), but they make the rule's structure — "divisible by 4 but not a century, or divisible by 400" — visible. Trace 1900: divisible by 4 (true) and not by 100 (false), so the left group is false; not divisible by 400, so the result is false. 2000 fails the left group but passes the right.

**Packing a colour.** Each channel is masked with `0xFF` to keep it to eight bits, then shifted into its byte: red to bits 16–23, green to 8–15, blue to 0–7. `|` combines them; because the shifted values have no bits in common, OR acts like addition. Shift binds tighter than `|`, so `(red & 0xFF) << 16 | ...` groups correctly — but the mask needs its own parentheses because `&` binds *looser* than `<<`. Unpacking reverses the steps: shift the wanted byte down to the bottom, then mask away everything above it. The `& 0xFF` mask in `packRgb` means an out-of-range channel such as 300 wraps to 44 rather than corrupting a neighbouring channel; real code would clamp first with `Math.min(255, value)`.

**The midpoint.** `low + high` is 4.1 billion, past `Integer.MAX_VALUE`, so it wraps to a negative number and the naive average is nonsense. The sum's bit pattern is still correct if read as an *unsigned* 32-bit number, and `>>> 1` divides that unsigned value by two, giving the right answer. This exact bug lived in the JDK's own `Arrays.binarySearch` for years; [[a3-binary-search]] explains the more readable fix `low + (high - low) / 2`.

## In real systems

**Money and measurements.** Production systems avoid `double` for currency because of the rounding you saw with `0.1 + 0.2`. They store amounts as `long` minor units (cents) and use integer arithmetic, or use `BigDecimal`, which has its own methods (`add`, `multiply`) instead of operators. When overflow would corrupt data — counting bytes transferred, summing balances — they use `Math.addExact` so a bug fails loudly.

**Hashing.** `HashMap` spreads hash codes with `h ^ (h >>> 16)`, mixing the high bits into the low bits, and chooses a bucket with `hash & (table.length - 1)` instead of `%`, which works because the table length is always a power of two. Both lines are pure bitwise operators; see [[c1-hashmap-internals]].

**Protocols and file formats.** Network headers, image files and compression codecs pack fields into bits. Reading them means `(b & 0xFF)`, shifts and masks; Java's lack of unsigned types makes these idioms unavoidable in such code. Unix file permissions (`chmod 755`) are three bit flags per user class.

**Feature flags and permissions.** Many systems store a set of options as a bitmask column in a database because it fits in one integer and can be tested with a single `&` in SQL as well as in Java.

**Guard conditions.** Short-circuit `&&` is everywhere in service code: `if (order != null && order.isPaid() && !order.isShipped())`. Each check protects the next.

## Trade-offs and alternatives

| Choice | Prefer it when | Avoid it when |
|---|---|---|
| `int` arithmetic | Counts, indices, small quantities | Values can exceed about 2.1 billion |
| `long` arithmetic | Timestamps in milliseconds, IDs, money in cents | Values can exceed about 9.2 × 10¹⁸ |
| `Math.*Exact` | Overflow would be a bug that must not pass silently | Wrap-around is intended, as in hash functions |
| `double` | Measurements, scientific values, where tiny errors are acceptable | Money or exact equality checks |
| `BigDecimal` / `BigInteger` | Exact decimal money, arbitrarily large numbers | Hot loops where allocation and speed matter |
| Ternary `? :` | Choosing between two values in one expression | Branches have side effects or nest more than one level |
| Bit flags in an `int` | Protocols, storage formats, performance-critical code | Ordinary domain logic; use `EnumSet` instead |
| `x++` as a statement | Loop counters and simple increments | Inside larger expressions, where it hides a side effect |

The general trade-off is between brevity and clarity. Java gives you terse operators (`i++`, `?:`, `x &= ~MASK`) that are efficient and idiomatic in the right place, but each one can hide a side effect, a type conversion or a precedence decision. Use them where readers expect them, and spell things out elsewhere.

## Common mistakes

> [!MISTAKE] Dividing integers and expecting a fraction
> `double average = sum / count;` with `int` operands performs integer division before the result is widened, so 7 / 2 gives 3.0. Cast one operand first: `(double) sum / count`. Casting the whole quotient, `(double) (sum / count)`, is too late.

**Testing odd numbers with `n % 2 == 1`.** It is `false` for negative odd numbers because `-3 % 2` is `-1`. Use `n % 2 != 0` or `(n & 1) != 0`.

**Comparing objects with `==`.** Strings, boxed numbers and your own classes need `equals`. Tests with small integers or string literals often pass by accident because of caching and interning, then fail in production with real data.

**Comparing `double` values with `==`.** Use a tolerance, or keep exact values in integer or `BigDecimal` form.

**Putting the guard on the wrong side of `&&`.** `list.get(0) != null && !list.isEmpty()` throws on an empty list; the check that protects must come first.

**Using `&` or `|` in conditions by accident.** They compile for booleans but do not short-circuit, so a null check on the left no longer protects the right.

**Forgetting parentheses around bitwise tests.** `flags & MASK != 0` groups as `flags & (MASK != 0)`. Write `(flags & MASK) != 0`.

**Expecting `"Total: " + a + b` to add.** Once the left side is a string, every later `+` concatenates. Write `"Total: " + (a + b)`.

**Shifting an `int` by 32 or more.** The distance is masked to five bits. Use a `long` left operand when you need more than 32 bits.

**Relying on a `+=` to warn about narrowing.** Compound assignment includes a cast, so `byteValue += 200` compiles and wraps.

## Interview perspective

Operator questions in Java interviews are usually short "what does this print?" puzzles, used to check that you reason precisely rather than guess. The strongest answers name the rule, then apply it.

> [!INTERVIEW] Answering a "what does this print" question
> "`i++` evaluates to the old value, 5, and then increments `i` to 6. Then the assignment stores the 5 it was given, overwriting the increment, so `i` is 5." Naming the rule — postfix yields the old value; the right side is evaluated before the assignment — shows you are not relying on memory of the puzzle.

Questions you should be able to answer:

- **What is the difference between `&&` and `&`?** Both compute logical AND on booleans; `&&` short-circuits and skips the right operand when the left is `false`, `&` always evaluates both. `&` is also bitwise AND on integers.
- **What is the difference between `>>` and `>>>`?** `>>` fills with the sign bit and preserves the sign; `>>>` fills with zeros and treats the value as unsigned. They differ only for negative numbers.
- **Why is `0.1 + 0.2 != 0.3`?** Neither 0.1 nor 0.2 has an exact binary representation; the sum rounds to a slightly different `double` than the literal 0.3.
- **Why does `short s = 1; s = s + 1;` fail but `s += 1;` compile?** `s + 1` is promoted to `int` and needs a cast to assign to a `short`; compound assignment includes that cast implicitly.
- **How would you check whether a number is a power of two?** `n > 0 && (n & (n - 1)) == 0`, because subtracting one flips the lowest set bit and everything below it.
- **Does precedence determine evaluation order?** No. Precedence determines grouping; Java evaluates operands strictly left to right.
- **What does `Math.abs(Integer.MIN_VALUE)` return?** `Integer.MIN_VALUE` itself, because its positive counterpart does not fit in an `int`.

A common follow-up asks you to compute an average or midpoint safely; mention both `low + (high - low) / 2` and `(low + high) >>> 1`, and explain why the naive sum overflows.

## Practice

1. **Predict, then run.** Write down what each line prints before running it: `System.out.println(10 / 4 * 4 + 10 % 4);`, `System.out.println('7' - '0' + 1);`, `System.out.println(1 + 1 + "1" + 1 + 1);`.
2. **Digit sum.** Using only `/` and `%` in a loop, compute the sum of the digits of a non-negative `int`. Then make it work for negative numbers.
3. **Safe percentage.** Write `int percent(int part, int whole)` that returns a rounded percentage without overflow for values up to `Integer.MAX_VALUE`, and returns 0 when `whole` is 0.
4. **Permission set.** Define four permission flags and write methods `grant`, `revoke`, `has` and `toString` (printing names such as `READ|WRITE`). Then rewrite it with `EnumSet` and compare the two.
5. **Bit counting.** Count the set bits of an `int` without `Integer.bitCount`, first by shifting right one bit at a time (watch out: which shift?), then with the `n & (n - 1)` trick. Compare how many iterations each version needs for 8 and for −1, and explain the difference.
6. **Precedence audit.** Add full parentheses to `a + b << 2 > c && d | e == f || !g` to show exactly how Java groups it, then check your answer by compiling variants.

## Quick revision {#quick-revision}

- Binary arithmetic promotes operands first (at least to `int`; to `long`/`float`/`double` if either side is). The result type follows the operands, not the variable receiving it.
- Integer `/` truncates toward zero; `%` takes the sign of the left operand. Use `Math.floorDiv`/`floorMod` for floor semantics. Integer division by zero throws; floating-point gives `Infinity` or `NaN`.
- Integer overflow wraps silently; `Math.addExact` and friends throw instead. `-Integer.MIN_VALUE == Integer.MIN_VALUE`.
- `a++` yields the old value, `++a` the new one. `i = i++` leaves `i` unchanged.
- `+` with a `String` operand concatenates, left to right: `1 + 2 + "x"` is `"3x"`, `"x" + 1 + 2` is `"x12"`.
- `x op= y` means `x = (T) (x op y)`: a hidden narrowing cast, and the left side evaluated once.
- `==` on references compares identity; use `equals` for contents. Do not compare `double`s with `==`; `NaN != NaN`.
- `&&` and `||` short-circuit; `&` and `|` on booleans do not. Put guards on the left.
- The ternary evaluates one branch; its type is the branches' common type, which can unbox `null`.
- Two's complement: `~x == -x - 1`. `>>` keeps the sign, `>>>` fills with zeros. Shift distance is masked to 5 bits (`int`) or 6 bits (`long`).
- Flag idioms: set `|= m`, clear `&= ~m`, toggle `^= m`, test `(v & m) != 0`. Unsigned byte: `b & 0xFF`.
- Precedence landmarks: unary/cast > `* / %` > `+ -` > shifts > relational > equality > `&` > `^` > `|` > `&&` > `||` > `?:` > assignment.
- Assignment, unary operators and the ternary are right-associative; the rest are left-associative.
- Operands are evaluated left to right regardless of precedence.

## Key takeaways {#key-takeaways}

- Every Java expression has a type fixed at compile time; most operator surprises — integer division, overflow, ternary unboxing, `'a' + 1` — follow from working out that type first.
- Integer arithmetic wraps and truncates; floating-point arithmetic rounds. Choose the numeric type for the values you need to represent, and use the exact-arithmetic methods when overflow is a bug.
- `==` compares values for primitives but identity for objects; compare object contents with `equals`.
- Short-circuit evaluation is a correctness tool: write conditions as "guard, then use".
- Bitwise operators work on two's-complement bit patterns; parenthesise them, mask bytes with `0xFF`, and remember that shift distances wrap.
- Precedence and associativity decide grouping, evaluation order is always left to right, and parentheses are free — use them wherever a reader might hesitate.
