import { useContractRead } from 'wagmi';
import GamesContract from './abis/Games.json';

export const useGamesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x3AacD852285a33A93806E86A68bAaA203b694EDe',
    abi: GamesContract.abi,
    watch: false,
    args,
  }) as any;
};
