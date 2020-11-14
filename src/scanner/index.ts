import { readFile, serializeScanProb } from "./files";
import { resolveIp, testPort } from "./network";
import { ResultRecord } from "./types";

const line2UrlPortTpl = (hostPort: string): [string, number] => {
  const [host, port] = hostPort.split(" ");
  return [host, Number.parseInt(port)];
};

async function* parseLines(
  lines: ReturnType<typeof readFile>,
  parse = line2UrlPortTpl
) {
  for await (const line of lines) yield parse(line);
}

async function* groupPortsByHost(hostPorts: ReturnType<typeof parseLines>) {
  const grouping: Record<string, number[]> = {};
  for await (const [host, port] of hostPorts)
    if (grouping[host]) grouping[host].push(port);
    else grouping[host] = [port];
  for await (const entry of Object.entries(grouping)) yield entry;
}

async function* scanPorts(
  hosts: ReturnType<typeof groupPortsByHost>,
  ipResolver = resolveIp,
  portTester = testPort
): AsyncGenerator<ResultRecord> {
  for await (const [host, ports] of hosts) {
    const ip: string = await ipResolver(host);
    if (!ip) {
      yield { ip, ports, host, pinged: [] };
      continue;
    }

    const pings = await Promise.all(
      ports.map((port) => portTester(`${ip}:${port}`))
    );

    const pinged: Record<number, number> = {};
    ports.forEach((port, index) => {
      if (pings[index] != -1) pinged[port] = pings[index];
    });

    yield { ip, ports, host, pinged };
  }
}

export default async function utility(
  input: string,
  output: string,
  isJSON: boolean
) {
  const lines = parseLines(readFile(input));
  const results = scanPorts(groupPortsByHost(lines));
  await serializeScanProb(output, results, isJSON);
}
