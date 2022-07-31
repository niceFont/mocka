/* eslint-disable camelcase */
import {PrismaClient} from '@prisma/client';
import {promisify} from 'util';
import {exec} from 'child_process';

const execAsync = promisify(exec);
export default async function () {
	const prisma = new PrismaClient();
	await execAsync('npm run migrate:test');
	await prisma.endpoint.createMany({
		data: [
			{
				method: 'GET',
				status: 200,
				slug: 'abc',
				headers: {
					testHeader: 'wow this works',
				},
				body_plain: 'test',
				content_type: 'text/plain',
			},
			{
				method: 'GET',
				status: 200,
				slug: 'efg',
				headers: {
					testHeader: 'another header',
				},
				body_json: JSON.stringify({value: 'Test'}),
				content_type: 'text/plain',
			},
		],
	});
	return {
		prisma,
	};
}
