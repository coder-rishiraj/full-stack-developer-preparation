import java.util.Random;

/**
 * Tests for every "class Solution" on the Valid Palindrome page (run by `npm run problems:verify`).
 * Expected answers come from an independent reference: keep only ASCII letters and digits
 * (checked by explicit ranges, not Character.isLetterOrDigit), lower-case the letters, and compare
 * the result with its reverse.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check("A man, a plan, a canal: Panama", true);
        check("race a car", false);
        check(" ", true);
        check("No 'x' in Nixon", true);
        check("ab_a", true);
        check("Ab,c!", false);

        // Edge cases listed in section 3 and traced in section 7
        check(".,", true);                 // only punctuation: empty after filtering
        check("!!!???", true);
        check("a", true);                  // one character
        check("a.", true);                 // punctuation only on one side
        check(".a", true);
        check("0P", false);                // a digit and a letter: lower-casing must not merge them
        check("1b1", true);
        check("1a2", false);
        check("Aa", true);                 // case-insensitive
        check("aA,", true);
        check("ab", false);
        check("`a{", true);                // '`' and '{' sit next to 'a'..'z' in ASCII but are not letters
        check("@A[", true);                // '@' and '[' sit next to 'A'..'Z'
        check("/0:", true);                // '/' and ':' sit next to '0'..'9'
        check("a`A", true);

        // Largest input: n = 2 * 10^5
        StringBuilder big = new StringBuilder();
        for (int i = 0; i < 100_000; i++) big.append((char) ('a' + i % 26));
        String half = big.toString();
        String pal = half + new StringBuilder(half).reverse().toString().toUpperCase();
        check(pal, true);
        check(pal.substring(0, 199_999) + "z", false);
        check(" ".repeat(200_000), true);
        check(",".repeat(199_999) + "Q", true);

        // Random inputs checked against the independent reference, many of them near-palindromes
        Random random = new Random(20261113L);
        for (int t = 0; t < 5000; t++) {
            int n = 1 + random.nextInt(t < 4000 ? 12 : 3000);
            String s = random.nextBoolean() ? randomString(random, n) : noisyPalindrome(random, n);
            check(s, reference(s));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String randomString(Random random, int n) {
        char[] c = new char[n];
        String small = "aAbB0 ,.:";
        for (int i = 0; i < n; i++) {
            c[i] = random.nextInt(3) == 0 ? (char) (32 + random.nextInt(95)) : small.charAt(random.nextInt(small.length()));
        }
        return new String(c);
    }

    /** A palindrome over a few letters and digits, with random case flips, punctuation, and sometimes one change. */
    static String noisyPalindrome(Random random, int n) {
        String alpha = "abcAB01";
        char[] half = new char[(n + 1) / 2];
        for (int i = 0; i < half.length; i++) half[i] = alpha.charAt(random.nextInt(alpha.length()));
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            char ch = half[Math.min(i, n - 1 - i)];
            if (Character.isLetter(ch) && random.nextBoolean()) ch = Character.isUpperCase(ch) ? Character.toLowerCase(ch) : Character.toUpperCase(ch);
            if (random.nextInt(4) == 0) sb.append(" ,.:'!?_`[@/".charAt(random.nextInt(12)));
            sb.append(ch);
        }
        if (random.nextInt(3) == 0 && sb.length() > 0) sb.setCharAt(random.nextInt(sb.length()), alpha.charAt(random.nextInt(alpha.length())));
        String s = sb.toString();
        return s.length() > 200_000 ? s.substring(0, 200_000) : s;
    }

    static boolean isAsciiAlnum(char c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
    }

    static boolean reference(String s) {
        StringBuilder kept = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (isAsciiAlnum(c)) kept.append(c >= 'A' && c <= 'Z' ? (char) (c - 'A' + 'a') : c);
        }
        return kept.toString().equals(kept.reverse().toString());
    }

    static void check(String s, boolean expected) {
        String label = s.length() > 40 ? "length " + s.length() : "\"" + s + "\"";
        // Guard against a wrong test: 1 <= n <= 2 * 10^5, printable ASCII only.
        if (s.length() < 1 || s.length() > 200_000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (char ch : s.toCharArray()) {
            if (ch < 32 || ch > 126) throw new IllegalStateException(label + ": bad test case, non-printable character");
        }
        if (reference(s) != expected) {
            throw new IllegalStateException(label + ": bad test case, the stated answer is wrong");
        }
        boolean got = new Solution().isPalindrome(s);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + got);
        }
        cases++;
    }
}
