import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Baseball Game page (run by `npm run problems:verify`).
 * Expected answers come from an independent reference: an ArrayList of long scores, simulated
 * directly from the statement and summed at the end. The reference also rejects test cases that
 * break the statement's guarantees (invalid operations, scores or answer outside 32 bits).
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs on the page
        check(new String[] {"5", "2", "C", "D", "+"}, 30);
        check(new String[] {"5", "-2", "4", "C", "D", "9", "+", "+"}, 27);
        check(new String[] {"1", "C"}, 0);

        // Edge cases from sections 3 and 7
        check(new String[] {"-3", "D"}, -9);
        check(new String[] {"7"}, 7);
        check(new String[] {"-30000"}, -30000);
        check(new String[] {"30000", "30000", "+"}, 120000);
        check(new String[] {"1", "2", "+", "C", "C", "C"}, 0);
        check(new String[] {"0", "D", "+"}, 0);
        check(new String[] {"4", "1", "C", "1", "+"}, 10);

        // Large values: the record's sum passes the int range in the middle, the answer does not
        List<String> ops = new ArrayList<>();
        ops.add("30000");
        for (int i = 0; i < 16; i++) ops.add("D");
        for (int i = 0; i < 16; i++) ops.add("C");
        check(ops.toArray(new String[0]), 30000);
        ops.clear();
        ops.add("30000");
        for (int i = 0; i < 15; i++) ops.add("D");
        check(ops.toArray(new String[0]), 30000L * ((1L << 16) - 1));
        ops.clear();
        ops.add("-30000");
        for (int i = 0; i < 15; i++) ops.add("D");
        check(ops.toArray(new String[0]), -30000L * ((1L << 16) - 1));

        // Largest n = 1000
        String[] big = new String[1000];
        for (int i = 0; i < 1000; i++) big[i] = i % 2 == 0 ? "30000" : "-29999";
        check(big, 500L * 30000 - 500L * 29999);
        String[] cancels = new String[1000];
        for (int i = 0; i < 1000; i++) cancels[i] = i < 500 ? String.valueOf(i - 250) : "C";
        check(cancels, 0);

        // Random valid inputs against the reference
        Random random = new Random(20261114L);
        for (int t = 0; t < 4000; t++) {
            int n = 1 + random.nextInt(t < 3000 ? 15 : 1000);
            String[] o = randomOps(random, n);
            if (o == null) continue;
            check(o, reference(o));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Random valid operations whose scores and answer fit in 32 bits, or null if none was found. */
    static String[] randomOps(Random random, int n) {
        String[] o = new String[n];
        List<Long> rec = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int size = rec.size();
            int kind = random.nextInt(5);
            String op;
            if (kind == 0 && size >= 2) op = "+";
            else if (kind == 1 && size >= 1) op = "D";
            else if (kind == 2 && size >= 1) op = "C";
            else op = String.valueOf(random.nextInt(60001) - 30000);
            long v;
            if (op.equals("+")) v = rec.get(size - 1) + rec.get(size - 2);
            else if (op.equals("D")) v = 2 * rec.get(size - 1);
            else if (op.equals("C")) v = 0;
            else v = Long.parseLong(op);
            if (v > Integer.MAX_VALUE || v < Integer.MIN_VALUE) {
                op = "C";
                if (size == 0) return null;
            }
            if (op.equals("C")) rec.remove(size - 1);
            else rec.add(v);
            o[i] = op;
        }
        try {
            reference(o);
        } catch (IllegalStateException e) {
            return null;
        }
        return o;
    }

    static long reference(String[] o) {
        if (o.length < 1 || o.length > 1000) throw new IllegalStateException("bad test case: length");
        List<Long> rec = new ArrayList<>();
        for (String op : o) {
            int size = rec.size();
            long v;
            if (op.equals("C")) {
                if (size < 1) throw new IllegalStateException("bad test case: C on empty record");
                rec.remove(size - 1);
                continue;
            } else if (op.equals("D")) {
                if (size < 1) throw new IllegalStateException("bad test case: D on empty record");
                v = 2 * rec.get(size - 1);
            } else if (op.equals("+")) {
                if (size < 2) throw new IllegalStateException("bad test case: + with fewer than two scores");
                v = rec.get(size - 1) + rec.get(size - 2);
            } else {
                v = Long.parseLong(op);
                if (v < -30000 || v > 30000) throw new IllegalStateException("bad test case: integer out of range");
            }
            if (v > Integer.MAX_VALUE || v < Integer.MIN_VALUE) throw new IllegalStateException("bad test case: score outside 32 bits");
            rec.add(v);
        }
        long sum = 0;
        for (long x : rec) sum += x;
        if (sum > Integer.MAX_VALUE || sum < Integer.MIN_VALUE) throw new IllegalStateException("bad test case: answer outside 32 bits");
        return sum;
    }

    static void check(String[] ops, long expected) {
        String label = ops.length > 12 ? "length " + ops.length : String.join(",", ops);
        if (reference(ops) != expected) throw new IllegalStateException(label + ": bad test case, the stated answer is wrong");
        int got = new Solution().calPoints(ops.clone());
        if (got != expected) throw new AssertionError(label + ": expected " + expected + " but got " + got);
        cases++;
    }
}
