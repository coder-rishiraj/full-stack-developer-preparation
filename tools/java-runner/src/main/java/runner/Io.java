package runner;

import java.io.InputStream;
import java.io.PrintStream;

/**
 * Standard input and output for one run. TeaVM has no System.setIn, so the build
 * rewrites System.in / System.out / System.err / System.exit in each program to these.
 */
public final class Io {
    public static InputStream in;
    public static PrintStream out;
    public static PrintStream err;

    private Io() {}

    /** Thrown by System.exit(status): stops the program without stopping the page. */
    public static final class Exit extends RuntimeException {
        public final int status;

        Exit(int status) {
            super(null, null, false, false);
            this.status = status;
        }
    }

    public static void exit(int status) {
        throw new Exit(status);
    }
}
