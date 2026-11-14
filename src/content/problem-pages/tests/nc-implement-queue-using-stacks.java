import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Random;

/**
 * Tests for every "class MyQueue" on the Implement Queue using Stacks page (run by
 * `npm run problems:verify`). Every call is checked against java.util.ArrayDeque used as a queue.
 */
class Tests {
    static final int MAX_CALLS = 100;
    static int cases = 0;

    /** One MyQueue under test, driven in lockstep with a reference queue. */
    static final class Run {
        final String label;
        final MyQueue queue = new MyQueue();
        final Queue<Integer> reference = new ArrayDeque<>();
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
            // Guard: the problem promises pop and peek are only called on a non-empty queue.
            if (reference.isEmpty()) {
                throw new IllegalStateException(label + ": bad test case, " + op + " on an empty queue");
            }
        }

        Run push(int x) {
            count();
            if (x < 1 || x > 9) {
                throw new IllegalStateException(label + ": bad test case, x = " + x);
            }
            queue.push(x);
            reference.offer(x);
            return this;
        }

        Run pop(int expected) {
            count();
            requireNonEmpty("pop");
            int want = reference.poll();
            if (want != expected) {
                throw new IllegalStateException(label + ": bad test case, pop should be " + want);
            }
            int got = queue.pop();
            if (got != expected) {
                throw new AssertionError(label + ": pop expected " + expected + " but got " + got);
            }
            return this;
        }

        Run pop() {
            requireNonEmpty("pop");
            return pop(reference.peek());
        }

        Run peek(int expected) {
            count();
            requireNonEmpty("peek");
            if (reference.peek() != expected) {
                throw new IllegalStateException(label + ": bad test case, peek should be " + reference.peek());
            }
            int got = queue.peek();
            if (got != expected) {
                throw new AssertionError(label + ": peek expected " + expected + " but got " + got);
            }
            return this;
        }

        Run peek() {
            requireNonEmpty("peek");
            return peek(reference.peek());
        }

        Run empty(boolean expected) {
            count();
            if (reference.isEmpty() != expected) {
                throw new IllegalStateException(label + ": bad test case, empty should be " + reference.isEmpty());
            }
            boolean got = queue.empty();
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
        // Example in section 1 (the LeetCode example) and approach 1's dry run
        new Run("example").push(1).push(2).peek(1).pop(1).empty(false).done();

        // Approach 2's dry run: a push while out still holds an older element
        new Run("lazy dry run").push(1).push(2).peek(1).pop(1).push(3).pop(2).pop(3).empty(true).done();
        // The bug in section 11: pouring into a non-empty out would return 3 here
        new Run("mistake case").push(1).push(2).pop(1).push(3).pop(2).done();

        // Edge cases from sections 3 and 7
        new Run("fresh queue is empty").empty(true).done();
        new Run("elements only in in").push(5).empty(false).pop(5).empty(true).push(6).peek(6).empty(false).done();
        new Run("peek twice").push(1).push(2).peek(1).peek(1).pop(1).peek(2).peek(2).done();
        new Run("repeated values").push(4).push(4).push(9).pop(4).push(4).pop(4).pop(9).pop(4).empty(true).done();

        // Constraint extremes: exactly 100 calls
        Run bulk = new Run("50 pushes then 50 pops");
        for (int i = 0; i < 50; i++) {
            bulk.push(1 + i % 9);
        }
        for (int i = 0; i < 50; i++) {
            bulk.pop();
        }
        bulk.done();
        Run interleaved = new Run("100 calls interleaved, out never empty for long");
        for (int i = 0; i < 25; i++) {
            interleaved.push(1 + i % 9).push(9 - i % 9).pop().peek();
        }
        interleaved.done();

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
                    run.peek();
                }
            }
            run.done();
        }

        System.out.println("PASS " + cases + " cases");
    }
}
