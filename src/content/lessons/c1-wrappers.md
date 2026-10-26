---
summary: Every Java primitive has a wrapper class that represents the same value as an object, so it can live in collections, be null, and carry utility methods. You will learn what the eight wrappers offer, how the compiler converts automatically between primitives and wrappers, why that conversion can throw NullPointerException or slow a loop down, and why == on two Integers is true for 127 and false for 128.
difficulty: beginner
minutes: 55
objectives:
  - Explain why wrapper classes exist and use their parsing, conversion and comparison methods correctly
  - Identify every place the compiler inserts autoboxing and unboxing, and predict the result of mixed primitive and wrapper expressions
  - Diagnose NullPointerExceptions caused by unboxing, including the conditional-operator trap
  - Explain the Integer cache, predict == results on boxed values, and compare wrappers correctly
  - Decide when to use a primitive and when to use a wrapper, considering nullability, memory and performance
---

## Introduction

Java has two families of types. **Primitives** — `int`, `double`, `boolean` and five others — hold plain values directly and are fast and compact. **Objects** carry methods, can be `null`, and are what most of the Java library is built to work with. The two families do not mix freely. A `List` can only hold objects, so `List<int>` does not compile. A database column that allows "no value" cannot be represented by an `int`, which always holds some number. And a primitive has no methods, so there is nowhere to put useful operations such as "parse this text as a number".

**Wrapper classes** bridge the gap. For each primitive there is a class — `Integer` for `int`, `Double` for `double`, `Boolean` for `boolean`, and so on — whose objects each hold one primitive value. `Integer.valueOf(42)` is an object containing 42. It can go into a `List<Integer>`, be stored as a map value, be `null`, and its class provides methods such as `Integer.parseInt` and constants such as `Integer.MAX_VALUE`.

Since Java 5, the compiler converts between primitives and wrappers automatically, which is called **autoboxing** and **unboxing**. You can write `list.add(5)` and `int x = list.get(0)` as if the types were the same. That convenience hides real behaviour: an object allocation, a method call, and the possibility of a `NullPointerException` on a line with no visible method call. It also hides the **Integer cache**, which makes `==` between two `Integer` objects give different answers for different numbers.

This lesson covers the wrapper classes themselves, then autoboxing and unboxing, then the Integer cache.

## Before you start

You need:

- **Primitive types** — the eight primitives, their ranges and widening rules. See [[c1-primitives]] and [[c1-type-casting]].
- **Reference types** — references, `null`, and the difference between `==` and `equals`. See [[c1-reference-types]].
- **Strings** — wrappers convert to and from text, and the `String` pool is a close cousin of the Integer cache. See [[c1-strings]].
- **Methods and overloading** — boxing changes which overload is chosen. See [[c1-method-overloading]].

## The intuition

Think of a wrapper as a small labelled box with exactly one value inside. A primitive `int` is the number itself, held in your hand. An `Integer` is a box containing that number. Boxes can be put on shelves designed for boxes (collections), a shelf slot can be empty (`null`), and the box has instructions printed on its side (methods). But to do arithmetic you must take the number out of the box, and an empty slot has no number to take out.

Two more properties follow from the picture. Boxes are **sealed**: you cannot change the number inside an existing `Integer`; "changing" it means getting a different box. And two boxes holding the same number are still two boxes. Asking "are these the same box?" (`==`) is a different question from "do these boxes hold the same number?" (`equals`). For some small numbers the JVM hands out the same pre-made box every time, which is what makes the first question so confusing.

## The eight wrapper classes

| Primitive | Wrapper | Extends `Number` | Cached by `valueOf` |
|---|---|---|---|
| `byte` | `Byte` | Yes | All 256 values |
| `short` | `Short` | Yes | -128 to 127 |
| `int` | `Integer` | Yes | -128 to 127 (upper bound configurable) |
| `long` | `Long` | Yes | -128 to 127 |
| `float` | `Float` | Yes | None |
| `double` | `Double` | Yes | None |
| `char` | `Character` | No | 0 to 127 |
| `boolean` | `Boolean` | No | `TRUE` and `FALSE` |

All eight live in `java.lang`, so no import is needed. Two names differ from their primitive: `Integer` (not `Int`) and `Character` (not `Char`). The six numeric wrappers extend the abstract class **`Number`**, which declares `intValue()`, `longValue()`, `doubleValue()` and friends, so code can accept "any number" as a `Number`. All wrappers implement `Comparable`, so lists of them sort naturally.

Every wrapper is **immutable** and `final`. An `Integer` holding 5 holds 5 forever, which makes wrappers safe to share and safe as `HashMap` keys. Since Java 16 they are also documented as **value-based classes**: objects that should be treated as just their value, whose identity you must not rely on. That rule is the theme of the Integer cache section.

### Creating wrapper objects and converting text

