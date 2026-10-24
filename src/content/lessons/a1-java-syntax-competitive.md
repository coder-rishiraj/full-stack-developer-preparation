---
summary: The small slice of Java you need to solve problems on an online judge or in a coding interview — the program skeleton, reading input, choosing int or long, printing efficiently and doing arithmetic modulo a prime. Getting these right means your time goes into the algorithm instead of fighting the language.
difficulty: beginner
minutes: 50
objectives:
  - Explain what each word of `public static void main(String[] args)` does and why the judge needs it
  - Read input with `Scanner`, then with `BufferedReader` and `StringTokenizer`, and explain when the faster reader is worth it
  - Choose between `int`, `long` and `BigInteger`, and prevent silent integer overflow in sums and products
  - Print large outputs efficiently with `StringBuilder` and keep debug output out of the answer
  - Compute answers modulo 1,000,000,007 correctly, including negative values and products
---

## Introduction

When you solve a problem on an **online judge** — LeetCode, Codeforces, CSES, HackerRank or an interview platform — your program is treated as a black box. The judge compiles one Java file, feeds the problem's input to it as plain text, captures everything it prints, and compares that text with the expected answer. If the text matches, you pass. If your program prints `150 ` with a stray word, crashes on a large input, or takes three seconds instead of one, you fail — even when your algorithm is perfect.

That makes a small amount of Java unusually important. You need a program skeleton that compiles, a way to read the judge's text and turn it into numbers, a number type large enough for the answer, and a way to print results that is fast enough for a million lines. You also need to know a handful of traps: integer overflow that produces a wrong answer with no error, a `Scanner` call that silently reads an empty line, and Java's `%` operator returning negative numbers.

This lesson teaches exactly that slice, in the order you meet it: the skeleton, standard input and output, `Scanner`, number types, the fast reader, printing, constants and modular arithmetic, and finally `BigInteger`. Each tool is introduced with the problem it solves, so that by the end you can explain every line of a contest template instead of pasting it as magic.

## Before you start

You need very little:

- **Basic programming** — variables, `if`, `for` and `while` loops, and calling a method. Any language is enough; this lesson shows the Java spelling.
- **A terminal** — you will compile with `javac` and run with `java`. Any JDK from version 17 onwards works; the examples target Java 21.

If you want a fuller tour of the language itself, the Java track covers it in [[c1-syntax]], [[c1-primitives]] and [[c1-main-method]]. Here we stay focused on what problem-solving needs.

## The intuition: every solution is three stages

Picture the judge as a person who slides a sheet of paper under your door, waits, and then reads the sheet you slide back. Your program never talks to them in any other way. It does not open named files, it does not ask questions, and it does not get partial credit for an almost-correct format.

So every solution, however clever, has the same three stages:

1. **Read** the text the judge sent and turn it into variables and arrays.
2. **Compute** the answer from those variables.
3. **Write** the answer as text, in exactly the format the problem asks for.

```mermaid title="The three stages, with the tool chosen by input and output size"
flowchart LR
    IN(["stdin: text from the judge"]) --> R{"How much input?"}
    R -- "small, or learning" --> SC["Scanner"]
    R -- "around 100,000+ numbers" --> BR["BufferedReader + StringTokenizer"]
    SC --> ALG["Algorithm works on ints, longs and arrays"]
    BR --> ALG
    ALG --> W{"How much output?"}
    W -- "a few lines" --> PL["System.out.println"]
    W -- "many lines" --> SB["StringBuilder, then one print"]
    PL --> OUT(["stdout: compared with the expected answer"])
    SB --> OUT
```

Keeping the stages separate is a habit worth building from day one. When input parsing only fills variables, the algorithm only computes, and output only prints, a wrong answer can be traced to one stage. When `println` calls are sprinkled through the middle of a calculation, every bug looks like every other bug.

## The smallest program

Here is a complete Java program that a judge will accept. It reads nothing and prints `42`.

```java title="Main.java"
public class Main {
    public static void main(String[] args) {
        // 1) read input
        // 2) compute the answer
        // 3) print the answer
        System.out.println(42);
    }
}
```

```output
42
```

Two declarations matter here: the class and the `main` method.

**`public class Main`** declares a class named `Main` that any other code may use. Java requires a `public` class to live in a file with the same name, so this code must be saved as `Main.java`. Many judges save your submission as `Main.java` and therefore expect the class to be called `Main`; others accept any name. Check the judge's FAQ once, then use the name it expects every time — a mismatch is a compilation error, not a wrong answer, but it still costs a submission.

**`public static void main(String[] args)`** is the **entry point**: the method the Java Virtual Machine (JVM) calls when your program starts. Each word has a job:

- **`public`** — the JVM calls `main` from outside your class, so it must be visible from outside.
- **`static`** — the method belongs to the class itself, not to an object of the class. The JVM can call it without first creating a `Main` object.
- **`void`** — `main` returns nothing. The answer is communicated by printing, not by a return value.
- **`String[] args`** — the words typed after the program name on the command line. Judges almost never use them; the problem data arrives on standard input instead.

