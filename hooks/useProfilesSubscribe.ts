import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xc3365e14880Be8dF0845EcFC09dB4c3f76cc04AA',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
