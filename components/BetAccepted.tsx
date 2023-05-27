import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetAccepted = ({
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
  const { data: acceptor } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.acceptor],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {acceptor?.username} accepted
    </button>
  );
};
