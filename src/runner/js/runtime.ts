/**
 * Runs lesson JavaScript in the browser so that it prints what Node prints.
 *
 * - `inspect` follows Node's util.inspect (v22) for the values lessons print: quoting,
 *   `{ a: 1 }`, `[ 1, 2 ]`, grouped number arrays, Map/Set, classes, depth, circular refs.
 * - `console` follows Node's console: format specifiers, table, group, count, assert, dir,
 *   and stdout/stderr streams.
 * - The event loop follows Node's order: process.nextTick before promise callbacks, timers
 *   phase, then setImmediate (check phase). Time is virtual, so a 2-second timeout finishes
 *   at once, in the right order.
 *
 * The file has no imports and no non-erasable TypeScript, so the build can run the same code
 * inside a Node `vm` context and compare it with real Node (scripts/build-js-lesson-runner.mjs).
 */

export type OutputEvent = { stream: 'out' | 'err'; text: string }
export type RunStatus = 'ok' | 'error' | 'stopped' | `exit ${number}`
export type ProgramMode = 'script' | 'module'

// ---------------------------------------------------------------- inspect

type InspectOptions = { depth?: number | null; breakLength?: number; compact?: number; maxArrayLength?: number }

type Ctx = {
  depth: number | null
  breakLength: number
  compact: number
  maxArrayLength: number
  indentationLvl: number
  currentDepth: number
  seen: unknown[]
  circular?: Map<unknown, number>
}

const ARRAY_TYPE = 1
const OBJECT_TYPE = 0
const ARRAY_EXTRAS_TYPE = 2

const META = [
  '\\x00', '\\x01', '\\x02', '\\x03', '\\x04', '\\x05', '\\x06', '\\x07',
  '\\b', '\\t', '\\n', '\\x0B', '\\f', '\\r', '\\x0E', '\\x0F',
  '\\x10', '\\x11', '\\x12', '\\x13', '\\x14', '\\x15', '\\x16', '\\x17',
  '\\x18', '\\x19', '\\x1A', '\\x1B', '\\x1C', '\\x1D', '\\x1E', '\\x1F',
]

const KEY_STRICT = /^[a-zA-Z_][a-zA-Z_0-9]*$/

export function strEscape(str: string): string {
  let quote = "'"
  if (str.includes("'")) {
    if (!str.includes('"')) quote = '"'
    else if (!str.includes('`') && !str.includes('${')) quote = '`'
  }
  let out = ''
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if (c === quote.charCodeAt(0) || c === 92) out += '\\' + str[i]
    else if (c < 32) out += META[c]
    else if (c === 0x7f) out += '\\x7F'
    else if (c >= 0xd800 && c <= 0xdfff) {
      const next = str.charCodeAt(i + 1)
      if (c <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) {
        out += str[i] + str[i + 1]
        i++
      } else out += `\\u${c.toString(16)}`
    } else out += str[i]
  }
  return quote + out + quote
}

function formatNumber(n: number): string {
  return Object.is(n, -0) ? '-0' : `${n}`
}

function formatPrimitive(ctx: Ctx, value: unknown): string {
  switch (typeof value) {
    case 'string': {
      if (value.length > 16 && value.length > ctx.breakLength - ctx.indentationLvl - 4) {
        return value
          .split(/(?<=\n)/)
          .map((line) => strEscape(line))
          .join(` +\n${' '.repeat(ctx.indentationLvl + 2)}`)
      }
      return strEscape(value)
    }
    case 'number':
      return formatNumber(value)
    case 'bigint':
      return `${value}n`
    case 'boolean':
      return `${value}`
    case 'undefined':
      return 'undefined'
    case 'symbol':
      return value.toString()
    default:
      return String(value)
  }
}

function getConstructorName(obj: object): string | null {
  let o: object | null = obj
  while (o !== null) {
    const desc = Object.getOwnPropertyDescriptor(o, 'constructor')
    if (desc !== undefined && typeof desc.value === 'function' && desc.value.name !== '') return desc.value.name as string
    o = Object.getPrototypeOf(o)
  }
  return null
}

function getPrefix(constructor: string | null, tag: string, fallback: string, size = ''): string {
  if (constructor === null) {
    if (tag !== '' && fallback !== tag) return `[${fallback}${size}: null prototype] [${tag}] `
    return `[${fallback}${size}: null prototype] `
  }
  if (tag !== '' && constructor !== tag) return `${constructor}${size} [${tag}] `
  return `${constructor}${size} `
}

const objectTag = (v: unknown) => Object.prototype.toString.call(v).slice(8, -1)
const isError = (v: unknown): v is Error => v instanceof Error || objectTag(v) === 'Error'
const TYPED_ARRAY = /^(Int8|Uint8|Uint8Clamped|Int16|Uint16|Int32|Uint32|Float32|Float64|BigInt64|BigUint64)Array$/

function getKeys(value: object, nonIndex: boolean): PropertyKey[] {
  const keys: PropertyKey[] = Object.keys(value).filter((k) => !nonIndex || !/^(0|[1-9][0-9]*)$/.test(k))
  for (const s of Object.getOwnPropertySymbols(value)) {
    if (Object.prototype.propertyIsEnumerable.call(value, s)) keys.push(s)
  }
  return keys
}

