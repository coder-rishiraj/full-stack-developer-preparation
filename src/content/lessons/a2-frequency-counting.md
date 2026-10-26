---
summary: Frequency counting answers "how many of each?" by tallying elements into an array or hash map in one pass, which turns comparisons that would otherwise need sorting or nested loops into O(n) work. You will learn how to choose the counting container, the standard counting idioms in Java, and the classic problems built on them — anagrams, first unique character, grouping, top-k and majority voting.
difficulty: beginner
minutes: 45
objectives:
  - Choose between a fixed-size count array and a HashMap for counting, and justify the choice by key range and cost
  - Implement anagram, ransom-note and first-unique-character checks with a single count table
  - Design a canonical key that groups equivalent items, such as anagrams
  - Find the k most frequent elements with bucket sort or a heap and compare their complexities
  - Explain why the Boyer–Moore voting algorithm finds a majority element in O(1) space and when a verification pass is required
---

## Introduction

Two strings are typed into a word game: `"listen"` and `"silent"`. Do they use exactly the same letters? A first idea is to take each letter of the first word and search for it in the second, crossing it off when found. Each search scans the second word, so for words of length `n` this costs O(n²). Another idea is to sort both words and compare — `"eilnst"` equals `"eilnst"` — which costs O(n log n).

But the question does not care about order at all. It only asks: **does each letter appear the same number of times in both words?** So count. Walk the first word once, adding 1 to a tally for each letter; walk the second word, subtracting 1. If every tally ends at zero, the words are anagrams. That is two linear passes — O(n) — and the tally for lowercase letters is just an array of 26 integers.

That is **frequency counting**: building a table that maps each distinct value to the number of times it occurs. Once you have the table, a whole class of questions becomes easy: are two collections the same multiset? Which element is the first that appears only once? Which `k` elements are most common? Is there an element that makes up more than half the data? Counting is also the most common **state** for other patterns — the character counts inside a [[a2-sliding-window]], and the prefix-sum counts in [[a2-hashing]].

Outside interviews, counting is everywhere: word counts and histograms in analytics, "top 10 search terms" dashboards, inventory checks, and the counting sort used for small integer keys ([[a3-counting-sort]]).

## Before you start

- **Array traversal** — single passes and indexing arrays with computed indices. See [[a2-array-string-traversal]].
- **`HashMap` basics** — `put`, `get`, `getOrDefault`, `merge`, and that lookups are O(1) on average. See [[a1-hashmap]].
- **Big-O** — what O(n + k) means when there are two inputs. See [[a1-time-complexity]].

## The intuition

Think of counting votes in a small election by hand. You do not compare every ballot against every other ballot. You draw a column for each candidate and make a tally mark as you read each ballot. When you finish, the tallies answer every question at once: who won, who got exactly 10 votes, whether anyone has a majority.

The tally sheet **forgets order** — you cannot tell from it which ballot was read first — and that is precisely why it is fast. Whenever a problem's answer would not change if you shuffled the input, counting is a candidate technique. When order *does* matter (the *first* unique character, for example), you combine the count table with a second pass over the original sequence.

## Choosing the container

A count table needs a slot for each possible key. There are two ways to provide one.

**A fixed-size array** works when keys are small integers or can be mapped to them. Lowercase letters map to `0..25` with `c - 'a'`: in Java, `char` values are numbers, so `'c' - 'a'` is `2`. ASCII characters fit in `int[128]`, and values in a known range `[lo, hi]` fit in `int[hi - lo + 1]` indexed by `x - lo`.

**A `HashMap<K, Integer>`** works for anything else: large or negative integers, words, objects. It only stores keys that actually occur.

| | `int[]` count array | `HashMap<K, Integer>` |
|---|---|---|
| Keys | Small, dense integer range | Any type with `equals`/`hashCode` |
| Update cost | One array write | Hashing, possible boxing, possible resize |
| Space | Size of the key range (fixed) | Number of distinct keys present |
| Iteration order | By key, ascending | Unspecified (`LinkedHashMap`: insertion; `TreeMap`: sorted) |
| Typical use | Letters, digits, ASCII, bounded values | Arbitrary integers, strings, Unicode |

