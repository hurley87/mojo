import useBetsWrite from '@/hooks/useBetsWrite';
import { UserContext } from '@/lib/UserContext';
import { makeNum } from '@/lib/number-utils';
import { useContext, useState } from 'react';
import { useBalance } from 'wagmi';

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
  const [betValue, setBetValue] = useState('1.0');
  const [odds, setOdds] = useState(1.0);
  const [isBetting, setIsBetting] = useState(false);
  const betsContract = useBetsWrite();

  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data } = useBalance({
    address,
  });

  async function handlePlaceBetting() {
    setIsBetting(true);
    await betsContract?.createBet(gameId, teamId, betValue, odds);
    setIsBetting(false);
  }

  return data && !(parseFloat(makeNum(data?.value)) > 0) ? (
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
    <div>
      <div className="flex flex-col md:flex-row gap-2">
        <select
          defaultValue={homeTeamId}
          onChange={(e) => setTeamId(parseInt(e.target.value))}
          className="select select-bordered select-primary"
        >
          <option value={homeTeamId}>{homeTeamName}</option>
          <option value={awayTeamId}>{awayTeamName}</option>
        </select>
        <input
          type="text"
          placeholder="bet amount"
          className="input input-primary input-bordered w-full"
          value={betValue}
          onChange={(e) => setBetValue(e.target.value)}
        />
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
        <button
          onClick={handlePlaceBetting}
          className={`btn btn-primary ${
            isBetting
              ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
              : ''
          }`}
        >
          Place Bet
        </button>
      </div>
    </div>
  );
};
