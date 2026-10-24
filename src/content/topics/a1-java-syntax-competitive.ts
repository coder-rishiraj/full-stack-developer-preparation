import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The Java you actually type in a coding contest or a DSA interview: one **class**, a **main** method, a way to read the judge’s text, the right number type, and a way to print the answer. Each step says what the tool is, then why you need it, before the next tool appears.',
  whyExists:
    'Online judges compile one file and send the problem as text on **standard input**. They compare what you print with the expected answer. If **public**, **Scanner**, **tokens**, **overflow**, or output format are fuzzy, you lose time on syntax instead of the algorithm.',
  mentalModel:
    'Every solution is three stages: read text from **stdin**, compute, write text to **stdout**. **Scanner** is the easy reader while you learn. When the input gets huge, **BufferedReader** reads lines and **StringTokenizer** splits a line into tokens. **int** versus **long**, and **println** versus **StringBuilder**, sit beside that same pipeline.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Read this straight through. Do not jump to the fast template at the bottom.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Program shape** and what **public** means.',
        '**stdin / stdout**, and practicing with a file.',
        '**Scanner** and what a **token** is.',
        '**int**, **long**, and overflow.',
        'Why **Scanner** gets slow, then **BufferedReader** and **StringTokenizer**.',
        '**Output**, **static final** modulo, **INF**, and **BigInteger**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — The smallest program, and what public means',
    },
    {
      type: 'list',
      items: [
        'A judge compiles one **public** class whose name matches the file.',
        'For **Main.java** the class must be **Main**.',
        'Running starts at **public static void main(String[] args)**.',
        'Helpers and the solve logic live in that class, usually as **static** methods that **main** calls.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Minimal skeleton. It compiles and prints 42. No input yet.',
      code: `public class Main {
    public static void main(String[] args) {
        // 1) read input
        // 2) compute the answer
        // 3) print the answer
        System.out.println(42);
    }
}`,
    },
    {
      type: 'paragraph',
      text: '**public class Main** is three words:',
    },
    {
      type: 'list',
      items: [
        '**public** — other classes, and the outside world, may use this class. Picture an open door.',
        '**class** — you are declaring a class.',
        '**Main** — the name. It must match the filename.',
        '**private** — the opposite. A locked door. Only that class can use it.',
      ],
    },
    {
      type: 'paragraph',
      text: '**public static void main(String[] args)** is the entry point:',
    },
    {
      type: 'list',
      items: [
        '**public** — the JVM looks for **main** from outside the class. If **main** is not public, the file can still compile, but the JVM will not start your program there.',
        '**static** — Java can call it without creating a **Main** object first.',
        '**void** — the method returns nothing.',
        '**String[] args** — words typed after the program name on the command line. Judges rarely use this. The problem data arrives on **System.in** instead.',
      ],
    },
    {
      type: 'table',
      headers: ['Modifier', 'Who can use it'],
      rows: [
        ['**public**', 'Anywhere'],
        ['**private**', 'Only inside the same class'],
        ['**protected**', 'Same package, and subclasses'],
        ['**(none)**', 'Only classes in the same package'],
      ],
    },

    {
      type: 'heading',
      text: 'Step 2 — Where input and output actually go',
    },
    {
      type: 'list',
      items: [
        '**System.in** is input. The judge writes the problem here. Locally, this is your keyboard.',
        '**System.out** is the answer the judge checks.',
        '**System.err** is for your own debug notes. The judge usually ignores it.',
        'You do **not** open a named file on the judge. You only read and write these streams.',
      ],
    },
    {
      type: 'table',
      headers: ['Stream', 'Job'],
      rows: [
        ['**System.in**', 'Input from the judge, or from your keyboard'],
        ['**System.out**', 'The answer the judge checks'],
        ['**System.err**', 'Notes for you. The judge usually ignores this'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Practice the same way the judge will run you. Put the program below in **Main.java**. It reads two integers and prints their sum.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Main.java — two numbers in, one sum out',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
    },
    {
      type: 'paragraph',
      text: 'In the same folder, create **input.txt**. Put the sample in it, for example **10 20** on one line. Then:',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**javac Main.java** — compiles the file and creates **Main.class**.',
        '**java Main < input.txt** — runs the program and feeds **input.txt** into **System.in**.',
        'Compare the printed line with the sample. **10** and **20** should print **30**.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'What the < sign does',
      text: 'Without **<**, the program waits for you to type. **java Main < input.txt** is input redirection: the file becomes **System.in**. **Scanner** does not care whether the characters came from the keyboard or the file. This works in macOS Terminal, Linux, and Windows Command Prompt. If the logic is right but the spacing or extra text does not match the sample, that is a **formatting error**. The judge still marks it wrong.',
    },

    {
      type: 'heading',
      text: 'Step 3 — Scanner, the reader you should learn first',
    },
    {
      type: 'list',
      items: [
        '**Scanner** is a class in **java.util**.',
        'It reads the next piece of input and converts it to the type you ask for.',
        'You do not open a file yourself. You point it at **System.in**.',
        'Create **one** Scanner and keep using it for the whole program.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Import, then create one Scanner for the whole program',
      code: `import java.util.Scanner;

Scanner sc = new Scanner(System.in);`,
    },
    {
      type: 'table',
      headers: ['Piece', 'Meaning'],
      rows: [
        ['**import java.util.Scanner**', 'Bring the **Scanner** class in from the **java.util** package'],
        ['**Scanner**', 'The class'],
        ['**sc**', 'The name you chose for this object'],
        ['**new**', 'Create an object'],
        ['**System.in**', 'Read from standard input'],
      ],
    },
    {
      type: 'paragraph',
      text: 'Ask for the type you want. **Scanner** skips whitespace and returns the next **token** already converted.',
    },
    {
      type: 'table',
      headers: ['Method', 'Gives you', 'Example token'],
      rows: [
        ['**nextInt()**', '**int**', '25'],
        ['**nextLong()**', '**long**', '9876543210'],
        ['**nextDouble()**', '**double**', '25.75'],
        ['**next()**', 'one word, as a **String**', 'Hello'],
        ['**nextLine()**', 'the rest of the current line', 'Hello World'],
      ],
    },
    {
      type: 'paragraph',
      text: 'A **token** is one chunk separated by whitespace.',
    },
    {
      type: 'list',
      items: [
        'Spaces, tabs, and newlines all count as separators.',
        'If the input is **10 20 30** on one line and **40 50** on the next, five **nextInt()** calls still read 10, 20, 30, 40, 50.',
        '**Scanner** reads **tokens**, not “one number per line.” That is why mixed layouts still work.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'First complete program: read n, then n integers, print their sum',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += sc.nextInt();
        }
        System.out.println(sum);
    }
}`,
    },
    {
      type: 'paragraph',
      text: 'Walk the program with input **5**, then **10 20 30 40 50**:',
    },
    {
      type: 'list',
      items: [
        '**nextInt()** stores **5** in **n**, so the loop runs five times.',
        '**sum** is a **long** because several ints added together can pass the **int** limit.',
        'Each **nextInt()** pulls the next token. The running total is 0, 10, 30, 60, 100, 150.',
        '**println** prints **150**.',
      ],
    },
    {
      type: 'table',
      headers: ['Moment', 'Token read', 'sum'],
      rows: [
        ['start', '—', '0'],
        ['i = 0', '10', '10'],
        ['i = 1', '20', '30'],
        ['i = 2', '30', '60'],
        ['i = 3', '40', '100'],
        ['i = 4', '50', '150'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'One Scanner, and do not close it early',
      text: 'Create a single **Scanner** and keep using it. A new Scanner per number is slow and confusing. **sc.close()** also closes **System.in**. Closing at the very end of **main** is harmless. Closing in the middle makes later reads fail. In contest code you can simply leave it open.',
    },

    {
      type: 'heading',
      text: 'Step 4 — Types, before any faster reader',
    },
    {
      type: 'list',
      items: [
        'Picking the wrong type causes wrong answers that look like algorithm bugs.',
        '**int** is 32-bit: from **-2,147,483,648** to **2,147,483,647**, about **±2.1 billion**.',
        '**long** is 64-bit: about **±9.2 × 10^18**.',
        'If an **int** goes past its max, Java does **not** throw. The value wraps into the negatives. That silent wrap is **integer overflow**.',
      ],
    },
    {
      type: 'table',
      headers: ['Type', 'Size', 'Range you should remember'],
      rows: [
        ['**byte**', '8 bits', '-128 to 127'],
        ['**short**', '16 bits', '-32,768 to 32,767'],
        ['**int**', '32 bits', 'about ±2.1 × 10^9'],
        ['**long**', '64 bits', 'about ±9.2 × 10^18'],
      ],
    },
    {
      type: 'list',
      items: [
        'Use **int** for loop indexes, array lengths, and values the statement says fit in **±2×10^9**.',
        'Use **long** for sums, products, and anything that might reach **10^18**.',
        'A large **long** literal needs an **L** on the end, otherwise Java tries to treat it as an **int** and the code does not compile: **long x = 8000000000L**.',
      ],
    },
    {
      type: 'list',
      items: [
        '**boolean** holds **true** or **false**. Use it for flags.',
        '**char** holds one character in single quotes, such as **\'A\'**.',
        '**String** holds text in double quotes, such as **"hello"**.',
        'An array holds a fixed count of one type. Indexes start at **0**, so **a[0]** is the first element and **a[n - 1]** is the last.',
        '**int[] nums = new int[n]** creates **n** ints, all starting at **0**.',
      ],
    },
    {
      type: 'list',
      items: [
        '**ArrayList<Integer>** grows, which is handy when the length is unknown.',
        'It stores **Integer** objects, not raw ints.',
        'Java converts **int → Integer** automatically. That is **autoboxing**. The reverse is **unboxing**.',
        'Convenient, and a bit slower and heavier. When you know the size, prefer **int[]** or **long[]**.',
      ],
    },
    {
      type: 'table',
      headers: ['', 'int[]', 'ArrayList<Integer>'],
      rows: [
        ['Size', 'Fixed when you create it', 'Grows as you add'],
        ['Stores', 'primitive int', 'Integer objects'],
        ['Speed and memory', 'Leaner', 'Extra object overhead'],
        ['When', 'n is known', 'Length changes, or you need list methods'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Multiply in long before the overflow happens',
      text: '**long result = a * b** is still wrong when **a** and **b** are ints. Java multiplies them as ints first, wraps, then stores that wrapped value in the long. Cast first: **long result = (long) a * b**.',
    },
    {
      type: 'table',
      headers: ['You need', 'Use'],
      rows: [
        ['Array length or loop index', '**int**'],
        ['Ordinary value inside ±2×10^9', '**int**'],
        ['Sum or product that can exceed int', '**long**'],
        ['Yes / no flag', '**boolean**'],
        ['One character', '**char**'],
        ['A word or a line of text', '**String**'],
        ['Fixed list of numbers', '**int[]** or **long[]**'],
        ['List that grows', '**ArrayList**'],
      ],
    },

    {
      type: 'heading',
      text: 'Step 5 — Why Scanner can become too slow',
    },
    {
      type: 'list',
      items: [
        'Your **algorithm** and your **reader** are different costs. A loop that adds **n** numbers is **O(n)** either way.',
        '**nextInt()** does extra work on every call: find the token, skip whitespace, match the text, and parse it.',
        'That overhead is invisible for **100** numbers.',
        'Around **10^5** to **10^6** numbers it can be enough to hit **Time Limit Exceeded**, even when the algorithm is fine.',
        '**Scanner** is not wrong. It is the slower reader. That is the moment to switch.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 6 — BufferedReader reads text in chunks',
    },
    {
      type: 'list',
      items: [
        'Picture reading a book one letter at a time, walking back to the shelf after each letter.',
        'A **buffer** is taking a whole page and reading from the page in your hand.',
        '**BufferedReader** fills an internal array of characters, then serves your program from that array.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'The usual setup. Read it from the inside out.',
      code: `import java.io.*;

BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line = br.readLine();`,
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**System.in** is the raw input. It gives **bytes**, not Java Strings.',
        '**InputStreamReader** turns those bytes into characters. **BufferedReader** only understands characters, so this reader is the bridge.',
        '**BufferedReader** wraps that character reader and adds the buffer. **readLine()** then returns one whole line as a **String**.',
      ],
    },
    {
      type: 'list',
      items: [
        '**readLine()** does not give you an **int**. It gives you the characters. The line **"5"** is still a **String**.',
        '**Integer.parseInt** turns **"5"** into the number **5**.',
        'For a **long**, use **Long.parseLong**. For a decimal, **Double.parseDouble**.',
        '**readLine()** returns **null** when the input is finished. Calling a method on that null throws **NullPointerException**. That crash is common when the input shape is not what you assumed.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'One number on its own line',
      code: `int n = Integer.parseInt(br.readLine().trim());
long x = Long.parseLong(br.readLine().trim());`,
    },
    {
      type: 'list',
      items: [
        '**trim()** removes spaces at the two ends of the line, so a stray space does not break **parseInt**.',
        'If the next line is **"10 20 30 40 50"**, **readLine()** returns that entire **String**.',
        'You still cannot add it. You need something that splits one line into separate tokens. That is the next step.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'throws Exception',
      text: '**readLine()** can throw a checked **IOException**. Java makes you catch it or declare it. Contest code usually writes **main(...) throws Exception** so the method stays short. That is a shortcut for “if reading fails, let the program stop,” which is fine when the judge’s input is well formed.',
    },

    {
      type: 'heading',
      text: 'Step 7 — StringTokenizer splits one String into tokens',
    },
    {
      type: 'list',
      items: [
        'Given **"10 20 30 40 50"**, **StringTokenizer** walks across spaces, tabs, and newlines.',
        'It hands you **"10"**, then **"20"**, and so on.',
        'Each piece is still a **String**. **Integer.parseInt** converts it.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Split one line, then parse',
      code: `import java.util.StringTokenizer;

String line = br.readLine();
StringTokenizer st = new StringTokenizer(line);
int a = Integer.parseInt(st.nextToken());
int b = Integer.parseInt(st.nextToken());`,
    },
    {
      type: 'table',
      headers: ['Method', 'Returns'],
      rows: [
        ['**hasMoreTokens()**', '**true** while another token remains on this line'],
        ['**nextToken()**', 'the next token as a **String**, not as an **int**'],
      ],
    },
    {
      type: 'list',
      items: [
        '**BufferedReader** reads a line quickly.',
        '**StringTokenizer** cuts that line into tokens.',
        '**parseInt** or **parseLong** turns a token into a number.',
        'The program below expects a line with **n**, then one line with **n** integers.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Sum with BufferedReader + StringTokenizer',
      code: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        long sum = 0;
        for (int i = 0; i < n; i++) {
            sum += Integer.parseInt(st.nextToken());
        }
        System.out.println(sum);
    }
}`,
    },
    {
      type: 'list',
      items: [
        '**java.io** brings in **BufferedReader** and **InputStreamReader**. The star on the import means “every class in that package.”',
        '**java.util** brings in **StringTokenizer**, the same way.',
        'With input **5**, then **10 20 30 40 50**, **readLine** plus **parseInt** stores **n = 5**.',
        'The next **readLine** feeds the tokenizer. Each loop takes one token, parses it, and adds it to the **long** sum.',
        '**println** prints **150**.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'This version only tokenizes one line',
      text: 'The program above builds the tokenizer from a single **readLine()**. If the **n** numbers are spread over several lines, **nextToken()** runs out and throws. **Scanner** did not have this problem, because it keeps pulling the next token from the whole stream. The fix is a small helper that reads another line whenever the current tokenizer is empty.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A next() that works no matter how the numbers are split across lines',
      code: `static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
static StringTokenizer st;

static String next() throws Exception {
    while (st == null || !st.hasMoreTokens()) {
        st = new StringTokenizer(br.readLine());
    }
    return st.nextToken();
}

static int nextInt() throws Exception {
    return Integer.parseInt(next());
}`,
    },
    {
      type: 'list',
      items: [
        '**st == null** means “we have not read a line yet.”',
        '**!st.hasMoreTokens()** means “this line is used up.”',
        'Either way, read another line, make a new tokenizer, then return the next token.',
        '**nextInt()** is only **parseInt** on top of that.',
        'This helper assumes the tokens you ask for really exist. A missing line makes **readLine()** return **null**, and the next call crashes. That is acceptable while you practice on valid samples.',
      ],
    },
    {
      type: 'table',
      headers: ['', 'Scanner', 'BufferedReader + StringTokenizer'],
      rows: [
        ['Reads', '**Tokens**, across lines', 'A line, then you split it'],
        ['Gives an int', '**nextInt()** does it', '**parseInt** on a token'],
        ['Gives a long', '**nextLong()**', '**Long.parseLong**'],
        ['A whole line', '**nextLine()**', '**readLine()**'],
        ['Speed', 'Fine for small input', 'The usual choice for large input'],
        ['Code', 'Short', 'A few more lines'],
        ['Use it when', 'Learning, interviews, small **n**', 'About **10^5** numbers or more'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Which reader, in one sentence',
      text: 'Stay on **Scanner** until reading itself is easy. Switch when the statement has huge input, often **10^5** or **10^6** numbers, on Codeforces, CSES, and similar judges. Those cutoffs are rough. A slow algorithm still fails with a fast reader, and a tiny input never needs one.',
    },

    {
      type: 'heading',
      text: 'Step 8 — The nextInt / nextLine trap',
    },
    {
      type: 'list',
      items: [
        'This bug shows up the first time you mix a number and a line of text.',
        '**nextInt()** reads the number and leaves the newline sitting there.',
        'The following **nextLine()** reads “the rest of this line,” which is empty.',
        'You expected the next line of text. You got **""**.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Input is a number, then a line of text. This version stores an empty string.',
      code: `Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
String name = sc.nextLine(); // often ""`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Consume the leftover newline, then read the real line',
      code: `int n = sc.nextInt();
sc.nextLine();
String name = sc.nextLine();`,
    },
    {
      type: 'list',
      items: [
        '**next()** reads one token and stops at whitespace.',
        '**nextLine()** reads through the next newline, including a leftover empty tail.',
        '**nextInt()** is a token reader, not a line reader.',
        'When you only need numbers, stay on **nextInt()** or **nextLong()** and you will not hit this.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — input',
      questions: [
        {
          prompt: 'What does **System.in** represent?',
          options: ['Standard output', 'Standard input', 'An integer variable', 'A file you open by name'],
          answer: 1,
          explanation: '**System.in** is the standard input stream. The judge writes the problem there. **System.out** is the answer.',
        },
        {
          prompt: 'What does **Scanner.nextInt()** return?',
          options: ['A String', 'A long', 'An int', 'An integer array'],
          answer: 2,
          explanation: '**nextInt()** skips whitespace, reads one token, and converts it to an **int**. Use **nextLong()** when you need a **long**.',
        },
        {
          prompt: 'What does **BufferedReader.readLine()** return?',
          options: ['An int', 'A String', 'A char', 'A StringTokenizer'],
          answer: 1,
          explanation: '**readLine()** returns the whole line as a **String**, or **null** at the end of input. **Integer.parseInt** is what turns that text into a number.',
        },
        {
          prompt: 'Why do we wrap **System.in** in an **InputStreamReader** before **BufferedReader**?',
          options: [
            'To convert bytes into characters',
            'To convert a String into an int',
            'To sort the input',
            'To print the output',
          ],
          answer: 0,
          explanation: '**System.in** is bytes. **BufferedReader** reads characters. **InputStreamReader** is the bridge between them.',
        },
        {
          prompt: 'What does **StringTokenizer.nextToken()** return?',
          options: ['An int', 'A long', 'A String', 'A boolean'],
          answer: 2,
          explanation: '**nextToken()** is still text. You call **Integer.parseInt** or **Long.parseLong** yourself.',
        },
        {
          prompt: 'Why can a sum program that tokenizes one **readLine()** fail when the numbers span several lines?',
          options: [
            'BufferedReader cannot read more than one line',
            'It only tokenizes the one line used to create its StringTokenizer',
            'A long cannot store a sum',
            'System.in supports only one line',
          ],
          answer: 1,
          explanation: 'That tokenizer is tied to a single line. When its tokens run out, it does not read the next line. A **next()** helper does.',
        },
      ],
    },

    {
      type: 'heading',
      text: 'Step 9 — Printing',
    },
    {
      type: 'list',
      items: [
        '**System.out.print** writes and stays on the same line.',
        '**println** writes and then moves to the next line.',
        '**printf** writes a format: **%d** is an integer, **%s** is text, **%.2f** is a decimal with two places, **%n** is a newline.',
        'One answer, or a handful of lines, should just use **println**.',
        'Printing inside a loop of about **10^6** iterations can be slow: too many separate output calls.',
        '**StringBuilder** is a scratch pad. **append** adds text. Nothing is printed until you hand the whole pad to **System.out** once.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Print 1..n, one number per line, in one output call',
      code: `StringBuilder sb = new StringBuilder();
for (int i = 1; i <= n; i++) {
    sb.append(i).append('\\n');
}
System.out.print(sb);`,
    },
    {
      type: 'table',
      headers: ['StringBuilder method', 'What it does'],
      rows: [
        ['**append(value)**', 'Adds a number or text to the end'],
        ["**append('\\\\n')**", 'Adds a newline'],
        ['**toString()**', 'The text so far, as a **String**'],
        ['**setLength(0)**', 'Clears it so you can reuse it'],
      ],
    },

    {
      type: 'heading',
      text: 'Step 10 — Keep the three stages separate',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Input** only fills variables.',
        'The **algorithm** only computes.',
        '**Output** only prints the required format.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Mixing **println** through the middle of a calculation makes bugs harder to see. For “read two ints and print their sum,” the stages are **nextInt**, then **a + b**, then one **println**.',
    },
    {
      type: 'heading',
      text: 'Step 11 — static final MOD, and the % operator',
    },
    {
      type: 'paragraph',
      text: 'Contest code writes the modulus as **static final int MOD**. The two words do different jobs. **static** says who owns the variable. **final** says whether it can be assigned again.',
    },
    {
      type: 'heading',
      text: 'static — belongs to the class',
    },
    {
      type: 'paragraph',
      text: 'An ordinary field belongs to one object. A **static** field belongs to the class, and every object shares that one copy.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'age is per student. school is one value for the class.',
      code: `class Student {
    int age;
    static String school = "ABC School";
}`,
    },
    {
      type: 'list',
      items: [
        '**age** belongs to each individual **Student** object. Two students can have different ages.',
        '**school** belongs to the **Student** class. Change it in one place and every student sees the new value, because there is only one copy.',
        'You can read a static variable with the class name: **Student.school**. You do not need to create a **Student** first.',
        '**System.out.println(Student.school);** prints **ABC School**.',
      ],
    },
    {
      type: 'heading',
      text: 'final — cannot be reassigned',
    },
    {
      type: 'paragraph',
      text: 'A **final** variable can be assigned only once. After that, another assignment is a compilation error.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'The second assignment does not compile',
      code: `final int MAX = 100;

MAX = 200; // compilation error`,
    },
    {
      type: 'list',
      items: [
        '**MAX** is 100 for the rest of the program.',
        '**final** does not by itself make the variable shared. Without **static**, each object would still have its own **MAX**, and each of those copies could be set only once.',
      ],
    },
    {
      type: 'heading',
      text: 'static final — a class-level constant',
    },
    {
      type: 'paragraph',
      text: 'Together, the variable is one shared constant. **static** means you use it through the class, with no object. **final** means you cannot change it after initialization.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'MOD is visible from main, and it cannot be overwritten',
      code: `public class Main {
    static final int MOD = 1_000_000_007;

    public static void main(String[] args) {
        System.out.println(MOD); // works

        // MOD = 100; // compilation error
    }
}`,
    },
    {
      type: 'list',
      items: [
        'Problems ask you to print the answer modulo **1_000_000_007**. Writing that number at every **%** is noisy, and a typo in one of the copies is a wrong answer.',
        '**static final int MOD = 1_000_000_007;** names it once. The calculation becomes **(x * y) % MOD**.',
        'The name is easier to read, easier to change if a problem uses a different modulus, and safer because the value cannot be assigned again by accident.',
        'Java constants are written in uppercase: **MOD**, **MAX_SIZE**, **INF**.',
      ],
    },
    {
      type: 'table',
      headers: ['Keyword', 'Meaning'],
      rows: [
        ['**static**', 'Belongs to the class, not to each object'],
        ['**final**', 'Cannot be reassigned'],
        ['**static final**', 'A class-level constant'],
      ],
    },
    {
      type: 'list',
      items: [
        '**a % b** is the remainder of **a** divided by **b**. **10 % 3** is **1**, because 10 = 3×3 + 1. **15 % 5** is **0**.',
        'Problems ask for the answer modulo **1_000_000_007** because the real answer, such as a large factorial or a path count, does not fit in a **long**.',
        'You keep the remainder instead of the full number. You may reduce as you go: **(a + b) % MOD** and **(a * b) % MOD**.',
        'Java’s **%** can be negative. **(-7) % 5** is **-2**. Contest math usually wants a remainder from **0** to **MOD - 1**, which here is **3**.',
        'The repair is **(x % MOD + MOD) % MOD**. The first **%** may be negative, adding **MOD** shifts it up, and the last **%** brings it back into range.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Safe add, subtract, and multiply under MOD = 1_000_000_007',
      code: `static final int MOD = 1_000_000_007;

static int norm(long x) {
    return (int) ((x % MOD + MOD) % MOD);
}

static int mul(int a, int b) {
    return (int) ((long) a * b % MOD);
}`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Modulo does not save a multiply that already overflowed',
      text: 'The **%** happens after the multiplication. If both numbers are still plain ints, **a * b** overflows before the **%**. Cast to **long** first, as in **mul** above. For this common **MOD**, two values already reduced below **MOD** fit in a **long** when multiplied: **(MOD - 1)** squared is about **10^18**, and **long** holds up to about **9×10^18**.',
    },

    {
      type: 'heading',
      text: 'Step 12 — An infinity sentinel',
    },
    {
      type: 'list',
      items: [
        'Shortest-path code starts with distance **0** at the source and “unreachable” everywhere else.',
        'Use a **long** larger than any real distance and still far from **Long.MAX_VALUE**: **long INF = 4_000_000_000_000_000_000L**.',
        'The **L** is required.',
        '**Integer.MAX_VALUE + 1** does not give a bigger int. The max int is **2^31 - 1**. Adding 1 wraps to **Integer.MIN_VALUE**, a large negative.',
        'That sentinel then looks like a tiny distance and breaks the algorithm.',
        'Fill a **long[]** with **INF**, set **dist[start] = 0**, and only relax an edge when **dist[u]** is not **INF**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 13 — Seeing what the program is doing',
    },
    {
      type: 'list',
      items: [
        '**System.out** is the answer. **System.err.println(...)** is a side channel for notes such as “n is 5, sum is 150.”',
        'The judge compares **stdout** with the sample, so **stderr** usually does not cause a wrong answer.',
        'Delete those lines before you submit.',
        '**assert** checks a belief you hold while testing, for example **assert n >= 1**.',
        'Assertions are off unless you run **java -ea Main**. They are for your assumptions during practice, not for rejecting normal input.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 14 — Overflow, once more, on prefix sums',
    },
    {
      type: 'list',
      items: [
        '**2_000_000_000 + 2_000_000_000** is 4 billion. That does not fit in an **int**, so an **int** sum wraps negative.',
        'Store the sum in a **long** even when each value is an **int**. **sum += a[i]** is safe when **sum** is a **long**, because the addition then happens in **long**.',
        'Multiplication still needs an explicit cast, from Step 4: **(long) a * b**.',
        'A prefix sum at index **i** is **a[0] + … + a[i]**.',
        '**100_000** values of **100_000** total **10^10**, past **int**. Use **long[]** for those prefix sums.',
        'The values 10, 20, 30, 40, 50 become the prefix sums 10, 30, 60, 100, 150.',
      ],
    },

    {
      type: 'heading',
      text: 'Step 15 — BigInteger, only when long is not enough',
    },
    {
      type: 'list',
      items: [
        '**100!** is far past 64 bits.',
        '**BigInteger** is an object that grows with the number, limited by memory.',
        'You cannot write **fact * i**. You call methods.',
        '**new BigInteger("123")** or **BigInteger.valueOf(i)** creates one.',
        '**multiply**, **add**, and **subtract** return a new **BigInteger**. They do not change the old one.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: '100! — too big for long',
      code: `import java.math.BigInteger;

BigInteger fact = BigInteger.ONE;
for (int i = 2; i <= 100; i++) {
    fact = fact.multiply(BigInteger.valueOf(i));
}
System.out.println(fact);`,
    },
    {
      type: 'table',
      headers: ['Situation', 'Type'],
      rows: [
        ['Everyday numbers and indexes', '**int**'],
        ['Sums and products that fit in 64 bits', '**long**'],
        ['Answer required modulo 10^9+7', '**long** multiply, then **% MOD**'],
        ['Exact huge factorial or combination, no modulus', '**BigInteger**'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'BigInteger is the slow tool',
      text: 'It is correct for integers that do not fit in a **long**. It is much slower than **int** and **long**. If the problem gives a modulus, stay with **long** and **%**. Do not reach for **BigInteger** just because the statement looks mathematical.',
    },

    {
      type: 'heading',
      text: 'Step 16 — Cheat sheet',
    },
    {
      type: 'paragraph',
      text: 'Keep this table next to you until the choices are automatic.',
    },
    {
      type: 'table',
      headers: ['Job', 'Tool'],
      rows: [
        ['Small input, or you are still learning', '**Scanner**'],
        ['Lots of numbers', '**BufferedReader** + the **next()** helper'],
        ['Turn a token into an int or long', '**Integer.parseInt** / **Long.parseLong**'],
        ['A few output lines', '**System.out.println**'],
        ['Thousands or millions of output lines', '**StringBuilder**, then one print'],
        ['Index, length, small value', '**int**'],
        ['Sum, product, distance', '**long**'],
        ['Contest modulus', '**static final int MOD**, uppercase'],
        ['Unreachable distance', '**long INF** around 4×10^18'],
        ['Debug notes', '**System.err**, then delete them'],
      ],
    },
    {
      type: 'heading',
      text: 'Practice these five before the algorithms',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        '**Scanner:** read two ints and print their sum. Check it with **java Main < input.txt**.',
        '**long sum:** read **n** and **n** ints with **BufferedReader** and **StringTokenizer**. Use **long**.',
        '**Several lines:** the same sum when the numbers are not all on one line, using the **next()** helper.',
        '**Bulk print:** print 1 through **n** with **StringBuilder**.',
        '**BigInteger:** print **100!**.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'What to memorize',
      text: 'Do not memorize every method. Remember which problem each tool solves. **Scanner**, **BufferedReader**, **StringTokenizer**, **StringBuilder**, **int**, **long**, and **overflow** cover almost every starter problem. After those feel ordinary, spend your attention on the algorithm.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — types and output',
      questions: [
        {
          prompt: '**nextInt()** is followed immediately by **nextLine()**. What does **nextLine()** often return?',
          options: ['The next full line of text', 'An empty string', 'The same integer again', 'null'],
          answer: 1,
          explanation: '**nextInt()** leaves the newline. **nextLine()** reads the rest of that line, which is empty. Call **nextLine()** once to discard it, then again for the real text.',
        },
        {
          prompt: '**a** and **b** are ints. You write **long result = a * b**. What happens if the product does not fit in an int?',
          options: [
            'It is safe, because result is a long',
            'The multiply happens as an int first and can overflow',
            'Java throws an exception',
            'Java switches to BigInteger',
          ],
          answer: 1,
          explanation: 'Both operands are **ints**, so the overflow happens before the value is stored. Cast first: **(long) a * b**.',
        },
        {
          prompt: 'What does **static final int MOD** mean?',
          options: [
            'Each object has its own MOD, and main may change it later',
            'MOD belongs to the class, and it cannot be assigned again',
            'static means the value is read from the input',
            'final means MOD is a method',
          ],
          answer: 1,
          explanation:
            '**static** puts one copy on the class, so **main** can use **MOD** with no object. **final** rejects a later **MOD = ...**. Constants are named in uppercase.',
        },
        {
          prompt: 'What does **(-7) % 5** produce in Java, and what do contests usually want?',
          options: [
            '-2, and contests usually want 3',
            '3 automatically',
            'A crash',
            '7',
          ],
          answer: 0,
          explanation: 'Java’s **%** keeps the sign of the left side. Use **(x % MOD + MOD) % MOD** to land in **0 … MOD - 1**.',
        },
        {
          prompt: 'You must print about a million lines. What should you use?',
          options: [
            'System.out.println inside the loop',
            'A new Scanner for each line',
            'A StringBuilder, then one print',
            'System.err.println',
          ],
          answer: 2,
          explanation: '**println** once per line is a lot of output calls. **append** into a **StringBuilder** and print once. **System.err** is for debug notes, not the answer.',
        },
        {
          prompt: 'Why is **Integer.MAX_VALUE + 1** a bad infinity sentinel?',
          options: [
            'It becomes a large negative',
            'It throws ArithmeticException',
            'It is bigger than every long',
            'Judges reject that constant',
          ],
          answer: 0,
          explanation: 'The max **int** plus one wraps to **Integer.MIN_VALUE**. Use a **long** such as **4_000_000_000_000_000_000L**.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  In[stdin] --> Size{How many numbers?}
  Size -->|Small or still learning| Sc[Scanner]
  Size -->|Around 100000 or more| Br[BufferedReader]
  Br --> St[StringTokenizer or next helper]
  Sc --> Algo[Algorithm]
  St --> Algo
  Algo --> Out{How many lines to print?}
  Out -->|A few| Pl[println]
  Out -->|Very many| Sb[StringBuilder then one print]`,
    caption: 'Same three stages, with the reader and printer chosen for the size',
    explanation:
      'Start at **stdin**, the text the judge sends. Small input, or while you are learning, goes through **Scanner**. Huge input goes through **BufferedReader**, then **StringTokenizer** or the **next()** helper. The algorithm should only see numbers and arrays. A short answer uses **println**. A long list of answers is collected in a **StringBuilder** and printed once.',
  },
  example: [
    {
      type: 'heading',
      text: 'One file you can explain line by line',
    },
    {
      type: 'list',
      items: [
        '**next()** refills the tokenizer whenever a line runs out.',
        '“**n**, then **n** integers” works whether they sit on one line or many.',
        '**sum** is a **long**.',
        'There is a single **println** because there is a single answer.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Starter file after you can explain every line',
      code: `import java.io.*;
import java.util.*;

public class Main {
    static final int MOD = 1_000_000_007;
    static final long INF = 4_000_000_000_000_000_000L;

    static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    static StringTokenizer st;

    static String next() throws Exception {
        while (st == null || !st.hasMoreTokens()) {
            st = new StringTokenizer(br.readLine());
        }
        return st.nextToken();
    }

    static int nextInt() throws Exception {
        return Integer.parseInt(next());
    }

    static long nextLong() throws Exception {
        return Long.parseLong(next());
    }

    public static void main(String[] args) throws Exception {
        int n = nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) sum += nextInt();
        System.out.println(sum);
    }
}`,
    },
    {
      type: 'heading',
      text: 'Several test cases',
    },
    {
      type: 'list',
      items: [
        'Many problems start with **t**, the number of test cases.',
        'Read **t**, then repeat the solve steps **t** times.',
        'Reset anything you reuse, such as a list or a distance array, at the start of each case.',
        'If **t** and **n** are both large, build every case’s answer in one **StringBuilder**.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 't independent cases',
      code: `int t = nextInt();
StringBuilder sb = new StringBuilder();
while (t-- > 0) {
    int n = nextInt();
    // solve this case only
    sb.append(n).append('\\n');
}
System.out.print(sb);`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Edges listed as 1-indexed pairs. Store them as 0-indexed.',
      code: `List<int[]> edges = new ArrayList<>();
for (int i = 0; i < m; i++) {
    int u = nextInt() - 1;
    int v = nextInt() - 1;
    edges.add(new int[] { u, v });
}`,
    },
    {
      language: 'java',
      caption: 'Prefix sums in long, so the total cannot wrap',
      code: `long[] pref = new long[n + 1];
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + nextInt();
}`,
    },
  ],
  complexity: {
    notes:
      'Reading is proportional to the total number of characters. Scanner’s extra work per token matters once the input reaches hundreds of thousands of numbers. println inside a huge loop has the same kind of cost on the way out. The algorithm’s Big-O does not include those constant costs, but the time limit does.',
  },
  patternRecognition: [
    'n or m around 10^5–10^6 → fast reader, and an O(n) or O(n log n) idea.',
    '“Print the answer modulo 10^9+7” → long multiply, then (x % MOD + MOD) % MOD.',
    'Nodes numbered from 1 → subtract 1 when you store them in a 0-based array.',
    'First line is t → loop t times and clear reused state each case.',
    'A line of text after a number → with Scanner, eat the leftover newline before nextLine().',
  ],
  commonMistakes: [
    'Pasting BufferedReader before Scanner and tokens make sense.',
    'int for a sum or product, so the value wraps negative and the answer is wrong with no exception.',
    'long result = a * b when a and b are ints. The overflow happens before the assignment.',
    'Building a StringTokenizer on one line, then crashing when numbers continue on the next line.',
    'nextInt() followed immediately by nextLine(), which reads an empty string.',
    'println on every element of a huge output.',
    'Integer.MAX_VALUE + 1 used as “infinity.” It becomes a large negative.',
    'Public class name different from the filename.',
    'Using == to compare Integer objects. Compare ints, or call equals.',
    'readLine() is null at the end of input, and the next call throws.',
  ],
  tradeoffs: {
    advantages: [
      'The standard library already has sorting, maps, deques, and priority queues',
      'Types such as int and long catch a lot of mistakes while you write',
      'One class with main is enough for almost every judge',
    ],
    disadvantages: [
      'More typing than Python for the same idea',
      'Deep recursion can run out of stack. Iterative code or a larger stack is sometimes required',
      'The same algorithm often has a larger constant factor than in C++',
    ],
    alternatives: ['Python when you are only checking an idea', 'C++ when the contest rewards the fastest constants'],
    whenToUse: ['DSA interviews that ask for Java', 'CSES, Codeforces, and similar judges, once this pipeline is comfortable'],
    whenNotToUse: ['An interview that requires another language. Match the language they asked for'],
  },
  failureModes: [
    'Time limit from Scanner, or from println, on large input or output.',
    'Wrong answer from overflow, or from a negative remainder after %.',
    'Crash from a 1-indexed node used as an index, or from reading past the input.',
  ],
  interview: {
    expectations: [
      'Write a class that compiles, with main or the method the interviewer gave you',
      'Choose int or long on purpose, and say why',
      'State time and space after the code works',
      'If constraints are large, say why you would not use Scanner or println in a tight loop',
    ],
    commonQuestions: [
      'Talk through how this program reads input and prints the answer',
      'Why long for the sum, if every element is an int?',
      'When would Scanner be too slow?',
      'What does public mean on the class and on main?',
    ],
    followUps: ['What changes if n is 10^6?', 'The numbers are split across many lines. What breaks in a one-line tokenizer?'],
    misconceptions: [
      'BufferedReader is mandatory even for tiny input',
      'Scanner cannot be correct',
      'A long variable prevents overflow even when both operands of * are ints',
    ],
    traps: ['Off-by-one in a 0-based loop', 'A negative result from %', 'The empty string after nextInt() then nextLine()'],
    strongSignals: [
      'Starts with a clear Scanner solution, then mentions faster I/O only when n is large',
      'Uses long for sums without being asked',
      'Can explain each line of the reader instead of treating it as magic',
    ],
  },
  keyTakeaways: [
    'public class Main and public static void main are the shape the JVM starts.',
    'System.in is the input. System.out is the answer. Practice with java Main < input.txt.',
    'Scanner reads tokens and converts them. Learn it first.',
    'int is about ±2×10^9. long is for sums and products. Cast before you multiply two ints into a long.',
    'BufferedReader reads lines. StringTokenizer splits a line. A next() helper handles numbers spread over many lines.',
    'println is fine for a short answer. StringBuilder batches a huge print.',
    'static final int MOD is one class-level constant. static shares it. final stops a later assignment. Write the name in uppercase.',
    'Java % can be negative. Use (x % MOD + MOD) % MOD.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does public mean on the class, and why is main public?',
      answerHint:
        'public lets the class be used from anywhere. The JVM looks for a public static void main from outside the class, so a non-public main is not the normal entry point.',
    },
    {
      level: 'basic',
      question: 'What is a token, and why can five nextInt() calls read numbers that are not on five separate lines?',
      answerHint:
        'A token is text separated by spaces, tabs, or newlines. Scanner skips all of that whitespace, so line breaks do not matter.',
    },
    {
      level: 'basic',
      question: 'Why is the sum stored in a long when each input value is an int?',
      answerHint:
        'The total can pass about 2.1 billion. An int wraps to a negative value and does not throw. A long has room.',
    },
    {
      level: 'intermediate',
      question: 'What does BufferedReader do, and what does StringTokenizer add?',
      answerHint:
        'BufferedReader reads characters in chunks and returns a line as a String. StringTokenizer splits that String into tokens. parseInt turns a token into an int. InputStreamReader sits in between because System.in is bytes and BufferedReader wants characters.',
    },
    {
      level: 'intermediate',
      question: 'Why does nextInt() followed by nextLine() often produce an empty string, and how do you fix it?',
      answerHint:
        'nextInt leaves the newline. nextLine reads the rest of that line, which is empty. Call nextLine once to discard it, then call nextLine again for the real text.',
    },
    {
      level: 'intermediate',
      question: 'Why is long result = a * b; still able to overflow when a and b are ints?',
      answerHint:
        'The multiplication uses int arithmetic first. Cast one side before multiplying: (long) a * b.',
    },
    {
      level: 'advanced',
      question: 'How do you turn a negative Java remainder into the non-negative residue contests expect?',
      answerHint:
        '(x % MOD + MOD) % MOD. Also multiply in long before applying % , because the modulo does not undo an overflow that already happened.',
    },
  ],
  flashcards: [
    { front: 'Order to learn contest Java', back: 'Skeleton and public → stdin file redirect → Scanner and tokens → int vs long → BufferedReader → StringTokenizer → StringBuilder.' },
    { front: 'What Scanner reads', back: 'The next token, skipping spaces, tabs, and newlines, converted to the type you asked for.' },
    { front: 'BufferedReader vs StringTokenizer', back: 'BufferedReader returns a line as a String. StringTokenizer splits that line. nextToken() is still a String.' },
    { front: 'int range vs long', back: 'int is about ±2.1e9. long is about ±9.2e18. Overflow wraps. It does not throw.' },
    { front: 'Safe int multiply into a long', back: '(long) a * b. Not a * b stored in a long.' },
    { front: 'Non-negative modulo', back: '(x % MOD + MOD) % MOD.' },
    { front: 'nextInt then nextLine', back: 'The first nextLine often returns empty. Eat the leftover newline first.' },
  ],
  quickRevision: [
    'public class name matches the file; main is public static void',
    'System.in in, System.out out, System.err for debug',
    'java Main < input.txt',
    'Scanner for tokens while learning',
    'int ±2e9, long for sums, L on big literals',
    '(long) a * b',
    'BufferedReader reads a line; parseInt converts it',
    'StringTokenizer nextToken, or a next() helper across lines',
    'StringBuilder when printing a lot',
    '(x % MOD + MOD) % MOD',
    'INF is a long, not Integer.MAX_VALUE + 1',
    '0-based arrays; subtract 1 from 1-based input',
  ],
}
