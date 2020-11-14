import { ResultRecord } from "./types";

export const textFormatter = ({ ip, host, ports, pinged }: ResultRecord) => {
  return `host:${host}\tip:${ip}\nscanned:${ports.join(
    ",\t"
  )}\npinged:\n\t${Object.entries(pinged)
    .map(([port, ping]) => `${port}:${ping}`)
    .join("\n\t")}`;
};

export const promiseWithTimeout = <T>(
  promise: () => Promise<T>,
  timeout = 20000,
  failureMessage = "timeout"
) => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, rej) => {
    timeoutHandle = setTimeout(() => rej(new Error(failureMessage)), timeout);
  });

  return Promise.race([promise(), timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

export const addressErrorLogger = (
  address: string,
  stage: string,
  error: Error,
  emptyResult: () => any = () => null
) => {
  console.log(
    `unexpected happened with ${address} on ${stage} reason is ${error}`
  );
  return emptyResult();
};
