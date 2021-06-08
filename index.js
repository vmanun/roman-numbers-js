const ARABIC_TO_ROMAN_MAPPING = {
  1: "I",
  5: "V",
  10: "X",
  50: "L",
  100: "C",
  500: "D",
  1000: "M",
};

const ROMAN_TO_ARABIC_MAPPING = Object.entries(ARABIC_TO_ROMAN_MAPPING).reduce(
  (accum, [arabic, roman]) => {
    accum[roman] = parseInt(arabic);
    return accum;
  },
  {}
);

const VALIDATION_REG_EXP = (() => {
  const GROUPED_MAPPING = (() => {
    const resultingMapping = [];

    Object.entries(ARABIC_TO_ROMAN_MAPPING).forEach(([arabic, roman]) =>
      arabic.includes("1")
        ? resultingMapping.push([roman])
        : resultingMapping[arabic.length - 1].push(roman)
    );

    return resultingMapping;
  })();

  return new RegExp(
    GROUPED_MAPPING.reduce(
      (accum, [oneLike, fiveLike], index) =>
        (GROUPED_MAPPING.length !== index + 1
          ? `(${oneLike}${
              GROUPED_MAPPING[index + 1][0]
            }|${oneLike}${fiveLike}|${fiveLike}?${oneLike}{0,3})`
          : `^${oneLike}{0,3}`
        ).concat(accum),
      "$"
    )
  );
})();

/**
 * @param {number} num
 * @throws error if the given number is outside the specified max/min limits
 */
function throwIfGivenNumberExceedsMaxOrMinParsableValue(num) {
  const maxParsableNumber = Roman.getMaxParsableNumber();
  if (num > maxParsableNumber) {
    throw new Error(
      `The given number \`${num}\` exceeds the max parsable number \`${maxParsableNumber}\``
    );
  } else if (num < 1) {
    throw new Error(
      `The given number \`${num}\` goes below the min parsable number \`1\``
    );
  }
}

/**
 * @param {number|string|Roman} someValue
 * @returns {number} numeric value of `someValue`
 */
function getNumericValue(someValue = null) {
  if (someValue === null) {
    throw new Error(`Given value could not be parsed: \`${someValue}\``);
  }

  if (typeof someValue === "number") {
    throwIfGivenNumberExceedsMaxOrMinParsableValue(someValue);
    return someValue;
  } else if (typeof someValue === "string") {
    try {
      if (Roman.isValidRoman(someValue)) return Roman.toNumber(someValue);
      else {
        const someIntValue = parseInt(someValue);
        throwIfGivenNumberExceedsMaxOrMinParsableValue(someIntValue);
        return someIntValue;
      }
    } catch (e) {
      throw new Error(
        `An error occurred when trying to parse numeric value from given string: ${e.message}`
      );
    }
  } else if (Object.getPrototypeOf(someValue) === Roman.prototype)
    return someValue.number;
}

/**
 * Object representing the value of a roman nomber
 * @param {number} num number to be parsed into a roman number. If left empty, it's value becomes `1`
 */
class Roman {
  constructor(num = 1) {
    /**
     * @private
     */
    this.__romanNumber = Roman.parseRoman(num);

    /**
     * @private
     */
    this.__number = num;
  }

  /**
   * Numeric value of the stored roman number. Changing this will automatically set the `romanNumber` property to the new given value
   * @param {number} number
   */
  set number(number) {
    this.__romanNumber = Roman.parseRoman(number);
    this.__number = number;
  }

  /**
   * Roman number equivalent of the given value. Changing this will automatically set the `number` property to the new given value
   * @param {string} romanNumber
   */
  set romanNumber(romanNumber) {
    this.__number = Roman.toNumber(romanNumber);
    this.__romanNumber = romanNumber;
  }

  get number() {
    return this.__number;
  }

  get romanNumber() {
    return this.__romanNumber;
  }

  /**
   * Returns the max parsable number
   * @returns {number} Max number parsable, given the highest key from the arabic to roman mapping
   * @see ARABIC_TO_ROMAN_MAPPING
   */
  static getMaxParsableNumber() {
    const numberMappingsKeys = Object.keys(ARABIC_TO_ROMAN_MAPPING);
    const maxKeyNumber = numberMappingsKeys[numberMappingsKeys.length - 1];

    if (maxKeyNumber[0] === "1") {
      return maxKeyNumber.lenght === 1 ? 4 : parseInt(maxKeyNumber) * 4 - 1;
    } else {
      return maxKeyNumber.lenght === 1
        ? 9
        : parseInt(maxKeyNumber) * 2 - (parseInt(maxKeyNumber) * 2) / 10 - 1;
    }
  }

