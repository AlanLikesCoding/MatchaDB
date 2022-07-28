"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.increment = void 0;
/**
 * This is the increment function for generating automatic values. Its is easier than handwriting an object.
 * @param amount {number} The amount to increment by.
 * @param start {number} The starting value.
 */
const increment = (start, amount) => {
    return {
        type: 'increment',
        start,
        amount
    };
};
exports.increment = increment;
const random = {
    /**
     * This is the random number function for generating automatic values.
     * @param min {number} The minimum value.
     * @param max {number} The maximum value.
     */
    number(min, max) {
        return {
            type: 'random.number',
            min,
            max
        };
    },
    /**
     * This is the random string function for generating automatic values.
     * @param length {number} The length of the string.
     * @returns {RandomString} The random string object.
     */
    string(length) {
        return {
            type: 'random.string',
            length,
        };
    },
};
exports.random = random;
