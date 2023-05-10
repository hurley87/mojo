import { useContractEvent } from 'wagmi';
import BetsContract from './abis/Bets.json';

export const useBetsSubscriber = ({ eventName, listener }: any) => {
  return useContractEvent({
    chainId: 84531,
    eventName,
    address: '0x6DcaB6dCb093495cb1BE6468FDd7f31d0827944a',
    abi: BetsContract.abi,
    listener: listener as (...args: unknown[]) => void,
  });
};
