import fastify, {FastifyReply} from 'fastify';
import {Endpoint, PrismaClient} from '@prisma/client';

const server = fastify({logger: true});
const prisma = new PrismaClient();

function getBody(endpoint: Endpoint) : object | string | undefined {
	const {body_json: bodyJson, body_plain: bodyPlain} = endpoint;
	if (bodyJson) {
		return bodyJson.valueOf;
	}

	if (bodyPlain) {
		return bodyPlain;
	}
}

interface Headers {
  [key: string]: string
}

function setHeaders(reply : FastifyReply, headersJSON: string) {
	try {
		const headers : Headers = JSON.parse(headersJSON);
		if (!Object.keys(headers).length) {
			return;
		}

		reply.headers(headers);
	} catch (error) {
		server.log.error('Error while parsing headers:', error);
	}
}

server.all('/:hash', async (request, reply) => {
	const {hash} = request.params as { hash?: string };
	if (!hash) {
		return reply.status(404).send();
	}

	const endpoint = await prisma.endpoint.findUnique({
		where: {
			slug: hash,
		},
	});
	if (!endpoint) {
		return reply.send(404).send();
	}

	if (request.method.toLowerCase() !== endpoint.method.toLowerCase()) {
		return reply.status(405).send();
	}

	const body = getBody(endpoint);
	setHeaders(reply, endpoint.headers?.toString() ?? '{}');
	reply.header('Content-Type', endpoint.content_type);
	return reply.status(endpoint.status).send(body);
});

const start = async () => {
	try {
		server.listen({port: 5000});
	} catch (error) {
		server.log.error(error);
		process.exit(0);
	}
};

start();
