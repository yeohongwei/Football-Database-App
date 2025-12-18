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
    <div className="bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Favourite Players</h1>
      {favouritePlayers && favouritePlayers.length > 0 ? (
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Photo</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {favouritePlayers.map((player) => (
              <tr key={player.id} className="hover:bg-gray-700">
                <td className="p-4">
                  <Link to={`/player/${player.externalId}`} className="text-blue-400 hover:underline">{player.name}</Link>
                </td>
                <td className="p-4">
                  <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="p-4">
                  <button onClick={() => openRemoveModal(player)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-400">No favourite players yet.</p>
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
