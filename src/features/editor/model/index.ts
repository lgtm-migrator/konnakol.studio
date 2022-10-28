import { combine, createStore, sample } from 'effector';
import { Pattern } from '~/entities/composition/model';
import Tact from '~/entities/composition/model/Tact';
import Chord from '~/entities/unit/model/Chord';
import Note, { isNote } from '~/entities/unit/model/Note';
import Roll from '~/entities/unit/model/Roll';
import { konnakolChanged } from '../ui';
import { $unitsAsMapping, ShorcutsToUnits } from './toolbar';

function parseKonnakol(unitsShortcutsMapping: ShorcutsToUnits, konnakol: string): Pattern {
  if (!konnakol) {
    return [];
  }

  return konnakol
    .split('\n')
    .map(line => new Tact(
      line
        .trim()
        .split(' ')
        .map(symbol => {
          // TODO: move it somewhere else
          const unit = unitsShortcutsMapping[symbol];
          const isChord = /^\((\S+\|?)+\)$/.test(symbol)
          const isRoll = /^\[\S+,?\]$/.test(symbol)

          if (isChord) {
            const chordSymbols = symbol.replaceAll(/\(|\)/g, '').split('|')
            return new Chord(
              chordSymbols.map(symbol =>
                unitsShortcutsMapping[symbol] ?? new Note({ frequencies: [], symbol, color: 'grey' })
              )
            )
          }

          if (isRoll) {
            const rollSymbols = symbol.replaceAll(/\[|\]/g, '').split(',')
            return new Roll(
              rollSymbols.map(symbol => {
                const unit = unitsShortcutsMapping[symbol]
                const isChord = /^\((\S+\|?)+\)$/.test(symbol)

                if (isChord) {
                  const chordSymbols = symbol.replaceAll(/\(|\)/g, '').split('|')

                  return new Chord(
                    chordSymbols.map(symbol => {
                      const unit = unitsShortcutsMapping[symbol]

                      if (unit) {
                        return unit
                      }

                      return new Note({ frequencies: [], symbol, color: 'grey' })
                    })
                  )
                }

                if (isNote(unit)) {
                  return unit
                }

                return new Note({ frequencies: [], symbol, color: 'grey' })
              })
            )
          }

          if (unit) {
            return unit;
          }

          return new Note({ frequencies: [], symbol, color: 'grey' })
        })
    ))
}

export const $konnakol = createStore('');

export const $composition = combine(
  $unitsAsMapping,
  $konnakol,
  parseKonnakol
)

sample({
  clock: konnakolChanged,
  target: $konnakol
})


