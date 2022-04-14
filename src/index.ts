// Copyright (c) ADAOcommunity. All rights reserved. Licensed under the Apache License 2.0 license.

/**
 * 🚧 Allows creating transactions based on configuration, including minting and plutus scripts. For details, see {@link https://github.com/ADAOcommunity/cardano-wallet-tx | github}
 *
 * @remarks
 * Allows creating transactions based on configuration, including minting and plutus scripts
 *
 * It uses npm, TypeScript compiler, Jest, webpack, ESLint, Prettier, husky, pinst, commitlint. The production files include CommonJS, ES Modules, UMD version and TypeScript declaration files.
 *
 *For Cardano related operations it uses custom version of cardano serialization library and Cardano Koios or Graphql instance to for chain data.
 *
 * @packageDocumentation
 */

import CardanoWallet from './cardanoWallet'
import { Value, ProtocolParameters, UTxO } from './queryApi'
import {
  getBalance,
  addressUTxOsQuery,
  protocolParametersQuery,
  assetUTxOsQuery,
} from './queryApi'
import { Config } from './config'
import { defaultConfig } from './config'
import { walletConfig } from './walletConfig'
import {
  Asset,
  MintedAsset,
  BurnAsset,
  AssetHolding,
  Policy,
  Recipient,
  UTXO,
  ValueHolding,
  WalletApi,
  Delegation,
} from './types/index'
import { Factory } from './factory'
import TransactionParams from './types/TransactionParams'

export type {
  Value,
  ProtocolParameters,
  UTxO,
  Config,
  Asset,
  MintedAsset,
  BurnAsset,
  AssetHolding,
  Policy,
  Recipient,
  UTXO,
  ValueHolding,
  WalletApi,
  Delegation,
  TransactionParams,
}
export {
  CardanoWallet,
  getBalance,
  addressUTxOsQuery,
  protocolParametersQuery,
  assetUTxOsQuery,
  defaultConfig,
  walletConfig,
  Factory,
}
