#!/usr/bin/env node
import * as pkg from '../../package.json';

for(let i = 2; i < process.argv.length; i++) {
    switch(process.argv[i]) {
        case '-h':
        case 'help':
            console.log(`Matcha CLI Commands:
            -h, help:    Show this help message.
            -v, version: Show the version of the program.
            -t, test:    Run the test suite.`);
            break;
        case '-v':
        case 'version':
            console.log(`Version: ${pkg.version}`);
            break;
        case '-t':
        case 'test':
            console.log('Tests will soon be implemented in the next version.');
            break;
        default:
            console.log(`Unknown argument: ${process.argv[i]}`);
            break;
    }
}