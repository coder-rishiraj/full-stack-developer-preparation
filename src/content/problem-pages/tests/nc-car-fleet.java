import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Car Fleet page (run by `npm run problems:verify`).
 * Three independent references:
 *  - an exact event simulation with BigInteger fractions (tiny inputs): fleets move, adjacent fleets merge
 *    when the back one reaches the front one at or before the target, and the fleets reaching the target are counted;
 *  - the pairwise rule, O(n^2) with exact cross-multiplication (medium inputs): a car leads a fleet exactly when
 *    every car ahead of it has a strictly smaller own time;
 *  - for n = 10^5, answers known from the construction, and the pairwise rule's suffix form computed with
 *    BigInteger fractions over cars bucketed by position.
 */
class Tests {
    static int cases = 0;
    static final int N = 100_000;
    static final int MAX_TARGET = 1_000_000;
    static final int MAX_SPEED = 1_000_000;

    public static void main(String[] args) {
        // Examples in section 1 and the dry-run input in section 4
        check(12, new int[] {10, 8, 0, 5, 3}, new int[] {2, 4, 1, 1, 3}, 3);    // `>=` returns 4
        check(100, new int[] {0, 2, 4}, new int[] {4, 2, 1}, 1);
        check(10, new int[] {3}, new int[] {3}, 1);

        // Edge cases from sections 3, 7, 9 and 11
        check(10, new int[] {0, 5}, new int[] {2, 1}, 1);                        // catch exactly at the target
        check(10, new int[] {1, 4, 7}, new int[] {2, 2, 2}, 3);                  // same speeds
        check(10, new int[] {3, 1, 0}, new int[] {1, 3, 2}, 1);                  // previous-car comparison returns 2
        check(10, new int[] {8, 7}, new int[] {2, 2}, 2);                        // integer division returns 1
        check(MAX_TARGET, new int[] {3, 2}, new int[] {999_998, 999_999}, 2);    // float returns 1
        check(MAX_TARGET, new int[] {2, 3}, new int[] {999_999, 999_998}, 2);    // same cars, other input order
        check(MAX_TARGET, new int[] {1, 2}, new int[] {999_998, 999_997}, 1);
        check(1, new int[] {0}, new int[] {1}, 1);                               // smallest target
        check(MAX_TARGET, new int[] {0}, new int[] {1}, 1);
        check(MAX_TARGET, new int[] {0, 999_999}, new int[] {MAX_SPEED, 1}, 1);  // ties at time 1
        check(MAX_TARGET, new int[] {0, 999_999}, new int[] {MAX_SPEED - 1, 1}, 2);
        check(MAX_TARGET, new int[] {0, 500_000}, new int[] {2, 1}, 1);          // 10^6/2 = 5*10^5/1
        check(MAX_TARGET, new int[] {1, 666_667}, new int[] {3, 1}, 1);          // 999,999/3 = 333,333/1
        check(10, new int[] {6, 8, 0, 3}, new int[] {3, 2, 5, 1}, 3);

        // Exhaustive tiny inputs against the exact event simulation
        for (int target = 1; target <= 6; target++) {
            for (int n = 1; n <= Math.min(3, target); n++) {
                exhaustive(target, n);
            }
        }

        // Random tiny inputs against the simulation, and against the pairwise rule
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 4_000; trial++) {
            int target = 1 + random.nextInt(30);
            int n = 1 + random.nextInt(Math.min(7, target));
            int[] position = distinctPositions(random, n, target);
            int[] speed = new int[n];
            for (int i = 0; i < n; i++) {
                speed[i] = 1 + random.nextInt(6);
            }
            int sim = simulate(target, position, speed);
            int rule = pairwiseRule(target, position, speed);
            if (sim != rule) {
                throw new IllegalStateException("references disagree on " + Arrays.toString(position) + Arrays.toString(speed));
            }
            check(target, position, speed, sim);
        }

        // Medium random inputs, including near-equal times at the extremes, against the pairwise rule
        for (int trial = 0; trial < 300; trial++) {
            int target = trial % 2 == 0 ? MAX_TARGET : 2_000 + random.nextInt(MAX_TARGET - 2_000);
            int n = 1 + random.nextInt(2_000);
            int[] position = distinctPositions(random, n, target);
            int[] speed = new int[n];
            for (int i = 0; i < n; i++) {
                int dist = target - position[i];
                speed[i] = switch (trial % 3) {
                    case 0 -> 1 + random.nextInt(MAX_SPEED);
                    case 1 -> clampSpeed(dist + random.nextInt(3) - 1);           // times all close to 1
                    default -> clampSpeed(dist / 2 + random.nextInt(3) - 1);      // times close to 2
                };
            }
            check(target, position, speed, pairwiseRule(target, position, speed));
        }

