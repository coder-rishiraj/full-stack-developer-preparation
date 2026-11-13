import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Remove Element page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 * The check mimics the judge: the returned k must be the number of elements not equal to val,
 * and the first k slots, sorted, must equal the expected kept elements, sorted. Slots from k on
 * are ignored.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new int[] {4, 1, 4, 2}, 4);
        check(new int[] {5, 3, 5, 5, 0, 3}, 5);
        check(new int[] {3, 2, 2, 3}, 3);
        check(new int[] {0, 1, 2, 2, 3, 0, 4, 2}, 2);
        check(new int[] {6, 7, 6, 8}, 6);

        // Edge cases listed in section 3 and traced in section 7
        check(new int[] {}, 0);                       // empty array
        check(new int[] {}, 100);                     // empty array, val at its upper limit
        check(new int[] {7, 7, 7}, 7);                // every element removed
        check(new int[] {1, 2, 3}, 9);                // nothing removed
        check(new int[] {1, 2, 3}, 100);              // val larger than any possible element
        check(new int[] {9}, 9);                      // single element, removed
        check(new int[] {9}, 1);                      // single element, kept
        check(new int[] {1, 2, 3, 4}, 4);             // val only at the end
        check(new int[] {4, 1, 2, 3}, 4);             // val only at the start
        check(new int[] {0, 0, 50, 0}, 0);            // val = 0 and the largest element value
        check(new int[] {50, 0, 50}, 50);
        check(new int[] {2, 3, 3}, 3);                // section 9/11: advancing after a replacement fails here
        check(new int[] {4, 4, 1}, 4);                // section 11: advancing after a shift fails here
        check(new int[] {1, 2, 3, 4, 5}, 1);          // val rare: write-count comparison in section 4

        // Largest input: n = 100
        int[] big = new int[100];
        for (int i = 0; i < big.length; i++) {
            big[i] = i % 51;
        }
        check(big, 0);
        check(big, 50);
        int[] allSame = new int[100];
        Arrays.fill(allSame, 50);
        check(allSame, 50);
        check(allSame, 49);

        // Random inputs checked against an independent brute force
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int n = random.nextInt(t < 2000 ? 12 : 101);
            int range = 1 + random.nextInt(51);       // small ranges make val frequent
            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = random.nextInt(range);
            }
            int val = random.nextInt(4) == 0 ? random.nextInt(101) : random.nextInt(range);
            check(nums, val);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int[] nums, int val) {
        String label = Arrays.toString(nums) + ", val=" + val;
        // Guard against a wrong test: 0 <= n <= 100, 0 <= nums[i] <= 50, 0 <= val <= 100.
        if (nums.length > 100 || val < 0 || val > 100) {
            throw new IllegalStateException(label + ": bad test case, outside the constraints");
        }
        for (int x : nums) {
            if (x < 0 || x > 50) {
                throw new IllegalStateException(label + ": bad test case, value " + x + " out of range");
            }
        }
        // Independent brute force: the elements that are not val.
        int[] kept = Arrays.stream(nums).filter(x -> x != val).toArray();
        int k = new Solution().removeElement(nums, val);
        if (k != kept.length) {
            throw new AssertionError(label + ": expected k=" + kept.length + " but got " + k);
        }
        int[] firstK = Arrays.copyOf(nums, k);
        Arrays.sort(firstK);
        Arrays.sort(kept);
        if (!Arrays.equals(kept, firstK)) {
            throw new AssertionError(label + ": first k slots hold " + Arrays.toString(firstK) + " but should hold " + Arrays.toString(kept) + " in any order");
        }
        cases++;
    }
}
