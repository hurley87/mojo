import { UserContext } from '@/lib/UserContext';
import { makeNum } from '@/lib/number-utils';
import { useContext, useState } from 'react';
import { useBalance } from 'wagmi';
import va from '@vercel/analytics';
import { BigNumber } from 'ethers';
import toast from 'react-hot-toast';
import { getETHPrice } from '@/lib/getEthPrice';
import useDerbyWrite from '@/hooks/useDerbyWrite';
import { useDerbySubscriber } from '@/hooks/useDerbySubscribe';
import { horses } from '@/lib/horses';

export const DerbyBetCreate = () => {
  const [horseId, setHorseId] = useState<number>(0);
  const [betValue, setBetValue] = useState('0.01');
  const [isBetting, setIsBetting] = useState(false);
  const betsContract = useDerbyWrite();
  const [isUSD, setIsUSD] = useState(false);
  const [usdAmount, setUSDAmount] = useState(2000);
  const [user, _]: any = useContext(UserContext);
  const address = user?.publicAddress;
  const { data, isLoading } = useBalance({
    address,
  });

  useDerbySubscriber({
    eventName: 'BetPlaced',
    listener: (bettor: string, horseNumber: number, msgValue: BigNumber) => {
      va.track('BetPlaced', {
        bettor: bettor,
        horseId: horseNumber,
        amount: makeNum(msgValue),
      });
      setIsBetting(false);
    },
  });

  async function handlePlaceBetting() {
    try {
      setIsBetting(true);
      const createBetResponse = await betsContract?.placeBet(horseId, betValue);

      if (createBetResponse === 'insufficient funds') {
        toast.error('insufficient funds');
        va.track('DerbyBetCreatedError', {
          amount: betValue,
          horseId: horseId,
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
          defaultValue={0}
          onChange={(e) => setHorseId(parseInt(e.target.value))}
          className="select select-bordered select-primary w-56"
        >
          {horses.map((horse, index) => {
            return (
              <option key={index} value={index}>
                {horse}
              </option>
            );
          })}
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
        Bet <b>{betValue} ETH</b> on {horses[horseId]} to win the Kentucky
        Derby. All bets are final and must be placed before 6:30pm EST.
      </p>
    </div>
  );
};
