import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFavouritePlayer } from '../api/airtableApi';
import { Link } from 'react-router-dom';

const FavouritesPage = () => {
    const queryClient = useQueryClient();
    const favouritePlayers = queryClient.getQueryData(['favouritePlayers']);

    const mutation = useMutation({
        mutationFn: removeFavouritePlayer,
        onSuccess: () => {
            queryClient.invalidateQueries('favouritePlayers');
        },
    });

    const handleRemove = (recordId) => {
        mutation.mutate(recordId);
    };

    return (
        <div>
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
                                    <button onClick={() => handleRemove(player.id)}>
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
        </div>
    );
};

export default FavouritesPage;
