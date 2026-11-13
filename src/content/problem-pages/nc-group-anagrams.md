---
problemId: nc-group-anagrams
title: Group Anagrams
source: neetcode
sourceUrl: https://leetcode.com/problems/group-anagrams/
difficulty: medium
patterns: [arrays-hashing, hashing]
relatedLessons: [a2-hashing, a1-hashmap, a2-frequency-counting, a2-sorting-based, a1-strings-stringbuilder]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get an array of strings. Put strings that are anagrams of each other (the same letters, each the same number of times, in any order) into the same group, and return the list of groups. Every input string belongs to exactly one group; a string with no anagram partner is a group on its own.

**Example 1**

- Input: `strs = ["dusty", "study", "night", "thing", "act"]`
- Output: `[["dusty", "study"], ["night", "thing"], ["act"]]`
- Why: "dusty" and "study" both have one each of d, s, t, u, y. "night" and "thing" both have one each of g, h, i, n, t. "act" matches nothing else, so it is alone.

**Example 2**

- Input: `strs = ["", "b", ""]`
- Output: `[["", ""], ["b"]]`
- Why: the two empty strings have the same (empty) letters, so they are anagrams of each other. Equal strings are always in the same group.

**What the problem statement guarantees**

- There are between 1 and 10^4 strings.
- Each string has between 0 and 100 characters, so empty strings can occur.
- Every character is a lowercase English letter.
- The groups may be returned in any order, and so may the strings inside each group.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The core question here, "how do I tell quickly which group a string belongs to?", is the whole problem, and it is worth finding yourself. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Start with something correct, even if slow: how would you sort strings into groups by hand?
3. Name the part that repeats. Ask what one piece of information would let a string find its group without comparing it against other strings.
4. Write the code, then trace Example 1 and Example 2.
5. Give the complexity, defining every variable you use.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Comparing a new string against one member of every existing group works, but there may be thousands of groups. Is there something you could compute from a string alone that is identical for all of its anagrams and different for everything else?

> [!HINT] Hint 2: the kind of tool you need
> If every string had such a "label", all anagrams would share it. Then grouping is the same as collecting strings by label, and a structure that maps a label to a list finds the right group directly.

> [!HINT] Hint 3: almost the whole plan
> Two labels work: the string's letters rearranged into alphabetical order, or the count of each of the 26 letters written out as text. Go through the strings once; compute the label; append the string to the list stored under that label, creating the list if needed. At the end, return all the lists. If you choose counts, check what goes wrong when you write the 26 numbers next to each other with nothing between them.

**Check yourself before revealing the walkthrough**

- [ ] My answer puts the two empty strings of Example 2 in one group
- [ ] I can explain why my label is the same for anagrams and different for non-anagrams
- [ ] I defined n and k and gave the time and space in terms of them
- [ ] I can compare the two possible labels and say when each is preferable

## 3. Interview script: understand the problem (≈2 min)

The spoken version is usually "Group the anagrams together." The things worth pinning down are the alphabet, empty strings, duplicates, and what order the output needs, because a fixed order would change the algorithm.

**Me:** So I return a list of lists, where each inner list holds strings that are anagrams of each other, and every input string appears in exactly one list?

**Interviewer:** Yes.

**Me:** Does the order matter, either of the groups or within a group?

**Interviewer:** No, any order.

**Me:** Good, then I don't need to sort the output. What characters can appear?

**Interviewer:** Lowercase English letters.

**Me:** So 26 possible letters. Can a string be empty, and can the same string appear twice?

**Interviewer:** Strings can be empty, length up to 100. Duplicates are allowed.

**Me:** Then empty strings are all anagrams of each other and form one group, and a duplicate just goes into the same group as its twin. How many strings?

**Interviewer:** Up to 10^4.

