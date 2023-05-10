import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import BetsContract from './abis/Bets.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';

const relay = new GelatoRelay();

export type Amount = BigNumber;

export interface Transfer {
  from: string;
  to: string;
  amount: BigNumber;
}

const useBetsWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const contract = wagmi.useContract({
      address: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
      abi: BetsContract.abi,
      signerOrProvider: signer,
    });

    const createBet = async (
      gameId: number,
      teamId: number,
      amount: number,
      counter: number
    ): Promise<string> => {
      console.log('createBet', gameId, teamId, amount, counter);
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.createBet(
            gameId,
            teamId,
            amount,
            counter
          );

          const request: any = {
            chainId: 84531,
            target: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
            data: data,
            user: await signer.getAddress(),
          };
          const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
          const response = await relay.sponsoredCallERC2771(
            request,
            provider,
            apiKey
          );

          const taskId = response.taskId;
          console.log('response', taskId);

          return taskId;
        } else return '';
      } catch (e: any) {
        console.log('e', e);
        return new Error('insufficient funds').message;
      }
    };

    const cancelBet = async (betId: number): Promise<string> => {
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.cancelBet(betId);

          const request: any = {
            chainId: 84531,
            target: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
            data: data,
            user: await signer.getAddress(),
          };
          const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
          const response = await relay.sponsoredCallERC2771(
            request,
            provider,
            apiKey
          );

          const taskId = response.taskId;
          console.log('response', taskId);

          return taskId;
        } else return '';
      } catch (e) {
        console.log('e', e);
        return '';
      }
    };

    const acceptBet = async (betId: number): Promise<string> => {
      if (contract) {
        const { data } = await contract.populateTransaction.acceptBet(betId);

        const request: any = {
          chainId: 84531,
          target: '0x9362dbBbfe513Ca553F627B2e57fE98122d22A73',
          data: data,
          user: await signer.getAddress(),
        };
        const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
        const response = await relay.sponsoredCallERC2771(
          request,
          provider,
          apiKey
        );

        const taskId = response.taskId;
        console.log('response', taskId);

        return taskId;
      } else return '';
    };

    return {
      contract: contract,
      chainId: 84531,
      createBet,
      cancelBet,
      acceptBet,
    };
  }
};

export default useBetsWrite;
