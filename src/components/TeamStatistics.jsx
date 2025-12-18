import React from "react";
import { Link } from "react-router";

const TeamStatistics = ({ team, leagueId, season }) => {
  return (
    <tr key={team.team.id} className="border-b border-gray-700 hover:bg-gray-800">
      <td className="p-4">{team.rank}</td>
      <td className="p-4">
        <Link
          to={{
            pathname: `/team/${team.team.id}`,
          }}
          state={{ leagueId, season }}
          className="flex items-center text-blue-400 hover:underline"
        >
          <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 mr-2" />
          {team.team.name}
        </Link>
      </td>
      <td className="p-4">{team.all.played}</td>
      <td className="p-4">{team.all.win}</td>
      <td className="p-4">{team.all.draw}</td>
      <td className="p-4">{team.all.lose}</td>
      <td className="p-4">{team.all.goals.for}</td>
      <td className="p-4">{team.all.goals.against}</td>
      <td className="p-4">{team.goalsDiff}</td>
      <td className="p-4">{team.points}</td>
    </tr>
  );
};

export default TeamStatistics;
