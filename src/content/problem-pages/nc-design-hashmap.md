---
problemId: nc-design-hashmap
title: Design HashMap
source: neetcode
sourceUrl: https://leetcode.com/problems/design-hashmap/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashmap, a4-singly-linked-lists, a14-edge-cases]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Build your own map from integer keys to integer values as a class `MyHashMap`. `put(key, value)` stores the pair, replacing the value if the key is already there. `get(key)` returns the value stored for the key, or `-1` if there is none. `remove(key)` deletes the key and its value, and does nothing if the key is absent. You may not use the language's built-in hash table classes.

**Example**

| Call | Returns | Map afterwards | Why |
|---|---|---|---|
| `put(4, 40)` | | {4: 40} | |
| `put(8, 80)` | | {4: 40, 8: 80} | |
| `get(4)` | `40` | {4: 40, 8: 80} | |
| `put(4, 0)` | | {4: 0, 8: 80} | The key exists, so its value is replaced, not duplicated |
| `get(4)` | `0` | {4: 0, 8: 80} | 0 is a real value, not "missing" |
| `remove(8)` | | {4: 0} | |
| `get(8)` | `-1` | {4: 0} | No value for 8 any more |
| `remove(5)` | | {4: 0} | 5 was never stored: nothing happens |

**What the problem statement guarantees**

- Keys and values are integers from 0 to 10^6.
- There are at most 10^4 calls in total to `put`, `get` and `remove`.
- `get` of an absent key returns `-1`.
- No built-in hash table library may be used.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The example above contains the two traps that catch most first attempts; make sure your design handles both before you look further.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Decide how your structure will tell "this key is stored with value 0" apart from "this key is not stored".
3. Say what `put` must do when the key already exists, before writing it.
4. Write the code, then run the example above through it by hand.

> [!HINT] Hint 1: a small nudge
> Keys are bounded integers. What if a key were simply a position in an array? And since every value is at least 0, which number can safely mean "nothing here"?

> [!HINT] Hint 2: the kind of tool you need
> An array with a slot per possible key spends memory on a million keys you will never see. Map keys into fewer slots with `key % B`, and let each slot keep a small list of (key, value) pairs for the keys that land there.

> [!HINT] Hint 3: almost the whole plan
> Write one helper that walks the list of bucket `key % B` and returns the node holding the key, or nothing. `put` uses it to update an existing node or else prepends a new one; `get` returns the node's value or `-1`; `remove` walks with a `prev` pointer and unlinks, handling the first node of the bucket separately.

**Check yourself before revealing the walkthrough**

- [ ] `put(4, 40)`, `put(4, 0)`, `get(4)` returns `0`
- [ ] `put(3, 30)`, `put(3, 31)`, `remove(3)`, `get(3)` returns `-1`
- [ ] `get` and `remove` of a key that was never stored behave correctly
- [ ] I can state each operation's cost, and whether it is guaranteed or expected

## 3. Interview script: understand the problem (≈2 min)

**Me:** A map from int keys to int values with put, get and remove, without `HashMap` inside. `put` on an existing key overwrites the value?

**Interviewer:** Yes.

**Me:** `get` of a missing key returns -1. Can -1 also be a real value? If it could, the caller couldn't tell the two apart.

**Interviewer:** No. Keys and values are both between 0 and 10^6.

**Me:** Good, so -1 is free to mean "absent" inside my structure too. But 0 is a real value, so I can't use Java's default 0 for "empty". How many calls?

**Interviewer:** At most 10^4 in total.

**Me:** So at most 10^4 keys at once. Removing a missing key is a no-op? And may I use arrays and lists?

**Interviewer:** Yes to both.

