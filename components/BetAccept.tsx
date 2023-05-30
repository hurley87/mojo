import { useContext, useEffect, useState } from 'react';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useSubscribe } from '@/hooks/useSubscribe';
import { BetAccepted } from './BetAccepted';
import va from '@vercel/analytics';
import toast from 'react-hot-toast';
import { sendMessage } from '@/lib/notification';
import { useRead } from '@/hooks/useRead';
import { UserContext } from '@/lib/UserContext';
import { makeBig, makeNum } from '@/lib/number-utils';
import useMojoWrite from '@/hooks/useMojoWrite';

export const BetAccept = ({ betId, sport }: { betId: string; sport: any }) => {
  const [user, _]: any = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const betsContract = useBetsWrite(sport.betsAddress);
  const { data: bet } = useRead({
    contractName: 'Bets',
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: profile } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [user?.publicAddress],
  });
  const { data: creatorProfile } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useRead({
    contractName: 'Teams',
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });
  const { data: otherTeamPicked } = useRead({
    contractName: 'Teams',
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.otherTeamPickedId?.toNumber()],
  });
  const { data: mojoBalance } = useRead({
    contractName: 'Mojo',
    address: sport?.mojoAddress,
    functionName: 'balanceOf',
    args: [user?.publicAddress],
  });
  const { data: mojoAllowance } = useRead({
    contractName: 'Mojo',
    address: sport?.mojoAddress,
    functionName: 'allowance',
    args: [user?.publicAddress, sport.betsAddress],
  });
  const mojoContract = useMojoWrite(sport?.mojoAddress);

  // is mojoAllowance > bet.counter and set isApproved to true using useEffect
  useEffect(() => {
    if (
      mojoAllowance &&
      bet &&
      parseInt(makeNum(mojoAllowance)) >= bet?.counter.toNumber()
    ) {
      setIsApproved(true);
    }
  }, [mojoAllowance, bet]);

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

  useSubscribe({
    contractName: 'Mojo',
    address: sport.mojoAddress,
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

  useSubscribe({
    contractName: 'Bets',
    address: sport.betsAddress,
    eventName: 'BetAccepted',
    listener: (id: any, creator: string, acceptor: string) => {
      console.log('BetAccepted', id.toNumber(), creator, acceptor);
      va.track('BetAccepted', {
        betId,
        counter: bet?.counter,
        creator,
        acceptor,
      });
      setHasAccepted(true);
      setIsLoading(false);
      sendMessage(
        `${profile?.username} accepted ${creatorProfile?.username}'s wager on ${
          teamPicked?.name
        } for ${bet?.counter.toNumber()} MOJO.`
      );
    },
  });

  async function handleAcceptBet() {
    try {
      setIsLoading(true);
      await betsContract?.acceptBet(parseInt(betId));
    } catch (e) {
      console.log(e);
      toast.error('Error accepting bet');
      setIsLoading(false);
      va.track('BetAcceptedError', { betId: parseInt(betId) });
    }
  }

  return !hasAccepted && bet?.state === 0 ? (
    <>
      {parseInt(makeNum(mojoBalance)) < bet?.counter.toNumber() ? (
        <button disabled={true} className={`btn`}>
          You need more tokens to place this bet
        </button>
      ) : !isApproved ? (
        <button
          onClick={handleApprove}
          disabled={isApproveLoading}
          className={`btn btn-primary ${
            isApproveLoading
              ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
              : ''
          }`}
        >
          {isApproveLoading
            ? 'Approving ...'
            : `Approve ${bet?.counter.toNumber()} MOJO Bet`}
        </button>
      ) : (
        <button
          onClick={handleAcceptBet}
          disabled={isLoading}
          className={`btn btn-primary ${
            isLoading
              ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
              : ''
          }`}
        >
          {isLoading
            ? 'Confirming ...'
            : `Confirm ${bet?.counter.toNumber()} MOJO bet on the ${
                otherTeamPicked?.name
              }`}
        </button>
      )}
    </>
  ) : (
    <BetAccepted sport={sport} betId={makeBig(betId)} />
  );
};
