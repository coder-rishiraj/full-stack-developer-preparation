---
summary: Prefix matching covers two related jobs — finding which stored words are prefixes of (or start with) a query, and finding where a pattern occurs in a long text without re-reading characters. You will learn trie-based longest/shortest prefix matching and top-k suggestions, then KMP's prefix function, the Z-function and Rabin-Karp rolling hashes.
difficulty: intermediate
minutes: 60
objectives:
  - Implement shortest- and longest-prefix matching with a trie and explain why the walk can stop early
  - Design per-node top-k suggestions and compare them with a sorted array plus lower-bound search
  - Build the KMP prefix (LPS) table by hand and explain why KMP never moves backwards in the text
  - Derive the O(n + m) bound for KMP and use the prefix function for period and border problems
  - Implement Rabin-Karp with a rolling hash and explain why every hash match must be verified
---

## Introduction

"Prefix matching" names two jobs that look different but rest on one idea.

The first job is **dictionary prefix matching**. You hold a set of strings and receive queries. Sometimes the question is "which stored words *start with* this query?" — autocomplete. Sometimes it is the reverse: "which stored word is a *prefix of* this query?" A router holding address prefixes must find the longest one that matches a packet's address; a text tool replacing words by their roots (`cattle` → `cat`) needs the shortest dictionary word that begins the input. A trie ([[a12-trie]]) answers both by walking the query once.

The second job is **pattern matching in text**: find every place a pattern `P` of length `m` occurs in a text `T` of length `n`. The naive method tries each starting position and compares, which can cost O(n · m). The fast algorithms work by tracking, as they scan the text, **how long a prefix of the pattern has been matched so far**. Knuth–Morris–Pratt (KMP) precomputes, for every prefix of the pattern, which shorter prefix it can fall back to on a mismatch, so it never re-reads text. Rabin–Karp compares whole windows at once through a numeric hash that can slide one character in O(1).

Both jobs appear constantly — in search boxes, routers, `grep`, network intrusion detection, file synchronisation and in many interview problems (*Replace Words*, *Search Suggestions System*, *Find the Index of the First Occurrence in a String*, *Repeated Substring Pattern*, *Longest Happy Prefix*). This lesson teaches the dictionary side first, because it is a direct use of the trie, and then the text side.

## Before you start

- **Tries** — node with children and an end marker; walking a string from the root. See [[a12-trie]].
- **Lower-bound binary search** — finding the first element `>=` a key in sorted data. See [[a3-lower-upper-bounds]].
- **Hashing and modular arithmetic** — what a hash collision is, and computing with `% MOD` on `long` values. See [[a2-hashing]] and [[a1-java-syntax-competitive]].
- **Java strings** — `charAt`, `substring`, `startsWith`, `regionMatches`. See [[a1-strings-stringbuilder]].

## Part 1: matching against a dictionary

### Which stored word is a prefix of my string?

Take the dictionary `{ca, cat, bat, rat}` and the query `catalog`. Two dictionary words are prefixes of it: `ca` and `cat`. *Replace Words* wants the **shortest** (`ca`); a router wants the **longest** (`cat`). The brute force checks every dictionary word with `query.startsWith(word)`, costing O(D · L) for `D` words.

A trie of the dictionary turns this into one walk along the query. Walking `c`, `a`, `t`, … from the root visits exactly the nodes for the query's prefixes `c`, `ca`, `cat`, `cata`, … in increasing length, and a prefix is a dictionary word precisely when its node is marked as a word end. So:

- For the **shortest** match, return at the first marked node you reach.
- For the **longest** match, remember the most recent marked node and keep walking until the path breaks.

Either way, the walk also stops as soon as the trie has no child for the next character, because then no dictionary word is that long a prefix of the query. The cost is O(L) for a query of length `L`, independent of the dictionary size.

