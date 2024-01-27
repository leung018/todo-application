import express, { Request, Response } from 'express'
import {
  DutyRepository,
  InMemoryDutyRepository,
  PostgresDutyRepository,
} from '../repositories/duty'
import { RouteService } from './route'
import { DutyFactory } from '../models/duty'
import { PostgresContext } from '../repositories/util'

export class DutiesRouteService implements RouteService {
  readonly router = express.Router()

  private dutyRepository: DutyRepository

  static async create({
    postgresContext,
  }: {
    postgresContext: PostgresContext
  }) {
    const dutyRepository = await PostgresDutyRepository.create(postgresContext)
    return new DutiesRouteService({ dutyRepository })
  }

  static createNull() {
    return new DutiesRouteService({
      dutyRepository: new InMemoryDutyRepository(),
    })
  }

  private constructor({ dutyRepository }: { dutyRepository: DutyRepository }) {
    this.dutyRepository = dutyRepository

    this.router.post('/', this.createDuty)
    this.router.get('/', this.listDuties)
  }

  private createDuty = async (req: Request, res: Response) => {
    const duty = DutyFactory.createDuty({ name: req.body.name })
    await this.dutyRepository.create(duty)
    res.status(201).send(duty)
  }

  private listDuties = async (req: Request, res: Response) => {
    const duties = await this.dutyRepository.listDuties()
    res.status(200).send(duties)
  }
}
