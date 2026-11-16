# Java on a real JVM in the browser

The Run panels compile and run readers' edited Java (and Java the build did not precompile)
here, with the JDK's own javac, on CheerpJ: a Java virtual machine for the browser by
Leaning Technologies (https://cheerpj.com), running OpenJDK 21.

The Check buttons on problem pages use the same runner: `Runner.runTests` compiles once and
runs each test in a fresh class loader; the page sends one test at a time, with its own time
limit.

| File | What it is |
|---|---|
| `worker.js` | A Web Worker started by `src/runner/java/cheerpj.ts`. Loads CheerpJ 5.0 from its CDN, starts Java 21 once, warms up javac, and runs jobs sent by the page. Its own thread keeps the page responsive while Java runs; the page terminates the worker to stop a program that runs too long. |
| `runner.jar` | `Runner` (source: `tools/cheerpj-runner/Runner.java`; build: `npm run runner:cheerpj`). Compiles the sources in memory with `javax.tools`, loads them in a fresh class loader, runs `main` with the Run panel's input as stdin, and returns stdout, stderr, compiler errors and how the program ended (`System.exit` is trapped). |

## Licence

CheerpJ is commercial software. Its free Community licence covers personal, educational and
hobby use, individuals and non-commercial open-source projects, and asks for a
"Built with CheerpJ" credit, which the Run panel shows next to the Run button. A commercial
deployment needs a CheerpJ licence (https://cheerpj.com/licensing/); pass its key as
`licenseKey` to `cheerpjInit` in `worker.js`.

## Known difference from HotSpot

CheerpJ's default engine reports running out of stack as `java.lang.ArithmeticException`
rather than `StackOverflowError`, so programs that catch `StackOverflowError` print differently.
