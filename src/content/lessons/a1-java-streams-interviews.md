---
summary: Java streams describe a computation over a collection as a pipeline of steps — filter, transform, group, collect — instead of a hand-written loop. You will learn how a pipeline actually executes, the handful of operations and collectors that cover most interview tasks, what streams cost, and when a plain loop is the better choice.
difficulty: intermediate
minutes: 45
objectives:
  - Explain the source → intermediate → terminal structure of a stream and why nothing runs until the terminal operation
  - Trace the order in which elements pass through a lazy pipeline, including short-circuiting operations
  - Choose correctly between map and flatMap, and between groupingBy, toMap and partitioningBy
  - Write common interview transformations — frequency maps, grouping, top-k, flattening — with streams and state their complexity
  - Recognise stream pitfalls such as reuse, side effects, boxing, int overflow in sum and careless parallelStream
---

## Introduction

Much of the code you write in an interview, and even more in production, is some version of "go through a collection, keep the elements that match a condition, transform each one, and combine the results". Written as a loop, that logic is mixed with mechanics: an index or iterator, a result list to create, an `if`, an `add`. Java 8 introduced the **Stream API** as a second way to write the same thing, by naming the steps instead:

```java
List<String> shortNamesUpper = names.stream()
        .filter(n -> n.length() <= 3)
        .map(String::toUpperCase)
        .toList();
```

A **stream** is a sequence of elements flowing from a source through a pipeline of operations. It is not a data structure — it stores nothing — and it is not the same as the I/O streams in `java.io` (`InputStream`, `Reader`), which are unrelated despite the name. A stream reads from a source such as a list, an array or a range of numbers, processes elements on demand, and produces a result once.

For interviews, streams matter in two ways. Some interviewers, particularly for Java backend roles, ask directly about them: what is lazy, what `flatMap` does, the difference between `groupingBy` and `toMap`, when `parallelStream` hurts. And in coding rounds, a well-chosen stream turns a ten-line frequency count or grouping into a clear two-line expression — provided you know its cost and do not reach for it where a loop is simpler. This lesson covers both.

## Before you start

- **Lambdas and method references** — `x -> x * 2` and `String::length` are the functions you pass to stream operations. See [[c1-lambdas]] and [[c1-method-references]].
- **Collections** — `List`, `Map` and `HashMap` in particular, since most pipelines end by building one. See [[a1-hashmap]] and [[a1-arraylist]].
- **Comparators** — for sorting inside a pipeline. See [[a1-comparable-comparator]].
- **Complexity** — so you can state what a pipeline costs. See [[a1-time-complexity]].

The examples target Java 21. Where an operation was added after Java 8, the lesson names the version.

## The intuition: a recipe and a tap

Think of a stream pipeline as a written recipe attached to a tap. Calling `.filter(...)` and `.map(...)` only writes more lines on the recipe: "keep the short names", "convert them to upper case". No water flows while you write. The **terminal operation** — `.toList()`, `.count()`, `.collect(...)` — opens the tap. Elements then flow one at a time from the source through every step of the recipe and into the result. When the source is empty, the tap closes and the stream cannot be reopened.

The analogy is accurate in the two ways that matter most: nothing happens until the terminal operation, and each element travels through the whole pipeline before the next one starts (with exceptions you will meet below). It stops working in one respect — a real tap can be opened again, but a stream is single-use.

## Anatomy of a pipeline

Every stream pipeline has exactly three parts.

**A source** creates the stream. The common ones are:

| Source | Produces |
|---|---|
| `list.stream()`, `set.stream()` | The elements of any `Collection` |
| `map.entrySet().stream()` | The `Map.Entry` pairs of a map |
| `Arrays.stream(int[])` | An `IntStream` of the array's values |
| `Stream.of("a", "b", "c")` | A stream of the given values |
| `IntStream.range(0, n)` | 0, 1, …, n − 1; `rangeClosed(1, n)` includes `n` |
| `"text".chars()` | An `IntStream` of the string's `char` values |
| `Stream.iterate(1, x -> x * 2)` | An infinite stream; must be cut with `limit` or `takeWhile` |

