import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, address, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address,
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