> [!NOTE] Newer Java versions relax this
> Java 25 finalised a simpler launch protocol (JEP 512) in which `main` may be non-`public`, non-`static` and without parameters. Judges run a range of JDK versions, so write the classic `public static void main(String[] args)`, which every version accepts.

Helper methods go in the same class, usually marked `static` so that `main` can call them directly without creating an object. That is why contest code is full of `static int solve(...)` and `static long gcd(...)`.

The word `public` is one of four **access levels**, which control who may use a class, method or field:

| Modifier | Who can use it |
|---|---|
| `public` | Any code anywhere |
| `protected` | Code in the same package, and subclasses |
| *(none)* | Code in the same package only |
| `private` | Code inside the same class only |

In a single-file contest solution everything is in one class and one package, so access levels rarely matter beyond `public class` and `public static void main`. They matter far more in real applications; see [[c1-access-modifiers]].

## Standard input and standard output

Every running program is given three text channels by the operating system, called **streams**:

| Stream | Java name | Job on a judge |
|---|---|---|
| Standard input (**stdin**) | `System.in` | The problem's input. Locally, your keyboard |
| Standard output (**stdout**) | `System.out` | Your answer. This is what the judge compares |
| Standard error (**stderr**) | `System.err` | Your own debug notes. Judges usually ignore it |

You never open a named file on a judge. You read `System.in` and write `System.out`, and the judge connects those streams to its own files.

You can reproduce exactly that setup on your machine. Save the program below as `Main.java`. It reads two integers and prints their sum.

```java title="Main.java"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}
```

```output
30
```

Create a file `input.txt` in the same folder containing the sample input `10 20`, then run two commands:

```bash
javac Main.java          # compile: creates Main.class
java Main < input.txt    # run, with input.txt connected to System.in
```

The `<` is **input redirection**. Without it, the program would sit and wait for you to type. With it, the shell connects the file to `System.in`, and the program cannot tell the difference between a file and a keyboard. This works the same way in macOS and Linux terminals and in the Windows Command Prompt. Testing like this — on the exact sample text from the problem statement — is how you catch formatting errors before the judge does. A correct number printed with an extra label such as `Sum: 30` is still a wrong answer.

## Reading input with Scanner

