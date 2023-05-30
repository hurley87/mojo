import BetsContract from './Bets.json';
import ReferralsContract from './Referrals.json';
import TeamsContract from './Teams.json';
import GamesContract from './Games.json';
import MojoContract from './Mojo.json';
import ProfilesContract from './Profiles.json';

export const useABI = ({ contractName }: { contractName: string }) => {
  if (contractName === 'Bets') {
    return BetsContract.abi;
  }
  if (contractName === 'Teams') {
    return TeamsContract.abi;
  }
  if (contractName === 'Games') {
    return GamesContract.abi;
  }
  if (contractName === 'Mojo') {
    return MojoContract.abi;
  }
  if (contractName === 'Profiles') {
    return ProfilesContract.abi;
  }
  if (contractName === 'Referrals') {
    return ReferralsContract.abi;
  }

  return [];
};
