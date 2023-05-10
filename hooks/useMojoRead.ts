import { useContractRead } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x372fB41b5e2065B02670446b529244921B4F8898',
    abi: MojoContract.abi,
    watch: true,
    args,
  }) as any;
};