`Scanner` is the reader to learn first. It lives in the package `java.util`, so you import it, and you create it once, pointed at `System.in`:

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
```

`new Scanner(System.in)` creates a `Scanner` object that pulls characters from standard input. From then on you ask it for the next value in the type you want, and it does the conversion:

| Method | Returns | Example input it consumes |
|---|---|---|
| `nextInt()` | `int` | `25` |
| `nextLong()` | `long` | `9876543210` |
| `nextDouble()` | `double` | `25.75` |
| `next()` | the next word, as a `String` | `Hello` |
| `nextLine()` | the rest of the current line, as a `String` | `Hello World` |

The key idea is the **token**: a run of characters separated by whitespace. Spaces, tabs and newlines all count as separators, and `Scanner` skips any amount of them before reading the next token. So if the input is

```text
10 20 30
40 50
```

five calls to `nextInt()` return 10, 20, 30, 40 and 50. `Scanner` does not think in lines; it thinks in tokens. That is why a program written for "all numbers on one line" also works when the judge breaks them across lines.

Here is the first complete program worth studying: read `n`, then `n` integers, and print their sum.

```java title="Main.java"
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;                   // long: n ints can add up past the int limit
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
    }
}
```

```output
150
```

With the input `5` followed by `10 20 30 40 50`, the first `nextInt()` reads `5` into `n`, so the loop runs five times, and each iteration pulls the next token:

| Moment | Token read | `sum` afterwards |
|---|---|---|
| start | — | 0 |
| `i = 0` | 10 | 10 |
| `i = 1` | 20 | 30 |
| `i = 2` | 30 | 60 |
| `i = 3` | 40 | 100 |
| `i = 4` | 50 | 150 |

Notice that `sum` is a `long` even though every input is an `int`. The next section explains why that is not optional.

> [!TIP] One Scanner for the whole program
> Create a single `Scanner` and reuse it. A new `Scanner` per value is slow and can lose input that the first one had already buffered. Do not call `sc.close()` in the middle of the program either: closing a `Scanner` also closes `System.in`, and every later read fails. In contest code, leave it open.

## Choosing number types

Picking the wrong numeric type causes some of the most confusing wrong answers, because the program runs, prints a number, and the number is simply wrong.

Java's integer types have fixed sizes:

| Type | Size | Range |
|---|---|---|
| `byte` | 8 bits | −128 to 127 |
| `short` | 16 bits | −32,768 to 32,767 |
| `int` | 32 bits | −2,147,483,648 to 2,147,483,647 (about ±2.1 × 10⁹) |
| `long` | 64 bits | about ±9.2 × 10¹⁸ |

When an `int` calculation produces a value outside its range, Java does **not** throw an exception. The value wraps around — the bits that do not fit are discarded, and what remains is read as a (usually negative) number. This silent wrap is called **integer overflow**. Run this to see it:

```java title="Overflow.java"
public class Overflow {
    public static void main(String[] args) {
        int a = 2_000_000_000;
        int b = 2_000_000_000;
        System.out.println(a + b);              // int + int overflows

        long wrong = a * b;                     // multiplied as int, THEN widened
        long right = (long) a * b;              // a widened first, so * happens in long
        System.out.println(wrong);
        System.out.println(right);

        System.out.println(Integer.MAX_VALUE + 1);
    }
}
```

```output
-294967296
-1651507200
4000000000000000000
-2147483648
```

Three lessons sit in that output.

First, `a + b` should be four billion, but `int` tops out near 2.1 billion, so it wrapped to a negative number. The underscores in `2_000_000_000` are only for readability; Java ignores them.

Second, `long wrong = a * b` is still wrong. Java evaluates the right-hand side first, using the types of its operands. Both are `int`, so the multiplication happens in `int`, overflows, and only the already-wrong result is widened to `long`. The fix is to make one operand a `long` *before* the operation: `(long) a * b`. The cast applies to `a`, and Java then promotes `b` to `long` as well, so the multiplication itself is done in 64 bits.

Third, `Integer.MAX_VALUE + 1` is `Integer.MIN_VALUE`. Keep that in mind when you are tempted to use it as "infinity" later.

The practical rules are short:

- Use `int` for indexes, array lengths, loop counters and values the statement bounds within about ±2 × 10⁹.
- Use `long` for sums, products, counts of pairs, and anything that might exceed that. When `n` is 10⁵ and each value is up to 10⁹, the sum can reach 10¹⁴.
- A large literal needs an `L` suffix: `long x = 8_000_000_000L;`. Without it, `8_000_000_000` is an `int` literal that is too large, and the code does not compile.
- Write `sum += a[i]` with `sum` declared as a `long`. The compound assignment does the addition in `long`, so it is safe. Products still need the explicit cast.

The other types you will use constantly are `boolean` (`true` or `false`, for flags), `char` (one character in single quotes, such as `'A'`), `String` (text in double quotes), `double` (floating-point numbers, best avoided when an exact integer answer is possible), and arrays. `int[] nums = new int[n];` creates `n` integers, all starting at `0`; the first is `nums[0]` and the last is `nums[n - 1]`.

### Arrays versus ArrayList, and the boxing trap

When you do not know in advance how many values you will store, you can use `ArrayList<Integer>`, a list that grows as you add to it (taught fully in [[a1-arraylist]]). It has one important difference from `int[]`: Java collections can only hold objects, not primitive values. So an `ArrayList<Integer>` stores `Integer` objects, and Java converts automatically between `int` and `Integer`. The conversion from `int` to `Integer` is called **autoboxing**, and the reverse is **unboxing**.

| | `int[]` | `ArrayList<Integer>` |
|---|---|---|
| Size | Fixed when created | Grows as you add |
| Stores | primitive `int` values | `Integer` objects |
| Memory and speed | Lean | Extra object per element |
| Use when | `n` is known | Length is unknown, or you need list methods |

Boxing has a trap that catches many people. `==` on two objects asks whether they are the *same object*, not whether they hold the same value. Java caches `Integer` objects for small values (−128 to 127 by default), so small numbers happen to compare equal, and larger ones do not:

```java title="BoxingTrap.java"
public class BoxingTrap {
    public static void main(String[] args) {
        Integer x = 127, y = 127;
        Integer p = 1000, q = 1000;
        System.out.println(x == y);       // same cached object
        System.out.println(p == q);       // two different objects
        System.out.println(p.equals(q));  // compares the values
    }
}
```

```output
true
false
true
```

Code that compares `list.get(i) == list.get(j)` therefore passes small tests and fails on large values. Compare `Integer` objects with `equals`, or unbox them into `int` variables first. The cache is explained in [[c1-integer-cache]].

```quiz
Q: `a` and `b` are `int` variables, each equal to 100,000. What does `long r = a * b;` store?
- [ ] 10,000,000,000, because `r` is a `long`
- [x] A wrong, wrapped value, because the multiplication happens in `int` before the assignment
- [ ] Nothing — Java throws an `ArithmeticException`
- [ ] 10,000,000,000, because Java detects the overflow and switches to `long`
> Java evaluates `a * b` using the operands' types, which are both `int`. The product 10¹⁰ does not fit, wraps silently, and only then is widened. Writing `(long) a * b` makes the multiplication itself happen in 64 bits. Java never throws on integer overflow.

Q: Why does the sum program declare `long sum` when every input value is an `int`?
- [ ] `Scanner.nextInt()` returns a `long`
- [ ] `long` arithmetic is faster than `int`
- [x] The total of many `int` values can exceed about 2.1 billion, and an `int` would wrap to a wrong value
- [ ] `println` cannot print an `int`
> Each value fits in an `int`, but 10⁵ values of 10⁹ add up to 10¹⁴. Overflow does not raise an error, so the only protection is choosing a type with room for the total.
```

## Why Scanner gets slow

Your algorithm and your input reader are two separate costs. A loop that adds `n` numbers is O(n) whichever reader you use, but the constant cost per number differs a lot. `Scanner` is general-purpose: for every `nextInt()` it checks the next token against a pattern that understands signs, digit grouping and different number bases, and only then converts it. That work is invisible for a hundred numbers.

On inputs of around 10⁵ to 10⁶ numbers — common on Codeforces, CSES and similar judges, whose time limits are often one or two seconds — that per-token overhead can be enough to exceed the time limit even when the algorithm is optimal. `Scanner` is not *wrong*; it is the slow reader. The fix is a reader that does less work per token.

## BufferedReader and StringTokenizer

The standard fast approach in Java combines two classes: `BufferedReader`, which reads whole lines quickly, and `StringTokenizer`, which splits a line into tokens.

### BufferedReader reads a line at a time

Reading input one character at a time from the operating system is slow, like walking to a bookshelf for every letter of a book. A **buffer** is the fix: read a large chunk of characters into memory at once, then serve the program from that chunk. `BufferedReader` does exactly this. It is set up in one line that is worth reading from the inside out:

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
```

