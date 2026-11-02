import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {validate} from '../schema.js';
const data=JSON.parse(await readFile('data/newsletter.json','utf8'));
const errors=validate(data);if(errors.length)throw new Error(errors.join('\n'));
const path=`data/archive/${data.issueStart}.json`;
await mkdir('data/archive',{recursive:true});
// Never replace a published snapshot. Corrections require explicit editorial review.
await writeFile(path,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const manifest=JSON.parse(await readFile('data/issues.json','utf8'));
manifest.issues.unshift({label:`${data.issueStart} – ${data.issueEnd}`,path:`./${path}`});
await writeFile('data/issues.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Archived ${path}. Commit this snapshot and data/issues.json before replacing the latest issue.`);
