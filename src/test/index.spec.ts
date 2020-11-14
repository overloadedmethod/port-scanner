// import * as faker from "faker";

import utility from "../scanner";
import { resolveIp, testPort } from "../scanner/network";
import { readFile } from "../scanner/files";

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

describe("file utilities", () => {
  it("should parse provided file of test.txt", async () => {
    const lines = [];
    const expected = [
      "localhost 8080",
      "duckduckgo.com 80",
      "duckduckgo.com 443",
      "localhost 22",
      "duckduckgo.com 9999",
    ];
    for await (const line of readFile("./src/test/test.txt")) lines.push(line);
    expect(lines).toEqual(expected);
  });

  it("should serialize provided data as json", async () => {
    throw new Error("not implemented");
  });

  it("should serialize provided data as text", async () => {
    throw new Error("not implemented");
  });
});
