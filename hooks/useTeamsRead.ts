import { useContractRead } from 'wagmi';
import TeamsContract from './abis/Teams.json';

export const useTeamsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xCBFd3a95c0784Dd30ee88d1de2Db292222EA33B9',
    abi: TeamsContract.abi,
    watch: true,
    args,
  }) as any;
};
