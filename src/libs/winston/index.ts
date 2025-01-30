import { createLogger, format, Logger, transports } from 'winston';
import config from 'src/config';
import { Environment } from 'src/common/constants';
import { container } from 'tsyringe';
import MongoTransport from 'src/libs/transports/mongo.transport';

const { NODE_ENV } = config

const printFormat = format.printf(({ timestamp, level, message, module , ...meta }) => {
    // TODO: Module is empty for some reason
    const prefix = `${timestamp} ${level}${module ? ` ${module}` : ''}`;
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2): ''

    return `${prefix} ${message} ${metaString}`
});

export const consoleTransport = new transports.Console({
    format: format.combine(format.colorize(), format.timestamp(), format.json(), printFormat)
})

const logger = createLogger({
    transports: [new MongoTransport()]
});

if (NODE_ENV !== Environment.Production) {
    logger.add(consoleTransport)
}

container.registerInstance(Logger, logger);

export default logger;