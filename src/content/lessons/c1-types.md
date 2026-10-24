---
summary: Every value in a Java program has a type that the compiler knows before the program runs. You will learn the eight primitive types and how they behave at their limits, how reference types point to objects, how values convert between types, and when var lets the compiler write the type for you.
difficulty: beginner
minutes: 60
objectives:
  - Choose the right primitive type for a value and predict overflow, integer division and floating-point rounding behaviour
  - Explain the difference between a primitive variable and a reference variable, including aliasing, null and what == compares
  - Predict the result of widening, narrowing and reference casts, and recognise when a cast is checked at compile time or at run time
  - Use var correctly, name the places it is not allowed, and judge when it helps or hurts readability
  - Describe where the JVM stores local variables and objects, and why Java is always pass-by-value
---

## Introduction

A program spends almost all its time moving and transforming data: prices, names, counts, timestamps, flags. Before Java will let you store any of that data, you must say what *kind* of data it is. `int count = 3;` declares a variable called `count` that can only ever hold whole numbers in a fixed range. `String name = "Ada";` declares one that can only refer to text. That label — `int`, `String` — is the variable's **type**.

Java is **statically typed**: every variable and expression has a type that the compiler works out before the program runs, and the compiler rejects code that mixes types incorrectly. Write `int count = "three";` and `javac` refuses to produce a class file. Languages such as Python and JavaScript are dynamically typed — they discover a value's type only when the line runs, so the equivalent mistake surfaces later, possibly in production. Static typing costs some extra writing, and in return you get errors early, precise autocompletion in your editor, and safe automated refactoring across millions of lines.

Java's types fall into two families that behave very differently:

- **Primitive types** — eight built-in types (`int`, `double`, `boolean` and five others) whose variables hold the value directly.
- **Reference types** — classes, interfaces, arrays, enums and records, whose variables hold a *reference* that points to an object somewhere else in memory.

Almost every confusing behaviour beginners meet — `==` returning `false` for two equal strings, a method that changes a list you passed it, `365 * 24 * 60 * 60 * 1000` producing a strange number — comes from not knowing which family a type belongs to or how its values behave at the edges. This lesson teaches both families, how values convert between types, and `var`, which lets the compiler infer a local variable's type.

## Before you start

- **Basic program structure** — a class with a `main` method, compiling with `javac` and running with `java`. See [[c1-syntax]].

Everything else is introduced here. Operators such as `+`, `/` and `%` appear in examples and are explained as they are used; the full rules are in [[c1-operators]].

## The intuition

Picture a variable as a labelled box with a fixed shape.

A **primitive variable** is a box that holds the value itself. A box labelled `int age` contains the number `36`. Copy it into another box and you get a second, independent `36`; changing one box does not affect the other.

A **reference variable** is a box that holds a slip of paper with an address written on it — the location of an object. A box labelled `List<String> cart` does not contain the list; it contains directions to where the list lives. Copy that box and you have two slips with the *same* address. Follow either slip and you reach the same list, so a change made through one is visible through the other.

The box's shape is its type, and it is fixed when the box is created. An `int` box cannot hold text, and a `List` box cannot hold a `String`. The analogy stops working in one place: Java gives you no way to read or do arithmetic on the "address" itself, unlike pointers in C. You can only follow it, copy it, compare two of them, or set it to `null`.

## Variables: declaring, initialising and assigning

A **variable** is a named storage location with a type. Three operations are involved:

```java
int quantity;          // declaration: name and type
quantity = 5;          // assignment: store a value
int price = 1_299;     // declaration with an initial value (initialisation)
quantity = quantity + 1;
```

The right-hand side of an assignment must have a type compatible with the variable. A variable can be reassigned as often as you like, unless it is declared **`final`**, which allows exactly one assignment:

```java
final int maxRetries = 3;
maxRetries = 4;        // error: cannot assign a value to final variable maxRetries
```

`final` does not make an *object* unchangeable — a `final List<String>` variable cannot be pointed at a different list, but the list it points to can still have items added. Constants shared across a class are written `static final` with an upper-case name, such as `static final int MAX_RETRIES = 3;`.

### Local variables must be assigned before use

A **local variable** is one declared inside a method. Java requires it to be **definitely assigned** before it is read, and the compiler checks this on every path through the code:

```java title="Uninit.java"
public class Uninit {
    public static void main(String[] args) {
        int total;
        System.out.println(total);
    }
}
```

```output
Uninit.java:4: error: variable total might not have been initialized
        System.out.println(total);
                           ^
1 error
```

In C, an uninitialised local holds whatever bytes happened to be in memory, a classic source of unpredictable bugs. Java rules that out at compile time.

**Fields** (variables declared in a class, outside any method) and **array elements** are different: they are automatically set to a **default value** when the object or array is created.

```java title="Defaults.java"
public class Defaults {
    static int count;
    static double ratio;
    static boolean ready;
    static char letter;
    static String label;

    public static void main(String[] args) {
        System.out.println(count + " " + ratio + " " + ready + " " + (int) letter + " " + label);
        int[] scores = new int[3];
        String[] names = new String[2];
        System.out.println(scores[0] + " " + names[0]);
    }
}
```

```output
0 0.0 false 0 null
0 null
```

Numeric types default to zero, `boolean` to `false`, `char` to the character with code 0, and every reference type to `null`. Where a variable is visible — its **scope** — is covered in [[c1-variable-scope]].

### Literals

A **literal** is a value written directly in the source. Its form decides its type:

| Literal | Type | Notes |
|---|---|---|
| `42`, `-7` | `int` | Whole-number literals are `int` by default |
| `42L` | `long` | The `L` suffix makes a `long` (use upper case; `l` looks like `1`) |
| `0x1F`, `0b1010`, `017` | `int` | Hexadecimal (31), binary (10), and octal (15) — a leading `0` means octal |
| `1_000_000` | `int` | Underscores between digits aid reading (Java 7+) and are ignored |
| `3.14`, `1e-9` | `double` | Decimal literals are `double` by default |
| `3.14f` | `float` | The `f` suffix is required for `float` |
| `'A'`, `'\n'`, `'A'` | `char` | Single quotes; one character or escape |
| `"Hello"` | `String` | Double quotes; a reference type |
| `true`, `false` | `boolean` | |
| `null` | the null type | Assignable to any reference type |

