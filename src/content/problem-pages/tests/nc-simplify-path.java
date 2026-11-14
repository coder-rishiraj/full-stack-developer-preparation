import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Tests for every "class Solution" on the Simplify Path page (run by `npm run problems:verify`).
 * The reference is an independent implementation written here: it cuts the path with indexOf,
 * keeps the directories in a list used as a stack, and joins them with String.join.
 */
class Tests {
    static int cases = 0;

    public static void main(String[] args) {
        // Examples from section 1 and the official examples
        check("/home/", "/home");
        check("/home//foo/", "/home/foo");
        check("/home/user/Documents/../Pictures", "/home/user/Pictures");
        check("/../", "/");
        check("/.../a/../b/c/../d/./", "/.../b/d");
        check("/a/./b/../../c/", "/c");

        // Dry-run inputs used on the page
        check("/.../a/../b", "/.../b");
        check("/x//./y/../z/", "/x/z");

        // Edge cases listed in section 3 and traced in section 7
        check("/", "/");
        check("//", "/");
        check("/.", "/");
        check("/..", "/");
        check("/a/..", "/");
        check("/a/../..", "/");
        check("/../a", "/a");
        check("/...", "/...");
        check("/....", "/....");
        check("/..a", "/..a");
        check("/a..", "/a..");
        check("/.a", "/.a");
        check("/_/__/._", "/_/__/._");
        check("/a/b/c/../../..", "/");
        check("/abc/def/../ghi", "/abc/ghi");
        check("///a///b///", "/a/b");
        check("/a1/B2/./c_3", "/a1/B2/c_3");

        // Constraint extremes: length 3000
        StringBuilder deep = new StringBuilder();
        StringBuilder deepExpected = new StringBuilder();
        for (int i = 0; i < 1500; i++) {
            deep.append("/a");
            deepExpected.append("/a");
        }
        check(deep.toString(), deepExpected.toString());
        check("/..".repeat(1000), "/");
        check("/".repeat(3000), "/");
        check("/" + "x".repeat(2999), "/" + "x".repeat(2999));
        StringBuilder upAndDown = new StringBuilder();
        for (int i = 0; i < 500; i++) {
            upAndDown.append("/b/..");                                   // 5 * 500 = 2500 characters
        }
        upAndDown.append("/c".repeat(250));                              // + 500 = 3000
        check(upAndDown.toString(), "/c".repeat(250));

        // Random paths built from awkward tokens, against the reference
        String[] tokens = {"", "", ".", "..", "...", "....", "a", "b", "_", "a1", ".a", "..b", "b..", "Zz", "x.y"};
        Random random = new Random(20261114L);
        for (int t = 0; t < 20_000; t++) {
            int count = 1 + random.nextInt(t < 15_000 ? 10 : 400);
            StringBuilder p = new StringBuilder();
            for (int i = 0; i < count; i++) {
                p.append('/').append(tokens[random.nextInt(tokens.length)]);
                if (p.length() > 3000) {
                    break;
                }
            }
            if (random.nextBoolean()) {
                p.append('/');
            }
            if (p.length() > 3000) {
                p.setLength(3000);
            }
            String path = p.toString();
            check(path, reference(path));
        }

        System.out.println("PASS " + cases + " cases");
    }

    /** Independent reference: cut with indexOf, list as a stack, String.join. */
    static String reference(String path) {
        List<String> dirs = new ArrayList<>();
        int from = 1;
        while (from <= path.length()) {
            int slash = path.indexOf('/', from);
            int end = slash < 0 ? path.length() : slash;
            String name = path.substring(from, end);
            if (name.equals("..")) {
                if (!dirs.isEmpty()) {
                    dirs.remove(dirs.size() - 1);
                }
            } else if (!name.isEmpty() && !name.equals(".")) {
                dirs.add(name);
            }
            from = end + 1;
        }
        return "/" + String.join("/", dirs);
    }

    static void check(String path, String expected) {
        String label = path.length() <= 60 ? path : path.substring(0, 60) + "...";
        // Guard against a wrong test: 1 <= length <= 3000, starts with '/', allowed characters only.
        if (path.isEmpty() || path.length() > 3000 || path.charAt(0) != '/') {
            throw new IllegalStateException(label + ": bad test case, not a valid absolute path of allowed length");
        }
        for (char c : path.toCharArray()) {
            boolean ok = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '.' || c == '/' || c == '_';
            if (!ok) {
                throw new IllegalStateException(label + ": bad test case, character '" + c + "' not allowed");
            }
        }
        String got = new Solution().simplifyPath(path);
        if (!expected.equals(got)) {
            throw new AssertionError(label + ": expected " + expected + ", got " + got);
        }
        cases++;
    }
}
