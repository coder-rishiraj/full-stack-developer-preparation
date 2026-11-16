---
problemId: nc-detect-squares
title: Detect Squares
source: neetcode
sourceUrl: https://leetcode.com/problems/detect-squares/
difficulty: medium
patterns: [math-geometry, hashing, design]
relatedLessons: [a2-hashing, a1-hashmap, a1-custom-classes, a2-matrix, a14-clarifying-requirements, a14-edge-cases]
companies: []
timeToSolve: 25
---

## 1. Problem restatement

Design a class `DetectSquares` that receives points on a grid one at a time and answers questions about them.

- `add(point)` stores the point `[x, y]`. The same point may be added several times, and every copy counts as a separate point.
- `count(point)` takes a query point `[x, y]` and returns the number of ways to choose **three stored points** that, together with the query point, are the four corners of a square whose sides are parallel to the axes and whose area is positive. The query point itself is not stored by `count`.

**Example 1** (the official example)

```text
["DetectSquares", "add", "add", "add", "count", "count", "add", "count"]
[[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]
Output: [null, null, null, null, 1, 0, null, 2]
```

- After the first three adds, `count([11, 10])` is 1: the stored points `[3, 10]`, `[11, 2]` and `[3, 2]` complete the square with corners at x = 3, 11 and y = 2, 10.
- `count([14, 8])` is 0: no three stored points complete a square with it.
- After a second `[11, 2]` is added, `count([11, 10])` is 2: either copy of `[11, 2]` can be chosen, giving two different choices of three points.

**Example 2**

```text
["DetectSquares", "add", "add", "add", "add", "count", "count"]
[[], [[1, 1]], [[1, 3]], [[3, 1]], [[3, 3]], [[1, 1]], [[2, 2]]]
Output: [null, null, null, null, null, 1, 0]
```

- `count([1, 1])` is 1: `[1, 3]`, `[3, 1]` and `[3, 3]` complete the square. The stored copy of `[1, 1]` cannot be one of the three, because a "square" with two corners at the same place has zero area.
- `count([2, 2])` is 0: `[2, 2]` is the centre of that square, not a corner of any square the stored points can complete.

**What the problem statement guarantees**

- Every point has two coordinates, 0 ≤ x, y ≤ 1000.
- At most 3000 calls are made in total to `add` and `count`.
- Duplicate points are allowed and are treated as different points.
- Squares must be axis-aligned and have positive area.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The difficulty is not the code; it is counting exactly right: duplicates, degenerate squares, and squares on every side of the query point.

**How to practise**

1. Set a timer for 25 minutes and talk out loud.
2. Draw the query point and ask: once you pick one more corner, how much of the square is already determined?
3. Say the simplest correct design first, with the cost of `add` and of `count`.
4. Decide what the class should remember so that `count` can avoid looking at every stored point.
5. Trace your design on both examples, including the duplicate in Example 1.

> [!HINT] Hint 1: a small nudge
> A square has four corners. If you know the query corner and the corner diagonally opposite it, are the other two corners free, or already fixed?

> [!HINT] Hint 2: the kind of tool you need
> Since copies of a point all count, store *how many times* each point was added, and look counts up by the point. The number of ways to pick the three corners is then a product of three counts.

> [!HINT] Hint 3: almost the whole plan
> Keep a count for every stored point, organised so you can list the points that share the query's x coordinate. Each such point at height y ≠ query y fixes the side length; the square can lie to the left or to the right of that column, and each side needs two more corners. Multiply the three counts for each candidate square and add them up.

**Check yourself before revealing the walkthrough**

- [ ] My design returns `[null, null, null, null, 1, 0, null, 2]` on Example 1 and `[..., 1, 0]` on Example 2
- [ ] Adding a point and then counting at that same point returns 0, not 1
- [ ] I count squares on both sides of the query (left and right, above and below)
- [ ] I can state the cost of `add` and `count` with the variables defined

## 3. Interview script: understand the problem (≈3 min)

**Me:** Let me restate. Points arrive through `add`. A `count` query gives a fourth point and asks how many ways I can pick three stored points that complete an axis-aligned square with it. The query point isn't added.

**Interviewer:** Correct.

**Me:** "Ways to choose" with duplicates: if a point was added twice, choosing the first copy and choosing the second copy are different ways?

**Interviewer:** Yes. Duplicates are separate points.

**Me:** So with two copies of one corner, the answer doubles. And with a copies, b copies and c copies of the three corners, the square contributes a · b · c ways. What about degenerate squares, all four corners at the same place?

**Interviewer:** Only positive area counts.

**Me:** Good, so the side length must be at least 1. Axis-aligned only, so no rotated squares?

**Interviewer:** Axis-aligned only.

**Me:** What are the coordinate ranges and how many calls?

**Interviewer:** 0 to 1000 for both coordinates, and at most 3000 calls in total.

**Me:** Then at most 2999 points can be stored before a count that matters. Is there a pattern to the calls, like many more counts than adds?

**Interviewer:** No guarantee; assume any mix.

**Me:** Then I want both operations cheap and won't trade one heavily for the other. Can the answer overflow an `int`?

**Interviewer:** What do you think?

**Me:** Let me check. Every term in the answer is (copies of a column corner) × (copies of a row corner) × (copies of a diagonal corner). Those three groups are disjoint sets of stored points: column corners share the query's x, row corners share its y, diagonal corners share neither. So the whole sum is at most (column total) × (row total) × (diagonal total), with the three totals adding up to at most 2999. The product is largest when they're as equal as possible: 1000 × 1000 × 999 = 999,000,000, which fits in an `int` (2,147,483,647). And a single square with 1000, 1000 and 999 copies reaches it.

