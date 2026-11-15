import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Tests for every "public class Main" on the Repetitions page (run by `npm run problems:verify`).
 * Each program reads one DNA string and prints the length of its longest single-character run.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) throws Exception {
        // Example from the statement and the dry runs on the page
        check("ATTCGGGA", 3);
        check("CCAAAG", 3);

        // Edge cases from section 3 and section 7
        check("A", 1);                 // n = 1
        check("GGGG", 4);              // the whole string is one run
        check("ATTCGGG", 3);           // the longest run is at the very end
        check("ACGT", 1);              // no repeats at all
        check("ATATA", 1);             // equal letters that are not consecutive
        check("AAAC", 3);              // the longest run is at the start
        check("ATTTGGGC", 3);          // a tie: either run gives 3

        // Largest inputs: n = 10^6
        char[] same = new char[1_000_000];
        Arrays.fill(same, 'T');
        check(new String(same), 1_000_000);
        char[] alternating = new char[1_000_000];
        for (int i = 0; i < alternating.length; i++) alternating[i] = i % 2 == 0 ? 'A' : 'C';
        check(new String(alternating), 1);
        char[] tail = new char[1_000_000];
        for (int i = 0; i < tail.length; i++) tail[i] = i % 2 == 0 ? 'G' : 'T';
        Arrays.fill(tail, 999_000, 1_000_000, 'A');   // a run of 1000 at the very end
        check(new String(tail), 1000);

        // Random strings checked against an independent brute force over all substrings
        Random random = new Random(20261115L);
        String alphabet = "ACGT";
        for (int t = 0; t < 3000; t++) {
            int n = 1 + random.nextInt(t < 2500 ? 15 : 200);
            int letters = 1 + random.nextInt(4);   // fewer letters give longer runs
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append(alphabet.charAt(random.nextInt(letters)));
            String s = sb.toString();
            check(s, bruteForce(s));
        }

        // Timing at the largest size (the limit is 1 s per test)
        long start = System.nanoTime();
        run(new String(same) + "\n");
        run(new String(alternating) + "\n");
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > 1000) throw new AssertionError("too slow: " + ms + " ms");

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: try every substring and keep the longest whose characters are all equal. */
    static int bruteForce(String s) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                boolean allSame = true;
                for (int k = i; k <= j; k++) if (s.charAt(k) != s.charAt(i)) allSame = false;
                if (allSame) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }

    static void check(String s, int want) throws Exception {
        if (s.isEmpty() || s.length() > 1_000_000 || !s.matches("[ACGT]+")) {
            throw new IllegalStateException("bad test case: length " + s.length());
        }
        String label = s.length() <= 20 ? s : "length " + s.length();
        String got = run(s + "\n").trim();
        if (!got.equals(String.valueOf(want))) {
            throw new AssertionError(label + ": expected " + want + " but got \"" + got + "\"");
        }
        cases++;
    }

    static String run(String input) throws Exception {
        InputStream oldIn = System.in;
        PrintStream oldOut = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.US_ASCII)));
            System.setOut(new PrintStream(buf, true, "US-ASCII"));
            Main.main(new String[0]);
        } finally {
            System.setIn(oldIn);
            System.setOut(oldOut);
        }
        return buf.toString("US-ASCII");
    }
}
