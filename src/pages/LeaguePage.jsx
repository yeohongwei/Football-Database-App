import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStandings, getTopScorers } from '../api/footballApi';

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
            <tr key={team.team.id}>
              <td>{team.rank}</td>
              <td>
                <Link to={`/team/${team.team.id}`}>
                  <img src={team.team.logo} alt={team.team.name} width="20" />
                  {team.team.name}
                </Link>
              </td>
              <td>{team.all.played}</td>
              <td>{team.all.win}</td>
              <td>{team.all.draw}</td>
              <td>{team.all.lose}</td>
              <td>{team.all.goals.for}</td>
              <td>{team.all.goals.against}</td>
              <td>{team.goalsDiff}</td>
              <td>{team.points}</td>
            </tr>
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
