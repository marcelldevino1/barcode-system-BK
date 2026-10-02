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

Prototype ini tidak menghubungkan data antar-browser/perangkat. QR yang dibuat pada satu browser hanya terdaftar pada penyimpanan browser tersebut. Akses localhost di HP menunjuk HP itu sendiri, bukan komputer. Admin tidak memakai autentikasi. Scan kamera membaca QR/barcode dengan kode yang terdaftar; QR baru dapat dibuat di admin dan dicetak. Pilihan Tidak tidak menghabiskan barcode.

Nomor 08… dan +628… dinormalisasi agar member yang sama menerima akumulasi poin. Klaim ulang ditolak dan Web Locks digunakan ketika tersedia untuk mencegah dua tab mengklaim bersamaan. Seluruh data tetap lokal; font menggunakan fallback sans-serif lokal. Ini bukan PWA dengan cache offline untuk pemuatan awal.