```java title="PrefixDictionary.java"
import java.util.List;

public class PrefixDictionary {

    private static class Node {
        Node[] children = new Node[26];
        String word;                       // non-null where a dictionary word ends
    }

    private final Node root = new Node();

    PrefixDictionary(List<String> words) {
        for (String w : words) {
            Node cur = root;
            for (char ch : w.toCharArray()) {
                int c = ch - 'a';
                if (cur.children[c] == null) cur.children[c] = new Node();
                cur = cur.children[c];
            }
            cur.word = w;
        }
    }

    /** Shortest dictionary word that is a prefix of s, or null. */
    String shortestPrefixOf(String s) {
        Node cur = root;
        for (int i = 0; i < s.length(); i++) {
            cur = cur.children[s.charAt(i) - 'a'];
            if (cur == null) return null;          // no dictionary word continues
            if (cur.word != null) return cur.word; // first word met is the shortest
        }
        return null;
    }

    /** Longest dictionary word that is a prefix of s, or null. */
    String longestPrefixOf(String s) {
        Node cur = root;
        String best = root.word;                   // the empty word, if stored
        for (int i = 0; i < s.length(); i++) {
            cur = cur.children[s.charAt(i) - 'a'];
            if (cur == null) break;
            if (cur.word != null) best = cur.word; // remember, but keep walking
        }
        return best;
    }

    /** LeetCode 648: replace each word by its shortest root, if it has one. */
    String replaceWords(String sentence) {
        StringBuilder out = new StringBuilder();
        for (String w : sentence.split(" ")) {
            if (out.length() > 0) out.append(' ');
            String root = shortestPrefixOf(w);
            out.append(root != null ? root : w);
        }
        return out.toString();
    }

    public static void main(String[] args) {
        PrefixDictionary d = new PrefixDictionary(List.of("cat", "bat", "rat", "ca"));
        System.out.println(d.replaceWords("the cattle was rattled by the battery"));
        System.out.println(d.shortestPrefixOf("catalog") + " " + d.longestPrefixOf("catalog"));
        System.out.println(d.longestPrefixOf("dog"));
    }
}
```

```output
the ca was rat by the bat
ca cat
null
```

Storing the whole word at its end node, instead of a boolean, saves rebuilding it from the path. Notice the difference between the two methods: `shortestPrefixOf` returns from inside the loop, while `longestPrefixOf` only records and continues — on `catalog` it records `ca`, then overwrites it with `cat`, then breaks at `cata` because no word continues. Both were checked against a brute force that tries every prefix of the query, on 3,000 random dictionaries.

The **longest prefix match** is the core of IP forwarding. A routing table holds prefixes such as `10.0.0.0/8` and `10.1.0.0/16`; a packet to `10.1.2.3` matches both, and the more specific `/16` wins. Writing addresses as 32-bit strings makes the table a binary trie, and lookup is `longestPrefixOf` over at most 32 bits. Production routers compress that trie or use dedicated hardware, but the rule they implement is this one.

### Which stored words start with my string? Top-k suggestions

*Search Suggestions System* gives a list of products and a search word, and asks, after each typed character, for up to three products that start with the typed prefix, in alphabetical order. Walking to the prefix node is easy; the costly part is listing the subtree below it on every keystroke.

The standard fix is to **precompute the answer at every node**. If you insert the products in sorted order, then the first three products that pass through a node are its three alphabetically smallest completions, so each node keeps a list and stops adding after three. A query is then a walk that reads one list per character.

```java title="SearchSuggestions.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SearchSuggestions {

    private static class Node {
        Node[] children = new Node[26];
        List<String> top = new ArrayList<>(3);    // up to 3 smallest words below here
    }

    static List<List<String>> suggestedProducts(String[] products, String searchWord) {
        String[] sorted = products.clone();
        Arrays.sort(sorted);                       // insert in order: first 3 seen are smallest
        Node root = new Node();
        for (String p : sorted) {
            Node cur = root;
            for (char ch : p.toCharArray()) {
                int c = ch - 'a';
                if (cur.children[c] == null) cur.children[c] = new Node();
                cur = cur.children[c];
                if (cur.top.size() < 3) cur.top.add(p);
            }
        }
        List<List<String>> answer = new ArrayList<>();
        Node cur = root;
        for (char ch : searchWord.toCharArray()) {
            cur = (cur == null) ? null : cur.children[ch - 'a'];
            answer.add(cur == null ? List.of() : cur.top);
        }
        return answer;
    }

    public static void main(String[] args) {
        String[] products = {"mobile", "mouse", "moneypot", "monitor", "mousepad"};
        for (List<String> row : suggestedProducts(products, "mouse")) System.out.println(row);
        System.out.println(suggestedProducts(new String[] {"havana"}, "tatiana"));
    }
}
```

```output
[mobile, moneypot, monitor]
[mobile, moneypot, monitor]
[mouse, mousepad]
[mouse, mousepad]
[mouse, mousepad]
[[], [], [], [], [], [], []]
```

Once the walk falls off the trie (`cur == null`), every longer prefix also has no matches, which is why the code keeps `cur` as `null` and emits empty lists for the remaining characters. Building costs O(S log P) for sorting plus O(S) for insertion, where `S` is the total length of all products; each keystroke then costs O(1) plus copying three strings. Real autocomplete does the same thing with a ranking score instead of alphabetical order — the "top-k per node" idea from [[d10-autocomplete]].

