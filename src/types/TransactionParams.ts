import {
  PlutusData,
  PlutusScript,
  Redeemer,
  TransactionUnspentOutput,
} from '@emurgo/cardano-serialization-lib-browser'
import { ProtocolParameters } from '../queryApi'
import Delegation from './Delegation'
import Recipient from './Recipient'

export default interface TransactionParams {
  ProtocolParameters: ProtocolParameters
  PaymentAddress: string
  recipients: Recipient[]
  // eslint-disable-next-line @typescript-eslint/ban-types
  metadata: object | null
  metadataHash: string | null
  addMetadata: boolean
  utxosRaw: TransactionUnspentOutput[] | undefined
  ttl: number | null
  multiSig: boolean
  delegation: Delegation | null
  datums?: PlutusData[]
  redeemers: Redeemer[]
  plutusValidators: PlutusScript[]
  plutusPolicies: PlutusScript[]
  burn: boolean
}
