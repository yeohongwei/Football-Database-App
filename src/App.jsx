import React, { useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router";
import HomePage from "./pages/HomePage";
import LeaguePage from "./pages/LeaguePage";
import TeamPage from "./pages/TeamPage";
import PlayerPage from "./pages/PlayerPage";
import FavouritesPage from "./pages/FavouritesPage";
import NotFoundPage from "./pages/NotFoundPage"; // Import NotFoundPage
import { useQuery } from "@tanstack/react-query";
import { getFavouritePlayers } from "./api/airtableApi";

function App() {
  const {
    data: favouritePlayers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favouritePlayers"],
    queryFn: getFavouritePlayers,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading initial data...</div>;
  }

  if (isError) {
    return <div className="text-center p-4 text-red-500">Error loading initial data...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex justify-end items-center p-4 bg-gray-800 rounded-t-lg">
          <Link to="/home" className="text-lg font-semibold hover:text-blue-400 transition-colors">Home</Link>
          <span className="mx-4 text-gray-500">|</span>
          <Link to="/favourites" className="text-lg font-semibold hover:text-blue-400 transition-colors">Favourites</Link>
        </nav>
        <main className="p-4 bg-gray-800 rounded-b-lg">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/league/:leagueId/:season" element={<LeaguePage />} />
            <Route path="/team/:teamId" element={<TeamPage />} />
            <Route path="/player/:playerId" element={<PlayerPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
