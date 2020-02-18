var exports = {},
    _dewExec = false;
function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  exports = {
    ROOT: 0,
    GROUP: 1,
    POSITION: 2,
    SET: 3,
    RANGE: 4,
    REPETITION: 5,
    REFERENCE: 6,
    CHAR: 7
  };
  return exports;
}

var exports$1 = {},
    _dewExec$1 = false;
function dew$1() {
  if (_dewExec$1) return exports$1;
  _dewExec$1 = true;

  const types = dew();

  const INTS = () => [{
    type: types.RANGE,
    from: 48,
    to: 57
  }];

  const WORDS = () => {
    return [{
      type: types.CHAR,
      value: 95
    }, {
      type: types.RANGE,
      from: 97,
      to: 122
    }, {
      type: types.RANGE,
      from: 65,
      to: 90
    }].concat(INTS());
  };

  const WHITESPACE = () => {
    return [{
      type: types.CHAR,
      value: 9
    }, {
      type: types.CHAR,
      value: 10
    }, {
      type: types.CHAR,
      value: 11
    }, {
      type: types.CHAR,
      value: 12
    }, {
      type: types.CHAR,
      value: 13
    }, {
      type: types.CHAR,
      value: 32
    }, {
      type: types.CHAR,
      value: 160
    }, {
      type: types.CHAR,
      value: 5760
    }, {
      type: types.RANGE,
      from: 8192,
      to: 8202
    }, {
      type: types.CHAR,
      value: 8232
    }, {
      type: types.CHAR,
      value: 8233
    }, {
      type: types.CHAR,
      value: 8239
    }, {
      type: types.CHAR,
      value: 8287
    }, {
      type: types.CHAR,
      value: 12288
    }, {
      type: types.CHAR,
      value: 65279
    }];
  };

  const NOTANYCHAR = () => {
    return [{
      type: types.CHAR,
      value: 10
    }, {
      type: types.CHAR,
      value: 13
    }, {
      type: types.CHAR,
      value: 8232
    }, {
      type: types.CHAR,
      value: 8233
    }];
  }; // Predefined class objects.


  exports$1.words = () => ({
    type: types.SET,
    set: WORDS(),
    not: false
  });

  exports$1.notWords = () => ({
    type: types.SET,
    set: WORDS(),
    not: true
  });

  exports$1.ints = () => ({
    type: types.SET,
    set: INTS(),
    not: false
  });

  exports$1.notInts = () => ({
    type: types.SET,
    set: INTS(),
    not: true
  });

  exports$1.whitespace = () => ({
    type: types.SET,
    set: WHITESPACE(),
    not: false
  });

  exports$1.notWhitespace = () => ({
    type: types.SET,
    set: WHITESPACE(),
    not: true
  });

  exports$1.anyChar = () => ({
    type: types.SET,
    set: NOTANYCHAR(),
    not: true
  });

  return exports$1;
}

var exports$2 = {},
    _dewExec$2 = false;
function dew$2() {
  if (_dewExec$2) return exports$2;
  _dewExec$2 = true;

  const types = dew();

  const sets = dew$1();

  const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
  const SLSH = {
    '0': 0,
    't': 9,
    'n': 10,
    'v': 11,
    'f': 12,
    'r': 13
  };
  /**
   * Finds character representations in str and convert all to
   * their respective characters
   *
   * @param {String} str
   * @return {String}
   */

  exports$2.strToChars = function (str) {
    /* jshint maxlen: false */
    var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
    str = str.replace(chars_regex, function (s, b, lbs, a16, b16, c8, dctrl, eslsh) {
      if (lbs) {
        return s;
      }

      var code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : c8 ? parseInt(c8, 8) : dctrl ? CTRL.indexOf(dctrl) : SLSH[eslsh];
      var c = String.fromCharCode(code); // Escape special regex characters.

      if (/[[\]{}^$.|?*+()]/.test(c)) {
        c = '\\' + c;
      }

      return c;
    });
    return str;
  };
  /**
   * turns class into tokens
   * reads str until it encounters a ] not preceeded by a \
   *
   * @param {String} str
   * @param {String} regexpStr
   * @return {Array.<Array.<Object>, Number>}
   */


  exports$2.tokenizeClass = (str, regexpStr) => {
    /* jshint maxlen: false */
    var tokens = [];
    var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
    var rs, c;

    while ((rs = regexp.exec(str)) != null) {
      if (rs[1]) {
        tokens.push(sets.words());
      } else if (rs[2]) {
        tokens.push(sets.ints());
      } else if (rs[3]) {
        tokens.push(sets.whitespace());
      } else if (rs[4]) {
        tokens.push(sets.notWords());
      } else if (rs[5]) {
        tokens.push(sets.notInts());
      } else if (rs[6]) {
        tokens.push(sets.notWhitespace());
      } else if (rs[7]) {
        tokens.push({
          type: types.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: rs[10].charCodeAt(0)
        });
      } else if (c = rs[12]) {
        tokens.push({
          type: types.CHAR,
          value: c.charCodeAt(0)
        });
      } else {
        return [tokens, regexp.lastIndex];
      }
    }

    exports$2.error(regexpStr, 'Unterminated character class');
  };
  /**
   * Shortcut to throw errors.
   *
   * @param {String} regexp
   * @param {String} msg
   */


  exports$2.error = (regexp, msg) => {
    throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
  };

  return exports$2;
}

