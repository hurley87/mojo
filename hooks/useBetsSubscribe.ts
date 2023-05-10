import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xcE8e0E9aF03193aC75d75dD9e8DAB168ab8c4DCc',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
