import { CardanoWallet } from './cardanoWallet'
// Copyright (c) ADAOcommunity. All rights reserved. Licensed under the Apache License 2.0 license.

/**
 * 🚧 Allows creating transactions based on configuration, including minting and plutus scripts. Checkout development: {@link https://github.com/ADAOcommunity/cardano-wallet-tx | github}
 *
 * @packageDocumentation
 */

/**
 * Factory for CardanoWallet Instance
 *
 * @remarks
 * Imports the @emurgo/cardano-serialization-lib-browser
 * ```ts
 * new CardanoWallet(await import('@emurgo/cardano-serialization-lib-browser'))
 * ```
 * @returns CardanoWallet Instance
 *
 * @public
 */
export class Factory {
  private _instance?: CardanoWallet

  /**
   * Get Factory Instance.
   *
   * @example
   *
   * ```ts
   * ```
   * @readonly
   */

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get instance() {
    return this._instance
  }

  /**
   * Cardano Serialization Lib Factory Loader.
   *
   * @remarks
   * This method attaches the cardano-serialization-lib-browser.
   *
   * @example
   *
   * ```ts
   * ```
   *
   * @eventProperty
   *
   * @public
   */

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async load() {
    if (!this.instance)
      this._instance = new CardanoWallet(
        await import('@emurgo/cardano-serialization-lib-browser')
      )
    return this.instance
  }
}
