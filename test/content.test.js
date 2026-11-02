import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {validate,filterItems} from '../schema.js';
const data=JSON.parse(readFileSync(new URL('../data/newsletter.json',import.meta.url),'utf8'));
test('published newsletter validates',()=>assert.deepEqual(validate(data),[]));
test('rejects missing metadata',()=>assert.ok(validate({items:[]}).length));
test('rejects unsafe source URLs',()=>{const d=structuredClone(data);d.items[0].sources[0].url='javascript:alert(1)';assert.ok(validate(d).some(e=>e.includes('HTTPS')));});
test('rejects duplicate ids',()=>{const d=structuredClone(data);d.items.push(d.items[0]);assert.ok(validate(d).some(e=>e.includes('unique')));});
test('predictions require falsifiable criteria',()=>{const d=structuredClone(data);d.items[0].section='predictions';delete d.items[0].resolutionCriteria;assert.ok(validate(d).some(e=>e.includes('resolutionCriteria')));});
test('filters search and sections together',()=>{assert.equal(filterItems(data.items,'news','').every(i=>i.section==='news'),true);assert.equal(filterItems(data.items,'all','zzzznonexistent').length,0);assert.equal(filterItems(data.items,'all','').length,data.items.length);});
test('handles null items and invalid dates',()=>{assert.ok(validate({...data,items:[null]}).length);assert.ok(validate({...data,publishedAt:'2026-02-31'}).length);});
