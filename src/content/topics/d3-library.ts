import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Library LLD models catalog items (books/media), member accounts, lending/reservation/return workflows, fine calculation, and search — emphasizing entity relationships, business rules, and inventory consistency.',
  whyExists:
    'Classic LLD for CRUD + state transitions (AVAILABLE → BORROWED → RESERVED) and policy enforcement (borrow limits, due dates) — mirrors inventory and rental domains.',
  mentalModel:
    'Library owns Catalog (Book copies), Members borrow via LendingService. Each BookItem (copy) has barcode; CatalogEntry is title metadata. Transaction records borrow/return. FineCalculator runs on overdue return.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: physical copies vs digital, reservation queue, max books per member, renewals',
        'Classes: Library, Book (metadata), BookItem (copy), Member, Loan, Reservation, Catalog, FinePolicy',
        'borrow(member, isbn): find available copy → create Loan with dueDate',
        'return(loan): mark available, compute fine, notify waitlist',
        'reserve: queue when zero copies; fulfill on return',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Separate Book metadata from BookItem copy — key insight. Walk borrow/return. Add reservation linked list per title. Discuss concurrent borrow of last copy (lock copy row).',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Library {
    -catalog: Catalog
    -members: Map~MemberId, Member~
    +borrow(Member, isbn): Loan
    +returnLoan(LoanId)
  }
  class Catalog {
    +findAvailableCopy(isbn): Optional~BookItem~
  }
  class Book {
    -isbn: String
    -title: String
  }
  class BookItem {
    -barcode: String
    -status: ItemStatus
  }
  class Loan {
    -member: Member
    -item: BookItem
    -dueDate: LocalDate
  }
  class ReservationQueue {
    +add(Member, isbn)
    +popNext(isbn): Member
  }
  Library --> Catalog
  Catalog --> BookItem
  BookItem --> Book`,
    caption: 'Metadata vs copy; loan tracks physical item',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Borrow with limit check',
      code: `public Loan borrow(Member member, String isbn) {
  if (member.activeLoans().size() >= member.getBorrowLimit())
    throw new BorrowLimitExceededException();
  BookItem copy = catalog.findAvailableCopy(isbn)
    .orElseThrow(() -> new NotAvailableException(isbn));
  copy.markBorrowed();
  Loan loan = Loan.create(member, copy, clock.today().plusDays(14));
  member.addLoan(loan);
  return loan;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Return with fine and reservation notify',
      code: `public void returnLoan(LoanId id) {
  Loan loan = loanRepo.find(id);
  copy = loan.getItem();
  copy.markAvailable();
  finePolicy.applyIfOverdue(loan);
  Optional<Member> next = reservationQueue.popNext(copy.getIsbn());
  next.ifPresent(m -> notifyReservationReady(m, copy));
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear aggregate boundaries', 'Reservation queue natural extension', 'Fine policy pluggable'],
    disadvantages: ['Simplified vs real ILS integrations', 'Search/indexing often hand-waved'],
    alternatives: ['Event sourcing for loan history', 'Separate inventory microservice'],
    whenToUse: ['LLD interviews', 'Rental/inventory pattern learning'],
    whenNotToUse: ['Production library without search/auth scope'],
  },
  failureModes: [
    'Two members borrow last copy — race without transaction',
    'Lost item status not modeled',
    'Renewal extends due date without limit',
    'Reservation not expired — stale holds',
  ],
  interview: {
    expectations: ['Book vs BookItem split', 'Loan lifecycle', 'Reservation on return'],
    commonQuestions: ['Design library system', 'Add e-books?', 'Fine calculation?'],
    followUps: ['Full-text search?', 'Multiple branches?'],
    misconceptions: ['One Book class enough — need copy tracking'],
    traps: ['Borrowing by title without copy barcode'],
    strongSignals: ['ItemStatus enum', 'Transaction on last copy'],
  },
  keyTakeaways: [
    'Separate catalog metadata from physical copies.',
    'Loan binds member + copy + due date.',
    'Reservation queue per ISBN.',
    'FinePolicy strategy on overdue return.',
    'Synchronize last-available copy borrow.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Book vs BookItem?', answerHint: 'Book=metadata; BookItem=physical copy with barcode/status.' },
    { level: 'intermediate', question: 'Handle zero copies?', answerHint: 'Reservation queue; notify on return.' },
    { level: 'advanced', question: 'Concurrent borrow last copy?', answerHint: 'DB transaction/optimistic lock on copy status.' },
  ],
  flashcards: [
    { front: 'BookItem status', back: 'AVAILABLE, BORROWED, RESERVED, LOST' },
    { front: 'Loan', back: 'Member + copy + borrow/ due dates' },
    { front: 'Borrow limit', back: 'Enforce per member before assign copy' },
    { front: 'Return flow', back: 'Free copy, fine, fulfill reservation' },
  ],
  quickRevision: [
    'Book metadata vs copy',
    'borrow → Loan + status',
    'return → fine + waitlist',
    'FinePolicy strategy',
    'Lock last copy',
  ],
}
