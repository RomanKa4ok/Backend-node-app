import { createLogger, Logger, transports } from 'winston';
import config from 'src/config';
import { Environment } from 'src/common/constants';
import { container } from 'tsyringe';

const { NODE_ENV } = config

const logger = createLogger({});

if (NODE_ENV !== Environment.Production) {
    logger.add(new transports.Console())
}

container.registerInstance(Logger, logger);

export default logger;