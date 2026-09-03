import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const DEVOPS = ['devops'] as const
const DOCKER = ['docker'] as const
const M78 = [7, 8]
const M89 = [8, 9]
const M1012 = [10, 12]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, months, ...rest } = extra
  const defaultMonths =
    priority === 'tier1' ? M78 : priority === 'tier2' ? M89 : M1012
  return {
    id,
    title,
    priority,
    months: months ?? defaultMonths,
    tags: [...DEVOPS, ...(tags ?? [])],
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
 * C14.1–C14.16 — Docker / DevOps for 5-year full-stack interview prep.
 * Shape follows DevOps lifecycle maps, Docker tutorial structure (images,
 * Dockerfile, Compose, networking, volumes, registry), orchestration
 * (Kubernetes + ECS), IaC, and DevSecOps — shape only, not copied prose.
 * Deep AWS product mechanics stay in C15; observability tooling depth in C16;
 * application security architecture in C9. Existing C14 topic IDs remain stable
 * (processes/permissions/env-vars nest under Linux).
 */
export const TRACK_C_DOCKER_SECTIONS: SectionSeed[] = [
  section('C14.1', 'DevOps Foundations & Lifecycle', 210, [
    item('c14-devops-foundations', 'DevOps Foundations'),
    nest('c14-devops-foundations', 'c14-what-is-devops', 'What Is DevOps'),
    nest('c14-devops-foundations', 'c14-devops-lifecycle', 'DevOps Lifecycle'),
    nest('c14-devops-foundations', 'c14-devops-vs-traditional-sdlc', 'DevOps vs Traditional SDLC'),
    nest('c14-devops-foundations', 'c14-devops-culture-collaboration', 'Culture, Collaboration & Feedback Loops'),
    nest('c14-devops-foundations', 'c14-devops-automation-workflow', 'Automation, Workflow & Pipelines'),
    nest('c14-devops-foundations', 'c14-devops-evolution-trends', 'Evolution & Future Trends', 'tier2'),
  ]),

  section('C14.2', 'Version Control for Delivery', 211, [
    item('c14-version-control', 'Version Control for Delivery'),
    nest('c14-version-control', 'c14-vcs-systems', 'Version Control Systems'),
    nest('c14-version-control', 'c14-git-merge-strategies', 'Git Merge Strategies'),
    nest('c14-version-control', 'c14-trunk-vs-gitflow', 'Trunk-Based vs GitFlow for CI'),
    nest('c14-version-control', 'c14-choosing-vcs', 'Choosing a VCS', 'tier2'),
  ]),

  section('C14.3', 'Linux Fundamentals for Containers', 212, [
    item('c14-linux', 'Linux Fundamentals', 'tier1', { tags: [...DOCKER] }),
    nest('c14-linux', 'c14-processes', 'Processes', 'tier1', { tags: [...DOCKER] }),
    nest('c14-linux', 'c14-permissions', 'Files & Permissions', 'tier1', { tags: [...DOCKER] }),
    nest('c14-linux', 'c14-env-vars', 'Environment Variables', 'tier1', { tags: [...DOCKER] }),
    nest('c14-linux', 'c14-signals-graceful-stop', 'Signals & Graceful Stop (SIGTERM)'),
    nest('c14-linux', 'c14-shell-debugging', 'Shell Debugging on Hosts & Containers', 'tier2'),
  ]),

  section('C14.4', 'Containers & Docker Architecture', 213, [
    item('c14-containers', 'Containers', 'tier1', { tags: [...DOCKER] }),
    nest('c14-containers', 'c14-what-is-docker', 'What Is Docker', 'tier1', { tags: [...DOCKER] }),
    nest('c14-containers', 'c14-containers-vs-vms', 'Containers vs Virtual Machines', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-containers', 'c14-docker-architecture', 'Docker Architecture (Client, Daemon, Images)', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-containers', 'c14-docker-commands', 'Essential Docker Commands', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-containers', 'c14-docker-for-devops', 'How Docker Fits DevOps & CI/CD', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-containers', 'c14-docker-challenges', 'Common Docker Challenges in Teams', 'tier2', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.5', 'Docker Images & Registries', 214, [
    item('c14-docker-images', 'Docker Images', 'tier1', { tags: [...DOCKER] }),
    nest('c14-docker-images', 'c14-image-layers-cache', 'Image Layers & Build Cache', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-docker-images', 'c14-docker-hub', 'Docker Hub & Public Repositories', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-docker-images', 'c14-private-registries', 'Private Registries (ECR / Harbor)', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-docker-images', 'c14-push-pull-tagging', 'Push, Pull & Semantic Tagging', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-docker-images', 'c14-image-digests', 'Digests vs :latest in Production', 'tier1', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.6', 'Dockerfile & Image Optimization', 215, [
    item('c14-dockerfile', 'Dockerfile', 'tier1', { tags: [...DOCKER] }),
    nest('c14-dockerfile', 'c14-dockerfile-syntax', 'Dockerfile Syntax', 'tier1', { tags: [...DOCKER] }),
    nest('c14-dockerfile', 'c14-dockerignore', '.dockerignore & Build Context', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-dockerfile', 'c14-image-best-practices', 'Image Size & Layer Best Practices', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-dockerfile', 'c14-non-root-user', 'Non-Root USER & Secure Defaults', 'tier1', {
      tags: [...DOCKER],
    }),
    item('c14-multi-stage', 'Multi-stage Builds', 'tier1', { tags: [...DOCKER] }),
    nest('c14-multi-stage', 'c14-builder-vs-runtime', 'Builder Stage vs Runtime Stage', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-multi-stage', 'c14-jib-buildpacks', 'Jib & Buildpacks Alternatives', 'tier2', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.7', 'Docker Compose & Local Stacks', 216, [
    item('c14-compose', 'Docker Compose', 'tier1', { tags: [...DOCKER] }),
    nest('c14-compose', 'c14-compose-services', 'Services, Networks & Volumes in YAML', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-compose', 'c14-compose-depends-health', 'depends_on & Healthchecks', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-compose', 'c14-compose-scaling', 'Scaling Services Locally', 'tier2', {
      tags: [...DOCKER],
    }),
    nest('c14-compose', 'c14-compose-vs-prod', 'Why Compose Is Not Production Orchestration', 'tier1', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.8', 'Docker Networking', 217, [
    item('c14-networking', 'Docker Networking', 'tier1', { tags: [...DOCKER] }),
    nest('c14-networking', 'c14-bridge-network', 'Bridge Network (Default & User-Defined)', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-networking', 'c14-host-overlay-macvlan', 'Host, Overlay & Macvlan Modes', 'tier2', {
      tags: [...DOCKER],
    }),
    nest('c14-networking', 'c14-port-publishing', 'Port Publishing & EXPOSE', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-networking', 'c14-container-dns', 'Service DNS Between Containers', 'tier1', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.9', 'Volumes & Container Storage', 218, [
    item('c14-volumes', 'Volumes', 'tier1', { tags: [...DOCKER] }),
    nest('c14-volumes', 'c14-named-vs-bind', 'Named Volumes vs Bind Mounts', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-volumes', 'c14-sharing-volume-data', 'Sharing Data Between Containers', 'tier1', {
      tags: [...DOCKER],
    }),
    nest('c14-volumes', 'c14-docker-storage-driver', 'Storage Drivers & Data Persistence', 'tier2', {
      tags: [...DOCKER],
    }),
    nest('c14-volumes', 'c14-volume-backup', 'Backup & Volume Lifecycle', 'tier2', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.10', 'CI/CD Concepts & Deployment Automation', 219, [
    item('c14-cicd', 'CI/CD Concepts'),
    nest('c14-cicd', 'c14-ci-vs-cd', 'Continuous Integration vs Delivery vs Deployment'),
    nest('c14-cicd', 'c14-deployment-automation', 'Deployment Automation'),
    nest('c14-cicd', 'c14-immutable-artifacts', 'Immutable Artifacts (Image by Digest)'),
    nest('c14-cicd', 'c14-pipeline-stages', 'Build → Test → Scan → Push → Deploy'),
    nest('c14-cicd', 'c14-docker-in-pipeline', 'Docker as the Build & Test Environment'),
  ]),

  section('C14.11', 'Pipeline Tools: GitHub Actions & Jenkins', 220, [
    item('c14-github-actions', 'GitHub Actions / Jenkins', 'tier2'),
    nest('c14-github-actions', 'c14-actions-workflow', 'GitHub Actions Workflow Basics', 'tier2'),
    nest('c14-github-actions', 'c14-jenkins-pipelines', 'Jenkins Pipeline Overview', 'tier2'),
    nest('c14-github-actions', 'c14-pipeline-secrets', 'CI Secrets & OIDC to Cloud', 'tier2'),
    nest('c14-github-actions', 'c14-pipeline-caching', 'Dependency & Layer Caching in CI', 'tier2'),
  ]),

  section('C14.12', 'Kubernetes Orchestration', 221, [
    item('c14-kubernetes', 'Kubernetes', 'tier2', {
      related: ['c15-eks'],
    }),
    nest('c14-kubernetes', 'c14-k8s-why-orchestration', 'Why Container Orchestration', 'tier2'),
    nest('c14-kubernetes', 'c14-k8s-components', 'Pods, Deployments, Services & Ingress', 'tier2'),
    nest('c14-kubernetes', 'c14-docker-vs-kubernetes', 'Docker vs Kubernetes Responsibilities', 'tier2'),
    nest('c14-kubernetes', 'c14-k8s-rolling-updates', 'Rolling Updates, Probes & Self-Healing', 'tier2'),
    nest('c14-kubernetes', 'c14-k8s-devops-practices', 'DevOps Best Practices on Kubernetes', 'tier2'),
    nest('c14-kubernetes', 'c14-docker-swarm', 'Docker Swarm (Legacy Contrast)', 'tier3', {
      tags: [...DOCKER],
    }),
  ]),

  section('C14.13', 'AWS ECS & Managed Containers', 222, [
    item('c14-ecs', 'AWS ECS for Container Workloads', 'tier2', {
      related: ['c15-ecs'],
      tags: ['aws'],
    }),
    nest('c14-ecs', 'c14-ecs-tasks-services', 'Tasks, Services & Task Definitions', 'tier2', {
      related: ['c15-ecs'],
      tags: ['aws'],
    }),
    nest('c14-ecs', 'c14-ecs-vs-eks', 'ECS/Fargate vs EKS Trade-offs', 'tier2', {
      related: ['c15-eks'],
      tags: ['aws'],
    }),
    nest('c14-ecs', 'c14-ecs-deploy-flow', 'Build → ECR → ECS Deploy Flow', 'tier2', {
      tags: ['aws', ...DOCKER],
    }),
  ]),

  section('C14.14', 'Infrastructure as Code', 223, [
    item('c14-iac', 'Infrastructure as Code', 'tier2'),
    nest('c14-iac', 'c14-why-iac', 'Why IaC Beats Click-Ops', 'tier2'),
    nest('c14-iac', 'c14-terraform', 'Introduction to Terraform', 'tier2'),
    nest('c14-iac', 'c14-cloudformation', 'AWS CloudFormation', 'tier2', { tags: ['aws'] }),
    nest('c14-iac', 'c14-iac-state-drift', 'State, Drift & Reviewable Infra Changes', 'tier2'),
  ]),

  section('C14.15', 'Monitoring & Logging for Delivery', 224, [
    item('c14-monitoring-logging', 'Monitoring & Logging for Delivery', 'tier2', {
      related: ['c16-prometheus', 'c16-grafana', 'c16-structured-logging'],
    }),
    nest('c14-monitoring-logging', 'c14-prometheus-grafana-helm', 'Prometheus & Grafana with Helm', 'tier2', {
      related: ['c16-prometheus', 'c16-grafana'],
    }),
    nest('c14-monitoring-logging', 'c14-monitoring-services', 'Monitoring & Logging Services Overview', 'tier2'),
    nest('c14-monitoring-logging', 'c14-golden-signals-devops', 'Golden Signals in Deploy Pipelines', 'tier2', {
      related: ['c16-metrics'],
    }),
    nest('c14-monitoring-logging', 'c14-incident-comms', 'Incident Comms (ChatOps Patterns)', 'tier2'),
  ]),

  section('C14.16', 'DevSecOps & Container Security', 225, [
    item('c14-devsecops', 'DevSecOps & Container Security', 'tier2', {
      related: ['c9-secrets'],
    }),
    nest('c14-devsecops', 'c14-what-is-devsecops', 'What Is DevSecOps', 'tier2'),
    nest('c14-devsecops', 'c14-image-scanning', 'Image CVE Scanning & SBOM', 'tier2', {
      tags: [...DOCKER],
    }),
    nest('c14-devsecops', 'c14-docker-security-practices', 'Docker Security Best Practices', 'tier2', {
      tags: [...DOCKER],
    }),
    nest('c14-devsecops', 'c14-k8s-security-basics', 'Kubernetes Security Basics', 'tier2'),
    nest('c14-devsecops', 'c14-secrets-in-pipelines', 'Secrets in Images, Compose & Pipelines', 'tier2', {
      related: ['c9-secrets'],
    }),
  ]),
]
