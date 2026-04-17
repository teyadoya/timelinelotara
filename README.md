# Kronologi Lotara

Timeline interaktif proyek KPBU Desalinasi Air Laut — Gili Matra, Kabupaten Lombok Utara.

**Stack:** Vite + React (plain JSX, no TypeScript)

---

## Deploy ke Netlify (Private / Password Protected)

### Langkah 1 — Push ke GitHub

```bash
git init
git add .
git commit -m "feat: initial commit — Kronologi Lotara"
git branch -M main
git remote add origin https://github.com/USERNAME/kronologi-lotara.git
git push -u origin main
```

### Langkah 2 — Import di Netlify

1. Buka [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Pilih **Deploy with GitHub** → authorize → pilih repo `kronologi-lotara`
3. Netlify otomatis membaca `netlify.toml`, setting sudah terisi:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Klik **Deploy site**
5. Tunggu ~30 detik hingga status **Published**

### Langkah 3 — Aktifkan Password Protection

1. Di dashboard Netlify → klik nama site Anda
2. Buka **Site configuration** (menu kiri)
3. Scroll ke bagian **Access control**
4. Klik **Enable site-wide password protection**
5. Isi password → klik **Save**

Setelah aktif, siapapun yang membuka URL akan langsung diminta password.

### Langkah 4 — (Opsional) Ganti URL

URL default berbentuk `random-words-123.netlify.app`.

1. **Site configuration** → **Domain management** → **Options** → **Edit site name**
2. Ubah ke misalnya `kronologi-lotara.netlify.app`
3. Klik **Save**

---

## Cara Share ke Orang Lain

Kirimkan dua hal:
- **URL:** `https://nama-site-anda.netlify.app`
- **Password:** (password yang Anda set di Langkah 3)

Tidak perlu mereka punya akun Netlify atau GitHub.

---

## Auto-Deploy Setelah Update

Setiap push ke GitHub otomatis trigger redeploy di Netlify:

```bash
git add .
git commit -m "docs: tambah dokumen baru"
git push
```

Netlify redeploy dalam ~30 detik.

---

## Development Lokal

```bash
npm install
npm run dev
# Buka http://localhost:5173
```

## Menambah Dokumen

Edit `src/docs.js`, tambahkan objek ke array `DOCS`:

```js
{
  id: 'x1',
  tanggal: '15 April 2025',
  nomor_surat: '001/XYZ/IV/2025',
  perihal: 'Permohonan Izin',
  pengirim: 'Nama Instansi',
  ringkasan: '4-5 kalimat ringkas tentang isi dokumen...'
}
```
