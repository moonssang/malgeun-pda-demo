import test from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../dist/engine.js';
import {skuFor} from '../dist/barcodes.js';
import {lookupBarcode} from '../dist/lookup.js';

test('package lookup finds both directions on its exact LOT without mutating work',()=>{
 const s=seed(),before=JSON.stringify(s),r=lookupBarcode(s,' pk-m1-0001 ');
 assert.equal(r.label.stock.id,'M1');
 assert.deepEqual(r.tasks.map(t=>t.lookupStatus),['입고 대기','출고 대기']);
 assert.equal(JSON.stringify(s),before);
});
test('SKU lookup returns all item LOTs, package lookup does not include sibling LOT',()=>{
 const s=seed();
 assert.equal(lookupBarcode(s,skuFor('FP-001')).tasks.length,3);
 assert.equal(lookupBarcode(s,'PK-P4-0001').tasks.length,1);
});
test('lookup includes completed and saved work as separate statuses',()=>{
 const s=seed();s.tasks[0].state='done';s.tasks[5].allocated=true;s.tasks[5].state='saved';
 assert.deepEqual(lookupBarcode(s,'PK-P1-0001').tasks.map(t=>t.lookupStatus),['처리 완료','입고 확정 대기']);
});
test('unknown barcode and known item with no linked tasks are different results',()=>{
 const s=seed();assert.equal(lookupBarcode(s,'UNKNOWN').label,null);
 const r=lookupBarcode(s,'PK-M2-0001');assert.ok(r.label);assert.equal(r.tasks.length,0);
});