**Zero or more intermediate operations** each return a new stream and describe a step: `filter`, `map`, `flatMap`, `distinct`, `sorted`, `limit`, `skip`, `peek`, `mapToInt`, `boxed`, and since Java 9 `takeWhile` and `dropWhile`.

**Exactly one terminal operation** runs the pipeline and produces a non-stream result or a side effect: `toList`, `collect`, `count`, `sum`, `reduce`, `min`, `max`, `findFirst`, `anyMatch`, `allMatch`, `noneMatch`, `forEach`, `toArray`.

The quickest way to tell them apart is the return type: if a method returns a `Stream` (or `IntStream`, `LongStream`, `DoubleStream`), it is intermediate; otherwise it is terminal. This distinction is taught in more depth in [[c1-intermediate-terminal]].

## How a pipeline executes

The following program puts a print statement inside each step so that you can see exactly when and in what order the steps run.

```java title="Lazy.java"
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

public class Lazy {
    public static void main(String[] args) {
        List<String> names = List.of("ana", "bob", "carla", "dan");

        Stream<String> pipeline = names.stream()
                .filter(n -> {
                    System.out.println("filter " + n);
                    return n.length() == 3;
                })
                .map(n -> {
                    System.out.println("map    " + n);
                    return n.toUpperCase();
                });
        System.out.println("pipeline built");

        List<String> result = pipeline.toList();      // the terminal operation
        System.out.println(result);

        Optional<String> first = names.stream()
                .filter(n -> {
                    System.out.println("check  " + n);
                    return n.startsWith("b");
                })
                .findFirst();                          // stops at the first match
        System.out.println(first.orElse("none"));
    }
}
```

```output
pipeline built
filter ana
map    ana
filter bob
map    bob
filter carla
filter dan
map    dan
[ANA, BOB, DAN]
check  ana
check  bob
bob
```

Three behaviours are visible in this output.

**Intermediate operations are lazy.** "pipeline built" is printed first. Calling `filter` and `map` did not touch a single element; they only assembled a description of the work. The lambdas ran only when `toList()` asked for results.

**Elements flow vertically, one at a time.** The output is not "filter, filter, filter, filter, then map, map, map". Instead `ana` goes through `filter` and then `map` before `bob` is even looked at. `carla` fails the filter, so it never reaches `map`. This **vertical** (element-by-element) processing means the stream never builds an intermediate list between steps; a loop with an `if` inside would do the same work in the same order.

**Short-circuiting operations stop early.** `findFirst` needs only one matching element. After `bob` matches, the stream stops pulling, and `carla` and `dan` are never checked. `anyMatch`, `allMatch`, `noneMatch`, `findAny` and `limit` short-circuit in the same way. This is also what makes infinite streams usable: `Stream.iterate(1, x -> x * 2).limit(10)` pulls only ten elements.

### Stateful operations break the flow

Some intermediate operations cannot pass an element on until they have seen others. `sorted()` cannot emit its first element until it has seen *every* element, because the smallest might be last; it buffers the whole stream, which costs O(n) memory and O(n log n) time. `distinct()` remembers every element it has emitted in a set, costing O(n) memory. These are called **stateful** operations, as opposed to **stateless** ones such as `filter` and `map` that look at one element at a time. A practical consequence: `stream.sorted().findFirst()` sorts everything before returning the first element, so `stream.min(comparator)` — a single O(n) pass — is the better way to find the smallest.

### A stream can be consumed only once

After a terminal operation, the stream is finished. Calling another terminal operation on the same stream object throws:

