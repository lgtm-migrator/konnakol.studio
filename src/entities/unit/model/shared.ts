import Note from './Note';
import Unit, { WithFrequencies } from './Unit';

export type ChordNotes =
  | []
  | [Note, Note]
  | [Note, Note, Note]
  | [Note, Note, Note, Note]

export type Beat = Unit & WithFrequencies