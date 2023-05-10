import { useContractRead } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x6DcaB6dCb093495cb1BE6468FDd7f31d0827944a',
    abi: BetsContract.abi,
    watch: true,
    args,
  }) as any;
};