Prefer the array when it fits: it allocates nothing per update and its space is O(1) with respect to `n` (26 counters is a constant). For a `HashMap<Integer, Integer>`, each count is a boxed `Integer`, so updates allocate objects (except for values in the small-integer cache, −128 to 127) and every lookup computes a hash. That is still O(1) on average, but noticeably slower in practice.

### Counting idioms in Java

```java
int[] letters = new int[26];
for (char c : s.toCharArray()) letters[c - 'a']++;

Map<String, Integer> freq = new HashMap<>();
for (String w : words) {
    freq.merge(w, 1, Integer::sum);   // insert 1, or add 1 to the existing count
}
int seen = freq.getOrDefault("apple", 0);   // 0 for keys never counted
```

`merge(key, 1, Integer::sum)` reads as "if the key is absent, store 1; otherwise store `old + 1`". It replaces the older three-line `containsKey` / `get` / `put` dance and does only one lookup. With streams, `Collectors.groupingBy(Function.identity(), Collectors.counting())` produces a `Map<T, Long>` of counts; it is concise in production code, though interviewers usually prefer the explicit loop.

## Valid Anagram: one table, two streams

**Valid Anagram**: given two lowercase strings `s` and `t`, decide whether `t` is a rearrangement of `s`.

There are three approaches, and comparing them is a good interview answer:

1. **Sort both and compare** — O(n log n) time, and O(n) space for the `char[]` copies.
2. **Two count arrays** — count `s` into one, `t` into another, compare with `Arrays.equals`. O(n) time.
3. **One count array, increment and decrement** — add for `s`, subtract for `t`. If lengths match and no count goes negative, they are anagrams.

The third version can stop early: if a count goes negative, `t` contains a letter more often than `s`, and the answer is `false` immediately.

```java title="Anagram.java"
public class Anagram {
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;   // different sizes can't match
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i) - 'a'] < 0) return false;   // t has an extra copy
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram"));
        System.out.println(isAnagram("rat", "car"));
    }
}
```

```output
true
false
```

Why is "no count goes negative" enough? The lengths are equal, so the total of all counts is zero after both loops. If none is negative, none can be positive either — they must all be exactly zero. That small argument saves a final loop over the 26 counts.

For `"rat"` and `"car"`, the `c` in `"car"` drives `count['c' - 'a']` from 0 to −1 at the very first character, so the method returns `false` without looking further.

**Complexity:** two passes of `n` — O(n) time; 26 counters — O(1) space.

> [!NOTE] When the input is Unicode
> `c - 'a'` only works for lowercase ASCII. For arbitrary text, count **code points** in a map: `s.codePoints().forEach(cp -> freq.merge(cp, 1, Integer::sum))`. Iterating `char`s would split characters outside the Basic Multilingual Plane (such as many emoji) into two halves.

## Ransom Note: availability before use

**Ransom Note**: can the string `ransomNote` be built from the letters of `magazine`, using each magazine letter at most once? This is the anagram check made one-sided. Count what is *available* (the magazine) first, then spend from it:

```java
static boolean canConstruct(String ransomNote, String magazine) {
    int[] available = new int[26];
    for (char c : magazine.toCharArray()) available[c - 'a']++;
    for (char c : ransomNote.toCharArray()) {
        if (--available[c - 'a'] < 0) return false;   // needed a letter we don't have
    }
    return true;
}
// canConstruct("aa", "aab") == true;  canConstruct("aa", "ab") == false
```

There is no length check here, because the magazine may have spare letters. The order of the two loops matters: if you counted the note first, you would be checking the wrong direction.

## First Unique Character: counting plus order

**First Unique Character in a String**: return the index of the first character that appears exactly once, or −1. The count table forgets order, but the question is about the *first* such character. The fix is a second pass over the original string, consulting the table:

