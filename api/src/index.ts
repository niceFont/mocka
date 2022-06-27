import fastify, {FastifyReply, FastifyRequest} from 'fastify';
import {Endpoint, PrismaClient} from '@prisma/client';
import {FastifyInstance} from 'fastify';
import socketioServer from 'fastify-socket.io';
import cors from '@fastify/cors';

const server = fastify({logger: true});
const prisma = new PrismaClient();

// FIX THIS STUFF
server.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
});
server.register(socketioServer, {
	path: '/ws',
	cors: {
		origin: true,
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
	}});
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

interface RequestLog {
	method: string
	status: number
	date: number
}
interface EmitOptions extends Omit<RequestLog, 'date'> {
	roomId: string
}

function emitRequest({method, status, roomId} : EmitOptions) {
	const payload : RequestLog = {
		method,
		date: Date.now(),
		status,
	};

	server.io.to(roomId).emit('got_request', payload);
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
	console.log('GOT HERE');
	const {hash} = request.params as { hash?: string };
	if (!hash) {
		reply.statusCode = 404;
		return reply.send('Not Found');
	}

	const endpoint = await prisma.endpoint.findUnique({
		where: {
			slug: hash,
		},
	});
	if (!endpoint) {
		reply.statusCode = 404;
		return reply.send('Not Found');
	}

	if (request.method.toLowerCase() !== endpoint.method.toLowerCase()) {
		reply.statusCode = 405;
		return reply.send('Methot not allowed');
	}

	const body = getBody(endpoint);
	setHeaders(reply, endpoint.headers?.toString() ?? '{}');
	reply.header('Content-Type', endpoint.content_type);
	emitRequest({
		method: request.method,
		status: 200,
		roomId: endpoint.slug,
	});
	reply.statusCode = endpoint.status;
	return reply.send(body);
});

server.ready(err => {
	if (err) {
		throw err;
	}

	server.io.on('connection', socket => {
		socket.on('register', hash => {
			server.log.info(socket.id + ' joined room ' + hash);
			socket.join(hash);
		});
	});
});

const start = async () => {
	try {
		server.listen({port: 8888, host: '127.0.0.1'});
	} catch (error) {
		server.log.error(error);
		process.exit(0);
	}
};

start();
