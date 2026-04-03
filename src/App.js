import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://futstream-server.onrender.com/";

function App() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoadingGames(true);
    setGames([]);
    setPlayers([]);
    setSelectedGame(null);

    try {
      const res = await fetch(`${API_URL}/games`);
      const data = await res.json();
      setGames(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGames(false);
    }
  };

  const selectGame = async (game) => {
    setSelectedGame(game);
    setLoadingPlayers(true);
    setPlayers([]);

    try {
      const res = await fetch(
        `${API_URL}/players?game_url=${encodeURIComponent(game.url)}`
      );
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>FUTSTREAM</h1>
        <button onClick={loadGames} disabled={loadingGames}>
          Recarregar
        </button>
      </header>

      <div className="container">
        {/* Jogos */}
        <aside className="games-panel">
          <h2>Jogos</h2>

          {loadingGames && <p>Carregando...</p>}
          {!loadingGames && games.length === 0 && <p>Nenhum jogo</p>}

          {games.map((game) => (
            <div
              key={game.url}
              className={`game ${
                selectedGame?.url === game.url ? "active" : ""
              }`}
              onClick={() => selectGame(game)}
            >
              {game.title}
            </div>
          ))}
        </aside>

        {/* Players */}
        <main className="players-panel">
          <h2>Players</h2>

          {!selectedGame && <p>Selecione um jogo</p>}
          {loadingPlayers && <p>Carregando players...</p>}
          {!loadingPlayers && selectedGame && players.length === 0 && (
            <p>Nenhum player</p>
          )}

          {players.map((p) => (
            <div key={p.url} className="player">
              <span>{p.label}</span>
              <button onClick={() => window.open(p.url, "_blank")}>
                Abrir
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;