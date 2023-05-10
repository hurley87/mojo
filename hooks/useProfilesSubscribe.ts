import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xbFC6dfa970e68EC22393bE7916a0700fbe509925',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
