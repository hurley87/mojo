import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xa4E34Cee12251b0F28e814E0dc332D838F615dB9',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
