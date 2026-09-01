import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Tree serialization converts a binary tree to a string (or list) for storage/transmission; deserialization rebuilds the tree. Standard approach: preorder with "#" null markers—uniquely decodable without inorder if nulls included.',
  whyExists:
    'APIs, databases, and message queues store hierarchical data as flat strings. Preorder-null encoding mirrors DFS copy order; paired with queue consumption it reconstructs identical structure in O(n).',
  mentalModel:
    'Write nodes in preorder, writing "#" whenever you would recurse into a missing child—like a snapshot of DFS with explicit null branches. Rebuild by reading tokens left-to-right with a queue or recursive index pointer.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Serialize: preorder DFS append val + comma; append "#" for null.',
        'Deserialize: read token; if "#" return null; else create node, node.left=des(), node.right=des().',
        'BFS serialize: level order with null placeholders (longer string).',
        'BST can serialize inorder/preorder without nulls if no duplicates—general tree cannot.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Queue for deserialize',
      text: 'Split string to Deque<String>; poll front in build helper—cleaner than shared int index for interviews.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Ser[Preorder DFS] --> Str[val,#,val,...]
  Str --> Des[Read token queue]
  Des --> Node[Make node]
  Node --> Des`,
    caption: 'Serialize/deserialize round trip',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Tree [1,2,3,null,null,4,5]: preorder serialize "1,2,#,#,3,4,#,#,5,#,#". Deserialize reads 1, builds left 2 with nulls, right 3 with children 4,5.',
    },
    {
      type: 'table',
      headers: ['format', 'nulls', 'unique decode'],
      rows: [
        ['preorder + #', 'yes', 'yes general tree'],
        ['level order', 'yes', 'yes with nulls'],
        ['preorder only', 'no', 'BST only typically'],
        ['inorder only', 'no', 'not unique'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Serialize preorder with nulls',
      code: `StringBuilder sb = new StringBuilder();
void pre(TreeNode node) {
    if (node == null) { sb.append("#,"); return; }
    sb.append(node.val).append(',');
    pre(node.left);
    pre(node.right);
}
// return sb.toString();`,
    },
    {
      language: 'java',
      caption: 'Deserialize from token queue',
      code: `Deque<String> q = new ArrayDeque<>(Arrays.asList(data.split(",")));
TreeNode build() {
    String tok = q.poll();
    if ("#".equals(tok)) return null;
    TreeNode node = new TreeNode(Integer.parseInt(tok));
    node.left = build();
    node.right = build();
    return node;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Codec class (LeetCode Serialize and Deserialize BT)',
      code: `public class Codec {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        dfsSer(root, sb);
        return sb.toString();
    }
    void dfsSer(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("# "); return; }
        sb.append(node.val).append(' ');
        dfsSer(node.left, sb);
        dfsSer(node.right, sb);
    }
    public TreeNode deserialize(String data) {
        Deque<String> q = new ArrayDeque<>(Arrays.asList(data.split(" ")));
        return dfsDes(q);
    }
    TreeNode dfsDes(Deque<String> q) {
        String tok = q.poll();
        if ("#".equals(tok)) return null;
        TreeNode node = new TreeNode(Integer.parseInt(tok));
        node.left = dfsDes(q);
        node.right = dfsDes(q);
        return node;
    }
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit each node once',
    average: 'O(n) time serialize and deserialize',
    worst: 'O(n) time; O(n) string and recursion stack',
    space: 'O(n) output string; O(h) deserialize stack',
  },
  patternRecognition: [
    'Serialize and Deserialize Binary Tree.',
    'Clone graph/tree via serialize round-trip.',
    'Flatten tree to linked list (variant traversal order).',
    'Verify same tree via simultaneous preorder.',
    'Codec design follow-up in system design lite.',
  ],
  commonMistakes: [
    'Forgetting null markers → ambiguous deserialize.',
    'Delimiter bugs (comma vs space) split wrong.',
    'Level serialize without nulls loses shape.',
    'Integer parsing negative values mishandled in split.',
  ],
  tradeoffs: {
    advantages: [
      'Preorder+# uniquely encodes any binary tree',
      'Simple recursive codec ~15 lines',
      'O(n) round trip',
    ],
    disadvantages: [
      'String longer with many nulls',
      'Not human-readable vs JSON nested',
    ],
    alternatives: ['Level-order with nulls', 'Parent index array for complete trees', 'JSON nested objects'],
    whenToUse: ['General binary tree persistence', 'Interview codec pattern', 'Clone via traversal'],
    whenNotToUse: ['BST only with keys—may omit nulls with pre/in pair instead'],
  },
  failureModes: [
    'Malformed string: missing tokens cause IndexOutOfBounds.',
    'Very deep tree recursion stack overflow—iterative deserialize possible.',
  ],
  interview: {
    expectations: [
      'Null marker in encoding',
      'O(n) both directions',
      'Recursive deserialize matches preorder order',
    ],
    commonQuestions: [
      'Serialize and Deserialize Binary Tree',
      'Serialize and Deserialize BST (follow-up)',
    ],
    followUps: ['Iterative deserialize?', 'Compact encoding without so many nulls?'],
    misconceptions: ['Preorder alone enough without null markers'],
    traps: ['Use same delimiter consistently; trim empty split tokens'],
    strongSignals: ['Explains why null markers needed for unique decode'],
  },
  keyTakeaways: [
    'Preorder + "#" nulls uniquely serializes binary tree.',
    'Deserialize: queue tokens; build left then right.',
    'O(n) time and O(n) space for string.',
    'Level-order encoding alternative with null placeholders.',
    'Codec pattern: two methods inverse of each other.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why "#" in serialization?',
      answerHint: 'Marks absent children so preorder alone reconstructs exact shape.',
    },
    {
      level: 'intermediate',
      question: 'Deserialize recursion order?',
      answerHint: 'Read root, recurse left child from stream, then right—matches preorder.',
    },
    {
      level: 'advanced',
      question: 'Serialize BST without nulls—when safe?',
      answerHint: 'With preorder only if no duplicates and BST property preserved; general tree needs nulls.',
    },
  ],
  flashcards: [
    {
      front: 'Serialize traversal order',
      back: 'Preorder DFS; append # for null.',
    },
    {
      front: 'Deserialize child order',
      back: 'Build node, then left subtree, then right from token stream.',
    },
  ],
  quickRevision: [
    'Pre + # null markers',
    'Deserialize: queue + DFS',
    'Left then right consume order',
    'O(n) round trip',
    'Level-order alt with nulls',
    'Delimiter consistent split',
    'Unique shape needs nulls',
  ],
}