```java title="Reuse.java"
import java.util.List;
import java.util.stream.Stream;

public class Reuse {
    public static void main(String[] args) {
        Stream<Integer> evens = List.of(1, 2, 3, 4).stream().filter(x -> x % 2 == 0);
        System.out.println(evens.count());
        try {
            System.out.println(evens.count());
        } catch (IllegalStateException e) {
            System.out.println("IllegalStateException: " + e.getMessage());
        }
    }
}
```

```output
2
IllegalStateException: stream has already been operated upon or closed
```

If you need the results more than once, keep the *collected* result — a `List` or `Map` — not the stream. Or create a fresh stream from the source each time; `list.stream()` is cheap.

## Transforming elements: filter, map and flatMap

**`filter(predicate)`** keeps the elements for which the predicate returns `true`. **`map(function)`** replaces each element with exactly one new element, possibly of a different type: `words.stream().map(String::length)` turns a `Stream<String>` into a `Stream<Integer>`.

**`flatMap(function)`** handles the case where each element maps to *several* elements (or none). The function returns a stream for each element, and `flatMap` splices all those streams into one. The difference is easiest to see with a list of lists:

```java
List<List<Integer>> nested = List.of(List.of(1, 2), List.of(), List.of(3, 4, 5));

nested.stream().map(List::stream);       // Stream<Stream<Integer>> — three inner streams
nested.stream().flatMap(List::stream);   // Stream<Integer> — 1, 2, 3, 4, 5
```

With `map`, you get one element per inner list: a stream of streams, which is rarely what you want. With `flatMap`, the inner elements are lifted up one level into a single stream, and the empty inner list simply contributes nothing. `flatMap` removes exactly **one** level of nesting; a list of lists of lists needs two `flatMap` calls. A common interview use is splitting sentences into words: `lines.stream().flatMap(line -> Arrays.stream(line.split(" ")))`.

**Method references** such as `String::length`, `List::stream` and `Integer::sum` are shorthand for lambdas that only forward to one method: `String::length` means `s -> s.length()`. Use them when they read more clearly; a lambda is better when the logic needs more than one call.

**`Optional`** has `map` and `flatMap` with the same meaning. `max`, `min`, `findFirst` and `reduce` without an identity return an `Optional`, because the stream might be empty. Unwrap it deliberately with `orElse(default)`, `orElseThrow()` or `ifPresent(...)`; calling `get()` on an empty `Optional` throws `NoSuchElementException`. See [[c1-optional]].

## Collecting results

Terminal operations that build collections are where most of the interview value lies. `collect` takes a **collector** — a recipe for accumulating elements — and the `Collectors` class provides the ones you need. [[c1-collectors]] covers them exhaustively; these are the ones worth knowing by heart.

### Lists

There are three ways to collect into a list, and they differ in mutability:

- **`stream.toList()`** (Java 16+) returns an **unmodifiable** list. Calling `add` on it throws `UnsupportedOperationException`. This is the shortest form and the right default.
- **`collect(Collectors.toList())`** returns a list with no guarantee about its type or mutability. Today it is an `ArrayList`, but code that relies on adding to it is relying on an implementation detail.
- **`collect(Collectors.toCollection(ArrayList::new))`** guarantees a mutable `ArrayList` (or any collection you supply, such as `TreeSet::new`). Use it when you will modify the result.

### groupingBy: many elements per key

`Collectors.groupingBy(classifier)` puts each element into a bucket keyed by `classifier(element)` and returns a `Map<K, List<T>>`. It has three forms:

```java
groupingBy(String::length)                                   // Map<Integer, List<String>>
groupingBy(String::length, Collectors.counting())            // Map<Integer, Long>
groupingBy(String::length, TreeMap::new, Collectors.toList())  // sorted keys
```

The second argument is a **downstream collector** applied to each bucket: `counting()` for sizes, `summingInt(...)` for totals, `mapping(f, toList())` to transform before collecting, `toSet()` to deduplicate. The map-factory argument in the third form controls the map type. By default the result is a `HashMap`, whose iteration order is unspecified, so pass `TreeMap::new` whenever you need sorted keys or deterministic output.

