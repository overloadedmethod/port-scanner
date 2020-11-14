import { addressErrorLogger, promiseWithTimeout } from "../utils";
import { lookup } from "dns";
import { promisify } from "util";
import scanner from "portscanner";

const lookupAsync = promisify(lookup);

export async function ipResolveCall(host: string) {
  const result = await lookupAsync(host);
  return result.address;
}

export async function portScanCall(address: string, port: number) {
  const start = Date.now();
  const status: scanner.Status = await new Promise((res, rej) => {
    scanner.checkPortStatus(port, address, (err, status) => {
      if (err) rej(err);
      else res(status);
    });
  });
  if (status === "closed") return -1;
  return Date.now() - start;
}

export async function resolveIp(
  host: string,
  timeout = 4000,
  resolve = ipResolveCall,
  handleError = addressErrorLogger
): Promise<string> {
  try {
    return await promiseWithTimeout(() => resolve(host), timeout);
  } catch (e) {
    return handleError(host, "resolving ip", e, () => null);
  }
}

export async function testPort(
  address: string,
  port: number,
  timeout = 2000,
  scanPort = portScanCall,
  handleError = addressErrorLogger
): ReturnType<typeof scanPort> {
  try {
    return await promiseWithTimeout(() => scanPort(address, port), timeout);
  } catch (e) {
    return handleError(address, "testing port", e, () => -1);
  }
}
