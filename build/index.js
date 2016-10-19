'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require("path");
const fs = require("fs");
cmd();
function cmd() {
    const [, , inputFile = null, outputFile = null] = process.argv;
    const t = s => typeof s === 'string';
    const l = (i, o) => console.log(`Writing ${i} to ${o}`);
    if (t(inputFile) && t(outputFile)) {
        l(inputFile, outputFile);
        writeDirTree(inputFile, outputFile);
    }
    else if (t(inputFile)) {
        const autoOutput = `${inputFile}.dir.json`;
        l(inputFile, autoOutput);
        writeDirTree(inputFile, autoOutput);
    }
}
function writeDirTree(path, output) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirTree = yield createDirTree(path);
        const data = JSON.stringify(dirTree);
        return new Promise((resolve, reject) => {
            fs.writeFile(output, data, error => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    });
}
exports.writeDirTree = writeDirTree;
function createDirTree(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const doesExist = yield exists(path);
        if (!doesExist) {
            throw new Error(`${path} does not exist`);
        }
        const [isADirectory, isAFile] = [yield isDirectory(path), yield isFile(path)];
        if (isADirectory) {
            const filenames = yield readDirectory(path);
            const content = [];
            const dirTree = { name: path, content, kind: 'directory' };
            for (const filename of filenames) {
                const file = yield createDirTree(filename);
                content.push(file);
            }
            return dirTree;
        }
        else if (isAFile) {
            const content = yield readFile(path);
            return { name: path, content, kind: 'file' };
        }
    });
}
exports.createDirTree = createDirTree;
function readFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (error, data) => {
                if (error) {
                    reject(error);
                }
                resolve(data.toString('base64'));
            });
        });
    });
}
function readDirectory(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, (error, files) => {
                if (error) {
                    reject(error);
                }
                resolve(files.map(file => path_1.join(directory, file)));
            });
        });
    });
}
function isDirectory(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error) {
                    reject(error);
                }
                resolve(stats.isDirectory());
            });
        });
    });
}
function isFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error) {
                    reject(error);
                }
                resolve(stats.isFile());
            });
        });
    });
}
function exists(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.stat(path, (error, stats) => {
                if (error === null) {
                    resolve(true);
                }
                else if (error.code === 'ENOENT') {
                    resolve(false);
                }
                else {
                    reject(error);
                }
            });
        });
    });
}
