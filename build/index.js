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
function jd(...paths) {
    return path_1.join(__dirname, ...paths);
}
exports.jd = jd;
function writeDirTree(path, output) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirTree = yield createDirTree(path);
        let data = JSON.stringify(dirTree);
        if (path[0] === '/') {
            const pathRemove = path.replace(path_1.basename(path), '');
            const normalizedDirTree = normalizeDirTree(dirTree, pathRemove);
            data = JSON.stringify(normalizedDirTree);
        }
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
function normalizeDirTree(dirTree, path) {
    dirTree.name = dirTree.name.replace(path, '');
    if (dirTree.kind === 'file') {
        return dirTree;
    }
    else if (Array.isArray(dirTree.content)) {
        const content = dirTree.content;
        dirTree.content = content.map(subTree => normalizeDirTree(subTree, path));
        return dirTree;
    }
}
exports.normalizeDirTree = normalizeDirTree;
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