**Me:** By hand: `put(4, 40)`, `put(4, 0)`. One key, value 0. `get(4)` must return 0, not -1, and not 40.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ key ≤ 10^6 | A key can be an array index directly. Non-negative keys make `key % B` a valid index. |
| 0 ≤ value ≤ 10^6 | -1 is never a real value, so it can mark an empty slot. 0 is a real value, so the default `int` 0 cannot. |
| At most 10^4 calls in total | At most 10^4 pairs are stored at once; this sizes the bucket array. |
| `get` returns -1 for a missing key | The "absent" result is part of the API. |
| No built-in hash table libraries | Hashing and collision handling are mine to write. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `remove` of an absent key is a no-op | `remove` searches and returns quietly when nothing matches. |
| Arrays and lists are allowed | I'll write the nodes myself anyway, to show the chaining. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may size the table from the stated limits | A fixed bucket count, no resizing. Resizing is the follow-up if the limit is unknown. |
| Single-threaded use | No locking. |

### Edge cases I will keep in mind

- `put` on an existing key, including overwriting with 0.
- `get` and `remove` of a key never stored, and of a key already removed.
- Keys 0 and 10^6; value 0 and value 10^6.
- Two keys in the same bucket, and removing the first node of a bucket versus a later one.

## 4. Think out loud: from first idea to best solution

Throughout: **k** is the number of pairs currently stored (at most 10^4), **U** = 10^6 + 1 is the number of possible keys, **B** is the number of buckets, and **α = k / B** is the load factor.

The simplest correct idea is a list of (key, value) pairs searched linearly: O(k) per operation. I'd say it in one sentence and move on, because the key range immediately suggests something better.

### Approach 1: Direct addressing with a sentinel

#### What I say out loud

> "Keys go up to 10^6, so I can allocate an `int` array of 10^6 + 1 slots and use the key as the index. The slot holds the value. For 'absent' I need a value that can't be real; values are never negative, so -1 works, and it happens to be exactly what `get` must return for a missing key."

> "The catch: a fresh `int` array is all zeros, and 0 is a legal value. So the constructor has to fill the array with -1 first. And the memory is four bytes for every possible key, about 4 MB, whether I store one pair or ten thousand."

#### Intuition

With a small, bounded key range, the key is its own address, and an impossible value marks an empty slot.

#### Algorithm

1. Allocate `values = new int[1_000_001]` and fill it with -1.
2. `put(key, value)`: `values[key] = value`. This both inserts and overwrites.
3. `get(key)`: return `values[key]`; an empty slot already holds -1.
4. `remove(key)`: `values[key] = -1`.

#### Why it is correct

Each key owns one slot. A slot holds -1 exactly when no pair with that key is stored, because it starts at -1, only `put` writes a non-negative value into it, and only `remove` sets it back. Since no real value is -1, `get` returns the stored value when there is one and -1 otherwise.

#### Dry run

| Call | Slot touched | Returns |
|---|---|---|
| `put(4, 40)` | `values[4] = 40` | |
| `put(4, 0)` | `values[4] = 0` | |
| `get(4)` | reads `values[4]` | `0` |
| `remove(8)` | `values[8] = -1` (it already was) | |
| `get(8)` | reads `values[8]` | `-1` |

#### Java code

```java title="Approach 1: direct addressing"
import java.util.Arrays;

class MyHashMap {
    private static final int MAX_KEY = 1_000_000;
    private static final int ABSENT = -1; // values are never negative, so -1 cannot be a real value
    private final int[] values = new int[MAX_KEY + 1];

    public MyHashMap() {
        Arrays.fill(values, ABSENT); // the default 0 is a legal value, so it cannot mean "absent"
    }

    public void put(int key, int value) {
        values[key] = value;
    }

    public int get(int key) {
        return values[key];
    }

    public void remove(int key) {
        values[key] = ABSENT;
    }
}
```

#### Time complexity

**O(1) per operation in the worst case**: one array access. The constructor is **O(U)**: the JVM zeroes 10^6 + 1 slots and `Arrays.fill` writes them again.

#### Space complexity

**O(U), independent of how many pairs are stored**: 10^6 + 1 `int`s of 4 bytes each, about 4 MB, for at most 10^4 pairs.

#### The bridge to the next approach

