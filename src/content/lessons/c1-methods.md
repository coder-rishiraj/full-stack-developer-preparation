---
summary: A method is a named, reusable block of code that takes inputs and can return a result. You will learn how to declare and call methods, exactly what Java copies when it passes arguments, how the compiler chooses between overloaded methods, where variables are visible, how recursion uses the call stack, and how varargs methods accept any number of arguments.
difficulty: beginner
minutes: 70
objectives:
  - Declare and call static methods with parameters and return values, and explain what makes up a method signature
  - Predict what a method can and cannot change in the caller's variables, using the rule that Java is always pass-by-value
  - Trace how the compiler picks an overloaded method through widening, boxing and varargs, and spot ambiguous calls
  - Determine the scope and lifetime of locals, parameters and fields, and explain why Java rejects shadowed locals
  - Write recursive methods with correct base cases, trace them on the call stack, and explain StackOverflowError
  - Use varargs correctly, including passing arrays and null, and recognise heap pollution with generic varargs
---

## Introduction

Imagine a program that formats prices in ten different places: the cart page, the receipt, the confirmation email and so on. If each place contains its own copy of the formatting code, a change to the rule — say, showing two decimal places instead of none — means finding and editing ten copies, and missing one means a bug. What you want is to write the formatting logic **once**, give it a name, and use that name wherever a price needs formatting.

That named, reusable block of code is a **method**. You give it inputs (the **parameters**), it runs its statements, and it can hand back a result (the **return value**). `Math.max(3, 9)` is a method call: the inputs are `3` and `9`, and the result is `9`. `System.out.println("hi")` is another: it takes one input and returns nothing, doing its work through a side effect, printing.

Methods are how Java programs are organised. Every statement you write lives inside one, starting with `main`. Splitting a program into small, well-named methods makes it readable (a call such as `applyDiscount(total, 15)` says *what* happens without showing *how*), testable (each method can be checked on its own), and changeable (a fix in one place applies everywhere). In real systems, a Spring controller handling an HTTP request, a repository fetching rows from a database, and a validator checking a form field are all methods.

This lesson covers how methods are declared and called, and then five topics that every Java developer must understand precisely: how parameters and return values work, method overloading, variable scope, recursion, and varargs.

## Before you start

You need:

- **Program structure** — classes, `main`, and how to compile and run a file. See [[c1-syntax]] and [[c1-main-method]].
- **Types** — primitives versus references, and what a reference variable holds. See [[c1-types]] and [[c1-reference-types]].
- **Control flow** — `if`, loops and blocks in braces. See [[c1-control-flow]].
- **Arrays** — used in several examples, and the basis of varargs. See [[c1-arrays]].

This lesson uses **static** methods — methods that belong to the class rather than to an object — so that every example runs from `main` without creating objects. Instance methods follow the same rules for parameters, overloading, scope and recursion; they are introduced with objects in [[c1-classes]].

## The intuition

Think of a method as a vending machine. It has a labelled slot for each input it accepts — "insert coins here", "press a button" — and a tray where the result appears. You do not need to know how the machine works inside to use it; you only need to know what to put in and what comes out. That description of inputs and output is the method's **contract**.

The analogy also captures the most important rule about inputs. When you insert a coin, the machine gets *that coin*; it cannot reach into your pocket. In Java, a method receives a **copy** of each argument's value and cannot reach back to change your variables. Where the analogy needs care is with objects: if you hand over a note with your locker number written on it, the machine gets a copy of the note, but it can still walk to your locker and rearrange what is inside. That distinction is the heart of the parameters section.

## Declaring and calling a method

A method declaration has a **header** and a **body**:

```java
static double area(double width, double height) {
    return width * height;
}
```

Reading the header from left to right: `static` is a **modifier** saying the method belongs to the class; other modifiers include access levels such as `public` and `private`. `double` is the **return type**, the type of the value the method hands back; `void` means it returns nothing. `area` is the **name**, by convention a verb or verb phrase in `camelCase` (`calculateTotal`, `isEmpty`, `sendEmail`). Inside the parentheses is the **parameter list**: zero or more declarations separated by commas, each with a type and a name. The body, in braces, contains the statements that run on each call.

A header can also end with a `throws` clause listing checked exceptions the method may throw (see [[c1-throw-throws]]). Here is a complete program with three methods and the calls that use them.

```java title="FirstMethods.java"
public class FirstMethods {
    static double area(double width, double height) {
        return width * height;
    }

    static void printBanner(String title) {
        String line = "=".repeat(title.length() + 4);
        System.out.println(line);
        System.out.println("| " + title + " |");
        System.out.println(line);
    }

    static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        double room = area(4.0, 3.5);
        System.out.println("Room area: " + room);
        printBanner("Report");
        System.out.println(isEven(10) + " " + isEven(7));
        System.out.println(area(2, 3));          // int arguments widen to double
    }
}
```

```output
Room area: 14.0
==========
| Report |
==========
true false
6.0
```

When `main` reaches `area(4.0, 3.5)`, execution jumps into `area` with `width` set to `4.0` and `height` set to `3.5`, runs its body, and comes back with the value `14.0`, which is stored in `room`. A call to a method that returns a value is an **expression**: it can appear anywhere a value of that type can, such as inside string concatenation or as an argument to another call. A call to a `void` method like `printBanner` is a statement on its own; writing `String s = printBanner("x");` does not compile because there is no value to assign.

The last line passes two `int` values to a method that takes `double` parameters. The compiler accepts this because `int` widens safely to `double` (see [[c1-type-casting]]), and the method receives `2.0` and `3.0`. The reverse — passing a `double` where an `int` is expected — is a compile error, because it could lose information.

Within the same class you call a static method by its name alone. From another class you prefix the class name: `FirstMethods.area(2, 3)`, just as you write `Math.max` or `Integer.parseInt`. Instance methods are called on an object, as in `title.length()`.

### What a method signature is

The **signature** of a method is its name plus the *types* of its parameters, in order. `area(double, double)` is the signature above. The return type, the parameter names and the `throws` clause are not part of it. The signature matters because a class cannot contain two methods with the same signature: that is how the compiler knows which method a call refers to. You will see the consequences in the overloading section.

## Parameters & Return {#c1-method-parameters}

Parameters are how information goes into a method; the return value is how a result comes out. Getting them right is what makes a method easy to use correctly and hard to use wrongly.

A **parameter** is a variable declared in the method header, such as `width`. An **argument** is the actual value supplied at the call, such as `4.0`. When a call happens, the JVM evaluates each argument expression from left to right and uses the results to initialise the parameters. Inside the method, parameters behave exactly like local variables that happen to start with the caller's values.

### Java is always pass-by-value

The rule that governs every call is short: **Java passes every argument by value.** The parameter receives a *copy* of the argument's value. For a primitive, the value is the number, character or boolean itself. For a reference type, the value is the **reference** — the information that locates the object — not the object. The program below shows all the consequences at once.

