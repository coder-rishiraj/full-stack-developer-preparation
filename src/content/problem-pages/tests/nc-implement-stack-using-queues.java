import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Random;

/**
 * Tests for every "class MyStack" on the Implement Stack using Queues page (run by
 * `npm run problems:verify`). Every call is checked against java.util.ArrayDeque used as a stack.
 */
class Tests {
    static final int MAX_CALLS = 100;
    static int cases = 0;

    /** One MyStack under test, driven in lockstep with a reference stack. */
    static final class Run {
        final String label;
        final MyStack stack = new MyStack();
        final Deque<Integer> reference = new ArrayDeque<>();
        int calls = 0;

        Run(String label) {
            this.label = label;
        }

        void count() {
            if (++calls > MAX_CALLS) {
                throw new IllegalStateException(label + ": bad test case, more than 100 calls");
            }
        }

        void requireNonEmpty(String op) {
            // Guard: the problem promises pop and top are only called on a non-empty stack.
            if (reference.isEmpty()) {
                throw new IllegalStateException(label + ": bad test case, " + op + " on an empty stack");
            }
        }

        Run push(int x) {
            count();
            if (x < 1 || x > 9) {
                throw new IllegalStateException(label + ": bad test case, x = " + x);
            }
            stack.push(x);
            reference.push(x);
            return this;
        }

        Run pop(int expected) {
            count();
            requireNonEmpty("pop");
            int want = reference.pop();
            if (want != expected) {
                throw new IllegalStateException(label + ": bad test case, pop should be " + want);
            }
            int got = stack.pop();
            if (got != expected) {
                throw new AssertionError(label + ": pop expected " + expected + " but got " + got);
            }
            return this;
        }

        Run pop() {
            requireNonEmpty("pop");
            return pop(reference.peek());
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

        Run empty(boolean expected) {
            count();
            if (reference.isEmpty() != expected) {
                throw new IllegalStateException(label + ": bad test case, empty should be " + reference.isEmpty());
            }
            boolean got = stack.empty();
            if (got != expected) {
                throw new AssertionError(label + ": empty expected " + expected + " but got " + got);
            }
            return this;
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // Example in section 1 (the LeetCode example)
        new Run("example").push(1).push(2).top(2).pop(2).empty(false).done();

        // Dry runs
        new Run("approach 1 dry run").push(1).push(2).push(3).top(3).pop(3).pop(2).empty(false).done();
        new Run("approach 2 dry run").push(1).push(2).push(3).pop(3).top(2).done();
        new Run("approach 3 dry run").push(1).push(2).push(3).top(3).pop(3).push(4).pop(4).empty(false)
                .top(2).pop(2).pop(1).empty(true).done();

        // Edge cases from sections 3 and 7
        new Run("fresh stack is empty").empty(true).done();
        new Run("one element").push(5).pop(5).empty(true).done();
        new Run("empty then reuse").push(5).pop(5).empty(true).push(7).top(7).empty(false).pop(7).empty(true).done();
        new Run("top twice").push(1).push(2).push(3).top(3).top(3).pop(3).top(2).done();
        new Run("repeated values").push(4).push(4).push(4).pop(4).top(4).pop(4).pop(4).empty(true).done();

        // Constraint extremes: exactly 100 calls
        Run deep = new Run("50 pushes then 50 pops");
        for (int i = 0; i < 50; i++) {
            deep.push(1 + i % 9);
        }
        for (int i = 0; i < 50; i++) {
            deep.pop();
        }
        deep.done();
        Run alternating = new Run("100 calls alternating push/top");
        for (int i = 0; i < 50; i++) {
            alternating.push(9 - i % 9).top();
        }
        alternating.done();

        // Random operation sequences, at most 100 calls each
        Random random = new Random(20261114L);
        for (int t = 0; t < 2_000; t++) {
            Run run = new Run("random run " + t);
            int calls = 1 + random.nextInt(MAX_CALLS);
            for (int i = 0; i < calls; i++) {
                int op = random.nextInt(run.reference.isEmpty() ? 2 : 5);
                if (op == 0 || (op >= 2 && op <= 3 && random.nextBoolean())) {
                    run.push(1 + random.nextInt(9));
                } else if (op == 1) {
                    run.empty(run.reference.isEmpty());
                } else if (op == 2 || op == 3) {
                    run.pop();
                } else {
                    run.top();
                }
            }
            run.done();
        }

        System.out.println("PASS " + cases + " cases");
    }
}
