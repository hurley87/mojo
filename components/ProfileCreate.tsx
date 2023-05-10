import { UserContext } from '@/lib/UserContext';
import { useContext, useEffect, useState } from 'react';
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
import Hockey from './Hockey';

export const CreateProfile = () => {
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
  const { data: mojoBalance } = useMojoRead({
    functionName: 'balanceOf',
    args: [user?.publicAddress],
  });
  const { data: mojoAllowance } = useMojoRead({
    functionName: 'allowance',
    args: [user?.publicAddress, '0x6DcaB6dCb093495cb1BE6468FDd7f31d0827944a'],
  });
  const [hasProfile, setHasProfile] = useState(checkWalletAddressExists);
  const mojoContract = useMojoWrite();
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const balance = parseFloat(makeNum(mojoBalance));
    const allowance = parseFloat(makeNum(mojoAllowance));
    console.log('hello');
    console.log('profile create', balance, allowance);
    if (balance > 0 && allowance > 0 && balance === allowance)
      setIsApproved(true);
    if (checkWalletAddressExists) setHasProfile(checkWalletAddressExists);
    if (mintCount?.toNumber() > 0) setHasMinted(true);
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
        '0x6DcaB6dCb093495cb1BE6468FDd7f31d0827944a',
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
        user?.publicAddress.toLocaleLowerCase()
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

  console.log('hasMinted', hasMinted);
  console.log('isApproved', isApproved);
  console.log('hasProfile', hasProfile);

  return (
    <div className="lg:pt-10 w-full">
      {user === null && <GetStarted />}
      {user && !isLoading && checkWalletAddressExists === undefined && (
        <div className="max-w-lg mx-auto mt-4">
          <BullLottie />
        </div>
      )}

      {/* has not minted, no approval, no profile */}
      {!isLoading && checkWalletAddressExists !== undefined && !hasMinted && (
        <div className="max-w-sm mx-auto">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-lg">Welcome to Mojo!</h2>
            <p>The rules of the game are simple.</p>
            <p>Everyone starts with 100 MOJO tokens.</p>
            <p>
              You can wager as many tokens as you want on any game. If your team
              wins, you get your tokens back plus all tokens from someone who is
              willing to match your commitment.
            </p>
            <p>If you run out of tokens you can always buy more.</p>
            <p>The winner is the player with the most tokens.</p>
            <p>
              <a
                target="_blank"
                className="text-primary"
                href="https://discord.gg/MjT8ZAZtw4"
              >
                Open this link in a new tab
              </a>{' '}
              to join our Discord server for more info on the game.
            </p>
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
            <div className="pt-10 flex flex-col gap-4">
              <h2 className="font-bold text-lg">The MOJO Token</h2>
              <p>This token is not real money.</p>
              <p>For now, it is simply used to keep score.</p>
              <p>
                This is an onchain fantasy hockey pool, not a gambling website.
              </p>
              <p>
                Though this token is a cryptocurrency, {"it's"} not designed to
                make you rich.
              </p>
              <button
                onClick={handleApprove}
                className={`btn btn-primary ${
                  isApproveLoading
                    ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                    : ''
                }`}
              >
                I understand
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
        hasProfile && <Hockey />}
    </div>
  );
};
