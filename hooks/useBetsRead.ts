import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xF6F7080DE9004187193edA6bD978Aa77B4db60e9',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
