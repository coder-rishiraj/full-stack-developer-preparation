/**
 * Tests for every "class Solution" on the Roman to Integer page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from the statement and section 1, and the dry-run input
        check("III", 3);
        check("LVIII", 58);
        check("MCMXCIV", 1994);

        // Edge cases from sections 3 and 7
        check("I", 1);                  // smallest value, one symbol
        check("M", 1000);               // one symbol
        check("IV", 4);                 // ends with a subtractive pair
        check("IX", 9);
        check("XL", 40);
        check("XC", 90);
        check("CD", 400);
        check("CM", 900);
        check("MMM", 3000);             // repeated symbols
        check("XLIX", 49);
        check("MMMDCCCLXXXVIII", 3888); // longest valid numeral: 15 characters
        check("MMMCMXCIX", 3999);       // largest value

        // Exhaustive: every value 1..3999, written by an independent greedy encoder
        for (int v = 1; v <= 3999; v++) {
            check(toRoman(v), v);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static final int[] VALUES = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    static final String[] TOKENS = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};

    /** Standard Roman form of v (1..3999), greedy over the 13 tokens. */
    static String toRoman(int v) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < VALUES.length; i++) {
            while (v >= VALUES[i]) {
                sb.append(TOKENS[i]);
                v -= VALUES[i];
            }
        }
        return sb.toString();
    }

    static void check(String s, int want) {
        // Guard against a wrong test: 1 <= length <= 15, only the seven symbols, a valid numeral.
        if (s.length() < 1 || s.length() > 15) {
            throw new IllegalStateException(s + ": bad test case, length out of range");
        }
        for (char c : s.toCharArray()) {
            if ("IVXLCDM".indexOf(c) < 0) {
                throw new IllegalStateException(s + ": bad test case, character " + c);
            }
        }
        if (want < 1 || want > 3999 || !toRoman(want).equals(s)) {
            throw new IllegalStateException(s + ": bad test case, not the valid numeral for " + want);
        }
        int got = new Solution().romanToInt(s);
        if (got != want) {
            throw new AssertionError(s + ": expected " + want + " but got " + got);
        }
        cases++;
    }
}