```java title="PassByValue.java"
import java.util.ArrayList;
import java.util.List;

public class PassByValue {
    static void increment(int n) {
        n++;                                  // changes the method's own copy
    }

    static void swap(int[] pair) {
        int tmp = pair[0];                    // works: changes the shared array's contents
        pair[0] = pair[1];
        pair[1] = tmp;
    }

    static void swap(String a, String b) {
        String tmp = a;                       // swaps the local copies only
        a = b;
        b = tmp;
    }

    static void addAndReplace(List<String> items) {
        items.add("added");                   // visible to the caller
        items = new ArrayList<>();            // invisible to the caller
        items.add("lost");
    }

    public static void main(String[] args) {
        int count = 5;
        increment(count);
        System.out.println("count = " + count);

        int[] pair = {1, 2};
        swap(pair);
        System.out.println("pair = " + pair[0] + ", " + pair[1]);

        String x = "left", y = "right";
        swap(x, y);
        System.out.println("x = " + x + ", y = " + y);

        List<String> items = new ArrayList<>(List.of("start"));
        addAndReplace(items);
        System.out.println("items = " + items);
    }
}
```

```output
count = 5
pair = 2, 1
x = left, y = right
items = [start, added]
```

`increment` gets a copy of the number `5` and increments its copy; the caller's `count` is untouched. `swap(int[] pair)` gets a copy of the reference to the array, follows it, and swaps the elements *inside* the one array both sides can reach, so the caller sees the swap. `swap(String a, String b)` gets copies of two references and exchanges the copies; the caller's `x` and `y` still point where they did. `addAndReplace` shows both effects in one method: `items.add("added")` modifies the shared list, but `items = new ArrayList<>()` only redirects the method's own copy of the reference, so `"lost"` goes into a list nobody else can see.

