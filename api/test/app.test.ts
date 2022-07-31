import build from '../src/app';
import {test, before, teardown} from 'tap';
import {GenericContainer, StartedTestContainer} from 'testcontainers';
import setup from './fixtures';

let container: StartedTestContainer;
before(async () => {
	container = await new GenericContainer('postgres')
		.withName('test_postgres')
		.withExposedPorts({
			host: 9876,
			container: 5432,
		})
		.withEnv('POSTGRES_USER', 'postgres')
		.withEnv('POSTGRES_PASSWORD', 'postgres')
		.withEnv('POSTGRES_DB', 'postgres')
		.start();
	await setup();
});

test('valid GET plaintext request', async t => {
	const app = build();
	const response = await app.inject({
		method: 'GET',
		url: '/abc',
	});
	t.equal(response.body, 'test', 'returns plain text');
	t.equal(response.statusCode, 200, 'returns status 200');
	t.has(response.headers, {
		testheader: 'wow this works',
	});
});

teardown(async () => {
	await container.stop();
});
