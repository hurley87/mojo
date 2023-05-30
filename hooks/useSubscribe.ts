import { useContractEvent } from 'wagmi';
import { useABI } from './abis/useABI';

export const useSubscribe = ({
  contractName,
  eventName,
  address,
  listener,
}: any) => {
  const abi = useABI({ contractName });
  return useContractEvent({
    chainId: 84531,
    eventName,
    address,
    abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
