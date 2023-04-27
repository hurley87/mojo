const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'You need a Discord account to get started. Join our Discord server at https://discord.gg/MjT8ZAZtw4 and follow the instructions in the #start-here channel.',
  },
  {
    question: 'How do I place a bet?',
    answer:
      'Pick a game, pick a team, the amount you want to bet and the odds you want to bet at. Then click the "Place Bet" button. Someone will have to accept your bet before it is placed.',
  },
  {
    question: 'How do you make money?',
    answer: 'We take 1% of the amount from each bet.',
  },
  {
    question: 'How are you only able to charge 1%?',
    answer:
      'We use the blockchain to cut out the middleman. We can charge less because all bets are managed by code. ',
  },
  {
    question: 'What currency do I bet with?',
    answer: 'This is built on Base. You can get testnet ETH directly from us.',
  },
  {
    question: 'When are bets closed and winnings distributed?',
    answer:
      'We close bets before the game starts and winnings are distributed after the game ends.',
  },
  {
    question: 'How do I check my balance?',
    answer: 'You can check your balance in the top right corner of the page.',
  },
  {
    question: 'How do I withdraw my winnings?',
    answer: 'Reach out to our support team to withdraw your winnings.',
  },
];

export const FAQ = () => {
  return (
    <div className="w-full flex flex-col gap-4 mt-10 mb-20">
      {faqs.map((faq, index) => (
        <div
          key={index}
          tabIndex={index}
          className="collapse collapse-arrow bg-base-100 rounded-box"
        >
          <div className="collapse-title text-sm lg:text-xl font-medium">
            {faq.question}
          </div>
          <div className="collapse-content">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
