import fastify, { FastifyReply } from "fastify";
import {Endpoint, PrismaClient} from "@prisma/client"

const server = fastify({logger: true});
const prisma = new PrismaClient()

function getBody(endpoint: Endpoint) : object | string | undefined {
  const {body_json, body_plain} = endpoint
  if(body_json) {
    return body_json.valueOf
  }
  if(body_plain) {
    return body_plain
  }
  return
}


server.get("/:hash", async (request, reply) => {
  const {hash} = request.params as { hash?: string }

  if(!hash) return reply.status(404).send()
  const endpoint = await prisma.endpoint.findUnique({
    where: {
      slug: hash
    }
  });
  if(!endpoint) return reply.send(404).send()
  
  const body = getBody(endpoint)
  
  

  return 
})

const start = async () => {
  try {
    server.listen({port: 5000})
  } catch (error) {
    server.log.error(error)
    process.exit(0)
  }
}

start()