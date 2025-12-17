import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { removeFavouritePlayer, getFavouritePlayers } from "../api/airtableApi";
import { Link } from "react-router";
import RemovePlayerModal from "../components/RemovePlayerModal";

const FavouritesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState(null);

  const {
    data: favouritePlayers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favouritePlayers"],
    queryFn: getFavouritePlayers,
  });

  const mutation = useMutation({
    mutationFn: removeFavouritePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries(["favouritePlayers"]);
    },
  });

  const openRemoveModal = (player) => {
    setPlayerToRemove(player);
    setIsModalOpen(true);
  };

  const closeRemoveModal = () => {
    setPlayerToRemove(null);
    setIsModalOpen(false);
  };

  const confirmRemove = () => {
    if (playerToRemove) {
      mutation.mutate(playerToRemove.id);
    }
    closeRemoveModal();
  };

  if (isLoading) {
    return <div>Loading favourite players...</div>;
  }

  if (isError) {
    return <div>Error loading favourite players.</div>;
  }

  return (
    <div>
      <Link to="/home">Back to Home</Link>
      <h1>Favourite Players</h1>
      {favouritePlayers && favouritePlayers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Photo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {favouritePlayers.map((player) => (
              <tr key={player.id}>
                <td>
                  <Link to={`/player/${player.externalId}`}>{player.name}</Link>
                </td>
                <td>
                  <img src={player.photo} alt={player.name} width="50" />
                </td>
                <td>
                  <button onClick={() => openRemoveModal(player)}>
                    Remove from Favourites
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No favourite players yet.</p>
      )}
      <RemovePlayerModal
        isOpen={isModalOpen}
        onClose={closeRemoveModal}
        onConfirm={confirmRemove}
        playerName={playerToRemove?.name}
      />
    </div>
  );
};

export default FavouritesPage;
