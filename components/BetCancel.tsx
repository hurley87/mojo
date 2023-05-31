import { useState } from 'react';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useSubscribe } from '@/hooks/useSubscribe';
import { BetCancelled } from './BetCancelled';
import va from '@vercel/analytics';
import { useRead } from '@/hooks/useRead';
import { sendMessage } from '@/lib/notification';

export const BetCancel = ({ betId, sport }: { betId: string; sport: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const betsContract = useBetsWrite(sport.betsAddress);
  const { data: bet } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: profile } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useRead({
    contractName: 'Teams',
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });

  useSubscribe({
    contractName: 'Bets',
    address: sport.betsAddress,
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
