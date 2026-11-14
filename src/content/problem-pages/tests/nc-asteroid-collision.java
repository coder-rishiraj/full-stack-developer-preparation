import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Asteroid Collision page (run by `npm run problems:verify`).
 * The reference is an independent simulation written here: repeatedly find the FIRST adjacent pair
 * "right-mover, then left-mover" in a list and resolve that one collision, until none is left.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from section 1 and the official examples
        check(new int[] {5, 10, -5}, new int[] {5, 10});
        check(new int[] {8, -8}, new int[] {});
        check(new int[] {10, 2, -5}, new int[] {10});
        check(new int[] {-2, -1, 1, 2}, new int[] {-2, -1, 1, 2});
        check(new int[] {3, 9, -4, 2, -7}, new int[] {3, 9});

        // Dry-run inputs used on the page
        check(new int[] {4, 7, -5, 1, -8, -3}, new int[] {-8, -3});
        check(new int[] {4, 7, -5, 1, -2}, new int[] {4, 7});

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {1, 2}, new int[] {1, 2});                        // smallest n, same direction
        check(new int[] {-1, -2}, new int[] {-1, -2});
        check(new int[] {-3, 4}, new int[] {-3, 4});                      // moving apart
        check(new int[] {4, -3}, new int[] {4});
        check(new int[] {3, -4}, new int[] {-4});
        check(new int[] {1, 2, 3, -4}, new int[] {-4});                   // one left-mover destroys a chain
        check(new int[] {1, 2, 3, -3}, new int[] {1, 2});                 // chain stops at an equal size
        check(new int[] {5, -1, -2, -3}, new int[] {5});                  // one right-mover destroys a chain
        check(new int[] {-2, -1, 1, -2}, new int[] {-2, -1, -2});         // survivor joins earlier left-movers
        check(new int[] {1, -1, 2, -2, 3, -3}, new int[] {});             // everything destroyed
        check(new int[] {2, 1, -1, -2}, new int[] {});

        // Constraint extremes: n = 10^4, sizes up to 1000
        int n = 10_000;
        int[] ones = new int[n];
        Arrays.fill(ones, 1);
        ones[n - 1] = -1000;                                              // 9,999 right-movers, then the big one
        check(ones, new int[] {-1000});
        int[] alternating = new int[n];
        for (int i = 0; i < n; i++) {
            alternating[i] = i % 2 == 0 ? 1000 : -1000;
        }
        check(alternating, new int[] {});
        int[] rights = new int[n];
        Arrays.fill(rights, 1000);
        check(rights, rights.clone());
        int[] lefts = new int[n];
        Arrays.fill(lefts, -1000);
        check(lefts, lefts.clone());
        int[] wall = new int[n];                                          // big right-mover absorbs everything
        wall[0] = 1000;
        for (int i = 1; i < n; i++) {
            wall[i] = -(1 + (i % 999));
        }
        check(wall, new int[] {1000});

        // Every array of length 2..7 over {-3, -2, -1, 1, 2, 3}
        int[] values = {-3, -2, -1, 1, 2, 3};
        for (int len = 2; len <= 7; len++) {
            int total = 1;
            for (int i = 0; i < len; i++) {
                total *= values.length;
            }
            for (int code = 0; code < total; code++) {
                int[] a = new int[len];
                int c = code;
                for (int i = 0; i < len; i++) {
                    a[i] = values[c % values.length];
                    c /= values.length;
                }
                check(a, reference(a));
            }
        }

        // Random inputs against the reference
        Random random = new Random(20261114L);
        for (int t = 0; t < 3000; t++) {
            int len = 2 + random.nextInt(80);
            int maxSize = random.nextBoolean() ? 5 : 1000;
            int[] a = new int[len];
            for (int i = 0; i < len; i++) {
                int size = 1 + random.nextInt(maxSize);
                a[i] = random.nextBoolean() ? size : -size;
            }
            check(a, reference(a));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: resolve the first adjacent colliding pair, one at a time. */
    static int[] reference(int[] a) {
        List<Integer> list = new ArrayList<>();
        for (int x : a) {
            list.add(x);
        }
        while (true) {
            int at = -1;
            for (int i = 0; i + 1 < list.size(); i++) {
                if (list.get(i) > 0 && list.get(i + 1) < 0) {
                    at = i;
                    break;
                }
            }
            if (at < 0) {
                break;
            }
            int right = list.get(at);
            int left = -list.get(at + 1);
            if (right > left) {
                list.remove(at + 1);
            } else if (right < left) {
                list.remove(at);
            } else {
                list.remove(at + 1);
                list.remove(at);
            }
        }
        int[] out = new int[list.size()];
        for (int i = 0; i < out.length; i++) {
            out[i] = list.get(i);
        }
        return out;
    }

    static void check(int[] a, int[] expected) {
        String label = Arrays.toString(a.length <= 12 ? a : Arrays.copyOf(a, 12)) + (a.length > 12 ? "..." : "");
        // Guard against a wrong test: 2 <= n <= 10^4, -1000 <= a[i] <= 1000, a[i] != 0.
        if (a.length < 2 || a.length > 10_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        for (int x : a) {
            if (x == 0 || x < -1000 || x > 1000) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        int[] given = a.clone();
        int[] got = new Solution().asteroidCollision(given);
        if (!Arrays.equals(got, expected)) {
            String shown = Arrays.toString(got.length <= 12 ? got : Arrays.copyOf(got, 12));
            throw new AssertionError(label + ": expected " + Arrays.toString(expected.length <= 12 ? expected : Arrays.copyOf(expected, 12))
                    + ", got " + shown);
        }
        if (!Arrays.equals(given, a)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