```java title="WrapperBasics.java"
import java.util.ArrayList;
import java.util.List;

public class WrapperBasics {
    public static void main(String[] args) {
        Integer boxed = Integer.valueOf(42);        // preferred factory
        int raw = boxed.intValue();                 // explicit unboxing
        Integer missing = null;                     // a wrapper can be null; an int cannot
        System.out.println(boxed + " " + raw + " " + missing);

        List<Integer> scores = new ArrayList<>();   // List<int> would not compile
        scores.add(Integer.valueOf(90));
        System.out.println(scores);

        int parsed = Integer.parseInt("1234");      // String -> int
        Integer parsedBoxed = Integer.valueOf("1234");   // String -> Integer
        System.out.println(parsed + 1 + " " + parsedBoxed);
        System.out.println(Integer.parseInt("ff", 16) + " " + Integer.parseInt("-101", 2));
        System.out.println(Integer.toString(255, 16) + " " + Integer.toBinaryString(10)
                + " " + Integer.toHexString(-1));
        System.out.println(Integer.MAX_VALUE + " " + Integer.MIN_VALUE + " " + Integer.SIZE + " bits");
        System.out.println(Long.MAX_VALUE);
        System.out.println(Double.MIN_VALUE + " " + Double.MAX_VALUE);
        System.out.println(Integer.compare(3, 7) + " " + Integer.max(3, 7) + " " + Integer.signum(-12));

        try {
            Integer.parseInt("12a");
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
        }
        try {
            Integer.parseInt("3000000000");          // too big for int
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
        }
        System.out.println(Boolean.parseBoolean("TRUE") + " " + Boolean.parseBoolean("yes"));
        System.out.println(Character.isDigit('7') + " " + Character.isLetter('é')
                + " " + Character.toUpperCase('q') + " " + Character.getNumericValue('7'));
    }
}
```

```output
42 42 null
[90]
1235 1234
255 -5
ff 1010 ffffffff
2147483647 -2147483648 32 bits
9223372036854775807
4.9E-324 1.7976931348623157E308
-1 7 -1
For input string: "12a"
For input string: "3000000000"
true false
true true Q 7
```

**Creating.** Use `Integer.valueOf(42)`, or let autoboxing call it for you. The constructors such as `new Integer(42)` were deprecated in Java 9 and marked for removal in Java 16: they always allocate a new object, while `valueOf` can return a cached one, and keeping the constructors would block future JVM optimisations of value-based classes.

**Parsing.** Each numeric wrapper has a pair of parsing methods that differ only in what they return. `Integer.parseInt(String)` returns a primitive `int`; `Integer.valueOf(String)` returns an `Integer`. Pick the one that matches what you store, to avoid a needless box-and-unbox. Both accept an optional **radix** (base), so `parseInt("ff", 16)` is 255. Text that is not a valid number in range — including `"12a"`, `""`, `" 12"` with a leading space, and `"3000000000"`, which exceeds `int` — throws the unchecked **`NumberFormatException`**. Any code that parses user or file input must handle it. The `Boolean.parseBoolean` method is the exception to strictness: it returns `true` only for `"true"` in any case, and `false` for everything else, including `"yes"` and `null`, without throwing.

**Formatting.** `Integer.toString(255, 16)`, `toBinaryString` and `toHexString` convert numbers to text in other bases. `toHexString(-1)` prints `ffffffff`, showing the two's-complement bit pattern ([[c1-bitwise-operators]]).

**Constants.** `MIN_VALUE`, `MAX_VALUE`, `SIZE` (bits) and `BYTES` describe each type's range. One name misleads: `Double.MIN_VALUE` is the smallest *positive* `double` (about 4.9 × 10⁻³²⁴), not the most negative one, which is `-Double.MAX_VALUE`.

**Static helpers.** `Integer.compare(a, b)`, `Integer.max`, `Integer.sum` and `Integer.signum` work on primitives and are handy as method references (`Integer::sum`, `Integer::compare`). Since Java 8 there are also unsigned helpers such as `Integer.parseUnsignedInt` and `Integer.toUnsignedString` for treating an `int`'s bits as a value from 0 to 2³² − 1. `Character` offers classification methods (`isDigit`, `isLetter`, `isWhitespace`) that understand all of Unicode, so `isLetter('é')` is `true`.

### equals on wrappers: same type and same value

`equals` on a wrapper returns `true` only if the other object is **the same wrapper class** holding the same value. It never converts between numeric types:

```java title="MixedEquals.java"
import java.util.HashMap;
import java.util.Map;

public class MixedEquals {
    public static void main(String[] args) {
        Long big = 1L;
        Integer small = 1;
        System.out.println(big.equals(small));        // different classes: false
        System.out.println(big.equals(1));            // 1 boxes to Integer: false
        System.out.println(big.equals(1L));           // true
        System.out.println(big == 1);                 // unboxes and compares numbers: true

        Map<Long, String> users = new HashMap<>();
        users.put(7L, "Ada");
        System.out.println(users.get(7));             // Integer key: never found
        System.out.println(users.get(7L));
    }
}
```

```output
false
false
true
true
null
Ada
```

`big.equals(1)` compiles because `equals` accepts any `Object`; the literal `1` is boxed to an `Integer`, which is not a `Long`, so the answer is `false`. The map lookup fails for the same reason: `users.get(7)` boxes `7` to `Integer`, and no `Integer` key equals a `Long` key. This bug appears in real code when entity IDs are `Long` and a lookup passes an `int`. The compiler accepts it because `Map.get` takes an `Object`. Write `7L`, or convert explicitly with `Long.valueOf(id)`.

### Floating-point wrappers bend two primitive rules

`Double.equals` and `Float.equals` compare bit patterns, which differs from the primitive `==` in two corner cases:

```java title="FloatOddities.java"
public class FloatOddities {
    public static void main(String[] args) {
        double nan = 0.0 / 0.0;
        System.out.println(nan == nan);                                    // primitive rule
        System.out.println(Double.valueOf(nan).equals(Double.valueOf(nan))); // wrapper rule
        System.out.println(Double.isNaN(nan));
        System.out.println(0.0 == -0.0);
        System.out.println(Double.valueOf(0.0).equals(-0.0));
        System.out.println(Double.compare(0.0, -0.0));
    }
}
```

