import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import { DutiesRouterInitializer } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'

export class ExpressAppInitializer {
  static async createApp(applicationContext: ApplicationContext) {
    const dutiesRouter =
      await DutiesRouterInitializer.createRouter(applicationContext)
    return ExpressAppInitializer.internalCreateApp({
      dutiesRouter,
    })
  }

  static createNullApp() {
    return ExpressAppInitializer.internalCreateApp({
      dutiesRouter: DutiesRouterInitializer.createNullRouter(),
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
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
