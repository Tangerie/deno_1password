import { createClient } from "@1password/sdk";
import type { Client } from "@1password/sdk";

let client : Client;
const SECRET_CACHE = new Map<string, string>();
const secretName = (vault : string, name : string, field : string) => `op://${vault}/${name}/${field}`


/**
 * Configures the 1Password client with the provided authentication token, account name, and integration version.
 *
 * @param token - The authentication token used to authorize the client.
 * @param accountName - The name of the 1Password account or integration.
 * @param version - The version of the integration being used.
 * @returns A promise that resolves when the client has been configured.
 */
export async function configure(token : string, accountName : string, version : string): Promise<void> {
    client = await createClient({
        auth: token,
        integrationName: accountName,
        integrationVersion: version
    });
}

async function getSecret(vault: string, name: string, field: string): Promise<string> {
    const url = secretName(vault, name, field);
    if (SECRET_CACHE.has(url)) {
        return SECRET_CACHE.get(url)!;
    }

    const result = await client.secrets.resolve(url);
    SECRET_CACHE.set(url, result);
    return result;
}

/**
 * Retrieves multiple secret fields from a specified vault and item name.
 *
 * @param vault - The name or identifier of the vault to retrieve secrets from.
 * @param name - The name or identifier of the item within the vault.
 * @param fields - The names of the fields to retrieve from the item.
 * @returns A promise that resolves to an array of secret values corresponding to the requested fields.
 */
export function getSecrets(vault: string, name: string, ...fields: string[]): Promise<string[]> {
    return Promise.all(fields.map(x => getSecret(vault, name, x)));
}