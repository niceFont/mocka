import fastify, {FastifyInstance, FastifyServerOptions} from 'fastify';
import {PrismaClient} from '@prisma/client';
import socketIo from 'fastify-socket.io';
import cors from '@fastify/cors';
import {getBody, getDevice, setHeaders} from './utils';
import {EmitOptions, Headers, RequestLog} from './types';

export default function build(options?: FastifyServerOptions): FastifyInstance {
	const server = fastify(options);
	const prisma = new PrismaClient();

	server.register(cors, {
		origin: true,
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
	});
	server.register(socketIo, {
		path: '/ws',
		cors: {
			origin: true,
			methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
		},
	});

	function emitRequest({method, status, roomId, device, matching}: EmitOptions) {
		const payload: RequestLog = {
			method,
			date: new Intl.DateTimeFormat('en-US', {dateStyle: 'short', timeStyle: 'medium'}).format(Date.now()),
			status,
			device,
			matching,
		};
		server.io.to(roomId).emit('got_request', payload);
	}

	server.all('/:hash', async (request, reply) => {
		const {hash} = request.params as { hash?: string };
		if (!hash) {
			reply.statusCode = 400;
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

		const matches = request.method.toLowerCase() === endpoint.method.toLowerCase();
		if (!matches) {
			reply.statusCode = 405;
			emitRequest({
				method: request.method,
				status: reply.statusCode,
				roomId: endpoint.slug,
				device: getDevice(request.headers['user-agent']),
				matching: false,
			});
			return reply.send('Method not allowed');
		}

		const body = getBody(endpoint);
		setHeaders(reply, endpoint.headers as Headers);
		reply.header('Content-Type', endpoint.content_type);
		emitRequest({
			method: request.method,
			status: reply.statusCode,
			roomId: endpoint.slug,
			device: getDevice(request.headers['user-agent']),
			matching: matches,
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

	return server;
}
