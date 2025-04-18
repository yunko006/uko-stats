"use client";

import { useState } from "react";

export default function Home() {
  const [steamid, setSteamid] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Utilisation de la méthode GET
      const response = await fetch(`/api/cs2-stats?steamid=${steamid}`);
      // Utilisation de la méthode POST (décommentez si vous préférez POST)
      /*
      const response = await fetch('/api/cs2-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ steamid }),
      });
      */

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await response.json();
      setPlayerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CS2 Stats Tracker</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={steamid}
            onChange={(e) => setSteamid(e.target.value)}
            placeholder="Entrez un SteamID64"
            className="px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rechercher"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {playerData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Profil joueur</h2>
          <pre className="bg-white p-4 rounded overflow-auto">
            {JSON.stringify(playerData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
