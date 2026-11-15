package runner;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
import org.teavm.jso.JSExport;

/** The function the web page calls: run one program on one input. */
public final class Entry {
    private Entry() {}

    public static void main(String[] args) {}

    /**
     * Runs program {@code key} with {@code input} as standard input. Returns
     * "status U+0000 n U+0000" followed by standard output (n characters) and then
     * standard error. The status is "ok", "exit N" or "error"; an uncaught exception
     * is reported on standard error the way the JVM reports it. The length prefix
     * keeps output that itself contains U+0000 intact.
     */
    @JSExport
    public static String run(String key, String input) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        String status = "ok";
        try {
            Io.in = new ByteArrayInputStream(input.getBytes("UTF-8"));
            Io.out = new PrintStream(out, true, "UTF-8");
            Io.err = new PrintStream(err, true, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return "error\u00000\u0000" + e;
        }
        try {
            if (!Programs.run(key)) return "error\u00000\u0000Unknown program " + key;
        } catch (Io.Exit e) {
            status = "exit " + e.status;
        } catch (Throwable t) {
            status = "error";
            Io.err.println("Exception in thread \"main\" " + t);
        }
        Io.out.flush();
        Io.err.flush();
        String stdout = text(out);
        return status + "\u0000" + stdout.length() + "\u0000" + stdout + text(err);
    }

    private static String text(ByteArrayOutputStream bytes) {
        try {
            return bytes.toString("UTF-8");
        } catch (UnsupportedEncodingException e) {
            return "";
        }
    }
}
