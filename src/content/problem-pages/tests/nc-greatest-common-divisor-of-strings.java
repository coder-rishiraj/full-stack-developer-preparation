import java.util.Random;

/**
 * Tests for every "class Solution" on the Greatest Common Divisor of Strings page (run by
 * `npm run problems:verify`). Each approach is compiled together with this file and must pass all cases.
 * Expected answers come from the examples or from an independent brute force that tries every
 * prefix of str1 by the definition (repeat it and compare).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples (the four official ones) and the dry-run inputs of section 4
        check("ABCABC", "ABC", "ABC");
        check("ABABAB", "ABAB", "AB");
        check("LEET", "CODE", "");
        check("AAAAAB", "AAA", "");

        // Edge cases from section 3, traced in section 7
        check("AAA", "AA", "A");               // lengths share only 1, neither divides the other
        check("ABAB", "BABA", "");             // same letters, different arrangement
        check("XYZ", "XYZ", "XYZ");            // equal strings
        check("A", "A", "A");                  // smallest input
        check("A", "B", "");
        check("ABC", "ABCABC", "ABC");         // the shorter string comes second... or first
        check("ABA", "AB", "");                // periodic with period 2 but not tiled by "AB"
        check("ABABA", "AB", "");
        check("ABCDEF", "ABC", "");            // shared prefix that is not a divisor
        check("ABAB", "AB", "AB");
        check("AAAAAA", "AAAA", "AA");

        // Largest lengths (1000)
        check("A".repeat(1000), "A".repeat(999), "A");                          // gcd 1
        check("AB".repeat(500), "AB".repeat(250), "AB".repeat(250));            // answer is str2
        check("A".repeat(999) + "B", "A".repeat(1000), "");                     // Approach 1's worst case
        check("ABCDE".repeat(200), "ABCDE".repeat(168), "ABCDE".repeat(8));     // gcd(1000, 840) = 40
        check("Z".repeat(840), "Z".repeat(840), "Z".repeat(840));
        check("ABC".repeat(333) + "A", "ABC".repeat(333), "");

        // Random strings that are powers of a random block (so a common divisor exists),
        // and random perturbations of them (so it usually does not), against the brute force.
        Random random = new Random(20261116L);
        for (int t = 0; t < 4000; t++) {
            int alphabet = 1 + random.nextInt(3);
            String block = randomString(random, 1 + random.nextInt(4), alphabet);
            String s1 = block.repeat(1 + random.nextInt(8));
            String s2 = block.repeat(1 + random.nextInt(8));
            if (random.nextInt(3) == 0) {
                s1 = mutate(s1, random, alphabet);
            }
            if (random.nextInt(4) == 0) {
                s2 = randomString(random, 1 + random.nextInt(12), alphabet);
            }
            check(s1, s2, brute(s1, s2));
        }
        // A few large random cases
        for (int t = 0; t < 30; t++) {
            String block = randomString(random, 1 + random.nextInt(6), 2);
            int reps1 = 1000 / block.length();
            int reps2 = 1 + random.nextInt(reps1);
            String s1 = block.repeat(reps1);
            String s2 = block.repeat(reps2);
            if (t % 3 == 0) {
                s2 = mutate(s2, random, 2);
            }
            check(s1, s2, brute(s1, s2));
        }

        // Guard: the test inputs themselves must respect the constraints
        try {
            validate("", "A");
            throw new AssertionError("validate should reject an empty string");
        } catch (IllegalStateException expected) {
            cases++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void validate(String s1, String s2) {
        for (String s : new String[] {s1, s2}) {
            if (s.length() < 1 || s.length() > 1000) throw new IllegalStateException("bad test case: length " + s.length());
            for (char c : s.toCharArray()) {
                if (c < 'A' || c > 'Z') throw new IllegalStateException("bad test case: character " + c);
            }
        }
    }

    static void check(String s1, String s2, String expected) {
        validate(s1, s2);
        String got = new Solution().gcdOfStrings(s1, s2);
        if (!expected.equals(got)) {
            throw new AssertionError("gcdOfStrings(\"" + shorten(s1) + "\", \"" + shorten(s2) + "\") = \"" + shorten(got)
                    + "\", expected \"" + shorten(expected) + "\"");
        }
        cases++;
    }

    static String shorten(String s) {
        return s == null ? "null" : s.length() <= 40 ? s : s.substring(0, 40) + "...(" + s.length() + ")";
    }

    /** Longest prefix of s1 that, repeated, equals both strings (definition only, no gcd). */
    static String brute(String s1, String s2) {
        for (int len = Math.min(s1.length(), s2.length()); len >= 1; len--) {
            String t = s1.substring(0, len);
            if (tiles(t, s1) && tiles(t, s2)) return t;
        }
        return "";
    }

    static boolean tiles(String t, String s) {
        if (s.length() % t.length() != 0) return false;
        return t.repeat(s.length() / t.length()).equals(s);
    }

    static String randomString(Random random, int length, int alphabet) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) sb.append((char) ('A' + random.nextInt(alphabet)));
        return sb.toString();
    }

    static String mutate(String s, Random random, int alphabet) {
        char[] c = s.toCharArray();
        c[random.nextInt(c.length)] = (char) ('A' + random.nextInt(alphabet + 1));
        return new String(c);
    }
}
