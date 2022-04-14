import { CardanoWallet } from './cardanoWallet'

export class Factory {
  private _instance?: CardanoWallet

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public get instance() {
    return this._instance
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async load() {
    if (!this.instance)
      this._instance = new CardanoWallet(
        await import('@emurgo/cardano-serialization-lib-browser')
      )
    return this.instance
  }
}
