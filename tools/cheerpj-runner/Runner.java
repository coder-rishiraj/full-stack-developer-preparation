import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import javax.tools.FileObject;
import javax.tools.ForwardingJavaFileManager;
import javax.tools.SimpleJavaFileObject;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

/**
 * Compiles and runs one Java program inside CheerpJ (a real JVM, OpenJDK 21, in the browser)
 * for the site's Run panels. Built into public/cheerpj/runner.jar by
 * `npm run runner:cheerpj`; driven by public/cheerpj/worker.js.
 *
 * From JavaScript: Runner.run(packedSources, mainClass, input) (CheerpJ library mode).
 * For local testing: Runner <jobPrefix> <resultFile>
 *   <jobPrefix>job.txt     line 1: main class; then one source file name per line
 *   <jobPrefix><name>      each source file (CheerpJ's /str has no folders, so the files are
 *                          copied to a folder under /files with their real names)
 *   <jobPrefix>input.txt   standard input
 * Writes resultFile: "status\n" + length-prefixed sections (compile errors, stdout, stderr).
 */
public final class Runner {
    /** Thrown instead of exiting the JVM when the program calls System.exit. */
    static final class ExitTrap extends SecurityException {
        final int status;

        ExitTrap(int status) {
            super("System.exit(" + status + ")");
            this.status = status;
        }
    }

    /** A source file held in memory. */
    static final class Source extends SimpleJavaFileObject {
        private final String code;

        Source(String name, String code) {
            super(URI.create("string:///" + name), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }
    }

    /** A class file javac writes, kept in memory. */
    static final class ClassOut extends SimpleJavaFileObject {
        final ByteArrayOutputStream bytes = new ByteArrayOutputStream();

        ClassOut(String className) {
            super(URI.create("mem:///" + className.replace('.', '/') + ".class"), Kind.CLASS);
        }

        @Override
        public OutputStream openOutputStream() {
            return bytes;
        }
    }

    /** Loads the program's classes from memory (a fresh loader per run, so statics start fresh). */
    static final class MemoryLoader extends ClassLoader {
        private final Map<String, ClassOut> classes;

        MemoryLoader(Map<String, ClassOut> classes, ClassLoader parent) {
            super(parent);
            this.classes = classes;
        }

        @Override
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            ClassOut out = classes.get(name);
            if (out == null) throw new ClassNotFoundException(name);
            byte[] b = out.bytes.toByteArray();
            return defineClass(name, b, 0, b.length);
        }
    }

    private static volatile boolean trapExit;

    // Kept between runs (the JVM stays up), so javac's caches of the platform classes stay warm.
    private static JavaCompiler javac;
    private static StandardJavaFileManager standardFiles;
    static long compileMs;
    static long runMs;

    @SuppressWarnings("removal")
    private static void installExitTrap() {
        try {
            System.setSecurityManager(new SecurityManager() {
                @Override
                public void checkExit(int status) {
                    if (trapExit) throw new ExitTrap(status);
                }

                @Override
                public void checkPermission(java.security.Permission perm) {}

                @Override
                public void checkPermission(java.security.Permission perm, Object context) {}
            });
        } catch (UnsupportedOperationException | SecurityException e) {
            // Not allowed in this JVM: System.exit then ends the run (reported as an exit).
        }
    }

    /** Local testing: Runner <jobPrefix> <resultFile> (see the class comment). */
    public static void main(String[] args) throws IOException {
        String prefix = args[0];
        List<String> job = Files.readAllLines(Path.of(prefix + "job.txt"), StandardCharsets.UTF_8);
        StringBuilder packed = new StringBuilder();
        for (String name : job.subList(1, job.size())) {
            if (name.isBlank()) continue;
            packed.append(name.trim()).append('\u0000').append(Files.readString(Path.of(prefix + name.trim()), StandardCharsets.UTF_8)).append('\u0000');
        }
        String input = Files.readString(Path.of(prefix + "input.txt"), StandardCharsets.UTF_8);
        Files.writeString(Path.of(args[1]), run(packed.toString(), job.get(0).trim(), input), StandardCharsets.UTF_8);
    }

