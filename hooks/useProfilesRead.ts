import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xbFC6dfa970e68EC22393bE7916a0700fbe509925',
    abi: ProfilesContract.abi,
    watch: true,
    args,
  }) as any;
};
