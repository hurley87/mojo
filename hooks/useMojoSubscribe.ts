import { useContractEvent } from 'wagmi';
import MojoContract from './abis/Mojo.json';

export const useMojoSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x372fB41b5e2065B02670446b529244921B4F8898',
    abi: MojoContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
