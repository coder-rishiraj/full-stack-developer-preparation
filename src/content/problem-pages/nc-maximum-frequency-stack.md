---
problemId: nc-maximum-frequency-stack
title: Maximum Frequency Stack
source: neetcode
sourceUrl: https://leetcode.com/problems/maximum-frequency-stack/
difficulty: hard
patterns: [stack, hashing, heap]
relatedLessons: [a5-stack, a2-hashing, a2-frequency-counting, a7-priority-queues, a14-deriving-optimization]
companies: []
timeToSolve: 30
---

## 1. Problem restatement

Design a class `FreqStack` that behaves like a stack of integers with a different rule for removal. `push(val)` puts `val` on top. `pop()` removes and returns the value that occurs **most often** in the stack right now; if several values share that highest count, it removes the one **closest to the top**. Removing a value means removing its copy nearest the top, so the remaining copies keep their places.

**Example**

| Call | Returns | Stack afterwards (bottom → top) | Why |
|---|---|---|---|
| `push(5)` | | 5 | |
| `push(7)` | | 5 7 | |
| `push(5)` | | 5 7 5 | |
| `push(7)` | | 5 7 5 7 | |
| `push(4)` | | 5 7 5 7 4 | |
| `push(5)` | | 5 7 5 7 4 5 | |
| `pop()` | `5` | 5 7 5 7 4 | 5 occurs three times, more than any other value |
| `pop()` | `7` | 5 7 5 4 | 5 and 7 both occur twice; the top copy of 7 (position 4) is above the top copy of 5 (position 3) |
| `pop()` | `5` | 5 7 4 | 5 occurs twice, the others once |
| `pop()` | `4` | 5 7 | All three occur once; 4 is on top |

**What the problem statement guarantees**

- 0 ≤ `val` ≤ 10^9.
- At most 2 × 10^4 calls to `push` and `pop` in total.
- There is at least one element in the stack whenever `pop` is called.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The tie-breaking rule is what makes it hard: counting is easy, but after a few pops it is not obvious which copy of which value is "closest to the top". Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 30 minutes and talk out loud.
2. Write the example's operations in a column and, next to each, the stack and the count of each value.
3. Get a correct class first, however slow, and say what each call costs.
4. Then aim for every call in constant time (allowing for the usual hashing caveat).
5. Run the example through your final class by hand, writing down every field after every call.

Open a hint only after two minutes without progress. After each hint, close it and try again before opening the next one.

> [!HINT] Hint 1: a small nudge
> Suppose a value has been pushed three times and never popped. Its first, second and third copies sit at different heights in the stack. When it is the answer to a `pop`, which copy goes, and what will its count be afterwards? Think about the copies one by one rather than the value as a whole.

> [!HINT] Hint 2: the kind of tool you need
> Label each push with the count it gives its value: the first 5 pushed is "5 at level 1", the second "5 at level 2", and so on. A pop always takes the highest level present, and among the copies at that level, the one pushed last. Keep a separate stack for each level.

> [!HINT] Hint 3: almost the whole plan
> Keep a map from value to current count, a map from level to a stack of values, and the highest level that is not empty. `push` raises the count to f and pushes the value onto the stack for level f. `pop` pops from the stack for the highest level, lowers that value's count, and lowers the highest level by one if its stack became empty. Work out why the value never has to be removed from the lower levels.

**Check yourself before revealing the walkthrough**

- [ ] My class returns 5, 7, 5, 4 for the example
- [ ] After `push(1)`, `push(2)`, `push(1)`, my pops return 1, 2, 1
- [ ] After `push(5)`, `push(5)`, two pops both return 5 without an error
- [ ] I can say the cost of `push` and `pop`, and whether it is worst case, amortized or expected
- [ ] I can explain why the highest count drops by at most one per `pop`

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me say it back. It's a stack, but `pop` doesn't take the top. It takes the value with the highest count among the elements currently in the stack, and if counts tie, the value whose copy is nearest the top. It returns that value and removes that copy.

**Interviewer:** Yes.

**Me:** "Count" means copies currently in the stack, not pushes ever made? So after a pop, the count goes down?

**Interviewer:** Right, it's the current frequency.

**Me:** And when the winning value has several copies, I remove the copy nearest the top, so the other copies stay where they are? That matters for later tie-breaks.

**Interviewer:** Yes, the topmost copy.

**Me:** Sizes: values up to 10^9, and at most 2 × 10^4 calls. And pop is never called on an empty stack?

**Interviewer:** Correct, you can rely on that.

**Me:** Values up to 10^9 means I can't index an array by value; I'll need a hash map, or something ordered, for per-value counts. With 2 × 10^4 calls, even O(n) per pop would be on the order of 10^8 simple steps in the worst case (10^4 pushes, then 10^4 pops that each scan what is left), so a slow version is a fine baseline, but I'll aim for constant time per call.