function getFunctionBase(value: Function, constructor: string | null, tag: string): string {
  const source = Function.prototype.toString.call(value)
  if (source.startsWith('class') && source.endsWith('}')) {
    const name = (Object.prototype.hasOwnProperty.call(value, 'name') && value.name) || '(anonymous)'
    let base = `class ${name}`
    if (constructor !== 'Function' && constructor !== null) base += ` [${constructor}]`
    if (tag !== '' && constructor !== tag) base += ` [${tag}]`
    if (constructor !== null) {
      const superName = (Object.getPrototypeOf(value) as { name?: string }).name
      if (superName) base += ` extends ${superName}`
    } else base += ' extends [null prototype]'
    return `[${base}]`
  }
  const kind = objectTag(value)
  let type = 'Function'
  if (kind === 'GeneratorFunction') type = 'GeneratorFunction'
  else if (kind === 'AsyncFunction') type = 'AsyncFunction'
  else if (kind === 'AsyncGeneratorFunction') type = 'AsyncGeneratorFunction'
  let base = `[${type}`
  if (constructor === null) base += ' (null prototype)'
  base += value.name === '' ? ' (anonymous)' : `: ${value.name}`
  base += ']'
  if (constructor !== type && constructor !== null) base += ` ${constructor}`
  if (tag !== '' && constructor !== tag) base += ` [${tag}]`
  return base
}

function formatError(err: Error): string {
  const name = err.name ?? 'Error'
  const message = err.message ?? ''
  let head = message ? `${name}: ${message}` : `${name}`
  const constructor = getConstructorName(err)
  if (constructor !== null && constructor !== name && !head.startsWith(constructor)) {
    head = head.startsWith(name) ? `${constructor} [${name}]${head.slice(name.length)}` : head
  }
  return head
}

function formatValue(ctx: Ctx, value: unknown, recurseTimes: number): string {
  if (typeof value !== 'object' && typeof value !== 'function') return formatPrimitive(ctx, value)
  if (value === null) return 'null'
  if (ctx.seen.includes(value)) {
    let index = 1
    if (ctx.circular === undefined) {
      ctx.circular = new Map()
      ctx.circular.set(value, index)
    } else {
      const existing = ctx.circular.get(value)
      if (existing === undefined) {
        index = ctx.circular.size + 1
        ctx.circular.set(value, index)
      } else index = existing
    }
    return `[Circular *${index}]`
  }
  return formatRaw(ctx, value as object, recurseTimes)
}

function formatRaw(ctx: Ctx, value: object, recurseTimes: number): string {
  const constructor = getConstructorName(value)
  let tag = (value as { [Symbol.toStringTag]?: unknown })[Symbol.toStringTag]
  if (typeof tag !== 'string' || (tag !== '' && tag === constructor)) tag = ''
  const t = tag as string
  let keys: PropertyKey[] = []
  let base = ''
  let braces: [string, string]
  let formatter: (ctx: Ctx, v: any, r: number) => string[] = () => []
  let extrasType = OBJECT_TYPE
  const kind = objectTag(value)

  if (Array.isArray(value)) {
    const prefix = constructor !== 'Array' || t !== '' ? getPrefix(constructor, t, 'Array', `(${value.length})`) : ''
    keys = getKeys(value, true)
    braces = [`${prefix}[`, ']']
    if (value.length === 0 && keys.length === 0) return `${braces[0]}]`
    extrasType = ARRAY_EXTRAS_TYPE
    formatter = formatArray
  } else if (value instanceof Set || kind === 'Set') {
    const size = (value as Set<unknown>).size
    const prefix = getPrefix(constructor, t, 'Set', `(${size})`)
    keys = getKeys(value, false)
    formatter = formatSet
    if (size === 0 && keys.length === 0) return `${prefix}{}`
    braces = [`${prefix}{`, '}']
  } else if (value instanceof Map || kind === 'Map') {
    const size = (value as Map<unknown, unknown>).size
    const prefix = getPrefix(constructor, t, 'Map', `(${size})`)
    keys = getKeys(value, false)
    formatter = formatMap
    if (size === 0 && keys.length === 0) return `${prefix}{}`
    braces = [`${prefix}{`, '}']
  } else if (TYPED_ARRAY.test(kind)) {
    const arr = value as unknown as ArrayLike<number | bigint>
    keys = getKeys(value, true)
    const prefix = getPrefix(constructor, t, kind, `(${arr.length})`)
    braces = [`${prefix}[`, ']']
    if (arr.length === 0 && keys.length === 0) return `${braces[0]}]`
    formatter = formatTypedArray
    extrasType = ARRAY_EXTRAS_TYPE
  } else {
    keys = getKeys(value, false)
    braces = ['{', '}']
    if (constructor === 'Object' && kind === 'Object' && t === '') {
      if (keys.length === 0) return '{}'
    } else if (typeof value === 'function') {
      base = getFunctionBase(value, constructor, t)
      if (keys.length === 0) return base
    } else if (kind === 'RegExp') {
      base = RegExp.prototype.toString.call(value)
      const prefix = getPrefix(constructor, t, 'RegExp')
      if (prefix !== 'RegExp ') base = `${prefix}${base}`
      if (keys.length === 0) return base
    } else if (kind === 'Date') {
      const time = (value as Date).getTime()
      base = Number.isNaN(time) ? 'Invalid Date' : (value as Date).toISOString()
      const prefix = getPrefix(constructor, t, 'Date')
      if (prefix !== 'Date ') base = `${prefix}${base}`
      if (keys.length === 0) return base
    } else if (isError(value)) {
      // Node prints the stack under the message; the browser's frames would be meaningless,
      // so one placeholder frame keeps Node's layout (an error inside an object is multi-line).
      base = `${formatError(value)}\n    at <anonymous>`
      if (ctx.indentationLvl !== 0) base = base.replaceAll('\n', `\n${' '.repeat(ctx.indentationLvl)}`)
      keys = keys.filter((k) => k !== 'stack' && k !== 'message')
      if (keys.length === 0) return base
    } else if (kind === 'Number' || kind === 'String' || kind === 'Boolean' || kind === 'BigInt' || kind === 'Symbol') {
      const prim = (value as { valueOf(): unknown }).valueOf()
      const fallback = kind
      let inner = formatPrimitive({ ...ctx, breakLength: Infinity }, prim)
      if (kind === 'String') keys = keys.filter((k) => !(typeof k === 'string' && /^(0|[1-9][0-9]*)$/.test(k)))
      if (constructor === fallback || constructor === null) inner = `[${fallback}: ${inner}]`
      else inner = `[${fallback} (${constructor}): ${inner}]`
      base = inner
      if (keys.length === 0) return base
    } else if (kind === 'Promise') {
      braces[0] = `${getPrefix(constructor, t, 'Promise')}{`
      formatter = () => ['<unknown>']
    } else if (kind === 'WeakSet' || kind === 'WeakMap') {
      return `${getPrefix(constructor, t, kind)}{ <items unknown> }`
    } else if (kind === 'Arguments') {
      braces = ['[Arguments] [', ']']
      extrasType = ARRAY_EXTRAS_TYPE
      formatter = formatArray
      keys = getKeys(value, true)
    } else {
      braces[0] = `${getPrefix(constructor, t, 'Object')}{`
      if (keys.length === 0) return `${braces[0]}}`
    }
  }

  if (ctx.depth !== null && recurseTimes > ctx.depth) {
    let name = getPrefix(constructor, t, Array.isArray(value) ? 'Array' : 'Object').slice(0, -1)
    if (constructor !== null) name = `[${name}]`
    return name
  }
  recurseTimes += 1
  ctx.seen.push(value)
  ctx.currentDepth = recurseTimes
  let output: string[]
  try {
    output = formatter(ctx, value, recurseTimes)
    for (const key of keys) output.push(formatProperty(ctx, value, recurseTimes, key, extrasType))
  } finally {
    ctx.seen.pop()
  }
  if (ctx.circular !== undefined) {
    const index = ctx.circular.get(value)
    if (index !== undefined) {
      const reference = `<ref *${index}>`
      base = base === '' ? reference : `${reference} ${base}`
    }
  }
  return reduceToSingleString(ctx, output, base, braces, extrasType, recurseTimes, value)
}

