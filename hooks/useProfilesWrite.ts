import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import ProfilesContract from './abis/Profiles.json';
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

const useProfilesWrite = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();

    const contract = wagmi.useContract({
      // Add the address that was output from your deploy script
      address: '0x23Bb9234B1cc80FbE72707aB137630031eCA524B',
      abi: ProfilesContract.abi,
      signerOrProvider: signer,
    });

    const createProfile = async (username: string): Promise<string> => {
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.createProfile(
            username
          );

          const request: any = {
            chainId: 84531,
            target: '0x23Bb9234B1cc80FbE72707aB137630031eCA524B',
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
      createProfile,
    };
  }
};

export default useProfilesWrite;