**Me:** One example by hand: the stored points (3, 10), (11, 2), (3, 2) and query (11, 10). If I pair the query with (3, 2) as its opposite corner, the other two corners must be (11, 2) and (3, 10). Both are stored once, so that's 1.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 0 ≤ x, y ≤ 1000 | A point fits in one `int` key, `x * 1001 + y`. A full 1001 × 1001 count grid (about a million `int`s, 4 MB) is also possible. |
| At most 3000 calls in total | At most 2999 stored points when a count matters. Even O(P) work per count, P = points stored, is at most about 3000 × 3000 = 9 × 10^6 steps overall, but O(P³) per count is far too slow. |
| Duplicates are separate points | Store a count per point, not a set; multiply counts. |
| Axis-aligned, positive area | The side length is a non-zero difference in x that must equal the difference in y in absolute value. A candidate equal to the query point must be skipped. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `count` does not store its query point | `count` is read-only; only `add` changes the state. |
| No guarantee on the mix of `add` and `count` calls | Neither operation should be made expensive to speed up the other. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The class does not keep the caller's array | I read `point[0]` and `point[1]` and store my own copy, so later changes to the caller's array do not affect me. |
| Single-threaded use | No synchronization; a concurrent version is a follow-up. |
| The answer fits in an `int` | I derived the bound 999,000,000 above, so the `int` return type of the official signature is safe. |

### Edge cases I will keep in mind