```output
false
true
true
true
false
1
```

For primitives, NaN ("not a number") is unequal to everything, including itself, and `0.0 == -0.0` is `true`. The wrappers deliberately invert both: a boxed NaN equals itself, and `0.0` does not equal `-0.0`. The reason is collections. If NaN were not equal to itself, a `HashSet<Double>` could never find a NaN it contains, and `equals` would break its contract of being reflexive. `Double.compare` follows the wrapper rules and is what `Collections.sort` uses on a `List<Double>`. Use `Double.isNaN` to test for NaN rather than `==`.

```quiz
Q: What does `Long id = 5L; System.out.println(id.equals(5));` print?
- [ ] `true`, because both hold the value 5
- [x] `false`, because `5` is boxed to an `Integer`, and `Long.equals` requires another `Long`
- [ ] It does not compile
- [ ] It throws `ClassCastException`
> Wrapper `equals` checks the class first and never converts between numeric types. `equals(Object)` accepts anything, so the mistake compiles. Use `id.equals(5L)` or compare primitives with `id == 5`, which unboxes.

Q: Which call returns a primitive `int` rather than an `Integer`?
- [x] `Integer.parseInt("42")`
- [ ] `Integer.valueOf("42")`
- [ ] `Integer.valueOf(42)`
- [ ] `Integer.decode("42")`
> `parseXxx` methods return primitives; `valueOf` and `decode` return wrapper objects. Choosing the matching method avoids an unnecessary boxing or unboxing step.
```

## Autoboxing & Unboxing {#c1-autoboxing}

**Autoboxing** is the automatic conversion the compiler performs from a primitive to its wrapper — `int` to `Integer` — when a wrapper is needed. **Unboxing** is the reverse — `Integer` to `int` — when a primitive is needed. Both were added in Java 5, alongside generics, so that code like `List<Integer> list = …; list.add(5); int x = list.get(0);` reads naturally. Before Java 5 you had to write `list.add(Integer.valueOf(5))` and `((Integer) list.get(0)).intValue()` yourself.

Autoboxing is purely a compile-time rewrite. The compiler inserts calls to `Integer.valueOf(int)` for boxing and to `intValue()` (or `longValue()`, `doubleValue()` and so on) for unboxing, and the JVM runs those ordinary method calls. Nothing is converted "magically" at run time.

### Where conversions happen

```java title="Boxing.java"
import java.util.ArrayList;
import java.util.List;

public class Boxing {
    static int twice(int n) { return n * 2; }

    public static void main(String[] args) {
        Integer a = 10;                 // autoboxing: Integer.valueOf(10)
        int b = a;                      // unboxing: a.intValue()
        Integer c = a + b;              // unbox a, add, box the result
        System.out.println(a + " " + b + " " + c);

        List<Integer> list = new ArrayList<>();
        list.add(5);                    // boxing at the call
        int first = list.get(0);        // unboxing on assignment
        System.out.println(twice(list.get(0)) + " " + first);

        Integer counter = 0;
        counter++;                      // unbox, increment, box a NEW Integer
        System.out.println(counter);

        long widened = a;               // unbox to int, then widen to long
        System.out.println(widened);
        // Long l = 5;                  // does not compile: int cannot box to Long
        Long l = 5L;
        System.out.println(l);
    }
}
```

```output
10 10 20
10 5
1
10
5
```

The compiled bytecode for the first three lines makes the hidden calls visible (from `javap -c Boxing`; constant-pool numbers vary):

```output
         0: bipush        10
         2: invokestatic  #7                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
         5: astore_1
         6: aload_1
         7: invokevirtual #13                 // Method java/lang/Integer.intValue:()I
        10: istore_2
        11: aload_1
        12: invokevirtual #13                 // Method java/lang/Integer.intValue:()I
        15: iload_2
        16: iadd
        17: invokestatic  #7                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
        20: astore_3
```

`Integer a = 10` became `Integer.valueOf(10)`. `int b = a` became `a.intValue()`. And `Integer c = a + b` unboxes `a`, adds two `int`s with `iadd`, and boxes the sum again. Arithmetic never happens on wrapper objects; the compiler always unboxes first.

Conversions happen in these situations:

- **Assignment** between a primitive and its wrapper, in either direction.
- **Method arguments and return values**, including generic methods such as `list.add(5)` and `list.get(0)`.
- **Arithmetic and unary operators** (`+`, `*`, `++`, `-`), which unbox their operands; the result is boxed again if it is assigned to a wrapper. So `counter++` on an `Integer` creates a new `Integer` object — wrappers are immutable, so it cannot update the old one.
- **Relational operators** `<`, `<=`, `>`, `>=`, which always unbox.
- **Conditions**: `if (flag)` with a `Boolean` unboxes it.
- **`==` and `!=`**, which unbox *only if one side is a primitive*. If both sides are wrappers, they compare references. This rule is the subject of the next section.
- **`switch`** on an `Integer`, `Character` and the other wrappers of switchable primitives, which unboxes.

Boxing pairs each primitive with exactly one wrapper and does not widen first. `Long l = 5;` fails because `5` is an `int`, and an `int` can only box to `Integer`, which is not a `Long`. The other direction works: `long widened = a;` unboxes the `Integer` to `int` and then widens to `long`. When in doubt, write the literal with the right suffix (`5L`, `5.0`).

