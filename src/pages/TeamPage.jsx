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
    <div className="bg-gray-900 text-white p-4">
      {team && (
        <div className="flex items-center mb-6">
          <img src={team.logo} alt={team.name} className="w-16 h-16 mr-4" />
          <h1 className="text-3xl font-bold">{team.name}</h1>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Goalkeepers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Age</th>
                <th className="text-left p-4">Number</th>
                <th className="text-left p-4">Photo</th>
              </tr>
            </thead>
            <tbody>
              {goalkeepers.map((player) => (
                <PlayerCard key={player.id} player={player} teamId={teamId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Outfield Players</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">Age</th>
                <th className="text-left p-4">Number</th>
                <th className="text-left p-4">Photo</th>
              </tr>
            </thead>
            <tbody>
              {outfieldPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} teamId={teamId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
