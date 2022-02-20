const SCALES = {
  DKurd: {
    notes: [
      {
        symbol: "D3",
        range: {
          from: 141,
          to: 150
        }
      },
      {
        symbol: "A3",
        range: {
          from: 215,
          to: 225
        }
      },
      {
        symbol: "Bb3",
        range: {
          from: 228,
          to: 238
        }
      },
      {
        symbol: "C4",
        range: {
          from: 255,
          to: 265
        }
      },
      {
        symbol: "D4",
        range: {
          from: 290,
          to: 295
        }
      },
      {
        symbol: "E4",
        range: {
          from: 325,
          to: 335
        }
      },
      {
        symbol: "F4",
        range: {
          from: 345,
          to: 355
        }
      },
      {
        symbol: "G4",
        range: {
          from: 385,
          to: 395
        }
      },
      {
        symbol: "A4",
        range: {
          from: 435,
          to: 445
        }
      },
    ],
    percussion: {
      T: {
        symbol: "T",
        range: {
          from: 200,
          to: 250
        }
      },
      K: {
        symbol: "K",
        range: {
          from: 100,
          to: 300
        }
      },
    }
  }
}

const PATTERNS = {
  Seven: [
    SCALES.DKurd.notes[0],
    null,
    SCALES.DKurd.notes[4],
    SCALES.DKurd.notes[0],
    null,
    SCALES.DKurd.notes[5],
    null
  ]
}

export {
  PATTERNS
}
