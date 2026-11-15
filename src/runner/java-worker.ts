/// <reference lib="webworker" />
// Runs one compiled program per worker, so a slow run can be stopped by terminating the
// worker and every run starts with fresh static state, as a new JVM would. Each problem
// category is its own bundle; only the one the page needs is loaded.
import { parseRun, type BundleModule } from './parse-run'

const bundles = import.meta.glob<BundleModule>('./generated/*.js')

self.onmessage = async (event: MessageEvent<{ chunk: string; key: string; input: string }>) => {
  const { chunk, key, input } = event.data
  const load = bundles[`./generated/${chunk}.js`]
  if (!load) {
    self.postMessage({ status: 'error', stdout: '', stderr: `No compiled bundle "${chunk}".`, ms: 0 })
    return
  }
  const { run } = await load()
  const start = performance.now()
  const result = parseRun(run(key, input))
  self.postMessage({ ...result, ms: performance.now() - start })
}
