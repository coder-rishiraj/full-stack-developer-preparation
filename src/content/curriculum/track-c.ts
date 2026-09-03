import type { SectionSeed } from './build'
import { TRACK_C_BOOT_SECTIONS } from './track-c-boot'
import { TRACK_C_CONCURRENCY_SECTIONS } from './track-c-concurrency'
import { TRACK_C_JAVA_SECTIONS } from './track-c-java'
import { TRACK_C_JVM_SECTIONS } from './track-c-jvm'
import { TRACK_C_NETWORKING_SECTIONS } from './track-c-networking'
import { TRACK_C_SQL_SECTIONS } from './track-c-sql'
import { TRACK_C_JPA_SECTIONS } from './track-c-jpa'
import { TRACK_C_SECURITY_SECTIONS } from './track-c-security'
import { TRACK_C_REDIS_SECTIONS } from './track-c-redis'
import { TRACK_C_KAFKA_SECTIONS } from './track-c-kafka'
import { TRACK_C_RELIABILITY_SECTIONS } from './track-c-reliability'
import { TRACK_C_TESTING_SECTIONS } from './track-c-testing'
import { TRACK_C_DOCKER_SECTIONS } from './track-c-docker'
import { TRACK_C_AWS_SECTIONS } from './track-c-aws'
import { TRACK_C_OBSERVABILITY_SECTIONS } from './track-c-observability'
import { TRACK_C_SPRING_SECTIONS } from './track-c-spring'

/** Track C — Java & Backend Engineering. C1 Core Java, then JVM through observability. */
export const TRACK_C_SECTIONS: SectionSeed[] = [
  ...TRACK_C_JAVA_SECTIONS,
  ...TRACK_C_JVM_SECTIONS,
  ...TRACK_C_CONCURRENCY_SECTIONS,
  ...TRACK_C_NETWORKING_SECTIONS,
  ...TRACK_C_SPRING_SECTIONS,
  ...TRACK_C_BOOT_SECTIONS,
  ...TRACK_C_SQL_SECTIONS,
  ...TRACK_C_JPA_SECTIONS,
  ...TRACK_C_SECURITY_SECTIONS,
  ...TRACK_C_REDIS_SECTIONS,
  ...TRACK_C_KAFKA_SECTIONS,
  ...TRACK_C_RELIABILITY_SECTIONS,
  ...TRACK_C_TESTING_SECTIONS,
  ...TRACK_C_DOCKER_SECTIONS,
  ...TRACK_C_AWS_SECTIONS,
  ...TRACK_C_OBSERVABILITY_SECTIONS,
]
