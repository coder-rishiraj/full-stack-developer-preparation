---
problemId: nc-evaluate-reverse-polish-notation
title: Evaluate Reverse Polish Notation
source: neetcode
sourceUrl: https://leetcode.com/problems/evaluate-reverse-polish-notation/
difficulty: medium
patterns: [stack, recursion]
relatedLessons: [a5-stack, a1-recursion, a6-binary-trees, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an arithmetic expression written in Reverse Polish Notation (postfix): every operator comes after its two operands. The tokens are given as an array of strings; each token is either one of the operators `+`, `-`, `*`, `/` or an integer. Evaluate the expression and return its value.

Every operator is binary. Division between two integers truncates toward zero.

**Example 1**

- Input: `tokens = ["2","1","+","3","*"]`
- Output: `9`
- Why: this is `((2 + 1) * 3)`. The `+` applies to `2` and `1`, giving 3, and the `*` applies to that 3 and the next `3`.

**Example 2**

- Input: `tokens = ["4","13","5","/","+"]`
- Output: `6`
- Why: this is `(4 + (13 / 5))`. `13 / 5` truncates to 2, and `4 + 2 = 6`.

**Example 3**

- Input: `tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]`
- Output: `22`
- Why: this is `((10 * (6 / ((9 + 3) * -11))) + 17) + 5`. The inner division is `6 / -132`, which truncates toward zero to 0, so the whole product is 0 and the result is `0 + 17 + 5 = 22`.

**What the problem statement guarantees**

- 1 ≤ `tokens.length` ≤ 10^4.
- Each token is an operator (`"+"`, `"-"`, `"*"`, `"/"`) or an integer in the range [−200, 200].
- The input is a valid RPN expression.
- There is no division by zero.
- The answer and all intermediate calculations fit in a 32-bit integer.

## 2. Practice first: try it before reading on

If you haven't solved this, stop here. The method is short; what separates a good answer is getting the operand order, the division rule and the token parsing exactly right. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Evaluate Example 3 on paper first, writing down every intermediate value.
3. Then code it and trace it on `["4","13","5","/","+"]` and on `["3","-4","-"]`.

> [!HINT] Hint 1: a small nudge
> When you reach an operator, which two values does it apply to? Look at Example 1: after `+` is done, its result becomes an operand for something later.

> [!HINT] Hint 2: the kind of tool you need
> The operands of an operator are always the two most recent values that haven't been used yet, and its result becomes the newest unused value. What structure gives you "the most recent unused values"?

> [!HINT] Hint 3: almost the whole plan
> Keep a last-in, first-out collection of values. A number is pushed. An operator pops the right operand first, then the left one, computes left-operator-right, and pushes the result. At the end exactly one value is left. Which operators care which operand is left? And how will you tell the token `"-"` from the token `"-11"`?

**Check yourself before revealing the walkthrough**

- [ ] My code returns 6 on Example 2 and 22 on Example 3
- [ ] `["3","-4","-"]` returns 7
- [ ] I know which way my language's integer division rounds for negative operands
- [ ] I don't treat every token starting with `-` as an operator

## 3. Interview script: understand the problem (≈3 min)

**Me:** So the tokens are postfix: each operator applies to the two operands right before it, where an operand can itself be the result of an earlier operator. I return the single final value.

**Interviewer:** Yes.

**Me:** Two operators aren't symmetric. For `a b -` I want `a − b`: the first operand pushed is the left side. Same for division. Division truncates toward zero, so `6 / -132` is 0, not −1. Java's integer `/` is defined to truncate toward zero, so that matches; in a language whose integer division floors, like Python's `//`, I'd have to adjust.

**Interviewer:** Good.

**Me:** Numbers can be negative, like `"-11"`. So a token that is exactly `"-"` is the operator, and anything longer that starts with a minus is a number. The expression is guaranteed valid, there's no division by zero, and every intermediate value fits in an `int`, so I don't need error handling or `long`.

**Interviewer:** That's right.

**Me:** Let me do Example 2 by hand: 4, 13, 5, then `/` takes 13 and 5, gives 2; then `+` takes 4 and 2, gives 6.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^4 tokens | O(n) is the target; O(n²) is up to about 10^8 simple steps, which would still run but is not necessary. A valid expression with n tokens has (n + 1)/2 numbers and (n − 1)/2 operators, so n is odd and the nesting can be up to about 5000 deep. |
| Integers in [−200, 200] | Every number token has at most 4 characters, so parsing one is constant time. Negative numbers exist, so a leading `-` does not mean "operator". |
| Valid RPN | Every operator finds two operands, and exactly one value remains at the end. No error checks needed. |
| No division by zero | `/` never throws `ArithmeticException`. |
| Answer and all intermediate calculations fit in 32 bits | `int` arithmetic is exact. In particular the one `int` division that overflows, `Integer.MIN_VALUE / -1`, cannot occur, because its true result 2^31 does not fit. |
| Division truncates toward zero | Java's `/` on `int` truncates toward zero (Java Language Specification, §15.17.2), so `a / b` is exactly what the problem asks for. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| For `a b -` and `a b /`, `a` is the left operand | When popping, the first value popped is the right operand. |

### My assumptions

None beyond the statement: the guarantees cover validity, division by zero and overflow.

### Edge cases I will keep in mind

- A single number, `["42"]` or `["-200"]`: the answer is that number.
- Negative number tokens next to the `-` operator, such as `["3","-4","-"]` = 7.
- Division with a negative result, which must truncate toward zero: `["-7","2","/"]` = −3, not −4.
- Long chains at the largest size: all numbers first then all operators, or alternating number and operator.

## 4. Think out loud: from first idea to best solution

### Approach 1: Repeatedly reduce the first operator

#### What I say out loud

> "The most literal way: find the first operator in the list. Everything before it is a plain number, because there's no earlier operator, so its two operands are the two tokens just before it. Replace those three tokens with the result, and repeat until one token is left. Each reduction rescans from the start and shifts the list, so this is O(n²)."

#### Intuition

The first operator in a postfix expression always has two plain numbers right before it. Replacing `a b op` with its value gives a shorter valid postfix expression with the same value.

#### Algorithm

1. Copy the tokens into a list.
2. While the list has more than one token:
   1. Find the smallest index `i` holding an operator.
   2. Compute `list[i − 2] op list[i − 1]`.
   3. Put the result at `i − 2` and remove indices `i` and `i − 1`.
3. Parse and return the single remaining token.

#### Why it is correct

The tokens before the first operator are all numbers, and in a valid expression an operator's operands are the two complete sub-expressions right before it; here those sub-expressions are single numbers. Replacing them and the operator with their value does not change the value of the whole expression, and the list is still valid postfix, one operator and one number shorter. After (n − 1)/2 reductions one number is left, which is the value.

#### Dry run

`tokens = ["4","13","5","/","+"]`

| List | First operator | Reduction |
|---|---|---|
| `4 13 5 / +` | `/` at index 3 | 13 / 5 = 2 |
| `4 2 +` | `+` at index 2 | 4 + 2 = 6 |
| `6` | none | return 6 |

#### Java code

```java title="Approach 1: reduce the first operator, repeatedly"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int evalRPN(String[] tokens) {
        List<String> list = new ArrayList<>(Arrays.asList(tokens));
        while (list.size() > 1) {
            int i = 0;
            while (!isOperator(list.get(i))) {
                i++;
            }
            int a = Integer.parseInt(list.get(i - 2));
            int b = Integer.parseInt(list.get(i - 1));
            list.set(i - 2, Integer.toString(apply(list.get(i), a, b)));
            list.remove(i);
            list.remove(i - 1);
        }
        return Integer.parseInt(list.get(0));
    }

    private static boolean isOperator(String t) {
        return t.length() == 1 && "+-*/".indexOf(t.charAt(0)) >= 0;
    }

    private static int apply(String op, int a, int b) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            default: return a / b;
        }
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is `tokens.length`. There are (n − 1)/2 reductions. Each one scans from the start to the first operator and removes two elements from an `ArrayList`, which shifts everything after them; both are O(n) in the worst case. For example, with all numbers first and all operators last, every scan walks over the remaining numbers. Intermediate results have at most 11 characters, so parsing and printing them is constant time.

#### Space complexity

**O(n) auxiliary space** for the copied list.

#### The bridge to the next approach

> "Each reduction rescans the same prefix of numbers, and the only thing that changed in it is its last entry, the result I just wrote. If instead of restarting I keep going from where I was, then the 'numbers before the current position' only ever grow at the end or lose their last two entries. That's a stack: push numbers, and an operator pops two and pushes one. One pass, no shifting."

### Approach 2: Stack of values (recommended)

#### What I say out loud

> "Walk the tokens once with a stack of ints. A number gets pushed. An operator pops `b`, the right operand, then `a`, the left one, and pushes `a op b`. The order matters for minus and divide. When the tokens run out, the stack holds exactly one value, the answer."

> "For parsing I'll `switch` on the whole token: the cases are exactly `"+"`, `"-"`, `"*"` and `"/"`, and everything else, including `"-11"`, goes to `parseInt`."

#### Intuition

In postfix order, an operator's two operands are the values of the two most recent complete sub-expressions that haven't been consumed yet. A stack holds exactly those unconsumed values, newest on top, and replacing the top two by their combination is the same reduction Approach 1 performs, done at the moment the operator is read. See [[a5-stack|Stack]].

#### Algorithm

1. Create an empty stack of ints.
2. For each token `t`:
   - If `t` is one of the four operators: `b = pop()`, `a = pop()`, push `a t b`.
   - Otherwise push `Integer.parseInt(t)`.
3. Return `pop()`.

#### Why it is correct

**The invariant:** after reading any prefix of the tokens, the stack holds, bottom to top, the values of the complete sub-expressions that the prefix splits into, in order.

- A number is a complete sub-expression on its own, so pushing it keeps the invariant.
- In postfix, an operator combines the two sub-expressions immediately before it into one. Those are the top two entries; the top is the later one, which is the right operand. Popping `b` then `a` and pushing `a op b` replaces two sub-expressions with their combination, keeping the invariant.
- A valid expression is one complete sub-expression in total, so at the end the stack holds one value: the answer. Validity also guarantees that every operator finds two values to pop.

**The 20-second version to say to the interviewer:**

> "The stack always holds the values of the finished sub-expressions so far. A number is one; an operator merges the last two into one, and since the top is the later operand, I pop the right side first. A valid expression leaves exactly one value. One pass, O(n) time, O(n) space."

#### Dry run

`tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]` (stack shown bottom to top)

| Token | Action | Stack after |
|---|---|---|
| `10` | push | 10 |
| `6` | push | 10 6 |
| `9` | push | 10 6 9 |
| `3` | push | 10 6 9 3 |
| `+` | b = 3, a = 9, push 12 | 10 6 12 |
| `-11` | push (a number, not the operator) | 10 6 12 −11 |
| `*` | b = −11, a = 12, push −132 | 10 6 −132 |
| `/` | b = −132, a = 6, push 6 / −132 = 0 (truncated toward zero) | 10 0 |
| `*` | b = 0, a = 10, push 0 | 0 |
| `17` | push | 0 17 |
| `+` | push 17 | 17 |
| `5` | push | 17 5 |
| `+` | push 22 | 22 |
| end | pop | return 22 |

#### Java code

```java title="Approach 2: stack of values (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            switch (t) {
                case "+": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a + b);
                    break;
                }
                case "-": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a - b);
                    break;
                }
                case "*": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a * b);
                    break;
                }
                case "/": {
                    int b = stack.pop(), a = stack.pop();
                    stack.push(a / b);
                    break;
                }
                default:
                    stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}