`System.in` delivers raw **bytes**. `InputStreamReader` decodes those bytes into **characters**, using the platform's character encoding. `BufferedReader` wraps that character source and adds the buffer, plus the method you actually use: `readLine()`, which returns the next whole line as a `String` without the line terminator.

`readLine()` gives you text, not numbers. The line `"5"` is still a `String`, and you convert it yourself:

```java
int n = Integer.parseInt(br.readLine().trim());   // "5" -> 5
long x = Long.parseLong(br.readLine().trim());     // for values beyond int
```

`trim()` removes whitespace at the two ends of the line, so a trailing space does not make `parseInt` throw `NumberFormatException`. When the input is exhausted, `readLine()` returns `null`, and calling `.trim()` on `null` throws `NullPointerException`. That crash usually means your program tried to read more lines than the input actually has — a sign you misread the input format.

`readLine()` can also throw `IOException`, a **checked exception** that Java forces you to either catch or declare. Contest code declares it on `main` with `throws Exception`, which means "if reading fails, let the program stop." That is acceptable on a judge, whose input is well formed.

### StringTokenizer splits a line into tokens

If the next line is `"10 20 30 40 50"`, `readLine()` returns that whole string. To get the separate numbers you split it with `StringTokenizer`, from `java.util`:

```java
StringTokenizer st = new StringTokenizer(br.readLine());
int a = Integer.parseInt(st.nextToken());   // "10" -> 10
int b = Integer.parseInt(st.nextToken());   // "20" -> 20
```

`nextToken()` returns the next whitespace-separated piece as a `String`, and `hasMoreTokens()` returns `true` while another token remains in *that line*. Here is the sum program rewritten with the fast reader:

```java title="Main.java"
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += Integer.parseInt(st.nextToken());
        }
        System.out.println(sum);
    }
}
```

```output
150
```

The `*` in `import java.io.*` means "every class in that package"; it brings in `BufferedReader` and `InputStreamReader`, while `java.util.*` brings in `StringTokenizer`.

> [!WARNING] This version only reads one line of numbers
> The tokenizer above was built from a single `readLine()`. If the judge splits the `n` numbers across several lines, `nextToken()` runs out of tokens and throws `NoSuchElementException`. `Scanner` never had this problem because it keeps reading tokens across the whole stream.

### A next() helper that works across lines

The fix is a small helper that reads another line whenever the current tokenizer is used up. It restores `Scanner`'s "tokens, not lines" behaviour at `BufferedReader` speed:

```java
static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
static StringTokenizer st;

static String next() throws IOException {
    while (st == null || !st.hasMoreTokens()) {
        st = new StringTokenizer(br.readLine());
    }
    return st.nextToken();
}

static int nextInt() throws IOException {
    return Integer.parseInt(next());
}
```

`st == null` means no line has been read yet; `!st.hasMoreTokens()` means the current line is used up, which also covers blank lines. In either case the loop reads another line and builds a new tokenizer, then returns its first token. `nextInt()` is `parseInt` on top. The helper assumes the tokens you ask for exist: if you ask for more than the input contains, `readLine()` returns `null` and `new StringTokenizer(null)` throws. That is fine on a judge with valid input.

| | `Scanner` | `BufferedReader` + `StringTokenizer` |
|---|---|---|
| Reads | Tokens, across lines | A line, which you then split |
| Next `int` | `nextInt()` | `Integer.parseInt(next())` |
| Next `long` | `nextLong()` | `Long.parseLong(next())` |
| Whole line | `nextLine()` | `readLine()` |
| Speed | Fine for small inputs | The usual choice for large inputs |
| Use when | Learning, interviews, small `n` | Roughly 10⁵ numbers or more |

> [!TIP] Which reader to use
> Use `Scanner` until reading input feels automatic. Switch to the fast reader when the statement promises a large input — often 10⁵ or more numbers. These cut-offs are rough guides: a fast reader does not rescue an O(n²) algorithm, and a ten-number input never needs one. In a live interview, `Scanner` (or no input code at all, when you are given a method signature) is normal.

## The nextInt / nextLine trap

Mixing token reads and line reads on a `Scanner` produces a famous bug. Suppose the input is a number on one line and a name on the next:

```text
3
Ada Lovelace
```

