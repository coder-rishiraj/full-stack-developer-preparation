import java.util.Random;

/**
 * Tests for every "class Solution" on the Permutation in String page (run by
 * `npm run problems:verify`). Each approach is compiled together with this file and must pass
 * all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples in section 1 and the dry runs in section 4
        check("ab", "cbad", true);
        check("aab", "abbab", false);
        check("abc", "cbxacb", true);              // the match is the last window

        // Edge cases listed in section 3 and traced in section 7
        check("abc", "ab", false);                 // s1 longer than s2
        check("a", "a", true);                     // shortest strings, equal
        check("a", "b", false);                    // shortest strings, different
        check("ab", "ab", true);                   // equal lengths, one window
        check("ab", "ba", true);
        check("ab", "ac", false);
        check("ab", "xab", true);                  // match ends at the last character
        check("ab", "abx", true);                  // match is the first window
        check("ab", "a", false);
        check("adc", "dcda", true);
        check("hello", "ooolleoooleh", false);
        check("zz", "azaz", false);                // the letters are there, but not adjacent
        check("zz", "azza", true);                 // the last letter of the alphabet
        check("abc", "aabbcc", false);
        check("c", "aacbca", true);                // breaks a careless match-counter update

        // Largest inputs: lengths 10^4
        int n = 10_000;
        check("a".repeat(n), "a".repeat(n), true);
        check("a".repeat(n), "a".repeat(n - 1) + "b", false);
        check("a".repeat(n - 1) + "b", "b" + "a".repeat(n - 1), true);
        check("ab", "c".repeat(n - 2) + "ba", true);
        check("ab", "c".repeat(n), false);
        check("a".repeat(5000) + "b", "a".repeat(n - 1) + "b", true);
        check("a".repeat(5000) + "b", "a".repeat(n), false);
        Random random = new Random(40L);
        for (int r = 0; r < 8; r++) {
            int m = r < 4 ? 1 + random.nextInt(30) : 1 + random.nextInt(n);
            String s1 = randomLetters(random, m, 26);
            String s2;
            if (r % 2 == 0) {
                // plant a shuffled copy of s1 at a random position
                int before = random.nextInt(n - m + 1);
                s2 = randomLetters(random, before, 26) + shuffle(s1, random) + randomLetters(random, n - m - before, 26);
            } else {
                s2 = randomLetters(random, n, 26);
            }
            check(s1, s2, sortedWindows(s1, s2));
        }

        // Random inputs checked against an independent brute force
        for (int r = 0; r < 4000; r++) {
            int letters = 1 + random.nextInt(3);
            String s1 = randomLetters(random, 1 + random.nextInt(5), letters);
            String s2 = randomLetters(random, 1 + random.nextInt(10), letters);
            check(s1, s2, bruteForce(s1, s2));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent check: for every window, remove the letters of s1 one by one. */
    static boolean bruteForce(String s1, String s2) {
        for (int start = 0; start + s1.length() <= s2.length(); start++) {
            StringBuilder rest = new StringBuilder(s2.substring(start, start + s1.length()));
            boolean ok = true;
            for (int i = 0; i < s1.length() && ok; i++) {
                int at = rest.indexOf(String.valueOf(s1.charAt(i)));
                if (at < 0) {
                    ok = false;
                } else {
                    rest.deleteCharAt(at);
                }
            }
            if (ok) {
                return true;
            }
        }
        return false;
    }

    /** Independent check for large inputs: compare sorted windows. */
    static boolean sortedWindows(String s1, String s2) {
        char[] target = s1.toCharArray();
        java.util.Arrays.sort(target);
        for (int start = 0; start + s1.length() <= s2.length(); start++) {
            char[] window = s2.substring(start, start + s1.length()).toCharArray();
            java.util.Arrays.sort(window);
            if (java.util.Arrays.equals(window, target)) {
                return true;
            }
        }
        return false;
    }

    static String randomLetters(Random random, int length, int letters) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append((char) ('a' + random.nextInt(letters)));
        }
        return sb.toString();
    }

    static String shuffle(String s, Random random) {
        char[] a = s.toCharArray();
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char c = a[i];
            a[i] = a[j];
            a[j] = c;
        }
        return new String(a);
    }

    static void validate(String label, String x) {
        if (x.length() < 1 || x.length() > 10_000) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (int i = 0; i < x.length(); i++) {
            if (x.charAt(i) < 'a' || x.charAt(i) > 'z') {
                throw new IllegalStateException(label + ": bad test case, not a lowercase English letter");
            }
        }
    }

    static void check(String s1, String s2, boolean expected) {
        String label = s1.length() <= 20 && s2.length() <= 20
                ? "s1=\"" + s1 + "\", s2=\"" + s2 + "\""
                : "s1.length=" + s1.length() + ", s2.length=" + s2.length();
        validate(label, s1);
        validate(label, s2);
        if (s2.length() <= 200 && bruteForce(s1, s2) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        boolean result = new Solution().checkInclusion(s1, s2);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        cases++;
    }
}