**Me:** Let me group Example 1 by hand. "dusty" starts a group. "study": same letters, so it joins. "night" is new. "thing" joins "night". "act" is new. So three groups. When I did that, I compared each new word against a word from every group so far. That's the part I'd like to avoid.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^4 strings | Comparing every string with every group can mean on the order of n² / 2 = 5 × 10^7 string comparisons, each costing up to the string length. I want each string to find its group directly. |
| 0 ≤ length ≤ 100 | Empty strings occur and must form a group. Strings are short, so sorting one costs at most about 100 × log₂ 100 ≈ 700 comparisons. |
| Lowercase English letters only | A string's letter counts fit in 26 slots, which allows a counting-based label. |
| Any order of groups and of strings within groups | No sorting of the output. A hash map's arbitrary iteration order is fine. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Duplicate strings are allowed | No special case: equal strings have the same label and land in the same group. Nothing is deduplicated. |
| Empty strings belong together | The label of the empty string must be a real label (the empty string, or 26 zeros), not "skip". |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I may return any `List<List<String>>` implementation | Lets me return the map's value lists directly, wrapped in an `ArrayList`. |
| The input array is not modified | I compute labels from copies of the characters; the strings themselves are immutable anyway. |

### Edge cases I will keep in mind

- One string, including a single empty string `[""]`.
- Several empty strings: `["", "b", ""]`.
- All strings in one group, and every string in its own group.
- Duplicate strings: `["eat", "eat", "tea"]`.
- Same letters with different counts: `"aab"` and `"abb"` must be separate.
- Counts that need more than one digit: `"abbbbbbbbbbb"` (a:1, b:11) versus `"aaaaaaaaaaab"` (a:11, b:1).

## 4. Think out loud: from first idea to best solution

Throughout, n is the number of strings and k is the maximum length of a string (k ≤ 100). The total input size is at most n·k characters.

### Approach 1: Compare each string with every existing group

#### What I say out loud

> "The straightforward method is what I did by hand. I keep a list of groups. For each string, I check it against the first member of each group with an anagram test, the one from Valid Anagram: equal length and the same letter counts. If one matches, the string joins that group; if none does, it starts a new group."

> "The cost is the problem. If every string is in its own group, string i is compared with i − 1 groups, so about n² / 2 comparisons, each O(k). That's O(n²·k). Let me make sure it's correct, then find what to cut."

#### Intuition

Being anagrams is an equivalence: if a ~ b and b ~ c, then a ~ c, because all three have the same letter counts. So every group is fully described by any one of its members, and a new string only needs to be compared with one representative per group. The anagram test itself is from [[nc-valid-anagram|Valid Anagram]].

#### Algorithm

1. `groups` = empty list of lists.
2. For each string `s`: look through `groups` for a group whose first string is an anagram of `s`.
3. If found, add `s` to that group; otherwise add a new group containing only `s`.
4. Return `groups`.

#### Why it is correct

- **Every string lands in a group with exactly its anagrams.** The invariant: after each step, every group consists of strings that are pairwise anagrams, and no two groups are anagrams of each other. A new string joins a group only if it is an anagram of the representative, and therefore of every member. It starts a new group only if it matches no representative, and therefore no member of any group.
- **Every string appears once:** each string is added to exactly one group.

#### Dry run

`strs = ["dusty", "study", "night", "thing", "act"]`

| String | Compared with representatives | Result | Groups after |
|---|---|---|---|
| dusty | none | new group | [dusty] |
| study | dusty: match | join group 1 | [dusty, study] |
| night | dusty: no | new group | [dusty, study], [night] |
| thing | dusty: no; night: match | join group 2 | [dusty, study], [night, thing] |
| act | dusty: no; night: no | new group | [dusty, study], [night, thing], [act] |

#### Java code

```java title="Approach 1: compare with each group's representative"
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> groups = new ArrayList<>();
        for (String s : strs) {
            List<String> home = null;
            for (List<String> group : groups) {
                if (isAnagram(group.get(0), s)) {
                    home = group;
                    break;
                }
            }
            if (home == null) {
                home = new ArrayList<>();
                groups.add(home);
            }
            home.add(s);
        }
        return groups;
    }

    private boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int[] count = new int[26];
        for (int i = 0; i < a.length(); i++) {
            count[a.charAt(i) - 'a']++;
        }
        for (int i = 0; i < b.length(); i++) {
            if (--count[b.charAt(i) - 'a'] < 0) {
                return false;
            }
        }
        return true;
    }
}
```

#### Time complexity

**O(n²·k) in the worst case.** With g groups at the moment a string arrives, it is compared with up to g representatives, and each comparison costs O(k) (plus a constant 26 to set up the counter array). When every string is its own group, g grows to n − 1, so the total is about n² / 2 comparisons: up to 5 × 10^7 comparisons for n = 10^4. Many end quickly at the length check, but strings of equal length cost the full O(k).

