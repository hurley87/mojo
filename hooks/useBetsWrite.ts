import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import BetsContract from './abis/Bets.json';
import { utils, ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';
import { makeBig } from '@/lib/number-utils';

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
      // Add the address that was output from your deploy script
      address: '0xF6F7080DE9004187193edA6bD978Aa77B4db60e9',
      abi: BetsContract.abi,
      signerOrProvider: signer,
    });

    const createBet = async (
      gameId: number,
      teamId: number,
      betValue: string,
      odds: number
    ): Promise<string> => {
      console.log(gameId);
      console.log(teamId);
      console.log(betValue);
      console.log(utils.parseEther(betValue));
      console.log(odds);
      try {
        if (contract) {
          const { data } = await contract.createBet(
            gameId,
            makeBig(odds),
            teamId,
            {
              value: utils.parseEther('0.01'),
            }
          );

          const request: any = {
            chainId: 84531,
            target: '0xF6F7080DE9004187193edA6bD978Aa77B4db60e9',
            data: data,

            user: await signer.getAddress(),
          };
          console.log('request', request);

          const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;

          console.log(apiKey);

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

    return {
      contract: contract,
      chainId: 84531,
      createBet,
    };
  }
};

export default useBetsWrite;
