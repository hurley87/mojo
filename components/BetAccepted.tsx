import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetAccepted = ({ betId }: { betId: BigNumber }) => {
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    functionName: 'getBet',
    args: [betId],
  });
  const { data: acceptor } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [bet?.acceptor],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {acceptor?.username} accepted
    </button>
  );
};
