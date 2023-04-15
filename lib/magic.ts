import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const network = {
  rpcUrl: `https://attentive-rough-shape.base-goerli.quiknode.pro/${process.env.NEXT_PUBLIC_QUICK_NODE}/`, // Polygon RPC URL
  chainId: 84531,
};

// Create client-side Magic instance
const createMagic = (key: string) => {
  return (
    typeof window != 'undefined' &&
    new Magic(key, {
      network,
      extensions: [new OAuthExtension()],
    })
  );
};

const key: string = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || '';

export const magic: any = createMagic(key);
