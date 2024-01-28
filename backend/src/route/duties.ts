import { Request, Response } from 'express'
import {
  DutyRepository,
  InMemoryDutyRepository,
  PostgresDutyRepository,
} from '../repositories/duty'
import { RouteService } from './route'
import { Duty, DutyFactory } from '../models/duty'
import { ApplicationContext } from '../context'
import { InvalidArgumentError } from '../utils/errors'

export class DutiesRouteService extends RouteService {
  private dutyRepository: DutyRepository

  static async create(applicationContext: ApplicationContext) {
    const dutyRepository = await PostgresDutyRepository.create(
      applicationContext.postgresContext,
    )
    return new DutiesRouteService({ dutyRepository })
  }

  static createNull() {
    return new DutiesRouteService({
      dutyRepository: new InMemoryDutyRepository(),
    })
  }

  private constructor({ dutyRepository }: { dutyRepository: DutyRepository }) {
    super()
    this.dutyRepository = dutyRepository

    this.post('/', this.createDuty)
    this.get('/', this.listDuties)
  }

  private createDuty = async (req: Request, res: Response) => {
    let duty: Duty
    try {
      duty = DutyFactory.createDuty({ name: req.body.name })
    } catch (error) {
      if (error instanceof InvalidArgumentError) {
        res.status(400).send({ message: error.message })
        return
      }
      throw error
    }
    await this.dutyRepository.create(duty)
    res.status(201).send(duty)
  }

  private listDuties = async (req: Request, res: Response) => {
    const duties = await this.dutyRepository.listDuties()
    res.status(200).send(duties)
  }
}
