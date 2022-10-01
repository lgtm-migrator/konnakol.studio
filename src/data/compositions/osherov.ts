import Composition from '~/entities/composition/model'
import Tact from '~/entities/composition/model/Tact'
import Chord from '~/entities/unit/model/Chord'
import Fraction from '~/entities/unit/model/Fraction'
import { DKurd } from '../instruments'

const pattern = [
  new Tact(0, [
    new Fraction(0, { possibleFrequencies: [DKurd.notes[0].frequency], symbol: 'D' }),
    new Fraction(1, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { possibleFrequencies: [], symbol: '.' }),
    new Fraction(3, { possibleFrequencies: [DKurd.notes[8].frequency], symbol: '8', color: 'green' }),
    new Fraction(4, { possibleFrequencies: [DKurd.notes[5].frequency], symbol: '5' }),
    new Fraction(5, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(6, { possibleFrequencies: [], symbol: '.' }),
    new Fraction(7, { possibleFrequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(1, [
    new Fraction(0, { possibleFrequencies: [], symbol: '*' }),
    new Fraction(1, { possibleFrequencies: [DKurd.notes[1].frequency], symbol: '1', color: 'green' }),
    new Fraction(2, { possibleFrequencies: [DKurd.notes[7].frequency], symbol: '7' }),
    new Fraction(3, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(4, { possibleFrequencies: [], symbol: '.' }),
    new Chord(5, [
      new Fraction(5, { possibleFrequencies: [DKurd.notes[6].frequency], symbol: '6', color: 'green' }),
      new Fraction(5, { possibleFrequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' })
    ]),
    new Fraction(6, { possibleFrequencies: [], symbol: '.' }),
    new Fraction(7, { possibleFrequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(2, [
    new Fraction(0, { possibleFrequencies: [], symbol: '*' }),
    new Fraction(1, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { possibleFrequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(3, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(4, { possibleFrequencies: [], symbol: '.' }),
    new Fraction(5, { possibleFrequencies: [DKurd.notes[1].frequency], symbol: '1', color: 'green' }),
    new Fraction(6, { possibleFrequencies: [DKurd.notes[4].frequency], symbol: '4' }),
    new Fraction(7, { possibleFrequencies: [], symbol: 'B', color: 'green' }),
  ]),
  new Tact(2, [
    new Fraction(0, { possibleFrequencies: [], symbol: '*' }),
    new Fraction(1, { possibleFrequencies: [], symbol: '.', color: 'green' }),
    new Fraction(2, { possibleFrequencies: [DKurd.notes[1].frequency], symbol: '1' }),
    new Fraction(3, { possibleFrequencies: [DKurd.notes[2].frequency], symbol: '2', color: 'green' }),
    new Fraction(4, { possibleFrequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(5, { possibleFrequencies: [DKurd.notes[4].frequency], symbol: '4', color: 'green' }),
    new Fraction(6, { possibleFrequencies: [DKurd.notes[3].frequency], symbol: '3' }),
    new Fraction(7, { possibleFrequencies: [DKurd.notes[2].frequency], symbol: '2', color: 'green' }),
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