import { EOL, cpus, userInfo, arch } from 'node:os';
import { INVALID_INPUT } from '../errConstatns.js'

export default new class SystemWork {

    constructor () {
        this.EOL = JSON.stringify(EOL);
        this.homedir = userInfo().homedir;
        this.username = userInfo().username;
        this.arch = arch();
        this.cpus = `Overall amount of CPUS ${cpus().length} ${(cpus().map( e => (`\n\nmodel: ${e.model}\nspeed: ${e.speed / 1000}GHz`)))}`;
    }

    getOsInfo([flag, ...args]) {
        if(args.length !== 0) throw new Error(INVALID_INPUT);
        else if (flag === '--EOL') console.log(this.EOL);
        else if (flag === '--username') console.log(this.username);
        else if (flag === '--homedir') console.log(this.homedir);
        else if (flag === '--architecture') console.log(this.arch);
        else if (flag === '--cpus') console.log(this.cpus);
        else throw new Error(INVALID_INPUT);
    }
}