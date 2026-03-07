import { useState, useEffect } from "react";
import './Pokedex.css';

function Pokedex({ onBackToGame }) {
  const [capturedList, setCapturedList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

    // function cleanPokedex() {
    //   localStorage.removeItem("minhaPokedex");
    //   setCapturedList([]);
    //   setSelectedId(null);
    //   setPokemon(null);
    // }

  const typeColors = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0",
    electric: "#F7D02C", grass: "#7AC74C", ice: "#96D9D6",
    fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65",
    flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
    dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD",
  };

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem("minhaPokedex")) || [];
    setCapturedList(salvos);
    
    if (salvos.length > 0) {
      setSelectedId(salvos[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${selectedId}`)
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
  }, [selectedId]);

  return (
    <>
      <button
        onClick={onBackToGame}
        className='go-back-button'
      >
        ◀
      </button>

      {capturedList.length === 0 ? (
        <h2>Você ainda não capturou nenhum Pokémon. Volte para a grama alta!</h2>
      ) : (
        <>
        <div className="container-master">
          
          <div className="captured-gallery">
            {capturedList.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedId(p.id)}
                className="pokedex-item"
              >
                <img src={p.sprite} alt={p.name} />
                <p style={{ margin: 0, fontSize: '12px',}}>Lv {p.level}</p>
              </div>
            ))}
          </div>

          {loading && <p>Carregando dados na Pokédex...</p>}
          {!loading && pokemon && (
            <div className="pokemon-container">
              <div className="pokemon-info">
                <p style={{textAlign:'center'}}>#{pokemon.id}</p>
                <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
                <ul className="pokemon-types">
                  {pokemon.types.map(({ type }) => {
                    const color = typeColors[type.name] || "#777";
                    return (
                      <li key={type.name} style={{ backgroundColor: color }}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </li>
                    );
                  })}
                </ul>
                <div className="pokemon-sprite-container">
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                </div>

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
          </div>
        </>
      )}
    </>
  );
}

export default Pokedex;