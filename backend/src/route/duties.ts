import { Request, Response } from 'express'
import {
  DutyRepository,
  InMemoryDutyRepository,
  PostgresDutyRepository,
} from '../repositories/duty'
import { RouteService } from './route'
import { Duty } from '../models/duty'
import { ApplicationContext } from '../context'
import { RouteErrorHandler } from './util'

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
    this.delete('/', this.deleteAllDuties)
    this.put('/:id', this.updateDuty)
    this.delete('/:id', this.deleteDuty)
  }

  private createDuty = async (req: Request, res: Response) => {
    let duty: Duty
    try {
      duty = Duty.create({ name: req.body.name })
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    await this.dutyRepository.create(duty)
    res.status(201).send(mapDutyToJSON(duty))
  }

  private updateDuty = async (req: Request, res: Response) => {
    let duty: Duty
    try {
      duty = new Duty({ id: req.params.id, name: req.body.name })
      await this.dutyRepository.update(duty)
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    res.status(200).send()
  }

  private deleteDuty = async (req: Request, res: Response) => {
    try {
      await this.dutyRepository.deleteDuty(req.params.id)
    } catch (err) {
      return new RouteErrorHandler().handle(err, res)
    }
    res.status(204).send()
  }

  private listDuties = async (req: Request, res: Response) => {
    const duties = await this.dutyRepository.listDuties()
    res.status(200).send(duties.map(mapDutyToJSON))
  }

  private deleteAllDuties = async (req: Request, res: Response) => {
    await this.dutyRepository.deleteAllDuties()
    res.status(204).send()
  }
}

function mapDutyToJSON(duty: Duty) {
  return { id: duty.id, name: duty.name }
}