#### Space complexity

**O(1) auxiliary space beyond the output**: one 26-counter array per comparison. The groups themselves are the output: they hold n references, which is O(n), and the strings they refer to are the input strings, not copies.

#### The bridge to the next approach

> "The waste is in the inner loop: a string is compared with every group to find the one it belongs to. What I really want is for the string to *know* its group, by computing something from the string itself. If I had a label that's the same for all anagrams and different for non-anagrams, I could use it as a hash map key, and finding the group becomes one lookup."

> "What's the same for all anagrams? They have the same letters in a different order. So if I put the letters in a fixed order, alphabetical, all anagrams become the same string. 'dusty' and 'study' both become 'dstuy'. That's my label."

### Approach 2: Sorted string as the key

#### What I say out loud

> "For each string, I sort its characters to get a key, then append the string to the list stored under that key in a hash map. At the end, the map's values are the groups. Sorting one string costs k log k, so the total is n·k log k expected."

#### Intuition

Sorting the letters gives a **canonical form**: one representative spelling per anagram class. Two strings are anagrams exactly when their canonical forms are equal, so a [[a1-hashmap|HashMap]] from canonical form to list of strings performs the grouping in one pass. This is the standard "group by a key" use of [[a2-hashing|Hashing]].

#### Algorithm

1. `groups` = empty map from key to list of strings.
2. For each string `s`: `key` = the characters of `s` sorted; append `s` to `groups[key]`, creating the list if absent.
3. Return the map's values as a list.

#### Why it is correct

- **Anagrams get the same key:** they contain the same multiset of letters, and sorting a multiset gives one specific sequence.
- **Non-anagrams get different keys:** if two sorted sequences are equal, they contain the same letters with the same counts, so the original strings are anagrams.
- So the map's lists are exactly the anagram classes, and every string is appended to exactly one list.
- The empty string's key is the empty string, a valid map key, so empty strings form their own group.

#### Dry run

`strs = ["dusty", "study", "night", "thing", "act"]`

| String | Sorted key | Map after this step |
|---|---|---|
| dusty | dstuy | dstuy → [dusty] |
| study | dstuy | dstuy → [dusty, study] |
| night | ghint | dstuy → [dusty, study]; ghint → [night] |
| thing | ghint | ...; ghint → [night, thing] |
| act | act | ...; act → [act] |

Result: the three lists `[dusty, study]`, `[night, thing]`, `[act]`, in whatever order the map iterates.

`strs = ["", "b", ""]`: keys are `""`, `"b"`, `""`, so the map is `"" → ["", ""]`, `"b" → ["b"]`.

#### Java code

