import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class TimeMap" on the Time Based Key-Value Store page (run by
 * `npm run problems:verify`). Each run drives one TimeMap and a brute-force reference in lockstep:
 * the reference keeps every set call in one list and answers get by scanning all of them for the
 * same key with the largest timestamp <= the query. Only the public API is called.
 */
class Tests {
    static final int MAX_TIME = 10_000_000;
    static final int MAX_CALLS = 200_000;
    static int cases = 0;

    static final class Run {
        final String label;
        final TimeMap map = new TimeMap();
        final List<String[]> sets = new ArrayList<>(); // {key, value, timestamp}
        int lastSet = 0;
        int calls = 0;
        final boolean useReference;

        Run(String label) {
            this(label, true);
        }

        Run(String label, boolean useReference) {
            this.label = label;
            this.useReference = useReference;
        }

        static void validString(String s) {
            if (s.length() < 1 || s.length() > 100) throw new IllegalStateException("bad test case: length " + s.length());
            for (char c : s.toCharArray()) {
                if (!(c >= 'a' && c <= 'z') && !(c >= '0' && c <= '9')) {
                    throw new IllegalStateException("bad test case: character '" + c + "'");
                }
            }
        }

        void count(int timestamp) {
            // Guard: the problem promises 1 <= timestamp <= 10^7 and at most 2 * 10^5 calls.
            if (timestamp < 1 || timestamp > MAX_TIME) throw new IllegalStateException("bad test case: timestamp " + timestamp);
            if (++calls > MAX_CALLS) throw new IllegalStateException(label + ": bad test case, too many calls");
        }

        Run set(String key, String value, int timestamp) {
            count(timestamp);
            validString(key);
            validString(value);
            // Guard: set timestamps are strictly increasing.
            if (timestamp <= lastSet) throw new IllegalStateException(label + ": bad test case, timestamps must increase");
            lastSet = timestamp;
            map.set(key, value, timestamp);
            if (useReference) sets.add(new String[] {key, value, Integer.toString(timestamp)});
            return this;
        }

        String reference(String key, int timestamp) {
            String best = "";
            int bestTime = 0;
            for (String[] s : sets) {
                int t = Integer.parseInt(s[2]);
                if (s[0].equals(key) && t <= timestamp && t > bestTime) {
                    bestTime = t;
                    best = s[1];
                }
            }
            return best;
        }

        Run get(String key, int timestamp, String expected) {
            count(timestamp);
            validString(key);
            if (useReference) {
                String want = reference(key, timestamp);
                if (expected != null && !expected.equals(want)) {
                    throw new IllegalStateException(label + ": bad test case, get should be \"" + want + "\"");
                }
                expected = want;
            }
            String got = map.get(key, timestamp);
            if (!expected.equals(got)) {
                throw new AssertionError(label + ": get(\"" + key + "\", " + timestamp + ") expected \"" + expected
                        + "\" but got \"" + got + "\"");
            }
            return this;
        }

        Run get(String key, int timestamp) {
            return get(key, timestamp, null);
        }

        void done() {
            cases++;
        }
    }

    public static void main(String[] args) {
        // Example in section 1 (the official example)
        new Run("example 1").set("foo", "bar", 1).get("foo", 1, "bar").get("foo", 3, "bar").set("foo", "bar2", 4)
                .get("foo", 4, "bar2").get("foo", 5, "bar2").done();
        // Example 2 and the dry runs: two keys, queries before, between, on and after the set times
        new Run("dry run").set("love", "high", 10).set("love", "low", 20).set("mood", "calm", 25)
                .get("love", 5, "").get("love", 10, "high").get("love", 15, "high").get("love", 20, "low")
                .get("love", 25, "low").get("mood", 24, "").get("mood", 30, "calm").get("hate", 30, "").done();
        // The five-version dry run in section 4: between versions, before the first, exactly on the last
        new Run("five versions").set("k", "a", 2).set("k", "b", 4).set("k", "c", 7).set("k", "d", 9).set("k", "e", 12)
                .get("k", 8, "c").get("k", 1, "").get("k", 12, "e").get("k", 2, "a").get("k", 13, "e").done();

        // Edge cases from section 3
        new Run("unknown key").get("abc", 1, "").get("abc", MAX_TIME, "").done();
        new Run("before first").set("k", "v", 5).get("k", 4, "").get("k", 1, "").get("k", 5, "v").done();
        new Run("timestamp extremes").set("k", "first", 1).set("k", "last", MAX_TIME).get("k", 1, "first")
                .get("k", MAX_TIME - 1, "first").get("k", MAX_TIME, "last").done();
        new Run("same value twice").set("a", "x", 1).set("a", "x", 2).set("a", "y", 3).get("a", 2, "x").get("a", 3, "y").done();
        new Run("key equals a value").set("a1", "b2", 3).set("b2", "a1", 4).get("a1", 4, "b2").get("b2", 3, "").done();
        String long1 = "z".repeat(100);
        String long2 = "0123456789".repeat(10);
        new Run("100-char strings").set(long1, long2, 7).set(long2, long1, 8).get(long1, 9, long2).get(long2, 9, long1)
                .get(long1 + "", 6, "").done();
        // A key equal in content but a different String object must still be found
        new Run("equal strings").set(new String("key"), "v", 2).get(new StringBuilder("ke").append('y').toString(), 3, "v").done();
        // Single-element history: one probe, both sides
        new Run("one version").set("p", "q", 100).get("p", 99, "").get("p", 100, "q").get("p", 101, "q").done();

        // Random operation sequences against the brute-force reference
        Random random = new Random(20261114L);
        for (int trial = 0; trial < 400; trial++) {
            Run run = new Run("random " + trial);
            int keys = 1 + random.nextInt(5);
            int time = random.nextInt(5);
            int ops = 1 + random.nextInt(120);
            for (int op = 0; op < ops; op++) {
                String key = "k" + random.nextInt(keys);
                if (random.nextInt(3) == 0) {
                    time += 1 + random.nextInt(trial % 2 == 0 ? 3 : 1000);
                    run.set(key, randomString(random), time);
                } else {
                    run.get(key, 1 + random.nextInt(time + 5));
                }
            }
            run.done();
        }

        // Largest load: 10^5 sets on one key with gaps, then 10^5 gets (2 * 10^5 calls in total).
        // Expected answers are computed from the construction, not from the brute-force reference.
        Run big = new Run("2 * 10^5 calls", false);
        int sets = 100_000;
        String[] values = new String[sets];
        for (int i = 0; i < sets; i++) {
            values[i] = "v" + i;
            big.set("hot", values[i], 100 * (i + 1));          // timestamps 100, 200, ..., 10^7
        }
        for (int q = 0; q < 100_000; q++) {
            int t = 1 + random.nextInt(MAX_TIME);
            String expected = t < 100 ? "" : values[t / 100 - 1];
            big.get("hot", t, expected);
        }
        big.done();

        // Many keys with one version each, plus misses
        Run many = new Run("many keys", false);
        for (int i = 1; i <= 50_000; i++) many.set("key" + i, "val" + i, 2 * i);
        for (int i = 1; i <= 50_000; i++) {
            many.get("key" + i, 2 * i - 1, "");
            many.get("key" + i, 2 * i + random.nextInt(1000), "val" + i);
        }
        many.get("nokey", MAX_TIME, "").done();

        System.out.println("PASS " + cases + " cases");
    }

    static String randomString(Random random) {
        String alphabet = "abc123";
        int len = 1 + random.nextInt(4);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) sb.append(alphabet.charAt(random.nextInt(alphabet.length())));
        return sb.toString();
    }
}
