package runner;

import java.io.IOException;
import java.io.InputStream;
import java.util.NoSuchElementException;

/**
 * The subset of java.util.Scanner that the pages use. TeaVM's class library has no
 * Scanner, so the build points `import java.util.Scanner` at this class. Tokens are
 * separated by whitespace, as with Scanner's default delimiter.
 */
public final class Scanner implements AutoCloseable {
    private final InputStream in;
    private int peeked = -2;

    public Scanner(InputStream in) {
        this.in = in;
    }

    private int peek() {
        if (peeked == -2) {
            try {
                peeked = in.read();
            } catch (IOException e) {
                peeked = -1;
            }
        }
        return peeked;
    }

    private int read() {
        int c = peek();
        peeked = -2;
        return c;
    }

    private static boolean isSpace(int c) {
        return c == ' ' || c == '\n' || c == '\r' || c == '\t' || c == '\f' || c == 0x0B;
    }

    public boolean hasNext() {
        while (peek() != -1 && isSpace(peek())) read();
        return peek() != -1;
    }

    public String next() {
        if (!hasNext()) throw new NoSuchElementException();
        StringBuilder sb = new StringBuilder();
        while (peek() != -1 && !isSpace(peek())) sb.append((char) read());
        return sb.toString();
    }

    public boolean hasNextLine() {
        return peek() != -1;
    }

    public String nextLine() {
        if (peek() == -1) throw new NoSuchElementException("No line found");
        StringBuilder sb = new StringBuilder();
        while (peek() != -1 && peek() != '\n') sb.append((char) read());
        if (peek() == '\n') read();
        int len = sb.length();
        if (len > 0 && sb.charAt(len - 1) == '\r') sb.setLength(len - 1);
        return sb.toString();
    }

    public int nextInt() {
        String token = next();
        try {
            return Integer.parseInt(token);
        } catch (NumberFormatException e) {
            throw new MismatchException("For input string: \"" + token + "\"");
        }
    }

    public long nextLong() {
        String token = next();
        try {
            return Long.parseLong(token);
        } catch (NumberFormatException e) {
            throw new MismatchException("For input string: \"" + token + "\"");
        }
    }

    public double nextDouble() {
        String token = next();
        try {
            return Double.parseDouble(token);
        } catch (NumberFormatException e) {
            throw new MismatchException("For input string: \"" + token + "\"");
        }
    }

    @Override
    public void close() {}
}

/** Stands in for java.util.InputMismatchException, which TeaVM lacks; reports itself under that name. */
final class MismatchException extends NoSuchElementException {
    MismatchException(String message) {
        super(message);
    }

    @Override
    public String toString() {
        return "java.util.InputMismatchException: " + getMessage();
    }
}
