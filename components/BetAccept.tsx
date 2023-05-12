import { useState } from 'react';
import { BigNumber } from 'ethers';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetAccepted } from './BetAccepted';
import va from '@vercel/analytics';
import toast from 'react-hot-toast';

export const BetAccept = ({
  counter,
  betId,
}: {
  counter: number;
  betId: BigNumber;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const betsContract = useBetsWrite();

  useBetsSubscriber({
    eventName: 'BetAccepted',
    listener: (id: any, creator: string, acceptor: string) => {
      console.log('BetAccepted', id.toNumber(), creator, acceptor);
      va.track('BetAccepted', {
        betId: id.toNumber(),
        counter,
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
      console.log('accepting bet', betId.toNumber());
      await betsContract?.acceptBet(betId.toNumber());
    } catch (e) {
      console.log(e);
      toast.error('Inufficient funds');
      setIsLoading(false);
      va.track('BetAcceptedError', { betId: betId.toNumber() });
    }
  }

  return !hasAccepted ? (
    <button
      onClick={handleAcceptBet}
      className={`btn btn-primary btn-outline ${
        isLoading
          ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
          : ''
      }`}
    >
      Accept for {counter} MOJO
    </button>
  ) : (
    <BetAccepted betId={betId} />
  );
};
