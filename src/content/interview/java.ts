import { JAVA_INTERVIEW_CONCURRENCY } from './java-concurrency'
import { JAVA_INTERVIEW_CORE } from './java-core'
import { JAVA_INTERVIEW_EXPERIENCED } from './java-experienced'
import { JAVA_INTERVIEW_FRESHERS } from './java-freshers'
import { JAVA_INTERVIEW_JAVA8 } from './java-java8'
import { JAVA_INTERVIEW_JVM } from './java-jvm'
import { JAVA_INTERVIEW_MCQ } from './java-mcq'
import { JAVA_INTERVIEW_NETWORKING } from './java-networking'
import { JAVA_INTERVIEW_SPRING } from './java-spring'
import { JAVA_INTERVIEW_SPRING_BOOT } from './java-spring-boot'
import { JAVA_INTERVIEW_SQL_POSTGRESQL } from './java-sql-postgresql'
import type { ReactInterviewSection } from './types'

export const JAVA_INTERVIEW_SECTIONS: ReactInterviewSection[] = [
  {
    id: 'freshers',
    title: 'Freshers',
    blurb: 'Language, OOP, strings, arrays, exceptions — answers you should give in under two minutes.',
    items: JAVA_INTERVIEW_FRESHERS,
  },
  {
    id: 'core',
    title: 'Collections & language contracts',
    blurb: 'HashMap, sets, iterators, generics, wrappers, I/O — the 2–5 year bread and butter.',
    items: JAVA_INTERVIEW_CORE,
  },
  {
    id: 'experienced',
    title: 'Experienced traps',
    blurb: 'Overload resolution, mutable keys, floating point, records, volatile vs transient.',
    items: JAVA_INTERVIEW_EXPERIENCED,
  },
  {
    id: 'java8',
    title: 'Java 8+',
    blurb: 'Lambdas, streams, Optional, default methods. Spring stays on the backend card.',
    items: JAVA_INTERVIEW_JAVA8,
  },
  {
    id: 'jvm',
    title: 'JVM internals',
    blurb: 'Loading, memory areas, tiered JIT, collectors, failures, and evidence-led diagnostics.',
    items: JAVA_INTERVIEW_JVM,
  },
  {
    id: 'concurrency',
    title: 'Java concurrency',
    blurb: 'Happens-before, locks, executors, CompletableFuture, virtual threads, and Loom-era traps.',
    items: JAVA_INTERVIEW_CONCURRENCY,
  },
  {
    id: 'networking',
    title: 'Networking & web',
    blurb: 'DNS, TCP, TLS, HTTP versions, proxies, caching, realtime protocols, and layered diagnosis.',
    items: JAVA_INTERVIEW_NETWORKING,
  },
  {
    id: 'spring',
    title: 'Spring Core',
    blurb: 'IoC, constructor DI, lifecycle, profiles, circular references, and proxy/AOP traps. Boot MVC stays on the backend round.',
    items: JAVA_INTERVIEW_SPRING,
  },
  {
    id: 'spring-boot',
    title: 'Spring Boot',
    blurb: 'Auto-configuration, externalized configuration, MVC internals, REST boundaries, Actuator, clients, testing, virtual threads, and native images.',
    items: JAVA_INTERVIEW_SPRING_BOOT,
  },
  {
    id: 'sql-postgresql',
    title: 'SQL & PostgreSQL',
    blurb: 'Relational semantics, joins, windows, indexes, plans, MVCC, isolation, JSONB, vacuum, pooling, and recovery.',
    items: JAVA_INTERVIEW_SQL_POSTGRESQL,
  },
  {
    id: 'mcq',
    title: 'MCQ drill',
    blurb: 'Compile vs runtime, monitors, HashSet identity — pick an answer, then reveal why.',
    items: JAVA_INTERVIEW_MCQ,
  },
]
