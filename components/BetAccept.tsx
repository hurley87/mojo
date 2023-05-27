import { useContext, useState } from 'react';
import useBetsWrite from '@/hooks/useBetsWrite';
import { useBetsSubscriber } from '@/hooks/useBetsSubscribe';
import { BetAccepted } from './BetAccepted';
import va from '@vercel/analytics';
import toast from 'react-hot-toast';
import { sendMessage } from '@/lib/notification';
import { useBetsRead } from '@/hooks/useBetsRead';
import { useProfilesRead } from '@/hooks/useProfilesRead';
import { useTeamsRead } from '@/hooks/useTeamsRead';
import { UserContext } from '@/lib/UserContext';
import { makeBig, makeNum } from '@/lib/number-utils';
import { useMojoRead } from '@/hooks/useMojoRead';

export const BetAccept = ({ betId, sport }: { betId: string; sport: any }) => {
  const [user, _]: any = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const betsContract = useBetsWrite(sport.betsAddress);
  const { data: bet } = useBetsRead({
    address: sport.betsAddress,
    functionName: 'getBet',
    args: [betId],
  });
  const { data: profile } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [user?.publicAddress],
  });
  const { data: creatorProfile } = useProfilesRead({
    address: sport.profilesAddress,
    functionName: 'getProfileByWalletAddress',
    args: [bet?.creator],
  });
  const { data: teamPicked } = useTeamsRead({
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.teamPickedId?.toNumber()],
  });
  const { data: otherTeamPicked } = useTeamsRead({
    address: sport.teamsAddress,
    functionName: 'getTeam',
    args: [bet?.otherTeamPickedId?.toNumber()],
  });
  const { data: mojoBalance } = useMojoRead({
    functionName: 'balanceOf',
    args: [user?.publicAddress],
  });

  useBetsSubscriber({
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
      ) : (
        <button
          onClick={handleAcceptBet}
          className={`btn btn-primary ${
            isLoading
              ? 'loading before:!w-4 before:!h-4 before:!mx-0 before:!mr-1'
              : ''
          }`}
        >
          Place {bet?.counter.toNumber()} MOJO on the {otherTeamPicked?.name}
        </button>
      )}
    </>
  ) : (
    <BetAccepted sport={sport} betId={makeBig(betId)} />
  );
};
