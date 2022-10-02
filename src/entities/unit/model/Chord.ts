import { Frequency } from '~/types/fraction.types';
import { sleep } from '~/utils/common.utils';
import { areFrequenciesCorrect } from '~/utils/frequency.utils';
import { bpmToMilliseconds } from '~/utils/tempo.utils';
import Note from './Note';
import { ChordNotes, UnitKind } from './shared';
import Unit, { AnyUnit } from './Unit';

export const isChordNotesCountCorrect = (
  notes: Note[]
): notes is ChordNotes => [2, 3, 4].includes(notes.length)

export const isChord = (
  unit: AnyUnit
): unit is Chord => unit instanceof Chord && isChordNotesCountCorrect(unit.children)

export default class Chord implements Unit<ChordNotes> {
  kind = UnitKind.Chord;

  constructor(public readonly index: number, public readonly children: ChordNotes) { }

  get symbol() {
    return `(${this.children.map(({ symbol }) => symbol).join('|')})`
  }

  async *play(bpm: number) {
    const interval = bpmToMilliseconds(bpm)
    await sleep(interval)
    yield this.children
  }

  check(receivedFrequency: Frequency) {
    const frequencies = this.children.flatMap(({ frequencies }) => frequencies)
    return areFrequenciesCorrect(frequencies, receivedFrequency)
  }
}