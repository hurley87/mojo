import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import DerbyBetsContract from './abis/Derby.json';
import { utils, ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';

export type Amount = BigNumber;

export interface Transfer {
  from: string;
  to: string;
  amount: BigNumber;
}

const useDerbyWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const contract = wagmi.useContract({
      address: '0xeCe8DBc0faA50b50bb38140667e219a17405735e',
      abi: DerbyBetsContract.abi,
      signerOrProvider: signer,
    });

    const placeBet = async (
      horseId: number,
      betValue: string
    ): Promise<string> => {
      console.log('createBet', horseId, betValue);
      try {
        if (contract) {
          const tx = await contract.placeBet(horseId, {
            value: utils.parseEther(betValue),
          });
          const receipt = await tx.wait();
          console.log(receipt);

          return receipt.transactionHash;
        } else return '';
      } catch (e: any) {
        console.log('e', e);
        return new Error('insufficient funds').message;
      }
    };

    return {
      contract: contract,
      chainId: 84531,
      placeBet,
    };
  }
};

export default useDerbyWrite;
