import java.util.Random;

/**
 * Tests for every "class Solution" on the Longest Repeating Character Replacement page
 * (run by `npm run problems:verify`). Each approach is compiled together with this file and
 * must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples in section 1 and the dry runs in section 4
        check("ABBAB", 1, 4);
        check("AAAB", 0, 3);
        check("AABC", 1, 3);                       // the stale-maxFreq dry run

        // Edge cases listed in section 3 and traced in section 7
        check("A", 0, 1);                          // shortest string, no replacements
        check("A", 1, 1);                          // k equal to the length
        check("ABCD", 0, 1);                       // all different, k = 0
        check("ABCD", 4, 4);                       // k = n: the whole string
        check("ABCD", 3, 4);                       // k = n - maxCount: still the whole string
        check("AAAA", 0, 4);                       // one letter only
        check("BAAAB", 0, 3);                      // k = 0: the longest run, in the middle
        check("ABBB", 0, 3);                       // the longest run at the end
        check("AABABBA", 1, 4);
        check("ABAB", 2, 4);
        check("ZZAZZ", 1, 5);                      // the last letter of the alphabet
        check("ABCABCAB", 2, 4);

        // Largest inputs: length 10^5
        int n = 100_000;
        check("A".repeat(n), 0, n);
        check("AB".repeat(n / 2), 0, 1);
        check("AB".repeat(n / 2), n, n);
        check("AB".repeat(n / 2), n / 2, n);       // exactly half the letters must change
        check("AB".repeat(n / 2), n / 2 - 1, n - 1);
        check("A".repeat(n - 1) + "B", 0, n - 1);
        check("B" + "A".repeat(n - 1), 1, n);
        Random random = new Random(39L);
        for (int r = 0; r < 6; r++) {
            int letters = r % 2 == 0 ? 26 : 2;
            String big = randomLetters(random, n, letters);
            int k = r < 2 ? 0 : random.nextInt(2000);
            check(big, k, byLengthCheck(big, k));
        }

        // Random inputs checked against an independent brute force
        for (int r = 0; r < 4000; r++) {
            int length = 1 + random.nextInt(14);
            int letters = 1 + random.nextInt(4);
            String s = randomLetters(random, length, letters);
            int k = random.nextInt(length + 1);
            check(s, k, bruteForce(s, k));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent check: every substring, counted from scratch. */
    static int bruteForce(String s, int k) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                int[] count = new int[26];
                int maxCount = 0;
                for (int p = i; p <= j; p++) {
                    maxCount = Math.max(maxCount, ++count[s.charAt(p) - 'A']);
                }
                if (j - i + 1 - maxCount <= k) {
                    best = Math.max(best, j - i + 1);
                }
            }
        }
        return best;
    }

    /** Independent check for large inputs: binary search on the length, testing every window of that length. */
    static int byLengthCheck(String s, int k) {
        int lo = 1;
        int hi = s.length();
        while (lo < hi) {
            int mid = lo + (hi - lo + 1) / 2;
            if (someWindowWorks(s, k, mid)) {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }
        return lo;
    }

    static boolean someWindowWorks(String s, int k, int length) {
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'A']++;
            if (i >= length) {
                count[s.charAt(i - length) - 'A']--;
            }
            if (i >= length - 1) {
                int maxCount = 0;
                for (int c : count) {
                    maxCount = Math.max(maxCount, c);
                }
                if (length - maxCount <= k) {
                    return true;
                }
            }
        }
        return false;
    }

    static String randomLetters(Random random, int length, int letters) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append((char) ('A' + random.nextInt(letters)));
        }
        return sb.toString();
    }

    static void check(String s, int k, int expected) {
        String label = s.length() <= 20 ? "s=\"" + s + "\", k=" + k : "s.length=" + s.length() + ", k=" + k;
        if (s.length() < 1 || s.length() > 100_000 || k < 0 || k > s.length()) {
            throw new IllegalStateException(label + ": bad test case, outside the constraints");
        }
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) < 'A' || s.charAt(i) > 'Z') {
                throw new IllegalStateException(label + ": bad test case, not an uppercase English letter");
            }
        }
        if (s.length() <= 60 && bruteForce(s, k) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        int result = new Solution().characterReplacement(s, k);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        cases++;
    }
}
