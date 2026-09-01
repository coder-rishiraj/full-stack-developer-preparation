import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Food Delivery LLD models customers ordering from restaurants, delivery agents fulfilling trips, real-time order tracking, and payment — classic interview testing entities, state machine, matching algorithm, and concurrency on inventory/menu availability.',
  whyExists:
    'Combines OOD (User, Restaurant, Order, DeliveryAgent), state transitions (PLACED → PREPARING → OUT_FOR_DELIVERY → DELIVERED), geospatial assignment, and scale discussion — closer to real product than parking lot while still bounded for 45-min interview.',
  mentalModel:
    'Customer browses Restaurant menu → Cart → OrderService creates Order → Restaurant accepts/prepares → Dispatch assigns nearest available Agent → Agent picks up and delivers → Payment settles. OrderStatus drives allowed actions; LocationService tracks agent GPS.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: single city, menu variants, scheduled vs instant, payment timing, agent employment model.',
        'Core entities: Customer, Restaurant, MenuItem, Cart, Order, OrderItem, DeliveryAgent, Payment, Address.',
        'OrderService.placeOrder: validate items available, price, create Order PLACED, notify restaurant.',
        'RestaurantService.accept/reject; on accept PREPARING; ready triggers DispatchService.',
        'Dispatch: find agents within radius with status AVAILABLE; assign OUT_FOR_DELIVERY.',
        'Agent updates DELIVERED; PaymentService capture; ratings optional.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview timeline (45 min)',
      text: '5 min requirements + scale hints. 10 min class diagram. 15 min placeOrder + assignAgent flow code. 10 min state machine + extensions. 5 min concurrency and failure handling.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class OrderService {
    +placeOrder(Cart): Order
    +cancelOrder(orderId)
  }
  class Restaurant {
    -menu: List~MenuItem~
    +acceptOrder(Order)
    +markReady(Order)
  }
  class DispatchService {
    +assignAgent(Order): DeliveryAgent
  }
  class DeliveryAgent {
    -location: GeoPoint
    -status: AgentStatus
    +updateLocation(GeoPoint)
  }
  class Order {
    -status: OrderStatus
    -items: List~OrderItem~
  }
  OrderService --> Restaurant
  OrderService --> DispatchService
  DispatchService --> DeliveryAgent
  OrderService --> Order`,
    caption: 'Core services and entities',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Place order with validation',
      code: `public Order placeOrder(UUID customerId, Cart cart) {
  Restaurant r = restaurantRepo.find(cart.getRestaurantId());
  for (CartLine line : cart.getLines()) {
    MenuItem item = r.getMenuItem(line.getItemId());
    if (!item.isAvailable()) throw new ItemUnavailableException(item.getId());
  }
  Order order = Order.create(customerId, r.getId(), cart.toOrderItems(), cart.total());
  orderRepo.save(order);
  notificationService.notifyRestaurant(r, order);
  return order;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Dispatch nearest available agent',
      code: `public DeliveryAgent assignAgent(Order order) {
  GeoPoint pickup = order.getRestaurantLocation();
  return agentRepo.findAvailableNear(pickup, 5.0 /* km */)
      .min(Comparator.comparing(a -> distance(a.getLocation(), pickup)))
      .map(agent -> {
        agent.assignOrder(order.getId());
        order.transitionTo(OUT_FOR_DELIVERY, agent.getId());
        return agent;
      })
      .orElseThrow(() -> new NoAgentAvailableException());
}`,
    },
    {
      language: 'java',
      caption: 'Order state guard',
      code: `public void transitionTo(OrderStatus next, Object... ctx) {
  if (!status.canTransitionTo(next)) {
    throw new IllegalStateException(status + " -> " + next);
  }
  this.status = next;
  domainEvents.publish(new OrderStatusChanged(id, next));
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Rich domain for interview depth', 'Natural state machine discussion', 'Geospatial dispatch extensibility'],
    disadvantages: ['Full real system needs maps, payments, fraud', 'Easy to over-scope microservices in interview'],
    alternatives: ['Central dispatch optimizer vs greedy nearest', 'Batch assignment every N seconds'],
    whenToUse: ['LLD interviews product companies', 'Practice state + matching patterns'],
    whenNotToUse: ['Production without HLD for scale — this is LLD scope'],
  },
  failureModes: [
    'Double order placement — need idempotency key',
    'Agent assigned twice without lock',
    'Menu item sold out after cart checkout race',
    'Restaurant never accepts — timeout cancel',
    'Payment capture fails after delivery',
  ],
  production: {
    reliability: ['Idempotent placeOrder', 'Optimistic lock on menu inventory', 'Saga payment on delivery confirm'],
    scalability: ['Geohash index agents', 'Async notification via queue', 'Read models for menu cache'],
    observability: ['Track order state dwell time', 'Dispatch assignment latency metrics'],
  },
  interview: {
    expectations: ['Entity list', 'Order state diagram', 'Assign agent strategy', 'Handle unavailable item'],
    commonQuestions: ['Design Swiggy/Zomato LLD', 'Assign delivery partner?', 'Order cancellation rules?'],
    followUps: ['Scheduled order?', 'Multi-restaurant cart?', 'Real-time tracking?'],
    misconceptions: ['Jump to Kafka microservices immediately'],
    traps: ['No order status state machine'],
    strongSignals: ['State pattern or guarded transitions', 'Nearest agent with availability', 'Restaurant accept timeout'],
  },
  keyTakeaways: [
    'Entities: Customer, Restaurant, Order, Agent, Cart.',
    'OrderStatus state machine drives workflow.',
    'DispatchService matches nearest AVAILABLE agent.',
    'Validate menu availability at order time.',
    'Discuss idempotency and agent assignment concurrency.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Main classes food delivery?', answerHint: 'Customer, Restaurant, MenuItem, Order, DeliveryAgent, Cart, Payment, DispatchService.' },
    { level: 'intermediate', question: 'Assign delivery agent algorithm?', answerHint: 'Filter AVAILABLE within radius; pick nearest by haversine; lock agent during assign.' },
    { level: 'advanced', question: 'Item unavailable after add to cart?', answerHint: 'Re-validate at checkout; optimistic inventory decrement on place; reject or substitute.' },
  ],
  flashcards: [
    { front: 'OrderStatus flow', back: 'PLACED → PREPARING → OUT_FOR_DELIVERY → DELIVERED' },
    { front: 'DispatchService', back: 'Finds nearest available agent for ready order' },
    { front: 'Cart vs Order', back: 'Cart ephemeral; Order persisted commitment with payment' },
    { front: 'Restaurant accept', back: 'Gate before PREPARING — timeout cancel if no response' },
  ],
  quickRevision: ['Order state machine', 'placeOrder validate', 'Nearest agent dispatch', 'Idempotent orders', 'Notify restaurant'],
}
