import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Verifying An Alien Dictionary page (run by
 * `npm run problems:verify`). Each approach is compiled together with this file and must pass all cases.
 * Random cases are checked against an independent brute force: every pair i < j compared by
 * translating both words to the normal alphabet.
 */
class Tests {
    static int cases = 0;
    static final String AZ = "abcdefghijklmnopqrstuvwxyz";

    public static void main(String[] args) {
        // Official examples (Example 1 and 2 of section 1 are the official 2 and 3)
        check(new String[] {"hello", "leetcode"}, "hlabcdefgijkmnopqrstuvwxyz", true);
        check(new String[] {"word", "world", "row"}, "worldabcefghijkmnpqstuvxyz", false);
        check(new String[] {"apple", "app"}, AZ, false);

        // Dry-run input of Approaches 1 and 3
        check(new String[] {"wow", "word", "row"}, "worldabcefghijkmnpqstuvxyz", true);

        // Edge cases from section 3, traced in section 7
        check(new String[] {"app", "apple"}, AZ, true);              // prefix in the right order
        check(new String[] {"abc", "abc"}, AZ, true);                // equal neighbours
        check(new String[] {"ab", "ba"}, AZ, true);                  // later letters disagree
        check(new String[] {"z"}, AZ, true);                         // one word
        check(new String[] {"a", "b", "c", "b"}, AZ, false);         // failure between the last two words
        check(new String[] {"row", "word"}, "worldabcefghijkmnpqstuvxyz", false); // inverse-table bug input
        check(new String[] {"a", "b"}, new StringBuilder(AZ).reverse().toString(), false);
        check(new String[] {"b", "a"}, new StringBuilder(AZ).reverse().toString(), true);
        check(new String[] {"kuvp", "q"}, "ngxlkthsjuoqcpavbfdermiywz", true);
        check(new String[] {"aa", "a"}, AZ, false);
        check(new String[] {"a", "aa", "aaa"}, AZ, true);

        // Largest input: 100 words of 20 letters, sorted (worst case: no early exit), and with
        // one inversion at the very end.
        Random random = new Random(20261116L);
        String order = shuffledAlphabet(random);
        List<String> big = new ArrayList<>();
        for (int i = 0; i < 100; i++) big.add(randomWord(random, 20, 26));
        big.sort((x, y) -> translate(x, order).compareTo(translate(y, order)));
        String[] sorted = big.toArray(new String[0]);
        check(sorted, order, true);
        String[] broken = sorted.clone();
        String tmp = broken[98];
        broken[98] = broken[99];
        broken[99] = tmp;
        check(broken, order, brute(broken, order));
        String[] same = new String[100];
        for (int i = 0; i < 100; i++) same[i] = "z".repeat(20);
        check(same, AZ, true);

        // Random small inputs over a small alphabet (many prefixes and ties) against the brute force
        for (int t = 0; t < 5000; t++) {
            String o = random.nextInt(4) == 0 ? AZ : shuffledAlphabet(random);
            int n = 1 + random.nextInt(6);
            int alphabet = 1 + random.nextInt(3);
            String[] words = new String[n];
            for (int i = 0; i < n; i++) words[i] = randomWord(random, 1 + random.nextInt(4), alphabet);
            if (random.nextBoolean()) {
                // Sort by the alien order, then maybe swap one pair, so true cases are common.
                List<String> list = new ArrayList<>(List.of(words));
                list.sort((x, y) -> translate(x, o).compareTo(translate(y, o)));
                words = list.toArray(new String[0]);
                if (n > 1 && random.nextBoolean()) Collections.swap(list, 0, n - 1);
                words = list.toArray(new String[0]);
            }
            check(words, o, brute(words, o));
        }

        // Guard: the test inputs must respect the constraints
        try {
            validate(new String[] {"abc"}, "abc");
            throw new AssertionError("validate should reject an order that is not a permutation");
        } catch (IllegalStateException expected) {
            cases++;
        }

        System.out.println("PASS " + cases + " cases");
    }

    static void validate(String[] words, String order) {
        if (words.length < 1 || words.length > 100) throw new IllegalStateException("bad test case: " + words.length + " words");
        if (order.length() != 26) throw new IllegalStateException("bad test case: order length " + order.length());
        boolean[] seen = new boolean[26];
        for (char c : order.toCharArray()) {
            if (c < 'a' || c > 'z' || seen[c - 'a']) throw new IllegalStateException("bad test case: order not a permutation");
            seen[c - 'a'] = true;
        }
        for (String w : words) {
            if (w.length() < 1 || w.length() > 20) throw new IllegalStateException("bad test case: word length " + w.length());
            for (char c : w.toCharArray()) {
                if (c < 'a' || c > 'z') throw new IllegalStateException("bad test case: character " + c);
            }
        }
    }

    static void check(String[] words, String order, boolean expected) {
        validate(words, order);
        if (brute(words, order) != expected) throw new IllegalStateException("bad test case: expected value disagrees with brute force");
        String[] copy = words.clone();
        boolean got = new Solution().isAlienSorted(copy, order);
        if (got != expected) {
            throw new AssertionError("isAlienSorted(" + String.join(",", words) + ", " + order + ") = " + got + ", expected " + expected);
        }
        cases++;
    }

    static String translate(String w, String order) {
        StringBuilder sb = new StringBuilder();
        for (char c : w.toCharArray()) sb.append((char) ('a' + order.indexOf(c)));
        return sb.toString();
    }

    static boolean brute(String[] words, String order) {
        for (int i = 0; i < words.length; i++) {
            for (int j = i + 1; j < words.length; j++) {
                if (translate(words[i], order).compareTo(translate(words[j], order)) > 0) return false;
            }
        }
        return true;
    }

    static String shuffledAlphabet(Random random) {
        List<Character> letters = new ArrayList<>();
        for (char c = 'a'; c <= 'z'; c++) letters.add(c);
        Collections.shuffle(letters, random);
        StringBuilder sb = new StringBuilder();
        for (char c : letters) sb.append(c);
        return sb.toString();
    }

    static String randomWord(Random random, int length, int alphabet) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) sb.append((char) ('a' + random.nextInt(alphabet)));
        return sb.toString();
    }
}