### Unboxing null throws NullPointerException

A wrapper variable can hold `null`, but a primitive cannot. When the compiler inserts `intValue()` on a reference that is `null`, the call throws **`NullPointerException`**, and the stack trace points at a line that may contain no visible method call or dot at all.

```java title="NullUnbox.java"
import java.util.HashMap;
import java.util.Map;

public class NullUnbox {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("apple", 3);

        Integer pears = stock.get("pear");            // null: fine, it is a reference
        System.out.println("pears = " + pears);

        try {
            int bananas = stock.get("banana");        // unboxing null
        } catch (NullPointerException e) {
            System.out.println("NPE when unboxing a missing value");
        }

        try {
            boolean inStock = true;
            Integer count = inStock ? stock.get("kiwi") : 0;   // whole expression is int!
            System.out.println(count);
        } catch (NullPointerException e) {
            System.out.println("NPE from the conditional operator");
        }

        Integer safe = stock.getOrDefault("kiwi", 0);
        System.out.println("kiwi = " + safe);
        stock.merge("apple", 1, Integer::sum);        // counting without null checks
        System.out.println(stock);
    }
}
```

```output
pears = null
NPE when unboxing a missing value
NPE from the conditional operator
kiwi = 0
{apple=4}
```

`Map.get` returns `null` for a missing key. Storing that in an `Integer` is fine; storing it in an `int` makes the compiler insert `.intValue()` on `null`. Since Java 14, **helpful NullPointerException messages** name the culprit, along the lines of *Cannot invoke "java.lang.Integer.intValue()" because the return value of "java.util.Map.get(Object)" is null*, which makes these bugs much quicker to diagnose.

The conditional-operator case is the subtle one, and it catches experienced developers. In `inStock ? stock.get("kiwi") : 0`, one branch is an `Integer` and the other an `int`. The language rules for the `?:` operator say that when one operand is a primitive numeric type and the other is its wrapper, the type of the *whole expression* is the primitive `int`. So the `Integer` branch is unboxed — and it is `null` — before the result is boxed again for assignment to `count`. The variable on the left being an `Integer` does not help. The fix is to make both branches wrappers (`Integer.valueOf(0)`) or, better, avoid the pattern with `getOrDefault`.

The last two lines show the idiomatic alternatives. `getOrDefault(key, 0)` never returns `null` for a missing key. `merge(key, 1, Integer::sum)` inserts `1` for a new key or adds `1` to the existing count, which is the standard way to count occurrences in a map without any null handling ([[c1-hashmap-internals]]).

### Boxing has a performance cost

Each boxing operation for a value outside the cache allocates a new object, and each unboxing follows a reference. In a hot loop that adds up:

```java title="SumCost.java"
public class SumCost {
    public static void main(String[] args) {
        int n = 50_000_000;

        long t0 = System.nanoTime();
        Long boxedSum = 0L;
        for (int i = 0; i < n; i++) {
            boxedSum += i;                   // unbox, add, box: a new Long almost every time
        }
        long t1 = System.nanoTime();

        long sum = 0L;
        for (int i = 0; i < n; i++) {
            sum += i;
        }
        long t2 = System.nanoTime();

        System.out.println(boxedSum + " with Long in " + (t1 - t0) / 1_000_000 + " ms");
        System.out.println(sum + " with long in " + (t2 - t1) / 1_000_000 + " ms");
    }
}
```

```output
1249999975000000 with Long in 127 ms
1249999975000000 with long in 31 ms
```

The single capital letter in `Long boxedSum` turns each `+=` into an unbox, an add, and a `Long.valueOf` that allocates a new object for every sum above 127. The exact timings vary by machine and JVM — the JIT compiler's **escape analysis** can sometimes remove allocations of short-lived boxes ([[c2-escape-analysis]]) — so treat the numbers as an illustration, not a benchmark. In this run the boxed loop was about four times slower; in less optimisable code, such as boxed values stored into a collection, the difference is usually larger, and the extra garbage adds work for the collector.

Memory is the other cost. On a 64-bit HotSpot JVM with default settings (Java 21), an `Integer` object takes 16 bytes and a `Long` 24, compared with 4 and 8 bytes for the primitives, plus a 4-byte reference wherever the object is stored. A `List<Integer>` of a million elements therefore uses roughly five times the memory of an `int[]` of the same length. This is why the JDK provides primitive specialisations such as `IntStream`, `mapToInt` and `IntFunction`, and why libraries for large numeric data offer primitive collections.

### Boxing and overload resolution

Boxing also affects which overloaded method a call selects. The compiler first looks for a match without boxing (allowing widening), then with boxing, then with varargs, as explained in [[c1-method-overloading]]. Two consequences matter in practice. A method `f(long)` beats `f(Integer)` for the call `f(5)`, because widening comes before boxing. And `List<Integer>.remove(1)` calls `remove(int index)`, not `remove(Object)`, so it removes the element at index 1 rather than the value 1; write `list.remove(Integer.valueOf(1))` to remove by value.

