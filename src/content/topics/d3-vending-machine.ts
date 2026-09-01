import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Vending Machine LLD models product inventory in slots, coin/cash/card payment acceptance, change dispensing, and state-driven purchase flow — a compact state pattern exercise with transactional inventory updates.',
  whyExists:
    'Small enough for 30-minute interviews yet covers state machines, money handling, and failure cases (out of stock, insufficient payment) — common at many companies.',
  mentalModel:
    'VendingMachine has states: IDLE, HAS_MONEY, DISPENSING, OUT_OF_STOCK. Inventory tracks per slot Product + count. PaymentCollector sums inserted coins; Purchase validates selection, deducts price, dispenses, returns change.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: coin only vs card, change available, single vs multi selection, admin refill',
        'Classes: VendingMachine, Inventory, Slot, Product, PaymentCollector, Dispenser, VendingState',
        'selectProduct(code) after sufficient credit → decrement inventory → dispense',
        'cancel → refund inserted amount',
        'Admin mode: restock, collect cash',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: 'Draw state diagram first. Implement insertCoin + selectItem. Discuss change algorithm (greedy coins). State pattern optional but strong signal. Handle concurrent use only if asked — usually single-user machine.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class VendingMachine {
    -inventory: Inventory
    -payment: PaymentCollector
    -state: VendingState
    -dispenser: Dispenser
    +insertCoin(Coin)
    +selectProduct(String code)
    +cancel()
  }
  class VendingState {
    <<interface>>
    +insertCoin()
    +selectProduct()
  }
  class IdleState
  class HasMoneyState
  class Inventory {
    +getSlot(code): Slot
    +decrement(code)
  }
  class Slot {
    -product: Product
    -quantity: int
  }
  VendingState <|.. IdleState
  VendingState <|.. HasMoneyState
  VendingMachine --> VendingState
  VendingMachine --> Inventory`,
    caption: 'State pattern drives valid operations',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Purchase transaction',
      code: `public void selectProduct(String code) {
  Slot slot = inventory.getSlot(code);
  if (slot.getQuantity() == 0) throw new OutOfStockException();
  int price = slot.getProduct().getPriceCents();
  if (payment.getBalanceCents() < price)
    throw new InsufficientFundsException();
  payment.deduct(price);
  inventory.decrement(code);
  dispenser.releaseProduct(code);
  int change = payment.refundRemaining();
  if (change > 0) dispenser.releaseChange(change);
  state = new IdleState(this);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Greedy change dispenser',
      code: `public List<Coin> makeChange(int cents) {
  List<Coin> result = new ArrayList<>();
  for (Coin c : Coin.valuesDescending()) {
    while (cents >= c.value()) {
      result.add(c);
      cents -= c.value();
    }
  }
  return result;
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Clear state machine', 'Teaches atomic purchase', 'Easy to extend payment types'],
    disadvantages: ['Real machines have hardware interlocks', 'Card payment adds gateway scope'],
    alternatives: ['Enum state with switch instead of State classes'],
    whenToUse: ['LLD interviews', 'State pattern teaching'],
    whenNotToUse: ['Full retail POS — much broader'],
  },
  failureModes: [
    'Dispense fails after payment deduct — need rollback/compensation',
    'Cannot make exact change — reject early',
    'Double select on one balance',
    'Inventory negative if no check',
  ],
  interview: {
    expectations: ['State diagram', 'Inventory decrement atomic with dispense', 'Change calculation'],
    commonQuestions: ['Design vending machine', 'State pattern?'],
    followUps: ['Card payment?', 'Admin restock?', 'Multi-item cart?'],
    misconceptions: ['Skip change handling'],
    traps: ['Decrement inventory before confirming payment'],
    strongSignals: ['State pattern', 'Compensation if dispense fails'],
  },
  keyTakeaways: [
    'State machine: idle → has money → dispense.',
    'Validate stock and funds before decrement.',
    'Greedy change from coin denominations.',
    'Rollback if physical dispense fails.',
    'Inventory per slot not global only.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Vending machine states?', answerHint: 'Idle, accepting money, dispensing, possibly maintenance.' },
    { level: 'intermediate', question: 'Insufficient change?', answerHint: 'Reject purchase early or disable coin types; show exact change only.' },
    { level: 'advanced', question: 'Dispense jam after payment?', answerHint: 'Refund or credit; transactional compensating action.' },
  ],
  flashcards: [
    { front: 'State pattern here', back: 'Valid ops depend on idle vs has-money vs dispensing' },
    { front: 'Purchase order', back: 'Check stock → check funds → deduct → dispense → change' },
    { front: 'PaymentCollector', back: 'Tracks inserted coins; deduct/refund' },
    { front: 'Out of stock', back: 'Reject selection; optionally refund' },
  ],
  quickRevision: [
    'States + transitions',
    'Slot = product + qty',
    'insertCoin / selectProduct',
    'Greedy change',
    'Compensate dispense fail',
  ],
}
