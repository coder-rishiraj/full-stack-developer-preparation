import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Encode and Decode Strings page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 * The encoded form is the solution's own choice, so the only observable contract is the round trip:
 * decode(encode(strs)) must equal strs. Encode and decode run on separate Solution objects, so a
 * solution cannot pass by remembering the list in a field instead of putting it in the string.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples in section 1
        check(List.of("hi", "", "a,b"));
        check(List.of());
        check(List.of(""));

        // Dry-run inputs in section 4
        check(List.of("a,b", "", "c/"));                    // escaping approach
        check(List.of("ab#", "", "12"));                    // length-prefix approach

        // Edge cases listed in section 3 and traced in section 7
        check(List.of("", ""));                             // several empty strings
        check(List.of("#"));                                // the header separator as the whole string
        check(List.of("3#abc"));                            // a string that looks like a header
        check(List.of("12#", "0#", "#0"));                  // digits and '#' mixed
        check(List.of("/", ",", "//,", "/,"));              // escape and terminator characters
        check(List.of("abcdefghijkl"));                     // a length with two digits (12)
        check(List.of("x".repeat(199)));                    // the longest allowed string: a three-digit length
        check(List.of("a b", " ", "\t\n"));                 // whitespace
        check(List.of(allChars().substring(0, 128), allChars().substring(128)));  // all 256 characters, '\0' included, in two strings (each must be under 200)
        check(List.of(String.valueOf((char) 0), String.valueOf((char) 255)));

        // Constraint extremes: 99 strings of 199 characters, all 256 characters possible
        Random random = new Random(20261113L);
        List<String> biggest = new ArrayList<>();
        for (int i = 0; i < 99; i++) {
            biggest.add(randomString(random, 199, 256));
        }
        check(biggest);
        List<String> manyEmpty = new ArrayList<>();
        for (int i = 0; i < 99; i++) {
            manyEmpty.add("");
        }
        check(manyEmpty);
        List<String> headerLookalikes = new ArrayList<>();
        for (int i = 0; i < 99; i++) {
            headerLookalikes.add(i + "#" + "#".repeat(i % 7));
        }
        check(headerLookalikes);

        // Random lists: all 256 characters, then a small alphabet that is mostly '#', digits, '/' and ','
        for (int r = 0; r < 2000; r++) {
            int n = random.nextInt(100);
            List<String> strs = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                strs.add(randomString(random, random.nextInt(random.nextBoolean() ? 5 : 200), 256));
            }
            check(strs);
        }
        String tricky = "#0123456789/,\\";
        for (int r = 0; r < 3000; r++) {
            int n = random.nextInt(8);
            List<String> strs = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                int length = random.nextInt(random.nextInt(4) == 0 ? 30 : 5);
                StringBuilder sb = new StringBuilder();
                for (int k = 0; k < length; k++) {
                    sb.append(tricky.charAt(random.nextInt(tricky.length())));
                }
                strs.add(sb.toString());
            }
            check(strs);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String allChars() {
        StringBuilder sb = new StringBuilder();
        for (int c = 0; c < 256; c++) {
            sb.append((char) c);
        }
        return sb.toString();
    }

    static String randomString(Random random, int length, int alphabet) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append((char) random.nextInt(alphabet));
        }
        return sb.toString();
    }

    /** NeetCode's constraints: 0 <= strs.length < 100, 0 <= strs[i].length < 200, characters 0..255. */
    static void validate(List<String> strs) {
        if (strs.size() >= 100) {
            throw new IllegalStateException("bad test case: 100 or more strings");
        }
        for (String s : strs) {
            if (s == null || s.length() >= 200) {
                throw new IllegalStateException("bad test case: null string or length 200 or more");
            }
            for (int i = 0; i < s.length(); i++) {
                if (s.charAt(i) > 255) {
                    throw new IllegalStateException("bad test case: character outside the 256 allowed");
                }
            }
        }
    }

    static String show(List<String> strs) {
        if (strs.size() > 6) {
            return "list of " + strs.size() + " strings";
        }
        List<String> shown = new ArrayList<>();
        for (String s : strs) {
            shown.add(s.length() > 20 ? "<" + s.length() + " chars>" : '"' + s + '"');
        }
        return shown.toString();
    }

    static void check(List<String> strs) {
        validate(strs);
        List<String> input = new ArrayList<>(strs);        // a mutable list, as a judge would pass
        String encoded = new Solution().encode(input);
        if (encoded == null) {
            throw new AssertionError(show(strs) + ": encode returned null");
        }
        if (!input.equals(strs)) {
            throw new AssertionError(show(strs) + ": encode modified its input list");
        }
        List<String> decoded = new Solution().decode(encoded);
        if (decoded == null || !decoded.equals(strs)) {
            throw new AssertionError(show(strs) + ": round trip failed, got " + (decoded == null ? "null" : show(decoded))
                    + " from encoded " + Arrays.toString(encoded.chars().limit(40).toArray()));
        }
        cases++;
    }
}
