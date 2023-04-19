import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetFinished = ({ betId }: { betId: BigNumber }) => {
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    functionName: 'getBet',
    args: [betId],
  });
  const { data: winner } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [bet?.winner],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {winner?.username} won
    </button>
  );
};
