import { useState, useEffect } from "react";
import  './App.css'
function Pokemon() {
  const [pokemonId, setPokemonId] = useState(1); // Start with Pokémon #1
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId || 1}`)
      .then(res => {
        if (!res.ok) throw new Error("Pokémon not found");
        return res.json();
      })
      .then(data => {
        setPokemon(data);
        setLoading(false);
      })
      .catch(() => {
        setPokemon(null);
        setLoading(false);
      });
  }, [pokemonId]);

  return (
    <>
      {loading && <p>Loading...</p>}
      
      {!loading && pokemon && (
        <div className="pokemon-container">
          <div className="pokemon-info">
          <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          <ul className="pokemon-types">
            {pokemon.types.map(({ type }) => (
              <li key={type.name}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</li>
            ))}
          </ul>
          <div className="pokemon-sprite-container">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <input
        type="number"
        min="1"
        max="898"
        value={pokemonId}
        onChange={(e) => setPokemonId(e.target.value)}
        placeholder="Enter Pokémon ID"
      />
      
        <div className="pokemon-metrics">
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
        </div>  
           <h3>Abilities:</h3>
          <ul>
            {pokemon.abilities.map(({ ability }) => (
              <li key={ability.name}>{ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}</li>
            ))}
          </ul>
          <h3>Base stats:</h3>
          <ul>
            {pokemon.stats.map(({ stat, base_stat }) => (
              <li key={stat.name}>{stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: {base_stat}</li>
            ))}
          </ul>
          </div>
          <div className="pokemon-moves">
            <h3>Moveslist:</h3>
            <ul>
              {pokemon.moves.map(({ move }) => (
                <li key={move.name}>{move.name.charAt(0).toUpperCase() + move.name.slice(1)}</li>
              ))}
            </ul>
          </div>
      </div>
      )}
      
      {!loading && !pokemon && <p>Pokémon not found</p>}
  </>
);

}

export default Pokemon;