The octal rule causes real bugs: `int code = 010;` stores 8, not 10. Never pad numbers with leading zeros.

## Primitive Types {#c1-primitives}

A **primitive type** is one of eight types built into the Java language whose values are stored directly in the variable rather than in a separate object. They are the raw material of every computation: counters, sizes, prices, flags and characters. Primitives have no methods and can never be `null`, and their sizes are fixed by the language specification — an `int` is 32 bits on every platform, unlike C, where `int`'s size depends on the compiler.

| Type | Size | Range | Default | Typical use |
|---|---|---|---|---|
| `byte` | 8 bits | −128 to 127 | `0` | Raw binary data, file and network bytes |
| `short` | 16 bits | −32,768 to 32,767 | `0` | Rare; large arrays where memory matters |
| `int` | 32 bits | about ±2.1 billion | `0` | The default for whole numbers: counts, indices |
| `long` | 64 bits | about ±9.2 × 10¹⁸ | `0L` | Timestamps, IDs, money in cents, large totals |
| `float` | 32 bits | about ±3.4 × 10³⁸, ~7 significant digits | `0.0f` | Graphics, large numeric arrays |
| `double` | 64 bits | about ±1.8 × 10³⁰⁸, ~15–17 significant digits | `0.0` | The default for fractional numbers |
| `char` | 16 bits | 0 to 65,535 (unsigned) | `'\u0000'` | A single UTF-16 code unit |
| `boolean` | not specified | `true` or `false` | `false` | Flags and conditions |

You do not need to memorise the exact ranges; each primitive has a **wrapper class** in `java.lang` (`Integer`, `Long`, `Double` and so on) that exposes them as constants:

```java title="Primitives.java"
public class Primitives {
    public static void main(String[] args) {
        System.out.println("byte:  " + Byte.MIN_VALUE + " to " + Byte.MAX_VALUE);
        System.out.println("short: " + Short.MIN_VALUE + " to " + Short.MAX_VALUE);
        System.out.println("int:   " + Integer.MIN_VALUE + " to " + Integer.MAX_VALUE);
        System.out.println("long:  " + Long.MIN_VALUE + " to " + Long.MAX_VALUE);
        System.out.println("char:  " + (int) Character.MIN_VALUE + " to " + (int) Character.MAX_VALUE);
        System.out.println("float max:  " + Float.MAX_VALUE);
        System.out.println("double max: " + Double.MAX_VALUE);
    }
}
```

```output
byte:  -128 to 127
short: -32768 to 32767
int:   -2147483648 to 2147483647
long:  -9223372036854775808 to 9223372036854775807
char:  0 to 65535
float max:  3.4028235E38
double max: 1.7976931348623157E308
```

The integer types are **signed** and use **two's complement**, which is why each range has one more negative value than positive: of the 256 patterns a byte can hold, one is zero, 128 are negative and 127 are positive. `char` is the only unsigned primitive.

### Integer types and overflow

When an integer calculation produces a result outside its type's range, Java does not raise an error. The result **wraps around**: only the lowest 32 bits (for `int`) or 64 bits (for `long`) of the true result are kept. This is called **overflow**, and it is silent.

```java title="Overflow.java"
public class Overflow {
    public static void main(String[] args) {
        int big = Integer.MAX_VALUE;
        System.out.println(big + 1);                       // wraps around

        long millisPerYear = 365 * 24 * 60 * 60 * 1000;    // int arithmetic overflows
        long fixed = 365L * 24 * 60 * 60 * 1000;           // long arithmetic from the start
        System.out.println(millisPerYear);
        System.out.println(fixed);

        System.out.println(Math.addExact(big, 1));         // throws instead of wrapping
    }
}
```

```output
-2147483648
1471228928
31536000000
Exception in thread "main" java.lang.ArithmeticException: integer overflow
	at java.base/java.lang.Math.addExact(Math.java:...)
	at Overflow.main(Overflow.java:11)
```

The second line is the important lesson. Storing the result in a `long` does not help, because the multiplication happens first and every operand is an `int`, so the arithmetic is done in `int` and overflows before the result is widened to `long`. The type of an arithmetic expression is decided by its **operands**, not by the variable that receives it. Making the first operand `365L` turns the whole chain into `long` arithmetic. (The Java Development Kit (JDK) line number inside `Math.addExact` varies between versions and is elided.)

When overflow would be a bug rather than an expected wrap, use `Math.addExact`, `Math.multiplyExact` and their relatives, which throw `ArithmeticException` instead. For integers beyond `long`'s range, use `java.math.BigInteger`, a reference type with no size limit.

### Integer division and remainder

Dividing two integers produces an integer: the fractional part is discarded, **truncating toward zero**.

| Expression | Result | Why |
|---|---|---|
| `7 / 2` | `3` | Both operands `int`, fraction dropped |
| `-7 / 2` | `-3` | Truncates toward zero, not down to −4 |
| `7 / 2.0` | `3.5` | One operand is `double`, so the division is in `double` |
| `-7 % 2` | `-1` | The remainder takes the sign of the left operand |
| `Math.floorMod(-7, 2)` | `1` | Always non-negative for a positive divisor |
| `10 / 0` | throws `ArithmeticException: / by zero` | Integer division by zero is an error |

The `%` sign rule matters when you write `if (n % 2 == 1)` to test for odd numbers: it is false for negative odd numbers, because `-7 % 2` is `-1`. Test `n % 2 != 0` instead.

### Floating-point types

`float` and `double` store numbers in **binary floating point**, following the IEEE 754 standard. A floating-point number is stored as a sign, a binary fraction and an exponent, much like scientific notation in base 2. That gives an enormous range, but most decimal fractions cannot be represented exactly — just as 1/3 has no finite decimal expansion, 1/10 has no finite binary one.

