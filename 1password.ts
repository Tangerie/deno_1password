import { createClient } from "@1password/sdk";
import type { Client } from "@1password/sdk";

let client : Client;
const SECRET_CACHE = new Map<string, string>();
const secretName = (vault : string, name : string, field : string) => `op://${vault}/${name}/${field}`


export async function configure(token : string, accountName : string, version : string): Promise<void> {
    client = await createClient({
        auth: token,
        integrationName: accountName,
        integrationVersion: version
    });
}

const getSecret = async (vault : string, name : string, field : string): Promise<string> => {
    const url = secretName(vault, name, field);
    if(SECRET_CACHE.has(url)) {
        return SECRET_CACHE.get(url)!;
    }

    const result = await client.secrets.resolve(url);
    SECRET_CACHE.set(url, result);
    return result;
}

export const getSecrets = (vault : string, name : string, ...fields : string[]): Promise<string[]> => {
    return Promise.all(fields.map(x => getSecret(vault, name, x)));
}