import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import { DutiesRouteService } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'
import { RouteService } from './route/route'

export class ExpressAppInitializer {
  readonly app: Express
  private readonly dutiesRouteService: DutiesRouteService

  static async create(applicationContext: ApplicationContext) {
    const dutiesRouteService =
      await DutiesRouteService.create(applicationContext)
    return new ExpressAppInitializer({
      dutiesRouteService,
    })
  }

  static createNull() {
    return new ExpressAppInitializer({
      dutiesRouteService: DutiesRouteService.createNull(),
    })
  }

  private constructor({
    dutiesRouteService,
  }: {
    dutiesRouteService: DutiesRouteService
  }) {
    this.app = express()
    this.dutiesRouteService = dutiesRouteService

    this.setPreRoutingMiddlewares()
    this.setRoutes()
  }

  private setPreRoutingMiddlewares() {
    this.app.use(morgan('tiny'))
    this.app.use(allowCors)
    this.app.use(express.json())
  }

  private setRoutes() {
    this.addRouteService('/duties', this.dutiesRouteService)
  }

  addRouteService(path: string, routeService: RouteService) {
    this.app.use(path, this.routerHandler(routeService.router))
  }

  private routerHandler(router: Router) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await router(req, res, next)
      } catch (error) {
        next(error)
      }
    }
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
