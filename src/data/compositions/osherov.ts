import Composition from '~/entities/composition/model'
import Tact from '~/entities/composition/model/Tact'
import Chord from '~/entities/unit/model/Chord'
import Fraction from '~/entities/unit/model/Note'
import { DKurd } from '../instruments'

const pattern = [
  new Tact(0, [
    new Fraction(0, { frequencies: [DKurd.notes[0].frequency], symbol: 'D' }),
    new Fraction(1, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { frequencies: [], symbol: '.' }),
    new Fraction(3, { frequencies: [DKurd.notes[8].frequency], symbol: '8', color: 'green' }),
    new Fraction(4, { frequencies: [DKurd.notes[5].frequency], symbol: '5' }),
    new Fraction(5, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(6, { frequencies: [], symbol: '.' }),
    new Fraction(7, { frequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(1, [
    new Fraction(0, { frequencies: [], symbol: '*' }),
    new Fraction(1, { frequencies: [DKurd.notes[1].frequency], symbol: '1', color: 'green' }),
    new Fraction(2, { frequencies: [DKurd.notes[7].frequency], symbol: '7' }),
    new Fraction(3, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(4, { frequencies: [], symbol: '.' }),
    new Chord(5, [
      new Fraction(5, { frequencies: [DKurd.notes[6].frequency], symbol: '6', color: 'green' }),
      new Fraction(5, { frequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' })
    ]),
    new Fraction(6, { frequencies: [], symbol: '.' }),
    new Fraction(7, { frequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(2, [
    new Fraction(0, { frequencies: [], symbol: '*' }),
    new Fraction(1, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { frequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(3, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(4, { frequencies: [], symbol: '.' }),
    new Fraction(5, { frequencies: [DKurd.notes[1].frequency], symbol: '1', color: 'green' }),
    new Fraction(6, { frequencies: [DKurd.notes[4].frequency], symbol: '4' }),
    new Fraction(7, { frequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(3, [
    new Fraction(0, { frequencies: [], symbol: '*' }),
    new Fraction(1, { frequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { frequencies: [DKurd.notes[1].frequency], symbol: '1' }),
    new Fraction(3, { frequencies: [DKurd.notes[2].frequency], symbol: '2', color: 'green' }),
    new Fraction(4, { frequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(5, { frequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' }),
    new Fraction(6, { frequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(7, { frequencies: [DKurd.notes[2].frequency], symbol: '2', color: 'green' }),
  ])
]

const Osherov1 = new Composition({
  id: 1,
  bpm: 160,
  name: 'Kirill Osherov Excercise #1',
  pattern,
  size: 8
})

export default Osherov1