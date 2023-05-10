import { useContractRead } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xfD65660A51fF9A1a6404e1bD51E651293c6cA426',
    abi: MojoContract.abi,
    watch: true,
    args,
  }) as any;
};
