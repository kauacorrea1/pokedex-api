import { useState, useEffect } from "react";
import './DailyCatch.css';

const POKEMON_RARO_IDS = [
    144, 145, 146, 150, 151,
    243, 244, 245, 249, 250, 251,
    ...Array.from({ length: 10 }, (_, i) => 377 + i),
    ...Array.from({ length: 14 }, (_, i) => 480 + i),
    ...Array.from({ length: 12 }, (_, i) => 638 + i),
    ...Array.from({ length: 6 }, (_, i) => 716 + i),
    772, 773,
    ...Array.from({ length: 8 }, (_, i) => 785 + i),
    800, 801, 802, 807, 808, 809,
    ...Array.from({ length: 11 }, (_, i) => 888 + i)
];

const RARE_POKEMON_SET = new Set(POKEMON_RARO_IDS);

const POKEMON_COMUN_IDS = Array.from(
    { length: 898 },
    (_, i) => i + 1
).filter((id) => !RARE_POKEMON_SET.has(id));

function choosePokemonId(previousId) {
    let id;

    do {
        const rareAppeared = Math.random() < 0.02;

        const pokemonPool = rareAppeared
            ? POKEMON_RARO_IDS
            : POKEMON_COMUN_IDS;

        id = pokemonPool[
            Math.floor(Math.random() * pokemonPool.length)
        ];
    } while (id === previousId);

    return id;
}

function createEncounter(previousId = null) {
    const id = choosePokemonId(previousId);

    return {
        id,
        level: Math.floor(Math.random() * 100) + 1,
        tentativas: 5,
        status: "playing",
        message: "Um Pokémon selvagem apareceu!",
        isRare: RARE_POKEMON_SET.has(id)
    };
}

function loadSavedEncounter() {
    try {
        const savedEncounter = JSON.parse(
            localStorage.getItem("encontroAtual")
        );

        if (savedEncounter?.id) {
            return {
                ...savedEncounter,
                isRare: RARE_POKEMON_SET.has(savedEncounter.id)
            };
        }
    } catch {
        localStorage.removeItem("encontroAtual");
    }

    return createEncounter();
}

function DailyCatch({ onOpenPokedex }) {
    const [encounter, setEncounter] = useState(loadSavedEncounter);
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(false);

    const {
        id,
        level,
        tentativas,
        status,
        message
    } = encounter;

    useEffect(() => {
        let requestActive = true;

        setPokemon(null);
        setError(false);

        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Pokémon não encontrado");
                }

                return res.json();
            })
            .then((data) => {
                if (requestActive) {
                    setPokemon(data);
                }
            })
            .catch((err) => {
                console.error("Erro ao buscar Pokémon", err);

                if (requestActive) {
                    setError(true);
                }
            });

        return () => {
            requestActive = false;
        };
    }, [id]);

    useEffect(() => {
        localStorage.setItem(
            "encontroAtual",
            JSON.stringify(encounter)
        );
    }, [encounter]);

    function nextPokemon() {
        setPokemon(null);
        setEncounter(createEncounter(id));
    }

    function throwPokeball() {
        if (!pokemon || tentativas <= 0 || status !== "playing") {
            return;
        }

        const newTentativas = tentativas - 1;
        const catchChance = encounter.isRare ? 0.08 : 0.25;
        const isCaught = Math.random() < catchChance;

        if (isCaught) {
            const newEncounter = {
                ...encounter,
                tentativas: newTentativas,
                status: "caught",
                message: `Sucesso! Você capturou o ${pokemon.name.toUpperCase()}!`
            };

            setEncounter(newEncounter);

            const newCapturedPokemon = {
                id: pokemon.id,
                name: pokemon.name,
                level,
                sprite: pokemon.sprites.front_default,
                dataCaptura: new Date().toLocaleDateString(),
                isRare: encounter.isRare
            };

            const savedPokedex =
                JSON.parse(localStorage.getItem("minhaPokedex")) || [];

            savedPokedex.push(newCapturedPokemon);

            localStorage.setItem(
                "minhaPokedex",
                JSON.stringify(savedPokedex)
            );

            return;
        }

        if (newTentativas === 0) {
            setEncounter({
                ...encounter,
                tentativas: 0,
                status: "fled",
                message: `Que pena! O ${pokemon.name.toUpperCase()} fugiu!`
            });

            return;
        }

        setEncounter({
            ...encounter,
            tentativas: newTentativas,
            message: `A Pokébola falhou! Restam ${newTentativas} tentativas.`
        });
    }

    if (error) {
        return <p>Não foi possível carregar o Pokémon.</p>;
    }

    if (!pokemon) {
        return <p style={{color:'#fff'}}>Procurando um Pokémon selvagem...</p>;
    }

    return (
        <div className="gba-container">
            <div className="battle-screen">
                <div className="enemy-status">
                    <div className="status-header">
                        <span>
                            {encounter.isRare ? "★ " : ""}
                            {pokemon.name}
                        </span>
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
                    <button className="menu-btn" onClick={nextPokemon}>PRÓXIMO</button>
                </div>
            </div>

        </div>
    );
}

export default DailyCatch;