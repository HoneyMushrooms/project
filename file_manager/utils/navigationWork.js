import { join, isAbsolute } from 'node:path';
import { readdir } from 'node:fs/promises';
import checkWork from './commonHelpers.js';
import { INVALID_INPUT } from '../errConstatns.js';

export default new class NavigationWork {
    up(args) {
        if(args.length !== 0) throw new Error(INVALID_INPUT);
        process.chdir('..');
    }

    cd([path, ...args]) {
        if(args.length !== 0 || !path) throw new Error(INVALID_INPUT); 
        if(path.length === 2 && path[1] === ':') path = join(path, '/');
        if(isAbsolute(path)) process.chdir(path);
        else process.chdir(join(process.cwd(), path));
    }

    async ls(args) {
        if(args.length !== 0) throw new Error(INVALID_INPUT);
        const list = await readdir(process.cwd(), {withFileTypes: true});
        const pritterList = await checkWork.pritterList(list);
        console.table(pritterList, ['name', 'type']);
    }
}