**Me:** Let me run the example's ties by hand. After the first pop, the stack is 5 7 5 7 4: 5 and 7 both have count 2. The topmost 7 is at position 4, the topmost 5 at position 3, so 7 wins. Then the stack is 5 7 5 4 and 5 has count 2 alone. So the tie-break compares each value's *topmost* copy.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ val ≤ 10^9 | Too many possible values for an array indexed by value: counts go in a hash map. Values fit in an `int`. |
| At most 2 × 10^4 calls in total | At most 2 × 10^4 elements are ever in the stack, and no count exceeds 2 × 10^4, so counts and push numbers fit in an `int`. An O(n)-per-pop baseline is on the order of 10^8 steps at worst: a usable baseline and test reference. |
| `pop` is only called on a non-empty stack | No empty-stack handling is needed; I won't add a sentinel return value. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Frequency is the current count, not the number of pushes ever | Every `pop` must lower the count of the value it removes. |
| The removed copy is the topmost copy of the winning value | The positions of the remaining copies are fixed, which is what makes "closest to the top" well defined after many pops. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Calls come from a single thread | Nothing says otherwise; concurrency would need locking around both fields. |
| Hash map operations are expected O(1) | The fast solutions rely on it for the per-value count, so their bounds are "expected". |

### Edge cases I will keep in mind

- A single push and pop.
- All values distinct: every count is 1, so it must behave exactly like a normal stack.
- All values equal: every pop returns that value.
- The highest count drops: `push(5)`, `push(5)`, `pop()`, `pop()`. After the first pop the highest count is 1, not 2.
- Which copy goes: `push(1)`, `push(2)`, `push(1)`, then pops 1, 2, 1. If the bottom copy of 1 were removed, the next tie would go the wrong way.
- Frequency beats recency: `push(1)`, `push(1)`, `push(2)`: the first pop returns 1 even though 2 is on top.
- Pushes after pops, and a stack that empties and is reused.
- Value extremes 0 and 10^9, and 2 × 10^4 calls.

## 4. Think out loud: from first idea to best solution

> "There are two quantities in the rule: a count per value, and a position in the stack. The simplest correct thing is to store the stack exactly as it is, plus the counts, and search on every pop. Then I'll see which part of that search I can avoid."

### Approach 1: List and count map, scan on every pop

#### What I say out loud

> "I keep the stack as a list, bottom to top, and a hash map from value to its current count. Push appends and increments the count. Pop does two scans: one over the list to find the highest count among the values present, and one from the top down to find the first element whose value has that count. That's the winner, and its position is the copy to delete. Then I decrement its count."

> "Push is O(1) expected; pop is O(n) because of the scans and the list removal. It's a correct baseline that follows the definition word for word."

#### Intuition

The definition says "most frequent, then closest to the top". If you keep the actual stack and the counts, both parts can be checked directly: find the highest count, then walk down from the top until you meet a value with that count. The first such element you meet is both the right value and the right copy, because no copy of any tied value lies above it.

#### Algorithm

- `push(val)`: append `val` to the list; increment `freq[val]`.
- `pop()`:
  1. `maxFreq` = the largest `freq[v]` over all elements v in the list.
  2. Walk i from the last index down until `freq[list[i]] == maxFreq`.
  3. Remove index i from the list, decrement `freq` of that value, return it.

#### Why it is correct

- **The value is right.** Step 1 computes the highest current count, so the value found in step 2 is one of the most frequent.
- **The tie-break is right.** Step 2 checks positions from the top down, so the first match is the copy closest to the top among all copies of all most-frequent values. In particular its value is the tied value whose topmost copy is highest.
- **The copy is right.** The first match is the topmost copy of that value, since any higher copy of the same value would have the same count and would have matched first. Removing by index removes exactly that copy.
- **The counts stay right**, because each push and each pop changes the count of exactly the value it adds or removes.

#### Dry run

The example, pops only (the pushes just build the list `5 7 5 7 4 5` and counts 5→3, 7→2, 4→1).

| Pop | List before (bottom → top) | Counts | maxFreq | Scan from the top | Returns |
|---|---|---|---|---|---|
| 1 | 5 7 5 7 4 5 | 5:3, 7:2, 4:1 | 3 | index 5 holds 5 (count 3): match | 5 |
| 2 | 5 7 5 7 4 | 5:2, 7:2, 4:1 | 2 | index 4 holds 4 (count 1); index 3 holds 7 (count 2): match | 7 |
| 3 | 5 7 5 4 | 5:2, 7:1, 4:1 | 2 | index 3 holds 4; index 2 holds 5 (count 2): match | 5 |
| 4 | 5 7 4 | 5:1, 7:1, 4:1 | 1 | index 2 holds 4 (count 1): match | 4 |

#### Java code

```java title="Approach 1: list and count map, scan on every pop"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class FreqStack {
    private final List<Integer> stack = new ArrayList<>();      // every live element, bottom to top
    private final Map<Integer, Integer> freq = new HashMap<>(); // value -> copies currently in the stack

    public FreqStack() {
    }

    public void push(int val) {
        stack.add(val);
        freq.merge(val, 1, Integer::sum);
    }

    public int pop() {
        int maxFreq = 0;
        for (int v : stack) {
            maxFreq = Math.max(maxFreq, freq.get(v));
        }
        int i = stack.size() - 1;
        while (freq.get(stack.get(i)) != maxFreq) {   // first value from the top with the top frequency
            i--;
        }
        int val = stack.remove(i);                     // remove(int index): this copy, not the first equal one
        freq.merge(val, -1, Integer::sum);
        return val;
    }
}
```

