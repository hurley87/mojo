import { ethers } from 'ethers';
import {
  ChainId,
  Token,
  WETH,
  Fetcher,
  Trade,
  Route,
  TokenAmount,
  TradeType,
} from '@uniswap/sdk';

export async function getETHPrice() {
  try {
    const DAI = new Token(
      ChainId.MAINNET,
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      18
    );
    const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId]);
    const route = new Route([pair], WETH[DAI.chainId]);
    const trade = new Trade(
      route,
      new TokenAmount(WETH[DAI.chainId], '1000000000000000000'),
      TradeType.EXACT_INPUT
    );

    console.log();

    return parseFloat(trade.executionPrice.toSignificant(6));
  } catch (e) {
    console.log(e);
    return 0;
  }
}
