import { useState } from 'react';
import { BigNumber } from 'ethers';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetCancelled } from './BetCancelled';
import va from '@vercel/analytics';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { sendMessage } from '@/lib/notification';
import { useTeamsRead } from '@/hooks/useTeamsRead';

export const CancelBet = ({
  betId,
  contract,
}: {
  betId: string;
  contract: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const betsContract = useBetsWrite(contract.bets);
  const { data: bet } = useBetsRead({
    address: contract.bets,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: profile } = useProfilesRead({
    address: contract.profiles,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useTeamsRead({
    address: contract.teams,
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });

  useBetsSubscriber({
    address: contract.bets,
    eventName: 'BetCancelled',
    listener: (id: any) => {
      va.track('BetCancelled', { betId: id.toNumber() });
      setIsCancelled(true);
      sendMessage(
        `${profile?.username} cancelled their wager on ${teamPicked?.name}.`
      );
    },
  });

  async function handleCancelBet() {
    try {
      setIsLoading(true);
      await betsContract?.cancelBet(parseInt(betId));
    } catch (e) {
      console.log(e);
      va.track('BetCancelledError', { betId: parseInt(betId) });
      setIsLoading(false);
    }
  }

  return isCancelled || bet?.state === 3 ? (
    <BetCancelled />
  ) : (
    <button
      onClick={handleCancelBet}
      className={`btn btn-primary btn-md btn-outline ${
        isLoading
          ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
          : ''
      }`}
    >
      cancel bet
    </button>
  );
};
