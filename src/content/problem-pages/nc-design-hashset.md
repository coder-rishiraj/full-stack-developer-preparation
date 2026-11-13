---
problemId: nc-design-hashset
title: Design HashSet
source: neetcode
sourceUrl: https://leetcode.com/problems/design-hashset/
difficulty: easy
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashset, a4-singly-linked-lists, a1-hashmap, a14-clarifying-requirements]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

Build your own set of integers as a class `MyHashSet` with three operations: `add(key)` puts a key in the set, `remove(key)` takes it out, and `contains(key)` reports whether it is there. A set holds each key at most once, so adding a key twice and removing it once leaves it absent. Removing a key that is not there does nothing. You may not use the language's built-in hash table classes.

**Example**

| Call | Returns | Set afterwards | Why |
|---|---|---|---|
| `add(5)` | | {5} | |
| `add(9)` | | {5, 9} | |
| `contains(5)` | `true` | {5, 9} | |
| `add(9)` | | {5, 9} | 9 is already there; a set does not count copies |
| `remove(9)` | | {5} | One remove is enough, even after two adds |
| `contains(9)` | `false` | {5} | |
| `remove(42)` | | {5} | 42 was never added: nothing happens |

**What the problem statement guarantees**

- Keys are integers from 0 to 10^6.
- There are at most 10^4 calls in total to `add`, `remove` and `contains`.
- `remove` of an absent key does nothing.
- No built-in hash table library may be used.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The interviewer is not checking whether you can store integers; they are checking whether you know what happens inside the structure you use every day.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Write the simplest version that is certainly correct, and say the cost of each operation.
3. Ask yourself what the key range lets you do, and what you would do if it were much larger.
4. Write the code, then run the example above through it by hand, including the second `add(9)`.

> [!HINT] Hint 1: a small nudge
> Keys are small, non-negative integers. Could a key itself tell you *where* to look, instead of you searching for it?

> [!HINT] Hint 2: the kind of tool you need
> A slot per possible key works but wastes memory when few keys are stored. Fold the key range into a smaller number of slots with a function such as `key % B`. Two keys can now land in the same slot. What could a slot hold so that both fit?

> [!HINT] Hint 3: almost the whole plan
> Use an array of B buckets, B a prime around the most keys you will store. Each bucket is a small linked list of keys. `contains` walks the key's bucket; `add` walks it and prepends only if the key is missing; `remove` walks it and unlinks the node if found, remembering the previous node so it can relink.

**Check yourself before revealing the walkthrough**

- [ ] My set returns `false` for `contains(9)` after `add(9)`, `add(9)`, `remove(9)`
- [ ] `remove` of a key that was never added does not crash
- [ ] Keys 0 and 10^6 both work
- [ ] I can say the cost of each operation, and whether it is guaranteed or only expected

## 3. Interview script: understand the problem (≈2 min)

**Me:** So I'm implementing a set of integers: add, remove, contains, and I can't use `HashSet` or `HashMap` inside. Can I use arrays and lists?

**Interviewer:** Yes. Just no built-in hash table.

**Me:** What's the range of keys?

**Interviewer:** 0 to 10^6.

**Me:** Non-negative, good: `key % B` is never negative, so I won't need `Math.floorMod`. And how many operations?

**Interviewer:** At most 10^4 calls in total.

**Me:** So the set never holds more than 10^4 keys, and could hold far fewer. If I add a key twice, it's still one key?

**Interviewer:** Yes, it's a set.

**Me:** And removing a key that isn't there is a no-op, not an error?

**Interviewer:** Right.

**Me:** Do I need iteration, size, or thread safety?

**Interviewer:** No, just the three methods, single-threaded.

