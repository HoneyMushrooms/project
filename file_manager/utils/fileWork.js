import { writeFile, rename, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { OPERATION_FAILED } from '../errConstatns.js';
import commonHelpers from './commonHelpers.js';
import { pipeline } from 'node:stream/promises';
import { createHash } from 'node:crypto';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';


export default new class FileWork {
    async createFile([fileName, ...args]) {
        const payload = [
            {path: fileName, flag: 'unD'}
        ];
        await commonHelpers.checkPath(args, payload); 
        await writeFile(fileName, '', { flag: 'w' });
    }

    async readFile([pathToFile, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
        ];
        await commonHelpers.checkPath(args, payload);
        return new Promise((resolve, reject) => {
            const stream = createReadStream(pathToFile);
        
            stream.on('data', (chunk) => {
                process.stdout.write(chunk);
            })
            stream.on('error', () => {
                reject(OPERATION_FAILED);
            })
            stream.on('end', () => {
                resolve();
            })
        })
    }

    async copyFile([pathToFile, pathToNewDirectory, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
            {path: pathToNewDirectory, flag: 'D'}
        ];
        await commonHelpers.checkPath(args, payload);
        await pipeline(createReadStream(pathToFile), createWriteStream(join(pathToNewDirectory, basename(pathToFile))));
    }

    async renameFile([pathToFile, newFileName, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
            {path: newFileName, flag: 'unD'},
        ];
        await commonHelpers.checkPath(args, payload);    
        await rename(pathToFile, join(dirname(pathToFile), newFileName));
    }

    async moveFile(args) {
        await this.copyFile(args);
        await rm(args[0]);
    }

    async deleteFile([pathToFile, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
        ]; 
        await commonHelpers.checkPath(args, payload);
        await rm(pathToFile);
    }

    async hashFile([pathToFile, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
        ];
        await commonHelpers.checkPath(args, payload);
        const hash = createHash('sha256');
        return new Promise((resolve, reject) => {
            const stream = createReadStream(pathToFile);
        
            stream.on('data', (chunck) => {
                hash.update(chunck);
            })
            stream.on('error', () => {
                reject(OPERATION_FAILED);
            })
            stream.on('end', () => {
                resolve(console.log(hash.digest('hex')));
            })
        })
    }

    async compressFile([pathToFile, pathToDestination, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
            {path: pathToDestination, flag: 'D'},
        ];
        await commonHelpers.checkPath(args, payload);        
        await pipeline(createReadStream(pathToFile), createBrotliCompress(), createWriteStream(join(pathToDestination, basename(pathToFile) + '.br')))
    }

    async decompressFile([pathToFile, pathToDestination, ...args]) {
        const payload = [
            {path: pathToFile, flag: 'F'},
            {path: pathToDestination, flag: 'D'},
        ];
        await commonHelpers.checkPath(args, payload);        
        await pipeline(createReadStream(pathToFile), createBrotliDecompress(), createWriteStream(join(pathToDestination, basename(pathToFile).split('.').slice(0, -1).join('.'))))
    }
}