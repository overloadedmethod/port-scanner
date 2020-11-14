import { addressErrorLogger, promiseWithTimeout } from "../utils";

export async function ipResolveCall(host: string) {
  await new Promise((r) => setTimeout(r, Math.random() * 6000));
  return Promise.resolve("");
}

export async function portScanCall(address: string) {
  const start = Date.now();
  await new Promise((r) => setTimeout(r, Math.random() * 6000));
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
  timeout = 2000,
  scanPort = portScanCall,
  handleError = addressErrorLogger
): ReturnType<typeof scanPort> {
  try {
    return await promiseWithTimeout(() => scanPort(address), timeout);
  } catch (e) {
    return handleError(address, "testing port", e, () => -1);
  }
}
