(() => {
const translations = {
"Good morning.":"Selamat pagi.","Good afternoon.":"Selamat siang.","Good evening.":"Selamat malam.",
"PRODUCTIVITY":"PRODUKTIVITAS","TODAY'S PROGRESS":"PROGRES HARI INI","of":"dari","tasks completed":"tugas selesai",
"REMAINING":"TERSISA","tasks left":"tugas lagi","YOUR TASKS":"DAFTAR TUGAS","Today":"Hari Ini","All Tasks":"Semua Tugas","Completed":"Selesai",
"Search":"Cari","All":"Semua","High":"Tinggi","Medium":"Sedang","Low":"Rendah","Nothing here.":"Belum ada tugas.","Add a task and get things moving.":"Tambahkan tugas untuk mulai.",
"Add Task":"Tambah Tugas","Create a task":"Buat Tugas","NEW TASK":"TUGAS BARU","Task name":"Nama tugas","What needs to be done?":"Apa yang perlu dikerjakan?",
"Priority":"Prioritas","Deadline":"Tenggat","Create Task":"Buat Tugas","No deadline":"Tanpa tenggat",
"WORKSPACE":"RUANG KERJA","Calendar":"Kalender","Kanban Board":"Papan Kanban","Habit Tracker":"Pelacak Kebiasaan","Focus Mode":"Mode Fokus","Analytics":"Analitik","Notes":"Catatan","Settings & Backup":"Pengaturan & Cadangan","Upcoming":"Mendatang","Task Templates":"Templat Tugas","Weekly Goals":"Target Mingguan",
"Calendar":"Kalender","Sun":"Min","Mon":"Sen","Tue":"Sel","Wed":"Rab","Thu":"Kam","Fri":"Jum","Sat":"Sab","Dots mark days with task deadlines.":"Titik menandai tanggal dengan tenggat tugas.",
"To Do":"Belum Dikerjakan","In Progress":"Sedang Dikerjakan","Tap a task card to move it to the next column.":"Ketuk kartu tugas untuk memindahkannya ke kolom berikutnya.",
"e.g. Read 20 minutes":"mis. Membaca 20 menit","Add habit":"Tambah kebiasaan","POMODORO TIMER":"PENGATUR WAKTU POMODORO","Start focus":"Mulai fokus","Pause":"Jeda","Reset":"Atur ulang","5 min break":"Istirahat 5 menit","A focus session counts when the timer reaches zero.":"Sesi fokus dihitung saat waktu mencapai nol.",
"COMPLETED SESSIONS":"SESI SELESAI","Pomodoro sessions completed on this device.":"Sesi Pomodoro yang selesai di perangkat ini.",
"COMPLETION RATE":"TINGKAT PENYELESAIAN","TOTAL TASKS":"TOTAL TUGAS","completed":"selesai","remaining":"tersisa","Priority breakdown":"Rincian prioritas","Productivity level":"Level produktivitas","Completed tasks · last 7 days":"Tugas selesai · 7 hari terakhir","Focus sessions":"Sesi fokus","Level":"Level","XP earned":"XP diperoleh","XP to next level":"XP menuju level berikutnya",
"Write down ideas, reminders, or quick notes...":"Tulis ide, pengingat, atau catatan singkat...","Saved on this device":"Tersimpan di perangkat ini","Save notes":"Simpan catatan","Saved just now":"Baru saja disimpan",
"Appearance":"Tampilan","Switch between light and dark themes.":"Ganti antara tema terang dan gelap.","Toggle light / dark mode":"Ganti tema terang / gelap","Backup & restore":"Cadangkan & pulihkan","Export your tasks, habits, notes, and progress to a JSON file. Import it on another device.":"Ekspor tugas, kebiasaan, catatan, dan progres ke file JSON. Impor di perangkat lain.","Export backup":"Ekspor cadangan","Import backup":"Impor cadangan","Reminders":"Pengingat","Allow browser notifications for deadline reminders.":"Izinkan notifikasi browser untuk pengingat tenggat.","Enable notifications":"Aktifkan notifikasi","Android app":"Aplikasi Android","Build and download the installable Android APK from the latest successful GitHub Actions run.":"Buat dan unduh APK Android dari proses build GitHub Actions yang berhasil.","Get Android APK":"Unduh APK Android","Data storage":"Penyimpanan data","Your data is currently stored in this browser using local storage. Cross-device cloud sync requires a backend and account system.":"Data saat ini disimpan di browser ini. Sinkronisasi antarperangkat membutuhkan server dan akun.",
"Your productivity, in one place":"Produktivitasmu, dalam satu tempat","TASKLY WORKSPACE":"RUANG KERJA TASKLY","Set your target":"Atur target","TASKS COMPLETED THIS WEEK":"TUGAS SELESAI MINGGU INI","Save goal":"Simpan target","Your goal resets each Monday. Completion tracking starts with tasks completed after this update.":"Target diatur ulang setiap Senin. Pelacakan dimulai dari tugas yang diselesaikan setelah pembaruan ini.",
"Weekly target":"Target mingguan","task":"tugas","Tasks":"Tugas","More":"Lainnya","Install App":"Pasang Aplikasi","My Workspace":"Ruang Kerjaku","Personal":"Pribadi",
"More":"Lainnya","Archive":"Arsip","Trash":"Sampah","Keyboard shortcuts":"Pintasan keyboard","Help & guide":"Bantuan & panduan","About Taskly":"Tentang Taskly","Download Android app":"Unduh aplikasi Android","Open build downloads":"Buka unduhan hasil build","Archive completed tasks":"Arsipkan tugas yang selesai","Keep completed tasks without cluttering your active list.":"Simpan tugas selesai agar daftar aktif tetap rapi.","Deleted tasks stay here until you restore or permanently remove them.":"Tugas yang dihapus ada di sini sampai dipulihkan atau dihapus permanen.","No archived tasks yet.":"Belum ada tugas yang diarsipkan.","Trash is empty.":"Sampah kosong.","Restore":"Pulihkan","Delete":"Hapus","Empty trash":"Kosongkan sampah","Permanently delete all tasks in Trash?":"Hapus permanen semua tugas di Sampah?","Focus search":"Fokus ke pencarian","Create a task":"Buat tugas","Close dialog":"Tutup dialog","Use these shortcuts to move faster.":"Gunakan pintasan ini untuk bekerja lebih cepat.","Create tasks, set priorities and deadlines, then track progress from your workspace. Use Settings to switch language and back up your data.":"Buat tugas, atur prioritas dan tenggat, lalu pantau progres dari ruang kerja. Buka Pengaturan untuk mengganti bahasa dan mencadangkan data.","Taskly is a personal productivity workspace. Your data is stored locally on this device.":"Taskly adalah ruang produktivitas pribadi. Data disimpan secara lokal di perangkat ini.","Install the Android version of Taskly on your phone.":"Pasang Taskly versi Android di ponselmu.","Your data is stored on this device.":"Data kamu disimpan di perangkat ini.","TASK MANAGEMENT":"MANAJEMEN TUGAS","Version 5.0 · Glassy Workspace":"Versi 5.0 · Glassy Workspace","More tools":"Fitur lainnya"
};
const reverse = Object.fromEntries(Object.entries(translations).map(([en,id])=>[id,en]));
const originals = new WeakMap();
function translateElement(root=document){
const language=localStorage.getItem("taskly_language")||"en";
const map=language==="id"?translations:reverse;
const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
let node;
while((node=walker.nextNode())){
if(!originals.has(node))originals.set(node,node.nodeValue);
const original=originals.get(node),trimmed=original.trim();
if(!trimmed)continue;
const translated=map[trimmed];
if(translated){const start=original.match(/^\\s*/)?.[0]||"",end=original.match(/\\s*$/)?.[0]||"";node.nodeValue=start+translated+end;}
else if(node.nodeValue!==original && (translations[trimmed]||reverse[trimmed]))node.nodeValue=original;
}
root.querySelectorAll?.("[placeholder],[title],[aria-label]").forEach(el=>{
for(const attr of ["placeholder","title","aria-label"]){if(!el.hasAttribute(attr))continue;const key="tasklyOriginal"+attr; if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);const original=el.dataset[key];el.setAttribute(attr,map[original]||original);}
});
document.documentElement.lang=language==="id"?"id":"en";
}
window.setTasklyLanguage=language=>{
localStorage.setItem("taskly_language",language==="id"?"id":"en");
translateElement();
const select=document.getElementById("languageSelect");if(select)select.value=language;
};
const observer=new MutationObserver(records=>records.forEach(record=>{
if(record.type==="childList")record.addedNodes.forEach(node=>{if(node.nodeType===Node.ELEMENT_NODE)translateElement(node);else if(node.nodeType===Node.TEXT_NODE)translateElement(node.parentElement||document);});
else if(record.type==="characterData")translateElement(record.target.parentElement||document);
}));
observer.observe(document.body,{childList:true,subtree:true,characterData:true});
translateElement();
})();