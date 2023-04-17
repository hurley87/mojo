export const format = (address: string) =>
  address
    ? `${address?.slice(0, 4)}...${address
        ?.slice(address.length - 4, address.length)
        .toUpperCase()}`
    : '';