**Me:** Let me run a few calls by hand. `add(5)`, `add(9)`, `add(9)`: the set is {5, 9}. `remove(9)`: {5}. So `contains(9)` is false. The second add must not leave a second copy behind.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ key ≤ 10^6 | A key can be an array index directly (10^6 + 1 slots). Non-negative keys make `key % B` safe. |
| At most 10^4 calls in total | At most 10^4 keys are ever stored. This sizes the bucket array, and shows that 10^6 slots are mostly wasted. |
| `remove` of an absent key does nothing | `remove` must search, find nothing and return quietly. |
| No built-in hash table libraries | The hashing, collision handling and storage are mine to write. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Arrays and lists are allowed | I may use `ArrayList` or plain arrays. I'll still write the bucket nodes myself, because that shows the mechanism. |
| Adding an existing key leaves one copy | `add` must check before inserting. |
| No iteration, size or concurrency needed | Single-threaded, three methods. No locks, no iterator. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may size the table from the stated limits | It lets me pick a fixed bucket count. If the limits were unknown, I'd resize instead (see the follow-ups). |
| Calls arrive in any pattern, possibly adversarial | I won't promise constant time per call; I'll say "expected" and name the worst case. |

### Edge cases I will keep in mind

- `add` of a key already present, then one `remove`.
- `remove` of a key never added, and of a key already removed.
- Re-adding a key after removing it.
- Keys 0 and 10^6.
- Two different keys that land in the same bucket, and removing the first node of a bucket versus a later one.

## 4. Think out loud: from first idea to best solution

Throughout: **k** is the number of keys currently in the set (at most 10^4 here), **U** = 10^6 + 1 is the number of possible keys, **B** is the number of buckets, and **α = k / B** is the load factor.

### Approach 1: A list of keys, searched linearly

#### What I say out loud

> "The simplest thing that's certainly correct: keep the keys in a list. `contains` scans it. `add` scans first and appends only if missing, so there are no duplicates. `remove` scans, and if it finds the key, overwrites it with the last element and shrinks the list."

> "Every operation is a scan, so O(k). With up to 10^4 calls that's on the order of 10^8 steps in the worst case. It's correct, and it's my baseline."

#### Intuition

A set is just a collection without duplicates. If the only thing you can do is look at every element, every operation costs as much as the collection is large.

#### Algorithm

1. `contains(key)`: return whether `key` occurs in the list.
2. `add(key)`: if not `contains(key)`, append it.
3. `remove(key)`: find its position `i`; if found, copy the last element into `i` and delete the last element.

#### Why it is correct

The list never contains a key twice, because `add` appends only after `contains` says no. So one `remove` deletes the only copy, and moving the last element into the gap changes the order, which a set does not care about.

#### Dry run

| Call | List afterwards | Returns |
|---|---|---|
| `add(5)` | [5] | |
| `add(9)` | [5, 9] | |
| `add(9)` | [5, 9] (found, not appended) | |
| `remove(5)` | [9] (9 moved into position 0) | |
| `contains(5)` | [9] | `false` |

#### Java code

```java title="Approach 1: list of keys"
import java.util.ArrayList;
import java.util.List;

class MyHashSet {
    private final List<Integer> keys = new ArrayList<>();

    public MyHashSet() {
    }

    public void add(int key) {
        if (!contains(key)) {
            keys.add(key);
        }
    }

    public void remove(int key) {
        int i = keys.indexOf(key); // boxes key and compares with equals
        if (i >= 0) {
            int last = keys.size() - 1;
            keys.set(i, keys.get(last)); // order does not matter in a set
            keys.remove(last);           // remove(int index): the last slot, O(1)
        }
    }

    public boolean contains(int key) {
        return keys.indexOf(key) >= 0;
    }
}
```

#### Time complexity

**O(k) per operation in the worst case**, where k is the current number of keys: `indexOf` scans the list. The appends and the removal of the last slot are O(1) amortized. Over 10^4 calls with up to 10^4 keys, that is O(10^8) steps in the worst case.

#### Space complexity

**O(k)**: one boxed `Integer` per stored key, plus the list's spare capacity.

#### The bridge to the next approach

> "The scan is the problem: I'm searching for a key when the key could tell me where it is. Keys are integers from 0 to 10^6, so I can use the key as an array index. One boolean per possible key, and every operation is a single array access."

### Approach 2: Direct addressing (one slot per possible key)

#### What I say out loud

