import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Note from './Note';
import { ChordNotes } from './shared';
import Unit, { CompositeUnit, SingleUnit, UnitKind, UnitType } from './Unit';

export const isChordNotesCountCorrect = (
  notes: Note[]
): notes is ChordNotes => [2, 3, 4].includes(notes.length)

export const isChord = (
  unit: Unit
): unit is Chord => unit instanceof Chord && isChordNotesCountCorrect(unit.children)

export default class Chord implements CompositeUnit<ChordNotes> {
  kind: UnitKind.Composite = UnitKind.Composite;
  type: UnitType.Chord = UnitType.Chord
  public readonly frequencies: Frequency[]

  constructor(public readonly index: number, public readonly children: ChordNotes) {
    this.frequencies = this.children.flatMap(({ frequencies }) => frequencies)
  }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    yield this
    await sleep(interval)
  }

  check(receivedFrequency: Frequency) {
    return areFrequenciesCorrect(this.frequencies, receivedFrequency)
  }
}