import { Response } from 'express'
import { EntityNotFoundError, InvalidArgumentError } from '../utils/errors'

export interface RouteErrorTemplate {
  typeOfError: new (...args: never[]) => Error
  statusCode: number
  customMessage?: string
}

export class RouteErrorHandler {
  static defaultRouteErrorTemplates: ReadonlyArray<RouteErrorTemplate> = [
    {
      typeOfError: InvalidArgumentError,
      statusCode: 400,
    },
    {
      typeOfError: EntityNotFoundError,
      statusCode: 404,
    },
  ]

  private readonly routeErrorTemplates: ReadonlyArray<RouteErrorTemplate>

  constructor(
    routeErrorTemplates: ReadonlyArray<RouteErrorTemplate> = RouteErrorHandler.defaultRouteErrorTemplates,
  ) {
    this.routeErrorTemplates = routeErrorTemplates
  }

  handle(err: unknown, res: Response) {
    for (const template of this.routeErrorTemplates) {
      if (err instanceof template.typeOfError) {
        const message = template.customMessage ?? err.message
        res.status(template.statusCode).send({ message: message })
        return
      }
    }
    throw err
  }
}
