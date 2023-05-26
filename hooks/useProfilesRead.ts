import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, address, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address,
    abi: ProfilesContract.abi,
    watch: false,
    args,
  }) as any;
};
