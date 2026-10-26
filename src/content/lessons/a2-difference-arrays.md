---
summary: A difference array stores how much each element differs from the one before it, so adding a value to a whole range touches only two entries. You will learn why that works, how to apply thousands of range updates in O(1) each and rebuild the array with one prefix-sum pass, how to handle 1-based and half-open ranges, and when to switch to a sweep, a 2D grid version or a Fenwick tree.
difficulty: intermediate
minutes: 35
objectives:
  - Explain the difference array as the inverse of a prefix sum and derive why a range update changes exactly two entries
  - Implement range add and rebuild in Java, including on top of a non-zero base array, without boundary errors
  - Translate 1-based and half-open problem ranges into the correct diff indices
  - Apply the technique to capacity and coverage problems, sparse coordinates with a TreeMap, and 2D submatrix updates
  - Decide when a difference array is enough and when interleaved queries need a Fenwick or segment tree
---

## Introduction

An airline sells block bookings: "reserve 25 seats on every flight from flight 2 to flight 5". Over a day it receives 20,000 such bookings across 20,000 flights, and at the end of the day it needs the total seats reserved on each flight. The obvious method loops over every flight in each booking's range and adds the seats. A booking can span all 20,000 flights, so the worst case is 20,000 × 20,000 = 400 million additions.

The waste is that each booking adds the *same* number to a whole contiguous range. Instead of writing that number into every slot, write down only where the change **begins** and where it **ends**: "+25 starting at flight 2" and "−25 starting at flight 6". After all bookings are recorded, one left-to-right pass with a running total turns those markers into the actual seat counts. Each booking now costs O(1), and the final pass costs O(n) — about 40,000 steps instead of 400 million.

That list of markers is a **difference array**. It is the counterpart of the prefix sum from [[a2-prefix-suffix]]: prefix sums make *range queries* cheap on a fixed array, while difference arrays make *range updates* cheap when you only need the final result. The technique shows up in booking and capacity problems, in counting how many intervals cover each point, in image processing, and as the idea behind range-update Fenwick trees.

## Before you start

- **Prefix sums** — building `P[i + 1] = P[i] + a[i]` in one pass. See [[a2-prefix-suffix]]; this lesson relies on it throughout.
- **Array traversal** — off-by-one reasoning with inclusive ranges. See [[a2-array-string-traversal]].
- **Intervals** — closed versus half-open ranges. See [[a2-intervals]]; one section here is a sweep line, which that lesson introduces.

## The intuition

Think of a road with a series of street lights, and imagine you want to raise the brightness of lights 2 through 5 by 25 units. You could walk along and adjust each light. Or, if the lights were wired so that each one's brightness equals the previous light's brightness plus a "step" set at its own switch, you would only need to touch two switches: add 25 at light 2 (every light from there on gets 25 brighter) and subtract 25 at light 6 (every light from there on is back to normal). The lights in between follow automatically.

The difference array is that set of step switches. Each entry says "how much brighter am I than my left neighbour?". A range update changes the brightness *difference* only at the two edges of the range; inside it, neighbours rise together and their differences do not change.

## The definition

For an array `a` of length `n`, its **difference array** `d` is:

- `d[0] = a[0]`
- `d[i] = a[i] − a[i − 1]` for `1 ≤ i < n`

Take `a = [3, 3, 5, 8, 8, 6]`. Then `d = [3, 0, 2, 3, 0, −2]`. Each entry is the step from the previous element.

The difference array loses nothing: you can rebuild `a` by adding the steps back up. `a[0] = d[0]`, `a[1] = a[0] + d[1]`, and in general `a[i] = d[0] + d[1] + … + d[i]`. In other words, **`a` is the prefix sum of `d`**, and `d` is the "inverse prefix sum" of `a`. That relationship is the whole technique.

## Why a range update touches only two entries

Add `v` to every element of `a[l..r]` (inclusive). Look at what happens to each difference `d[i] = a[i] − a[i − 1]`:

| Position | Effect on `a[i]` and `a[i − 1]` | Change in `d[i]` |
|---|---|---|
| `i < l` | neither changes | 0 |
| `i = l` | `a[l]` rises by `v`, `a[l − 1]` does not | `+v` |
| `l < i ≤ r` | both rise by `v` | 0 |
| `i = r + 1` | `a[r + 1]` does not rise, `a[r]` did | `−v` |
| `i > r + 1` | neither changes | 0 |

