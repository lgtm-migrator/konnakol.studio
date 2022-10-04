import Note from './Note';

export type ChordNotes =
  | [Note, Note]
  | [Note, Note, Note]
  | [Note, Note, Note, Note]

export enum UnitKind {
  Roll = 'roll',
  Chord = 'chord',
  Note = 'note'
}

export type UnitChildren = ChordNotes | Note[] | null