```java title="Trap.java"
import java.util.Scanner;

public class Trap {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String name = sc.nextLine();          // reads the rest of line 1: ""
        System.out.println("[" + name + "]");

        String real = sc.nextLine();          // now reads line 2
        System.out.println("[" + real + "]");
    }
}
```

```output
[]
[Ada Lovelace]
```

`nextInt()` is a token reader. It consumes `3` and stops, leaving the newline after it unread. `nextLine()` means "everything up to the end of the current line", and the current line still has nothing left on it, so it returns the empty string. The fix is to call `nextLine()` once to discard the leftover end of line, and then call it again to read the line you want. If a problem only contains numbers, use `nextInt()` and `nextLong()` throughout and you will never meet this trap. `BufferedReader` does not have it either, because every `readLine()` consumes a whole line.

## Printing the answer

Java gives you three printing methods on `System.out`:

- `print(x)` writes `x` and stays on the same line.
- `println(x)` writes `x` and then a line break.
- `printf(format, args...)` writes formatted text: `%d` for an integer, `%s` for a string, `%.2f` for a decimal rounded to two places, and `%n` for a line break.

For one answer, or a handful of lines, `println` is right. The problem appears when the answer is many lines — printing each of a million numbers with its own `println` call means a million separate trips through the output machinery. `System.out` flushes its output on every `println` by default, which makes this especially slow.

The fix is to build the whole output in memory and print it once. A **`StringBuilder`** is a growable buffer of characters (it is taught in detail in [[a1-strings-stringbuilder]]). You `append` to it, and nothing is printed until you hand it to `System.out` at the end:

```java title="BulkPrint.java"
public class BulkPrint {
    public static void main(String[] args) {
        int n = 5;
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            sb.append(i * i).append('\n');   // collect, do not print yet
        }
        System.out.print(sb);                // one output call
    }
}
```

```output
1
4
9
16
25
```

`append` accepts numbers, characters and strings, and returns the same builder, which is why calls can be chained. `sb.setLength(0)` empties the builder if you want to reuse it. Many contestants instead wrap the output in `PrintWriter out = new PrintWriter(new BufferedOutputStream(System.out));`, call `out.println(...)` freely, and finish with `out.flush()`. Both approaches work; the essential point is batching. If you use a `PrintWriter`, forgetting `flush()` (or `close()`) at the end means the buffered answer is never printed.

## Constants: static final MOD

Many problems ask for an answer "modulo 1,000,000,007", because the true answer — a count of paths, a large factorial — is far too big for any primitive type. Contest code names that number once, as a class-level constant:

```java
static final int MOD = 1_000_000_007;
```

The two keywords do different jobs, and it is worth separating them.

**`static`** decides who owns the variable. An ordinary field belongs to each object: if a `Student` class has `int age`, every student has their own age. A `static` field belongs to the class, so there is exactly one copy, shared by everyone and usable without creating an object. Because `main` is itself `static`, it can only use fields directly if they are `static` too.

**`final`** decides whether the variable can be reassigned. A `final` variable is assigned once; a second assignment is a compilation error:

```java
final int MAX = 100;
MAX = 200;   // does not compile: cannot assign a value to final variable MAX
```

Together, `static final` makes one shared value that cannot change — a **constant**. By convention, Java constants are written in capitals with underscores: `MOD`, `MAX_N`, `INF`. Naming the modulus once is shorter than repeating `1_000_000_007` at every operation, removes the risk of a typo in one copy, and lets you change it in one place when a problem uses `998_244_353` instead.

### Modular arithmetic without mistakes

`a % b` is the remainder when `a` is divided by `b`: `10 % 3` is `1` because 10 = 3 × 3 + 1, and `15 % 5` is `0`. The useful property for contests is that you may reduce after every addition and multiplication instead of only at the end:

- `(a + b) % MOD` equals `((a % MOD) + (b % MOD)) % MOD`
- `(a * b) % MOD` equals `((a % MOD) * (b % MOD)) % MOD`

So you keep every intermediate value small. Two details make or break this.

First, **Java's `%` can return a negative number**. The result takes the sign of the left operand, so `(-7) % 5` is `-2`, while the mathematical residue contests expect is `3`. Negative values appear naturally when you subtract, for example `(prefix[r] - prefix[l]) % MOD`. The repair is `((x % MOD) + MOD) % MOD`: the first `%` brings `x` into the range −(MOD−1) to MOD−1, adding `MOD` makes it non-negative, and the last `%` brings it back below `MOD`.

Second, **the multiplication must not overflow before the `%`**. Two values below 10⁹ + 7 multiply to nearly 10¹⁸, which overflows `int` but fits comfortably in `long` (whose limit is about 9.2 × 10¹⁸). So multiply in `long`, then reduce.

```java title="ModMath.java"
public class ModMath {
    static final int MOD = 1_000_000_007;

    static int norm(long x) {                 // any long -> range [0, MOD - 1]
        return (int) ((x % MOD + MOD) % MOD);
    }

    static int mul(int a, int b) {            // a, b already in [0, MOD - 1]
        return (int) ((long) a * b % MOD);    // multiply in long, then reduce
    }

    public static void main(String[] args) {
        System.out.println((-7) % 5);             // Java keeps the sign
        System.out.println(((-7) % 5 + 5) % 5);   // the residue contests want
        System.out.println(norm(-7));             // MOD - 7
        int a = 999_999_999, b = 999_999_999;
        System.out.println(a * b % MOD);          // overflowed before the %
        System.out.println(mul(a, b));            // correct
    }
}
```

