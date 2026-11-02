export const sections = {news:'AI news',rumors:'Rumors',predictions:'Predictions'};
export function validate(data) {
 const errors=[]; const str=(v)=>typeof v==='string'&&v.trim().length>0;
 const date=(v)=>str(v)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 for(const key of ['title','issue','introduction']) if(!str(data?.[key])) errors.push(`${key} must be a nonempty string`);
 if(!date(data?.publishedAt)) errors.push('publishedAt must be a valid YYYY-MM-DD');
 if(!Array.isArray(data?.items)) return [...errors,'items must be an array'];
 const ids=new Set();
 data.items.forEach((item,index)=>{const prefix=`items[${index}]`;if(!item||typeof item!=='object'){errors.push(`${prefix} must be an object`);return;}
 for(const key of ['id','title','summary','whyItMatters','confidenceReason','historicalContext']) if(!str(item[key])) errors.push(`${prefix}.${key} must be a nonempty string`);
 if(ids.has(item.id)) errors.push(`${prefix}.id must be unique`);ids.add(item.id);
 if(!Object.hasOwn(sections,item.section)) errors.push(`${prefix}.section is invalid`);
 if(!['high','medium','low'].includes(item.confidence)) errors.push(`${prefix}.confidence is invalid`);
 if(item.section==='predictions') for(const key of ['horizon','resolutionCriteria','counterarguments']) if(!str(item[key])) errors.push(`${prefix}.${key} is required for predictions`);
 if(!Array.isArray(item.sources)||!item.sources.length) errors.push(`${prefix}.sources must not be empty`);
 else item.sources.forEach((s,i)=>{if(!s||typeof s!=='object'){errors.push(`${prefix}.sources[${i}] must be an object`);return;}for(const key of ['title','publisher','authenticityReason'])if(!str(s[key]))errors.push(`${prefix}.sources[${i}].${key} is required`);try{if(new URL(s.url).protocol!=='https:')throw Error();}catch{errors.push(`${prefix}.sources[${i}].url must use HTTPS`);}if(!date(s.publishedAt)) errors.push(`${prefix}.sources[${i}].publishedAt is invalid`);if(!['primary','reporting','analysis'].includes(s.type))errors.push(`${prefix}.sources[${i}].type is invalid`);});
 });return errors;
}
export function filterItems(items,section,query){const needle=query.trim().toLocaleLowerCase();return items.filter(i=>(section==='all'||i.section===section)&&[i.title,i.summary,i.historicalContext,...i.sources.map(s=>s.publisher)].join(' ').toLocaleLowerCase().includes(needle));}