> "An array of 10^6 + 1 booleans. `present[key]` is true exactly when the key is in the set. Add sets it, remove clears it, contains reads it. No search, no collisions, constant time even in the worst case."

> "But this only works because the keys are bounded and small. It costs memory for every *possible* key, about a million slots, even though at most ten thousand keys are ever stored. If the keys were any `int`, I'd need four billion slots."

#### Intuition

When the key range is small enough to allocate, the key is its own address. This is the degenerate hash table whose hash function is the identity and which has one bucket per key.

#### Algorithm

1. Allocate `present = new boolean[1_000_001]`.
2. `add(key)`: `present[key] = true`.
3. `remove(key)`: `present[key] = false`.
4. `contains(key)`: return `present[key]`.

#### Why it is correct

Each key has its own slot, and nothing else ever writes to that slot, so the slot records exactly whether the key is in the set. Adding twice writes `true` twice, still one key. Removing an absent key writes `false` over `false`.

#### Dry run

| Call | Slot touched | Returns |
|---|---|---|
| `add(9)` | `present[9] = true` | |
| `add(9)` | `present[9] = true` (unchanged) | |
| `remove(9)` | `present[9] = false` | |
| `contains(9)` | reads `present[9]` | `false` |
| `remove(42)` | `present[42] = false` (unchanged) | |

#### Java code

```java title="Approach 2: direct addressing"
class MyHashSet {
    private static final int MAX_KEY = 1_000_000;
    private final boolean[] present = new boolean[MAX_KEY + 1];

    public MyHashSet() {
    }

    public void add(int key) {
        present[key] = true;
    }

    public void remove(int key) {
        present[key] = false;
    }

    public boolean contains(int key) {
        return present[key];
    }
}
```

#### Time complexity

**O(1) per operation in the worst case**: one array access, no hashing and no search. Construction is O(U), because the JVM zeroes the array when it allocates it.

#### Space complexity

**O(U), independent of how many keys are stored**: 10^6 + 1 booleans. Current JVMs use one byte per element of a `boolean[]`, so about 1 MB; that is how they behave, not something the language specification fixes. It is the same 1 MB for one key or ten thousand.

#### The bridge to the next approach

> "So the memory scales with the range of keys, not the number of keys. Here that's 100 slots per key I could ever store. What if I want memory proportional to the keys I actually have? Then I need fewer slots than possible keys, say B slots, and a function that maps a key to a slot, like `key % B`. But then two keys can share a slot. So a slot can't be a single boolean anymore; it has to hold every key that maps to it. A short linked list per slot does that."

### Approach 3: Hash table with separate chaining (recommended)

#### What I say out loud

> "I'll keep an array of B buckets. A key goes to bucket `key % B`, and each bucket is a singly linked list of the keys that land there. `contains` walks one bucket. `add` walks it and prepends a node only if the key isn't there. `remove` walks it with a `prev` pointer and unlinks the node if it finds it."

> "For B, at most 10^4 keys are ever stored, so I'll take a prime just above that, 10,007. That keeps the load factor below one, so a bucket holds less than one key on average if keys spread well. Prime, because if B shared a factor with a pattern in the keys, say all multiples of 1000 with B = 1000, they would all land in bucket 0."

> "Cost: walking a bucket is O(1 + α) expected, where α is keys per bucket, which is below one here. Worst case, if every key landed in one bucket, a single operation is O(k). I'll say expected, not guaranteed."

#### Intuition

A hash table is direct addressing with the key range folded down to B slots. The folding causes collisions, and chaining resolves them by letting a slot hold a short list. If keys spread evenly, each list is short, so each operation looks at a handful of nodes instead of all k keys. This is the mechanism described in [[a2-hashing|Hashing]].

#### Algorithm

1. `buckets = new Node[B]` with B = 10,007; every bucket starts empty (`null`).
2. `contains(key)`: walk the list at `buckets[key % B]`; return true if a node holds `key`.
3. `add(key)`: walk the list; if the key is found, return. Otherwise prepend `new Node(key, buckets[b])`.
4. `remove(key)`: walk the list keeping `prev`. If a node holds `key`, unlink it: if it is the head, `buckets[b] = node.next`, else `prev.next = node.next`. Return.

