// Run-panel harness for nc-guess-number-higher-or-lower (see scripts/build-java-runner.mjs).
// Input: n = 10, pick = 6. Prints the answer, then how many times guess() was called.

class GuessGame {
    static int pick;
    static int calls;

    int guess(int num) {
        calls++;
        if (calls > 1000) throw new IllegalStateException("more than 1000 calls to guess(): the range is not shrinking");
        return Integer.compare(pick, num);
    }
}

class Harness {
    static void run(java.util.List<Object> in) {
        int n = runner.In.toInt(runner.In.arg(in, 0, "n"));
        int pick = runner.In.toInt(runner.In.arg(in, 1, "pick"));
        if (n < 1 || pick < 1 || pick > n) throw new IllegalArgumentException("need 1 <= pick <= n");
        GuessGame.pick = pick;
        GuessGame.calls = 0;
        int answer = new Solution().guessNumber(n);
        System.out.println(answer);
        System.out.println("guess() calls: " + GuessGame.calls);
    }
}