- Duplicates of a corner multiply the answer (Example 1's last count).
- The query point is itself stored: it must not serve as a corner of its own square (Example 2).
- Squares on all four sides of the query: left, right, above and below.
- A rectangle that is not a square, such as corners at x = 0, 2 and y = 0, 1: not counted.
- Coordinates at the boundaries, 0 and 1000, including the largest square with side 1000.
- A count before any add, or in an empty column: 0.

## 4. Think out loud: from first idea to best solution

Throughout: **P** = number of points added so far (copies included), **d** = number of distinct stored points (d ≤ P), **k** = number of distinct y values among stored points with the same x as the query (k ≤ 1001), and **V** = 1001, the number of possible values of each coordinate. Each stored point is written (x, y), and the query is (qx, qy).

One fact is used by every approach: **an axis-aligned square with the query as a corner is determined by the corner diagonally opposite.** If that corner is (x, y), the square is a real one exactly when |x − qx| = |y − qy| ≠ 0, and then the other two corners are (qx, y) and (x, qy).

### Alternative: try every triple of stored points

This rung is too slow for the largest tests (with 2999 stored points a single count examines about 4.5 × 10^9 triples), so it is not a numbered approach. It is the baseline. The page's test file runs it, and the next rung, on every small and medium case, and skips the 3000-call cases for them after measuring that their `count` is at least quadratic.

#### What I say out loud

> "The question literally asks for the number of triples of stored points that complete a square with the query. So the most direct design is a list of points, and `count` tries every triple and checks whether the four points are the corners of an axis-aligned square with positive area. Duplicates take care of themselves, because each copy is its own list entry."

> "That's P choose 3 checks per count, cubic. With a few thousand points it's billions of checks for one query. Correct, but hopeless at the limit."

#### Intuition

Count exactly what the statement asks for: every choice of three stored points, tested against the definition of a square.

#### Algorithm

1. `add`: append a copy of the point to a list.
2. `count(q)`: for every i < j < l, test whether q and points i, j, l form a square; count the successes.
3. The test: the four x values take exactly two values, the four y values take exactly two values, the two gaps are equal and non-zero, and each of the four corners (low/high x, low/high y) is used by exactly one of the four points.

#### Why it is correct

- **Every counted triple is valid:** the test accepts exactly four points that occupy the four distinct corners of an axis-aligned square with side length equal to the non-zero gap.
- **No valid triple is missed and none is counted twice:** every unordered triple of list positions is visited exactly once, and two copies of the same point are different list positions, so choosing one copy or the other is counted as two different ways, as the statement requires.

#### Dry run

Example 1, last count: list = `[(3, 10), (11, 2), (3, 2), (11, 2)]`, query (11, 10).

| Triple (list indices) | Points | Square with (11, 10)? |
|---|---|---|
| 0, 1, 2 | (3, 10), (11, 2), (3, 2) | yes |
| 0, 1, 3 | (3, 10), (11, 2), (11, 2) | no: (3, 2) corner missing, (11, 2) used twice |
| 0, 2, 3 | (3, 10), (3, 2), (11, 2) | yes |
| 1, 2, 3 | (11, 2), (3, 2), (11, 2) | no: (3, 10) missing |

Count = 2.

#### Java code

```java title="Alternative: every triple (too slow at 3000 calls)"
import java.util.ArrayList;
import java.util.List;

class DetectSquares {
    private final List<int[]> points = new ArrayList<>();

    public DetectSquares() {
    }

    public void add(int[] point) {
        points.add(new int[] {point[0], point[1]});
    }

    public int count(int[] point) {
        int n = points.size();
        int total = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                for (int l = j + 1; l < n; l++) {
                    if (isSquare(point, points.get(i), points.get(j), points.get(l))) {
                        total++;
                    }
                }
            }
        }
        return total;
    }

    // Are the four points exactly the four corners of an axis-aligned square with positive area?
    private static boolean isSquare(int[] a, int[] b, int[] c, int[] e) {
        int[][] p = {a, b, c, e};
        int minX = Math.min(Math.min(a[0], b[0]), Math.min(c[0], e[0]));
        int maxX = Math.max(Math.max(a[0], b[0]), Math.max(c[0], e[0]));
        int minY = Math.min(Math.min(a[1], b[1]), Math.min(c[1], e[1]));
        int maxY = Math.max(Math.max(a[1], b[1]), Math.max(c[1], e[1]));
        int side = maxX - minX;
        if (side == 0 || maxY - minY != side) {
            return false;
        }
        int cornersUsed = 0;
        for (int[] q : p) {
            if ((q[0] != minX && q[0] != maxX) || (q[1] != minY && q[1] != maxY)) {
                return false;                                   // not on a corner
            }
            int corner = (q[0] == maxX ? 2 : 0) + (q[1] == maxY ? 1 : 0);
            cornersUsed |= 1 << corner;
        }
        return cornersUsed == 0b1111;                           // each corner exactly once
    }
}
```

#### Time complexity

**`add`: O(1) amortized** (an `ArrayList` append). **`count`: O(P³)**, exactly P(P − 1)(P − 2)/6 calls to `isSquare`, each constant time. With P = 2999 that is about 4.5 × 10^9 for one count.

#### Space complexity

**O(P)** for the list. `count` uses O(1) extra.

#### The bridge to the next approach

> "Most triples are hopeless from the first point. Use the fact about squares: if I pick the diagonal corner, the other two corners are fixed. So instead of three free choices, I make one: loop over the stored points as the diagonal, keep only those with |dx| = |dy| ≠ 0, and then count how many stored points sit at the two fixed corners. The simplest way to count them is to scan the list again."

### Alternative: fix the diagonal corner, scan for the other two

This rung is also too slow at the limit (about P² steps per count when most points are diagonal candidates), so it is not numbered.

#### What I say out loud

> "One loop picks the diagonal corner. For each valid diagonal, I scan the list twice to count copies of the two fixed corners, and multiply. Every square is found exactly once per copy of its diagonal corner, because the diagonal determines the square."

#### Intuition

Choosing the diagonal corner removes two of the three free choices; what is left is counting copies of two known points.

#### Algorithm

1. `add`: append a copy of the point.
2. `count(q)`: for each list entry p = (x, y) with |x − qx| = |y − qy| ≠ 0: scan the list for copies of (qx, y) and of (x, qy), and add the product of the two counts.

#### Why it is correct

- **Each valid choice is counted exactly once.** A valid choice of three stored points has exactly one point at the corner diagonal to q, and the diagonal determines the square, so the choice is counted in the iteration of that diagonal entry: once for each pair (copy at (qx, y), copy at (x, qy)), which is the product of their counts.
- **Nothing invalid is counted:** the diagonal test guarantees a square of positive area, and the two scanned corners are exactly the remaining corners of that square.

#### Dry run

Example 1, last count, query (11, 10), list `[(3, 10), (11, 2), (3, 2), (11, 2)]`.

| Diagonal candidate | dx, dy | Valid? | Copies of (11, y) | Copies of (x, 10) | Adds |
|---|---|---|---|---|---|
| (3, 10) | −8, 0 | no | | | 0 |
| (11, 2) | 0, −8 | no | | | 0 |
| (3, 2) | −8, −8 | yes | (11, 2): 2 | (3, 10): 1 | 2 |
| (11, 2) | 0, −8 | no | | | 0 |

Count = 2.

#### Java code

```java title="Alternative: diagonal + scans (too slow at 3000 calls)"
import java.util.ArrayList;
import java.util.List;

class DetectSquares {
    private final List<int[]> points = new ArrayList<>();

    public DetectSquares() {
    }

    public void add(int[] point) {
        points.add(new int[] {point[0], point[1]});
    }

    public int count(int[] point) {
        int qx = point[0];
        int qy = point[1];
        int total = 0;
        for (int[] p : points) {
            int dx = p[0] - qx;
            int dy = p[1] - qy;
            if (dx == 0 || Math.abs(dx) != Math.abs(dy)) {
                continue;                       // not the diagonal of a square with positive area
            }
            total += copies(qx, p[1]) * copies(p[0], qy);
        }
        return total;
    }

    private int copies(int x, int y) {
        int c = 0;
        for (int[] p : points) {
            if (p[0] == x && p[1] == y) {
                c++;
            }
        }
        return c;
    }
}
```

#### Time complexity

**`add`: O(1) amortized. `count`: O(P + D · P) = O(P²) in the worst case**, where D ≤ P is the number of stored points that are valid diagonals: one pass to find them, and two full scans for each. With 2999 stored points that are all valid diagonals (for example many copies of (5, 5) queried at (0, 0)), one count is about 18 million steps, and a sequence of 1500 adds followed by 1500 such counts is over 6 × 10^9.

#### Space complexity

**O(P)** for the list; O(1) extra in `count`.

#### The bridge to the next approach

> "The inner scans ask the same question over and over: how many copies of this exact point are stored? That's a lookup, not a search. If `add` also maintains a count per point in a hash map, each scan becomes one `get`. That needs a key for a point, which is worth a moment's thought."

### Approach 1: List of points plus a count map

#### What I say out loud

> "I keep the list, so `count` still loops over every stored point as a possible diagonal. But I also keep a map from point to number of copies, updated in `add`. The two fixed corners become two map lookups."

> "For the key: coordinates are 0 to 1000, so `x * 1001 + y` packs a point into one int without collisions. I'll say why 1001 and not 1000 in a second."

#### Intuition

Answer "how many copies of (x, y)?" in constant expected time by counting at insertion time.

#### Algorithm

1. `add(x, y)`: append to the list; `counts[key(x, y)] += 1`.
2. `count(q)`: for each list entry (x, y) with |x − qx| = |y − qy| ≠ 0, add `counts[key(qx, y)] · counts[key(x, qy)]` (0 when absent).
3. `key(x, y) = x * 1001 + y`.

**Choosing the composite key.** A point is two numbers, and a hash map needs one key. The options:

| Key | Example for (3, 10) | Pros | Cons |
|---|---|---|---|
| `x * 1001 + y` as `int` | 3013 | One small boxed `Integer`, cheap hash and `equals`; distinct points give distinct keys because 0 ≤ y ≤ 1000 < 1001 | Relies on the coordinate bounds; `x * 1000 + y` collides ((0, 1000) and (1, 0) are both 1000) |
| `((long) x << 32) \| y` as `long` | 12,884,901,898 | Works for any non-negative `int` coordinates | Boxed `Long`; slightly more memory |
| Nested maps `x → (y → count)` | `get(3).get(10)` | No encoding at all; gives "all points with this x" for free | Two lookups, one inner map per distinct x |
| `String` `x + "," + y` | `"3,10"` | Readable, any coordinates | Builds a string for every lookup, hashing it reads every character; needs the separator (`"1" + "23"` and `"12" + "3"` are both `"123"`) |
| A `record Point(int x, int y)` | `new Point(3, 10)` | Clearest; `equals` and `hashCode` generated | One allocation per lookup |

The `int` encoding is the cheapest and is safe here because of the stated bounds; nested maps come back in Approach 3, where their structure is useful.

#### Why it is correct

`counts[key(x, y)]` always equals the number of list entries equal to (x, y): `add` updates both together, and the key is injective (from `key` one recovers x = key / 1001 and y = key % 1001). So each map lookup returns exactly what the scan of the previous rung counted, and the sum is the same; that rung's argument (each valid choice counted once through its diagonal corner) carries over unchanged.

#### Dry run

Example 1. After the three adds: `counts = {(3, 10): 1, (11, 2): 1, (3, 2): 1}`.

`count(11, 10)`:

| Diagonal candidate | Valid? | `counts(11, y)` | `counts(x, 10)` | Adds |
|---|---|---|---|---|
| (3, 10) | no (dy = 0) | | | 0 |
| (11, 2) | no (dx = 0) | | | 0 |
| (3, 2) | yes | (11, 2): 1 | (3, 10): 1 | 1 |

Returns 1. `count(14, 8)`: (3, 10) has dx = −11, dy = 2; (11, 2) has −3, −6; (3, 2) has −11, −6; none valid, returns 0. After the second `add(11, 2)`, `counts(11, 2) = 2`, and the same scan adds 2 · 1 = 2 for the diagonal (3, 2); the two (11, 2) entries are invalid diagonals. Returns 2.

#### Java code

```java title="Approach 1: list of points + count map"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class DetectSquares {
    private final List<int[]> points = new ArrayList<>();
    private final Map<Integer, Integer> counts = new HashMap<>();   // key(x, y) -> copies

    public DetectSquares() {
    }

    private static int key(int x, int y) {
        return x * 1001 + y;                    // injective because 0 <= y <= 1000
    }

    public void add(int[] point) {
        points.add(new int[] {point[0], point[1]});
        counts.merge(key(point[0], point[1]), 1, Integer::sum);
    }

    public int count(int[] point) {
        int qx = point[0];
        int qy = point[1];
        int total = 0;
        for (int[] p : points) {                // every stored copy, as the diagonal corner
            int dx = p[0] - qx;
            int dy = p[1] - qy;
            if (dx == 0 || Math.abs(dx) != Math.abs(dy)) {
                continue;
            }
            total += counts.getOrDefault(key(qx, p[1]), 0) * counts.getOrDefault(key(p[0], qy), 0);
        }
        return total;
    }
}
```

#### Time complexity

**`add`: O(1) expected** (amortized append plus one `merge`). **`count`: O(P) expected**: one pass over the list with at most two map lookups per entry, each constant on average assuming the hash codes spread well (small distinct `Integer` keys spread well in practice). Over at most 3000 calls the total is at most about 1500 × 1500 ≈ 2.3 × 10^6 entry visits.

#### Space complexity

**O(P)**: the list holds every copy, and the map holds d ≤ P entries.

#### The bridge to the next approach

> "There's still redundancy: if (3, 2) was added 500 times, the loop visits it 500 times and adds the same product 500 times. Since the map already knows the multiplicity, I can loop over the map's distinct points instead and multiply by the diagonal's own count. Then I don't need the list at all."

### Approach 2: Count map only, distinct points as diagonals

#### What I say out loud

> "Drop the list. `add` only increments the count of its point. `count` iterates over the distinct stored points; for each valid diagonal, it multiplies three counts: the diagonal's, and the two fixed corners'."

#### Intuition

A point with c copies contributes c times the same product in Approach 1. Group those contributions: one iteration per distinct point, multiplied by c.

#### Algorithm

1. `add(x, y)`: `counts[key(x, y)] += 1`.
2. `count(q)`: for each entry (key, c) in `counts`: decode x = key / 1001, y = key % 1001; if |x − qx| = |y − qy| ≠ 0, add `c · counts[key(qx, y)] · counts[key(x, qy)]`.

#### Why it is correct

The sum in Approach 1 has one term per stored copy; copies of the same point give identical terms. Grouping the c identical terms of each distinct point into c × (that term) changes the order of addition, not the sum. So Approach 2 returns the same value as Approach 1.

#### Dry run

Example 1, last count, `counts = {(3, 10): 1, (11, 2): 2, (3, 2): 1}`, query (11, 10).

| Entry | c | dx, dy | Valid? | Corner counts | Adds |
|---|---|---|---|---|---|
| (3, 10) | 1 | −8, 0 | no | | 0 |
| (11, 2) | 2 | 0, −8 | no | | 0 |
| (3, 2) | 1 | −8, −8 | yes | (11, 2): 2, (3, 10): 1 | 1 · 2 · 1 = 2 |

Returns 2. (A `HashMap` may iterate the entries in any order; the sum is the same.)

#### Java code

```java title="Approach 2: count map, distinct diagonals"
import java.util.HashMap;
import java.util.Map;

class DetectSquares {
    private final Map<Integer, Integer> counts = new HashMap<>();   // key(x, y) -> copies

    public DetectSquares() {
    }

    private static int key(int x, int y) {
        return x * 1001 + y;
    }

    public void add(int[] point) {
        counts.merge(key(point[0], point[1]), 1, Integer::sum);
    }

    public int count(int[] point) {
        int qx = point[0];
        int qy = point[1];
        int total = 0;
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            int x = e.getKey() / 1001;
            int y = e.getKey() % 1001;
            if (x == qx || Math.abs(x - qx) != Math.abs(y - qy)) {
                continue;                       // not a diagonal of a positive-area square
            }
            total += e.getValue()
                    * counts.getOrDefault(key(qx, y), 0)
                    * counts.getOrDefault(key(x, qy), 0);
        }
        return total;
    }
}
```

#### Time complexity

**`add`: O(1) expected. `count`: O(d) expected**, one iteration per distinct stored point with two lookups each, where d ≤ min(P, V²). Iterating a `HashMap` also visits its empty buckets, which is proportional to the table capacity; with the default load factor the capacity stays within a constant factor of the number of entries, so this is still O(d).

#### Space complexity

**O(d)** for the map.

#### The bridge to the next approach

> "I'm still looking at every distinct point, but almost none of them can be a diagonal. Turn it around: a square with the query as a corner has a corner in the query's own column, directly above or below it. There are at most 1001 such points, and usually far fewer. If I could list the points in column qx, each one at height y fixes the side, and the square goes either left or right: two candidates. Nested maps, x to (y to count), give me exactly that list."

### Approach 3: Column index with nested maps (recommended)

#### What I say out loud

> "I store counts as a map from x to a map from y to count. For a query (qx, qy), I take the column of qx. Each entry (y, c) with y ≠ qy is a vertical side of length |y − qy|. The square is then to the right or the left, at x2 = qx + side or qx − side, where side = y − qy. For each, multiply c by the counts at (x2, y) and (x2, qy)."

> "Each square is found exactly once, through its unique corner in the query's column. Work per count is the number of distinct heights in one column, at most 1001."

#### Intuition

Every square with q as a corner has exactly one other corner in q's column. Enumerate that corner instead of the diagonal: a column is a short list, and the nested map hands it over directly.

#### Algorithm

1. `add(x, y)`: `columns[x][y] += 1` (create the inner map when x is new).
2. `count(q)`: let `col = columns[qx]`; if it is absent return 0.
3. For each (y, c) in `col` with y ≠ qy: `side = y - qy`; for `x2` in {qx + side, qx − side}: add `c · columns[x2][y] · columns[x2][qy]` (0 when absent).

#### Why it is correct

- **Every square is considered.** A square with positive area that has q as a corner has a corner directly above or below q, at (qx, y) with y ≠ qy, and its side length is |y − qy|. Its other two corners are (x2, y) and (x2, qy) with x2 = qx + (y − qy) or qx − (y − qy): the square lies right or left of the column. Both options are tried.
- **No square is counted twice.** The column corner of a given square is unique (it is the corner with x = qx other than q), and a square lies on exactly one side, so it appears in exactly one (y, x2) iteration.
- **Copies are counted correctly.** For a fixed square, the number of ways to choose one stored copy at each of its three corners is the product of the three counts. The three corners are distinct points (side ≠ 0), so no copy is used twice.
- **Positive area:** y ≠ qy makes side non-zero, so x2 ≠ qx too.

**The 25-second version to say out loud:**

> "Every square with the query as a corner has exactly one other corner in the query's column. I iterate that column; each height y ≠ qy fixes the side, and the square is either to the left or to the right, so two candidates, each needing two more corners. The number of ways is the product of the three counts. Each square is found once, through its unique column corner, and y ≠ qy rules out zero area."

#### Dry run

Example 1, last count. `columns = {3: {10: 1, 2: 1}, 11: {2: 2}}`, query (11, 10).

| (y, c) in column 11 | side = y − 10 | x2 | count(x2, y) | count(x2, 10) | Adds |
|---|---|---|---|---|---|
| (2, 2) | −8 | 11 − 8 = 3 | (3, 2): 1 | (3, 10): 1 | 2 · 1 · 1 = 2 |
| | | 11 + 8 = 19 | (19, 2): 0 | | 0 |

Returns 2. The first count, before the second `add(11, 2)`, gives 1 · 1 · 1 = 1. `count(14, 8)`: column 14 does not exist, returns 0.

Example 2, `count(1, 1)` with `columns = {1: {1: 1, 3: 1}, 3: {1: 1, 3: 1}}`:

| (y, c) in column 1 | side | x2 | count(x2, y) | count(x2, 1) | Adds |
|---|---|---|---|---|---|
| (1, 1) | — | — | skipped: y = qy | | 0 |
| (3, 1) | 2 | 3 | (3, 3): 1 | (3, 1): 1 | 1 |
| | | −1 | absent | | 0 |

Returns 1; the stored copy of the query point was skipped.

#### Java code

```java title="Approach 3: column index with nested maps (recommended)"
import java.util.HashMap;
import java.util.Map;

class DetectSquares {
    // columns.get(x).get(y) = number of copies of (x, y)
    private final Map<Integer, Map<Integer, Integer>> columns = new HashMap<>();

    public DetectSquares() {
    }

    public void add(int[] point) {
        columns.computeIfAbsent(point[0], x -> new HashMap<>()).merge(point[1], 1, Integer::sum);
    }

    public int count(int[] point) {
        int qx = point[0];
        int qy = point[1];
        Map<Integer, Integer> column = columns.get(qx);
        if (column == null) {
            return 0;
        }
        int total = 0;
        for (Map.Entry<Integer, Integer> e : column.entrySet()) {
            int y = e.getKey();
            if (y == qy) {
                continue;                           // zero side length: no square
            }
            int side = y - qy;
            for (int x2 : new int[] {qx + side, qx - side}) {   // square to the right and to the left
                total += e.getValue() * copies(x2, y) * copies(x2, qy);
            }
        }
        return total;
    }

    private int copies(int x, int y) {
        Map<Integer, Integer> column = columns.get(x);
        return column == null ? 0 : column.getOrDefault(y, 0);
    }
}
```

`x2` can fall outside 0..1000 (as −1 and 19 do above, or −8 in general); the lookup simply finds nothing there, so no bounds check is needed.

#### Time complexity

**`add`: O(1) expected** (at most two map operations). **`count`: O(k) expected**, where k ≤ 1001 is the number of distinct heights in the query's column: per entry, two candidate squares with two lookups each (each of up to two map levels), constant on average assuming hash codes spread well. A column with k distinct heights needs at least k adds, so across all 3000 calls the worst case is about 1001 adds into one column followed by 1999 counts on it: 1999 × 1001 × 4 ≈ 8 × 10^6 lookups. Usually it is far fewer, since a column rarely holds many distinct heights.

#### Space complexity

**O(d)**: one inner-map entry per distinct point, plus one inner map per distinct x (at most min(d, 1001)).

### Alternative: a 1001 × 1001 count grid

Because coordinates are bounded, direct addressing replaces hashing: `int[][] grid = new int[1001][1001]`, `add` increments `grid[x][y]`, and `count` walks the whole column `grid[qx][0..1000]` instead of only its non-empty cells.

#### What I say out loud

> "If memory is no issue, a 1001 by 1001 int array holds every count, about 4 MB. `count` scans the query's column, all 1001 heights, and for each non-zero one checks the two candidate squares with plain array reads, after a bounds check on x2."

#### Intuition

The same column enumeration as Approach 3, with array indexing instead of hashing; the price is visiting empty cells and a fixed 4 MB table.

#### Algorithm

1. `add`: `grid[x][y]++`.
2. `count(q)`: for y in 0..1000 with y ≠ qy and `grid[qx][y] > 0`: side = y − qy; for x2 in {qx + side, qx − side} with 0 ≤ x2 ≤ 1000, add `grid[qx][y] · grid[x2][y] · grid[x2][qy]`.

#### Why it is correct

It enumerates exactly the same column corners and candidate squares as Approach 3 (cells with count 0 contribute 0 and are skipped), so it returns the same sum. The bounds check only skips squares that would need a corner outside the grid, which cannot be stored.

#### Dry run

Example 1, last count: column 11 is all zeros except `grid[11][2] = 2`. At y = 2: side = −8; x2 = 3 gives `2 · grid[3][2] · grid[3][10]` = 2 · 1 · 1 = 2; x2 = 19 gives 2 · 0 · 0 = 0. Returns 2 after visiting 1001 cells.

#### Java code

```java title="Alternative: 1001 x 1001 count grid"
class DetectSquares {
    private static final int SIZE = 1001;           // coordinates are 0..1000
    private final int[][] grid = new int[SIZE][SIZE];

    public DetectSquares() {
    }

    public void add(int[] point) {
        grid[point[0]][point[1]]++;
    }

    public int count(int[] point) {
        int qx = point[0];
        int qy = point[1];
        int total = 0;
        for (int y = 0; y < SIZE; y++) {
            int c = grid[qx][y];
            if (c == 0 || y == qy) {
                continue;
            }
            int side = y - qy;
            for (int x2 : new int[] {qx + side, qx - side}) {
                if (x2 >= 0 && x2 < SIZE) {
                    total += c * grid[x2][y] * grid[x2][qy];
                }
            }
        }
        return total;
    }
}
```

#### Time complexity

**`add`: O(1). `count`: O(V) = 1001 iterations in every case**, guaranteed (no hashing). The constructor fills V² ≈ 10^6 cells with zeros, O(V²) once.

#### Space complexity

**O(V²)** ≈ 1,002,001 `int`s, about 4 MB, whatever the number of points.

## 5. Comparison table

P = points added so far (copies included), d = distinct stored points, k = distinct heights in the query's column (≤ 1001), V = 1001. Expected bounds assume hash codes spread well.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Every triple | `add` O(1) amortized; `count` O(P³) | Same | O(P) |
| Alt. Diagonal + scans | `add` O(1) amortized; `count` O(P²) | Same | O(P) |
| 1. List + count map | `add` O(1); `count` O(P) | Hash-table worst case per lookup (O(d) in general) | O(P) |
| 2. Count map, distinct diagonals | `add` O(1); `count` O(d) | Hash-table worst case per lookup | O(d) |
| 3. Column index, nested maps | `add` O(1); `count` O(k) | Hash-table worst case per lookup | O(d) |
| Alt. Count grid | `add` O(1); `count` O(V) | Same (no hashing); O(V²) once to allocate | O(V²) ≈ 4 MB |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Every triple | Literally the definition; duplicates need no thought | Cubic per count | Only as the stated baseline |
| Alt. Diagonal + scans | Introduces the key observation (the diagonal fixes the square) | Quadratic per count | As the step that shows the observation, before the map |
| 1. List + count map | Linear per count; simple | Visits every copy; keeps a redundant list | If it is where your derivation lands; then mention grouping |
| 2. Count map, distinct diagonals | One structure, short code; the common published answer | Still scans every distinct point | A perfectly good interview answer |
| 3. Column index | Only looks where squares can be; best bound among the hashing designs | Nested maps; two levels of lookup | The default answer |
| Alt. Count grid | No hashing, guaranteed bound, tiny code | 4 MB fixed; depends on small coordinates; always scans 1001 cells | Small bounded coordinates and memory to spare |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 3, the column index, with the "one corner in the query's column" argument. If you derived Approach 2 first, it is also a strong answer: same code size, O(d) per count. Mention the column refinement in one sentence.

**Is it optimal?** I would not claim a lower bound for `count`, and an interviewer does not expect one. What I can say: `add` is O(1) expected, which cannot be beaten, and `count` only looks where a square can have its column corner, at most 1001 heights. At 3000 calls, every design from Approach 1 on is far inside any time limit, so further asymptotic work buys nothing.

**When another is better in practice:** with small bounded coordinates and plenty of memory, the grid avoids hashing entirely and has a guaranteed bound. If counts vastly outnumber adds, you could even precompute per-point answers, but the interviewer said there is no such pattern.

**When to stop:** after the column index and the overflow argument. Shaving the two candidate squares to one with a clever sign trick, or caching, changes constants only.

## 7. Interview script: code it and test it

### What I say while coding

> "State: `Map<Integer, Map<Integer, Integer>> columns`, x to y to count. `add` is one line: `computeIfAbsent` for the column, `merge` to increment."

> "In `count`, I grab the query's column; if it doesn't exist there are no squares."

> "For each (y, c) in that column, skip y equal to qy: that's the zero-area case, and it's also how a stored copy of the query point gets excluded."

> "`side = y - qy` is signed, and the square can be at qx + side or qx − side. I keep the sign rather than taking the absolute value, which is fine because I try both directions anyway."

> "Each candidate contributes c times the copies at (x2, y) times the copies at (x2, qy). A helper `copies(x, y)` returns 0 for anything absent, including x2 off the grid."

> "The total fits in an int: at most 999,000,000, as computed earlier."

### Testing out loud

**Example 1:** traced in the dry run: 1, 0, 2. Correct.

**Example 2, the query point is stored:** `count(1, 1)` skips (1, 1) itself and finds side 2 to the right: 1. `count(2, 2)`: column 2 is empty: 0. Correct.

**Square below and to the left:** add (0, 0), (0, 5), (5, 0) and query (5, 5). Column 5 has (0, 1); side = −5; x2 = 0 gives copies(0, 0) · copies(0, 5) = 1; x2 = 10 gives 0. Returns 1.

**Not a square:** add (0, 1), (2, 0), (2, 1), query (0, 0). Column 0 has (1, 1); side 1; x2 = 1 has nothing; x2 = −1 has nothing. Returns 0. Correct, since (0, 0), (2, 1) is a 2 × 1 rectangle.

**Four squares around the query:** add the 8 points (0, 0), (0, 1), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1), (2, 2) and query (1, 1): column 1 has heights 0 and 2, each with two sides: 4 squares. Returns 4.

