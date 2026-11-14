import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Evaluate Reverse Polish Notation page
 * (run by `npm run problems:verify`).
 * Random cases are generated as expression trees: the expected value is computed on the tree
 * with long arithmetic (division truncating toward zero), and the tokens are the tree's postorder.
 * Trees whose nodes leave the 32-bit range or divide by zero are never built, so every case
 * respects the statement's guarantees; check() also re-validates each case independently.
 */
class Tests {
    static int cases = 0;

    /** A generated expression: its postfix tokens and its value. */
    static final class Expr {
        final List<String> tokens;
        final long value;

        Expr(List<String> tokens, long value) {
            this.tokens = tokens;
            this.value = value;
        }
    }

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check(new String[] {"2", "1", "+", "3", "*"}, 9);
        check(new String[] {"4", "13", "5", "/", "+"}, 6);
        check(new String[] {"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}, 22);

        // Edge cases from sections 3, 7, 9 and 11
        check(new String[] {"42"}, 42);
        check(new String[] {"-200"}, -200);
        check(new String[] {"200"}, 200);
        check(new String[] {"0"}, 0);
        check(new String[] {"3", "-4", "-"}, 7);
        check(new String[] {"3", "-4", "+"}, -1);
        check(new String[] {"-7", "2", "/"}, -3);
        check(new String[] {"7", "-2", "/"}, -3);
        check(new String[] {"-7", "-2", "/"}, 3);
        check(new String[] {"6", "-132", "/"}, 0);
        check(new String[] {"13", "5", "-"}, 8);
        check(new String[] {"-1", "-1", "-"}, 0);
        check(new String[] {"0", "5", "/"}, 0);

        // Values at the 32-bit edges: 200^4 = 1.6e9 fits; build -2^31 exactly and 2^31 - 1 exactly
        check(new String[] {"200", "200", "*", "200", "*", "200", "*"}, 1_600_000_000L);
        check(new String[] {"-200", "200", "*", "200", "*", "200", "*"}, -1_600_000_000L);
        check(powerOfTwoTokens(31, true), Integer.MIN_VALUE);           // -(2^31)
        List<String> max = new ArrayList<>(List.of(powerOfTwoTokens(30, false)));
        max.add("1");
        max.add("-");
        max.addAll(List.of(powerOfTwoTokens(30, false)));
        max.add("+");
        check(max.toArray(new String[0]), Integer.MAX_VALUE);           // (2^30 - 1) + 2^30

        // Largest inputs, n = 9999 (n must be odd for a valid expression)
        check(leftDeep(5000), sumLeftDeep(5000));
        check(rightDeep(5000), sumRightDeep(5000));
        String[] alternating = new String[9999];
        alternating[0] = "200";
        for (int i = 1; i < 9999; i += 2) {
            alternating[i] = "-200";
            alternating[i + 1] = "-";
        }
        check(alternating, 200 + 4999L * 200);

        // Random expression trees against their tree value
        Random random = new Random(20261114L);
        for (int t = 0; t < 3000; t++) {
            int leaves = 1 + random.nextInt(t < 2500 ? 8 : 2500);
            Expr e = randomTree(random, leaves);
            check(e.tokens.toArray(new String[0]), e.value);
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Tokens for 2^k (or -(2^k)) built from 2s with "*"; k <= 31 with negative, k <= 30 otherwise. */
    static String[] powerOfTwoTokens(int k, boolean negative) {
        List<String> t = new ArrayList<>();
        t.add(negative ? "-2" : "2");
        for (int i = 1; i < k; i++) {
            t.add("2");
            t.add("*");
        }
        return t.toArray(new String[0]);
    }

    /** "v1 v2 + v3 + ... vn +" with values cycling over 1..200. */
    static String[] leftDeep(int numbers) {
        List<String> t = new ArrayList<>();
        t.add("1");
        for (int i = 2; i <= numbers; i++) {
            t.add(String.valueOf(1 + (i - 1) % 200));
            t.add(i % 2 == 0 ? "+" : "-");
        }
        return t.toArray(new String[0]);
    }

    static long sumLeftDeep(int numbers) {
        long v = 1;
        for (int i = 2; i <= numbers; i++) v = i % 2 == 0 ? v + (1 + (i - 1) % 200) : v - (1 + (i - 1) % 200);
        return v;
    }

    /** "v1 v2 ... vn - - ... -": v1 - (v2 - (v3 - ... vn)). */
    static String[] rightDeep(int numbers) {
        List<String> t = new ArrayList<>();
        for (int i = 1; i <= numbers; i++) t.add(String.valueOf(i % 200 - 100));
        for (int i = 1; i < numbers; i++) t.add("-");
        return t.toArray(new String[0]);
    }

    static long sumRightDeep(int numbers) {
        long v = numbers % 200 - 100;
        for (int i = numbers - 1; i >= 1; i--) v = (i % 200 - 100) - v;
        return v;
    }

    /** A random tree with the given number of leaves; every node's value fits in an int. */
    static Expr randomTree(Random random, int leaves) {
        if (leaves == 1) {
            int v = random.nextInt(401) - 200;
            List<String> t = new ArrayList<>();
            t.add(String.valueOf(v));
            return new Expr(t, v);
        }
        int left = 1 + random.nextInt(leaves - 1);
        Expr a = randomTree(random, left);
        Expr b = randomTree(random, leaves - left);
        List<String> ops = new ArrayList<>();
        for (String op : new String[] {"+", "-", "*", "/"}) {
            if (op.equals("/") && b.value == 0) continue;
            long r = apply(op, a.value, b.value);
            if (r >= Integer.MIN_VALUE && r <= Integer.MAX_VALUE) ops.add(op);
        }
        // One of a+b and a-b always fits: same signs make a-b fit, opposite signs make a+b fit.
        String op = ops.get(random.nextInt(ops.size()));
        List<String> t = new ArrayList<>(a.tokens);
        t.addAll(b.tokens);
        t.add(op);
        return new Expr(t, apply(op, a.value, b.value));
    }

    static long apply(String op, long a, long b) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            default: return a / b; // long division also truncates toward zero
        }
    }

    static boolean isOperator(String t) {
        return t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/");
    }

    /** Independent validity check: counts, number range, and every intermediate value via a long stack. */
    static long validate(String[] tokens) {
        if (tokens.length < 1 || tokens.length > 10_000) throw new IllegalStateException("bad test case: length");
        long[] st = new long[tokens.length];
        int top = 0;
        for (String t : tokens) {
            if (isOperator(t)) {
                if (top < 2) throw new IllegalStateException("bad test case: not valid RPN");
                long b = st[--top], a = st[--top];
                if (t.equals("/") && b == 0) throw new IllegalStateException("bad test case: division by zero");
                long r = apply(t, a, b);
                if (r < Integer.MIN_VALUE || r > Integer.MAX_VALUE) throw new IllegalStateException("bad test case: value outside 32 bits");
                st[top++] = r;
            } else {
                long v = Long.parseLong(t);
                if (v < -200 || v > 200) throw new IllegalStateException("bad test case: number out of range");
                st[top++] = v;
            }
        }
        if (top != 1) throw new IllegalStateException("bad test case: not valid RPN");
        return st[0];
    }

    static void check(String[] tokens, long expected) {
        String label = tokens.length > 15 ? "length " + tokens.length : String.join(" ", tokens);
        if (validate(tokens) != expected) throw new IllegalStateException(label + ": bad test case, the stated answer is wrong");
        int got = new Solution().evalRPN(tokens.clone());
        if (got != expected) throw new AssertionError(label + ": expected " + expected + " but got " + got);
        cases++;
    }
}
