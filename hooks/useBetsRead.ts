import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
    abi: BetsContract.abi,
    watch: false,
    args,
  }) as any;
};
