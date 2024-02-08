import express, { Express, NextFunction, Request, Response } from 'express'
import { DutiesRouteService } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'
import { RouteService } from './route/route'

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
    extraRoutes = [],
  }: {
    extraRoutes?: { path: string; routeService: RouteService }[]
  } = {}) {
    const initializer = new ExpressAppInitializer({
      dutiesRouteService: DutiesRouteService.createNull(),
      extraRoutes,
    })
    return initializer.app
  }

  private constructor({
    dutiesRouteService,
    extraRoutes = [],
  }: {
    dutiesRouteService: DutiesRouteService
    extraRoutes?: { path: string; routeService: RouteService }[]
  }) {
    this.app = express()

    this.setPreRoutingMiddlewares()
    this.addRouteService('/duties', dutiesRouteService)

    extraRoutes.forEach(({ path, routeService }) => {
      this.addRouteService(path, routeService)
    })
  }

  private setPreRoutingMiddlewares() {
    this.app.use(morgan('tiny'))
    this.app.use(allowCors)
    this.app.use(express.json())
  }

  private addRouteService(path: string, routeService: RouteService) {
    this.app.use(path, routeService.router)
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