var exports$3 = {},
    _dewExec$3 = false;
function dew$3() {
  if (_dewExec$3) return exports$3;
  _dewExec$3 = true;

  const types = dew();

  exports$3.wordBoundary = () => ({
    type: types.POSITION,
    value: 'b'
  });

  exports$3.nonWordBoundary = () => ({
    type: types.POSITION,
    value: 'B'
  });

  exports$3.begin = () => ({
    type: types.POSITION,
    value: '^'
  });

  exports$3.end = () => ({
    type: types.POSITION,
    value: '$'
  });

  return exports$3;
}

var exports$4 = {},
    _dewExec$4 = false;
function dew$4() {
  if (_dewExec$4) return exports$4;
  _dewExec$4 = true;

  const util = dew$2();

  const types = dew();

  const sets = dew$1();

  const positions = dew$3();

  exports$4 = regexpStr => {
    var i = 0,
        l,
        c,
        start = {
      type: types.ROOT,
      stack: []
    },
        // Keep track of last clause/group and stack.
    lastGroup = start,
        last = start.stack,
        groupStack = [];

    var repeatErr = i => {
      util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
    }; // Decode a few escaped characters.


    var str = util.strToChars(regexpStr);
    l = str.length; // Iterate through each character in string.

    while (i < l) {
      c = str[i++];

      switch (c) {
        // Handle escaped characters, inclues a few sets.
        case '\\':
          c = str[i++];

          switch (c) {
            case 'b':
              last.push(positions.wordBoundary());
              break;

            case 'B':
              last.push(positions.nonWordBoundary());
              break;

            case 'w':
              last.push(sets.words());
              break;

            case 'W':
              last.push(sets.notWords());
              break;

            case 'd':
              last.push(sets.ints());
              break;

            case 'D':
              last.push(sets.notInts());
              break;

            case 's':
              last.push(sets.whitespace());
              break;

            case 'S':
              last.push(sets.notWhitespace());
              break;

            default:
              // Check if c is integer.
              // In which case it's a reference.
              if (/\d/.test(c)) {
                last.push({
                  type: types.REFERENCE,
                  value: parseInt(c, 10)
                }); // Escaped character.
              } else {
                last.push({
                  type: types.CHAR,
                  value: c.charCodeAt(0)
                });
              }

          }

          break;
        // Positionals.

        case '^':
          last.push(positions.begin());
          break;

        case '$':
          last.push(positions.end());
          break;
        // Handle custom sets.

        case '[':
          // Check if this class is 'anti' i.e. [^abc].
          var not;

          if (str[i] === '^') {
            not = true;
            i++;
          } else {
            not = false;
          } // Get all the characters in class.


          var classTokens = util.tokenizeClass(str.slice(i), regexpStr); // Increase index by length of class.

          i += classTokens[1];
          last.push({
            type: types.SET,
            set: classTokens[0],
            not
          });
          break;
        // Class of any character except \n.

        case '.':
          last.push(sets.anyChar());
          break;
        // Push group onto stack.

        case '(':
          // Create group.
          var group = {
            type: types.GROUP,
            stack: [],
            remember: true
          };
          c = str[i]; // If if this is a special kind of group.

          if (c === '?') {
            c = str[i + 1];
            i += 2; // Match if followed by.

            if (c === '=') {
              group.followedBy = true; // Match if not followed by.
            } else if (c === '!') {
              group.notFollowedBy = true;
            } else if (c !== ':') {
              util.error(regexpStr, `Invalid group, character '${c}'` + ` after '?' at column ${i - 1}`);
            }

            group.remember = false;
          } // Insert subgroup into current group stack.


          last.push(group); // Remember the current group for when the group closes.

          groupStack.push(lastGroup); // Make this new group the current group.

          lastGroup = group;
          last = group.stack;
          break;
        // Pop group out of stack.

        case ')':
          if (groupStack.length === 0) {
            util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
          }

          lastGroup = groupStack.pop(); // Check if this group has a PIPE.
          // To get back the correct last stack.

          last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
          break;
        // Use pipe character to give more choices.

        case '|':
          // Create array where options are if this is the first PIPE
          // in this clause.
          if (!lastGroup.options) {
            lastGroup.options = [lastGroup.stack];
            delete lastGroup.stack;
          } // Create a new stack and add to options for rest of clause.


          var stack = [];
          lastGroup.options.push(stack);
          last = stack;
          break;
        // Repetition.
        // For every repetition, remove last element from last stack
        // then insert back a RANGE object.
        // This design is chosen because there could be more than
        // one repetition symbols in a regex i.e. `a?+{2,3}`.

        case '{':
          var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)),
              min,
              max;

          if (rs !== null) {
            if (last.length === 0) {
              repeatErr(i);
            }

            min = parseInt(rs[1], 10);
            max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
            i += rs[0].length;
            last.push({
              type: types.REPETITION,
              min,
              max,
              value: last.pop()
            });
          } else {
            last.push({
              type: types.CHAR,
              value: 123
            });
          }

          break;

        case '?':
          if (last.length === 0) {
            repeatErr(i);
          }

          last.push({
            type: types.REPETITION,
            min: 0,
            max: 1,
            value: last.pop()
          });
          break;

        case '+':
          if (last.length === 0) {
            repeatErr(i);
          }

          last.push({
            type: types.REPETITION,
            min: 1,
            max: Infinity,
            value: last.pop()
          });
          break;

        case '*':
          if (last.length === 0) {
            repeatErr(i);
          }

          last.push({
            type: types.REPETITION,
            min: 0,
            max: Infinity,
            value: last.pop()
          });
          break;
        // Default is a character that is not `\[](){}?+*^$`.

        default:
          last.push({
            type: types.CHAR,
            value: c.charCodeAt(0)
          });
      }
    } // Check if any groups have not been closed.


    if (groupStack.length !== 0) {
      util.error(regexpStr, 'Unterminated group');
    }

    return start;
  };

  exports$4.types = types;
  return exports$4;
}