`stack.remove(i)` with an `int` argument calls `List.remove(int index)`. Writing `stack.remove(Integer.valueOf(val))` instead would call `remove(Object)`, which deletes the *first* (bottom-most) equal element: the wrong copy (section 11).

#### Time complexity

Let m be the number of elements currently in the stack (m ≤ 2 × 10^4).

- `push`: **O(1) expected amortized**: one hash map update (expected O(1)) and an `ArrayList` append (amortized O(1), since the backing array occasionally grows).
- `pop`: **O(m) expected**: two scans of at most m elements, each with an expected O(1) map lookup, plus `ArrayList.remove`, which shifts up to m elements.

Over q calls the worst case is O(q²): for example, 10^4 pushes followed by 10^4 pops scan 10^4 + (10^4 − 1) + … + 1 ≈ 5 × 10^7 elements per scan, about 10^8 element visits for the two scans together. That is fast enough at these limits, but the per-pop cost is the thing to remove.

#### Space complexity

**O(m + d) auxiliary space**, where d is the number of distinct values ever pushed: the list holds the m live elements and the map holds one entry per distinct value (entries whose count fell to 0 stay unless you remove them).

#### The bridge to the next approach

> "Each pop rescans everything to answer one question: which element has the largest (count, position) pair? That's a max query over a changing set, and the textbook structure for that is a priority queue."

> "But a value's count changes after it's inserted, and heaps don't like keys that change. Here's a way around it: don't key the value, key each *push*. When I push the third copy of 5, I record the pair (3, push number) for that copy. That number never changes for that copy, and I'll argue the copy with the largest pair is always the right one to pop."

### Approach 2: Priority queue of pushes keyed by (count at push, push number)

#### What I say out loud

> "I give every push a sequence number, and I record for that copy the count its value reached when it was pushed, its 'level'. The heap orders entries by level, highest first, then by sequence number, latest first. Pop just polls the heap and decrements the value's count."

> "The claim I need: for a value with current count c, its live copies have exactly the levels 1 to c, and its level-c copy is its topmost one. If that holds, the heap's maximum level is the maximum count, and among copies at that level, the latest-pushed one belongs to the value whose topmost copy is highest."

#### Intuition

A value's count is the number of its copies in the stack, and those copies were pushed one after another. So "5 has count 3" is the same as "the copy of 5 at level 3 exists". Instead of tracking a count per value, track a level per copy, which never changes once assigned. Then "most frequent" becomes "highest level", and "closest to the top" becomes "latest push" among copies at that level, and both are fixed keys a heap can order.

#### Algorithm

- Fields: `freq` (value → current count), a max-heap of entries `{level, seq, val}`, and a counter `pushes`.
- `push(val)`: `f = ++freq[val]`; add `{f, pushes++, val}` to the heap.
- `pop()`: poll the entry with the highest level, ties broken by the highest `seq`; decrement `freq[val]`; return `val`.

#### Why it is correct

**Invariant:** for every value v with current count c, the heap holds exactly c entries for v, with levels 1, 2, …, c, and in the stack the copy with level k is v's k-th copy from the bottom. In particular the level-c entry is v's topmost copy.

- **Push keeps it.** The new copy goes on top of the stack, becomes v's (c + 1)-th copy from the bottom, and gets level c + 1.
- **Pop keeps it**, provided the entry polled for v is its level-c entry (shown next): removing v's topmost copy removes its level-c entry and leaves levels 1..c − 1 on the remaining copies in the same order.
- **The polled entry is the right answer.** The highest level in the heap is the highest current count, because a value with count c has an entry at level c and none above. The entries at that level L are exactly the topmost copies of the values with count L, the most frequent values. Among them, the one with the largest `seq` was pushed last, and since copies that are still live keep their stack order, the latest-pushed live copy is the highest one in the stack. So the heap returns the most frequent value whose topmost copy is closest to the top, and the entry it removes is that topmost copy, which is the level-c entry the invariant needed.

#### Dry run

The example. Each push creates one entry `{level, seq, val}`:

| Push | val | freq after | Entry added |
|---|---|---|---|
| 1 | 5 | 5:1 | {1, 0, 5} |
| 2 | 7 | 7:1 | {1, 1, 7} |
| 3 | 5 | 5:2 | {2, 2, 5} |
| 4 | 7 | 7:2 | {2, 3, 7} |
| 5 | 4 | 4:1 | {1, 4, 4} |
| 6 | 5 | 5:3 | {3, 5, 5} |

| Pop | Highest entry polled | Why it beats the others | freq after | Returns |
|---|---|---|---|---|
| 1 | {3, 5, 5} | Only entry at level 3 | 5:2 | 5 |
| 2 | {2, 3, 7} | Level 2 ties with {2, 2, 5}; seq 3 > 2 | 7:1 | 7 |
| 3 | {2, 2, 5} | Only entry left at level 2 | 5:1 | 5 |
| 4 | {1, 4, 4} | Level 1 ties with {1, 1, 7} and {1, 0, 5}; seq 4 is largest | 4:0 | 4 |

