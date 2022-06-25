import {Endpoint, Prisma, PrismaClient} from "@prisma/client"



class EndpointRepository {
  constructor(private prismaClient : PrismaClient) {}

  async createEndpoint(endpoint: Prisma.EndpointCreateArgs) : Promise<Endpoint> {
    return this.prismaClient.endpoint.create({
      data: {
        body_json: endpoint.data.body_json,
        body_plain: endpoint.data.body_plain,
        headers: endpoint.data.headers,
        method: endpoint.data.method,
        slug: endpoint.data.slug
      }
    })
  }

  async getEndpoint(slug: Endpoint['slug']) : Promise<Endpoint | null> {
    return this.prismaClient.endpoint.findUnique({
      where: {
        slug
      },
    })
  }
}



export default EndpointRepository