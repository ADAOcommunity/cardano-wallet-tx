import { Address, AssetName, AuxiliaryData, AuxiliaryDataHash, BigNum, CoinSelectionStrategyCIP2, Costmdls, CostModel, encode_json_str_to_metadatum, GeneralTransactionMetadata, hash_auxiliary_data, hash_script_data, Int, Language, LinearFee, NativeScript, NativeScripts, PlutusData, PlutusList, PlutusScript, PlutusScripts, Redeemer, Redeemers, Transaction, TransactionBuilder, TransactionBuilderConfigBuilder, TransactionInputs, TransactionOutputs, TransactionUnspentOutput, TransactionUnspentOutputs, TransactionWitnessSet, Vkeywitnesses } from "@emurgo/cardano-serialization-lib-browser";
import { ProtocolParameters } from "./queryApi";
import { MintedAsset, BurnAsset } from "./types";

export async function _txBuilderSpendFromPlutusScript({
    PaymentAddress,
    Utxos,
    Outputs,
    ProtocolParameter,
    mintedAssetsArray = [],
    metadata = null,
    metadataHash = null,
    ttl = null,
    datums = [],
    redeemers = [],
    plutusValidators = [],
    plutusPolicies = [],
} : {
    PaymentAddress: string,
    Utxos: TransactionUnspentOutput[],
    Outputs: TransactionOutputs,
    ProtocolParameter: ProtocolParameters,
    mintedAssetsArray: MintedAsset[] | BurnAsset[],
    metadata: object | null,
    metadataHash: string | null,
    ttl: number | null,
    datums: PlutusData[],
    redeemers: Redeemer[],
    plutusValidators: PlutusScript[],
    plutusPolicies: PlutusScript[],
}): Promise<Transaction | null> {

    const nativeScripts = NativeScripts.new();
    const txbuilder = createTxBuilder(ProtocolParameter)
    mintedAssetsArray.forEach(a => {
        const policyScript = NativeScript.from_bytes(
            Buffer.from(a.policyScript, 'hex'),
        );
        txbuilder.add_mint_asset(
            policyScript,
            AssetName.new(Buffer.from(a.assetName, 'ascii')),
            Int.new_i32(Number(a.quantity))
        )
    })
    let aux = AuxiliaryData.new();
    for (let i = 0; i < Outputs.len(); i++) {
        txbuilder.add_output(Outputs.get(i));
    }
    const utxos = TransactionUnspentOutputs.new()
    for (let i = 0; i < Utxos.length; i++) {
        if (typeof Utxos[i] === 'string' || Utxos[i] instanceof String) {
            utxos.add(
                TransactionUnspentOutput.from_bytes(
                    Buffer.from(Utxos[i].toString(), 'hex')
                )
            )
        }
        else if (typeof Utxos[i] === 'object') {
            utxos.add(Utxos[i] as TransactionUnspentOutput)
        }
    }
    if (ttl) {
        txbuilder.set_ttl(ProtocolParameter.slot + ttl)
    }
    console.log('adding inputs from')
    console.log(utxos.len())
    // CoinSelection.setProtocolParameters(
    //     ProtocolParameter.coinsPerUtxoWord,
    //     ProtocolParameter.minFeeA,
    //     ProtocolParameter.minFeeB,
    //     ProtocolParameter.maxTxSize
    // )
    // let { input } = CoinSelection.randomImprove(
    //     Utxos,
    //     Outputs,
    //     100,
    //     scriptUtxos
    // );
    // input.forEach((utxo) => {
    //     txbuilder.add_input(
    //         utxo.output().address(),
    //         utxo.input(),
    //         utxo.output().amount()
    //     );
    // });
    txbuilder.add_inputs_from(utxos, CoinSelectionStrategyCIP2.LargestFirstMultiAsset)
    console.log('inputs added')
    let addr
    try {
        addr = Address.from_bytes(Buffer.from(PaymentAddress, "hex"))
    }
    catch {
        addr = Address.from_bech32(PaymentAddress)

    }
   
    if (metadata) {
        const generalMetadata = GeneralTransactionMetadata.new();
        Object.entries(metadata).map(([MetadataLabel, Metadata]) => {
            generalMetadata.insert(
                BigNum.from_str(MetadataLabel),
                encode_json_str_to_metadatum(JSON.stringify(Metadata), 0),
            );
        });

        aux.set_metadata(generalMetadata);
    }
    
    const witnesses = TransactionWitnessSet.new();

    witnesses.set_native_scripts(nativeScripts);

    const pScripts = PlutusScripts.new()
    plutusValidators.forEach((pV) => pScripts.add(pV))
    witnesses.set_plutus_scripts(pScripts)

    const pData = PlutusList.new()
    datums.forEach((pD) => pData.add(pD))
    witnesses.set_plutus_data(pData)

    const pRedeemers = Redeemers.new()
    redeemers.forEach((pR) => pRedeemers.add(pR))
    witnesses.set_redeemers(pRedeemers)

    // txbuilder.set_redeemers(
    //     Redeemers.from_bytes(pRedeemers.to_bytes())
    // );
    // txbuilder.set_plutus_data(
    //     pData
    // );
    // txbuilder.set_plutus_scripts(pScripts);
    
    // const collateral = (
    //     await this.wallet.getCollateral()
    // ).map((utxo) =>
    //     this.lib.TransactionUnspentOutput.from_bytes(fromHex(utxo))
    // );
    // if (!collateral) throw new Error("NO_COLLATERAL");
    // console.log('collateral')
    // console.log(collateral)
    // setCollateral(txbuilder, collateral);

    const vkeys = Vkeywitnesses.new();

    witnesses.set_vkeys(vkeys);

    const cost_model_vals = [197209, 0, 1, 1, 396231, 621, 0, 1, 150000, 1000, 0, 1, 150000, 32, 2477736, 29175, 4, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 29773, 100, 100, 100, 29773, 100, 150000, 32, 150000, 32, 150000, 32, 150000, 1000, 0, 1, 150000, 32, 150000, 1000, 0, 8, 148000, 425507, 118, 0, 1, 1, 150000, 1000, 0, 8, 150000, 112536, 247, 1, 150000, 10000, 1, 136542, 1326, 1, 1000, 150000, 1000, 1, 150000, 32, 150000, 32, 150000, 32, 1, 1, 150000, 1, 150000, 4, 103599, 248, 1, 103599, 248, 1, 145276, 1366, 1, 179690, 497, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 148000, 425507, 118, 0, 1, 1, 61516, 11218, 0, 1, 150000, 32, 148000, 425507, 118, 0, 1, 1, 148000, 425507, 118, 0, 1, 1, 2477736, 29175, 4, 0, 82363, 4, 150000, 5000, 0, 1, 150000, 32, 197209, 0, 1, 1, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 150000, 32, 3345831, 1, 1];

    const costModel = CostModel.new();
    cost_model_vals.forEach((x, i) => costModel.set(i, Int.new_i32(x)));

    const costModels = Costmdls.new();
    costModels.insert(Language.new_plutus_v1(), costModel);

    const scriptDataHash = hash_script_data(pRedeemers, costModels, pData);
    console.log(addr)
    txbuilder.add_change_if_needed(addr);
    let txBody
    // const txBody = txbuilder.build()
    if (metadataHash) {
        const auxDataHash = AuxiliaryDataHash.from_bytes(
            Buffer.from(metadataHash, 'hex'),
        );
        console.log(auxDataHash);
        txBody = txbuilder.build()

        txBody.set_auxiliary_data_hash(auxDataHash);
    } else {
        txbuilder.set_auxiliary_data(aux)
        txBody = txbuilder.build()
        // txBody.set_auxiliary_data_hash(auxDataHash);
        // txBody.set_auxiliary_data_hash(this.lib.hash_auxiliary_data(aux))
    }

    txBody.set_script_data_hash(scriptDataHash);
    const transaction = Transaction.new(
        txBody,
        witnesses,
        aux
    );

    const size = transaction.to_bytes().length * 2;
    if (size > ProtocolParameter.maxTxSize) throw 'Error.TX_TOO_BIG';

    return transaction;
}