Note that `counting()` produces `Long` values, not `int`. Comparing two boxed `Long` values with `==` compares object references and silently fails for values outside the small cached range; compare with `equals` or unbox first.

### toMap: one value per key

`Collectors.toMap(keyFn, valueFn)` builds a map with one entry per element. If two elements produce the same key, it throws `IllegalStateException` — a frequent surprise. The fix is a third argument, a **merge function** that combines the two values:

```java
Stream.of("aa", "b", "aa").collect(Collectors.toMap(s -> s, String::length));
// throws IllegalStateException: Duplicate key aa (attempted merging values 2 and 2)

Stream.of("aa", "b", "aa").collect(Collectors.toMap(s -> s, String::length, Integer::sum));
// {aa=4, b=1} (in some order)
```

Choose by what you expect: if many elements share a key and you want all of them, use `groupingBy`; if each key should have one value, use `toMap` and decide explicitly what happens on a collision (`Integer::sum`, `(a, b) -> a` to keep the first, `Math::max`).

### partitioningBy and joining

`partitioningBy(predicate)` is a special `groupingBy` with exactly two keys, `false` and `true`, both always present even if empty. `joining(", ", "[", "]")` concatenates strings with a separator, prefix and suffix, using a `StringBuilder` internally so it stays linear.

## Primitive streams

A `Stream<Integer>` holds `Integer` objects. Every arithmetic step unboxes and re-boxes values, which allocates objects and is noticeably slower for large numeric workloads. Java therefore provides **primitive streams**: `IntStream`, `LongStream` and `DoubleStream`. They come from `Arrays.stream(int[])`, `IntStream.range`, `String.chars()`, or from converting an object stream with `mapToInt`, `mapToLong` and `mapToDouble`. They have numeric terminals that object streams lack: `sum()`, `average()`, `summaryStatistics()`, and `max()`/`min()` returning `OptionalInt`. To go back to objects, use `boxed()` or `mapToObj(...)`.

One trap: `IntStream.sum()` returns an `int` and overflows silently, exactly like a loop with an `int` accumulator. If the total can exceed about 2.1 billion, use `mapToLong(...)` or `asLongStream().sum()`.

`IntStream.range(0, n)` is also how you get indices in a stream, since streams have no built-in index: `IntStream.range(0, a.length).filter(i -> a[i] > 0).count()`.

## Sorting

`sorted()` uses natural order, and `sorted(comparator)` uses a comparator. Comparators compose well:

```java
people.stream()
      .sorted(Comparator.comparing(Person::age).reversed()
                        .thenComparing(Person::name))
      .toList();
```

This sorts by age descending, then by name ascending for equal ages. `reversed()` applies to the whole comparator built so far, so place it carefully. Sorting a stream is stable for ordered sources and costs O(n log n) time and O(n) extra memory for the buffer.

## Worked example: interview recipes

The program below collects the transformations that come up most in interviews. Each recipe is explained after the output.

