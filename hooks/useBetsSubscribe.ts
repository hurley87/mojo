import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
