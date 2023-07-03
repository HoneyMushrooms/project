import navigationWork from "./utils/navigationWork.js";
import systemWork from "./utils/systemWork.js";
import fileWork from "./utils/fileWork.js";
import { INVALID_INPUT } from "./errConstatns.js";

export default async (cmd, args) => {

    switch(cmd) {
        case 'ls':
            await navigationWork.ls(args);
        break;
        case 'up':
            navigationWork.up(args);
        break;
        case 'cd':
            navigationWork.cd(args);
        break;
        case 'os':
            systemWork.getOsInfo(args);
        break;
        case 'cls':
            console.clear();
        break;
        case 'cat':
            await fileWork.readFile(args);
        break;
        case 'add':
            await fileWork.createFile(args);
        break;
        case 'rn':
            await fileWork.renameFile(args);
        break;
        case 'cp':
            await fileWork.copyFile(args);
        break;
        case 'mv':
            await fileWork.moveFile(args);
        break;
        case 'rm':
            await fileWork.deleteFile(args);
        break;
        case 'hash':
            await fileWork.hashFile(args);
        break;
        case 'compress':
            await fileWork.compressFile(args);
        break;
        case 'decompress':
            await fileWork.decompressFile(args);
        break;
        default: 
            throw new Error(INVALID_INPUT);
    }
}