There is a lighter alternative worth knowing, because it uses no trie at all. In a **sorted** array, all words with a given prefix form one contiguous block, and that block starts at the first word `>= prefix`. A lower-bound binary search finds it; you then read forward while words still start with the prefix.

```java title="SortedPrefix.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SortedPrefix {

    /** First index i with words[i] >= key (words sorted). */
    static int lowerBound(String[] words, String key) {
        int lo = 0, hi = words.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (words[mid].compareTo(key) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    /** Up to k words that start with prefix, smallest first. */
    static List<String> firstK(String[] sorted, String prefix, int k) {
        List<String> out = new ArrayList<>();
        for (int i = lowerBound(sorted, prefix);
             i < sorted.length && out.size() < k && sorted[i].startsWith(prefix); i++) {
            out.add(sorted[i]);
        }
        return out;
    }

    public static void main(String[] args) {
        String[] words = {"mobile", "mouse", "moneypot", "monitor", "mousepad"};
        Arrays.sort(words);
        System.out.println(Arrays.toString(words));
        System.out.println(firstK(words, "mon", 3));
        System.out.println(firstK(words, "mou", 3));
    }
}
```

```output
[mobile, moneypot, monitor, mouse, mousepad]
[moneypot, monitor]
[mouse, mousepad]
```

Why does the block start at the lower bound? Every string that starts with `mon` is `>= "mon"` (a string is never smaller than its own prefix), and any string between `mon` and a word starting with `mon` must itself start with `mon`. Each query costs O(L log N), and the only memory is the sorted array. For a fixed product list this is often the better engineering choice; the trie wins when the dictionary is huge and per-keystroke latency must not depend on `N`.

```quiz
Q: A routing table holds the prefixes `1`, `10`, `1011` (as bit strings). Which entry does the longest-prefix lookup choose for the address `1010...`?
- [ ] `1`
- [x] `10`
- [ ] `1011`
- [ ] None, because no entry matches every bit
> The walk visits 1, 10, 101, 1010. Nodes 1 and 10 are marked as table entries, so the last recorded one is 10. The entry 1011 differs at the fourth bit, so it is not a prefix of the address at all.

Q: In the sorted-array approach, why can you stop reading forward at the first word that does not start with the prefix?
- [ ] Because binary search already counted the matches
- [x] Because words sharing a prefix are contiguous in sorted order, so no later word can start with it
- [ ] Because the problem asks for at most three words
- [ ] Because `compareTo` throws on later words
> Sorting orders strings character by character, so everything starting with "mon" sits between "mon" and the first string greater than every "mon…" string. Once a word leaves that block, all later words are larger and also outside it.
```

## Part 2: finding a pattern in a text

### The naive method and where it wastes work

To find `P` in `T`, the naive algorithm aligns `P` at each start position `s = 0, 1, …, n − m` and compares character by character until a mismatch or a full match. Each alignment costs up to `m` comparisons, so the worst case is O(n · m). The worst case is not exotic: searching for `aaaab` in a text of a million `a`s compares nearly five characters at every position before failing.

Look at what the naive method throws away. Search for `ababac` in `abababac`. At start 0 it matches `ababa` and then fails on the sixth character (`b` in the text, `c` in the pattern). It then moves to start 1 and re-reads text characters it has already seen. But it already *knows* those characters: they are `ababa`, the part of the pattern it has already matched. The question "could the pattern start at position 1 or 2?" can be answered from the pattern alone, without looking at the text again.

That is the insight behind KMP. After matching `j` characters of the pattern, the text's last `j` characters equal `P[0..j-1]`. If the next character mismatches, the next possible alignment is one where some **prefix of the pattern lines up with a suffix of what has been matched**. To skip as little as possible, choose the longest such prefix.

### Borders and the LPS table

A **border** of a string is a string that is both a proper prefix and a suffix of it ("proper" means not the whole string). `ababa` has borders `a` and `aba`. `abab` has border `ab`. `abc` has none.

The **prefix function**, usually stored as the **LPS array** (longest proper prefix which is also a suffix), records for every prefix of the pattern the length of its longest border:

> `lps[i]` = the length of the longest proper prefix of `P[0..i]` that is also a suffix of `P[0..i]`.

For `P = ababac`:

