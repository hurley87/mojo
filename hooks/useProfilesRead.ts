import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xaCBC9b623806c40F4385A0f9179Acd78bFe2271c',
    abi: ProfilesContract.abi,
    watch: true,
    args,
  }) as any;
};
