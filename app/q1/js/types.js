const TYPES = {
  'A': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 0 }, { x: 3, y: 0 } ],
      1: [ { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 } ],
      2: [ { x: 3, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 3 } ],
      3: [ { x: 3, y: 3 }, { x: 0, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 0 } ]
    },
    color: 'yellow',
    shape: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 1],
    ]
  },
  
  'B': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 } ],
      1: [ { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 2 } ],
      2: [ { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 } ],
      3: [ { x: 1, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 0 } ]
    },
    color: 'gold',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 1, 0],
    ]
  },

  'C': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 } ],
      1: [ { x: 3, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 3 } ],
      2: [ { x: 3, y: 3 }, { x: 0, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 0 } ],
      3: [ { x: 0, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 0 }, { x: 3, y: 0 } ]
    },
    color: 'crimson',
    shape: [
      [1, 1, 1, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  },
  'D': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 0 } ],
      1: [ { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 } ],
      2: [ { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 } ],
      3: [ { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 } ]
    },
    color: 'brown',
    shape: [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ]
  },
  'E': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 } ],
      1: [ { x: 3, y: 0 }, { x: 0, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 3 } ],
      2: [ { x: 3, y: 3 }, { x: 0, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 0 } ],
      3: [ { x: 0, y: 3 }, { x: 3, y: 3 }, { x: 0, y: 0 }, { x: 3, y: 0 } ]
    },
    color: 'pink',
    shape: [
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
    ]
  },
  'F': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 0 } ],
      1: [ { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 } ],
      2: [ { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 } ],
      3: [ { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 } ]
    },
    color: 'purple',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
    ]
  },
  'G': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 } ],
      1: [ { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 2 } ],
      2: [ { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 } ],
      3: [ { x: 1, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 0 } ]
    },
    color: 'blue',
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0],
    ]
  },
  'H': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 0 } ],
      1: [ { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 } ],
      2: [ { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 } ],
      3: [ { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 } ]
    },
    color: 'deepskyblue',
    shape: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ]
  },
  'I': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 } ],
      1: [ { x: 1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 } ],
      2: [ { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 0 } ],
      3: [ { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 } ]
    },
    color: 'skyblue',
    shape: [
      [1, 1],
      [0, 1],
    ]
  },
  'J': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 } ],
      1: [ { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 } ],
      2: [ { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 } ],
      3: [ { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 0 } ]
    },
    color: 'aquamarine',
    shape: [
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ]
  },
  'K': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 } ],
      1: [ { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 } ],
      2: [ { x: 2, y: 2 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 } ],
      3: [ { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 2, y: 0 } ]
    },
    color: 'green',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0]
    ]
  },
  'L': {
    pointer: {
      // default                 flipH         flipV          flipHV
      0: [ { x: 1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 2 } ],
      1: [ { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 } ],
      2: [ { x: 1, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 0 } ],
      3: [ { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 } ]
    },
    color: 'lightgreen',
    shape: [
      [0, 1, 1],
      [0, 0, 1],
      [0, 1, 1]
    ]
  }

}

export default TYPES;


