import express, { Express, NextFunction, Request, Response } from 'express'
import { DutiesRouteService } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'
import { RouteService } from './route/route'

export interface RouteConfig {
  path: string
  routeService: RouteService
}

export class ExpressAppInitializer {
  private readonly app: Express

  static async createApp(applicationContext: ApplicationContext) {
    const dutiesRouteService =
      await DutiesRouteService.create(applicationContext)
    const initializer = new ExpressAppInitializer({
      dutiesRouteService,
    })
    return initializer.app
  }

  static createNullApp({
    extraRouteConfigs = [],
  }: {
    extraRouteConfigs?: RouteConfig[]
  } = {}) {
    const initializer = new ExpressAppInitializer({
      dutiesRouteService: DutiesRouteService.createNull(),
    })
    extraRouteConfigs.forEach((routeConfig) => {
      initializer.addRoute(routeConfig)
    })
    return initializer.app
  }

  private constructor({
    dutiesRouteService,
  }: {
    dutiesRouteService: DutiesRouteService
  }) {
    this.app = express()

    this.setPreRoutingMiddlewares()

    this.addRoute({
      path: '/duties',
      routeService: dutiesRouteService,
    })
  }

  private setPreRoutingMiddlewares() {
    this.app.use(morgan('tiny'))
    this.app.use(allowCors)
    this.app.use(express.json())
  }

  private addRoute({ path, routeService }: RouteConfig) {
    this.app.use(path, routeService.router)
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