    /**
     * Compiles and runs a program; called from JavaScript (CheerpJ library mode).
     * `packed` holds the source files as name, NUL, content, NUL, repeated. Returns
     * "status compileMs runMs\n" then three length-prefixed sections: compile errors, stdout, stderr.
     */
    public static String run(String packed, String mainClass, String input) {
        if (System.getSecurityManager() == null) installExitTrap();
        Map<String, ClassOut> classes = new HashMap<>();
        StringBuilder compileErrors = new StringBuilder();
        runMs = 0;
        if (!compile(unpack(packed), classes, compileErrors)) return result("compile-error", compileErrors.toString(), "", "");
        String[] r = runOne(classes, mainClass, input);
        runMs = Long.parseLong(r[1]);
        return result(r[0].replace('_', ' '), "", r[2], r[3]);
    }

    /**
     * Compiles once and runs the program on each input (fresh class loader each time, so static
     * fields start fresh, as in separate runs). `inputs` holds the inputs separated by NUL.
     * Returns "status compileMs count\n", the compile errors (length-prefixed), then per test
     * "status runMs\n" and its stdout and stderr (length-prefixed).
     */
    // The last program compiled for runTests: the page sends one test at a time (so it can stop
    // a test that runs too long), and only the first of them needs javac.
    private static String lastPacked;
    private static Map<String, ClassOut> lastClasses;

    public static String runTests(String packed, String mainClass, String inputs) {
        if (System.getSecurityManager() == null) installExitTrap();
        Map<String, ClassOut> classes = new HashMap<>();
        StringBuilder compileErrors = new StringBuilder();
        String[] cases = inputs.isEmpty() ? new String[0] : inputs.split("\u0000", -1);
        StringBuilder sb = new StringBuilder();
        if (packed.equals(lastPacked)) {
            classes = lastClasses;
            compileMs = 0;
        } else if (!compile(unpack(packed), classes, compileErrors)) {
            sb.append("compile-error ").append(compileMs).append(" 0\n");
            sb.append(compileErrors.length()).append('\n').append(compileErrors);
            return sb.toString();
        }
        lastPacked = packed;
        lastClasses = classes;
        sb.append("ok ").append(compileMs).append(' ').append(cases.length).append('\n');
        sb.append(compileErrors.length()).append('\n').append(compileErrors);
        for (String input : cases) {
            String[] r = runOne(classes, mainClass, input);
            sb.append(r[0]).append(' ').append(r[1]).append('\n');
            sb.append(r[2].length()).append('\n').append(r[2]);
            sb.append(r[3].length()).append('\n').append(r[3]);
        }
        return sb.toString();
    }

    private static List<Source> unpack(String packed) {
        List<Source> sources = new ArrayList<>();
        String[] parts = packed.split("\u0000", -1);
        for (int i = 0; i + 1 < parts.length; i += 2) sources.add(new Source(parts[i], parts[i + 1]));
        return sources;
    }

    /** Output kept per run; more is cut (a runaway print loop would otherwise fill memory). */
    private static final int MAX_OUTPUT = 1 << 20;

    /** Runs main once: {status, runMs, stdout, stderr}. */
    private static String[] runOne(Map<String, ClassOut> classes, String mainClass, String input) {
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        PrintStream realOut = System.out;
        PrintStream realErr = System.err;
        InputStream realIn = System.in;
        String status = "ok";
        ClassLoader loader = new MemoryLoader(classes, Runner.class.getClassLoader());
        System.setIn(new java.io.ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
        System.setOut(new PrintStream(new Capped(stdout), true, StandardCharsets.UTF_8));
        System.setErr(new PrintStream(new Capped(stderr), true, StandardCharsets.UTF_8));
        Set<Thread> before = Thread.getAllStackTraces().keySet();
        long runStart = System.nanoTime();
        trapExit = true;
        try {
            Class<?> cls = Class.forName(mainClass, true, loader);
            Method main = cls.getMethod("main", String[].class);
            if (!Modifier.isStatic(main.getModifiers())) throw new NoSuchMethodException("main is not static");
            main.setAccessible(true);
            main.invoke(null, (Object) new String[0]);
            // Like the JVM, wait for the program's other (non-daemon) threads to finish.
            for (Thread t : Thread.getAllStackTraces().keySet()) {
                if (!before.contains(t) && !t.isDaemon() && t.isAlive() && t != Thread.currentThread()) t.join();
            }
        } catch (InvocationTargetException e) {
            Throwable cause = e.getCause();
            ExitTrap exit = exitIn(cause);
            if (exit != null) {
                status = "exit " + exit.status;
            } else {
                System.err.print("Exception in thread \"main\" ");
                printTrimmed(cause, System.err);
                status = "error";
            }
        } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException e) {
            System.err.println("Error: could not find or load main class " + mainClass);
            status = "error";
        } catch (InterruptedException e) {
            status = "error";
        } finally {
            trapExit = false;
            System.out.flush();
            System.err.flush();
            System.setOut(realOut);
            System.setErr(realErr);
            System.setIn(realIn);
        }
        long ms = (System.nanoTime() - runStart) / 1_000_000;
        return new String[] {status.replace(' ', '_'), Long.toString(ms), stdout.toString(StandardCharsets.UTF_8), stderr.toString(StandardCharsets.UTF_8)};
    }

