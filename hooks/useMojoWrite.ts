import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import MojoContract from './abis/Mojo.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { getaloRequest } from '@/lib/gelato';

const useMojoWrite = (address: string) => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const contract = wagmi.useContract({
      address,
      abi: MojoContract.abi,
      signerOrProvider: signer,
    });

    const approve = async (
      coolAddress: string,
      amount: BigNumber
    ): Promise<string> => {
      console.log('approve', coolAddress, amount);
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.approve(
            coolAddress,
            amount
          );
          return await getaloRequest(address, data, provider);
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
          return await getaloRequest(address, data, provider);
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
