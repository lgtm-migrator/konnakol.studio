import Note from './Note';

export type ChordNotes =
  | []
  | [Note, Note]
  | [Note, Note, Note]
  | [Note, Note, Note, Note]
