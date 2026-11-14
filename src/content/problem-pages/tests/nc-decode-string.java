import java.util.Random;

/**
 * Tests for every "class Solution" on the Decode String page (run by `npm run problems:verify`).
 * The reference is an independent decoder written here: it finds each bracket's partner by
 * counting depth and recurses on the substring between them (no shared index, no stacks).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from section 1 and the official examples
        check("2[x3[y]]z", "xyyyxyyyz");
        check("ab10[c]", "abcccccccccc");
        check("3[a]2[bc]", "aaabcbc");
        check("3[a2[c]]", "accaccacc");
        check("2[abc]3[cd]ef", "abcabccdcdcdef");

        // Dry-run inputs used on the page
        check("2[ab3[c]]d", "abcccabcccd");

        // Edge cases listed in section 3 and traced in section 7
        check("a", "a");                                         // shortest input, no brackets
        check("abc", "abc");
        check("1[a]", "a");
        check("10[a]", "aaaaaaaaaa");                            // multi-digit count
        check("100[a]", "a".repeat(100));
        check("2[a]b", "aab");                                   // letters after a group
        check("ab2[c]", "abcc");                                 // letters before a group
        check("2[a]2[b]", "aabb");                               // sibling groups
        check("2[2[2[a]]]", "aaaaaaaa");                         // nesting with no letters between
        check("2[]a", "a");                                      // empty group (assumption in section 3)
        check("2[a]3[b]", "aabbb");                               // the count is reset after '['
        check("3[z]2[2[y]pq4[2[jk]e1[f]]]ef", reference("3[z]2[2[y]pq4[2[jk]e1[f]]]ef"));

        // Constraint extremes: |s| = 30, k = 300, output near 10^5, deepest nesting
        check("abcdefghijklmnopqrstuvwxyzabcd", "abcdefghijklmnopqrstuvwxyzabcd");
        check("300[300[a]]", "a".repeat(90_000));
        check("300[a300[b]]", ("a" + "b".repeat(300)).repeat(300));
        check("300[abcdefghijklmnopqrstuvwx]", "abcdefghijklmnopqrstuvwx".repeat(300)); // length 29
        check("1[1[1[1[1[1[1[1[1[a]]]]]]]]]", "a");                // depth 9, length 28
        check("1[1[1[1[1[1[1[1[300[a]]]]]]]]]", "a".repeat(300));  // length 30
        check("3[300[100[a]]]", "a".repeat(90_000));
        check("300[b300[a]]c", ("b" + "a".repeat(300)).repeat(300) + "c");

        // Random valid encodings (|s| <= 30, output <= 10^5) against the reference
        Random random = new Random(20261114L);
        int made = 0;
        while (made < 20_000) {
            String s = randomEncoding(random, 0);
            if (s.isEmpty() || s.length() > 30) {
                continue;
            }
            if (decodedLength(s) > 100_000) {
                continue;                                        // the problem promises output <= 10^5
            }
            check(s, reference(s));
            made++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** A random sequence of letters and k[...] groups. */
    static String randomEncoding(Random random, int depth) {
        StringBuilder sb = new StringBuilder();
        int parts = 1 + random.nextInt(3);
        for (int p = 0; p < parts; p++) {
            if (depth < 5 && random.nextInt(3) == 0) {
                int k;
                int pick = random.nextInt(4);
                if (pick == 0) {
                    k = 1 + random.nextInt(9);
                } else if (pick == 1) {
                    k = 10 + random.nextInt(90);
                } else if (pick == 2) {
                    k = 100 + random.nextInt(201);
                } else {
                    k = 1 + random.nextInt(3);
                }
                sb.append(k).append('[').append(randomEncoding(random, depth + 1)).append(']');
            } else {
                int letters = 1 + random.nextInt(3);
                for (int i = 0; i < letters; i++) {
                    sb.append((char) ('a' + random.nextInt(26)));
                }
            }
        }
        return sb.toString();
    }

    /** Length of the decoded string, computed without building it (capped to avoid overflow). */
    static long decodedLength(String t) {
        long[] lengths = new long[t.length() + 1];
        long[] counts = new long[t.length() + 1];
        int depth = 0;
        long k = 0;
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c >= '0' && c <= '9') {
                k = k * 10 + (c - '0');
            } else if (c == '[') {
                depth++;
                counts[depth] = k;
                lengths[depth] = 0;
                k = 0;
            } else if (c == ']') {
                long inner = lengths[depth] * counts[depth];
                depth--;
                lengths[depth] = Math.min(lengths[depth] + inner, 1L << 40);
            } else {
                lengths[depth]++;
            }
        }
        return lengths[0];
    }

    /** Independent reference: match brackets by depth counting, recurse on the inside. */
    static String reference(String t) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < t.length()) {
            char c = t.charAt(i);
            if (Character.isLetter(c)) {
                out.append(c);
                i++;
                continue;
            }
            int open = t.indexOf('[', i);
            int k = Integer.parseInt(t.substring(i, open));
            int depth = 0;
            int close = open;
            for (int j = open; j < t.length(); j++) {
                if (t.charAt(j) == '[') {
                    depth++;
                } else if (t.charAt(j) == ']') {
                    depth--;
                    if (depth == 0) {
                        close = j;
                        break;
                    }
                }
            }
            String inner = reference(t.substring(open + 1, close));
            for (int r = 0; r < k; r++) {
                out.append(inner);
            }
            i = close + 1;
        }
        return out.toString();
    }

    /** Rejects inputs that break the problem's guarantees. */
    static void validate(String s) {
        if (s.isEmpty() || s.length() > 30) {
            throw new IllegalStateException(s + ": bad test case, length out of range");
        }
        int depth = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c >= '0' && c <= '9') {
                int j = i;
                while (j < s.length() && Character.isDigit(s.charAt(j))) {
                    j++;
                }
                if (j >= s.length() || s.charAt(j) != '[' || s.charAt(i) == '0') {
                    throw new IllegalStateException(s + ": bad test case, a number must be followed by '[' and have no leading zero");
                }
                int k = Integer.parseInt(s.substring(i, j));
                if (k < 1 || k > 300) {
                    throw new IllegalStateException(s + ": bad test case, count " + k + " out of range");
                }
                i = j - 1;
            } else if (c == '[') {
                if (i == 0 || !Character.isDigit(s.charAt(i - 1))) {
                    throw new IllegalStateException(s + ": bad test case, '[' without a count");
                }
                depth++;
            } else if (c == ']') {
                depth--;
                if (depth < 0) {
                    throw new IllegalStateException(s + ": bad test case, unbalanced brackets");
                }
            } else if (c < 'a' || c > 'z') {
                throw new IllegalStateException(s + ": bad test case, character '" + c + "' not allowed");
            }
        }
        if (depth != 0) {
            throw new IllegalStateException(s + ": bad test case, unbalanced brackets");
        }
    }

    static void check(String s, String expected) {
        validate(s);
        if (expected.length() > 100_000) {
            throw new IllegalStateException(s + ": bad test case, output longer than 10^5");
        }
        if (!expected.equals(reference(s))) {
            throw new IllegalStateException(s + ": bad test case, the expected value disagrees with the reference");
        }
        String got = new Solution().decodeString(s);
        if (!expected.equals(got)) {
            String shown = got.length() <= 60 ? got : got.substring(0, 60) + "... (length " + got.length() + ")";
            throw new AssertionError(s + ": expected length " + expected.length() + ", got " + shown);
        }
        cases++;
    }
}