```java title="Recipes.java"
import java.util.*;
import java.util.function.Function;
import java.util.stream.*;

public class Recipes {
    public static void main(String[] args) {
        // 1. Character frequency, keys in sorted order
        Map<Character, Long> freq = "banana".chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.groupingBy(Function.identity(), TreeMap::new,
                        Collectors.counting()));
        System.out.println(freq);

        // 2. Most frequent element
        int[] nums = {4, 1, 4, 2, 1, 4};
        int mode = Arrays.stream(nums).boxed()
                .collect(Collectors.groupingBy(x -> x, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElseThrow();
        System.out.println(mode);

        // 3. Group anagrams by their sorted letters
        List<String> words = List.of("eat", "tea", "tan", "ate", "nat", "bat");
        Map<String, List<String>> groups = words.stream()
                .collect(Collectors.groupingBy(w -> {
                    char[] cs = w.toCharArray();
                    Arrays.sort(cs);
                    return new String(cs);
                }, TreeMap::new, Collectors.toList()));
        System.out.println(groups);

        // 4. Flatten a list of lists
        List<List<Integer>> nested = List.of(List.of(1, 2), List.of(), List.of(3, 4, 5));
        List<Integer> flat = nested.stream().flatMap(List::stream).toList();
        System.out.println(flat);

        // 5. int[] -> List<Integer> and back, and primitive aggregates
        List<Integer> boxed = Arrays.stream(nums).boxed().toList();
        int[] back = boxed.stream().mapToInt(Integer::intValue).toArray();
        System.out.println(boxed + " sum=" + Arrays.stream(back).sum()
                + " max=" + Arrays.stream(back).max().getAsInt());

        // 6. Top-k frequent words: by count descending, then alphabetically
        List<String> text = List.of("the", "day", "is", "sunny", "the", "the",
                "the", "sunny", "is", "is");
        List<String> top2 = text.stream()
                .collect(Collectors.groupingBy(w -> w, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(2)
                .map(Map.Entry::getKey)
                .toList();
        System.out.println(top2);

        // 7. partitioningBy and joining
        Map<Boolean, List<Integer>> parts = IntStream.rangeClosed(1, 8).boxed()
                .collect(Collectors.partitioningBy(x -> x % 2 == 0));
        System.out.println(parts);
        System.out.println(words.stream().map(String::toUpperCase)
                .collect(Collectors.joining(", ", "[", "]")));

        // 8. toMap with a merge function
        Map<String, Integer> lengths = Stream.of("aa", "b", "aa", "ccc")
                .collect(Collectors.toMap(s -> s, String::length, Integer::sum, TreeMap::new));
        System.out.println(lengths);
    }
}
```

```output
{a=3, b=1, n=2}
4
{abt=[bat], aet=[eat, tea, ate], ant=[tan, nat]}
[1, 2, 3, 4, 5]
[4, 1, 4, 2, 1, 4] sum=16 max=4
[the, is]
{false=[1, 3, 5, 7], true=[2, 4, 6, 8]}
[EAT, TEA, TAN, ATE, NAT, BAT]
{aa=4, b=1, ccc=3}
```

**Recipe 1** — `chars()` yields `int` values, so `mapToObj(c -> (char) c)` converts them to `Character` objects before grouping. `Function.identity()` means "the element itself is the key". The `TreeMap::new` factory makes the output sorted. Time O(n log k) for `n` characters and `k` distinct ones because of the tree; with the default `HashMap` it would be O(n) on average.

**Recipe 2** — two pipelines: the first builds a frequency map, the second streams its entries and takes the maximum by value. `max` returns an `Optional<Map.Entry>`, which `map` turns into an `Optional<Integer>`, unwrapped by `orElseThrow()`. If two values tied, the winner would depend on the `HashMap`'s iteration order, which is unspecified — mention this if the problem cares about ties. Time O(n) on average, space O(k).

**Recipe 3** — the classic Group Anagrams problem. Two words are anagrams exactly when their sorted letters are equal, so the sorted string is the grouping key. For `n` words of length up to `L`, the cost is O(n · L log L) for the sorting.

**Recipe 4** — `flatMap(List::stream)` flattens one level; the empty inner list disappears.

**Recipe 5** — `boxed()` converts `IntStream` to `Stream<Integer>`; `mapToInt(Integer::intValue)` converts back. `max()` on an `IntStream` returns `OptionalInt`, unwrapped with `getAsInt()`, which is safe here only because the array is not empty.

**Recipe 6** — top-k frequent words with ties broken alphabetically. The comparator sorts by count descending, then key ascending. `Map.Entry.<String, Long>comparingByValue()` needs the explicit type arguments because the compiler cannot infer them once `.reversed()` is chained. Sorting all `k` distinct words costs O(k log k); for large inputs with small `k`, a heap of size `k` is O(n log k) and is what interviewers usually want to see ([[a7-top-k]]). The stream version is a clear first solution to state, not the optimal one.

