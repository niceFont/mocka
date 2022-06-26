import {Endpoint, Prisma, PrismaClient} from '@prisma/client';

class EndpointRepository {
	private prismaClient : PrismaClient;
	constructor(prismaClient : PrismaClient) {
		this.prismaClient = prismaClient;
	}

	async createEndpoint(endpoint: Prisma.EndpointCreateInput) : Promise<Endpoint> {
		return this.prismaClient.endpoint.create({
			data: endpoint,
		});
	}

	async getEndpoint(slug: Endpoint['slug']) : Promise<Endpoint | null> {
		return this.prismaClient.endpoint.findUnique({
			where: {
				slug,
			},
		});
	}
}

export default EndpointRepository;
