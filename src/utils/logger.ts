import { createLogger, format, transports } from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, label, printf } = format;

//custom format

const myFormat = printf(({ level, message, label, timestamp }: any) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `[${date.toDateString()} => ${hours}:${minutes}:${seconds}] [${label}] ${level}: ${message}`;
});

const successPath = path.join(
  process.cwd(),
  "logs",
  "winston",
  "successes",
  "phu-%DATE%-success.log"
);
const errorPath = path.join(
  process.cwd(),
  "logs",
  "winston",
  "errors",
  "phu-%DATE%-error.log"
);

const logger = createLogger({
  level: "info",
  format: combine(label({ label: "PH" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: successPath,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "PH" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: errorPath,
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { logger, errorLogger };
