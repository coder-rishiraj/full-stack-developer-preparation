import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Palindrome Reorder page (run by `npm run problems:verify`).
 *
 * Any palindrome made of the input's letters is accepted, so a checker validates each answer instead
 * of comparing it with one expected string. Separately, every program on the page builds the smallest
 * such palindrome in alphabetical order (the page says so, and the Run panel's sample outputs rely on
 * it), so that is checked too, as a property of these programs rather than of the problem.
 *
 * The page's permutation search runs these tests too. It is recognised by its method
 * `firstPalindromicPermutation`. Each ordering it visits costs up to O(n), so it only gets the inputs
 * where (distinct orderings) * n is at most 3 * 10^7, the orderings being n! divided by the factorial
 * of each letter's count; the other inputs are skipped for it and counted in "skipped".
 */
class Tests {
    static int cases = 0;
    static int skipped = 0;
    static final boolean SEARCH = declares("firstPalindromicPermutation");

    public static void main(String[] args) throws Exception {
        // The checker itself must reject wrong answers before it is trusted.
        expectRejected("AAB", "AAB");                    // not a palindrome
        expectRejected("AAB", "ABA ABA");                // extra token
        expectRejected("AAB", "BAB");                    // different letters
        expectRejected("AAB", "AA");                     // a letter lost
        expectRejected("AAB", "NO SOLUTION");            // a palindrome exists
        expectRejected("AB", "ABA");                     // a letter added
        expectRejected("AB", "NO");                      // wrong wording
        expectRejected("AB", "");
        expectRejected("A", "a");

        // The example, which is also the dry-run input of every approach on the page.
        check("AAAACACBA");

        // The official CSES tests stored with the site (public/tests/cses/cses-palindrome-reorder.json).
        for (String s : new String[] {"AAAAAAAAAA", "ABABABABAB", "CBPPBFCFAA", "SQAADSDTQ", "MWNYFUIRUX",
                "CCA", "A", "AA", "ABZ", "AADDDCC", "AFFFBCACBZZTFUU", "ACCAB"}) {
            check(s);
        }

        // Edge cases from section 3 and the traces in section 7.
        for (String s : new String[] {"B", "AB", "ABC", "AAB", "BAA", "AAABB", "ABAB", "ZZZ", "ZA", "AABBC",
                "AABBCD", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZQ"}) {
            check(s);
        }
        checkRaw("AAAACACBA", "AAAACACBA");              // no final newline
        checkRaw("AAB\r\n", "AAB");                      // a Windows line ending

        // Random small strings: the existence rule against an exhaustive search in this file.
        Random random = new Random(20261116L);
        for (int t = 0; t < 1500; t++) {
            int n = 1 + random.nextInt(8);
            int letters = 1 + random.nextInt(t % 2 == 0 ? 3 : 26);
            char[] s = new char[n];
            for (int i = 0; i < n; i++) s[i] = (char) ('A' + random.nextInt(letters));
            String str = new String(s);
            if (byExhaustiveSearch(s) != (smallestPalindrome(str) != null)) {
                throw new AssertionError("the counting rule and the exhaustive search disagree on " + str);
            }
            check(str);
        }

        // Largest n = 10^6 (and one letter less) for the counting programs: random letters, every
        // count even (or one odd), two odd counts (NO SOLUTION), and a single letter repeated.
        int max = 1_000_000;
        check(repeat('A', max));
        check(randomPalindromeLetters(max, false, random));
        check(randomPalindromeLetters(max - 1, true, random));
        check(randomPalindromeLetters(max - 2, true, random) + "Z");   // two odd counts
        check(repeat('Z', max - 1) + "A");
        check("Q" + repeat('B', max - 1));

        expectInvalid("");
        expectInvalid("aB");
        expectInvalid("A B");
        expectInvalid(repeat('A', max + 1));

        if (SEARCH) System.out.println("permutation search: " + skipped + " inputs with too many orderings skipped");
        System.out.println("PASS " + cases + " cases");
    }

    static boolean declares(String name) {
        for (Method m : Main.class.getDeclaredMethods()) {
            if (m.getName().equals(name)) return true;
        }
        return false;
    }

    static String repeat(char c, int n) {
        char[] a = new char[n];
        Arrays.fill(a, c);
        return new String(a);
    }

    /** Random letters of the given length; every count even, except one odd count when the length is odd. */
    static String randomPalindromeLetters(int n, boolean shuffle, Random random) {
        char[] a = new char[n];
        for (int i = 0; i + 1 < n; i += 2) {
            char c = (char) ('A' + random.nextInt(26));
            a[i] = c;
            a[i + 1] = c;
        }
        if (n % 2 == 1) a[n - 1] = (char) ('A' + random.nextInt(26));
        if (shuffle) {
            for (int i = n - 1; i > 0; i--) {
                int j = random.nextInt(i + 1);
                char t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        return new String(a);
    }

    /** Whether some ordering of s is a palindrome, by trying every ordering (n <= 8). */
    static boolean byExhaustiveSearch(char[] s) {
        return permute(s.clone(), 0);
    }

    static boolean permute(char[] a, int k) {
        if (k == a.length) {
            for (int i = 0, j = a.length - 1; i < j; i++, j--) if (a[i] != a[j]) return false;
            return true;
        }
        for (int i = k; i < a.length; i++) {
            char t = a[k]; a[k] = a[i]; a[i] = t;
            boolean found = permute(a, k + 1);
            t = a[k]; a[k] = a[i]; a[i] = t;
            if (found) return true;
        }
        return false;
    }

    /** The alphabetically smallest palindrome of s's letters, or null if there is none. */
    static String smallestPalindrome(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'A']++;
        int odd = 0;
        StringBuilder half = new StringBuilder();
        String middle = "";
        for (int c = 0; c < 26; c++) {
            if (count[c] % 2 == 1) {
                odd++;
                middle = String.valueOf((char) ('A' + c));
            }
            for (int k = 0; k < count[c] / 2; k++) half.append((char) ('A' + c));
        }
        if (odd > 1) return null;
        return half + middle + new StringBuilder(half).reverse();
    }

    /** Null when output is a correct answer for s, otherwise the reason it is not. */
    static String validate(String s, String output) {
        String[] tokens = output.trim().split("\\s+");
        String answer = String.join(" ", tokens);
        boolean exists = smallestPalindrome(s) != null;
        if (answer.equals("NO SOLUTION")) return exists ? "printed NO SOLUTION, but a palindrome exists" : null;
        if (!exists) return "no palindrome exists, but it did not print NO SOLUTION";
        if (tokens.length != 1) return "expected one word";
        if (answer.length() != s.length()) return "length " + answer.length() + ", expected " + s.length();
        for (int i = 0, j = answer.length() - 1; i < j; i++, j--) {
            if (answer.charAt(i) != answer.charAt(j)) return "not a palindrome at positions " + i + " and " + j;
        }
        char[] a = answer.toCharArray();
        char[] b = s.toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        if (!Arrays.equals(a, b)) return "the letters differ from the input's";
        return null;
    }

    static void expectRejected(String s, String output) {
        if (validate(s, output) == null) throw new AssertionError("checker accepted a wrong answer for " + s + ": " + output);
    }

    static String invalid(String s) {
        if (s.length() < 1 || s.length() > 1_000_000) return "n must be in 1..10^6";
        for (char c : s.toCharArray()) {
            if (c < 'A' || c > 'Z') return "character '" + c + "' outside A..Z";
        }
        return null;
    }

    static void expectInvalid(String s) {
        if (invalid(s) == null) throw new AssertionError("the input guard accepted an invalid input");
    }

    static void check(String s) throws Exception {
        String problem = invalid(s);
        if (problem != null) throw new IllegalArgumentException("invalid test: " + problem);
        if (SEARCH && orderings(s) * s.length() > 30_000_000) {
            skipped++;
            return;
        }
        checkRaw(s + "\n", s);
    }

    /** The number of distinct orderings of s, n! / (product of count!), as a double (it can be huge). */
    static double orderings(String s) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'A']++;
        double logOrderings = logFactorial(s.length());
        for (int c : count) logOrderings -= logFactorial(c);
        return Math.exp(logOrderings);
    }

    static double logFactorial(int n) {
        double sum = 0;
        for (int k = 2; k <= n; k++) sum += Math.log(k);
        return sum;
    }

    static void checkRaw(String input, String s) throws Exception {
        String output = run(input);
        String shown = s.length() > 60 ? s.substring(0, 60) + "..." : s;
        String problem = validate(s, output);
        if (problem != null) {
            throw new AssertionError("input " + shown + ": " + problem + "\noutput: "
                    + (output.length() > 80 ? output.substring(0, 80) + "..." : output));
        }
        String smallest = smallestPalindrome(s);
        if (!output.trim().equals(smallest == null ? "NO SOLUTION" : smallest)) {
            throw new AssertionError("input " + shown + ": valid, but not the alphabetically smallest palindrome");
        }
        cases++;
    }

    static String run(String input) throws Exception {
        InputStream oldIn = System.in;
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.US_ASCII)));
            System.setOut(new PrintStream(buf, true, "US-ASCII"));
            Main.main(new String[0]);
        } finally {
            System.setIn(oldIn);
            System.setOut(oldOut);
        }
        return buf.toString("US-ASCII");
    }
}
