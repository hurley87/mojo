import { useProfilesRead } from '@/hooks/useProfilesRead';
import { makeNum } from '@/lib/number-utils';

export const Leaderboard = () => {
  const { data: profiles, isLoading } = useProfilesRead({
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

  return (
    <div className="w-full">
      {isLoading ? (
        <div>loading ...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Bet Count</th>
                <th>Winnings</th>
                <th>Losses</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {sortedProfiles.map((profile: any, index: number) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{profile.username}</td>
                  <td>{profile.betCount}</td>
                  <td>{profile.winnings}</td>
                  <td>{profile.losses}</td>
                  <td
                    className={
                      profile.points >= 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {profile.points.toFixed(3)}
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
