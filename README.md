# Taskly

Taskly adalah aplikasi pengelola tugas berbasis web dengan tampilan glassmorphism. Selain daftar tugas, ada beberapa alat bantu untuk mengatur kegiatan dan menjaga fokus.

## Fitur
- Membuat, mengelola, dan menandai tugas selesai.
- Tampilan Today, All Tasks, dan Completed.
- Kalender dan Kanban Board.
- Habit Tracker dan Weekly Goals.
- Focus Mode dengan timer Pomodoro.
- Analytics, Notes, dan Task Templates.
- Pengaturan serta backup data.
- Dukungan bahasa melalui file locale.
- PWA dan konfigurasi Capacitor untuk Android.

## Menjalankan secara lokal

Butuh Node.js dan npm.

~~~bash
git clone https://github.com/ahmadfas213-cell/Taskly.git
cd Taskly
npm install
npm run build:web
~~~

Untuk mencoba versi web, buka index.html melalui local server. Jangan mengandalkan membuka file langsung jika browser membatasi service worker.

## Penyimpanan
Data tugas dan beberapa fitur disimpan di browser menggunakan localStorage. Data tersebut berada di perangkat dan browser yang digunakan.

## Teknologi
HTML, CSS, JavaScript, PWA, dan Capacitor.
