import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Consistent hashing maps keys and nodes to fixed hash ring — adding/removing node reassigns only K/N keys on average instead of entire keyspace like modulo hash. Virtual nodes (vnodes) improve load balance when physical nodes heterogeneous.',
  whyExists:
    'Distributed caches (Memcached, Redis Cluster), CDNs, and load balancers need shard key to server mapping. Naive hash(key) % N reshuffles almost all keys when N changes — cache stampede. Consistent hashing minimizes remapping on cluster resize.',
  mentalModel:
    'Hash ring 0 to 2^32-1. Nodes placed on ring by hash(nodeId). Key maps to clockwise first node. Add node steals slice from successor only. Virtual nodes: each physical node has many points on ring for even distribution.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Key lookup on hash ring',
      diagram: `flowchart LR
  subgraph ring [Hash Ring]
    N1((Node A))
    N2((Node B))
    N3((Node C))
    K1[Key K1]
  end
  K1 -->|clockwise first| N2`,
    },
    {
      type: 'list',
      items: [
        'hash(key) → position on ring → walk clockwise to first node.',
        'Add node: only keys between predecessor and new node move.',
        'Remove node: keys reassign to successor.',
        'Vnodes: nodeA#1, nodeA#2, ... spread load; typical 100-200 vnodes per physical.',
        'Used in: Dynamo, Cassandra token ring, Redis Cluster hash slots variant.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Simplified ring lookup with TreeMap',
      code: `public class ConsistentHash {
  private final TreeMap<Long, String> ring = new TreeMap<>();

  public void addNode(String node, int vnodes) {
    for (int i = 0; i < vnodes; i++) {
      ring.put(hash(node + "#" + i), node);
    }
  }

  public String getNode(String key) {
    if (ring.isEmpty()) return null;
    long h = hash(key);
    Map.Entry<Long, String> e = ring.ceilingEntry(h);
    if (e == null) e = ring.firstEntry();
    return e.getValue();
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Redis Cluster uses 16384 hash slots assigned to nodes — similar minimal-move property.',
        'Bounded loads optimization prevents hot vnode overload.',
        'Rendezvous hashing alternative highest random weight.',
        'MD5/SHA1 hash functions map to ring positions.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Minimal key movement on node change', 'Horizontally scale cache/shard', 'Decentralized lookup possible'],
    disadvantages: ['Uneven without vnodes', 'Hot keys still hot regardless of ring', 'Complexity vs simple modulo'],
    alternatives: ['Modulo hash simple small static N', 'Directory service central mapping', 'Range partitioning'],
    whenToUse: ['Dynamic cluster membership', 'Distributed cache sharding', 'DHT systems'],
    whenNotToUse: ['Fixed two-node split', 'Strong range queries needed — use range shard'],
  },
  failureModes: [
    'Hot key all on one node — ring balance irrelevant',
    'Too few vnodes skew load',
    'Node failure without replication loses slice',
    'Clockwise walk single successor overload on neighbor when node removed',
    'Stale ring view — client wrong node after topology change',
  ],
  production: {
    scalability: ['Enough vnodes per host', 'Replication factor on ring successors'],
    reliability: ['Gossip membership updates ring view', 'Handoff during migration'],
    observability: ['Per-node key count balance metrics'],
  },
  interview: {
    expectations: ['Ring lookup', 'Why better than % N', 'Vnodes purpose', 'Hot key separate issue'],
    commonQuestions: ['Shard cache across servers?', 'Node added what keys move?'],
    followUps: ['Redis Cluster vs consistent hash?', 'Hot key mitigation?'],
    misconceptions: ['Perfect even distribution always', 'Solves hot key problem'],
    traps: ['Modulo hash when ring expected in distributed cache question'],
    strongSignals: ['K/N keys move on add/remove', 'Vnodes for balance', 'Clockwise successor'],
  },
  keyTakeaways: [
    'Keys and nodes on hash ring; key goes to next clockwise node.',
    'Only K/N keys remap when node added/removed.',
    'Virtual nodes improve load balance.',
    'Hot keys need application-level sharding or replication.',
    'Redis Cluster uses hash slots variant of same idea.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Consistent hashing benefit vs hash % N?', answerHint: 'Only K/N keys remap when nodes change; modulo reshuffles nearly all keys.' },
    { level: 'intermediate', question: 'Why virtual nodes?', answerHint: 'Multiple ring positions per physical node — smoother load when nodes heterogeneous.' },
    { level: 'advanced', question: 'Node removed from ring?', answerHint: 'Its keys reassign to clockwise successor; temporarily higher load on neighbor.' },
  ],
  flashcards: [
    { front: 'Hash ring', back: 'Nodes and keys on circle; key maps to next node clockwise' },
    { front: 'Vnode', back: 'Virtual node — multiple ring points per physical server' },
    { front: 'K/N remapping', back: 'Keys moved when adding/removing one of N nodes' },
    { front: 'Hot key', back: 'Same key hash — needs app split not ring fix alone' },
  ],
  quickRevision: ['Ring + clockwise', 'Minimal remapping', 'Vnodes balance', 'Hot key separate', 'Redis 16384 slots'],
}
