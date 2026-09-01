import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'State-machine DP models decisions across days/steps with explicit states—e.g. hold stock, sold, cooldown—where dp[day][state] = best value ending day in state after valid transitions. Classic: Best Time to Buy and Sell Stock I/II/III/IV with/without cooldown/fee.',
  whyExists:
    'Greedy fails when transactions have constraints (max k trades, cooldown day, fee per trade). Encoding legal positions as states turns the problem into finite DP over days × states with O(1) transitions per state.',
  mentalModel:
    'You are always in one mode: holding shares, free to buy, or in cooldown. Each day you transition between modes with rules; track max profit per mode.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Define states: e.g. CASH (can buy), HOLD (own stock), COOLD (sold yesterday).',
        'Transitions per day price p: CASH = max(CASH, COOLD); HOLD = max(HOLD, CASH - p); COOLD = HOLD + p (if sell).',
        'Stock II (unlimited): hold = max(hold, cash - p); cash = max(cash, hold + p).',
        'Stock IV (at most k): dp[day][trans][hold 0/1] or optimize k dimension if k large.',
        'Init: cash=0, hold=-INF or -prices[0] after buy day0.',
        'Answer: max cash states at last day (not holding usually).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'k transactions optimization',
      text: 'When k ≥ n/2, equivalent to unlimited trades—use Stock II O(n) two-state DP instead of O(n·k).',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Prices [1,2,3,0,2] unlimited trades: day0 hold=-1; day1 cash=1 hold=-1; day2 cash=2; ... capture buy low sell high repeatedly via cash/hold max transitions.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Stock II unlimited transactions',
      code: `int maxProfit(int[] prices) {
    int cash = 0, hold = Integer.MIN_VALUE / 2;
    for (int p : prices) {
        hold = Math.max(hold, cash - p);
        cash = Math.max(cash, hold + p);
    }
    return cash;
}`,
    },
    {
      language: 'java',
      caption: 'Stock with cooldown',
      code: `int maxProfitCooldown(int[] prices) {
    int sold = 0, hold = Integer.MIN_VALUE / 2, rest = 0;
    for (int p : prices) {
        int prevSold = sold;
        sold = hold + p;
        hold = Math.max(hold, rest - p);
        rest = Math.max(rest, prevSold);
    }
    return Math.max(sold, rest);
}`,
    },
    {
      language: 'java',
      caption: 'At most k transactions',
      code: `int maxProfitK(int k, int[] prices) {
    if (k >= prices.length / 2) return maxProfitUnlimited(prices);
    int[][] buy = new int[k + 1][prices.length];
    int[][] sell = new int[k + 1][prices.length];
    for (int t = 1; t <= k; t++) buy[t][0] = -prices[0];
    for (int i = 1; i < prices.length; i++)
        for (int t = 1; t <= k; t++) {
            buy[t][i] = Math.max(buy[t][i-1], sell[t-1][i-1] - prices[i]);
            sell[t][i] = Math.max(sell[t][i-1], buy[t][i-1] + prices[i]);
        }
    return sell[k][prices.length - 1];
}`,
    },
  ],
  complexity: {
    average: 'O(n) for fixed small state count; O(n·k) for k transactions',
    space: 'O(1) rolling two-state; O(n·k) full table',
  },
  patternRecognition: [
    'Best Time to Buy and Sell Stock series.',
    'DP with hold/sold/cooldown states.',
    'Finite state automaton on sequence.',
    'House robber with adjacent constraint (prev state).',
  ],
  commonMistakes: [
    'Init hold = 0 instead of -INF or -price[0].',
    'Return hold at end instead of cash/sold.',
    'O(n·k) when k large without k≥n/2 shortcut.',
    'Wrong transition order within same day (use temp vars).',
  ],
  tradeoffs: {
    advantages: [
      'Handles complex transaction rules systematically',
      'O(n) for constant states',
      'Clear transition table for interview explanation',
    ],
    disadvantages: [
      'State design non-obvious without practice',
      'k dimension costly if k large',
      'Greedy tempting but wrong on cooldown/fee',
    ],
    alternatives: ['Greedy for single transaction only', 'Valley-peak pairing for unlimited no fee'],
    whenToUse: ['Transaction limits, cooldown, fee', 'Sequence DP with modes', 'Clear finite states per step'],
    whenNotToUse: ['Single buy-sell once (min/max scan)', 'Unlimited with k≥n/2 use simple II'],
  },
  failureModes: [
    'Integer overflow on hold init—use MIN_VALUE/2.',
    'Same-day buy-sell not allowed—order transitions carefully.',
    'Fee: subtract on buy or sell consistently in transitions.',
  ],
  interview: {
    expectations: [
      'Define states and transitions',
      'Stock II cash/hold template',
      'O(n) time for constant states',
    ],
    commonQuestions: ['Stock I/II/III/IV', 'Cooldown and fee variants', 'State machine definition'],
    followUps: ['Optimize space to O(1)?', 'When k≥n/2?', 'Draw transition diagram?'],
    misconceptions: ['Always greedy valley-peak', 'One dp[i] profit enough for cooldown', 'Must use 2D day×state always'],
    traps: ['Init hold wrong', 'Sell and buy same day when forbidden'],
    strongSignals: ['Draws state diagram', 'Knows k≥n/2 trick', 'Separates cash/hold/cooldown cleanly'],
  },
  keyTakeaways: [
    'States = legal positions (cash, hold, cooldown).',
    'Each day: max over stay vs transition.',
    'Stock II: hold=max(hold,cash-p); cash=max(cash,hold+p).',
    'k transactions: buy[t], sell[t] tables or shortcut if k large.',
    'Answer usually max non-holding state at end.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Stock II unlimited DP states?', answerHint: 'cash (not holding), hold (holding one share); update each day with max transitions.' },
    { level: 'intermediate', question: 'Cooldown state machine?', answerHint: 'rest after sell cannot buy; sold=hold+p; hold=max(hold,rest-p); rest=max(rest,prevSold).' },
    { level: 'advanced', question: 'Why k≥n/2 reduces to unlimited?', answerHint: 'At most n/2 profitable round trips; constraint never binding—use O(n) two-state.' },
  ],
  flashcards: [
    { front: 'Stock II transition', back: 'hold=max(hold,cash-p); cash=max(cash,hold+p).' },
    { front: 'hold initial value', back: '-INF or -prices[0] after first buy—not 0.' },
    { front: 'k large shortcut', back: 'If k >= n/2 use unlimited O(n) solution.' },
  ],
  quickRevision: [
    'States: cash/hold/cooldown',
    'Max stay vs transition daily',
    'Stock II O(n) two vars',
    'Init hold negative',
    'k≥n/2 → unlimited',
    'Fee in buy or sell',
    'Return max cash/sold',
  ],
}