```

#### Time complexity

**O(n) in every case.** One pass over n tokens; each does constant work: at most two pops and one push (amortised constant time for `ArrayDeque`), and parsing a token of at most 4 characters.

#### Space complexity

**O(n) auxiliary space in the worst case.** The stack holds at most (n + 1)/2 values, reached when all numbers come before all operators.

### Alternative: Recursive evaluation from the end

The last token is the root of the expression. If it is a number, that is the value. If it is an operator, the tokens just before it hold its two operands' sub-expressions, and reading backwards from the operator you meet the right operand's sub-expression first, then the left one's. So a recursive `eval()` that consumes tokens from the end evaluates the right operand, then the left, and combines them.

```java title="Alternative: recursive evaluation from the last token"
class Solution {
    private String[] tokens;
    private int pos;

    public int evalRPN(String[] tokens) {
        this.tokens = tokens;
        this.pos = tokens.length - 1;
        return eval();
    }

    private int eval() {
        String t = tokens[pos--];
        if (t.length() > 1 || "+-*/".indexOf(t.charAt(0)) < 0) {
            return Integer.parseInt(t);
        }
        int b = eval();
        int a = eval();
        switch (t) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            default: return a / b;
        }
    }
}
```

On Example 2, `eval()` reads `+`, then evaluates its right operand: reads `/`, which reads `5` (right) and `13` (left) and returns 2; then the left operand of `+` reads `4`. The result is 4 + 2 = 6.

It is O(n) time, and its O(n) space is the call stack, up to (n + 1)/2 frames deep here (about 5000). That depth ran fine in the tests on this page, but it depends on the thread's stack size, which the JVM configures per platform and per thread, so a deeper input or a smaller stack could throw `StackOverflowError`. It wins when the expression is really a tree you are already walking recursively (for example, when you also want to print it in infix), and it makes the structure of postfix explicit. For plain evaluation, the iterative stack is safer.

## 5. Comparison table

n = `tokens.length`. Nothing hashed or randomised, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Reduce the first operator repeatedly | O(n²) | O(n²) | O(n) |
| 2. Stack of values | O(n) | O(n) | O(n) |
| Alternative: recursion from the end | O(n) | O(n) | O(n) call stack |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Repeated reduction | Follows the definition of postfix directly | Quadratic; string round trips for intermediate values | Only as the spoken starting point |
| 2. Stack | One pass, simple, no recursion | Operand order must be handled with care | The answer to give |
| Recursion from the end | Shows the expression tree; easy to extend to printing or other tree operations | Recursion depth up to about n/2 risks `StackOverflowError` on deeper inputs | When the expression is treated as a tree anyway |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Mention Approach 1 as the idea it comes from if you want to show the derivation, and the recursive version if asked about trees.

**Is it optimal?** Yes. In the worst case a correct algorithm must read every token: changing any single number token changes the value of, for instance, an expression made only of `+` operators. That is an Ω(n) worst-case lower bound. Some memory proportional to n is also needed in the worst case for this left-to-right method, since with all numbers before all operators every number must be kept until the operators arrive.

**When to stop:** after the stack version is coded and traced on Example 3, which exercises a negative number token and truncating division.

## 7. Interview script: code it and test it

### What I say while coding

> "`switch` on the whole string: Java matches string cases with `equals`, and `"-11"` falls to the default, so negative numbers parse correctly."

> "In every operator case I pop `b` first, then `a`, and compute `a op b`. I keep the same order for `+` and `*` too, so the four cases look alike and I can't mix them up."

> "Java's `/` truncates toward zero, which is exactly the rule in the statement, so no adjustment. And no overflow handling: the statement promises every intermediate value fits in an `int`."

### Testing out loud

**Normal case:** Example 3, as in the dry run: 22, including `6 / -132 = 0`.

**Single number:** `["-200"]`: pushed, popped, returns −200.

**Operand order:** `["3","-4","-"]`: push 3, push −4, then `b = −4`, `a = 3`, push `3 − (−4) = 7`. With the order swapped it would be −7.

**Truncation:** `["-7","2","/"]`: `-7 / 2` is −3 in Java (truncated toward zero); floor division would give −4.

**Largest inputs:** 5000 numbers followed by 4999 operators fills the stack to 5000 and then empties it to one value; alternating `number operator` after the first number keeps the stack at two values or fewer. Both are linear.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 2–3 min | Operand order, truncation toward zero, negative numbers, guarantees |
| Idea | 2 min | Repeated reduction, then the stack |
| Code | 5 min | Approach 2 |
| Trace | 3–4 min | Example 3, `["3","-4","-"]`, a single number |

Most bugs here are in the details, not the idea, so the time should go into the trace. If stuck, evaluate Example 1 on paper and notice that you always combine the two most recent values.

## 9. Interviewer challenges

### About correctness

#### Does Java's `/` give the right answer for negative operands?

**What they are testing:** whether you know your language's division semantics precisely.

**How to reason:** compare the statement's rule with the language rule on a negative case.

**What I say:** "Yes. The Java Language Specification defines integer division to round toward zero, so `-7 / 2` is −3 and `6 / -132` is 0, matching 'truncates toward zero'. Python's `//` floors instead, so it would give −4 and −1. On Example 3, using floor division would turn the answer from 22 into 12."

