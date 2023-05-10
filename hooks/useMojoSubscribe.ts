import { useContractEvent } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x5E5676B7016E4C5EC0d2329EF814CD8B1efad808',
    abi: MojoContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
