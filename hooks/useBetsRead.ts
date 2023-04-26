import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x3eD00fF99F1671311f04853C7ceA2Ac9A53bfC8c',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
