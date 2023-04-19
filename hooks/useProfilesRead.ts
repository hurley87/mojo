import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x23Bb9234B1cc80FbE72707aB137630031eCA524B',
    abi: ProfilesContract.abi,
    watch: false,
    args,
  }) as any;
};
