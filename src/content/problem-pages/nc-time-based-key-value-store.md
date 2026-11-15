---
problemId: nc-time-based-key-value-store
title: Time Based Key-Value Store
source: neetcode
sourceUrl: https://leetcode.com/problems/time-based-key-value-store/
difficulty: medium
patterns: [binary-search, hashing]
relatedLessons: [a3-lower-upper-bounds, a3-binary-search, a2-hashing, a6-bst, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

Build a class `TimeMap` that remembers every value ever stored under a key, together with the time it was stored.

- `set(key, value, timestamp)` records that `key` had `value` at time `timestamp`.
- `get(key, timestamp)` returns the value of the latest `set` for `key` whose timestamp is **at most** `timestamp`. If `key` has no such `set` (it was never set, or only later), it returns the empty string `""`.

**Example**

| Call | Returns | Why |
|---|---|---|
| `set("foo", "bar", 1)` | | foo is "bar" from time 1 |
| `get("foo", 1)` | `"bar"` | the set at time 1 counts: "at most" includes equality |
| `get("foo", 3)` | `"bar"` | no newer set yet, so the value at time 1 still holds |
| `set("foo", "bar2", 4)` | | foo is "bar2" from time 4 |
| `get("foo", 4)` | `"bar2"` | the set at time 4 is the latest one at or before 4 |
| `get("foo", 5)` | `"bar2"` | |

A query before the first set of a key, such as `get("foo", 0)` if timestamps could be 0, would return `""`.

**What the problem statement guarantees**

- Keys and values are 1 to 100 characters, each a lowercase letter or a digit.
- 1 ≤ `timestamp` ≤ 10^7.
- The timestamps of all `set` calls are **strictly increasing**, across all keys.
- There are at most 2 × 10^5 calls to `set` and `get` in total.

## 2. Practice first: try it before reading on

The question hides one guarantee that does most of the work for you. Find it, say why it matters, and then the code is short; miss it, and you will build something heavier than needed. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write down, for one key, the list of everything `set` has stored for it, in the order the calls arrive. What do you notice about the timestamps in that list?
3. Phrase what `get` must find in terms of that list, as precisely as you can.
4. Write the class, then run the example above and a query earlier than the first set through it by hand.

> [!HINT] Hint 1: a small nudge
> Group the history by key first, so a `get` never looks at other keys. Then look at the order in which one key's entries arrive. The statement promises something about it.

> [!HINT] Hint 2: the kind of tool you need
> Because set timestamps only ever increase, appending each `(timestamp, value)` to its key's list keeps the list sorted by time. In a sorted list, "the last entry whose time is at most t" can be found by halving instead of scanning.

> [!HINT] Hint 3: almost the whole plan
> Use a hash map from key to a growing list of `(timestamp, value)`. In `get`, search the list for the first index whose timestamp is greater than t; the answer is the entry just before it, or `""` if that index is 0.

**Check yourself before revealing the walkthrough**

- [ ] I can say which guarantee makes each key's list sorted without sorting it
- [ ] My `get` returns the entry with time exactly equal to the query, not the one before it
- [ ] My `get` returns `""` for a key never set and for a query earlier than the key's first set
- [ ] I can state the cost of `set` and `get`, and which parts are expected rather than guaranteed

## 3. Interview script: understand the problem (≈2 min)

**Me:** So `set` adds a version of a key at a time, and `get(key, t)` returns the newest version at or before t. Equal counts?

**Interviewer:** Yes, at or before.

**Me:** And if the key has nothing at or before t, the empty string. Does a new `set` replace the old value, or do I keep both?

**Interviewer:** Keep both. Old timestamps can still be queried.

**Me:** Then I keep the whole history. The statement says set timestamps are strictly increasing. Is that across all keys, or per key?

**Interviewer:** Across all calls to `set`.

**Me:** Then per key too, since one key's sets are a subsequence of all sets. That means if I append each set to its key's list, the list is already sorted by time, with no two equal timestamps. Can `get` timestamps go backwards?

**Interviewer:** Yes, `get` can ask about any time.

**Me:** Fine, only sets are ordered. Sizes: 2 × 10^5 calls in total, timestamps up to 10^7, strings up to 100 characters. So a single key could hold up to about 2 × 10^5 versions, and scanning them on every `get` could be 10^10 steps. I need something logarithmic per query.

**Me:** By hand: love = "high" at 10, "low" at 20. `get(love, 15)` is "high": the latest time at or before 15 is 10. `get(love, 20)` is "low". `get(love, 5)` is "", since nothing is that early.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| Set timestamps strictly increasing (across all keys) | Each key's sets arrive in increasing time order, so appending keeps its list sorted with distinct times. No sorting, no tree needed. |
| 1 ≤ timestamp ≤ 10^7 | Fits in an `int`; no overflow when comparing or computing midpoints of list indices. |
| At most 2 × 10^5 calls | One key can have up to about 2 × 10^5 versions, so a linear scan per `get` can reach around 10^10 steps in total. |
| Keys and values: 1–100 lowercase letters or digits | Keys can be `HashMap` keys directly; hashing one costs O(L) for length L ≤ 100. Values are stored as given; "" can never be a real value, so it safely means "nothing". |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A `set` does not delete older versions | I store every version, not just the latest. |
| `get` timestamps can be in any order | Only the set side is sorted; each `get` must search, it cannot keep a pointer moving forward. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Single-threaded use | No locking. |
| Memory for every version is acceptable | At most 2 × 10^5 versions, each a small object. |

### Edge cases I will keep in mind

- `get` on a key that was never set.
- `get` earlier than the key's first set.
- `get` exactly at a set's timestamp (equality counts).
- `get` later than the key's last set.
- A key with a single version.
- The same value stored at two times, and a key whose text equals another key's value.

## 4. Think out loud: from first idea to best solution

Throughout: **N** is the number of `set` calls so far, **m** is the number of versions stored for the key being queried (m ≤ N ≤ 2 × 10^5), and **L** is the length of the key (at most 100 characters).

The first idea is a hash map from key to a list of `(timestamp, value)`, where `get` walks the list from the newest entry backwards and returns the first one with time ≤ t. It is correct, because the list is in time order, so the first match from the back is the latest one at or before t. But it costs O(m) per `get` in the worst case. With 10^5 versions of one key and 10^5 queries for early times, that is about 10^10 steps, so I would only describe it.

### Approach 1: Hash map of TreeMaps, `floorEntry`

#### What I say out loud

> "What `get` asks for is the largest timestamp that is at most t, for one key. That's exactly a floor query, and Java's `TreeMap` has `floorEntry`. So: a `HashMap` from key to a `TreeMap` from timestamp to value. `set` puts into the key's tree; `get` calls `floorEntry(t)` and returns its value, or "" if it's null. Both are logarithmic in the number of versions."

#### Intuition

A balanced search tree keeps keys in order under arbitrary inserts and answers "largest key ≤ t" in logarithmic time. The hash map splits the problem by key, and the tree handles the time dimension. It needs no reasoning about the order of `set` calls at all, which is both its strength and, as we'll see, a sign that it does more work than needed.

#### Algorithm

1. `history`: a `HashMap<String, TreeMap<Integer, String>>`.
2. `set(key, value, t)`: get or create the key's tree, then `put(t, value)`.
3. `get(key, t)`: if the key has no tree, return "". Otherwise `entry = tree.floorEntry(t)`; return `entry.getValue()`, or "" if `entry` is null.

#### Why it is correct

The tree for a key contains exactly the `(timestamp, value)` pairs set for that key, since `set` adds to it and nothing removes from it; timestamps are distinct, so no put overwrites another. `floorEntry(t)` returns the entry with the greatest timestamp ≤ t, or null when every timestamp is greater than t. That is the definition of the answer, with null translating to "".

#### Dry run

`set(love, high, 10)`, `set(love, low, 20)`, `set(mood, calm, 25)`. The tree for love is {10: high, 20: low}; for mood, {25: calm}.

| Call | Tree searched | `floorEntry` | Returns |
|---|---|---|---|
| `get(love, 5)` | {10, 20} | null: every key is above 5 | `""` |
| `get(love, 15)` | {10, 20} | 10 → high | `"high"` |
| `get(love, 20)` | {10, 20} | 20 → low (equality counts) | `"low"` |
| `get(mood, 24)` | {25} | null | `""` |
| `get(hate, 30)` | none | | `""` |

#### Java code

```java title="Approach 1: HashMap of TreeMaps"
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

class TimeMap {
    private final Map<String, TreeMap<Integer, String>> history = new HashMap<>();

    public TimeMap() {
    }

    public void set(String key, String value, int timestamp) {
        history.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
    }

    public String get(String key, int timestamp) {
        TreeMap<Integer, String> versions = history.get(key);
        if (versions == null) {
            return "";                                     // key never set
        }
        Map.Entry<Integer, String> floor = versions.floorEntry(timestamp);
        return floor == null ? "" : floor.getValue();      // null: every version is later
    }
}
```

#### Time complexity

**`set` and `get`: O(L + log m), where the O(L) hash part is expected.** Looking up the key in the `HashMap` hashes the string (O(L), since a fresh `String` object computes its hash code from every character) and is O(1) expected beyond that, assuming hash codes spread well. `TreeMap` is a red-black tree: its documentation guarantees log(m) time for `get`, `put`, `containsKey` and `remove`, and `floorEntry` walks one root-to-leaf path of the same tree, whose height is O(log m). Each step compares two `Integer`s in O(1).

#### Space complexity

**O(N) objects beyond the stored strings themselves.** Each version costs a tree node, which in OpenJDK's implementation holds a key, a value, three child/parent references and a colour flag, plus a boxed `Integer` for the timestamp (the `Integer` cache only covers −128 to 127).

#### The bridge to the next approach

> "The tree keeps the timestamps sorted under arbitrary inserts. But I never have arbitrary inserts: set timestamps strictly increase, so every new version goes at the end. A plain list that I append to is already sorted. On a sorted list, 'the last entry with time ≤ t' is a binary search, specifically an upper bound: find the first time greater than t and step back one. Same logarithmic query, a cheaper append, and much less memory per version."

### Approach 2: Hash map of append-only lists, upper-bound binary search (recommended)

#### What I say out loud

> "Each key maps to an `ArrayList` of small `(timestamp, value)` records. `set` appends. The list stays sorted because set timestamps strictly increase: a later append always has a larger time than everything already in that key's list."

> "For `get`, I want the last entry with time ≤ t. I'll search for the first index whose time is greater than t, the upper bound, with the half-open loop: `lo = 0`, `hi = size`. If that index is 0, nothing is early enough and I return "". Otherwise the answer is the entry just before it."

#### Intuition

Picture each entry as answering "is its time ≤ t?": yes, yes, yes, no, no. The answer is the last yes. Searching for the first no (the upper bound from [[a3-lower-upper-bounds|Lower and Upper Bounds]]) and stepping back one is easier to get right than searching for the last yes directly, because it is the same half-open loop as [[nc-search-insert-position|Search Insert Position]] with `<=` in place of `<`.

#### Algorithm

1. `history`: a `HashMap<String, List<Version>>`, where `Version` holds an `int timestamp` and a `String value`.
2. `set(key, value, t)`: append `new Version(t, value)` to the key's list, creating it if needed.
3. `get(key, t)`: if the key has no list, return "".
4. `lo = 0`, `hi = list.size()`. While `lo < hi`: `mid = lo + (hi − lo) / 2`; if `list[mid].timestamp <= t`, `lo = mid + 1`, else `hi = mid`.
5. If `lo == 0`, return ""; otherwise return `list[lo − 1].value`.

#### Why it is correct

**Why each list is sorted.** Every `set` has a larger timestamp than every earlier `set`, for any key. So when a version is appended to a key's list, its timestamp is larger than every timestamp already in that list. By induction on the number of sets, each list is strictly increasing by timestamp. This is the only reason a binary search is allowed here; without the guarantee, appending would not keep the list sorted.

**The invariant of the search:** every index before `lo` has timestamp ≤ t, and every index from `hi` to the end has timestamp > t.

- **Start.** `lo = 0`, `hi = size`: both claims are about empty sets.
- **`list[mid].timestamp <= t`.** By sorted order every index up to `mid` is also ≤ t, so `lo = mid + 1` keeps the invariant.
- **`list[mid].timestamp > t`.** Every index from `mid` on is > t, so `hi = mid` keeps it; `mid` itself might be the first such index, so it is not skipped.
- **Termination.** `lo <= mid < hi`, so each step either raises `lo` or lowers `hi`; the gap shrinks.
- **The result.** When `lo == hi`, indices `0 .. lo − 1` are exactly the versions with time ≤ t. If there are none, the answer is "". Otherwise the last of them, index `lo − 1`, has the largest time ≤ t, which is the answer.

**The 25-second version to say to the interviewer:**

> "Set timestamps strictly increase, so appending to each key's list keeps it sorted by time. In `get` I find the first version with time greater than t, keeping everything before `lo` at most t and everything from `hi` on greater than t. When they meet, the version just before `lo` is the latest one at or before t, and if `lo` is 0 there is none, so I return the empty string."

#### Dry run

Five versions of one key: `set(k, a, 2)`, `set(k, b, 4)`, `set(k, c, 7)`, `set(k, d, 9)`, `set(k, e, 12)`. The list for k is `[(2,a), (4,b), (7,c), (9,d), (12,e)]`, sorted because each set came later than the one before.

`get(k, 8)`:

| lo | hi | mid | list[mid].timestamp | ≤ 8? | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 7 | yes | `lo = 3` |
| 3 | 5 | 4 | 12 | no | `hi = 4` |
| 3 | 4 | 3 | 9 | no | `hi = 3` |
| 3 | 3 | | | | `lo = 3`, return `list[2].value` = `"c"` |

`get(k, 1)`, earlier than every version:

| lo | hi | mid | list[mid].timestamp | ≤ 1? | Action |
|---|---|---|---|---|---|
| 0 | 5 | 2 | 7 | no | `hi = 2` |
| 0 | 2 | 1 | 4 | no | `hi = 1` |
| 0 | 1 | 0 | 2 | no | `hi = 0` |
| 0 | 0 | | | | `lo = 0`, return `""` |

`get(k, 12)` probes times 7 and 12, both ≤ 12, which takes `lo` to 3 and then 5, and returns `list[4].value` = `"e"`: equality moves `lo` past the matching version, so stepping back one lands on it.

#### Java code

```java title="Approach 2: HashMap of lists, upper-bound binary search (recommended)"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class TimeMap {
    private static final class Version {
        final int timestamp;
        final String value;

        Version(int timestamp, String value) {
            this.timestamp = timestamp;
            this.value = value;
        }
    }

    // Each list is sorted by timestamp: set timestamps strictly increase, and we only append.
    private final Map<String, List<Version>> history = new HashMap<>();

    public TimeMap() {
    }

    public void set(String key, String value, int timestamp) {
        history.computeIfAbsent(key, k -> new ArrayList<>()).add(new Version(timestamp, value));
    }

    public String get(String key, int timestamp) {
        List<Version> versions = history.get(key);
        if (versions == null) {
            return "";                                  // key never set
        }
        // Upper bound: the first index whose timestamp is greater than the query.
        int lo = 0;
        int hi = versions.size();                       // before lo: <= timestamp; from hi on: > timestamp
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (versions.get(mid).timestamp <= timestamp) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo == 0 ? "" : versions.get(lo - 1).value;   // the latest version at or before timestamp
    }
}
```

#### Time complexity

**`set`: O(L) expected plus O(1) amortized. `get`: O(L) expected plus O(log m).** Both hash the key string (O(L)) and look it up in the `HashMap` in O(1) expected time, assuming hash codes spread well. `ArrayList.add` is amortized constant time, as its documentation states: occasionally the backing array is copied into a larger one. The search makes at most ⌊log2 m⌋ + 1 probes, each an O(1) `ArrayList.get` and an `int` comparison; for m = 2 × 10^5 that is at most 18 probes. Over all calls, the total is O(C · L + G · log N) expected, where C ≤ 2 × 10^5 is the number of calls and G the number of `get`s.

#### Space complexity

**O(N) objects beyond the strings**, plus the strings themselves. Each version costs one small object with an `int` and a reference, and one slot in the list's backing array (which can be up to about 1.5 times the list's size after a growth step, in OpenJDK's implementation). That is several fields per version fewer than a tree node plus a boxed `Integer`.

## 5. Comparison table

N = number of `set` calls so far, m = versions of the queried key, L = key length (≤ 100). Hash map lookups are expected O(L) assuming well-spread hash codes; their worst case depends on the `HashMap` implementation, so the worst-case column shows the part each approach controls.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Linear scan per key (not coded) | `set` O(L), `get` O(L + m) | `get` O(m) beyond the hash lookup | O(N) |
| 1. HashMap of TreeMaps | `set` and `get` O(L + log m) | O(log m) beyond the hash lookup | O(N), about one tree node and one `Integer` per version |
| 2. HashMap of lists + upper bound | `set` O(L) (amortized append), `get` O(L + log m) | `get` O(log m) beyond the hash lookup; one `set` can copy the list's array, O(m) | O(N), one small object and one array slot per version |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Linear scan | Simplest; correct by inspection | O(m) per `get`, about 10^10 steps at the limits | As the one-sentence baseline |
| 1. TreeMaps | Fewest lines; no hand-written search; works even if set times arrive out of order | More memory and slower constants per version; does not use the given order | If set timestamps were not increasing, or as a fast first version |
| 2. Lists + upper bound | Cheapest append, compact, uses the guarantee | Hand-written search; correct only because set times increase | The answer |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Say out loud that the lists are sorted *because* set timestamps strictly increase; that sentence is what the problem is checking. Mention the `TreeMap` version as the alternative that does not need the guarantee.

**Is it optimal?** The `get` query is optimal for a comparison-based search: answering "last version ≤ t" among m sorted versions has m + 1 possible outcomes, so a method that only compares timestamps needs about log2(m + 1) comparisons in the worst case. `set` is amortized O(1) beyond hashing the key, which cannot be avoided without reading the key. Stop there.

**When the other is better in practice:** if the interviewer drops the increasing-timestamp guarantee, or wants deletions, the `TreeMap` version wins because it stays sorted under any insertion order. Under time pressure, the `TreeMap` version is also the lower-risk code; writing it first and then upgrading is a reasonable path if you say why.

## 7. Interview script: code it and test it

### What I say while coding

> "A tiny `Version` class with a final `int` timestamp and a final `String` value. `int` because timestamps are at most 10^7."

> "`set` is one line: `computeIfAbsent` gives me the key's list, and I append. I'll put a comment on the map saying why the lists are sorted."

> "In `get`, a missing key returns the empty string before any search."

> "Half-open search: `lo = 0`, `hi = size`. The condition is `<=` because a version at exactly the query time counts; it must end up before `lo`."

> "At the end, `lo == 0` means even the first version is too late."

### Testing out loud

**Normal case:** the five-version list with `get(k, 8)`: `lo` goes to 3, `hi` comes down to 3, return "c" (the first dry-run table).

**Exactly on a set time:** `get(k, 12)` and `get(foo, 4)` from the example: equality moves `lo` past the version, and `lo − 1` lands on it.

**Before the first version:** `get(k, 1)` ends with `lo = 0` and returns "" (the second table). Same for `get(love, 5)`.

**Unknown key:** `get(hate, 30)`: no list, returns "" without searching.

**After the last version:** `get(love, 25)` with versions at 10 and 20: the only probe (index 1, time 20) is ≤ 25, so `lo = 2`; return "low".

**One version:** set `p` at 100: `get(p, 99)` probes index 0, 100 > 99, `hi = 0`, returns ""; `get(p, 100)` and `get(p, 101)` move `lo` to 1 and return "q".

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2–3 min | Equality counts, empty string, set timestamps increasing across keys, get timestamps arbitrary |
| Baseline | 1 min | Map to list, scan backwards, O(m) per query |
| Key observation | 1 min | Lists are sorted for free; the query is an upper bound |
| Code | 6–8 min | Approach 2 |
| Test | 3 min | On a set time, before the first, unknown key, after the last |
| Complexity and follow-ups | 2–3 min | Expected hashing, the `TreeMap` alternative, unordered sets |

The time goes into the search boundaries. If unsure whether you want `<` or `<=`, ask the question "where must a version at exactly time t end up?" and answer it with the invariant.

## 9. Interviewer challenges

### About the data structure

#### Why is each list sorted? You never sort it.

**What they are testing:** whether you noticed and can use the guarantee, or are relying on luck.

**How to reason:** follow one key's list as sets arrive.

**What I say:** "Set timestamps strictly increase across all calls. So when I append a version to a key's list, its time is greater than every earlier set's time, including all the ones in that list. By induction the list is strictly increasing. If that guarantee went away, appending would break the order and my binary search would return wrong answers."

**Nuance:** the guarantee is about `set` only. `get` timestamps can go backwards, so a moving pointer per key would not work; each `get` searches.

#### Why not just use a `TreeMap` per key?

**What they are testing:** whether you can compare two correct designs on more than lines of code.

**How to reason:** what does the tree provide that the list does not, and is it needed?

**What I say:** "It works and it's shorter: `floorEntry` is exactly the query. But the tree pays to stay sorted under arbitrary inserts, which I never do: each version is a tree node with several references plus a boxed `Integer`, and every insert walks and rebalances the tree. The list gets sortedness for free from the input order, appends in amortized O(1), and the query is the same O(log m)."

**Nuance:** if the interviewer changes the problem so that set timestamps can arrive in any order, or adds deletion, the `TreeMap` becomes the better choice.

### About the search

#### Why search for the first time greater than t, instead of the last time at most t?

**What they are testing:** whether your boundary choice is deliberate.

**How to reason:** compare the two loops' invariants and termination.

**What I say:** "The first index with time > t is an upper bound, and its half-open loop is the standard one: `lo = mid + 1` or `hi = mid`, always shrinking. The answer is then `lo − 1`, and `lo == 0` cleanly means 'none'. Searching directly for the last index ≤ t tends to need `lo = mid` and a rounded-up midpoint to avoid an infinite loop, which is easier to get wrong."

**Nuance:** with `<` instead of `<=`, the loop finds the first time ≥ t, a lower bound. Then `lo − 1` skips a version set at exactly t: `get(love, 20)` would return "high" instead of "low".

### About complexity

#### Is `get` O(log n)?

**What they are testing:** precision: which n, and which parts are expected.

**How to reason:** separate the hash lookup from the search.

**What I say:** "The search is O(log m), with m the versions of that key, at most 18 probes at these limits. Before that, the hash map lookup hashes the key, O(L) for up to 100 characters, and finds the bucket in O(1) expected time, assuming hash codes spread well. So O(L + log m) expected."

**Nuance:** modern Java's `HashMap` turns a heavily collided bucket into a balanced tree, which for comparable keys such as `String` limits such a lookup to about O(log) comparisons. That is implementation behaviour of current JDKs, not something the `Map` contract guarantees.

## 10. Follow-up questions the interviewer might ask

**"What if set timestamps can arrive in any order?"**
Appending no longer keeps the lists sorted. Use the `TreeMap` version: O(log m) for both operations. Inserting into the sorted list at its binary-searched position would also work but costs O(m) per `set` for shifting elements.

**"Add `get(key, t1, t2)`: all values set in that interval."**
Two binary searches on the key's list: the first index with time ≥ t1 (lower bound) and the first with time > t2 (upper bound). Return the slice between them: O(log m + k) for k results. With a `TreeMap`, `subMap(t1, true, t2, true)`.

**"Many keys share most of their history; memory is tight."**
Store timestamps and values in two parallel growable arrays per key (an `int[]` and a `String[]`) instead of a list of objects: one object header less per version, and the search reads a primitive array. Same complexity.

**"Can a `set` overwrite a value at an existing timestamp?"**
Not under the given constraints (timestamps strictly increase). If allowed, the list version must check whether the last element has the same time and replace it; the `TreeMap` version's `put` already replaces.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Sorting each list, or reaching for a tree, without noticing the guarantee.** Strictly increasing set timestamps make every list sorted already.
- **Assuming `get` timestamps are increasing too.** Only `set` is ordered; a forward-moving pointer per key would give wrong answers.
- **Calling `get` O(log n) without saying what n is or that hashing is expected.** It is O(L + log m) expected.

### Implementation mistakes

> [!MISTAKE] `<` instead of `<=` in the search
> The loop then finds the first time ≥ t, and `lo − 1` steps back past a version set at exactly t. With love = high at 10 and low at 20, `get(love, 20)` returns `"high"` instead of `"low"`.

> [!MISTAKE] Forgetting the `lo == 0` case
> Returning `versions.get(lo - 1).value` unconditionally throws `IndexOutOfBoundsException` for a query earlier than the first version, such as `get(love, 5)`.

- **Using `lowerEntry` instead of `floorEntry`** in the `TreeMap` version: `lowerEntry` is strictly less, so `get(love, 20)` returns `"high"`.
- **Calling `floorEntry(t).getValue()` without a null check:** a query before the first version throws `NullPointerException`.
- **Returning `null` instead of `""`** when nothing matches.

## 12. Pattern recognition

**The pattern:** a hash map from key to a sorted history, with an upper-bound binary search for "latest at or before t".

**Signals in the problem statement:**

- "Latest value at or before a time", "as of", "most recent version": a floor query.
- Timestamps that only increase on insert, which make append-only lists sorted.
- A design problem with lookups by key plus an ordered dimension.

**Related problems in this list:**

- [[nc-search-insert-position|Search Insert Position]]: the same half-open loop, as a lower bound; this problem's search is the upper bound version.
- [[nc-binary-search|Binary Search]]: the closed-range loop and its invariant.
- [[nc-design-hashmap|Design HashMap]]: the hash table underneath, and why its costs are expected rather than guaranteed.
- [[nc-capacity-to-ship-packages-within-d-days|Capacity To Ship Packages Within D Days]]: another search for a boundary between "yes" and "no", here over capacities instead of list indices.
- [[nc-lru-cache|LRU Cache]]: another design problem that combines a hash map with a second structure for order.

**Takeaway:** "latest version at or before t" over append-only, increasing timestamps is an upper bound on a list; check whether the input order already gives you the sorted structure before reaching for a tree.

## 13. 60-second revision card

**Key insight:** set timestamps strictly increase, so appending each version to its key's list keeps the list sorted; `get` is an upper-bound binary search.

**Invariant:** before `lo`, timestamps ≤ t; from `hi` on, timestamps > t. The answer is `lo − 1`, or "" if `lo` is 0.

**Complexity:** `set` O(L) expected + O(1) amortized; `get` O(L) expected + O(log m); O(N) space. `TreeMap` alternative: O(L + log m) for both, more memory per version.

**Code skeleton:**

```java title="TimeMap, lists plus upper bound"
import java.util.*;

class TimeMap {
    private record Version(int time, String value) {}
    private final Map<String, List<Version>> history = new HashMap<>();   // lists sorted: set times increase

    public void set(String key, String value, int timestamp) {
        history.computeIfAbsent(key, k -> new ArrayList<>()).add(new Version(timestamp, value));
    }

    public String get(String key, int timestamp) {
        List<Version> v = history.getOrDefault(key, List.of());
        int lo = 0, hi = v.size();                 // before lo: <= timestamp; from hi on: > timestamp
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (v.get(mid).time() <= timestamp) lo = mid + 1; else hi = mid;
        }
        return lo == 0 ? "" : v.get(lo - 1).value();
    }
}
```

**Main traps:**

- `<=`, not `<`: a version at exactly t counts.
- `lo == 0` means nothing is early enough: return "".
- The lists are sorted only because set timestamps increase; say so.
- Hashing the key is expected O(L), not a guaranteed O(1).

**What to say in one breath:** "A hash map from key to a list of (time, value). Set timestamps strictly increase, so appending keeps each list sorted. For get, I binary search for the first time greater than t; the version before it is the answer, or the empty string if there is none. Set is O(1) amortized and get is O(log m), plus expected O(L) to hash the key."
