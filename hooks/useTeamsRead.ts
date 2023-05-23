import { useContractRead } from 'wagmi';
import TeamsContract from './abis/Teams.json';

export const useTeamsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x44Fa31488779C90d88d4C31D7D1184Ea7cf8dA3b',
    abi: TeamsContract.abi,
    watch: false,
    args,
  }) as any;
};
