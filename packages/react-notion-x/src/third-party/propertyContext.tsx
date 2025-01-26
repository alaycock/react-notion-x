import type * as types from 'notion-types'
import * as React from 'react'

type PropertyContext = {
  propertyId?: string
  schema?: types.CollectionPropertySchema
  data?: types.Decoration[]
  block?: types.Block
  collection?: types.Collection
}

const ctx = React.createContext<PropertyContext>({})

export function PropertyContextProvider({
  children,
  ...value
}: PropertyContext & { children: React.ReactNode }) {
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const usePropertyContext = () => {
  return React.useContext(ctx)
}
