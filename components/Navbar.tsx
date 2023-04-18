import React, { useEffect } from 'react';
import Link from 'next/link';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import { format } from '@/lib/format';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { useBalance, useProvider } from 'wagmi';
import { makeBig, makeNum } from '@/lib/number-utils';
import { getETHPrice } from '@/lib/getEthPrice';

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
  }

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
          <button className="btn btn-ghost btn-square">
            <BanknotesIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
