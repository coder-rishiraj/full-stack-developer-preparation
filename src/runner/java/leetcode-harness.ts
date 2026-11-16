/**
 * A Java harness for any LeetCode problem, generated from LeetCode's method signature
 * (`metaData`): it reads one example's input (LeetCode's format, one value per parameter),
 * calls the reader's Solution (or drives their design class), and prints the result in
 * LeetCode's notation, so it can be compared with the statement's expected output.
 */
import inSource from '../../../tools/java-runner/src/main/java/runner/In.java?raw'
import showSource from '../../../tools/java-runner/src/main/java/runner/Show.java?raw'

type Param = { name: string; type: string }
export type LeetCodeMeta = {
  name?: string
  params?: Param[]
  return?: { type: string }
  output?: { paramindex: number; size?: string }
  classname?: string
  /** Typed loosely: every object also has a built-in `constructor`. */
  constructor?: unknown
  methods?: { name: string; params: Param[]; return: { type: string } }[]
}

/** LeetCode type -> [Java type, conversion from a parsed value `v`]. */
const TYPES: Record<string, [string, (v: string) => string]> = {
  integer: ['int', (v) => `runner.In.toInt(${v})`],
  long: ['long', (v) => `runner.In.toLong(${v})`],
  double: ['double', (v) => `runner.In.toDouble(${v})`],
  boolean: ['boolean', (v) => `runner.In.toBoolean(${v})`],
  character: ['char', (v) => `runner.In.toChar(${v})`],
  string: ['String', (v) => `runner.In.toStr(${v})`],
  'integer[]': ['int[]', (v) => `runner.In.toIntArray(${v})`],
  'long[]': ['long[]', (v) => `runner.In.toLongArray(${v})`],
  'double[]': ['double[]', (v) => `runner.In.toDoubleArray(${v})`],
  'boolean[]': ['boolean[]', (v) => `runner.In.toBooleanArray(${v})`],
  'character[]': ['char[]', (v) => `runner.In.toCharArray(${v})`],
  'string[]': ['String[]', (v) => `runner.In.toStrArray(${v})`],
  'integer[][]': ['int[][]', (v) => `runner.In.toIntArray2(${v})`],
  'character[][]': ['char[][]', (v) => `runner.In.toCharArray2(${v})`],
  'string[][]': ['String[][]', (v) => `runner.In.toStrArray2(${v})`],
  'list<integer>': ['java.util.List<Integer>', (v) => `runner.In.toIntList(${v})`],
  'list<string>': ['java.util.List<String>', (v) => `runner.In.toStrList(${v})`],
  'list<list<integer>>': ['java.util.List<java.util.List<Integer>>', (v) => `runner.In.toIntListList(${v})`],
  'list<list<string>>': ['java.util.List<java.util.List<String>>', (v) => `runner.In.toStrListList(${v})`],
  ListNode: ['ListNode', (v) => `Judge.toList(${v})`],
  TreeNode: ['TreeNode', (v) => `Judge.toTree(${v})`],
  'ListNode[]': ['ListNode[]', (v) => `Judge.toLists(${v})`],
}

const javaType = (t: string) => TYPES[t]?.[0]
const convert = (t: string, v: string) => TYPES[t]![1](v)

/** Judge-provided types and conversions in LeetCode's notation. */
const JUDGE = `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

final class Judge {
    static ListNode toList(Object v) {
        ListNode dummy = new ListNode(0), tail = dummy;
        for (Object o : runner.In.list(v)) { tail.next = new ListNode(runner.In.toInt(o)); tail = tail.next; }
        return dummy.next;
    }

    static ListNode[] toLists(Object v) {
        List<Object> l = runner.In.list(v);
        ListNode[] out = new ListNode[l.size()];
        for (int i = 0; i < out.length; i++) out[i] = toList(l.get(i));
        return out;
    }

    static TreeNode toTree(Object v) {
        List<Object> l = runner.In.list(v);
        if (l.isEmpty() || l.get(0) == null) return null;
        TreeNode root = new TreeNode(runner.In.toInt(l.get(0)));
        ArrayDeque<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < l.size()) {
            TreeNode node = queue.poll();
            if (i < l.size() && l.get(i) != null) { node.left = new TreeNode(runner.In.toInt(l.get(i))); queue.add(node.left); }
            i++;
            if (i < l.size() && l.get(i) != null) { node.right = new TreeNode(runner.In.toInt(l.get(i))); queue.add(node.right); }
            i++;
        }
        return root;
    }

    /** An empty list or tree prints as [] in LeetCode's notation. */
    static String showNode(Object v) {
        return v == null ? "[]" : show(v);
    }

    /** LeetCode's notation: lists for ListNode, level order (trailing nulls dropped) for TreeNode. */
    static String show(Object v) {
        if (v instanceof ListNode) {
            List<Integer> vals = new ArrayList<>();
            int guard = 0;
            for (ListNode n = (ListNode) v; n != null && guard++ < 100000; n = n.next) vals.add(n.val);
            return runner.Show.of(vals);
        }
        if (v instanceof TreeNode) {
            List<Object> vals = new ArrayList<>();
            ArrayDeque<TreeNode> queue = new ArrayDeque<>();
            List<TreeNode> order = new ArrayList<>();
            order.add((TreeNode) v);
            for (int i = 0; i < order.size() && i < 200000; i++) {
                TreeNode n = order.get(i);
                if (n == null) { vals.add(null); continue; }
                vals.add(n.val);
                order.add(n.left);
                order.add(n.right);
            }
            while (!vals.isEmpty() && vals.get(vals.size() - 1) == null) vals.remove(vals.size() - 1);
            return runner.Show.of(vals);
        }
        if (v instanceof ListNode[]) {
            StringBuilder sb = new StringBuilder("[");
            ListNode[] a = (ListNode[]) v;
            for (int i = 0; i < a.length; i++) sb.append(i == 0 ? "" : ", ").append(show(a[i]));
            return sb.append("]").toString();
        }
        if (v instanceof List) {
            List<?> l = (List<?>) v;
            if (!l.isEmpty() && (l.get(0) instanceof TreeNode || l.get(0) instanceof ListNode)) {
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < l.size(); i++) sb.append(i == 0 ? "" : ", ").append(show(l.get(i)));
                return sb.append("]").toString();
            }
        }
        return runner.Show.of(v);
    }
}
`

