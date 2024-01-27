import express, { Express, NextFunction, Request, Response } from 'express'
import { DutiesRouteService } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'

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
    this.app.use('/duties', this.dutiesRouteService.router)
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  next()
}
