import { UserContext } from '@/lib/UserContext';
import { ReactNode, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import useProfilesWrite from '@/hooks/useProfilesWrite';
import { useProfilesSubscriber } from '@/hooks/useProfilesSubscribe';
import { GetStarted } from './GetStart';
import va from '@vercel/analytics';
import useMojoWrite from '@/hooks/useMojoWrite';
import { makeBig, makeNum } from '@/lib/number-utils';
import { useMojoSubscriber } from '@/hooks/useMojoSubscribe';
import { useMojoRead } from '@/hooks/useMojoRead';
import { FundAccount } from './FundAccount';
import Head from 'next/head';
import Navbar from './Navbar';
import FixedBanner from './Fixedbanner';

type Props = {
  children?: ReactNode;
  title?: string;
  sport?: any;
};

const Layout = ({ sport, children }: Props) => {
  const [user, _]: any = useContext(UserContext);
  const [username, setUsername] = useState('');
  const { data: checkWalletAddressExists, isLoading } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'checkWalletAddressExists',
    args: [user?.publicAddress],
  });
  const { data: usernameExists } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'checkUsernameExists',
    args: [username],
  });
  const { data: mintCount } = useMojoRead({
    functionName: 'getMintCount',
    args: [user?.publicAddress],
  });
  const { data: mojoBalance, isLoading: mojoBalanceLoading } = useMojoRead({
    functionName: 'balanceOf',
    args: [user?.publicAddress],
  });
  const { data: mojoAllowance } = useMojoRead({
    functionName: 'allowance',
    args: [user?.publicAddress, sport.betsAddress],
  });
  const [hasProfile, setHasProfile] = useState(checkWalletAddressExists);
  const mojoContract = useMojoWrite();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasTokens, setHasTokens] = useState(false);

  useEffect(() => {
    const balance = parseInt(makeNum(mojoBalance));
    const allowance = parseInt(makeNum(mojoAllowance));
    setIsApproved(balance === allowance);
    if (checkWalletAddressExists) setHasProfile(checkWalletAddressExists);
    if (mintCount?.toNumber() > 0) setHasMinted(true);
    if (balance > 0) setHasTokens(true);
  }, [checkWalletAddressExists, mintCount, mojoAllowance, mojoBalance]);

  const profilesContract = useProfilesWrite(sport.profilesAddress);
  const [loading, setLoading] = useState(false);

  async function handleMint() {
    setIsClaimLoading(true);
    try {
      toast.success('Claiming your tokens ...');
      await mojoContract?.mint(makeBig(100));
    } catch (e) {
      toast.error('Try again.');
      setIsClaimLoading(false);
      va.track('TokensClaimError', {
        address: user?.publicAddress,
      });
      return;
    }
  }

  useMojoSubscriber({
    eventName: 'Transfer',
    listener: (address: string, walletAddress: string, amount: any) => {
      console.log(address, walletAddress, amount);
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress.toLocaleLowerCase()
      ) {
        setHasMinted(true);
        toast.success('Tokens received!');
        va.track('TokensClaims', {
          address: walletAddress,
        });
      }
    },
  });

  async function handleApprove() {
    setIsApproveLoading(true);
    try {
      toast.success('Granting access ...');
      await mojoContract?.approve(sport.betsAddress, mojoBalance);
    } catch (e) {
      toast.error('try again');
      setIsApproveLoading(false);
      va.track('TokensApproveError', {
        address: user?.publicAddress,
      });
      return;
    }
  }

  useMojoSubscriber({
    eventName: 'Approval',
    listener: (walletAddress: string, spender: string, amount: any) => {
      console.log(spender, walletAddress, amount);
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress?.toLocaleLowerCase()
      ) {
        setIsApproveLoading(false);
        setIsApproved(true);
        va.track('TokensClaims', {
          address: walletAddress,
        });
      }
    },
  });

  async function handleCreateProfile() {
    setLoading(true);
    try {
      toast.success('Creating your username ...');
      await profilesContract?.createProfile(username);
    } catch (e) {
      toast.error('try again');
      setLoading(false);
      va.track('ProfileCreatedError', {
        username,
        address: user?.publicAddress,
      });
      return;
    }
  }

  useProfilesSubscriber({
    address: sport.profilesAddress,
    eventName: 'ProfileCreated',
    listener: (id: any, username: string, walletAddress: string) => {
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress.toLocaleLowerCase()
      ) {
        toast.success('Username created!');
        setHasProfile(true);
        va.track('ProfileCreated', {
          profileId: id.toNumber(),
          username,
          address: walletAddress,
        });
      }
    },
  });

  return (
    <div className="flex flex-col h-screen justify-between p-4">
      <Head>
        <title>Mojo | P2P Sports Betting</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="P2P Sports Betting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@davidhurley87" />
        <meta name="twitter:title" content="Mojo" />
        <meta name="twitter:description" content="P2P Sports Betting" />
        <meta
          name="twitter:image"
          content="https://pollock-art.s3.amazonaws.com/meta2.png"
        />
        <meta property="og:url" content={`https://mojo.club`} />
        <meta property="og:title" content="Mojo" />
        <meta property="og:description" content="P2P Sports Betting" />
        <meta
          property="og:image"
          content="https://pollock-art.s3.amazonaws.com/meta2.png"
        />
      </Head>
      <div className="pt-10">
        <FixedBanner />
        <Navbar sport={sport} />
        <div className="container lg:w-1/2 mx-auto lg:px-4 pt-4 pb-20">
          {user === null && <GetStarted />}
          {!mojoBalanceLoading &&
            checkWalletAddressExists !== undefined &&
            !hasTokens && <FundAccount />}
          {user && !isLoading && checkWalletAddressExists === undefined && (
            <div className="text-center pt-28">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-20 h-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {/* has not minted, no approval, no profile */}
          {!isLoading &&
            checkWalletAddressExists !== undefined &&
            !hasMinted && (
              <div className="max-w-sm mx-auto">
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg">Welcome to Mojo!</h2>
                  <p>The rules of the game are simple.</p>
                  <p>Everyone starts with 100 MOJO tokens.</p>
                  <p>
                    You can wager as many tokens as you want on any game. If
                    your team wins, you get your tokens back plus all tokens
                    from someone who is willing to match your commitment.
                  </p>
                  <p>If you run out of tokens you can always buy more.</p>
                  <p>The player with the most tokens wins.</p>
                  <button
                    onClick={handleMint}
                    className={`btn btn-primary ${
                      isClaimLoading
                        ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                        : ''
                    }`}
                  >
                    Claim 100 MOJO Tokens
                  </button>
                </div>
              </div>
            )}

          {/* has minted, no approval, no profile: show approve tokens */}
          {!isLoading &&
            checkWalletAddressExists !== undefined &&
            hasMinted &&
            !isApproved && (
              <div className="max-w-sm mx-auto">
                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-lg">The MOJO Token</h2>
                  <p>This token is not real money yet.</p>
                  <p>For now, it is simply used to keep score.</p>
                  <p>
                    This is the start of a P2P sports betting platform. If you
                    have ideas on how it can be better{' '}
                    <a className="text-primary" href="mailto:david@mojo.com">
                      email me
                    </a>
                    .
                  </p>
                  <button
                    onClick={handleApprove}
                    className={`btn btn-primary mt-2 ${
                      isApproveLoading
                        ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                        : ''
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

          {/* has minted, has approval, no profile: show create profile */}
          {!isLoading &&
            checkWalletAddressExists !== undefined &&
            isApproved &&
            !hasProfile && (
              <div className="max-w-sm mx-auto">
                <div className="form-control">
                  <label className="label">
                    <span className="text-lg">
                      {usernameExists
                        ? 'Username taken. Pick another.'
                        : 'Register a username for this pool.'}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="bond007"
                      className={`w-full pr-16 input input-primary input-bordered ${
                        usernameExists && 'input-error'
                      }`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      disabled={username === '' || usernameExists}
                      onClick={handleCreateProfile}
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

          {/* hasMinted and isApproved and hasProfile: show games */}
          {!isLoading &&
            checkWalletAddressExists !== undefined &&
            hasMinted &&
            isApproved &&
            hasProfile &&
            // hasTokens &&
            children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
