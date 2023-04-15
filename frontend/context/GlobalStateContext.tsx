import React, { createContext, useState, useContext } from "react"
import * as Verifier from "../../src/declarations/Verifier"
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"

export const client = createClient({
  canisters: {
    Verifier,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

// Define the structure of your global state
interface GlobalState {
  canisterData: any
  setCanisterData: (data: any) => void
}

// Create the context
const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider")
  }
  return context
}

interface GlobalStateProviderProps {
  children: React.ReactNode
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [canisterData, setCanisterData] = useState<any>({})

  const value = {
    canisterData,
    setCanisterData,
  }

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  )
}
