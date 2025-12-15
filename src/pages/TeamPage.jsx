import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTeamSquad } from '../api/footballApi';

const TeamPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teamSquad', teamId],
    queryFn: () => getTeamSquad(teamId),
  });

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
      <button onClick={() => navigate(-1)}>Back</button>
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
            <tr key={player.id}>
              <td>
                <Link to={`/player/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.age}</td>
              <td>{player.number}</td>
              <td>
                <img src={player.photo} alt={player.name} width="50" />
              </td>
            </tr>
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
            <tr key={player.id}>
              <td>
                <Link to={`/player/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.position}</td>
              <td>{player.age}</td>
              <td>{player.number}</td>
              <td>
                <img src={player.photo} alt={player.name} width="50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamPage;
