import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'AWS Auto Scaling (ASG) automatically adjusts EC2 or ECS capacity based on demand: scale out on high CPU/latency/custom CloudWatch metric, scale in when idle. Combines launch template, min/max/desired capacity, health checks, and integration with ALB.',
  whyExists:
    'Traffic is spiky — manual capacity planning wastes money or causes outages. ASG adds instances during peak and removes them off-peak. Replaces unhealthy instances automatically after failed health checks.',
  mentalModel:
    'Thermostat for servers. Set min/max/desired; CloudWatch alarm says too hot → add instances; too cold → remove (with cooldown to prevent flapping). Launch template is recipe for new instances.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'ASG with ALB',
      diagram: `flowchart LR
  CW[CloudWatch alarm CPU>70%] --> ASG[Auto Scaling Group]
  ASG -->|scale out| EC2new[New EC2 instances]
  EC2new --> TG[ALB Target Group]
  ASG -->|replace unhealthy| EC2bad[Terminate failed]`,
    },
    {
      type: 'list',
      items: [
        'Scaling policies: target tracking (CPU 50%), step scaling, scheduled.',
        'Cooldown/warmup: ignore scale signals briefly after change.',
        'Lifecycle hooks: pause before terminate for drain script.',
        'Mixed instances policy: On-Demand base + Spot for cost.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'ASG min 2 max 20 desired 4 across two AZs. Target tracking ALBRequestCountPerTarget. Black Friday traffic doubles → ASG launches instances until metric stabilizes. Night scale-in to min 2 with 300s cooldown.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'EC2 health check vs ELB health check — prefer ELB for app-aware.',
        'Predictive scaling uses ML on history (optional).',
        'Instance refresh rolls new AMI without manual replace.',
        'ECS Service Auto Scaling scales task count similarly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Elastic capacity', 'Self-healing', 'Cost savings scale-in', 'Multi-AZ spread'],
    disadvantages: ['Scale-out lag — cold start new instances', 'Flapping if cooldown wrong', 'Spot interruption handling'],
    alternatives: ['Manual capacity', 'K8s HPA', 'Serverless auto scale Lambda/Fargate'],
    whenToUse: ['Variable web traffic', 'Batch workers queue-driven scale'],
    whenNotToUse: ['Fixed tiny workload — 2 instances static cheaper mentally'],
  },
  failureModes: [
    'Scale too slow — alarm period longer than traffic spike duration',
    'Aggressive scale-in kills long-running jobs',
    'Max capacity too low — cap hit during peak',
    'Launch template wrong AMI — all new instances fail health',
    'No cooldown — oscillate 2↔20 instances',
  ],
  production: {
    reliability: ['Min >= 2 multi-AZ', 'ELB health checks', 'Lifecycle hook graceful drain'],
    cost: ['Spot for fault-tolerant tiers', 'Scheduled scale for known patterns'],
    observability: ['Track GroupInServiceInstances', 'Alarm on max capacity reached'],
    performance: ['Pre-warm AMIs or faster instance types', 'Target tracking on custom metric RPS'],
  },
  interview: {
    expectations: ['Scale out/in triggers', 'Cooldown purpose', 'ASG + ALB together'],
    commonQuestions: ['Design auto scaling web tier?', 'Prevent flapping?'],
    followUps: ['Spot in ASG?', 'ECS vs EC2 ASG?'],
    misconceptions: ['Instant infinite scale', 'Scale-in immediate on one low CPU reading'],
    traps: ['CPU only metric ignores memory-bound JVM'],
    strongSignals: ['Target tracking ALBRequestCount', 'Lifecycle hook drain', 'Min multi-AZ'],
  },
  keyTakeaways: [
    'ASG adjusts EC2 count between min and max based on metrics.',
    'Target tracking keeps metric near set point (e.g. CPU 50%).',
    'Cooldown prevents scale flapping.',
    'Use ELB health checks; lifecycle hooks for graceful terminate.',
    'ECS/Fargate has parallel service auto scaling.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Auto Scaling?', answerHint: 'Match capacity to demand; replace unhealthy; cost savings.' },
    { level: 'intermediate', question: 'Cooldown period purpose?', answerHint: 'Wait after scaling action before another — prevent oscillation.' },
    { level: 'advanced', question: 'Scale on CPU vs ALB request count?', answerHint: 'RPS/request per target better for web; CPU for compute-bound batch.' },
  ],
  flashcards: [
    { front: 'Desired capacity', back: 'Target instance count ASG maintains' },
    { front: 'Target tracking', back: 'Scale to keep metric near target value' },
    { front: 'Lifecycle hook', back: 'Pause instance launch/terminate for custom action' },
  ],
  quickRevision: [
    'Min max desired',
    'Target tracking',
    'Cooldown anti-flap',
    'ELB health',
    'Lifecycle drain',
  ],
}
