import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, address, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address,
    abi: BetsContract.abi,
    watch: false,
    args,
  }) as any;
};