```quiz
Q: Why does `Integer count = flag ? map.get(key) : 0;` throw `NullPointerException` when `flag` is true and the key is missing?
- [ ] `map.get` throws for a missing key
- [ ] `Integer` variables cannot hold `null`
- [x] With an `Integer` branch and an `int` branch, the conditional expression has type `int`, so the `null` result of `map.get` is unboxed
- [ ] The `0` is boxed to a different object than expected
> The type of `?:` is decided by its operands, not by the variable it is assigned to. Mixing a wrapper with its primitive gives a primitive result, which forces unboxing of the `null`. Use `map.getOrDefault(key, 0)` or make both branches `Integer`.

Q: Which line does NOT compile?
- [ ] `Integer i = 5;`
- [ ] `long n = Integer.valueOf(5);`
- [x] `Long l = 5;`
- [ ] `double d = Integer.valueOf(5);`
> Boxing converts an `int` only to `Integer`; it never widens first, so `int` cannot become `Long`. Unboxing followed by widening is allowed, which is why the `long` and `double` assignments compile. Write `Long l = 5L;`.
```

## Integer Cache {#c1-integer-cache}

The **Integer cache** is a set of pre-created `Integer` objects for the values -128 to 127 that `Integer.valueOf` returns instead of allocating new ones. Because autoboxing calls `valueOf`, every boxed `int` in that range is one of these shared objects. Its purpose is to save memory and allocation for the small numbers programs use constantly — counters, indices, status codes, small quantities. Its side effect is that comparing two `Integer` objects with `==` appears to work for small values and fails for larger ones.

### Seeing it happen

```java title="Cache.java"
public class Cache {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println("127: " + (a == b));
        System.out.println("128: " + (c == d));
        System.out.println("128 equals: " + c.equals(d));

        Integer e = -128, f = -128;
        Integer g = -129, h = -129;
        System.out.println("-128: " + (e == f) + ", -129: " + (g == h));

        Long l1 = 100L, l2 = 100L;
        Character ch1 = 'z', ch2 = 'z';
        Boolean t1 = true, t2 = true;
        Double d1 = 1.0, d2 = 1.0;
        System.out.println("Long 100: " + (l1 == l2));
        System.out.println("Character 'z': " + (ch1 == ch2));
        System.out.println("Boolean: " + (t1 == t2));
        System.out.println("Double 1.0: " + (d1 == d2));
    }
}
```

```output
127: true
128: false
128 equals: true
-128: true, -129: false
Long 100: true
Character 'z': true
Boolean: true
Double 1.0: false
```

`Integer a = 127` compiles to `Integer.valueOf(127)`, which returns the cached object for 127, and so does `b`. Both variables refer to one object, so `a == b` is `true`. For 128, each `valueOf` call allocates a new `Integer`, so `c` and `d` are two objects holding the same value: `==` is `false` while `equals` is `true`. The boundary is the same at the negative end: -128 is cached, -129 is not.

The other wrappers behave similarly. `Byte`, `Short` and `Long` cache -128 to 127, `Character` caches 0 to 127 (the ASCII range, which includes `'z'`), and `Boolean.valueOf` always returns one of the two constants `Boolean.TRUE` and `Boolean.FALSE`. `Float` and `Double` have no cache — there is no small, finite set of "common" floating-point values — so even two boxed `1.0`s are different objects.

### Where the cache comes from

The Java Language Specification (section 5.1.7) requires that boxing a constant `int`, `short`, `byte` or `long` value between -128 and 127, a `char` from `'\u0000'` to `'\u007f'`, or `true`/`false` always produces the identical object. OpenJDK implements this in `Integer.valueOf(int)`, roughly:

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

`IntegerCache` is a private nested class that fills an array of 256 `Integer` objects when first used. Because the check lives in `valueOf`, the cache applies to every route that goes through it — autoboxing, `Integer.valueOf(String)`, and collection code — whether or not the value came from a constant. `new Integer(127)` bypasses the cache and always creates a distinct object, which is one reason the constructor is deprecated.

### The upper bound is configurable

On HotSpot, the upper limit for `Integer` (only) can be raised with the JVM option `-XX:AutoBoxCacheMax=<n>`:

```java title="CacheMax.java"
public class CacheMax {
    public static void main(String[] args) {
        Integer x = 1000, y = 1000;
        System.out.println("1000 == 1000: " + (x == y));
    }
}
```

```output
$ java CacheMax
1000 == 1000: false
$ java -XX:AutoBoxCacheMax=1000 CacheMax
1000 == 1000: true
```

The same program gives a different answer depending on a command-line flag. That is the strongest possible argument for never relying on the cache for correctness: the boundary at 127 is a guaranteed minimum, not a fixed fact, and code that "works" with `==` on one deployment can fail on another. The option exists for applications that box many values in a known range and want fewer allocations; it is rarely used.

### How the cache causes real bugs

The cache turns a wrong comparison into a bug that passes tests. Test data tends to use small numbers, and production data does not:

```java title="CacheTrap.java"
import java.util.List;

public class CacheTrap {
    record Order(Integer id, Integer quantity) {}

    static boolean sameQuantity(Order a, Order b) {
        return a.quantity() == b.quantity();          // BUG: compares references
    }

    static boolean sameQuantityFixed(Order a, Order b) {
        return a.quantity().equals(b.quantity());
    }

    public static void main(String[] args) {
        List<Order> small = List.of(new Order(1, 50), new Order(2, 50));
        List<Order> large = List.of(new Order(3, 500), new Order(4, 500));
        System.out.println(sameQuantity(small.get(0), small.get(1)));
        System.out.println(sameQuantity(large.get(0), large.get(1)));
        System.out.println(sameQuantityFixed(large.get(0), large.get(1)));
    }
}
```

```output
true
false
true
```

