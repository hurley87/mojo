import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x23Bb9234B1cc80FbE72707aB137630031eCA524B',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
