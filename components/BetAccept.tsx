import { useContext, useState } from 'react';
import { BigNumber } from 'ethers';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetAccepted } from './BetAccepted';
import va from '@vercel/analytics';
import toast from 'react-hot-toast';
import { sendMessage } from '@/lib/notification';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { UserContext } from '@/lib/UserContext';

export const BetAccept = ({
  counter,
  betId,
}: {
  counter: number;
  betId: BigNumber;
}) => {
  const [user, _]: any = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const betsContract = useBetsWrite();
  const { data: bet } = useBetsRead({
    functionName: 'getBet',
    args: [betId],
  });
  const { data: profile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [user?.publicAddress],
  });
  const { data: creatorProfile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [user?.publicAddress],
  });
  const { data: teamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });

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
      sendMessage(
        `${profile?.username} accepted ${creatorProfile?.username}'s wager on ${teamPicked?.name} for ${counter} MOJO.`
      );
    },
  });

  async function handleAcceptBet() {
    try {
      setIsLoading(true);
      await betsContract?.acceptBet(betId.toNumber());
    } catch (e) {
      console.log(e);
      toast.error('Insufficient funds');
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
      Stake {counter} MOJO
    </button>
  ) : (
    <BetAccepted betId={betId} />
  );
};