```java title="FirstUnique.java"
public class FirstUnique {
    static int firstUniqChar(String s) {
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;   // pass 1: tally
        for (int i = 0; i < s.length(); i++) {                              // pass 2: in order
            if (count[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(firstUniqChar("leetcode"));
        System.out.println(firstUniqChar("loveleetcode"));
        System.out.println(firstUniqChar("aabb"));
    }
}
```

```output
0
2
-1
```

In `"loveleetcode"`, `l` and `o` both appear twice, so the first character with count 1 is `v` at index 2. The pattern **"count first, then scan in original order"** is the standard way to answer order-sensitive questions with an order-free table. It is two passes of O(n) each and O(1) space.

## Group Anagrams: counts as a key

**Group Anagrams**: given `["eat", "tea", "tan", "ate", "nat", "bat"]`, group words that are anagrams of each other.

Comparing every pair of words is O(m²·k) for `m` words of length `k`. A better plan is to compute, for each word, a **canonical key** — a value that is identical for all anagrams and different for non-anagrams — and group words by key in a hash map. Two keys work:

- **The sorted word**: `"eat"`, `"tea"` and `"ate"` all sort to `"aet"`. Cost: O(k log k) per word.
- **The letter counts**: all three have one `a`, one `e`, one `t`. Encoding the 26 counts as a string costs O(k + 26) per word.

```java title="GroupAnagrams.java"
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class GroupAnagrams {
    static List<List<String>> groupAnagrams(String[] words) {
        // LinkedHashMap keeps groups in the order their first word appeared
        Map<String, List<String>> groups = new LinkedHashMap<>();
        for (String w : words) {
            int[] count = new int[26];
            for (char c : w.toCharArray()) count[c - 'a']++;
            StringBuilder key = new StringBuilder();
            for (int x : count) key.append(x).append('#');   // '#' keeps "1,11" apart from "11,1"
            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(groups.values());
    }

    public static void main(String[] args) {
        String[] words = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(words));
    }
}
```

```output
[[eat, tea, ate], [tan, nat], [bat]]
```

Three details deserve explanation. The **separator** `#` matters: without it, the counts `[1, 11]` and `[11, 1]` would both become `"111"`. `computeIfAbsent` creates the group's list the first time a key is seen and returns the existing list afterwards, so one line handles both cases. And the **`LinkedHashMap`** makes the output order predictable; a plain `HashMap` would group correctly but list the groups in an unspecified order.

You cannot use the `int[]` itself as a map key: arrays inherit `equals` and `hashCode` from `Object`, which compare identity, so two arrays with the same contents are different keys. Converting to a `String` (or `List<Integer>`) gives content-based equality. Hash-map keys are discussed in depth in [[a2-hashing]].

**Complexity:** O(m·k) to build count keys (the 26 is a constant), plus O(m) map operations on keys of length O(26) — overall O(m·k).

## Top K Frequent Elements: from counts to ranking

**Top K Frequent Elements**: return the `k` most frequent values in an array. Counting is the first step in every approach; the question is how to rank the counts.

- **Sort the distinct values by count**: O(d log d) for `d` distinct values.
- **Min-heap of size k**: keep the `k` most frequent seen so far, evicting the least frequent when the heap exceeds `k`. O(d log k). See [[a7-top-k]].
- **Bucket sort by frequency**: a value's count is between 1 and `n`, so make `n + 1` buckets where bucket `f` holds values occurring exactly `f` times, then read buckets from high to low. O(n).

```java title="TopKFrequent.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TopKFrequent {
    static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int x : nums) freq.merge(x, 1, Integer::sum);

        // bucket f holds the values that occur exactly f times (1 <= f <= n)
        List<List<Integer>> buckets = new ArrayList<>();
        for (int f = 0; f <= nums.length; f++) buckets.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            buckets.get(e.getValue()).add(e.getKey());
        }

        int[] result = new int[k];
        int filled = 0;
        for (int f = nums.length; f >= 1 && filled < k; f--) {
            for (int value : buckets.get(f)) {
                if (filled == k) break;
                result[filled++] = value;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2)));
    }
}
```