The buggy method passes for quantities of 50 and fails for 500. The same pattern appears with entity IDs of type `Long`: a check such as `order.getCustomerId() == customer.getId()` works in a test database where IDs are 1, 2 and 3, and breaks once real IDs exceed 127. Each fix is one of:

- **`a.equals(b)`** when `a` cannot be `null`.
- **`Objects.equals(a, b)`** when either may be `null` (two `null`s count as equal).
- **Unboxing explicitly**, `a.intValue() == b.intValue()`, or comparing with a primitive, which unboxes the wrapper; both throw if a value is `null`.
- **Using primitives** in the first place when `null` is not a meaningful value.

The same reasoning rules out using wrappers for their identity in any other way. Because they are value-based, synchronising on an `Integer` or `Boolean` is a serious bug: the "private" lock may be the cached object that unrelated code also locks on. Since Java 16, `javac` warns about synchronising on an instance of a value-based class.

> [!MISTAKE] Comparing wrappers with ==
> `==` between two `Integer`, `Long`, `Short`, `Byte` or `Character` objects compares references. Inside the cached range it happens to agree with `equals`; outside it, it usually does not. IntelliJ and static analysers such as SpotBugs flag this pattern. Use `equals`, `Objects.equals`, or primitives.

```quiz
Q: What do `Integer a = 100, b = 100;` and `Integer c = 200, d = 200;` give for `a == b` and `c == d` on a default JVM?
- [ ] `true`, `true`
- [x] `true`, `false`
- [ ] `false`, `false`
- [ ] `false`, `true`
> Autoboxing calls `Integer.valueOf`, which returns cached objects for -128 to 127, so `a` and `b` are the same object. 200 is outside the default cache, so `c` and `d` are separate objects and `==` compares their references. `equals` would be `true` in both cases.

Q: Why should `-XX:AutoBoxCacheMax` never be used to "fix" code that compares Integers with `==`?
- [ ] The option does not exist
- [ ] It slows down the JVM so much it is unusable
- [x] The comparison would still be wrong for values outside the new limit and would depend on how the JVM was launched
- [ ] It also changes the behaviour of `equals`
> Raising the limit only moves the boundary. Correctness would depend on a launch flag and on the data staying below the limit. The code itself must compare values with `equals` or primitives.
```

## How it works internally

A wrapper object is an ordinary heap object with a single `private final` field — `value` — holding the primitive. On a 64-bit HotSpot JVM with compressed references (the default for heaps under about 32 GB), the object header takes 12 bytes; an `Integer` adds a 4-byte `int` for 16 bytes total, while a `Long` or `Double` adds 8 bytes and is padded to 24. A variable or array slot that refers to it adds a 4-byte reference. The object layout is covered in [[c2-object-header]].

Autoboxing is resolved entirely by `javac`, as the bytecode above showed: boxing is an `invokestatic` of `valueOf`, and unboxing is an `invokevirtual` of `intValue` (or the matching `xxxValue`). The JVM has no special instructions for wrappers. That also explains the `NullPointerException`: unboxing is a virtual method call, and calling a method on `null` throws.

The caches are static arrays in private nested classes (`Integer.IntegerCache`, `Long.LongCache`, and so on), created during class initialisation. In recent JDKs the Integer cache can be archived in the Class Data Sharing (CDS) archive, so those objects are mapped in at JVM startup rather than created each time — a detail that does not change behaviour, but shows how central small boxed integers are to the JDK itself.

The JIT compiler can sometimes eliminate boxing in hot code. If a boxed value never escapes a method, escape analysis may replace the object with its primitive field, and HotSpot has specific optimisations for `valueOf`/`intValue` pairs. These optimisations are opportunistic; they are not a reason to box in performance-sensitive code.

Looking further ahead, OpenJDK's Project Valhalla is working on value classes and on letting generics work with primitive-like types, which could eventually remove much of the cost and the identity confusion described here. None of that is part of Java 21, so today's rules apply.

## Worked example: survey responses with missing ages

The program below parses survey lines in which the age may be missing or invalid. It uses `Integer` precisely where "no value" must be represented, primitives everywhere else, and compares wrappers safely.

```java title="Survey.java"
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

public class Survey {
    record Response(String name, Integer age) {}        // age may be unknown: null

    /** Returns the age, or null when the field is blank, not a number, or implausible. */
    static Integer parseAge(String field) {
        if (field.isBlank()) {
            return null;
        }
        try {
            int age = Integer.parseInt(field.strip());     // primitive: no object needed yet
            return age >= 0 && age <= 130 ? age : null;     // boxes only the valid result
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static List<Response> parse(List<String> lines) {
        List<Response> result = new ArrayList<>();
        for (String line : lines) {
            String[] parts = line.split(",", -1);         // keep an empty age field
            result.add(new Response(parts[0], parseAge(parts[1])));
        }
        return result;
    }

    public static void main(String[] args) {
        List<String> lines = List.of("alice,34", "bob,", "carol,abc", "dan, 41", "erin,34", "fay,150");
        List<Response> responses = parse(lines);

        long unknown = responses.stream().filter(r -> r.age() == null).count();
        double average = responses.stream()
                .map(Response::age)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)               // unbox once, then work on ints
                .average()
                .orElse(Double.NaN);

        Map<Integer, Integer> byDecade = new TreeMap<>();
        for (Response r : responses) {
            if (r.age() != null) {
                byDecade.merge(r.age() / 10 * 10, 1, Integer::sum);
            }
        }

        Response first = responses.get(0), fifth = responses.get(4);
        System.out.println(responses);
        System.out.println("unknown ages: " + unknown);
        System.out.printf("average known age: %.2f%n", average);
        System.out.println("by decade: " + byDecade);
        System.out.println("alice and erin same age: " + Objects.equals(first.age(), fifth.age()));
    }
}
```

