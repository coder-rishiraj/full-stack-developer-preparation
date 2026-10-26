---
summary: Java strings cannot be changed after they are created, which makes them safe to share and hash but turns careless concatenation in a loop into an O(n²) bug. You will learn how String and StringBuilder work, how to read, compare and build text correctly, and the counting and two-pointer techniques behind most string interview problems.
difficulty: beginner
minutes: 45
objectives:
  - Explain what immutability means for `String` and predict which operations create new strings
  - Compare strings correctly with `equals` and explain why `==` sometimes appears to work
  - Derive why `+=` in a loop is O(n²) and rewrite it with `StringBuilder` in O(n)
  - Solve anagram and palindrome problems with an `int[26]` count and two pointers
  - Avoid the classic traps with `substring` bounds, `split`, character arithmetic and Unicode
---

## Introduction

Text is everywhere in software: user names, URLs, JSON, log lines, DNA sequences, and a large fraction of interview problems — anagrams, palindromes, compression, parsing, pattern matching. In Java, text is represented by the class **`String`**, and its single most important property is easy to state and easy to forget: **a `String` never changes after it is created**.

That property, called **immutability**, has big consequences. It makes strings safe to share between parts of a program and between threads, and safe to use as keys in a `HashMap`. But it also means that every method that seems to modify a string — `toUpperCase`, `replace`, `trim`, `+` — actually builds a brand-new one. Do that once and it costs nothing worth noticing. Do it inside a loop of 10⁵ iterations and a linear algorithm becomes quadratic, which is one of the most common reasons a correct Java solution exceeds its time limit.

Java's answer for building text piece by piece is **`StringBuilder`**, a mutable buffer of characters. This lesson covers both classes: how to read and compare strings, why concatenation in a loop is slow and how `StringBuilder` fixes it, and the techniques — counting characters, walking two pointers — that solve most string problems efficiently.

## Before you start

- **Java basics** — variables, loops, arrays and `char`. See [[a1-java-syntax-competitive]].
- **Big-O notation** — enough to compare O(n) with O(n²). See [[a1-time-complexity]].
- **Arrays as counters** — `count[x]++`. The [[a1-hashmap]] section of the collections lesson shows the general version with maps.

## The intuition: a printed page and a whiteboard

A `String` is like a printed page. You can read any letter on it instantly, photocopy part of it, or compare it with another page. You cannot erase a letter. To "change" it, you print a new page with the change, and the old page still exists until nobody is holding it.

A `StringBuilder` is a whiteboard. You can write at the end, rub out a letter, insert in the middle, or reverse the whole thing, all on the same board. When you are finished, you print a page from it (`toString()`) and hand that page around.

The rule that follows is simple: *read* with `String`, *build* with `StringBuilder`, and convert once at the end.

## Reading a String

A `String` is a sequence of `char` values, indexed from 0. The methods you will use constantly:

| Method | Returns | Cost |
|---|---|---|
| `s.length()` | Number of `char` values | O(1) |
| `s.charAt(i)` | The `char` at index `i` | O(1) |
| `s.substring(b, e)` | New string from index `b` (inclusive) to `e` (exclusive) | O(e − b) |
| `s.substring(b)` | From `b` to the end | O(n − b) |
| `s.indexOf(t)` | First index of `t`, or `-1` | O(n · m) worst case |
| `s.contains(t)`, `s.startsWith(t)` | `boolean` | O(n · m), O(m) |
| `s.toCharArray()` | A new `char[]` copy | O(n) |
| `s.equals(t)` | Whether the characters match | O(n) |
| `s.compareTo(t)` | Lexicographic order: negative, zero or positive | O(n) |

```java title="StringBasics.java"
public class StringBasics {
    public static void main(String[] args) {
        String s = "interview";
        System.out.println(s.length() + " " + s.charAt(0) + " " + s.charAt(s.length() - 1));
        System.out.println(s.substring(0, 5) + " | " + s.substring(5));
        System.out.println(s.indexOf("view") + " " + s.indexOf('z'));

        String upper = s.toUpperCase();      // a NEW string
        System.out.println(s + " " + upper); // s is unchanged

        char[] cs = s.toCharArray();         // a mutable copy
        cs[0] = 'I';
        System.out.println(new String(cs) + " " + s);
    }
}
```

