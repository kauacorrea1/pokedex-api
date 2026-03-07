import { useState, useEffect } from "react";
import './DailyCatch.css';

function refreshPokemon() {
    window.location.reload();
}

function DailyCatch({ onOpenPokedex }) {
    const [pokemon, setPokemon] = useState(null);
    const [tentativas, setTentativas] = useState(5);
    const [level, setLevel] = useState(1);
    const [status, setStatus] = useState("playing");
    const [message, setMessage] = useState("Um Pokémon selvagem apareceu!");
    // const [currentView, setCurrentView] = useState("game");

    useEffect(() => {
        const randomId = Math.floor(Math.random() * 898) + 1;        
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(res => res.json())
            .then(data => {setPokemon(data)
            const randomLevel = Math.floor(Math.random() * 100) + 1;
            setLevel(randomLevel);
    })
            .catch(err => console.error("Erro ao buscar Pokémon", err));
            
    }, []);

    

    const throwPokeball = () => {
        if (tentativas <= 0 || status === "caught") return;

        const newTentativas = tentativas - 1;
        setTentativas(newTentativas);
        const catchChance = Math.random();
        const isCaught = catchChance < 0.25;

        if (isCaught) {
    setStatus("caught");
    setMessage(`Sucesso! Você capturou o ${pokemon.name.toUpperCase()}!`);
    const novoPokemonCapturado = {
        id: pokemon.id,
        name: pokemon.name,
        level: level,
        sprite: pokemon.sprites.front_default,
        dataCaptura: new Date().toLocaleDateString()
    };

    const pokedexSalva = JSON.parse(localStorage.getItem("minhaPokedex")) || [];
    
    pokedexSalva.push(novoPokemonCapturado);
 
    localStorage.setItem("minhaPokedex", JSON.stringify(pokedexSalva));
} else if(newTentativas === 0) {
    setStatus('fled');
    setMessage(`Que pena! O ${pokemon.name.toUpperCase()} fugiu!`)

}
    };

    if (!pokemon) return <p>Procurando um Pokémon selvagem...</p>;

    return (
        <div className="gba-container">
            <div className="battle-screen">
                <div className="enemy-status">
                    <div className="status-header">
                        <span>{pokemon.name}</span>
                        <span>Lv{level}</span>
                    </div>
                    <div className="hp-bar-container">
                        <span className="hp-label">HP</span>
                        <div className="hp-fill"></div>
                    </div>
                </div>

                <div className={`grass-base ${status === 'caught' ? 'is-caught' : ''}`} ></div>
                <div className={`enemy-sprite ${status === 'caught' ? 'is-caught' : ''}`}>
                    <img
                        src={
                            status === 'caught'
                                ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                                : pokemon.sprites.front_default
                        }
                        alt={status === 'caught' ? "Pokébola" : pokemon.name}
                        style={{ filter: status === 'fled' ? 'grayscale(100%)' : 'none' }}
                    />
                </div>
            </div>

            <div className="bottom-ui">
                <div className="dialog-box">
                    {message}
                </div>

                <div className="action-menu">
                    <button
                        className="menu-btn"
                        onClick={throwPokeball}
                        disabled={status !== "playing"}
                    >
                        BALL({tentativas})
                    </button>
                    <button className="menu-btn" disabled>ITEM</button>
                    <button className="menu-btn" onClick={onOpenPokedex}>POKÉDEX</button>
                    <button className="menu-btn" onClick={refreshPokemon}>PRÓXIMO</button>
                </div>
            </div>

        </div>
    );
}

export default DailyCatch;