function formatProperty(ctx: Ctx, value: object, recurseTimes: number, key: PropertyKey, type: number): string {
  let str: string
  const desc = Object.getOwnPropertyDescriptor(value, key) ?? { value: (value as Record<PropertyKey, unknown>)[key], enumerable: true }
  if (desc.value !== undefined) {
    ctx.indentationLvl += 2
    str = formatValue(ctx, desc.value, recurseTimes)
    ctx.indentationLvl -= 2
  } else if (desc.get !== undefined) {
    str = desc.set !== undefined ? '[Getter/Setter]' : '[Getter]'
  } else if (desc.set !== undefined) {
    str = '[Setter]'
  } else {
    str = 'undefined'
  }
  if (type === ARRAY_TYPE) return str
  let name: string
  if (typeof key === 'symbol') name = `[${key.toString()}]`
  else if (KEY_STRICT.test(key as string)) name = key as string
  else name = strEscape(key as string)
  return `${name}: ${str}`
}

function formatArray(ctx: Ctx, value: unknown[], recurseTimes: number): string[] {
  const len = Math.min(Math.max(0, ctx.maxArrayLength), value.length)
  const remaining = value.length - len
  const output: string[] = []
  let holes = 0
  for (let i = 0; i < len; i++) {
    if (!Object.prototype.hasOwnProperty.call(value, i)) {
      holes++
      continue
    }
    if (holes > 0) {
      output.push(`<${holes} empty item${holes > 1 ? 's' : ''}>`)
      holes = 0
    }
    output.push(formatProperty(ctx, value, recurseTimes, i, ARRAY_TYPE))
  }
  if (holes > 0) output.push(`<${holes} empty item${holes > 1 ? 's' : ''}>`)
  if (remaining > 0) output.push(`... ${remaining} more item${remaining > 1 ? 's' : ''}`)
  return output
}

function formatTypedArray(ctx: Ctx, value: ArrayLike<number | bigint>, recurseTimes: number): string[] {
  const len = Math.min(Math.max(0, ctx.maxArrayLength), value.length)
  const output: string[] = []
  for (let i = 0; i < len; i++) output.push(formatPrimitive(ctx, value[i]))
  if (value.length > len) output.push(`... ${value.length - len} more item${value.length - len > 1 ? 's' : ''}`)
  void recurseTimes
  return output
}

function formatSet(ctx: Ctx, value: Set<unknown>, recurseTimes: number): string[] {
  const output: string[] = []
  ctx.indentationLvl += 2
  for (const v of value) output.push(formatValue(ctx, v, recurseTimes))
  ctx.indentationLvl -= 2
  return output
}

function formatMap(ctx: Ctx, value: Map<unknown, unknown>, recurseTimes: number): string[] {
  const output: string[] = []
  ctx.indentationLvl += 2
  for (const [k, v] of value) output.push(`${formatValue(ctx, k, recurseTimes)} => ${formatValue(ctx, v, recurseTimes)}`)
  ctx.indentationLvl -= 2
  return output
}