**Largest square and multiplicities:** 1000 copies each of (0, 1000) and (1000, 0) and 999 of (1000, 1000), query (0, 0): column 0 has (1000, 1000 copies); side 1000; x2 = 1000 gives 1000 · 999 · 1000 = 999,000,000. The answer fits in an int.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 3 min | Duplicates multiply, positive area, axis-aligned, bounds, call mix, overflow |
| Baseline and key observation | 3 min | Every triple; then "the diagonal fixes the square" |
| Count map and key choice | 3 min | Per-point counts; the `x * 1001 + y` key and why not 1000 |
| Column refinement | 3 min | One corner in the query's column; two sides |
| Code | 6–8 min | Nested maps, the loop, `copies` helper |
| Test | 4 min | Both examples, the stored-query case, a non-square rectangle |

Spend the time on counting correctly, not on speed: the bugs that cost people this problem are the zero-area square, a set instead of counts, and checking only one side. If stuck, draw the query and one other corner and ask what else is forced.

## 9. Interviewer challenges

### About counting

#### Why do you multiply the counts?

**What they are testing:** whether "duplicates are different points" was understood combinatorially.

**How to reason:** for a fixed square, a way to choose is one copy at each of three distinct corners; choices are independent.

**What I say:** "For one square, I pick a copy at each of its three other corners, independently. With a, b and c copies, that's a times b times c choices. With a set instead of counts, the example's last count would be 1 instead of 2."

