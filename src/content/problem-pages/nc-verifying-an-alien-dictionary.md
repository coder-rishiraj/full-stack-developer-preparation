---
problemId: nc-verifying-an-alien-dictionary
title: Verifying An Alien Dictionary
source: neetcode
sourceUrl: https://leetcode.com/problems/verifying-an-alien-dictionary/
difficulty: easy
patterns: [graphs, hashing, strings]
relatedLessons: [a2-hashing, a1-hashmap, a1-strings-stringbuilder, a1-comparable-comparator, a14-edge-cases]
companies: []
timeToSolve: 10
---

## 1. Problem restatement

An alien language writes with the 26 lowercase English letters, but its alphabet puts them in a different order, given as a 26-character string `order`. You get a list of words. Return `true` if the list is sorted in dictionary order **of the alien alphabet**, and `false` otherwise.

Dictionary order works as usual: compare two words letter by letter; the first position where they differ decides, by which letter comes first in the alphabet. If one word runs out before any difference, the shorter word comes first.

**Example 1**

- Input: `words = ["word", "world", "row"]`, `order = "worldabcefghijkmnpqstuvxyz"`
- Output: `false`
- Why: `"word"` and `"world"` agree on `w`, `o`, `r`, then have `d` against `l`. In this alphabet `l` comes before `d`, so `"world"` should come first.

**Example 2**

- Input: `words = ["apple", "app"]`, `order = "abcdefghijklmnopqrstuvwxyz"`
- Output: `false`
- Why: `"app"` is a prefix of `"apple"`, so `"app"` is the smaller word and must come first, whatever the alphabet.

The official statement also has `["hello", "leetcode"]` with `order = "hlabcdefgijkmnopqrstuvwxyz"`, which is `true` because `h` comes before `l`.

**What the problem statement guarantees**

- 1 ≤ `words.length` ≤ 100.
- 1 ≤ `words[i].length` ≤ 20.
- `order.length` is 26, and `order` is a permutation of the lowercase letters (every letter exactly once).
- Every character in the words and in `order` is a lowercase English letter.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It is short, which is why interviewers grade the details: the prefix rule, and whether you can say why your checks are enough.

**How to practise**

1. Set a timer for 10 minutes and talk out loud.
2. Write down three inputs that break a careless solution. One of them should involve a word that is a prefix of another.
3. Say the simplest check that is certainly correct, and its cost.
4. Ask which comparisons are really necessary, and how you will look up "which letter comes first" quickly.
5. Trace your code on Example 1 and Example 2.

> [!HINT] Hint 1: a small nudge
> Comparing two words needs one question answered over and over: does letter x come before letter y in this alphabet? How can you answer it without searching `order` each time?

> [!HINT] Hint 2: the kind of tool you need
> Turn `order` into a table from letter to position once. And for the list: if every word is no bigger than the next one, is the whole list sorted? Why?

> [!HINT] Hint 3: almost the whole plan
> Build `rank[letter] = position in order`. For each pair of neighbouring words, find the first position where they differ: if the first word's letter has the higher rank, return false; if they never differ, return false when the first word is longer. Return true if no neighbouring pair fails.

**Check yourself before revealing the walkthrough**

- [ ] My code returns `false` for both examples above and `true` for `["hello", "leetcode"]` with `"hlabcdefgijkmnopqrstuvwxyz"`
- [ ] It returns `true` for `["app", "apple"]` and for a list of one word, and `true` for two equal words
- [ ] I can explain why checking neighbouring words is enough
- [ ] I stop comparing two words at their first difference

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I'm checking, not sorting: the words are given, and I say whether they're already in dictionary order, where the letter order comes from `order` instead of a to z.

**Interviewer:** Yes.

**Me:** Is `order` always all 26 letters, each once?

**Interviewer:** Yes, it's a permutation of the lowercase letters, and the words use only lowercase letters.

**Me:** Then every letter has a well-defined position and no letter is missing from the alphabet. How does a prefix compare? I'd expect `"app"` before `"apple"`.

**Interviewer:** Right, a shorter word that is a prefix of a longer one comes first.