#### Java code

```java title="Approach 2: priority queue of pushes"
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

class FreqStack {
    private final Map<Integer, Integer> freq = new HashMap<>();
    // Entries {frequency at push time, push number, value}: highest frequency first, then latest push.
    private final PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> a[0] != b[0] ? Integer.compare(b[0], a[0]) : Integer.compare(b[1], a[1]));
    private int pushes = 0;

    public FreqStack() {
    }

    public void push(int val) {
        int f = freq.merge(val, 1, Integer::sum);   // this copy is the f-th copy of val
        heap.offer(new int[] {f, pushes++, val});
    }

    public int pop() {
        int val = heap.poll()[2];
        freq.merge(val, -1, Integer::sum);
        return val;
    }
}
```

`pushes` counts at most 2 × 10^4 pushes, so it cannot overflow; `Integer.compare` avoids the subtraction-comparator habit anyway.

#### Time complexity

With m elements in the stack, the heap holds exactly m entries (one per live copy). `push` and `pop` are each **O(log m)** for the heap operation plus an expected O(1) map update: **O(log m) expected** per call. At m ≤ 2 × 10^4, log₂ m ≤ 15.

#### Space complexity

**O(m + d) auxiliary space**: m heap entries of three `int`s each, plus d map entries for the distinct values ever pushed.

#### The bridge to the next approach

> "The heap is doing more work than it needs to. Levels only ever go up by one at a push and come off the top at a pop, and inside one level the order I want is plain last-in-first-out by push time. So instead of one heap over all entries, I can keep one ordinary stack per level: within a level, push order *is* the tie-break order. Then I only need to know which level is the highest non-empty one, and I'll show that it moves by at most one per call, so a single integer tracks it."

### Approach 3: Count map plus one stack per frequency level (recommended)

#### What I say out loud

> "Three fields. `freq` maps a value to its current count. `group` maps a level f to a stack of values: every value whose count has reached f, pushed in the order it reached f. And `maxFreq`, the highest count right now."

> "Push: increment the value's count to f, push the value onto `group[f]`, raise `maxFreq` to f if needed. Pop: pop from `group[maxFreq]`, decrement that value's count, and if that stack is now empty, decrement `maxFreq`."

> "The key fact: a value with count f appears in every group from 1 to f, once in each. I never remove it from the lower groups when it climbs, because the copy at level f − 1 is still physically in the stack. When I pop its level-f copy, it's still sitting in `group[f − 1]` at exactly the right place for future tie-breaks."

#### Intuition

