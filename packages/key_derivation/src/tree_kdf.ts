import {BigNumber, BitArray} from "sjcl";
import sjcl from "sjcl";


function IKM_to_lamport_SK(IKM: BitArray, salt: BitArray): Array<BitArray> {
    const OKM: BitArray = sjcl.misc.hkdf(IKM, 8160*8, salt);
    const bytes_split = (arr: BitArray) => Array.from(new Array(255), (_, i) => arr.slice(i*8, (i+1)*8));
    return bytes_split(OKM);
}


function parent_SK_to_lamport_PK(parent_SK: BigNumber, index: BigNumber): BitArray {
    const salt: BitArray = index.toBits(256)
    const IKM: BitArray = parent_SK.toBits(256)
    const lamport_0 = IKM_to_lamport_SK(IKM, salt);
    const flip_bits = (bits: BitArray) => bits.map(x => ~x)
    const not_IKM: BitArray = flip_bits(IKM)
    const lamport_1 = IKM_to_lamport_SK(not_IKM, salt);
    const lamport_SK = lamport_0.concat(lamport_1)
    const lamport_PK = lamport_SK.map((x: BitArray) => sjcl.hash.sha256.hash(x))
    const combined_lamport_PK = lamport_PK.reduce((a: BitArray, b: BitArray) => a.concat(b))
    return sjcl.hash.sha256.hash(combined_lamport_PK)
}


function HKDF_mod_r(IKM: BitArray): BigNumber {
    const OKM: BitArray = sjcl.misc.hkdf(IKM, 48*8, 'BLS-SIG-KEYGEN-SALT-');
    const bn_OKM: BigNumber = sjcl.bn.fromBits(OKM);
    const r = new sjcl.bn('0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001');
    return bn_OKM.mod(r)
}


export function derive_child_SK(parent_SK: BigNumber, index: BigNumber): BigNumber {
    const compressed_lamport_PK = parent_SK_to_lamport_PK(parent_SK, index)
    return HKDF_mod_r(compressed_lamport_PK)
}


export const derive_master_SK = HKDF_mod_r
