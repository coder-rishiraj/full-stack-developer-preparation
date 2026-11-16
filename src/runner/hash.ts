/** Same normalisation and FNV-1a hash as scripts/java-runner-lib.mjs, so pages detect stale builds. */
export function codeHash(code: string): string {
  const text = code
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .trim()
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}
