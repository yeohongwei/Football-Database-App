import React, { useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LeaguePage from "./pages/LeaguePage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import FavouritesPage from "./pages/FavouritesPage";
import { useQuery } from "@tanstack/react-query";
import { getFavouritePlayers } from "./api/airtableApi";

function App() {
  const { data: favouritePlayers, isLoading, isError } = useQuery({
    queryKey: ['favouritePlayers'],
    queryFn: getFavouritePlayers,
  });

  if (isLoading) {
    return <div>Loading initial data...</div>
  }

  if (isError) {
    return <div>Error loading initial data...</div>
  }

  return (
    <div>
      <nav>
        <Link to="/favourites">Favourites</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/league/:leagueId/:season" element={<LeaguePage />} />
        <Route path="/team/:teamId" element={<TeamPage />} />
        <Route path="/player/:playerId" element={<PlayerPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </div>
  );
}

export default App;
