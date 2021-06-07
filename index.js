const ARABIC_TO_ROMAN_MAPPING = {
  1: "I",
  5: "V",
  10: "X",
  50: "L",
  100: "C",
  500: "D",
  1000: "M",
};

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
 * Object representing the value of a roman nomber
 * @param {number} num number to be parsed into a roman number. If left empty, it's value becomes `1`
 */
class Roman {
  constructor(num = 1) {
    this.number = num;
    this.romanNumber = Roman.parseRoman(num);
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
   * @param {number} num Number to be converted into roman.
   * @returns {string} String with the roman represention of the given number
   * @throws error whenever the given `num` exceeds the max parsable number
   * @see Roman.getMaxParsableNumber
   */
  static parseRoman(num = 1) {
    const maxParsableNumber = Roman.getMaxParsableNumber();
    if (num > maxParsableNumber) {
      throw new Error(
        `The given number \`${num}\` exceeds the max parsable number \`${maxParsableNumber}\``
      );
    }

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
  }

  static add(a, b) {}

  static substract(a, b) {}

  plus(b) {}

  minus(b) {}
}

module.exports = Roman;
