const Roman = require("..");

const roman = new Roman(1234);

console.log(!roman.minus(1000) && roman);
