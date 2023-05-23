import { UserContext } from '@/lib/UserContext';
import { ReactNode, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import useProfilesWrite from '@/hooks/useProfilesWrite';
import { useProfilesSubscriber } from '@/hooks/useProfilesSubscribe';
import { GetStarted } from './GetStart';
import va from '@vercel/analytics';
import BullLottie from './BullLottie';
import useMojoWrite from '@/hooks/useMojoWrite';
import { makeBig, makeNum } from '@/lib/number-utils';
import { useMojoSubscriber } from '@/hooks/useMojoSubscribe';
import { useMojoRead } from '@/hooks/useMojoRead';
import { FundAccount } from './FundAccount';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  children?: ReactNode;
  title?: string;
};

const FixedBanner = () => {
  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed top-0 left-0 w-full bg-primary text-black text-center text-xs p-2"
    >
      <a
        target="_blank"
        href="https://discord.gg/MjT8ZAZtw4"
        className="underline"
      >
        Click here to join our Discord! Get get access to our community and
        product updates.
      </a>
    </div>
  );
};

const Layout = ({ children }: Props) => {
  const [user, _]: any = useContext(UserContext);
  const [username, setUsername] = useState('');
  const { data: checkWalletAddressExists, isLoading } = useProfilesRead({
    functionName: 'checkWalletAddressExists',
    args: [user?.publicAddress],
  });
  const { data: usernameExists } = useProfilesRead({
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
    args: [user?.publicAddress, '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73'],
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

  const profilesContract = useProfilesWrite();
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
        toast.success('Tokens claimed!');
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
      await mojoContract?.approve(
        '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
        mojoBalance
      );
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
        <meta name="twitter:title" content="Mojo | P2P Sports Betting" />
        <meta name="twitter:description" content="P2P Sports Betting" />
        <meta
          name="twitter:image"
          content="https://pollock-art.s3.amazonaws.com/meta.png"
        />
        <meta property="og:url" content={`https://mojo.club`} />
        <meta property="og:title" content="Mojo | P2P Sports Betting" />
        <meta property="og:description" content="P2P Sports Betting" />
        <meta
          property="og:image"
          content="https://pollock-art.s3.amazonaws.com/meta.png"
        />
      </Head>
      <div className="pt-10">
        <FixedBanner />
        <Navbar />
        <div className="container lg:w-1/2 mx-auto lg:px-4 pt-4 pb-20">
          {user === null && <GetStarted />}
          {!mojoBalanceLoading &&
            checkWalletAddressExists !== undefined &&
            !hasTokens && <FundAccount />}
          {user && !isLoading && checkWalletAddressExists === undefined && (
            <div className="max-w-lg mx-auto mt-4">
              <BullLottie />
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
                        : 'Pick your username'}
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
