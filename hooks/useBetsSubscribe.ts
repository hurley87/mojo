import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xE392753b47575c3854397CC827Bc57d8Daa54EDD',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