    /** Stops keeping output after MAX_OUTPUT bytes. */
    static final class Capped extends OutputStream {
        private final ByteArrayOutputStream out;

        Capped(ByteArrayOutputStream out) {
            this.out = out;
        }

        @Override
        public void write(int b) {
            if (out.size() < MAX_OUTPUT) out.write(b);
        }

        @Override
        public void write(byte[] b, int off, int len) {
            int room = MAX_OUTPUT - out.size();
            if (room > 0) out.write(b, off, Math.min(room, len));
        }
    }

    /** Compiles a tiny program, so javac is warm before the reader's first run. */
    public static String warmUp() {
        return run("Warm.java\u0000public class Warm { public static void main(String[] a) { System.out.println(java.util.List.of(1, 2)); } }\u0000", "Warm", "");
    }

    private static ExitTrap exitIn(Throwable t) {
        for (Throwable c = t; c != null; c = c.getCause()) {
            if (c instanceof ExitTrap) return (ExitTrap) c;
        }
        return null;
    }

    /** The stack trace without the runner's own reflection frames. */
    private static void printTrimmed(Throwable t, PrintStream to) {
        StringWriter sw = new StringWriter();
        t.printStackTrace(new java.io.PrintWriter(sw));
        for (String line : sw.toString().split("\n")) {
            String s = line.trim();
            if (s.startsWith("at jdk.internal.reflect.") || s.startsWith("at java.base/jdk.internal.reflect.")
                    || s.startsWith("at java.lang.reflect.") || s.startsWith("at java.base/java.lang.reflect.")
                    || s.startsWith("at Runner.")) continue;
            to.println(line);
        }
    }

    private static boolean compile(List<Source> sources, Map<String, ClassOut> classes, StringBuilder errors) {
        long start = System.nanoTime();
        if (javac == null) {
            javac = ToolProvider.getSystemJavaCompiler();
            if (javac == null) {
                errors.append("error: no Java compiler in this runtime\n");
                return false;
            }
            standardFiles = javac.getStandardFileManager(null, Locale.ENGLISH, StandardCharsets.UTF_8);
        }
        DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
        ForwardingJavaFileManager<StandardJavaFileManager> files = new ForwardingJavaFileManager<>(standardFiles) {
            @Override
            public JavaFileObject getJavaFileForOutput(Location location, String className, JavaFileObject.Kind kind, FileObject sibling) {
                ClassOut out = new ClassOut(className);
                classes.put(className, out);
                return out;
            }

            @Override
            public void close() {
                // the shared file manager stays open for the next run
            }
        };
        List<String> options = List.of("-proc:none", "-Xlint:none", "-nowarn", "-g");
        boolean ok = javac.getTask(null, files, diagnostics, options, null, sources).call();
        for (Diagnostic<? extends JavaFileObject> d : diagnostics.getDiagnostics()) {
            if (d.getKind() != Diagnostic.Kind.ERROR && d.getKind() != Diagnostic.Kind.WARNING) continue;
            String file = d.getSource() == null ? "" : d.getSource().toUri().getPath().replaceFirst("^.*/", "");
            String kind = d.getKind() == Diagnostic.Kind.ERROR ? "error" : "warning";
            errors.append(file.isEmpty() ? "" : file + ":" + d.getLineNumber() + ": ")
                    .append(kind).append(": ").append(d.getMessage(Locale.ENGLISH)).append('\n');
        }
        compileMs = (System.nanoTime() - start) / 1_000_000;
        return ok;
    }

    private static String result(String status, String compileErrors, String stdout, String stderr) {
        StringBuilder sb = new StringBuilder();
        sb.append(status).append(' ').append(compileMs).append(' ').append(runMs).append('\n');
        for (String part : new String[] {compileErrors, stdout, stderr}) {
            sb.append(part.length()).append('\n').append(part);
        }
        return sb.toString();
    }
}
