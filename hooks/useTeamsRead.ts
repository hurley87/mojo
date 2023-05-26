import { useContractRead } from 'wagmi';
import TeamsContract from './abis/Teams.json';

export const useTeamsRead = ({ functionName, address, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address,
    abi: TeamsContract.abi,
    watch: false,
    args,
  }) as any;
};
