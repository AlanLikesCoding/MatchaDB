/**
 * This is the bae interface for all automatic values.
 */
interface Base {
    type: string;
}

/**
 * This is the Increment interface for the auto value.  It will increment the value based on the paraemeters provided.
 */
interface Increment extends Base {
    amount: number;
    start: number;
}

/**
 * This is the RandomNumber interface for the auto value. The random number will be generated between the given min and max.
 */
interface RandomNumber extends Base {
    min: number;
    max: number;
}

/**
 * This is the RandomString interface for the auto value. This interface is the format the framework will use to generate random strings.
 */
interface RandomString extends Base {
    length: number;
}

/**
 * @exports {Increment, RandomNumber, RandomString} This is the export of the Increment, RandomNumber, and RandomString interfaces for automatic value generation in the schema.
 */
export { Increment, RandomNumber, RandomString };