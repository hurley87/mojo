import { useContractEvent } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x7C98F5fb1c227Af0db2F74cCb38e2e40f84F3E27',
    abi: ProfilesContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