```java title="Approach 2: sorted string as key"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] letters = s.toCharArray();
            Arrays.sort(letters);
            String key = new String(letters); // the same for every anagram of s
            groups.computeIfAbsent(key, unused -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

`computeIfAbsent` creates the list the first time a key is seen and returns the existing list afterwards, so one line replaces a `get`, a `null` check and a `put`.

#### Time complexity

**O(n·k log k) expected time.** Per string of length at most k:

- `toCharArray` and `new String` copy k characters: O(k).
- Sorting the characters: O(k log k). (Current JDKs may sort large `char` arrays with a counting sort, but these arrays are at most 100 long, and in any case that is implementation behaviour, not a contract.)
- The map lookup hashes the key, which reads its k characters, and compares it with keys in the same bucket, O(k) per comparison. With well-spread hash codes that is O(k) expected.

Over n strings: O(n·k log k) expected. Strictly, the bound is the sum of kᵢ log kᵢ over the strings, which is at most n·k log k. If hash codes collide badly, lookups cost more, so this is an expected bound, not a worst-case one.

#### Space complexity

**O(n·k) auxiliary space**: the map holds up to n distinct keys, each a new string of up to k characters. The lists inside the map are the output (n references in total). The temporary `char[]` per string is O(k) and is discarded after each iteration.

#### The bridge to the next approach

> "The sort is the only super-linear part. Do I need a sorted string specifically? No. I need *some* label that's equal for anagrams and different otherwise. The sorted string encodes the letter counts in a roundabout way. With only 26 possible letters, I can count them in O(k) and use the 26 counts themselves as the label. That removes the log k factor."

> "The question is how to turn 26 numbers into a hash map key. An `int[]` won't work as a key directly, because arrays use identity for `equals` and `hashCode`. I'll build a string from the counts. I have to be careful there: if I just glue the numbers together, a count of 1 followed by 11 and a count of 11 followed by 1 both become '111'. So I put a separator after each count."

### Approach 3: Letter counts as the key (recommended)

#### What I say out loud

> "For each string, I count its letters into an `int[26]`, which is O(k). Then I build a key by writing out all 26 counts, each followed by a '#'. Anagrams have identical counts, so identical keys. Then the same map-of-lists as before. That's O(k + 26) per string, so O(n·k) expected overall, treating the alphabet size as a constant."

#### Intuition

Two strings are anagrams exactly when their count vectors are equal (the idea from [[a2-frequency-counting|Frequency Counting]]). The count vector is a canonical form that costs linear time to compute. The only care needed is to encode it as a string in a way that two different vectors can never produce the same text.

#### Algorithm

1. `groups` = empty map from key to list of strings.
2. For each string `s`:
   1. `count = new int[26]`; for each character `c` of `s`, `count[c - 'a']++`.
   2. Build `key` by appending, for each of the 26 counts in order, the count's digits followed by `'#'`.
   3. Append `s` to `groups[key]`, creating the list if absent.
3. Return the map's values as a list.

#### Why it is correct

- **Anagrams get the same key:** same letters with the same counts give the same 26 numbers in the same order, so the same text.
- **Different count vectors get different keys.** This is where the separator matters. Each count is written as its decimal digits followed by `'#'`, and digits never contain `'#'`. So reading a key from left to right, every `'#'` marks exactly where one count ends, and the key can be split back into the 26 original numbers in only one way. Two keys that are equal as text therefore decode to the same 26 numbers, so the strings are anagrams.
- **Without the separator this fails:** `"abbbbbbbbbbb"` (a:1, b:11) and `"aaaaaaaaaaab"` (a:11, b:1) would both produce `"111"` followed by 24 zeros, and would be grouped together although they are not anagrams.
- The empty string gets 26 zero counts, the key `"0#0#…0#"`, which all empty strings share.

**The 30-second version to say to the interviewer:**

> "Two strings are anagrams exactly when they have the same 26 letter counts. I count each string in O(k), write the counts out with a '#' after each so the text can only be read back one way, and use that text as a map key. Equal keys mean equal counts mean anagrams, so each map list is exactly one anagram group, and I return the lists."

#### Dry run

`strs = ["dusty", "study", "night", "thing", "act"]`. Keys are 26 counts separated by `#`; below, only the nonzero counts are listed, and every other position is `0#`.

| String | Nonzero counts | Key (abbreviated) | Group |
|---|---|---|---|
| dusty | d1 s1 t1 u1 y1 | `0#0#0#1#…#1#1#1#0#0#0#1#0#` | new group A |
| study | d1 s1 t1 u1 y1 | same as dusty | A |
| night | g1 h1 i1 n1 t1 | `0#0#0#0#0#0#1#1#1#…` | new group B |
| thing | g1 h1 i1 n1 t1 | same as night | B |
| act | a1 c1 t1 | `1#0#1#0#…` | new group C |

For the separator check: `"abbbbbbbbbbb"` gives a key starting `1#11#0#…`, and `"aaaaaaaaaaab"` gives `11#1#0#…`. Different, as they must be.

#### Java code

