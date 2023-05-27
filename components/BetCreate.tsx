import useBetsWrite from '@/hooks/useBetsWrite';
import { UserContext } from '@/lib/UserContext';
import { makeNum } from '@/lib/number-utils';
import { useContext, useState } from 'react';
import va from '@vercel/analytics';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import Link from 'next/link';
import { useMojoRead } from '@/hooks/useMojoRead';
import { sendMessage } from '@/lib/notification';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import * as fbq from '../lib/fpixel';
import { useRouter } from 'next/router';
import { useMojoSubscriber } from '@/hooks/useMojoSubscribe';
import useMojoWrite from '@/hooks/useMojoWrite';

export const CreateBet = ({
  sport,
  gameId,
  homeTeamName,
  awayTeamName,
  awayTeamId,
  homeTeamId,
}: {
  sport: any;
  gameId: number;
  homeTeamName: string;
  awayTeamName: string;
  awayTeamId: number;
  homeTeamId: number;
}) => {
  const [teamId, setTeamId] = useState(homeTeamId);
  const [amount, setAmount] = useState(10);
  const [counter, setCounter] = useState(10);
  const [isBetting, setIsBetting] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);
  const betsContract = useBetsWrite(sport.betsAddress);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data: teamPicked } = useTeamsRead({
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [teamId],
  });
  const { data: mojoBalance } = useMojoRead({
    functionName: 'balanceOf',
    args: [address],
  });
  const { data: mojoAllowance } = useMojoRead({
    functionName: 'allowance',
    args: [user?.publicAddress, sport.betsAddress],
  });
  const { data: profile } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [address],
  });

  const router = useRouter();
  const mojoContract = useMojoWrite();

  useBetsSubscriber({
    eventName: 'BetCreated',
    address: sport.betsAddress,
    listener: (
      betCounter: BigNumber,
      msgValue: BigNumber,
      odds: BigNumber,
      teamId: number,
      msgSender: string
    ) => {
      setIsBetting(false);
      setShowBetModal(false);
      console.log(msgValue);
      toast.success('Your pick is in!');
      sendMessage(
        `${profile?.username} just staked ${amount} MOJO on the ${
          teamPicked?.name
        } and asking an opponent to stake ${counter} MOJO on the ${
          teamId === homeTeamId ? awayTeamName : homeTeamName
        }.`
      );
      va.track('BetCreated', {
        betId: betCounter.toNumber(),
        amount,
        odds: makeNum(odds),
        teamId: teamId,
        address: msgSender,
      });
      fbq.event('Purchase', {
        currency: 'USD',
        value: amount,
      });
      router.push(`/${sport.betPath}/${betCounter.toNumber()}`);
    },
  });

  async function handlePlaceBetting() {
    try {
      setIsBetting(true);
      await betsContract?.createBet(gameId, teamId, amount, counter);
    } catch (e) {
      console.log(e);
      va.track('BetCreatedError', {
        amount: amount,
        counter: counter,
        teamId: teamId,
        address: user?.publicAddress,
      });
      setIsBetting(false);
    }
  }

  async function handleApprove() {
    setIsApproveLoading(true);
    try {
      await mojoContract?.approve(sport.betsAddress, mojoBalance);
    } catch (e) {
      toast.error('try again');
      setIsApproveLoading(false);
      va.track('TokensApproveError', {
        address: user?.publicAddress,
      });
      return;
    }
  }

  useMojoSubscriber({
    eventName: 'Approval',
    listener: (walletAddress: string, spender: string, amount: any) => {
      console.log(spender, walletAddress, amount);
      if (
        walletAddress.toLocaleLowerCase() ===
        user?.publicAddress?.toLocaleLowerCase()
      ) {
        setIsApproveLoading(false);
        setIsApproved(true);
        va.track('TokensClaims', {
          address: walletAddress,
        });
      }
    },
  });

  console.log('compare');
  console.log(parseInt(makeNum(mojoAllowance)));
  console.log(amount);

  return (
    <div className="py-4">
      {mojoBalance ? (
        <>
          <button
            onClick={() => setShowBetModal(true)}
            className="btn btn-primary w-full"
          >
            Create Your Bet
          </button>
          <div className={`modal ${showBetModal && 'modal-open'}`}>
            <div className="modal-box relative">
              <label
                onClick={() => setShowBetModal(false)}
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <div className="flex flex-col gap-4 p-2 md:p-6">
                <h2 className="font-bold pb-4">
                  {!isApproved && 'Create a bet between you and your opponent.'}
                </h2>

                {!isApproved && (
                  <div className="flex flex-col gap-4">
                    <div className=" flex flex-col gap-2">
                      <label className="text-sm w-full">
                        The team you think will win
                      </label>
                      <select
                        defaultValue={homeTeamId}
                        onChange={(e) => setTeamId(parseInt(e.target.value))}
                        className="select select-bordered select-primary w-full"
                      >
                        <option value={homeTeamId}>{homeTeamName}</option>
                        <option value={awayTeamId}>{awayTeamName}</option>
                      </select>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <label className="text-sm">
                        Your stake on the {teamPicked?.name}
                      </label>
                      <div className="flex p-1 border-primary border rounded-lg w-full justify-between">
                        <button
                          onClick={() => setAmount(amount - 1)}
                          className="btn btn-sm btn-active btn-square m-0.5"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          onChange={(e) =>
                            setAmount(parseFloat(e.target.value))
                          }
                          className="text-md text-center bg-transparent w-full"
                          value={amount}
                        />
                        <button
                          onClick={() => setAmount(amount + 1)}
                          className="btn btn-active btn-sm btn-square m-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="w-full  flex flex-col gap-2">
                      <label className="text-sm w-full">
                        Your {"opponent's"} stake on the{' '}
                        {teamId === homeTeamId ? awayTeamName : homeTeamName}
                      </label>
                      <div className="flex p-1 border-primary border rounded-lg w-full justify-between">
                        <button
                          onClick={() => setCounter(counter - 1)}
                          className="btn btn-sm btn-active btn-square m-0.5"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          onChange={(e) =>
                            setCounter(parseFloat(e.target.value))
                          }
                          className="text-md text-center bg-transparent w-full"
                          value={counter}
                        />
                        <button
                          onClick={() => setCounter(counter + 1)}
                          className="btn btn-active btn-sm btn-square m-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {isApproved ? (
                    <>
                      <button
                        onClick={handlePlaceBetting}
                        disabled={
                          !amount ||
                          amount <= 0 ||
                          amount > parseInt(makeNum(mojoBalance)) ||
                          isBetting ||
                          counter <= 0
                        }
                        className={`btn btn-primary w-full ${
                          isBetting
                            ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                            : ''
                        }`}
                      >
                        {isBetting
                          ? 'Confirming ...'
                          : `Confirm ${amount} MOJO Bet`}
                      </button>
                      <button
                        onClick={() => setIsApproved(false)}
                        className={`btn btn-primary btn-outline w-full`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        parseInt(makeNum(mojoAllowance)) >= amount
                          ? setIsApproved(true)
                          : handleApprove()
                      }
                      disabled={
                        !amount ||
                        amount <= 0 ||
                        amount > parseInt(makeNum(mojoBalance)) ||
                        isApproveLoading ||
                        counter <= 0
                      }
                      className={`btn btn-primary w-full ${
                        isApproveLoading
                          ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                          : ''
                      }`}
                    >
                      {isApproveLoading
                        ? 'Approving ...'
                        : `Approve ${amount} MOJO Bet`}
                    </button>
                  )}

                  <p className="pt-1 text-xs text-center">
                    If your opponent stakes {counter} MOJO and the{' '}
                    {teamPicked?.name} win, {"you'll"} receive{' '}
                    {amount + counter} MOJO tokens after the game.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Link href="/">
          <button className={`btn btn-primary text-sm`}>
            Create an account before making your pick
          </button>
        </Link>
      )}
    </div>
  );
};
