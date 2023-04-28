import React, { useState } from 'react';
import Link from 'next/link';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import {
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useBalance } from 'wagmi';
import { makeNum } from '@/lib/number-utils';
import { getETHPrice } from '@/lib/getEthPrice';
import { toast } from 'react-hot-toast';
import { BsQuestionCircle, BsEye } from 'react-icons/bs';
import { RxDiscordLogo } from 'react-icons/rx';
import { useProfilesRead } from '@/hooks/useProfilesRead';

const Navbar = () => {
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const [isUSD, setIsUSD] = useState(false);
  const [usdAmount, setUSDAmount] = useState(2000);
  const { data } = useBalance({
    address,
  });
  const { data: profile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [address],
  });

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

  async function handleConvert() {
    const price = await getETHPrice();
    if (data) {
      setUSDAmount(parseFloat(makeNum(data?.value)) * price);
    }
    setIsUSD(!isUSD);
  }

  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
      <div className="flex-1 px-4 mx-2">
        <Link href="/">
          <span className="text-sm font-bold">MOJO</span>
        </Link>
      </div>
      <div className="flex">
        <Link href="/faq">
          <div className="btn btn-square">
            <BsQuestionCircle className="h-6 w-6" />
          </div>
        </Link>
        <a
          href="https://discord.gg/MjT8ZAZtw4"
          target="_blank"
          className="btn btn-square"
        >
          <RxDiscordLogo className="h-6 w-6" />
        </a>
        {!user?.loading && !user?.issuer ? (
          <button className="btn btn-ghost" onClick={login}>
            Login
          </button>
        ) : (
          <>
            <label htmlFor="my-modal-2" className="btn modal-button">
              {profile?.username}
            </label>
            <input type="checkbox" id="my-modal-2" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box text-center flex flex-col gap-4 max-w-xs">
                <label htmlFor="my-modal-2">
                  <div className="btn btn-primary btn-outline w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block w-4 h-4 mr-1 stroke-current"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    close
                  </div>
                </label>
                <Link
                  target="_blank"
                  href={`https://goerli.basescan.org/address/${user?.publicAddress}`}
                >
                  <p className="btn btn-primary btn-outline w-full">
                    <BsEye className="h-6 w-6 mr-2" /> View Transactions
                  </p>
                </Link>

                <label
                  className="btn btn-primary btn-outline w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.publicAddress);
                    toast.success('Copied to clipboard! 📋');
                  }}
                >
                  <ClipboardDocumentCheckIcon className="h-6 w-6 mr-2" /> Copy{' '}
                  Address
                </label>
                <div className="flex items-center">
                  <label className="input-group input-group-md">
                    <input
                      type="text"
                      placeholder="bet amount"
                      className={`input input-bordered`}
                      value={
                        isUSD
                          ? usdAmount.toFixed(2)
                          : data && parseFloat(makeNum(data?.value))
                      }
                    />
                    <button
                      onClick={() => handleConvert()}
                      className="btn btn-primary"
                    >
                      {isUSD ? 'USD' : 'ETH'}
                    </button>
                  </label>
                </div>

                <div className="flex relative w-full justify-center gap-2">
                  <label
                    htmlFor="my-modal-2"
                    className="btn btn-primary btn-outline w-full"
                    onClick={logout}
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-2" /> Logout
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
