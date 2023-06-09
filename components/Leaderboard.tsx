import { useRead } from '@/hooks/useRead';
import { makeNum } from '@/lib/number-utils';

export const Leaderboard = ({ sport }: { sport: any }) => {
  const { data: profiles, isLoading } = useRead({
    contractName: 'Profiles',
    address: sport.profilesAddress,
    functionName: 'getProfiles',
    args: [],
  });
  const results = profiles?.map((profile: any) => {
    const points =
      parseFloat(makeNum(profile.winnings)) -
      parseFloat(makeNum(profile.losses));
    return {
      username: profile.username,
      points,
      winnings: makeNum(profile.winnings),
      losses: makeNum(profile.losses),
      betCount: profile.betCount.toNumber(),
    };
  });
  const sortedProfiles = results?.sort((a: any, b: any) => {
    return b.points - a.points;
  });

  console.log(sortedProfiles);
  console.log(sortedProfiles?.length);

  return (
    <div className="w-full">
      {isLoading ? (
        <div>loading ...</div>
      ) : (
        <div className="overflow-x-auto">
          <h2 className="text-sm">{sport.prize}</h2>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th className="hidden lg:table-cell">Bet Count</th>
                <th className="hidden lg:table-cell">Winnings</th>
                <th className="hidden lg:table-cell">Losses</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedProfiles
                .slice(0, 10)
                .map((profile: any, index: number) => (
                  <tr
                    className={
                      index === 0
                        ? 'font-black text-xl'
                        : 'font-semibold text-sm'
                    }
                    key={index}
                  >
                    <th>{index + 1}</th>
                    <td>{profile.username}</td>
                    <td className="hidden lg:table-cell">{profile.betCount}</td>
                    <td className="hidden lg:table-cell">
                      {parseInt(profile.winnings)}
                    </td>
                    <td className="hidden lg:table-cell">
                      {parseInt(profile.losses)}
                    </td>
                    <td
                      className={
                        profile.points >= 0 ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {parseInt(profile.points)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