> "That is 100 slots per pair I could ever store, and it only works because the keys are small integers. To make memory follow the number of pairs, I fold the keys into B buckets with `key % B`. Different keys can then share a bucket, so each bucket holds a short list of nodes, and each node must carry its key as well as its value, to tell the keys in one bucket apart."

### Approach 2: Hash table with separate chaining (recommended)

#### What I say out loud

> "B = 10,007 buckets, a prime just above the 10^4 pairs I can ever hold, so the load factor stays below one. Each bucket is a singly linked list of nodes with a key, a value and a next pointer."

> "I'll write one helper, `find`, that walks a bucket and returns the node for a key or null. `put` calls it: if the node exists I overwrite its value, otherwise I prepend a new node. That 'update or insert' is the part that is easy to get wrong: if I always prepend, the old pair is still there underneath. `get` returns the node's value or -1. `remove` walks with `prev` and unlinks."

> "Each operation walks one bucket, so O(1 + α) expected, which is O(1) here, if keys spread evenly; O(k) in the worst case if they all collide."

#### Intuition

This is the chained hash set from [[nc-design-hashset|Design HashSet]] with a value stored next to each key. The key still decides the bucket and identifies the node; the value just rides along. The mechanism is the one in [[a2-hashing|Hashing]].

#### Algorithm

1. `buckets = new Node[B]`, B = 10,007.
2. `find(key)`: walk `buckets[key % B]`; return the node whose key matches, or `null`.
3. `put(key, value)`: if `find(key)` returns a node, set its value; otherwise prepend `new Node(key, value, buckets[b])`.
4. `get(key)`: return `find(key).value`, or -1 if `find` returns `null`.
5. `remove(key)`: walk the bucket with `prev`; on a match, move the head if `prev` is `null`, else set `prev.next = node.next`; return.

#### Why it is correct

**The invariant: every stored key appears in exactly one node, in bucket `key % B`, holding the value of its most recent `put`; no removed or never-stored key appears.**

- At the start every bucket is empty.
- `put` searches the only bucket the key can be in. If the key is there, it changes that node's value, so the key still appears once and now has the newest value. If not, it adds one node.
- `remove` unlinks the single node with that key, if any, and changes nothing else.
- So `get` finds the node exactly when the key is stored, and returns its latest value; otherwise -1.

**The 25-second version to say to the interviewer:**

> "Each key can only live in bucket `key % B`, and `put` searches that bucket before inserting, so a key is never stored twice: an existing node is updated in place. Get and remove therefore only search that one bucket. With about as many buckets as pairs and keys spreading evenly, that's O(1) expected per call."

#### Dry run

3 and 10,010 collide: 10,010 = 10,007 + 3, so both use bucket 3.

| Call | Bucket 3 afterwards | Returns |
|---|---|---|
| `put(3, 30)` | (3: 30) | |
| `put(10010, 7)` | (10010: 7) → (3: 30) | |
| `put(3, 31)` | (10010: 7) → (3: 31), found and updated in place | |
| `get(10010)` | unchanged | `7` |
| `get(3)` | unchanged | `31` |
| `remove(3)` | (10010: 7), `prev` was the 10010 node | |
| `get(3)` | unchanged | `-1` |
| `remove(10010)` | empty, `prev` was `null` so the head moved | |

#### Java code

```java title="Approach 2: separate chaining (recommended)"
class MyHashMap {
    // A prime just above the 10^4 pairs that can ever be stored, so the load factor stays below 1.
    private static final int BUCKETS = 10_007;

    private static final class Node {
        final int key;
        int value;
        Node next;

        Node(int key, int value, Node next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }

    private final Node[] buckets = new Node[BUCKETS];

    public MyHashMap() {
    }

    private static int bucketOf(int key) {
        return key % BUCKETS; // keys are non-negative, so this is in [0, BUCKETS)
    }

    private Node find(int key) {
        for (Node node = buckets[bucketOf(key)]; node != null; node = node.next) {
            if (node.key == key) {
                return node;
            }
        }
        return null;
    }

    public void put(int key, int value) {
        Node existing = find(key);
        if (existing != null) {
            existing.value = value; // update in place: a key is never stored twice
            return;
        }
        int b = bucketOf(key);
        buckets[b] = new Node(key, value, buckets[b]);
    }

    public int get(int key) {
        Node node = find(key);
        return node == null ? -1 : node.value;
    }

    public void remove(int key) {
        int b = bucketOf(key);
        Node prev = null;
        for (Node node = buckets[b]; node != null; prev = node, node = node.next) {
            if (node.key == key) {
                if (prev == null) {
                    buckets[b] = node.next; // removing the head
                } else {
                    prev.next = node.next;
                }
                return;
            }
        }
    }
}
```

