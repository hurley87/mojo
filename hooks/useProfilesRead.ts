import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xa4E34Cee12251b0F28e814E0dc332D838F615dB9',
    abi: ProfilesContract.abi,
    watch: false,
    args,
  }) as any;
};
