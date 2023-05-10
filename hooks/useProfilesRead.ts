import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xc60ACe68563bc0F5EdFB3246CFaEda0ff03B61c9',
    abi: ProfilesContract.abi,
    watch: true,
    args,
  }) as any;
};
