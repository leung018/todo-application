import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import { DutiesRouterFactory } from './routes/duties'
import morgan from 'morgan'
import cors from 'cors'
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

    app.use(this.errorHandler)
    return app
  }

  private static setPreRoutingMiddlewares(app: Express) {
    app.use(morgan('tiny'))
    app.use(cors()) // TODO: Configure cors with stricter option when needed
    app.use(express.json())
    app.use(
      OpenApiValidator.middleware({
        apiSpec: './openapi.yaml',
        validateRequests: true,
        validateResponses: true,
      }),
    )
  }

  private static readonly errorHandler = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // According to express documentation, if headers already sent, we must delegate to the default Express error handler
    if (res.headersSent) {
      return next(err)
    }

    // Refer to the how to register an error handler in the documentation of express-openapi-validator
    res.status(err.status || 500).json({
      message: err.message,
    })
  }
}
