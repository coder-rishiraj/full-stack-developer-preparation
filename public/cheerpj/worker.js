// Runs readers' Java for the site's Run panels and Check buttons on a real JVM: CheerpJ
// (https://cheerpj.com, Leaning Technologies), OpenJDK 21, inside this Web Worker. A worker has
// its own thread, so a program that never ends cannot freeze the page, and the page stops it
// with worker.terminate(). Started by src/runner/java/cheerpj.ts. Built with CheerpJ.
importScripts('https://cjrtnc.leaningtech.com/5.0/loader.js')

let ready = null
let queue = Promise.resolve()

// The JVM starts once; Runner (public/cheerpj/runner.jar) is called directly from
// JavaScript (library mode), with the sources, main class and input as strings.
function start() {
  ready ??= (async () => {
    await cheerpjInit({ version: 21, status: 'none', javaProperties: ['java.security.manager=allow', 'file.encoding=UTF-8', 'stdout.encoding=UTF-8'] })
    const lib = await cheerpjRunLibrary('/app/cheerpj/runner.jar')
    return await lib.Runner
  })()
  return ready
}

function parseResult(text) {
  let i = text.indexOf('\n')
  const [status, compileMs, runMs] = text.slice(0, i).split(' ')
  const parts = []
  i += 1
  for (let k = 0; k < 3; k++) {
    const nl = text.indexOf('\n', i)
    const n = Number(text.slice(i, nl))
    parts.push(text.slice(nl + 1, nl + 1 + n))
    i = nl + 1 + n
  }
  return { status, compileErrors: parts[0], stdout: parts[1], stderr: parts[2], compileMs: Number(compileMs), runMs: Number(runMs) }
}

async function run({ id, files, mainClass, input }) {
  const started = performance.now()
  const Runner = await start()
  const packed = Object.entries(files).map(([name, text]) => `${name}\u0000${text}\u0000`).join('')
  const result = parseResult(await Runner.run(packed, mainClass, input))
  return { id, ...result, ms: performance.now() - started }
}

// Check: compile once, run every test. The reply lists each test's status, time and output.
function parseTests(text) {
  let i = text.indexOf('\n')
  const [status, compileMs, count] = text.slice(0, i).split(' ')
  i += 1
  const read = () => {
    const nl = text.indexOf('\n', i)
    const n = Number(text.slice(i, nl))
    const part = text.slice(nl + 1, nl + 1 + n)
    i = nl + 1 + n
    return part
  }
  const compileErrors = read()
  const tests = []
  for (let k = 0; k < Number(count); k++) {
    const nl = text.indexOf('\n', i)
    const [testStatus, ms] = text.slice(i, nl).split(' ')
    i = nl + 1
    tests.push({ status: testStatus.replace('_', ' '), ms: Number(ms), stdout: read(), stderr: read() })
  }
  return { status, compileMs: Number(compileMs), compileErrors, tests }
}

async function runTests({ id, files, mainClass, inputs }) {
  const started = performance.now()
  const Runner = await start()
  const packed = Object.entries(files).map(([name, text]) => `${name}\u0000${text}\u0000`).join('')
  const result = parseTests(await Runner.runTests(packed, mainClass, inputs.join('\u0000')))
  return { id, ...result, ms: performance.now() - started }
}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'runTests') {
    queue = queue.then(() =>
      runTests(event.data).then(
        (result) => self.postMessage({ type: 'testsResult', ...result }),
        (err) => self.postMessage({ type: 'testsResult', id: event.data.id, status: 'failed', compileErrors: String(err?.message ?? err), tests: [], ms: 0 }),
      ),
    )
    return
  }
  if (event.data?.type !== 'run') return
  queue = queue.then(() =>
    run(event.data).then(
      (result) => self.postMessage({ type: 'result', ...result }),
      (err) => self.postMessage({ type: 'result', id: event.data.id, status: 'failed', compileErrors: '', stdout: '', stderr: String(err?.message ?? err), ms: 0 }),
    ),
  )
})

self.postMessage({ type: 'ready' })
// Start the JVM straight away and warm up javac, so the first run is quicker.
start().then(async (Runner) => {
  self.postMessage({ type: 'jvm-ready' })
  queue = queue.then(() => Runner.warmUp()).catch(() => {})
})
