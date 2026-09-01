import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A trie (prefix tree) stores strings character-by-character in a tree where each edge is a letter and paths from root spell keys. Supports insert, exact search, and startsWith prefix queries in O(L) where L is word/prefix length—ideal for autocomplete and dictionary problems.',
  whyExists:
    'Hash sets find whole words in O(L) but prefix queries require scanning all keys. Trie groups shared prefixes—compact for dictionaries, IP routing tables, and word search on boards.',
  mentalModel:
    'Each node is a prefix; children indexed by next character (26 array or HashMap). Mark end-of-word at terminal node. Walk characters from root—if path exists, word or prefix is present.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Node: children[26] or Map<Character,Node>, boolean isEnd.',
        'Insert: walk/create nodes per char; set isEnd at last char.',
        'Search: walk all chars; return true only if isEnd at end.',
        'startsWith: walk chars; return true if path exists (ignore isEnd until end).',
        'Delete: clear isEnd; prune leaf nodes upward if no children.',
        'Compressed trie (radix) merges single-child chains for space.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Insert "app", "apple": shared path a→p→p; "apple" extends e with isEnd; search "app" true (isEnd at third p child chain); startsWith "ap" true without needing full word.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Trie insert / search / startsWith',
      code: `class Trie {
    static class Node {
        Node[] next = new Node[26];
        boolean end;
    }
    Node root = new Node();

    void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) cur.next[i] = new Node();
            cur = cur.next[i];
        }
        cur.end = true;
    }

    boolean search(String word) {
        Node n = walk(word);
        return n != null && n.end;
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    Node walk(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) return null;
            cur = cur.next[i];
        }
        return cur;
    }
}`,
    },
    {
      language: 'java',
      caption: 'Word search II (board + trie of words)',
      code: `void dfs(char[][] board, int r, int c, Trie.Node node, StringBuilder path, List<String> out) {
    if (node.end) { out.add(path.toString()); node.end = false; }
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return;
    char ch = board[r][c];
    int i = ch - 'a';
    if (ch == '#' || node.next[i] == null) return;
    board[r][c] = '#';
    path.append(ch);
    for (int[] d : new int[][]{{1,0},{-1,0},{0,1},{0,-1}})
        dfs(board, r + d[0], c + d[1], node.next[i], path, out);
    path.deleteCharAt(path.length() - 1);
    board[r][c] = ch;
}`,
    },
  ],
  complexity: {
    average: 'O(L) per insert/search/prefix where L = word length',
    space: 'O(total characters stored) nodes share prefixes',
  },
  patternRecognition: [
    'Implement Trie.',
    'Word Search II (trie + backtracking).',
    'Replace Words (shortest prefix root).',
    'Longest Word in Dictionary (build trie, DFS longest path with end).',
  ],
  commonMistakes: [
    'search returns true on prefix without isEnd check.',
    'startsWith requires isEnd incorrectly.',
    'Case sensitivity—normalize or 52-size alphabet.',
    'Memory: new Node[26] per node vs HashMap for sparse.',
  ],
  tradeoffs: {
    advantages: [
      'O(L) prefix operations',
      'Shared prefix compression',
      'Natural autocomplete traversal',
    ],
    disadvantages: [
      'High memory for sparse 26-array nodes',
      'Slower than hash for exact whole-word only sets',
      'Character set size affects child array',
    ],
    alternatives: ['HashSet for exact match only', 'Sorted array + binary search prefixes', 'DAWG minimal automaton'],
    whenToUse: ['Prefix / autocomplete queries', 'Many words shared prefixes', 'Word search from dictionary'],
    whenNotToUse: ['Only exact whole-word lookup large alphabet sparse', 'Few strings no prefix overlap'],
  },
  failureModes: [
    'Null root not initialized.',
    'Off-by-one char index c - a for non-lowercase.',
    'Word Search II missing path pruning—TLE without trie.',
  ],
  interview: {
    expectations: [
      'Node with children array/map + isEnd',
      'insert/search/startsWith O(L)',
      'Difference search vs startsWith',
    ],
    commonQuestions: ['Implement Trie', 'Word Search II', 'Design Add and Search Words'],
    followUps: ['Wildcard . in search?', 'Space optimization?', 'Delete word?'],
    misconceptions: ['Trie is a hash table', 'search and startsWith same', 'Must store full word at node'],
    traps: ['Forget isEnd on search', 'Not pruning trie in Word Search II'],
    strongSignals: ['Clear walk helper', 'Mentions HashMap vs array tradeoff', 'Word Search II pattern'],
  },
  keyTakeaways: [
    'Path from root = prefix; isEnd marks complete word.',
    'search requires isEnd; startsWith only path exists.',
    'O(L) time; space O(chars) with sharing.',
    '26-array fast for lowercase a-z.',
    'Trie + DFS for board dictionary problems.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Trie search vs startsWith?', answerHint: 'Both walk prefix; search also requires isEnd true at final node.' },
    { level: 'intermediate', question: 'Trie time complexity insert?', answerHint: 'O(L) character steps, L = word length.' },
    { level: 'advanced', question: 'Word Search II why trie?', answerHint: 'Prune DFS when prefix not in trie—avoid exploring dead paths for every word separately.' },
  ],
  flashcards: [
    { front: 'Trie search condition', back: 'Walk all chars; node != null && isEnd at end.' },
    { front: 'startsWith condition', back: 'Walk all chars; node != null (isEnd optional).' },
    { front: 'Typical child index', back: "c - 'a' for lowercase a-z array size 26." },
  ],
  quickRevision: [
    'Node: children + isEnd',
    'Insert walk/create',
    'search needs isEnd',
    'startsWith path only',
    'O(L) per op',
    'Array[26] or HashMap',
    'Board DFS + trie prune',
  ],
}