**Me:** And equal words next to each other count as sorted? Non-decreasing, not strictly increasing?

**Interviewer:** Yes, duplicates are fine.

**Me:** Sizes?

**Interviewer:** Up to 100 words, each 1 to 20 letters.

**Me:** So at most 2000 letters in total. Let me do the first example by hand: in `"worldabce…"`, w is 0, o is 1, r is 2, l is 3, d is 4. `"word"` versus `"world"`: w, o, r agree; then d (4) against l (3). The first word has the later letter, so it's out of order: false.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| `order` is a permutation of the 26 lowercase letters | Each letter has exactly one rank, 0 to 25. A 26-slot array indexed by `c - 'a'` holds the whole alphabet. |
| Words use only lowercase letters | `c - 'a'` is always a valid index 0–25. |
| 1 ≤ `words.length` ≤ 100 | A single word is sorted. Even all pairs is only 4950 comparisons, so speed is not the issue here; correctness is. |
| 1 ≤ `words[i].length` ≤ 20 | No empty words. Comparing two words is at most 20 steps. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A proper prefix comes first (`"app"` before `"apple"`) | When two words agree up to the shorter length, the order is decided by length. |
| Equal adjacent words are allowed | The check is "first ≤ second", so an exact tie is not a failure. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The input arrays are read-only | I will not reorder or modify `words`. |
| "Sorted" means ascending in the alien order | The examples confirm it; I say it so a descending reading is ruled out. |

### Edge cases I will keep in mind

- One word: `true`.
- A prefix pair in the wrong order (`["apple", "app"]`) and in the right order (`["app", "apple"]`).
- Equal neighbours: `["abc", "abc"]` is `true`.
- The deciding difference comes after a long common prefix (Example 1).
- The first letters already decide, and later letters would disagree: `["ab", "ba"]` in the normal alphabet is `true`.
- The failure is between the last two words, so the loop must reach the end.

## 4. Think out loud: from first idea to best solution

Throughout: **n** = number of words, **L** = maximum word length (at most 20), **C** = total number of letters in all words (at most n · L = 2000), and **σ** = alphabet size (26).

### Approach 1: Compare every pair of words

#### What I say out loud

> "The definition of sorted is that every word is no bigger than every word after it. I can check that literally: for each pair i < j, compare the two words. To compare letters, I'll find each letter's position in `order` with `indexOf`."

> "That's n(n − 1)/2 pairs, each up to L letter comparisons, each letter lookup up to 26 steps. About 5000 × 20 × 26, a few million operations at most. It works, but it's doing a lot of repeated work, and I'd like to see where."

#### Intuition

The definition of "sorted" is a statement about all pairs, so checking all pairs cannot be wrong.

#### Algorithm

1. For each `i` from 0 to n − 2, for each `j` from `i + 1` to n − 1:
2. If `inOrder(words[i], words[j])` is false, return `false`.
3. Return `true`.

`inOrder(a, b)`: for each position k below the shorter length, if `a[k] != b[k]`, return `order.indexOf(a[k]) < order.indexOf(b[k])`. If no position differs, return `a.length() <= b.length()`.

#### Why it is correct

- **`inOrder` implements dictionary order.** The first differing position decides by alien rank, and `indexOf` returns exactly the rank. If there is no difference within the shorter length, one word is a prefix of the other (or they are equal), and the shorter one is the smaller.
- **The outer loops check the definition directly.** A list is sorted exactly when no earlier word is bigger than a later one, and every pair i < j is checked.

#### Dry run

`words = ["wow", "word", "row"]`, `order = "worldabcefghijkmnpqstuvxyz"` (w = 0, o = 1, r = 2, l = 3, d = 4).

| i | j | Words | First difference | Ranks | In order? |
|---|---|---|---|---|---|
| 0 | 1 | `wow`, `word` | index 2: `w` vs `r` | 0 vs 2 | yes |
| 0 | 2 | `wow`, `row` | index 0: `w` vs `r` | 0 vs 2 | yes |
| 1 | 2 | `word`, `row` | index 0: `w` vs `r` | 0 vs 2 | yes |

