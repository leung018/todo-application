import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import { DutiesRouterFactory } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'
import * as OpenApiValidator from 'express-openapi-validator'

export class ExpressAppFactory {
  static async createApp(applicationContext: ApplicationContext) {
    const dutiesRouter =
      await DutiesRouterFactory.createRouter(applicationContext)
    return ExpressAppFactory.internalCreateApp({
      dutiesRouter,
    })
  }

  static createNullApp() {
    return ExpressAppFactory.internalCreateApp({
      dutiesRouter: DutiesRouterFactory.createNullRouter(),
    })
  }

  private static internalCreateApp({ dutiesRouter }: { dutiesRouter: Router }) {
    const app = express()
    this.setPreRoutingMiddlewares(app)

    app.use('/duties', dutiesRouter)

    return app
  }

  private static setPreRoutingMiddlewares(app: Express) {
    app.use(morgan('tiny'))
    app.use(allowCors)
    app.use(express.json())
    app.use(
      OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true,
      }),
    )
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
