import { useContractEvent } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xfD65660A51fF9A1a6404e1bD51E651293c6cA426',
    abi: MojoContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
