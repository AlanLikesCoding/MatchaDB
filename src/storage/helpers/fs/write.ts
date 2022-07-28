import * as fs from 'fs';

/**
 * Writes data to a file.
 * @param path {string} The path to the file.
 * @param data {string} The data to be written.
 */
const write = (path:string, data:string):void => {
    fs.appendFileSync(path, data);
};

/**
 * @exports {write} This is the export of the write function.
 */
export default write;
export { write };
