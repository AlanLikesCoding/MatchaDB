import { BaseType } from '../../../interfaces/type';
import { Table } from '../../../models/table';

class AST {
    value: string;
    cols: BaseType[];
    table: Table;
    /**
     * The AST class generates an AST with instance of each row of the database.
     * @method
     * @param value {string} The value to be parsed/computed.
     * @param cols {BaseType[]} The columns of the table.
     * @param table {Table} A pointer to the table.
     */
    constructor(value:string, cols: BaseType[], table: Table) {
        this.table = table;
        this.cols = cols;
        this.value = value;
    }
    /**
     * The generate method will compute and parse the given datafile and return the required data.
     * @method
     * @returns {any[]} An array of objects with the values of the columns.
     */
    generate(): string[] {
        if(!this.value) return [''];
        let ast: any[] = [];
        for(let i = 0; i < this.value.split('\n').length; i++) {
            let node: any = {};
            let row: string = this.value.split('\n')[i];
            let cols: string[] = row.split('!');
            if(!row.length) continue;
            if(cols.length != this.cols.length) throw new Error(`Fatal Error: Columns mismatch in table ${this.table.file}`);
            for(let i = 0; i < this.cols.length; i++) {
                node[this.cols[i].name] = this.convert(cols[i], this.cols[i].type);
            }
            node.save = () => {
                this.table.edit(i, node);
            }
            node.delete = () => {
                this.table.delete(i);
            }
            ast.push(node);
        }
        return ast;
    }
    /**
     * The convert method will convert the given value to the given type.
     * @param str {string} The string to be converted.
     * @param type {string} The type of the column.
     * @returns {any} The converted value.
     */
    convert(str: string, type: 'number' | 'string' | 'boolean') {
        switch(type) {
            case 'number':
                return parseInt(str);
            case 'string':
                return str;
            case 'boolean':
                return str == 'true';
            default:
                throw Error(`Typerror: Invalid type ${type} found when extracting from database, please check your schema for type errors.`)
        }
    }
}

/**
 * @exports {AST} This is the export of the AST class.
 */
export { AST };
export default AST;