import java.util.Random;

/**
 * Tests for every "class Solution" on the Valid Parentheses page (run by `npm run problems:verify`).
 * Expected answers for small strings come from an independent reference: an interval DP over the
 * grammar "V -> empty | open V close V" (no stack). Large cases are valid or invalid by construction.
 */
class Tests {
    static int cases = 0;
    static final String ALPHABET = "()[]{}";

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check("()", true);
        check("()[]{}", true);
        check("(]", false);
        check("([)]", false);
        check("([])", true);
        check("([]{})", true);

        // Edge cases from sections 3, 7, 9 and 11
        check("]", false);
        check("](", false);
        check("((", false);
        check("(", false);
        check(")(", false);
        check("()()", true);
        check("{[()]}", true);
        check("{[(])}", false);
        check("[", false);
        check("}{", false);
        check("(((", false);
        check("([]", false);

        // Every string over the six characters up to length 6, against the DP reference
        for (int len = 1; len <= 6; len++) {
            int total = 1;
            for (int i = 0; i < len; i++) total *= 6;
            char[] c = new char[len];
            for (int code = 0; code < total; code++) {
                int x = code;
                for (int i = 0; i < len; i++) {
                    c[i] = ALPHABET.charAt(x % 6);
                    x /= 6;
                }
                String s = new String(c);
                check(s, reference(s));
            }
        }

        // Random strings, many of them valid or nearly valid, against the DP reference
        Random random = new Random(20261114L);
        for (int t = 0; t < 3000; t++) {
            String s;
            if (random.nextBoolean()) {
                s = randomValid(random, 1 + random.nextInt(10));
                if (random.nextInt(3) == 0) {
                    char[] c = s.toCharArray();
                    c[random.nextInt(c.length)] = ALPHABET.charAt(random.nextInt(6));
                    s = new String(c);
                }
            } else {
                char[] c = new char[1 + random.nextInt(20)];
                for (int i = 0; i < c.length; i++) c[i] = ALPHABET.charAt(random.nextInt(6));
                s = new String(c);
            }
            check(s, reference(s));
        }

        // Largest inputs, n = 10^4: valid or invalid by construction
        check("(".repeat(5000) + ")".repeat(5000), true);
        check("[".repeat(5000) + "]".repeat(4999) + ")", false);
        check("{".repeat(10_000), false);
        check("}".repeat(10_000), false);
        check("()".repeat(5000), true);
        check("([{".repeat(1666) + "}])".repeat(1666) + "[]{}", true);
        check("(".repeat(4999) + ")".repeat(5000), false);   // odd length 9999
        check(")" + "(".repeat(4999) + ")".repeat(4999) + "(", false);
        String nested = randomValid(random, 5000);
        check(nested, true);

        System.out.println("PASS " + cases + " cases");
    }

    /** A random valid string with the given number of pairs. */
    static String randomValid(Random random, int pairs) {
        StringBuilder sb = new StringBuilder();
        char[] pending = new char[pairs];
        int open = 0, used = 0;
        while (used < pairs || open > 0) {
            if (used < pairs && (open == 0 || random.nextBoolean())) {
                int k = random.nextInt(3);
                sb.append(ALPHABET.charAt(2 * k));
                pending[open++] = ALPHABET.charAt(2 * k + 1);
                used++;
            } else {
                sb.append(pending[--open]);
            }
        }
        return sb.toString();
    }

    static boolean matches(char a, char b) {
        return (a == '(' && b == ')') || (a == '[' && b == ']') || (a == '{' && b == '}');
    }

    /** ok[i][j]: s[i..j) is valid. V -> empty | open V close V, with the first opener's partner at k. */
    static boolean reference(String s) {
        int n = s.length();
        boolean[][] ok = new boolean[n + 1][n + 1];
        for (int i = 0; i <= n; i++) ok[i][i] = true;
        for (int len = 2; len <= n; len += 2) {
            for (int i = 0; i + len <= n; i++) {
                int j = i + len;
                for (int k = i + 1; k < j && !ok[i][j]; k += 2) {
                    if (matches(s.charAt(i), s.charAt(k)) && ok[i + 1][k] && ok[k + 1][j]) ok[i][j] = true;
                }
            }
        }
        return ok[0][n];
    }

    static void check(String s, boolean expected) {
        String label = s.length() > 40 ? "length " + s.length() : "\"" + s + "\"";
        if (s.length() < 1 || s.length() > 10_000) throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        for (char ch : s.toCharArray()) {
            if (ALPHABET.indexOf(ch) < 0) throw new IllegalStateException(label + ": bad test case, character outside ()[]{}");
        }
        if (s.length() <= 24 && reference(s) != expected) throw new IllegalStateException(label + ": bad test case, the stated answer is wrong");
        boolean got = new Solution().isValid(s);
        if (got != expected) throw new AssertionError(label + ": expected " + expected + " but got " + got);
        cases++;
    }
}
