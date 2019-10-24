import * as _hkdf from "futoin-hkdf";
import { BitArray, codec } from "sjcl";

export function hkdf(IKM: BitArray, L: number, salt: BitArray|string): BitArray {
    const bIKM = Buffer.from(codec.hex.fromBits(IKM), 'hex')
    var bSalt: BitArray|string|Buffer = salt
    if (typeof salt === 'string') {
        const bOKM = _hkdf.default(bIKM, L, {salt: salt})
        return codec.hex.toBits(bOKM.toString('hex'))
    } else {
        bSalt = Buffer.from(codec.hex.fromBits(salt), 'hex')
        const bOKM = _hkdf.default(bIKM, L, {salt: bSalt})
        return codec.hex.toBits(bOKM.toString('hex'))
    }
}