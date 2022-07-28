import * as fs from 'fs';

/**
 * Replaces a file's contents.
 * @param path {string} The path to the file.
 * @param data {string} The data to be written.
 */
const replace = (path:string, data:string):void => {
    fs.writeFileSync(path, data);
};

/**
 * @exports {replace} This is the export of the replace function.
 */
export default replace;
export { replace };