import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xcE8e0E9aF03193aC75d75dD9e8DAB168ab8c4DCc',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