```java title="Approach 3: letter counts as key (recommended)"
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (int i = 0; i < s.length(); i++) {
                count[s.charAt(i) - 'a']++;
            }
            StringBuilder key = new StringBuilder();
            for (int c : count) {
                key.append(c).append('#'); // the separator keeps 1,11 apart from 11,1
            }
            groups.computeIfAbsent(key.toString(), unused -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

#### Time complexity

**O(n·(k + 26)) expected time, which is O(n·k) when the alphabet size is treated as a constant.** Per string:

- Counting: O(k).
- Building the key: 26 appends of at most 3 digits plus a separator (counts are at most 100), so the key has at most 26 × 4 = 104 characters: O(26), constant.
- Hashing and comparing the key: proportional to its length, constant here, expected.

The 26 matters for very short strings: for a string of length 2 the key still costs 26 appends. That is why the precise bound is O(n·(k + σ)) for an alphabet of σ letters. As with Approach 2, "expected" refers to the hash map.

#### Space complexity

**O(n·σ) = O(n) auxiliary space for the keys** (up to n distinct keys of at most 104 characters each), plus a 26-counter array and a builder per string, reused or discarded each iteration. The lists are the output.

### Alternative: fixed-width keys without a separator

Instead of digits and `'#'`, store each count as one `char`: `new String(charCounts)` where `charCounts` is a `char[26]`. Every count takes exactly one position, so no separator is needed, and the key is always 26 characters. It is correct here because a count cannot exceed 100 and a `char` holds up to 65,535. `Arrays.toString(count)` also works (it writes `"[1, 11, 0, …]"`, which has separators) at the cost of a longer key.

Pick it if you want the shortest keys; the `'#'` version is easier to read and to explain on a whiteboard. Same complexity.

## 5. Comparison table

n = number of strings; k = maximum string length (≤ 100); σ = alphabet size (26).

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Compare with representatives | O(n²·k) | O(n²·k) | O(1) beyond the output |
| 2. Sorted-string key | O(n·k log k) | Worse if hash codes collide (hash-table worst case) | O(n·k) for the keys |
| 3. Count key with separators | O(n·(k + σ)) = O(n·k) for fixed σ | Worse if hash codes collide (hash-table worst case) | O(n·σ) for the keys |
| Alt. Fixed-width count key | O(n·(k + σ)) | Same as approach 3 | O(n·σ) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Compare with representatives | Reuses Valid Anagram, no hashing | Quadratic in the number of groups | Only as the stated baseline |
| 2. Sorted-string key | Shortest code; easy to verify, since two strings are anagrams exactly when their sorted forms match; works for any alphabet | Extra log k factor | Strings are short, or the alphabet is large or unknown |
| 3. Count key | Linear in the input size; no sorting | Key construction is easy to get wrong without a separator; costs σ per string | The default for a small fixed alphabet |
| Alt. Fixed-width count key | Short fixed-length keys, no separator to forget | Unreadable keys; relies on counts fitting in a `char` | When key size matters and counts are bounded |

## 6. Which solution to give, and when to stop optimizing

**Give the count key (Approach 3), and mention the sorted key as the simpler alternative.** It has the best bound, O(n·k) expected for a fixed alphabet, and the code is barely longer than the sorted version.

**Be honest about how much it matters.** With k ≤ 100, log₂ k is under 7, and the count key always pays for 26 slots, so on this problem's inputs the two run in similar time. If you derived the sorted key first and wrote it cleanly, that is a strong answer; present the count key as the asymptotic improvement and explain the separator.

**Is it optimal?** Yes, in expectation. In the worst case any correct algorithm must read essentially every character, since one unread character could move its string to another group, so there is an Ω(total input length) worst-case lower bound. The count-key solution is linear in the input size plus 26 per string.

**When another choice is better:** for a large or unknown alphabet (Unicode text), the 26-slot array no longer fits, and sorting the code points, or counting them in a map, is the practical key.

**Where to stop:** once you have a canonical key, the complexity with n and k defined, and the separator explained. Do not tune `StringBuilder` capacities or replace the map unless asked.

## 7. Interview script: code it and test it

### What I say while coding

> "A map from key to the list of strings with that key."

> "For each string: 26 counters, one pass to count."

> "Then the key: each count followed by a '#'. The separator is not decoration: without it, counts 1 and 11 look the same as 11 and 1."

> "`computeIfAbsent` gives me the list for the key, creating it the first time. I add the original string, not the key."

> "At the end I wrap the map's values in an `ArrayList`. Order doesn't matter."

### Testing out loud

**Normal case:** `["dusty", "study", "night", "thing", "act"]`. "dusty" and "study" have the counts d, s, t, u, y = 1, so the same key; "night" and "thing" share g, h, i, n, t = 1; "act" has its own key. Three groups. Correct.

**Empty strings:** `["", "b", ""]`. Both empty strings get 26 zeros, the same key, so one group of two; "b" is separate. Correct, and no special case was needed.

**A single string:** `["a"]` gives one group `[["a"]]`; `[""]` gives `[[""]]`.

**Duplicates:** `["eat", "eat", "tea"]`. All three have a, e, t = 1, so one group of three. Duplicates are kept.

**Same letters, different counts:** `["aab", "abb", "ab"]`. The keys start `2#1#`, `1#2#` and `1#1#`: three groups.

