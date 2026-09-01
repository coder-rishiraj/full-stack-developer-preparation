import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Splitwise LLD models expense sharing among users/groups, balance sheets (who owes whom), equal/exact/percentage splits, and simplified debt settlement — a graph simplification and ledger design problem.',
  whyExists:
    'Mirrors fintech ledger thinking without payment rails: how to record expenses, aggregate balances, and minimize transactions — common LLD at startups with social/finance products.',
  mentalModel:
    'User has net balance per currency. Expense splits cost among participants; balances update atomically. Group aggregates member expenses. SettlementService compresses debts (optional min-cash-flow) before recording payments.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: groups, currencies, split types (equal, exact amounts, %), simplify debts?',
        'Classes: User, Group, Expense, Split, BalanceSheet, ExpenseService, SettlementOptimizer',
        'addExpense(payer, amount, splits): credit payer, debit participants proportionally',
        'getBalances(user): map user → net owed/owing',
        'settle(from, to, amount): record payment reducing pairwise balance',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Start with pairwise balance map (userA,userB)→amount. addExpense updates edges. Show equal split math. If time: simplify graph — net each user then greedy match creditors/debtors.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class ExpenseService {
    +addExpense(Expense): void
    +getBalance(User): Money
    +settle(User from, User to, Money)
  }
  class BalanceSheet {
    -balances: Map~BalanceKey, Money~
    +addSplit(User from, User to, Money)
    +getNet(User): Money
  }
  class Expense {
    -payer: User
    -amount: Money
    -splits: List~Split~
    -group: Group
  }
  class Split {
    -user: User
    -share: Money
  }
  class SettlementOptimizer {
    +simplify(BalanceSheet): List~Transaction~
  }
  ExpenseService --> BalanceSheet
  ExpenseService --> SettlementOptimizer`,
    caption: 'BalanceSheet is source of truth for who owes whom',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Equal split among group members',
      code: `public void addEqualExpense(User payer, Money total, List<User> participants) {
  Money share = total.divide(participants.size());
  for (User u : participants) {
    if (u.equals(payer)) continue;
    balanceSheet.addOwes(u, payer, share); // u owes payer
  }
  // payer already paid total — net reflects others' shares owed to payer
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Pairwise balance key',
      code: `record BalanceKey(User debtor, User creditor) {}
// addOwes(A,B,50) means A owes B 50
void addOwes(User debtor, User creditor, Money amt) {
  balances.merge(new BalanceKey(debtor, creditor), amt, Money::add);
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear ledger model', 'Split strategies pluggable', 'Graph simplify is good stretch goal'],
    disadvantages: ['Simplified vs real Splitwise (comments, receipts, FX)', 'Concurrent expense needs locking'],
    alternatives: ['Net balance per user only (loses who-to-pay detail)', 'Double-entry accounting ledger'],
    whenToUse: ['LLD interviews', 'Ledger learning'],
    whenNotToUse: ['Production payments without PCI/compliance scope'],
  },
  failureModes: [
    'Splits don’t sum to total — validation missed',
    'Currency mismatch in balance map',
    'Negative balance from duplicate settle',
    'Group leave with nonzero balance unhandled',
  ],
  interview: {
    expectations: ['Expense + split model', 'Balance aggregation', 'Optional debt simplification'],
    commonQuestions: ['Design Splitwise', 'Minimize cash flow?'],
    followUps: ['Multiple currencies?', 'Percent split rounding?'],
    misconceptions: ['Store only net per user — lose settlement paths'],
    traps: ['Rounding errors in equal split'],
    strongSignals: ['Split strategy interface', 'Greedy simplify explanation'],
  },
  keyTakeaways: [
    'BalanceSheet tracks pairwise debts.',
    'Expense updates multiple split edges.',
    'Validate splits sum to expense amount.',
    'Settlement reduces specific pairwise balance.',
    'Simplify debts = net users + match creditors/debtors.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Record $90 dinner paid by A split among A,B,C?', answerHint: 'B owes A 30, C owes A 30; A net +60.' },
    { level: 'intermediate', question: 'Exact vs equal split?', answerHint: 'Strategy computes each Split share before updating balances.' },
    { level: 'advanced', question: 'Minimize transactions?', answerHint: 'Net balances; greedy pair largest creditor with largest debtor.' },
  ],
  flashcards: [
    { front: 'BalanceSheet', back: 'Pairwise who-owes-whom amounts' },
    { front: 'Equal split', back: 'total / n; exclude payer from owing self' },
    { front: 'Settlement', back: 'Payment reduces debtor→creditor edge' },
    { front: 'Simplify debts', back: 'Net per user; minimize payment count' },
  ],
  quickRevision: [
    'Expense + Split list',
    'Pairwise ledger',
    'Split strategies',
    'Validate sum = total',
    'Greedy simplify optional',
  ],
}
