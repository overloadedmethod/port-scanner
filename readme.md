# Port scanner

## Description

Simple port scanner that will read text file in format:

```
host port
host port
host port
...
```

for example:

```
localhost 8080
duckduckgo.com 80
duckduckgo.com 443
localhost 22
duckduckgo.com 9999
```

Then will group ports by host and will check if those ports are open in parallel.

## Deployment and usage

1. Use command `yarn install` or `npm install` to set all required packages.
2. call `npm run build` - to build the js from typescript
3. call `node dist/index.js $$PATH_TO_YOUR_TXT_FILE$$ $$PATH_TO_EXPECTED_RESULT_FILE$$ --json` - you may omit `--json` if you want to save it as text.

## Examples

You may see example after running the commands

1. `yarn start ./examples/scan.txt ./examples/scan-result.txt`
2. `yarn start ./scan.txt ./my-scan-result.json --json`

In examples folder
