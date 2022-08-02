/* eslint-disable camelcase */
import {getBody} from './utils';
import {test} from 'tap';
import {Endpoint} from '@prisma/client';

test('get json body', t => {
	const endpoint: Endpoint = {
		method: 'GET',
		body_json: JSON.stringify({test: true}),
		body_plain: null,
		headers: null,
		status: 200,
		id: 1,
		slug: 'test',
		content_type: 'text_plain',
	};
	t.equal(getBody(endpoint), endpoint.body_json);
});
test('get json body', t => {
	const endpoint: Endpoint = {
		method: 'GET',
		body_json: null,
		body_plain: 'test',
		headers: null,
		status: 200,
		id: 1,
		slug: 'test',
		content_type: 'text_plain',
	};
	t.equal(getBody(endpoint), 'test');
});