| `i` | `P[0..i]` | Longest border | `lps[i]` |
|---|---|---|---|
| 0 | `a` | (none) | 0 |
| 1 | `ab` | (none) | 0 |
| 2 | `aba` | `a` | 1 |
| 3 | `abab` | `ab` | 2 |
| 4 | `ababa` | `aba` | 3 |
| 5 | `ababac` | (none) | 0 |

Now the mismatch above is easy. We had matched `ababa` (`j = 5`) and failed. `lps[4] = 3` says the last three matched characters, `aba`, are also the pattern's first three. So keep `j = 3` and compare the *same* text character with `P[3]`. The text pointer never moves backwards.

### Building the LPS table in linear time

Computing each `lps[i]` by trying every length would cost O(m²) or worse. The efficient construction reuses the table it is building: it runs the matching idea on the pattern against itself. A variable `len` holds the length of the current border of `P[0..i-1]`. To extend it to `P[0..i]`:

- If `P[i] == P[len]`, the border grows by one: `lps[i] = len + 1`.
- Otherwise, try the next shorter border of `P[0..i-1]`. The borders of a string are exactly its longest border, the longest border of *that*, and so on, so the next candidate length is `lps[len - 1]`. Repeat.
- If `len` reaches 0 and still no match, `lps[i] = 0`.

Dry run on `ababac`:

| `i` | `len` before | Compare `P[i]` with `P[len]` | Action | `lps[i]` |
|---|---|---|---|---|
| 1 | 0 | `b` vs `a` | mismatch, `len` is 0 | 0 |
| 2 | 0 | `a` vs `a` | match, `len = 1` | 1 |
| 3 | 1 | `b` vs `b` | match, `len = 2` | 2 |
| 4 | 2 | `a` vs `a` | match, `len = 3` | 3 |
| 5 | 3 | `c` vs `b` | mismatch, `len = lps[2] = 1` | — |
| 5 | 1 | `c` vs `b` | mismatch, `len = lps[0] = 0` | — |
| 5 | 0 | `c` vs `a` | mismatch, `len` is 0 | 0 |

### The KMP search

The search uses the same fallback with the text. Keep `j` = number of pattern characters currently matched. For each text character: while it mismatches `P[j]` and `j > 0`, fall back with `j = lps[j - 1]`; then, if it matches, advance `j`. When `j == m`, a full match ends here; record it and fall back once more so overlapping matches are found too.

```java title="Kmp.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Kmp {

    /** lps[i] = length of the longest proper prefix of p[0..i] that is also its suffix. */
    static int[] buildLps(String p) {
        int[] lps = new int[p.length()];
        int len = 0;                          // length of the current matched prefix
        for (int i = 1; i < p.length(); ) {
            if (p.charAt(i) == p.charAt(len)) {
                lps[i++] = ++len;             // extend the border by one character
            } else if (len > 0) {
                len = lps[len - 1];           // fall back to the next shorter border
            } else {
                lps[i++] = 0;                 // no border at all; move on
            }
        }
        return lps;
    }

    /** Start indices of every occurrence of pattern in text (overlaps included). */
    static List<Integer> findAll(String text, String pattern) {
        List<Integer> hits = new ArrayList<>();
        if (pattern.isEmpty()) return hits;   // convention: no matches for ""
        int[] lps = buildLps(pattern);
        int j = 0;                            // characters of pattern matched so far
        for (int i = 0; i < text.length(); i++) {
            while (j > 0 && text.charAt(i) != pattern.charAt(j)) {
                j = lps[j - 1];               // keep the longest border, never move i back
            }
            if (text.charAt(i) == pattern.charAt(j)) j++;
            if (j == pattern.length()) {
                hits.add(i - j + 1);
                j = lps[j - 1];               // continue so overlapping matches are found
            }
        }
        return hits;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(buildLps("ababac")));
        System.out.println(Arrays.toString(buildLps("aabaaab")));
        System.out.println(findAll("abababac ababac", "ababac"));
        System.out.println(findAll("aaaaa", "aa"));
        System.out.println(findAll("hello", "xyz"));
    }
}
```

```output
[0, 0, 1, 2, 3, 0]
[0, 1, 0, 1, 2, 2, 3]
[2, 9]
[0, 1, 2, 3]
[]
```

Trace the first match in `abababac` (the start of the third test):

| `i` | `T[i]` | `j` before | What happens | `j` after |
|---|---|---|---|---|
| 0–4 | `a b a b a` | 0 → 4 | each character matches | 5 |
| 5 | `b` | 5 | `b` ≠ `P[5]` = `c`; fall back `j = lps[4] = 3`; `b` = `P[3]` | 4 |
| 6 | `a` | 4 | matches `P[4]` | 5 |
| 7 | `c` | 5 | matches `P[5]`; `j == 6`, record `7 − 6 + 1 = 2` | `lps[5] = 0` |