var ret = dew$4();

var exports$5 = {},
    _dewExec$5 = false;

var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : global;

function dew$5() {
  if (_dewExec$5) return exports$5;
  _dewExec$5 = true;

  /* eslint indent: ["warn", 4] */
  // Private helper class
  class SubRange {
    constructor(low, high) {
      (this || _global).low = low;
      (this || _global).high = high;
      (this || _global).length = 1 + high - low;
    }

    overlaps(range) {
      return !((this || _global).high < range.low || (this || _global).low > range.high);
    }

    touches(range) {
      return !((this || _global).high + 1 < range.low || (this || _global).low - 1 > range.high);
    } // Returns inclusive combination of SubRanges as a SubRange.


    add(range) {
      return new SubRange(Math.min((this || _global).low, range.low), Math.max((this || _global).high, range.high));
    } // Returns subtraction of SubRanges as an array of SubRanges.
    // (There's a case where subtraction divides it in 2)


    subtract(range) {
      if (range.low <= (this || _global).low && range.high >= (this || _global).high) {
        return [];
      } else if (range.low > (this || _global).low && range.high < (this || _global).high) {
        return [new SubRange((this || _global).low, range.low - 1), new SubRange(range.high + 1, (this || _global).high)];
      } else if (range.low <= (this || _global).low) {
        return [new SubRange(range.high + 1, (this || _global).high)];
      } else {
        return [new SubRange((this || _global).low, range.low - 1)];
      }
    }

    toString() {
      return (this || _global).low == (this || _global).high ? (this || _global).low.toString() : (this || _global).low + '-' + (this || _global).high;
    }

  }

  class DRange {
    constructor(a, b) {
      (this || _global).ranges = [];
      (this || _global).length = 0;
      if (a != null) this.add(a, b);
    }

    _update_length() {
      (this || _global).length = (this || _global).ranges.reduce((previous, range) => {
        return previous + range.length;
      }, 0);
    }

    add(a, b) {
      const _add = subrange => {
        let i = 0;

        while (i < (this || _global).ranges.length && !subrange.touches((this || _global).ranges[i])) {
          i++;
        }

        const newRanges = (this || _global).ranges.slice(0, i);

        while (i < (this || _global).ranges.length && subrange.touches((this || _global).ranges[i])) {
          subrange = subrange.add((this || _global).ranges[i]);
          i++;
        }

        newRanges.push(subrange);
        (this || _global).ranges = newRanges.concat((this || _global).ranges.slice(i));

        this._update_length();
      };

      if (a instanceof DRange) {
        a.ranges.forEach(_add);
      } else {
        if (b == null) b = a;

        _add(new SubRange(a, b));
      }

      return this || _global;
    }

    subtract(a, b) {
      const _subtract = subrange => {
        let i = 0;

        while (i < (this || _global).ranges.length && !subrange.overlaps((this || _global).ranges[i])) {
          i++;
        }

        let newRanges = (this || _global).ranges.slice(0, i);

        while (i < (this || _global).ranges.length && subrange.overlaps((this || _global).ranges[i])) {
          newRanges = newRanges.concat((this || _global).ranges[i].subtract(subrange));
          i++;
        }

        (this || _global).ranges = newRanges.concat((this || _global).ranges.slice(i));

        this._update_length();
      };

      if (a instanceof DRange) {
        a.ranges.forEach(_subtract);
      } else {
        if (b == null) b = a;

        _subtract(new SubRange(a, b));
      }

      return this || _global;
    }

    intersect(a, b) {
      const newRanges = [];

      const _intersect = subrange => {
        let i = 0;

        while (i < (this || _global).ranges.length && !subrange.overlaps((this || _global).ranges[i])) {
          i++;
        }

        while (i < (this || _global).ranges.length && subrange.overlaps((this || _global).ranges[i])) {
          let low = Math.max((this || _global).ranges[i].low, subrange.low);
          let high = Math.min((this || _global).ranges[i].high, subrange.high);
          newRanges.push(new SubRange(low, high));
          i++;
        }
      };

      if (a instanceof DRange) {
        a.ranges.forEach(_intersect);
      } else {
        if (b == null) b = a;

        _intersect(new SubRange(a, b));
      }

      (this || _global).ranges = newRanges;

      this._update_length();

      return this || _global;
    }

    index(index) {
      let i = 0;

      while (i < (this || _global).ranges.length && (this || _global).ranges[i].length <= index) {
        index -= (this || _global).ranges[i].length;
        i++;
      }

      return (this || _global).ranges[i].low + index;
    }

    toString() {
      return '[ ' + (this || _global).ranges.join(', ') + ' ]';
    }

    clone() {
      return new DRange(this || _global);
    }

    numbers() {
      return (this || _global).ranges.reduce((result, subrange) => {
        let i = subrange.low;

        while (i <= subrange.high) {
          result.push(i);
          i++;
        }

        return result;
      }, []);
    }

    subranges() {
      return (this || _global).ranges.map(subrange => ({
        low: subrange.low,
        high: subrange.high,
        length: 1 + subrange.high - subrange.low
      }));
    }

  }

  exports$5 = DRange;
  return exports$5;
}

