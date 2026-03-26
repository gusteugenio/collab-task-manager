import awsLambdaFastify from '@fastify/aws-lambda'
import { app } from './app.js'

const proxy = awsLambdaFastify(app)
const bootstrap = app.ready()

export const handler = async (...args: Parameters<typeof proxy>) => {
	await bootstrap
	return proxy(...args)
}
