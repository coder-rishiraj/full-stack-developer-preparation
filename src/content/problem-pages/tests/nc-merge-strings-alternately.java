import java.util.Random;

/**
 * Tests for every "class Solution" on the Merge Strings Alternately page (run by `npm run problems:verify`).
 * Each solution is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check("ace", "bdfgh", "abcdefgh");
        check("wxyz", "ab", "waxbyz");
        // LeetCode's examples
        check("abc", "pqr", "apbqcr");
        check("ab", "pqrs", "apbqrs");
        check("abcd", "pq", "apbqcd");

        // Edge cases from sections 3 and 7
        check("abc", "xyz", "axbycz");   // equal lengths
        check("a", "bcd", "abcd");       // length 1 against longer
        check("bcd", "a", "bacd");       // word1 longer, word2 length 1
        check("a", "b", "ab");           // both length 1

        // Constraint extremes: lengths 100 and 1
        String a100 = repeat('a', 100);
        String z100 = repeat('z', 100);
        check(a100, z100, null);
        check(a100, "q", null);
        check("q", z100, null);

        // Random inputs against an independent reference
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            String w1 = randomWord(random, 1 + random.nextInt(t < 2000 ? 8 : 100));
            String w2 = randomWord(random, 1 + random.nextInt(t < 2000 ? 8 : 100));
            check(w1, w2, null);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String repeat(char c, int n) {
        char[] chars = new char[n];
        java.util.Arrays.fill(chars, c);
        return new String(chars);
    }

    static String randomWord(Random random, int n) {
        char[] chars = new char[n];
        for (int i = 0; i < n; i++) chars[i] = (char) ('a' + random.nextInt(26));
        return new String(chars);
    }

    /** Independent reference: two separate positions, alternate turns, then drain. */
    static String reference(String w1, String w2) {
        char[] out = new char[w1.length() + w2.length()];
        int p = 0, q = 0, k = 0;
        boolean turn1 = true;
        while (p < w1.length() || q < w2.length()) {
            if (turn1 && p < w1.length()) out[k++] = w1.charAt(p++);
            else if (!turn1 && q < w2.length()) out[k++] = w2.charAt(q++);
            turn1 = !turn1;
        }
        return new String(out);
    }

    static void check(String w1, String w2, String expected) {
        String label = "\"" + w1 + "\", \"" + w2 + "\"";
        if (w1.length() < 1 || w1.length() > 100 || w2.length() < 1 || w2.length() > 100
                || !w1.matches("[a-z]+") || !w2.matches("[a-z]+")) {
            throw new IllegalStateException(label + ": bad test case, outside the constraints");
        }
        String ref = reference(w1, w2);
        if (expected != null && !expected.equals(ref)) {
            throw new IllegalStateException(label + ": reference disagrees with the stated answer");
        }
        String got = new Solution().mergeAlternately(w1, w2);
        if (!ref.equals(got)) {
            throw new AssertionError(label + ": expected " + ref + " but got " + got);
        }
        cases++;
    }
}
