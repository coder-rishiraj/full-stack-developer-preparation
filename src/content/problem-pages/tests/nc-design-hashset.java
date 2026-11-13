import java.util.HashSet;
import java.util.Random;
import java.util.Set;

/**
 * Tests for every "class MyHashSet" on the Design HashSet page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases. Every call is checked
 * against java.util.HashSet as the reference (allowed in the tests, not in the solution).
 */
class Tests {
    static final int MAX_KEY = 1_000_000;
    static final int MAX_CALLS = 10_000;
    static int cases = 0;

    /** One MyHashSet under test, driven in lockstep with a reference set. */
    static final class Run {
        final String label;
        final MyHashSet set = new MyHashSet();
        final Set<Integer> reference = new HashSet<>();
        int calls = 0;

        Run(String label) {
            this.label = label;
        }

        void count(int key) {
            // Guard against a wrong test: the problem promises 0 <= key <= 10^6 and at most 10^4 calls.
            if (key < 0 || key > MAX_KEY) {
                throw new IllegalStateException(label + ": bad test case, key " + key + " out of range");
            }
            if (++calls > MAX_CALLS) {
                throw new IllegalStateException(label + ": bad test case, more than 10^4 calls");
            }
        }

        Run add(int key) {
            count(key);
            set.add(key);
            reference.add(key);
            return this;
        }

        Run remove(int key) {
            count(key);
            set.remove(key);
            reference.remove(key);
            return this;
        }

        Run contains(int key, boolean expected) {
            count(key);
            if (reference.contains(key) != expected) {
                throw new IllegalStateException(label + ": bad test case, contains(" + key + ") should be " + reference.contains(key));
            }
            boolean got = set.contains(key);
            if (got != expected) {
                throw new AssertionError(label + ": contains(" + key + ") expected " + expected + " but got " + got);
            }
            return this;
        }

        Run contains(int key) {
            return contains(key, reference.contains(key));
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // The example in section 1
        new Run("example").add(5).add(9).contains(5, true).add(9).remove(9).contains(9, false)
                .remove(42).contains(5, true).contains(42, false).done();

        // Dry runs of each approach
        new Run("list dry run").add(5).add(9).add(9).remove(5).contains(5, false).contains(9, true).done();
        new Run("direct dry run").add(9).add(9).remove(9).contains(9, false).remove(42).contains(42, false).done();
        new Run("chaining dry run: 3 and 10010 share bucket 3")
                .add(3).add(10010).add(3).contains(10010, true).remove(3).contains(3, false)
                .contains(10010, true).remove(10010).contains(10010, false).contains(3, false).done();

        // Edge cases from sections 3 and 7
        new Run("remove on an empty set").remove(0).remove(MAX_KEY).contains(0, false).done();
        new Run("remove twice").add(4).remove(4).remove(4).contains(4, false).done();
        new Run("re-add after remove").add(7).remove(7).add(7).contains(7, true).done();
        new Run("extreme keys").add(0).add(MAX_KEY).contains(0, true).contains(MAX_KEY, true)
                .contains(1, false).contains(MAX_KEY - 1, false).remove(0).contains(0, false)
                .contains(MAX_KEY, true).remove(MAX_KEY).contains(MAX_KEY, false).done();
        new Run("LeetCode example").add(1).add(2).contains(1, true).contains(3, false).add(2)
                .contains(2, true).remove(2).contains(2, false).done();

        // Many keys in one bucket (every key with remainder 0 mod 10007): head, middle and tail removals
        Run chain = new Run("100 colliding keys");
        for (int j = 0; j <= 99; j++) {
            chain.add(j * 10_007);
        }
        for (int j = 0; j <= 99; j++) {
            chain.contains(j * 10_007, true);
        }
        chain.remove(99 * 10_007).remove(0).remove(50 * 10_007).remove(12_345);
        for (int j = 0; j <= 99; j++) {
            chain.contains(j * 10_007);
        }
        chain.done();

        // Largest workloads: exactly 10^4 calls, keys over the whole range and in a narrow range
        Random random = new Random(20261113L);
        randomRun(random, "10^4 calls, full key range", MAX_CALLS, MAX_KEY + 1);
        randomRun(random, "10^4 calls, keys 0..99", MAX_CALLS, 100);
        Run fill = new Run("10^4 distinct adds then checks");
        for (int i = 0; i < 5_000; i++) {
            fill.add(i * 200);
        }
        for (int i = 0; i < 5_000; i++) {
            fill.contains(i * 200 + (i % 2), i % 2 == 0);
        }
        fill.done();

        // Random operation sequences with many repeats and absent removes
        for (int t = 0; t < 500; t++) {
            randomRun(random, "random run " + t, 1 + random.nextInt(300), 1 + random.nextInt(40));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void randomRun(Random random, String label, int calls, int keyRange) {
        Run run = new Run(label);
        for (int i = 0; i < calls; i++) {
            int key = random.nextInt(keyRange);
            if (keyRange <= MAX_KEY && random.nextInt(10) == 0) {
                key = random.nextBoolean() ? 0 : MAX_KEY;
            }
            int op = random.nextInt(3);
            if (op == 0) {
                run.add(key);
            } else if (op == 1) {
                run.remove(key);
            } else {
                run.contains(key);
            }
        }
        run.done();
    }
}
