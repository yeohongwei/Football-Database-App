import React from 'react';
import { Link } from 'react-router-dom';

const PlayerCard = ({ player, teamId }) => {
  return (
    <tr key={player.id}>
      <td>
        <Link to={`/player/${player.id}`} state={{ teamId }}>{player.name}</Link>
      </td>
      {player.position !== 'Goalkeeper' && <td>{player.position}</td>}
      <td>{player.age}</td>
      <td>{player.number}</td>
      <td>
        <img src={player.photo} alt={player.name} width="50" />
      </td>
    </tr>
  );
};

export default PlayerCard;