function groupArrayElements(ctx: Ctx, output: string[], value: unknown): string[] {
  let totalLength = 0
  let maxLength = 0
  let outputLength = output.length
  if (Array.isArray(value) && ctx.maxArrayLength < value.length) outputLength--
  const separatorSpace = 2
  const dataLen: number[] = new Array(outputLength)
  for (let i = 0; i < outputLength; i++) {
    const len = output[i].length
    dataLen[i] = len
    totalLength += len + separatorSpace
    if (maxLength < len) maxLength = len
  }
  const actualMax = maxLength + separatorSpace
  if (actualMax * 3 + ctx.indentationLvl < ctx.breakLength && (totalLength / actualMax > 5 || maxLength <= 6)) {
    const averageBias = Math.sqrt(actualMax - totalLength / output.length)
    const biasedMax = Math.max(actualMax - 3 - averageBias, 1)
    const columns = Math.min(
      Math.round(Math.sqrt(2.5 * biasedMax * outputLength) / biasedMax),
      Math.floor((ctx.breakLength - ctx.indentationLvl) / actualMax),
      ctx.compact * 4,
      15,
    )
    if (columns <= 1) return output
    const tmp: string[] = []
    const maxLineLength: number[] = []
    for (let i = 0; i < columns; i++) {
      let lineLength = 0
      for (let j = i; j < output.length; j += columns) if (dataLen[j] > lineLength) lineLength = dataLen[j]
      maxLineLength.push(lineLength + separatorSpace)
    }
    let padStart = true
    if (value !== undefined) {
      const arr = value as unknown[]
      for (let i = 0; i < output.length; i++) {
        if (typeof arr[i] !== 'number' && typeof arr[i] !== 'bigint') {
          padStart = false
          break
        }
      }
    }
    for (let i = 0; i < outputLength; i += columns) {
      const max = Math.min(i + columns, outputLength)
      let str = ''
      let j = i
      for (; j < max - 1; j++) {
        const padding = maxLineLength[j - i] + output[j].length - dataLen[j]
        str += padStart ? `${output[j]}, `.padStart(padding, ' ') : `${output[j]}, `.padEnd(padding, ' ')
      }
      if (padStart) {
        const padding = maxLineLength[j - i] + output[j].length - dataLen[j] - separatorSpace
        str += output[j].padStart(padding, ' ')
      } else {
        str += output[j]
      }
      tmp.push(str)
    }
    if (Array.isArray(value) && ctx.maxArrayLength < value.length) tmp.push(output[outputLength])
    output = tmp
  }
  return output
}

function isBelowBreakLength(ctx: Ctx, output: string[], start: number, base: string): boolean {
  let totalLength = output.length + start
  if (totalLength + output.length > ctx.breakLength) return false
  for (const entry of output) {
    totalLength += entry.length
    if (totalLength > ctx.breakLength) return false
  }
  return base === '' || !base.includes('\n')
}

function reduceToSingleString(
  ctx: Ctx,
  output: string[],
  base: string,
  braces: [string, string],
  extrasType: number,
  recurseTimes: number,
  value: unknown,
): string {
  const entries = output.length
  if (extrasType === ARRAY_EXTRAS_TYPE && entries > 6) output = groupArrayElements(ctx, output, value)
  if (ctx.currentDepth - recurseTimes < ctx.compact && entries === output.length) {
    const start = output.length + ctx.indentationLvl + braces[0].length + base.length + 10
    if (isBelowBreakLength(ctx, output, start, base)) {
      const joined = output.join(', ')
      if (!joined.includes('\n')) return `${base ? `${base} ` : ''}${braces[0]} ${joined} ${braces[1]}`
    }
  }
  const indentation = `\n${' '.repeat(ctx.indentationLvl)}`
  return `${base ? `${base} ` : ''}${braces[0]}${indentation}  ${output.join(`,${indentation}  `)}${indentation}${braces[1]}`
}

export function inspect(value: unknown, options: InspectOptions = {}): string {
  const ctx: Ctx = {
    depth: options.depth === undefined ? 2 : options.depth,
    breakLength: options.breakLength ?? 80,
    compact: options.compact ?? 3,
    maxArrayLength: options.maxArrayLength ?? 100,
    indentationLvl: 0,
    currentDepth: 0,
    seen: [],
  }
  return formatValue(ctx, value, 0)
}

/** Node's util.format / console.log argument formatting. */
export function format(args: unknown[], options: InspectOptions = {}): string {
  const opts = { breakLength: 80, ...options }
  const first = args[0]
  let a = 0
  let str = ''
  let join = ''
  if (typeof first === 'string') {
    if (args.length === 1) return first
    let tempStr = ''
    let lastPos = 0
    for (let i = 0; i < first.length - 1; i++) {
      if (first.charCodeAt(i) === 37) {
        const next = first.charCodeAt(++i)
        if (a + 1 !== args.length) {
          switch (next) {
            case 115: {
              const arg = args[++a]
              if (typeof arg === 'number') tempStr = formatNumber(arg)
              else if (typeof arg === 'bigint') tempStr = `${arg}n`
              else if (typeof arg !== 'object' || arg === null) tempStr = String(arg)
              else tempStr = inspect(arg, { ...opts, depth: 0 })
              break
            }
            case 106:
              tempStr = JSON.stringify(args[++a])
              break
            case 100: {
              const n = args[++a]
              tempStr = typeof n === 'bigint' ? `${n}n` : typeof n === 'symbol' ? 'NaN' : formatNumber(Number(n))
              break
            }
            case 79:
              tempStr = inspect(args[++a], opts)
              break
            case 111:
              tempStr = inspect(args[++a], { ...opts, depth: 4 })
              break
            case 105: {
              const n = args[++a]
              tempStr = typeof n === 'bigint' ? `${n}n` : typeof n === 'symbol' ? 'NaN' : formatNumber(Number.parseInt(String(n)))
              break
            }
            case 102: {
              const n = args[++a]
              tempStr = typeof n === 'symbol' ? 'NaN' : formatNumber(Number.parseFloat(String(n)))
              break
            }
            case 99:
              a++
              tempStr = ''
              break
            case 37:
              str += first.slice(lastPos, i)
              lastPos = i + 1
              continue
            default:
              continue
          }
          if (lastPos !== i - 1) str += first.slice(lastPos, i - 1)
          str += tempStr
          lastPos = i + 1
        } else if (next === 37) {
          str += first.slice(lastPos, i)
          lastPos = i + 1
        }
      }
    }
    if (lastPos !== 0) {
      a++
      join = ' '
      if (lastPos < first.length) str += first.slice(lastPos)
    }
  }
  while (a < args.length) {
    const value = args[a]
    str += join
    str += typeof value !== 'string' ? inspect(value, opts) : value
    join = ' '
    a++
  }
  return str
}

