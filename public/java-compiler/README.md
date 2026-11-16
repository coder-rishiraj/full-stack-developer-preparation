# In-browser Java compiler

These files let readers edit Java on lesson and walkthrough pages and run it in the browser.
The Java Run panels compile edited code here (javac, then TeaVM to WebAssembly), in a web
worker (`src/runner/java/compiler-worker.ts`), and run the result in another
(`src/runner/java/wasm-run-worker.ts`).

| File | What it is |
|---|---|
| `compiler.wasm` | javac (OpenJDK 25) and the TeaVM compiler, compiled together to WebAssembly (Wasm GC) |
| `compiler.wasm-runtime.js` | TeaVM's loader for WebAssembly modules (used for the compiler and for compiled programs) |
| `compile-classlib-teavm.bin` | The Java class library that javac compiles against |
| `runtime-classlib-teavm.bin` | TeaVM's implementation of that library, linked into each program |

## Where they come from

Built from source, not downloaded as binaries:

- teavm-javac (Apache License 2.0): https://github.com/konsoletyper/teavm-javac, commit
  `0340fab28da146d283ba94df8a36d66a4c635084` (2026-11-09).
- TeaVM `0.17.0-dev-4` from https://teavm.org/maven/repository (Apache License 2.0; see
  `LICENSE-teavm.txt`). The repository's version catalog names `0.17.0-SNAPSHOT`, which is not
  published; `0.17.0-dev-4` is the version its commit "Bump TeaVM version to 0.17.0-dev-4" uses.
- javac from OpenJDK, https://github.com/openjdk/jdk25u at revision
  `6c48f4ed707bf0b15f9b6098de30db8aae6fa40f` (GNU GPL v2 with the Classpath Exception). The
  source for this javac is that revision of the OpenJDK repository.

Build (JDK 25 or newer, Gradle 9):

```bash
git clone https://github.com/konsoletyper/teavm-javac.git && cd teavm-javac
git checkout 0340fab28da146d283ba94df8a36d66a4c635084
# gradle/libs.versions.toml: teavm = "0.17.0-dev-4"
# settings.gradle, when building with a JDK newer than 25:
#   gradle.allprojects { tasks.withType(JavaCompile).configureEach { sourceCompatibility = "25"; targetCompatibility = "25" } }
gradle :compiler:createDist
```

then copy `compiler.wasm`, `compiler.wasm-runtime.js` and the two `.bin` files from
`compiler/build/distributions/dist.zip` here.

## What it does not cover

TeaVM implements most, not all, of the Java library. `java.util.Scanner` is missing and
`java.util.Random` does not follow the specified algorithm, so the runner compiles its own
`runner.Scanner` and `runner.Random` (in `tools/java-runner/src/main/java/runner/`) with each
program that uses them, as the precompiled path does.
