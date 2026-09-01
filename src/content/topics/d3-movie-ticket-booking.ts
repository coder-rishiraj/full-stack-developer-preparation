import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Movie Ticket Booking LLD covers browsing shows, seat selection with concurrent locking, booking confirmation, payment, and cancellation — tests handling shared mutable state (seats), timeout on holds, and theatre/show hierarchy.',
  whyExists:
    'Seat booking is canonical concurrency problem — two users selecting same seat. Interviewers assess lock strategy (DB row lock, Redis hold token), entity modeling (Cinema, Screen, Show, Seat, Booking), and payment integration boundaries.',
  mentalModel:
    'User picks Show → seat map displays available seats → select seats → temporary HOLD (5 min) → pay → CONFIRMED or hold expires releasing seats. BookingService orchestrates; Seat holds prevent double book.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: single cinema chain, seat types (regular/premium), hold duration, waitlist?',
        'Entities: Cinema, Screen, Show, Seat, SeatLock/Hold, Booking, Payment, User.',
        'Show has seat map copy or references Screen layout; seats have status AVAILABLE/HELD/BOOKED.',
        'holdSeats(showId, seatIds, userId): atomic check+mark HELD with expiry timestamp.',
        'confirmBooking(holdId, payment): verify hold valid, charge, mark BOOKED.',
        'Scheduler releases expired holds back to AVAILABLE.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Concurrency is the focus',
      text: 'Spend time on hold mechanism — synchronized block vs SELECT FOR UPDATE vs Redis SETNX per seat. Mention optimistic failure returns "seat taken" to user.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class BookingService {
    +holdSeats(showId, seats, userId): Hold
    +confirmBooking(holdId, payment): Booking
    +cancelBooking(bookingId)
  }
  class Show {
    -startTime: Instant
    -pricing: Map~SeatType,Money~
    +getSeat(seatId): Seat
  }
  class Seat {
    -status: SeatStatus
    -type: SeatType
    +holdUntil(Instant)
    +book()
    +release()
  }
  class Hold {
    -expiry: Instant
    -seatIds: List~String~
  }
  BookingService --> Show
  Show --> Seat
  BookingService --> Hold`,
    caption: 'Booking and seat hold model',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Hold seats with transactional row lock',
      code: `@Transactional
public Hold holdSeats(UUID showId, List<String> seatIds, UUID userId) {
  Show show = showRepo.findForUpdate(showId); // pessimistic lock show row or seats
  for (String sid : seatIds) {
    Seat seat = show.getSeat(sid);
    if (seat.getStatus() != AVAILABLE) {
      throw new SeatUnavailableException(sid);
    }
  }
  Instant expiry = Instant.now().plus(Duration.ofMinutes(5));
  seatIds.forEach(id -> show.getSeat(id).holdUntil(expiry));
  return holdRepo.save(new Hold(showId, seatIds, userId, expiry));
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Confirm booking after payment',
      code: `public Booking confirmBooking(UUID holdId, PaymentDetails payment) {
  Hold hold = holdRepo.find(holdId);
  if (hold.isExpired()) throw new HoldExpiredException();
  paymentService.charge(hold.totalPrice(), payment);
  hold.getSeatIds().forEach(id -> showRepo.markBooked(hold.getShowId(), id));
  holdRepo.delete(holdId);
  return bookingRepo.save(Booking.from(hold));
}`,
    },
    {
      language: 'java',
      caption: 'Expire holds job',
      code: `@Scheduled(fixedRate = 60000)
public void releaseExpiredHolds() {
  holdRepo.findExpired().forEach(h -> {
    releaseSeats(h);
    holdRepo.delete(h.getId());
  });
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear concurrency story', 'Rich state on seats', 'Natural timeout extension discussion'],
    disadvantages: ['Pessimistic lock may serialize hot shows', 'Redis hold adds infra complexity'],
    alternatives: ['Optimistic versioning on seat row', 'Queue single-thread per show for holds'],
    whenToUse: ['LLD interviews', 'Learning transactional seat inventory'],
    whenNotToUse: ['Real cinema without HLD for CDN and search scale'],
  },
  failureModes: [
    'Hold expires during payment — user charged no ticket',
    'Double confirm same hold — idempotency needed',
    'Deadlock locking seats in different order',
    'Show oversell if status check not atomic',
    'Clock skew on hold expiry',
  ],
  production: {
    reliability: ['Idempotent confirmBooking key', 'Payment refund if confirm fails after charge'],
    performance: ['Partition hot shows; cache seat map read-only until hold'],
    observability: ['Metrics hold conversion rate and expiry releases'],
  },
  interview: {
    expectations: ['Seat hold timeout', 'Concurrent selection handling', 'Confirm flow', 'Class diagram'],
    commonQuestions: ['BookMyShow LLD', 'Two users same seat?', 'Hold expiry?'],
    followUps: ['Waitlist when sold out?', 'Dynamic pricing?', 'Group booking?'],
    misconceptions: ['Skip hold go straight to book on select'],
    traps: ['Non-atomic check-then-set seat status'],
    strongSignals: ['Pessimistic or Redis lock per seat', 'Hold expiry scheduler', 'confirm after payment only'],
  },
  keyTakeaways: [
    'Seat status AVAILABLE → HELD → BOOKED lifecycle.',
    'Hold with expiry prevents indefinite blocking.',
    'Atomic hold prevents double booking.',
    'Confirm only after successful payment.',
    'Release expired holds via scheduled job.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Core entities ticket booking?', answerHint: 'Cinema, Screen, Show, Seat, Booking, Hold, User, Payment.' },
    { level: 'intermediate', question: 'Two users pick same seat simultaneously?', answerHint: 'Transactional lock or atomic compare-and-set on seat status; loser gets SeatUnavailable.' },
    { level: 'advanced', question: 'Payment slow — hold expires?', answerHint: 'Extend hold on payment start; webhook confirm; refund if seats lost mid-payment.' },
  ],
  flashcards: [
    { front: 'Seat hold', back: 'Temporary HELD status with expiry before confirm' },
    { front: 'confirmBooking', back: 'After payment marks seats BOOKED releases hold record' },
    { front: 'Hot show lock', back: 'Pessimistic FOR UPDATE or per-seat Redis lock' },
    { front: 'Expire job', back: 'Scheduler releases HELD seats past expiry to AVAILABLE' },
  ],
  quickRevision: ['Hold then pay', 'Atomic seat lock', '5 min expiry', 'confirmBooking', 'Release expired holds'],
}
