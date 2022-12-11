import {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react'

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

const usePokemonSource = (): {
  pokemon: Pokemon[]
  search: string
  setSearch: (search: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
} => {
  // const [pokemon, setPokemon] = useState<Pokemon[]>([])
  //const [loading, setLoading] = useState<boolean>(true)
  type PokemonState = {
    pokemon: Pokemon[]
    search: string
    loading: boolean
  }

  type PokemonActions =
    | {
        type: 'setPokemon'
        payload: Pokemon[]
      }
    | { type: 'setSearch'; payload: string }
    | { type: 'setLoading'; payload: boolean }

  const [{ pokemon, search, loading }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonActions) => {
      switch (action.type) {
        case 'setPokemon':
          return { ...state, pokemon: action.payload }
        case 'setSearch':
          return { ...state, search: action.payload }
        case 'setLoading':
          return { ...state, loading: action.payload }
      }
    },
    {
      pokemon: [],
      search: '',
      loading: true,
    }
  )

  useEffect(() => {
    fetch('/pokemon.json')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'setPokemon', payload: data }))

    setLoading(false)
  }, [])

  const setSearch = useCallback((search: string) => {
    dispatch({ type: 'setSearch', payload: search })
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'setLoading', payload: loading })
  }, [])

  const filteredPokemon = useMemo(() => {
    return pokemon
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 20)
  }, [pokemon, search])

  const sortedPokemon = useMemo(() => {
    return [...filteredPokemon].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    )
  }, [filteredPokemon])

  return { pokemon: sortedPokemon, search, setSearch, loading, setLoading }
}
const PokemonContext = createContext<ReturnType<typeof usePokemonSource>>(
  //this is ts hack to prevent needing to check for undefined
  {} as unknown as ReturnType<typeof usePokemonSource>
)

export function usePokemon() {
  return useContext(PokemonContext)
}

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  return (
    <PokemonContext.Provider value={usePokemonSource()}>
      {children}
    </PokemonContext.Provider>
  )
}