**Nuance:** I ran the set-based version: it returns `[1, 0, 1]` for the three counts of Example 1 instead of `[1, 0, 2]`.

#### How do you make sure no square is counted twice?

**What they are testing:** whether your enumeration is a bijection, not just a cover.

**How to reason:** name the unique feature of a square you enumerate by.

**What I say:** "I enumerate squares by their corner in the query's column. A square with q as a corner has exactly one other corner with x = qx, and it lies on exactly one side of that column, so it's visited once, as one (y, x2) pair. If I also enumerated by the query's row, I'd count every square twice."

**Nuance:** in Approach 2 the unique feature is the diagonal corner; the same argument applies.

#### What happens if the query point itself has been added?

**What they are testing:** the positive-area rule.

**How to reason:** a stored copy of q sits at height qy in q's column, which is exactly the skipped case.

**What I say:** "It's in the query's column at y = qy, and I skip that entry, because the side length would be zero. Without the check, adding (1, 1) and counting at (1, 1) would return 1 instead of 0. I ran the diagonal version without its zero check, and that's exactly what it returned."

**Nuance:** a stored copy of q can still be a corner of *other* queries' squares; it is only excluded from its own.

### About the design

#### Why `x * 1001 + y` and not `x * 1000 + y`?

**What they are testing:** composite keys and collisions.

