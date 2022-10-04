import { AnyUnit } from '~/entities/unit/model/Unit'

export default class Tact {
  constructor(public readonly index: number, public readonly units: AnyUnit[]) { }
}