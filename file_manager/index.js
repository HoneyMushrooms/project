import * as readline from 'node:readline';
import { homedir } from 'node:os';
import router from './router.js';
import commandParse from './commandParse.js';
import { INVALID_INPUT, OPERATION_FAILED } from './errConstatns.js';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const userName = process.argv.find( e => e.startsWith('--username'))?.split('=')[1] || 'Anonymous';
process.chdir(homedir())

console.log(`Welcome to the File Manager, ${userName}!`);
console.log(`You are currently in ${process.cwd()}`);

rl.on('line', async (line) => {

    const [cmd, ...args] = commandParse(line);

    if(cmd === '.exit') {
        rl.write(`Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit();
    }

    try {
        await router(cmd, args);
    } catch (err){
        if(err.code === 'ENOENT') console.error('\x1b[31m%s\x1b[0m', INVALID_INPUT);
        else if(err.code === 'EPERM') console.error('\x1b[31m%s\x1b[0m', OPERATION_FAILED);
        else console.error('\x1b[31m%s\x1b[0m', err.message);
    } finally {
        console.log(`\n\nYou are currently in ${process.cwd()}`);
    }
})

rl.on('SIGINT', () => {
    rl.write(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit();
})