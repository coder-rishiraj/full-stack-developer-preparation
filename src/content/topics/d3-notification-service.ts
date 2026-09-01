import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Notification Service LLD (in-process / modular monolith scope) routes messages to channels (email, SMS, push) via pluggable providers, templates, and retry — the LLD slice before distributed queues and multi-region HLD.',
  whyExists:
    'Bridges OOD patterns (Strategy, Factory, Observer) with real product needs: decouple business events from delivery mechanics, support multiple channels, and handle provider failures gracefully.',
  mentalModel:
    'NotificationService accepts NotificationRequest (user, templateId, payload, channels). TemplateRenderer fills body. ChannelRouter picks EmailSender/SmsSender/PushSender strategies. DeliveryTracker records status; RetryPolicy handles transient failures.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: sync vs async send, idempotency key, user preferences, priority, batch?',
        'Classes: NotificationService, NotificationRequest, Template, TemplateRenderer, ChannelSender (interface), Email/SMS/Push impl, DeliveryRecord, RetryPolicy, UserPreferenceStore',
        'send(request): filter channels by user prefs → render → dispatch each channel',
        'Async: internal queue/worker (ExecutorService) in LLD scope',
        'Idempotency: dedupe by (userId, templateId, idempotencyKey)',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: '15 min: requirements + class diagram. 10 min: send() pipeline code. 5 min: extend new channel (Slack) via ChannelSender. Mention HLD evolution: Kafka + workers — link to d10-notification-system separately.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class NotificationService {
    -renderers: TemplateRenderer
    -senders: Map~Channel, ChannelSender~
    -prefs: UserPreferenceStore
    -tracker: DeliveryTracker
    +send(NotificationRequest)
  }
  class ChannelSender {
    <<interface>>
    +sendRendered(RenderedNotification): DeliveryResult
  }
  class EmailSender
  class SmsSender
  class PushSender
  ChannelSender <|.. EmailSender
  ChannelSender <|.. SmsSender
  ChannelSender <|.. PushSender
  NotificationService --> ChannelSender`,
    caption: 'Strategy per channel; service orchestrates',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Send pipeline with preferences and retry',
      code: `public void send(NotificationRequest req) {
  Set<Channel> channels = prefs.resolveChannels(req.getUserId(), req.getChannels());
  RenderedNotification body = renderer.render(req.getTemplateId(), req.getPayload());
  for (Channel ch : channels) {
    ChannelSender sender = senders.get(ch);
    executor.submit(() -> {
      DeliveryResult r = retryPolicy.run(() -> sender.sendRendered(body.forChannel(ch)));
      tracker.record(req.getId(), ch, r);
    });
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Template rendering',
      code: `public RenderedNotification render(String templateId, Map<String,Object> data) {
  Template t = templateRepo.find(templateId);
  String subject = substitute(t.getSubject(), data);
  String body = substitute(t.getBody(), data);
  return new RenderedNotification(subject, body);
}`,
    },
    {
      language: 'java',
      caption: 'User channel preferences',
      code: `public Set<Channel> resolveChannels(UserId user, Set<Channel> requested) {
  UserPrefs p = store.get(user);
  return requested.stream().filter(p::allows).collect(toSet());
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Open/Closed for new channels', 'Testable with fake senders', 'Clear separation event vs delivery'],
    disadvantages: ['In-process async loses messages on crash — queue needed at scale', 'Template injection if payload not escaped'],
    alternatives: ['Direct provider calls from each service (coupled)', 'Full HLD with Kafka/SQS'],
    whenToUse: ['LLD interviews', 'Modular monolith notification module'],
    whenNotToUse: ['Billion-notification/day without distributed design'],
  },
  failureModes: [
    'Provider timeout without retry → lost notification',
    'Duplicate send without idempotency key',
    'User opted out but marketing bypasses prefs',
    'Template render failure sends partial content',
  ],
  interview: {
    expectations: ['Channel strategy pattern', 'Async mention', 'User preferences'],
    commonQuestions: ['Design notification service LLD', 'Add push channel?'],
    followUps: ['Rate limit per user?', 'Scheduled notifications?'],
    misconceptions: ['Single EmailService class enough'],
    traps: ['Sync blocking send in HTTP request thread for all channels'],
    strongSignals: ['Idempotency + retry + delivery tracking'],
  },
  keyTakeaways: [
    'ChannelSender strategy per delivery type.',
    'TemplateRenderer separates content from transport.',
    'User prefs filter channels before send.',
    'Async executor for non-blocking; queue at HLD scale.',
    'Track delivery status + retry transient failures.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core LLD classes?', answerHint: 'NotificationService, ChannelSender impls, Template, Request, Tracker.' },
    { level: 'intermediate', question: 'Add Slack channel?', answerHint: 'Implement ChannelSender; register in map; no service change.' },
    { level: 'advanced', question: 'Idempotent send?', answerHint: 'Dedupe store keyed by idempotencyKey before dispatch.' },
  ],
  flashcards: [
    { front: 'ChannelSender', back: 'Strategy interface: email, SMS, push' },
    { front: 'UserPreferenceStore', back: 'Filters channels user opted into' },
    { front: 'LLD vs HLD gap', back: 'LLD in-process; HLD adds Kafka, DLQ, multi-region' },
    { front: 'RetryPolicy', back: 'Retry transient provider errors with backoff' },
  ],
  quickRevision: [
    'Request → render → route',
    'Strategy per channel',
    'Prefs filter',
    'Async executor',
    'Idempotency + tracker',
  ],
}
