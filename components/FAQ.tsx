const faqs = [
  {
    question: 'How do I get started?',
    answer:
      'You need a Discord account to get started. Join our Discord server at https://discord.gg/MjT8ZAZtw4 and follow the instructions in the #start-here channel.',
  },
  {
    question: 'What is the prize for winning?',
    answer:
      'The winner gets $500 in USDC. The prize will be distributed after the playoffs are over.',
  },
  {
    question: 'How is the winner determined?',
    answer:
      'The winner is the player with the most tokens at the end of the playoffs. You get tokens by making correct picks.',
  },
  {
    question: 'How do I make picks?',
    answer:
      "Stake MOJO tokens on the team you think will win and have your stake matched by another player. If your team wins, you get your stake back plus your opponent's stake.",
  },
  {
    question: 'How do I get MOJO tokens?',
    answer: 'Everyone starts with 100 MOJO tokens. You can also buy more.',
  },
];

export const FAQ = () => {
  return (
    <div className="w-full flex flex-col gap-4 mt-4 mb-20">
      {faqs.map((faq, index) => (
        <div
          key={index}
          tabIndex={index}
          className="collapse collapse-arrow bg-base-100 rounded-box px-0"
        >
          <div className="collapse-title text-sm lg:text-xl font-medium px-0">
            {faq.question}
          </div>
          <div className="collapse-content px-0">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
