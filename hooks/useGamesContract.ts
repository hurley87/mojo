import * as wagmi from 'wagmi';
import type { BigNumber } from 'ethers';
import GamesContract from '../hardhat-ts/artifacts/contracts/Games.sol/Games.json';
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

const useGamesContract = () => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(
      magic?.rpcProvider || ''
    );
    const signer = provider.getSigner();
    // This returns a new ethers.Contract ready to interact with our API.

    const contract = wagmi.useContract({
      // Add the address that was output from your deploy script
      address: '0x2371eb2c11c27088A28b1aC8Ab1672CE059665B0',
      abi: GamesContract.abi,
      signerOrProvider: provider,
    });

    const signerContract = wagmi.useContract({
      address: '0x2371eb2c11c27088A28b1aC8Ab1672CE059665B0',
      abi: GamesContract.abi,
      signerOrProvider: signer,
    });

    const getAllGames = async (): Promise<any> => {
      try {
        if (contract) {
          const qArray = await contract.getGames();
          return qArray.map((q: any) => ({ ...q }));
        } else return [];
      } catch (e) {
        console.log('e', e);
        return [];
      }
    };

    return {
      contract: signerContract,
      chainId: 84531,
      getAllGames,
    };
  }
};

export default useGamesContract;