**Nuance:** Java's `Math.floorDiv` is the floor version if a problem ever asks for that. And the one overflowing case, `Integer.MIN_VALUE / -1`, is ruled out here by the 32-bit guarantee.

#### Why is the first value you pop the right operand?

**What they are testing:** whether you understand the stack's order, not just remember the rule.

**How to reason:** in `a b op`, which operand was pushed last?

**What I say:** "`b` is the later sub-expression, so its value was pushed last and is on top. Popping gives `b` first, then `a`. If I swapped them, Example 2 would compute `5 / 13 = 0` and return 4 instead of 6; Example 3 would return −198 instead of 22."

**Nuance:** `+` and `*` hide the mistake because they're commutative, so a test with only those operators can't catch it.

### About the implementation

#### How do you tell the operator `"-"` from a negative number?

**What they are testing:** careful parsing.

**How to reason:** list what a token can look like.

**What I say:** "The operator is exactly the one-character string `"-"`. A negative number has a minus and at least one digit. So I match whole strings in the `switch`, or check `length() == 1` before looking at the first character. Checking only `charAt(0) == '-'` would treat `"-11"` as subtraction."

**Nuance:** with that bug, Example 3 pops too often and the `ArrayDeque` throws `NoSuchElementException` at the following `/`. The bug survives any test without negative numbers.