```output
9 i w
inter | view
5 -1
interview INTERVIEW
Interview interview
```

The `substring` bounds follow the half-open convention used throughout Java: the start index is included and the end index is not, so `substring(0, 5)` has length `5 − 0 = 5`, and `substring(0, 5) + substring(5)` rebuilds the original. Off-by-one errors with the end index are the most common `substring` bug; `StringIndexOutOfBoundsException` means an index fell outside `0 … length()`.

`toUpperCase` did not change `s`; it returned a new string, which the program had to store in `upper`. Writing `s.toUpperCase();` on its own line computes a result and throws it away. The same is true of `trim`, `replace`, `strip` and `concat`. To edit characters in place, copy them into a `char[]` with `toCharArray()`, modify the array, and build a string at the end with `new String(cs)` or `String.valueOf(cs)`.

> [!NOTE] substring copies
> Before Java 7 update 6, `substring` shared the original string's character array and was O(1) — at the cost of keeping huge strings alive through tiny substrings. Since then it copies the characters, so a substring of length `k` costs O(k) time and memory. Calling `substring` inside a loop is therefore not free.

### Characters are small numbers

A `char` is a 16-bit unsigned number, and the letters `'a'` to `'z'` (and `'A'`–`'Z'`, `'0'`–`'9'`) have consecutive codes. That makes character arithmetic a standard tool:

- `c - 'a'` maps `'a'…'z'` to `0…25` — an index into a 26-element array.
- `c - '0'` turns a digit character into its value: `'7' - '0'` is `7`.
- `(char) ('a' + i)` goes the other way.

`Character` provides tests and conversions: `Character.isDigit(c)`, `isLetter(c)`, `isLetterOrDigit(c)`, `toLowerCase(c)`. One subtlety: `c - 'a'` has type `int`, so `char next = c + 1;` does not compile without a cast, while `c++` and `c += 1` do.

## Comparing strings: equals versus ==

`==` on two objects asks whether they are the **same object** in memory. `equals` asks whether they contain the **same characters**. For strings you almost always mean `equals`.

```java title="StringEquality.java"
public class StringEquality {
    public static void main(String[] args) {
        String a = "hello";
        String b = "hello";                  // literal: same pooled object as a
        String c = new String("hello");      // explicitly a new object
        String d = "hel" + "lo";             // constant expression: folded at compile time
        String part = "hel";
        String e = part + "lo";              // computed at run time: a new object

        System.out.println((a == b) + " " + (a == c) + " " + (a == d) + " " + (a == e));
        System.out.println(a.equals(c) + " " + a.equals(e));
        System.out.println(a == e.intern());
    }
}
```

```output
true false true false
true true
true
```

The first line is why `==` is so dangerous: it is *sometimes* true. Java keeps one shared copy of every string **literal** in a table called the **string pool**, so two identical literals — and compile-time constant expressions such as `"hel" + "lo"` — refer to the same object. Strings built at run time (from input, concatenation with a variable, `substring`, `StringBuilder.toString()`) are new objects, so `==` returns `false` even when the text matches. Tests written with literals pass and the real program fails. `intern()` returns the pooled copy, which is why the last line is `true`, but you do not need it in problem-solving — use `equals`. The pool is covered in [[c1-string-pool]] and [[c1-string-equals]].

Related methods: `equalsIgnoreCase(t)` ignores case, and `compareTo(t)` orders strings lexicographically by character code, so `"Zebra"` comes before `"apple"` and `"10"` before `"9"` (see [[a1-comparable-comparator]]). If a string might be `null`, write `"yes".equals(input)` rather than `input.equals("yes")`, which would throw `NullPointerException`.

Because strings are immutable, `String` can cache its hash code after the first `hashCode()` call, and a string key can never change after it is placed in a `HashMap` or `HashSet`. That is what makes strings such reliable keys.

## Why += in a loop is O(n²)

Consider building a string of `n` characters one at a time:

```java
String s = "";
for (int i = 0; i < n; i++) {
    s += (char) ('a' + i % 26);      // looks like O(1) per step
}
```

