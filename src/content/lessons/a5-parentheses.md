---
summary: Bracket and expression problems are where stacks earn their reputation. You will learn to validate, repair, measure and generate parenthesised strings, and then to evaluate arithmetic expressions — postfix, infix with precedence, parentheses and unary minus — using stacks, the shunting-yard algorithm and recursive descent.
difficulty: intermediate
minutes: 70
objectives:
  - Explain why matching nested brackets is a last-in, first-out problem and when a counter is enough instead of a stack
  - Implement validation, minimum repair and longest-valid-substring algorithms and trace them on tricky inputs
  - Generate all valid parenthesis strings with constrained backtracking and state how many there are
  - Evaluate postfix and infix expressions, handling precedence, associativity, parentheses and unary minus
  - Convert infix to postfix with the shunting-yard algorithm and compare it with recursive descent
---

## Introduction

Every time you save a file in an editor that highlights a missing `}`, every time a browser parses HTML tags, and every time a compiler reads `a * (b + c)`, a program is answering the same underlying question: **does each closing symbol match the most recent unmatched opening symbol?**

That rule is last-in, first-out. In `{ [ ( ) ] }`, the `(` opened last, so it must close first; then the `[`; then the `{`. A [[a5-stack]] holds exactly "the openers still waiting to be closed, newest on top", so it is the natural tool. Once you see brackets this way, a whole family of problems opens up: checking validity, finding the fewest edits to repair a string, measuring the longest valid stretch, generating every valid string, and computing values defined by nesting.

Arithmetic expressions are the same idea with more structure. In `2 * (3 + 4)`, the parentheses say "finish the inside first", and operator precedence says "multiplication before addition" even without parentheses. Evaluating such expressions — the classic *Basic Calculator* interview problems — means deferring operators and partial results until the rules say they can be applied, which is again a stack's job. That material is taught in the [[a5-expression]] section below.

This lesson works through both halves in order: brackets first, because they isolate the matching idea, then expressions, which add precedence on top.

## Before you start

- **Stacks** — push, pop, peek, `ArrayDeque`, and storing indices instead of values. See [[a5-stack]].
- **Recursion and backtracking** — needed to generate all valid strings and for recursive-descent parsing. See [[a1-recursion]] and [[a9-subsets]].
- **Strings in Java** — `charAt`, `StringBuilder`, and converting digit characters with `c - '0'`. See [[a1-strings-stringbuilder]].

## The intuition

Imagine walking into a building of nested rooms. Each time you pass through a door into a room you write the room's name on a sticky note and press it onto a pile. When you leave a room, the exit you use must belong to the room on the top note — you cannot leave the kitchen through the bedroom door while you are still in the kitchen. Peel the note off as you leave. When you are back outside, the pile must be empty; a note left over means you never left that room.

The pile of notes is the stack, a door in is an opener, and a door out is a closer. Three things can go wrong, and every validation bug is one of them:

1. **A closer with an empty pile** — you tried to leave a room you never entered, as in `)(`.
2. **A closer of the wrong type** — leaving the kitchen through the bedroom door, as in `([)]`.
3. **Notes left at the end** — rooms never exited, as in `((`.

## Validating brackets

### One bracket type: a counter is enough

If the only brackets are `(` and `)`, the stack would contain nothing but `(` characters. A stack of identical items carries no information beyond its size, so a single integer does the same job: add one for `(`, subtract one for `)`.

```java title="ValidParens.java (single type)"
static boolean isValidRound(String s) {
    int open = 0;
    for (char c : s.toCharArray()) {
        open += (c == '(') ? 1 : -1;
        if (open < 0) return false;                // a ')' with nothing to close
    }
    return open == 0;
}
```

Both checks are needed. `open < 0` during the scan catches a closer arriving before its opener — `())(` has a final count of 0 but is invalid, because the count dips to −1 at the third character. `open == 0` at the end catches unclosed openers. This uses O(1) space instead of O(n).

### Several types: why the stack is needed

With `()`, `[]` and `{}`, separate counters are not enough. `([)]` has one of each opener and one of each closer, and no counter ever goes negative, yet it is invalid: the `)` arrives while `[` is the most recent opener. Detecting that requires knowing the **order** of the unmatched openers, which is precisely what a stack stores.

```java title="ValidParens.java"
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

public class ValidParens {
    private static final Map<Character, Character> OPENER_OF = Map.of(')', '(', ']', '[', '}', '{');

    static boolean isValid(String s) {
        Deque<Character> st = new ArrayDeque<>();      // unmatched openers, most recent on top
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) return false;        // a closer with nothing to close
                char open = st.pop();                  // unboxed, so != compares chars
                if (open != OPENER_OF.get(c)) return false;   // wrong type of bracket
            }
        }
        return st.isEmpty();                           // leftover openers were never closed
    }

    /** Single bracket type: a counter is enough. */
    static boolean isValidRound(String s) {
        int open = 0;
        for (char c : s.toCharArray()) {
            open += (c == '(') ? 1 : -1;
            if (open < 0) return false;                // a ')' with nothing to close
        }
        return open == 0;
    }

    public static void main(String[] args) {
        for (String s : new String[] {"()[]{}", "{[()]}", "(]", "([)]", "((", ")("}) {
            System.out.println(s + " -> " + isValid(s));
        }
        System.out.println("(()) -> " + isValidRound("(())") + ", ())( -> " + isValidRound("())("));
    }
}
```

```output
()[]{} -> true
{[()]} -> true
(] -> false
([)] -> false
(( -> false
)( -> false
(()) -> true, ())( -> false
```

