class ArrayUtilities {
  static addZeros(array) {
    return array.map((value) => value * 10);
  }

  static moreThanFifty(array) {
    return array.filter((value) => value > 50);
  }

  static removeFirst(array) {
    return array.filter((value, idx) => idx !== 0);
  }

  static sumAll(array) {
    return array.reduce((sumValue, value) => sumValue + value);
  }

  static divide(sumAll) {
    return [...String(sumAll)];
  }
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const addZeros = ArrayUtilities.addZeros(numbers);
console.log(addZeros);

const moreThanFifty = ArrayUtilities.moreThanFifty(addZeros);
console.log(moreThanFifty);

const noFirst = ArrayUtilities.removeFirst(moreThanFifty);
console.log(noFirst);

const sumAll = ArrayUtilities.sumAll(noFirst);
console.log(sumAll);

const divided = ArrayUtilities.divide(sumAll);
console.log(divided);
