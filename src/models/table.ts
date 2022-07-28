import * as crypto from 'crypto';

import { BaseType } from '../interfaces/type';
import { Increment, RandomNumber, RandomString } from '../interfaces/auto';
import { AST } from '../storage/helpers/parser/ast';

import { write } from '../storage/helpers/fs/write';
import { read } from '../storage/helpers/fs/read';
import { replace } from '../storage/helpers/fs/replace';

const ALLOWED_TYPES = ['string', 'number', 'boolean'];

class Table {
    columns: BaseType[] = [];
    file: string;
    /**
     * Constructor for the table class.
     * @method
     * @param {BaseType[]} columns An array of objects containing the column name and type as well as other configurations.
     * @param {string} file The directory of the file that we will use to store the data.
     */
    constructor(columns: BaseType[], file: string) {
        if(!file) throw new Error('Fatal Error: The path to the datafile is not provided.');
        if(!columns) throw new Error('Fatal Error: The table columns are not provided.');
        this.file = file;
        this.init(columns);
    }
    /**
     * Initialize the columns for the table class.
     * @method
     * @param {BaseType} columns An array of objects containing the column name and type as well as other configurations, this method is used to parse the configuration/schema and look for problems.
     */
    private init(columns: BaseType[]): void {
        for(let i = 0; i < columns.length; i++) {
            /**
             * Check if the type provided by the schema is correct.
             * @inner
             */
            if(!ALLOWED_TYPES.includes(columns[i].type)) {
                throw new Error(`Typeror: The column type ${columns[i].type} is not allowed.`);
            }
            /**
             * We will iterate through each of the columns to check for any type errors and stuff.
             * @inner
             */
            let column: BaseType = {
                name: columns[i].name,
                type: columns[i].type,
                unique: false,
                required: false,
            }
            /**
             * Auto-generating some parts of the schema that may have not been provided.
             * @inner
             */
            if(columns[i].unique)   column.unique = columns[i].unique;
            if(columns[i].required) column.required = columns[i].required;
            if(columns[i].default) { 
                /**
                 * Checking if the default value matches the value provided by the schema/configuration.
                 * @inner
                 */
                if (typeof columns[i].default != columns[i].type)   throw Error(`Typerror: The default value for column '${column.name}' is not of type ${column.type}. Please check your schema for any mistakes.`);
                column.default = columns[i].default;
            }
            if(columns[i].auto) {
                /**
                 * Due to the fact that some of the auto-generation settings can only be used with certain types, we will do a ty;e check here.
                 * @inner
                 */
                let auto = columns[i].auto as Increment | RandomNumber | RandomString;
                switch(auto.type) {
                    case 'increment':
                    case 'random.number':
                        if(column.type != 'number') throw Error('Typerror: The auto increment/random number defaults can only be used on number columns.');
                        break;
                    case 'random.string':
                        if(column.type != 'string') throw Error('Typerror: The auto random string default can only be used on string columns.');
                        break;
                    default:
                        throw Error('Typerror: The auto default type is not valid.');
                }
                column.auto = columns[i].auto;
            }
            this.columns.push(column);
        }
        /**
         * Initializing the database.
         * @inner
         */
        write(this.file, '');
    }
    /**
     * This creates a new row instance, which we can use to insert a value.
     * @method
     * @returns {string}
     */
    instance() {
        let node: any = {};
        /**
         * This is the method for saving the node.
         * @inner
         * @method
         */
        node.save = () => {
            this.insert(node);
        }
        return node;
    }
    /**
     * This is the function to filter and extract data from the database.
     * @method
     * @param {object} filters These are the filters you will use to filter the data.
     * @returns {object[]}
     */
    get(filters: object = {}) {
        /**
         * We check if the filters are empty, if they are, we will return all the data. Otherwise we will filter the data using the private filter method.
         * @inner
         */
        if(!Object.keys(filters).length) return this.all();
        return this.filter(filters);
    }
    /**
     * This is the method for inserting a new row into the database.
     * @method
     * @param {object} data This is the data we use to insert into the database.
     */
    insert(data: object) {
        let insert = this.validate(data);
        write(this.file, `${insert}\n`);
    }
    /**
     * This is the method for editing a row in the database.
     * @method
     * @param {number} pos The position of the column in the datafile(this location is automatically detected).
     * @param {object} data The new data we want to insert into the database.
     */
    edit(pos: number, data: object) {
        let insert = this.validate(data);
        let value: string | string[] = read(this.file);
        value = value.split('\n');
        value[pos] = insert;
        value = value.join('\n');
        replace(this.file, value);
    }
    /**
     * This is the method for deleting a row in the database.
     * @method
     * @param {number} pos The position of the column in the datafile(this location is automatically detected).
     */
    delete(pos: number) {
        let value: string | string[] = read(this.file);
        value = value.split('\n');
        value.splice(pos, 1);
        value = value.join('\n');
        replace(this.file, value);
    }
    /**
     * This is the method used for catching errors and turning JavaScript object data into a string for insertion into the datafile.
     * @method
     * @param {object} data The data we want to validate.
     * @returns {string} This method returns a stringified version of the data that we need to insert.
     */
    private validate(data: object): string {
        let keys = Object.keys(data);
        let insert: string= '';
        for (let i = 0; i < this.columns.length; i++) {
            let column = this.columns[i];
            /**
             * We will check if the column has a value, if so, we will check if the value matches the type provided by the config/schema.
             * @inner
             */
            if(keys.includes(column.name) && typeof (data as any)[column.name] != column.type) {
                throw new Error(`Typerror: Invalid type for column: ${column.name}`);
            }
            /**
             * If column value is provided, we will use the column value, otherwise we will use the automatic value.
             * @inner
             */
            if(column.auto) {
                if(keys.includes(column.name)) {
                    insert = this.generate(insert, i, this.columns.length, (data as any)[column.name]);
                    continue;
                } 
                switch(column.auto.type) {
                    case 'increment':
                        {
                            let increment = column.auto as Increment;
                            let number = (read(this.file).split('\n').length - 1) * increment.amount + increment.start;
                            insert = this.generate(insert, i, this.columns.length, number.toString());
                        }
                        break;
                    case 'random.num':
                        {
                            let random = column.auto as RandomNumber;
                            let number = Math.floor(Math.random() * (Math.floor(random.max) - Math.ceil(random.min) + 1)) + Math.ceil(random.min);
                            insert = this.generate(insert, i, this.columns.length, number.toString());
                        }
                        break;
                    case 'random.string':
                        {
                            let random = column.auto as RandomString;
                            let string = crypto.randomBytes(random.length).toString('hex');
                            insert = this.generate(insert, i, this.columns.length, string);
                        }
                        break;
                    default:
                        throw new Error(`Typerror: Unknown auto type: ${column.auto.type}`);
                }
                continue;
            }
            /**
             * If column value is not required, we will check if a value has been provided. If not, we will add a null value(asterix).
             * If a default value is provided, we will use that value.
             */
            if(!column.required) {
                if(!keys.includes(column.name) && !column.default) {
                    insert = this.generate(insert, i, this.columns.length, '*');
                    continue;
                }
                if(column.default) {
                    insert = this.generate(insert, i, this.columns.length, column.default);
                }
                continue;
            }
            /**
             * If column value isn't provided, throw an error. If the configuration specifies the column as unique, and it isn't unique it will throw an error.
             * @inner
             */
            if(!keys.includes(column.name) && !column.default) throw new Error(`Schema Error: Column ${column.name} is a required field.`);
            if(column.unique) {
                let row = this.filter({[column.name]: (data as any)[column.name]});
                if(row.length) throw new Error(`Schema Error: Column ${column.name} is a unique field.`);
            }
            if(keys.includes(column.name)) {
                insert = this.generate(insert, i, this.columns.length, (data as any)[column.name]);
                continue;
            }
            insert = this.generate(insert, i, this.columns.length, column.default);
        }
        return insert;
    }
    /**
     * This is the method used for generating column data. It is used in the validate method, and it will generate it in a format that the computer can read.
     * @method
     * @param {string} col The already computed columns.
     * @param {number} pos The position how many columns have already been computed.
     * @param {number} total The total number of columns that need to be computed.
     * @param {string} value The value that we want to insert into this column.
     * @returns {string} The computed output.
     */
    private generate(col: string, pos: number, total: number, value: string): string {
        if(pos == 0) return `${value}`;
        return `${col}!${value}`;
    }
    /**
     * This is the function for selecting all the rows in a database.
     * @returns {object} This method returns a list of all the rows in the database.
     */
    private all() {
        let value = read(this.file);
        return new AST(value, this.columns, this).generate();
    }
    /**
     * This function performs a linear search on the database to filter results.
     * @param {object} filters The filters we want to use to filter the results.
     * @returns {object} This method returns a list of all the filtered rows in the database.
     */
    private filter(filters: object) {
        let value = read(this.file);
        let ast = new AST(value, this.columns, this).generate();
        for(let i = 0; i < ast.length; i++) {
            let row = ast[i];
            let keys = Object.keys(filters);
            for(let j = 0; j < keys.length; j++) {
                let key = keys[j]; 
                if((row as any)[key] != (filters as any)[key]) {
                    ast.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return ast;
    }

}

/**
 * @exports {Table} This is the export of the Table class.
 */
export default Table;
export { Table };