All three pairs pass: return `true`. Notice the pair (0, 2): it was already implied by the other two.

On Example 1 the very first pair, `word` and `world`, fails at index 3 (`d` = 4 against `l` = 3), and the method returns `false`.

#### Java code

```java title="Approach 1: every pair, letter ranks by indexOf"
class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        for (int i = 0; i < words.length - 1; i++) {
            for (int j = i + 1; j < words.length; j++) {
                if (!inOrder(words[i], words[j], order)) {
                    return false;
                }
            }
        }
        return true;
    }

    // Is a <= b in the alien dictionary order?
    private boolean inOrder(String a, String b, String order) {
        int shorter = Math.min(a.length(), b.length());
        for (int k = 0; k < shorter; k++) {
            char x = a.charAt(k);
            char y = b.charAt(k);
            if (x != y) {
                return order.indexOf(x) < order.indexOf(y);   // first difference decides
            }
        }
        return a.length() <= b.length();                      // a prefix comes first
    }
}
```

#### Time complexity

**O(n² · L · σ) in the worst case.** There are n(n − 1)/2 pairs; each comparison scans at most L positions; the deciding position costs two `indexOf` calls of up to σ = 26 steps each (identical letters before it cost one `char` comparison). The worst case is a sorted list, where no pair stops the loops early: about 4950 × 20 comparisons plus 4950 × 52 `indexOf` steps at the limits. Because σ is a fixed 26, this is often written O(n² · L).

#### Space complexity

**O(1) auxiliary space**: a few indices. No copies of the words.

#### The bridge to the next approach

> "Two kinds of waste. First, the pairs. In the dry run, wow ≤ word and word ≤ row already told me wow ≤ row. Dictionary order is transitive, so if every word is ≤ its neighbour, the whole chain is sorted. Only the n − 1 neighbouring pairs matter."

> "Second, the letter lookups. Each `indexOf` searches the alphabet again. The simplest way to stop doing that: translate every word into the ordinary alphabet once, replacing each letter by the letter at its rank, so alien w becomes a, o becomes b, and so on. Then Java's own `compareTo` does the dictionary comparison, prefix rule included."

### Approach 2: Translate to the normal alphabet, compare neighbours with `compareTo`

#### What I say out loud

> "I build a table from letter to rank once. Then I rewrite each word, letter by letter, as the normal letter with the same rank. Two alien words compare exactly as their translations compare in normal a-to-z order, so I can use `String.compareTo`. And I only compare each word with the next one."

#### Intuition

Relabelling the alphabet does not change the structure of dictionary order. The translation is an exact stand-in: alien order on the originals equals normal order on the translations.

#### Algorithm

1. `rank[order.charAt(i) - 'a'] = i` for i = 0..25.
2. For each word, build its translation: each letter `c` becomes `(char) ('a' + rank[c - 'a'])`.
3. For each i from 0 to n − 2: if `translated[i].compareTo(translated[i + 1]) > 0`, return `false`.
4. Return `true`.

#### Why it is correct

**Translation preserves order.** Translation maps each letter to a letter, and maps different letters to different letters (ranks are distinct). Comparing two translations, the first differing position is the same as for the originals, and there the normal letters compare as the ranks do. If there is no difference, the lengths are the same as the originals'. So `a` ≤ `b` in the alien order exactly when `translate(a) ≤ translate(b)` in normal order, which `compareTo` decides (it also puts a prefix first).

**Neighbouring pairs are enough.** Normal dictionary order is a total order, so it is transitive: x ≤ y and y ≤ z give x ≤ z. By the previous point, alien order is transitive too.

- If every neighbouring pair is in order, w0 ≤ w1 ≤ … ≤ w(n−1), and chaining gives wi ≤ wj for every i < j: the list is sorted.
- If some pair i < j is out of order, some neighbouring pair is out of order: otherwise the chain from i to j would give wi ≤ wj.

So the n − 1 neighbouring checks decide exactly what the n(n − 1)/2 checks of Approach 1 decided.

#### Dry run

