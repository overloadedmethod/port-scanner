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

## Result interpretation:

```json
{
  "duckduckgo.com": {
    "ip": "40.114.177.156",
    "ports": [80, 443, 9999],
    "host": "duckduckgo.com",
    "pinged": { "80": 80, "443": 75 }
  }
}
```

Meaning is we checked ports: 80, 443, 9999
And from those ports only 80 and 443 were opened and had 80ms time and 75ms.
If ip is null - it means we were unable to reach the host.

```
  host:duckduckgo.com	ip:40.114.177.156
  scanned:80,	443,	9999
  pinged:
    80:83
    443:83
```

We can easily see that text result is pretty same in terms of the used model.
