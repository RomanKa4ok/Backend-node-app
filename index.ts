import 'reflect-metadata';

import Server from './src/server'
import {container} from "tsyringe";

const server = container.resolve(Server);
server.register();