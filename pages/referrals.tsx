import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/lib/UserContext';
import { useRead } from '@/hooks/useRead';
import useReferralsWrite from '@/hooks/useReferralsWrite';
import toast from 'react-hot-toast';
import va from '@vercel/analytics';
import { useSubscribe } from '@/hooks/useSubscribe';
import Referrals from '@/components/Referrals';
import FixedBanner from '@/components/Fixedbanner';
import LayoutSecondary from '@/components/LayoutSecondary';

export default function ReferralsPage() {
  const [user, _]: any = useContext(UserContext);
  const address = '0x0E82AEB3ce2c93e6AA0336927e91c33CB5bDbfc0';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: link } = useRead({
    contractName: 'Referrals',
    address,
    functionName: 'hasLink',
    args: [user?.publicAddress],
  });
  const { data: codeExists } = useRead({
    contractName: 'Referrals',
    address,
    functionName: 'hasCode',
    args: [code],
  });
  const { data: myCode } = useRead({
    contractName: 'Referrals',
    address,
    functionName: 'getMyLink',
    args: [user?.publicAddress],
  });
  const referralContract = useReferralsWrite(address);
  const [hasLink, setHasLink] = useState(false);

  useEffect(() => {
    if (link) setHasLink(true);
  }, [link]);

  async function handleCreateLink() {
    setLoading(true);
    try {
      toast.success('Creating your referral code ...');
      await referralContract?.createLink(code);
    } catch (e) {
      toast.error('Try again.');
      va.track('TokensClaimError', {
        address: user?.publicAddress,
      });
      return;
    }
  }

  useSubscribe({
    contractName: 'Referrals',
    address,
    eventName: 'LinkCreated',
    listener: (id: any, username: string, walletAddress: string) => {
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress.toLocaleLowerCase()
      ) {
        toast.success('Referral code created!');
        setHasLink(true);
        va.track('ProfileCreated', {
          profileId: id.toNumber(),
          username,
          address: walletAddress,
        });
      }
    },
  });

  return (
    <LayoutSecondary>
      <FixedBanner url="/" text="Head back to MOJO" />
      <div className="hero pt-10">
        <div className="text-center hero-content">
          <div className="max-w-4xl pt-10">
            <h1 className="mb-3 text-3xl md:text-3xl lg:text-5xl font-bold">
              Earn MOJO Tokens
            </h1>
            <p className="mb-6 text-sm lg:text-lg max-w-2xl mx-auto">
              Each person that uses your referral code will have to initiate and
              finish one bet before you can claim your reward. The reward is 10
              MOJO tokens for each referral.
            </p>
            {hasLink ? (
              <>
                <p className="text-sm lg:text-lg">
                  Your referral code is{' '}
                  <span className="font-black text-green-500">
                    {code === '' ? myCode?.code : code}
                  </span>
                  .
                </p>
                <Referrals address={address} />
              </>
            ) : (
              <div className="max-w-sm mx-auto">
                <div className="form-control">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="choose your referral code"
                      className={`w-full pr-16 input input-primary input-bordered ${
                        codeExists && 'input-error'
                      }`}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                      disabled={code === '' || codeExists}
                      onClick={handleCreateLink}
                      className={`absolute top-0 right-0 rounded-l-none btn btn-primary ${
                        loading
                          ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                          : ''
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutSecondary>
  );
}