**How to reason:** the encoding is injective only if the multiplier exceeds the largest y.

**What I say:** "y goes up to 1000, so with multiplier 1000, (0, 1000) and (1, 0) both encode to 1000. With 1001, y always fits below the multiplier, so x and y can be recovered. For example, after adding (1, 1), (0, 1) and (0, 1000), the 1000 version counts a square at (0, 0) that doesn't exist; I ran it and it returned 1 instead of 0."

**Nuance:** for unbounded coordinates use `((long) x << 32) | (y & 0xffffffffL)`, nested maps, or a record key.

#### Why not a `String` key like `"3,10"`?

**What they are testing:** cost awareness.

**How to reason:** what each lookup allocates and hashes.

**What I say:** "It works, but every lookup builds a new string and hashes its characters, several times per candidate square. An int key costs one multiplication. And without the comma, `"1" + "23"` and `"12" + "3"` collide."

**Nuance:** at 3000 calls the difference won't decide anything; it is about showing you know where the cost is.

### About complexity and limits

#### Can the answer overflow?

**What they are testing:** deriving bounds from constraints.

**How to reason:** the three corner groups are disjoint sets of stored points.

**What I say:** "The answer is at most (copies in the query's column) × (copies in its row) × (copies at diagonal positions), and those total at most 2999. The maximum product is 1000 · 1000 · 999 = 999,000,000, below 2^31 − 1, and one square with those multiplicities reaches it, so int is enough but not by a huge margin."

