import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Logging Framework LLD designs leveled log API (trace/debug/info/warn/error), appenders (console, file), formatters, logger hierarchy with propagation, and thread-safe async output — mirroring SLF4J/Log4j architecture at interview depth.',
  whyExists:
    'Cross-cutting concern every system needs; interview tests extensibility (new appender), performance (async), and configuration without coupling business code to sinks.',
  mentalModel:
    'Logger is facade; LogEvent carries level, message, timestamp, MDC context. Appender chain writes to destinations. LoggerFactory maintains hierarchy (com.app.service inherits com.app). Filter drops events below threshold. AsyncAppender buffers to worker thread.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: sync vs async, log rotation, structured JSON, MDC/correlation id?',
        'Classes: Logger, LoggerFactory, LogLevel, LogEvent, Appender (interface), ConsoleAppender, FileAppender, Formatter, Filter, AsyncAppender',
        'logger.info(msg): if level enabled → build LogEvent → appenders',
        'Hierarchy: child logger inherits parent appenders unless additive=false',
        'Configuration: level per package/logger name',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Draw Logger → Appender → Formatter. Implement log(level, msg) with level check. Add FileAppender with Formatter. Extension: AsyncAppender wrapper decorator. Compare to SLF4J binding pattern.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Logger {
    -name: String
    -level: LogLevel
    -appenders: List~Appender~
    +info(String msg)
    +error(String msg, Throwable t)
  }
  class LogEvent {
    -level: LogLevel
    -message: String
    -timestamp: Instant
    -mdc: Map
  }
  class Appender {
    <<interface>>
    +append(LogEvent)
  }
  class ConsoleAppender
  class FileAppender
  class AsyncAppender {
    -delegate: Appender
    -queue: BlockingQueue
  }
  Appender <|.. ConsoleAppender
  Appender <|.. FileAppender
  AsyncAppender --> Appender
  Logger --> Appender`,
    caption: 'Logger builds events; appenders sink; async wraps delegate',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Logger with level gate and appenders',
      code: `public class Logger {
  private LogLevel level = LogLevel.INFO;
  private final List<Appender> appenders = new ArrayList<>();

  public void log(LogLevel lvl, String msg, Throwable t) {
    if (lvl.ordinal() < level.ordinal()) return;
    LogEvent event = new LogEvent(lvl, msg, Instant.now(), MDC.getCopy(), t);
    for (Appender a : appenders) a.append(event);
  }

  public void info(String msg) { log(LogLevel.INFO, msg, null); }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Formatter + ConsoleAppender',
      code: `public class PatternFormatter implements Formatter {
  public String format(LogEvent e) {
    return String.format("%s [%s] %s - %s",
      e.getTimestamp(), e.getLevel(), e.getLoggerName(), e.getMessage());
  }
}`,
    },
    {
      language: 'java',
      caption: 'AsyncAppender decorator',
      code: `public void append(LogEvent e) {
  queue.offer(e); // worker thread drains to delegate
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Decorator for async/file rotation', 'Hierarchy mirrors package structure', 'Swap appenders via config'],
    disadvantages: ['Async queue may drop on crash unless durable', 'Over-logging hurts performance'],
    alternatives: ['Structured logging direct to stdout for containers', 'OpenTelemetry for traces+logs unified'],
    whenToUse: ['LLD interviews', 'Understanding SLF4J/Log4j internals'],
    whenNotToUse: ['Greenfield — use battle-tested library'],
  },
  failureModes: [
    'Sync file I/O blocks request threads',
    'Unbounded async queue OOM under flood',
    'Logger hierarchy misconfig → duplicate lines',
    'MDC not cleared → context leak across thread pool',
  ],
  interview: {
    expectations: ['Logger/Appender/Formatter split', 'Level filtering', 'Async as decorator'],
    commonQuestions: ['Design logging framework', 'Async logging?'],
    followUps: ['Log rotation?', 'Structured JSON appender?'],
    misconceptions: ['Single LogUtil static class is sufficient design'],
    traps: ['String concat before level check — use lambda/supplier pattern mention'],
    strongSignals: ['MDC/correlation id', 'Hierarchy propagation rules'],
  },
  keyTakeaways: [
    'Logger facade; Appender sinks; Formatter layout.',
    'Level check before building heavy messages.',
    'AsyncAppender = decorator + queue + worker.',
    'Hierarchy inherits appenders from parent.',
    'MDC for request-scoped context.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Logging framework components?', answerHint: 'Logger, LogEvent, Appender, Formatter, Level.' },
    { level: 'intermediate', question: 'Why async appender?', answerHint: 'Decouple app thread from slow I/O; queue to background worker.' },
    { level: 'advanced', question: 'Logger hierarchy?', answerHint: 'Child inherits parent level/appenders; package naming convention.' },
  ],
  flashcards: [
    { front: 'Appender', back: 'Writes LogEvent to console/file/network' },
    { front: 'Level gate', back: 'Skip event if below logger threshold' },
    { front: 'AsyncAppender', back: 'Decorator queues events for worker thread' },
    { front: 'MDC', back: 'Thread-local map for correlation fields in logs' },
  ],
  quickRevision: [
    'Logger → Event → Appender',
    'Formatter patterns',
    'Level hierarchy',
    'Async decorator',
    'MDC context',
  ],
}