Example 1, `order = "worldabcefghijkmnpqstuvxyz"`: ranks w = 0, o = 1, r = 2, l = 3, d = 4.

| Word | Translation |
|---|---|
| `word` | `abce` |
| `world` | `abcde` |
| `row` | `cba` |

| i | Compare | `compareTo` | Action |
|---|---|---|---|
| 0 | `abce` vs `abcde` | `'e' - 'd'` = 1 > 0 | return `false` |

Example 2 (normal alphabet): the translations are the words themselves, and `"apple".compareTo("app")` is 2 (the length difference) > 0, so `false`.

#### Java code

```java title="Approach 2: translate, then compareTo on neighbours"
class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        int[] rank = new int[26];
        for (int i = 0; i < order.length(); i++) {
            rank[order.charAt(i) - 'a'] = i;
        }
        String previous = translate(words[0], rank);
        for (int i = 1; i < words.length; i++) {
            String current = translate(words[i], rank);
            if (previous.compareTo(current) > 0) {
                return false;
            }
            previous = current;
        }
        return true;
    }

    // Rewrite a word in the normal alphabet: the letter of rank r becomes 'a' + r.
    private String translate(String word, int[] rank) {
        char[] out = new char[word.length()];
        for (int k = 0; k < word.length(); k++) {
            out[k] = (char) ('a' + rank[word.charAt(k) - 'a']);
        }
        return new String(out);
    }
}
```

#### Time complexity

**O(C + σ) in the worst case**, where C is the total number of letters. Building `rank` is σ = 26 steps. Each word is translated once (each letter once), and each word takes part in at most two `compareTo` calls, each at most as long as the shorter word.

#### Space complexity

**O(L + σ) auxiliary space**: the rank table and the translations of two words at a time (each at most L letters). Translating the whole list up front would be O(C).

#### The bridge to the next approach

> "That's linear, but it allocates a new string per word, and it translates letters that the comparison never looks at: in `word` versus `world`, everything after index 3 is irrelevant. I can compare the original words directly and look up ranks only where needed. The first structure that comes to mind for letter to rank is a map."

### Approach 3: Compare neighbours in place, ranks in a `HashMap`

#### What I say out loud

> "I put each letter's rank in a `HashMap<Character, Integer>`. Then for each neighbouring pair I walk to the first differing letter and compare the two ranks. If there's no difference, the longer word must come second. No copies of words."

#### Intuition

Exactly the comparison of Approach 1, run on neighbours only, with the slow `indexOf` replaced by a map lookup.

#### Algorithm

1. Fill `rank` with `order.charAt(i) → i`.
2. For each i from 0 to n − 2, compare `words[i]` and `words[i + 1]`:
3. Walk k over the shorter length; at the first k with different letters, return `false` if `rank.get(a[k]) > rank.get(b[k])`, and stop comparing this pair either way.
4. If no difference was found and `words[i]` is longer, return `false`.
5. Return `true`.

#### Why it is correct

The pair comparison is dictionary order (the same argument as Approach 1), with the map returning exactly each letter's position in `order`. Checking neighbours only is enough by the transitivity argument of Approach 2.

#### Dry run

`words = ["wow", "word", "row"]`, `order = "worldabcefghijkmnpqstuvxyz"`.

| Pair | First difference | `rank.get` | Result |
|---|---|---|---|
| `wow`, `word` | index 2: `w`, `r` | 0, 2 | in order |
| `word`, `row` | index 0: `w`, `r` | 0, 2 | in order |

Return `true` after two comparisons instead of Approach 1's three. On Example 2, `apple` and `app` never differ within 3 letters, and `apple` is longer, so `false`.

#### Java code

```java title="Approach 3: neighbours in place, HashMap of ranks"
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        Map<Character, Integer> rank = new HashMap<>();
        for (int i = 0; i < order.length(); i++) {
            rank.put(order.charAt(i), i);
        }
        for (int i = 0; i < words.length - 1; i++) {
            if (!inOrder(words[i], words[i + 1], rank)) {
                return false;
            }
        }
        return true;
    }

    private boolean inOrder(String a, String b, Map<Character, Integer> rank) {
        int shorter = Math.min(a.length(), b.length());
        for (int k = 0; k < shorter; k++) {
            char x = a.charAt(k);
            char y = b.charAt(k);
            if (x != y) {
                return rank.get(x) < rank.get(y);   // unboxed ints, so < compares values
            }
        }
        return a.length() <= b.length();
    }
}
```

