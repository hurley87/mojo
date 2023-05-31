import { useContext, useState } from 'react';
import { BigNumber } from 'ethers';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';
import { makeBig } from '@/lib/number-utils';
import toast from 'react-hot-toast';
import useMojoWrite from '@/hooks/useMojoWrite';
import { useSubscribe } from '@/hooks/useSubscribe';
import va from '@vercel/analytics';

export const Referral = ({
  referralId,
  sport,
  mintCount,
  index,
}: {
  referralId: BigNumber;
  sport: any;
  mintCount: number;
  index: number;
}) => {
  const [user, _]: any = useContext(UserContext);
  const { data: referral, isLoading: isReferralLoading } = useRead({
    contractName: 'Referrals',
    address: sport.referralsAddress,
    functionName: 'getReferral',
    args: [referralId.toNumber()],
  });
  const { data: profile, isLoading: isProfileLoading } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [referral?.walletAddress],
  });
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const mojoContract = useMojoWrite(sport?.mojoAddress);
  console.log('referral', referralId);
  console.log(profile);
  console.log('mintCount', mintCount);
  console.log('index', index + 1);
  async function handleClaimReward() {
    setIsClaimLoading(true);
    try {
      toast.success('Claiming your reward ...');
      await mojoContract?.mint(makeBig(10));
    } catch (e) {
      toast.error('Try again.');
      setIsClaimLoading(false);
      return;
    }
  }

  useSubscribe({
    contractName: 'Mojo',
    address: sport?.mojoAddress,
    eventName: 'Transfer',
    listener: (address: string, walletAddress: string, amount: any) => {
      console.log(address, walletAddress, amount);
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress.toLocaleLowerCase()
      ) {
        setHasMinted(true);
        toast.success('Reward sent!');
        va.track('Reward Claimed', {
          address: walletAddress,
        });
      }
    },
  });

  return user?.loading ? (
    <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
  ) : (
    <div className={`flex`}>
      {isReferralLoading && (
        <div className="h-10 w-full animate-pulse bg-primary-focus rounded-md"></div>
      )}
      {!isReferralLoading && profile?.username && (
        <div className="flex flex-col md:flex-row md:justify-between w-full">
          <div className="flex flex-col gap-0">
            <p className="text-sm lg:text-2xl font-bold">{profile?.username}</p>
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-sm lg:text-md font-bold">
              {profile?.betCount.toNumber() > 0 &&
                mintCount <= index + 1 &&
                !hasMinted && (
                  <button
                    onClick={handleClaimReward}
                    className={`btn btn-sm btn-primary btn-outline ${
                      isClaimLoading
                        ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                        : ''
                    }`}
                  >
                    claim reward
                  </button>
                )}
              {profile?.betCount.toNumber() > 0 && mintCount > index + 1 && (
                <button
                  disabled={true}
                  className="btn btn-sm btn-primary btn-outline"
                >
                  reward claimed
                </button>
              )}
              {profile?.betCount.toNumber() === 0 && (
                <button
                  disabled={true}
                  className="btn btn-sm btn-primary btn-outline"
                >
                  0 bets
                </button>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
