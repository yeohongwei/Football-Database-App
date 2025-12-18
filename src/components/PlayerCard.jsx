import React from "react";
import { Link } from "react-router";

const PlayerCard = ({ player, teamId }) => {
  return (
    <tr key={player.id} className="border-b border-gray-700 hover:bg-gray-800">
      <td className="p-4">
        <Link to={`/player/${player.id}`} state={{ teamId }} className="text-blue-400 hover:underline">
          {player.name}
        </Link>
      </td>
      {player.position !== "Goalkeeper" && <td className="p-4">{player.position}</td>}
      <td className="p-4">{player.age}</td>
      <td className="p-4">{player.number}</td>
      <td className="p-4">
        <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
      </td>
    </tr>
  );
};

export default PlayerCard;
