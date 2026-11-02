import './validate.js';
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','app.js','schema.js','.nojekyll'])await copyFile(file,`dist/${file}`);
await cp('data','dist/data',{recursive:true});
console.log('Static site built in dist/. No dependencies required.');
