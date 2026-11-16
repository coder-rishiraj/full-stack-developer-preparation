/**
 * Turning the reader's (edited) Java into the source files the in-browser compiler compiles
 * (public/java-compiler, built from teavm-javac). The rewrites match the precompiled path
 * (scripts/java-runner-lib.mjs `rewrite`), so edited and unedited code behave the same:
 * stdin comes from the Run panel's input, Scanner and Random are the exact JDK versions.
 *
 * The reader's code stays in its own file, line for line, so compiler errors point at the
 * lines they see.
 */
import scannerSource from '../../../tools/java-runner/src/main/java/runner/Scanner.java?raw'
import randomSource from '../../../tools/java-runner/src/main/java/runner/Random.java?raw'
import tlrSource from '../../../tools/java-runner/src/main/java/runner/ThreadLocalRandom.java?raw'
import inSource from '../../../tools/java-runner/src/main/java/runner/In.java?raw'
import showSource from '../../../tools/java-runner/src/main/java/runner/Show.java?raw'
import joinerSource from '../../../tools/java-runner/src/main/java/org/teavm/classlib/java/util/TStringJoiner.java?raw'

export type JavaFiles = Record<string, string>

const TOP_TYPE = /^(public\s+)?((?:final|abstract|sealed|non-sealed|static|strictfp)\s+)*(class|record|enum|interface)\s+(\w+)/gm

export function topTypes(code: string): { name: string; isPublic: boolean; index: number }[] {
  return [...code.matchAll(TOP_TYPE)].map((m) => ({ name: m[4], isPublic: Boolean(m[1]), index: m.index ?? 0 }))
}

