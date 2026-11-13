import java.util.Random;

/**
 * Tests for every "class Solution" on the Valid Anagram page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check("stale", "least", true);
        check("aab", "abb", false);

        // Edge cases listed in section 3 and traced in section 7
        check("ab", "abc", false);                   // different lengths
        check("abc", "ab", false);                   // different lengths, the other way round
        check("a", "aa", false);                     // one is a prefix of the other
        check("a", "a", true);                       // shortest strings, equal
        check("a", "b", false);                      // shortest strings, different
        check("night", "night", true);               // identical strings
        check("abcd", "abce", false);                // same length, one letter differs
        check("zzza", "azzz", true);                 // the last letter of the alphabet
        check("aabbcc", "abcabc", true);             // repeated letters
        check("aaab", "abbb", false);                // same letters, different counts

        // Largest inputs: length 5 * 10^4
        int n = 50_000;
        check("a".repeat(n), "a".repeat(n), true);
        check("a".repeat(n), "a".repeat(n - 1) + "b", false);
        Random random = new Random(11L);
        String big = randomLetters(random, n, 26);
        check(big, shuffle(big, random), true);
        char last = big.charAt(n - 1);
        String oneLetterChanged = big.substring(0, n - 1) + (last == 'z' ? 'y' : 'z');
        check(big, shuffle(oneLetterChanged, random), false);   // same length, one count off by one
        check(big, big.substring(1), false);

        // Random inputs checked against an independent brute force
        for (int r = 0; r < 3000; r++) {
            int length = 1 + random.nextInt(10);
            int letters = 1 + random.nextInt(4);           // few letters make anagrams likely
            String s = randomLetters(random, length, letters);
            String t;
            int kind = random.nextInt(3);
            if (kind == 0) {
                t = shuffle(s, random);
            } else if (kind == 1) {
                t = randomLetters(random, length, letters);
            } else {
                t = randomLetters(random, 1 + random.nextInt(10), letters);
            }
            check(s, t, bruteForce(s, t));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent check: repeatedly remove one matching letter of t for each letter of s. */
    static boolean bruteForce(String s, String t) {
        StringBuilder rest = new StringBuilder(t);
        for (int i = 0; i < s.length(); i++) {
            int at = rest.indexOf(String.valueOf(s.charAt(i)));
            if (at < 0) {
                return false;
            }
            rest.deleteCharAt(at);
        }
        return rest.length() == 0;
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
        if (x.length() < 1 || x.length() > 50_000) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (int i = 0; i < x.length(); i++) {
            if (x.charAt(i) < 'a' || x.charAt(i) > 'z') {
                throw new IllegalStateException(label + ": bad test case, not a lowercase English letter");
            }
        }
    }

    static void check(String s, String t, boolean expected) {
        String label = s.length() <= 20 && t.length() <= 20 ? "s=\"" + s + "\", t=\"" + t + "\"" : "s.length=" + s.length() + ", t.length=" + t.length();
        validate(label, s);
        validate(label, t);
        if (s.length() <= 2000 && t.length() <= 2000 && bruteForce(s, t) != expected) {
            throw new IllegalStateException(label + ": bad test case, expected value is wrong");
        }
        boolean result = new Solution().isAnagram(s, t);
        if (result != expected) {
            throw new AssertionError(label + ": expected " + expected + " but got " + result);
        }
        cases++;
    }
}
