import { createContext } from "react";
import { Config, defaultConfig } from 'cardano-wallet-tx'

const ConfigContext = createContext<[Config, (x: Config) => void]>([defaultConfig, (_) => { }])

export default ConfigContext