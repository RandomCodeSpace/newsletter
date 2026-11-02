export const sections = {news:'AI news',rumors:'Rumors',predictions:'Predictions'};
export function validate(data) {
 const errors=[]; const str=(v)=>typeof v==='string'&&v.trim().length>0;
 const date=(v)=>str(v)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 for(const key of ['title','issue','introduction']) if(!str(data?.[key])) errors.push(`${key} must be a nonempty string`);
 for(const key of ['issueStart','issueEnd','forecastStart','forecastEnd'])if(!date(data?.[key]))errors.push(`${key} must be a valid date`);
 if(data?.issueStart>data?.issueEnd||data?.forecastStart>data?.forecastEnd||data?.forecastStart<=data?.issueEnd)errors.push('Weekly windows must be ordered and non-overlapping');
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
 });
 if(data.charts!==undefined){
 if(!Array.isArray(data.charts))errors.push('charts must be an array');
 else data.charts.forEach((chart,index)=>{const prefix=`charts[${index}]`;if(!chart||!['timeline','bar'].includes(chart.type)){errors.push(`${prefix}.type is invalid`);return;}
 const safeUrl=url=>{try{return new URL(url).protocol==='https:';}catch{return false;}};
 for(const key of ['id','title','description'])if(!str(chart[key]))errors.push(`${prefix}.${key} is required`);
 if(!Array.isArray(chart.points)||!chart.points.length){errors.push(`${prefix}.points are required`);return;}
 if(chart.type==='bar'){if(!safeUrl(chart.sourceUrl))errors.push(`${prefix}.sourceUrl must use HTTPS`);if(!date(chart.publishedAt))errors.push(`${prefix}.publishedAt is invalid`);for(const key of ['publisher','selectionCriteria','caveat'])if(!str(chart[key]))errors.push(`${prefix}.${key} is required`);if(!Array.isArray(chart.domain)||chart.domain.length!==2||chart.domain[0]!==0||!Number.isFinite(chart.domain[1])||chart.domain[1]<=0)errors.push(`${prefix}.domain must start at zero and end at a positive number`);if(!str(chart.unit))errors.push(`${prefix}.unit is required`);}
 chart.points.forEach(point=>{if(!point||!str(point.label)){errors.push(`${prefix} has invalid point`);return;}if(chart.type==='bar'){if(!Number.isFinite(point.value)||point.value<0||point.value>chart.domain?.[1])errors.push(`${prefix} values must fit the chart domain`);}else{if(!date(point.date)||!safeUrl(point.sourceUrl))errors.push(`${prefix} has invalid date or HTTPS source`);}});
 });}
 return errors;
}
export function filterItems(items,section,query){const needle=query.trim().toLocaleLowerCase();return items.filter(i=>(section==='all'||i.section===section)&&[i.title,i.summary,i.historicalContext,...i.sources.map(s=>s.publisher)].join(' ').toLocaleLowerCase().includes(needle));}