The three `return false` / `return st.isEmpty()` lines correspond exactly to the three failure modes from the intuition. The map from closer to opener keeps the matching rule in one place, so adding `<>` later is a one-line change. One subtle detail: the popped value is stored in a `char` before comparing. `st.pop()` returns a `Character` object and so does `OPENER_OF.get(c)`; comparing two `Character` objects with `!=` compares references, which happens to work for small cached values but is a bug waiting to happen. Unboxing to `char` makes the comparison numeric.

Dry run on `([)]`:

| Char | Action | Stack (bottom → top) |
|---|---|---|
| `(` | push | `(` |
| `[` | push | `( [` |
| `)` | pop `[`, expected `(` → mismatch | return `false` |

Each character is pushed or popped once: **O(n) time**, and **O(n) space** in the worst case of all openers.

## Repairing strings

Validation says yes or no. Repair problems ask how far a string is from valid.

**Minimum insertions.** Scan with a counter of unmatched `(`. A `)` that finds the counter at zero is an orphan — it needs a `(` inserted before it. At the end, each still-unmatched `(` needs a `)`. The answer is orphans plus leftovers.

**Minimum removals, returning the string.** Now we must know *which* characters to delete, so record indices: push the index of each `(`; a `)` with an empty stack is marked for removal; after the scan, every index left on the stack is an unclosed `(` and is also removed.

```java title="ParenFixes.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class ParenFixes {
    /** Fewest '(' or ')' insertions that make s valid. */
    static int minAddToMakeValid(String s) {
        int open = 0, added = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') open++;
            else if (open > 0) open--;                 // this ')' closes an earlier '('
            else added++;                              // orphan ')': must insert a '(' for it
        }
        return added + open;                           // plus a ')' for every unclosed '('
    }

    /** Remove the fewest parentheses (other characters stay) to make s valid. */
    static String minRemoveToMakeValid(String s) {
        boolean[] remove = new boolean[s.length()];
        Deque<Integer> st = new ArrayDeque<>();        // indices of unmatched '('
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') st.push(i);
            else if (c == ')') {
                if (st.isEmpty()) remove[i] = true;    // orphan ')'
                else st.pop();
            }
        }
        while (!st.isEmpty()) remove[st.pop()] = true; // '(' never closed
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) if (!remove[i]) sb.append(s.charAt(i));
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(minAddToMakeValid("())") + " " + minAddToMakeValid("(((") + " " + minAddToMakeValid("()))(("));
        System.out.println(minRemoveToMakeValid("lee(t(c)o)de)"));
        System.out.println(minRemoveToMakeValid("a)b(c)d"));
        System.out.println("[" + minRemoveToMakeValid("))((") + "]");
    }
}
```

```output
1 3 4
lee(t(c)o)de
ab(c)d
[]
```

For `"()))(("`, the first pair matches, the next two `)` are orphans (2), and the final two `(` are unclosed (2): four insertions. Why is greedy matching optimal? Every orphan `)` has no `(` to its left that is still free, so no strategy can save it; every leftover `(` has no free `)` to its right. Matching each `)` with the nearest free `(` never blocks a better match. Both algorithms are O(n).

## Longest Valid Parentheses

**Problem.** Given a string of `(` and `)`, find the length of the longest contiguous substring that is valid. For `")()())"` the answer is 4 (`"()()"`).

**Naive approach.** Check every substring for validity: O(n²) substrings, O(n) each, O(n³). Reusing a counter per start brings it to O(n²).

**Stack idea.** A valid run ends at index `i` when a `)` matches; it starts just after the most recent position that *cannot* be part of it — either an unmatched `(` still on the stack or the last unmatched `)`. So keep a stack of indices where the bottom element is always the **base**: the index just before the current run. Initialise it with `-1`, an imaginary position before the string.

- On `(`: push its index.
- On `)`: pop. If the stack is now empty, this `)` was unmatched — push its index as the new base. Otherwise the run from just after the new top up to `i` is valid, with length `i - top`.

```java title="LongestValid.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class LongestValid {
    static int withStack(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        st.push(-1);                                   // base: index just before the current valid run
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                st.push(i);
            } else {
                st.pop();                              // match the top '(' (or remove the base)
                if (st.isEmpty()) {
                    st.push(i);                        // unmatched ')': it becomes the new base
                } else {
                    best = Math.max(best, i - st.peek());   // run from just after the top to i
                }
            }
        }
        return best;
    }

    static int withCounters(String s) {
        int best = 0, open = 0, close = 0;
        for (int i = 0; i < s.length(); i++) {         // left to right
            if (s.charAt(i) == '(') open++; else close++;
            if (open == close) best = Math.max(best, 2 * close);
            else if (close > open) open = close = 0;   // too many ')': nothing can extend past here
        }
        open = close = 0;
        for (int i = s.length() - 1; i >= 0; i--) {    // right to left catches runs like "(()"
            if (s.charAt(i) == '(') open++; else close++;
            if (open == close) best = Math.max(best, 2 * open);
            else if (open > close) open = close = 0;
        }
        return best;
    }

    public static void main(String[] args) {
        for (String s : new String[] {"(()", ")()())", "", "()(())", "(()(((()"}) {
            System.out.println("\"" + s + "\" -> " + withStack(s) + " " + withCounters(s));
        }
    }
}
```

```output
"(()" -> 2 2
")()())" -> 4 4
"" -> 0 0
"()(())" -> 6 6
"(()(((()" -> 2 2
```

Dry run of the stack version on `")()())"`:

