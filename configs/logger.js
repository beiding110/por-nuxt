import path from "path";
import { format, transports } from "winston";
const { combine, timestamp } = format;

// 日志存放路径
const infoLogPath = path.resolve(__dirname, "../logs", `info.log`);
const errorLogPath = path.resolve(__dirname, "../logs", `error.log`);

export default {
    loggerOptions: {
        transports: [
            new transports.File({
                format: combine(timestamp()),
                level: "info",
                filename: infoLogPath,
                maxsize: 5 * 1024 * 1024, // 单个日志文件大小
                maxFiles: 3, // 最大文件数
            }),
            new transports.File({
                format: combine(timestamp()),
                level: "error",
                filename: errorLogPath,
                maxsize: 5 * 1024 * 1024,
                maxFiles: 3,
            }),
        ],
    },
};
