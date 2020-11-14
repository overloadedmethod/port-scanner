import fs from "fs";
import readline from "readline";
import path from "path";

import { ResultRecord } from "../types";
import { textFormatter } from "../utils";

export async function* readFile(relPath: string) {
  const filePath = path.join(relPath);
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) yield line;
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