// /**
//    * @private
//    */
// async function setCollateral(txBuilder: TransactionBuilder, collateral: TransactionUnspentOutput) {
//     const inputs = TransactionInputs.new();
//     // utxos.forEach((utxo) => {
//     inputs.add(collateral.input());
//     txBuilder.add_address_witness(collateral.output().address());
//     // });
//     txBuilder.set_collateral(inputs);
// }

export async function _txBuilderMinting({
    PaymentAddress,
    Utxos,
    Outputs,
    ProtocolParameter,
    mintedAssetsArray = [],
    metadata = null,
    metadataHash = null,
    ttl = null,
    multiSig = false
}: {
    PaymentAddress: string,
    Utxos: TransactionUnspentOutput[],
    Outputs: TransactionOutputs,
    ProtocolParameter: ProtocolParameters,
    mintedAssetsArray: MintedAsset[],
    metadata: object | null,
    metadataHash: string | null,
    ttl: number | null,
    multiSig: boolean
}): Promise<Transaction | null> {
    console.log('_txBuilderMinting')
    const nativeScripts = NativeScripts.new();
    const txbuilder = createTxBuilder(ProtocolParameter)
    mintedAssetsArray.forEach(a => {
        const policyScript = NativeScript.from_bytes(
            Buffer.from(a.policyScript, 'hex'),
        );
        txbuilder.add_mint_asset(
            policyScript,
            AssetName.new(Buffer.from(a.assetName, 'ascii')),
            Int.new(BigNum.from_str(a.quantity.toString()))
        )
        nativeScripts.add(policyScript)
    })
    console.log('_txBuilderMinting minting set')

    let aux = AuxiliaryData.new();
    console.log('Outputs.len()')
    console.log(Outputs.len())
    for (let i = 0; i < Outputs.len(); i++) {
        console.log('_txBuilderMinting Outputs.get(' + i + ')')
        console.log(Outputs.get(i))
        txbuilder.add_output(Outputs.get(i));
    }
    console.log('_txBuilderMinting added outputs')

    const utxos = TransactionUnspentOutputs.new()
    for (let i = 0; i < Utxos.length; i++) {
        if (typeof Utxos[i] === 'string' || Utxos[i] instanceof String) {
            utxos.add(
                TransactionUnspentOutput.from_bytes(
                    Buffer.from(Utxos[i].toString(), 'hex')
                )
            )
        }
        else if (typeof Utxos[i] === 'object') {
            utxos.add(Utxos[i] as TransactionUnspentOutput)
        }
    }
    console.log('_txBuilderMinting before adding inputs')
    txbuilder.add_inputs_from(utxos, CoinSelectionStrategyCIP2.LargestFirstMultiAsset)
    let addr
    try {
        addr = Address.from_bytes(Buffer.from(PaymentAddress, "hex"))
    }
    catch {
        addr = Address.from_bech32(PaymentAddress)

    }
    if (metadata) {
        const generalMetadata = GeneralTransactionMetadata.new();
        Object.entries(metadata).map(([MetadataLabel, Metadata]) => {
            generalMetadata.insert(
                BigNum.from_str(MetadataLabel),
                encode_json_str_to_metadatum(JSON.stringify(Metadata), 0),
            );
        });
        aux.set_metadata(generalMetadata);
    }
    txbuilder.set_auxiliary_data(aux);

    txbuilder.add_change_if_needed(addr);
    console.log('_txBuilderMinting before after add change')

    const transaction = txbuilder.build_tx()

    const size = transaction.to_bytes().length * 2;
    if (size > ProtocolParameter.maxTxSize) throw 'ERROR.TX_TOO_BIG';

    return transaction;
}