| `i` | Char | Action | Stack (bottom → top) | Best |
|---|---|---|---|---|
| — | | init | `-1` | 0 |
| 0 | `)` | pop −1; empty → push 0 as base | `0` | 0 |
| 1 | `(` | push | `0 1` | 0 |
| 2 | `)` | pop 1; length 2 − 0 | `0` | 2 |
| 3 | `(` | push | `0 3` | 2 |
| 4 | `)` | pop 3; length 4 − 0 | `0` | 4 |
| 5 | `)` | pop 0; empty → push 5 | `5` | 4 |

Without the initial `-1`, the very first valid run, starting at index 0, would have nothing beneath it to measure from. The sentinel is the "position before the string".

**The O(1)-space alternative.** Scan left to right with counts of `(` and `)`. Whenever they are equal, the stretch since the last reset is valid. Whenever `)` outnumbers `(`, no valid run can cross this point, so reset both counts. This misses runs where `(` is always ahead, such as `"(()"`, so make a second pass from the right with the roles swapped. Both versions are O(n) time; the counter version uses O(1) space.

## Generating all valid strings

**Problem.** Generate every valid string of `n` pairs. For `n = 3` there are five.

This is not a scanning problem at all; it is **backtracking** (see [[a9-subsets]] for the general technique). Build the string one character at a time and only make choices that can still lead to a valid string:

- Add `(` if fewer than `n` have been used.
- Add `)` only if it would close something: `close < open`.

These two rules guarantee that the counter never goes negative and ends at zero, so every completed string is valid and no time is wasted on invalid prefixes.

```java title="GenerateParens.java"
import java.util.ArrayList;
import java.util.List;

public class GenerateParens {
    static List<String> generate(int n) {
        List<String> out = new ArrayList<>();
        build(new StringBuilder(), 0, 0, n, out);
        return out;
    }

    static void build(StringBuilder cur, int open, int close, int n, List<String> out) {
        if (cur.length() == 2 * n) {
            out.add(cur.toString());
            return;
        }
        if (open < n) {                                // still have '(' to place
            cur.append('(');
            build(cur, open + 1, close, n, out);
            cur.deleteCharAt(cur.length() - 1);        // undo the choice
        }
        if (close < open) {                            // a ')' must close something
            cur.append(')');
            build(cur, open, close + 1, n, out);
            cur.deleteCharAt(cur.length() - 1);
        }
    }

    public static void main(String[] args) {
        System.out.println(generate(3));
        for (int n = 1; n <= 6; n++) System.out.print(generate(n).size() + " ");
        System.out.println();
    }
}
```

```output
[((())), (()()), (())(), ()(()), ()()()]
1 2 5 14 42 132 
```

The counts 1, 2, 5, 14, 42, 132 are the **Catalan numbers**, `Cₙ = (2n choose n) / (n + 1)`. They grow roughly like `4ⁿ / n^1.5`, and each string costs O(n) to copy, so the total running time is about O(4ⁿ / √n). That sounds alarming, but it is proportional to the size of the output — you cannot list the strings faster than writing them down. Interviewers often ask for this count as a follow-up.

## Values defined by nesting

Some problems assign a number to a bracket string. **Score of Parentheses** defines `"()"` as 1, `"AB"` as `A + B`, and `"(A)"` as `2 × A`. The score of a group depends on what is inside it, which is finished only when the group closes — defer until closing, a stack again. Keep one running score per open level: `(` starts a new level at 0; `)` closes the level, turns its inner score into a value (1 if empty, otherwise double), and adds that to the enclosing level.

This method and the wildcard check in the next section are static methods of a class `ParenMisc` that imports `java.util.ArrayDeque` and `java.util.Deque`.

```java title="ParenMisc.java (score)"
static int scoreOfParentheses(String s) {
    Deque<Integer> st = new ArrayDeque<>();
    st.push(0);                                    // score of the current (outermost) level
    for (char c : s.toCharArray()) {
        if (c == '(') {
            st.push(0);                            // start a new inner level
        } else {
            int inner = st.pop();
            int value = (inner == 0) ? 1 : 2 * inner;   // "()" or "(A)"
            st.push(st.pop() + value);             // add to the enclosing level
        }
    }
    return st.pop();
}
```

For `"()"`, `"(())"`, `"()()"` and `"(()(()))"` this returns 1, 2, 2 and 6. The last one is `2 × (1 + 2 × 1)`. The same "one accumulator per open level" pattern solves *Maximum Nesting Depth* (track the stack size, or just a counter) and is the core of the calculators in the next section.

## Wildcards: Valid Parenthesis String

**Problem.** The string contains `(`, `)` and `*`, where each `*` can be `(`, `)` or nothing. Can it be made valid?

Trying all three options for every `*` is O(3ᵏ). Instead, track the **range** of possible unmatched-open counts. `lo` is the fewest possible, `hi` the most. `(` raises both; `)` lowers both; `*` lowers `lo` (treat it as `)`) and raises `hi` (treat it as `(`). If `hi` drops below zero, even the most generous choice has too many `)` — fail. Clamp `lo` at zero, because a real count never goes negative (choices that would make it negative are simply discarded). At the end, valid if `lo == 0`, meaning some choice closes everything.

```java title="ParenMisc.java (wildcards)"
static boolean checkValidString(String s) {
    int lo = 0, hi = 0;                            // fewest and most unmatched '(' possible
    for (char c : s.toCharArray()) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }                       // '*' as ')' lowers, as '(' raises
        if (hi < 0) return false;                  // even treating every '*' as '(' fails
        lo = Math.max(lo, 0);                      // open count can never go below zero
    }
    return lo == 0;                                // some choice closes everything
}
```

