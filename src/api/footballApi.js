const BASE_URL = 'https://v3.football.api-sports.io';

const fetchFromApi = async (endpoint) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_FOOTBALL_API_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getStandings = (leagueId, season) => {
  return fetchFromApi(`standings?league=${leagueId}&season=${season}`);
};

export const getTopScorers = (leagueId, season) => {
    return fetchFromApi(`players/topscorers?league=${leagueId}&season=${season}`);
};

export const getTeamSquad = (teamId) => {
    return fetchFromApi(`players/squads?team=${teamId}`);
};

export const getPlayerProfile = (playerId) => {
    return fetchFromApi(`players?id=${playerId}&season=2023`);
};