```java title="FloatingPoint.java"
public class FloatingPoint {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);

        double sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += 0.1;
        }
        System.out.println(sum);
        System.out.println(sum == 1.0);
        System.out.println(Math.abs(sum - 1.0) < 1e-9);   // compare with a tolerance

        System.out.println(1.0 / 0);
        System.out.println(0.0 / 0 == 0.0 / 0);           // NaN is not equal to itself
        System.out.println(1e16 + 1 == 1e16);             // the 1 is lost
    }
}
```

```output
0.30000000000000004
0.9999999999999999
false
true
Infinity
false
true
```

Each line teaches a rule. Small representation errors accumulate, so **never compare floating-point results with `==`**; check whether they are within a small tolerance. Floating-point division by zero does not throw; it produces `Infinity`, `-Infinity`, or **`NaN`** ("not a number", from `0.0 / 0`). `NaN` compares unequal to everything, including itself, so test for it with `Double.isNaN(x)`. And a `double` holds only about 15–17 significant decimal digits, so adding 1 to 10¹⁶ changes nothing.

Use `double` rather than `float` unless you have a specific reason (memory in very large arrays, or an API that demands `float`); `float`'s seven digits run out quickly.

> [!WARNING] Never store money in double
> `0.1 + 0.2` is not `0.3` in binary floating point, and the errors compound across thousands of transactions. Store money as a `long` count of the smallest unit (cents), or use `java.math.BigDecimal`, which represents decimal fractions exactly: `new BigDecimal("0.10").add(new BigDecimal("0.20"))` gives `0.30`. Construct `BigDecimal` from a string — `new BigDecimal(0.1)` captures the binary error and prints `0.1000000000000000055511151231257827021181583404541015625`.

### char: a character code

A `char` holds one **UTF-16 code unit**: a 16-bit unsigned number that identifies a character. `'A'` is stored as 65. Because a `char` is a number underneath, you can do arithmetic on it, and the result is an `int`:

```java
char c = 'A';
System.out.println(c + 1);          // 66: char promoted to int
System.out.println((char) (c + 1)); // B: cast back to char
```

Sixteen bits can only number 65,536 characters, and Unicode now defines far more. Characters outside the first 65,536 — many emoji, historic scripts, musical symbols — are stored as a **surrogate pair** of two `char`s. The musical G clef symbol, U+1D11E, is one character to a reader but two `char`s to Java: a `String` containing only it has `length()` 2 and `codePointCount(0, 2)` 1. Most business text never meets this, but code that reverses or truncates strings by `char` can split a pair and produce garbage. String handling is covered in [[c1-strings]].

### boolean

A `boolean` holds `true` or `false` and nothing else. Unlike C, Java does not treat numbers as booleans: `if (count)` does not compile, and you must write `if (count != 0)`. This rules out the classic C bug of writing `if (x = 5)` (assignment) instead of `if (x == 5)` (comparison) — for an `int` `x`, the assignment's value is an `int`, which is not a `boolean`, so it fails to compile.

The specification deliberately does not define a `boolean`'s size. In the HotSpot JVM, a `boolean` local variable occupies a 32-bit slot like an `int`, and each element of a `boolean[]` takes one byte.

### Choosing a primitive

Use `int` for whole numbers unless the value can exceed about two billion — then use `long` (timestamps in milliseconds, database IDs, file sizes, sums of money in cents). Use `double` for measurements and scientific values, `BigDecimal` or `long` cents for money, `boolean` for yes/no, and `char` for single characters. `byte` appears when handling raw binary data, and `short` almost never. Smaller types do not make arithmetic faster: `byte` and `short` values are promoted to `int` for every calculation anyway, as the casting section shows.

## Reference Types {#c1-reference-types}

A **reference type** is any type whose variables hold a *reference* to an object rather than the value itself. Every type that is not one of the eight primitives is a reference type: classes such as `String` and `ArrayList`, interfaces such as `List`, arrays such as `int[]`, enums and records. The object itself lives in a memory area called the **heap**, and the variable holds the information the JVM needs to find it.

This one difference — the variable holds a pointer to the data, not the data — explains how assignment, comparison, `null` and method calls behave with objects.

### Creating objects

Objects are usually created with `new`, which allocates memory on the heap, runs a constructor to initialise it and returns a reference to it:

```java
StringBuilder builder = new StringBuilder("draft");
int[] scores = new int[5];
```

Some types have shortcuts — string literals (`"Ada"`), array initialisers (`{1, 2, 3}`) and factory methods such as `List.of(...)` — but the result is the same: an object on the heap and a reference in the variable.

### Assignment copies the reference

The program below shows the difference between copying a primitive and copying a reference, and what that means for methods.

```java title="Refs.java"
import java.util.ArrayList;
import java.util.List;

public class Refs {
    static void addItem(List<String> list) {
        list.add("added inside method");    // changes the object the caller also sees
    }

    static void replaceList(List<String> list) {
        list = new ArrayList<>();           // changes only the local copy of the reference
        list.add("never seen by caller");
    }

    public static void main(String[] args) {
        int a = 10;
        int b = a;          // copies the value 10
        b = 20;
        System.out.println("a = " + a + ", b = " + b);

        List<String> first = new ArrayList<>();
        List<String> second = first;    // copies the reference: one list, two names
        second.add("milk");
        System.out.println("first = " + first);

        addItem(first);
        replaceList(first);
        System.out.println("first = " + first);

        List<String> copy = new ArrayList<>(first);
        System.out.println(first == second);        // same object
        System.out.println(first == copy);          // different objects
        System.out.println(first.equals(copy));     // same contents
    }
}
```

```output
a = 10, b = 20
first = [milk]
first = [milk, added inside method]
true
false
true
```

Walk through it. `b = a` copies the number, so changing `b` leaves `a` alone. `second = first` copies the reference, so `first` and `second` now name the **same** list — this is called **aliasing** — and adding through `second` is visible through `first`.

The two methods show the rule that confuses more Java developers than any other: **Java is always pass-by-value**. When you call a method, each argument's value is copied into the parameter. For a reference type, the value copied is the *reference*. So `addItem` receives a copy of the address, follows it, and modifies the caller's list. `replaceList` also receives a copy of the address, but then overwrites its own copy with a new address; the caller's variable still points at the original list, so `"never seen by caller"` never appears. Java has no pass-by-reference, in which a method could make the caller's variable point somewhere else.