At `i = 5` the naive method would have restarted at start 1 and re-read four characters. KMP compared the same text character again against an earlier pattern position and moved on. The `aaaaa` test shows why the code falls back after a full match instead of resetting `j` to 0: overlapping occurrences at 0, 1, 2 and 3 are all found.

The empty pattern is a convention choice. Here it returns no matches; Java's `"hello".indexOf("")` returns 0, and LeetCode's `strStr` expects 0. Decide explicitly and say so. The code was checked against a brute-force `startsWith` scan on 20,000 random text/pattern pairs over one- to three-letter alphabets, where repetitive inputs stress the fallback logic.

### Why KMP is O(n + m)

The inner `while` loop looks as though it might make the scan quadratic. It does not, and the argument is a counting one. `j` increases by at most 1 per text character, so over the whole scan it increases at most `n` times. Every fallback `j = lps[j - 1]` strictly decreases `j` (a border is shorter than the string), and `j` never goes below 0. A quantity that rises at most `n` times by 1 can fall at most `n` times in total. So all the fallbacks together cost O(n), and the scan is O(n). The same argument applied to `len` shows the LPS construction is O(m). Total: **O(n + m) time and O(m) extra space**, with no worst-case inputs.

### Using the prefix function for string structure

The LPS array describes a string's repetitions, so several problems are solved by reading one entry.

**Longest Happy Prefix** asks for the longest proper prefix that is also a suffix of `s` — by definition, the first `lps[n - 1]` characters.

**Repeated Substring Pattern** asks whether `s` is some block repeated at least twice. If the longest border has length `b`, then `p = n − b` is the **shortest period** of `s`: `s[i] == s[i + p]` for every valid `i`. The string is a whole number of copies of its first `p` characters exactly when `b > 0` and `n % p == 0`.

```java title="Structure.java"
public class Structure {

    /** LeetCode 1392: longest proper prefix of s that is also a suffix. */
    static String longestHappyPrefix(String s) {
        int[] lps = Kmp.buildLps(s);
        return s.substring(0, lps[s.length() - 1]);
    }

    /** LeetCode 459: is s some block repeated two or more times? */
    static boolean repeatedSubstringPattern(String s) {
        int n = s.length();
        int border = Kmp.buildLps(s)[n - 1];
        int period = n - border;               // shortest period of s
        return border > 0 && n % period == 0;
    }

    public static void main(String[] args) {
        System.out.println(longestHappyPrefix("level"));
        System.out.println(longestHappyPrefix("ababab"));
        System.out.println(repeatedSubstringPattern("abcabcabc"));
        System.out.println(repeatedSubstringPattern("abcabca"));
        System.out.println(repeatedSubstringPattern("aaaa"));
    }
}
```

```output
l
abab
true
false
true
```

(Compile it alongside `Kmp.java`.) For `abcabca`, the longest border is `abca` (length 4), so the period is 3, but 7 is not divisible by 3: the string is `abc` repeated two and a third times, which does not count. A popular alternative check is `(s + s).substring(1, 2 * n - 1).contains(s)`; it is correct, but its cost depends on the substring search used, so the LPS version is the one to explain.

### The Z-function: another prefix table

The **Z-function** stores, for each position `i`, the length of the longest common prefix of `s` and the suffix starting at `i` — "how far does the string match its own beginning from here?" For `aabxaab` it is `[0, 1, 0, 0, 3, 1, 0]` (`z[0]` is left as 0 by convention): at position 4, `aab` matches the first three characters.

It is computed in O(n) by remembering the rightmost window `[l, r)` that is known to match a prefix, and reusing earlier values inside it:

```java title="ZFunction.java"
import java.util.Arrays;

public class ZFunction {

    /** z[i] = length of the longest common prefix of s and s.substring(i); z[0] = 0. */
    static int[] z(String s) {
        int n = s.length();
        int[] z = new int[n];
        int l = 0, r = 0;                     // [l, r) is the rightmost match window found
        for (int i = 1; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);   // reuse what is known
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(z("aabxaab")));
        String pattern = "aab", text = "baabaab";
        int[] zz = z(pattern + "#" + text);   // '#' occurs in neither string
        for (int i = pattern.length() + 1; i < zz.length; i++) {
            if (zz[i] == pattern.length()) System.out.print((i - pattern.length() - 1) + " ");
        }
        System.out.println();
    }
}
```