Since `s` cannot change, `s += c` means "allocate a new string of length `|s| + 1`, copy every character of the old `s` into it, add `c`, and point `s` at the new string". The old string becomes garbage. Count the characters copied:

| Iteration | Length of the old `s` | Characters copied |
|---|---|---|
| 1 | 0 | 0 |
| 2 | 1 | 1 |
| 3 | 2 | 2 |
| … | … | … |
| n | n − 1 | n − 1 |

The total is 0 + 1 + 2 + … + (n − 1) = n(n − 1)/2, which is **O(n²)**. For n = 10⁵ that is about 5 × 10⁹ character copies plus 10⁵ allocations — far beyond a typical time limit — while the "real" work, deciding each character, was O(n). Since Java 9 the compiler implements `+` with a more efficient mechanism (`invokedynamic` and `StringConcatFactory`), which speeds up a *single* expression like `"x=" + x + ", y=" + y`, but it cannot avoid the copy *across* loop iterations: each iteration still produces a new string from the previous one.

Concatenation outside loops is fine. `String msg = name + " scored " + score;` builds one string once, and is clearer than a builder.

## StringBuilder: the mutable buffer

A **`StringBuilder`** holds an internal array of characters with spare capacity — the same design as `ArrayList` ([[a1-arraylist]]). `append` writes into the spare space and only reallocates when the buffer is full, growing it by roughly doubling, so appending is **amortized O(1)** per character and building a string of length `n` is O(n) in total.

```java title="BuilderBasics.java"
public class BuilderBasics {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        sb.append("data").append('-').append(42).append(true);   // chained appends
        System.out.println(sb + " length=" + sb.length());

        sb.setCharAt(0, 'D');            // edit in place, O(1)
        sb.insert(4, "set");             // O(n): shifts the characters after index 4
        sb.deleteCharAt(sb.length() - 1);
        System.out.println(sb);

        sb.reverse();                    // in place, O(n)
        System.out.println(sb);

        String done = sb.toString();     // one copy into an immutable String
        sb.setLength(0);                 // clear and reuse the builder
        System.out.println(done + " | [" + sb + "]");
    }
}
```

```output
data-42true length=11
Dataset-42tru
urt24-tesataD
urt24-tesataD | []
```

| Operation | Cost |
|---|---|
| `append(x)` | O(1) amortized per character added |
| `charAt(i)`, `setCharAt(i, c)` | O(1) |
| `deleteCharAt(length() - 1)`, `setLength(k)` to shrink | O(1) |
| `insert(i, x)`, `deleteCharAt(i)` in the middle | O(n) — characters shift |
| `reverse()` | O(n) |
| `toString()` | O(n) — copies into a new `String` |

`append` is overloaded for every primitive type and for objects, and it returns the builder itself, which is why calls chain. If you know the final length, `new StringBuilder(n)` allocates it once. Call `toString()` once, at the end; calling it inside the loop reintroduces the copying you were trying to avoid. `deleteCharAt(sb.length() - 1)` is the cheap "undo the last character", which backtracking solutions use constantly ([[a1-recursion]]).

Two neighbours are worth knowing. **`String.join(", ", list)`** joins existing pieces with a separator in one call. **`StringBuffer`** is the older, synchronized twin of `StringBuilder`; every method takes a lock, which is pointless when one thread owns the buffer, so prefer `StringBuilder`.

### The fixed loop

```java title="BuildFast.java"
public class BuildFast {
    public static void main(String[] args) {
        int n = 30;
        StringBuilder sb = new StringBuilder(n);       // capacity known in advance
        for (int i = 0; i < n; i++) sb.append((char) ('a' + i % 26));
        String s = sb.toString();
        System.out.println(s + " " + s.length());
    }
}
```

```output
abcdefghijklmnopqrstuvwxyzabcd 30
```

Same result as the `+=` version, but every character is written once into the buffer and copied once by `toString()`: O(n) total.

