import * as wagmi from 'wagmi';
import BetsContract from './abis/Bets.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { getaloRequest } from '@/lib/gelato';

const useBetsWrite = (address: string) => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const contract = wagmi.useContract({
      address,
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
          return await getaloRequest(address, data, provider);
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
          return await getaloRequest(address, data, provider);
        } else return '';
      } catch (e) {
        console.log('e', e);
        return '';
      }
    };

    const acceptBet = async (betId: number): Promise<string> => {
      if (contract) {
        const { data } = await contract.populateTransaction.acceptBet(betId);
        return await getaloRequest(address, data, provider);
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
