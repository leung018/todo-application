import express, { Request, Response } from 'express'
import { DutyRepository, InMemoryDutyRepository } from '../repositories/duty'
import { RouteService } from './route'
import { DutyFactory } from '../models/duty'

export class DutiesRouteService implements RouteService {
  readonly router = express.Router()

  private dutyRepository: DutyRepository

  static create() {
    return new DutiesRouteService({
      dutyRepository: new InMemoryDutyRepository(), // TODO: Use a real repository
    })
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
