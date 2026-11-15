/** A compiled bundle (src/runner/generated/<chunk>.js, built by scripts/build-java-runner.mjs). */
export type BundleModule = { run: (key: string, input: string) => string }

/** Splits a bundle's "status NUL n NUL stdout stderr" result (see tools/java-runner/.../Entry.java). */
export function parseRun(raw: string): { status: string; stdout: string; stderr: string } {
  const a = raw.indexOf('\u0000')
  const b = raw.indexOf('\u0000', a + 1)
  if (a < 0 || b < 0) return { status: 'error', stdout: '', stderr: raw }
  const n = Number(raw.slice(a + 1, b))
  return { status: raw.slice(0, a), stdout: raw.slice(b + 1, b + 1 + n), stderr: raw.slice(b + 1 + n) }
}
