type GraphQL = {
  type: 'graphql'
  URI: string
}

type Koios = {
  type: 'koios'
}

type QueryAPI = GraphQL | Koios

type Config = {
  isMainnet: boolean
  queryAPI: QueryAPI
}

const defaultConfig: Config = {
  isMainnet: false,
  queryAPI: { type: 'koios' },
}

export type { Config }
export { defaultConfig }
