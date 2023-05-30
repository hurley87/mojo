import { useContractRead } from 'wagmi';
import { useABI } from './abis/useABI';

export const useRead = ({ contractName, functionName, address, args }: any) => {
  const abi = useABI({ contractName });
  return useContractRead({
    chainId: 84531,
    functionName,
    address,
    abi,
    watch: false,
    args,
  }) as any;
};
