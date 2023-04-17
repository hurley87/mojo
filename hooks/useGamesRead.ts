import { useContractRead } from 'wagmi';
import GamesContract from '../hardhat-ts/artifacts/contracts/Games.sol/Games.json';

export const useGamesRead = ({ functionName, args }: any) => {
  return useContractRead({
    chainId: 84531,
    functionName,
    address: '0x2371eb2c11c27088A28b1aC8Ab1672CE059665B0',
    abi: GamesContract.abi,
    watch: false,
    args,
  }) as any;
};
