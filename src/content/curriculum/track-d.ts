import type { SectionSeed } from './build'
import { TRACK_D_SYSTEM_DESIGN_SECTIONS } from './track-d-system-design'

const TRACK_D_LLD_SECTIONS: SectionSeed[] = [
  {
    id: 'D1',
    track: 'D',
    title: 'Object-Oriented Design',
    order: 1,
    defaultKind: 'theory',
    defaultDepth: 'medium',
    topics: [
      { id: 'd1-encapsulation', title: 'Encapsulation', priority: 'tier1', months: [1, 2], tags: ['ood'], related: ['c1-encapsulation'] },
      { id: 'd1-abstraction', title: 'Abstraction', priority: 'tier1', months: [1, 2], tags: ['ood'] },
      { id: 'd1-composition-vs-inheritance', title: 'Composition vs Inheritance', priority: 'tier1', months: [1, 2], tags: ['ood'] },
      { id: 'd1-solid', title: 'SOLID', priority: 'tier1', months: [1, 2], tags: ['ood'] },
      { id: 'd1-coupling-cohesion', title: 'Coupling/Cohesion', priority: 'tier1', months: [1, 2], tags: ['ood'] },
      { id: 'd1-interfaces', title: 'Interfaces (Design)', priority: 'tier1', months: [1, 2], tags: ['ood'] },
      { id: 'd1-immutability', title: 'Immutability (Design)', priority: 'tier1', months: [1, 2], tags: ['ood'], related: ['c1-immutability'] },
    ],
  },
  {
    id: 'D2',
    track: 'D',
    title: 'Design Patterns',
    order: 2,
    defaultKind: 'theory',
    defaultDepth: 'medium',
    topics: [
      { id: 'd2-strategy', title: 'Strategy', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-factory', title: 'Factory', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-builder', title: 'Builder', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-observer', title: 'Observer', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-adapter', title: 'Adapter', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-decorator', title: 'Decorator', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-facade', title: 'Facade', priority: 'tier1', months: [2, 3], tags: ['patterns'] },
      { id: 'd2-command', title: 'Command', priority: 'tier2', months: [3, 4], tags: ['patterns'] },
      { id: 'd2-template-method', title: 'Template Method', priority: 'tier2', months: [3, 4], tags: ['patterns'] },
      { id: 'd2-chain-of-responsibility', title: 'Chain of Responsibility', priority: 'tier2', months: [3, 4], tags: ['patterns'] },
      { id: 'd2-state', title: 'State', priority: 'tier2', months: [3, 4], tags: ['patterns'] },
      { id: 'd2-proxy', title: 'Proxy', priority: 'tier2', months: [3, 4], tags: ['patterns'], related: ['c5-proxies'] },
      { id: 'd2-visitor', title: 'Visitor', priority: 'tier3', months: [5, 6], tags: ['patterns'] },
    ],
  },
  {
    id: 'D3',
    track: 'D',
    title: 'LLD Interview Problems',
    order: 3,
    defaultKind: 'lld',
    defaultDepth: 'deep',
    topics: [
      { id: 'd3-parking-lot', title: 'Parking Lot', priority: 'tier1', months: [2, 4], tags: ['lld'] },
      { id: 'd3-elevator', title: 'Elevator', priority: 'tier1', months: [2, 4], tags: ['lld'] },
      { id: 'd3-library', title: 'Library', priority: 'tier1', months: [2, 4], tags: ['lld'] },
      { id: 'd3-vending-machine', title: 'Vending Machine', priority: 'tier1', months: [2, 4], tags: ['lld'] },
      { id: 'd3-tic-tac-toe', title: 'Tic-Tac-Toe', priority: 'tier1', months: [2, 4], tags: ['lld'] },
      { id: 'd3-chess', title: 'Chess', priority: 'tier1', months: [3, 4], tags: ['lld'] },
      { id: 'd3-splitwise', title: 'Splitwise', priority: 'tier1', months: [3, 4], tags: ['lld'] },
      { id: 'd3-atm', title: 'ATM', priority: 'tier1', months: [3, 4], tags: ['lld'] },
      { id: 'd3-notification-service', title: 'Notification Service (LLD)', priority: 'tier1', months: [3, 4], tags: ['lld'] },
      { id: 'd3-logging-framework', title: 'Logging Framework', priority: 'tier1', months: [3, 4], tags: ['lld'] },
      { id: 'd3-rate-limiter-lld', title: 'Rate Limiter (LLD)', priority: 'tier1', months: [3, 4], tags: ['lld'], related: ['d10-rate-limiter'] },
      { id: 'd3-cache', title: 'Cache (LLD)', priority: 'tier1', months: [3, 4], tags: ['lld'], related: ['a4-lru-style', 'c10-cache-aside'] },
      { id: 'd3-movie-ticket-booking', title: 'Movie Ticket Booking (LLD)', priority: 'tier2', months: [4, 5], tags: ['lld'], related: ['d10-ticket-booking'] },
      { id: 'd3-food-delivery', title: 'Food Delivery (LLD)', priority: 'tier2', months: [4, 5], tags: ['lld'] },
    ],
  },
]

/** Track D — LLD, System Design & Distributed Systems */
export const TRACK_D_SECTIONS: SectionSeed[] = [
  ...TRACK_D_LLD_SECTIONS,
  ...TRACK_D_SYSTEM_DESIGN_SECTIONS,
]
