export async function getETHPrice() {
  try {
    const json = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await json.json();
    return data.ethereum.usd;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
