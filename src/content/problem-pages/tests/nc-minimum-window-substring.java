import java.util.Random;

/**
 * Tests for every "class Solution" on the Minimum Window Substring page (run by `npm run problems:verify`).
 * Small inputs are checked against a brute force over every start index; large inputs against an
 * independent reference that binary-searches the window length and tests each fixed-length window.
 * The problem guarantees a unique minimum window. Named cases must satisfy that (the guard throws
 * otherwise); random cases that happen to have several minimum windows are checked by length,
 * validity and position instead of by exact string.
 */
class Tests {
    static int cases = 0;
    static final int MAX = 100_000;

    public static void main(String[] args) {
        // Examples in section 1
        check("ADOBECODEBANC", "ABC", "BANC");      // contracting with `>= 0` or `if` instead of `while` returns "ADOBEC"
        check("a", "a", "a");
        check("a", "aa", "");                       // t longer than s

        // Dry-run inputs and edge cases from sections 3, 4, 7 and 11
        check("bbaa", "aba", "baa");                // duplicates in t; `>= 0` or `if` returns "bbaa", counting surplus returns "bba"
        check("AAB", "AB", "AB");                   // counting surplus characters returns "AA"
        check("abc", "d", "");                      // t has a character that is not in s
        check("abc", "abcd", "");                   // t longer than s
        check("aa", "aa", "aa");
        check("ab", "b", "b");
        check("ab", "a", "a");
        check("abc", "cba", "abc");                 // the whole string
        check("aA", "a", "a");                      // case matters
        check("aA", "A", "A");
        check("Aa", "aA", "Aa");
        check("cabwefgewcwaefgcf", "cae", "cwae");
        check("acbbaca", "aba", "baca");
        check("bba", "ab", "ba");
        check("aaaaaaaaaaaabbbbbcdd", "abcdd", "abbbbbcdd");
        check("zzzzAzzzzBzzzz", "BA", "AzzzzB");

        // Random small inputs against the brute force, over tiny alphabets so windows overlap a lot
        Random random = new Random(20261114L);
        String[] alphabets = {"ab", "abc", "aAb", "xyzX"};
        for (int trial = 0; trial < 30_000; trial++) {
            String alphabet = alphabets[random.nextInt(alphabets.length)];
            String s = randomString(random, 1 + random.nextInt(14), alphabet);
            String t = randomString(random, 1 + random.nextInt(5), alphabet);
            int[] ref = bruteForce(s, t);
            checkRelaxed(s, t, ref[0], ref[1]);
        }

        // Constraint extremes: m = n = 10^5
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < MAX - 1; i++) {
            sb.append('a');
        }
        sb.append('b');
        check(sb.toString(), "ab", "ab");                         // the window is at the very end

        String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        String full = randomString(random, MAX, letters);
        check(full, full, full);                                  // t == s: the whole string
        check(full, new StringBuilder(full).reverse().toString(), full);   // t is a permutation of s

        check("a", repeat('a', MAX), "");                         // n = 10^5, m = 1
        check(repeat('a', MAX), repeat('a', MAX), repeat('a', MAX));
        check(randomString(random, MAX, "abcdefghijklmnopqrstuvwxyz"), "Z", "");   // a character of t is absent

        // A unique short window planted inside a long string over other letters
        StringBuilder planted = new StringBuilder(randomString(random, MAX, "abcdefghijklmnopqrstuvwx"));
        planted.setCharAt(50_000, 'y');
        planted.setCharAt(50_001, 'Y');
        planted.setCharAt(50_002, 'z');
        planted.setCharAt(10, 'y');                               // a far-away extra 'y' (window from 10 is longer)
        check(planted.toString(), "zyY", "yYz");

        // t uses most of s: a long minimal window
        String big = randomString(random, MAX, "abc");
        String tBig = big.substring(1_000, 90_000);
        int[] bigRef = largeReference(big, tBig);
        checkRelaxed(big, tBig, bigRef[0], bigRef[1]);

