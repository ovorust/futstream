import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const API_URL = "http://localhost:8000/api";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function App() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Iniciando...");
  const [spinFrame, setSpinFrame] = useState(0);
  const spinnerRef = useRef(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setSpinFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadGames = async () => {
    setLoading(true);
    setStatus("Carregando jogos...");
    setGames([]);
    setPlayers([]);
    setSelectedGame(null);

    try {
      const response = await fetch(`${API_URL}/games`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setGames(data);
      setStatus(`${data.length} jogos encontrados`);
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectGame = async (game) => {
    setSelectedGame(game);
    setLoading(true);
    setStatus("Buscando players...");
    setPlayers([]);
    setSpinFrame(0);

    try {
      const response = await fetch(
        `${API_URL}/players?game_url=${encodeURIComponent(game.url)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setPlayers(data);
      setStatus(`${data.length} player(s) encontrado(s)`);
    } catch (error) {
      setStatus(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openPlayer = (url, label) => {
    setStatus(`Abrindo: ${label}`);
    window.open(url, "_blank");
  };

  const shortenUrl = (url, maxLen = 65) => {
    return url.length > maxLen ? url.substring(0, maxLen - 1) + "…" : url;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-dot">⬤</span>
          <h1 className="header-title">FUTSTREAM</h1>
          <span className="header-sub">jogos de futebol ao vivo</span>
        </div>
        <button
          className="reload-btn"
          onClick={loadGames}
          disabled={loading}
          title="Recarregar jogos"
        >
          ↺ Recarregar
        </button>
      </header>

      <div className="container">
        {/* Coluna esquerda: Jogos */}
        <aside className="games-panel">
          <div className="panel-header">
            <h2 className="panel-title">JOGOS AO VIVO</h2>
            <span className="games-count">{games.length} jogos</span>
          </div>
          <div className="separator"></div>
          <div className="games-list">
            {games.length === 0 && !loading && (
              <div className="empty-message">Nenhum jogo encontrado</div>
            )}
            {games.map((game) => (
              <div
                key={game.url}
                className={`game-card ${
                  selectedGame?.url === game.url ? "selected" : ""
                }`}
                onClick={() => selectGame(game)}
              >
                <div className="game-card-inner">
                  <span className="game-dot">⬤</span>
                  <span className="game-title">{game.title}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Coluna direita: Players */}
        <main className="players-panel">
          <div className="panel-header">
            <h2 className="panel-title">PLAYERS DISPONÍVEIS</h2>
          </div>
          <div className="players-list">
            {selectedGame === null && !loading && (
              <div className="empty-message">← Selecione um jogo</div>
            )}
            {players.length === 0 && selectedGame !== null && !loading && (
              <div className="empty-message">Nenhum player encontrado</div>
            )}
            {players.map((player) => (
              <div key={player.url} className="player-card">
                <div className="player-info">
                  <div className="player-label">{player.label}</div>
                  <div className="player-url">{shortenUrl(player.url)}</div>
                </div>
                <button
                  className="player-btn"
                  onClick={() => openPlayer(player.url, player.label)}
                  title="Abrir stream"
                >
                  ▶ Abrir
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Status bar */}
      <footer className="status-bar">
        <span className="status-text">{status}</span>
        {loading && <span className="spinner">{SPINNER_FRAMES[spinFrame]}</span>}
      </footer>
    </div>
  );
}

export default App;
