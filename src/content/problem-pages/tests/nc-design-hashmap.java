import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * Tests for every "class MyHashMap" on the Design HashMap page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases. Every call is checked
 * against java.util.HashMap as the reference (allowed in the tests, not in the solution).
 */
class Tests {
    static final int MAX = 1_000_000; // largest key and largest value
    static final int MAX_CALLS = 10_000;
    static int cases = 0;

    /** One MyHashMap under test, driven in lockstep with a reference map. */
    static final class Run {
        final String label;
        final MyHashMap map = new MyHashMap();
        final Map<Integer, Integer> reference = new HashMap<>();
        int calls = 0;

        Run(String label) {
            this.label = label;
        }

        void count(int key) {
            // Guard against a wrong test: the problem promises 0 <= key <= 10^6 and at most 10^4 calls.
            if (key < 0 || key > MAX) {
                throw new IllegalStateException(label + ": bad test case, key " + key + " out of range");
            }
            if (++calls > MAX_CALLS) {
                throw new IllegalStateException(label + ": bad test case, more than 10^4 calls");
            }
        }

        Run put(int key, int value) {
            count(key);
            if (value < 0 || value > MAX) {
                throw new IllegalStateException(label + ": bad test case, value " + value + " out of range");
            }
            map.put(key, value);
            reference.put(key, value);
            return this;
        }

        Run remove(int key) {
            count(key);
            map.remove(key);
            reference.remove(key);
            return this;
        }

        Run get(int key, int expected) {
            count(key);
            int want = reference.getOrDefault(key, -1);
            if (want != expected) {
                throw new IllegalStateException(label + ": bad test case, get(" + key + ") should be " + want);
            }
            int got = map.get(key);
            if (got != expected) {
                throw new AssertionError(label + ": get(" + key + ") expected " + expected + " but got " + got);
            }
            return this;
        }

        Run get(int key) {
            return get(key, reference.getOrDefault(key, -1));
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // The example in section 1
        new Run("example").put(4, 40).put(8, 80).get(4, 40).put(4, 0).get(4, 0).remove(8).get(8, -1)
                .remove(5).get(4, 0).get(5, -1).done();

        // Dry runs: direct addressing, and chaining with 3 and 10010 sharing bucket 3
        new Run("direct dry run").put(4, 40).put(4, 0).get(4, 0).remove(8).get(8, -1).done();
        new Run("chaining dry run").put(3, 30).put(10010, 7).put(3, 31).get(10010, 7).get(3, 31)
                .remove(3).get(3, -1).get(10010, 7).remove(10010).get(10010, -1).done();

        // Edge cases from sections 3 and 7
        new Run("overwrite then remove").put(3, 30).put(3, 31).remove(3).get(3, -1).done();
        new Run("get and remove on an empty map").get(0, -1).get(MAX, -1).remove(0).remove(MAX).get(5, -1).done();
        new Run("remove twice, then re-put").put(6, 60).remove(6).remove(6).get(6, -1).put(6, 61).get(6, 61).done();
        new Run("extreme keys and values").put(0, MAX).put(MAX, 0).get(0, MAX).get(MAX, 0)
                .put(0, 0).get(0, 0).remove(MAX).get(MAX, -1).get(0, 0).done();
        new Run("LeetCode example").put(1, 1).put(2, 2).get(1, 1).get(3, -1).put(2, 1).get(2, 1)
                .remove(2).get(2, -1).done();

        // Many keys in one bucket (remainder 0 mod 10007): head, middle and tail removals, updates
        Run chain = new Run("100 colliding keys");
        for (int j = 0; j <= 99; j++) {
            chain.put(j * 10_007, j);
        }
        for (int j = 0; j <= 99; j += 3) {
            chain.put(j * 10_007, MAX - j);
        }
        chain.remove(99 * 10_007).remove(0).remove(50 * 10_007).remove(12_345);
        for (int j = 0; j <= 99; j++) {
            chain.get(j * 10_007);
        }
        chain.done();

        // Largest workloads: exactly 10^4 calls
        Random random = new Random(20261113L);
        randomRun(random, "10^4 calls, full key range", MAX_CALLS, MAX + 1);
        randomRun(random, "10^4 calls, keys 0..99", MAX_CALLS, 100);

        // Random operation sequences with many overwrites and absent removes
        for (int t = 0; t < 500; t++) {
            randomRun(random, "random run " + t, 1 + random.nextInt(300), 1 + random.nextInt(40));
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void randomRun(Random random, String label, int calls, int keyRange) {
        Run run = new Run(label);
        for (int i = 0; i < calls; i++) {
            int key = random.nextInt(keyRange);
            if (random.nextInt(10) == 0) {
                key = random.nextBoolean() ? 0 : MAX;
            }
            int op = random.nextInt(3);
            if (op == 0) {
                int value = random.nextInt(4) == 0 ? (random.nextBoolean() ? 0 : MAX) : random.nextInt(MAX + 1);
                run.put(key, value);
            } else if (op == 1) {
                run.remove(key);
            } else {
                run.get(key);
            }
        }
        run.done();
    }
}