For `"(*)"`, `"(*))"`, `"((*"` and `"*)("` it returns `true`, `true`, `false`, `false`. Every count between `lo` and `hi` is achievable by some assignment of the stars, which is why the range is enough. This O(n), O(1)-space greedy is a good example of replacing a stack with counters once you understand what the stack would contain.

```quiz
Q: Why can't three separate counters (one per bracket type) validate "([)]"?
- [ ] Counters cannot be negative
- [x] All three counts balance and never go negative, but the order of openers is lost, and the ")" arrives while "[" is the most recent opener
- [ ] Counters only work for strings shorter than 64 characters
- [ ] They can; three counters are equivalent to a stack
> Counters record how many openers of each type are pending but not which one was opened last. Matching requires the most recent unmatched opener, so the stack's ordering is essential once there is more than one bracket type.

Q: In the stack solution to Longest Valid Parentheses, what is the purpose of pushing -1 first?
- [ ] It marks the end of the string
- [ ] It prevents the stack from ever being empty, so pop never throws
- [x] It is a base index just before position 0, so a valid run starting at index 0 can be measured as i - (-1)
- [ ] It counts the number of unmatched ')'
> The length of the run ending at i is i minus the index just before the run. For a run starting at 0, that index is -1, which does not exist in the string, so it is pushed as a sentinel. Unmatched ')' later replace it as the new base.

Q: How many valid strings of 4 pairs of parentheses are there?
- [ ] 8
- [ ] 16
- [x] 14
- [ ] 24
> The count is the Catalan number C4 = (8 choose 4) / 5 = 70 / 5 = 14. Answers like 16 or 24 come from counting all arrangements without the "never close more than you opened" constraint.
```

## Expression Problems {#a5-expression}

Expression problems ask a program to compute the value of an arithmetic expression written as text, such as `"3 + 4 * 2"` or `"2 * (5 + 5 * 2) / 3"`. They are a staple of interviews — the *Evaluate Reverse Polish Notation* and *Basic Calculator I, II and III* problems — and a miniature version of what every compiler and spreadsheet does. The difficulty is that the order in which you *read* an expression is not the order in which you must *compute* it, and stacks are the tool that bridges the two.

### Why expressions need stacks

Humans write **infix** notation: the operator sits between its operands, as in `3 + 4 * 2`. Reading left to right, you meet `3 + 4` first, but you must not add yet, because `*` has higher **precedence** and binds `4` to `2` first. The answer is 11, not 14. Two more rules complicate things. **Associativity** decides how equal-precedence operators group: `10 - 4 - 3` means `(10 - 4) - 3 = 3`, because `-` is left-associative, while exponentiation is conventionally right-associative, so `2 ^ 3 ^ 2` means `2 ^ (3 ^ 2) = 512`. And **parentheses** override everything.

So while scanning, you constantly hold operands and operators "on hold" until a later token tells you whether they can be applied. Things put on hold most recently are resolved first — `4 * 2` is computed before the waiting `3 +` — which is last-in, first-out.

There is a notation with none of these complications. In **postfix** notation, also called **Reverse Polish Notation (RPN)**, each operator comes *after* its operands: `3 + 4 * 2` becomes `3 4 2 * +`, and `(3 + 4) * 2` becomes `3 4 + 2 *`. Postfix needs no precedence rules and no parentheses, because the order of the tokens already is the order of computation. That makes it the easiest form to evaluate, and it is why the standard approach to infix is "convert to postfix, then evaluate" — or do both in one pass.

### Evaluating postfix (RPN)

Scan the tokens. A number is pushed. An operator pops its two operands, applies itself, and pushes the result. At the end, the stack holds the answer.

```java title="EvalRpn.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class EvalRpn {
    static int evalRPN(String[] tokens) {
        Deque<Integer> st = new ArrayDeque<>();
        for (String tok : tokens) {
            switch (tok) {
                case "+", "-", "*", "/" -> {
                    int b = st.pop();                  // right operand was pushed last
                    int a = st.pop();
                    st.push(switch (tok) {
                        case "+" -> a + b;
                        case "-" -> a - b;
                        case "*" -> a * b;
                        default  -> a / b;             // Java truncates toward zero
                    });
                }
                default -> st.push(Integer.parseInt(tok));   // handles "-11" as a number
            }
        }
        return st.pop();
    }

    public static void main(String[] args) {
        System.out.println(evalRPN(new String[] {"2", "1", "+", "3", "*"}));
        System.out.println(evalRPN(new String[] {"4", "13", "5", "/", "+"}));
        System.out.println(evalRPN(new String[] {"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}));
        System.out.println(evalRPN(new String[] {"7", "-2", "/"}) + " " + Math.floorDiv(7, -2));
    }
}
```

```output
9
6
22
-3 -4
```

Trace `4 13 5 / +`: push 4, push 13, push 5; `/` pops `b = 5`, then `a = 13`, pushes `13 / 5 = 2`; `+` pops 2 and 4, pushes 6.

The **pop order** is the classic bug. The right operand was pushed last, so it comes off first. Writing `st.pop() - st.pop()` computes `b - a`, which is wrong for `-` and `/`. Assign `b` first, then `a`, as the code does.

The last line shows **integer division semantics**. Java's `/` truncates toward zero, so `7 / -2` is `-3`. Floor division, which Python's `//` uses, gives `-4` — Java offers it as `Math.floorDiv`. The LeetCode RPN problem specifies truncation toward zero, which matches Java's `/`; if a problem says otherwise, pick the operator deliberately. Matching the switch on the operator strings, rather than testing "starts with a digit", also lets negative numbers such as `"-11"` parse correctly. (The code uses switch expressions, standard since Java 14.)