```mermaid title="Two references to one list, then a method replaces its own copy"
flowchart LR
    F["first (main)"] --> L1["ArrayList: milk, added inside method"]
    S["second (main)"] --> L1
    P["list (replaceList)"] --> L2["ArrayList: never seen by caller"]
```

### == compares references; equals compares contents

For reference types, `==` asks "do these two variables point to the **same object**?" It does not look inside. `first == copy` is `false` even though both lists hold the same strings, because `new ArrayList<>(first)` built a separate object. To compare contents, call **`equals`**, which each class defines to mean what makes sense for it — for lists, same elements in the same order.

This matters most with strings: `==` on two `String` variables may be `true` or `false` for equal text depending on how the strings were created, so always compare text with `equals`. The reasons are covered in [[c1-string-equals]], and how to write `equals` for your own classes in [[c1-equals]].

### null: a reference to nothing

A reference variable can hold the special value **`null`**, meaning it points to no object. Comparing with `null` is fine; using it to call a method or read a field throws a `NullPointerException`:

```java
List<String> missing = null;
System.out.println(missing == null);   // true
System.out.println(missing.size());    // throws NullPointerException
```

```output
true
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "java.util.List.size()" because "missing" is null
	at Refs.main(Refs.java:36)
```

Since Java 14 (and on by default from Java 15), these **helpful NullPointerException messages** name exactly what was `null`. Local variable names appear only when the class was compiled with debug information (`javac -g`, which build tools and IDEs normally use); with plain `javac`, the message says `"<local6>"` instead, meaning local-variable slot 6.

Primitives cannot be `null`, so `int count = null;` does not compile. When "no value" must be representable, use a wrapper type such as `Integer` (which can be `null`), or better, `Optional<Integer>` for return values, covered in [[c1-optional]].

### Kinds of reference type

| Kind | Example | Notes |
|---|---|---|
| Class | `String`, `ArrayList<String>`, your own `Order` | The most common kind |
| Interface | `List<String>`, `Runnable` | Variables of interface type refer to an object of some implementing class |
| Array | `int[]`, `String[][]` | Arrays are objects, even arrays of primitives; see [[c1-arrays]] |
| Enum | `DayOfWeek` | A fixed set of named instances; see [[c1-enums]] |
| Record | `record Point(int x, int y)` | Compact immutable data carriers; see [[c1-records]] |

A variable's declared type can be more general than the object's actual class. `List<String> names = new ArrayList<>();` declares an interface type and creates an `ArrayList`. The declared type controls which methods you may call (the compiler only knows it is a `List`); the actual class decides what those calls do at run time. This is the basis of polymorphism, taught in [[c1-polymorphism]].

### Wrapper classes: primitives as objects

Each primitive has a corresponding wrapper class — `Integer` for `int`, `Double` for `double`, `Boolean` for `boolean`, `Character` for `char`, and so on. Wrappers exist because many Java APIs work only with objects. Collections are the main example: you cannot write `List<int>`, only `List<Integer>`. Java converts between the two automatically (**autoboxing** and **unboxing**), which is convenient but carries traps — unboxing a `null` throws `NullPointerException`, and comparing two `Integer` objects with `==` compares references. Those traps are covered in [[c1-wrappers]], [[c1-autoboxing]] and [[c1-integer-cache]].

### String is a reference type with special support

`String` is an ordinary class in `java.lang`, but the language gives it special treatment: literals in double quotes, `+` for concatenation, and a pool that shares identical literals. String objects are **immutable** — methods such as `toUpperCase()` return a new string rather than changing the original. Because of immutability, aliasing a `String` is always safe. All of this is covered in [[c1-strings]].

## Type Casting {#c1-type-casting}

**Type casting** — more formally, **type conversion** — means turning a value of one type into a value of another type. Some conversions are always safe and Java performs them automatically. Others can lose information, so Java insists you write an explicit cast, `(type) value`, to show you accept the risk. Knowing exactly what each conversion does at its limits prevents some of the most common numeric bugs.

### Widening conversions happen automatically

A **widening primitive conversion** goes from a type to one that can represent its whole range, so no magnitude is lost:

```text
byte → short → int → long → float → double
              char ↗
```

Any type on that chain converts automatically to any type to its right, and `char` converts to `int` and beyond. You need no cast:

```java
int count = 42;
long widened = count;          // 42
double asDouble = count;       // 42.0
int code = 'a';                // 97
```

There is one subtlety. `long` to `float` or `double`, and `int` to `float`, are widening — the range always fits — but they can lose **precision**, because a `double` has only 53 bits for its digits while a `long` has 64:

```java title="PrecisionLoss.java"
public class PrecisionLoss {
    public static void main(String[] args) {
        long precise = 123_456_789_123_456_789L;
        double approx = precise;         // widening, no cast needed, but digits are lost
        System.out.println(approx);
        System.out.println((long) approx);

        int bigInt = 16_777_217;
        float f = bigInt;                // float has only 24 bits of precision
        System.out.println((int) f);
    }
}
```

```output
1.2345678912345678E17
123456789123456784
16777216
```

Converting back reveals the damage: the `long` comes back as `...784` instead of `...789`, and 16,777,217 (2²⁴ + 1) becomes 16,777,216. The compiler does not warn about this, because the conversion is legal widening.

### Narrowing conversions need an explicit cast

A **narrowing primitive conversion** goes the other way, to a type that cannot hold every value of the source. The compiler requires a cast, and the cast's behaviour depends on the types involved:

```java title="Narrowing.java"
public class Narrowing {
    public static void main(String[] args) {
        double price = 19.99;
        System.out.println((int) price);          // fraction discarded
        System.out.println((int) -19.99);         // truncates toward zero
        System.out.println(Math.round(19.99));    // rounding is a separate operation

        System.out.println((byte) 200);           // keeps only the low 8 bits
        System.out.println((int) 3_000_000_000L); // keeps only the low 32 bits
        System.out.println((int) 1e20);           // double to int saturates at the limit
        System.out.println((int) Double.NaN);     // NaN becomes 0
    }
}
```

```output
19
-19
20
-56
-1294967296
2147483647
0
```

