package runner;

import java.util.Collection;
import java.util.Map;

/**
 * Prints a value the way LeetCode-style examples write it: [1, 2, 3], "text", 'c',
 * true, 2.5, null, and nested lists.
 */
public final class Show {
    private Show() {}

    public static String of(Object v) {
        StringBuilder sb = new StringBuilder();
        append(sb, v);
        return sb.toString();
    }

    public static String of(int v) { return Integer.toString(v); }
    public static String of(long v) { return Long.toString(v); }
    public static String of(double v) { return Double.toString(v); }
    public static String of(boolean v) { return Boolean.toString(v); }
    public static String of(char v) { return "'" + v + "'"; }

    private static void append(StringBuilder sb, Object v) {
        if (v == null) {
            sb.append("null");
        } else if (v instanceof String) {
            quote(sb, (String) v);
        } else if (v instanceof Character) {
            sb.append('\'').append((char) (Character) v).append('\'');
        } else if (v instanceof int[]) {
            int[] a = (int[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) sb.append(k == 0 ? "" : ", ").append(a[k]);
            sb.append(']');
        } else if (v instanceof long[]) {
            long[] a = (long[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) sb.append(k == 0 ? "" : ", ").append(a[k]);
            sb.append(']');
        } else if (v instanceof double[]) {
            double[] a = (double[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) sb.append(k == 0 ? "" : ", ").append(a[k]);
            sb.append(']');
        } else if (v instanceof boolean[]) {
            boolean[] a = (boolean[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) sb.append(k == 0 ? "" : ", ").append(a[k]);
            sb.append(']');
        } else if (v instanceof char[]) {
            char[] a = (char[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) sb.append(k == 0 ? "'" : ", '").append(a[k]).append('\'');
            sb.append(']');
        } else if (v instanceof Object[]) {
            Object[] a = (Object[]) v;
            sb.append('[');
            for (int k = 0; k < a.length; k++) {
                if (k > 0) sb.append(", ");
                append(sb, a[k]);
            }
            sb.append(']');
        } else if (v instanceof Collection) {
            sb.append('[');
            boolean first = true;
            for (Object o : (Collection<?>) v) {
                if (!first) sb.append(", ");
                first = false;
                append(sb, o);
            }
            sb.append(']');
        } else if (v instanceof Map) {
            sb.append('{');
            boolean first = true;
            for (Map.Entry<?, ?> e : ((Map<?, ?>) v).entrySet()) {
                if (!first) sb.append(", ");
                first = false;
                append(sb, e.getKey());
                sb.append(": ");
                append(sb, e.getValue());
            }
            sb.append('}');
        } else {
            sb.append(v);
        }
    }

    private static void quote(StringBuilder sb, String s) {
        sb.append('"');
        for (int k = 0; k < s.length(); k++) {
            char c = s.charAt(k);
            if (c == '"' || c == '\\') sb.append('\\').append(c);
            else if (c == '\n') sb.append("\\n");
            else if (c == '\t') sb.append("\\t");
            else sb.append(c);
        }
        sb.append('"');
    }
}
