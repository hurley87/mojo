import { useContractRead } from 'wagmi';
import TeamsContract from './abis/Teams.json';

export const useTeamsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xb716a93D76C0DA3f02CC502ca22c507fE11bCcC5',
    abi: TeamsContract.abi,
    watch: true,
    args,
  }) as any;
};
