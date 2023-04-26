import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x3eD00fF99F1671311f04853C7ceA2Ac9A53bfC8c',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
