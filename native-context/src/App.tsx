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

const usePokemonSource = (): { pokemon: Pokemon[]; loading: boolean } => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch('/pokemon.json')
      .then((res) => res.json())
      .then((data) => setPokemon(data))

    setLoading(false)
  }, [])

  return { pokemon, loading }
}
const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
  //this is ts hack to prevent needing to check for undefined
  {} as unknown as ReturnType<typeof usePokemonSource>
)

const usePokemon = () => {
  return useContext(PokemonContext)
}

const PokemonList = () => {
  const { pokemon, loading } = usePokemon()

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
      <PokemonContext.Provider value={usePokemonSource()}>
        <PokemonList />
      </PokemonContext.Provider>
    </div>
  )
}

export default App