**Multi-digit counts:** `["abbbbbbbbbbb", "aaaaaaaaaaab", "bbbbbbbbbbba"]`. Keys start `1#11#`, `11#1#`, `1#11#`: the first and third are grouped, the second is alone. Correct thanks to the separator.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Output order, alphabet, empty strings, duplicates |
| Baseline | about 1 min | Compare with each group's representative; O(n²·k) |
| Derive the key | 2–3 min | "A label equal exactly for anagrams" → sorted string → counts |
| Code | 3–4 min | Count key with separators |
| Test | 2–3 min | Example, empty strings, multi-digit counts |
| Complexity and trade-offs | 2 min | n and k defined; sorted key versus count key |

Spend the time on the idea of a canonical key and on the separator; those are what the interviewer is listening for. If the count key feels risky under pressure, code the sorted key: it is correct and one step from optimal, and you can describe the count key in words.

## 9. Interviewer challenges

### About the key

#### Why not use the `int[26]` array itself as the map key?

**What they are testing:** whether you know how Java arrays behave as keys.

**How to reason:** a `HashMap` uses `hashCode` and `equals` of the key. For arrays those are inherited from `Object`, so they compare identity, not contents.

**What I say:** "Two different array objects with the same contents are different keys, so every string would get its own group. I need a key with value equality: a string built from the counts, or a `List<Integer>`, which does compare contents. The string is cheaper."

**Nuance:** `Arrays.equals` and `Arrays.hashCode` compare contents, but `HashMap` does not call them. A `List<Integer>` key would work, at the cost of 26 boxed integers per key.

#### Why do you need the separator?

**What they are testing:** whether you see that an encoding must be reversible to be a correct key.

**How to reason:** look for two different count vectors that produce the same text. Multi-digit counts are the danger.

**What I say:** "Without it, (a:1, b:11) and (a:11, b:1) both become '111' followed by zeros, so 'abbbbbbbbbbb' and 'aaaaaaaaaaab' would be grouped although they aren't anagrams. With a '#' after each count, the text splits back into 26 numbers in only one way, so equal keys really mean equal counts."

**Nuance:** a fixed-width encoding, such as one `char` per count, also avoids the problem, because the position of each count is known without a separator.

#### Could you hash the counts into a single number, like a product of primes?

**What they are testing:** whether you check an idea for collisions and overflow before using it.

**How to reason:** assign each letter a prime; the product is equal exactly for anagrams by unique factorization. But how big does it get?

**What I say:** "In exact arithmetic it's a correct key, by unique prime factorization. But a 100-letter string of 'z' would be 101 to the power 100, which is far beyond a `long`, so in practice it overflows and different strings can collide. I'd need `BigInteger`, at which point the count string is simpler and faster."

**Nuance:** any fixed-size numeric hash of the counts can collide; it is only safe as a hash, with the full counts compared on equality, which is what the `HashMap` already does with the string key.

### About complexity

#### What exactly are n and k, and which is bigger in practice?

**What they are testing:** whether you define variables and know when an asymptotic difference matters.

**How to reason:** n ≤ 10^4 strings, k ≤ 100 characters each. log₂ 100 ≈ 6.6.

**What I say:** "n is the number of strings and k the maximum length. Sorted keys cost O(n·k log k), count keys O(n·(k + 26)). With k at most 100, log k is under 7, while the count key always pays for 26 slots. So on these inputs they're close; the count key wins clearly only when strings are long. I'd still describe the count key as the better bound."

**Nuance:** if strings vary a lot in length, the sum of the lengths is a tighter measure than n·k for both approaches.

#### Is the hash map lookup really constant time here?

**What they are testing:** precision about hashing with string keys.

**How to reason:** a string's hash code is computed from all its characters, and a key comparison reads characters too.

**What I say:** "Not O(1): hashing a key reads all of it, so it's proportional to the key length, k for sorted keys and at most 104 characters for count keys. On top of that, the bucket search is constant only on average, assuming hash codes spread well. So the bounds are expected, and in a bad collision case they get worse."

