import { useQuery } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
export interface Pokemon {
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
  const { data: pokemon } = useQuery<Pokemon[]>(
    ['pokemon'],
    () => fetch('/pokemon.json').then((res) => res.json()),
    {
      initialData: [],
    }
  )

  type PokemonState = {
    search: string
    loading: boolean
  }

  type PokemonActions =
    | { type: 'setSearch'; payload: string }
    | { type: 'setLoading'; payload: boolean }

  const [{ search, loading }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonActions) => {
      switch (action.type) {
        case 'setSearch':
          return { ...state, search: action.payload }
        case 'setLoading':
          return { ...state, loading: action.payload }
      }
    },
    {
      search: '',
      loading: true,
    }
  )

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
