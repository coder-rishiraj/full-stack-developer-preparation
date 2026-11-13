import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the First Missing Positive page (run by `npm run problems:verify`).
 * The solutions may modify nums (the interviewer allowed it), so every expected answer is
 * computed from a copy before the solution runs, and the input is not checked afterwards.
 */
class Tests {
    static int cases = 0;
    static final int MIN = Integer.MIN_VALUE;
    static final int MAX = Integer.MAX_VALUE;

    public static void main(String[] args) {
        // Examples and dry runs on the page, plus the official examples
        check(new int[] {5, 3, -2, 1, 2}, 4);
        check(new int[] {8, 9, 10}, 1);
        check(new int[] {1, 2, 0}, 3);
        check(new int[] {3, 4, -1, 1}, 2);             // the `if` instead of `while` bug returns 1
        check(new int[] {7, 8, 9, 11, 12}, 1);

        // Edge cases from sections 3, 7 and 11
        check(new int[] {1}, 2);
        check(new int[] {2}, 1);
        check(new int[] {-5}, 1);
        check(new int[] {-2}, 1);                      // sign marking without cleanup returns 2
        check(new int[] {0}, 1);
        check(new int[] {1, 1}, 2);                    // `nums[i] != i + 1` loops forever here
        check(new int[] {2, 2}, 1);                    // ... and here
        check(new int[] {2, 1}, 3);                    // permutation: n + 1
        check(new int[] {-1, 3, 1}, 2);                // the `if` bug returns 1
        check(new int[] {0, -1, -7}, 1);               // all non-positive
        check(new int[] {1, 1, 1, 1}, 2);
        check(new int[] {3, 3, 3, 1, 2}, 4);
        check(new int[] {MAX, MIN, 1}, 2);             // extremes
        check(new int[] {MIN}, 1);
        check(new int[] {MAX}, 1);
        check(new int[] {MIN, MAX, MIN, MAX}, 1);
        check(new int[] {1, MAX, 2, MIN, 3}, 4);
        check(new int[] {2, 3, 4, 5, 1}, 6);           // one long swap cycle
        check(new int[] {5, 4, 3, 2, 1}, 6);

        // Largest n = 10^5
        int n = 100_000;
        Random random = new Random(20261113L);
        int[] perm = new int[n];
        for (int i = 0; i < n; i++) {
            perm[i] = i + 1;
        }
        shuffle(perm, random);
        check(perm.clone(), n + 1);                    // shuffled permutation of 1..n
        int[] holed = perm.clone();
        for (int i = 0; i < n; i++) {
            if (holed[i] == 77_777) {
                holed[i] = MIN;                        // remove 77,777
            }
        }
        check(holed, 77_777);
        int[] reversed = new int[n];
        for (int i = 0; i < n; i++) {
            reversed[i] = n - i;
        }
        check(reversed, n + 1);
        int[] rotated = new int[n];
        for (int i = 0; i < n; i++) {
            rotated[i] = (i + 1) % n + 1;              // 2, 3, ..., n, 1: one cycle of length n
        }
        check(rotated, n + 1);
        int[] allMin = new int[n];
        Arrays.fill(allMin, MIN);
        check(allMin, 1);
        int[] allMax = new int[n];
        Arrays.fill(allMax, MAX);
        check(allMax, 1);
        int[] allOnes = new int[n];
        Arrays.fill(allOnes, 1);
        check(allOnes, 2);
        int[] negatives = new int[n];
        for (int i = 0; i < n; i++) {
            negatives[i] = -i;
        }
        check(negatives, 1);
        int[] dupHalf = new int[n];
        for (int i = 0; i < n; i++) {
            dupHalf[i] = i / 2 + 1;                    // 1, 1, 2, 2, ..., 50000, 50000
        }
        shuffle(dupHalf, random);
        check(dupHalf, n / 2 + 1);
        int[] bigRandom = new int[n];
        for (int i = 0; i < n; i++) {
            int r = random.nextInt(4);
            bigRandom[i] = r == 0 ? random.nextInt() : r == 1 ? MIN + random.nextInt(3) : 1 + random.nextInt(n);
        }
        check(bigRandom, sortReference(bigRandom.clone()));

        // Small random inputs against an independent brute force
        for (int t = 0; t < 5000; t++) {
            int len = 1 + random.nextInt(t < 4500 ? 10 : 300);
            int[] nums = new int[len];
            for (int i = 0; i < len; i++) {
                int r = random.nextInt(10);
                nums[i] = r == 0 ? MIN : r == 1 ? MAX : r == 2 ? random.nextInt() : random.nextInt(len + 3) - 1;
            }
            check(nums, bruteForce(nums));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void shuffle(int[] a, Random random) {
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
    }

    /** Independent reference: try k = 1, 2, ... and scan for each. Does not modify nums. */
    static int bruteForce(int[] nums) {
        for (int k = 1; ; k++) {
            boolean found = false;
            for (int x : nums) {
                if (x == k) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return k;
            }
        }
    }

    /** Reference for large inputs: sort a copy and walk up in long arithmetic. */
    static int sortReference(int[] copy) {
        Arrays.sort(copy);
        long expected = 1;
        for (int x : copy) {
            if (x == expected) {
                expected++;
            } else if (x > expected) {
                break;
            }
        }
        return Math.toIntExact(expected);
    }

    static void check(int[] nums, int expected) {
        String label = "n=" + nums.length + (nums.length <= 20 ? " " + Arrays.toString(nums) : "");
        // Guard: 1 <= n <= 10^5 (any int value is allowed), and the expected answer is right,
        // checked on a copy before the solution is allowed to modify nums.
        if (nums.length < 1 || nums.length > 100_000) {
            throw new IllegalStateException(label + ": bad test case, n out of range");
        }
        int reference = nums.length <= 2_000 ? bruteForce(nums) : sortReference(nums.clone());
        if (reference != expected) {
            throw new IllegalStateException(label + ": bad test case, expected " + expected + " but reference says " + reference);
        }
        int result = new Solution().firstMissingPositive(nums);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + ", got " + result);
        }
        cases++;
    }
}
