import { UserContext } from '@/lib/UserContext';
import { useContext, useState } from 'react';
import Games from './Games';
import toast from 'react-hot-toast';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import useProfilesWrite from '@/hooks/useProfilesWrite';
import { useProfilesSubscriber } from '@/hooks/useProfilesSubscribe';

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
  useProfilesSubscriber({
    eventName: 'ProfileCreated',
    listener: (id: any, username: any, walletAddress: any) => {
      console.log('ok');
      console.log(id, username, walletAddress);
    },
  });
  const profilesContract = useProfilesWrite();
  const [loading, setLoading] = useState(false);
  async function handleCreateProfile() {
    setLoading(true);
    await profilesContract?.createProfile(username);
    toast.success('Username added!');
    setLoading(false);
  }

  return (
    <div className={`flex space-x-2 text-sm pt-10`}>
      {!isLoading && hasProfile === undefined && <div>Loading...</div>}
      {!isLoading && hasProfile !== undefined && hasProfile && <Games />}
      {!isLoading && hasProfile !== undefined && !hasProfile && (
        <div>
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
                disabled={username === ''}
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
