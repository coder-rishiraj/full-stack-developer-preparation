import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class Solution" on the Happy Number page (run by `npm run problems:verify`).
 * The expected value comes from a brute force that records the whole sequence in a list and
 * stops at the first repeat (independent of the set and Floyd code under test). Covers the
 * examples, every dry-run and edge-case input, every n in [1, 200000], the top of the int range,
 * powers of ten and random n, and re-checks the numbers the page states.
 */
class Tests {
    static int cases = 0;

    static int next(int n) {
        int s = 0;
        for (; n > 0; n /= 10) s += (n % 10) * (n % 10);
        return s;
    }

    /** The whole sequence up to (not including) the first repeated value or 1. */
    static List<Integer> trail(int n) {
        List<Integer> seq = new ArrayList<>();
        while (n != 1 && !seq.contains(n)) {
            seq.add(n);
            n = next(n);
        }
        return seq;
    }

    static boolean reference(int n) {
        List<Integer> seq = trail(n);
        int last = seq.isEmpty() ? n : next(seq.get(seq.size() - 1));
        return last == 1;
    }

    static void check(int n, Boolean expected) {
        if (n < 1) throw new IllegalStateException("bad test case: n = " + n);
        boolean want = reference(n);
        if (expected != null && expected != want) throw new IllegalStateException("bad test case: n = " + n + " expected " + expected);
        boolean got = new Solution().isHappy(n);
        if (got != want) throw new AssertionError("n = " + n + ": expected " + want + " but got " + got);
        cases++;
    }

    static void check(int n) {
        check(n, null);
    }

    static void claim(boolean ok, String what) {
        if (!ok) throw new AssertionError("page claim is wrong: " + what);
    }

    static int buggyNext(int n) {
        int s = 0;
        while (n > 0) {
            s += n % 10 * n % 10;
            n /= 10;
        }
        return s;
    }

    static boolean buggyPrecedence(int n) {
        Set<Integer> seen = new HashSet<>();
        while (n != 1 && seen.add(n)) n = buggyNext(n);
        return n == 1;
    }

    static boolean buggyFloyd(int n) {
        int slow = n, fast = n;
        while (slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }

    public static void main(String[] args) {
        // Examples, dry runs and edge cases (sections 1, 3, 4, 7)
        check(19, true);
        check(2, false);
        check(1, true);
        check(7, true);
        check(10, true);
        check(100, true);
        check(3, false);
        check(4, false);
        check(6, false);
        check(15_999, false);
        check(1_999_999_999, false);
        check(1_000_000_000, true);
        check(1_111_111, true);
        check(Integer.MAX_VALUE, false);

        // Claims stated on the page
        claim(trail(2).size() == 9, "2 visits nine values before 4 repeats");
        claim(trail(15_999).size() == 20, "15,999 visits 20 distinct values");
        claim(next(1_999_999_999) == 730, "next(1,999,999,999) = 730");
        claim(next(999_999_999) == 729, "next(999,999,999) = 729");
        claim(next(Integer.MAX_VALUE) == 260, "2,147,483,647 -> 260");
        for (int m = 1; m <= 999; m++) claim(next(m) <= 243, "next(m) <= 243 below 1,000");
        for (int d = 4; d <= 10; d++) claim(81L * d < (long) Math.pow(10, d - 1), "81d < 10^(d-1) for d >= 4");
        claim(!buggyPrecedence(19) && buggyPrecedence(3), "precedence bug: 19 false, 3 true");
        int wrong = 0;
        for (int n = 1; n <= 1000; n++) if (buggyPrecedence(n) != reference(n)) wrong++;
        claim(wrong == 473, "precedence bug wrong for 473 of 1..1000");
        claim(!buggyFloyd(19) && buggyFloyd(1), "Floyd from (n, n) returns false for 19");
        // The only cycles are {1} and the 4-cycle: every value in 1..999 reaches 1 or 4
        for (int m = 1; m <= 999; m++) {
            int x = m;
            for (int step = 0; step < 1000 && x != 1 && x != 4; step++) x = next(x);
            claim(x == 1 || x == 4, "every sequence reaches 1 or 4 (" + m + ")");
        }

        // Every n in [1, 200000]
        for (int n = 1; n <= 200_000; n++) check(n);

        // The top of the int range, and powers of ten with neighbours
        for (int n = Integer.MAX_VALUE - 20_000; n > 0 && n <= Integer.MAX_VALUE; n++) {
            check(n);
            if (n == Integer.MAX_VALUE) break;
        }
        for (long p = 1; p <= Integer.MAX_VALUE; p *= 10) {
            check((int) p);
            if (p > 1) check((int) p - 1);
            if (p + 1 <= Integer.MAX_VALUE) check((int) p + 1);
        }

        // Random n across the whole range
        Random random = new Random(20261116L);
        for (int t = 0; t < 100_000; t++) check(1 + random.nextInt(Integer.MAX_VALUE));

        System.out.println("PASS " + cases + " cases");
    }
}
