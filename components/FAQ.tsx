const faqs = [
  {
    question: 'How do I get started?',
    answer: 'tabIndex={0} attribute is necessary to make the div focusable',
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
    <div className="w-full flex flex-col gap-4 my-10">
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
            <p className="text-xs lg:text-md">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
