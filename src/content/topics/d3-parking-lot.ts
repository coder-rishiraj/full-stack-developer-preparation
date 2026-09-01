import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Parking Lot LLD models a multi-level facility where vehicles of different sizes park in compatible spots, tickets track occupancy, fees compute on exit, and entry/exit gates coordinate availability — a classic OOD exercise testing enums, composition, and state.',
  whyExists:
    'Interviewers use Parking Lot to assess requirement clarification, class identification, extensibility (new vehicle types, pricing rules), and thread-safety awareness without needing domain expertise.',
  mentalModel:
    'ParkingLot owns Levels; each Level has Spots tagged by size. Vehicle requests compatible spot; Ticket binds vehicle to spot until exit. PaymentCalculator applies hourly/daily rules. DisplayBoard shows free counts per level.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: vehicle types (bike/car/truck), spot sizes, multi-floor, payment, concurrent entry?',
        'Entities: Vehicle, ParkingSpot, Level, ParkingTicket, ParkingLot, FeeStrategy, DisplayBoard',
        'park(vehicle): find first fit spot → mark occupied → issue ticket',
        'unpark(ticket): compute fee → free spot → update display',
        'Extend: electric charging spots, reserved spots, handicap rules',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough (15 min)',
      text: '0–3 min requirements. 3–8 min class diagram + responsibilities. 8–12 min park/unpark code path. 12–15 min extensions: concurrency (synchronized spot assign), nearest spot strategy, failure if full.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class ParkingLot {
    -levels: List~Level~
    -display: DisplayBoard
    +park(Vehicle): Ticket
    +unpark(Ticket): Money
  }
  class Level {
    -spots: List~ParkingSpot~
    +findAvailableSpot(VehicleSize): Optional~Spot~
  }
  class ParkingSpot {
    -size: SpotSize
    -occupied: boolean
    +canFit(Vehicle): boolean
    +assign(Vehicle)
    +release()
  }
  class Vehicle {
    -plate: String
    -size: VehicleSize
  }
  class ParkingTicket {
    -spot: ParkingSpot
    -entryTime: Instant
  }
  class FeeCalculator {
    +compute(Ticket): Money
  }
  ParkingLot --> Level
  Level --> ParkingSpot
  ParkingLot --> FeeCalculator
  ParkingLot --> DisplayBoard`,
    caption: 'Core classes and responsibilities',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Park flow — first available compatible spot',
      code: `public class ParkingLot {
  private final List<Level> levels;
  private final FeeCalculator fees;

  public synchronized ParkingTicket park(Vehicle vehicle) {
    for (Level level : levels) {
      Optional<ParkingSpot> spot = level.findAvailableSpot(vehicle.getSize());
      if (spot.isPresent()) {
        spot.get().assign(vehicle);
        return new ParkingTicket(spot.get(), Instant.now());
      }
    }
    throw new ParkingFullException();
  }

  public Money unpark(ParkingTicket ticket) {
    Money amount = fees.compute(ticket);
    ticket.getSpot().release();
    return amount;
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Spot sizing rule',
      code: `public boolean canFit(Vehicle v) {
  return switch (spotSize) {
    case LARGE -> true;
    case MEDIUM -> v.getSize() != VehicleSize.TRUCK;
    case SMALL -> v.getSize() == VehicleSize.BIKE;
  };
}`,
    },
    {
      language: 'java',
      caption: 'Strategy for spot selection',
      code: `public interface SpotAssignmentStrategy {
  Optional<ParkingSpot> pick(List<Level> levels, Vehicle v);
}
// NearestLevelStrategy, FillFromFrontStrategy`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear entity boundaries map to real world',
      'Easy to add FeeStrategy or assignment strategy',
      'Good practice for enum-driven sizing rules',
    ],
    disadvantages: [
      'Over-engineering for single-lot prototype',
      'First-fit may fragment large spots for small cars',
    ],
    alternatives: [
      'Best-fit spot assignment to reduce waste',
      'Single map spotId → state for huge lots',
    ],
    whenToUse: ['LLD interviews', 'Facility management learning projects'],
    whenNotToUse: ['Real city parking — needs ANPR, payments gateway, ops'],
  },
  failureModes: [
    'Double-booking spot without synchronization',
    'Truck in small spot due to missing validation',
    'Lost ticket with no admin override path',
    'Fee clock skew on exit',
  ],
  interview: {
    expectations: [
      'List classes before coding',
      'Handle full lot exception',
      'Discuss synchronized park vs lock per level',
    ],
    commonQuestions: ['Design parking lot', 'Add motorcycle and truck', 'Multiple entrances?'],
    followUps: ['Electric charging queue?', 'Reserved spots?', 'Display board update?'],
    misconceptions: ['One class ParkingLot does everything'],
    traps: ['Forgetting spot size compatibility matrix'],
    strongSignals: ['Strategy for pricing and assignment', 'Ticket ties time + spot'],
  },
  keyTakeaways: [
    'ParkingLot orchestrates; Level/Spot own occupancy.',
    'Vehicle size ↔ spot size matching is core rule.',
    'Ticket = spot + entry time for fee.',
    'Strategy pattern for fee and spot assignment.',
    'Synchronize spot assignment for concurrency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Main classes in parking lot?', answerHint: 'Lot, Level, Spot, Vehicle, Ticket, FeeCalculator.' },
    { level: 'intermediate', question: 'Can car use large spot?', answerHint: 'Yes if policy allows; discuss spot waste vs best-fit.' },
    { level: 'advanced', question: 'Two entry gates concurrent park?', answerHint: 'Lock spot or level; compare-and-set on spot.occupied.' },
  ],
  flashcards: [
    { front: 'ParkingTicket holds', back: 'Spot reference + entry timestamp' },
    { front: 'canFit logic', back: 'Spot size must accommodate vehicle size' },
    { front: 'Full lot', back: 'Throw ParkingFullException or wait queue' },
    { front: 'FeeCalculator', back: 'Strategy based on duration/rules' },
  ],
  quickRevision: [
    'Lot → Levels → Spots',
    'park: find spot, assign, ticket',
    'unpark: fee, release',
    'Enums: VehicleSize, SpotSize',
    'sync spot assignment',
  ],
}