#### Time complexity

**O(C + σ) expected time.** Building the map is 26 `put`s. Each neighbouring comparison reads at most the shorter word and does at most two `get`s. Map operations are constant on average, assuming the hash codes spread well; with 26 `Character` keys of distinct hash codes they do, but formally it is an expected bound.

#### Space complexity

**O(σ) auxiliary space**: 26 map entries, each a node with boxed key and value. No copies of words.

#### The bridge to the next approach

> "The map's keys are the 26 letters, which are already small integers: `c - 'a'` is 0 to 25. A hash table for a key space that small is overkill. An `int[26]` indexed by `c - 'a'` is direct addressing: no hashing, no boxing, guaranteed constant time."

### Approach 4: Compare neighbours in place, ranks in an `int[26]` (recommended)

#### What I say out loud

> "Same algorithm, with `rank` as an int array: `rank[c - 'a']` is the position of c in the alien alphabet. For each neighbouring pair I find the first differing letter and compare ranks; if one is a prefix of the other, the shorter must come first. Only neighbours, because dictionary order is transitive."

#### Intuition

Dictionary order only ever needs one fact per comparison: the rank of two letters. Store all 26 ranks in a table indexed by the letter itself, and every comparison is a constant-time array read.

#### Algorithm

1. `rank[order.charAt(i) - 'a'] = i` for i = 0..25.
2. For each i from 0 to n − 2: let `a = words[i]`, `b = words[i + 1]`.
3. For k below the shorter length: if `a[k] != b[k]`, then if `rank[a[k]] > rank[b[k]]` return `false`, and in both cases stop comparing this pair.
4. If the loop found no difference and `a` is longer than `b`, return `false`.
5. Return `true`.

#### Why it is correct

**Each pair comparison is exactly alien dictionary order.**

- At the first differing position the ranks decide, and `rank` holds the true positions in `order` because `order` contains each letter exactly once.
- Stopping at that position is required: later letters do not matter once one differs.
- If the shorter length passes with no difference, one word is a prefix of the other (or they are equal), and the pair is in order exactly when the first is not longer.

**Neighbouring pairs decide the whole list.** Alien dictionary order is the normal dictionary order of the translated words (Approach 2), so it is a total order and in particular transitive. If all n − 1 neighbouring pairs are in order, chaining gives every pair i < j in order. If any pair i < j is out of order, then some neighbouring pair between them is out of order, because otherwise chaining would put wi ≤ wj. So the method returns `true` exactly when the list is sorted.

**The 20-second version to say out loud:**

> "rank maps each letter to its position in the alien alphabet. Two words compare at their first differing letter by rank, and if one is a prefix of the other the shorter comes first. Dictionary order is transitive, so if every word is at most the next one, the whole list is sorted, and any out-of-order pair forces an out-of-order neighbour. So n − 1 comparisons suffice."

#### Dry run

Example 1: `words = ["word", "world", "row"]`, `order = "worldabcefghijkmnpqstuvxyz"`.

`rank`: w = 0, o = 1, r = 2, l = 3, d = 4 (then a = 5, b = 6, …).

| Pair | k | Letters | Equal? | Action |
|---|---|---|---|---|
| `word`, `world` | 0 | `w`, `w` | yes | continue |
| | 1 | `o`, `o` | yes | continue |
| | 2 | `r`, `r` | yes | continue |
| | 3 | `d`, `l` | no | rank 4 > rank 3: return `false` |

The pair `world`, `row` is never examined.

Example 2: `apple`, `app`: k = 0, 1, 2 all equal; the shorter length (3) is exhausted; `apple` (5) is longer than `app` (3): return `false`.

#### Java code

