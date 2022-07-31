import buildServer from './app';

const server = buildServer({
	logger: {
		level: 'info',
		transport: {
			target: 'pino-pretty',
		},
	},
});

server.listen({port: 8888}, err => {
	server.log.error(err);
});