So the whole update is `d[l] += v` and `d[r + 1] −= v`. Viewed through prefix sums: the `+v` at `l` is carried by the running total into every later position, and the `−v` at `r + 1` cancels it from there on. The net effect is `+v` on exactly `l..r`.

If `r` is the last index, there is no `r + 1` inside the array. Either check `r + 1 < n` before subtracting, or — simpler and less error-prone — allocate `d` with **`n + 1` slots** and let the extra slot absorb the subtraction. The rebuild pass simply ignores it.

## Implementation

Here is a small, complete class. It builds the difference array from any base array (pass `new int[n]` to start from zeros), applies range updates in O(1), and rebuilds in O(n).

```java title="DifferenceArray.java"
import java.util.Arrays;

public class DifferenceArray {
    private final long[] diff;   // one extra slot so r + 1 never needs a bounds check

    /** Starts from a base array (use new int[n] for all zeros). Requires n >= 1. */
    DifferenceArray(int[] base) {
        diff = new long[base.length + 1];
        diff[0] = base[0];
        for (int i = 1; i < base.length; i++) diff[i] = (long) base[i] - base[i - 1];
    }

    /** Adds v to every element of base[l..r], inclusive. O(1). */
    void rangeAdd(int l, int r, long v) {
        diff[l] += v;            // from l onwards, values are v higher...
        diff[r + 1] -= v;        // ...and from r + 1 onwards, they are back to normal
    }

    /** Rebuilds the current array with one prefix-sum pass. O(n). */
    long[] build() {
        long[] out = new long[diff.length - 1];
        long running = 0;
        for (int i = 0; i < out.length; i++) {
            running += diff[i];
            out[i] = running;
        }
        return out;
    }

    public static void main(String[] args) {
        DifferenceArray zeros = new DifferenceArray(new int[6]);
        zeros.rangeAdd(1, 3, 2);
        zeros.rangeAdd(2, 5, 3);
        zeros.rangeAdd(0, 1, -1);
        System.out.println(Arrays.toString(zeros.build()));

        DifferenceArray prices = new DifferenceArray(new int[]{10, 10, 12, 15, 15});
        prices.rangeAdd(0, 4, 1);       // every price up by 1
        prices.rangeAdd(2, 3, -5);      // a sale on items 2..3
        System.out.println(Arrays.toString(prices.build()));
    }
}
```

```output
[-1, 1, 5, 5, 3, 3]
[11, 11, 8, 11, 16]
```

The values are stored as `long` because many range additions can push a running total past the `int` limit even when each individual update is small.

### Dry run

Follow the first example: six zeros, then three updates. The table shows the 7-slot `diff` after each update (index 6 is the spare slot).

| Update | Change | `diff[0..6]` after |
|---|---|---|
| start | — | `[0, 0, 0, 0, 0, 0, 0]` |
| add 2 to `[1, 3]` | `diff[1] += 2`, `diff[4] −= 2` | `[0, 2, 0, 0, −2, 0, 0]` |
| add 3 to `[2, 5]` | `diff[2] += 3`, `diff[6] −= 3` | `[0, 2, 3, 0, −2, 0, −3]` |
| add −1 to `[0, 1]` | `diff[0] −= 1`, `diff[2] += 1` | `[−1, 2, 4, 0, −2, 0, −3]` |

Now rebuild with a running total:

| `i` | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| `diff[i]` | −1 | 2 | 4 | 0 | −2 | 0 |
| running total = `a[i]` | −1 | 1 | 5 | 5 | 3 | 3 |

Check index 2 directly: it lies in the second update (+3) and in the first (+2), but not in the third, so it should be 5. The second update's `−3` landed in the spare slot because its range reached the last index — no bounds check needed.

### Starting from a non-zero base

The second example starts from real prices. There are two equivalent approaches. The class above converts the base into its difference array first (`diff[i] = base[i] − base[i − 1]`), so the rebuild directly produces base plus updates. The alternative keeps a zero difference array for the updates only, rebuilds it, and then adds `base[i]` to each result. Both are O(n) extra work; the second is handy when the base is shared or must stay untouched.

### Complexity

With `n` elements and `U` updates: building from the base is O(n), each update is O(1), and the rebuild is O(n). Total **O(n + U)**, compared with O(n · U) for updating every element directly. Space is O(n) for the difference array.

