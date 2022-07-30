import {Endpoint} from '@prisma/client';
import {UAParser as uaParser} from 'ua-parser-js';

export function getBody(endpoint: Endpoint): object | string | undefined {
	const {body_json: bodyJson, body_plain: bodyPlain} = endpoint;
	if (bodyJson) {
		return JSON.parse(bodyJson as string);
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
