import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xc3365e14880Be8dF0845EcFC09dB4c3f76cc04AA',
    abi: ProfilesContract.abi,
    watch: true,
    args,
  }) as any;
};