```output
[0, 1, 0, 0, 3, 1, 0]
1 4 
```

To search, compute Z on `pattern + separator + text`; a position in the text part whose Z-value equals `m` is a match. The separator must be a character in neither string, so no match can run across it. KMP and Z solve the same problems in the same O(n + m); Z is often easier to reason about for "longest prefix starting here" questions, while KMP's streaming form processes text one character at a time without storing it.

```quiz
Q: In KMP, a mismatch happens after matching `j = 5` characters of the pattern and `lps[4] = 3`. What happens next?
- [ ] The text pointer moves back 5 positions and `j` resets to 0
- [ ] The text pointer advances and `j` resets to 0
- [x] `j` becomes 3 and the same text character is compared with `P[3]`
- [ ] `j` becomes 4 and the text pointer advances
> The last three matched text characters equal the pattern's first three (that is what lps[4] = 3 means), so they need not be compared again. KMP keeps the text pointer where it is and retries the current character against P[3]. Moving the text pointer back is exactly the waste KMP removes.

Q: Why is KMP's scan O(n) even though it has a `while` loop inside a `for` loop?
- [ ] Because the `while` loop runs at most once per character
- [x] Because `j` rises by at most 1 per character, and each fallback lowers it, so total fallbacks cannot exceed n
- [ ] Because the LPS table has only m entries
- [ ] It is not; KMP is O(n · m) in the worst case
> A single character can trigger several fallbacks, so the per-character bound is wrong. The amortised argument works: j increases at most n times in total, never drops below zero, and every fallback decreases it, so all fallbacks together number at most n.
```

### Rabin–Karp: comparing windows by hash

A different way to skip work is to compare a whole window in O(1). Treat a string as a number in base `B`: `h(c₀c₁…c_{m−1}) = c₀·B^(m−1) + c₁·B^(m−2) + … + c_{m−1}`, taken modulo a large prime `M` so it fits in a `long`. This is a **polynomial hash**.

The trick is that the hash of the next window follows from the current one. Moving the window one step right drops the leftmost character and appends a new one:

`h_next = ((h − c_left · B^(m−1)) · B + c_new) mod M`

Each slide is O(1), so hashing every window of the text costs O(n) after O(m) setup. When a window's hash equals the pattern's hash, the window *probably* matches. "Probably", because different strings can share a hash modulo `M` — a **collision** — so every hash match must be confirmed by comparing characters.

```java title="RabinKarp.java"
import java.util.ArrayList;
import java.util.List;

public class RabinKarp {

    static final long MOD = 1_000_000_007L;
    static final long BASE = 131;

    static List<Integer> findAll(String text, String pattern) {
        List<Integer> hits = new ArrayList<>();
        int n = text.length(), m = pattern.length();
        if (m == 0 || m > n) return hits;

        long high = 1;                         // BASE^(m-1) mod MOD, weight of the left char
        for (int i = 1; i < m; i++) high = high * BASE % MOD;

        long ph = 0, wh = 0;                   // pattern hash, current window hash
        for (int i = 0; i < m; i++) {
            ph = (ph * BASE + pattern.charAt(i)) % MOD;
            wh = (wh * BASE + text.charAt(i)) % MOD;
        }
        for (int start = 0; ; start++) {
            // Equal hashes are only a hint; confirm character by character.
            if (wh == ph && text.regionMatches(start, pattern, 0, m)) hits.add(start);
            if (start + m == n) break;
            wh = (wh - text.charAt(start) * high % MOD + MOD) % MOD;   // drop left char
            wh = (wh * BASE + text.charAt(start + m)) % MOD;          // add right char
        }
        return hits;
    }

    public static void main(String[] args) {
        System.out.println(findAll("abracadabra", "abra"));
        System.out.println(findAll("aaaaa", "aa"));
    }
}
```

```output
[0, 7]
[0, 1, 2, 3]
```

Three details make it correct. All arithmetic is on `long`: a hash below about 10⁹ times a base of 131 stays far below `Long.MAX_VALUE`, whereas `int` would overflow silently. The subtraction adds `MOD` before taking `%`, because Java's `%` keeps the sign of the left operand and the difference can be negative. And `regionMatches` verifies each candidate, which keeps the answer exact whatever the collisions.