**Recipe 7** — `partitioningBy` always returns both keys. `joining` adds the separator only *between* elements.

**Recipe 8** — the duplicate key `"aa"` would throw without the merge function; `Integer::sum` adds the two lengths.

```quiz
Q: A pipeline calls `filter` and `map` on a list's stream but never calls a terminal operation. How many times do the lambdas run?
- [ ] Once per element, when `filter` and `map` are called
- [x] Zero times, because intermediate operations only describe the work
- [ ] Only the `filter` lambda runs
- [ ] Once, for the first element
> Intermediate operations are lazy: they return a new stream that remembers the step. Elements are pulled through the pipeline only when a terminal operation such as `toList`, `count` or `collect` runs.

Q: You have a `List<List<String>>` and want a single `List<String>` of all inner strings. Which pipeline is correct?
- [ ] `outer.stream().map(List::stream).toList()`
- [x] `outer.stream().flatMap(List::stream).toList()`
- [ ] `outer.stream().peek(List::stream).toList()`
- [ ] `outer.stream().distinct().toList()`
> `map` would produce one element per inner list — a list of streams. `flatMap` splices each inner stream into the outer one, removing one level of nesting.

Q: `words.stream().collect(Collectors.toMap(w -> w.charAt(0), w -> w))` is run on `["apple", "avocado", "banana"]`. What happens?
- [ ] It returns a map where 'a' maps to both words
- [ ] It keeps the last word for 'a'
- [x] It throws `IllegalStateException` because two words share the key 'a'
- [ ] It returns a map with only 'b'
> `toMap` without a merge function refuses duplicate keys. Pass a merge function such as `(x, y) -> x`, or use `groupingBy(w -> w.charAt(0))` to keep every word per key.

Q: Why is `stream.min(comparator)` better than `stream.sorted(comparator).findFirst()`?
- [ ] `findFirst` does not work after `sorted`
- [x] `sorted` must buffer and sort every element, O(n log n), while `min` is a single O(n) pass
- [ ] `min` runs in parallel automatically
- [ ] They have identical cost because streams are lazy
> Laziness cannot help a stateful operation: `sorted` cannot emit anything until it has seen all elements. `min` keeps only the best element so far.
```

## Cost and performance

A stream pipeline does the same algorithmic work as the equivalent loop, so analyse it the same way. A chain of stateless operations followed by `toList`, `count` or `sum` is one pass: O(n) time. Add the cost of every stateful or expensive step: `sorted` is O(n log n) time and O(n) space, `distinct` is O(n) average time and O(n) space, and `groupingBy` or `toMap` into a `HashMap` is O(n) average time and O(k) space for `k` keys. Short-circuiting terminals can finish earlier but are still O(n) in the worst case.

The constant factor is a different matter. A stream allocates a few pipeline objects up front and calls a lambda per element per step; an object stream also boxes primitives. For small collections the overhead is negligible. For tight numeric loops over millions of elements — the typical competitive-programming situation — a plain `for` loop over an `int[]` is usually faster, and primitive streams sit in between. In interviews, readability matters more than this overhead, but you should be able to say it.

## Side effects, peek and parallel streams

Stream operations are designed for **functions without side effects**: a `map` lambda should compute and return a value, not modify a list outside the pipeline. Code such as `stream.forEach(x -> results.add(x * 2))` works on a sequential stream but is a loop in disguise, harder to debug, and incorrect under parallel execution, where several threads would call `add` on a non-thread-safe `ArrayList` at once. Collect instead: `stream.map(x -> x * 2).toList()`.

**`peek`** exists for debugging — to look at elements as they pass. It is not a transformation step, and it does not even reliably run. Since Java 9, `count()` may skip executing the pipeline entirely if it can compute the size directly from the source:

