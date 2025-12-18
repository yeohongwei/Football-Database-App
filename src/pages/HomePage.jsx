import React, { useState } from "react";
import { useNavigate } from "react-router";

const leagues = [
  { id: 39, name: "English Premier League (ENG)" },
  { id: 140, name: "La Liga (ESP)" },
  { id: 135, name: "Serie A (ITA)" },
  { id: 78, name: "Bundesliga (GER)" },
  { id: 61, name: "Ligue 1 (FRA)" },
];

const seasons = [2023, 2022, 2021];

const HomePage = () => {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].id);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/league/${selectedLeague}/${selectedSeason}`);
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6">Football Database</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="league-select" className="block text-sm font-medium text-gray-400 mb-1">Choose a league:</label>
          <select
            id="league-select"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {leagues.map((league) => (
              <option key={league.id} value={league.id} className="bg-gray-800 text-white">
                {league.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="season-select" className="block text-sm font-medium text-gray-400 mb-1">Choose a season:</label>
          <select
            id="season-select"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {seasons.map((season) => (
              <option key={season} value={season} className="bg-gray-800 text-white">
                {season}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button 
        onClick={handleSubmit} 
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        View Standings
      </button>
    </div>
  );
};

export default HomePage;
