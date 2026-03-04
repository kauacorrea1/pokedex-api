import { useState } from "react";
import Pokedex from "./Pokedex";
import DailyCatch from "./DailyCatch";
// import './App.css';

function App() {

    return (
        <div className="app-container">
            <main>
                {currentView === "game" ? (
                    <DailyCatch onOpenPokedex={() => setCurrentView("pokedex")} />
                ) : (
                    <Pokedex onBackToGame={() => setCurrentView("game")} />
                )}
            </main>
        </div>
    );
}

export default App;