#### Time complexity

**O(1 + α) expected per operation, O(k) in the worst case.** Each call computes the bucket in O(1) and walks one list. If keys spread evenly, a list holds α = k / B < 1 pairs on average here, so the expected cost is O(1). That assumes the keys do not line up with B; `key % B` is a fixed function. If all stored keys shared a bucket, one call would cost O(k). With keys bounded by 10^6 and B = 10,007, a bucket can hold at most ⌊10^6 / 10,007⌋ + 1 = 100 keys, a fact about these limits rather than about hashing.

#### Space complexity

**O(B + k)**: 10,007 bucket references plus one node per stored pair, each node holding two `int`s and a reference. With 10^4 pairs this is a small fraction of the 4 MB direct-address array, and it does not grow with the key range.

### Alternative: open addressing with parallel arrays

Keep `keys[]` and `values[]` arrays and, on a collision, probe the next slot. It saves the node objects, but deletion needs tombstones (an emptied slot would cut off keys stored past it in the probe sequence), and the table must stay sparse. Worth describing if asked about memory or cache behaviour; riskier to code in an interview than chaining.

## 5. Comparison table

k = pairs stored (≤ 10^4), U = 10^6 + 1 possible keys, B = number of buckets, α = k / B.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| List of pairs (baseline, not coded) | O(k) per operation | O(k) per operation | O(k) |
| 1. Direct addressing | O(1) per operation | O(1) per operation; O(U) to construct | O(U), about 4 MB |
| 2. Separate chaining | O(1 + α) per operation, O(1) here | O(k) per operation in general; at most 100 nodes per bucket with these limits | O(B + k) |
| Alt. Open addressing | O(1) per operation at a low load factor | O(k) per operation | O(B) with B > k |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Direct addressing | Constant worst case; five lines | 4 MB for 10^4 pairs; needs a sentinel and bounded integer keys | Small dense key range, and the interviewer accepts it |
| 2. Separate chaining | Memory follows the pairs stored; works for any hashable key | Expected rather than guaranteed time; node overhead | The answer the question is looking for |
| Alt. Open addressing | No nodes, cache-friendly | Tombstones, must stay sparse | Performance or memory follow-ups |

## 6. Which solution to give, and when to stop optimizing

Mention direct addressing in a sentence, including the -1 sentinel and why it is safe, then code separate chaining. The interviewer wants to see buckets, collisions, update-or-insert, and the unlink in `remove`. If you have already written Design HashSet, say so: this is the same table with a value in each node. Stop when it is traced and the complexity is stated as expected; resizing and generics are follow-ups, not part of the answer.

## 7. Interview script: code it and test it

### What I say while coding

> "Node has a final key, a mutable value and next. The key is final because a node never changes which key it represents; the value changes on every update."

> "`find` is shared by `put` and `get`, so the search logic exists once."

> "`put`: find first. If found, overwrite and return. Only otherwise prepend."

> "`remove` can't use `find`, because to unlink I need the node before the match. So it walks with `prev`."

### Testing out loud

**Collision, update and both unlink branches:** the dry-run sequence with keys 3 and 10,010 in bucket 3. `put(3, 31)` updates the existing node, so after `remove(3)` nothing with key 3 is left and `get(3)` is -1.

**Value 0:** `put(4, 40)`, `put(4, 0)`, `get(4)`: the node's value becomes 0, and `get` returns 0 because it checks for a node, not for a non-zero value.

