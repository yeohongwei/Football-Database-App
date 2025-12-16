import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayerProfile } from "../api/footballApi";
import { addFavouritePlayer } from "../api/airtableApi";

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { leagueId, teamId } = location.state || {};

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
      number: player.number,
      position: player.position,
      photo: player.photo,
    };
    mutation.mutate(playerDataToSave);
  };

  const handleBack = () => {
    if (teamId) {
      navigate(`/team/${teamId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div>
      <button onClick={handleBack}>Back</button>
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
            <strong>Position:</strong> {player.position}
          </p>
          <p>
            <strong>Jersey Number:</strong> {player.number}
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
