import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStandings, getTopScorers } from "../api/footballApi";
import TeamStatistics from "../components/TeamStatistics";

const LeaguePage = () => {
  const { leagueId, season } = useParams();

  // ─────────────────────────────────────
  // Standings Query (fully normalized)
  // ─────────────────────────────────────
  const {
    data: leagueData,
    isLoading: isLoadingStandings,
    isError: isErrorStandings,
  } = useQuery({
    queryKey: ["standings", leagueId, season],
    queryFn: () => getStandings(leagueId, season),
    select: (data) => {
      const league = data.response[0].league;
      const standings = league.standings[0];

      // Group descriptions by rank
      const descriptionGroups = standings.reduce((groups, team) => {
        if (team.description) {
          if (!groups[team.description]) {
            groups[team.description] = [];
          }
          groups[team.description].push(team.rank);
        }
        return groups;
      }, {});

      return {
        id: league.id,
        name: league.name,
        logo: league.logo,
        standings,
        descriptionGroups,
      };
    },
  });

  // ─────────────────────────────────────
  // Top Scorers Query (normalized + sliced)
  // ─────────────────────────────────────
  const {
    data: topScorers = [],
    isLoading: isLoadingTopScorers,
    isError: isErrorTopScorers,
  } = useQuery({
    queryKey: ["topScorers", leagueId, season],
    queryFn: () => getTopScorers(leagueId, season),
    select: (data) => data.response.slice(0, 5),
  });

  // ─────────────────────────────────────
  // Loading / Error
  // ─────────────────────────────────────
  if (isLoadingStandings || isLoadingTopScorers) {
    return <div>Loading...</div>;
  }

  if (isErrorStandings || isErrorTopScorers) {
    return <div>Error fetching data</div>;
  }

  const { name, logo, standings, descriptionGroups } = leagueData;

  // ─────────────────────────────────────
  // Render
  // ─────────────────────────────────────
  return (
    <div className="bg-gray-900 text-white p-4">
      <div className="flex items-center mb-6">
        <img src={logo} alt={name} className="w-12 h-12 mr-4" />
        <h1 className="text-3xl font-bold">
          {name} - {season}
        </h1>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Standings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">Team</th>
                <th className="text-left p-4">Played</th>
                <th className="text-left p-4">Wins</th>
                <th className="text-left p-4">Draws</th>
                <th className="text-left p-4">Losses</th>
                <th className="text-left p-4">GF</th>
                <th className="text-left p-4">GA</th>
                <th className="text-left p-4">GD</th>
                <th className="text-left p-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => (
                <TeamStatistics
                  key={team.team.id}
                  team={team}
                  leagueId={leagueId}
                  season={season}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        {Object.entries(descriptionGroups).map(([description, ranks]) => (
          <p key={description} className="text-sm text-gray-400">
            Position {ranks.join(", ")}: {description}
          </p>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Top Scorers</h2>
        <ul className="space-y-2">
          {topScorers.map((scorer) => (
            <li
              key={scorer.player.id}
              className="bg-gray-800 p-3 rounded-lg grid grid-cols-3 items-center"
            >
              <Link
                to={`/player/${scorer.player.id}`}
                className="text-blue-400 hover:underline text-left"
              >
                {scorer.player.name}
              </Link>
              <span className="font-semibold text-center">
                {scorer.statistics[0].goals.total} goals
              </span>
              <span className="text-gray-400 text-right">
                {scorer.statistics[0].team.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeaguePage;