Time is O(n) for `n` tokens; the stack holds at most O(n) numbers.

### Precedence without parentheses: Basic Calculator II

**Problem.** Evaluate a string with non-negative integers, `+ - * /` and spaces, but no parentheses. `"3+2*2"` is 7.

**The idea.** With only two precedence levels, there is a neat shortcut. Think of the expression as a sum of **terms** separated by `+` and `-`; each term is a product or quotient. Keep a stack of signed terms. When a number is complete, look at the operator that came *before* it:

- After `+`, push the number as a new term; after `-`, push its negative.
- After `*` or `/`, the number belongs to the previous term — pop it, combine, push the result back.

At the end, add up the stack. Multiplication and division are applied as soon as their right operand is known, which gives them priority; addition and subtraction are deferred to the final sum.

```java title="Calc2.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class Calc2 {
    /** Evaluates non-negative integers with + - * / and spaces, no parentheses. */
    static int calculate(String s) {
        Deque<Integer> terms = new ArrayDeque<>();     // signed terms still to be added up
        int num = 0;
        char op = '+';                                 // operator that came BEFORE num
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) num = num * 10 + (c - '0');
            // at an operator, or at the very end, num is complete: apply the previous operator
            if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
                switch (op) {
                    case '+' -> terms.push(num);
                    case '-' -> terms.push(-num);
                    case '*' -> terms.push(terms.pop() * num);   // binds tighter: fold into last term
                    case '/' -> terms.push(terms.pop() / num);
                }
                op = c;
                num = 0;
            }
        }
        int sum = 0;
        for (int t : terms) sum += t;
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(calculate("3+2*2"));
        System.out.println(calculate(" 3/2 "));
        System.out.println(calculate(" 3+5 / 2 "));
        System.out.println(calculate("14-3*4/5+10"));
    }
}
```

```output
7
1
5
22
```

Trace `"14-3*4/5+10"`: push 14; `-` before 3 pushes −3; `*` before 4 folds to −12; `/` before 5 folds to −12 / 5 = −2; `+` before 10 pushes 10. The sum is 14 − 2 + 10 = 22. Storing the term as −3 rather than remembering the minus separately works because truncating division is symmetric: `-12 / 5` equals `-(12 / 5)` in Java.

The edge cases are the usual traps. Numbers can have several digits, so `num` accumulates `num * 10 + digit`. The last number has no operator after it, which is why the condition also fires at `i == s.length() - 1`. Spaces must be skipped without being mistaken for operators. Initialising `op = '+'` makes the first number a positive term with no special case. Time O(n), space O(n) for the terms (reducible to O(1) by keeping only the last term and a running sum).

### Parentheses and unary minus: Basic Calculator I

**Problem.** Evaluate `+`, `-`, parentheses and spaces; `-` may also be unary, as in `"-(2 + 3)"`.

With only `+` and `-`, there is no precedence to worry about — the only structure is the nesting. Keep a running `result` and the `sign` of the number being read. On `(`, the group inside must be computed on its own before it can be added to the outer result, so **save the outer state on a stack**: the result so far and the sign in front of the parenthesis. Start the group fresh. On `)`, finish the group and fold it back: `outer + groupSign * groupResult`. This is the same "save the enclosing level, start a new one, merge on close" pattern as Decode String in [[a5-stack]] and Score of Parentheses above.

```java title="Calc1.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class Calc1 {
    /** Evaluates + and - with parentheses, spaces and unary minus, e.g. "-(2 + 3) - (1 - (4 - 6))". */
    static int calculate(String s) {
        Deque<Integer> saved = new ArrayDeque<>();     // pairs: result so far, sign before '('
        int result = 0, sign = 1, num = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+' || c == '-') {
                result += sign * num;                  // finish the previous number
                num = 0;
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                saved.push(result);                    // remember the outer level...
                saved.push(sign);                      // ...and the sign applied to this group
                result = 0;
                sign = 1;
            } else if (c == ')') {
                result += sign * num;                  // finish the group's last number
                num = 0;
                int groupSign = saved.pop();
                int outer = saved.pop();
                result = outer + groupSign * result;   // fold the group into the outer level
            }                                          // spaces fall through
        }
        return result + sign * num;
    }

    public static void main(String[] args) {
        System.out.println(calculate("1 + 1"));
        System.out.println(calculate(" 2-1 + 2 "));
        System.out.println(calculate("(1+(4+5+2)-3)+(6+8)"));
        System.out.println(calculate("-(2 + 3) - (1 - (4 - 6))"));
    }
}
```

```output
2
3
23
-8
```

Unary minus needs no special case here. In `"-(2 + 3)"`, the leading `-` adds `sign * num = 0` to the result and sets `sign = -1`; the `(` then saves that `-1` as the group's sign, and the group's 5 is folded in as −5. The pushes and pops come in pairs (result, then sign), so they must be popped in the reverse order. Time O(n); the stack depth equals the nesting depth.

### Infix to postfix: the shunting-yard algorithm

The two calculators above exploit special cases. The general method for any set of binary operators with precedence, associativity and parentheses is Edsger Dijkstra's **shunting-yard algorithm**. It reads infix tokens and produces postfix, using a stack of operators that are waiting for their right operand to be complete.

The rules:

1. A **number** goes straight to the output.
2. An **operator** `o` first pops to the output every operator on the stack that must be applied before it — those with *higher* precedence, or *equal* precedence when `o` is left-associative — stopping at a `(`. Then `o` is pushed.
3. A **`(`** is pushed; it acts as a wall that rule 2 cannot pop past.
4. A **`)`** pops operators to the output until the matching `(`, which is discarded.
5. At the end, pop all remaining operators to the output.

