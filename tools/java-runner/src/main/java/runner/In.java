package runner;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads LeetCode-style input: one value per parameter, in order, each optionally named
 * ("nums = [2,7,11,15]"), separated by new lines or commas. Values are JSON-like: numbers,
 * "strings", 'c' characters, true/false, null, and [nested, lists].
 *
 * Parsed values are String (numbers keep their text), Str (a quoted string or char),
 * Boolean, null, or List&lt;Object&gt;. The to* methods convert them to the parameter types.
 */
public final class In {
    /** A quoted string or character literal, kept apart from a bare number. */
    public static final class Str {
        final String text;

        Str(String text) {
            this.text = text;
        }
    }

    private final String s;
    private int i;

    private In(String s) {
        this.s = s;
    }

    /** Every top-level value in the input, in order. */
    public static List<Object> values(InputStream stream) {
        String text = readAll(stream);
        In in = new In(text);
        List<Object> out = new ArrayList<>();
        while (true) {
            in.skipSeparators();
            if (in.i >= in.s.length()) break;
            in.skipName();
            out.add(in.value());
        }
        return out;
    }

    /** Value number {@code index}, or an error naming the missing parameter. */
    public static Object arg(List<Object> values, int index, String name) {
        if (index >= values.size()) throw new IllegalArgumentException("missing input value for " + name);
        return values.get(index);
    }

