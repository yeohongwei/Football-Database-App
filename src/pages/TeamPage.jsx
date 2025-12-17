import React, { useMemo } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTeamSquad } from "../api/footballApi";
import PlayerCard from "../components/PlayerCard";

const TeamPage = () => {
  const { teamId } = useParams();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["teamSquad", teamId],
    queryFn: () => getTeamSquad(teamId),
  });

  const { team, players, goalkeepers, outfieldPlayers } = useMemo(() => {
    if (!isSuccess) {
      return { team: null, players: [], goalkeepers: [], outfieldPlayers: [] };
    }
    const team = data.response[0].team;
    const players = data.response[0].players || [];
    const goalkeepers = players.filter((p) => p.position === "Goalkeeper");
    const outfieldPlayers = players
      .filter((p) => p.position !== "Goalkeeper")
      .sort((a, b) => {
        const positions = ["Defender", "Midfielder", "Attacker"];
        return positions.indexOf(a.position) - positions.indexOf(b.position);
      });
    return { team, players, goalkeepers, outfieldPlayers };
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <Link to="/home">Back to Home</Link>
      {team && (
        <div>
          <h1>{team.name}</h1>
          <img src={team.logo} alt={team.name} />
        </div>
      )}

      <h2>Goalkeepers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Number</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {goalkeepers.map((player) => (
            <PlayerCard key={player.id} player={player} teamId={teamId} />
          ))}
        </tbody>
      </table>

      <h2>Outfield Players</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Age</th>
            <th>Number</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {outfieldPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} teamId={teamId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPage;