// ---------------------------------------------------------------- console

function renderTable(head: string[], columns: string[][]): string {
  const rows: string[][] = []
  const widths = head.map((h) => h.length)
  const longest = Math.max(0, ...columns.map((c) => c.length))
  for (let i = 0; i < head.length; i++) {
    const column = columns[i]
    for (let j = 0; j < longest; j++) {
      rows[j] ??= []
      const v = (rows[j][i] = Object.prototype.hasOwnProperty.call(column, j) ? column[j] : '')
      widths[i] = Math.max(widths[i] ?? 0, v.length)
    }
  }
  const renderRow = (row: string[]) => {
    let out = '│ '
    for (let i = 0; i < row.length; i++) {
      const cell = row[i]
      const needed = (widths[i] - cell.length) / 2
      out += ' '.repeat(Math.floor(needed)) + cell + ' '.repeat(Math.ceil(needed))
      if (i !== row.length - 1) out += ' │ '
    }
    return out + ' │'
  }
  const divider = widths.map((w) => '─'.repeat(w + 2))
  let result = `┌${divider.join('┬')}┐\n${renderRow(head)}\n├${divider.join('┼')}┤\n`
  for (const row of rows) result += `${renderRow(row)}\n`
  return result + `└${divider.join('┴')}┘`
}

function tableInspect(v: unknown): string {
  const depth = v !== null && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 2 ? -1 : 0
  return inspect(v, { depth, maxArrayLength: 3, breakLength: Infinity })
}

