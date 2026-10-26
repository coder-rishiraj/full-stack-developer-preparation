---
summary: An array is Java's most basic container, a fixed-length row of values of one type stored side by side in memory. You will learn how to create, index, copy and compare arrays, how they behave as objects, how grids are built from arrays of arrays, and when to reach for ArrayList instead.
difficulty: beginner
minutes: 60
objectives:
  - Create and initialise arrays, predict their default values, and read and write elements without going out of bounds
  - Explain why arrays behave like objects, including aliasing, what == and equals compare, and what a method can change
  - Copy arrays correctly with clone, Arrays.copyOf and System.arraycopy, and recognise when a copy is shallow
  - Build and traverse rectangular and jagged multidimensional arrays and copy them without sharing rows
  - Choose between an array and an ArrayList and convert between them without the common traps
---

## Introduction

Most programs work with *many* values of the same kind: the temperatures for a week, the pixels of an image, the scores of every player in a game. You could declare `int score0, score1, score2…`, but that falls apart immediately. You cannot loop over separate variables, you cannot choose how many to create while the program runs, and you cannot pass "all of them" to a method in one argument.

An **array** solves that. It is a single object that holds a fixed number of values of one type, each identified by a numeric position called its **index**. `int[] scores = new int[100];` creates room for one hundred `int` values in one step, and `scores[42]` reads the forty-third of them. Because every element has the same type and therefore the same size, the Java Virtual Machine (JVM) can store them next to each other in memory and find any element in constant time by arithmetic on its index.

Arrays matter far beyond beginner exercises. Every `ArrayList` keeps its elements in an array behind the scenes. `HashMap` stores its buckets in an array. A `String` keeps its characters in a `byte[]`. File and network input arrives in `byte[]` buffers, and image libraries hold pixels in `int[]`. Even your program's entry point, `main(String[] args)`, receives its command-line arguments as an array. Understanding arrays well — including how they behave as objects — explains a large part of how the rest of the Java library works.

This lesson teaches arrays from the ground up, then covers two closely related topics: arrays with more than one dimension, and the choice between a plain array and an `ArrayList`.

## Before you start

You need:

- **Primitive and reference types** — the difference between a variable that holds a value and one that holds a reference to an object. See [[c1-types]], especially [[c1-reference-types]].
- **Loops** — the classic `for` loop and the enhanced `for`. See [[c1-loops]].
- **Methods** — how to call a static method and pass arguments. A basic reading knowledge is enough; [[c1-methods]] covers it fully.

## The intuition

Picture a row of numbered lockers in a school corridor. The row is built once, with a fixed number of lockers, and each locker is the same size. Lockers are numbered from 0, so a row of five has lockers 0 to 4. To reach locker 3 you do not open lockers 0, 1 and 2 first; you walk straight to it, because you know exactly how far along the corridor it is.

An array works the same way. Its length is chosen when it is created and never changes. Every slot holds one value of the declared type. Reaching slot `i` takes the same time whether `i` is 3 or 3 million, because the JVM computes the slot's address directly: start of the array plus `i` times the size of one element.

The analogy breaks in one useful place. A variable of array type is not the corridor itself; it is a note saying *where* the corridor is. Two variables can hold notes pointing to the same corridor, and that has consequences you will see shortly.

## Creating arrays

An array type is written as the element type followed by square brackets: `int[]` is "array of `int`", `String[]` is "array of `String`". There are three ways to create one.

**With `new` and a length.** `new int[4]` creates an array of four `int` elements. The length can be any non-negative `int` expression, including one computed at run time, such as `new int[userCount]`. A negative length throws `NegativeArraySizeException`, and a length of zero is legal and useful — an empty array is a better "no results" value than `null`.

**With an array initialiser.** `int[] primes = {2, 3, 5, 7, 11};` creates an array whose length is the number of values listed. This short form works only in a declaration.

**With `new` and an initialiser.** `new int[] {2, 3, 5}` creates and fills an array anywhere an expression is allowed, for example when passing it straight to a method: `printAll(new String[] {"a", "b"})`. You may not give both a length and values: `new int[3] {1, 2, 3}` does not compile.

When an array is created with only a length, every element starts with its type's **default value**: `0` for numeric types, `0.0` for `float` and `double`, `false` for `boolean`, the character `'\u0000'` for `char`, and `null` for any reference type. This differs from local variables, which have no default and must be assigned before use. The program below shows the defaults and basic indexing.

```java title="ArrayBasics.java"
import java.util.Arrays;

public class ArrayBasics {
    public static void main(String[] args) {
        int[] scores = new int[4];           // four ints, all 0
        double[] prices = new double[2];     // 0.0
        boolean[] flags = new boolean[2];    // false
        String[] names = new String[3];      // null references

        System.out.println(Arrays.toString(scores));
        System.out.println(Arrays.toString(prices));
        System.out.println(Arrays.toString(flags));
        System.out.println(Arrays.toString(names));

        scores[0] = 90;
        scores[3] = 75;
        System.out.println(Arrays.toString(scores) + " length " + scores.length);

        int[] primes = {2, 3, 5, 7, 11};     // initialiser: length inferred
        System.out.println("last prime: " + primes[primes.length - 1]);

        try {
            System.out.println(primes[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

```output
[0, 0, 0, 0]
[0.0, 0.0]
[false, false]
[null, null, null]
[90, 0, 0, 75] length 4
last prime: 11
Index 5 out of bounds for length 5
```

Three details deserve attention. First, `length` is a **field**, not a method: write `scores.length`, not `scores.length()` (strings and collections use methods, which is a frequent source of compile errors). Second, valid indices run from `0` to `length - 1`, so the last element is always `a[a.length - 1]`. Third, Java checks every index at run time. Reading `primes[5]` on a five-element array throws `ArrayIndexOutOfBoundsException` instead of quietly reading whatever memory comes next, as C would. That check turns a whole class of security holes into an ordinary exception.

`Arrays.toString` comes from `java.util.Arrays`, a utility class you will use constantly; printing an array directly does something much less helpful, as the next section shows.

> [!NOTE] Two places for the brackets
> Java also accepts the C-style declaration `int scores[]`. It means the same thing, but it splits the type across the variable name, and in `int[] a, b[];` the variable `b` silently becomes a two-dimensional array. Put the brackets on the type: `int[] scores`.

## Arrays are objects

An array is an object on the heap, and an array variable holds a **reference** to it. Everything you learned about reference types in [[c1-reference-types]] applies: assignment copies the reference, `==` compares references, and a method receives a copy of the reference. The program below makes each of these visible.

```java title="Aliasing.java"
import java.util.Arrays;

