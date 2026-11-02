import {readFile} from 'node:fs/promises';
import {validate} from '../schema.js';
const errors=validate(JSON.parse(await readFile(new URL('../data/newsletter.json',import.meta.url),'utf8')));
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('Newsletter content is valid.');
