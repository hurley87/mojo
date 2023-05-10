import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import MojoContract from './abis/Mojo.json';
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

const useMojoWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const contract = wagmi.useContract({
      address: '0x5E5676B7016E4C5EC0d2329EF814CD8B1efad808',
      abi: MojoContract.abi,
      signerOrProvider: signer,
    });

    const approve = async (
      address: string,
      amount: BigNumber
    ): Promise<string> => {
      console.log('approve', address, amount);
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.approve(
            address,
            amount
          );

          const request: any = {
            chainId: 84531,
            target: '0x5E5676B7016E4C5EC0d2329EF814CD8B1efad808',
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

    const mint = async (amount: BigNumber): Promise<string> => {
      console.log('mint', amount);
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.mint(amount);

          const request: any = {
            chainId: 84531,
            target: '0x5E5676B7016E4C5EC0d2329EF814CD8B1efad808',
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

    return {
      contract: contract,
      chainId: 84531,
      approve,
      mint,
    };
  }
};

export default useMojoWrite;