```java title="PeekCount.java"
import java.util.List;

public class PeekCount {
    public static void main(String[] args) {
        long n = List.of("a", "b", "c").stream()
                .peek(s -> System.out.println("saw " + s))
                .count();
        System.out.println("count = " + n);

        long m = List.of("a", "b", "c").stream()
                .filter(s -> !s.equals("b"))
                .peek(s -> System.out.println("saw " + s))
                .count();
        System.out.println("count = " + m);
    }
}
```

```output
count = 3
saw a
saw c
count = 2
```

In the first pipeline nothing changes the size, so `count()` asks the list for its size and the `peek` lambda never runs. Adding a `filter` makes the size unknowable without processing, so the pipeline runs. Any logic placed in `peek` can therefore silently disappear.

**`parallelStream()`** (or `.parallel()`) splits the source into chunks processed on the shared `ForkJoinPool.commonPool()`, whose default size is one less than the number of processor cores. An ordinary `stream()` is always sequential; streams are never parallel unless you ask. Parallelism pays off only for large, CPU-heavy computations on data that splits well (arrays, `ArrayList`, ranges) with no shared mutable state. It is usually slower for small collections because of the coordination cost, risky for blocking I/O because it ties up the common pool that other parts of the application share, and wrong with side effects. Also note that `forEach` on a parallel stream processes elements in no particular order; `forEachOrdered` restores encounter order at a cost. Measure before keeping a parallel stream.

## In real systems

In production Java — Spring services in particular — streams are most common in the glue code between layers: mapping entities to response objects (`orders.stream().map(OrderDto::from).toList()`), grouping records for a report (`groupingBy(Order::status, counting())`), validating input (`items.stream().allMatch(Item::isValid)`), and building lookup maps (`toMap(User::id, Function.identity())`). Teams typically keep pipelines short and extract a named method when a lambda grows beyond a line or two, because a long chain with complex lambdas is harder to debug than a loop — stack traces point into stream internals, and you cannot easily set a breakpoint on "the third element". Parallel streams are rare in web services for the common-pool reason above; concurrent work there is usually handled with executors instead.

## When a loop is better

