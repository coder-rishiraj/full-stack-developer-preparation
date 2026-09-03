import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const SPRING = ['spring'] as const
const M34 = [3, 4]
const M45 = [4, 5]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M34 : M45),
    tags: [...SPRING, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C5.1–C5.14 — Spring Framework core (IoC, DI, lifecycle, AOP).
 * Boot auto-config, MVC, and Actuator stay in C6. Security stays in C9.
 * Persistence/@Transactional depth stays in C8.
 */
export const TRACK_C_SPRING_SECTIONS: SectionSeed[] = [
  section('C5.1', 'IoC & the Container', 65, [
    item('c5-ioc', 'IoC'),
    nest('c5-ioc', 'c5-hollywood-principle', 'Hollywood Principle'),
    nest('c5-ioc', 'c5-ioc-vs-di', 'IoC vs Dependency Injection'),
    nest('c5-ioc', 'c5-ioc-vs-service-locator', 'IoC vs Service Locator'),
    nest('c5-ioc', 'c5-container-metadata', 'XML, Annotations & Java Config Metadata'),
  ]),

  section('C5.2', 'ApplicationContext', 66, [
    item('c5-applicationcontext', 'ApplicationContext'),
    nest('c5-applicationcontext', 'c5-beanfactory-vs-context', 'BeanFactory vs ApplicationContext'),
    nest('c5-applicationcontext', 'c5-context-refresh-close', 'refresh(), start & close'),
    nest('c5-applicationcontext', 'c5-web-application-context', 'WebApplicationContext'),
    nest('c5-applicationcontext', 'c5-getbean-antipattern', 'getBean() as a Service Locator'),
    nest('c5-applicationcontext', 'c5-applicationcontextaware', 'ApplicationContextAware'),
  ]),

  section('C5.3', 'Dependency Injection', 67, [
    item('c5-di', 'Dependency Injection'),
    nest('c5-di', 'c5-constructor-injection', 'Constructor Injection'),
    nest('c5-di', 'c5-setter-injection', 'Setter Injection'),
    nest('c5-di', 'c5-field-injection', 'Field Injection'),
    nest('c5-di', 'c5-autowired-qualifier-primary', '@Autowired, @Qualifier & @Primary'),
    nest('c5-di', 'c5-inject-resource', '@Inject vs @Resource'),
    nest('c5-di', 'c5-object-provider', 'ObjectProvider & Delayed Lookup'),
    nest('c5-di', 'c5-optional-dependencies', 'Optional Dependencies'),
  ]),

  section('C5.4', 'Beans, Names & Scopes', 68, [
    item('c5-beans', 'Beans'),
    nest('c5-beans', 'c5-stereotypes', '@Component, @Service, @Repository, @Controller'),
    nest('c5-beans', 'c5-bean-names-aliases', 'Bean Names & Aliases'),
    nest('c5-beans', 'c5-singleton-scope', 'Singleton Scope & Thread Safety'),
    nest('c5-beans', 'c5-prototype-scope', 'Prototype Scope'),
    nest('c5-beans', 'c5-web-scopes', 'Request, Session & Application Scopes'),
    nest('c5-beans', 'c5-factorybean', 'FactoryBean'),
    nest('c5-beans', 'c5-lazy-beans', '@Lazy Initialization'),
  ]),

  section('C5.5', 'Bean Lifecycle', 69, [
    item('c5-bean-lifecycle', 'Bean Lifecycle'),
    nest('c5-bean-lifecycle', 'c5-instantiate-populate', 'Instantiation & Population'),
    nest('c5-bean-lifecycle', 'c5-postconstruct-predestroy', '@PostConstruct & @PreDestroy'),
    nest('c5-bean-lifecycle', 'c5-initializing-disposable', 'InitializingBean & DisposableBean'),
    nest('c5-bean-lifecycle', 'c5-init-destroy-methods', 'init-method & destroy-method'),
    nest('c5-bean-lifecycle', 'c5-bpp-in-lifecycle', 'BeanPostProcessor in the Lifecycle'),
    nest('c5-bean-lifecycle', 'c5-prototype-destroy', 'Prototype Destroy Ownership'),
    nest('c5-bean-lifecycle', 'c5-smart-lifecycle', 'SmartLifecycle & Phased Start', 'tier2'),
  ]),

  section('C5.6', 'Component Scanning', 70, [
    item('c5-component-scanning', 'Component Scanning'),
    nest('c5-component-scanning', 'c5-base-packages', 'Base Packages & Default-Package Trap'),
    nest('c5-component-scanning', 'c5-scan-filters', 'includeFilters & excludeFilters'),
    nest('c5-component-scanning', 'c5-stereotype-semantics', 'Stereotype Semantics'),
    nest('c5-component-scanning', 'c5-spring-indexed', 'spring.components Index', 'tier2'),
  ]),

  section('C5.7', 'Java Configuration', 71, [
    item('c5-configuration', 'Configuration'),
    nest('c5-configuration', 'c5-bean-methods', '@Bean Factory Methods'),
    nest('c5-configuration', 'c5-full-vs-lite-config', 'Full @Configuration vs Lite @Bean'),
    nest('c5-configuration', 'c5-import-compose', '@Import & @ImportResource'),
    nest('c5-configuration', 'c5-conditional-beans', '@Conditional Bean Registration'),
    nest('c5-configuration', 'c5-xml-configuration', 'XML Configuration (Legacy)', 'tier2'),
  ]),

  section('C5.8', 'Profiles & Environment', 72, [
    item('c5-profiles', 'Profiles'),
    nest('c5-profiles', 'c5-active-profiles', 'Active & Default Profiles'),
    nest('c5-profiles', 'c5-environment-abstraction', 'Environment Abstraction'),
    nest('c5-profiles', 'c5-value-propertysource', '@Value & @PropertySource'),
    nest('c5-profiles', 'c5-spel-injection', 'SpEL in Injection Points', 'tier2'),
  ]),

  section('C5.9', 'Wiring Conflicts & Cycles', 73, [
    item('c5-wiring-conflicts', 'Wiring Conflicts & Circular Dependencies'),
    nest('c5-wiring-conflicts', 'c5-multiple-candidates', 'NoUniqueBeanDefinitionException'),
    nest('c5-wiring-conflicts', 'c5-circular-dependencies', 'Circular Dependencies'),
    nest('c5-wiring-conflicts', 'c5-allow-circular-references', 'allow-circular-references (Boot 2.6+)'),
    nest('c5-wiring-conflicts', 'c5-lookup-method', '@Lookup Method Injection', 'tier2'),
    nest('c5-wiring-conflicts', 'c5-depends-on', '@DependsOn', 'tier2'),
  ]),

  section('C5.10', 'Events, Resources & i18n', 74, [
    item('c5-events-resources', 'Events, Resources & MessageSource'),
    nest('c5-events-resources', 'c5-application-events', 'ApplicationEvent & ApplicationPublisher'),
    nest('c5-events-resources', 'c5-event-listener', '@EventListener & Transactional Events'),
    nest('c5-events-resources', 'c5-resource-loader', 'Resource & ResourceLoader'),
    nest('c5-events-resources', 'c5-messagesource', 'MessageSource & i18n'),
  ]),

  section('C5.11', 'Aspect-Oriented Programming', 75, [
    item('c5-aop', 'AOP', 'tier2'),
    nest('c5-aop', 'c5-join-point-pointcut', 'Join Points & Pointcuts', 'tier2'),
    nest('c5-aop', 'c5-advice-types', 'Before, After, AfterReturning, AfterThrowing', 'tier2'),
    nest('c5-aop', 'c5-around-advice', '@Around & ProceedingJoinPoint', 'tier2'),
    nest('c5-aop', 'c5-aspect-order', 'Aspect @Order', 'tier2'),
    nest('c5-aop', 'c5-spring-aop-vs-aspectj', 'Spring AOP vs AspectJ Weaving', 'tier2'),
    nest('c5-aop', 'c5-transactional-as-aop', '@Transactional as AOP', 'tier2', {
      related: ['c8-transactions'],
    }),
  ]),

  section('C5.12', 'Spring Proxies', 76, [
    item('c5-proxies', 'Spring Proxies', 'tier2', { related: ['d2-proxy'] }),
    nest('c5-proxies', 'c5-jdk-vs-cglib', 'JDK Dynamic Proxy vs CGLIB', 'tier2'),
    nest('c5-proxies', 'c5-self-invocation', 'Self-Invocation Bypass', 'tier2'),
    nest('c5-proxies', 'c5-expose-proxy', 'AopContext.exposeProxy', 'tier2'),
    nest('c5-proxies', 'c5-scoped-proxies', 'Scoped Proxies', 'tier2'),
    nest('c5-proxies', 'c5-proxy-target-class', 'proxy-target-class', 'tier2'),
    nest('c5-proxies', 'c5-final-methods-aop', 'final Classes, Methods & Visibility', 'tier2'),
  ]),

  section('C5.13', 'Container Internals', 77, [
    item('c5-container-internals', 'BeanFactory Internals', 'tier2'),
    nest('c5-container-internals', 'c5-bean-definition', 'BeanDefinition', 'tier2'),
    nest('c5-container-internals', 'c5-beanfactory-post-processor', 'BeanFactoryPostProcessor', 'tier2'),
    nest('c5-container-internals', 'c5-instantiation-aware', 'InstantiationAwareBeanPostProcessor', 'tier2'),
    nest('c5-container-internals', 'c5-configuration-class-postprocessor', 'ConfigurationClassPostProcessor', 'tier2'),
  ]),

  section('C5.14', 'Testing Spring Core', 78, [
    item('c5-spring-core-testing', 'Testing Spring Core'),
    nest('c5-spring-core-testing', 'c5-plain-unit-constructor', 'Plain Unit Tests via Constructor DI'),
    nest('c5-spring-core-testing', 'c5-contextconfiguration', '@ContextConfiguration'),
    nest('c5-spring-core-testing', 'c5-dirties-context', '@DirtiesContext'),
    nest('c5-spring-core-testing', 'c5-mock-beans', '@MockitoBean vs @MockBean'),
  ]),
]
