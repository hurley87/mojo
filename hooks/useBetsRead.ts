import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xC0d272Fe35E3E45852af12b454AA4AE7e8EE939F',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