export function makeConsole(emit: (stream: 'out' | 'err', text: string) => void, now: () => number) {
  let indent = ''
  const counts = new Map<string, number>()
  const timers = new Map<string, number>()
  const write = (stream: 'out' | 'err', text: string) => {
    emit(stream, (indent ? text.split('\n').map((l) => indent + l).join('\n') : text) + '\n')
  }
  const log = (...args: unknown[]) => write('out', format(args))
  const error = (...args: unknown[]) => write('err', format(args))
  const table = (data: unknown, properties?: string[]) => {
    if (data === null || typeof data !== 'object') return log(data)
    const index = (n: number) => Array.from({ length: n }, (_, i) => tableInspect(i))
    if (data instanceof Map) {
      const keys: string[] = []
      const values: string[] = []
      for (const [k, v] of data) {
        keys.push(tableInspect(k))
        values.push(tableInspect(v))
      }
      return log(renderTable(['(iteration index)', 'Key', 'Values'], [index(keys.length), keys, values]))
    }
    if (data instanceof Set) {
      const values = [...data].map(tableInspect)
      return log(renderTable(['(iteration index)', 'Values'], [index(values.length), values]))
    }
    const map: Record<string, string[]> = Object.create(null)
    let hasPrimitives = false
    const valuesKeyArray: string[] = []
    const indexKeyArray = Object.keys(data)
    for (let i = 0; i < indexKeyArray.length; i++) {
      const item = (data as Record<string, unknown>)[indexKeyArray[i]]
      const primitive = item === null || (typeof item !== 'function' && typeof item !== 'object')
      if (properties === undefined && primitive) {
        hasPrimitives = true
        valuesKeyArray[i] = tableInspect(item)
      } else {
        const keys = properties ?? Object.keys(item as object)
        for (const key of keys) {
          map[key] ??= []
          if ((primitive && properties) || !Object.prototype.hasOwnProperty.call(item, key)) map[key][i] = ''
          else map[key][i] = tableInspect((item as Record<string, unknown>)[key])
        }
      }
    }
    const keys = Object.keys(map)
    const values = Object.values(map)
    if (hasPrimitives) {
      keys.push('Values')
      values.push(valuesKeyArray)
    }
    keys.unshift('(index)')
    values.unshift(indexKeyArray)
    return log(renderTable(keys, values))
  }
  const formatTime = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(3)}s` : `${ms.toFixed(3)}ms`)
  return {
    log,
    info: log,
    debug: log,
    error,
    warn: error,
    trace: (...args: unknown[]) => write('err', `Trace${args.length ? ': ' + format(args) : ''}`),
    dir: (value: unknown, options?: InspectOptions) => write('out', inspect(value, { breakLength: 80, ...options })),
    dirxml: log,
    table,
    group: (...args: unknown[]) => {
      if (args.length > 0) log(...args)
      indent += '  '
    },
    groupCollapsed: (...args: unknown[]) => {
      if (args.length > 0) log(...args)
      indent += '  '
    },
    groupEnd: () => {
      indent = indent.slice(0, -2)
    },
    count: (label = 'default') => {
      const n = (counts.get(`${label}`) ?? 0) + 1
      counts.set(`${label}`, n)
      log(`${label}: ${n}`)
    },
    countReset: (label = 'default') => void counts.delete(`${label}`),
    assert: (condition: unknown, ...args: unknown[]) => {
      if (condition) return
      if (typeof args[0] === 'string') args[0] = `Assertion failed: ${args[0]}`
      else args.unshift('Assertion failed')
      error(...args)
    },
    time: (label = 'default') => void timers.set(`${label}`, now()),
    timeEnd: (label = 'default') => {
      const start = timers.get(`${label}`)
      if (start === undefined) return
      timers.delete(`${label}`)
      log(`${label}: ${formatTime(now() - start)}`)
    },
    timeLog: (label = 'default', ...data: unknown[]) => {
      const start = timers.get(`${label}`)
      if (start === undefined) return
      log(`${label}: ${formatTime(now() - start)}`, ...data)
    },
  }
}

// ---------------------------------------------------------------- event loop and program

class ExitSignal {
  readonly code: number
  constructor(code: number) {
    this.code = code
  }
}

/** The text Node prints for an uncaught exception, without the stack frames. */
export function uncaughtText(err: unknown): string {
  if (isError(err)) return formatError(err)
  return `Uncaught ${inspect(err)}`
}

export type RunOptions = {
  /** JavaScript to run: CommonJS-style (require/module/exports available). */
  code: string
  mode: ProgramMode
  /** Yields to the host event loop so pending promise callbacks run (a real macrotask). */
  hostYield: () => Promise<void>
  /** The global object to install timers, console and process on. */
  global: Record<string, any>
  /** Receives output as it is produced. */
  emit: (event: OutputEvent) => void
  /** Most timer callbacks to run before stopping (guards against endless intervals). */
  maxCallbacks?: number
  /** Extra modules for require/import, such as provided npm packages ('react', 'zod'). */
  modules?: Record<string, unknown>
}

type Timer = { id: number; time: number; seq: number; cb: () => void; interval: number | null }

/**
 * Runs a program to completion, the way `node main.js` would: the main script, then
 * nextTick callbacks, promise callbacks, timers and immediates until nothing is left.
 * Resolves with the status: ok, error (an uncaught exception or unhandled rejection),
 * exit N (process.exit), or stopped (too many timer callbacks).
 */
export async function runProgram(options: RunOptions): Promise<RunStatus> {
  const { global: g, emit, hostYield } = options
  const maxCallbacks = options.maxCallbacks ?? 100_000
  const realPerf = typeof g.performance?.now === 'function' ? g.performance.now.bind(g.performance) : () => Date.now()
  const realDate = g.Date.now.bind(g.Date) as () => number
  // Virtual time: a timer of 400 ms moves Date.now() and performance.now() forward by 400 ms,
  // so programs that measure elapsed time print what they print in Node.
  const realNow = () => (realPerf() as number) + clock
  let status: RunStatus = 'ok'
  let finished = false
  const out = (stream: 'out' | 'err', text: string) => {
    if (!finished) emit({ stream, text })
  }
  const processListeners: Record<string, ((...args: unknown[]) => void)[]> = {}
  const fail = (err: unknown, kind: 'exception' | 'rejection' = 'exception', promise?: unknown) => {
    if (finished) return
    const handlers = !(err instanceof ExitSignal) && (processListeners[kind === 'rejection' ? 'unhandledRejection' : 'uncaughtException'] ?? [])
    if (handlers && handlers.length > 0) {
      try {
        for (const h of handlers) {
          if (kind === 'rejection') h(err, promise)
          else h(err, 'uncaughtException')
        }
      } catch (inner) {
        fail(inner)
      }
      return
    }
    if (err instanceof ExitSignal) {
      status = `exit ${err.code}`
    } else {
      out('err', `${uncaughtText(err)}\n`)
      status = 'error'
    }
    finished = true
  }

  // Timers (virtual time).
  let clock = 0
  g.Date.now = () => realDate() + clock
  if (g.performance) {
    try {
      Object.defineProperty(g.performance, 'now', { value: () => realPerf() + clock, configurable: true })
    } catch {
      // performance.now cannot be replaced here; elapsed times will read 0
    }
  }
  let seq = 0
  let nextId = 1
  const timers = new Map<number, Timer>()
  const immediates: { id: number; cb: () => void }[] = []
  const ticks: (() => void)[] = []
  let tickScheduled = false

  const drainTicks = () => {
    while (ticks.length > 0 && !finished) {
      const cb = ticks.shift()!
      try {
        cb()
      } catch (err) {
        fail(err)
      }
    }
  }
  const makeTimer = (cb: unknown, delay: unknown, args: unknown[], repeat: boolean) => {
    if (typeof cb !== 'function') throw new TypeError('The "callback" argument must be of type function')
    let ms = Number(delay)
    if (!(ms >= 1 && ms <= 2147483647)) ms = 1
    const id = nextId++
    timers.set(id, { id, time: clock + ms, seq: seq++, cb: () => cb(...args), interval: repeat ? ms : null })
    return makeHandle(id)
  }
  const makeHandle = (id: number) => {
    const handle = {
      ref: () => handle,
      unref: () => handle,
      hasRef: () => true,
      refresh: () => handle,
      [Symbol.toPrimitive]: () => id,
    }
    handleIds.set(handle, id)
    return handle
  }
  const handleIds = new WeakMap<object, number>()
  const idOf = (h: unknown) => (typeof h === 'object' && h !== null ? handleIds.get(h) : typeof h === 'number' ? h : undefined)

  g.setTimeout = (cb: unknown, delay?: unknown, ...args: unknown[]) => makeTimer(cb, delay, args, false)
  g.setInterval = (cb: unknown, delay?: unknown, ...args: unknown[]) => makeTimer(cb, delay, args, true)
  g.clearTimeout = g.clearInterval = (h: unknown) => {
    const id = idOf(h)
    if (id !== undefined) timers.delete(id)
  }
  g.setImmediate = (cb: (...a: unknown[]) => void, ...args: unknown[]) => {
    const id = nextId++
    immediates.push({ id, cb: () => cb(...args) })
    return makeHandle(id)
  }
  g.clearImmediate = (h: unknown) => {
    const id = idOf(h)
    const i = immediates.findIndex((im) => im.id === id)
    if (i >= 0) immediates.splice(i, 1)
  }
  if (g.AbortSignal && g.AbortController) {
    // AbortSignal.timeout on the virtual clock, like the timers.
    g.AbortSignal.timeout = (ms: number) => {
      const controller = new g.AbortController()
      g.setTimeout(() => controller.abort(new g.DOMException('The operation was aborted due to timeout', 'TimeoutError')), ms)
      return controller.signal
    }
  }
  g.queueMicrotask = (cb: () => void) => {
    Promise.resolve().then(() => {
      try {
        cb()
      } catch (err) {
        fail(err)
      }
    })
  }

  const nodeConsole = makeConsole(out, realNow)
  g.console = nodeConsole
  const exit = (code?: number) => {
    throw new ExitSignal(Number(code ?? 0) || 0)
  }
  g.process = {
    nextTick: (cb: (...a: unknown[]) => void, ...args: unknown[]) => {
      ticks.push(() => cb(...args))
      if (!tickScheduled) {
        tickScheduled = true
        Promise.resolve().then(() => {
          tickScheduled = false
          drainTicks()
        })
      }
    },
    exit,
    stdout: { write: (s: unknown) => (out('out', String(s)), true), isTTY: false, columns: 80 },
    stderr: { write: (s: unknown) => (out('err', String(s)), true), isTTY: false },
    env: {},
    argv: ['node', 'main.js'],
    platform: 'linux',
    version: 'v22.0.0',
    versions: { node: '22.0.0' },
    exitCode: undefined,
    hrtime: Object.assign((prev?: [number, number]) => {
      const ns = BigInt(Math.round(realNow() * 1e6))
      const t: [number, number] = [Number(ns / 1_000_000_000n), Number(ns % 1_000_000_000n)]
      if (!prev) return t
      let s = t[0] - prev[0]
      let n = t[1] - prev[1]
      if (n < 0) {
        s--
        n += 1e9
      }
      return [s, n]
    }, { bigint: () => BigInt(Math.round(realNow() * 1e6)) }),
    memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 }),
    cwd: () => '/',
    on: (event: string, listener: (...args: unknown[]) => void) => {
      ;(processListeners[event] ??= []).push(listener)
      return g.process
    },
    once: (event: string, listener: (...args: unknown[]) => void) => {
      ;(processListeners[event] ??= []).push(listener)
      return g.process
    },
    off: (event: string, listener: (...args: unknown[]) => void) => {
      processListeners[event] = (processListeners[event] ?? []).filter((l) => l !== listener)
      return g.process
    },
  }
  g.process.removeListener = g.process.off
  g.global = g
  const modules: Record<string, unknown> = {
    util: { inspect: (v: unknown, o?: InspectOptions) => inspect(v, o), format: (...a: unknown[]) => format(a), promisify: promisifyFn, isDeepStrictEqual: undefined },
    events: makeEvents(),
    'timers/promises': {
      setTimeout: (ms?: number, value?: unknown) => new Promise((r) => g.setTimeout(() => r(value), ms)),
      setImmediate: (value?: unknown) => new Promise((r) => g.setImmediate(() => r(value))),
    },
  }
  Object.assign(modules, options.modules ?? {})
  const require = (name: string) => {
    if (name in modules) return modules[name]
    const key = name.replace(/^node:/, '')
    if (key in modules) return modules[key]
    const err = new Error(`Cannot find module '${name}' (the browser runner has no Node modules or files)`) as Error & { code?: string }
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }

  // The unhandled-rejection check runs after each turn, as in Node.
  const pendingRejections = new Map<Promise<unknown>, unknown>()
  g.__trackRejection = (promise: Promise<unknown>, reason: unknown, handled: boolean) => {
    if (handled) pendingRejections.delete(promise)
    else pendingRejections.set(promise, reason)
  }
  const checkRejections = () => {
    const entries = [...pendingRejections]
    pendingRejections.clear()
    for (const [promise, reason] of entries) fail(reason, 'rejection', promise)
  }

  const settle = async () => {
    drainTicks()
    for (let i = 0; i < 3 && !finished; i++) {
      await hostYield()
      drainTicks()
    }
    checkRejections()
  }

  // Main script.
  const module = { exports: {} as Record<string, unknown> }
  const params = ['require', 'module', 'exports', '__filename', '__dirname']
  try {
    if (options.mode === 'module') {
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as FunctionConstructor
      const fn = new AsyncFunction(...params, options.code)
      const done = fn.call(undefined, require, module, module.exports, '/main.mjs', '/')
      done.catch((err: unknown) => fail(err))
    } else {
      const fn = new g.Function(...params, options.code)
      fn.call(module.exports, require, module, module.exports, '/main.js', '/')
    }
  } catch (err) {
    fail(err)
  }
  await settle()

  // Event loop: timers phase, then check phase (setImmediate), until nothing is pending.
  let callbacks = 0
  clock += 1 // the loop starts a moment after the main script, as in Node
  while (!finished) {
    if (timers.size === 0 && immediates.length === 0) break
    if (timers.size > 0) {
      if (immediates.length === 0) {
        const earliest = Math.min(...[...timers.values()].map((t) => t.time))
        if (earliest > clock) clock = earliest
      }
      const due = [...timers.values()].filter((t) => t.time <= clock).sort((a, b) => a.time - b.time || a.seq - b.seq)
      for (const t of due) {
        if (finished) break
        if (!timers.has(t.id)) continue
        if (t.interval === null) timers.delete(t.id)
        else {
          t.time = clock + t.interval
          t.seq = seq++
        }
        try {
          t.cb()
        } catch (err) {
          fail(err)
        }
        await settle()
        if (++callbacks > maxCallbacks) {
          status = 'stopped'
          finished = true
        }
      }
    }
    const batch = immediates.splice(0, immediates.length)
    for (const im of batch) {
      if (finished) break
      try {
        im.cb()
      } catch (err) {
        fail(err)
      }
      await settle()
      if (++callbacks > maxCallbacks) {
        status = 'stopped'
        finished = true
      }
    }
  }
  const final = status as RunStatus
  const exitCode = final === 'ok' ? 0 : final === 'error' ? 1 : final.startsWith('exit') ? Number(final.slice(5)) : 0
  if (final !== 'stopped') {
    for (const h of processListeners.exit ?? []) {
      try {
        h(exitCode)
      } catch (err) {
        fail(err)
      }
    }
  }
  finished = true
  return status
}

function promisifyFn(fn: (...args: unknown[]) => void) {
  return (...args: unknown[]) =>
    new Promise((resolve, reject) => {
      fn(...args, (err: unknown, value: unknown) => (err ? reject(err) : resolve(value)))
    })
}

/** Node's EventEmitter (the parts lessons use), as require('events') / 'node:events'. */
export function makeEvents() {
  type Listener = ((...args: any[]) => void) & { listener?: (...args: any[]) => void }
  class EventEmitter {
    _events: Record<string | symbol, Listener[]> = Object.create(null)
    _maxListeners: number | undefined = undefined
    static defaultMaxListeners = 10
    on(name: string | symbol, listener: Listener) {
      return this.addListener(name, listener)
    }
    addListener(name: string | symbol, listener: Listener) {
      if (typeof listener !== 'function') throw new TypeError('The "listener" argument must be of type function')
      if (this._events.newListener) this.emit('newListener', name, listener.listener ?? listener)
      ;(this._events[name] ??= []).push(listener)
      return this
    }
    prependListener(name: string | symbol, listener: Listener) {
      ;(this._events[name] ??= []).unshift(listener)
      return this
    }
    once(name: string | symbol, listener: Listener) {
      const wrapped: Listener = (...args: unknown[]) => {
        this.removeListener(name, wrapped)
        return listener.apply(this, args)
      }
      wrapped.listener = listener
      return this.on(name, wrapped)
    }
    prependOnceListener(name: string | symbol, listener: Listener) {
      const wrapped: Listener = (...args: unknown[]) => {
        this.removeListener(name, wrapped)
        return listener.apply(this, args)
      }
      wrapped.listener = listener
      return this.prependListener(name, wrapped)
    }
    off(name: string | symbol, listener: Listener) {
      return this.removeListener(name, listener)
    }
    removeListener(name: string | symbol, listener: Listener) {
      const list = this._events[name]
      if (!list) return this
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          list.splice(i, 1)
          if (list.length === 0) delete this._events[name]
          if (this._events.removeListener) this.emit('removeListener', name, listener)
          break
        }
      }
      return this
    }
    removeAllListeners(name?: string | symbol) {
      if (name === undefined) this._events = Object.create(null)
      else delete this._events[name]
      return this
    }
    emit(name: string | symbol, ...args: unknown[]) {
      const list = this._events[name]
      if (!list || list.length === 0) {
        if (name === 'error') {
          const err = args[0]
          if (err instanceof Error) throw err
          const e = new Error(`Unhandled error. (${inspect(err)})`) as Error & { code?: string }
          e.code = 'ERR_UNHANDLED_ERROR'
          throw e
        }
        return false
      }
      for (const l of [...list]) l.apply(this, args)
      return true
    }
    listenerCount(name: string | symbol) {
      return this._events[name]?.length ?? 0
    }
    listeners(name: string | symbol) {
      return (this._events[name] ?? []).map((l) => l.listener ?? l)
    }
    rawListeners(name: string | symbol) {
      return [...(this._events[name] ?? [])]
    }
    eventNames() {
      return Reflect.ownKeys(this._events)
    }
    setMaxListeners(n: number) {
      this._maxListeners = n
      return this
    }
    getMaxListeners() {
      return this._maxListeners ?? EventEmitter.defaultMaxListeners
    }
  }
  const once = (emitter: EventEmitter, name: string) =>
    new Promise((resolve, reject) => {
      const onError = (err: unknown) => {
        emitter.removeListener(name, onEvent)
        reject(err)
      }
      const onEvent = (...args: unknown[]) => {
        if (name !== 'error') emitter.removeListener('error', onError)
        resolve(args)
      }
      emitter.once(name, onEvent)
      if (name !== 'error') emitter.once('error', onError)
    })
  return Object.assign(EventEmitter, { EventEmitter, once, default: EventEmitter })
}