public class Aliasing {
    static void doubleAll(int[] values) {
        for (int i = 0; i < values.length; i++) {
            values[i] *= 2;                  // writes into the caller's array
        }
    }

    static void replace(int[] values) {
        values = new int[] {0, 0, 0};        // only the local copy of the reference changes
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3};
        int[] b = a;                         // same array, second name
        b[0] = 100;
        System.out.println(Arrays.toString(a));

        doubleAll(a);
        replace(a);
        System.out.println(Arrays.toString(a));

        int[] c = {200, 4, 6};
        System.out.println(a == c);                 // different objects
        System.out.println(a.equals(c));            // arrays inherit Object.equals: also ==
        System.out.println(Arrays.equals(a, c));    // element by element
        System.out.println(a);                      // Object.toString: type@hash
    }
}
```

```output
[100, 2, 3]
[200, 4, 6]
false
false
true
[I@2b2fa4f7
```

Follow it line by line. `int[] b = a;` does not copy any numbers. It copies the reference, so `a` and `b` are two names for one array — this is **aliasing** — and writing `b[0] = 100` is visible through `a`.

`doubleAll` receives a copy of the reference, follows it, and changes the elements of the caller's array. `replace` also receives a copy of the reference, but it overwrites that copy with a reference to a brand-new array; the caller's variable `a` still points to the original. This is the same rule as for any object: **Java passes everything by value, and for an array the value is the reference.** A method can change an array's contents, but it cannot make the caller's variable point at a different array.

The last four lines show the comparison traps. `a == c` is `false` because they are two different array objects, even though they now contain identical numbers. Surprisingly, `a.equals(c)` is also `false`. Arrays do not override `equals`; they inherit the version from `Object`, which is the same reference test as `==`. To compare contents, use `Arrays.equals(a, c)`. Similarly, arrays do not override `toString`, so printing `a` gives `[I@` followed by a hexadecimal hash code (the hex part differs between runs). `[I` is the JVM's internal name for "array of `int`". Use `Arrays.toString(a)` to see the elements.

> [!WARNING] Arrays in hash-based collections
> Because arrays use identity-based `equals` and `hashCode`, putting an `int[]` into a `HashSet` or using it as a `HashMap` key compares arrays by identity, not contents. Two arrays holding `{1, 2}` are different keys. Wrap the data in a `List` or a record, or use `Arrays.hashCode` and `Arrays.equals` explicitly.

### Iterating over an array

There are two everyday ways to visit every element. The classic indexed loop, `for (int i = 0; i < a.length; i++)`, gives you the index, which you need when you write to the array, compare neighbours (`a[i]` and `a[i + 1]`), or walk backwards. The enhanced `for`, `for (int x : a)`, gives you each element in order and nothing else. It is shorter and cannot go out of bounds, but assigning to `x` changes only a local copy, not the array — the reason is covered in [[c1-loops]].

A third way is a stream: `Arrays.stream(a).sum()` or `Arrays.stream(a).filter(x -> x > 0).count()`. Streams are concise for aggregations; they are taught in [[c1-streams]]. For simple loops in performance-critical code, the plain loop remains the clearest choice.

## Copying arrays

Because assignment only copies the reference, you need an explicit operation when you want a second, independent array. Java offers four, and they differ in what they let you control.

```java title="Copying.java"
import java.util.Arrays;

public class Copying {
    public static void main(String[] args) {
        int[] original = {5, 1, 4, 2, 3};

        int[] cloned = original.clone();
        int[] longer = Arrays.copyOf(original, 7);          // pads with 0
        int[] middle = Arrays.copyOfRange(original, 1, 4);  // indices 1, 2, 3

        int[] shifted = {1, 2, 3, 4, 5, 0};
        System.arraycopy(shifted, 0, shifted, 1, 5);        // overlapping move is safe

        cloned[0] = 99;
        System.out.println(Arrays.toString(original));
        System.out.println(Arrays.toString(cloned));
        System.out.println(Arrays.toString(longer));
        System.out.println(Arrays.toString(middle));
        System.out.println(Arrays.toString(shifted));

        StringBuilder[] builders = {new StringBuilder("a"), new StringBuilder("b")};
        StringBuilder[] shallow = builders.clone();
        shallow[0].append("!");                             // same StringBuilder object
        System.out.println(Arrays.toString(builders));
    }
}
```

```output
[5, 1, 4, 2, 3]
[99, 1, 4, 2, 3]
[5, 1, 4, 2, 3, 0, 0]
[1, 4, 2]
[1, 1, 2, 3, 4, 5]
[a!, b]
```

`clone()` returns a new array of the same length and type with the same elements; changing `cloned[0]` leaves `original` alone. `Arrays.copyOf(array, newLength)` does the same but lets you choose the length: shorter truncates, longer pads with default values. This is exactly how `ArrayList` grows. `Arrays.copyOfRange(array, from, to)` copies a slice, with `from` inclusive and `to` exclusive, the same convention as `String.substring`.

`System.arraycopy(src, srcPos, dest, destPos, length)` is the low-level primitive the others are built on. It copies into an array that already exists, and it is defined to behave as if the source range were first copied to a temporary buffer, so overlapping ranges inside one array are handled correctly. The example shifts five elements one place to the right in place — the operation `ArrayList.add(index, element)` performs when you insert into the middle of a list.

The last three lines show the most important limit: **all of these copies are shallow**. For a primitive array, a shallow copy is a full copy, because the elements are the numbers themselves. For an array of objects, the elements are references, so the copy is a new array holding the same references. `shallow[0]` and `builders[0]` are the same `StringBuilder`, and appending through one is visible through the other. To get a deep copy you must copy each element object yourself, which only makes sense if the element type offers a way to do that. For immutable element types such as `String` and `Integer`, shallow copies are perfectly safe, because nobody can change the shared objects.

## The java.util.Arrays toolkit

Arrays themselves have almost no methods; the useful operations live as static methods in `java.util.Arrays`. You have already seen `toString`, `equals`, `copyOf` and `copyOfRange`. A few more come up constantly.

```java title="ArraysToolkit.java"
import java.util.Arrays;

public class ArraysToolkit {
    public static void main(String[] args) {
        int[] data = {42, 7, 19, 3, 25};
        Arrays.sort(data);
        System.out.println(Arrays.toString(data));
        System.out.println(Arrays.binarySearch(data, 19));
        System.out.println(Arrays.binarySearch(data, 20));   // -(insertion point) - 1

        int[] filled = new int[5];
        Arrays.fill(filled, -1);
        System.out.println(Arrays.toString(filled));

        int[] squares = new int[6];
        Arrays.setAll(squares, i -> i * i);
        System.out.println(Arrays.toString(squares));

        System.out.println(Arrays.stream(data).sum());
        System.out.println(Arrays.mismatch(new int[] {1, 2, 3}, new int[] {1, 2, 4}));

        String[] words = {"pear", "Fig", "apple", "banana"};
        Arrays.sort(words);                                  // natural order: uppercase first
        System.out.println(Arrays.toString(words));
        Arrays.sort(words, String.CASE_INSENSITIVE_ORDER);
        System.out.println(Arrays.toString(words));
    }
}
```

```output
[3, 7, 19, 25, 42]
2
-4
[-1, -1, -1, -1, -1]
[0, 1, 4, 9, 16, 25]
96
2
[Fig, apple, banana, pear]
[apple, banana, Fig, pear]
```

`Arrays.sort` sorts in place in O(n log n) time. For primitive arrays it uses a tuned dual-pivot quicksort; for object arrays it uses TimSort, a merge-sort variant that is **stable** (equal elements keep their original order). Stability is why sorting objects by one key and then another works as expected, and it does not matter for primitives because two equal `int`s are indistinguishable. Object arrays sort by their natural order (`Comparable`) unless you pass a `Comparator`, as the last call does; see [[c1-comparable-comparator]].

`Arrays.binarySearch` finds a value in a *sorted* array in O(log n) time. When the value is missing, it returns `-(insertionPoint) - 1`: here `20` would be inserted at index 3, so the result is `-4`. The negative encoding means "not found" can never be confused with a real index. The algorithm itself is taught in [[a3-binary-search]]. `Arrays.fill` sets every element to one value, `Arrays.setAll` computes each element from its index using the function you pass (here the lambda `i -> i * i`, a short inline function covered in [[c1-lambdas]]), and `Arrays.mismatch` returns the first index at which two arrays differ (or `-1` if they are equal).

## Array covariance and ArrayStoreException

Arrays of reference types are **covariant**: if `String` is a subtype of `Object`, then `String[]` is a subtype of `Object[]`. That lets a method declared as `void printAll(Object[] items)` accept a `String[]`. It also opens a hole that the compiler cannot close, so the JVM closes it at run time.

```java title="Covariance.java"
public class Covariance {
    public static void main(String[] args) {
        String[] strings = {"a", "b"};
        Object[] objects = strings;          // allowed: String[] is a subtype of Object[]
        try {
            objects[0] = 42;                 // compiles, but the real array holds Strings
        } catch (ArrayStoreException e) {
            System.out.println("ArrayStoreException: " + e.getMessage());
        }
        System.out.println(new int[0].getClass().getName());
        System.out.println(strings.getClass().getName());
        System.out.println(new int[3][3].getClass().getName());
    }
}
```

```output
ArrayStoreException: java.lang.Integer
[I
[Ljava.lang.String;
[[I
```

The compiler sees `objects` as an `Object[]`, and an `Integer` is an `Object`, so the assignment compiles. But every array remembers its real element type, and at run time the JVM checks each store into an array of references. The real array is a `String[]`, so storing an `Integer` throws `ArrayStoreException`. The last three lines print the JVM's names for array classes: `[I` for `int[]`, `[Ljava.lang.String;` for `String[]`, and `[[I` for `int[][]` — one `[` per dimension.

Generic collections took the opposite decision: `List<String>` is *not* a subtype of `List<Object>`, so the mistake is caught at compile time instead. Because generic type arguments are erased at run time and arrays need to know their element type, Java also forbids creating arrays of generic types: `new T[10]` and `new List<String>[10]` do not compile. This tension between arrays and generics is a large part of why modern Java code prefers `List` for collections of objects. See [[c1-generics]] and [[c1-type-erasure]].

## Multidimensional Arrays {#c1-multidimensional-arrays}

A **multidimensional array** is an array whose elements are themselves arrays. Java has no special grid type; `int[][]` means "array of `int[]`". A spreadsheet of numbers, a game board, an image's pixels and the distance table between cities are all naturally two-dimensional, and you reach any cell with two indices: `grid[row][column]`.

### Creating and indexing grids

`new int[3][4]` creates a **rectangular** array: an outer array of length 3 whose elements are three separate `int[4]` arrays, all filled with zeros. The first index chooses the row, the second the column. `grid.length` is the number of rows, and `grid[r].length` is the length of row `r`.

```java title="Grid.java"
import java.util.Arrays;

public class Grid {
    public static void main(String[] args) {
        int[][] grid = new int[3][4];        // 3 rows, each an int[4]
        grid[1][2] = 7;
        System.out.println(grid.length + " rows, " + grid[0].length + " columns");
        System.out.println(Arrays.deepToString(grid));
        System.out.println(Arrays.toString(grid[1]));

        int[][] triangle = new int[4][];     // rows not created yet
        System.out.println(Arrays.toString(triangle));
        for (int r = 0; r < triangle.length; r++) {
            triangle[r] = new int[r + 1];    // each row its own length
            triangle[r][0] = 1;
            triangle[r][r] = 1;
            for (int c = 1; c < r; c++) {
                triangle[r][c] = triangle[r - 1][c - 1] + triangle[r - 1][c];
            }
        }
        for (int[] row : triangle) {
            System.out.println(Arrays.toString(row));
        }

        int[][] board = {
            {1, 2, 3},
            {4, 5, 6}
        };
        int total = 0;
        for (int r = 0; r < board.length; r++) {
            for (int c = 0; c < board[r].length; c++) {
                total += board[r][c];
            }
        }
        System.out.println("total = " + total);
    }
}
```

```output
3 rows, 4 columns
[[0, 0, 0, 0], [0, 0, 7, 0], [0, 0, 0, 0]]
[0, 0, 7, 0]
[null, null, null, null]
[1]
[1, 1]
[1, 2, 1]
[1, 3, 3, 1]
total = 21
```

`Arrays.deepToString` prints nested arrays; plain `Arrays.toString(grid)` would print three `[I@…` references. `grid[1]` on its own is an ordinary `int[]` — a whole row — which you can pass to any method that takes a one-dimensional array.

The second part builds Pascal's triangle and shows something many languages cannot do: a **jagged** array, where rows have different lengths. `new int[4][]` creates only the outer array, with four `null` slots, and each row is created separately with its own length. This saves memory for triangular data such as a symmetric distance table, and it is the reason the inner loop condition is `c < board[r].length` rather than a fixed column count: when rows can differ, ask each row for its own length.

The third part uses a nested initialiser, where each inner `{…}` becomes one row, and the standard nested loop that visits cells **row by row**. The outer loop chooses a row; the inner loop walks across it.

### How a 2D array is laid out in memory

Because a 2D array is an array of references to separate row arrays, a `new int[3][4]` is really four objects: one outer array holding three references, and three `int[4]` rows, each stored contiguously but placed independently on the heap.

```mermaid title="int[][] grid = new int[3][4] is one outer array plus three row objects"
flowchart LR
    G["grid (local variable)"] --> O["outer int[][] : ref0, ref1, ref2"]
    O --> R0["row 0 int[4] : 0 0 0 0"]
    O --> R1["row 1 int[4] : 0 0 7 0"]
    O --> R2["row 2 int[4] : 0 0 0 0"]
```

This layout has two practical consequences. The first is **traversal order**. Elements within one row are adjacent in memory, so visiting `grid[r][0]`, `grid[r][1]`, `grid[r][2]` in turn reads memory sequentially, which modern CPUs load efficiently into their caches. Looping column by column instead jumps from row object to row object on every step. Both give the same answer, but on large grids the row-by-row order can be several times faster. Write the row loop outside and the column loop inside unless the problem needs otherwise.

The second consequence is that **copies are shallow at every level**, which the next program demonstrates.

### Copying and comparing grids

```java title="GridCopy.java"
import java.util.Arrays;

public class GridCopy {
    public static void main(String[] args) {
        int[][] original = {{1, 2}, {3, 4}};

        int[][] shallow = original.clone();          // copies the two row references
        shallow[0][0] = 99;                          // same row object as original[0]
        System.out.println(Arrays.deepToString(original));

        int[][] deep = new int[original.length][];
        for (int r = 0; r < original.length; r++) {
            deep[r] = original[r].clone();           // a new array for every row
        }
        deep[1][1] = -1;
        System.out.println(Arrays.deepToString(original));
        System.out.println(Arrays.deepToString(deep));

        int[][] shared = new int[3][];
        int[] row = new int[2];
        Arrays.fill(shared, row);                    // three slots, ONE row object
        shared[0][0] = 5;
        System.out.println(Arrays.deepToString(shared));

        System.out.println(Arrays.equals(original, original.clone()));
        System.out.println(Arrays.equals(original, deep));
        System.out.println(Arrays.deepEquals(new int[][] {{1}}, new int[][] {{1}}));
    }
}
```

```output
[[99, 2], [3, 4]]
[[99, 2], [3, 4]]
[[99, 2], [3, -1]]
[[5, 0], [5, 0], [5, 0]]
true
false
true
```

`original.clone()` copies the outer array only. The copy's elements are the same row references, so writing `shallow[0][0]` changes `original` too. A real copy of a grid needs a new array for every row, which is what the loop building `deep` does; after it, changing `deep[1][1]` leaves `original` untouched.

The `shared` example shows a bug that appears in interview code surprisingly often. `Arrays.fill(shared, row)` puts the *same* row reference into every slot, so the "three rows" are one row seen three times. Create each row with its own `new` inside a loop.

Comparison has the same shape. `Arrays.equals` compares the elements of the outer arrays — which are row references — with `equals`, and since arrays inherit identity-based `equals`, two grids with equal contents but different row objects compare as unequal. `Arrays.deepEquals` recurses into nested arrays and compares the actual numbers. The same pair exists for printing (`toString` versus `deepToString`) and hashing (`hashCode` versus `deepHashCode`).

### Grid traversal patterns

Grid problems — flood fill, counting islands, shortest path in a maze — are a large family of interview questions, and they all start with "visit the neighbours of a cell". The clean way is a small table of direction offsets instead of four copied `if` blocks.

```java title="Neighbours.java"
public class Neighbours {
    static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};   // up, down, left, right

    static int countLandNeighbours(char[][] map, int r, int c) {
        int count = 0;
        for (int[] d : DIRS) {
            int nr = r + d[0], nc = c + d[1];
            boolean inside = nr >= 0 && nr < map.length && nc >= 0 && nc < map[nr].length;
            if (inside && map[nr][nc] == '#') {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        char[][] map = {
            "#.#".toCharArray(),
            "###".toCharArray(),
            "..#".toCharArray()
        };
        System.out.println(countLandNeighbours(map, 1, 1));
        System.out.println(countLandNeighbours(map, 0, 0));
        System.out.println(countLandNeighbours(map, 2, 0));
    }
}
```

```output
2
1
1
```

The bounds check runs before the cell is read, and `&&` stops at the first `false`, so `map[nr][nc]` is never evaluated for a position outside the grid. Adding diagonal moves means adding four more rows to `DIRS`, not rewriting the loop. Arrays with three or more dimensions (`int[][][] cube = new int[2][3][4]`) follow exactly the same rules, one level deeper; they are rare outside scientific code and dynamic programming over several variables.

```quiz
Q: After `int[][] a = {{1, 2}, {3, 4}}; int[][] b = a.clone(); b[1][0] = 9;`, what does `a[1][0]` hold?
- [ ] 3, because clone made a copy
- [x] 9, because clone copied only the outer array and both share row objects
- [ ] It throws an exception, because 2D arrays cannot be cloned
- [ ] 0, because clone resets the elements
> A 2D array is an array of row references. `clone()` creates a new outer array containing the same references, so `b[1]` and `a[1]` are one `int[]`. To copy the numbers, clone each row in a loop.

Q: Which line correctly creates a triangular array whose row `r` has `r + 1` elements?
- [ ] `int[][] t = new int[4][r + 1];`
- [x] `int[][] t = new int[4][];` followed by `t[r] = new int[r + 1];` in a loop
- [ ] `int[][] t = new int[][4];`
- [ ] Java arrays must be rectangular
> Leaving the second length empty creates only the outer array with `null` rows, and each row can then be created with its own length. Only the leftmost lengths may be given; `new int[][4]` does not compile.
```

## Arrays vs ArrayList {#c1-arrays-vs-arraylist}

`ArrayList` is the most-used collection in Java: a list of objects that grows and shrinks as you add and remove elements. Since both store elements in index order, beginners often wonder which to use. The short answer is that `ArrayList` is built *on top of* an array, and the question is whether you need what that extra layer gives you. The full `ArrayList` API is covered in [[c1-arraylist]]; this section is about the choice.

### What actually differs

| Aspect | Array (`String[]`, `int[]`) | `ArrayList<E>` |
|---|---|---|
| Size | Fixed when created | Grows and shrinks automatically |
| Element types | Primitives or references | References only — `ArrayList<Integer>`, never `ArrayList<int>` |
| Syntax | `a[i]`, `a[i] = x`, `a.length` | `list.get(i)`, `list.set(i, x)`, `list.size()` |
| Adding or removing | Not possible; create a new array | `add`, `remove`, `addAll`, `removeIf`, … |
| Type safety | Covariant; wrong stores fail at run time | Generic; wrong types fail at compile time |
| `equals`, `toString` | Identity and `[I@…`; use `Arrays` helpers | Element-by-element and readable |
| Memory for numbers | `int[1000]` ≈ 4 KB | 1,000 boxed `Integer` objects ≈ 20 KB |
| Works with the collections API | Through `Arrays` helpers | Directly: `Collections.sort`, streams, `List` parameters |

The size difference is the reason `ArrayList` exists. Internally it holds an `Object[]` called its backing array and a count of how many slots are in use. When you `add` and the backing array is full, it allocates a bigger one — in OpenJDK, about one and a half times the old capacity — and copies the elements across with `Arrays.copyOf`. A single add that triggers growth costs O(n), but because the capacity grows by a constant factor, those copies are rare enough that the **amortised** cost of `add` at the end is O(1). Inserting or removing in the middle still shifts the later elements with `System.arraycopy`, which is O(n). The analysis behind "amortised" is in [[a1-arraylist]].

The primitive difference matters for numeric work. An `int[]` stores the numbers directly. An `ArrayList<Integer>` stores references to `Integer` objects, each with its own object header, so it uses roughly five times the memory and adds a pointer hop to every read. Values are converted automatically between `int` and `Integer` (autoboxing), which hides this cost and has its own traps; see [[c1-autoboxing]].

### Converting between them

Conversions are where most real bugs live, so it is worth seeing each one run.

```java title="ArrayVsList.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArrayVsList {
    public static void main(String[] args) {
        String[] fixed = {"red", "green"};
        List<String> growable = new ArrayList<>(List.of("red", "green"));
        growable.add("blue");                        // arrays have no add
        growable.remove("red");
        System.out.println(fixed.length + " " + Arrays.toString(fixed));
        System.out.println(growable.size() + " " + growable);

        String[] backing = {"x", "y", "z"};
        List<String> view = Arrays.asList(backing);  // fixed-size view of the array
        view.set(0, "changed");                      // writes through to the array
        System.out.println(Arrays.toString(backing));
        try {
            view.add("w");
        } catch (UnsupportedOperationException e) {
            System.out.println("add on Arrays.asList: UnsupportedOperationException");
        }

        List<String> copy = new ArrayList<>(Arrays.asList(backing));   // independent and growable
        copy.add("w");
        System.out.println(copy);

        String[] back = growable.toArray(new String[0]);
        String[] back2 = growable.toArray(String[]::new);              // Java 11+
        System.out.println(Arrays.toString(back) + " " + back2.length);

        int[] numbers = {3, 1, 2};
        List<int[]> oops = Arrays.asList(numbers);   // ONE element: the int[] itself
        System.out.println(oops.size());
        List<Integer> boxed = Arrays.stream(numbers).boxed().toList();
        System.out.println(boxed);
        int[] unboxed = boxed.stream().mapToInt(Integer::intValue).toArray();
        System.out.println(Arrays.toString(unboxed));
    }
}
```

```output
2 [red, green]
2 [green, blue]
[changed, y, z]
add on Arrays.asList: UnsupportedOperationException
[changed, y, z, w]
[green, blue] 2
1
[3, 1, 2]
[3, 1, 2]
```

`Arrays.asList(array)` does not copy anything. It returns a fixed-size `List` **view** backed by the array: `set` writes through to the array, but `add` and `remove` throw `UnsupportedOperationException` because the array cannot change length. That surprises people because the returned object is declared as a plain `List`. When you want an independent list you can grow, wrap it: `new ArrayList<>(Arrays.asList(backing))`. `List.of(...)` (Java 9) is different again — it is fully unmodifiable, so even `set` throws, and it rejects `null` elements.

Going the other way, `list.toArray(new String[0])` returns a correctly typed `String[]`; passing a zero-length array is the recommended idiom and is not slower than pre-sizing it on modern JVMs. Since Java 11 you can write `list.toArray(String[]::new)`. The no-argument `toArray()` returns `Object[]`, which you cannot cast to `String[]`.

The last block is the classic primitive trap. `Arrays.asList` takes `T...`, and `T` must be a reference type, so passing an `int[]` makes `T` equal `int[]` itself: you get a one-element `List<int[]>`. For primitives, go through a stream: `Arrays.stream(numbers).boxed().toList()` (the `toList()` method is Java 16+), and `mapToInt(Integer::intValue).toArray()` to come back.

### Choosing between them

Use an **array** when the size is known and fixed, when you store large amounts of primitive data (pixel buffers, counting tables such as `int[26]` for letter frequencies, dynamic-programming tables), when you implement a data structure yourself, or when an API requires one (`main(String[] args)`, `byte[]` I/O buffers, varargs).

Use an **`ArrayList`** — or, better, declare the variable as `List` — for everyday collections of objects whose size changes: results from a database query, items in a shopping cart, the lines of a file. You get readable `toString`, content-based `equals`, compile-time type safety and the whole collections and streams API. In application code, method parameters and return values should almost always be `List<T>` rather than `T[]`, because a list can be made unmodifiable and an array cannot. In algorithmic code, plain arrays are often the faster and simpler choice.

```quiz
Q: What happens when you call `add` on the list returned by `Arrays.asList(new String[] {"a", "b"})`?
- [ ] The element is appended and the original array grows
- [ ] The element is appended to the list only
- [x] It throws `UnsupportedOperationException` because the list is a fixed-size view of the array
- [ ] It does not compile
> `Arrays.asList` wraps the array without copying it. `set` writes through to the array, but the array's length cannot change, so `add` and `remove` throw. Use `new ArrayList<>(Arrays.asList(...))` for a growable copy. It compiles because the return type is `List`.

Q: Why is `int[]` usually preferred over `ArrayList<Integer>` for a table of one million counters?
- [ ] `ArrayList` cannot hold a million elements
- [x] `int[]` stores the numbers directly, while `ArrayList<Integer>` stores references to separate `Integer` objects, costing more memory and time
- [ ] `int[]` is resizable while `ArrayList` is not
- [ ] `ArrayList` sorts its elements automatically
> Each `Integer` is an object with a header, so the boxed list uses several times the memory and every read follows a reference. When the size is fixed and the data is primitive, the array wins. `ArrayList` can hold far more than a million elements.
```

## How it works internally

When `new int[1000]` runs, the JVM allocates a single block on the heap. On a 64-bit HotSpot JVM with default settings (Java 21), the block starts with a 16-byte header — the usual object header plus a 4-byte `length` field — followed by the 1,000 elements stored contiguously, 4 bytes each, so about 4 KB in total. The memory is zeroed as part of allocation, which is why elements start at their default values. An array of references (`String[]`) stores references in those slots, typically 4 bytes each with compressed references; the objects they point to live elsewhere on the heap. Object layout is covered in [[c2-object-header]].

Bytecode has dedicated instructions for arrays: `newarray` creates a primitive array, `anewarray` an array of references, `multianewarray` a multidimensional one, `iaload` and `iastore` read and write `int` elements, and `arraylength` reads the length. Every load and store checks that the index is between `0` and `length - 1`, and every store into a reference array also performs the type check that throws `ArrayStoreException`. These checks sound expensive, but the Just-In-Time (JIT) compiler can often prove that a loop such as `for (int i = 0; i < a.length; i++)` never goes out of bounds and remove the check from the compiled machine code. That is one reason idiomatic loops are also the fastest ones.

Element access is O(1) because the address of `a[i]` is computed directly: the array's start address, plus the header size, plus `i` times the element size. The same contiguity makes sequential traversal very cache-friendly, which is why array-backed structures such as `ArrayList` usually outperform linked structures in practice even when their Big-O costs are equal. The maximum length is limited by the `int` index to a little under `Integer.MAX_VALUE`; the exact limit depends on the JVM, and in practice heap size runs out first.

## Worked example: a temperature report

The program below combines most of the lesson. It stores three weeks of daily temperatures in a 2D array, computes averages along rows (weeks) and along columns (weekdays), and finds the median of every reading without disturbing the caller's data.

```java title="TemperatureReport.java"
import java.util.Arrays;

public class TemperatureReport {
    static final String[] DAYS = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

    /** Average of every row: one value per week. */
    static double[] weeklyAverages(int[][] temps) {
        double[] result = new double[temps.length];
        for (int w = 0; w < temps.length; w++) {
            int sum = 0;
            for (int t : temps[w]) {
                sum += t;
            }
            result[w] = (double) sum / temps[w].length;
        }
        return result;
    }

    /** Average of every column: one value per weekday, across all weeks. */
    static double[] dayAverages(int[][] temps) {
        double[] result = new double[DAYS.length];
        for (int d = 0; d < DAYS.length; d++) {
            int sum = 0;
            for (int[] week : temps) {
                sum += week[d];
            }
            result[d] = (double) sum / temps.length;
        }
        return result;
    }

    /** Median of all readings, computed on a copy so the caller's data is untouched. */
    static double median(int[][] temps) {
        int[] all = new int[temps.length * DAYS.length];
        for (int w = 0; w < temps.length; w++) {
            System.arraycopy(temps[w], 0, all, w * DAYS.length, DAYS.length);
        }
        Arrays.sort(all);
        int mid = all.length / 2;
        return all.length % 2 == 1 ? all[mid] : (all[mid - 1] + all[mid]) / 2.0;
    }

    public static void main(String[] args) {
        int[][] temps = {
            {12, 14, 15, 11, 10, 16, 18},
            {13, 13, 17, 19, 20, 22, 21},
            {9, 8, 10, 12, 14, 15, 13}
        };

        double[] weeks = weeklyAverages(temps);
        for (int w = 0; w < weeks.length; w++) {
            System.out.printf("Week %d average: %.1f%n", w + 1, weeks[w]);
        }

        double[] days = dayAverages(temps);
        int warmest = 0;
        for (int d = 1; d < days.length; d++) {
            if (days[d] > days[warmest]) {
                warmest = d;
            }
        }
        System.out.printf("Warmest weekday on average: %s (%.1f)%n", DAYS[warmest], days[warmest]);
        System.out.println("Median reading: " + median(temps));
        System.out.println("First week unchanged: " + Arrays.toString(temps[0]));
    }
}
```

```output
Week 1 average: 13.7
Week 2 average: 17.9
Week 3 average: 11.6
Warmest weekday on average: Sat (17.7)
Median reading: 14.0
First week unchanged: [12, 14, 15, 11, 10, 16, 18]
```

Walk through the design decisions. `weeklyAverages` traverses each row with an enhanced `for`, because it only reads values. The cast in `(double) sum / temps[w].length` converts before dividing; without it, `int / int` would truncate 96 / 7 to 13. `dayAverages` holds the column index `d` fixed and walks down every row — the column-wise traversal the memory-layout section warned is slower on huge grids, which is irrelevant at this size and the natural way to express the question.

`median` must sort, but sorting the caller's rows in place would scramble their data — a side effect nobody asked for. Instead it flattens the grid into a fresh one-dimensional array with `System.arraycopy`, one row at a time, and sorts that. With 21 readings the middle element is at index 10; the even-length branch averages the two middle values so the method stays correct for any number of weeks. The final line proves the original data is untouched.

Finding the warmest day uses the standard "index of the maximum" loop: start with index 0 as the best so far and compare each later index against it. Keeping the *index* rather than the value lets the program look up the day's name in the parallel `DAYS` array.

## In real systems

**Inside the JDK.** `ArrayList` is an `Object[]` plus a size counter. `HashMap` keeps its buckets in an array and doubles it when the map grows ([[c1-hashmap-internals]]). `ArrayDeque` is a circular array. Since Java 9, `String` stores its text in a `byte[]` ([[c1-strings]]). Understanding arrays explains the performance profile of all of these.

**I/O and networking.** Streams, sockets and files move data through `byte[]` buffers: `inputStream.read(buffer)` fills an existing array and returns how many bytes it wrote, so the same buffer is reused instead of allocating per read. Frameworks such as Netty and serialization libraries build on the same pattern.

**Performance-sensitive code.** Image processing (`int[]` of packed pixels), numeric libraries, compression and game engines prefer primitive arrays because they avoid object headers and pointer chasing. When a library offers both `List<Integer>` and `int[]` paths, the array path is usually the fast one.

**Application code.** Business code in Spring services and controllers rarely uses raw arrays. It passes `List<OrderDto>` and returns `List<Customer>`, because lists can be unmodifiable, print readably and compare by contents. Arrays appear at the edges: `byte[]` file uploads, `String[]` from `split`, and varargs parameters ([[c1-varargs]]).

## Trade-offs and alternatives

Arrays give the fastest possible indexed access, the lowest memory overhead, and the only way to store primitives without boxing. In exchange they have a fixed length, identity-based `equals` and `toString`, no protection against modification (a `final int[]` field can still have its elements changed), and covariance that defers type errors to run time.

| Need | Best fit |
|---|---|
| Fixed number of primitive values, speed matters | `int[]`, `double[]`, `byte[]` |
| Changing number of objects | `ArrayList` declared as `List` |
| Read-only data handed to other code | `List.copyOf(...)` or `List.of(...)` |
| Frequent insertion at both ends | `ArrayDeque` |
| Lookup by key rather than position | `HashMap` |
| Grid of fixed size | `int[][]` (or a flat `int[rows * cols]` indexed as `r * cols + c` for maximum speed) |

The flat-array trick in the last row stores a grid in one contiguous block, so even column-wise traversal stays within one object. It is common in image and matrix code, at the cost of slightly harder-to-read indexing.

## Common mistakes

**Off-by-one at the end.** `for (int i = 0; i <= a.length; i++)` reads `a[a.length]` on its last step and throws. The last valid index is `a.length - 1`, so the condition is `i < a.length`.

**Calling `length()` on an array.** Arrays have the field `length`; strings have the method `length()`; collections have `size()`. The compiler catches the mix-up, but it is worth memorising.

> [!MISTAKE] Comparing or printing arrays directly
> `a == b` and `a.equals(b)` both test whether two variables refer to the *same* array, and `System.out.println(a)` prints something like `[I@2b2fa4f7`. Use `Arrays.equals`, `Arrays.toString`, and their `deep` versions for nested arrays.

**Expecting assignment to copy.** `int[] backup = data;` creates a second name for the same array, so "restoring the backup" restores nothing. Use `data.clone()` or `Arrays.copyOf`.

**Forgetting that copies are shallow.** Cloning a `Customer[]` or an `int[][]` copies references to the same customers or rows. Copy each element or row when you need independent data.

**Assuming a `final` array is constant.** `final int[] LIMITS = {1, 2, 3};` stops `LIMITS` from pointing at a different array, but `LIMITS[0] = 99` still compiles and runs. Expose read-only data as `List.of(...)`, or return a copy; see [[c1-defensive-copies]].

**Treating `Arrays.asList` as a normal list.** It is fixed-size and writes through to the array, and with an `int[]` it gives a list containing one array.

**Using `null` as "no elements".** Returning `null` forces every caller to check for it. Return `new int[0]` or an empty list instead, and loops will handle it naturally.

## Interview perspective

Arrays sit underneath most coding-interview problems, so interviewers rarely ask "what is an array?" directly. They test whether you understand the object model and the costs.

> [!INTERVIEW] Why is array access O(1) but insertion O(n)?
> "The elements are contiguous and all the same size, so the address of element `i` is start plus `i` times the element size — one calculation regardless of `i`. Inserting at position `i` means every later element must move one slot right to make room, which is up to `n` moves. That is also why `ArrayList.add(0, x)` is O(n) while `add(x)` at the end is amortised O(1)."

Questions to be ready for:

- **Is an array a primitive or an object?** An object, even an `int[]`. It lives on the heap, has a class (`[I`), inherits from `Object`, and the variable holds a reference.
- **What does a method receive when you pass it an array?** A copy of the reference. It can change the elements; it cannot make the caller's variable point to another array.
- **`Arrays.sort` algorithms?** A dual-pivot quicksort for primitives and TimSort (stable) for objects, both O(n log n). Stability matters only when equal elements are distinguishable.
- **How do you deep-copy a 2D array?** Create a new outer array and clone each row; `clone()` on the outer array alone is shallow.
- **Array versus `ArrayList`?** Fixed size and primitives versus resizable, generic and boxed; mention the backing array, 1.5x growth and amortised O(1) append.
- **What is `ArrayStoreException`?** The runtime check that protects covariant arrays; generics avoid the problem at compile time.

A common follow-up is to rotate an array by `k` positions in place with O(1) extra space. The elegant answer reverses the whole array, then reverses the first `k` elements and the remaining `n - k` separately — three linear passes, no extra array.

## Practice

1. **Reverse in place.** Write `static void reverse(int[] a)` that reverses an array using two indices moving towards each other. Test it on lengths 0, 1, 2 and 5.
2. **Second largest.** Return the second-largest distinct value in one pass without sorting. Decide what to return when it does not exist.
3. **Rotate.** Rotate an array right by `k` steps in place, handling `k` larger than the length.
4. **Transpose.** Given an `int[rows][cols]`, return a new `int[cols][rows]` where `result[c][r] == input[r][c]`.
5. **Spiral order.** Print the elements of a rectangular grid in clockwise spiral order, keeping four boundaries (top, bottom, left, right).
6. **Deep copy check.** Write a method that deep-copies a jagged `int[][]`, and prove with `Arrays.deepEquals` and `==` on rows that the copy is equal but independent.

The DSA explorer lists array problems under [[a2-array-string-traversal]] and the related pattern topics; *Rotate Array*, *Spiral Matrix* and *Set Matrix Zeroes* are good next steps.

## Quick revision {#quick-revision}

- An array is a fixed-length object holding elements of one type; indices run `0` to `length - 1`.
- Create with `new int[n]` (default values: `0`, `0.0`, `false`, `'\u0000'`, `null`), `{1, 2, 3}` in a declaration, or `new int[] {1, 2, 3}` anywhere.
- `a.length` is a field. Out-of-range access throws `ArrayIndexOutOfBoundsException`.
- Array variables hold references: assignment aliases, `==` and `equals` test identity. Use `Arrays.equals` / `toString` / `hashCode` (and `deep…` for nested arrays).
- Methods receive a copy of the reference: they can change elements, not the caller's variable.
- Copy with `clone()`, `Arrays.copyOf`, `Arrays.copyOfRange`, `System.arraycopy` (overlap-safe). All are shallow.
- `Arrays.sort`: dual-pivot quicksort for primitives, stable TimSort for objects. `binarySearch` needs sorted input; missing → `-(insertionPoint) - 1`.
- Reference arrays are covariant; bad stores throw `ArrayStoreException`. No `new T[]` or `new List<String>[]`.
- 2D arrays are arrays of row arrays; rows can be jagged (`new int[n][]`). Traverse row by row for cache efficiency.
- Deep-copy a grid by cloning every row; `Arrays.fill(grid, row)` shares one row.
- `ArrayList`: backing `Object[]`, grows about 1.5x, amortised O(1) append, O(n) middle insert, boxed elements.
- `Arrays.asList`: fixed-size write-through view; `List.of`: unmodifiable; `list.toArray(new T[0])` or `toArray(T[]::new)` to convert back.

## Key takeaways {#key-takeaways}

- An array trades flexibility for speed: fixed length and one element type buy O(1) indexed access and compact, cache-friendly storage.
- Arrays are objects. Assignment, `==`, `equals` and method calls all work on references, so use the `java.util.Arrays` helpers to compare, print and copy contents.
- Every built-in copy is shallow; for arrays of objects or arrays of arrays, decide whether shared elements are acceptable.
- A multidimensional array is an array of arrays, which allows jagged rows and explains why grid copies and comparisons need the deep variants.
- Prefer primitive arrays for fixed-size numeric data and algorithm internals, and `List` for collections of objects in application code.
- `ArrayList` is an array with automatic resizing; knowing that explains its costs and the traps of converting between the two.
