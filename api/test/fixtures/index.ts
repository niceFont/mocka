/* eslint-disable camelcase */
import {PrismaClient} from '@prisma/client';
import {promisify} from 'util';
import {exec} from 'child_process';
import {GenericContainer} from 'testcontainers';

const execAsync = promisify(exec);
export default async function () {
	const container = await new GenericContainer('postgres')
		.withName('test_postgres')
		.withExposedPorts({
			host: 9876,
			container: 5432,
		})
		.withEnv('POSTGRES_USER', 'postgres')
		.withEnv('POSTGRES_PASSWORD', 'postgres')
		.withEnv('POSTGRES_DB', 'postgres')
		.start();
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
				body_json: JSON.stringify({value: 'test'}),
				content_type: 'application/json',
			},
		],
	});
	return {
		prisma,
		container,
	};
}
