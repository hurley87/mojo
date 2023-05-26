import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetFinished = ({
  betId,
  contract,
}: {
  betId: BigNumber;
  contract: any;
}) => {
  const { data: bet, isLoading: isBetLoading } = useBetsRead({
    address: contract.bets,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: winner } = useProfilesRead({
    address: contract.profiles,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.winner],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {winner?.username} won
    </button>
  );
};