```quiz
Q: Why does `s += c` inside a loop of n iterations cost O(n²) in total?
- [ ] Each `+=` triggers garbage collection
- [x] Each `+=` creates a new string and copies all characters built so far, and those copies sum to about n²/2
- [ ] `char` values must be converted to `String` objects one bit at a time
- [ ] The Java compiler cannot compile `+=` on strings efficiently in any version
> Strings are immutable, so appending means copying the old content into a new string. The copies grow by one each iteration: 0 + 1 + … + (n − 1) = n(n − 1)/2. Java 9's faster concatenation speeds up a single expression but cannot remove the copy between iterations.

Q: `String a = "hi"; String b = new StringBuilder("h").append('i').toString();` What do `a == b` and `a.equals(b)` print?
- [ ] true, true
- [x] false, true
- [ ] true, false
- [ ] false, false
> `b` is built at run time, so it is a different object from the pooled literal, and `==` compares object identity. `equals` compares the characters, which match. Always compare string content with `equals`.

Q: What is `"algorithm".substring(2, 5)`?
- [ ] "lgor"
- [x] "gor"
- [ ] "gori"
- [ ] "go"
> Indices 2, 3 and 4 are included and index 5 is excluded: 'g', 'o', 'r'. The length of `substring(b, e)` is always `e − b`.
```

## Worked example: anagrams with a count array

Two strings are **anagrams** if one is a rearrangement of the other: `"listen"` and `"silent"`. The simplest correct test sorts both strings' characters and compares — O(n log n). A faster approach counts. For lowercase English letters there are only 26 possible characters, so an `int[26]` holds the frequency of each. Increment for every character of the first string, decrement for every character of the second, and the strings are anagrams exactly when every count ends at zero.

```java title="Anagram.java"
public class Anagram {
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;     // cheap early exit
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));
        System.out.println(isAnagram("aab", "abb"));
        System.out.println(isAnagram("rat", "car"));
    }
}
```

```output
true
false
false
```

The loop is O(n), and the array is O(1) extra space because its size, 26, does not depend on the input. `"aab"` and `"abb"` contain the same *set* of letters but different counts, which is why a `HashSet` cannot do this job. If the alphabet is larger — all of ASCII, or arbitrary Unicode — use an `int[128]` or a `HashMap<Character, Integer>`. The same count array, used as the key of a map, groups anagrams together; frequency techniques are developed in [[a2-frequency-counting]].

## Worked example: a palindrome with two pointers

A **palindrome** reads the same forwards and backwards. *Decide whether a sentence is a palindrome, considering only letters and digits and ignoring case* — `"A man, a plan, a canal: Panama"` is one. You could build a cleaned, reversed copy with a `StringBuilder` and compare, which costs O(n) extra space. Two pointers do it in O(1) space: start one at each end, skip characters that do not count, compare, and move inward.

```java title="Palindrome.java"
public class Palindrome {
    static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            char a = s.charAt(l), b = s.charAt(r);
            if (!Character.isLetterOrDigit(a)) { l++; continue; }
            if (!Character.isLetterOrDigit(b)) { r--; continue; }
            if (Character.toLowerCase(a) != Character.toLowerCase(b)) return false;
            l++;
            r--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("race a car"));
        System.out.println(isPalindrome(" ,. "));
    }
}
```

```output
true
false
true
```

Each step moves `l` right or `r` left, so the loop runs at most `n` times: O(n) time, O(1) space. A string with no letters or digits counts as a palindrome because the pointers meet without finding a mismatch. The general technique is taught in [[a2-two-pointers]].

## Worked example: string compression

*Compress runs of repeated characters: `"aabcccccaaa"` becomes `"a2b1c5a3"`; return the original if the result is not shorter.* The output is built one piece at a time, which is exactly the job for a `StringBuilder`.

```java title="Compress.java"
public class Compress {
    static String compress(String s) {
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;   // end of this run
            sb.append(s.charAt(i)).append(j - i);
            i = j;
        }
        return sb.length() < s.length() ? sb.toString() : s;
    }

    public static void main(String[] args) {
        System.out.println(compress("aabcccccaaa"));
        System.out.println(compress("abc"));
    }
}
```

```output
a2b1c5a3
abc
```

| Run start `i` | Run end `j` | Character | Appended | Builder after |
|---|---|---|---|---|
| 0 | 2 | a | a2 | a2 |
| 2 | 3 | b | b1 | a2b1 |
| 3 | 8 | c | c5 | a2b1c5 |
| 8 | 11 | a | a3 | a2b1c5a3 |