    private static String readAll(InputStream stream) {
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        byte[] chunk = new byte[4096];
        try {
            int n;
            while ((n = stream.read(chunk)) > 0) buf.write(chunk, 0, n);
            return buf.toString("UTF-8");
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    private void skipSeparators() {
        while (i < s.length() && (Character.isWhitespace(s.charAt(i)) || s.charAt(i) == ',')) i++;
    }

    private void skipSpace() {
        while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++;
    }

    /** Skips "name =" when the input names the value. */
    private void skipName() {
        int j = i;
        if (j < s.length() && (Character.isLetter(s.charAt(j)) || s.charAt(j) == '_')) {
            while (j < s.length() && (Character.isLetterOrDigit(s.charAt(j)) || s.charAt(j) == '_')) j++;
            String word = s.substring(i, j);
            int k = j;
            while (k < s.length() && Character.isWhitespace(s.charAt(k))) k++;
            if (k < s.length() && s.charAt(k) == '=' && !word.equals("true") && !word.equals("false") && !word.equals("null")) {
                i = k + 1;
                skipSpace();
            }
        }
    }

    private Object value() {
        skipSpace();
        if (i >= s.length()) throw new IllegalArgumentException("input ended where a value was expected");
        char c = s.charAt(i);
        if (c == '[') return list();
        if (c == '"' || c == '\'') return new Str(quoted(c));
        int start = i;
        while (i < s.length() && "[],\n\r\t ".indexOf(s.charAt(i)) < 0) i++;
        String word = s.substring(start, i);
        if (word.equals("true")) return Boolean.TRUE;
        if (word.equals("false")) return Boolean.FALSE;
        if (word.equals("null")) return null;
        if (word.isEmpty()) throw new IllegalArgumentException("unexpected '" + c + "' in the input");
        return word;
    }

    private List<Object> list() {
        i++; // [
        List<Object> items = new ArrayList<>();
        while (true) {
            skipSpace();
            if (i >= s.length()) throw new IllegalArgumentException("missing ']' in the input");
            if (s.charAt(i) == ']') {
                i++;
                return items;
            }
            items.add(value());
            skipSpace();
            if (i < s.length() && s.charAt(i) == ',') i++;
        }
    }

    private String quoted(char quote) {
        i++;
        StringBuilder sb = new StringBuilder();
        while (i < s.length() && s.charAt(i) != quote) {
            char c = s.charAt(i++);
            if (c == '\\' && i < s.length()) {
                char e = s.charAt(i++);
                switch (e) {
                    case 'n': sb.append('\n'); break;
                    case 't': sb.append('\t'); break;
                    case 'r': sb.append('\r'); break;
                    case 'u':
                        sb.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                        i += 4;
                        break;
                    default: sb.append(e);
                }
            } else sb.append(c);
        }
        if (i >= s.length()) throw new IllegalArgumentException("missing closing " + quote + " in the input");
        i++;
        return sb.toString();
    }

    // ---- conversions ----

    private static String number(Object v, String type) {
        if (v instanceof String) return (String) v;
        throw new IllegalArgumentException("expected " + type + ", got " + describe(v));
    }

    private static String describe(Object v) {
        if (v == null) return "null";
        if (v instanceof List) return "a list";
        if (v instanceof Str) return "\"" + ((Str) v).text + "\"";
        return String.valueOf(v);
    }

    @SuppressWarnings("unchecked")
    public static List<Object> list(Object v) {
        if (v instanceof List) return (List<Object>) v;
        throw new IllegalArgumentException("expected a list like [1,2,3], got " + describe(v));
    }

    public static int toInt(Object v) {
        String t = number(v, "an integer");
        try {
            return Integer.parseInt(t);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("expected an int, got " + t);
        }
    }

    public static long toLong(Object v) {
        String t = number(v, "an integer");
        try {
            return Long.parseLong(t);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("expected a long, got " + t);
        }
    }

    public static double toDouble(Object v) {
        String t = number(v, "a number");
        try {
            return Double.parseDouble(t);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("expected a number, got " + t);
        }
    }

    public static boolean toBoolean(Object v) {
        if (v instanceof Boolean) return (Boolean) v;
        throw new IllegalArgumentException("expected true or false, got " + describe(v));
    }

    public static String toStr(Object v) {
        if (v == null) return null;
        if (v instanceof Str) return ((Str) v).text;
        throw new IllegalArgumentException("expected a string in quotes, got " + describe(v));
    }

    public static char toChar(Object v) {
        String t = v instanceof Str ? ((Str) v).text : null;
        if (t != null && t.length() == 1) return t.charAt(0);
        throw new IllegalArgumentException("expected one character like 'a', got " + describe(v));
    }

    public static Integer toInteger(Object v) {
        return v == null ? null : Integer.valueOf(toInt(v));
    }

    public static int[] toIntArray(Object v) {
        List<Object> l = list(v);
        int[] a = new int[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toInt(l.get(k));
        return a;
    }

    public static long[] toLongArray(Object v) {
        List<Object> l = list(v);
        long[] a = new long[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toLong(l.get(k));
        return a;
    }

    public static double[] toDoubleArray(Object v) {
        List<Object> l = list(v);
        double[] a = new double[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toDouble(l.get(k));
        return a;
    }

    public static boolean[] toBooleanArray(Object v) {
        List<Object> l = list(v);
        boolean[] a = new boolean[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toBoolean(l.get(k));
        return a;
    }

    public static char[] toCharArray(Object v) {
        List<Object> l = list(v);
        char[] a = new char[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toChar(l.get(k));
        return a;
    }

    public static String[] toStrArray(Object v) {
        List<Object> l = list(v);
        String[] a = new String[l.size()];
        for (int k = 0; k < a.length; k++) a[k] = toStr(l.get(k));
        return a;
    }

    public static int[][] toIntArray2(Object v) {
        List<Object> l = list(v);
        int[][] a = new int[l.size()][];
        for (int k = 0; k < a.length; k++) a[k] = toIntArray(l.get(k));
        return a;
    }

    public static char[][] toCharArray2(Object v) {
        List<Object> l = list(v);
        char[][] a = new char[l.size()][];
        for (int k = 0; k < a.length; k++) a[k] = toCharArray(l.get(k));
        return a;
    }

    public static String[][] toStrArray2(Object v) {
        List<Object> l = list(v);
        String[][] a = new String[l.size()][];
        for (int k = 0; k < a.length; k++) a[k] = toStrArray(l.get(k));
        return a;
    }

    public static List<Integer> toIntList(Object v) {
        List<Integer> out = new ArrayList<>();
        for (Object o : list(v)) out.add(toInteger(o));
        return out;
    }

    public static List<String> toStrList(Object v) {
        List<String> out = new ArrayList<>();
        for (Object o : list(v)) out.add(toStr(o));
        return out;
    }

    public static List<List<Integer>> toIntListList(Object v) {
        List<List<Integer>> out = new ArrayList<>();
        for (Object o : list(v)) out.add(toIntList(o));
        return out;
    }

    public static List<List<String>> toStrListList(Object v) {
        List<List<String>> out = new ArrayList<>();
        for (Object o : list(v)) out.add(toStrList(o));
        return out;
    }
}
