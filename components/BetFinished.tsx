import { BigNumber } from 'ethers';
import { useRead } from '@/hooks/useRead';

export const BetFinished = ({
  betId,
  sport,
}: {
  betId: BigNumber;
  sport: any;
}) => {
  const { data: bet, isLoading: isBetLoading } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: winner } = useRead({
    contractName: 'Profiles',
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
