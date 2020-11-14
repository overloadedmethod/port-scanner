import { ResultRecord } from "../types";
import { textFormatter } from "../utils";

export async function* readFile(path: string) {
  const lines = [
    "localhost 8080",
    "duckduckgo.com 80",
    "duckduckgo.com 443",
    "localhost 22",
    "duckduckgo.com 9999",
  ];
  for (const line of lines) yield line;
}

export async function serializeScanProb(
  path: string,
  records: AsyncGenerator<ResultRecord>,
  isJson = true,
  formatter = textFormatter
) {
  if (isJson) {
    const result: Record<string, ResultRecord> = {};
    for await (const line of records) result[line.host] = line;
    console.log(result);
    return;
  }

  for await (const line of records) console.log(formatter(line));
}