Rule 2 is a monotonic-stack discipline: operators on the stack (between walls) have strictly increasing precedence toward the top for left-associative operators, and a new operator pops everything that dominates it — the same idea as in [[a5-monotonic-stack]].

```java title="ShuntingYard.java"
import java.util.*;

public class ShuntingYard {
    static int prec(char op) {
        return switch (op) {
            case '+', '-' -> 1;
            case '*', '/' -> 2;
            case '^' -> 3;
            default -> 0;                              // '(' never wins a precedence contest
        };
    }

    static boolean rightAssoc(char op) { return op == '^'; }

    /** Converts infix with non-negative integers and binary + - * / ^ ( ) to postfix tokens. */
    static List<String> toPostfix(String s) {
        List<String> out = new ArrayList<>();
        Deque<Character> ops = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == ' ') continue;
            if (Character.isDigit(c)) {
                int j = i;
                while (j < s.length() && Character.isDigit(s.charAt(j))) j++;
                out.add(s.substring(i, j));            // numbers go straight to the output
                i = j - 1;
            } else if (c == '(') {
                ops.push(c);
            } else if (c == ')') {
                while (ops.peek() != '(') out.add(String.valueOf(ops.pop()));
                ops.pop();                             // discard the '('
            } else {
                // pop operators that must be applied before c
                while (!ops.isEmpty() && ops.peek() != '('
                        && (prec(ops.peek()) > prec(c)
                            || (prec(ops.peek()) == prec(c) && !rightAssoc(c)))) {
                    out.add(String.valueOf(ops.pop()));
                }
                ops.push(c);
            }
        }
        while (!ops.isEmpty()) out.add(String.valueOf(ops.pop()));
        return out;
    }

    static long evalPostfix(List<String> tokens) {
        Deque<Long> st = new ArrayDeque<>();
        for (String t : tokens) {
            if (Character.isDigit(t.charAt(0))) { st.push(Long.parseLong(t)); continue; }
            long b = st.pop(), a = st.pop();
            st.push(switch (t.charAt(0)) {
                case '+' -> a + b;
                case '-' -> a - b;
                case '*' -> a * b;
                case '/' -> a / b;
                default  -> (long) Math.pow(a, b);
            });
        }
        return st.pop();
    }

    public static void main(String[] args) {
        for (String e : new String[] {"3 + 4 * 2", "(3 + 4) * 2", "10 - 4 - 3", "2 ^ 3 ^ 2", "2 * (3 + 4) - 10 / 5"}) {
            List<String> pf = toPostfix(e);
            System.out.println(e + "  =>  " + String.join(" ", pf) + "  =  " + evalPostfix(pf));
        }
    }
}
```

```output
3 + 4 * 2  =>  3 4 2 * +  =  11
(3 + 4) * 2  =>  3 4 + 2 *  =  14
10 - 4 - 3  =>  10 4 - 3 -  =  3
2 ^ 3 ^ 2  =>  2 3 2 ^ ^  =  512
2 * (3 + 4) - 10 / 5  =>  2 3 4 + * 10 5 / -  =  12
```

Dry run on `2 * (3 + 4) - 10 / 5`:

| Token | Action | Operator stack (bottom → top) | Output so far |
|---|---|---|---|
| `2` | output | | `2` |
| `*` | push | `*` | `2` |
| `(` | push wall | `* (` | `2` |
| `3` | output | `* (` | `2 3` |
| `+` | top is `(`, push | `* ( +` | `2 3` |
| `4` | output | `* ( +` | `2 3 4` |
| `)` | pop to `(` | `*` | `2 3 4 +` |
| `-` | `*` outranks `-`: pop it; push `-` | `-` | `2 3 4 + *` |
| `10` | output | `-` | `2 3 4 + * 10` |
| `/` | `-` does not outrank `/`: push | `- /` | `2 3 4 + * 10` |
| `5` | output | `- /` | `2 3 4 + * 10 5` |
| end | pop all | | `2 3 4 + * 10 5 / -` |

The associativity rule is visible in the outputs. For `10 - 4 - 3`, the second `-` pops the first (equal precedence, left-associative), so the first subtraction happens first. For `2 ^ 3 ^ 2`, the second `^` does *not* pop the first (right-associative), so the later exponent is applied first, giving 512. This version handles only binary operators; supporting unary minus requires recognising a `-` that appears at the start or right after another operator or `(`, and treating it as a separate, higher-precedence operator.

Shunting-yard is O(n): every token is output once and every operator pushed and popped once. You can also evaluate during the conversion — keep a second stack of values and, instead of writing an operator to the output, pop two values and push the result — which is the classic **two-stack calculator**.

### Recursive descent: the grammar approach

The other standard technique writes one method per precedence level, following a **grammar**:

```text
expr   := term   (('+' | '-') term)*
term   := factor (('*' | '/') factor)*
factor := number | '(' expr ')' | '-' factor
```

`expr` handles the lowest precedence, so it calls `term` for its operands, which calls `factor`, which handles numbers, parentheses (by calling `expr` again) and unary minus. Precedence emerges from the call structure: a `term` is fully computed before `expr` ever sees the `+` after it.

