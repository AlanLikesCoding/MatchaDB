import { Increment, RandomNumber, RandomString } from '../interfaces/auto';

/**
 * This is the increment function for generating automatic values. Its is easier than handwriting an object.
 * @param amount {number} The amount to increment by.
 * @param start {number} The starting value.
 */
const increment = (start: number, amount: number): Increment =>{
    return {
        type: 'increment',
        start,
        amount
    };
}

const random = {
    /**
     * This is the random number function for generating automatic values.
     * @param min {number} The minimum value.
     * @param max {number} The maximum value.
     */
    number(min: number, max: number): RandomNumber {
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
    string(length: number): RandomString {
        return {
            type: 'random.string',
            length,        
        };
    },
};

/**
 * @exports {increment, random} This is the export of the increment and random functions for automatic value generation in the schema.
 */
export {increment, random};