#### Why it is correct

**The invariant: every key in the set appears exactly once, in bucket `key % B`, and no other key appears anywhere.**

- It holds at the start: every bucket is empty.
- `add` searches the only bucket the key can be in and inserts only if it is absent, so the key appears once, in the right bucket.
- `remove` searches that same bucket and unlinks the one node with that key, if any; nothing else changes. An absent key leaves every list untouched.
- `contains` is then correct, because if the key is in the set it can only be in bucket `key % B`.

Prepending is safe because the order inside a bucket carries no meaning.

**The 25-second version to say to the interviewer:**

> "Each key can only live in bucket `key % B`, and add checks that bucket before inserting, so every key is stored exactly once in its own bucket. Contains and remove therefore only need to search that one bucket. With B around the maximum number of keys and keys spread evenly, a bucket holds about one node, so each operation is O(1) expected."

#### Dry run

10,010 and 3 collide, because 10,010 = 10,007 + 3. Both go to bucket 3.

| Call | Bucket | Bucket 3 afterwards | Returns |
|---|---|---|---|
| `add(3)` | 3 | 3 | |
| `add(10010)` | 3 | 10010 → 3 (prepended) | |
| `add(3)` | 3 | 10010 → 3 (found, not added) | |
| `contains(10010)` | 3 | unchanged; found at the head | `true` |
| `remove(3)` | 3 | 10010 (`prev` was 10010, so `prev.next = null`) | |
| `contains(3)` | 3 | walks 10010, reaches `null` | `false` |
| `remove(10010)` | 3 | empty (`prev == null`, so the head moves) | |

The two `remove` calls exercise both branches of the unlink.

#### Java code

```java title="Approach 3: separate chaining (recommended)"
class MyHashSet {
    // A prime just above the 10^4 keys that can ever be stored, so the load factor stays below 1.
    private static final int BUCKETS = 10_007;

    private static final class Node {
        final int key;
        Node next;

        Node(int key, Node next) {
            this.key = key;
            this.next = next;
        }
    }

    private final Node[] buckets = new Node[BUCKETS];

    public MyHashSet() {
    }

    private static int bucketOf(int key) {
        return key % BUCKETS; // keys are non-negative, so this is in [0, BUCKETS)
    }

    public void add(int key) {
        int b = bucketOf(key);
        for (Node node = buckets[b]; node != null; node = node.next) {
            if (node.key == key) {
                return; // already present: a set keeps one copy
            }
        }
        buckets[b] = new Node(key, buckets[b]);
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
        // absent key: nothing to do
    }

    public boolean contains(int key) {
        for (Node node = buckets[bucketOf(key)]; node != null; node = node.next) {
            if (node.key == key) {
                return true;
            }
        }
        return false;
    }
}
```

#### Time complexity

**O(1 + α) expected per operation, O(k) in the worst case.**

- **Expected:** each operation computes the bucket in O(1) and walks one list. If keys spread evenly over the buckets, a list holds α = k / B keys on average. Here k ≤ 10^4 and B = 10,007, so α < 1 and the expected cost is O(1). This is an assumption about the keys: `key % B` is a fixed function, so it spreads well only if the keys do not follow a pattern that lines up with B.
- **Worst case:** all stored keys in one bucket makes one operation O(k). With this table and these limits, a bucket can never hold more than 100 keys, because the keys from 0 to 10^6 that share a remainder modulo 10,007 are r, r + 10,007, … and there are at most ⌊10^6 / 10,007⌋ + 1 = 100 of them. That is a fact about this key range, not a property of hash tables in general.

#### Space complexity