The summary to remember: **a method can change the state of an object you pass it, but it can never change which object, or which value, your variable holds.** People sometimes describe this as "objects are passed by reference". That phrase is wrong in a way that matters: under real pass-by-reference (as in C++ `int&` parameters or C# `ref`), the `swap(String, String)` method *would* swap the caller's variables. Java has no such mechanism. The memory-level picture behind this is in [[c1-reference-types]].

Since the caller's variables cannot be reassigned by a method, the only way for a method to send a result back is through its return value, by modifying an object the caller holds, or by changing a field. Of the three, the return value is the clearest, because it is visible at the call site.

> [!TIP] Treat parameters as read-only
> Reassigning a parameter inside a method (`n++`, `items = …`) is legal but confusing, because readers may think it affects the caller. Some teams mark parameters `final` to forbid it; others enforce it with a linter. Either way, introduce a new local variable when you need a changing value.

### Returning a value

A method with a non-`void` return type must end every possible path with `return expression;` where the expression's type is compatible with the return type — or throw an exception. The compiler checks this. If any path can reach the closing brace without returning, compilation fails:

```java title="Missing.java"
public class Missing {
    static String sign(int n) {
        if (n > 0) return "positive";
        else if (n < 0) return "negative";
    }
}
```

```output
Missing.java:5: error: missing return statement
    }
    ^
1 error
```

You can see that `n == 0` falls through without a value; the compiler sees it too. The fix is a final `return "zero";`.

`return` also ends the method immediately, which allows **early returns**: handle the unusual cases at the top and return, so the main logic is not buried in nested `if` blocks. In a `void` method, a bare `return;` ends the method early. Any statement directly after an unconditional `return` is unreachable, and the compiler rejects it.

A method returns exactly one value. When you need to return several related values, return one object that holds them. Since Java 16, a **record** is the cleanest way to do that, because it declares a small immutable data type in one line ([[c1-records]]). The program below also shows the two standard ways to signal a failure or a missing result: throwing an exception for invalid input, and returning an `Optional` when "nothing found" is a normal outcome.

```java title="Returns.java"
import java.util.List;
import java.util.Optional;

public class Returns {
    record MinMax(int min, int max) {}

    static MinMax minMax(int[] values) {
        int min = values[0], max = values[0];
        for (int v : values) {
            if (v < min) min = v;
            if (v > max) max = v;
        }
        return new MinMax(min, max);          // two results, one named, typed object
    }

    static String grade(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("score out of range: " + score);
        }
        if (score >= 90) return "A";          // returning early ends the method
        if (score >= 75) return "B";
        return "C";                           // every path must return a String
    }

    static Optional<String> findUser(List<String> users, String prefix) {
        for (String u : users) {
            if (u.startsWith(prefix)) {
                return Optional.of(u);
            }
        }
        return Optional.empty();              // "nothing found" without null
    }

    public static void main(String[] args) {
        MinMax mm = minMax(new int[] {4, -2, 9, 0});
        System.out.println(mm + " -> range " + (mm.max() - mm.min()));
        System.out.println(grade(93) + grade(80) + grade(12));
        List<String> users = List.of("alice", "bob", "carol");
        System.out.println(findUser(users, "ca").orElse("none"));
        System.out.println(findUser(users, "zz").orElse("none"));
    }
}
```

```output
MinMax[min=-2, max=9] -> range 11
ABC
carol
none
```

`minMax` returns a `MinMax` record instead of a two-element array. The array would work, but `result[0]` says nothing about which value is the minimum, while `mm.min()` does. `grade` validates its input first and **throws** for values outside the contract, rather than returning a made-up grade; a caller passing `150` has a bug, and an exception reports it at the source. `findUser` returns `Optional<String>`, which forces the caller to decide what happens when nobody matches. Returning `null` would also work but leaves the caller free to forget the check and fail later with a `NullPointerException`. See [[c1-optional]]. For methods that return collections, return an empty collection rather than `null` for "no results"; loops then handle the case with no special code.

### Argument evaluation order

Arguments are evaluated strictly left to right, before the method body starts. This matters when argument expressions have side effects:

```java title="Order.java"
public class Order {
    static int next(String label, int value) {
        System.out.println("evaluating " + label);
        return value;
    }

    static int combine(int a, int b, int c) {
        return a * 100 + b * 10 + c;
    }

    public static void main(String[] args) {
        System.out.println(combine(next("a", 1), next("b", 2), next("c", 3)));
    }
}
```

```output
evaluating a
evaluating b
evaluating c
123
```

Java guarantees this order; C and C++ do not, which is why code ported from them sometimes relies on it by accident. Even so, a call like `f(i++, i++)` is legal but hard to read. Keep side effects out of argument lists.

### Designing good parameter lists

Good methods take few parameters, ideally three or fewer. A call such as `createUser("Ada", "Lovelace", true, false, 3)` is unreadable because the booleans and numbers carry no names at the call site, and swapping two of them compiles silently. Common fixes are to group related values into a record (`createUser(new UserRequest(...))`), replace boolean flags with an enum, or split one method that does two things into two methods. Java has no named arguments and no default parameter values; overloading, covered next, is the usual way to offer defaults.

```quiz
Q: `static void grow(StringBuilder sb) { sb.append("!"); sb = new StringBuilder("new"); }` is called as `StringBuilder s = new StringBuilder("hi"); grow(s);`. What does `s` contain afterwards?
- [ ] `hi`, because Java passes objects by value so nothing changes
- [x] `hi!`, because the append goes through the copied reference to the shared object, and the reassignment only changes the parameter
- [ ] `new`, because the parameter now points to the new builder
- [ ] `new!`
> The parameter holds a copy of the reference, so `append` modifies the caller's object. Reassigning `sb` redirects only the method's copy; the caller's `s` still refers to the original builder, which now reads `hi!`.

Q: Why does `static String sign(int n) { if (n > 0) return "+"; else if (n < 0) return "-"; }` fail to compile?
- [ ] `else if` is not allowed after `return`
- [ ] A method cannot contain two `return` statements
- [x] When `n == 0`, execution reaches the end of the method without returning a value
- [ ] `String` cannot be a return type
> The compiler checks that every path through a non-`void` method returns or throws. The path for zero falls through, giving "missing return statement". Multiple returns are fine; add a final `return "0";`.
```

## Method Overloading {#c1-method-overloading}

**Method overloading** means declaring several methods with the same name but different parameter lists in the same class. The JDK uses it everywhere: `System.out.println` has versions for `int`, `long`, `double`, `char`, `String`, `Object` and more, and `Math.max` has versions for `int`, `long`, `float` and `double`. To the caller it feels like one operation that works on many types; to the compiler they are completely separate methods with different signatures.

Overloads must differ in the number, types or order of their parameters. Differing only in return type is not allowed, because at a call such as `parse("42");` whose result is ignored, nothing would tell the compiler which to choose:

```java title="RetOnly.java"
public class RetOnly {
    static int parse(String s)    { return 0; }
    static long parse(String s)   { return 0L; }
}
```

```output
RetOnly.java:3: error: method parse(String) is already defined in class RetOnly
    static long parse(String s)   { return 0L; }
                ^
1 error
```

Different parameter names do not help either, since names are not part of the signature.

### Offering defaults with overloads

Because Java lacks default parameter values, the standard idiom is a short overload that fills in the default and delegates to the full version:

```java
static String format(long cents) {
    return format(cents, "$");                // the default currency symbol
}

static String format(long cents, String symbol) {
    return symbol + (cents / 100) + "." + String.format("%02d", cents % 100);
}
```

All the real logic lives in one method, so there is nothing to keep in sync. The same pattern appears in constructors ([[c1-constructors]]).

### How the compiler chooses an overload

When several overloads could accept a call, the compiler picks one at **compile time**, using the *static* (declared) types of the arguments. The Java Language Specification defines the search in three phases, and the compiler stops at the first phase that finds any applicable method:

1. **Strict invocation.** Only exact matches and widening conversions are allowed: `byte` to `int`, `int` to `long`, `float` to `double`, `String` to `Object`. No boxing, no varargs.
2. **Loose invocation.** Boxing and unboxing are also allowed: `int` to `Integer`, `Integer` to `int`.
3. **Variable arity.** Varargs methods are considered.

If a phase finds more than one applicable method, the compiler chooses the **most specific** one — the one whose parameter types could be passed to all the others. `int` is more specific than `long`, and `String` is more specific than `Object`. If no single method is most specific, the call is **ambiguous** and does not compile.

```java title="Overloads.java"
public class Overloads {
    static String describe(int x)     { return "int " + x; }
    static String describe(long x)    { return "long " + x; }
    static String describe(double x)  { return "double " + x; }
    static String describe(Integer x) { return "Integer " + x; }
    static String describe(Object x)  { return "Object " + x; }
    static String describe(int... xs) { return "varargs of " + xs.length; }

    public static void main(String[] args) {
        byte b = 7;
        System.out.println(describe(5));        // exact match
        System.out.println(describe(b));        // byte widens to int, the closest
        System.out.println(describe(5L));       // exact match
        System.out.println(describe(2.5f));     // float widens to double
        System.out.println(describe(Integer.valueOf(9)));  // exact match
        System.out.println(describe("hi"));     // String -> Object
        System.out.println(describe());         // only varargs accepts zero arguments
        System.out.println(describe(1, 2));     // only varargs accepts two
    }
}
```

```output
int 5
int 7
long 5
double 2.5
Integer 9
Object hi
varargs of 0
varargs of 2
```

For `describe(b)`, phase 1 finds `int`, `long` and `double` all applicable through widening, and `Object` is not (that would need boxing). Of those three, `int` is most specific. For `describe(2.5f)` there is no `float` overload, so `float` widens to `double`. The last two calls fail phases 1 and 2 because no fixed-arity method takes zero or two arguments, so phase 3 picks the varargs version.

The phase order produces results that surprise even experienced developers:

```java title="Phases.java"
public class Phases {
    static String pick(long x)    { return "long (widening)"; }
    static String pick(Integer x) { return "Integer (boxing)"; }
    static String pick(int... x)  { return "int... (varargs)"; }

    static String pick2(Integer x) { return "Integer (boxing)"; }
    static String pick2(int... x)  { return "int... (varargs)"; }

    static String text(Object o) { return "Object"; }
    static String text(String s) { return "String"; }

    public static void main(String[] args) {
        System.out.println(pick(5));     // phase 1 finds long: boxing is never considered
        System.out.println(pick2(5));    // phase 2: boxing beats varargs
        System.out.println(text(null));  // String is more specific than Object
        Object o = "really a String";
        System.out.println(text(o));     // chosen from the static type: Object
    }
}
```

```output
long (widening)
Integer (boxing)
String
Object
```

`pick(5)` chooses `long` over `Integer` even though `Integer` "looks" closer to `int`. Widening is allowed in phase 1, boxing only in phase 2, and the compiler never reaches phase 2 once phase 1 succeeds. This ordering exists for backward compatibility: boxing arrived in Java 5, and code written before then had to keep calling the same methods. `text(null)` picks `String` because `null` fits both and `String` is a subtype of `Object`. The last call is the most important: `o` *holds* a `String` at run time, but its declared type is `Object`, and overload resolution only looks at declared types. Choosing a method based on the runtime class is **overriding**, a different mechanism; the comparison is in [[c1-overload-vs-override]].

When two candidates are equally specific, the call fails to compile:

```java title="Ambig.java"
public class Ambig {
    static void show(String s)  { }
    static void show(Integer i) { }
    public static void main(String[] args) {
        show(null);
    }
}
```

```output
Ambig.java:5: error: reference to show is ambiguous
        show(null);
        ^
  both method show(String) in Ambig and method show(Integer) in Ambig match
1 error
```

Neither `String` nor `Integer` is a subtype of the other, so neither is more specific. A cast at the call site, `show((String) null)`, resolves it.

### The overload trap in the JDK

The most famous overloading bug comes from `List<Integer>`. `List` has two `remove` methods: `remove(int index)` and `remove(Object o)`.

```java title="RemoveTrap.java"
import java.util.ArrayList;
import java.util.List;

public class RemoveTrap {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 1));
        nums.remove(1);                       // remove(int index): removes 20
        System.out.println(nums);
        nums.remove(Integer.valueOf(1));      // remove(Object): removes the value 1
        System.out.println(nums);
    }
}
```

```output
[10, 30, 1]
[10, 30]
```

`nums.remove(1)` matches `remove(int)` exactly in phase 1, so it removes the element at index 1 rather than the value `1`. To remove by value, pass an `Integer` object. This is the phase rules in action, and a good reason to avoid writing overloads whose parameters differ only by a primitive and its wrapper, or by types that convert into each other.

> [!WARNING] Overload only when the meaning is identical
> Overloads should all do the same thing for different input types, like `println`. When behaviour differs, give the methods different names: `removeAt(int)` and `removeValue(Object)` would never have caused the bug above.

```quiz
Q: A class declares `go(long x)`, `go(Integer x)` and `go(int... x)`. Which runs for `go(5)`?
- [x] `go(long)`
- [ ] `go(Integer)`
- [ ] `go(int...)`
- [ ] The call is ambiguous and does not compile
> Overload resolution tries strict invocation first, which allows widening (`int` to `long`) but not boxing. `go(long)` is applicable in that phase, so the compiler stops there and never considers boxing to `Integer` or the varargs version.

Q: Given `void print(Object o)` and `void print(String s)`, and `Object value = "hello";`, which method does `print(value)` call?
- [ ] `print(String)`, because the object is a `String` at run time
- [x] `print(Object)`, because overloads are chosen from the declared type of the argument
- [ ] Both, in order
- [ ] Neither; it is ambiguous
> Overloading is resolved at compile time, and the compiler only knows that `value` is an `Object`. Dispatching on the runtime class is what overriding does, not overloading.
```

## Variable Scope {#c1-variable-scope}

The **scope** of a variable is the region of source code where its name can be used. Scope is a compile-time idea: the compiler checks every use of a name against the declarations visible at that point and rejects uses outside them. It is related to, but different from, a variable's **lifetime** — how long its storage exists while the program runs.

Java has four kinds of variable, and each has its own scope rule:

| Kind | Declared | Scope | Lifetime | Default value |
|---|---|---|---|---|
| Local variable | Inside a method or block | From the declaration to the end of the enclosing block | Until the block finishes | None; must be assigned before use |
| Parameter | In the method header | The whole method body | One call | The argument value |
| Instance field | In the class, without `static` | The whole class (via the object) | As long as the object exists | `0`, `false` or `null` |
| Static field | In the class, with `static` | The whole class | As long as the class is loaded | `0`, `false` or `null` |

### Blocks define the scope of locals

A **block** is any code between `{` and `}`: a method body, a loop body, an `if` branch, or a bare pair of braces. A local variable exists from the line it is declared until the closing brace of the innermost block containing it. A `for` loop's header variable belongs to the loop: it is in scope in the condition, the update and the body, and gone after the loop.

```java title="Greeter.java"
public class Greeter {
    static int calls = 0;                     // static field: one copy for the class
    private final String name;                // instance field: one copy per object

    Greeter(String name) {
        this.name = name;                     // parameter shadows the field; this.name is the field
    }

    String greet(int times) {                 // parameter: whole method body
        calls++;
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < times; i++) {     // i exists only inside the loop
            String piece = "hi " + name;      // piece exists only inside the loop body
            out.append(piece).append(i < times - 1 ? ", " : "");
        }
        // System.out.println(i);             // would not compile: i is out of scope
        if (times > 1) {
            int extra = times * 10;           // block-local
            out.append(" (").append(extra).append(")");
        }
        return out.toString();
    }

    public static void main(String[] args) {
        Greeter s = new Greeter("Ada");
        System.out.println(s.greet(1));
        System.out.println(s.greet(3));
        System.out.println("calls = " + calls);
    }
}
```

```output
hi Ada
hi Ada, hi Ada, hi Ada (30)
calls = 2
```

This example creates an object with `new Greeter("Ada")` and calls an instance method on it, because fields only make sense with objects; if constructors are new to you, read the example for its variables and see [[c1-classes]] for the rest. Inside `greet`, `times` (a parameter) is visible everywhere in the method. `i` and `piece` exist only inside the loop; uncommenting the `println(i)` line produces "cannot find symbol". `extra` lives only in the `if` block. The fields `calls` and `name` are visible in every method of the class. `calls` is a static field, so it keeps counting across calls and objects, while each local disappears when its block ends and starts fresh on the next call.

**Declare variables in the smallest scope that works**, as close as possible to their first use. A variable that lives only inside a loop cannot accidentally keep a stale value from a previous use, and a reader does not have to scan the whole method to see where it is changed. Because scopes end, the same name can be reused in sequential blocks: two loops one after the other can each declare their own `int i`.

### Java forbids shadowing one local with another

**Shadowing** is declaring a new variable with the same name as one already in scope, so that the inner declaration hides the outer one. Many languages allow it between nested blocks; Java does not allow a local variable or parameter to shadow another local variable or parameter.

```java title="NoShadow.java"
public class NoShadow {
    static void run() {
        int total = 0;
        for (int i = 0; i < 3; i++) {
            int total = i;                    // illegal: total already in scope
        }
    }
}
```

```output
NoShadow.java:5: error: variable total is already defined in method run()
            int total = i;                    // illegal: total already in scope
                ^
1 error
```

This rule removes a real class of bugs in which code updates an inner variable while the author believes it is updating the outer one. A lambda's parameters follow the same rule; they cannot reuse the name of a local in the enclosing method.

A local or parameter *may* shadow a **field**, and this happens constantly in constructors and setters: in `Greeter(String name)`, the bare name `name` means the parameter, and the field must be written `this.name`. Forgetting `this.` produces the classic bug `name = name;`, which assigns the parameter to itself and leaves the field `null`. The `this` keyword is covered in [[c1-this-keyword]].

### Scope and lambdas

A lambda or anonymous class can read local variables from the enclosing method, but only if they are **effectively final** — never reassigned after initialisation (Java 8+).

```java title="Capture.java"
public class Capture {
    public static void main(String[] args) {
        int base = 10;
        Runnable r = () -> System.out.println(base + 1);
        base = 20;                            // makes base no longer effectively final
        r.run();
    }
}
```

```output
Capture.java:4: error: local variables referenced from a lambda expression must be final or effectively final
        Runnable r = () -> System.out.println(base + 1);
                                              ^
1 error
```

The reason is lifetime. A lambda can outlive the method that created it — it might be stored and run later on another thread — after the method's local variables are gone. So Java copies the variable's value into the lambda when it is created. If the variable could still change afterwards, the copy and the original could disagree, so the language forbids changing it. Fields have no such restriction because they live on the heap with their object. See [[c1-lambdas]].

### Lifetime: what happens in memory

Each method call gets a **stack frame** on the current thread's stack, holding that call's parameters and locals. When the call returns, the frame is discarded, so local variables cost nothing to clean up and are naturally private to one call and one thread. Two threads running the same method each have their own copies of its locals, which is why local variables never need synchronisation while shared fields do ([[c3-thread-safety]]). Objects that locals refer to live on the heap and survive as long as something references them. The full model is in [[c2-stack-frames]].

## Recursion {#c1-recursion-java}

**Recursion** is when a method calls itself. It is the natural way to solve a problem that contains smaller copies of itself: the factorial of 5 is 5 times the factorial of 4; the size of a folder is the size of its files plus the sizes of its subfolders; a tree is a node plus smaller trees. A recursive method handles the small case directly and reduces every other case to a smaller one.

Every correct recursive method has two parts. The **base case** is an input small enough to answer without recursion; it is what makes the recursion stop. The **recursive case** answers a larger input by calling the method on a strictly smaller input and combining the result. If the input does not get closer to a base case on every call, the recursion never ends.

```java title="Factorial.java"
public class Factorial {
    static long factorial(int n) {
        if (n < 0) throw new IllegalArgumentException("n must be >= 0");
        if (n <= 1) {
            return 1;                          // base case: no further calls
        }
        return n * factorial(n - 1);           // recursive case: a smaller problem
    }

    static long factorialTraced(int n, String indent) {
        System.out.println(indent + "factorial(" + n + ") called");
        long result = n <= 1 ? 1 : n * factorialTraced(n - 1, indent + "  ");
        System.out.println(indent + "factorial(" + n + ") returns " + result);
        return result;
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
        System.out.println(factorial(20));
        System.out.println(factorial(21));     // overflows long silently
        factorialTraced(3, "");
    }
}
```

```output
120
2432902008176640000
-4249290049419214848
factorial(3) called
  factorial(2) called
    factorial(1) called
    factorial(1) returns 1
  factorial(2) returns 2
factorial(3) returns 6
```

The trace shows how recursion actually executes. `factorial(3)` cannot finish until it knows `factorial(2)`, which cannot finish until it knows `factorial(1)`. Each of those calls is **paused** in the middle of its multiplication, waiting. When `factorial(1)` hits the base case and returns `1`, the calls resume in reverse order: `factorial(2)` computes `2 * 1`, then `factorial(3)` computes `3 * 2`. The guard for negative `n` matters as well: without it, `factorial(-1)` would skip the base case and recurse forever towards more negative numbers. Note also that `factorial(21)` exceeds the range of `long` and wraps to a negative number without any error, an overflow behaviour covered in [[c1-primitives]].

### The call stack

Each paused call is held in its own stack frame, containing its own `n`. Three calls to `factorial` mean three frames, each with a different `n`, which is why the calls do not interfere with each other.

```mermaid title="Frames on the stack at the deepest point of factorial(3)"
flowchart TB
    F1["factorial(1): n = 1, returns 1"] --> F2["factorial(2): n = 2, waiting to compute 2 * result"]
    F2 --> F3["factorial(3): n = 3, waiting to compute 3 * result"]
    F3 --> M["main: waiting for factorial(3)"]
```

The top frame is the one running; each frame below it is waiting for the one above to return. The stack has a fixed maximum size per thread — typically 1 MB by default on 64-bit Linux and macOS, adjustable with the `-Xss` option. If recursion goes too deep, the JVM runs out of stack and throws **`StackOverflowError`**:

```java title="Depth.java"
public class Depth {
    static int depth = 0;

    static void dive() {
        depth++;
        dive();                                // no base case
    }

    public static void main(String[] args) {
        try {
            dive();
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError after about " + depth + " calls");
        }
    }
}
```

```output
StackOverflowError after about 47147 calls
```

The exact number changes from run to run and machine to machine, because it depends on frame sizes, which change as the JIT compiler optimises the method, and on the stack size. What is reliable is the order of magnitude: with default settings, a simple method can recurse tens of thousands of levels deep, not millions. `StackOverflowError` is an `Error`, not an `Exception`, and catching it is only reasonable in a demonstration like this one. In real code, the fix is a base case that is actually reached, or an iterative algorithm. More on stack overflow in [[c2-stackoverflow]].

Unlike some functional languages, Java does not perform **tail-call optimisation**: even when the recursive call is the very last thing a method does, the JVM still pushes a new frame. So "make it tail-recursive" does not make deep recursion safe in Java.

### When recursion repeats work

A recursive method can be correct and still hopelessly slow. The Fibonacci numbers are defined by `fib(n) = fib(n - 1) + fib(n - 2)`, and the direct translation calls itself twice per step:

```java title="Fib.java"
import java.util.HashMap;
import java.util.Map;

public class Fib {
    static long calls = 0;

    static long fibNaive(int n) {
        calls++;
        if (n < 2) return n;
        return fibNaive(n - 1) + fibNaive(n - 2);
    }

    static long fibMemo(int n, Map<Integer, Long> memo) {
        calls++;
        if (n < 2) return n;
        Long cached = memo.get(n);
        if (cached != null) return cached;
        long result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
        memo.put(n, result);
        return result;
    }

    static long fibLoop(int n) {
        long prev = 0, curr = 1;
        for (int i = 0; i < n; i++) {
            long next = prev + curr;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        calls = 0;
        System.out.println("naive  fib(30) = " + fibNaive(30) + " using " + calls + " calls");
        calls = 0;
        System.out.println("memo   fib(30) = " + fibMemo(30, new HashMap<>()) + " using " + calls + " calls");
        System.out.println("loop   fib(30) = " + fibLoop(30));
        System.out.println("loop   fib(90) = " + fibLoop(90));
    }
}
```

```output
naive  fib(30) = 832040 using 2692537 calls
memo   fib(30) = 832040 using 59 calls
loop   fib(30) = 832040
loop   fib(90) = 2880067194370816120
```

The naive version recomputes the same values over and over: `fib(28)` is computed twice, `fib(27)` three times, and so on, for over 2.6 million calls to compute `fib(30)`. Its running time grows exponentially. **Memoization** — storing each result the first time it is computed and reusing it — brings that down to 59 calls, because each value is now computed once. The loop does the same work with no recursion and constant memory. This progression, from naive recursion to memoization to iteration, is the core of dynamic programming. The algorithmic side of recursion — designing recursive solutions, analysing their cost, backtracking — is taught in [[a1-recursion]].

### Choosing recursion or a loop

Recursion is the clearest tool for problems with a naturally recursive shape: trees, nested structures such as JSON or file systems, divide-and-conquer algorithms such as merge sort, and exploring choices in backtracking. For straight-line repetition — summing an array, counting down — a loop is simpler, faster (no call overhead) and cannot overflow the stack. Any recursion can be rewritten as a loop with an explicit stack data structure; that is worth doing when the depth depends on untrusted input, such as a deeply nested document uploaded by a user.

```java title="SumDigits.java"
public class SumDigits {
    static int sumDigits(int n) {
        if (n < 10) return n;
        return n % 10 + sumDigits(n / 10);
    }

    static boolean isPalindrome(String s, int lo, int hi) {
        if (lo >= hi) return true;
        if (s.charAt(lo) != s.charAt(hi)) return false;
        return isPalindrome(s, lo + 1, hi - 1);
    }

    public static void main(String[] args) {
        System.out.println(sumDigits(98071));
        System.out.println(isPalindrome("racecar", 0, 6));
        System.out.println(isPalindrome("rocket", 0, 5));
    }
}
```

```output
25
true
false
```

Both methods follow the same recipe. `sumDigits` shrinks the number by one digit per call (`n / 10`) and stops at a single digit. `isPalindrome` moves both ends inward and has two base cases: the pointers met (everything matched) or a mismatch was found. Passing `lo` and `hi` as parameters, instead of creating substrings, keeps each call O(1) — a common technique called a **helper with indices**.

```quiz
Q: `static int count(int n) { return count(n - 1) + 1; }` is called with `count(5)`. What happens?
- [ ] It returns 5
- [ ] It returns 0
- [x] It throws `StackOverflowError`, because there is no base case
- [ ] The compiler rejects a method that calls itself
> Every call makes another call with a smaller `n`, but nothing ever stops the chain, so frames pile up until the thread's stack is exhausted. Adding `if (n == 0) return 0;` gives a base case and makes `count(5)` return 5.

Q: Why does rewriting a deeply recursive Java method in tail-recursive form not prevent `StackOverflowError`?
- [ ] Tail-recursive methods are slower
- [x] The JVM does not perform tail-call optimisation, so each call still pushes a new frame
- [ ] Java forbids tail recursion
- [ ] Tail recursion only works for `void` methods
> Some languages reuse the current frame when the recursive call is the last action. HotSpot does not, so depth is still limited by stack size; convert to a loop when depth can be large.
```

## varargs {#c1-varargs}

A **varargs** (variable-arity) parameter lets a method accept any number of arguments of one type, including none. You declare it with three dots after the type: `int... numbers`. Inside the method, `numbers` is simply an `int[]`. At each call site, the compiler collects the arguments into a new array and passes that. `String.format`, `List.of`, `Arrays.asList` and `System.out.printf` are all varargs methods.

```java title="Varargs.java"
import java.util.Arrays;

public class Varargs {
    static int sum(int... numbers) {          // numbers is an int[] inside the method
        int total = 0;
        for (int n : numbers) {
            total += n;
        }
        return total;
    }

    static String tag(String name, String... classes) {   // varargs must come last
        return name + Arrays.toString(classes);
    }

    static int max(int first, int... rest) {  // forces at least one argument
        int best = first;
        for (int n : rest) best = Math.max(best, n);
        return best;
    }

    public static void main(String[] args) {
        System.out.println(sum());                       // empty array, not null
        System.out.println(sum(4));
        System.out.println(sum(1, 2, 3, 4));
        int[] existing = {10, 20};
        System.out.println(sum(existing));               // an array is passed as is
        System.out.println(tag("div"));
        System.out.println(tag("div", "card", "wide"));
        System.out.println(max(7));
        System.out.println(max(3, 9, 4));
        System.out.println(String.format("%s scored %d (%.1f%%)", "Ada", 42, 87.5));
    }
}
```

```output
0
4
10
30
div[]
div[card, wide]
7
9
Ada scored 42 (87.5%)
```

The compiler rewrites `sum(1, 2, 3, 4)` as `sum(new int[] {1, 2, 3, 4})` and `sum()` as `sum(new int[0])`, so the method always receives an array and never `null` from an ordinary call. Because the parameter really is an array, you can also pass an existing array directly, as `sum(existing)` does.

Two rules keep calls unambiguous: a method can have **at most one** varargs parameter, and it must be the **last** parameter. In `tag(String name, String... classes)`, the first argument fills `name` and everything after it goes into `classes`. The `max(int first, int... rest)` signature is a useful idiom: calling `sum()` with nothing is fine, but a maximum of nothing makes no sense, so requiring one fixed parameter turns `max()` into a compile error instead of a runtime check.

### Passing null

Because a single argument might be an element or the whole array, `null` needs care:

```java title="VarargsNull.java"
public class VarargsNull {
    static int count(String... items) {
        return items == null ? -1 : items.length;
    }

    public static void main(String[] args) {
        System.out.println(count());                  // new String[0]
        System.out.println(count((String) null));     // new String[] {null}
        System.out.println(count((String[]) null));   // the array itself is null
    }
}
```

```output
0
1
-1
```

Casting to `String` means "one element that happens to be null", so the method gets a one-element array. Casting to `String[]` means "here is the whole array, and it is null". An uncast `count(null)` is treated as the array form, so the parameter is `null`, and javac warns about the ambiguity ("non-varargs call of varargs method with inexact argument type"). If your method may be called that way, check for `null` or document that it is not allowed.

### Varargs and overloading

Varargs methods are considered only in the third and last phase of overload resolution, so any fixed-arity overload that fits wins. That is the behaviour you want: it lets libraries add fast paths for common cases. `List.of` has separate overloads for zero to ten elements and a varargs overload only for more, because each varargs call allocates a fresh array, and creating small lists is common enough for that allocation to matter. Avoid overloading two varargs methods whose types convert into each other, such as `f(int...)` and `f(long...)`; calls such as `f()` become ambiguous.

### Generic varargs and heap pollution

Varargs and generics combine badly, for the reason explained in the arrays lesson: Java cannot create an array of a generic type `T` at run time, so for a parameter `T... items` the compiler creates an array of `T`'s erasure, often `Object[]`. As long as the method only *reads* the elements, nothing goes wrong. If it stores the array somewhere or returns it, code elsewhere may receive an `Object[]` while believing it has a `String[]` — a situation called **heap pollution**.

```java title="Unsafe.java"
import java.util.List;

public class Unsafe {
    @SafeVarargs                                // safe: only reads the elements
    static <T> List<T> listOf(T... items) {
        return List.of(items);
    }

    static <T> T[] toArray(T... items) {        // unsafe: hands the varargs array out
        return items;
    }

    static <T> T[] pair(T a, T b) {
        return toArray(a, b);                   // T is erased here, so an Object[] is made
    }

    public static void main(String[] args) {
        System.out.println(listOf("a", "b"));
        try {
            String[] names = pair("x", "y");    // compiler inserts a cast to String[]
            System.out.println(names.length);
        } catch (ClassCastException e) {
            System.out.println("ClassCastException: an Object[] is not a String[]");
        }
    }
}
```

```output
[a, b]
ClassCastException: an Object[] is not a String[]
```

Inside `pair`, `T` is just `Object` after erasure, so the call `toArray(a, b)` creates an `Object[]`. That array travels back to `main`, where the compiler inserted a cast to `String[]`, and the cast fails — in a line that contains no visible cast at all. javac warns about both declarations ("possible heap pollution" and "unchecked generic array creation"). The **`@SafeVarargs`** annotation on `listOf` is the author's promise that the method does not store or expose the varargs array, and it suppresses the warning for callers. It is allowed only on methods that cannot be overridden — static, final and (since Java 9) private methods — and on constructors. The underlying reasons are covered in [[c1-generics]] and [[c1-type-erasure]].

```quiz
Q: Inside `static int sum(int... nums)`, what is `nums` when the method is called as `sum()`?
- [ ] `null`
- [x] An empty `int[]` of length 0
- [ ] The call does not compile
- [ ] An array containing a single 0
> The compiler rewrites `sum()` as `sum(new int[0])`, so the method can loop over `nums` without a null check. A `null` parameter only arrives if the caller explicitly passes a null array.

Q: Which declaration is legal?
- [ ] `void f(String... names, int count)`
- [ ] `void f(int... a, String... b)`
- [x] `void f(int count, String... names)`
- [ ] `void f(String names...)`
> A method may have only one varargs parameter, and it must be last, so the compiler can tell where fixed arguments end and the variable part begins. The three dots go between the type and the name.
```

## How it works internally

The compiler turns each method into bytecode inside the class file, and each call into an invoke instruction. Here is a small class and the relevant part of `javap -c` output (constant-pool numbers vary between compilers):

```java title="Calls.java"
public class Calls {
    static int square(int x) {
        return x * x;
    }

    public static void main(String[] args) {
        int result = square(7);
        System.out.println(result);
    }
}
```

```output
  static int square(int);
    Code:
         0: iload_0
         1: iload_0
         2: imul
         3: ireturn

  public static void main(java.lang.String[]);
    Code:
         0: bipush        7
         2: invokestatic  #7                  // Method square:(I)I
         5: istore_1
         6: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
         9: iload_1
        10: invokevirtual #19                 // Method java/io/PrintStream.println:(I)V
        13: return
```

`main` pushes the argument `7` onto its **operand stack** and executes `invokestatic`, naming the method by its class, name and **descriptor** `(I)I` — "takes an `int`, returns an `int`". The descriptor encodes the parameter types, which is how overloads stay distinct in compiled code: an overload resolved at compile time is simply a different descriptor in the instruction. The JVM creates a new frame for `square` and copies `7` into its local-variable slot 0 — this copy is pass-by-value at the machine level. `square` loads slot 0 twice, multiplies, and `ireturn` pushes the result onto the caller's operand stack, where `istore_1` saves it in `main`'s slot 1 (`result`).

Static calls use `invokestatic`; calls on objects use `invokevirtual` (or `invokeinterface` through an interface type), which looks up the method on the object's actual class at run time — the mechanism behind overriding. Small, frequently called methods are usually **inlined** by the JIT compiler, which copies their body into the caller and removes the call overhead entirely, so splitting code into small methods costs essentially nothing in performance. See [[c2-inlining]] and [[c2-bytecode]].

## Worked example: a receipt formatter

This program uses every topic of the lesson: a varargs method, input validation with an exception, a recursive helper, and an overload that supplies a default.

```java title="Receipt.java"
public class Receipt {
    /** Sums any number of prices, given in cents to avoid floating-point rounding. */
    static long subtotal(long... pricesInCents) {
        long total = 0;
        for (long p : pricesInCents) {
            total += p;
        }
        return total;
    }

    /** Returns the amount after a percentage discount, rounded down to whole cents. */
    static long applyDiscount(long cents, int percent) {
        if (percent < 0 || percent > 100) {
            throw new IllegalArgumentException("percent must be 0..100, was " + percent);
        }
        return cents - cents * percent / 100;
    }

    /** 1234567 -> "1,234,567", built recursively from the left. */
    static String groupDigits(long n) {
        if (n < 1000) {
            return Long.toString(n);
        }
        return groupDigits(n / 1000) + "," + String.format("%03d", n % 1000);
    }

    static String format(long cents) {
        return format(cents, "$");               // overload supplies the default symbol
    }

    static String format(long cents, String symbol) {
        return symbol + groupDigits(cents / 100) + "." + String.format("%02d", cents % 100);
    }

    public static void main(String[] args) {
        long items = subtotal(129_999, 4_550, 2_000_000);
        long discounted = applyDiscount(items, 15);
        System.out.println("Subtotal: " + format(items));
        System.out.println("After 15%: " + format(discounted));
        System.out.println("In euros: " + format(discounted, "€"));
        System.out.println("Empty cart: " + format(subtotal()));
        try {
            applyDiscount(items, 120);
        } catch (IllegalArgumentException e) {
            System.out.println("Rejected: " + e.getMessage());
        }
    }
}
```

```output
Subtotal: $21,345.49
After 15%: $18,143.67
In euros: €18,143.67
Empty cart: $0.00
Rejected: percent must be 0..100, was 120
```

Start with the representation: money is held as a `long` number of cents, because `double` cannot represent values such as 0.1 exactly and rounding errors accumulate. `subtotal` takes `long...`, so callers can pass any number of prices, and `subtotal()` with an empty cart returns `0` without special handling. Each `int` literal argument such as `4_550` widens to `long` as it is placed into the array.

`applyDiscount` validates first and throws, because a 120% discount is a caller bug, not a value to compute with. It multiplies before dividing — `cents * percent / 100` — so the integer division happens last and loses at most one cent; dividing first (`cents / 100 * percent`) would throw away the cents entirely.

`groupDigits` is recursive: 21345 is not below 1000, so it returns `groupDigits(21) + "," + "345"`, and `groupDigits(21)` is a base case. The `%03d` format keeps leading zeros in each group, so 1,005 does not print as `1,5`. The recursion depth is the number of digit groups — at most seven for a `long` — so stack depth is no concern here. Finally, `format(long)` is a one-line overload that delegates to `format(long, String)`, giving the method a default currency symbol without duplicating logic. The methods are written for non-negative amounts; handling refunds would need a sign check in `format`.

## In real systems

**Small methods are the norm.** Production Java code favours methods short enough to read in one screen, each doing one thing with a name that says what. Because the JIT inlines small methods, this costs no performance, and it makes unit testing straightforward: each method's contract can be tested directly.

**Framework entry points are methods.** In Spring, a controller method such as `@GetMapping("/orders/{id}") OrderDto getOrder(@PathVariable long id)` is called by the framework for each HTTP request; its parameters are filled from the request and its return value becomes the response body. The same parameter and return-value rules apply — the framework is just another caller. See [[c6-rest-controllers]].

**Validation at the boundary.** Public methods typically check their arguments first with `Objects.requireNonNull(x, "x")` or explicit `if` checks that throw `IllegalArgumentException`, so invalid input fails loudly at the point of the mistake rather than corrupting state later.

**Overloads and varargs in APIs.** Logging frameworks such as SLF4J overload `log.info(String format, Object arg)` for one and two arguments and fall back to `Object...` for more, exactly the "fast path then varargs" pattern used by `List.of`, because logging calls are extremely frequent.

**Recursion with limits.** JSON parsers, XML parsers and expression evaluators are recursive by nature. Production libraries cap nesting depth (Jackson 2.15 and later, for example, enforces a configurable maximum nesting depth on input), so a hostile document with a million nested brackets causes a clean error rather than a `StackOverflowError`.

## Trade-offs and alternatives

| Choice | Benefit | Cost | Prefer when |
|---|---|---|---|
| Many small methods | Readable, testable, reusable | More names to invent | Almost always |
| Overloads | One name for one operation over many types; defaults | Resolution surprises with boxing and `null` | Behaviour is identical across types |
| Distinct names | No resolution surprises | Longer API | Behaviour differs, or types convert into each other |
| Parameter object (record) | Named, ordered-proof arguments | One more type | More than three parameters, or optional values |
| Recursion | Mirrors recursive data; short code | Stack depth limit, call overhead | Trees, nesting, divide and conquer |
| Iteration | No depth limit, usually faster | Can be less clear for recursive shapes | Linear repetition; untrusted depth |
| Varargs | Convenient calls with any count | Array allocation per call; generic pitfalls | Count is genuinely variable and small |
| `List<T>` parameter | Clear intent; no heap pollution | Caller builds a list | The data is already a collection |

## Common mistakes

> [!MISTAKE] Expecting a method to reassign the caller's variable
> `static void reset(int[] a) { a = new int[3]; }` does nothing visible to the caller, and neither does a `swap(String, String)`. Java copies each argument; reassigning a parameter changes only the copy. Return the new value instead: `data = reset();`.

**Ignoring the return value.** `name.trim();` or `price.add(tax);` (on `BigDecimal`) compute a new value and throw it away, because those types are immutable. Write `name = name.trim();`.

**Missing or unreachable base case.** A recursive method whose base case is never reached for some inputs, such as negative numbers, ends in `StackOverflowError`. Check that every call moves strictly closer to a base case, and validate inputs that cannot.

**Overloading by primitive and wrapper.** `remove(int)` versus `remove(Object)` on `List<Integer>`, or `pick(long)` beating `pick(Integer)`. Avoid overloads whose parameters convert into each other, and pass `Integer.valueOf(x)` when you mean the object.

**Assuming overloads use the runtime type.** With `Object o = "text";`, `text(o)` calls the `Object` overload. Only overriding dispatches on the runtime class.

**Shadowing a field by accident.** `this.name = name` is correct; `name = name` silently does nothing useful. Enable compiler or IDE warnings for self-assignment.

**Declaring variables too early.** A variable declared at the top of a long method and reused for different purposes keeps stale values between uses. Declare it where it is first needed, in the innermost block that uses it.

**Exposing a varargs array.** Storing or returning a generic `T...` parameter causes heap pollution. Copy it into a `List` (`List.of(items)`) instead, and add `@SafeVarargs` only when the method truly just reads the elements.

## Interview perspective

Interviewers use methods to probe whether you understand Java's execution model precisely rather than approximately.

> [!INTERVIEW] Is Java pass-by-value or pass-by-reference?
> "Always pass-by-value. For a primitive the copied value is the number; for an object it is the reference. So a method can mutate an object it receives — say, add to a list — but it can't make the caller's variable point to a different object. That's why a `swap(a, b)` method on two references has no effect on the caller."

Questions you should be ready for:

- **What is a method signature, and can overloads differ only by return type?** Name plus parameter types; no, because a call does not always reveal the expected return type.
- **Which overload does `f(5)` call given `f(long)` and `f(Integer)`?** `f(long)`: widening is tried in phase 1, boxing only in phase 2, varargs in phase 3.
- **Overloading versus overriding?** Overloading: same name, different parameters, chosen at compile time from declared types. Overriding: same signature in a subclass, chosen at run time from the object's class.
- **Why must captured locals be effectively final?** The lambda gets a copy of the value and may outlive the method; allowing later changes would make the copy and the variable disagree.
- **What causes `StackOverflowError`, and does Java optimise tail calls?** Recursion deeper than the thread's stack allows; no, the JVM does not eliminate tail calls, so convert deep recursion to iteration.
- **How does varargs work underneath?** The compiler packs the arguments into a new array; the parameter is an ordinary array. One per method, last position, lowest overload priority.
- **Can a static method be overridden?** No — a subclass static method with the same signature hides it, and calls are resolved by the declared type. See [[c1-static-no-override]].

A good follow-up answer on recursion mentions cost: the naive Fibonacci recursion is exponential, memoization makes it linear, and an iterative version also removes the stack usage.

## Practice

1. **Pure helpers.** Write `isLeapYear(int year)`, `daysInMonth(int month, int year)` and `dayOfYear(int day, int month, int year)`, each calling the previous ones. Test boundary years such as 1900 and 2000.
2. **Predict the output.** Write a method that receives a `StringBuilder` and both appends to it and reassigns it. Predict what the caller sees, then run it.
3. **Overload puzzle.** Declare `f(double)`, `f(Object)` and `f(Integer...)`. Predict which runs for `f(1)`, `f('a')`, `f("x")`, `f()` and `f(null)`, then check with the compiler.
4. **Recursive power.** Implement `pow(base, exp)` recursively in O(log exp) calls using `pow(b, e) = pow(b, e / 2)²` for even `e`. Explain the base case and the depth.
5. **Iterative rewrite.** Rewrite `isPalindrome(String, int, int)` from this lesson as a loop and compare readability.
6. **Varargs average.** Write `average(double first, double... rest)` and explain why the first parameter is separate.

## Quick revision {#quick-revision}

- A method has modifiers, a return type (`void` for none), a name, a parameter list, an optional `throws` clause and a body.
- Signature = name + parameter types. Return type, parameter names and `throws` are not part of it.
- Arguments are evaluated left to right and copied into parameters: **Java is always pass-by-value**. For objects, the reference is copied — methods can mutate the object, not rebind the caller's variable.
- Non-`void` methods must return or throw on every path; `return` ends the method. Return several values as a record; "not found" as `Optional` or an empty collection.
- Overloading: same name, different parameter lists, resolved at compile time from declared types. Phases: widening → boxing → varargs; then most specific; otherwise ambiguous.
- `List<Integer>.remove(1)` removes by index; `remove(Integer.valueOf(1))` removes by value.
- Scope: locals from declaration to end of block; parameters the whole method; fields the whole class. Locals have no default value.
- A local cannot shadow another local or parameter; it can shadow a field (use `this.field`).
- Lambdas capture only effectively final locals.
- Recursion: base case + smaller recursive case; one stack frame per call; too deep → `StackOverflowError` (default stack about 1 MB on 64-bit Linux and macOS, `-Xss`); no tail-call optimisation.
- Varargs `T...`: compiled to an array; one per method, last; zero arguments → empty array; lowest overload priority; generic varargs risk heap pollution, `@SafeVarargs` on static, final, private methods and constructors.

## Key takeaways {#key-takeaways}

- Methods turn repeated code into named, testable operations; small methods are free at run time because the JIT inlines them.
- Every argument is copied. Understanding that the copy of a reference still points at the same object explains every "why did my method change / not change this" question.
- Overload resolution is a compile-time search on declared types with a fixed priority — widening, then boxing, then varargs — and its surprises come from boxing, `null` and runtime types.
- Keep each variable in the smallest scope possible; Java's ban on shadowed locals and its effectively-final rule for lambdas both exist to prevent confusion about which variable is meant.
- Recursion is the right shape for recursive data, but every call costs a stack frame and Java never removes them, so bound the depth or use a loop.
- Varargs is syntax for an array parameter; use it for genuinely variable small argument lists and avoid exposing generic varargs arrays.