The inner loop looks nested, but `j` only ever moves forward and `i` jumps to `j`, so every character is examined a constant number of times: O(n). With `result += ...` instead of a builder, the same algorithm would be O(n²) in the worst case (`"abcdef…"`, where every run has length 1).

## How it works internally

Since Java 9, a `String` stores its characters in a `byte[]` plus a flag called the **coder**. If every character fits in one byte (Latin-1), it uses one byte per character; otherwise it uses two bytes per character (UTF-16). This **compact strings** optimisation roughly halves the memory of typical English text and is invisible to your code — `charAt` and `length` behave identically. The class is `final` and its array is private and never modified after construction, which is what guarantees immutability.

`StringBuilder` keeps its own growable array and a count of used positions. `toString()` copies the used part into a new `String`, so the builder and the string never share storage, and later edits to the builder cannot affect strings already produced.

**Unicode caveat.** A Java `char` is a 16-bit UTF-16 **code unit**, not necessarily a whole character. Characters outside the Basic Multilingual Plane — most emoji, some rare scripts — take two `char`s, called a **surrogate pair**:

```java title="CodePoints.java"
public class CodePoints {
    public static void main(String[] args) {
        String s = "hi😀";
        System.out.println(s.length() + " " + s.codePointCount(0, s.length()));
        System.out.println(new StringBuilder(s).reverse());   // reverse keeps the pair intact
    }
}
```

```output
4 3
😀ih
```

`length()` counts `char`s, so it reports 4 for three visible characters. Interview problems almost always restrict input to ASCII, where this never arises, but when a problem really is about Unicode, iterate with `s.codePoints()` or `codePointAt`. `StringBuilder.reverse()` is careful to keep surrogate pairs in order; a hand-written char-swapping loop is not.

## Splitting and parsing

`s.split(regex)` breaks a string around matches of a **regular expression**, which causes two surprises. Characters like `.`, `|`, `+` and `*` are special in regular expressions, and trailing empty strings are dropped:

```java title="SplitTraps.java"
import java.util.Arrays;

public class SplitTraps {
    public static void main(String[] args) {
        System.out.println("a.b.c".split(".").length);                 // "." matches anything
        System.out.println(Arrays.toString("a.b.c".split("\\.")));     // escaped dot
        System.out.println(Arrays.toString("a,,b,,".split(",")));      // trailing empties dropped
        System.out.println(Arrays.toString("  two   spaces ".trim().split("\\s+")));
    }
}
```

```output
0
[a, b, c]
[a, , b]
[two, spaces]
```

Escape special characters (`"\\."`, `"\\|"`), use `split("\\s+")` on a trimmed string for "one or more whitespace", and pass a negative limit, `split(",", -1)`, to keep trailing empty strings. Converting is `Integer.parseInt(s)` one way and `String.valueOf(x)` or `Integer.toString(x)` the other. For large inputs, `split` allocates many small strings; the fast input techniques in [[a1-java-syntax-competitive]] avoid that.

## In real systems

Immutability is why strings are safe as keys in caches and configuration maps, safe to pass between threads, and safe to use for security checks: a file path or URL that has been validated cannot be changed afterwards by the caller. The O(n²) concatenation trap appears in production too — building a large CSV, SQL statement or log message with `+=` in a loop — and the fix is the same `StringBuilder`, or a `StringJoiner`/`Collectors.joining` for separated lists. Logging frameworks take format templates (`log.debug("user {} id {}", name, id)`) partly so that no string is built at all when the log level is disabled.

## Trade-offs and alternatives

| Tool | Use for | Avoid when |
|---|---|---|
| `String` | Reading, comparing, map keys, fixed text | Building text in a loop |
| `StringBuilder` | Building or editing text, reversing | Sharing between threads |
| `char[]` | Heavy in-place edits, swaps, sorting characters | You need `String` methods on the result repeatedly |
| `int[26]` / `int[128]` | Character counts over a small alphabet | Arbitrary Unicode — use a map |
| `String.join`, `StringJoiner` | Joining known pieces with a separator | Complex incremental building |

## Common mistakes

**Comparing with `==`.** It compares identity and passes tests built from literals. Use `equals`.

**Building strings with `+=` in a loop.** O(n²). Use a `StringBuilder` and call `toString()` once.

