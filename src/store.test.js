import test from 'node:test';
import assert from 'node:assert/strict';
import {initialData,claim,normalizePhone,resolveBarcode,parseScan} from './store.js';
test('claim creates member, accumulates points, and rejects reuse',()=>{const input={name:'Ayu',phone:'081234567890',email:'',sku:'KMJ-BLK-M',code:'KMJ-BLK-M-DEMO01'};const first=claim(initialData(),input);assert.equal(first.data.members[0].points,15);assert.equal(first.data.logs.length,1);assert.equal(first.data.barcodes[0].is_claimed,true);assert.throws(()=>claim(first.data,input),/sudah pernah/);const second=claim(first.data,{...input,phone:'+62 81234567890',sku:'JNS-BLU-32',code:'JNS-BLU-32-DEMO03'});assert.equal(second.data.members.length,1);assert.equal(second.data.members[0].points,35);assert.equal(second.data.logs.length,2);});
test('mismatched SKU and invalid phone cannot claim',()=>{const input={name:'Ayu',phone:'081234567890',email:'',sku:'JNS-BLU-32',code:'KMJ-BLK-M-DEMO01'};assert.throws(()=>claim(initialData(),input));assert.throws(()=>claim(initialData(),{...input,sku:'KMJ-BLK-M',phone:'abc'}));assert.equal(normalizePhone('0812-3456-7890'),'6281234567890');});
test('generator QR from another browser can be claimed once locally',()=>{
 const data=initialData(),sku='KMJ-BLK-M',code=sku+'-A4397E20-D7DB-4D8D-BD75-B68DB6D18B76';
 assert.equal(resolveBarcode(data,sku,code).is_claimed,false);
 assert.equal(data.barcodes.length,3);
 const saved=claim(data,{sku,code,name:'Member Demo',phone:'081234567890',email:''});
 assert.equal(saved.data.barcodes.length,4);
 assert.equal(saved.data.members[0].points,15);
 assert.equal(resolveBarcode(saved.data,sku,code).is_claimed,true);
 assert.throws(()=>claim(saved.data,{sku,code,name:'Demo',phone:'081234567891',email:''}));
 assert.equal(resolveBarcode(data,'JNS-BLU-32',code),null);
 assert.equal(resolveBarcode(data,sku,sku+'-NOT-ISSUED'),null);
 assert.equal(resolveBarcode(data,sku,'1234567890123'),null);
});
test('manual and camera input preserve SKU and normalize local or deployed claim links',()=>{
 const data=initialData(),code='KMJ-BLK-M-A4397E20-D7DB-4D8D-BD75-B68DB6D18B76';
 for(const value of [code,`http://localhost:5173/claim?sku=KMJ-BLK-M&code=${code}`,`https://demo.vercel.app/claim?sku=KMJ-BLK-M&code=${code}`,`/claim?code=${code}`])assert.deepEqual(parseScan(value,data),{sku:'KMJ-BLK-M',code});
 assert.equal(parseScan(' https://example.com/other?code=abc ',data).code,'');
 assert.equal(parseScan('KMJ-BLK-M-DEMO01',data).sku,'KMJ-BLK-M');
});