**Complexity.** Expected O(n + m) when collisions are rare. The worst case is O(n · m) if many windows collide with the pattern — or whenever the pattern really occurs at almost every position (the text `aaaa…`), since each true match costs `m` to verify. A fixed base and modulus can also be attacked deliberately with crafted inputs. Two defences are common: pick the base at random when the program starts, and use **double hashing** (two independent moduli), which makes accidental collisions vanishingly rare for practical sizes. Some code skips verification under double hashing; that is a probabilistic answer, so say so if you do it.

Rabin–Karp's real strength is flexibility. With the same machinery you can search for many patterns of the same length at once (put their hashes in a `HashSet` and look up each window's hash), compare any two substrings in O(1) after computing prefix hashes, and binary search on substring lengths — for example, the longest substring that occurs twice.

### Many patterns at once: the trie meets KMP

When you must find many patterns in one text — a list of banned words, or thousands of virus signatures — running KMP once per pattern costs O(k · n). The **Aho–Corasick** algorithm combines the two halves of this lesson: it builds a trie of all patterns, then adds to every trie node a *failure link* pointing to the node for its longest proper suffix that is also a path in the trie — exactly KMP's fallback, generalised from one pattern to a trie. Scanning the text then follows trie edges and failure links, reporting matches in O(n + total pattern length + number of matches). Implementing it is rarely expected in interviews, but recognising "many patterns, one text" as its use case is a strong signal.

## In real systems

**Search tools.** Single fixed-string search in tools such as GNU `grep` uses Boyer–Moore-style algorithms, which compare from the end of the pattern and skip ahead on mismatches; searching for many fixed strings uses automaton-based methods in the Aho–Corasick family. Network intrusion detection systems such as Snort use Aho–Corasick-style multi-pattern matching to scan packets against large signature sets.

**Java's own `indexOf`.** OpenJDK's `String.indexOf(String)` is a simple scan — find the first character, then compare the rest — with a worst case of O(n · m), and the JVM may substitute a vectorised intrinsic for it on common CPUs. It is fast on ordinary text, but it is not a linear-time guarantee, which is why KMP is still worth knowing when input can be adversarial.

**File synchronisation.** `rsync` slides a cheap rolling checksum over a file to find blocks that the other side already has, confirming candidates with a stronger hash — the Rabin–Karp pattern of "cheap rolling hash, then verify".

**Routing and tokenisation.** Routers forward packets by longest prefix match. Subword tokenisers such as WordPiece split a word by greedily taking the longest vocabulary entry that prefixes the remaining text — repeated `longestPrefixOf`.

## Trade-offs and alternatives

| Technique | Preprocessing | Query or scan | Guarantee | Use when |
|---|---|---|---|---|
| Trie walk (shortest/longest prefix) | O(total dictionary length) | O(L) per query | Exact | Many queries against a fixed dictionary |
| Sorted array + lower bound | O(S log N) sort | O(L log N) per query | Exact | Moderate query rates, memory matters |
| Naive scan / `indexOf` | None | O(n · m) worst | Exact | Short inputs, non-adversarial text |
| KMP | O(m) | O(n) | Exact, worst-case linear | One pattern, guaranteed linear time, streaming text |
| Z-function | O(n + m) together | — | Exact, worst-case linear | Prefix-comparison questions within one string |
| Rabin–Karp | O(m) | O(n) expected | Exact with verification | Many same-length patterns, substring equality, binary search on length |
| Aho–Corasick | O(total pattern length) | O(n + matches) | Exact | Many patterns in one text |

None of these handle approximate matching — "find `recieve` when the text says `receive`". That needs edit distance ([[a11-2d-dp]]) or specialised fuzzy indexes.

## Common mistakes

> [!MISTAKE] Moving the text pointer back after a mismatch
> KMP's whole point is that `i` never decreases. On a mismatch with `j > 0`, change only `j` (to `lps[j - 1]`) and compare the same text character again. Advancing `i` in that branch skips characters; resetting it to an earlier position brings back the O(n · m) cost.

**Off-by-one in the fallback.** The fallback is `lps[j - 1]`, not `lps[j]`: `j` is the number of matched characters, so the matched prefix ends at index `j − 1`.

**An LPS loop that never advances.** In the construction, the branch for "mismatch and `len == 0`" must both set `lps[i] = 0` and increment `i`. Forgetting the increment loops forever.

**Resetting `j` to 0 after a full match.** This misses overlapping occurrences such as `aa` inside `aaaaa`. Fall back to `lps[m − 1]` instead.

**Negative values in rolling hashes.** `(h - x) % M` can be negative in Java. Add `M` before the final `%`, and keep everything in `long`.

**Trusting a hash match.** A single-modulus hash will eventually collide. Verify with `regionMatches`, or use double hashing and state that the result is probabilistic.