## 10. Follow-up questions the interviewer might ask

**"What if the input could be invalid?"**
Check the stack size before each pop (fewer than two values means a missing operand) and that exactly one value remains at the end (more means missing operators). Also check for division by zero. Still O(n).

**"What if you get an ordinary infix expression with parentheses instead?"**
Convert to postfix with the shunting-yard algorithm (an operator stack that respects precedence and parentheses), or evaluate directly with two stacks, one for values and one for operators. O(n) time and space. This is the Basic Calculator family.

**"What if values may overflow 32 bits?"**
Use `long` if the bounds allow, `Math.addExact` and friends to detect overflow, or `BigInteger` for arbitrary size; with `BigInteger`, each operation costs time depending on the number of digits.

**"Can you print the expression in infix with the minimum parentheses?"**
Build the expression tree with the same stack (push nodes instead of values), then print it recursively, adding parentheses only where the child's operator binds more loosely than the parent's, or equally loosely on the right of `-` and `/`. O(n) time.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Assuming integer division floors.** The statement says toward zero; in Java that is the native `/`, while floor division would make Example 3 return 12.
- **Reading postfix as "operator applies to the previous two tokens"** rather than the previous two sub-expression values. In Example 3 the `/` applies to `6` and the value of `(9 + 3) * -11`, not to two adjacent tokens.

