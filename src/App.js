import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

const API_URL = "https://futstream-server.onrender.com";

function App() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [search, setSearch] = useState("");

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
      setGames(data.games || []);
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
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
        `${API_URL}/players?url=${encodeURIComponent(game.url)}`
      );
      const data = await res.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error("Erro ao carregar players:", err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const filteredGames = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return games;
    return games.filter((g) => (g.title || "").toLowerCase().includes(s));
  }, [games, search]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-dot">•</div>
          <div>
            <div className="header-title">FUTSTREAM</div>
            <div className="header-sub">Jogos e players em tempo real</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="reload-btn" onClick={loadGames} disabled={loadingGames}>
            {loadingGames ? "Carregando..." : "Recarregar"}
          </button>
        </div>
      </header>

      <div className="container">
        {/* Jogos */}
        <aside className="games-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">JOGOS</div>
              <div className="games-count">{games.length} disponíveis</div>
            </div>
            <div className="separator" />
          </div>

          <div style={{ padding: 12 }}>
            <input
              className="games-search"
              placeholder="Pesquisar jogos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="games-list">
            {loadingGames && <div className="empty-message">Carregando...</div>}
            {!loadingGames && filteredGames.length === 0 && (
              <div className="empty-message">Nenhum jogo</div>
            )}

            {filteredGames.map((game) => (
              <div
                key={game.url}
                className={`game-card ${selectedGame?.url === game.url ? "selected" : ""}`}
                onClick={() => selectGame(game)}
              >
                <div className="game-card-inner">
                  <div className="game-dot">●</div>
                  <div className="game-title">{game.title}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Players */}
        <main className="players-panel">
          <div className="panel-header">
            <div>
              <div className="panel-title">PLAYERS</div>
              <div className="games-count">{selectedGame ? selectedGame.title : "—"}</div>
            </div>
          </div>

          <div className="players-list">
            {!selectedGame && <div className="empty-message">Selecione um jogo</div>}
            {loadingPlayers && <div className="empty-message">Carregando players...</div>}
            {!loadingPlayers && selectedGame && players.length === 0 && (
              <div className="empty-message">Nenhum player</div>
            )}

            {players.map((p) => (
              <div key={p.url} className="player-card">
                <div className="player-info">
                  <div className="player-label">{p.name}</div>
                  <div className="player-url">{p.url}</div>
                </div>

                <button className="player-btn" onClick={() => window.open(p.url, "_blank")}>
                  Abrir
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;