```java title="Approach 4: neighbours in place, int[26] ranks (recommended)"
class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        int[] rank = new int[26];                     // rank[c - 'a'] = position of c in order
        for (int i = 0; i < order.length(); i++) {
            rank[order.charAt(i) - 'a'] = i;
        }
        for (int i = 0; i < words.length - 1; i++) {
            if (!inOrder(words[i], words[i + 1], rank)) {
                return false;                         // one bad neighbour is enough
            }
        }
        return true;
    }

    // Is a <= b in the alien dictionary order?
    private boolean inOrder(String a, String b, int[] rank) {
        int shorter = Math.min(a.length(), b.length());
        for (int k = 0; k < shorter; k++) {
            char x = a.charAt(k);
            char y = b.charAt(k);
            if (x != y) {
                return rank[x - 'a'] < rank[y - 'a'];  // first difference decides
            }
        }
        return a.length() <= b.length();               // equal so far: the prefix comes first
    }
}
```

#### Time complexity

**O(C + σ) in the worst case**, which is O(C) since σ = 26 is fixed. Building `rank` is 26 steps. Each word takes part in at most two comparisons, each reading at most the shorter word, so the total is at most 2C letter comparisons. At the limits that is a few thousand steps.

#### Space complexity

**O(σ) = O(1) auxiliary space**: one array of 26 integers. No copies of the words, no recursion.

## 5. Comparison table

n = number of words, L = maximum word length, C = total letters (≤ n · L), σ = 26.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Every pair, `indexOf` | O(n² · L · σ) | O(n² · L · σ) | O(1) |
| 2. Translate, `compareTo` on neighbours | O(C + σ) | O(C + σ) | O(L + σ) |
| 3. Neighbours in place, `HashMap` ranks | O(C + σ) | O(C + σ) in practice (26 keys with distinct hash codes); formally a hash-table bound | O(σ) |
| 4. Neighbours in place, `int[26]` ranks | O(C + σ) | O(C + σ) | O(σ) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Every pair | Checks the definition literally | Quadratic in n; searches the alphabet per letter | As the baseline you state |
| 2. Translate | Reuses `compareTo`, which already knows the prefix rule; the translation doubles as the transitivity proof | Allocates a string per word; translates letters it never compares | When you want to lean on the library, or need the translated keys anyway (to sort by them) |
| 3. `HashMap` ranks | Natural first instinct for "look up a letter's position" | Hashing and boxing for 26 keys | Only if the alphabet were large or unknown (Unicode) |
| 4. `int[26]` ranks | Fastest, no allocation per word, constant-time lookups guaranteed | Tied to a small alphabet | The default answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 4, the rank array and neighbouring comparisons, with the transitivity argument said out loud.

**Is it optimal?** Yes. In the worst case a correct algorithm must look at essentially every letter: in a list that is sorted except possibly at one position, any unread letter could be the one that breaks the order. That is an Ω(C) worst-case lower bound, and the solution is O(C + 26).

**When another is fine:** Approach 2 is equally linear and is a good answer if you prefer delegating the dictionary comparison to `compareTo`; just say what it allocates. Approach 3 is the answer for an alphabet too large for an array.

**When to stop:** once you have linear time, constant extra space and the neighbour argument. There is nothing meaningful left; spend the time on the prefix edge case and testing.

## 7. Interview script: code it and test it

### What I say while coding

> "First the rank table: for each position i in `order`, `rank[order.charAt(i) - 'a'] = i`. It's the inverse of `order`: order maps position to letter, rank maps letter to position."

> "Then one loop over neighbouring pairs, with a helper `inOrder(a, b)`, because a separate function lets me `return` at the first difference instead of juggling a flag and a `break`."

> "In the helper, I loop to the shorter length. At the first differing letter I return the rank comparison. If I fall out of the loop, one word is a prefix of the other, and it's in order only if the first is not longer."

### Testing out loud

**Example 1:** `word` vs `world`: three equal letters, then `d` (rank 4) vs `l` (rank 3): return false. Correct.

**Example 2:** `apple` vs `app`: no difference in three letters; 5 > 3, return false. Correct.

