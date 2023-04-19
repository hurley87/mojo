import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xF6F7080DE9004187193edA6bD978Aa77B4db60e9',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
