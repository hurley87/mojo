import { ethers } from 'ethers';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';

const relay = new GelatoRelay();

export async function getaloRequest(
  target: string,
  data: any,
  provider: ethers.providers.Web3Provider
) {
  const request: any = {
    chainId: 84531,
    target,
    data,
    user: await provider.getSigner().getAddress(),
  };
  const apiKey = process.env.NEXT_PUBLIC_GELATO_API as string;
  const response = await relay.sponsoredCallERC2771(request, provider, apiKey);

  const taskId = response.taskId;
  console.log('response', taskId);

  return taskId;
}
