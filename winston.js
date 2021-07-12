import winston from "winston";

const { transports, format, createLogger } = winston;
const { combine, printf } = format;

/*
Creating date string to be used in naming log files based on
date of occurence
*/
const date = new Date();
const dateTitle = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const logTime = new Date().toLocaleTimeString();

const customAppLog = printf(({ level, message }) => {
  return `Level:[${level}] LogTime: [${logTime}] Message:-[${message}]`;
});

const logTypes = {
  info: {
    level: "info",
    dirname: "logs/combined",
    json: true,
    handleExceptions: true,
    datePattern: "YYYY-MM-DD-HH",
    filename: `combined-${dateTitle}.log`,
  },
  error: {
    level: "error",
    dirname: "logs/error",
    json: true,
    handleExceptions: true,
    filename: `error-${dateTitle}.log`,
  },
  console: {
    level: "debug",
    json: false,
    handleExceptions: true,
    colorize: true, // In order to differentiate the different log message types
  },
};

const logger = new createLogger({
  format: combine(customAppLog),
  transports: [
    new transports.File(logTypes.info),
    new transports.File(logTypes.error),
    new transports.Console(logTypes.console),
  ],
  exitOnError: false,
});

export default logger;