The catch is in the word *rebuild*. The current value of an element is a prefix sum of `diff`, so reading one element in the middle of the updates costs O(n). The technique is designed for **offline** use: all updates first, then all reads. If reads and updates interleave, see the trade-offs section.

```quiz
Q: To add v to a[l..r] (inclusive) using a difference array d, which two entries change?
- [ ] d[l] += v and d[r] -= v
- [x] d[l] += v and d[r + 1] -= v
- [ ] d[l - 1] += v and d[r] -= v
- [ ] d[l] += v and d[r + 1] += v
> The step into the range is at l (a[l] rises but a[l-1] does not), and the step out is at r + 1 (a[r] rose but a[r+1] does not). Subtracting at r would cancel the update one element too early and leave a[r] unchanged.

Q: Why is the difference array usually allocated with n + 1 slots?
- [ ] Java arrays are 1-based
- [ ] To store the total sum
- [x] So an update ending at the last index can write d[r + 1] without a bounds check; the extra slot is ignored when rebuilding
- [ ] To make the prefix sum run in O(1)
> When r = n - 1, r + 1 = n is outside an n-element array. The spare slot absorbs that subtraction harmlessly, which removes a branch and a common off-by-one bug.
```

## Mapping problem ranges to indices

Most bugs with difference arrays are not in the technique but in translating the problem's ranges. Two translations come up constantly.

### 1-based, inclusive ranges: Corporate Flight Bookings

**Problem.** Flights are numbered 1 to `n`. Each booking `{first, last, seats}` reserves `seats` on every flight from `first` to `last` inclusive. Return the total seats on each flight.

Flight `f` lives at array index `f − 1`. The update for `[first, last]` therefore starts at index `first − 1` and stops after index `last − 1`, so the subtraction goes at index `(last − 1) + 1 = last`.

```java title="FlightBookings.java"
import java.util.Arrays;

public class FlightBookings {
    // bookings[i] = {first, last, seats}, flights numbered 1..n
    static int[] corpFlightBookings(int[][] bookings, int n) {
        int[] diff = new int[n + 1];             // index = flight - 1, plus one spare slot
        for (int[] b : bookings) {
            diff[b[0] - 1] += b[2];              // convert 1-based "first" to 0-based
            diff[b[1]] -= b[2];                  // 0-based (last - 1) + 1 == last
        }
        int[] seats = new int[n];
        int running = 0;
        for (int i = 0; i < n; i++) {
            running += diff[i];
            seats[i] = running;
        }
        return seats;
    }

    public static void main(String[] args) {
        int[][] bookings = {{1, 2, 10}, {2, 3, 20}, {2, 5, 25}};
        System.out.println(Arrays.toString(corpFlightBookings(bookings, 5)));
    }
}
```

```output
[10, 55, 45, 25, 25]
```

Flight 2 is in all three bookings: 10 + 20 + 25 = 55. Flight 3 is in the second and third: 45. The `diff[b[1]]` line looks as if it forgot the `+ 1`; it did not — the `− 1` for 1-based indexing and the `+ 1` for "one past the end" cancel. Write that reasoning as a comment, because the next reader will wonder too. With the problem's limits (up to 2 × 10⁴ bookings of up to 10⁴ seats), totals stay below 2.1 × 10⁹, so `int` is safe here; check the limits in each problem.

### Half-open ranges: Car Pooling

**Problem.** A car with `capacity` seats drives east. Trip `{passengers, from, to}` picks up passengers at kilometre `from` and drops them off at `to`. Can every trip be served?

Passengers are on board from `from` up to but **not including** `to`: they leave at `to`, freeing seats for anyone boarding there. That is a half-open range `[from, to)`, so the update covers indices `from..to − 1`, and the subtraction goes at `(to − 1) + 1 = to`. After all trips are recorded, the running total at each kilometre is the number of people on board; if it ever exceeds `capacity`, the answer is false.

```java title="CarPooling.java"
public class CarPooling {
    // trips[i] = {passengers, from, to}; passengers are on board for stops [from, to)
    static boolean carPooling(int[][] trips, int capacity) {
        int maxStop = 0;
        for (int[] t : trips) maxStop = Math.max(maxStop, t[2]);
        int[] diff = new int[maxStop + 1];
        for (int[] t : trips) {
            diff[t[1]] += t[0];                  // board at "from"
            diff[t[2]] -= t[0];                  // leave at "to": half-open, so no + 1
        }
        int onBoard = 0;
        for (int stop = 0; stop <= maxStop; stop++) {
            onBoard += diff[stop];
            if (onBoard > capacity) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int[][] trips = {{2, 1, 5}, {3, 3, 7}};
        System.out.println(carPooling(trips, 4) + " " + carPooling(trips, 5));
        int[][] handover = {{3, 2, 7}, {3, 7, 9}, {8, 3, 9}};
        System.out.println(carPooling(handover, 11));
    }
}
```

