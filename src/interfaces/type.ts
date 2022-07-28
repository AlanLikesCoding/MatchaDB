import {Increment, RandomNumber, RandomString } from './auto';

/**
 * This is the BaseType for the column schema. The database scheam will be built on top of it.
 */
interface BaseType {
    name: string;
    type: 'string' | 'number' | 'boolean';
    unique?: boolean;
    required?: boolean;
    default?: any;
    auto?: Increment | RandomNumber | RandomString;
}

/**
 * @exports {BaseType} This is the export of the BaseType interface for the column schema.
 */
export { BaseType };
export default BaseType;