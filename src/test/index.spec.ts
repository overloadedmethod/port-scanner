// import * as faker from "faker";

import utility from "../scanner";
import { resolveIp, testPort } from "../scanner/network";

// type ResultRecord = {
//   ip: string;
//   ports: number[];
//   host: string;
//   pinged: Record<number, number>;
// };

// const addressErrorLogger = (
//   address: string,
//   stage: string,
//   error: Error,
//   emptyResult: () => any = () => null
// ) => {
//   console.log(
//     `unexpected happened with ${address} on ${stage} reason is ${error}`
//   );
//   return emptyResult();
// };

// async function ipResolveCall(host: string) {
//   await new Promise((r) => setTimeout(r, faker.random.number(10000)));
//   return Promise.resolve(faker.internet.ip());
// }

// async function portScanCall(address: string) {
//   const start = Date.now();
//   await new Promise((r) => setTimeout(r, faker.random.number(6000)));
//   return Date.now() - start;
// }

// async function* readFile(path: string) {
//   const lines = [
//     "localhost 8080",
//     "duckduckgo.com 80",
//     "duckduckgo.com 443",
//     "localhost 22",
//     "duckduckgo.com 9999",
//   ];
//   for (const line of lines) yield line;
// }

// const line2UrlPortTpl = (hostPort: string): [string, number] => {
//   const [host, port] = hostPort.split(" ");
//   return [host, Number.parseInt(port)];
// };

// async function* parseLines(
//   lines: ReturnType<typeof readFile>,
//   parse = line2UrlPortTpl
// ) {
//   for await (const line of lines) yield parse(line);
// }

// async function* groupPortsByHost(hostPorts: ReturnType<typeof parseLines>) {
//   const grouping: Record<string, number[]> = {};
//   for await (const [host, port] of hostPorts)
//     if (grouping[host]) grouping[host].push(port);
//     else grouping[host] = [port];
//   for await (const entry of Object.entries(grouping)) yield entry;
// }

// function promiseWithTimeout<T>(
//   promise: () => Promise<T>,
//   timeout = 20000,
//   failureMessage = "timeout"
// ) {
//   let timeoutHandle: NodeJS.Timeout;
//   const timeoutPromise = new Promise<never>((_, rej) => {
//     timeoutHandle = setTimeout(() => rej(new Error(failureMessage)), timeout);
//   });

//   return Promise.race([promise(), timeoutPromise]).then((result) => {
//     clearTimeout(timeoutHandle);
//     return result;
//   });
// }

// async function resolveIp(
//   host: string,
//   timeout = 4000,
//   resolve = ipResolveCall,
//   handleError = addressErrorLogger
// ): Promise<string> {
//   try {
//     return await promiseWithTimeout(() => resolve(host), timeout);
//   } catch (e) {
//     return handleError(host, "resolving ip", e, () => null);
//   }
// }

// async function testPort(
//   address: string,
//   timeout = 2000,
//   scanPort = portScanCall,
//   handleError = addressErrorLogger
// ): ReturnType<typeof scanPort> {
//   try {
//     return await promiseWithTimeout(() => scanPort(address), timeout);
//   } catch (e) {
//     return handleError(address, "testing port", e, () => -1);
//   }
// }

// async function* scanPorts(
//   hosts: ReturnType<typeof groupPortsByHost>,
//   ipResolver = resolveIp,
//   portTester = testPort
// ): AsyncGenerator<ResultRecord> {
//   for await (const [host, ports] of hosts) {
//     const ip: string = await ipResolver(host);
//     if (!ip) {
//       yield { ip, ports, host, pinged: [] };
//       continue;
//     }

//     const pings = await Promise.all(
//       ports.map((port) => portTester(`${ip}:${port}`))
//     );

//     const pinged: Record<number, number> = {};
//     ports.forEach((port, index) => {
//       if (pings[index] != -1) pinged[port] = pings[index];
//     });

//     yield { ip, ports, host, pinged };
//   }
// }

// const textFormatter = ({ ip, host, ports, pinged }: ResultRecord) => {
//   return `host:${host}\tip:${ip}\nscanned:${ports.join(
//     ",\t"
//   )}\npinged:\n\t${Object.entries(pinged)
//     .map(([port, ping]) => `${port}:${ping}`)
//     .join("\n\t")}`;
// };

// async function serializeScanProb(
//   path: string,
//   records: ReturnType<typeof scanPorts>,
//   isJson = true,
//   formatter = textFormatter
// ) {
//   if (isJson) {
//     const result: Record<string, ResultRecord> = {};
//     for await (const line of records) result[line.host] = line;
//     console.log(result);
//     return;
//   }

//   for await (const line of records) console.log(formatter(line));
// }

// async function utility(input: string, output: string, isJSON: boolean) {
//   const lines = parseLines(readFile(input));
//   const results = scanPorts(groupPortsByHost(lines));
//   await serializeScanProb(output, results, isJSON);
// }

jest.setTimeout(30000);

describe("IP resolving", () => {
  it("should resolve existing host to ip", async () => {
    const host = "test.com";
    const ip = "127.0.0.1";
    const result = await resolveIp(host, 4000, (_) => Promise.resolve(ip));
    expect(result).toBe(ip);
  });

  it("should return null on timeout on", async () => {
    const host = "test.com";
    //@ts-ignore
    const result = await resolveIp(
      host,
      4000,
      async (_) => new Promise((r) => setTimeout(r, 4000))
    );
    expect(result).toBeNull();
  });

  it("should return null on error ", async () => {
    const host = "test.com";
    //@ts-ignore
    const result = await resolveIp(host, 4000, (_) =>
      Promise.reject(new Error("wrong something"))
    );
    expect(result).toBeNull();
  });
});

describe("Port scanning", () => {
  it("should return milliseconds number if port is open", async () => {
    const result = await testPort("127.0.0.1", 1337, 2000, (_) =>
      Promise.resolve(1440)
    );
    expect(result).toBe(1440);
  });

  it("should return -1 on timeout", async () => {
    const result = await testPort(
      "127.0.0.1",
      1337,
      2000,
      async (_) => new Promise((r) => setTimeout(r, 4000))
    );
    expect(result).toBe(-1);
  });

  it("should return -1 on error", async () => {
    const result = await testPort("127.0.0.1", 1337, 2000, async (_) =>
      Promise.reject(new Error("wrong something"))
    );
    expect(result).toBe(-1);
  });
});
