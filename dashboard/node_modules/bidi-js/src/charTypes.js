import DATA from './data/bidiCharTypes.data.js'

const TYPES = {}
const TYPES_TO_NAMES = {}
TYPES.L = 1 //L is the default
TYPES_TO_NAMES[1] = 'L'
Object.keys(DATA).forEach((type, i) => {
  TYPES[type] = 1 << (i + 1)
  TYPES_TO_NAMES[TYPES[type]] = type
})
Object.freeze(TYPES)

const ISOLATE_INIT_TYPES = TYPES.LRI | TYPES.RLI | TYPES.FSI
const STRONG_TYPES = TYPES.L | TYPES.R | TYPES.AL
const NEUTRAL_ISOLATE_TYPES = TYPES.B | TYPES.S | TYPES.WS | TYPES.ON | TYPES.FSI | TYPES.LRI | TYPES.RLI | TYPES.PDI
const BN_LIKE_TYPES = TYPES.BN | TYPES.RLE | TYPES.LRE | TYPES.RLO | TYPES.LRO | TYPES.PDF
const TRAILING_TYPES = TYPES.S | TYPES.WS | TYPES.B | ISOLATE_INIT_TYPES | TYPES.PDI | BN_LIKE_TYPES

let map = null

function parseData () {
  if (!map) {
    //const start = performance.now()
    map = new Map()
    let start = 0;
    for (const type in DATA) {
      if (DATA.hasOwnProperty(type)) {
        const segments = DATA[type];
        let temp = '';
        let end;
        let state = false;
        let lastCode = 0;
        for (let i = 0; i <= segments.length + 1; i += 1) {
          const char = segments[i];
          if (char !== ',' && i !== segments.length) {
            if (char === '+') {
              state = true;
              lastCode = start = lastCode + parseInt(temp, 36);
              temp = '';
            } else {
              temp += char;
            }
          } else {
            if (!state) {
              lastCode = start = lastCode + parseInt(temp, 36);
              end = start;
            } else {
              end = start + parseInt(temp, 36);
            }
            state = false;
            temp = '';
            lastCode = end;
            for (let j = start; j < end + 1; j += 1) {
              map.set(j, TYPES[type]);
            }
          }
        }
      }
    }
    //console.log(`char types parsed in ${performance.now() - start}ms`)
  }
}

/**
 * @param {string} char
 * @return {number}
 */
function getBidiCharType (char) {
  parseData()
  return map.get(char.codePointAt(0)) || TYPES.L
}

/**
 * Get Bidi Character Type Name
 * @param {string} char
 * @returns { "L" | "R" | "EN" | "ES" | "ET" | "AN" | "CS" | "B" | "S" | "WS" | "ON" | "BN" | "NSM" | "AL" | "LRO" | "RLO" | "LRE" | "RLE" | "PDF" | "LRI" | "RLI" | "FSI" | "PDI" }
 */
function getBidiCharTypeName(char) {
  return TYPES_TO_NAMES[getBidiCharType(char)]
}

export {
  getBidiCharType,
  getBidiCharTypeName,
  TYPES,
  TYPES_TO_NAMES,
  ISOLATE_INIT_TYPES,
  STRONG_TYPES,
  NEUTRAL_ISOLATE_TYPES,
  BN_LIKE_TYPES,
  TRAILING_TYPES
}