```output
false true
true
```

In the first input, kilometres 3 and 4 carry both groups (2 + 3 = 5), so capacity 4 fails and 5 succeeds. The `handover` test shows why the half-open reading matters: one group of 3 leaves at kilometre 7 exactly as another group of 3 boards. With the correct `diff[to] −= …`, the count at kilometre 7 is 3 + 8 = 11 and capacity 11 suffices. If you treated trips as inclusive and subtracted at `to + 1`, both groups would overlap at kilometre 7, the count would reach 14, and the answer would wrongly be false.

The array is sized by the largest stop, not by the number of trips, so this works when coordinates are small (the problem bounds them by 1,000). Time O(T + maxStop) for `T` trips.

> [!TIP] One question settles the index
> For every range in a problem, ask: "what is the first index affected, and what is the first index *not* affected after it?" Add at the first, subtract at the second. That works for 0-based, 1-based, inclusive and half-open ranges alike.

## Counting coverage, and the sweep-line connection

A special case deserves its own name. If every update adds exactly 1, the rebuilt array counts **how many ranges cover each position**. That answers questions such as "what is the busiest minute of the day?", "which position on a road is covered by the most cameras?" or "how many rooms are needed?" — the maximum of the rebuilt array is the peak overlap.

This is the **sweep line** from [[a2-intervals]] in array form: each range contributes a +1 event at its start and a −1 event at its end, and walking positions in order with a running total is sweeping a vertical line across the timeline. The difference array works when positions are small integers you can index directly. When they are huge (timestamps, coordinates up to 10⁹), you cannot allocate an array that long — but you only need the positions where something changes. Store the +1 and −1 events in a `TreeMap`, whose keys are kept sorted, and take the running total in key order:

```java title="SparseSweep.java"
import java.util.Map;
import java.util.TreeMap;

public class SparseSweep {
    // Half-open bookings [start, end) with coordinates up to 10^9: store only the
    // positions where the count changes, in sorted order.
    public static void main(String[] args) {
        int[][] bookings = {{10, 20}, {50, 60}, {10, 40}, {5, 15}, {5, 10}, {25, 55}};
        TreeMap<Integer, Integer> diff = new TreeMap<>();
        for (int[] b : bookings) {
            diff.merge(b[0], 1, Integer::sum);
            diff.merge(b[1], -1, Integer::sum);
            int running = 0, peak = 0;
            for (Map.Entry<Integer, Integer> e : diff.entrySet()) {   // prefix sum in key order
                running += e.getValue();
                peak = Math.max(peak, running);
            }
            System.out.print(peak + " ");
        }
        System.out.println();
        System.out.println(diff);
    }
}
```

```output
1 1 2 3 3 3 
{5=2, 10=1, 15=-1, 20=-1, 25=1, 40=-1, 50=1, 55=-1, 60=-1}
```

