import java.util.Random;

/**
 * Tests for every "class Solution" on the Longest Substring Without Repeating Characters page
 * (run by `npm run problems:verify`). Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs
        check("abcbdea", 5);
        check("aaaa", 1);

        // Edge cases from sections 2, 3, 7, 9 and 11
        check("", 0);
        check(" ", 1);
        check("a", 1);
        check("abcdef", 6);
        check("abba", 2);
        check("dvdf", 3);
        check("aabbcc", 2);
        check("aa", 1);
        check("a b", 3);
        check("a  b", 2);
        check("aA", 2);                                  // case-sensitive
        check("pwwkew", 3);
        check("tmmzuxt", 5);

        // Every printable ASCII character once: the longest possible answer (95)
        StringBuilder all = new StringBuilder();
        for (char c = 32; c < 127; c++) {
            all.append(c);
        }
        check(all.toString(), 95);

        // Largest inputs, n = 10^5
        int n = 100_000;
        StringBuilder cycle = new StringBuilder();
        for (int i = 0; i < n; i++) {
            cycle.append((char) (32 + i % 95));
        }
        check(cycle.toString(), 95);
        check("x".repeat(n), 1);
        StringBuilder randomBig = new StringBuilder();
        Random big = new Random(5L);
        for (int i = 0; i < n; i++) {
            randomBig.append((char) (32 + big.nextInt(95)));
        }
        check(randomBig.toString(), reference(randomBig.toString()));

        // Random inputs against an independent reference
        Random random = new Random(20261114L);
        for (int r = 0; r < 4000; r++) {
            int length = random.nextInt(25);
            int alphabet = 1 + random.nextInt(r % 3 == 0 ? 95 : 6);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < length; i++) {
                sb.append((char) (32 + random.nextInt(alphabet)));
            }
            check(sb.toString(), reference(sb.toString()));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Checks every substring directly (independent of the page's approaches); fine for short strings. */
    static int reference(String s) {
        if (s.length() > 1000) {
            return referenceLinear(s);
        }
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                boolean ok = true;
                for (int a = i; a <= j && ok; a++) {
                    for (int b = a + 1; b <= j; b++) {
                        if (s.charAt(a) == s.charAt(b)) {
                            ok = false;
                            break;
                        }
                    }
                }
                if (ok) {
                    best = Math.max(best, j - i + 1);
                }
            }
        }
        return best;
    }

    /** Count-based shrinking window, used only for long strings. */
    static int referenceLinear(String s) {
        int[] count = new int[128];
        int best = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            count[s.charAt(right)]++;
            while (count[s.charAt(right)] > 1) {
                count[s.charAt(left)]--;
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    static void check(String s, int expected) {
        String label = "length=" + s.length() + (s.length() <= 40 ? " \"" + s + "\"" : "");
        if (s.length() > 100_000) {
            throw new IllegalStateException(label + ": bad test case, too long");
        }
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c < 32 || c > 126) {
                throw new IllegalStateException(label + ": bad test case, not a letter, digit, symbol or space");
            }
        }
        if (s.length() <= 300 && reference(s) != referenceLinear(s)) {
            throw new IllegalStateException(label + ": references disagree");
        }
        if (referenceLinear(s) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        int result = new Solution().lengthOfLongestSubstring(s);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        cases++;
    }
}