/** The top-level type that declares `main`, or null. */
export function mainClassOf(code: string): string | null {
  const at = code.search(/static\s+void\s+main\s*\(/)
  if (at < 0) return null
  return topTypes(code).filter((t) => t.index < at).pop()?.name ?? null
}

/** The file name javac requires: the public top-level type's name, or `fallback`. */
export function fileNameFor(code: string, fallback: string): string {
  return `${topTypes(code).find((t) => t.isPublic)?.name ?? fallback}.java`
}

/**
 * The same rewrites as the precompiled path, keeping line numbers: imports the rewrite needs
 * are added to the first line rather than as new lines.
 */
export function rewriteJava(code: string): string {
  let src = code
    .replace(/^package\s+[\w.]+\s*;/m, '')
    .replace(/\bSystem\.in\b/g, 'runner.Io.in')
    .replace(/\bSystem\.exit\s*\(/g, 'runner.Io.exit(')
    .replace(/^import\s+java\.util\.Scanner\s*;/m, 'import runner.Scanner;')
    .replace(/^import\s+java\.util\.concurrent\.ThreadLocalRandom\s*;/m, 'import runner.ThreadLocalRandom;')
    .replace(/\bjava\.util\.concurrent\.ThreadLocalRandom\b/g, 'runner.ThreadLocalRandom')
    .replace(/^import\s+java\.util\.Random\s*;/m, 'import runner.Random;')
    .replace(/^import\s+java\.util\.StringJoiner\s*;/m, 'import runner.StringJoiner;')
    .replace(/\bjava\.util\.StringJoiner\b/g, 'runner.StringJoiner')
    .replace(/\bjava\.util\.Random\b/g, 'runner.Random')
  const prefix: string[] = []
  if (/\bScanner\b/.test(src) && !/^import\s+runner\.Scanner\s*;/m.test(src)) prefix.push('import runner.Scanner;')
  if (/(?<![\w.])Random\b/.test(src) && !/^import\s+runner\.Random\s*;/m.test(src)) prefix.push('import runner.Random;')
  if (/(?<![\w.])StringJoiner\b/.test(src) && !/^import\s+runner\.StringJoiner\s*;/m.test(src)) prefix.push('import runner.StringJoiner;')
  if (prefix.length) src = `${prefix.join(' ')} ${src}`
  return src
}

/** Removes `public` from top-level types, so a helper file can have any name. */
export function withoutPublicTypes(code: string): string {
  return code.replace(/^package\s+[\w.]+\s*;/m, '').replace(/^public\s+(?=((?:final|abstract|sealed|non-sealed|static|strictfp)\s+)*(class|record|enum|interface)\s+\w+)/gm, '')
}

/** A Java string expression for `text`, in pieces small enough for the class file's constant limit. */
function javaStringExpression(text: string): string {
  const pieces: string[] = []
  for (let i = 0; i < text.length; i += 8000) pieces.push(JSON.stringify(text.slice(i, i + 8000)).replace(/\\u([0-9a-f]{4})/gi, '\\u$1'))
  return pieces.length === 0 ? '""' : `new StringBuilder()${pieces.map((p) => `.append(${p})`).join('')}.toString()`
}

/** runner.Io for the browser: stdin is the Run panel's input; out and err are the real streams. */
function browserIo(input: string): string {
  return `package runner;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

public final class Io {
    public static InputStream in = new ByteArrayInputStream(${javaStringExpression(input)}.getBytes(StandardCharsets.UTF_8));
    public static PrintStream out = System.out;
    public static PrintStream err = System.err;

    private Io() {}

    public static final class Exit extends RuntimeException {
        public final int status;

        Exit(int status) {
            super();
            this.status = status;
        }
    }

    public static void exit(int status) {
        throw new Exit(status);
    }
}
`
}

/** The entry point: runs the program's main and reports how it ended (see STATUS_MARK). */
export const STATUS_MARK = '\u0000status='
function runnerMain(mainClass: string): string {
  return `public class RunnerMain {
    public static void main(String[] args) {
        String status = "ok";
        try {
            ${mainClass}.main(new String[0]);
        } catch (runner.Io.Exit e) {
            status = "exit " + e.status;
        } catch (Throwable t) {
            System.out.flush();
            System.err.println("Exception in thread \\"main\\" " + t);
            status = "error";
        }
        System.out.flush();
        System.err.print("\\u0000status=" + status + "\\n");
        System.err.flush();
    }
}
`
}

/**
 * Support classes a program needs: always runner.Io (stdin, System.exit); Scanner, Random and
 * ThreadLocalRandom only when the code uses them; In/Show only for LeetCode-style harnesses.
 */
function supportFiles(input: string, code: string, harness: boolean): JavaFiles {
  const strip = (s: string) => s.replace(/^\s*@Override\s*$/gm, '')
  const files: JavaFiles = { 'Io.java': browserIo(input) }
  if (/\bScanner\b/.test(code)) files['Scanner.java'] = strip(scannerSource)
  if (/(?<![\w.])Random\b|java\.util\.Random/.test(code)) files['Random.java'] = strip(randomSource)
  if (/ThreadLocalRandom/.test(code)) files['ThreadLocalRandom.java'] = strip(tlrSource)
  // The compiler's class library has no java.util.StringJoiner; the program gets runner.StringJoiner.
  if (/\bStringJoiner\b/.test(code)) {
    files['StringJoiner.java'] = strip(joinerSource)
      .replace(/^package\s+[\w.]+;/m, 'package runner;')
      .replace(/\bTStringJoiner\b/g, 'StringJoiner')
  }
  if (harness) {
    files['In.java'] = strip(inSource)
    files['Show.java'] = strip(showSource)
  }
  return files
}

export type CompileUnit = { files: JavaFiles; userFile: string; mainClass: string }

/**
 * Sources for a program that has its own main (a lesson program or a CSES solution).
 * `companions` are earlier blocks of the lesson the program builds on.
 */
export function programUnit(code: string, input: string, companions: string[] = []): CompileUnit | { error: string } {
  const mainClass = mainClassOf(code)
  if (!mainClass) return { error: 'No main method found. Add public static void main(String[] args) to run this code.' }
  const userFile = fileNameFor(code, mainClass === 'RunnerMain' ? 'Program' : mainClass)
  const all = [code, ...companions].join('\n')
  const files: JavaFiles = { ...supportFiles(input, all, false), [userFile]: rewriteJava(code), 'RunnerMain.java': runnerMain(mainClass) }
  companions.forEach((c, i) => (files[`Companion${i + 1}.java`] = rewriteJava(withoutPublicTypes(c))))
  return { files, userFile, mainClass }
}

/**
 * Sources for a LeetCode-style page: the reader's Solution (or design class) plus the
 * generated harness `Main` that reads the input and calls it (and a judge-type harness file).
 */
export function harnessUnit(code: string, input: string, harnessMain: string, harnessExtra?: string): CompileUnit {
  const userFile = fileNameFor(code, 'Solution')
  const files: JavaFiles = {
    ...supportFiles(input, `${code}\n${harnessExtra ?? ''}`, true),
    [userFile]: rewriteJava(code),
    'Main.java': rewriteJava(harnessMain),
    'RunnerMain.java': runnerMain('Main'),
  }
  if (harnessExtra) files['Harness.java'] = rewriteJava(withoutPublicTypes(harnessExtra))
  return { files, userFile, mainClass: 'Main' }
}