```output
-2
3
1000000000
808348673
64
```

The first three lines show the sign rule and its repair: `-2` becomes `3` modulo 5, and `-7` becomes `MOD - 7` modulo `MOD`. Now look at the last two. Without the cast, `a * b` overflowed in `int`, and taking `% MOD` of that wrapped value produced a number that looks plausible and is simply wrong. `%` cannot undo an overflow that has already happened. The cast in `mul` fixes it. You can check the answer by hand: 999,999,999 is `MOD - 8`, so its square leaves the same remainder as (−8)² = 64. In `mul`, the expression `(long) a * b % MOD` is evaluated left to right: cast, multiply in `long`, then reduce.

## Infinity sentinels

Shortest-path algorithms start with a distance of `0` at the source and "unreachable" everywhere else. You represent "unreachable" with a **sentinel** — a value larger than any real distance.

`Integer.MAX_VALUE` is a poor choice, as you saw: the first time the algorithm computes `dist[u] + w` from an unreachable `u`, the sum wraps to a large negative number, which then looks like an excellent distance. Use a `long` that is far above any real answer but still leaves headroom below `Long.MAX_VALUE`, for example:

```java
static final long INF = 4_000_000_000_000_000_000L;   // 4e18; INF + INF still fits

long[] dist = new long[n];
java.util.Arrays.fill(dist, INF);
dist[source] = 0;
```

The `L` suffix is required. Then relax an edge only when `dist[u] != INF`, so the sentinel never takes part in arithmetic. Shortest paths themselves are taught in [[a8-dijkstra]].

## When long is not enough: BigInteger

Some problems want an exact integer that no primitive can hold — 100! has 158 digits. `java.math.BigInteger` represents integers of any size, limited only by memory. It is an object, so there are no operators: you call methods, and each method returns a *new* `BigInteger` rather than changing the old one.

```java title="Factorials.java"
import java.math.BigInteger;

public class Factorials {
    public static void main(String[] args) {
        long f = 1;
        for (int i = 2; i <= 21; i++) f *= i;     // 21! does not fit in a long
        System.out.println(f);

        BigInteger big = BigInteger.ONE;
        for (int i = 2; i <= 25; i++) {
            big = big.multiply(BigInteger.valueOf(i));   // returns a new object
        }
        System.out.println(big);
    }
}
```

```output
-4249290049419214848
15511210043330985984000000
```

20! is the largest factorial that fits in a `long`; 21! overflows to the negative value shown. `BigInteger.valueOf(i)` and `new BigInteger("123")` create values, and `add`, `subtract`, `multiply`, `mod` and `pow` do arithmetic. The line `big = big.multiply(...)` matters: writing `big.multiply(...)` alone computes a result and throws it away.

`BigInteger` is far slower than `long`. If the problem gives a modulus, the intended solution uses `long` and `%`, not `BigInteger`. Reach for it only when the problem genuinely needs an exact huge number.

| Situation | Type |
|---|---|
| Indexes, lengths, values within ±2 × 10⁹ | `int` |
| Sums, products, counts that fit in 64 bits | `long` |
| Answer required modulo 10⁹ + 7 | `long` products, reduced with `% MOD` |
| Exact huge value, no modulus | `BigInteger` |

## Worked example: a complete template

Many problems begin with `t`, the number of independent **test cases**, and then give each case in turn. Suppose each case is a line with `n` followed by `n` integers, and for each case you must print the sum and the maximum. A sample input is:

```text
3
4
3 -1 4 1
1
-5
5
1000000000 1000000000 1000000000 1000000000 1000000000
```

Here is a template that handles it, with every tool from this lesson in its place:

```java title="Main.java"
import java.io.*;
import java.util.*;

public class Main {
    static final int MOD = 1_000_000_007;
    static final long INF = 4_000_000_000_000_000_000L;

    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    static StringTokenizer st;

    static String next() throws IOException {
        while (st == null || !st.hasMoreTokens()) {
            st = new StringTokenizer(br.readLine());
        }
        return st.nextToken();
    }

    static int nextInt() throws IOException { return Integer.parseInt(next()); }

    static long nextLong() throws IOException { return Long.parseLong(next()); }

    public static void main(String[] args) throws IOException {
        int t = nextInt();
        StringBuilder out = new StringBuilder();
        while (t-- > 0) {
            int n = nextInt();
            long sum = 0;
            long max = -INF;                      // reset per test case
            for (int i = 0; i < n; i++) {
                long x = nextInt();
                sum += x;
                max = Math.max(max, x);
            }
            out.append(sum).append(' ').append(max).append('\n');
        }
        System.out.print(out);
    }
}
```

```output
7 4
-5 -5
5000000000 1000000000
```

Walk through it in the order it runs. The `static` fields create one `BufferedReader` and one current tokenizer for the whole program, so the `next()` helper can refill tokens across line breaks. `main` reads `t = 3`, then the loop `while (t-- > 0)` runs exactly three times: `t-- > 0` compares the current value with zero and then decrements it.