export async function _txBuilder({
    PaymentAddress,
    Utxos,
    Outputs,
    ProtocolParameter,
    multiSig = false,
    metadata = null,
    nativescript = null,
}: {
    PaymentAddress: string,
    Utxos: TransactionUnspentOutput[] | string[],
    Outputs: TransactionOutputs,
    ProtocolParameter: ProtocolParameters,
    multiSig: boolean,
    metadata: object | null,
    nativescript: NativeScript | null,
}): Promise<Transaction | null> {
    const txBuilder = createTxBuilder(ProtocolParameter)

    let AUXILIARY_DATA = AuxiliaryData.new()
    if (metadata) {
        const generalMetadata = GeneralTransactionMetadata.new()
        Object.entries(metadata).map(([MetadataLabel, Metadata]) => {
            generalMetadata.insert(
                BigNum.from_str(MetadataLabel),
                encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
            )
        })

        AUXILIARY_DATA.set_metadata(generalMetadata)
    }
    txBuilder.set_auxiliary_data(AUXILIARY_DATA)

    console.log('Outputs')
    console.log(Outputs.len())
    for (let i = 0; i < Outputs.len(); i++) {
        console.log('Output')
        console.log(Outputs.get(i))
        txBuilder.add_output(Outputs.get(i))
    }
    const utxos = TransactionUnspentOutputs.new()
    for (let i = 0; i < Utxos.length; i++) {
        if (typeof Utxos[i] === 'string' || Utxos[i] instanceof String) {
            utxos.add(
                TransactionUnspentOutput.from_bytes(
                    Buffer.from(Utxos[i].toString(), 'hex')
                )
            )
        }
        else if (typeof Utxos[i] === 'object') {
            utxos.add(Utxos[i] as TransactionUnspentOutput)
        }
    }
    console.log(utxos.len())
    console.log('CoinSelectionStrategyCIP2.LargestFirstMultiAsset')
    txBuilder.add_inputs_from(utxos, CoinSelectionStrategyCIP2.LargestFirstMultiAsset)
    console.log(PaymentAddress)
    txBuilder.add_change_if_needed(Address.from_bytes(Buffer.from(PaymentAddress, 'hex')))

    const transaction = Transaction.new(
        txBuilder.build(),
        TransactionWitnessSet.new(),
        AUXILIARY_DATA
    );
    console.log(
        Buffer.from(transaction.to_bytes()).toString('hex')
    )
    const size = transaction.to_bytes().length * 2;
    if (size > ProtocolParameter.maxTxSize) throw 'ERROR.TX_TOO_BIG';

    return transaction;
}

const createTxBuilder: (protocolParameters: ProtocolParameters) => TransactionBuilder = (protocolParameters: ProtocolParameters) => {
    const { minFeeA, minFeeB, poolDeposit, keyDeposit,
        coinsPerUtxoWord, maxTxSize, maxValSize } = protocolParameters
    const toBigNum = (value: number) => BigNum.from_str(value.toString())
    const config = TransactionBuilderConfigBuilder.new()
        .fee_algo(LinearFee.new(toBigNum(minFeeA), toBigNum(minFeeB)))
        .pool_deposit(toBigNum(poolDeposit))
        .key_deposit(toBigNum(keyDeposit))
        .coins_per_utxo_word(toBigNum(coinsPerUtxoWord))
        .max_tx_size(maxTxSize)
        .max_value_size(maxValSize)
        .build()
    return TransactionBuilder.new(config)
}