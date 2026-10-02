export const KEY = 'loyal.prototype.v1';
export const initialData = () => ({products:[{sku:'KMJ-BLK-M',name:'Kemeja Hitam M',points:15},{sku:'JNS-BLU-32',name:'Celana Jeans 32',points:20}],barcodes:[{code:'KMJ-BLK-M-DEMO01',sku:'KMJ-BLK-M',is_claimed:false},{code:'KMJ-BLK-M-DEMO02',sku:'KMJ-BLK-M',is_claimed:false},{code:'JNS-BLU-32-DEMO03',sku:'JNS-BLU-32',is_claimed:false}],members:[],logs:[]});
export function readData(){const saved=localStorage.getItem(KEY);if(saved)return JSON.parse(saved);const data=initialData();writeData(data);return data;}
export function writeData(data){localStorage.setItem(KEY,JSON.stringify(data));}
// Prototype portability only: UUID format is not proof of issuance or authenticity.
// Existing local state always wins, so importing never resets a claimed code.
export function resolveBarcode(data,sku,code){
 const existing=data.barcodes.find(b=>b.code===code);
 if(existing)return existing.sku===sku?existing:null;
 if(!data.products.some(p=>p.sku===sku)||typeof code!=='string'||!code.startsWith(sku+'-'))return null;
 const token=code.slice(sku.length+1);
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token))return null;
 return {sku,code,is_claimed:false};
}
export function parseScan(value,data){
 let code=value.trim(),sku;
 if(/^https?:\/\//i.test(code)||code.startsWith('/claim?')){
   const url=new URL(code,'http://localhost');
   if(url.pathname!=='/claim')return {sku:'',code:''};
   code=(url.searchParams.get('code')||'').trim();sku=url.searchParams.get('sku');
 }
 if(!sku)sku=data.barcodes.find(b=>b.code===code)?.sku||data.products.find(p=>code.startsWith(p.sku+'-'))?.sku||'';
 return {sku,code};
}
export function normalizePhone(phone){let p=phone.replace(/[\s()+.-]/g,'');if(p.startsWith('0'))p='62'+p.slice(1);return p;}
export function claim(data,{code,sku,name,phone,email}){const barcode=resolveBarcode(data,sku,code);const product=data.products.find(p=>p.sku===sku);if(!barcode||barcode.is_claimed||!product)throw new Error('Barcode tidak valid atau sudah pernah digunakan');const normalized=normalizePhone(phone);if(!name.trim()||!/^\d{9,15}$/.test(normalized))throw new Error('Isi nama dan nomor WhatsApp yang valid.');const next=structuredClone(data);if(!next.barcodes.some(b=>b.code===code))next.barcodes.push({...barcode});let member=next.members.find(m=>m.phone===normalized);if(!member){member={id:crypto.randomUUID(),name:name.trim(),phone:normalized,email:email.trim(),points:0};next.members.push(member);}member.points+=product.points;next.barcodes.find(b=>b.code===code).is_claimed=true;const log={id:crypto.randomUUID(),time:new Date().toISOString(),memberId:member.id,name:member.name,sku,code,points:product.points,total:member.points};next.logs.unshift(log);return {data:next,log};}
