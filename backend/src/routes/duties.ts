import { Request, Response } from 'express'
import {
  DutyRepository,
  InMemoryDutyRepository,
  PostgresDutyRepository,
} from '../repositories/duty'
import { Duty } from '../models/duty'
import { ApplicationContext } from '../context'
import { RouteErrorHandler } from './util'
import { createRouter } from './route'

export class DutiesRouterFactory {
  static async createRouter(applicationContext: ApplicationContext) {
    const dutyRepository = await PostgresDutyRepository.create(
      applicationContext.postgresContext,
    )
    return new DutiesRouterFactory({ dutyRepository }).createRouter()
  }

  static createNullRouter() {
    return new DutiesRouterFactory({
      dutyRepository: new InMemoryDutyRepository(),
    }).createRouter()
  }

  private readonly dutyRepository: DutyRepository

  private constructor({ dutyRepository }: { dutyRepository: DutyRepository }) {
    this.dutyRepository = dutyRepository
  }

  private createRouter() {
    return createRouter([
      {
        path: '/',
        method: 'post',
        handler: this.createDuty,
      },
      {
        path: '/',
        method: 'get',
        handler: this.listDuties,
      },
      {
        path: '/',
        method: 'delete',
        handler: this.deleteAllDuties,
      },
      {
        path: '/:id',
        method: 'put',
        handler: this.updateDuty,
      },
      {
        path: '/:id',
        method: 'delete',
        handler: this.deleteDuty,
      },
    ])
  }

  private readonly createDuty = async (req: Request, res: Response) => {
    let duty: Duty
    try {
      duty = Duty.create({ name: req.body.name })
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    await this.dutyRepository.create(duty)
    res.status(201).send(mapDutyToJSON(duty))
  }

  private readonly updateDuty = async (req: Request, res: Response) => {
    let duty: Duty
    try {
      duty = new Duty({ id: req.params.id, name: req.body.name })
      await this.dutyRepository.update(duty)
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    res.status(204).send()
  }

  private readonly deleteDuty = async (req: Request, res: Response) => {
    try {
      await this.dutyRepository.deleteDuty(req.params.id)
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    res.status(204).send()
  }

  private readonly listDuties = async (req: Request, res: Response) => {
    const duties = await this.dutyRepository.listDuties()
    res.status(200).send(duties.map(mapDutyToJSON))
  }

  private readonly deleteAllDuties = async (req: Request, res: Response) => {
    await this.dutyRepository.deleteAllDuties()
    res.status(204).send()
  }
}

function mapDutyToJSON(duty: Duty) {
  return { id: duty.id, name: duty.name }
}
