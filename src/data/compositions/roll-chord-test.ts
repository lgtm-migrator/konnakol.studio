import Composition from '~/entities/composition/model'
import Tact from '~/entities/composition/model/Tact'
import Chord from '~/entities/unit/model/Chord'
import Fraction from '~/entities/unit/model/Note'
import Roll from '~/entities/unit/model/Roll'
import { DKurd } from '../instruments'

const pattern = [
  new Tact(0, [
    new Fraction(0, { frequencies: [], symbol: '*' }),
    new Fraction(1, { frequencies: [], symbol: '•', color: 'green' }),
    new Roll(2, [
      new Fraction(2, { frequencies: [DKurd.notes[1].frequency], symbol: '1', }),
      new Fraction(2, { frequencies: [DKurd.notes[3].frequency], symbol: '2', color: 'green' }),
    ]),
    new Fraction(3, { frequencies: [DKurd.notes[2].frequency], symbol: '2', color: 'green' }),
    new Roll(4, [
      new Fraction(4, { frequencies: [DKurd.notes[5].frequency], symbol: '5', }),
      new Fraction(4, { frequencies: [DKurd.notes[7].frequency], symbol: '7', color: 'green' }),
    ]),
    new Fraction(5, { frequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' }),
    new Fraction(6, { frequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Chord(7, [
      new Fraction(7, { frequencies: [DKurd.notes[6].frequency], symbol: '6', color: 'green' }),
      new Fraction(7, { frequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' })
    ]),
  ])
]

const RollChordTest = new Composition({
  id: 1,
  bpm: 100,
  name: 'Rolls & Chords (Test)',
  pattern,
  size: 8
})

export default RollChordTest