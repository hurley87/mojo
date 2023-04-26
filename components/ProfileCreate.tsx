import { UserContext } from '@/lib/UserContext';
import { useContext, useEffect, useState } from 'react';
import Games from './Games';
import toast from 'react-hot-toast';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import useProfilesWrite from '@/hooks/useProfilesWrite';
import { useProfilesSubscriber } from '@/hooks/useProfilesSubscribe';
import { GetStarted } from './GetStart';
import va from '@vercel/analytics';
import BullLottie from './BullLottie';

export const CreateProfile = () => {
  const [user, _]: any = useContext(UserContext);
  const [username, setUsername] = useState('');
  const { data: hasProfile, isLoading } = useProfilesRead({
    functionName: 'checkWalletAddressExists',
    args: [user?.publicAddress],
  });
  const { data: usernameExists } = useProfilesRead({
    functionName: 'checkUsernameExists',
    args: [username],
  });
  const [showCreate, setShowCreate] = useState(!hasProfile);

  useEffect(() => {
    if (hasProfile) {
      setShowCreate(!hasProfile);
    }
  }, [hasProfile]);

  useProfilesSubscriber({
    eventName: 'ProfileCreated',
    listener: (id: any, username: string, walletAddress: string) => {
      toast.success('username created');
      setShowCreate(false);
      va.track('ProfileCreated', {
        profileId: id.toNumber(),
        username,
        address: walletAddress,
      });
    },
  });

  const profilesContract = useProfilesWrite();
  const [loading, setLoading] = useState(false);

  async function handleCreateProfile() {
    setLoading(true);
    console.log(user);
    try {
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

  return (
    <div className="lg:pt-10 w-full">
      {user === null && <GetStarted />}
      {user && !isLoading && hasProfile === undefined && (
        <div className="max-w-lg mx-auto mt-10">
          <BullLottie />
        </div>
      )}
      {!isLoading && hasProfile !== undefined && !showCreate && <Games />}
      {!isLoading && hasProfile !== undefined && showCreate && (
        <div className="max-w-sm mx-auto mt-10">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
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
                {' '}
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
