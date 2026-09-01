import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ATM LLD models card authentication, PIN validation, account balance inquiry, cash withdrawal/deposit with dispenser/cash bin, and transaction logging — combining state machine, hardware abstraction, and banking invariants.',
  whyExists:
    'Tests mapping physical devices (card reader, cash dispenser) to software interfaces, session lifecycle, and consistency (cannot dispense more than balance or machine cash).',
  mentalModel:
    'ATM session: insert card → PIN → menu operations → eject card. ATM delegates to BankService for account ops and CashDispenser for notes. Transaction log append-only. Chain of Responsibility for $20/$10/$5 dispensing.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: single bank vs network, deposit check?, concurrent ATMs, failed dispense rollback',
        'Classes: ATM, Card, Account, BankService, CashDispenser, CashBin, Transaction, ATMState',
        'withdraw: validate balance + dispenser capacity → debit account → dispense',
        'deposit: accept cash → credit account → update bin',
        'PIN lockout after N failures',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Hardware interfaces: CardReader, CashDispenser, Keypad. ATM orchestrates. BankService is external dependency (interface). Walk withdraw happy path + insufficient funds + out of cash. State pattern for session optional.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class ATM {
    -bank: BankService
    -dispenser: CashDispenser
    -session: ATMSession
    +insertCard(Card)
    +enterPin(String)
    +withdraw(Money)
  }
  class BankService {
    <<interface>>
    +validatePin(Card, pin): boolean
    +getBalance(AccountId): Money
    +debit(AccountId, Money): boolean
  }
  class CashDispenser {
    -inventory: Map~Denomination, Integer~
    +canDispense(Money): boolean
    +dispense(Money): List~Note~
  }
  class Transaction {
    -type: TxType
    -amount: Money
    -timestamp: Instant
  }
  ATM --> BankService
  ATM --> CashDispenser`,
    caption: 'ATM orchestrates bank + hardware abstractions',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Withdraw with two-phase validation',
      code: `public void withdraw(Money amount) {
  AccountId acct = session.getAccount();
  if (!bank.getBalance(acct).gte(amount))
    throw new InsufficientFundsException();
  if (!dispenser.canDispense(amount))
    throw new OutOfCashException();
  if (!bank.debit(acct, amount))
    throw new BankingException();
  try {
    dispenser.dispense(amount);
    log.append(Transaction.withdraw(acct, amount));
  } catch (DispenseException e) {
    bank.credit(acct, amount); // compensate
    throw e;
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Greedy note dispensing',
      code: `public List<Note> dispense(Money amount) {
  int remaining = amount.cents();
  List<Note> out = new ArrayList<>();
  for (Denomination d : Denomination.desc()) {
    while (remaining >= d.cents() && inventory.get(d) > 0) {
      out.add(new Note(d));
      inventory.merge(d, -1, Integer::sum);
      remaining -= d.cents();
    }
  }
  if (remaining != 0) throw new CannotMakeExactChangeException();
  return out;
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear hardware abstraction', 'Compensation pattern practice', 'Session security modeling'],
    disadvantages: ['Real ATM PCI/security far deeper', 'Distributed bank ledger simplified'],
    alternatives: ['Saga for withdraw across bank + dispenser', 'Event sourcing transaction log'],
    whenToUse: ['LLD interviews', 'Device orchestration learning'],
    whenNotToUse: ['Production banking without security audit'],
  },
  failureModes: [
    'Debit succeeds, dispense fails — must credit back',
    'Partial dispense jam',
    'PIN brute force without lockout',
    'Race on cash bin inventory across sessions',
  ],
  interview: {
    expectations: ['BankService interface', 'Compensating transaction', 'Dispenser inventory'],
    commonQuestions: ['Design ATM', 'Out of cash mid-transaction?'],
    followUps: ['Deposit checks?', 'Multi-account card?'],
    misconceptions: ['ATM stores authoritative balance — bank does'],
    traps: ['Dispense before debit'],
    strongSignals: ['Compensating credit on dispense fail', 'Hardware as interfaces'],
  },
  keyTakeaways: [
    'BankService owns authoritative balance.',
    'Check balance AND dispenser before debit.',
    'Compensate if dispense fails after debit.',
    'CashDispenser tracks note inventory.',
    'Session + PIN lockout for security.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ATM core components?', answerHint: 'ATM controller, BankService, CashDispenser, Card/session.' },
    { level: 'intermediate', question: 'Withdraw failure after debit?', answerHint: 'Credit account back; log failed tx; alert ops.' },
    { level: 'advanced', question: 'Sync cash bin across restock?', answerHint: 'Admin mode; audit log; physical count reconciliation.' },
  ],
  flashcards: [
    { front: 'Withdraw order', back: 'Validate balance → validate dispenser → debit → dispense → log' },
    { front: 'Compensation', back: 'Credit back if dispense fails after debit' },
    { front: 'BankService', back: 'External authority for accounts; ATM doesn’t own balance' },
    { front: 'PIN lockout', back: 'Block card after N failed attempts' },
  ],
  quickRevision: [
    'Session lifecycle',
    'BankService interface',
    'Debit then dispense',
    'Compensate on fail',
    'Note inventory greedy',
  ],
}
