import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({
  eventName,
  address,
  listener,
}: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address,
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
