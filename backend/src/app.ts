import express, { Express } from 'express'
import { DutiesRouteService } from './route/duties'

export class ExpressAppInitializer {
  readonly app: Express

  static create() {
    return new ExpressAppInitializer({
      dutiesRouteService: DutiesRouteService.create(),
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
    this.app.use(express.json())
    this.app.use('/duties', dutiesRouteService.router)
  }
}
