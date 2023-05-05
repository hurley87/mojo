import { useContractEvent } from 'wagmi';
import DerbyContract from './abis/Derby.json';

export const useDerbySubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xeCe8DBc0faA50b50bb38140667e219a17405735e',
    abi: DerbyContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
