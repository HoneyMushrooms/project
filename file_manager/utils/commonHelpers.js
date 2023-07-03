import { stat } from 'node:fs/promises';
import { INVALID_INPUT, OPERATION_FAILED } from '../errConstatns.js';

export default new class CommonHelpers {

    async pritterList(list) {
 
        const newList = [];
        for(let i = 0; i < list.length; i++) {
            let element = list[i];
            if(!element.isDirectory() && !element.isFile()) continue;
            element = { name: element.name, type: element.isDirectory() ? 'directory' : 'file' }
            newList.push(element);
        }
        
        newList.sort((a, b) => {
            if (a.type < b.type) return -1;
            if (a.type > b.type) return 1;
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        return newList;
    }

    async checkPath(args, payload) {
        if(args.length !== 0) throw new Error(INVALID_INPUT);
    
        for(let i = 0; i < payload.length; i++) {
            if(!payload[i].path) throw new Error(OPERATION_FAILED);
            
            let check;
            if(payload[i].flag === 'F') {
                check = await this.isFile(payload[i].path);
            } else if(payload[i].flag === 'D'){
                check = await this.isDir(payload[i].path);
            } else if (payload[i].flag === 'unD'){
                try {
                    check = await this.isDir(payload[i].path);
                    check = !check;
                } catch {
                    continue;
                }
            }   
            if(!check) throw new Error(OPERATION_FAILED);
        }
    }

    async isFile(path) {
        const statInfo = await stat(path);
        return statInfo.isFile();
    }

    async isDir(path) {
        const statInfo = await stat(path);
        return statInfo.isDirectory();
    }
}