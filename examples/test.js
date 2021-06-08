const Roman = require("..");

console.clear();
console.log("\n");

// Static methods
console.log("--- STATIC METHODS ---");
console.log(`Roman.getMaxParsableNumber : ${Roman.getMaxParsableNumber()}`);
console.log(`Roman.isValidRoman         : ${Roman.isValidRoman("III")}`);
console.log(`Roman.parseRoman           : ${Roman.parseRoman(123)}`);
console.log(`Roman.toNumber             : ${Roman.toNumber("XIII")}`);
console.log("Roman.add                  : ", Roman.add(10, 20));
console.log("Roman.substract            : ", Roman.substract(30, 5));

console.log("\n");

// Instance methods

const roman = new Roman(30);

console.log("--- INSTANCE METHODS/PROPERTIES ---");
console.log("Roman.prototype.number          : ", roman.number);
console.log("Roman.prototype.romanNumber     : ", roman.romanNumber);
roman.plus(5);
console.log("Roman.prototype.plus(5) result  : ", roman);
roman.minus(5);
console.log("Roman.prototype.minus(5) result : ", roman);