var DRange = dew$5();

const types  = ret.types;


class RandExp {
  /**
   * @constructor
   * @param {RegExp|string} regexp
   * @param {string} m
   */
  constructor(regexp, m) {
    this._setDefaults(regexp);
    if (regexp instanceof RegExp) {
      this.ignoreCase = regexp.ignoreCase;
      this.multiline = regexp.multiline;
      regexp = regexp.source;

    } else if (typeof regexp === 'string') {
      this.ignoreCase = m && m.includes('i');
      this.multiline = m && m.includes('m');
    } else {
      throw Error('Expected a regexp or string');
    }

    this.tokens = ret(regexp);
  }


  /**
   * Checks if some custom properties have been set for this regexp.
   *
   * @param {RandExp} randexp
   * @param {RegExp} regexp
   */
  _setDefaults({max, defaultRange, randInt}) {
    // When a repetitional token has its max set to Infinite,
    // randexp won't actually generate a random amount between min and Infinite
    // instead it will see Infinite as min + 100.
    this.max = max != null ? max :
      RandExp.prototype.max != null ? RandExp.prototype.max : 100;

    // This allows expanding to include additional characters
    // for instance: RandExp.defaultRange.add(0, 65535);
    this.defaultRange = defaultRange ?
      defaultRange : this.defaultRange.clone();

    if (randInt) {
      this.randInt = randInt;
    }
  }


  /**
   * Generates the random string.
   *
   * @return {string}
   */
  gen() {
    return this._gen(this.tokens, []);
  }