        // Largest inputs, n = 10^5
        int[] position = new int[N];
        int[] speed = new int[N];
        for (int i = 0; i < N; i++) {
            position[i] = i;
            speed[i] = MAX_TARGET - i;                                           // every car needs exactly 1 hour
        }
        check(MAX_TARGET, position, speed, 1);                                   // 10^5 ties at the target
        int[] same = new int[N];
        Arrays.fill(same, 1);
        check(MAX_TARGET, position, same, N);                                    // equal speeds: n fleets
        int[] reversed = new int[N];
        for (int i = 0; i < N; i++) {
            reversed[i] = N - 1 - i;                                             // input not in road order
        }
        check(N, reversed, same, N);                                             // smallest target allowing n cars
        int[] fast = new int[N];
        Arrays.fill(fast, MAX_SPEED);
        check(MAX_TARGET, position, fast, N);
        for (int trial = 0; trial < 4; trial++) {
            int[] p = distinctPositions(random, N, MAX_TARGET);
            int[] s = new int[N];
            for (int i = 0; i < N; i++) {
                s[i] = trial < 2 ? 1 + random.nextInt(MAX_SPEED) : clampSpeed(MAX_TARGET - p[i] + random.nextInt(3) - 1);
            }
            check(MAX_TARGET, p, s, suffixRule(MAX_TARGET, p, s));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static int clampSpeed(int s) {
        return Math.max(1, Math.min(MAX_SPEED, s));
    }

    static int[] distinctPositions(Random random, int n, int target) {
        int[] p = new int[n];
        if (n * 4 > target) {                                    // dense: shuffle 0..target-1 and take n
            int[] all = new int[target];
            for (int i = 0; i < target; i++) {
                all[i] = i;
            }
            for (int i = 0; i < n; i++) {
                int j = i + random.nextInt(target - i);
                int t = all[i];
                all[i] = all[j];
                all[j] = t;
                p[i] = all[i];
            }
            return p;
        }
        boolean[] used = new boolean[target];
        for (int i = 0; i < n; i++) {
            int x;
            do {
                x = random.nextInt(target);
            } while (used[x]);
            used[x] = true;
            p[i] = x;
        }
        return p;
    }

    /** Every assignment of n distinct positions (in increasing order) and speeds 1..4 for this target. */
    static void exhaustive(int target, int n) {
        int[] position = new int[n];
        int[] speed = new int[n];
        positions(target, n, 0, 0, position, speed);
    }

    static void positions(int target, int n, int index, int from, int[] position, int[] speed) {
        if (index == n) {
            speeds(target, n, 0, position, speed);
            return;
        }
        for (int p = from; p < target; p++) {
            position[index] = p;
            positions(target, n, index + 1, p + 1, position, speed);
        }
    }

    static void speeds(int target, int n, int index, int[] position, int[] speed) {
        if (index == n) {
            check(target, position.clone(), speed.clone(), simulate(target, position, speed));
            return;
        }
        for (int s = 1; s <= 4; s++) {
            speed[index] = s;
            speeds(target, n, index + 1, position, speed);
        }
    }

    /** Exact fraction num/den with den > 0. */
    record Frac(BigInteger num, BigInteger den) {
        static Frac of(long n) {
            return new Frac(BigInteger.valueOf(n), BigInteger.ONE);
        }

        Frac add(Frac o) {
            return norm(num.multiply(o.den).add(o.num.multiply(den)), den.multiply(o.den));
        }

        Frac sub(Frac o) {
            return norm(num.multiply(o.den).subtract(o.num.multiply(den)), den.multiply(o.den));
        }

        Frac mul(Frac o) {
            return norm(num.multiply(o.num), den.multiply(o.den));
        }

        Frac div(Frac o) {
            return o.num.signum() < 0 ? norm(num.multiply(o.den).negate(), den.multiply(o.num).negate())
                    : norm(num.multiply(o.den), den.multiply(o.num));
        }

        int cmp(Frac o) {
            return num.multiply(o.den).compareTo(o.num.multiply(den));
        }

        static Frac norm(BigInteger n, BigInteger d) {
            BigInteger g = n.gcd(d);
            return g.signum() == 0 ? new Frac(BigInteger.ZERO, BigInteger.ONE) : new Frac(n.divide(g), d.divide(g));
        }
    }

    /**
     * Event simulation. Fleets are kept in road order, front first. At each step the next event is either the
     * earliest meeting of two adjacent fleets at or before the target, or the front fleet reaching the target
     * (meetings first on a tie, so a meeting exactly at the target merges). All fleets advance to that moment,
     * fleets at the same position merge (the merged fleet keeps the slower, front speed), and fleets at the
     * target are counted and removed.
     */
    static int simulate(int target, int[] position, int[] speed) {
        int n = position.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) {
            order[i] = i;
        }
        Arrays.sort(order, (a, b) -> Integer.compare(position[b], position[a]));
        List<Frac> pos = new ArrayList<>();
        List<Frac> spd = new ArrayList<>();
        for (int i : order) {
            pos.add(Frac.of(position[i]));
            spd.add(Frac.of(speed[i]));
        }
        Frac goal = Frac.of(target);
        int arrived = 0;
        while (!pos.isEmpty()) {
            Frac dt = goal.sub(pos.get(0)).div(spd.get(0));                     // the front fleet arrives
            for (int k = 0; k + 1 < pos.size(); k++) {
                if (spd.get(k + 1).cmp(spd.get(k)) > 0) {
                    Frac meet = pos.get(k).sub(pos.get(k + 1)).div(spd.get(k + 1).sub(spd.get(k)));
                    Frac where = pos.get(k).add(spd.get(k).mul(meet));
                    if (where.cmp(goal) <= 0 && meet.cmp(dt) < 0) {
                        dt = meet;
                    }
                }
            }
            for (int k = 0; k < pos.size(); k++) {
                pos.set(k, pos.get(k).add(spd.get(k).mul(dt)));
                if (pos.get(k).cmp(goal) > 0) {
                    throw new IllegalStateException("simulation overshot the target");
                }
            }
            for (int k = pos.size() - 1; k >= 1; k--) {                         // merge fleets that met
                if (pos.get(k).cmp(pos.get(k - 1)) == 0) {
                    pos.remove(k);
                    spd.remove(k);
                }
            }
            while (!pos.isEmpty() && pos.get(0).cmp(goal) == 0) {
                pos.remove(0);
                spd.remove(0);
                arrived++;
            }
        }
        return arrived;
    }

