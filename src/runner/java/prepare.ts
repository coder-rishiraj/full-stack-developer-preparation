/**
 * The source files for one run of the reader's Java on the JVM (src/runner/java/cheerpj.ts).
 * The code is compiled exactly as written: it runs on a real OpenJDK, so nothing needs
 * rewriting. Each block stays its own file, so javac's line numbers are the reader's.
 */
import inSource from '../../../tools/java-runner/src/main/java/runner/In.java?raw'
import showSource from '../../../tools/java-runner/src/main/java/runner/Show.java?raw'

export type JavaFiles = Record<string, string>
export type CompileUnit = { files: JavaFiles; userFile: string; mainClass: string }

const TOP_TYPE = /^(public\s+)?((?:final|abstract|sealed|non-sealed|static|strictfp)\s+)*(class|record|enum|interface)\s+(\w+)/gm

export function topTypes(code: string): { name: string; isPublic: boolean; index: number }[] {
  return [...code.matchAll(TOP_TYPE)].map((m) => ({ name: m[4], isPublic: Boolean(m[1]), index: m.index ?? 0 }))
}

/** The top-level type that declares `main`, with its package, or null. */
export function mainClassOf(code: string): string | null {
  const at = code.search(/static\s+void\s+main\s*\(/)
  if (at < 0) return null
  const name = topTypes(code).filter((t) => t.index < at).pop()?.name
  if (!name) return null
  const pkg = code.match(/^package\s+([\w.]+)\s*;/m)?.[1]
  return pkg ? `${pkg}.${name}` : name
}

/** The file name javac requires: the public top-level type's name, or `fallback`. */
export function fileNameFor(code: string, fallback: string): string {
  return `${topTypes(code).find((t) => t.isPublic)?.name ?? fallback}.java`
}

/** Removes `public` from top-level types, so a helper file can have any name. */
export function withoutPublicTypes(code: string): string {
  return code.replace(/^public\s+(?=((?:final|abstract|sealed|non-sealed|static|strictfp)\s+)*(class|record|enum|interface)\s+\w+)/gm, '')
}

/**
 * A program with its own main (a lesson program or a CSES solution). `companions` are earlier
 * blocks of the lesson the program builds on.
 */
export function programUnit(code: string, companions: string[] = []): CompileUnit | { error: string } {
  const mainClass = mainClassOf(code)
  if (!mainClass) return { error: 'No main method found. Add public static void main(String[] args) to run this code.' }
  const simple = mainClass.slice(mainClass.lastIndexOf('.') + 1)
  const userFile = fileNameFor(code, simple)
  const files: JavaFiles = { [userFile]: code }
  companions.forEach((c, i) => (files[`Companion${i + 1}.java`] = withoutPublicTypes(c)))
  return { files, userFile, mainClass }
}

/**
 * A LeetCode-style page: the reader's Solution (or design class) plus the generated harness
 * `Main` that reads the input and calls it, its judge types, and runner.In / runner.Show.
 */
export function harnessUnit(code: string, harnessMain: string, harnessExtra?: string): CompileUnit {
  const userFile = fileNameFor(code, 'Solution')
  const files: JavaFiles = { [userFile]: code, 'Main.java': harnessMain, 'In.java': inSource, 'Show.java': showSource }
  if (harnessExtra) files['Harness.java'] = withoutPublicTypes(harnessExtra)
  return { files, userFile, mainClass: 'Main' }
}
