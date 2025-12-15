import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayerProfile } from "../api/footballApi";
import { addFavouritePlayer } from "../api/airtableApi";

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const favouritePlayers = queryClient.getQueryData(["favouritePlayers"]);
  const favouritePlayer = favouritePlayers?.find(
    (p) => p.externalId === parseInt(playerId)
  );

  const {
    data: playerData,
    isLoading: isLoadingPlayer,
    isError: isErrorPlayer,
  } = useQuery({
    queryKey: ["playerProfile", playerId],
    queryFn: () => getPlayerProfile(playerId),
    enabled: !favouritePlayer, // Only fetch if not in favourites
  });

  const mutation = useMutation({
    mutationFn: addFavouritePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries("favouritePlayers");
    },
  });

  if (isLoadingPlayer) {
    return <div>Loading...</div>;
  }

  if (isErrorPlayer) {
    return <div>Error fetching data</div>;
  }

  const player = favouritePlayer || playerData?.response[0]?.player;
  // const statistics = playerData?.response[0]?.statistics[0];

  const isFavourite = favouritePlayers?.some((p) => p.externalId === player.id);

  const handleAddToFavourites = () => {
    const playerDataToSave = {
      type: "player",
      externalId: player.id,
      name: player.name,
      firstname: player.firstname,
      lastname: player.lastname,
      age: player.age,
      birthDate: player.birth.date,
      birthPlace: player.birth.place,
      birthCountry: player.birth.country,
      nationality: player.nationality,
      height: player.height,
      weight: player.weight,
      number: statistics?.games.number,
      position: statistics?.games.position,
      photo: player.photo,
    };
    mutation.mutate(playerDataToSave);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      {player && (
        <div>
          <h1>{player.name}</h1>
          <img src={player.photo} alt={player.name} width="150" />
          <p>
            <strong>Age:</strong> {player.age}
          </p>
          <p>
            <strong>Birth Date:</strong> {player.birthDate || player.birth.date}
          </p>
          <p>
            <strong>Birth Place:</strong>{" "}
            {player.birthPlace || player.birth.place},{" "}
            {player.birthCountry || player.birth.country}
          </p>
          <p>
            <strong>Nationality:</strong> {player.nationality}
          </p>
          <p>
            <strong>Height:</strong> {player.height}
          </p>
          <p>
            <strong>Weight:</strong> {player.weight}
          </p>
          <p>
            <strong>Position:</strong>{" "}
            {player.position || statistics?.games.position}
          </p>
          <p>
            <strong>Jersey Number:</strong>{" "}
            {player.number || statistics?.games.number}
          </p>
          <button onClick={handleAddToFavourites} disabled={isFavourite}>
            {isFavourite ? "Added to Favourites" : "Add to Favourites"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