Streams are not always the clearer choice. Prefer a loop when the logic needs to **break out early on a condition that is not a simple match**, update **several variables at once** (a sliding window's `left`, `right` and `sum`), **look at neighbouring elements** (`a[i]` and `a[i - 1]`), **mutate the input in place**, or throw checked exceptions from the body (lambdas in the standard functional interfaces cannot throw checked exceptions). Two-pointer, sliding-window and dynamic-programming solutions are almost always clearer as loops. Streams shine for filter-map-collect shapes, grouping and counting.

## Common mistakes

**Reusing a stream.** A second terminal operation throws `IllegalStateException`. Keep the collected result, or create a new stream.

**`toMap` with duplicate keys.** Without a merge function it throws. Decide what a collision means and pass the function, or use `groupingBy`.

**Relying on `HashMap` order.** `groupingBy` and `toMap` produce maps whose iteration order is unspecified. Pass `TreeMap::new` (or `LinkedHashMap::new` to keep encounter order) when order matters.

**Modifying `stream.toList()`.** It is unmodifiable; use `Collectors.toCollection(ArrayList::new)` if you need to add to the result.

**Transforming in `peek` or `forEach`.** Use `map` for transformation and a collector for accumulation. `peek` may not run at all.

**Boxing large numeric data and overflowing sums.** Use `IntStream`/`LongStream`, and use `long` for sums that can exceed the `int` range.

**Calling `get()` on an empty `Optional`.** Use `orElse`, `orElseThrow` with a clear message, or `ifPresent`.

**Reaching for `parallelStream` by default.** It is a performance tool for specific workloads, not a free speed-up.

## Interview perspective

Questions about streams test whether you understand the execution model, not whether you have memorised method names.

> [!INTERVIEW] Answers that show real understanding
> "Intermediate operations are lazy and return a new stream; the terminal operation pulls elements through the pipeline one at a time, so a `filter` followed by `map` never builds an intermediate list. Stateful operations like `sorted` are the exception — they must see everything first. A stream is single-use, and `stream()` is sequential unless I explicitly ask for parallel, which I would only do for large CPU-bound work after measuring."

Expect these questions:

- **`map` versus `flatMap`?** One-to-one versus one-to-many, with `flatMap` removing one level of nesting.
- **`groupingBy` versus `toMap`?** Many values per key versus one, with `toMap` throwing on duplicates unless given a merge function.
- **What is the complexity of your stream solution?** Count it like a loop, adding `sorted` and map-building costs.
- **Find the most frequent element / group anagrams / count characters with a stream.** The recipes above.
- **When does `parallelStream` hurt?** Small inputs, I/O, shared mutable state, and contention for the common pool.
- **Why might `peek` not print?** Because `count()` can short-circuit on sized sources since Java 9, and because no terminal operation means nothing runs.

In a coding round, state the loop-equivalent complexity whenever you write a stream, and do not force streams into problems with indices or multiple moving parts.

## Practice

1. Given a `List<String>`, return the words longer than three characters, lower-cased and without duplicates, in alphabetical order. Then state the time complexity.
2. Count the frequency of each word in a sentence, ignoring case, and print the result in alphabetical order of the words.
3. Given a list of `Employee(name, department, salary)` records, produce a map from department to average salary using `groupingBy` and `averagingDouble`.
4. Return the second-highest distinct value in an `int[]` using streams, handling the case where it does not exist.
5. Rewrite the top-k frequent words recipe using a `PriorityQueue` of size `k`, and compare its complexity with the sorting version.
6. Explain why `IntStream.rangeClosed(1, 100_000).sum()` gives the wrong answer and fix it.

## Quick revision {#quick-revision}

- Pipeline = source → zero or more intermediate operations → exactly one terminal operation. Returns a stream → intermediate.
- Intermediate operations are lazy; the terminal pulls elements through one at a time (vertical processing).
- Short-circuiting: `findFirst`, `anyMatch`, `allMatch`, `noneMatch`, `limit`. Stateful: `sorted`, `distinct` buffer elements.
- A stream is single-use; a second terminal throws `IllegalStateException`.
- `map` is one-to-one; `flatMap` is one-to-many and removes one nesting level.
- `stream.toList()` (Java 16+) is unmodifiable; `toCollection(ArrayList::new)` is mutable.
- `groupingBy(key)`, `groupingBy(key, downstream)`, `groupingBy(key, TreeMap::new, downstream)`; `counting()` yields `Long`.
- `toMap` throws on duplicate keys unless given a merge function; `partitioningBy` always has `true` and `false`.
- Primitive streams avoid boxing; `IntStream.sum()` is `int` and can overflow; `max()` returns `OptionalInt`.
- Complexity: stateless pipeline O(n); `sorted` O(n log n) and O(n) space; grouping O(n) average.
- Avoid side effects; `peek` may not run (Java 9+ `count`); `parallelStream` only for large CPU-bound pure work, after measuring.

## Key takeaways {#key-takeaways}

- A stream is a lazy, single-use pipeline over a source, not a collection; nothing runs until the terminal operation.
- Elements flow through stateless steps one at a time, but stateful steps such as `sorted` must see everything first.
- `flatMap`, `groupingBy` with a downstream collector, and `toMap` with a merge function solve most interview transformations.
- A stream costs what the equivalent loop costs, plus sorting and map-building; state that complexity explicitly.
- Keep lambdas free of side effects, prefer primitive streams for numbers, and treat `parallelStream` as a measured optimisation.
- Use a loop when the logic involves indices, neighbours, several moving variables or early exits.
