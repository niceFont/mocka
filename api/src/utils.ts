import {Endpoint} from '@prisma/client';
import {UAParser as uaParser} from 'ua-parser-js';
import {FastifyReply} from 'fastify';
import {Headers} from './types';

export function getBody(endpoint: Endpoint): string | undefined {
	const {body_json: bodyJson, body_plain: bodyPlain} = endpoint;
	if (bodyJson) {
		return bodyJson as string;
	}

	if (bodyPlain) {
		return bodyPlain;
	}
}

export function getDevice(userAgent?: string): string {
	const {
		os,
		device,
	} = uaParser(userAgent);
	return `${os?.name ?? 'Unknown'}, ${device?.type ?? 'Unknown'}`;
}