**Nuance:** Java caches a string's hash code after computing it once, but each key here is a new string, so the hash is computed once per string anyway.

## 10. Follow-up questions the interviewer might ask

**"What if the strings can contain any Unicode characters?"**
The 26-slot array no longer fits. Use the sorted array of code points as the key (`s.codePoints().sorted().toArray()`, turned into a string with a separator), or a map from code point to count encoded in a canonical order. Counting `char`s instead of code points can mix up halves of surrogate pairs, as discussed in [[nc-valid-anagram|Valid Anagram]]. O(n·k log k) expected.

**"Return only the groups with at least two strings"** or **"return the size of the largest group."**
Same map, then filter or measure the lists: O(number of groups) extra time.

**"Strings arrive one at a time and you must report each one's group immediately."**
The key approach already works online: keep the map, compute the key of the new string, and append it, O(k) expected per string. The comparison-based approach would cost O(g·k) per string.

**"What if the strings are very long but there are few of them?"**
Then k dominates and the count key's O(k) per string is the real gain over O(k log k). For extremely long strings, counting is also more cache-friendly than sorting.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Skipping the canonical-key idea and optimizing the pairwise comparison.** A faster anagram test still leaves O(n²) comparisons. The improvement comes from not comparing at all.
- **Giving the complexity as O(n log n) or O(n).** The string lengths matter. Define k and include it.
- **Treating empty strings as a special case.** Their key is valid; they need no extra code.

### Implementation mistakes

> [!MISTAKE] Building the count key without separators
> Appending only the digits makes `"abbbbbbbbbbb"` and `"aaaaaaaaaaab"` share the key `"111"` followed by 24 zeros, so they are put in one group although they are not anagrams. Append a `'#'` after each count, or use a fixed-width encoding.

- **Using the `int[]` or `char[]` itself as the key.** Arrays compare by identity in a `HashMap`, so every string ends up in its own group.
- **Adding the key instead of the original string to the list.** The output must contain the input strings, not their sorted forms.
- **Calling `Arrays.sort(s.toCharArray())` and then using `s` as the key.** The sort works on a copy; the key must be built from the sorted array.

## 12. Pattern recognition

**The pattern:** group by a canonical key. Map each item to a form that is equal exactly for items that belong together, and collect items in a hash map keyed by that form.

**Signals in the problem statement:**

- "Group", "bucket", "classify" items that are equivalent under some rearrangement or transformation.
- Pairwise comparison is easy but quadratic in the number of items.
- The equivalence can be described by an invariant of each item (sorted letters, letter counts, a normalized shape).

**Related problems in this list:**

- [[nc-valid-anagram|Valid Anagram]]: the pairwise test this problem generalizes.
- [[nc-top-k-frequent-elements|Top K Frequent Elements]]: counting with a hash map, then organizing by the counts.
- [[nc-contains-duplicate|Contains Duplicate]]: the simplest hash-by-value grouping question.
- [[nc-two-sum|Two Sum]]: a hash map answering "which earlier item belongs with this one?"

**Takeaway:** when items must be grouped by an equivalence, find a canonical form computed from each item alone and use it as a hash map key; then grouping is one pass.

## 13. 60-second revision card

**Key insight:** anagrams have the same letter counts. Turn the counts into a string key (with separators) and group by it in a hash map.

**Invariant:** each map list holds exactly the strings seen so far that have that key, so at the end the lists are the anagram groups.

**Complexity:** n strings, max length k, alphabet 26. Count key: O(n·(k + 26)) expected time, O(n·26) auxiliary for keys. Sorted key: O(n·k log k) expected, O(n·k) for keys.

**Code skeleton:**

```java title="Group Anagrams with a count key"
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;
            StringBuilder key = new StringBuilder();
            for (int c : count) key.append(c).append('#');   // separator: 1,11 is not 11,1
            groups.computeIfAbsent(key.toString(), unused -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

**Main traps:**

- No separator in the count key.
- An array as a map key (identity, not contents).
- Leaving k out of the complexity.

**What to say in one breath:** "Comparing each string with every group is O(n²·k). Instead I compute a key that's equal exactly for anagrams: the sorted string, O(k log k), or the 26 letter counts with separators, O(k). Grouping by that key in a hash map is one pass, O(n·k) expected for the count key."
