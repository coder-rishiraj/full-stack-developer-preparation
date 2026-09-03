import type { TopicContent } from '@/domain/types'

type SpringTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'IoC & the Container':
    'who creates objects, who owns lifecycle, and why business code must not call new on collaborators',
  ApplicationContext:
    'the runtime container: metadata, refresh, events, resources, and why getBean() is a last resort',
  'Dependency Injection':
    'constructor vs setter vs field, required vs optional, and how the container chooses a candidate',
  'Beans, Names & Scopes':
    'identity in the registry, singleton thread-safety, and when a new instance is created',
  'Bean Lifecycle':
    'instantiate → inject → init callbacks → ready → destroy, including who owns prototype cleanup',
  'Component Scanning':
    'which packages are searched, which stereotypes register beans, and the default-package trap',
  'Java Configuration':
    '@Bean factory methods, full vs lite mode, composition via @Import, and conditionals',
  'Profiles & Environment':
    'which beans exist per environment without putting Boot YAML mechanics in this section',
  'Wiring Conflicts & Cycles':
    'ambiguous types, constructor cycles, and why Boot 2.6+ fails fast on circular references',
  'Events, Resources & i18n':
    'decoupled notifications, resource loading, and MessageSource — not HTTP request handling',
  'Aspect-Oriented Programming':
    'pointcuts, advice, order, and the fact that Spring AOP intercepts public proxy calls only',
  'Spring Proxies':
    'JDK vs CGLIB, self-invocation, scoped proxies, and why @Transactional can silently no-op',
  'Container Internals':
    'BeanDefinition, factory post-processors, and when proxies wrap a fully initialized target',
  'Testing Spring Core':
    'constructor mocks without a context, then a minimal context only when the container itself is under test',
}

export function createSpringTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: SpringTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'container wiring, bean lifecycle, and proxy-based cross-cutting behavior'
  const parent = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Spring Framework core topic in ${sectionTitle}.${parent} ` +
      `Study it as container behavior — not as Spring Boot auto-configuration or web MVC.`,
    whyExists:
      `${title} exists so application code can stay free of construction and lookup. ` +
      `Interview answers must cover ${focus}.`,
    mentalModel:
      `Name the bean, its scope, its injection points, and whether callers hit a proxy. ` +
      `Then walk startup: metadata → graph resolution → init → ready.`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the IoC container, not in Boot auto-config or MVC.`,
          'State how the bean is registered: stereotype, @Bean method, or import.',
          'State how collaborators are chosen: type, name, @Primary, @Qualifier.',
          'State lifecycle and proxy consequences: init order, destroy, self-invocation.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Spring Core vs Spring Boot',
        text:
          `${title} is Framework behavior. Auto-configuration, application.yml binding, ` +
          'Actuator, and @RestController mapping belong in C6 unless you are only naming the hook.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'ApplicationContext is a BeanFactory plus events, i18n, resources, and AOP integration.',
          'Constructor injection fails fast on missing or circular required dependencies.',
          'Spring Boot 2.6+ rejects circular references by default; refactor before enabling the escape hatch.',
          'AOP advice runs on the proxy; this.method() on the target skips @Transactional, @Async, and custom aspects.',
          'Spring 6 uses the jakarta.* namespace; @PostConstruct/@PreDestroy come from jakarta.annotation.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as solved because the application “starts locally.”`,
      'Field injection that hides missing dependencies until a test NPE.',
      'Self-invocation that makes transactional or async annotations no-ops.',
      'Scanning the default package and accidentally registering the entire classpath.',
    ],
    production: {
      reliability: [
        'Prefer constructor injection and fail at startup over lazy NPEs in production traffic.',
        'Keep singleton beans stateless; request/user state belongs in method args, scoped beans, or stores.',
        'Do not enable allow-circular-references except as a temporary migration flag.',
      ],
      observability: [
        'Startup failures: NoSuchBeanDefinitionException, NoUniqueBeanDefinitionException, BeanCurrentlyInCreationException.',
        'Log the runtime class of injected beans when debugging proxies (CGLIB Enhancer vs JDK $Proxy).',
      ],
      maintainability: [
        'Keep @Configuration focused on infrastructure beans that cannot be stereotyped.',
        'Unit-test services with constructor mocks; reserve a Spring context for wiring and AOP tests.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} inside ${sectionTitle}.`,
        'Prefer constructor injection and explain why field injection is a test smell.',
        'Explain one proxy or lifecycle trap with a concrete annotation example.',
      ],
      commonQuestions: [
        `What problem does ${title} solve in the Spring container?`,
        'BeanFactory vs ApplicationContext?',
        'Why might @Transactional not run?',
      ],
      followUps: [
        'What happens with two beans of the same type?',
        'How do you test this without booting the full application?',
      ],
      misconceptions: [
        `${title} is a Spring Boot-only feature.`,
        'Calling this.foo() still runs aspects on foo().',
      ],
      traps: [
        'Describing XML as the primary configuration story in 2026.',
        'Saying circular constructor dependencies “just work with setters” under Boot 2.6+ without the flag.',
      ],
      strongSignals: [
        'Uses BeanDefinition / BeanPostProcessor vocabulary when asked for internals.',
        'Separates container wiring from Boot auto-configuration.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Register → inject → init → (maybe proxy) → use → destroy.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title} in Spring, and where does it sit in the container?`,
        answerHint: `Place it in ${sectionTitle}; name registration and injection.`,
      },
      {
        level: 'intermediate',
        question: `What failure mode should you mention for ${title}?`,
        answerHint: `Discuss ${focus}, including startup exceptions or proxy skips.`,
      },
      {
        level: 'advanced',
        question: `How would you prove ${title} is working in a test?`,
        answerHint: 'Prefer a constructor unit test, or a sliced context that asserts the proxy/callback.',
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} interview check`,
        back: 'Constructor DI, startup failure, proxy self-invocation, Boot vs Framework.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Constructor DI preferred',
      'Proxy ≠ target (this. skips aspects)',
    ],
  }
}
