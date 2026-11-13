import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

/**
 * Tests for every "class Solution" on the Group Anagrams page (run by `npm run problems:verify`).
 * Each approach is compiled together with this file and must pass all cases.
 * Groups, and the strings inside a group, may come back in any order, so results are compared
 * after normalizing: each group sorted, then the list of groups sorted.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples and dry runs used on the page
        check(new String[] {"dusty", "study", "night", "thing", "act"},
                List.of(List.of("dusty", "study"), List.of("night", "thing"), List.of("act")));
        check(new String[] {"", "b", ""}, List.of(List.of("", ""), List.of("b")));

        // Edge cases listed in section 3 and traced in section 7
        check(new String[] {""}, List.of(List.of("")));                         // a single empty string
        check(new String[] {"a"}, List.of(List.of("a")));                       // a single string
        check(new String[] {"abc", "bca", "cab"}, List.of(List.of("abc", "bca", "cab"))); // one group
        check(new String[] {"ab", "cd", "ef"}, List.of(List.of("ab"), List.of("cd"), List.of("ef"))); // no two together
        check(new String[] {"eat", "eat", "tea"}, List.of(List.of("eat", "eat", "tea")));          // duplicate strings
        check(new String[] {"aab", "abb", "ab"}, List.of(List.of("aab"), List.of("abb"), List.of("ab"))); // same letters, different counts
        check(new String[] {"a", "aa"}, List.of(List.of("a"), List.of("aa")));  // different lengths
        // Counts 1 and 11 versus 11 and 1: a key without separators would merge these
        check(new String[] {"abbbbbbbbbbb", "aaaaaaaaaaab", "bbbbbbbbbbba"},
                List.of(List.of("aaaaaaaaaaab"), List.of("abbbbbbbbbbb", "bbbbbbbbbbba")));
        check(new String[] {"z", "zz", "zz"}, List.of(List.of("z"), List.of("zz", "zz")));

        Random random = new Random(20261113L);

        // Largest inputs: n = 10^4, strings of length 100
        int n = 10_000;
        String[] base = new String[100];
        for (int i = 0; i < base.length; i++) {
            base[i] = randomLetters(random, 100, 26);
        }
        String[] manyLong = new String[n];
        for (int i = 0; i < n; i++) {
            manyLong[i] = shuffle(base[random.nextInt(base.length)], random);
        }
        check(manyLong, reference(manyLong));                   // about 100 groups of long strings

        String[] oneGroup = new String[n];
        for (int i = 0; i < n; i++) {
            oneGroup[i] = shuffle(base[0], random);
        }
        check(oneGroup, reference(oneGroup));                   // everything in a single group

        String[] allEmpty = new String[n];
        Arrays.fill(allEmpty, "");
        check(allEmpty, reference(allEmpty));                   // n empty strings: one group

        Set<String> keys = new HashSet<>();
        List<String> distinct = new ArrayList<>();
        while (distinct.size() < n) {
            String s = randomLetters(random, 1 + random.nextInt(8), 26);
            if (keys.add(sortedKey(s))) {
                distinct.add(s);
            }
        }
        String[] allDistinct = distinct.toArray(new String[0]);
        check(allDistinct, reference(allDistinct));             // n groups of one string each

        // Random inputs checked against an independent brute force
        for (int r = 0; r < 1500; r++) {
            int length = 1 + random.nextInt(12);
            int letters = 1 + random.nextInt(3);
            String[] strs = new String[length];
            for (int i = 0; i < length; i++) {
                strs[i] = randomLetters(random, random.nextInt(5), letters);
            }
            check(strs, bruteForce(strs));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent check for small inputs: two strings are anagrams if crossing off letters one by one empties both. */
    static boolean sameLetters(String a, String b) {
        StringBuilder rest = new StringBuilder(b);
        for (int i = 0; i < a.length(); i++) {
            int at = rest.indexOf(String.valueOf(a.charAt(i)));
            if (at < 0) {
                return false;
            }
            rest.deleteCharAt(at);
        }
        return rest.length() == 0;
    }

    static List<List<String>> bruteForce(String[] strs) {
        List<List<String>> groups = new ArrayList<>();
        boolean[] used = new boolean[strs.length];
        for (int i = 0; i < strs.length; i++) {
            if (used[i]) {
                continue;
            }
            List<String> group = new ArrayList<>();
            for (int j = i; j < strs.length; j++) {
                if (!used[j] && sameLetters(strs[i], strs[j])) {
                    used[j] = true;
                    group.add(strs[j]);
                }
            }
            groups.add(group);
        }
        return groups;
    }

    /** Reference for large inputs (the small random cases use the brute force above). */
    static List<List<String>> reference(String[] strs) {
        Map<String, List<String>> byKey = new TreeMap<>();
        for (String s : strs) {
            byKey.computeIfAbsent(sortedKey(s), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(byKey.values());
    }

    static String sortedKey(String s) {
        char[] c = s.toCharArray();
        Arrays.sort(c);
        return new String(c);
    }

    static String randomLetters(Random random, int length, int letters) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append((char) ('a' + random.nextInt(letters)));
        }
        return sb.toString();
    }

    static String shuffle(String s, Random random) {
        char[] a = s.toCharArray();
        for (int i = a.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char c = a[i];
            a[i] = a[j];
            a[j] = c;
        }
        return new String(a);
    }

    static int compareGroups(List<String> a, List<String> b) {
        for (int i = 0; i < Math.min(a.size(), b.size()); i++) {
            int c = a.get(i).compareTo(b.get(i));
            if (c != 0) {
                return c;
            }
        }
        return Integer.compare(a.size(), b.size());
    }

    /** Sort each group, then sort the groups, so that two answers in different orders compare equal. */
    static List<List<String>> normalize(List<List<String>> groups) {
        List<List<String>> out = new ArrayList<>();
        for (List<String> g : groups) {
            if (g == null || g.isEmpty()) {
                throw new AssertionError("an empty or null group was returned");
            }
            List<String> copy = new ArrayList<>(g);
            Collections.sort(copy);
            out.add(copy);
        }
        out.sort(Tests::compareGroups);
        return out;
    }

    static void validate(String[] strs) {
        if (strs.length < 1 || strs.length > 10_000) {
            throw new IllegalStateException("bad test case: strs.length out of range");
        }
        for (String s : strs) {
            if (s.length() > 100) {
                throw new IllegalStateException("bad test case: a string is longer than 100");
            }
            for (int i = 0; i < s.length(); i++) {
                if (s.charAt(i) < 'a' || s.charAt(i) > 'z') {
                    throw new IllegalStateException("bad test case: not a lowercase English letter");
                }
            }
        }
    }

    static void check(String[] strs, List<List<String>> expected) {
        String label = strs.length <= 12 ? Arrays.toString(strs) : "strs.length=" + strs.length;
        validate(strs);
        // Guard against a wrong expected answer on small inputs.
        if (strs.length <= 12 && !normalize(bruteForce(strs)).equals(normalize(expected))) {
            throw new IllegalStateException(label + ": bad test case, expected groups are wrong");
        }
        String[] before = strs.clone();
        List<List<String>> result = new Solution().groupAnagrams(strs);
        if (result == null) {
            throw new AssertionError(label + ": returned null");
        }
        List<List<String>> got = normalize(result);
        List<List<String>> want = normalize(expected);
        if (!got.equals(want)) {
            String shown = strs.length <= 12 ? " but got " + got : "";
            throw new AssertionError(label + ": expected " + (strs.length <= 12 ? want : want.size() + " groups") + shown);
        }
        if (!Arrays.equals(before, strs)) {
            throw new AssertionError(label + ": the input array was modified");
        }
        cases++;
    }
}