```output
[1, 2]
```

The counts are `{1: 3, 2: 2, 3: 1}`, so bucket 3 holds `1`, bucket 2 holds `2` and bucket 1 holds `3`. Reading from the top gives `[1, 2]`. When several values share a frequency, their order within a bucket depends on the map's iteration order, which is fine because the problem accepts any order.

Bucket sort works here only because frequencies are **bounded by `n`**. That is the same idea as counting sort: when keys fall in a small known range, you can index by them instead of comparing them.

## Majority Element and Boyer–Moore voting

**Majority Element**: find the value that appears **more than** `n / 2` times (the problem guarantees one exists). A count map solves it in O(n) time and O(d) space: count, then return the key whose count exceeds `n / 2`. Can it be done in O(1) space?

### The idea: cancel out pairs

Imagine pairing up elements so that each pair contains **two different values**, then throwing every pair away. A majority value occurs more than half the time, so there are not enough other values to pair with all of its copies — at least one copy must survive. The **Boyer–Moore voting algorithm** performs this cancellation in a single pass with two variables:

- `candidate` — the value currently "ahead".
- `votes` — how many uncancelled copies of `candidate` we are holding.

For each element: if `votes` is 0, adopt the element as the new candidate. Then add 1 if the element equals the candidate, otherwise subtract 1 (it cancels one copy).

```java title="MajorityElement.java"
public class MajorityElement {
    static int majorityElement(int[] nums) {
        int candidate = 0, votes = 0;
        for (int x : nums) {
            if (votes == 0) candidate = x;            // nothing held: start fresh with x
            votes += (x == candidate) ? 1 : -1;       // match adds, mismatch cancels
        }
        return candidate;                             // correct when a majority exists
    }

    public static void main(String[] args) {
        System.out.println(majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2}));
        System.out.println(majorityElement(new int[]{3, 3, 4}));
    }
}
```

```output
2
3
```

| Element | `candidate` before | `votes` before | Action | `candidate` after | `votes` after |
|---|---|---|---|---|---|
| 2 | — | 0 | adopt 2, match | 2 | 1 |
| 2 | 2 | 1 | match | 2 | 2 |
| 1 | 2 | 2 | cancel | 2 | 1 |
| 1 | 2 | 1 | cancel | 2 | 0 |
| 1 | 2 | 0 | adopt 1, match | 1 | 1 |
| 2 | 1 | 1 | cancel | 1 | 0 |
| 2 | 1 | 0 | adopt 2, match | 2 | 1 |

The candidate changes three times, yet the true majority wins at the end. Every time `votes` returns to 0, the prefix processed so far splits into cancelled pairs of different values, and the majority element must still be a majority of the remaining suffix — so it eventually takes over and cannot be cancelled away.

> [!WARNING] Verify when a majority is not guaranteed
> Boyer–Moore always returns *some* candidate. If no value occurs more than `n / 2` times, that candidate is meaningless — for `[1, 2, 3]` it returns 3. When the problem does not guarantee a majority, make a second pass counting the candidate and check that its count exceeds `n / 2`. The threshold is strict: in `[1, 1, 2, 2]`, no element is a majority.

The algorithm generalises: to find all values occurring more than `n / 3` times (at most two can), keep **two** candidates with two vote counters, then verify both.

## Counting as the state of other patterns

Counting rarely appears alone in harder problems; it is the bookkeeping inside another technique.

- **Sliding windows** keep counts of the elements in the window and update them as elements enter and leave. The classic bug is forgetting to remove a key whose count reaches 0 when `map.size()` is used as "number of distinct values". See [[a2-sliding-window]].
- **Prefix sums with a hash map** count how many times each prefix sum has occurred, which counts subarrays with a given sum in O(n). See [[a2-hashing]].
- **Sorting**: counting sort places each value by its count rather than by comparisons, in O(n + range). See [[a3-counting-sort]].
- **Duplicate and missing detection**: a `boolean[]` or count array over `1..n` finds the duplicate or missing number in one pass; XOR tricks ([[a13-xor-tricks]]) and in-place index marking do it in O(1) extra space when the problem demands it.

