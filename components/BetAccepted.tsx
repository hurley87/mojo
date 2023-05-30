import { BigNumber } from 'ethers';
import { useRead } from '@/hooks/useRead';

export const BetAccepted = ({
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
  const { data: acceptor } = useRead({
    contractName: 'Profiles',
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
