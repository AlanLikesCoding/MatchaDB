import * as fs from 'fs';

/**
 * Reads a file and returns its contents.
 * @param path {string} The path to the file.
 * @returns {string} The contents of the file.
 */
const read = (path:string):string => {
    return fs.readFileSync(path, 'utf8');
};

/**
 * @exports {read} This is the export of the read function.
 */
export default read;
export { read };