**Nuance:** with no limit on the number of calls, switch to `long`.

## 10. Follow-up questions the interviewer might ask

**"Support `remove(point)`."** Decrement the count, and remove the entry (and an empty column) at zero so iteration stays proportional to live points. O(1) expected; `count` unchanged.

**"Count axis-aligned rectangles instead of squares."** A column corner no longer fixes the shape, but the diagonal corner still fixes the other two corners: for each distinct stored point (x, y) with x ≠ qx and y ≠ qy, add c(x, y) · c(qx, y) · c(x, qy). That is O(d) per count with Approach 2's structure. Alternatively pair every height in the query's column with every x in its row and look up the diagonal: O(k · r), with r distinct x values in the row; use whichever is smaller.

**"Coordinates up to 10^9."** The grid is out, and `x * 1001 + y` is too; use a `long` key or nested maps. Approach 3 is unchanged and still O(k) per count.

**"Many threads call `add` and `count`."** Simplest: synchronize both methods. For more throughput, a `ConcurrentHashMap` of `ConcurrentHashMap<Integer, LongAdder>`; `count` then reads a moving snapshot, which must be acceptable to the caller.

**"Rotated squares too."** The diagonal corner still fixes the square: the other two corners are the centre plus and minus the half-diagonal rotated by 90 degrees, and a candidate whose corners are not integer points is skipped. So Approach 2's loop works with a different corner formula (any distinct point can be a diagonal, so no |dx| = |dy| filter); the column shortcut does not apply.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Storing a set.** Duplicates are separate points; a set loses multiplicities (Example 1's last count becomes 1).
- **Forgetting zero area.** Counting a stored copy of the query as its own diagonal returns 1 for `add(1, 1)`, `count(1, 1)`.
- **Checking one side only.** Iterating the column but trying only x2 = qx + |side| misses squares on the left: on Example 1 both counts that should be 1 and 2 return 0 (checked by running it).
- **Enumerating by both the column and the row,** which counts every square twice.
- **Assuming the answer needs a `long` without checking,** or assuming `int` without checking. The bound is 999,000,000; say it.

