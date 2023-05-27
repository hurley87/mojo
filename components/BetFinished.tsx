import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetFinished = ({
  betId,
  sport,
}: {
  betId: BigNumber;
  sport: any;
}) => {
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: winner } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.winner],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {winner?.username} won
    </button>
  );
};
