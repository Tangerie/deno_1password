# [Deno 1Password](https://jsr.io/@tangerie/1password)

`deno add jsr:@tangerie/1password`

```ts
import { configure, getSecrets } from "@tangerie/1password";

await configure("<TOKEN>", "<ACCOUNT_NAME>", "<VERSION>");

const [ username, password ] = await getSecrets("<VAULT>", "<ITEM>", "username", "password");
```