**Official example:** `hello` vs `leetcode` with `h` = 0, `l` = 1: first letters differ, 0 < 1, in order. One pair, return true. Correct.

**Prefix in the right order:** `["app", "apple"]`: no difference; 3 ≤ 5, in order; return true.

**Equal words:** `["abc", "abc"]`: no difference; equal lengths; in order; true.

**Later letters disagree:** `["ab", "ba"]` with the normal alphabet: `a` < `b` at index 0, return true immediately for that pair; the `b`/`a` at index 1 is never looked at. Correct.

**One word:** the loop runs zero times; true.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Permutation guarantee, the prefix rule, equal words |
| Baseline | 1 min | All pairs with `indexOf`, and its cost |
| Improve | 2 min | Neighbours only (transitivity), and a rank table instead of `indexOf` |
| Code | 3 min | Rank array, loop, helper |
| Test | 2 min | Both examples, a correct prefix, equal words |

This is a warm-up-sized problem. The time should go to the prefix rule and to the one sentence about transitivity; those are what separate a complete answer from a lucky one. If you are stuck, compare two words by hand and say what you look at: that is the helper.

## 9. Interviewer challenges

### About correctness

#### Why is it enough to compare only adjacent words?

**What they are testing:** whether you can justify the main simplification instead of asserting it.

**How to reason:** dictionary order is a total order, hence transitive. Then argue both directions: all neighbours in order implies all pairs in order, and an out-of-order pair implies an out-of-order neighbour.

**What I say:** "Alien dictionary order is just normal dictionary order after relabelling the letters, so it's transitive. If each word is at most the next, chaining gives every earlier word at most every later word. And if some pair i < j were out of order while all neighbours between them were fine, chaining would give wi ≤ wj, a contradiction. So the neighbours decide."

**Nuance:** this relies on the order being transitive. A comparison that is not (say, "rock beats scissors beats paper beats rock") would need all pairs.

#### Why do you stop at the first differing letter?

**What they are testing:** understanding of dictionary order, and a very common bug.

**How to reason:** the first difference decides; everything after it is irrelevant, even if it disagrees.

**What I say:** "Because the first difference decides the order. With the normal alphabet, `ab` comes before `ba` because a < b at index 0, even though index 1 has b > a. If I kept comparing and failed on any later inversion, I'd return false for a sorted list."

**Nuance:** I ran that buggy version: on `["ab", "ba"]` with the normal alphabet it returns `false`.

#### What if `order` were not a full permutation?

**What they are testing:** whether you know which guarantee your code relies on.

**How to reason:** `rank` defaults to 0 for missing letters, which would tie them with the first letter.

**What I say:** "My rank table would give a missing letter rank 0, the same as the first letter, which is wrong. I'd fill the table with −1 first and decide with the interviewer whether an unknown letter is an error. The statement guarantees a permutation, so I don't need it here."

**Nuance:** a repeated letter in `order` would make the later position overwrite the earlier one; again excluded by the guarantee.

### About the implementation

#### Why an array instead of a `HashMap`?

**What they are testing:** choosing data structures from the key space.

**How to reason:** 26 keys that map directly to 0–25.

**What I say:** "The keys are the 26 lowercase letters, and `c - 'a'` turns them into indices 0 to 25. An array is direct addressing: no hashing, no boxing, constant time guaranteed. A map would be the right choice for an unknown or huge alphabet, like arbitrary Unicode."

**Nuance:** with the map, `rank.get(x) < rank.get(y)` is safe because `<` unboxes; comparing two `Integer`s with `==` would not be (it compares references outside −128..127, though ranks here are all small).

## 10. Follow-up questions the interviewer might ask

**"Sort the words by the alien order instead of checking."** Sort with a comparator that uses the same rank comparison (or sort the translated strings and map back): O(n log n) comparisons of O(L) letters each, so O(n log n · L) time.

**"The alphabet is unknown; infer it from a sorted list of words."** That is [[nc-alien-dictionary|Alien Dictionary]]: each neighbouring pair's first difference gives an edge "letter x before letter y", and a topological sort of those edges gives an order (or reports a cycle, or a prefix violation like `["apple", "app"]`). The neighbour argument from this page is exactly why only neighbouring pairs produce edges.