Two different rules are at work:

- **Floating point to integer** discards the fraction (truncating toward zero), and values outside the target range **saturate** at the target's minimum or maximum; `NaN` becomes `0`. If you want rounding, call `Math.round`, which returns a `long` for a `double` argument.
- **Integer to smaller integer** keeps only the low-order bits and throws the rest away. 200 in binary is `11001000`; as a signed byte, that bit pattern means −56. No error, no warning — the value is silently different.

A cast is a promise to the compiler that you know what you are doing. When the value might not fit and that would be a bug, check first or use `Math.toIntExact(longValue)`, which throws `ArithmeticException` instead of truncating.

### Numeric promotion in expressions

In arithmetic, Java first **promotes** operands to a common type: `byte`, `short` and `char` are always promoted to at least `int`, and if either operand is `long`, `float` or `double`, the other is promoted to match. This is why `byte + byte` is an `int`:

```java title="Promotion.java"
public class Promotion {
    public static void main(String[] args) {
        byte small = 10;             // allowed: 10 is a constant that fits in a byte
        small += 5;                  // allowed: compound assignment casts back to byte
        // small = small + 5;        // error: small + 5 is an int
        byte sum = (byte) (small + 120);
        System.out.println(small + " " + sum);

        char letter = 'a';
        letter += 2;
        System.out.println(letter);
    }
}
```

```output
15 -121
c
```

Uncommenting the marked line gives `error: incompatible types: possible lossy conversion from int to byte`, because `small + 5` is an `int`. Three rules explain the rest of the program:

- **Constant assignment.** `byte small = 10;` compiles without a cast because `10` is a compile-time constant that the compiler can see fits in a byte. `byte b = 200;` does not compile.
- **Compound assignment includes a hidden cast.** `small += 5` means `small = (byte) (small + 5)`. That is convenient, and it also means `+=` can overflow silently: `small += 200` compiles and wraps.
- **Explicit narrowing wraps.** `15 + 120 = 135`, which does not fit in a byte; keeping the low 8 bits gives −121.

Promotion also explains `7 / 2.0` being `3.5`: the `int` 7 is promoted to `double` before dividing. To divide two `int` variables and keep the fraction, cast one of them *before* the division — `(double) total / count`. Writing `(double) (total / count)` casts after the integer division has already discarded the fraction.

### Casting reference types

Casting a reference never changes the object. It changes only the type through which the compiler lets you view it.

An **upcast** — from a class to one of its supertypes — is always safe and automatic: a `String` *is an* `Object`, so `Object value = "hello";` needs no cast.

A **downcast** — from a supertype to a more specific type — needs an explicit cast and is **checked at run time**. If the object is not really of the target type, the JVM throws `ClassCastException`:

```java title="RefCast.java"
public class RefCast {
    public static void main(String[] args) {
        Object value = "hello";               // upcast: String is an Object, no cast needed
        String text = (String) value;         // downcast: checked at run time
        System.out.println(text.length());

        if (value instanceof String s) {      // pattern matching (Java 16+)
            System.out.println(s.toUpperCase());
        }

        Object number = 42;                   // autoboxed to Integer
        System.out.println(number instanceof String);
        String broken = (String) number;      // compiles, fails at run time
    }
}
```

```output
5
HELLO
false
Exception in thread "main" java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String (java.lang.Integer and java.lang.String are in module java.base of loader 'bootstrap')
	at RefCast.main(RefCast.java:13)
```

The compiler allows `(String) number` because a variable of type `Object` *might* hold a `String`. When it cannot possibly succeed, the compiler rejects it outright: casting a variable declared as `Integer` to `String` gives `error: incompatible types: Integer cannot be converted to String`, since no object can be both.

The safe pattern is to test before casting. Since Java 16, **pattern matching for `instanceof`** does both at once: `value instanceof String s` checks the type and, if it matches, declares `s` already cast. More powerful forms of pattern matching are covered in [[c1-pattern-matching]].

### Converting between strings and numbers is not casting

A frequent beginner attempt is `(int) "42"`. It does not compile: `String` and `int` are unrelated types, and no cast can turn text into a number. Conversion between text and numbers is **parsing** and **formatting**, done by methods:

```java title="Parse.java"
public class Parse {
    public static void main(String[] args) {
        String input = "42";
        int n = Integer.parseInt(input);      // String to int: parsing, not casting
        String back = String.valueOf(n + 1);  // int to String
        System.out.println(n + 1);
        System.out.println(back + 1);
        System.out.println(Double.parseDouble("3.75") * 2);
    }
}
```

```output
43
431
7.5
```

`back + 1` prints `431` because `+` with a `String` operand means concatenation: the `1` is converted to text and appended. `Integer.parseInt("abc")` throws `NumberFormatException`, so input from users must be validated, as shown in [[c1-user-input]].

## Local-Variable Type Inference (var) {#c1-local-var}

**Local-variable type inference** lets you write `var` instead of a type when declaring a local variable, and the compiler works out — **infers** — the type from the value you initialise it with. It was added in Java 10. `var` does not make Java dynamically typed: the variable still has one fixed, static type, decided at compile time. You simply do not have to write it.

The motivation is repetition. Java declarations often state the same type twice:

```java
Map<String, List<Integer>> scoresByStudent = new HashMap<String, List<Integer>>();
```

The diamond operator `<>` (Java 7) removed the repetition on the right. `var` removes it on the left when the right-hand side already makes the type obvious:

```java title="VarDemo.java"
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class VarDemo {
    public static void main(String[] args) {
        var count = 10;                          // int
        var total = 10L;                         // long, because of the L suffix
        var names = new ArrayList<String>();     // ArrayList<String>
        names.add("Ravi");
        names.add("Mei");

        Map<String, List<Integer>> scoresByStudent = new TreeMap<>();
        scoresByStudent.put("Ravi", List.of(81, 92));
        scoresByStudent.put("Mei", List.of(77));

        // Without var: for (Map.Entry<String, List<Integer>> entry : ...)
        for (var entry : scoresByStudent.entrySet()) {
            var sum = 0;
            for (var score : entry.getValue()) {
                sum += score;
            }
            System.out.println(entry.getKey() + " -> " + sum);
        }

        System.out.println(count * total + " " + names);
        // count = "ten";   // error: incompatible types: String cannot be converted to int
    }
}
```

