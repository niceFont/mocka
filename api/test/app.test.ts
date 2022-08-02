import build from '../src/app';
import {test, before, teardown} from 'tap';
import {StartedTestContainer} from 'testcontainers';
import setup from './fixtures';

let container: StartedTestContainer;
before(async () => {
	container = (await setup()).container;
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
test('valid GET json request', async t => {
	const app = build();
	const expectedBody = {
		value: 'test',
	};
	const response = await app.inject({
		method: 'GET',
		url: '/efg',
	});
	t.match(response.json<typeof expectedBody>(), expectedBody, 'returns a valid json object');
	t.equal(response.statusCode, 200, 'returns status 200');
	t.has(response.headers, {
		testheader: 'another header',
	});
});

teardown(async () => {
	await container.stop();
});