**"Return the first index where the list is out of order."** Return `i + 1` (or the pair) at the first failing neighbour; by the transitivity argument, the first failing neighbour is also where the sorted prefix ends. Same complexity.

**"The words arrive as a stream."** Keep only the previous word and the rank table: O(L + σ) memory, O(1) amortized work per letter.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Forgetting the prefix rule.** Without the final length check, `["apple", "app"]` returns `true` (checked by running it).
- **Not stopping at the first difference.** Treating any later inverted letter as a failure rejects `["ab", "ba"]` in the normal alphabet.
- **Believing all pairs must be checked.** Correct but unnecessary; the interviewer wants the transitivity argument.
- **Treating equal neighbours as a failure.** The order is non-decreasing; equal words are allowed.

### Implementation mistakes

> [!MISTAKE] Building the inverse table
> `rank[i] = order.charAt(i) - 'a'` stores "which letter is at position i", not "which position letter i has". It happens to give the right answer on both of LeetCode's first two examples, but `["row", "word"]` with `order = "worldabcefghijkmnpqstuvxyz"` returns `true` instead of `false` (checked by running it). The correct line is `rank[order.charAt(i) - 'a'] = i`.

- **Indexing past the shorter word** by looping to the longer length: `charAt` throws on `["apple", "app"]`.
- **Comparing raw `char` values** (`x < y`) instead of ranks: that is the English order, which is right only for the normal alphabet.
- **Looping `i` to `words.length` and reading `words[i + 1]`:** out of bounds on the last word.

## 12. Pattern recognition

**The pattern:** a lookup table for a small fixed key space (direct addressing), plus "sorted iff every neighbouring pair is in order" for any transitive order.

**Signals in the problem statement:**

- A custom ranking of a small fixed alphabet or set of categories.
- "Is this sequence sorted?" under an unusual comparison.
- Keys that are small integers in disguise (`c - 'a'`, digits, days of the week).

**Related problems in this list:**

- [[nc-alien-dictionary|Alien Dictionary]]: the reverse problem; neighbouring words give the edges of a graph.
- [[nc-valid-sudoku|Valid Sudoku]]: another "composite keys and lookup tables" check, with fixed small key spaces.
- [[nc-valid-anagram|Valid Anagram]]: a 26-slot array instead of a hash map for letters.
- [[nc-design-hashmap|Design HashMap]]: when the key space is small enough, direct addressing beats hashing.
- [[nc-longest-common-prefix|Longest Common Prefix]]: the same "walk to the first difference" loop.

**Takeaway:** when keys are letters, digits or other small ranges, index an array by them; and to check a sequence against a transitive order, compare only neighbours.

## 13. 60-second revision card

**Key insight:** build `rank[letter] = position`; compare each word only with the next one, at their first differing letter; a prefix must come first.

**Invariant:** after checking pairs up to i, `words[0..i+1]` is sorted (transitivity).

**Complexity:** O(C + 26) time, where C is the total number of letters; O(26) = O(1) extra space. Ω(C) worst-case lower bound.

**Code skeleton:**

```java title="Alien order check, core loop" fragment="public boolean isAlienSorted(String[] words, String order)"
int[] rank = new int[26];
for (int i = 0; i < 26; i++) rank[order.charAt(i) - 'a'] = i;
outer:
for (int i = 0; i + 1 < words.length; i++) {
    String a = words[i], b = words[i + 1];
    for (int k = 0; k < Math.min(a.length(), b.length()); k++) {
        if (a.charAt(k) != b.charAt(k)) {
            if (rank[a.charAt(k) - 'a'] > rank[b.charAt(k) - 'a']) return false;
            continue outer;                       // first difference decided this pair
        }
    }
    if (a.length() > b.length()) return false;    // the prefix must come first
}
return true;
```

**Traps:** the prefix case; stopping at the first difference; `rank` built backwards; reading `words[i + 1]` past the end.
