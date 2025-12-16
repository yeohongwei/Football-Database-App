import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStandings, getTopScorers } from '../api/footballApi';
import TeamStatistics from '../components/TeamStatistics';

const LeaguePage = () => {
  const { leagueId, season } = useParams();

  const { data: standingsData, isLoading: isLoadingStandings, isError: isErrorStandings } = useQuery({
    queryKey: ['standings', leagueId, season],
    queryFn: () => getStandings(leagueId, season),
  });

  const { data: topScorersData, isLoading: isLoadingTopScorers, isError: isErrorTopScorers } = useQuery({
    queryKey: ['topScorers', leagueId, season],
    queryFn: () => getTopScorers(leagueId, season),
  });

  if (isLoadingStandings || isLoadingTopScorers) {
    return <div>Loading...</div>;
  }

  if (isErrorStandings || isErrorTopScorers) {
    return <div>Error fetching data</div>;
  }

  const league = standingsData?.response[0]?.league;
  const standings = league?.standings[0];

  return (
    <div>
      <Link to="/home">Back to Home</Link>
      {league && (
        <div>
          <h1>{league.name} - {season}</h1>
          <img src={league.logo} alt={league.name} />
        </div>
      )}

      <h2>Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings?.map((team) => (
            <TeamStatistics key={team.team.id} team={team} leagueId={leagueId} season={season} />
          ))}
        </tbody>
      </table>
        {standingsData?.response[0]?.league?.standings[0][0]?.description}

      <h2>Top Scorers</h2>
      <ul>
        {topScorersData?.response.slice(0, 5).map((scorer) => (
          <li key={scorer.player.id}>
            <Link to={`/player/${scorer.player.id}`}>
              {scorer.player.name}
            </Link> ({scorer.statistics[0].goals.total} goals) - {scorer.statistics[0].team.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaguePage;