```output
Mei -> 77
Ravi -> 173
100 [Ravi, Mei]
```

`entry` is inferred as `Map.Entry<String, List<Integer>>` — a type that is tedious to write and adds little when the loop header already says what is being iterated. `count` is permanently an `int`; the commented-out assignment of a string fails exactly as it would with an explicit type. Inference is purely a compiler feature: the generated bytecode is the same as if you had written the types out, so `var` has no runtime cost.

### Where var is allowed

`var` works only where the compiler can see a complete initial value for a single local variable:

- local variables with an initialiser, `var total = 0;`
- the variable in an enhanced `for` loop, `for (var item : items)`, and the index in a basic `for` loop, `for (var i = 0; i < n; i++)`
- resources in try-with-resources, `try (var in = new FileInputStream(path))`
- lambda parameters, since Java 11, so they can carry annotations: `(@NonNull var x, var y) -> x + y`

It is **not** allowed for fields, method parameters, method return types, or `catch` parameters. Those form part of a class's contract with other code, and Java's designers wanted them written explicitly. Each of these also fails to compile:

| Code | Compiler's reason |
|---|---|
| `var a;` | cannot use 'var' on variable without initializer |
| `var b = null;` | variable initializer is 'null' — `null` has no useful type |
| `var c = {1, 2, 3};` | array initializer needs an explicit target-type; write `var c = new int[] {1, 2, 3};` |
| `var d = () -> 42;` | lambda expression needs an explicit target-type |
| `var e = 1, f = 2;` | 'var' is not allowed in a compound declaration |

`var` is a **reserved type name**, not a keyword. You cannot name a class `var`, but existing code that used `var` as a variable or method name still compiles — a deliberate choice so that Java 10 did not break old programs.

### What exactly is inferred

The inferred type is the **static type of the initialiser expression**, which is not always what you intend:

- `var list = new ArrayList<String>();` infers `ArrayList<String>`, not `List<String>`. Usually harmless inside a method, but you lose the habit of programming to the interface.
- `var items = new ArrayList<>();` combines `var` with the diamond and gives the compiler nothing to infer the element type from, so it becomes `ArrayList<Object>`. A later `String first = items.get(0);` then fails with `incompatible types: Object cannot be converted to String`. When using `var`, put the type argument on the right: `new ArrayList<String>()`.
- `var widened = 'A' + 1;` is an `int` (66), because `char + int` is an `int` — promotion rules apply exactly as before.
- `var ratio = 1;` is an `int`; if you later assign `0.5`, it fails. Literals need the right form: `1.0`, `1L`, `1f`.

### When to use it

`var` improves code when the type is obvious from the right-hand side — a constructor call, a cast, a literal, or a well-named factory method — and when the full type is long and noisy, such as nested generics and iterator or entry types. It hurts when the initialiser hides the type:

```java
var result = service.process(request);   // what is result? a reader cannot tell
```

Here the explicit type documents something the reader needs. The guidance from the OpenJDK team is to choose variable names that carry the meaning, keep the scope of `var` variables small, and use explicit types where they help a reader. Many teams adopt a simple rule: `var` when the type appears on the same line, explicit types otherwise.

## How it works internally

When a method is called, the JVM creates a **stack frame** for it on the calling thread's stack. The frame contains an array of **local-variable slots**. A primitive local lives directly in its slot: an `int`, `float`, `char`, `short`, `byte` or `boolean` takes one 32-bit slot, and a `long` or `double` takes two. A reference local also takes one slot, and holds the reference — effectively the object's address, often compressed to 32 bits on 64-bit JVMs with heaps under about 32 GB.

Objects themselves, including arrays and strings, are allocated on the **heap**, a memory area shared by all threads and managed by the **garbage collector**, which reclaims objects that no longer have any reference leading to them. When a method returns, its frame and every local slot disappear instantly — but the objects those slots referred to stay on the heap until nothing references them. The stack-versus-heap picture is developed in [[c2-stack-vs-heap]], and garbage collection in [[c2-garbage-collection]].

That explains the costs of choosing a wrapper over a primitive. On a 64-bit HotSpot JVM with default settings (Java 21), every object carries a header of about 12 bytes and is padded to a multiple of 8 bytes. A plain `int` is 4 bytes; an `Integer` object is 16 bytes, plus a 4-byte reference to it.

| Storage | Approximate memory for 1,000 values |
|---|---|
| `int[1000]` | 16-byte array header + 4,000 bytes ≈ 4 KB |
| `Integer[1000]` (distinct values) | 4 KB of references + 1,000 × 16-byte objects ≈ 20 KB |

The boxed version is about five times larger, and reading each value means following a reference to a different part of memory, which is slower for the CPU cache. This is why performance-sensitive code, such as numeric processing or the inner loops of algorithms, uses primitive arrays, and why the JDK offers `IntStream` alongside `Stream<Integer>`. The JIT compiler can sometimes avoid allocating short-lived objects altogether (escape analysis, covered in [[c2-escape-analysis]]), but it is not something to rely on for large collections.

The compiler, not the JVM, enforces most of the rules in this lesson. Static types, definite assignment, `final`, and `var` inference are all checked by `javac` and leave little trace in the bytecode. Only reference downcasts are checked at run time, by a `checkcast` instruction that throws `ClassCastException` when the object's real class does not match.

## Worked example: an order summary

This program combines the ideas from every section: `long` for money in cents, `int` for counts, mixed `int`–`long` arithmetic, a cast to keep a fraction, integer division used deliberately, `var`, and aliasing through an interface type.