  /**
   * Generate random string modeled after given tokens.
   *
   * @param {Object} token
   * @param {Array.<string>} groups
   * @return {string}
   */
  _gen(token, groups) {
    let stack;
    let str;
    let n;
    let i;
    let l;
    let code;
    let expandedSet;

    switch (token.type) {
      case types.ROOT:
      case types.GROUP:
        // Ignore lookaheads for now.
        if (token.followedBy || token.notFollowedBy) { return ''; }

        // Insert placeholder until group string is generated.
        if (token.remember && token.groupNumber === undefined) {
          token.groupNumber = groups.push(null) - 1;
        }

        stack = token.options ?
          this._randSelect(token.options) : token.stack;

        str = '';
        for (i = 0, l = stack.length; i < l; i++) {
          str += this._gen(stack[i], groups);
        }

        if (token.remember) {
          groups[token.groupNumber] = str;
        }
        return str;

      case types.POSITION:
        // Do nothing for now.
        return '';

      case types.SET:
        expandedSet = this._expand(token);
        if (!expandedSet.length) { return ''; }
        return String.fromCharCode(this._randSelect(expandedSet));

      case types.REPETITION:
        // Randomly generate number between min and max.
        n = this.randInt(token.min,
          token.max === Infinity ? token.min + this.max : token.max);

        str = '';
        for (i = 0; i < n; i++) {
          str += this._gen(token.value, groups);
        }

        return str;

      case types.REFERENCE:
        return groups[token.value - 1] || '';

      case types.CHAR:
        code = this.ignoreCase && this._randBool() ?
          this._toOtherCase(token.value) : token.value;
        return String.fromCharCode(code);
    }
  }


  /**
   * If code is alphabetic, converts to other case.
   * If not alphabetic, returns back code.
   *
   * @param {number} code
   * @return {number}
   */
  _toOtherCase(code) {
    return code + (97 <= code && code <= 122 ? -32 :
      65 <= code && code <= 90  ?  32 : 0);
  }


  /**
   * Randomly returns a true or false value.
   *
   * @return {boolean}
   */
  _randBool() {
    return !this.randInt(0, 1);
  }


  /**
   * Randomly selects and returns a value from the array.
   *
   * @param {Array.<Object>} arr
   * @return {Object}
   */
  _randSelect(arr) {
    if (arr instanceof DRange) {
      return arr.index(this.randInt(0, arr.length - 1));
    }
    return arr[this.randInt(0, arr.length - 1)];
  }


  /**
   * Expands a token to a DiscontinuousRange of characters which has a
   * length and an index function (for random selecting).
   *
   * @param {Object} token
   * @return {DiscontinuousRange}
   */
  _expand(token) {
    if (token.type === ret.types.CHAR) {
      return new DRange(token.value);
    } else if (token.type === ret.types.RANGE) {
      return new DRange(token.from, token.to);
    } else {
      let drange = new DRange();
      for (let i = 0; i < token.set.length; i++) {
        let subrange = this._expand(token.set[i]);
        drange.add(subrange);
        if (this.ignoreCase) {
          for (let j = 0; j < subrange.length; j++) {
            let code = subrange.index(j);
            let otherCaseCode = this._toOtherCase(code);
            if (code !== otherCaseCode) {
              drange.add(otherCaseCode);
            }
          }
        }
      }
      if (token.not) {
        return this.defaultRange.clone().subtract(drange);
      } else {
        return this.defaultRange.clone().intersect(drange);
      }
    }
  }


  /**
   * Randomly generates and returns a number between a and b (inclusive).
   *
   * @param {number} a
   * @param {number} b
   * @return {number}
   */
  randInt(a, b) {
    return a + Math.floor(Math.random() * (1 + b - a));
  }


  /**
   * Default range of characters to generate from.
   */
  get defaultRange() {
    return this._range = this._range || new DRange(32, 126);
  }

  set defaultRange(range) {
    this._range = range;
  }


  /**
   *
   * Enables use of randexp with a shorter call.
   *
   * @param {RegExp|string| regexp}
   * @param {string} m
   * @return {string}
   */
  static randexp(regexp, m) {
    let randexp;
    if(typeof regexp === 'string') {
      regexp = new RegExp(regexp, m);
    }

    if (regexp._randexp === undefined) {
      randexp = new RandExp(regexp, m);
      regexp._randexp = randexp;
    } else {
      randexp = regexp._randexp;
      randexp._setDefaults(regexp);
    }
    return randexp.gen();
  }


  /**
   * Enables sugary /regexp/.gen syntax.
   */
  static sugar() {
    /* eshint freeze:false */
    RegExp.prototype.gen = function() {
      return RandExp.randexp(this);
    };
  }
}

export default RandExp;
