import java.util.Random;

/**
 * Tests for every "class Solution" on the Valid Palindrome II page (run by `npm run problems:verify`).
 * Small inputs are checked against an independent brute force that literally deletes each index
 * (StringBuilder.deleteCharAt) and compares with the reverse. Every string over {a, b, c} of length
 * 1 to 9 is checked exhaustively. Large inputs have answers fixed by construction (explained at each).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check("aba", true);
        check("abca", true);
        check("abc", false);
        check("deeee", true);
        check("bba", true);                // only skipping the right character works
        check("abb", true);                // only skipping the left character works
        check("abbab", true);              // both one-character "peeks" match, only the right skip works
        check("abaab", true);              // both peeks match, only the left skip works
        check("cbbcc", true);
        check("abcda", false);             // dry run of the false case
        check("eccer", true);
        check("racecar", true);            // already a palindrome

        // Edge cases listed in section 3 and traced in section 7
        check("a", true);                  // one character
        check("ab", true);                 // delete either one
        check("aa", true);
        check("abcd", false);
        check("aabb", false);
        check("abab", true);
        check("ebcbbececabbacecbbcbe", true);

        // Exhaustive: every string over {a, b, c} of length 1..9
        char[] alphabet = {'a', 'b', 'c'};
        for (int n = 1; n <= 9; n++) {
            int total = (int) Math.pow(3, n);
            char[] c = new char[n];
            for (int code = 0; code < total; code++) {
                int x = code;
                for (int i = 0; i < n; i++) {
                    c[i] = alphabet[x % 3];
                    x /= 3;
                }
                String s = new String(c);
                check(s, brute(s));
            }
        }

        // Section 6 lower-bound family: (abc)^10 + reverse; one letter changed to z is false except at the middle two
        StringBuilder abc = new StringBuilder();
        for (int i = 0; i < 30; i++) abc.append("abc".charAt(i % 3));
        String lb = abc.toString() + abc.reverse().toString();
        check(lb, true);
        for (int p = 0; p < lb.length(); p++) {
            char[] c = lb.toCharArray();
            c[p] = 'z';
            check(new String(c), p == 29 || p == 30);
        }

        // Random longer inputs: near-palindromes with 0, 1 or 2 inserted characters
        Random random = new Random(20261113L);
        for (int t = 0; t < 2000; t++) {
            int half = random.nextInt(30);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < half; i++) sb.append((char) ('a' + random.nextInt(3)));
            String left = sb.toString();
            StringBuilder pal = new StringBuilder(left);
            if (random.nextBoolean()) pal.append((char) ('a' + random.nextInt(3)));
            pal.append(new StringBuilder(left).reverse());
            int inserts = random.nextInt(3);
            for (int k = 0; k < inserts; k++) pal.insert(random.nextInt(pal.length() + 1), (char) ('a' + random.nextInt(3)));
            if (pal.length() == 0) pal.append('a');
            String s = pal.toString();
            check(s, brute(s));
        }

        // Largest input: n = 10^5
        int m = 49_999;
        String as = "a".repeat(m);
        check("a".repeat(100_000), true);                         // already a palindrome
        check(as + "bc" + as, true);                              // delete the b or the c
        check("ab" + "a".repeat(99_996) + "cd", false);           // ends differ (a, d), and neither "b...d" nor "a...c" has equal ends
        check(as + "b" + as + "c", true);                         // delete the final c: a^m b a^m
        check("c" + as + "b" + as, true);                         // delete the first c
        check("cb" + "a".repeat(99_996) + "bd", false);           // c != d; deleting c gives b..d, deleting d gives c..b
        StringBuilder half = new StringBuilder();
        for (int i = 0; i < 50_000; i++) half.append((char) ('a' + i % 26));
        String h = half.toString();
        String r = new StringBuilder(h).reverse().toString();
        check(h + r, true);                                       // even palindrome
        // h + z + reverse(h without its last char): deleting h's last char leaves a palindrome centred on z
        check(h + "z" + r.substring(1), true);
        // two separated mismatches: change one char in each half of an even palindrome
        char[] two = (h + r).toCharArray();
        two[10] = 'z';
        two[99_000] = 'y';
        check(new String(two), false);   // pairs (10, 99989) and (999, 99000) both mismatch; confirmed once by an offline brute force
        System.out.println("PASS " + cases + " cases");
    }

    static boolean isPal(String t) {
        return t.equals(new StringBuilder(t).reverse().toString());
    }

    /** Independent brute force: no deletion, or delete each index in turn. O(n^2). */
    static boolean brute(String s) {
        if (isPal(s)) return true;
        for (int k = 0; k < s.length(); k++) {
            if (isPal(new StringBuilder(s).deleteCharAt(k).toString())) return true;
        }
        return false;
    }

    static void check(String s, boolean expected) {
        String label = s.length() > 40 ? "length " + s.length() : "\"" + s + "\"";
        // Guard against a wrong test: 1 <= n <= 10^5, lowercase English letters only.
        if (s.length() < 1 || s.length() > 100_000) {
            throw new IllegalStateException(label + ": bad test case, length outside the constraints");
        }
        for (char ch : s.toCharArray()) {
            if (ch < 'a' || ch > 'z') throw new IllegalStateException(label + ": bad test case, not a lowercase letter");
        }
        if (s.length() <= 2000 && brute(s) != expected) {
            throw new IllegalStateException(label + ": bad test case, the stated answer is wrong");
        }
        boolean got = new Solution().validPalindrome(s);
        if (got != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + got);
        }
        cases++;
    }
}
