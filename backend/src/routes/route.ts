import { Router, Request, Response, NextFunction } from 'express'

export interface RouteConfig {
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  handler: (req: Request, res: Response) => void
}

/**
 * Aim of this function is to create a router that wrapped handlers with async error handling support.
 * Original express router does not support async error handling.
 */
export function createRouter(routeConfigs: RouteConfig[]): Router {
  const router = Router()
  routeConfigs.forEach((routeConfig) => {
    router[routeConfig.method](routeConfig.path, wrapper(routeConfig.handler))
  })
  return router
}

function wrapper(
  handler: (req: Request, res: Response) => void,
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
}
