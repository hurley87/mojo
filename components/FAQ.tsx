const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'You need a Discord account to get started. In Discord, you can join the server by clicking the link in the top right corner of the page.',
  },
  {
    question: 'How do I place a bet?',
    answer: 'tabIndex={1} attribute is necessary to make the div focusable',
  },
  {
    question: 'How do you make money?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'How are you only able to charge 1%?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'What currency do I bet with?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'How can I get more testnet ETH?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'When are bets closed?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'How do I check my balance?',
    answer: 'tabIndex={2} attribute is necessary to make the div focusable',
  },
  {
    question: 'How do I withdraw my winnings?',
    answer: 'tabIndex={3} attribute is necessary to make the div focusable',
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
          <div className="collapse-title text-sm lg:text-2xl font-medium">
            {faq.question}
          </div>
          <div className="collapse-content">
            <p className="text-xs lg:text-lg">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
