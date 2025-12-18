import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayerProfile } from "../api/footballApi";
import { getFavouritePlayers, addFavouritePlayer } from "../api/airtableApi";

const PlayerPage = () => {
  const { playerId } = useParams();
  const queryClient = useQueryClient();
  const numericPlayerId = Number(playerId);

  /* ---------------- favourites ---------------- */

  const { data: favouritePlayers = [] } = useQuery({
    queryKey: ["favouritePlayers"],
    queryFn: getFavouritePlayers,
  });

  const favouritePlayer = useMemo(
    () => favouritePlayers.find((p) => p.externalId === numericPlayerId),
    [favouritePlayers, numericPlayerId]
  );

  /* ---------------- football API ---------------- */

  const {
    data: apiPlayer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["playerProfile", numericPlayerId],
    queryFn: () => getPlayerProfile(numericPlayerId),
    enabled: !favouritePlayer,
    select: (data) => {
      const p = data.response[0].player;

      return {
        externalId: p.id,
        name: p.name,
        firstname: p.firstname,
        lastname: p.lastname,
        age: p.age,
        birthDate: p.birth.date,
        birthPlace: p.birth.place,
        birthCountry: p.birth.country,
        nationality: p.nationality,
        height: p.height,
        weight: p.weight,
        number: p.number,
        position: p.position,
        photo: p.photo,
      };
    },
  });

  /* ---------------- resolved player ---------------- */

  const player = favouritePlayer ?? apiPlayer;

  /* ---------------- mutation ---------------- */

  const mutation = useMutation({
    mutationFn: addFavouritePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries(["favouritePlayers"]);
    },
  });

  /* ---------------- guards ---------------- */

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading player</div>;
  if (!player) return <div>No player data</div>;

  const isFavourite = favouritePlayers.some(
    (p) => p.externalId === player.externalId
  );

  const handleAddToFavourites = () => {
    mutation.mutate(player);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img src={player.photo} alt={player.name} className="w-48 h-48 rounded-full object-cover border-4 border-gray-700 mb-6 md:mb-0 md:mr-8" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{player.name}</h1>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
            <p><strong>Age:</strong> {player.age}</p>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Jersey Number:</strong> {player.number || 'N/A'}</p>
            <p><strong>Nationality:</strong> {player.nationality}</p>
            <p><strong>Height:</strong> {player.height}</p>
            <p><strong>Weight:</strong> {player.weight}</p>
            <p className="col-span-2"><strong>Birth Date:</strong> {player.birthDate}</p>
            <p className="col-span-2"><strong>Birth Place:</strong> {player.birthPlace}, {player.birthCountry}</p>
          </div>
          <button 
            onClick={handleAddToFavourites} 
            disabled={isFavourite}
            className="mt-6 w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            {isFavourite ? "Added to Favourites" : "Add to Favourites"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