```java title="OrderSummary.java"
import java.util.ArrayList;
import java.util.List;

public class OrderSummary {

    record LineItem(String name, int quantity, long unitPriceCents) {}

    public static void main(String[] args) {
        var items = new ArrayList<LineItem>();
        items.add(new LineItem("Notebook", 3, 450));
        items.add(new LineItem("Pen", 10, 120));
        items.add(new LineItem("Backpack", 1, 3_999));

        long totalCents = 0;               // long: totals can exceed int range at scale
        int totalUnits = 0;
        for (var item : items) {
            totalCents += item.quantity() * item.unitPriceCents();   // int * long -> long
            totalUnits += item.quantity();
        }

        double averageCents = (double) totalCents / totalUnits;     // cast before dividing
        long roundedAverage = Math.round(averageCents);
        int discountPercent = 15;
        long discountCents = totalCents * discountPercent / 100;     // integer division: floor

        System.out.println("Items:          " + items.size());
        System.out.println("Units:          " + totalUnits);
        System.out.println("Total (cents):  " + totalCents);
        System.out.println("Average/unit:   " + averageCents);
        System.out.println("Rounded avg:    " + roundedAverage);
        System.out.println("Wrong average:  " + totalCents / totalUnits);
        System.out.println("Discount:       " + discountCents);
        System.out.printf("Total:          $%d.%02d%n", totalCents / 100, totalCents % 100);

        List<LineItem> view = items;       // same list, seen through an interface type
        view.remove(1);
        System.out.println("After removal:  " + items.size() + " items");
    }
}
```

```output
Items:          3
Units:          14
Total (cents):  6549
Average/unit:   467.7857142857143
Rounded avg:    468
Wrong average:  467
Discount:       982
Total:          $65.49
After removal:  2 items
```

Step by step:

1. `record LineItem(...)` declares a small immutable class with three components; each `LineItem` is an object on the heap, and the list holds references to them.
2. `var items` is inferred as `ArrayList<LineItem>` because the type argument is written on the right.
3. Inside the loop, `item.quantity() * item.unitPriceCents()` multiplies an `int` by a `long`. Promotion widens the `int` to `long`, so the product cannot overflow `int`: 1,350 + 1,200 + 3,999 = 6,549 cents.
4. `(double) totalCents / totalUnits` casts first, so the division happens in `double` and keeps the fraction. The "Wrong average" line divides two integers and silently drops `.7857...`.
5. `totalCents * discountPercent / 100` is 98,235 / 100 in `long` arithmetic, which truncates to 982 cents. That rounding rule — always down — is a business decision; with `long` cents it is explicit and exact, which is why money is not stored in `double`.
6. `%02d` in `printf` pads the cents to two digits, turning 6,549 cents into `$65.49`.
7. `view = items` copies a reference. Removing through `view` changes the one list both variables refer to.

## In real systems

**Money and identifiers.** Payment systems store amounts as `long` minor units or `BigDecimal`, never `double`. Database `BIGINT` primary keys map to Java `long`, and `System.currentTimeMillis()` returns a `long` because the number of milliseconds since 1970 passed the `int` limit within the first month.

**Overflow incidents are real.** The `int` midpoint overflow in binary search shipped in the JDK itself for years (see [[a3-binary-search]]). Services that count bytes, requests or money in `int` eventually wrap; using `long` for counters and `Math.addExact` where overflow would be a bug is standard defensive practice.

**Nullability is a design concern.** `NullPointerException` remains one of the most common production errors. Teams reduce it by preferring primitives where a value is always present, returning `Optional` instead of `null`, validating inputs at the boundary of a system, and using nullability annotations checked by static-analysis tools.

**Boxing costs show up at scale.** A `Map<Long, Long>` holding ten million entries allocates tens of millions of objects. Profiles of memory-hungry services often show wrapper objects near the top, and specialised primitive collections (from libraries such as Eclipse Collections or fastutil) exist to avoid them.

**`var` in codebases.** Most modern Java style guides allow `var` for local variables where the type is evident, and some teams enforce consistency with automated checks in code review.

## Trade-offs and alternatives

| Choice | Prefer it when | Watch out for |
|---|---|---|
| `int` | Counts, indices, small quantities | Overflow past about 2.1 billion |
| `long` | Timestamps, IDs, money in cents, totals | Remember the `L` suffix on literals |
| `double` | Measurements, statistics, science | Rounding error; never use `==`; never for money |
| `BigDecimal` | Exact decimal money and rates | Slower, immutable, verbose; construct from strings |
| `BigInteger` | Integers beyond 64 bits (cryptography, combinatorics) | Much slower than `long` |
| Primitive | Value always present; performance matters | Cannot be `null`; cannot go in collections directly |
| Wrapper | Collections, generics, "no value" must be representable | Memory overhead, unboxing `NullPointerException`, `==` traps |
| Explicit type | Type is not obvious from the initialiser | Verbosity with long generic types |
| `var` | Type is obvious on the same line | Hides types when overused; diamond gives `Object` |

Static typing as a whole is a trade-off too: more annotations to write than a dynamic language, in exchange for errors caught early and tooling that understands the code. Java has gradually reduced the writing cost — diamond in Java 7, lambdas in Java 8, `var` in Java 10, records in Java 16 — without giving up the checking.

## Common mistakes

> [!MISTAKE] Overflow before widening
> `long nanos = seconds * 1_000_000_000;` overflows when `seconds` is an `int` larger than 2, because the multiplication is done in `int`. Make one operand `long` before the operation: `seconds * 1_000_000_000L`.

**Integer division by accident.** `double ratio = passed / total;` with two `int`s gives `0.0` whenever `passed < total`. Cast an operand first: `(double) passed / total`.

**Comparing floating-point values with `==`.** Accumulated rounding means `0.1 + 0.2 == 0.3` is `false`. Compare with a tolerance, or use `BigDecimal` with `compareTo` when exact decimals are required.

**Expecting a cast to round.** `(int) 2.99` is `2`. Use `Math.round` (or `Math.floor` / `Math.ceil`) and choose the rounding rule deliberately.

**Leading zeros.** `int month = 08;` does not compile, because `8` is not an octal digit, and `int month = 07;` happens to work only because 7 means the same in octal and decimal. Never write leading zeros on numeric literals.

**Using `==` to compare objects.** `==` compares references. Use `equals` for contents, especially for `String` and wrapper types.

**Assuming a method cannot change your object.** Passing a list to a method passes a copy of the reference, so the method can modify the list. If it must not, pass an unmodifiable view (`List.copyOf(list)` or `Collections.unmodifiableList(list)`).

