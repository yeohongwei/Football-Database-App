const BASE_URL = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_TABLE_NAME}`;

const fetchFromAirtable = async (url, options) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Airtable API response was not ok');
    }
    return response.json();
};

export const getFavouritePlayers = async () => {
    const url = `${BASE_URL}`;
    const data = await fetchFromAirtable(url, { method: 'GET' });
    return data.records.map(record => ({ id: record.id, ...record.fields }));
};

export const addFavouritePlayer = async (playerData) => {
    // Check for duplicates
    const favourites = await getFavouritePlayers();
    const existingPlayer = favourites.find(p => p.externalId === playerData.externalId);
    if (existingPlayer) {
        console.log("Player already in favourites");
        return existingPlayer;
    }

    const url = `${BASE_URL}`;
    const data = {
        records: [{
            fields: playerData
        }]
    };
    return fetchFromAirtable(url, { method: 'POST', body: JSON.stringify(data) });
};

export const removeFavouritePlayer = async (recordId) => {
    const url = `${BASE_URL}/${recordId}`;
    return fetchFromAirtable(url, { method: 'DELETE' });
};