        // Large random inputs against the length-search reference
        for (int trial = 0; trial < 6; trial++) {
            String s = randomString(random, MAX, trial % 2 == 0 ? "abcd" : letters);
            String t = randomString(random, 1 + random.nextInt(trial < 3 ? 50 : 2_000), trial % 2 == 0 ? "abcd" : letters);
            int[] ref = largeReference(s, t);
            checkRelaxed(s, t, ref[0], ref[1]);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static String repeat(char c, int times) {
        StringBuilder sb = new StringBuilder(times);
        for (int i = 0; i < times; i++) {
            sb.append(c);
        }
        return sb.toString();
    }

    static String randomString(Random random, int length, String alphabet) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(alphabet.charAt(random.nextInt(alphabet.length())));
        }
        return sb.toString();
    }

    /** True if the window s[from, from + len) contains every character of t with multiplicity. */
    static boolean covers(String s, int from, int len, String t) {
        int[] count = new int[128];
        for (int i = from; i < from + len; i++) {
            count[s.charAt(i)]++;
        }
        for (int i = 0; i < t.length(); i++) {
            if (--count[t.charAt(i)] < 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Brute force: for every start, extend the end until the window covers t (the shortest valid
     * window from that start). Returns {minimum length or -1, number of starts achieving it}.
     */
    static int[] bruteForce(String s, String t) {
        int best = -1;
        int ways = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int len = 1; i + len <= s.length(); len++) {
                if (covers(s, i, len, t)) {
                    if (best == -1 || len < best) {
                        best = len;
                        ways = 1;
                    } else if (len == best) {
                        ways++;
                    }
                    break;
                }
            }
        }
        return new int[] {best, ways};
    }

    /**
     * Independent reference for large inputs. A window of length L that covers t still covers t when
     * extended, so "some window of length L covers t" is monotone in L: binary-search the smallest
     * such L, testing each length with a fixed-size window. Returns {minimum length or -1, count}.
     */
    static int[] largeReference(String s, String t) {
        int lo = t.length();
        int hi = s.length();
        if (lo > hi || countWindows(s, t, hi) == 0) {
            return new int[] {-1, 0};
        }
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (countWindows(s, t, mid) > 0) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return new int[] {lo, countWindows(s, t, lo)};
    }

    /** Number of windows of exactly length len that cover t, by sliding a fixed-size window. */
    static int countWindows(String s, String t, int len) {
        int[] deficit = new int[128];
        for (int i = 0; i < t.length(); i++) {
            deficit[t.charAt(i)]++;
        }
        int lacking = 0;
        for (int c = 0; c < 128; c++) {
            lacking += deficit[c];
        }
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (deficit[s.charAt(i)]-- > 0) {
                lacking--;
            }
            if (i >= len) {
                if (++deficit[s.charAt(i - len)] > 0) {
                    lacking++;
                }
            }
            if (i >= len - 1 && lacking == 0) {
                count++;
            }
        }
        return count;
    }

    static void guard(String s, String t) {
        String label = describe(s, t);
        if (s.length() < 1 || s.length() > MAX || t.length() < 1 || t.length() > MAX) {
            throw new IllegalStateException(label + ": bad test case, length out of range");
        }
        for (String x : new String[] {s, t}) {
            for (int i = 0; i < x.length(); i++) {
                char c = x.charAt(i);
                if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) {
                    throw new IllegalStateException(label + ": bad test case, character " + c);
                }
            }
        }
    }

    static String describe(String s, String t) {
        return "s=" + (s.length() <= 30 ? s : s.substring(0, 30) + "...(" + s.length() + ")")
                + " t=" + (t.length() <= 30 ? t : t.substring(0, 30) + "...(" + t.length() + ")");
    }

    /** Exact check. The case must have a unique minimum window, as the problem guarantees. */
    static void check(String s, String t, String expected) {
        guard(s, t);
        int[] ref = s.length() <= 300 ? bruteForce(s, t) : largeReference(s, t);
        if (ref[0] != -1 && ref[1] != 1) {
            throw new IllegalStateException(describe(s, t) + ": bad test case, " + ref[1]
                    + " minimum windows, but the problem guarantees a unique answer");
        }
        if ((ref[0] == -1) != expected.isEmpty() || (ref[0] != -1 && ref[0] != expected.length())) {
            throw new IllegalStateException(describe(s, t) + ": bad test case, expected answer disagrees with the reference");
        }
        String got = new Solution().minWindow(s, t);
        if (!got.equals(expected)) {
            throw new AssertionError(describe(s, t) + ": expected \"" + abbreviate(expected) + "\", got \"" + abbreviate(got) + "\"");
        }
        cases++;
    }

    /** Check by length, validity and position, for cases whose minimum window may not be unique. */
    static void checkRelaxed(String s, String t, int minLen, int ways) {
        guard(s, t);
        String got = new Solution().minWindow(s, t);
        if (minLen == -1) {
            if (!got.isEmpty()) {
                throw new AssertionError(describe(s, t) + ": expected \"\", got \"" + abbreviate(got) + "\"");
            }
        } else {
            int at = s.indexOf(got);
            if (got.length() != minLen || at < 0 || !covers(s, at, got.length(), t)) {
                throw new AssertionError(describe(s, t) + ": expected a covering window of length " + minLen
                        + " (" + ways + " exist), got \"" + abbreviate(got) + "\"");
            }
        }
        cases++;
    }

    static String abbreviate(String x) {
        return x.length() <= 40 ? x : x.substring(0, 40) + "...(" + x.length() + ")";
    }
}
