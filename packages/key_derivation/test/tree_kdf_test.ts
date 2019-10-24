import fs from "fs";
import { derive_master_SK, derive_child_SK } from "../src/tree_kdf";
import sjcl from "sjcl";


test('derive_master_SK()', done => {
    fs.readFile('packages/key_derivation/test/test_vectors.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        };
        const test_vectors: Array<{[key: string]: string}> = JSON.parse(data).kdf_tests;
        test_vectors.forEach((test) => {
            const test_seed = sjcl.codec.hex.toBits(test['seed']);
            const test_SK = new sjcl.bn(test['master_SK']);
            const derived_SK = derive_master_SK(test_seed)
            expect(derived_SK.equals(test_SK)).toBe(true);
        });
    });
    done();
})


test('derive_child_SK()', done => {
    fs.readFile('packages/key_derivation/test/test_vectors.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        };
        const test_vectors: Array<{[key: string]: string}> = JSON.parse(data).kdf_tests;
        test_vectors.forEach((test) => {
            const test_parent_SK = new sjcl.bn(test['master_SK']);
            const test_index = new sjcl.bn(test['child_index']);
            const test_child_SK = new sjcl.bn(test['child_SK']);
            const derived_child_SK = derive_child_SK(test_parent_SK, test_index)
            expect(derived_child_SK.equals(test_child_SK)).toBe(true);
        });
    });
    done();
})
