import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Tests for every "class FreqStack" on the Maximum Frequency Stack page (run by `npm run problems:verify`).
 * Each FreqStack runs in lockstep with a brute-force reference: a plain list of the live pushes. The
 * reference recounts every value on each pop, takes the highest count, and removes the occurrence of
 * such a value that is closest to the top.
 */
class Tests {
    static final int MAX_VAL = 1_000_000_000;
    static final int MAX_CALLS = 20_000;
    static int cases = 0;

    static final class Run {
        final String label;
        final FreqStack stack = new FreqStack();
        final List<Integer> reference = new ArrayList<>();
        int calls = 0;

        Run(String label) {
            this.label = label;
        }

        void count() {
            // Guard against a wrong test: the problem allows at most 2 * 10^4 calls in total.
            if (++calls > MAX_CALLS) {
                throw new IllegalStateException(label + ": bad test case, more than 2 * 10^4 calls");
            }
        }

        Run push(int val) {
            count();
            if (val < 0 || val > MAX_VAL) {
                throw new IllegalStateException(label + ": bad test case, value " + val + " out of range");
            }
            stack.push(val);
            reference.add(val);
            return this;
        }

        Run pop(int expected) {
            count();
            if (reference.isEmpty()) {
                throw new IllegalStateException(label + ": bad test case, pop on an empty stack");
            }
            int want = referencePop();
            if (want != expected) {
                throw new IllegalStateException(label + ": bad test case, pop should return " + want);
            }
            int got = stack.pop();
            if (got != expected) {
                throw new AssertionError(label + ": call " + calls + ": pop expected " + expected + " but got " + got);
            }
            return this;
        }

        Run pop() {
            count();
            if (reference.isEmpty()) {
                throw new IllegalStateException(label + ": bad test case, pop on an empty stack");
            }
            int want = referencePop();
            int got = stack.pop();
            if (got != want) {
                throw new AssertionError(label + ": call " + calls + ": pop expected " + want + " but got " + got);
            }
            return this;
        }

        int referencePop() {
            Map<Integer, Integer> counts = new HashMap<>();
            int best = 0;
            for (int v : reference) {
                best = Math.max(best, counts.merge(v, 1, Integer::sum));
            }
            for (int i = reference.size() - 1; i >= 0; i--) {
                if (counts.get(reference.get(i)) == best) {
                    return reference.remove(i);
                }
            }
            throw new IllegalStateException("unreachable");
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // The example in section 1 (also the dry run)
        new Run("example").push(5).push(7).push(5).push(7).push(4).push(5)
                .pop(5).pop(7).pop(5).pop(4).done();

        // Edge cases from sections 3 and 7
        new Run("single").push(9).pop(9).done();
        new Run("all distinct: plain stack order").push(1).push(2).push(3).pop(3).pop(2).pop(1).done();
        new Run("all equal").push(4).push(4).push(4).pop(4).pop(4).pop(4).done();
        new Run("max freq drops by one").push(5).push(5).pop(5).pop(5).done();
        new Run("which copy is removed").push(1).push(2).push(1).pop(1).pop(2).pop(1).done();
        new Run("bucket-move mistake").push(5).push(7).push(5).pop(5).pop(7).pop(5).done();
        new Run("tie broken by latest copy").push(5).push(7).push(5).push(7).pop(7).pop(5).pop(7).pop(5).done();
        new Run("frequency beats recency").push(1).push(1).push(2).pop(1).pop(2).pop(1).done();
        new Run("push after pops").push(3).push(3).push(8).pop(3).push(8).pop(8).pop(8).pop(3).done();
        new Run("value extremes").push(0).push(MAX_VAL).push(0).push(MAX_VAL).push(MAX_VAL)
                .pop(MAX_VAL).pop(MAX_VAL).pop(0).pop(MAX_VAL).pop(0).done();
        new Run("emptied and reused").push(2).pop(2).push(6).push(6).pop(6).pop(6).push(1).pop(1).done();

        // Random sequences against the reference: small value ranges give many ties
        Random random = new Random(20261114L);
        for (int t = 0; t < 2000; t++) {
            Run run = new Run("random #" + t);
            int range = 1 + random.nextInt(t % 3 == 0 ? 3 : 10);
            int ops = 1 + random.nextInt(120);
            for (int k = 0; k < ops; k++) {
                if (run.reference.isEmpty() || random.nextInt(100) < 55) {
                    run.push(random.nextInt(range));
                } else {
                    run.pop();
                }
            }
            while (!run.reference.isEmpty() && run.calls < MAX_CALLS) {
                run.pop();
            }
            run.done();
        }

        // Largest: 2 * 10^4 calls
        Run same = new Run("10^4 pushes of one value, then 10^4 pops");
        for (int k = 0; k < 10_000; k++) {
            same.push(MAX_VAL);
        }
        for (int k = 0; k < 10_000; k++) {
            same.pop(MAX_VAL);
        }
        same.done();

        Run staircase = new Run("value v pushed v times, then pop everything");
        int pushed = 0;
        for (int v = 1; pushed + v <= 10_000; v++) {
            for (int k = 0; k < v; k++) {
                staircase.push(v);
            }
            pushed += v;
        }
        while (!staircase.reference.isEmpty()) {
            staircase.pop();
        }
        staircase.done();

        Run big = new Run("2 * 10^4 random calls");
        while (big.calls < MAX_CALLS) {
            if (big.reference.isEmpty() || random.nextInt(100) < 60) {
                big.push(random.nextInt(50) * 20_000_000);
            } else {
                big.pop();
            }
        }
        big.done();

        System.out.println("PASS " + cases + " cases");
    }
}
