# Loyal — prototype membership lokal

React + Vite, CSS responsif, html5-qrcode, qrcode.react, dan Lucide.

## Menjalankan

```sh
npm install
npm run dev
```

Buka http://localhost:5173. Jalankan `npm run build` untuk build dan `npm test` untuk tes logika klaim.

Halaman: `/`, `/claim?sku=...&code=...`, `/exit`, `/success?id=...`, dan `/admin`.

Data diinisialisasi sekali pada localStorage dengan key `loyal.prototype.v1`. QR menggunakan origin aplikasi yang sedang dibuka, sehingga saat testing localhost URL tetap lokal. Kamera memerlukan izin dan secure context (localhost atau HTTPS). Gunakan input manual jika kamera tidak tersedia.

Prototype ini tidak menghubungkan data antar-browser/perangkat. Kode berformat SKU + UUID v4 dari generator (termasuk stiker versi awal) sekarang dikenali di browser baru dan disimpan saat klaim berhasil. Ini hanya pengenalan format untuk demo, bukan verifikasi keaslian atau bukti bahwa kode diterbitkan admin. Kode arbitrer dan SKU yang tidak cocok tetap ditolak. Status klaim lokal yang sudah ada tidak ditimpa. Satu kode masih dapat diklaim di perangkat berbeda atau setelah data browser dihapus; pencegahan klaim ganda global memerlukan backend dengan penyimpanan bersama.

Untuk Vercel, deploy ulang proyek ini (build `npm run build`, output `dist`). `vercel.json` mengarahkan halaman claim/admin/success/exit ke React agar URL QR dapat dibuka langsung. Buat dan cetak QR di domain HTTPS Vercel yang akan dipakai. Akses localhost di HP menunjuk HP itu sendiri, bukan komputer. QR localhost lama dapat dibaca melalui scanner dalam aplikasi Vercel, tetapi membuka link localhost dari kamera bawaan HP tidak mengarah ke deployment. Admin tidak memakai autentikasi. Pilihan Tidak tidak menghabiskan barcode.

Preview kamera mengikuti tinggi alami video tanpa crop CSS. Bingkai scan dihitung dari dimensi video; izin ditolak dan kamera tidak tersedia memiliki pesan terpisah. Tampilan HP menggunakan input minimal 16px, tombol minimal 44–50px, form satu kolom, dan safe-area footer.

Nomor 08… dan +628… dinormalisasi agar member yang sama menerima akumulasi poin. Klaim ulang ditolak dan Web Locks digunakan ketika tersedia untuk mencegah dua tab mengklaim bersamaan. Seluruh data tetap lokal; font menggunakan fallback sans-serif lokal. Ini bukan PWA dengan cache offline untuk pemuatan awal.