### Implementation mistakes

> [!MISTAKE] Popping the operands in the wrong order
> `stack.push(stack.pop() - stack.pop())` computes `b − a`. On Example 2 the swapped order computes `5 / 13 = 0` and returns 4 instead of 6; on Example 3 it returns −198 instead of 22. Pop into `b` first, then `a`, and compute `a op b`.

- **Detecting operators by the first character.** `t.charAt(0) == '-'` treats `"-11"` as subtraction. On Example 3 this pops values the expression doesn't have and throws `NoSuchElementException`; on `["3","-4","+"]` it throws as well.
- **Comparing tokens with `==`.** That compares references; use `equals` or a `switch` on the string.
- **Using `java.util.Stack`.** It works, but it is a synchronized legacy class extending `Vector`; the JDK documentation recommends `Deque` implementations such as `ArrayDeque` for stacks.

## 12. Pattern recognition

**The pattern:** stack evaluation of postfix: values wait on a stack until an operator consumes the most recent ones.

**Signals in the problem statement:**

- "Reverse Polish", "postfix", or operators that appear after their operands.
- Every combining step uses the most recent unconsumed results.

**Related problems in this list:**

- [[nc-baseball-game|Baseball Game]]: `"+"` and `"D"` compute from the most recent scores and push the result, a small version of this.
- [[nc-valid-parentheses|Valid Parentheses]]: a stack of pending openers, matched by the most recent one first.
- [[nc-decode-string|Decode String]]: a stack holds partial results and repeat counts until a closing `]` combines them.
- [[nc-asteroid-collision|Asteroid Collision]]: each new item interacts with the most recent survivors on the stack.
- [[nc-min-stack|Min Stack]]: a stack-based design that keeps extra information with each pushed value.

**Takeaway:** when each step combines the latest unfinished results into a new one, keep those results on a stack: push values, and let each combining step pop its inputs (right operand first) and push its output.

## 13. 60-second revision card

**Key insight:** in postfix, an operator's operands are the two most recent unconsumed values, so a stack evaluates it in one pass.

**Invariant:** the stack holds the values of the complete sub-expressions read so far, in order.

**Complexity:** O(n) time, O(n) auxiliary space (at most (n + 1)/2 values). Ω(n) worst-case lower bound: every number can affect the result.

**Code skeleton:**

```java title="RPN evaluation with an int array as the stack"
class Solution {
    public int evalRPN(String[] tokens) {
        int[] st = new int[tokens.length];
        int top = 0;
        for (String t : tokens) {
            if (t.length() == 1 && "+-*/".indexOf(t.charAt(0)) >= 0) {
                int b = st[--top], a = st[--top];
                char op = t.charAt(0);
                st[top++] = op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : a / b;
            } else {
                st[top++] = Integer.parseInt(t);
            }
        }
        return st[0];
    }
}
```

**Main traps:**

- Pop the right operand first.
- `"-"` is an operator, `"-11"` is a number.
- Java's `/` already truncates toward zero; don't use floor division.

**What to say in one breath:** "Push numbers; on an operator pop b then a and push a op b; one value is left at the end. Java's int division truncates toward zero as required, and the statement guarantees no overflow or division by zero. O(n) time and space."
