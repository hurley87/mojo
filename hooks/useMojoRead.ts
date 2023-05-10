import { useContractRead } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x5E5676B7016E4C5EC0d2329EF814CD8B1efad808',
    abi: MojoContract.abi,
    watch: true,
    args,
  }) as any;
};
