/**
 * Builds public/cheerpj/runner.jar from tools/cheerpj-runner/Runner.java: the class that
 * compiles and runs readers' Java inside CheerpJ (see public/cheerpj/worker.js).
 *
 *   npm run runner:cheerpj
 *
 * Needs a JDK 21+ (the jar targets Java 21, the version the frame starts in CheerpJ).
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { root } from './java-runner-lib.mjs'

const homes = [process.env.JAVA_HOME, '/opt/homebrew/opt/openjdk', '/opt/homebrew/opt/openjdk@21', '/usr/local/opt/openjdk']
const home = homes.find((h) => h && existsSync(path.join(h, 'bin/jar')))
if (!home) {
  console.error('No JDK 21+ found (set JAVA_HOME).')
  process.exit(2)
}
const work = mkdtempSync(path.join(os.tmpdir(), 'cheerpj-runner-'))
try {
  execFileSync(path.join(home, 'bin/javac'), ['--release', '21', '-Xlint:-removal', '-d', work, path.join(root, 'tools/cheerpj-runner/Runner.java')], { stdio: 'inherit' })
  const outDir = path.join(root, 'public/cheerpj')
  mkdirSync(outDir, { recursive: true })
  execFileSync(path.join(home, 'bin/jar'), ['--create', '--file', path.join(outDir, 'runner.jar'), '-C', work, '.'], { stdio: 'inherit' })
  console.log('Wrote public/cheerpj/runner.jar')
} finally {
  rmSync(work, { recursive: true, force: true })
}