  /**
   * Function that returns a new roman number string from a given number
   * @param {number|string} num Number to be converted into roman.
   * @returns {string} String with the roman represention of the given number
   * @throws error whenever the given `num` exceeds the max parsable number
   * @see Roman.getMaxParsableNumber
   */
  static parseRoman(num = 1) {
    num = getNumericValue(num);
    throwIfGivenNumberExceedsMaxOrMinParsableValue(num);

    const numCharArray = new Number(num).toString().split("");

    return numCharArray
      .reverse()
      .reduce((accum, digitChar, index) => {
        const digit = parseInt(digitChar);
        const unit = parseInt(
          "1".concat(
            [...Array(index).keys()].reduce((accum) => accum + "0", "")
          )
        );

        if (digit < 4)
          return accum.concat(
            [...Array(digit).keys()].reduce(
              (accum) => accum.concat(ARABIC_TO_ROMAN_MAPPING[1 * unit]),
              ""
            )
          );
        else if (digit === 4)
          return accum.concat(
            ARABIC_TO_ROMAN_MAPPING[5 * unit].concat(
              ARABIC_TO_ROMAN_MAPPING[1 * unit]
            )
          );
        else if (digit > 4 && digit < 9)
          return accum.concat(
            [...Array(digit - 5).keys()].reduce(
              (accum) => ARABIC_TO_ROMAN_MAPPING[1 * unit].concat(accum),
              ARABIC_TO_ROMAN_MAPPING[5 * unit]
            )
          );
        else
          return accum.concat(
            ARABIC_TO_ROMAN_MAPPING[1 * 10 * unit].concat(
              ARABIC_TO_ROMAN_MAPPING[1 * unit]
            )
          );
      }, "")
      .split("")
      .reverse()
      .join("");
  }

  /**
   * Validate a roman number
   * @param {string} romanNumber roman number to validate
   * @returns {boolean} Whether`romanNumber` is a valid roman number string or not
   */
  static isValidRoman(romanNumber) {
    return VALIDATION_REG_EXP.test(romanNumber.toUpperCase());
  }

  /**
   * Get the numeric value from a given `romanNumber`
   * @param {string} romanNumber roman number to convert into an `number`
   * @returns {number} numeric value of `romanNumber`
   * @throws error whenever the given `romanNumber` is not a valid roman number string
   * @see Roman.isValidRoman
   */
  static toNumber(romanNumber) {
    if (!Roman.isValidRoman(romanNumber)) {
      throw new Error(
        `The given string is not a valid roman number: \`${romanNumber}\``
      );
    }

    return romanNumber
      .toUpperCase()
      .split("")
      .reduce(
        (accum, romanChar, index) =>
          accum +
          (index > 0 &&
          ROMAN_TO_ARABIC_MAPPING[romanNumber[index - 1]] <
            ROMAN_TO_ARABIC_MAPPING[romanChar]
            ? ROMAN_TO_ARABIC_MAPPING[romanChar] -
              ROMAN_TO_ARABIC_MAPPING[romanNumber[index - 1]] * 2
            : ROMAN_TO_ARABIC_MAPPING[romanChar]),
        0
      );
  }

  /**
   * Add two of the given numbers together and create a new `Roman` instance with it
   * @param {number|string|Roman} left left value of the addition
   * @param {number|string|Roman} right right value of the addition
   * @returns {Roman} Result of the sum of `left` and `right` as a new `Roman` instance
   */
  static add(left, right) {
    return new Roman(getNumericValue(left) + getNumericValue(right));
  }

  /**
   * Substract two of the given numbers together and create a new `Roman` instance with it
   * @param {number|string|Roman} left left value of the substraction
   * @param {number|string|Roman} right right value of the substraction
   * @returns {Roman} Result of the substraction of `left` and `right` as a new `Roman` instance
   */
  static substract(left, right) {
    return new Roman(getNumericValue(left) - getNumericValue(right));
  }

  /**
   * Add a number to the current value stored in the `Roman` instance. Result is saved inside said instance.
   * @param {number|string|Roman} right right value of the addition
   */
  plus(right) {
    this.number += getNumericValue(right);
  }

  /**
   * Substract a number to the current value stored in the `Roman` instance. Result is saved inside said instance.
   * @param {number|string|Roman} right right value of the substraction
   */
  minus(right) {
    this.number -= getNumericValue(right);
  }
}

module.exports = Roman;
