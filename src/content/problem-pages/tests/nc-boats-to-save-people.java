import java.util.Arrays;
import java.util.Random;
import java.util.TreeMap;

/**
 * Tests for every "class Solution" on the Boats to Save People page (run by `npm run problems:verify`).
 * References, independent of the code under test:
 *  - exhaustive search over all pairings (n <= 10);
 *  - a "best fit" greedy with a TreeMap (heaviest person with the heaviest partner that fits),
 *    itself cross-checked against the exhaustive search on every small input.
 * Each call gets a fresh copy, since the solutions may reorder the array.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry-run inputs used on the page
        check(new int[] {1, 2, 2, 3}, 3, 3);
        check(new int[] {4, 1, 3, 2}, 5, 2);
        check(new int[] {1, 2, 3, 4}, 5, 2);                      // pairing the two lightest gives 3

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {5}, 5, 1);                               // n = 1, cannot pair with itself
        check(new int[] {2}, 5, 1);                               // n = 1, 2 + 2 <= 5 at i == j
        check(new int[] {3, 3, 3}, 3, 3);                         // everyone weighs limit
        check(new int[] {1, 1, 1, 1, 1}, 30000, 3);               // everyone pairs, odd n
        check(new int[] {1, 1}, 1, 2);                            // limit = 1
        check(new int[] {1}, 1, 1);
        check(new int[] {1, 1, 1, 1}, 2, 2);                      // section 6 lower-bound example
        check(new int[] {1, 1, 1, 2}, 2, 3);
        check(new int[] {15000, 15000}, 30000, 1);                // pair exactly at the limit, max limit

        // Every multiset of size 1..7 with weights in 1..limit, for limit 1..7
        for (int limit = 1; limit <= 7; limit++) {
            for (int n = 1; n <= 7; n++) {
                enumerate(new int[n], 0, 1, limit);
            }
        }

        // Constraint extremes: n = 5 * 10^4, limit = 3 * 10^4
        int n = 50000;
        int[] heavy = new int[n];
        Arrays.fill(heavy, 30000);
        check(heavy, 30000, 50000);                               // nobody pairs
        int[] light = new int[n];
        Arrays.fill(light, 1);
        check(light, 30000, 25000);                               // everyone pairs
        int[] half = new int[n];
        Arrays.fill(half, 15000);
        check(half, 30000, 25000);                                // pairs exactly at the limit
        int[] halfPlus = new int[n];
        Arrays.fill(halfPlus, 15001);
        check(halfPlus, 30000, 50000);                            // just over half: nobody pairs
        int[] ramp = new int[n];
        for (int i = 0; i < n; i++) {
            ramp[i] = 1 + i % 30000;
        }
        check(ramp, 30000, -1);
        check(new int[] {30000}, 30000, 1);

        // Random small inputs (vs exhaustive search) and large inputs (vs best fit)
        Random random = new Random(20261113L);
        for (int t = 0; t < 4000; t++) {
            int len = 1 + random.nextInt(10);
            int limit = 1 + random.nextInt(t % 2 == 0 ? 12 : 30000);
            int[] people = new int[len];
            for (int i = 0; i < len; i++) {
                people[i] = 1 + random.nextInt(limit);
            }
            check(people, limit, -1);
        }
        for (int t = 0; t < 200; t++) {
            int len = 1 + random.nextInt(t < 20 ? 50000 : 2000);
            int limit = 1 + random.nextInt(30000);
            int[] people = new int[len];
            for (int i = 0; i < len; i++) {
                people[i] = 1 + random.nextInt(limit);
            }
            check(people, limit, -1);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Non-decreasing sequences only: each multiset once. */
    static void enumerate(int[] people, int pos, int min, int limit) {
        if (pos == people.length) {
            check(people.clone(), limit, -1);
            return;
        }
        for (int w = min; w <= limit; w++) {
            people[pos] = w;
            enumerate(people, pos + 1, w, limit);
        }
    }

    /** Minimum boats by trying every pairing: the first unseated person goes alone or with any later one who fits. */
    static int exhaustive(int[] people, int limit, boolean[] seated) {
        int first = -1;
        for (int i = 0; i < people.length; i++) {
            if (!seated[i]) {
                first = i;
                break;
            }
        }
        if (first == -1) {
            return 0;
        }
        seated[first] = true;
        int best = 1 + exhaustive(people, limit, seated);
        for (int j = first + 1; j < people.length; j++) {
            if (!seated[j] && people[first] + people[j] <= limit) {
                seated[j] = true;
                best = Math.min(best, 1 + exhaustive(people, limit, seated));
                seated[j] = false;
            }
        }
        seated[first] = false;
        return best;
    }

    /** Heaviest waiting person with the heaviest waiting partner that fits. */
    static int bestFit(int[] people, int limit) {
        TreeMap<Integer, Integer> waiting = new TreeMap<>();
        for (int w : people) {
            waiting.merge(w, 1, Integer::sum);
        }
        int boats = 0;
        while (!waiting.isEmpty()) {
            int h = waiting.lastKey();
            remove(waiting, h);
            Integer partner = waiting.floorKey(limit - h);
            if (partner != null) {
                remove(waiting, partner);
            }
            boats++;
        }
        return boats;
    }

    static void remove(TreeMap<Integer, Integer> map, int key) {
        if (map.merge(key, -1, Integer::sum) == 0) {
            map.remove(key);
        }
    }

    static void check(int[] people, int limit, int stated) {
        String label = "limit=" + limit + " n=" + people.length + " "
                + Arrays.toString(people.length <= 10 ? people : Arrays.copyOf(people, 10)) + (people.length > 10 ? "..." : "");
        // Guard against a wrong test: 1 <= n <= 5*10^4, 1 <= people[i] <= limit <= 3*10^4.
        if (people.length < 1 || people.length > 50000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        if (limit < 1 || limit > 30000) {
            throw new IllegalStateException(label + ": bad test case, limit out of range");
        }
        for (int w : people) {
            if (w < 1 || w > limit) {
                throw new IllegalStateException(label + ": bad test case, weight " + w + " outside [1, limit]");
            }
        }
        int expected = bestFit(people, limit);
        if (people.length <= 10) {
            int brute = exhaustive(people, limit, new boolean[people.length]);
            if (brute != expected) {
                throw new IllegalStateException(label + ": references disagree, exhaustive " + brute + " vs best fit " + expected);
            }
        }
        if (stated >= 0 && stated != expected) {
            throw new IllegalStateException(label + ": the answer written on the page is wrong (" + stated + " vs " + expected + ")");
        }
        int got = new Solution().numRescueBoats(people.clone(), limit);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        cases++;
    }
}
