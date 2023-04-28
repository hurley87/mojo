import { useContractRead } from 'wagmi';
import ProfilesContract from './abis/Profiles.json';

export const useProfilesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x7C98F5fb1c227Af0db2F74cCb38e2e40f84F3E27',
    abi: ProfilesContract.abi,
    watch: true,
    args,
  }) as any;
};