Inside each case, `sum` and `max` are declared fresh. That is deliberate. A classic multi-test bug is declaring an accumulator or a `visited` array *outside* the loop and forgetting to reset it, so the second case starts with the first case's leftovers. The third case shows why `sum` is a `long`: five values of 10⁹ add to 5 × 10⁹, which would have wrapped in an `int`. Each answer is appended to one `StringBuilder`, and a single `print` at the end writes all of it. `MOD` is unused here; it sits in the template so that a modular problem needs no extra setup.

Two input conventions come up so often that they belong next to this template. Graph problems usually number nodes from 1, while Java arrays start at 0, so subtract one as you read: `int u = nextInt() - 1;`. And prefix sums should be stored in a `long[]` — 10⁵ values of 10⁵ already total 10¹⁰:

```java
long[] pref = new long[n + 1];           // pref[i] = sum of the first i values
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + nextInt();
}
```

## Debugging without breaking the answer

When a solution misbehaves, you want to see its intermediate values. Print them to **standard error** with `System.err.println("n=" + n + " sum=" + sum);`. The judge compares only standard output, so these lines usually do not cause a wrong answer, although they still cost time on a large loop. Remove them before submitting anyway — some judges do look at stderr, and it keeps the code honest.

Java's `assert` statement checks a belief while you test: `assert n >= 1 : "n must be positive";`. Assertions are disabled by default and only run when you start the program with `java -ea Main`. Use them to catch your own wrong assumptions during practice, never to validate the judge's input.

## How it works under the hood

Two mechanisms explain most of the advice in this lesson.

**Why overflow wraps.** Java stores `int` values in 32-bit **two's complement**, where the top bit carries a negative weight. Adding 1 to `0111…1` (2,147,483,647) produces `1000…0`, whose value is −2,147,483,648. The hardware simply drops any carry out of the top bit, and the Java Language Specification defines integer arithmetic this way, so there is no exception to catch. `long` follows the same rule at 64 bits.

**Why buffering matters.** Each request to the operating system for more input or to emit more output is a relatively expensive system call. `BufferedReader` asks for thousands of characters per request and then serves `readLine()` from memory. On the output side, `System.out` is a `PrintStream` that, by default, flushes after every `println`; collecting text in a `StringBuilder` turns a million small writes into one large one. Neither change affects Big-O — they change the constant factor, which is what a time limit measures.

## In real systems

The skills here do not stay in contests. Backend services read and write streams constantly: a command-line tool processes `stdin` line by line, a log processor uses a `BufferedReader` over a file, and a service batches writes for exactly the reason you batch output. Overflow bugs are real production incidents — counters stored in `int`, money computed in floating point, or timestamps in milliseconds multiplied as `int`. Using `long` deliberately, and `Math.addExact` or `Math.multiplyExact` (which *do* throw on overflow) where silent wrapping would be dangerous, is ordinary professional practice. The Java track goes further in [[c1-buffered-io]] and [[c1-user-input]].

## Trade-offs and alternatives

Java is a solid choice for problem-solving. The standard library already provides sorting, hash maps, balanced trees, deques and priority queues, and static typing catches many mistakes before you submit. The costs are verbosity — a Python solution is often half the length — and a larger constant factor than C++, which occasionally matters on judges with tight limits. Deep recursion can also exhaust Java's default thread stack long before it would in C++; [[a1-recursion]] explains the usual workarounds.

Within Java, the choices in this lesson are trade-offs too. `Scanner` is shorter and safer for mixed input; the fast reader is faster but assumes well-formed input. `println` is simplest; `StringBuilder` is faster for big outputs. `long` is fast and exact up to 9.2 × 10¹⁸; `BigInteger` is exact for any size but slow. Pick by the constraints in the statement, not by habit.

## Common mistakes

**Using `int` for a sum or product.** The value wraps silently and the answer is wrong with no error. Declare accumulators as `long`, and cast before multiplying: `(long) a * b`.

**Building a `StringTokenizer` from one line and expecting it to read the next.** It crashes when the numbers continue on another line. Use the `next()` helper.

**`nextInt()` followed by `nextLine()`.** The `nextLine()` returns the empty remainder of the number's line. Discard it with one extra `nextLine()`.

**`println` for every element of a huge output.** It can turn an accepted solution into a time-limit failure. Batch into a `StringBuilder` and print once.

**Comparing `Integer` objects with `==`.** It works for values from −128 to 127 and fails above. Use `equals`, or compare unboxed `int` values.

**Using `Integer.MAX_VALUE` as infinity and adding to it.** It wraps to a large negative number. Use a `long` sentinel with headroom and never add to it.

**Forgetting that `%` can be negative.** After a subtraction, normalise with `((x % MOD) + MOD) % MOD`.

**A public class name that does not match the file name.** The judge reports a compilation error. Use the name it expects, usually `Main`.

**Reading past the end of input.** `readLine()` returns `null`, and the next method call on it throws `NullPointerException`. Re-read the input format.

