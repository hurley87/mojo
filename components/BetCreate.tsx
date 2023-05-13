import useBetsWrite from '@/hooks/useBetsWrite';
import { UserContext } from '@/lib/UserContext';
import { makeNum } from '@/lib/number-utils';
import { useContext, useState } from 'react';
import { useBalance } from 'wagmi';
import va from '@vercel/analytics';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import Link from 'next/link';
import { useMojoRead } from '@/hooks/useMojoRead';

export const CreateBet = ({
  gameId,
  homeTeamName,
  awayTeamName,
  awayTeamId,
  homeTeamId,
}: {
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
  const betsContract = useBetsWrite();
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data: teamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [teamId],
  });
  const { data: mojoBalance, isLoading } = useMojoRead({
    functionName: 'balanceOf',
    args: [address],
  });

  useBetsSubscriber({
    eventName: 'BetCreated',
    listener: (
      betCounter: BigNumber,
      msgValue: BigNumber,
      odds: BigNumber,
      teamId: number,
      msgSender: string
    ) => {
      setIsBetting(false);
      setShowBetModal(false);
      toast.success('Your pick is in!');
      va.track('BetCreated', {
        betId: betCounter.toNumber(),
        amount: makeNum(msgValue),
        odds: makeNum(odds),
        teamId: teamId,
        address: msgSender,
      });
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

  return isLoading ? null : mojoBalance &&
    !(parseInt(makeNum(mojoBalance)) > 0) ? (
    <div className="alert alert-error">
      <div className="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 mx-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          ></path>
        </svg>
        <label>{"You'll"} need to fund your account before you can bet.</label>
      </div>
    </div>
  ) : (
    <div className="py-4">
      {mojoBalance ? (
        <>
          <button
            onClick={() => setShowBetModal(true)}
            className="btn btn-primary w-full"
          >
            Pick your winner
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
                <div className=" flex flex-col gap-1">
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
                <div className="w-full flex flex-col gap-1">
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
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
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
                <div className="w-full  flex flex-col gap-1">
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
                      onChange={(e) => setCounter(parseFloat(e.target.value))}
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
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handlePlaceBetting}
                    disabled={
                      !amount ||
                      amount <= 0 ||
                      amount > parseInt(makeNum(mojoBalance)) ||
                      isBetting
                    }
                    className={`btn btn-primary w-full ${
                      isBetting
                        ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                        : ''
                    }`}
                  >
                    {isBetting
                      ? 'Registering your pick'
                      : `Stake ${amount} MOJO to earn ${counter} MOJO`}
                  </button>
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
            Create an account before betting
          </button>
        </Link>
      )}
    </div>
  );
};
