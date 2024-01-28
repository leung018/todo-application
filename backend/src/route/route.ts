import { Router, Request, Response, NextFunction } from 'express'

export abstract class RouteService {
  readonly router: Router

  constructor() {
    this.router = Router()
  }

  protected post(path: string, handler: (req: Request, res: Response) => void) {
    this.router.post(path, this.wrapper(handler))
  }

  protected get(path: string, handler: (req: Request, res: Response) => void) {
    this.router.get(path, this.wrapper(handler))
  }

  protected put(path: string, handler: (req: Request, res: Response) => void) {
    this.router.put(path, this.wrapper(handler))
  }

  protected patch(
    path: string,
    handler: (req: Request, res: Response) => void,
  ) {
    this.router.patch(path, this.wrapper(handler))
  }

  protected delete(
    path: string,
    handler: (req: Request, res: Response) => void,
  ) {
    this.router.delete(path, this.wrapper(handler))
  }

  private wrapper(
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
}