**Expecting reassignment inside a method to affect the caller.** Assigning a new object to a parameter only changes the method's local copy of the reference. Return the new object instead.

**`var` with the diamond.** `var map = new HashMap<>();` is a `HashMap<Object, Object>`. Write the type arguments: `new HashMap<String, Integer>()`.

## Interview perspective

Interviewers use this topic to check precision. Vague answers ("Java passes objects by reference") are a red flag; exact ones stand out.

> [!INTERVIEW] Is Java pass-by-value or pass-by-reference?
> "Always pass-by-value. For primitives the value is the number itself. For objects the value is the reference, so the method gets a copy of the reference: it can call methods that modify the shared object, but reassigning the parameter doesn't affect the caller's variable. A swap method that swaps two parameters therefore has no effect on the caller."

Other questions to prepare:

- **Name the eight primitive types and their sizes.** `byte` 8, `short` 16, `char` 16 (unsigned), `int` 32, `float` 32, `long` 64, `double` 64; `boolean`'s size is not specified.
- **What does `Integer.MAX_VALUE + 1` evaluate to?** `Integer.MIN_VALUE`, because integer arithmetic wraps silently. Mention `Math.addExact` for detection.
- **Why does `0.1 + 0.2` print `0.30000000000000004`?** Binary floating point cannot represent 0.1 exactly; the tiny errors become visible in the sum. Use `BigDecimal` for exact decimals.
- **What does `(byte) 200` give, and why?** −56: narrowing keeps the low 8 bits, and `11001000` as a signed byte is −56.
- **Why does `byte b = 10; b = b + 1;` fail but `b += 1` compile?** `b + 1` is promoted to `int`; compound assignment includes an implicit cast back to `byte`.
- **What is the difference between `int` and `Integer`?** Primitive value versus object wrapper: `Integer` can be `null`, can be used in collections, costs more memory, and `==` on two `Integer`s compares references.
- **Does `var` make Java dynamically typed?** No; the type is inferred once at compile time and never changes. It is limited to local variables with initialisers.
- **When does a reference cast fail?** At run time with `ClassCastException` if the object is not an instance of the target type; at compile time if the types are provably unrelated.

## Practice

1. **Overflow hunt.** Compute the number of milliseconds in 30 days using only `int` variables and print it. Then fix it. Then rewrite it with `Math.multiplyExact` and confirm it throws for 30 days with `int` arguments.
2. **Average calculator.** Given `int[] scores = {90, 85, 77, 68}`, print the average as a `double` with full precision and rounded to the nearest whole number. Write the version with the integer-division bug first and explain its output.
3. **Cast predictions.** Before running, write down what each prints: `(int) 'z'`, `(char) 98`, `(short) 70_000`, `(int) -0.9`, `(long) 1e19`, `(int) Float.POSITIVE_INFINITY`. Then run them and explain every difference from your prediction.
4. **Aliasing.** Write a method `void addBonus(int[] salaries, int bonus)` that adds `bonus` to each element, and another `void resetSalaries(int[] salaries)` that does `salaries = new int[salaries.length]`. Call both and explain which changes the caller sees.
5. **Money.** Total a list of prices `19.99`, `5.01` and `0.10` three ways — with `double`, with `long` cents, and with `BigDecimal` built from strings — and compare the outputs.
6. **`var` refactor.** Take a method with five explicit local declarations and convert it to `var` where it helps. Leave at least one explicit type where `var` would hide information, and write a sentence explaining why.

## Quick revision {#quick-revision}

- Java is statically typed: every variable and expression has a compile-time type.
- Eight primitives hold values directly: `byte` 8, `short` 16, `char` 16 unsigned, `int` 32, `float` 32, `long` 64, `double` 64 bits; `boolean` size unspecified.
- Literals: whole numbers are `int`, decimals are `double`; use `L` for `long` and `f` for `float`; a leading `0` means octal; underscores are allowed between digits.
- Locals must be definitely assigned before use; fields and array elements default to `0`, `false`, `'\u0000'` or `null`.
- Integer overflow wraps silently; the operand types decide the arithmetic type. Use `Math.addExact` / `multiplyExact` to detect it, `BigInteger` beyond `long`.
- Integer division truncates toward zero; `%` takes the sign of the left operand; integer `/ 0` throws, floating-point `/ 0` gives `Infinity` or `NaN`.
- Floating point is binary and approximate: never `==`, never money. Use `long` cents or `BigDecimal` from strings.
- Reference variables hold references to heap objects; assignment copies the reference (aliasing); `==` compares identity, `equals` compares contents; `null` dereference throws `NullPointerException`.
- Java is always pass-by-value; for objects, the value is the reference.
- Widening is automatic (`byte → short → int → long → float → double`, `char → int`), but `long`/`int` to `float`/`double` can lose precision.
- Narrowing needs a cast: floating point to integer truncates and saturates (`NaN` → 0); integer to smaller integer keeps the low bits.
- `byte`/`short`/`char` promote to `int` in arithmetic; compound assignment (`+=`) includes a hidden narrowing cast.
- Upcasts are automatic; downcasts are checked at run time (`ClassCastException`); use `instanceof` patterns (Java 16+).
- `String` ↔ number is parsing (`Integer.parseInt`), not casting.
- `var` (Java 10+): local variables with initialisers, loop variables, try-with-resources, lambda parameters (Java 11+). Not fields, parameters, return types, `null`, array initialisers, lambdas, or compound declarations. `var` + diamond gives `Object` type arguments.

## Key takeaways {#key-takeaways}

- A primitive variable holds its value; a reference variable holds a reference to an object on the heap. Assignment, `==`, `null` and method calls all follow from that difference.
- Every arithmetic expression has a type decided by its operands, and integer arithmetic wraps silently on overflow — choose `long` early and widen before multiplying.
- Floating-point numbers are binary approximations: compare with a tolerance and never use them for money.
- Widening is automatic but can lose precision; narrowing needs a cast and can silently change the value, so cast only when you know the value fits.
- Java passes everything by value — for objects, a copy of the reference — so methods can change a shared object but cannot rebind the caller's variable.
- `var` saves writing without changing Java's static typing; use it when the type is obvious from the line itself.
