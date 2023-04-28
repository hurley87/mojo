import useBetsWrite from '@/hooks/useBetsWrite';
import { UserContext } from '@/lib/UserContext';
import { makeBig, makeNum } from '@/lib/number-utils';
import { useContext, useState } from 'react';
import { useBalance } from 'wagmi';
import va from '@vercel/analytics';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import { getETHPrice } from '@/lib/getEthPrice';
import { useTeamsRead } from '@/hooks/useTeamsRead';

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
  const [betValue, setBetValue] = useState('0.01');
  const [odds, setOdds] = useState(1.0);
  const [isBetting, setIsBetting] = useState(false);
  const betsContract = useBetsWrite();
  const [isUSD, setIsUSD] = useState(false);
  const [usdAmount, setUSDAmount] = useState(2000);
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data, isLoading } = useBalance({
    address,
  });
  const { data: teamPicked } = useTeamsRead({
    functionName: 'getTeam',
    args: [teamId],
  });

  console.log('teamId', teamId);

  useBetsSubscriber({
    eventName: 'BetCreated',
    listener: (
      betCounter: BigNumber,
      msgValue: BigNumber,
      odds: BigNumber,
      teamId: BigNumber,
      msgSender: string
    ) => {
      va.track('BetCreated', {
        betId: betCounter.toNumber(),
        amount: makeNum(msgValue),
        odds: makeNum(odds),
        teamId: teamId?.toNumber(),
        address: msgSender,
      });
      setIsBetting(false);
    },
  });

  async function handlePlaceBetting() {
    try {
      setIsBetting(true);
      const createBetResponse = await betsContract?.createBet(
        gameId,
        teamId,
        betValue,
        odds
      );

      if (createBetResponse === 'insufficient funds') {
        toast.error('insufficient funds');
        va.track('BetCreatedError', {
          amount: betValue,
          odds: odds,
          teamId: teamId,
          address: user?.publicAddress,
        });
        setIsBetting(false);
      } else {
        toast.success('bet placed');
        setIsBetting(false);
      }
    } catch (e) {
      console.log(e);
      setIsBetting(false);
    }
  }

  async function handleConvert() {
    const price = await getETHPrice();
    if (data) setUSDAmount(parseFloat(betValue) * price);

    setIsUSD(true);
  }

  return isLoading ? null : data && !(parseFloat(makeNum(data?.value)) > 0) ? (
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
      <div className="flex flex-col md:flex-row gap-2">
        <select
          defaultValue={homeTeamId}
          onChange={(e) => setTeamId(parseInt(e.target.value))}
          className="select select-bordered select-primary"
        >
          <option value={homeTeamId}>{homeTeamName}</option>
          <option value={awayTeamId}>{awayTeamName}</option>
        </select>

        {isUSD ? (
          <label className="input-group input-group-md">
            <input
              type="text"
              placeholder="bet amount"
              className={`input input-bordered w-full`}
              value={
                isUSD
                  ? usdAmount.toFixed(2)
                  : data && parseFloat(makeNum(data?.value))
              }
            />
            <button onClick={() => setIsUSD(false)} className="btn btn-primary">
              USD
            </button>
          </label>
        ) : (
          <label className="input-group input-group-md">
            <input
              type="text"
              placeholder="bet amount"
              className={`input input-bordered w-full ${
                (data &&
                  parseFloat(betValue) > parseFloat(makeNum(data?.value))) ||
                betValue === ''
                  ? 'input-error'
                  : 'input-primary'
              }`}
              value={betValue}
              onChange={(e) => setBetValue(e.target.value)}
            />
            <span onClick={handleConvert} className="btn btn-primary">
              ETH
            </span>
          </label>
        )}
        <div className="flex p-1 border-primary border rounded-lg">
          <button
            onClick={() => setOdds(odds - 0.1)}
            className="btn btn-sm btn-active btn-square m-0.5"
          >
            -
          </button>
          <input
            onChange={(e) => setOdds(parseFloat(e.target.value))}
            className="text-md text-center bg-transparent w-full md:w-10"
            value={odds.toFixed(1)}
          />
          <button
            onClick={() => setOdds(odds + 0.1)}
            className="btn btn-active btn-sm btn-square m-0.5"
          >
            +
          </button>
        </div>
        {data && (
          <button
            onClick={handlePlaceBetting}
            disabled={
              parseFloat(betValue) > parseFloat(makeNum(data?.value)) ||
              betValue === ''
            }
            className={`btn btn-primary ${
              isBetting
                ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
                : ''
            }`}
          >
            Place Bet
          </button>
        )}
      </div>
      <p className="pt-3 text-xs">
        Bet <b>{betValue} ETH</b> on the {teamPicked?.name} to win at{' '}
        <b>{odds.toFixed(1)} to 1 odds</b> for a profit of{' '}
        <b>
          {Number(makeBig(betValue).mul(10000).div(makeBig(odds))) / 10000} ETH
        </b>
        .
      </p>
    </div>
  );
};
