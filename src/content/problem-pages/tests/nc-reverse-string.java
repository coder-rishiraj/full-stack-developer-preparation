import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Reverse String page (run by `npm run problems:verify`).
 * The method returns nothing, so, like the judge, the test inspects the array it passed in.
 * The expected result is computed from a copy before the call, by an independent method
 * (StringBuilder.reverse).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check("hello");
        check("Hannah");
        check("abcde");
        check("abcd");

        // Edge cases listed in section 3 and traced in section 7
        check("a");                 // single character: nothing to swap
        check("ab");                // two characters: one swap
        check("abc");               // odd length: the middle stays put
        check("racecar");           // a palindrome: the result equals the input
        check("aaaa");
        check(" !~");               // printable ASCII extremes: space (32) and tilde (126)
        check("A b,C!");            // spaces and punctuation are characters like any other

        // Largest input: n = 10^5, even and odd
        check(randomString(new Random(1), 100_000));
        check(randomString(new Random(2), 99_999));

        // Random inputs checked against the independent reference
        Random random = new Random(20261113L);
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t < 2000 ? 12 : 2000);
            check(randomString(random, n));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String randomString(Random random, int n) {
        char[] c = new char[n];
        for (int i = 0; i < n; i++) {
            c[i] = (char) (32 + random.nextInt(95));   // printable ASCII: 32..126
        }
        return new String(c);
    }

    static void check(String input) {
        String label = input.length() > 40 ? "length " + input.length() : "\"" + input + "\"";
        // Guard against a wrong test: 1 <= n <= 10^5, printable ASCII only.
        if (input.length() < 1 || input.length() > 100_000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (char ch : input.toCharArray()) {
            if (ch < 32 || ch > 126) {
                throw new IllegalStateException(label + ": bad test case, non-printable character");
            }
        }
        char[] expected = new StringBuilder(input).reverse().toString().toCharArray();
        char[] s = input.toCharArray();
        new Solution().reverseString(s);
        if (!Arrays.equals(expected, s)) {
            throw new AssertionError(label + ": array after the call is \"" + new String(s) + "\", expected \"" + new String(expected) + "\"");
        }
        cases++;
    }
}
