/// <reference lib="webworker" />
// Runs one compiled program per worker, so a slow run can be stopped by terminating the
// worker and every run starts with fresh static state, as a new JVM would.
import { run } from './generated/java-programs.js'

self.onmessage = (event: MessageEvent<{ key: string; input: string }>) => {
  const { key, input } = event.data
  const start = performance.now()
  const [status = 'error', stdout = '', stderr = ''] = run(key, input).split('\u0000')
  self.postMessage({ status, stdout, stderr, ms: performance.now() - start })
}
