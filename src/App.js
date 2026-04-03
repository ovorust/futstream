import React from "react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Minha Página Estática</h1>
      </header>
      <main className="content">
        <p>Este é um exemplo de página estática simplificada.</p>
        <p>Sem chamadas à API, sem estados complexos, só visualização.</p>
      </main>
      <footer className="footer">
        <span>feito com React</span>
      </footer>
    </div>
  );
}

export default App;