This is Approach 2 with the heap replaced by buckets. Every copy in the stack has a level (its value's count when it was pushed); entries at the same level are ordered by push time; and pop always takes the latest entry at the highest level. One stack per level holds that order directly, with no comparisons. It is a frequency-bucket structure like the one used for counting problems, with a twist: a value sits in **all** buckets up to its count, not only the bucket for its current count, because each bucket entry stands for a different physical copy.

#### Algorithm

- Fields: `freq` (value → count), `group` (level → stack of values), `maxFreq` (starts at 0).
- `push(val)`:
  1. `f = ++freq[val]`.
  2. `maxFreq = max(maxFreq, f)`.
  3. Push `val` onto `group[f]`, creating that stack if needed.
- `pop()`:
  1. `val` = pop from `group[maxFreq]`.
  2. `freq[val]--`.
  3. If `group[maxFreq]` is now empty, `maxFreq--`.
  4. Return `val`.

#### Why it is correct

**Invariant**, true between calls:

1. For every level f ≥ 1, `group[f]` contains exactly the values whose current count is at least f, each once.
2. Inside `group[f]`, values are ordered (bottom to top) by the stack position of their f-th copy from the bottom; that copy is the one pushed when the value's count reached f.
3. `maxFreq` is the highest current count (0 when the stack is empty), and `group[maxFreq]` is non-empty when `maxFreq ≥ 1`.

**Push keeps it.** The new copy of `val` becomes its f-th copy (f the new count) and lies on top of the whole stack, so it belongs on top of `group[f]` (part 2), and `val` now has count ≥ f, so it belongs in `group[f]` (part 1). Lower groups already contain `val` because its count was already ≥ f − 1. `maxFreq` can only rise to f.

**Pop returns the right value and keeps it.** By parts 1 and 3, `group[maxFreq]` holds exactly the values with count `maxFreq`, the most frequent ones (no value has a higher count). For such a value, its `maxFreq`-th copy from the bottom is its topmost copy, so by part 2 the top of `group[maxFreq]` is the most frequent value whose topmost copy is highest in the stack: the right answer. Popping it removes that copy's entry; the value keeps its entries in `group[1..maxFreq − 1]`, which stand for its other copies, still in place. So parts 1 and 2 hold.

**Why `maxFreq` falls by at most one, and why one decrement is enough.** If `group[maxFreq]` is still non-empty, some value still has count `maxFreq`, and nothing has a higher count, so `maxFreq` is unchanged. If it became empty, no value has count `maxFreq` any more, but the value just popped now has count `maxFreq − 1`, and it is still in `group[maxFreq − 1]` (part 1). So the new highest count is exactly `maxFreq − 1` and its group is non-empty. If `maxFreq − 1` is 0, the stack is empty, which is also consistent. A push raises one count by one, so `maxFreq` also rises by at most one. That is why a single integer, adjusted by ±1, tracks the maximum: no search is ever needed.

**The 25-second version to say to the interviewer:**

> "Think of each push as creating a copy at a level: the value's count after that push. A value with count f has copies at levels 1 to f, and its topmost copy is its level-f one. So the most frequent values are exactly the ones with an entry at the highest level, and the tie-break is the latest entry at that level. I keep one stack per level, pop from the highest, and lower the highest level by one if its stack empties; it can't drop by more, because the value I just popped is still in the level below."

#### Dry run

The example. Groups are shown bottom → top; empty groups are omitted.

| Call | Returns | freq after | group after | maxFreq |
|---|---|---|---|---|
| `push(5)` | | 5:1 | 1: [5] | 1 |
| `push(7)` | | 5:1, 7:1 | 1: [5, 7] | 1 |
| `push(5)` | | 5:2, 7:1 | 1: [5, 7]; 2: [5] | 2 |
| `push(7)` | | 5:2, 7:2 | 1: [5, 7]; 2: [5, 7] | 2 |
| `push(4)` | | 5:2, 7:2, 4:1 | 1: [5, 7, 4]; 2: [5, 7] | 2 |
| `push(5)` | | 5:3, 7:2, 4:1 | 1: [5, 7, 4]; 2: [5, 7]; 3: [5] | 3 |
| `pop()` | 5 | 5:2, 7:2, 4:1 | 1: [5, 7, 4]; 2: [5, 7] | 3 → 2 (group 3 emptied) |
| `pop()` | 7 | 5:2, 7:1, 4:1 | 1: [5, 7, 4]; 2: [5] | 2 |
| `pop()` | 5 | 5:1, 7:1, 4:1 | 1: [5, 7, 4] | 2 → 1 (group 2 emptied) |
| `pop()` | 4 | 5:1, 7:1, 4:0 | 1: [5, 7] | 1 |

Look at the third pop: 5 left group 2, but group 1 still has 5 at the bottom, standing for the first 5 pushed, which is still in the stack. Group 1 is never touched by the first three pops, and when the fourth pop comes it has exactly the right order: 4 above 7 above 5.

#### Java code

```java title="Approach 3: count map plus one stack per frequency (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

class FreqStack {
    private final Map<Integer, Integer> freq = new HashMap<>();          // value -> current count
    private final Map<Integer, Deque<Integer>> group = new HashMap<>();  // f -> values that reached count f, in push order
    private int maxFreq = 0;

    public FreqStack() {
    }

    public void push(int val) {
        int f = freq.merge(val, 1, Integer::sum);
        maxFreq = Math.max(maxFreq, f);
        group.computeIfAbsent(f, k -> new ArrayDeque<>()).push(val);
    }

    public int pop() {
        Deque<Integer> top = group.get(maxFreq);
        int val = top.pop();                  // most frequent; latest to reach that count = closest to the top
        freq.merge(val, -1, Integer::sum);
        if (top.isEmpty()) {
            maxFreq--;                        // val is still in group maxFreq - 1, so that group is not empty
        }
        return val;
    }
}
```

#### Time complexity

**O(1) expected amortized per call.** Each call does a constant number of hash map operations (expected O(1), assuming hash codes spread well) and one `ArrayDeque` push or pop (amortized O(1): the backing array doubles when full). There are no loops.

Implementation note: Java's `HashMap` can turn a heavily collided bucket into a balanced tree, which for `Integer` keys limits a lookup to about O(log n); that is how the current JDK behaves, not a guarantee of the `Map` interface.

#### Space complexity

**O(m + d) auxiliary space.** Every live copy has exactly one entry in exactly one group stack (push adds one, pop removes one), so the group stacks hold m entries in total. `freq` holds one entry per distinct value ever pushed (d), and `group` one key per level ever reached, at most the largest count, which is ≤ m at that time. All are bounded by the 2 × 10^4 calls.

## 5. Comparison table

m = elements currently in the stack, d = distinct values ever pushed, q = total calls (≤ 2 × 10^4). "Expected" comes from the hash map; the heap and stacks themselves are deterministic.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. List and count map, scan | push O(1) amortized, pop O(m) | pop O(m) plus hash map worst case | O(m + d) |
| 2. Priority queue of pushes | O(log m) per call | O(log m) plus hash map worst case | O(m + d) |
| 3. One stack per frequency level | O(1) amortized per call | O(1) amortized plus hash map worst case | O(m + d) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. List and scan | Follows the definition literally; easy to trust | O(m) per pop; the copy-removal detail is easy to get wrong | As the baseline and as a test reference |
| 2. Priority queue | Mechanical once you key each push, not each value; generalizes to other tie-break rules | O(log m); needs the "level per copy" argument anyway | If the tie-break were by something other than recency (any fixed key per push), where per-level stacks would no longer give the right order |
| 3. Per-level stacks | O(1) per call; short code | Needs the "value stays in every lower group" insight, which is the whole difficulty | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3. Derive it out loud: the scan baseline in one sentence, then "key each push, not each value" (which gives the heap), then "within a level, push order is already the order I want", which turns the heap into one stack per level.

**Is it optimal?** Asymptotically, yes: every call does at least constant work, and Approach 3 does constant expected amortized work. The "expected" comes only from mapping values up to 10^9 to counts; if values were small integers (say below 10^5), arrays indexed by value and by level would make every call worst-case O(1) amortized.

**When another solution is better in practice:**

- If the interviewer changes the tie-break to something not monotone in push time (for example "smallest value wins ties"), per-level stacks no longer hold the right order, and Approach 2 with that key is the natural fix.
- If you cannot make the "all lower groups" argument convincing, the heap is a correct O(log m) answer that you can defend with the level-per-copy invariant.

**When to stop:** with Approach 3, the invariant, and the "drops by at most one" argument, you are done. Replacing `group` by an `ArrayList` indexed by level is a valid micro-optimization (levels are 1..maxFreq, all non-empty), worth one sentence, not more code.

## 7. Interview script: code it and test it

### What I say while coding

> "Class `FreqStack`. `freq` is a `HashMap<Integer, Integer>`, `group` is a map from level to `ArrayDeque<Integer>` used as a stack, and `maxFreq` starts at 0."

> "Push: `freq.merge(val, 1, Integer::sum)` returns the new count f in one call. Update `maxFreq`. `computeIfAbsent(f, …)` creates the stack for a new level, then I push."

> "Pop: take `group.get(maxFreq)`. It's non-empty by the invariant and the problem guarantees the stack is non-empty. Pop the value, decrement its count, and only if that level's stack is now empty, decrement `maxFreq`. I don't touch the lower groups: those entries are the value's other copies."

### Testing out loud

**Normal case:** the example, as in the Approach 3 dry run: pops return 5, 7, 5, 4, and `maxFreq` goes 3 → 2 → 2 → 1 → 1.

**Single element:** `push(9)`, `pop()`: `group[1] = [9]`, pop returns 9, the stack empties, `maxFreq` becomes 0.

**All distinct:** `push(1)`, `push(2)`, `push(3)`: everything is in `group[1] = [1, 2, 3]`, `maxFreq = 1`. Pops return 3, 2, 1: a normal stack.

**All equal:** `push(4)` three times: groups 1, 2, 3 each hold [4], `maxFreq = 3`. Each pop empties the top group and lowers `maxFreq` by one: 4, 4, 4.

**The highest count drops:** `push(5)`, `push(5)`: groups 1: [5], 2: [5]. First pop takes 5 from group 2, which empties, so `maxFreq` becomes 1. Second pop takes 5 from group 1. Without the decrement, the second pop would call `pop()` on the empty group 2 and throw.

**Which copy goes:** `push(1)`, `push(2)`, `push(1)`: groups 1: [1, 2], 2: [1]. Pop → 1 from group 2 (`maxFreq` → 1). Pop → 2 from the top of group 1. Pop → 1. Returns 1, 2, 1, which matches the real stack: after the topmost 1 leaves, the stack is 1 2 and 2 is on top.

**Frequency beats recency:** `push(1)`, `push(1)`, `push(2)`: groups 1: [1, 2], 2: [1]. The first pop returns 1 from group 2 although 2 is on top, then 2, then 1.

**Pushes after pops:** `push(3)`, `push(3)`, `push(8)`, `pop()` → 3 (count 2), then `push(8)`: 8's count becomes 2, groups 1: [3, 8], 2: [8], `maxFreq` 2. Pops: 8 (group 2 empties), 8 (top of group 1), 3.

**Value extremes:** 0 and 10^9 behave like any other key; the map stores them as `Integer` keys.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 3 min | Current count, which copy is removed, the tie-break on topmost copies |
| Baseline | 2–3 min | The scan approach in words, with its O(m) pop |
| Key each push | 4 min | Levels per copy, the heap, why the max entry is the answer |
| Per-level stacks | 4 min | Replace the heap; the "all lower groups" fact; `maxFreq` moves by one |
| Code | 5 min | Approach 3 |
| Trace and edge cases | 5 min | The example, `push(5), push(5), pop, pop`, `push(1), push(2), push(1)` |
| Questions | rest | Section 9 |

**Where the time should go:** the levels idea and the reason a value stays in the lower groups. The code is twenty lines; most wrong answers come from moving a value between groups as its count changes, which is the instinct from other frequency problems.

**If you get stuck:**

1. Write the example's stack with each copy labelled by its level: 5¹ 7¹ 5² 7² 4¹ 5³. Ask which copy each pop removes. It is always the highest level, latest first.
2. If the per-level stacks will not come, say "a max-heap keyed by (level, push number)" and code Approach 2. It is correct and only a log factor away.
3. Accept a hint without fuss; the interviewer is grading how you use it ([[a14-responding-to-hints|Responding to Interviewer Hints]]).

## 9. Interviewer challenges

### About correctness

#### Why don't you remove the value from the lower groups when its count goes up?

**What they are testing:** the central insight. Candidates who learned frequency buckets from other problems tend to move a value from bucket f to bucket f + 1.

**How to reason:** ask what an entry in `group[f]` stands for. It is not "the value has count f", it is "this value's f-th copy is in the stack".

**What I say:** "Each entry is a physical copy. When 5 goes from count 1 to count 2, its first copy is still in the stack, so its entry in group 1 must stay, at the position it had when that copy was pushed. If I popped the second 5 later, group 1 already has the first 5 in the right place relative to other values. If I had moved 5 out of group 1, I'd have to re-insert it on pop, and I wouldn't know where."

**Nuance:** the "move between buckets" version breaks tie-breaks. With `push(5)`, `push(7)`, `push(5)`, it moves 5 from group 1 to group 2; the first pop returns 5 and puts it back on top of group 1, so the second pop returns 5 again, but the correct answer is 7 (the stack is 5 7, and 7 is on top). Moving between buckets is the right design for LFU Cache, where a key has one entry, not one per copy.

#### Why can `maxFreq` only drop by one? Couldn't a pop leave the maximum lower?

**What they are testing:** whether the O(1) bound is justified or assumed.

**How to reason:** look at the value just popped and where it still lives.

**What I say:** "The popped value had count `maxFreq` and now has `maxFreq − 1`. It's still in `group[maxFreq − 1]`. So after the pop, some value has count `maxFreq − 1`, and if the top group emptied, none has `maxFreq`. The new maximum is exactly one less. Pushes raise one count by one, so the maximum also rises by at most one. A single integer adjusted by one is enough."

**Nuance:** this is the opposite of LFU Cache's `minFreq`, which can reset to 1 at any insertion. Here the structure guarantees every level from 1 to `maxFreq` is non-empty, which is also why an `ArrayList` of stacks indexed by level works.

#### Your heap version stores a frequency per push. Isn't that stale once the count changes?

**What they are testing:** whether you understand why the key is fixed.

**How to reason:** the key belongs to the copy, not to the value.

**What I say:** "The stored number is the copy's level, its position among its value's copies, and that never changes while the copy is in the stack: copies below it can't be removed before it, because a pop always takes a value's topmost copy. So the heap never holds a stale key. The value's current count is simply the highest level among its live copies."

**Nuance:** a heap keyed by *value* with its current count would need decrease-key or lazy deletion, and it would also need each value's latest push time to break ties. Keying by push avoids all of that.

### About complexity

#### Is your solution really O(1)?

**What they are testing:** precision about hashing and amortization.

**How to reason:** list what each call does and the guarantee each operation has.

**What I say:** "Each call does a constant number of hash map operations and one deque push or pop, with no loops. Hash map operations are O(1) expected, assuming hash codes spread well, and `ArrayDeque` push is amortized O(1) because of resizing. So it's O(1) expected amortized per call."

**Nuance:** with values below some small bound, arrays replace both maps and the bound becomes worst-case O(1) amortized. The current JDK's tree bins limit a badly collided lookup to about O(log n), but that is implementation behaviour, not a promise of the API.

#### How much memory does this use compared with a plain stack?

**What they are testing:** whether you see that the groups don't duplicate elements.

**How to reason:** count entries per live copy.

**What I say:** "Each copy in the stack has exactly one entry, in the group for its level. So the groups hold m entries in total, the same as a plain stack, plus one count per distinct value. A value with count 3 appears in three groups, but that's three copies, three entries."

**Nuance:** `freq` keeps zero-count entries unless you remove them in `pop`. With at most 2 × 10^4 calls this is harmless; for a long-running structure, remove a value from `freq` when its count reaches 0.

## 10. Follow-up questions the interviewer might ask

**"Add `peek()`, returning the value `pop` would return without removing it."**
Return `group.get(maxFreq).peek()`. O(1) expected.

**"Add `frequency(val)`, the current count of a value."**
Return `freq.getOrDefault(val, 0)`. O(1) expected. Remove zero-count entries in `pop` if you want the map to hold only live values.

**"Values are guaranteed to be below 10^5. Can you avoid hashing?"**
Use an `int[]` for counts indexed by value and an `ArrayList` of `int` stacks indexed by level. Every call is then worst-case O(1) amortized. Memory O(V + m) for value range V.

**"Ties should go to the value whose topmost copy is closest to the bottom instead."**
Within a level, entries are ordered by push time, so take the bottom of `group[maxFreq]` instead of its top (use the deque at both ends). Removing a value's level-`maxFreq` entry still removes its topmost copy, so the other levels stay consistent. O(1) expected amortized.

**"Make it safe to use from several threads."**
Push and pop each update three fields together, so they must be atomic as a unit: a single lock around both methods is the straightforward answer. Finer-grained locking would not help much, since every pop touches the top group.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Moving a value between frequency buckets.** It is the LFU Cache instinct, but here each bucket entry is a copy. `push(5)`, `push(7)`, `push(5)`, `pop()`, `pop()` returns 5, 5 instead of 5, 7.
- **Breaking ties by the value's latest push time, ignoring pops.** "Latest push" must be among live copies. After pops, a value's most recent push may be gone; the level-per-copy view handles this, a single "last pushed at" field per value does not.
- **Assuming `maxFreq` has to be searched for after a pop.** It drops by at most one, because the popped value is still at the level below.
- **Treating frequency as the number of pushes ever.** The count must go down on every pop.

### Implementation mistakes

> [!MISTAKE] Forgetting to lower `maxFreq` when its group empties
> Without the decrement, the next pop calls `pop()` on an empty `ArrayDeque`, which throws `NoSuchElementException`. `push(5)`, `push(5)`, `pop()`, `pop()` fails on the second pop; the example fails on its second pop.

> [!MISTAKE] Lowering `maxFreq` on every pop
> Decrementing unconditionally skips levels that still have values. On the example, the pops return 5, 7, 4 and then the fourth pop throws `NullPointerException` (`group.get(0)` is `null`), instead of 5, 7, 5, 4.

- **Removing the wrong copy in the list version.** `stack.remove(Integer.valueOf(val))` removes the bottom-most equal element. After `push(1)`, `push(2)`, `push(1)` the pops return 1, 1, 2 instead of 1, 2, 1; the example returns 5, 5, 7, 5 instead of 5, 7, 5, 4.
- **Heap: comparing only the frequency.** Ties then fall to the heap's internal order. With Java's `PriorityQueue` the example's pops come out as 5, 7, 5, 7 instead of 5, 7, 5, 4, and `push(5)`, `push(7)`, `push(5)`, `push(7)` pops 5 first instead of 7.
- **Heap: breaking ties by the oldest push.** Reversing the second comparison gives 5, 5, 7, 5 on the example.
- **Comparing `Integer` objects with `==`.** `freq.get(a) == freq.get(b)` compares references and fails for counts outside the small-integer cache; compare against an `int` or use `equals`.

## 12. Pattern recognition

**The pattern:** a stack (or other container) with a removal rule based on a changing per-value statistic. Instead of re-keying a value when its statistic changes, give each insertion a fixed key at the moment it happens, and bucket insertions by that key, with a pointer to the best non-empty bucket that moves in single steps.

**Signals in the problem statement:**

- "Most frequent", "closest to the top": a frequency and a recency at the same time.
- Every call must be fast, so rescanning on removal is the baseline to beat.
- The statistic changes by exactly one per operation, so the best bucket also moves by at most one.

**Related problems in this list:**

- [[nc-lfu-cache|LFU Cache]]: frequency buckets plus a pointer to the extreme bucket, but there a key moves between buckets and `minFreq` can reset; compare the two designs.
- [[nc-min-stack|Min Stack]]: a stack augmented so a query about the whole stack is O(1); the same "record something per push" idea.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: buckets indexed by frequency, built once instead of maintained.
- [[nc-lru-cache|LRU Cache]]: recency-based removal with constant-time updates.
- [[nc-design-twitter|Design Twitter]]: a heap ordered by a timestamp recorded at insertion.

**Takeaway:** when an element's priority changes over time but only one step at a time, record the priority each insertion had when it happened and bucket by it; then the best bucket can be tracked with a counter instead of a heap.

## 13. 60-second revision card

**Key insight:** label every push with its level, the count its value reached. A value with count f has copies at levels 1..f, and its level-f copy is its topmost. Pop = the latest entry at the highest level.

**Invariant:** `group[f]` holds every value with count ≥ f, in the order each reached f; `maxFreq` is the highest count and `group[maxFreq]` is non-empty.

**Complexity:** O(1) expected amortized per call (hash maps, deque resizing). O(m + d) space: one group entry per live copy plus one count per distinct value.

**Code skeleton:**

```java title="Maximum Frequency Stack, one stack per level"
import java.util.*;

class FreqStack {
    private final Map<Integer, Integer> freq = new HashMap<>();
    private final Map<Integer, Deque<Integer>> group = new HashMap<>();
    private int maxFreq = 0;

    public void push(int val) {
        int f = freq.merge(val, 1, Integer::sum);
        maxFreq = Math.max(maxFreq, f);
        group.computeIfAbsent(f, k -> new ArrayDeque<>()).push(val);   // never removed from lower levels
    }

    public int pop() {
        Deque<Integer> top = group.get(maxFreq);
        int val = top.pop();
        freq.merge(val, -1, Integer::sum);
        if (top.isEmpty()) maxFreq--;          // the popped value is still one level down
        return val;
    }
}
```

**Main traps:**

- Never move a value out of the lower groups: each entry is a separate copy.
- Lower `maxFreq` only when its group empties, and by exactly one.
- In the list version, remove by index, not by value.
- `Integer` counts: compare with an `int`, not `==` between two `Integer`s.

**What to say in one breath:** "Each push gets a level, its value's new count. The most frequent values are the ones with an entry at the highest level, and the tie-break is the latest entry there, so I keep one stack per level and pop from the highest. The value stays in the lower levels because those entries are its other copies, and the highest level drops by at most one per pop. O(1) expected per call."