> [!MISTAKE] Reaching for the fast template before understanding it
> Pasting a fast-I/O template you cannot explain makes every input bug a mystery. Learn `Scanner` first, then build the `next()` helper yourself once — after that, the template is yours.

## Interview perspective

In an interview you are often given a method signature, such as `public int[] twoSum(int[] nums, int target)`, and no input parsing at all. When you are asked to write a full program, interviewers look for a few signals: code that compiles, deliberate type choices, and the ability to explain what each line does.

> [!INTERVIEW] What a strong answer sounds like
> "I'll read with `Scanner` since the input is small. The sum goes in a `long` — there can be 10⁵ values up to 10⁹, so the total can reach 10¹⁴, past `int`. If `n` were 10⁶ I'd switch to `BufferedReader` with a tokenizer and build the output in a `StringBuilder`."

Questions you should be able to answer:

- **What does `public` mean on the class and on `main`?** The class and method are visible from anywhere; the JVM calls `main` from outside the class, so it must be public (and `static`, so no object is needed).
- **Why can five `nextInt()` calls read numbers spread over two lines?** `Scanner` reads whitespace-separated tokens and treats newlines as ordinary whitespace.
- **Why is `long r = a * b` still able to overflow?** The multiplication happens in `int` before the assignment; cast one operand first.
- **What do `BufferedReader` and `StringTokenizer` each do?** The first reads lines quickly through a buffer, using `InputStreamReader` to turn bytes into characters; the second splits a line into string tokens that you parse.
- **How do you get a non-negative remainder?** `((x % MOD) + MOD) % MOD`, and multiply in `long` before reducing.

A likely follow-up is *"What changes if `n` becomes 10⁶?"* — the algorithm must be about O(n log n) or better, input should use the fast reader, and output should be batched.

## Practice

Do these before moving on to the data-structure lessons. Test each one with `java Main < input.txt`.

1. **Sum of two.** Read two integers with `Scanner` and print their sum.
2. **Big sum.** Read `n` and `n` integers (each up to 10⁹, `n` up to 10⁵) with `BufferedReader` and `StringTokenizer`, and print the sum. Confirm the answer is right when every value is 10⁹.
3. **Across lines.** Make the previous program work when the numbers are split across several lines, using the `next()` helper.
4. **Bulk output.** Print the numbers 1 to 10⁶, one per line, using a `StringBuilder`. Compare the running time with a `println` loop.
5. **Modular power.** Compute 2ⁿ mod 1,000,000,007 for `n` up to 10⁶ with a loop, using `long` products.
6. **Exact factorial.** Print 100! with `BigInteger`.

## Quick revision {#quick-revision}

- Skeleton: `public class Main` in `Main.java`, entry point `public static void main(String[] args)`.
- `System.in` is the input, `System.out` the answer, `System.err` for debug notes. Test with `java Main < input.txt`.
- `Scanner` reads whitespace-separated tokens across lines: `nextInt`, `nextLong`, `next`, `nextLine`. Create one, never close it mid-program.
- `int` ≈ ±2.1 × 10⁹, `long` ≈ ±9.2 × 10¹⁸. Overflow wraps silently. Large literals need `L`.
- `(long) a * b`, not `a * b` stored in a `long`. Sums go in a `long`.
- Compare `Integer` objects with `equals`; `==` only works by accident for −128 to 127.
- Fast input: `BufferedReader(new InputStreamReader(System.in))`, `readLine`, `StringTokenizer`, `Integer.parseInt`. Use a `next()` helper to cross lines.
- After `nextInt()`, call `nextLine()` once to discard the rest of the line.
- Many output lines: `StringBuilder`, then one `print` (or a `PrintWriter` you flush).
- `static final int MOD = 1_000_000_007;` — `static` = one shared copy, `final` = cannot be reassigned.
- Non-negative remainder: `((x % MOD) + MOD) % MOD`. Multiply in `long` before `%`.
- Infinity: a `long` such as `4e18`, never `Integer.MAX_VALUE + 1`.
- `BigInteger` only for exact huge values; methods return new objects.

| Job | Tool |
|---|---|
| Small input, learning | `Scanner` |
| Large input | `BufferedReader` + `next()` helper |
| Token to number | `Integer.parseInt`, `Long.parseLong` |
| Few output lines | `System.out.println` |
| Many output lines | `StringBuilder`, one print |
| Sums, products, distances | `long` |
| Answer mod 10⁹ + 7 | `long` multiply, then `% MOD` |
| Exact huge number | `BigInteger` |

## Key takeaways {#key-takeaways}

- Every solution reads text from standard input, computes, and writes text to standard output; keep those three stages separate.
- `Scanner` reads tokens regardless of line breaks and is the right first tool; `BufferedReader` with `StringTokenizer` and a `next()` helper is the fast version for large inputs.
- Integer overflow never throws in Java. Choose `long` for sums and products, and cast before multiplying two `int` values.
- Batch large outputs in a `StringBuilder` and print once; the reader and printer affect the constant factor, which is what time limits measure.
- `static final` defines a shared constant; modular answers need `long` products and `((x % MOD) + MOD) % MOD` to stay correct and non-negative.
- Learn each line of your template well enough to explain it — that is what turns syntax from a source of bugs into something you no longer think about.
