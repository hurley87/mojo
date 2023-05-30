import * as wagmi from 'wagmi';
import ProfilesContract from './abis/Profiles.json';
import { ethers } from 'ethers';
import { magic } from '@/lib/magic';
import { getaloRequest } from '@/lib/gelato';

const useProfilesWrite = (address: string) => {
  if (magic.rpcProvider) {
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();

    const contract = wagmi.useContract({
      address,
      abi: ProfilesContract.abi,
      signerOrProvider: signer,
    });

    const createProfile = async (username: string): Promise<string> => {
      try {
        if (contract) {
          const { data } = await contract.populateTransaction.createProfile(
            username
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
      createProfile,
    };
  }
};

export default useProfilesWrite;