```java title="Descent.java"
public class Descent {
    private final String s;
    private int pos = 0;

    Descent(String s) { this.s = s.replace(" ", ""); }

    // expr   := term   (('+' | '-') term)*
    // term   := factor (('*' | '/') factor)*
    // factor := number | '(' expr ')' | '-' factor
    long expr() {
        long value = term();
        while (pos < s.length() && (peek() == '+' || peek() == '-')) {
            char op = s.charAt(pos++);
            long rhs = term();
            value = (op == '+') ? value + rhs : value - rhs;   // left to right: left-associative
        }
        return value;
    }

    long term() {
        long value = factor();
        while (pos < s.length() && (peek() == '*' || peek() == '/')) {
            char op = s.charAt(pos++);
            long rhs = factor();
            value = (op == '*') ? value * rhs : value / rhs;
        }
        return value;
    }

    long factor() {
        if (peek() == '-') { pos++; return -factor(); }        // unary minus
        if (peek() == '(') {
            pos++;                                             // consume '('
            long value = expr();
            pos++;                                             // consume ')'
            return value;
        }
        long value = 0;
        while (pos < s.length() && Character.isDigit(peek())) value = value * 10 + (s.charAt(pos++) - '0');
        return value;
    }

    char peek() { return s.charAt(pos); }

    public static void main(String[] args) {
        for (String e : new String[] {"2*(5+5*2)/3+(6/2+8)", "6-4/2", "-(3+4)*2", "1-(-2)"}) {
            System.out.println(e + " = " + new Descent(e).expr());
        }
    }
}
```

```output
2*(5+5*2)/3+(6/2+8) = 21
6-4/2 = 4
-(3+4)*2 = -14
1-(-2) = 3
```

This solves *Basic Calculator III* (all four operators plus parentheses) directly. The stack is still there — it is the **call stack**, with one frame per open parenthesis and precedence level. That means very deeply nested input could overflow it, while the explicit-stack versions keep their state on the heap. Recursive descent is how many real compilers and interpreters parse expressions, because each grammar rule maps to one readable method and error messages are easy to add. The input is assumed valid here; a production parser would check that each `(` is followed by a matching `)` and report an error otherwise.

### Choosing an approach

| Problem shape | Simplest correct approach |
|---|---|
| Postfix tokens (RPN) | One operand stack |
| `+ - * /`, no parentheses | Stack of signed terms (Basic Calculator II) |
| `+ -` with parentheses, unary minus | Running result plus a stack of saved (result, sign) |
| All operators and parentheses | Recursive descent, or shunting-yard with two stacks |
| Precedence table and associativity vary | Shunting-yard, because the table is data |

Common to all of them: integer overflow on long expressions (use `long` when in doubt), Java's truncating division, multi-digit numbers, and spaces.

```quiz
Q: Evaluating the RPN tokens "8 2 -", which code computes the correct result?
- [ ] st.push(st.pop() - st.pop())
- [x] int b = st.pop(); int a = st.pop(); st.push(a - b)
- [ ] int a = st.pop(); int b = st.pop(); st.push(a - b)
- [ ] Subtraction cannot be expressed in RPN
> 8 is pushed first and 2 second, so 2 is on top. The first pop gives the right operand b = 2, the second gives a = 8, and a - b = 6. The other orders compute 2 - 8 = -6.

Q: In shunting-yard, the stack holds "-" and the next token is "-" (left-associative). What happens?
- [ ] The new "-" is pushed on top without popping
- [x] The stacked "-" is popped to the output, then the new "-" is pushed
- [ ] Both are discarded
- [ ] The algorithm reports an error
> Equal precedence with a left-associative operator means the earlier operator must be applied first, so it is popped before the new one is pushed. That makes 10 - 4 - 3 evaluate as (10 - 4) - 3. For a right-associative operator such as ^, the stacked operator would stay.

Q: In Basic Calculator II, why are * and / applied immediately while + and - are pushed as terms?
- [ ] Because * and / are faster
- [x] Multiplication and division bind tighter, so their operands are complete as soon as the next number is read, while a + or - term might still be multiplied by what follows
- [ ] Because Java evaluates left to right
- [ ] It is arbitrary; either way works
> In 3 + 2 * 2, the 2 after + cannot be added yet because the following * claims it. Pushing terms defers addition until the end, and folding * and / into the last term applies them as soon as their right operand is known.
```

## In real systems

**Editors and linters.** Bracket matching, auto-indentation and "missing closing brace" errors in code editors are built on a stack of open brackets, usually with line and column information stored in each entry.

**Markup parsers.** HTML and XML parsers keep a stack of open elements; a closing tag must match the top. HTML parsers in browsers are deliberately forgiving and repair mismatches, which is a far more complex version of the minimum-repair problem.

**Compilers and interpreters.** Parsing expressions is the first stage of every compiler. Hand-written parsers commonly use recursive descent, often combined with **precedence climbing** (a compact variant that handles binary operators by precedence level, closely related to shunting-yard). Stack-based virtual machines, including the Java Virtual Machine, execute arithmetic in postfix order: bytecode pushes operands and an instruction like `iadd` pops two and pushes the sum.

**Spreadsheets and calculators.** Spreadsheet formula engines parse infix formulas into a tree or postfix form once, then re-evaluate them cheaply when cells change. Hewlett-Packard calculators famously exposed RPN directly to users.

## Trade-offs and alternatives

| Technique | Time | Space | Strength | Limitation |
|---|---|---|---|---|
| Counter | O(n) | O(1) | Single bracket type, repair counts | Cannot track order of several types |
| Stack of characters or indices | O(n) | O(n) | Multiple types, positions for removal or lengths | Extra memory |
| Two-pass counters | O(n) | O(1) | Longest valid substring | Only for one bracket type |
| Backtracking | O(output) | O(n) depth | Generating all valid strings | Exponential output |
| Explicit-stack calculator | O(n) | O(n) | No recursion limit | Code grows with each feature |
| Recursive descent | O(n) | O(depth) call stack | Readable, extends to full grammars | Deep nesting can overflow the call stack |

