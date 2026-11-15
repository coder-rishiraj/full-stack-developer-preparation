import java.util.Random;

/**
 * Stand-in for LeetCode's GuessGame: the solution extends it and calls guess(num).
 * The pick is a static field the tests set before each call. Like the judge, guess() only
 * compares; it does not reject numbers outside [1, n]. It counts calls and gives up after
 * CALL_LIMIT of them, so a search that stops shrinking (the (lo + hi) / 2 overflow bug)
 * fails with a message instead of hanging the test run.
 */
class GuessGame {
    static int pick;
    static int calls;
    static final int CALL_LIMIT = 100;

    int guess(int num) {
        calls++;
        if (calls > CALL_LIMIT) {
            throw new IllegalStateException("more than " + CALL_LIMIT + " calls to guess(): the range is not shrinking"
                    + " (last guess " + num + ", pick " + pick + ")");
        }
        if (num > pick) {
            return -1;
        }
        if (num < pick) {
            return 1;
        }
        return 0;
    }
}

/** Tests for every "class Solution" on the Guess Number Higher or Lower page (run by `npm run problems:verify`). */
class Tests {
    static int cases = 0;
    static final int MAX = Integer.MAX_VALUE;   // 2^31 - 1, the largest n

    public static void main(String[] args) {
        // Examples from section 1 and the dry run in section 4
        check(10, 6);
        check(1, 1);
        check(2, 1);
        check(2, 2);

        // Edge cases from section 3, traced in section 7
        check(10, 1);                 // pick at the bottom
        check(10, 10);                // pick at the top
        check(MAX, MAX);              // the overflow input: (lo + hi) / 2 loops forever here
        check(MAX, 1);
        check(MAX, MAX - 1);
        check(MAX, 1 << 30);
        check(MAX, (1 << 30) - 1);
        check(MAX, (1 << 30) + 1);
        check(MAX, 1_500_000_000);
        check(1 << 30, 1 << 30);      // smallest n at which (lo + hi) / 2 overflows (pick = n)
        check((1 << 30) - 1, (1 << 30) - 1);
        check(MAX - 1, MAX - 1);

        // Every pick for every small n
        for (int n = 1; n <= 300; n++) {
            for (int p = 1; p <= n; p++) {
                check(n, p);
            }
        }

        // Random large n and picks, including picks near the top of the int range
        Random random = new Random(20261114L);
        for (int t = 0; t < 20_000; t++) {
            int n = t % 2 == 0 ? MAX - random.nextInt(1000) : 1 + random.nextInt(MAX);
            int p = t % 3 == 0 ? n - random.nextInt(Math.min(n, 1000)) : 1 + random.nextInt(n);
            check(n, p);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void check(int n, int pick) {
        String label = "n = " + n + ", pick = " + pick;
        // Guard against a wrong test: 1 <= pick <= n <= 2^31 - 1.
        if (n < 1 || pick < 1 || pick > n) {
            throw new IllegalStateException(label + ": bad test case, need 1 <= pick <= n");
        }
        GuessGame.pick = pick;
        GuessGame.calls = 0;
        int actual = new Solution().guessNumber(n);
        if (actual != pick) {
            throw new AssertionError(label + ": got " + actual);
        }
        // Both solutions on the page are logarithmic; neither may use more than 2(floor(log2 n) + 1) calls.
        int bound = 2 * (32 - Integer.numberOfLeadingZeros(n));
        if (GuessGame.calls > bound) {
            throw new AssertionError(label + ": used " + GuessGame.calls + " calls to guess(), more than " + bound);
        }
        cases++;
    }
}
