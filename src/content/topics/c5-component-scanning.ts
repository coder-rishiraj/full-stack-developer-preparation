import type { TopicContent } from '@/domain/types'

export const componentScanningContent: TopicContent = {
  whatIsIt:
    'Component scanning auto-detects Spring-managed classes on the classpath via @Component and stereotypes (@Service, @Repository, @Controller) within configured base packages. @SpringBootApplication includes @ComponentScan on its package and subpackages; registers classes as bean definitions without explicit @Bean methods.',
  whyExists:
    'Manual @Bean registration for every class doesn\'t scale. Scanning discovers components at startup, reduces boilerplate, and keeps package structure as module boundaries — convention over configuration in Spring Boot.',
  mentalModel:
    'Boot app in com.example.app — scan com.example.app and below for annotated classes. Each @Service becomes a bean definition. Classes outside package tree invisible unless @Import or @ComponentScan on another package.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan (same package).',
        'ClassPathBeanDefinitionScanner reads @Component metadata.',
        'Filters: @Component, @Service, @Repository, @Controller, @Configuration.',
        'Bean definitions registered; processed on context refresh.',
        'Custom scan: @ComponentScan(basePackages = "com.example.api").',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Scan scope',
      diagram: `flowchart TB
  Boot[@SpringBootApplication com.example.app]
  Boot --> Scan[Scan com.example.app.**]
  Scan --> S1[com.example.app.service OrderService]
  Scan --> S2[com.example.app.web UserController]
  X[com.other.LegacyService] -.->|not scanned| Miss[No bean unless @Import]`,
    },
    {
      type: 'table',
      headers: ['Annotation', 'Purpose'],
      rows: [
        ['@ComponentScan', 'Declare packages/classes to scan'],
        ['@ComponentScan excludeFilters', 'Exclude @Controller for test context'],
        ['@Import', 'Register classes without scan path'],
        ['@SpringBootApplication scanBasePackages', 'Override default package'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Default Boot scanning',
      code: `package com.example.booking;

@SpringBootApplication // scans com.example.booking.*
public class BookingApplication {
  public static void main(String[] args) {
    SpringApplication.run(BookingApplication.class, args);
  }
}

// com.example.booking.service.ReservationService — picked up
// com.example.legacy.OldService — NOT picked up`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit scan packages',
      code: `@SpringBootApplication(scanBasePackages = {
    "com.example.booking",
    "com.example.shared"
})
public class BookingApplication { ... }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ComponentScanAnnotationParser processes @ComponentScan at configuration class parse time.',
        'useDefaultFilters=true includes @Component, @Repository, @Service, @Controller.',
        '@Configuration classes also registered; @Bean methods processed.',
        'Spring Boot auto-configuration separate from component scan (META-INF/spring imports).',
        'Tests: @WebMvcTest scans only web layer + @Import controllers.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Minimal boilerplate — annotate and forget',
      'Package structure documents module boundaries',
      'Easy to add new services in scanned tree',
    ],
    disadvantages: [
      'Bean missing if class outside scan path — silent until injection fails',
      'Over-broad scan slows startup on huge codebases',
      'Harder to see full bean list without actuator/docs',
    ],
    alternatives: [
      'Explicit @Bean methods only (no scan)',
      'Java Module System + selective @Import',
      'Spring Boot auto-config for library modules',
    ],
    whenToUse: [
      'Spring Boot applications standard layout',
      'Multiple services in same root package tree',
    ],
    whenNotToUse: [
      'Library jars needing explicit opt-in (@Import)',
      'Multiple unrelated roots without scanBasePackages config',
    ],
  },
  failureModes: [
    'Main class in wrong package — subpackages not scanned.',
    '@Component on interface ignored (must be concrete class).',
    'Duplicate bean names from same class scanned twice.',
    'Test without @Import — controller not found.',
    'Scanning entities with @Component accidentally — unwanted beans.',
  ],
  interview: {
    expectations: [
      'What @SpringBootApplication scans by default',
      'How fix bean not found (package, annotation)',
      '@ComponentScan vs @Bean',
    ],
    commonQuestions: [
      'How component scanning works?',
      'Why bean not created?',
      '@SpringBootApplication includes what?',
    ],
    followUps: [
      'scanBasePackages use case?',
      'Component scan vs auto-configuration?',
    ],
    misconceptions: [
      'Spring scans entire classpath (only configured packages)',
      '@Repository required for @Entity classes',
      'Moving main class doesn’t affect scan (it does — base package follows main)',
    ],
    traps: ['Placing @SpringBootApplication in default package — bad practice, scan issues'],
    strongSignals: [
      'Package of main class defines default scan root',
      'scanBasePackages for multi-module',
      '@Import for third-party config',
    ],
  },
  keyTakeaways: [
    '@SpringBootApplication enables scan of its package + subpackages.',
    '@Service/@Repository/@Controller are @Component specializations.',
    'Bean missing → check package, annotation, profile.',
    'scanBasePackages or @Import to extend coverage.',
    'Auto-configuration separate from component scan.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What packages does @SpringBootApplication scan?',
      answerHint: 'Package of the application class and all sub-packages.',
    },
    {
      level: 'intermediate',
      question: 'Bean not found at runtime — common causes?',
      answerHint: 'Class outside scan path, missing stereotype, wrong profile, not a concrete class.',
    },
    {
      level: 'advanced',
      question: 'Component scanning vs Spring Boot auto-configuration?',
      answerHint: 'Scan registers your @Component classes; auto-config registers conditional beans from starter JARs via META-INF.',
    },
  ],
  flashcards: [
    { front: '@SpringBootApplication', back: 'Configuration + EnableAutoConfiguration + ComponentScan' },
    { front: 'Default scan root', back: 'Package containing @SpringBootApplication main class' },
    { front: 'scanBasePackages', back: 'Override/extend packages to scan' },
  ],
  quickRevision: [
    'Scan app package + subpackages',
    '@Component stereotypes',
    'scanBasePackages override',
    '@Import non-scanned classes',
    'Main class package matters',
    'Separate from auto-config',
    'Concrete classes only',
  ],
}

export const content = componentScanningContent