**Using the wrong rule in a dictionary walk.** Returning at the first marked node gives the *shortest* prefix; a router needs the *longest*, which means recording and continuing.

## Interview perspective

Interviewers use these problems to see whether you can explain an algorithm's invariant, not whether you recite it. For dictionary problems, say what each trie node represents and why the walk can stop. For KMP, the explanation that lands is: "`j` is how much of the pattern currently matches the end of the text I have read; on a mismatch I keep the longest part of that match that is still a prefix of the pattern, which is `lps[j − 1]`."

> [!INTERVIEW] A typical follow-up chain
> "Find the first occurrence of `needle` in `haystack`." A brute-force scan is a fine first answer. "Now the inputs are 10⁵ characters of mostly `a`." Explain the O(n · m) worst case and switch to KMP or Rabin–Karp. "What if there are 10,000 needles?" A trie of needles walked from each start position, or Aho–Corasick; or Rabin–Karp with a hash set if all needles share a length.

Be ready for:

- **Compute the LPS array for `aabaaab` by hand.** `[0, 1, 0, 1, 2, 2, 3]`; walk through the fallback at index 5, where `len` drops from 2 to `lps[1] = 1` and then extends back to 2.
- **Why is KMP linear?** The amortised argument about `j`.
- **Why verify Rabin–Karp matches?** Collisions; and the worst case if you do not.
- **Repeated substring pattern.** Period `n − lps[n − 1]`, divisibility check.
- **Replace Words or longest prefix match.** Trie walk; stop at first word (shortest) or record and continue (longest).

## Practice

1. **Find the Index of the First Occurrence in a String.** Solve it with KMP, then with Rabin–Karp, and compare the code.
2. **Replace Words.** Use the trie's shortest-prefix walk; then solve it again with a `HashSet` of roots and checking each prefix of each word, and compare costs.
3. **Search Suggestions System.** Implement both the top-3-per-node trie and the sorted-array version.
4. **Longest Happy Prefix** and **Repeated Substring Pattern.** One LPS table each.
5. **Shortest Palindrome.** Add the fewest characters in front of `s` to make it a palindrome. Hint: compute the LPS of `s + "#" + reverse(s)`; its last value is the longest palindromic prefix of `s`.
6. **Longest Duplicate Substring.** Binary search on the length, checking each length with rolling hashes in a set.

The DSA explorer lists matching problems under this topic.

## Quick revision {#quick-revision}

- Two jobs: dictionary prefix matching (trie, sorted array) and pattern-in-text matching (KMP, Z, Rabin–Karp).
- Trie walk along the query visits its prefixes in increasing length: first word end = **shortest** prefix; last word end before the path breaks = **longest** prefix (IP routing).
- Top-k suggestions: insert in ranked order, keep k entries per node; query is O(L).
- Sorted array: words with prefix `p` form one block starting at `lowerBound(p)`.
- Naive search O(n · m); it re-reads text the pattern already explains.
- `lps[i]` = longest proper prefix of `P[0..i]` that is also a suffix. Example `ababac` → `[0,0,1,2,3,0]`.
- KMP: on mismatch with `j > 0`, `j = lps[j − 1]`; `i` never moves back; after a full match, `j = lps[m − 1]`. O(n + m), O(m) space.
- Period of `s` = `n − lps[n − 1]`; `s` is a repeated block iff border > 0 and `n % period == 0`.
- Z-function: `z[i]` = longest common prefix of `s` and `s[i..]`; search with `P + '#' + T`.
- Rolling hash: drop `c_left · B^(m−1)`, multiply by `B`, add the new character, all mod `M` in `long`, add `M` before `%` after subtraction; always verify (or double-hash).
- Many patterns, one text: Aho–Corasick = trie + KMP-style failure links.

## Key takeaways {#key-takeaways}

- A trie turns "which dictionary word prefixes this string?" into one walk; whether you stop at the first word end or the last decides shortest versus longest match.
- Precomputing answers at nodes (top-k suggestions) is what makes per-keystroke queries constant time; a sorted array with lower bound is the lightweight alternative.
- KMP avoids re-reading text by falling back to the longest border of what has already matched; that is all the LPS table encodes.
- KMP's O(n + m) bound comes from an amortised argument: the matched length cannot fall more often than it rises.
- Rolling hashes compare windows in O(1) but can collide; verification or double hashing keeps answers exact or near-certain.
- The two halves meet in Aho–Corasick, which runs KMP's fallback idea over a trie of many patterns.
