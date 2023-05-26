import { BigNumber } from 'ethers';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';

export const BetAccepted = ({
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
  const { data: acceptor } = useProfilesRead({
    address: contract.profiles,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.acceptor],
  });

  return (
    <button disabled={true} className={`btn ${isBetLoading && 'loading'}`}>
      {acceptor?.username} accepted
    </button>
  );
};