**Ignoring a returned string.** `s.trim();` alone does nothing useful. Write `s = s.trim();`.

**Off-by-one in `substring`.** The end index is exclusive; `substring(i, i + k)` has length `k`.

**Assuming `substring` is O(1).** It copies. Prefer working with indices into the original string.

**Splitting on an unescaped regex character.** `split(".")` and `split("|")` do not split on a literal dot or bar.

**Calling methods on a possibly null string.** Put the literal first: `"done".equals(status)`.

> [!MISTAKE] Using a HashSet to compare letter content
> A set records which letters appear, not how often. `"aab"` and `"abb"` have the same set of letters and are not anagrams. Count with an `int[26]` or a map.

## Interview perspective

String questions test whether you avoid hidden quadratic costs and whether you choose counting or two pointers over sorting and copying.

> [!INTERVIEW] What a strong answer sounds like
> "Strings are immutable, so I won't concatenate in the loop — that would copy the whole prefix every iteration, O(n²). I'll append to a `StringBuilder` and convert once, which is O(n). For the anagram check I'll count letters in an `int[26]`: O(n) time and constant space, better than sorting at O(n log n)."

Questions you should be able to answer:

- **Why is `String` immutable, and what does it buy?** Safe sharing across threads and callers, cacheable hash codes, safe map keys, and a shareable literal pool.
- **`String` vs `StringBuilder` vs `StringBuffer`?** Immutable text; a fast mutable buffer; the same buffer with synchronization, rarely needed.
- **Why can `==` return `true` for equal strings?** Identical literals share one pooled object; runtime-built strings do not.
- **What does `substring` cost?** O(k) for length `k`, since Java 7u6.
- **How do you check an anagram in O(n)?** A 26-element count array, incrementing for one string and decrementing for the other.

A follow-up to expect: *"What if the input can contain any Unicode character?"* — switch from `int[26]` to a map keyed by code point, and iterate with `codePoints()`.

## Practice

1. **Reverse words.** Reverse the order of words in a sentence, collapsing multiple spaces, using `trim`, `split("\\s+")` and a `StringBuilder`.
2. **Valid Anagram** and **Group Anagrams**, with a count-array key.
3. **Valid Palindrome II.** Decide whether deleting at most one character makes the string a palindrome.
4. **String compression in place** on a `char[]`, returning the new length.
5. **Longest common prefix** of an array of strings using `charAt` and indices only.
6. **Add binary strings** (`"1011" + "11"`), building the result right to left in a `StringBuilder` and reversing it.

## Quick revision {#quick-revision}

- `String` is immutable; methods like `toUpperCase`, `trim`, `replace` return new strings.
- `length()` and `charAt(i)` are O(1); `substring(b, e)` copies `e − b` characters and excludes `e`.
- Edit in place with `toCharArray()` → modify → `new String(cs)`.
- `c - 'a'` → 0…25; `c - '0'` → digit value; `(char) ('a' + i)` back.
- Compare content with `equals`; `==` is identity and only works by accident for pooled literals.
- `+=` in a loop: copies 0 + 1 + … + (n − 1) characters → O(n²). Fine outside loops.
- `StringBuilder`: amortized O(1) `append`, O(1) `setCharAt` and delete-last, O(n) `insert`/`reverse`/`toString`. `setLength(0)` clears. Prefer it to `StringBuffer`.
- Anagram: `int[26]` counts, O(n) time, O(1) space. Palindrome: two pointers, O(1) space.
- `split` takes a regex: escape `.` and `|`; trailing empties are dropped unless the limit is negative.
- `char` is a UTF-16 code unit; emoji use two. Use `codePoints()` for real Unicode work.

## Key takeaways {#key-takeaways}

- A `String` never changes; every "modification" creates a new string, which makes strings safe to share and hash.
- Concatenating in a loop copies the growing prefix each time and costs O(n²); a `StringBuilder` builds the same text in O(n).
- Compare strings with `equals`; `==` checks identity and is unreliable for content.
- Most string problems are solved with counting arrays or two pointers over indices, not with sorting or building copies.
- Know the traps — exclusive `substring` ends, regex `split`, ignored return values and surrogate pairs — and string code becomes predictable.
