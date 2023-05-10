import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xc60ACe68563bc0F5EdFB3246CFaEda0ff03B61c9',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