```output
[Response[name=alice, age=34], Response[name=bob, age=null], Response[name=carol, age=null], Response[name=dan, age=41], Response[name=erin, age=34], Response[name=fay, age=null]]
unknown ages: 3
average known age: 36.33
by decade: {30=2, 40=1}
alice and erin same age: true
```

The `Response` record declares `age` as `Integer` because "unknown" is a real state that an `int` cannot express. Using `0` for unknown would silently drag the average down and make a newborn indistinguishable from a missing answer.

`parseAge` is careful about where boxing happens. It parses with `parseInt`, which returns a primitive, so the range check runs on a plain `int`. Only the final result is boxed. Its conditional expression, `age >= 0 && age <= 130 ? age : null`, mixes an `int` with the `null` literal; unlike the `int`-and-`Integer` case from the autoboxing section, this gives the whole expression the type `Integer`, so the `null` branch is safe. Blank, non-numeric and out-of-range input (`"bob,"`, `"carol,abc"`, `"fay,150"`) all become `null`, and `" 41"` is accepted because the field is stripped before parsing — `parseInt` itself rejects surrounding spaces. In a production system you might keep the reason for rejection instead of collapsing everything into `null`.

The statistics use a stream pipeline ([[c1-streams]]): they filter out the `null`s and then call `mapToInt(Integer::intValue)`, which unboxes each value exactly once into an `IntStream`; `average()` then works on primitives. The decade histogram uses `merge(key, 1, Integer::sum)`, which handles the first occurrence of a key without any null check. Finally, comparing two possibly-null ages uses `Objects.equals`, which is correct for any values and for `null`. Writing `first.age() == fifth.age()` would also print `true` here — but only because 34 is inside the Integer cache, which is exactly the trap this lesson warns about.

## In real systems

**Database entities.** JPA and Hibernate entities typically declare their ID as `Long` rather than `long`, because a `null` ID means "not yet saved". Nullable columns map to wrappers for the same reason. That puts wrappers into every layer of a typical Spring application, and with them the `==` trap on IDs. See [[c8-identifiers]].

**JSON and request binding.** When Jackson or Spring binds a request body or query parameter to a field of type `int`, a missing value silently becomes `0`; with `Integer`, it becomes `null`, so you can tell "not provided" from "zero" and validate accordingly with annotations such as `@NotNull`.

**Collections and streams.** All generic collections hold wrappers. Performance-sensitive code uses the primitive stream types (`IntStream`, `LongStream`, `DoubleStream`), primitive arrays, or third-party primitive collections (such as those in Eclipse Collections or fastutil) to avoid boxing millions of values.

**Configuration and parsing.** Reading numbers from environment variables, properties files and CSV data goes through `Integer.parseInt`, `Long.parseLong` and `Double.parseDouble`, and every one of those calls needs a plan for `NumberFormatException`.

**Code review checks.** Linters and IDE inspections flag `==` between wrappers, unboxing of possibly-null values, and boxed types used as accumulators in loops — the three wrapper bugs that reach production most often.

## Trade-offs and alternatives

| Choose | When | Watch out for |
|---|---|---|
| Primitive (`int`, `long`, `double`) | Locals, loop counters, arithmetic, arrays, fields that always have a value | Cannot express "missing"; default `0` can hide bugs |
| Wrapper (`Integer`, `Long`) | Collection elements, generic type arguments, nullable fields, entity IDs | `null` unboxing, `==` identity, memory and allocation |
| `OptionalInt` / `Optional<T>` | Method results that may be absent | Not meant for fields or collections |
| Primitive streams (`IntStream`) | Bulk numeric processing | Convert back with `boxed()` only when needed |
| `BigDecimal` / `BigInteger` | Money and arbitrary-precision arithmetic | Use `compareTo`, not `equals`, for numeric equality of `BigDecimal` |

The default should be primitives. Reach for a wrapper only when you need one of its three capabilities: being an object (for generics and collections), being `null`, or calling instance methods on it. Then treat the wrapper as a value: compare with `equals`, check for `null` before unboxing, and unbox once before heavy arithmetic.

## Common mistakes

**Comparing two wrappers with `==`.** Works inside the cache range and fails outside it. Use `equals`, `Objects.equals`, or primitives.

**Unboxing a possibly-null value.** `int n = map.get(key);`, `if (user.getActive())` with a `Boolean` field, and `total += order.getQuantity()` all throw when the value is `null`. Check for `null`, use `getOrDefault`, or change the field to a primitive if `null` is not meaningful.

> [!MISTAKE] Mixing a wrapper and a primitive in ?:
> `Integer x = cond ? maybeNullInteger : 0;` unboxes the wrapper because the expression's type is `int`. Make both branches wrappers or restructure the code.

**Wrapper accumulators.** `Long total = 0L;` or `Integer count = 0;` used with `+=` in a loop allocates on almost every iteration. Use `long` and `int` locals.

**Calling `equals` across wrapper types.** `Long.equals(Integer)` is always `false`, and `Map<Long, …>.get(intValue)` never finds anything. Match the types with literal suffixes or explicit conversion.

