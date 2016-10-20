'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Ajv = require("ajv");
const fs = require("fs");
const path_1 = require("path");
const assert = require("assert");
// Local imports
const tapeit = require("./index");
describe('tapeit', () => {
    it('should have a test', () => {
        assert(true, 'It does have a test!');
    });
    it('should have a createDirTree function', () => {
        assert(typeof tapeit.createDirTree === 'function');
    });
    it('should have a writeDirTree function', () => {
        assert(typeof tapeit.writeDirTree === 'function');
    });
});
function test_() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFolder = path_1.join(__dirname, '../resources/test-folder');
        const outputFile = path_1.join(__dirname, '../resources/test-folder.dir.json');
        tapeit.writeDirTree(inputFolder, outputFile)
            .then(() => {
            console.log('success');
        })
            .catch(error => {
            console.log(error);
        });
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFolder = path_1.join(__dirname, '../resources/test-folder');
        const outputFile = path_1.join(__dirname, '../resources/test-folder.dir.json');
        const dirTree = yield tapeit.createDirTree(inputFolder);
        const schema = JSON.parse(fs.readFileSync(path_1.join(__dirname, '../json-tape.schema.json')).toString());
        const ajv = new Ajv();
        fs.writeFileSync('../resources/test-folder.dir.json', JSON.stringify(dirTree, null, '  '));
        const valid = ajv.validate(schema, dirTree);
        if (!valid) {
            console.log(ajv.errors);
        }
        else {
            console.log('Valid');
        }
    });
}
