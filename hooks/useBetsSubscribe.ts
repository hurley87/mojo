import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0xC0d272Fe35E3E45852af12b454AA4AE7e8EE939F',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
