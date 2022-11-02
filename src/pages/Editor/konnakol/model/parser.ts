import { Pattern } from '~/entities/composition/model';
import Tact from '~/entities/composition/model/Tact';
import Chord from '~/entities/unit/model/Chord';
import Note, { isNote } from '~/entities/unit/model/Note';
import Roll from '~/entities/unit/model/Roll';
import Unit from '~/entities/unit/model/Unit';
import { ShorcutsToUnits } from '../../sidebar/model';

const isChordSymbol = (symbol: string) => /^\((\S+\|?)+\)$/.test(symbol)
const isRollSymbol = (symbol: string) => /^\[\S+,?\]$/.test(symbol)

const getChordNotes = (chordSymbol: string) => chordSymbol.replaceAll(/\(|\)/g, '').split('|')
const getRollUnits = (rollSymbol: string) => rollSymbol.replaceAll(/\[|\]/g, '').split(',')

export default function parseKonnakol(
  unitsShortcutsMapping: ShorcutsToUnits,
  konnakol: string
): Pattern {
  if (!konnakol) {
    return [];
  }

  const parseNote = (symbol: string) => {
    const unit = unitsShortcutsMapping[symbol];

    if (unit && isNote(unit)) {
      return unit;
    }

    return new Note({ frequencies: [], symbol, color: 'grey' })
  }

  const parseUnit = (symbol: string): Unit => {
    if (isChordSymbol(symbol)) {
      const notesSymbols = getChordNotes(symbol)
      return new Chord(notesSymbols.map(parseNote))
    }

    if (isRollSymbol(symbol)) {
      const unitsSymbols = getRollUnits(symbol);
      return new Roll(unitsSymbols.map(s => {
        if (isChordSymbol(s)) {
          return new Chord(getChordNotes(s).map(parseNote))
        }

        return parseNote(s)
      }))
    }

    return parseNote(symbol)
  }

  return konnakol
    .split('\n')
    .map(line => new Tact(
      line
        .trim()
        .split(' ')
        .map(parseUnit)
    ))
}