After each booking, the program prints the maximum number of simultaneous bookings so far (this is LeetCode's My Calendar III). The final map shows the idea clearly: at position 10, one booking starts (`+2` from two starts) and one ends (`−1` from `[5, 10)`), so the net change is `+1`. Because the bookings are half-open, an end and a start at the same position combine into one net value, which handles the tie automatically. Each booking costs O(log k) to insert and O(k) to rescan, where `k` is the number of distinct positions — fine for a few hundred bookings. For heavier workloads, a segment tree over compressed coordinates answers each booking in O(log k).

## Two-dimensional difference arrays

The same idea extends to grids: add `v` to every cell of the submatrix with corners `(r1, c1)` and `(r2, c2)`. In 1D you mark the start and the end. In 2D you mark four corners, using the **inclusion–exclusion** pattern from 2D prefix sums ([[a2-prefix-suffix]]):

- `d[r1][c1] += v` — the block starts here and, after a 2D prefix sum, would extend to the bottom-right of the grid;
- `d[r1][c2 + 1] −= v` — cancel everything to the right of the block;
- `d[r2 + 1][c1] −= v` — cancel everything below the block;
- `d[r2 + 1][c2 + 1] += v` — the region below-right was cancelled twice, so add it back once.

After all updates, a 2D prefix sum rebuilds the grid: `out[r][c] = d[r][c] + out[r − 1][c] + out[r][c − 1] − out[r − 1][c − 1]`.

```java title="Diff2D.java"
import java.util.Arrays;

public class Diff2D {
    static int[][] apply(int m, int n, int[][] updates) {
        int[][] d = new int[m + 1][n + 1];       // spare row and column for r2 + 1, c2 + 1
        for (int[] u : updates) {
            int r1 = u[0], c1 = u[1], r2 = u[2], c2 = u[3], v = u[4];
            d[r1][c1] += v;                      // start the block
            d[r1][c2 + 1] -= v;                  // stop it to the right
            d[r2 + 1][c1] -= v;                  // stop it below
            d[r2 + 1][c2 + 1] += v;              // undo the double subtraction
        }
        int[][] out = new int[m][n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                int above = r > 0 ? out[r - 1][c] : 0;
                int left = c > 0 ? out[r][c - 1] : 0;
                int diag = r > 0 && c > 0 ? out[r - 1][c - 1] : 0;
                out[r][c] = d[r][c] + above + left - diag;   // 2D prefix sum
            }
        }
        return out;
    }

    public static void main(String[] args) {
        int[][] updates = {
            {0, 0, 1, 1, 1},     // add 1 to rows 0..1, columns 0..1
            {1, 1, 3, 2, 2}      // add 2 to rows 1..3, columns 1..2
        };
        for (int[] row : apply(4, 4, updates)) System.out.println(Arrays.toString(row));
    }
}
```

```output
[1, 1, 0, 0]
[1, 3, 2, 0]
[0, 2, 2, 0]
[0, 2, 2, 0]
```

Cell `(1, 1)` lies in both blocks and holds 3; the column 3 cells are untouched. Each update is O(1) and the rebuild is O(m · n), compared with O(area) per update done directly. This is the technique behind problems such as "stamping" a grid with rectangles or counting how many rectangles cover each cell.

## In real systems

**Booking and capacity planning.** Hotels, airlines and cloud schedulers record reservations as range updates and periodically materialise per-day or per-hour totals to check against capacity — Corporate Flight Bookings at production scale, typically batched so the O(n) rebuild runs once per batch rather than per booking.

**Analytics.** "How many users were active at each minute?" from session start/end logs is a coverage count: +1 at login, −1 at logout, then a running total. Done in SQL, it is a window function — `SUM(delta) OVER (ORDER BY ts)` — over a union of start and end events, which is a sweep line inside the database.

**Graphics.** Rasterisers fill polygons scanline by scanline by marking where each edge enters and leaves a row and accumulating across it; summed-area tables (2D prefix sums) and their inverse appear in image filtering.

**Genomics.** Read-depth coverage — how many sequenced fragments cover each base of a genome — is computed by adding +1 at each fragment's start and −1 after its end, then taking a running sum along the chromosome.

## Trade-offs and alternatives

| Approach | Range update | Point read | Best when |
|---|---|---|---|
| Update every element | O(r − l + 1) | O(1) | Few updates, or tiny ranges |
| Difference array | O(1) | O(n) (rebuild) | All updates first, then reads (offline) |
| Sweep with sorted events / `TreeMap` | O(log k) | O(k) rescan | Coordinates too large for an array |
| Fenwick tree on the differences | O(log n) | O(log n) | Updates and point reads interleave ([[a12-fenwick]]) |
| Segment tree with lazy propagation | O(log n) | O(log n), also range queries | Interleaved range updates *and* range sums/max ([[a12-segment-trees]]) |

The difference array is the simplest and fastest option for the offline case and needs only an array. Its limitation is that the current values are hidden until you rebuild. A Fenwick tree removes that limitation with the same underlying idea: it stores the difference array, but in a structure that computes any prefix sum — that is, any current element — in O(log n). If a problem says "after each update, report …", a plain difference array is not enough.

## Common mistakes

> [!MISTAKE] Subtracting at r instead of r + 1
> For an inclusive range `[l, r]`, the subtraction belongs at `r + 1`. Subtracting at `r` leaves the last element of the range unchanged. Check one element at each end of the range in a dry run before trusting the code.

**Writing past the end.** `d[r + 1]` when `r = n − 1` throws. Allocate `n + 1` slots or guard the write.

**Mishandling 1-based or half-open ranges.** Convert to "first affected index" and "first unaffected index" before writing to the array.

**Returning the difference array instead of the result.** Forgetting the prefix-sum pass returns the markers, not the values.

**Rebuilding too early.** Rebuilding after some updates and then applying more to the old `diff` (or to the rebuilt array as if it were `diff`) mixes the two representations.

**Using it for interleaved queries.** Rebuilding after every update makes each query O(n) and the whole thing O(n · Q); use a Fenwick or segment tree.

**Overflow.** Many updates can push running totals past `int`; use `long` when the sum of all `|v|` can exceed about 2.1 × 10⁹.

## Interview perspective

Difference arrays rarely appear as "implement a difference array". They appear as booking, capacity or coverage problems where the brute force updates every element of every range, and the interviewer is waiting for you to notice that the updates are uniform over contiguous ranges.

> [!INTERVIEW] What a strong answer sounds like
> "Each booking adds the same amount to a contiguous range, and I only need the final totals. So I'll keep a difference array: add at the first flight, subtract one past the last. That's O(1) per booking. One prefix-sum pass at the end gives every flight's total, so it's O(n + bookings) overall instead of O(n · bookings). If we had to answer queries between bookings, I'd use a Fenwick tree on the same differences."

Questions to prepare:

- **Why `d[r + 1] −= v`?** It cancels the update from `r + 1` onwards when the prefix sum carries it forward.
- **How do you combine it with an existing array?** Convert the base to differences first, or add the base after rebuilding.
- **Car Pooling: why `diff[to]` and not `diff[to + 1]`?** Passengers leave at `to`, so the range is half-open.
- **Coordinates up to 10⁹?** Store only the change points in a `TreeMap` (or sort the events), or compress coordinates.
- **2D version?** Four corner updates and a 2D prefix sum.
- **Difference array versus Fenwick tree?** Offline batch versus interleaved updates and queries.

## Practice

1. **Range Addition.** Start from `n` zeros and apply `{start, end, inc}` updates; return the final array.
2. **Corporate Flight Bookings.** Implement it from scratch, writing the index conversion as a comment.
3. **Car Pooling.** Solve with a difference array, then with sorted events for coordinates up to 10⁹.
4. **Zero Array Transformation I.** Each query lets you decrement any elements in a range by 1; decide whether the array can reach all zeros by comparing each element with its coverage count.
5. **Shifting Letters II.** Apply forward and backward shifts over ranges of a string, then apply the net shift modulo 26.
6. **Stamping the Grid (stretch).** Combine a 2D prefix sum (where can a stamp fit?) with a 2D difference array (which cells are covered?).

The DSA explorer lists the matching problems under this topic; start with *Corporate Flight Bookings* and *Car Pooling*.

## Quick revision {#quick-revision}

- Difference array: `d[0] = a[0]`, `d[i] = a[i] − a[i − 1]`. The prefix sum of `d` is `a`.
- Range add `v` on `[l, r]` inclusive: `d[l] += v`, `d[r + 1] −= v`. O(1).
- Allocate `n + 1` slots so `r + 1 = n` needs no bounds check.
- Rebuild with one running-total pass: O(n). Total O(n + U) instead of O(n · U).
- Rule for any range: add at the first affected index, subtract at the first unaffected index after it.
- 1-based `[first, last]` → `d[first − 1] += v`, `d[last] −= v`. Half-open `[from, to)` → `d[from] += v`, `d[to] −= v`.
- Non-zero base: convert the base to differences first, or add it after rebuilding.
- All updates +1 → coverage counts; maximum = peak overlap (sweep line).
- Huge coordinates → `TreeMap` of change points or coordinate compression.
- 2D: four corners (`+`, `−`, `−`, `+`), then a 2D prefix sum.
- Offline only; interleaved updates and reads → Fenwick tree or segment tree.

## Key takeaways {#key-takeaways}

- A difference array records where values step up or down, and the original array is its prefix sum.
- Adding a constant to a contiguous range changes only the steps at its two edges, which makes each range update O(1).
- The technique is offline: apply every update, then rebuild once; reading in between costs O(n).
- Most bugs are index translation; always find the first affected and first unaffected positions.
- Counting coverage with +1/−1 is the sweep line, and a `TreeMap` extends it to sparse coordinates.
- When updates and queries interleave, a Fenwick or segment tree keeps the same idea with O(log n) operations.