## In real systems

**Analytics.** Word counts, page-view counts and "top search terms" are frequency tables, usually built in parallel: each worker counts its share and the partial tables are merged by adding counts per key. That merge step is the heart of the classic MapReduce word-count example.

**Approximate counting at scale.** When there are too many distinct keys to store — every IP address hitting a CDN, say — systems use a **Count–Min Sketch**: a small 2D array of counters indexed by several hash functions. It may over-estimate a count (hash collisions add other keys' counts) but never under-estimates, which is good enough for finding heavy hitters. Redis offers related probabilistic structures (such as HyperLogLog for estimating the number of distinct items), and its sorted sets with `ZINCRBY` are a common way to keep exact leaderboards.

**Databases.** `SELECT word, COUNT(*) FROM t GROUP BY word` is frequency counting; the database typically implements it with a hash aggregate (a hash map from group key to running count) or by sorting and counting runs.

## Trade-offs and alternatives

| Approach | Time | Extra space | When to choose it |
|---|---|---|---|
| Count array | O(n + range) | O(range) | Small, dense key range (letters, digits, bounded values) |
| `HashMap` counts | O(n) average | O(distinct) | Arbitrary keys |
| Sort, then count runs | O(n log n) | O(1) to O(n) | Memory is tight, or sorted order is useful anyway |
| Boyer–Moore voting | O(n) | O(1) | Majority (> n/2) or > n/k with k − 1 candidates |

Counting throws away positional information. If the question involves order ("first", "earliest", "between positions"), you need a second pass, an index map, or a different technique.

## Common mistakes

> [!MISTAKE] Using an array as a map key
> `Map<int[], …>` compares arrays by identity, so two count arrays with the same contents are different keys and nothing groups. Convert the counts to a `String` or `List<Integer>` first.

**Using a `HashMap` when an `int[26]` would do.** It works, but it is slower and allocates; interviewers notice.

**Applying `c - 'a'` to characters outside `a`–`z`.** Uppercase letters, spaces or digits produce negative or out-of-range indices and an `ArrayIndexOutOfBoundsException`. Use `int[128]` for ASCII or a map for anything wider.

**Getting the majority threshold wrong.** "Majority" means strictly more than `n / 2`. With integer division, `count > nums.length / 2` is the correct test for both odd and even `n`.

**Trusting Boyer–Moore without verification** when a majority is not guaranteed.

**Forgetting to remove zero-count keys** when the map's size stands for the number of distinct values in a window.

## Interview perspective

Counting problems are usually warm-ups, so interviewers judge them on judgement and polish: choosing the right container, explaining space in terms of the alphabet, and handling the follow-ups.

> [!INTERVIEW] Justify the container
> "The input is lowercase English letters, so I'll use an `int[26]` instead of a `HashMap` — constant space, no boxing. If the input could be any Unicode text, I'd switch to a `Map<Integer, Integer>` over code points."

Expect:

- **Valid Anagram** — and "what if the strings contain Unicode?"
- **Ransom Note** — count availability first.
- **First Unique Character** — count, then scan in order.
- **Group Anagrams** — explain the key design and why arrays cannot be keys.
- **Top K Frequent Elements** — heap O(n log k) versus bucket O(n); follow-up: a stream that never ends (heap, or approximate sketches).
- **Majority Element** — map first, then Boyer–Moore for O(1) space; follow-up: elements appearing more than `n / 3` times.

## Practice

1. **Find the Difference.** `t` is `s` shuffled with one extra letter; find it with counts (then try XOR).
2. **Sort Characters By Frequency.** Count, then bucket by frequency to build the output.
3. **Majority Element II.** All elements appearing more than `n / 3` times, in O(1) space.
4. **Minimum Number of Steps to Make Two Strings Anagram.** Count the surplus letters.
5. **Find All Numbers Disappeared in an Array.** Values in `1..n`; first with a `boolean[]`, then in O(1) extra space by marking indices.

The DSA explorer lists the matching problems under this topic; start with *Valid Anagram*, *Group Anagrams* and *Top K Frequent Elements*.

```quiz
Q: Two lowercase strings of equal length are processed with one int[26]: +1 for each character of s, -1 for each character of t, returning false if any count goes negative. Why is "no count went negative" enough to prove they are anagrams?
- [ ] Because 26 counters cannot overflow
- [x] Because the counts sum to zero when the lengths are equal, so if none is negative, all must be zero
- [ ] Because the first loop already sorted the characters
- [ ] It is not enough; a final loop must check every count
> Equal lengths mean the total added equals the total subtracted, so the 26 counts sum to 0. Non-negative numbers that sum to 0 are all 0, so every letter appears equally often in both strings.

Q: Why can't you group anagrams with `Map<int[], List<String>>` keyed by each word's count array?
- [ ] Arrays cannot be stored in a HashMap at all
- [x] Arrays use identity-based equals and hashCode, so two arrays with equal contents are different keys
- [ ] Count arrays are too large to hash
- [ ] HashMap keys must be Strings
> int[] inherits equals and hashCode from Object, which compare references. Converting the counts to a String or List gives equality based on contents.

Q: Boyer–Moore voting returns 3 for the array [1, 2, 3]. What does that show?
- [ ] The algorithm has a bug
- [ ] 3 is the majority element
- [x] Without a guaranteed majority, the candidate must be verified with a counting pass
- [ ] The array must be sorted first
> The algorithm guarantees the right answer only when some value occurs more than n/2 times. Here no value does, so the surviving candidate is arbitrary; a second pass counting it shows it occurs once, not more than 1.5 times.

Q: Why can Top K Frequent Elements use bucket sort to run in O(n)?
- [ ] Because the input array is sorted
- [x] Because every frequency is an integer between 1 and n, so values can be placed into n + 1 buckets indexed by frequency
- [ ] Because k is always small
- [ ] Because HashMap iteration is sorted by frequency
> Bucket sort avoids comparisons by indexing on the key. Frequencies are bounded by the array length, so one bucket per possible frequency suffices, and reading buckets from high to low yields the most frequent values.
```

## Quick revision {#quick-revision}

- Counting forgets order: use it when shuffling the input would not change the answer.
- `int[26]` with `c - 'a'` for lowercase, `int[128]` for ASCII, `int[hi - lo + 1]` for bounded values; `HashMap` for anything else.
- `map.merge(k, 1, Integer::sum)` to increment; `getOrDefault(k, 0)` to read.
- Anagram: equal lengths, +1 for `s`, −1 for `t`, any negative → false. O(n) time, O(1) space.
- Ransom Note: count the magazine first, then spend.
- Order-sensitive question: count first, then scan the original sequence.
- Group by canonical key: sorted string or count signature with separators; never an array as a key.
- Top K: heap O(n log k); bucket by frequency O(n).
- Boyer–Moore: adopt when votes = 0, +1 match, −1 mismatch; verify when a majority (> n/2) is not guaranteed; n/3 version keeps two candidates.
- Counts are the usual state inside sliding windows and prefix-sum hashing; remove zero-count keys when using `size()`.

## Key takeaways {#key-takeaways}

- Frequency counting answers order-independent questions in O(n) by tallying each value once.
- Use a fixed-size array when keys form a small dense range and a hash map otherwise; the choice affects both speed and space.
- Combine an order-free count table with a second pass over the input to answer "first" or "earliest" questions.
- A canonical key — a sorted string or a count signature — turns grouping problems into hash-map lookups.
- Bounded counts enable bucket sort, giving O(n) top-k.
- Boyer–Moore finds a majority in O(1) space by cancelling pairs of different values, but its answer must be verified unless a majority is guaranteed.
