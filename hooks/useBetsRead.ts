import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xE392753b47575c3854397CC827Bc57d8Daa54EDD',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
