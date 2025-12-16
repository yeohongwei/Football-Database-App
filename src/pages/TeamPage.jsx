import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTeamSquad } from '../api/footballApi';
import PlayerCard from '../components/PlayerCard';

const TeamPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { leagueId, season } = location.state || {};

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teamSquad', teamId],
    queryFn: () => getTeamSquad(teamId),
  });

  const handleBack = () => {
    if (leagueId && season) {
      navigate(`/league/${leagueId}/${season}`);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  const team = data?.response[0]?.team;
  const players = data?.response[0]?.players;

  const goalkeepers = players?.filter((p) => p.position === 'Goalkeeper');
  const outfieldPlayers = players?.filter((p) => p.position !== 'Goalkeeper')
    .sort((a, b) => {
        const positions = ['Defender', 'Midfielder', 'Attacker'];
        return positions.indexOf(a.position) - positions.indexOf(b.position);
    });

  return (
    <div>
      <button onClick={handleBack}>Back</button>
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
          {goalkeepers?.map((player) => (
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
          {outfieldPlayers?.map((player) => (
            <PlayerCard key={player.id} player={player} teamId={teamId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPage;
