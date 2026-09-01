import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Exceptions are objects thrown to signal error or exceptional conditions, propagating up the call stack until caught or terminating the thread. Java divides Throwable into Error (JVM serious), Exception (recoverable), and RuntimeException (unchecked).',
  whyExists:
    'Return codes are easy to ignore; exceptions force explicit handling or declaration. They separate normal control flow from error paths and carry stack traces for debugging — essential in large systems.',
  mentalModel:
    'Throw = "something went wrong here." Stack unwinds, finally blocks run, first matching catch handles it. Unchecked exceptions need not be declared; checked exceptions must be caught or declared in throws.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'throw new IllegalArgumentException("msg") — creates and throws.',
        'try { risky() } catch (Specific e) { recover } finally { cleanup }.',
        'Multi-catch: catch (A | B e) — e effectively final.',
        'try-with-resources auto-closes AutoCloseable — suppresses secondary exceptions.',
        'Method declares throws IOException for checked exceptions not handled.',
      ],
    },
    {
      type: 'table',
      headers: ['Category', 'Extends', 'Must declare?'],
      rows: [
        ['Checked Exception', 'Exception (not Runtime)', 'Yes — catch or throws'],
        ['Unchecked (Runtime)', 'RuntimeException', 'No'],
        ['Error', 'Error', 'No (rarely catch)'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'try-with-resources and suppressed exceptions',
      code: `public String readFirstLine(Path path) throws IOException {
  try (BufferedReader reader = Files.newBufferedReader(path)) {
    return reader.readLine();
  }
  // reader.close() called even if readLine throws
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom unchecked exception with context',
      code: `public class InsufficientFundsException extends RuntimeException {
  private final long accountId;
  private final long attempted;

  public InsufficientFundsException(long accountId, long attempted) {
    super("Account " + accountId + " cannot withdraw " + attempted);
    this.accountId = accountId;
    this.attempted = attempted;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Throwable holds stack trace (StackTraceElement[]), message, cause — fillInStackTrace on creation (costly).',
        'JVM unwinds stack; each frame finally runs before pop.',
        'Suppressed exceptions (J7): secondary throwables from try-with-resources added via addSuppressed.',
        'No checked exceptions in lambdas unless wrapped — pushes toward unchecked in streams.',
        'OutOfMemoryError, StackOverflowError extend Error — generally not caught.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Cannot silently ignore like int error codes',
      'Rich context via message, cause chain',
      'finally/try-with-resources guarantee cleanup',
      'Stack trace pinpoints failure origin',
    ],
    disadvantages: [
      'Checked exceptions clutter signatures; often wrapped in RuntimeException',
      'Exception for control flow is slow (stack trace fill)',
      'Swallowing empty catch blocks hides failures',
      'Deep stack traces in hot paths if throwing frequently',
    ],
    alternatives: [
      'Optional / Result type for expected failures',
      'Validation returning Either or sealed outcome',
      'Error codes in performance-critical inner loops',
    ],
    whenToUse: [
      'Truly exceptional unexpected conditions',
      'Fail-fast on programming errors (IllegalArgumentException)',
      'IO failures requiring caller decision',
    ],
    whenNotToUse: [
      'Expected business outcomes (user not found → Optional)',
      'Control flow in tight loops',
      'Flow control across many layers without recovery plan',
    ],
  },
  failureModes: [
    'catch (Exception e) {} — swallows everything silently.',
    'Throwing checked exception through layers without recovery — wrap or handle early.',
    'Throwable catch catching Error and continuing — JVM may be broken.',
    'Not chaining cause: throw new RuntimeException(e) loses context if message only.',
    'finally return overrides try/catch return — surprising control flow.',
  ],
  interview: {
    expectations: [
      'Checked vs unchecked vs Error',
      'try-catch-finally execution order',
      'try-with-resources and suppressed exceptions',
    ],
    commonQuestions: [
      'Difference between checked and unchecked exceptions?',
      'What is finally block? When does it not run?',
      'Can you have try without catch?',
      'Custom exception best practices?',
    ],
    followUps: [
      'Why are checked exceptions controversial?',
      'Exception vs Error examples?',
    ],
    misconceptions: [
      'All exceptions must be caught (RuntimeException and Error need not be declared)',
      'finally always runs (System.exit, fatal Error, infinite loop may prevent)',
    ],
    traps: ['Using exceptions for normal validation in hot path'],
    strongSignals: [
      'Multi-catch and try-with-resources fluently explained',
      'Cause chaining and custom fields on domain exceptions',
      'When Optional beats exception for expected miss',
    ],
  },
  keyTakeaways: [
    'Checked: must catch or declare; unchecked: RuntimeException subtree.',
    'try-with-resources for AutoCloseable — prefer over manual finally.',
    'Never swallow exceptions; log or rethrow with cause.',
    'Use exceptions for exceptional, not expected, cases.',
    'finally runs before exception propagates (unless JVM exit).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between Error and Exception?',
      answerHint: 'Error: serious JVM/resource failures; Exception: application-level recoverable conditions.',
    },
    {
      level: 'intermediate',
      question: 'Explain try-with-resources.',
      answerHint: 'AutoCloseable closed in reverse order; primary exception preserved; close exceptions suppressed.',
    },
    {
      level: 'advanced',
      question: 'What are suppressed exceptions?',
      answerHint: 'Secondary exceptions from close() stored on primary via addSuppressed; getSuppressed() retrieves.',
    },
  ],
  flashcards: [
    { front: 'Checked exception rule', back: 'Must catch or declare throws (non-Runtime Exception)' },
    { front: 'try-with-resources', back: 'AutoCloseable closed automatically; suppresses close exceptions' },
    { front: 'finally purpose', back: 'Cleanup always attempted before exception propagates or method returns' },
  ],
  quickRevision: [
    'throw unwinds stack to catch',
    'Checked vs unchecked vs Error',
    'try-catch-finally order',
    'try-with-resources for closeables',
    'Chain cause: initCause or ctor',
    'No empty catch blocks',
    'Exceptions not for control flow',
  ],
}
