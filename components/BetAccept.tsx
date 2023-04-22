import { useState } from 'react';
import { BigNumber } from 'ethers';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetAccepted } from './BetAccepted';
import va from '@vercel/analytics';

export const BetAccept = ({
  betValue,
  betId,
}: {
  betValue: string;
  betId: BigNumber;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const betsContract = useBetsWrite();

  useBetsSubscriber({
    eventName: 'BetAccepted',
    listener: (id: any, creator: string, acceptor: string) => {
      va.track('BetAccepted', {
        betId: id.toNumber(),
        betValue,
        creator,
        acceptor,
      });
      setHasAccepted(true);
      setIsLoading(false);
    },
  });

  async function handleAcceptBet() {
    try {
      setIsLoading(true);
      await betsContract?.acceptBet(betValue, betId.toNumber());
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      va.track('BetAcceptedError', { betId: betId.toNumber() });
    }
  }

  return !hasAccepted ? (
    <button
      onClick={handleAcceptBet}
      className={`btn ${
        isLoading
          ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
          : ''
      }`}
    >
      accept
    </button>
  ) : (
    <BetAccepted betId={betId} />
  );
};
