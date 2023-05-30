import * as wagmi from 'wagmi';
import ReferralsContract from './abis/Referrals.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { getaloRequest } from '@/lib/gelato';

const useReferralsWrite = (address: string) => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();

    const contract = wagmi.useContract({
      address,
      abi: ReferralsContract.abi,
      signerOrProvider: signer,
    });

    const createLink = async (code: string): Promise<string> => {
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.createLink(code);
          return await getaloRequest(address, data, provider);
        } else return '';
      } catch (e) {
        console.log('e', e);
        return '';
      }
    };

    const createReferral = async (code: string): Promise<string> => {
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.createReferral(
            code
          );
          return await getaloRequest(address, data, provider);
        } else return '';
      } catch (e) {
        console.log('e', e);
        return '';
      }
    };

    return {
      contract: contract,
      chainId: 84531,
      createReferral,
      createLink,
    };
  }
};

export default useReferralsWrite;
