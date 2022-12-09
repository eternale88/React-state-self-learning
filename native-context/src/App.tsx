import { useState, useEffect, createContext, useContext } from 'react'
interface Pokemon {
  id: number
  name: string
  type: string[]
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
}

const usePokemon = (): { pokemon: Pokemon[]; loading: boolean } => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch('../public/pokemon.json')
      .then((res) => res.json())
      .then((data) => setPokemon(data))

    setLoading(false)
  }, [])

  return { pokemon, loading }
}
const PokemonContext = createContext({
  pokemon: [] as Pokemon[],
  loading: false,
})

const PokemonList = () => {
  const { pokemon, loading } = useContext(PokemonContext)

  if (loading) return <div>Loading</div>

  return (
    <div>
      {pokemon.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
function App() {
  return (
    <div>
      <PokemonContext.Provider value={usePokemon()}>
        <PokemonList />
      </PokemonContext.Provider>
    </div>
  )
}

export default App
