export type ResultRecord = {
  ip: string;
  ports: number[];
  host: string;
  pinged: Record<number, number>;
};
