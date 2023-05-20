import React from 'react';
import Link from 'next/link';
import { UserContext } from '@/lib/UserContext';
import { magic } from '@/lib/magic';
import { useContext } from 'react';
import {
  ClipboardDocumentCheckIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { BsEye, BsRocket, BsQuestionCircle } from 'react-icons/bs';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useMojoRead } from '@/hooks/useMojoRead';
import { makeNum } from '@/lib/number-utils';

const Navbar = () => {
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data: profile } = useProfilesRead({
    functionName: 'getProfileByWalletAddress',
    args: [address],
  });
  const { data: mojoBalance } = useMojoRead({
    functionName: 'balanceOf',
    args: [user?.publicAddress],
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

  return (
    <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box text-sm">
      <div className="flex-1 mx-2">
        <Link href="/">
          <span className="font-bold text-sm">MOJO</span>
        </Link>
      </div>
      <div className="flex gap-0">
        <div className="tooltip tooltip-bottom" data-tip="FAQ">
          <Link href="/faq">
            <span className="btn btn-square">
              <BsQuestionCircle className="h-6 w-6" />
            </span>
          </Link>
        </div>
        {!user?.loading && !user?.issuer ? (
          <button className="btn btn-ghost" onClick={login}>
            Login
          </button>
        ) : (
          <>
            {profile?.walletAddress.toLowerCase() ===
              address?.toLowerCase() && (
              <div className="tooltip tooltip-bottom" data-tip="Profile">
                <label
                  htmlFor="my-modal-2"
                  className="btn modal-button btn-sm flex flex-row gap-1"
                >
                  <span>{profile?.username}</span>
                  {profile?.username && (
                    <div className="badge badge-primary">
                      {`${parseInt(makeNum(mojoBalance))}`}
                    </div>
                  )}
                </label>
              </div>
            )}
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
                <Link href="/picks">
                  <p className="btn btn-primary btn-outline w-full">
                    <BsRocket className="h-6 w-6 mr-2" /> Your Picks
                  </p>
                </Link>
                <Link
                  target="_blank"
                  href={`https://goerli.basescan.org/address/${user?.publicAddress}#tokentxns`}
                >
                  <p className="btn btn-primary btn-outline w-full">
                    <BsEye className="h-6 w-6 mr-2" /> View Transactions
                  </p>
                </Link>

                <label
                  className="btn btn-primary btn-outline w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(user?.publicAddress);
                    toast.success('Address copied to clipboard!');
                  }}
                >
                  <ClipboardDocumentCheckIcon className="h-6 w-6 mr-2" /> Copy
                  Wallet Address
                </label>

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
