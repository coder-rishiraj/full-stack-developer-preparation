import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Longest Common Prefix page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check("inter", "interview", "internet", "interval");
        check("team", "team", "teammate", "teamwork");

        // Edge cases listed in section 3 and traced in section 7
        check("abc", "abc");                        // one string
        check("", "abc", "");                       // empty string in the list
        check("", "", "abc");                       // empty reference string
        check("", "");                              // the only string is empty
        check("", "dog", "cat");                    // first characters differ
        check("flow", "flower", "flow");            // shorter string is not first
        check("fl", "flower", "flow", "flight");    // LeetCode's own example
        check("abc", "abc", "abc", "abc");          // all identical
        check("abc", "abc", "abcd");                // reference is the shortest
        check("a", "ab", "a", "ac");                // shortest string in the middle
        check("", "abc", "abd", "xbc");             // mismatch only in the last string

        // The example from the complexity discussion: 199 long strings of 'a', then "b"
        String[] skewed = new String[200];
        Arrays.fill(skewed, 0, 199, "a".repeat(200));
        skewed[199] = "b";
        check("", skewed);

        // Constraint extremes: 200 strings of 200 identical characters
        String[] full = new String[200];
        Arrays.fill(full, "z".repeat(200));
        check("z".repeat(200), full);
        // 200 strings of length 200 that differ only in the last character of the last string
        String[] lateMismatch = new String[200];
        Arrays.fill(lateMismatch, "q".repeat(200));
        lateMismatch[199] = "q".repeat(199) + "r";
        check("q".repeat(199), lateMismatch);

        // Random inputs checked against an independent brute force
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t < 2900 ? 8 : 200);
            String base = randomString(random, random.nextInt(12), 3);
            String[] strs = new String[n];
            for (int i = 0; i < n; i++) {
                int keep = random.nextInt(base.length() + 1);
                strs[i] = base.substring(0, keep) + randomString(random, random.nextInt(5), 3);
                if (random.nextInt(4) == 0) {
                    strs[i] = base; // make long common prefixes likely
                }
            }
            check(bruteForce(strs), strs);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String randomString(Random random, int length, int alphabet) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append((char) ('a' + random.nextInt(alphabet)));
        }
        return sb.toString();
    }

    /** Longest k such that every string starts with strs[0]'s first k characters, tried from longest down. */
    static String bruteForce(String[] strs) {
        for (int k = strs[0].length(); k >= 0; k--) {
            String candidate = strs[0].substring(0, k);
            boolean all = true;
            for (String s : strs) {
                if (!s.startsWith(candidate)) {
                    all = false;
                    break;
                }
            }
            if (all) {
                return candidate;
            }
        }
        throw new IllegalStateException("unreachable: the empty string is a prefix of everything");
    }

    static void check(String expected, String... strs) {
        String label = "strs=" + (strs.length <= 6 ? Arrays.toString(strs) : "(" + strs.length + " strings)");
        // Guard against a wrong test: the input must respect the problem's guarantees.
        if (strs.length < 1 || strs.length > 200) {
            throw new IllegalStateException(label + ": bad test case, 1 <= strs.length <= 200");
        }
        for (String s : strs) {
            if (s.length() > 200 || !s.chars().allMatch(ch -> ch >= 'a' && ch <= 'z')) {
                throw new IllegalStateException(label + ": bad test case, strings are 0..200 lowercase letters");
            }
        }
        if (!expected.equals(bruteForce(strs))) {
            throw new IllegalStateException(label + ": bad test case, expected value disagrees with brute force");
        }
        String[] before = strs.clone();
        String result = new Solution().longestCommonPrefix(strs);
        if (!expected.equals(result)) {
            throw new AssertionError(label + ": expected \"" + expected + "\" but got \"" + result + "\"");
        }
        if (!Arrays.equals(before, strs)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
