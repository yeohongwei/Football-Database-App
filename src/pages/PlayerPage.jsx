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
    <div>
      <Link to="/home">Back to Home</Link>

      <h1>{player.name}</h1>
      <img src={player.photo} alt={player.name} width="150" />

      <p>
        <strong>Age:</strong> {player.age}
      </p>
      <p>
        <strong>Birth Date:</strong> {player.birthDate}
      </p>
      <p>
        <strong>Birth Place:</strong> {player.birthPlace}, {player.birthCountry}
      </p>
      <p>
        <strong>Nationality:</strong> {player.nationality}
      </p>
      <p>
        <strong>Height:</strong> {player.height} cm
      </p>
      <p>
        <strong>Weight:</strong> {player.weight} kg
      </p>
      <p>
        <strong>Position:</strong> {player.position}
      </p>
      <p>
        <strong>Jersey Number:</strong> {player.number}
      </p>

      <button onClick={handleAddToFavourites} disabled={isFavourite}>
        {isFavourite ? "Added to Favourites" : "Add to Favourites"}
      </button>
    </div>
  );
};

export default PlayerPage;
