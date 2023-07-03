import dotenv from 'dotenv';
import LdapClient from 'ldapjs-client';

dotenv.config();

export default new class LdapService {
    
    constructor() {
        this.client = new LdapClient({
            url: process.env.LDAP_URL, 
            dn: process.env.LDAP_DN,
        })
    }

    async findUser(cardId, password) {
        await this.client.bind(`ad\\${cardId}`, password);
    }

}