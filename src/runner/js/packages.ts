import type { PackageName } from './compile'

/**
 * The npm packages lesson code may import, loaded only when a program uses them. CommonJS
 * packages (React, lodash) are handed over as their module.exports object, the way Node's
 * require returns them; ES-module packages (zod) as their namespace.
 */
const LOADERS: Record<PackageName, () => Promise<unknown>> = {
  react: () => import('react').then((m) => m.default ?? m),
  'react/jsx-runtime': () => import('react/jsx-runtime').then((m) => (m as { default?: unknown }).default ?? m),
  'react-dom': () => import('react-dom').then((m) => m.default ?? m),
  'react-dom/client': () => import('react-dom/client').then((m) => (m as { default?: unknown }).default ?? m),
  'react-dom/server': () => import('react-dom/server').then((m) => (m as { default?: unknown }).default ?? m),
  zod: () => import('zod'),
  lodash: () => import('lodash').then((m) => m.default ?? m),
}

export async function loadPackages(names: PackageName[]): Promise<Record<string, unknown>> {
  const entries = await Promise.all(names.map(async (n) => [n, await LOADERS[n]()] as const))
  return Object.fromEntries(entries)
}
