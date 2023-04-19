import React, { useEffect } from 'react';
import Link from 'next/link';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import { format } from '@/lib/format';
import {
  BanknotesIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useBalance, useProvider } from 'wagmi';
import { makeBig, makeNum } from '@/lib/number-utils';
import { getETHPrice } from '@/lib/getEthPrice';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data, isError, isLoading } = useBalance({
    address,
  });

  // Get the price of ETH from Uniswap on mount
  // useEffect(() => {
  //   (async () => {
  //     const price = await getETHPrice();
  //     console.log('price', price);
  //     console.log(data);
  //     if (data) console.log(parseFloat(makeNum(data?.value)) * price);
  //   })();
  // }, [data]);

  // console.log('data', data);

  async function login() {
    await magic.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: `${window.location.origin}/callback`,
      scope: [],
    });
  }

  async function logout() {
    await magic.user.logout();
    toast.success('Logged out successfully!');
    window.location.href = '/';
  }

  console.log(user);

  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-1 px-4 mx-2">
        <Link href="/">
          <span className="text-sm font-bold">MOJO</span>
        </Link>
      </div>
      <div className="flex-none">
        {!user?.loading && !user?.issuer ? (
          <button className="btn btn-ghost" onClick={login}>
            Login
          </button>
        ) : (
          <>
            <label htmlFor="my-modal-2" className="btn btn-square modal-button">
              <BanknotesIcon className="h-6 w-6" />
            </label>
            <input type="checkbox" id="my-modal-2" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box text-center flex flex-col gap-6">
                <div className="flex justify-center">
                  <Image alt="logo" width={100} height={100} src="/logo.svg" />
                </div>
                <div>
                  <Link
                    target="_blank"
                    href={`https://goerli.basescan.org/address/${user?.publicAddress}`}
                  >
                    <p className="font-bold text-lg">
                      {format(user?.publicAddress)}
                    </p>
                  </Link>
                  <p className="text-sm">
                    {data?.value && parseFloat(makeNum(data?.value))} ETH
                  </p>
                </div>
                <div className="flex relative w-full justify-center gap-2">
                  <label
                    htmlFor="my-modal-2"
                    className="btn btn-primary btn-outline w-48"
                    onClick={() => {
                      navigator.clipboard.writeText(user?.publicAddress);
                      toast.success('Copied to clipboard! 📋');
                    }}
                  >
                    <ClipboardDocumentCheckIcon className="h-6 w-6" /> Copy
                    Address
                  </label>
                  <label
                    htmlFor="my-modal-2"
                    className="btn btn-primary btn-outline w-48"
                    onClick={logout}
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6" /> Disconnect
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
