import { useContext } from 'react';
import { makeNum } from '@/lib/number-utils';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { UserContext } from '@/lib/UserContext';
import { horses } from '@/lib/horses';
import { useDerbyRead } from '@/hooks/useDerbyRead';

export const DerbyBet = ({ bet }: { bet: any }) => {
  const [user, _]: any = useContext(UserContext);
  const { data: profile, isLoading: isProfileLoading } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [bet?.bettor],
  });
  const { data: horsePoolAmount, isLoading } = useDerbyRead({
    functionName: 'getTotalAmountBetOnHorse',
    args: [bet?.horseNumber.toNumber()],
  });
  const { data: totalBets, isLoading: totalBetsLoading } = useDerbyRead({
    functionName: 'totalBets',
    args: [],
  });

  return user?.loading ? (
    <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
  ) : (
    <div
      className={`flex justify-between ${
        bet?.horseNumber.toNumber() === 6 && 'bg-blue-900'
      }`}
    >
      {(isProfileLoading || isLoading || totalBetsLoading) && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isProfileLoading && !isLoading && !totalBetsLoading && (
        <p className="text-sm lg:text-md">
          {profile?.username} bet {makeNum(bet?.amount)} ETH on{' '}
          {horses[bet?.horseNumber.toNumber()]}
        </p>
      )}
      {!isProfileLoading && !isLoading && !totalBetsLoading && (
        <p className="text-green-500 text-sm lg:text-md">
          {makeNum(bet?.amount.mul(totalBets).div(horsePoolAmount))} ETH
        </p>
      )}
    </div>
  );
};