**O(B + k)**: the bucket array of 10,007 references (tens of kilobytes; the exact size depends on the JVM's reference size) and one node per stored key. With 10^4 keys this is well under the 1 MB of direct addressing, and it does not grow with the key range.

### Alternative: a bit set instead of a boolean array

Direct addressing with one bit per key: a `long[]` of ⌈(10^6 + 1) / 64⌉ = 15,626 words, about 125 KB. `add` is `bits[key >>> 6] |= 1L << key`; `contains` tests the same bit. Still O(1) worst case and still sized by the key range, but eight times smaller than a `boolean[]` on current JVMs. Mention it if the interviewer accepts direct addressing and asks about memory.

### Alternative: open addressing

Store keys directly in the array and, on a collision, probe the next slot (linear probing). It avoids node objects and is cache-friendly, but `remove` cannot simply clear a slot, because that would break the probe chain for keys stored after it; you need a "deleted" marker (a tombstone) or must shift later entries back. The table must also stay well below full. More delicate to get right in 15 minutes than chaining, so I would describe it rather than code it.

## 5. Comparison table

k = keys currently stored (≤ 10^4), U = 10^6 + 1 possible keys, B = number of buckets, α = k / B.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. List of keys | O(k) per operation | O(k) per operation | O(k) |
| 2. Direct addressing | O(1) per operation | O(1) per operation; O(U) to construct | O(U), about 1 MB |
| Alt. Bit set | O(1) per operation | O(1) per operation; O(U / 64) to construct | O(U / 64) words, about 125 KB |
| 3. Separate chaining | O(1 + α) per operation, O(1) here | O(k) per operation in general; at most 100 nodes per bucket with these limits | O(B + k) |
| Alt. Open addressing | O(1) per operation at a low load factor | O(k) per operation | O(B) with B > k |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. List of keys | Correct by inspection: every operation scans the whole list | Linear per operation | Only as the baseline |
| 2. Direct addressing | Constant worst case; four lines | Memory for every possible key; only for small bounded keys | Small, dense key range |
| Alt. Bit set | Same speed, 8× less memory | Bit manipulation; still sized by the range | Bounded keys and memory matters |
| 3. Separate chaining | Memory follows the number of keys; works for any key range | Expected rather than guaranteed time; node overhead | The answer the interviewer is looking for |
| Alt. Open addressing | No nodes; cache-friendly | Deletion needs tombstones; must stay sparse | Performance-critical tables, when asked |

## 6. Which solution to give, and when to stop optimizing

Say the direct-address array in one sentence: with keys bounded by 10^6 it is correct, constant time in the worst case, and costs about 1 MB. Then say why it is not a general answer, because memory follows the key range, and code separate chaining. That is what the question is really about: buckets, collisions, and a load factor. Do not add resizing, generics or open addressing unless asked; describe each in a sentence if the interviewer follows up.

## 7. Interview script: code it and test it

### What I say while coding

> "A private nested `Node` class with an `int` key and a `next` pointer. Hand-written so you can see the chain, though a `LinkedList` per bucket would also be allowed."

> "`bucketOf` is `key % BUCKETS`. Keys are non-negative, so no `floorMod`."

> "In `add` I search first, and return if the key is already there. Then I prepend, which is O(1) and needs no tail pointer."

> "In `remove` I keep `prev`. If the match is the head, I move the bucket's head; otherwise I relink `prev.next`. If nothing matches, I just fall out of the loop."

### Testing out loud

**Collision and both unlink branches:** the dry-run sequence with 3 and 10,010. After `remove(3)`, bucket 3 holds just 10,010 and `contains(3)` is false; after `remove(10010)` the bucket is empty.

**Duplicate add, single remove:** `add(9)`, `add(9)`, `remove(9)`, `contains(9)`. The second add finds 9 and returns, so the bucket has one node; remove unlinks it; contains returns `false`.

**Absent key:** `remove(42)` on an empty bucket: the loop body never runs, nothing changes.

**Extremes:** `add(0)` goes to bucket 0; `add(1000000)` goes to bucket 1,000,000 % 10,007 = 9,307. Both are found by `contains`.

**Re-adding:** `add(7)`, `remove(7)`, `add(7)`, `contains(7)` is `true`: the second add sees an empty bucket and inserts again.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Key range, number of calls, what is allowed |
| Baseline and direct addressing | 2 min | Say both with their costs; say why direct addressing is not general |
| Design the chained table | 2 min | Bucket count, hash function, what a bucket holds |
| Code | 5–6 min | `add`, `contains`, then `remove` with its two branches |
| Test | 2–3 min | A collision, duplicate add, absent remove, keys 0 and 10^6 |
| Complexity and follow-ups | 2 min | O(1 + α) expected, O(k) worst case, resizing |

The time should go into `remove` and the testing of it; that is where the bugs are. If you get stuck on the design, start from direct addressing and ask "what if the keys went up to 2^31?" out loud.

## 9. Interviewer challenges

### About the design

#### Why 10,007 buckets, and why a prime?

**What they are testing:** whether the bucket count is a decision or a magic number.

**How to reason:** the count sets the load factor, and the hash `key % B` keeps only the remainder, so keys that share a factor with B crowd into fewer buckets.

**What I say:** "At most 10^4 keys can be stored, so about 10^4 buckets keeps the load factor below one: a bucket holds less than one key on average. A prime, because `key % B` only looks at the remainder. If B were 10,000 and the keys were all multiples of 1,000, they'd use only 10 buckets. A prime shares no factor with such strides, so they spread out."

**Nuance:** a prime protects against common patterns, not against an adversary who knows B; keys of the form r + j × 10,007 still collide. Java's own `HashMap` uses power-of-two sizes instead and mixes the high bits of the hash code into the low bits to get the same protection with a cheaper index computation.

### About complexity

#### Are your operations O(1)?

**What they are testing:** precision about expected versus worst-case cost.

**How to reason:** an operation walks one bucket. Its length is α on average only if keys spread evenly; nothing forces them to.

**What I say:** "Expected O(1 + α), which is O(1) here because α is below one, assuming the keys spread well over the buckets. The worst case is every key in one bucket, which makes an operation O(k). With keys bounded by 10^6 and 10,007 buckets, no bucket can exceed 100 keys, so it can't get truly bad here, but that's a property of these limits, not of hashing."

**Nuance:** choosing the hash function at random from a universal family, for example `((a · key + b) mod p) mod B` with random a and b, makes the expectation hold for *every* fixed input, taken over the random choice, instead of relying on the input being well-behaved.

#### Direct addressing is O(1) in the worst case. Why isn't it the better answer?

**What they are testing:** whether you can weigh memory against a theoretical bound.

**How to reason:** compare what each approach's memory depends on.

**What I say:** "For these exact constraints it is correct and faster, and I'd happily mention it. But it allocates a slot for every possible key, a million slots for at most ten thousand keys, and it stops working as soon as keys can be any `int` or a string. The chained table's memory follows the number of keys stored, and it works for any key that has a hash. That's what a hash set is for."

**Nuance:** a bit set cuts direct addressing to about 125 KB, which makes it competitive when keys really are small and dense.

## 10. Follow-up questions the interviewer might ask

**"What if you don't know how many keys there will be?"**
Resize. Track the count; when it exceeds a threshold such as 0.75 × B, allocate a table about twice as large and reinsert every node into its new bucket. One resize costs O(B + k), but because the size doubles, the total over k inserts is O(k): O(1) amortized per insert, on top of the O(1 + α) expected search.

**"What if keys could be any `int`, including negative ones?"**
`key % B` can then be negative, which would be an invalid index. Use `Math.floorMod(key, B)`, or `(key & 0x7fffffff) % B`. Direct addressing is no longer possible: 2^32 slots.

**"What if the keys were strings, or any object?"**
Use the object's `hashCode()` to choose the bucket and `equals()` to compare inside it. Equal objects must have equal hash codes, or `contains` looks in the wrong bucket. Spread the hash code before reducing it, since many hash codes are weak in their low bits.

**"What if many threads use it?"**
Make each method `synchronized` for a simple correct version, or lock per bucket (lock striping) so operations on different buckets don't block each other.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Claiming O(1) as a guarantee.** It is expected, under keys that spread well; say what the worst case is.
- **Presenting direct addressing as the general solution.** It is valid only because the keys are bounded by 10^6. Say so.
- **Choosing a bucket count without a reason.** Tie it to the maximum number of keys (the load factor) and say why it is prime.

### Implementation mistakes

> [!MISTAKE] Inserting without checking for the key first
> If `add` prepends unconditionally, `add(9)`, `add(9)`, `remove(9)` leaves one node holding 9 behind, and `contains(9)` returns `true`.

> [!MISTAKE] `list.remove(key)` on a `List<Integer>` with an `int` key
> Java picks `remove(int index)`, not `remove(Object)`. With the list `[5, 9]`, `remove(5)` throws `IndexOutOfBoundsException` instead of removing the 5. Use `remove(Integer.valueOf(key))`, or find the index first.

- **Forgetting the head case in `remove`.** Only relinking `prev.next` crashes with a `NullPointerException` when the match is the first node, because `prev` is still `null`.
- **Using `java.util.HashSet` inside `MyHashSet`.** It passes the judge and fails the interview.

## 12. Pattern recognition

**The pattern:** a hash table built by hand: a fixed array of buckets, a hash function that maps keys to buckets, and separate chaining for collisions.

**Signals in the problem statement:**

- "Design" or "implement" a data structure whose built-in version you use every day.
- A bounded integer key range, which invites direct addressing, plus a much smaller number of operations, which shows its waste.
- The operations are insert, delete and membership with no ordering.

**Related problems in this list:**

- [[nc-design-hashmap|Design HashMap]]: the same table with a value stored next to each key.
- [[nc-contains-duplicate|Contains Duplicate]]: the canonical use of the set you just built.
- [[nc-two-sum|Two Sum]]: a hash lookup of a complement; the reason "expected O(1)" matters.
- [[nc-lru-cache|LRU Cache]]: a hash map combined with a linked list you write yourself.
- [[nc-design-circular-queue|Design Circular Queue]]: another fixed-array design with careful index handling.

**Takeaway:** a hash set is direct addressing with the key range folded into B buckets; chaining absorbs the collisions, and the load factor k / B decides how long each search is.

## 13. 60-second revision card

**Key insight:** fold the key range into B buckets with `key % B` and let each bucket hold a short linked list. With B ≈ the maximum number of keys, each list holds about one key.

**Invariant:** every key in the set appears exactly once, in bucket `key % B`.

**Complexity:** O(1 + α) expected per operation (α = k / B < 1 here), O(k) worst case for one bucket; O(B + k) space. Direct addressing: O(1) worst case but O(10^6) space, and only because keys are bounded.

**Code skeleton:**

```java title="Chained hash set, core"
class MyHashSet {
    private static final int B = 10_007;                   // prime, about the max number of keys
    private static final class Node { final int key; Node next; Node(int k, Node n) { key = k; next = n; } }
    private final Node[] buckets = new Node[B];

    public void add(int key) {
        if (!contains(key)) buckets[key % B] = new Node(key, buckets[key % B]);   // check, then prepend
    }

    public void remove(int key) {
        Node prev = null;
        for (Node n = buckets[key % B]; n != null; prev = n, n = n.next) {
            if (n.key == key) {
                if (prev == null) buckets[key % B] = n.next; else prev.next = n.next;   // head vs middle
                return;
            }
        }
    }

    public boolean contains(int key) {
        for (Node n = buckets[key % B]; n != null; n = n.next) if (n.key == key) return true;
        return false;
    }
}
```

**Main traps:**

- `add` must check before inserting, or one `remove` leaves a copy behind.
- `remove` has two cases: the head and a later node.
- Say "expected O(1)", and name the O(k) worst case.
- Direct addressing works only because keys are at most 10^6.

**What to say in one breath:** "With keys up to 10^6 a boolean array works, but it costs a slot per possible key. A hash set folds keys into about as many buckets as keys stored, using `key % B` with B prime, and chains collisions in short linked lists. Every key lives in exactly one bucket, so each operation searches one list: O(1) expected, O(k) worst case."
