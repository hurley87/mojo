import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xaCBC9b623806c40F4385A0f9179Acd78bFe2271c',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
