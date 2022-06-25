import {prisma} from "../db.server"
import EndpointRepository from "./endpoint.server";


export const endpointRepository = new EndpointRepository(prisma)