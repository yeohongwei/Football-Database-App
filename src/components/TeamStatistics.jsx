import React from 'react';
import { Link } from 'react-router-dom';

const TeamStatistics = ({ team, leagueId, season }) => {
  return (
    <tr key={team.team.id}>
      <td>{team.rank}</td>
      <td>
        <Link 
          to={{
            pathname: `/team/${team.team.id}`,
          }}
          state={{ leagueId, season }}
        >
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
  );
};

export default TeamStatistics;