export type HarnessFiles = { files: Record<string, string>; mainClass: string } | { error: string }

const isArrayLike = (t: string) => t.endsWith('[]') || t.startsWith('list<')

/** Parameter types the harness cannot read yet (any return type can be printed). */
function unsupported(types: string[]): string | null {
  const bad = types.filter((t) => t !== 'void' && !javaType(t))
  return bad.length ? `Checking is not available for this problem yet: it uses ${[...new Set(bad)].join(', ')}.` : null
}

function methodMain(meta: LeetCodeMeta): string | { error: string } {
  const params = meta.params ?? []
  const ret = meta.return?.type ?? 'void'
  const problem = unsupported(params.map((p) => p.type))
  if (problem) return { error: problem }
  const lines = params.map((p, i) => `        ${javaType(p.type)} ${p.name} = ${convert(p.type, `runner.In.arg(in, ${i}, ${JSON.stringify(p.name)})`)};`)
  const call = `new Solution().${meta.name}(${params.map((p) => p.name).join(', ')})`
  if (meta.output && params[meta.output.paramindex]) {
    // In place, judged by the first k values: LeetCode prints "k, nums = [...]".
    const p = params[meta.output.paramindex]
    lines.push(
      `        int k = ${call};`,
      `        System.out.println(k + ", ${p.name} = " + Judge.show(java.util.Arrays.copyOf(${p.name}, Math.max(0, Math.min(k, ${p.name}.length)))));`,
    )
  } else if (ret === 'void') {
    const target = params.find((p) => isArrayLike(p.type) || p.type === 'ListNode' || p.type === 'TreeNode') ?? params[0]
    const nodeTarget = target && (target.type === 'ListNode' || target.type === 'TreeNode')
    lines.push(`        ${call};`, `        System.out.println(Judge.${nodeTarget ? 'showNode' : 'show'}(${target ? target.name : 'null'}));`)
  } else {
    const node = ret === 'ListNode' || ret === 'TreeNode'
    lines.push(`        Object result = ${call};`, `        System.out.println(Judge.${node ? 'showNode' : 'show'}(result));`)
  }
  return lines.join('\n')
}

function designMain(meta: LeetCodeMeta): string | { error: string } {
  const methods = meta.methods ?? []
  // `constructor` is also every object's built-in property: read it only when LeetCode sent one.
  const ctor = Object.prototype.hasOwnProperty.call(meta, 'constructor') ? ((meta.constructor as { params?: Param[] }).params ?? []) : []
  const problem = unsupported([...ctor.map((p) => p.type), ...methods.flatMap((m) => m.params.map((p) => p.type))])
  if (problem) return { error: problem }
  const args = (params: Param[]) => params.map((p, i) => convert(p.type, `runner.In.arg(a, ${i}, ${JSON.stringify(p.name)})`)).join(', ')
  const cls = meta.classname!
  const cases = [
    `                case ${JSON.stringify(cls)}: obj = new ${cls}(${args(ctor)}); out.append("null"); break;`,
    ...methods.map((m) =>
      m.return.type === 'void'
        ? `                case ${JSON.stringify(m.name)}: obj.${m.name}(${args(m.params)}); out.append("null"); break;`
        : `                case ${JSON.stringify(m.name)}: out.append(Judge.${m.return.type === 'ListNode' || m.return.type === 'TreeNode' ? 'showNode' : 'show'}(obj.${m.name}(${args(m.params)}))); break;`,
    ),
  ]
  return [
    '        java.util.List<Object> ops = runner.In.list(runner.In.arg(in, 0, "operations"));',
    '        java.util.List<Object> argv = in.size() > 1 ? runner.In.list(in.get(1)) : new java.util.ArrayList<Object>();',
    '        StringBuilder out = new StringBuilder("[");',
    `        ${cls} obj = null;`,
    '        for (int i = 0; i < ops.size(); i++) {',
    '            String op = runner.In.toStr(ops.get(i));',
    '            java.util.List<Object> a = i < argv.size() ? runner.In.list(argv.get(i)) : new java.util.ArrayList<Object>();',
    '            if (i > 0) out.append(", ");',
    '            switch (op) {',
    ...cases,
    '                default: throw new IllegalArgumentException("unknown operation " + op);',
    '            }',
    '        }',
    '        System.out.println(out.append("]"));',
  ].join('\n')
}

/** The harness files for the reader's code (`Solution.java` or the design class's file). */
export function leetcodeHarness(meta: LeetCodeMeta): HarnessFiles {
  const body = meta.classname ? designMain(meta) : methodMain(meta)
  if (typeof body !== 'string') return body
  const main = `public class Main {
    public static void main(String[] args) throws Exception {
        java.util.List<Object> in = runner.In.values(System.in);
${body}
    }
}
`
  return { files: { 'Main.java': main, 'Judge.java': JUDGE, 'In.java': inSource, 'Show.java': showSource }, mainClass: 'Main' }
}
