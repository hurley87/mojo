import { useContractRead } from 'wagmi';
import DerbyContract from './abis/Derby.json';

export const useDerbyRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xeCe8DBc0faA50b50bb38140667e219a17405735e',
    abi: DerbyContract.abi,
    watch: true,
    args,
  }) as any;
};
