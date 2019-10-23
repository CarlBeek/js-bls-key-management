import fs from "fs";
import { derive_master_SK } from "../src/tree_kdf";
import sjcl from "sjcl";
import { doesNotReject } from "assert";


describe('Derive Master SK', () => {
    let test_vectors: Array<{[key: string]: string}> = []
    beforeAll(function(){
        fs.readFile('packages/key_derivation/test/test_vectors.json', 'utf-8', (err, data) => {
            if (err) {
                throw err
            };
            test_vectors = JSON.parse(data).kdf_tests;
        });
    });
    describe('derive_master_SK()', () => {
        it('should derive the correct master SK', () => {
            test_vectors.forEach((test) => {
                const test_seed = sjcl.codec.hex.toBits(test['seed']);
                const test_SK = new sjcl.bn(test['master_SK']);
                console.log(derive_master_SK(test_seed))
                expect(derive_master_SK(test_seed)).toBe(test_SK)
            })
        })
    })
})