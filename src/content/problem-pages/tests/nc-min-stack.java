import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Random;

/**
 * Tests for every "class MinStack" on the Min Stack page (run by `npm run problems:verify`).
 * Every call is checked against a reference: java.util.ArrayDeque used as a stack, with the
 * minimum found by scanning all elements.
 */
class Tests {
    static final int MAX_CALLS = 30_000;
    static final int MIN = Integer.MIN_VALUE;
    static final int MAX = Integer.MAX_VALUE;
    static int cases = 0;

    /** One MinStack under test, driven in lockstep with a reference stack. */
    static final class Run {
        final String label;
        final MinStack stack = new MinStack();
        final Deque<Integer> reference = new ArrayDeque<>();
        int calls = 0;

        Run(String label) {
            this.label = label;
        }

        void count() {
            if (++calls > MAX_CALLS) {
                throw new IllegalStateException(label + ": bad test case, more than 3*10^4 calls");
            }
        }

        void requireNonEmpty(String op) {
            // Guard: the problem promises pop, top and getMin only on a non-empty stack.
            if (reference.isEmpty()) {
                throw new IllegalStateException(label + ": bad test case, " + op + " on an empty stack");
            }
        }

        int referenceMin() {
            int min = MAX;
            for (int v : reference) {
                min = Math.min(min, v);
            }
            return min;
        }

        Run push(int val) {
            count();
            stack.push(val);
            reference.push(val);
            return this;
        }

        Run pop() {
            count();
            requireNonEmpty("pop");
            stack.pop();
            reference.pop();
            return this;
        }

        Run top(int expected) {
            count();
            requireNonEmpty("top");
            if (reference.peek() != expected) {
                throw new IllegalStateException(label + ": bad test case, top should be " + reference.peek());
            }
            int got = stack.top();
            if (got != expected) {
                throw new AssertionError(label + ": top expected " + expected + " but got " + got);
            }
            return this;
        }

        Run top() {
            requireNonEmpty("top");
            return top(reference.peek());
        }

        Run getMin(int expected) {
            count();
            requireNonEmpty("getMin");
            if (referenceMin() != expected) {
                throw new IllegalStateException(label + ": bad test case, getMin should be " + referenceMin());
            }
            int got = stack.getMin();
            if (got != expected) {
                throw new AssertionError(label + ": getMin expected " + expected + " but got " + got);
            }
            return this;
        }

        Run getMin() {
            requireNonEmpty("getMin");
            return getMin(referenceMin());
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // Example in section 1 (the LeetCode example); also the dry runs of approaches 1, 2 and the alternative
        new Run("example").push(-2).push(0).push(-3).getMin(-3).pop().top(0).getMin(-2).done();

        // Approach 3 dry run: duplicates of the minimum under a non-record value
        new Run("approach 3 dry run").push(5).push(3).push(3).push(7).getMin(3).pop().pop().getMin(3)
                .pop().getMin(5).top(5).done();

        // Mistakes in section 11
        new Run("< instead of <=").push(0).push(1).push(0).getMin(0).pop().getMin(0).top(1).done();
        new Run("Integer == outside the cache").push(1000).push(1000).pop().pop().push(2000).getMin(2000).done();
        new Run("int differences overflow").push(MIN).push(MAX).top(MAX).getMin(MIN).pop().top(MIN).done();
        new Run("int differences overflow, other order").push(MAX).push(MIN).top(MIN).getMin(MIN).pop()
                .top(MAX).getMin(MAX).done();

        // Edge cases from sections 3 and 7
        new Run("single element, then reuse").push(4).getMin(4).top(4).pop().push(9).getMin(9).top(9).done();
        new Run("all equal").push(7).push(7).push(7).getMin(7).pop().getMin(7).pop().getMin(7).top(7).done();
        new Run("extremes repeated").push(MAX).push(MAX).push(MIN).push(MIN).getMin(MIN).pop().getMin(MIN)
                .pop().getMin(MAX).top(MAX).pop().getMin(MAX).done();
        new Run("negative and zero").push(0).push(-1).push(0).getMin(-1).pop().getMin(-1).pop().getMin(0).done();

        // Constraint extremes: 3*10^4 calls, decreasing and increasing pushes
        Run decreasing = new Run("10^4 decreasing pushes");
        for (int i = 0; i < 10_000; i++) {
            decreasing.push(MAX - i * 214_748);
        }
        for (int i = 0; i < 9_999; i++) {
            decreasing.pop().getMin(MAX - (9_998 - i) * 214_748);
        }
        decreasing.done();
        Run increasing = new Run("10^4 increasing pushes from MIN");
        for (int i = 0; i < 10_000; i++) {
            increasing.push(MIN + i);
        }
        for (int i = 0; i < 9_999; i++) {
            increasing.pop().getMin(MIN);
        }
        increasing.done();

        Random random = new Random(20261114L);
        // One full-size random run: 3*10^4 calls with values over the whole int range
        randomRun(random, "3*10^4 calls, full range", MAX_CALLS, true);
        // Many short random runs with small values, so duplicates of the minimum are frequent
        for (int t = 0; t < 2_000; t++) {
            randomRun(random, "random run " + t, 1 + random.nextInt(200), random.nextInt(4) == 0);
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void randomRun(Random random, String label, int calls, boolean fullRange) {
        Run run = new Run(label);
        for (int i = 0; i < calls; i++) {
            int op = run.reference.isEmpty() ? 0 : random.nextInt(4);
            if (op == 0) {
                int val;
                int pick = random.nextInt(20);
                if (pick == 0) {
                    val = MIN;
                } else if (pick == 1) {
                    val = MAX;
                } else {
                    val = fullRange ? random.nextInt() : random.nextInt(7) - 3;
                }
                run.push(val);
            } else if (op == 1) {
                run.pop();
            } else if (op == 2) {
                run.top();
            } else {
                run.getMin();
            }
        }
        run.done();
    }
}
