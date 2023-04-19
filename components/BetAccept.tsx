import { useState } from 'react';
import { BigNumber } from 'ethers';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetAccepted } from './BetAccepted';

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
    listener: (id: any) => {
      console.log(id.toNumber());
      setIsLoading(false);
    },
  });

  async function handleAcceptBet() {
    try {
      setIsLoading(true);
      await betsContract?.acceptBet(betValue, betId.toNumber());
      setHasAccepted(true);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  return !hasAccepted ? (
    <button
      onClick={handleAcceptBet}
      className={`btn btn-primary ${
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
