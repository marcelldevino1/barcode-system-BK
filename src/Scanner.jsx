import React, {useEffect, useId, useRef, useState} from 'react';
import {X} from 'lucide-react';

export default function Scanner({onScan,onClose,onError}) {
 const id='reader-'+useId().replace(/:/g,'');
 const callbacks=useRef({onScan,onClose,onError});
 callbacks.current={onScan,onClose,onError};
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  let cancelled=false,detected=false,reader;
  const stop=async()=>{if(reader?.isScanning)await reader.stop();};
  const starting=(async()=>{
   try {
    if(!window.isSecureContext)throw new Error('secure-context');
    const {Html5Qrcode}=await import('html5-qrcode');
    if(cancelled)return;
    reader=new Html5Qrcode(id);
    await reader.start({facingMode:'environment'},{fps:10,qrbox:(width,height)=>{
     const size=Math.floor(Math.min(width,height)*.72);
     return {width:size,height:size};
    }},async value=>{
     if(cancelled||detected)return;
     detected=true;
     try{await stop();}finally{if(!cancelled)callbacks.current.onScan(value);}
    },()=>{});
    if(!cancelled)setReady(true);
   }catch(error){
    if(cancelled)return;
    const detail=String(error);
    callbacks.current.onError(detail.includes('secure-context')
     ?'Kamera memerlukan HTTPS. Buka alamat https:// website Anda, atau gunakan input manual.'
     :/NotAllowed|Permission/i.test(detail)
     ?'Akses kamera belum diizinkan. Izinkan kamera di pengaturan browser, lalu coba lagi.'
     :/NotFound|NotReadable/i.test(detail)
     ?'Kamera tidak tersedia atau sedang dipakai aplikasi lain. Tutup aplikasi tersebut atau gunakan input manual.'
     :'Kamera belum dapat dibuka. Coba kembali atau gunakan input manual.');
   }
  })();
  return()=>{cancelled=true;starting.then(stop).then(()=>reader?.clear()).catch(()=>{});};
 },[id]);
 return <div className="camera-session">
  <div className="camera-toolbar"><span><i/>{ready?'Kamera aktif':'Menyiapkan kamera…'}</span><button type="button" onClick={onClose} aria-label="Tutup kamera"><X size={19}/></button></div>
  <div className="camera-stage"><div id={id} className="camera-reader"/>{!ready&&<div className="camera-loading" role="status">Menghubungkan kamera…</div>}</div>
  <p className="camera-hint" aria-live="polite">Posisikan seluruh QR code di dalam bingkai.<small>Klaim terbuka otomatis setelah kode terbaca.</small></p>
 </div>;
}
