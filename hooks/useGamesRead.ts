import { useContractRead } from 'wagmi';
import GamesContract from './abis/Games.json';

export const useGamesRead = ({ functionName, address, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address,
    abi: GamesContract.abi,
    watch: false,
    args,
  }) as any;
};
