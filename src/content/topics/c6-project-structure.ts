import type { TopicContent } from '@/domain/types'

export const projectStructureContent: TopicContent = {
  whatIsIt:
    'Spring Boot project structure is the conventional Maven/Gradle layout plus package-by-layer or package-by-feature organization: src/main/java, src/main/resources, src/test/java, with the main class under the root application package so @SpringBootApplication component scan covers the app.',
  whyExists:
    'Convention over configuration — predictable locations for code, config, tests, and static assets let Boot auto-configure, IDE navigate, and teams onboard fast. Deviating from root package scan breaks bean discovery silently.',
  mentalModel:
    'Boot app = one @SpringBootApplication entry point + layered packages (controller → service → repository). Resources hold application.yml, migrations, static files. Tests mirror main structure. Fat JAR repackages dependencies via spring-boot-maven-plugin.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'src/main/java/com/example/app/Application.java — @SpringBootApplication (scan com.example.app.*).',
        'src/main/resources/application.yml — default config; static/ and templates/ for web assets.',
        'src/test/java — @SpringBootTest, slice tests; test/resources for test-only config.',
        'target/ or build/ — compiled output; never commit.',
        'Optional: multi-module Maven parent for large systems (api, core, infra).',
      ],
    },
    {
      type: 'table',
      headers: ['Package', 'Contains', 'Annotations'],
      rows: [
        ['controller / web', 'REST endpoints', '@RestController'],
        ['service', 'Business logic', '@Service'],
        ['repository', 'Persistence', '@Repository, JpaRepository'],
        ['config', '@Configuration beans', '@Configuration'],
        ['domain / model', 'Entities, value objects', 'JPA @Entity'],
        ['dto', 'API request/response types', 'Records, POJOs'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph main [src/main/java]
    App[@SpringBootApplication]
    Ctrl[controller/]
    Svc[service/]
    Repo[repository/]
    App --> Ctrl --> Svc --> Repo
  end
  subgraph res [src/main/resources]
    Yml[application.yml]
    Mig[db/migration/]
  end`,
    caption: 'Layered packages under root scan package',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Root application class',
      code: `package com.example.orders;

@SpringBootApplication
public class OrdersApplication {
  public static void main(String[] args) {
    SpringApplication.run(OrdersApplication.class, args);
  }
}`,
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Typical Maven tree',
      code: `orders-service/
├── pom.xml
├── src/main/java/com/example/orders/
│   ├── OrdersApplication.java
│   ├── controller/OrderController.java
│   ├── service/OrderService.java
│   ├── repository/OrderRepository.java
│   └── config/SecurityConfig.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/V1__init.sql
└── src/test/java/com/example/orders/...`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan (same package and below).',
        'spring-boot-starter-parent manages dependency versions (BOM).',
        'Executable JAR: nested loader MAIN-Class org.springframework.boot.loader.JarLauncher.',
        'spring.main.sources can override primary config class location.',
        'Package-by-feature alternative: com.example.orders.controller inside feature module.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'IDE and Boot tooling work out of the box',
      'Clear separation of concerns by layer',
      'Standard test layout',
    ],
    disadvantages: [
      'Layer packages grow wide in large monoliths — cross-layer navigation',
      'Root package misplacement breaks scan',
    ],
    alternatives: [
      'Package-by-feature (orders/, users/)',
      'Multi-module split (hexagonal / clean architecture modules)',
    ],
    whenToUse: [
      'Standard Boot microservice or modular monolith',
      'Teams new to Spring',
    ],
    whenNotToUse: [
      'Massive domain — consider modules per bounded context',
    ],
  },
  failureModes: [
    '@SpringBootApplication in com.example but beans in com.other — not scanned.',
    'Putting business logic in controllers — untestable, fat controllers.',
    'application.yml in wrong folder (java/ instead of resources/).',
    'Circular package dependencies across layers.',
    'Committing target/ or .env with secrets.',
  ],
  production: {
    maintainability: [
      'Keep root package shallow; max 3–4 segment base (com.company.product)',
      'Co-locate feature code when service grows past ~20 controllers',
    ],
    reliability: ['Flyway/Liquibase migrations under resources/db/migration'],
  },
  interview: {
    expectations: [
      'Explain src/main/java vs resources',
      'Why @SpringBootApplication package matters for scan',
      'Layered vs feature packaging',
    ],
    commonQuestions: [
      'Standard Spring Boot folder structure?',
      'Where does application.properties go?',
      'What does @SpringBootApplication include?',
    ],
    followUps: [
      'How to scan additional packages?',
      'Multi-module project layout?',
    ],
    misconceptions: [
      'Beans can live anywhere on classpath and auto-register',
      'src/main/java and src/test/java share runtime classpath',
    ],
    traps: ['Placing Application class in subpackage so sibling packages are not scanned'],
    strongSignals: [
      'Mentions component scan scope from @SpringBootApplication',
      'Separates controller/service/repository',
      'Knows resources/ for config and migrations',
    ],
  },
  keyTakeaways: [
    '@SpringBootApplication in root package — scan covers subpackages only.',
    'Layered: controller → service → repository.',
    'Config in src/main/resources/application.yml.',
    'Tests mirror main under src/test/java.',
    'Fat JAR via spring-boot-maven-plugin / bootJar.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where is application.yml located?',
      answerHint: 'src/main/resources/',
    },
    {
      level: 'intermediate',
      question: 'Bean in com.other not found — why?',
      answerHint: 'Outside @ComponentScan base of @SpringBootApplication; move or @ComponentScan.',
    },
    {
      level: 'advanced',
      question: 'Layered vs package-by-feature tradeoff?',
      answerHint: 'Layer = simple navigation by type; feature = cohesion per domain, scales teams.',
    },
  ],
  flashcards: [
    { front: '@SpringBootApplication composes', back: '@Configuration + @EnableAutoConfiguration + @ComponentScan' },
    { front: 'Component scan scope', back: 'Same package as main class and subpackages' },
    { front: 'Migrations location', back: 'src/main/resources/db/migration (Flyway)' },
  ],
  quickRevision: [
    'Root package = scan root',
    'controller/service/repository',
    'resources/ for yml',
    'test/ mirrors main',
    'Fat JAR executable',
    'Flyway in db/migration',
    'No logic in controllers',
  ],
}

export const content = projectStructureContent