**Absent keys:** `get(5)` on an empty bucket returns -1; `remove(5)` runs no loop iterations.

**Extremes:** `put(0, 1000000)` and `put(1000000, 0)`: buckets 0 and 9,307. `get` returns 1,000,000 and 0.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Value range (is -1 free?), key range, number of calls |
| Direct addressing | 1 min | Say it, its memory, why it is not general |
| Design the chained table | 2 min | B, the hash, nodes with key and value |
| Code | 5–6 min | `find`, `put` (update or insert), `get`, `remove` |
| Test | 2–3 min | Collision, overwrite, value 0, absent key, head removal |
| Complexity and follow-ups | 2 min | Expected versus worst case, resizing |

Most bugs on this problem are in `put` (duplicates) and `remove` (the head). Spend the testing time there.

## 9. Interviewer challenges

### About the design

#### Why is -1 safe as the "absent" marker?

**What they are testing:** whether you checked the value range before choosing a sentinel.

**How to reason:** a sentinel works only if no real value can equal it.

**What I say:** "Values are between 0 and 10^6, so -1 can never be stored, and it is also exactly what `get` must return for a missing key. 0 would not work: it's a legal value. In the chained version I don't need a sentinel at all inside the structure; a missing node means absent, and I only translate that to -1 in `get`."

**Nuance:** for a map whose values could be any `int`, you would need a separate presence flag, or a `get` that returns `Integer` and `null`, or a `containsKey`. Java's own `Map.get` returns `null` for absent keys, which is why it is ambiguous for maps that allow `null` values.

#### What does `put` do when the key already exists, and why does it matter?

**What they are testing:** map semantics: one value per key.

**How to reason:** run `put(3, 30)`, `put(3, 31)`, `remove(3)`, `get(3)` against a `put` that always prepends.

**What I say:** "It updates the existing node. If I always prepended, the bucket would hold 31 and then 30; `get` would return 31 and look fine, but after `remove(3)` unlinks the first node, `get(3)` would return the stale 30 instead of -1. So `put` must search first."

**Nuance:** the search before every insert is what makes `put` cost O(1 + α) instead of O(1); it is unavoidable for a map, because uniqueness of keys is part of the contract.

### About complexity

#### Are your operations O(1)?

**What they are testing:** precision about hashing costs.

**How to reason:** each call walks one bucket; its length is α on average only if keys spread well.

**What I say:** "O(1 + α) expected, which is O(1) here since α is below one, assuming the keys spread evenly over the buckets. If every key landed in one bucket, a call would be O(k). With these limits a bucket can't exceed 100 keys, but in general the worst case is linear."

**Nuance:** Java's `java.util.HashMap` responds to long chains by converting a heavily collided bucket into a balanced tree, which for comparable keys keeps such a lookup to about O(log k). That is implementation behaviour of current JDKs, not part of the `Map` contract, and nothing here does it.

## 10. Follow-up questions the interviewer might ask

**"What if the number of keys isn't known in advance?"**
Track the size, and when it passes a load-factor threshold such as 0.75 × B, double the bucket array and reinsert every node. One resize is O(B + k); because the capacity doubles, the total over k insertions is O(k), so O(1) amortized per `put` on top of the O(1 + α) expected search.

**"Make it generic: any key type and any value type."**
`Node<K, V>`; choose the bucket from `key.hashCode()` (spread and made non-negative, for example `(h ^ (h >>> 16)) & (B - 1)` with a power-of-two B, or `Math.floorMod(h, B)` with a prime B) and compare keys with `equals`. `get` would return `V` or `null`, which needs a `containsKey` if `null` values are allowed.

