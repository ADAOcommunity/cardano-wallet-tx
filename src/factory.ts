import { CardanoWallet } from './cardanoWallet';

export class Factory {
    private _instance?: CardanoWallet;

    public get instance() {
        return this._instance;
    }

    public async load() {
        if (!this.instance)
            this._instance = new CardanoWallet(await import('@emurgo/cardano-serialization-lib-browser'));
        return this.instance;
    }
}