### Implementation mistakes

> [!MISTAKE] A key that collides
> `x * 1000 + y` maps (0, 1000) and (1, 0) to the same key. Use a multiplier larger than the largest y (1001), a `long` with a shift, or nested maps.

- **Comparing boxed counts with `==`** (for example `columns.get(x).get(y) == other`) compares references above 127. Use the unboxed `int` values.
- **`map.get(key)` without a default** throws a `NullPointerException` when unboxing an absent count. Use `getOrDefault(key, 0)`.
- **Storing the caller's array** instead of copying the coordinates: harmless on LeetCode, but a caller that reuses the array would change your stored points.
- **Grid version without a bounds check on x2:** `qx + side` can be negative or above 1000 and throw.

## 12. Pattern recognition

**The pattern:** counting structures with a hash map of multiplicities, keyed by a composite key, and enumerating by the one feature that determines each object uniquely.

**Signals in the problem statement:**

- "Duplicates are treated as different": counts, and products of counts.
- A geometric shape determined by few of its points (a diagonal fixes an axis-aligned square).
- A design problem with `add` and `query` operations and no guarantee on their mix.
- Small bounded coordinates: a composite `int` key, or a grid.

**Related problems in this list:**

- [[nc-valid-sudoku|Valid Sudoku]]: composite keys (row, column, box) in hash sets; the same section of the roadmap.
- [[nc-two-sum|Two Sum]]: "the partner is determined, so look it up instead of searching", here with three partners.
- [[nc-design-hashmap|Design HashMap]]: the map underneath, and when direct addressing beats hashing.
- [[nc-time-based-key-value-store|Time Based Key-Value Store]]: another design problem built from a map of maps or lists.
- [[nc-verifying-an-alien-dictionary|Verifying An Alien Dictionary]]: a lookup table chosen from the size of the key space.

**Takeaway:** if one or two points fix the whole shape, enumerate those and look the rest up in a count map; multiply counts when duplicates are distinct.

## 13. 60-second revision card

**Key insight:** every square with the query as a corner has exactly one other corner in the query's column; its height fixes the side, and the square is to the left or right. Multiply the three corner counts.

**Invariant:** `columns[x][y]` = number of copies of (x, y) added so far.

**Complexity:** `add` O(1) expected; `count` O(k) expected, k ≤ 1001 distinct heights in the query's column; O(d) space. The answer is at most 999,000,000, so `int` is safe.

**Code skeleton:**

```java title="DetectSquares, column index"
import java.util.HashMap;
import java.util.Map;

class DetectSquares {
    private final Map<Integer, Map<Integer, Integer>> cols = new HashMap<>();

    public void add(int[] p) {
        cols.computeIfAbsent(p[0], k -> new HashMap<>()).merge(p[1], 1, Integer::sum);
    }

    public int count(int[] p) {
        Map<Integer, Integer> col = cols.getOrDefault(p[0], Map.of());
        int total = 0;
        for (Map.Entry<Integer, Integer> e : col.entrySet()) {
            int side = e.getKey() - p[1];
            if (side == 0) continue;                                   // zero area
            for (int x2 : new int[] {p[0] + side, p[0] - side}) {     // right and left
                Map<Integer, Integer> other = cols.getOrDefault(x2, Map.of());
                total += e.getValue() * other.getOrDefault(e.getKey(), 0) * other.getOrDefault(p[1], 0);
            }
        }
        return total;
    }
}
```

**Traps:** a set instead of counts; the zero-area case; only one side; `x * 1000 + y`.
