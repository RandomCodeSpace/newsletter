import './validate.js';
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist/data',{recursive:true});
for(const file of ['index.html','styles.css','app.js','schema.js','.nojekyll','data/newsletter.json'])await copyFile(file,`dist/${file}`);
console.log('Static site built in dist/. No dependencies required.');
