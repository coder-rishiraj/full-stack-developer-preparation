import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Elevator LLD models one or more elevators serving floors in a building — scheduling requests, moving between floors, opening/closing doors, and applying dispatch algorithms (FCFS, SCAN, priority) while respecting capacity and direction.',
  whyExists:
    'Tests state machines, concurrency, scheduling tradeoffs, and multi-entity coordination — skills relevant to job schedulers, traffic systems, and resource pools.',
  mentalModel:
    'Building has ElevatorControllers; each Elevator is a state machine (IDLE, MOVING_UP, MOVING_DOWN, DOORS_OPEN). Requests queue per direction/floor. Scheduler picks elevator to minimize wait. Door timer prevents premature close.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: N elevators, M floors, max capacity, internal vs external requests, peak behavior',
        'Classes: Building, Elevator, ElevatorController, Request, Scheduler, Door, Direction enum',
        'Elevator maintains current floor, direction, target floor set (TreeSet)',
        'External request → controller → scheduler assigns elevator',
        'State transitions: idle → move → stop → open doors → close → continue',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Start requirements + scale (3 elevators, 20 floors). Draw Elevator state diagram. Implement addRequest + step()/run loop. Discuss SCAN vs nearest-car. Mention thread-safe request queue if asked.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Building {
    -elevators: List~Elevator~
    -controller: ElevatorController
    +requestElevator(floor, direction)
  }
  class ElevatorController {
    -scheduler: Scheduler
    +dispatch(Request): Elevator
  }
  class Elevator {
    -currentFloor: int
    -direction: Direction
    -targets: Set~Integer~
    -state: ElevatorState
    +addStop(int floor)
    +step()
  }
  class Scheduler {
    +select(Elevator[], Request): Elevator
  }
  Building --> ElevatorController
  ElevatorController --> Scheduler
  ElevatorController --> Elevator`,
    caption: 'Controller + scheduler + elevator state',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Elevator step simulation',
      code: `public class Elevator {
  private int currentFloor = 0;
  private Direction direction = Direction.IDLE;
  private final TreeSet<Integer> upStops = new TreeSet<>();
  private final TreeSet<Integer> downStops = new TreeSet<>(Comparator.reverseOrder());

  public void addRequest(int floor, Direction dir) {
    if (dir == Direction.UP) upStops.add(floor);
    else downStops.add(floor);
    if (direction == Direction.IDLE) direction = dir;
  }

  public void step() {
    if (direction == Direction.UP && !upStops.isEmpty()) {
      if (upStops.contains(currentFloor)) upStops.remove(currentFloor);
      if (upStops.isEmpty()) direction = Direction.DOWN;
      else currentFloor++;
    }
    // mirror for DOWN...
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Nearest idle elevator scheduler',
      code: `public Elevator select(List<Elevator> elevators, Request req) {
  return elevators.stream()
    .min(Comparator.comparingInt(e -> e.distanceTo(req.getFloor())))
    .orElseThrow();
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Rich state machine practice', 'Scheduling algorithm discussion', 'Extensible controller/strategy'],
    disadvantages: ['Real elevators use proprietary safety PLC logic', 'Simulation vs real-time threading complexity'],
    alternatives: ['SCAN elevator algorithm', 'Destination dispatch (enter floor in cab)'],
    whenToUse: ['LLD interviews', 'Discrete event simulation learning'],
    whenNotToUse: ['Safety-critical lift control without formal verification'],
  },
  failureModes: [
    'Request starvation on opposite direction',
    'Door reopen race with movement',
    'Over-capacity boarding not enforced',
    'Scheduler picks far elevator under load',
  ],
  interview: {
    expectations: ['State diagram', 'Internal + external requests', 'Scheduler extensibility'],
    commonQuestions: ['Design elevator system', 'Optimize for minimal wait'],
    followUps: ['Emergency mode?', 'Maintenance floor lock?', 'Weight sensor?'],
    misconceptions: ['One global queue enough — need per-direction stops'],
    traps: ['Ignoring direction when picking stops'],
    strongSignals: ['SCAN/LOOK mention', 'Separate up/down stop sets'],
  },
  keyTakeaways: [
    'Elevator = state machine + stop sets per direction.',
    'Controller dispatches; Scheduler picks elevator.',
    'TreeSet for ordered floor stops.',
    'Discuss FCFS vs SCAN vs nearest-car.',
    'Capacity and door state are separate concerns.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Elevator states?', answerHint: 'Idle, moving up/down, doors open/closed.' },
    { level: 'intermediate', question: 'SCAN algorithm?', answerHint: 'Sweep one direction servicing all stops, then reverse.' },
    { level: 'advanced', question: 'Thread-safe request handling?', answerHint: 'BlockingQueue for requests; elevator loop in worker thread.' },
  ],
  flashcards: [
    { front: 'ElevatorController', back: 'Receives building requests; delegates to scheduler' },
    { front: 'SCAN', back: 'Continue direction until no stops; then reverse' },
    { front: 'Internal request', back: 'Passenger inside selects destination floor' },
    { front: 'Stop sets', back: 'Separate ordered sets for UP and DOWN' },
  ],
  quickRevision: [
    'Building → Controller → Elevator',
    'Direction + floor stops',
    'step() simulation loop',
    'Scheduler strategy',
    'Door sub-state',
  ],
}