For real languages and file formats, use a parser library or a parser generator rather than hand-rolled stacks. Hand-written stack code is right for small, fixed grammars — calculators, configuration expressions, interview problems.

## Common mistakes

> [!MISTAKE] Reversing operands of - and /
> In postfix evaluation and in the two-stack calculator, the right operand is popped first. `a - b` must use the *second* value popped as `a`. Swapping them gives wrong answers only for non-commutative operators, which is why it often survives simple tests.

**Popping an empty stack.** A closer with no opener, or an operator with fewer than two operands, means invalid input. Check `isEmpty()` and treat it as a result, not a crash.

**Returning `true` without checking leftovers.** `"(("` passes every per-character check; only `st.isEmpty()` at the end catches it.

**Comparing boxed characters with `==`.** `Deque<Character>` holds objects; unbox to `char` or use `equals`.

**Forgetting the last number** in calculator code, because no operator follows it. Trigger the "number complete" step at the end of the string as well.

**Single-digit parsing.** `c - '0'` for one character handles only 0–9; accumulate `num = num * 10 + digit`.

**Wrong division semantics.** Java's `/` truncates toward zero; `Math.floorDiv` rounds down. Read which one the problem wants.

**Treating unary minus as binary.** In `"-(2+3)"` or `"1-(-2)"`, a `-` at the start or after `(` has no left operand. Either treat it as `0 - x` (as Basic Calculator I effectively does) or as a separate unary operator.

## Interview perspective

Interviewers use these problems to test whether you see the nesting structure, choose the minimal state, and handle edge cases without prompting.

> [!INTERVIEW] Talking through a calculator
> "Multiplication binds tighter, so I'll treat the expression as a sum of terms. I keep a stack of signed terms; a + or - starts a new term, and a * or / folds the next number into the last term. At the end I add the stack. Parentheses would add a saved-state stack or recursion; I'll mention that if we need it."

Common questions and the expected insight:

- **Valid Parentheses** — stack with a closer-to-opener map; three failure modes.
- **Minimum Add to Make Parentheses Valid / Minimum Remove to Make Valid Parentheses** — counter for counts, index stack for positions.
- **Longest Valid Parentheses** — index stack with a `-1` base, or two-pass counters for O(1) space.
- **Generate Parentheses** — backtracking with `open < n` and `close < open`; the count is a Catalan number.
- **Valid Parenthesis String** — range of possible open counts `[lo, hi]`.
- **Evaluate Reverse Polish Notation** — operand stack, pop order, truncating division.
- **Basic Calculator I, II, III** — saved state for parentheses, term stack for precedence, recursive descent or shunting-yard for both.
- **Decode String** — save count and outer text on `[`; see [[a5-stack]].
- **Follow-up: how would you support exponentiation?** Add a precedence level and right associativity; show how shunting-yard's pop rule changes.

## Practice

1. **Valid Parentheses**, then extend it to ignore characters inside string literals such as `"(")"`.
2. **Minimum Remove to Make Valid Parentheses** without a boolean array — two passes over a `StringBuilder`.
3. **Longest Valid Parentheses** with both methods; explain why the counter method needs two passes.
4. **Generate Parentheses** for `n = 4`, and verify the count is 14.
5. **Evaluate Reverse Polish Notation** with error handling for malformed input.
6. **Basic Calculator III** with the shunting-yard two-stack method, then with recursive descent; compare the code.
7. **Different Ways to Add Parentheses** — compute every possible result of an expression by splitting at each operator (divide and conquer).

The DSA explorer lists the matching problems under this topic; start with *Valid Parentheses*, *Evaluate Reverse Polish Notation* and *Basic Calculator II*.

## Quick revision {#quick-revision}

- Matching brackets is LIFO: the most recent unmatched opener must close first.
- Validation failure modes: closer on an empty stack, wrong type, leftovers at the end.
- One bracket type → a counter (must never go negative, must end at 0). Several types → a stack.
- Minimum insertions = orphan `)` + unclosed `(`. Minimum removals → stack of indices.
- Longest valid: index stack with `-1` base; length `i - top` after a match; unmatched `)` becomes the new base. O(1)-space: two counter passes.
- Generate: backtrack with `open < n` and `close < open`; count = Catalan number (1, 2, 5, 14, 42).
- Wildcards: track `[lo, hi]` of possible open counts; fail if `hi < 0`; clamp `lo` at 0; valid if `lo == 0`.
- Score of parentheses: one accumulator per open level, merged on close.
- RPN: push numbers; operator pops `b` then `a`, pushes `a op b`. Java `/` truncates toward zero.
- Calculator II: stack of signed terms; `*` and `/` fold into the last term; sum at the end.
- Calculator I: save (result, sign) on `(`; on `)`, `result = outer + sign × group`.
- Shunting-yard: numbers to output; operator pops higher precedence (or equal if left-associative) down to `(`; `)` pops to `(`.
- Recursive descent: `expr → term → factor`; precedence comes from the call structure; uses the call stack.

## Key takeaways {#key-takeaways}

- Any problem where the most recently opened thing must be closed first is a stack problem, and brackets are the purest example.
- Choose the smallest state that captures what the stack would hold: a counter for one bracket type, indices when positions matter, a range when choices are uncertain.
- Generating valid strings is backtracking with constraints that prevent invalid prefixes, and its output size is a Catalan number.
- Expressions add precedence and associativity to nesting; postfix removes both, which is why evaluation and conversion revolve around it.
- Shunting-yard and recursive descent solve general infix evaluation in O(n); the special-case calculators are shortcuts that are faster to write in an interview.
