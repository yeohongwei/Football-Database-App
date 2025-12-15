import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const leagues = [
  { id: 39, name: 'English Premier League (ENG)' },
  { id: 140, name: 'La Liga (ESP)' },
  { id: 135, name: 'Serie A (ITA)' },
  { id: 78, name: 'Bundesliga (GER)' },
  { id: 71, name: 'Ligue 1 (FRA)' },
];

const seasons = [2021, 2022, 2023];

const HomePage = () => {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].id);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/league/${selectedLeague}/${selectedSeason}`);
  };

  return (
    <div>
      <h1>Football Database</h1>
      <div>
        <label htmlFor="league-select">Choose a league:</label>
        <select
          id="league-select"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="season-select">Choose a season:</label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>View Standings</button>
    </div>
  );
};

export default HomePage;