    /** A car leads a fleet exactly when every car ahead of it has a strictly smaller own time. O(n^2). */
    static int pairwiseRule(int target, int[] position, int[] speed) {
        int fleets = 0;
        for (int i = 0; i < position.length; i++) {
            boolean leads = true;
            for (int j = 0; j < position.length && leads; j++) {
                // own time of j >= own time of i, cross-multiplied
                if (position[j] > position[i]
                        && (long) (target - position[j]) * speed[i] >= (long) (target - position[i]) * speed[j]) {
                    leads = false;
                }
            }
            if (leads) {
                fleets++;
            }
        }
        return fleets;
    }

    /** The same rule in suffix form: scan miles from the target down, keeping the largest own time seen, exactly. */
    static int suffixRule(int target, int[] position, int[] speed) {
        int[] carAt = new int[target];
        Arrays.fill(carAt, -1);
        for (int i = 0; i < position.length; i++) {
            carAt[position[i]] = i;
        }
        Frac latest = null;
        int fleets = 0;
        for (int p = target - 1; p >= 0; p--) {
            int i = carAt[p];
            if (i < 0) {
                continue;
            }
            Frac own = Frac.norm(BigInteger.valueOf(target - p), BigInteger.valueOf(speed[i]));
            if (latest == null || own.cmp(latest) > 0) {
                fleets++;
                latest = own;
            }
        }
        return fleets;
    }

    static void check(int target, int[] position, int[] speed, int expected) {
        int n = position.length;
        String label = "target=" + target + ", position=" + abbreviate(position) + ", speed=" + abbreviate(speed);
        // Guard against a wrong test: the constraints of the problem.
        if (n < 1 || n > N || speed.length != n || target < 1 || target > MAX_TARGET) {
            throw new IllegalStateException(label + ": bad test case, n or target out of range");
        }
        boolean[] seen = new boolean[target];
        for (int i = 0; i < n; i++) {
            if (position[i] < 0 || position[i] >= target || seen[position[i]]) {
                throw new IllegalStateException(label + ": bad test case, position out of range or repeated");
            }
            seen[position[i]] = true;
            if (speed[i] < 1 || speed[i] > MAX_SPEED) {
                throw new IllegalStateException(label + ": bad test case, speed out of range");
            }
        }
        int[] givenPosition = position.clone();
        int[] givenSpeed = speed.clone();
        int got = new Solution().carFleet(target, givenPosition, givenSpeed);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        if (!Arrays.equals(givenPosition, position) || !Arrays.equals(givenSpeed, speed)) {
            throw new AssertionError(label + ": the input arrays were modified");
        }
        cases++;
    }

    static String abbreviate(int[] a) {
        return a.length <= 8 ? Arrays.toString(a) : Arrays.toString(Arrays.copyOf(a, 8)) + "...(n=" + a.length + ")";
    }
}
