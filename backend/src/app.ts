import express, { Express, NextFunction, Request, Response } from 'express'
import { DutiesRouteService } from './route/duties'
import morgan from 'morgan'
import { ApplicationContext } from './context'

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

  /**
   * This method is used for testing purposes only.
   *
   * @param extraRouteConfigs - Additional routes to add to the express app. This is useful for testing purposes.
   */
  static createNullApp() {
    const initializer = new ExpressAppInitializer({
      dutiesRouteService: DutiesRouteService.createNull(),
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

    this.app.use('/duties', dutiesRouteService.router)
  }

  private setPreRoutingMiddlewares() {
    this.app.use(morgan('tiny'))
    this.app.use(allowCors)
    this.app.use(express.json())
  }
}

const allowCors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  next()
}