**"How would you build an LRU cache on top of this?"**
Keep the map from key to a node in a doubly linked list ordered by recent use. `get` and `put` move the node to the front; when over capacity, evict from the back. Both operations stay O(1) expected. That is [[nc-lru-cache|LRU Cache]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Using Java's default 0 as "absent".** 0 is a legal value; check the value range before choosing a sentinel.
- **Calling it O(1) without qualification.** It is O(1 + α) expected; name the O(k) worst case.
- **Presenting direct addressing as a general map.** It works only because keys are integers up to 10^6.

### Implementation mistakes

> [!MISTAKE] Direct-address array without the fill
> `new int[1_000_001]` without `Arrays.fill(values, -1)` makes `get(8)` return `0` for a key that was never stored, instead of `-1`.

> [!MISTAKE] `put` that always prepends
> After `put(3, 30)`, `put(3, 31)`, `remove(3)`, `get(3)` returns the stale `30` instead of `-1`, because the first pair was never replaced.

- **Forgetting the head case in `remove`.** With `prev` still `null`, `prev.next = node.next` throws a `NullPointerException` when the match is the first node.
- **Storing only the value in the node.** Two keys in the same bucket cannot be told apart; the node must keep its key.
- **Using `java.util.HashMap` inside `MyHashMap`.** It passes the judge and fails the interview.

## 12. Pattern recognition

**The pattern:** a hand-built hash table with separate chaining, storing a value in each node.

**Signals in the problem statement:**

- "Design" or "implement" a map without built-in hash tables.
- Bounded integer keys, which make direct addressing tempting, and a much smaller number of operations, which makes it wasteful.
- An "absent" return value, which raises the sentinel question.

**Related problems in this list:**

- [[nc-design-hashset|Design HashSet]]: the same table without values.
- [[nc-two-sum|Two Sum]]: the classic use of a map from value to index, and why "expected O(1)" matters.
- [[nc-lru-cache|LRU Cache]]: a hash map combined with a hand-written doubly linked list.
- [[nc-group-anagrams|Group Anagrams]]: a map from a canonical key to a list of values.

**Takeaway:** a hash map is a hash set whose nodes carry a value; `put` must find before it inserts, so each key appears once.

## 13. 60-second revision card

**Key insight:** fold keys into B ≈ (max pairs) buckets with `key % B`, B prime; each bucket is a linked list of (key, value) nodes. `put` updates an existing node or prepends a new one.

**Invariant:** every stored key appears in exactly one node, in bucket `key % B`, holding its latest value.

**Complexity:** O(1 + α) expected per call (α = k / B < 1 here), O(k) worst case; O(B + k) space. Direct addressing: O(1) worst case, 4 MB, valid only for bounded integer keys, with -1 as the empty marker.

**Code skeleton:**

```java title="Chained hash map, core"
class MyHashMap {
    private static final int B = 10_007;
    private static final class Node {
        final int key; int value; Node next;
        Node(int k, int v, Node n) { key = k; value = v; next = n; }
    }
    private final Node[] buckets = new Node[B];

    private Node find(int key) {
        for (Node n = buckets[key % B]; n != null; n = n.next) if (n.key == key) return n;
        return null;
    }

    public void put(int key, int value) {
        Node n = find(key);
        if (n != null) n.value = value;                                   // update in place
        else buckets[key % B] = new Node(key, value, buckets[key % B]);   // or prepend
    }

    public int get(int key) {
        Node n = find(key);
        return n == null ? -1 : n.value;
    }

    public void remove(int key) {
        Node prev = null;
        for (Node n = buckets[key % B]; n != null; prev = n, n = n.next) {
            if (n.key == key) {
                if (prev == null) buckets[key % B] = n.next; else prev.next = n.next;
                return;
            }
        }
    }
}
```

**Main traps:**

- `put` must update an existing key, not add a second node.
- 0 is a real value; -1 is safe only because values are non-negative.
- `remove` of the head node needs its own branch.
- "O(1)" means expected; the worst case is O(k).

**What to say in one breath:** "Keys up to 10^6 allow an int array with -1 as empty, but that costs 4 MB for at most 10^4 pairs. Instead I hash keys into about 10^4 prime-many buckets and chain (key, value) nodes. Put finds before it inserts, so each key appears once; each call searches one bucket, O(1) expected and O(k) worst case."