**Using the deprecated constructors.** `new Integer(5)` creates uncached objects and is marked for removal. Use `Integer.valueOf(5)` or autoboxing.

**`list.remove(int)` on a `List<Integer>`.** Removes by index. Use `remove(Integer.valueOf(x))` to remove a value.

**Ignoring `NumberFormatException`.** Parsing external input without handling the exception turns a typo in a config file into a crash at startup, or an HTTP 500 for a bad query parameter.

## Interview perspective

Wrapper questions test whether you know what the compiler does on your behalf.

> [!INTERVIEW] Why is `Integer a = 127, b = 127; a == b` true but the same with 128 false?
> "Autoboxing compiles to `Integer.valueOf`, and `valueOf` returns cached instances for -128 to 127 — the language spec requires that range. So both 127s are the same object, and `==`, which compares references for two objects, is true. 128 is outside the cache, so each boxing creates a new object and `==` is false. The fix is to compare with `equals` or unbox; the cache's upper bound is even configurable with `-XX:AutoBoxCacheMax`, so relying on it is never safe."

Questions to be ready for:

- **What are autoboxing and unboxing, and when were they added?** Compiler-inserted `valueOf` and `xxxValue()` calls, Java 5.
- **When does `==` unbox?** Only when one operand is a primitive; with two wrappers it compares references. `<` and `>` always unbox.
- **What is the difference between `parseInt` and `valueOf`?** Primitive result versus `Integer` result (possibly cached).
- **Which wrappers are cached?** `Byte`, `Short`, `Integer`, `Long` (-128 to 127), `Character` (0 to 127), `Boolean`; not `Float` or `Double`.
- **Why can unboxing throw `NullPointerException`?** Unboxing is a method call on the wrapper reference; if it is `null`, the call fails. Mention the conditional-operator case for extra credit.
- **Why might `Long` IDs compared with `==` pass tests and fail in production?** Test IDs are small and cached; real IDs are not.
- **What is the cost of `List<Integer>` versus `int[]`?** An object header and a reference per element, about five times the memory, plus allocation and pointer chasing.

## Practice

1. **Predict, then run.** For `Integer`, `Long` and `Double`, box the values 10 and 1000 twice each and print `==` and `equals`. Explain every result.
2. **Find the NPE.** Write three different lines that throw `NullPointerException` through unboxing (assignment, arithmetic, conditional operator), then fix each one.
3. **Safe parsing.** Write `OptionalInt parsePort(String s)` that accepts only integers from 1 to 65535, returns `OptionalInt.empty()` otherwise, and never throws.
4. **Counting.** Count word lengths in a sentence into a `Map<Integer, Integer>` using `merge`, then print the lengths in ascending order.
5. **Measure.** Sum the numbers from 1 to 100 million with `long` and with `Long`, then with a `List<Long>` and a `long[]`. Record the times and explain the differences, noting that timings vary.
6. **Code review.** Given `if (order.getCustomerId() == customer.getId())` where both return `Long`, explain the bug, when it would appear, and two correct fixes.

## Quick revision {#quick-revision}

- Wrappers: `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`. Immutable, `final`, value-based; numeric ones extend `Number`.
- Wrappers exist for generics and collections, for `null`, and for utility methods and constants.
- Create with `valueOf` or autoboxing; constructors deprecated (Java 9) and marked for removal (Java 16).
- `parseInt` → `int`, `valueOf` → `Integer`; invalid or out-of-range text throws `NumberFormatException`. `Boolean.parseBoolean` never throws.
- `equals` requires the same wrapper class: `Long.valueOf(1).equals(1)` is `false`. Boxed NaN equals itself; boxed `0.0` does not equal `-0.0`.
- Autoboxing = compiler-inserted `valueOf`; unboxing = `intValue()` etc. (Java 5).
- Conversions occur in assignments, arguments, returns, arithmetic, `<`/`>`, conditions, `switch`; `==` unboxes only if one side is primitive.
- Boxing never widens: `Long l = 5;` fails. Unbox-then-widen works: `long x = integerObj;`.
- Unboxing `null` → `NullPointerException`; `cond ? integerObj : 0` has type `int` and unboxes.
- Boxing costs: about 16 bytes per `Integer`, allocation outside the cache, slower loops.
- Integer cache: `valueOf` returns shared objects for -128 to 127 (JLS 5.1.7). `Byte`/`Short`/`Long` same range, `Character` 0–127, `Boolean` two constants, no cache for `Float`/`Double`.
- `-XX:AutoBoxCacheMax` raises the `Integer` upper bound — proof that `==` on wrappers is never safe.
- Compare wrappers with `equals`, `Objects.equals`, or primitives. Never synchronise on a wrapper.

## Key takeaways {#key-takeaways}

- A wrapper is an immutable object holding one primitive; use it only when you need an object, a `null`, or its methods, and use primitives everywhere else.
- Autoboxing and unboxing are method calls the compiler writes for you, so they can allocate objects and throw `NullPointerException` on lines that show no call.
- `==` between two wrappers compares identity; the Integer cache makes that look correct for small values, which is why the bug survives testing.
- Wrapper `equals` never converts between types, so `Long` and `Integer` with the same value are not equal — a common cause of failed map lookups.
- Unbox once and do numeric work on primitives; use primitive streams and arrays for large volumes of numbers.
- When "no value" is meaningful, a wrapper (or `Optional`) represents it honestly; when it is not, a primitive prevents an entire class of null bugs.
