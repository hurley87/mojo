import { useContractRead } from 'wagmi';
import GamesContract from './abis/Games.json';

export const useGamesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0xadE9877B3fCC4EF1aEA48eE03662B1b0c822b552',
    abi: GamesContract.abi,
    watch: false,
    args,
  }) as any;
};
