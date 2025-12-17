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
    <div>
      <Link to="/home">Back to Home</Link>

      <div>
        <h1>
          {name} - {season}
        </h1>
        <img src={logo} alt={name} />
      </div>

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

      <div>
        {Object.entries(descriptionGroups).map(([description, ranks]) => (
          <p key={description}>
            Position {ranks.join(", ")}: {description}
          </p>
        ))}
      </div>

      <h2>Top Scorers</h2>
      <ul>
        {topScorers.map((scorer) => (
          <li key={scorer.player.id}>
            <Link to={`/player/${scorer.player.id}`}>{scorer.player.name}</Link>{" "}
            ({scorer.statistics[0].goals.total} goals) –{" "}
            {scorer.statistics[0].team.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaguePage;
