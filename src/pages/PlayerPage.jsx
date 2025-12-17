import React, { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayerProfile } from "../api/footballApi";
import { addFavouritePlayer, getFavouritePlayers } from "../api/airtableApi";

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { teamId } = location.state || {};

  const { data: favouritePlayers = [], isSuccess: isFavouriteSuccess } =
    useQuery({
      queryKey: ["favouritePlayers"],
      queryFn: getFavouritePlayers,
    });

  const favouritePlayer = useMemo(() => {
    if (!isFavouriteSuccess) return null;
    return favouritePlayers.find((p) => p.externalId === parseInt(playerId));
  }, [favouritePlayers, playerId]);

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
      queryClient.invalidateQueries(["favouritePlayers"]);
    },
  });

  if (isLoadingPlayer) {
    return <div>Loading...</div>;
  }

  if (isErrorPlayer) {
    return <div>Error fetching data</div>;
  }

  const player = useMemo(() => {
    if (favouritePlayer) return favouritePlayer;

    if (playerData) {
      const p = playerData.response[0].player;
      return {
        ...p,
        birthDate: p.birth.date,
        birthPlace: p.birth.place,
        birthCountry: p.birth.country,
      };
    }

    return null;
  }, [favouritePlayer, playerData]);

  const isFavourite = favouritePlayers.some(
    (p) => p.externalId === player.externalId
  );

  const handleAddToFavourites = () => {
    const playerDataToSave = {
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
            <strong>Birth Date:</strong> {player.birthDate}
          </p>
          <p>
            <strong>Birth Place:</strong>
            {player.birthPlace}, {player.birthCountry}
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
      )}
    </div>
  );
};

export default PlayerPage;
