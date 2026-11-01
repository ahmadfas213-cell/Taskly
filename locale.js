(() => {
const translations={"Good morning.":"Selamat pagi.","Good afternoon.":"Selamat siang.","Good evening.":"Selamat malam.","PRODUCTIVITY":"PRODUKTIVITAS","TODAY'S PROGRESS":"PROGRES HARI INI","tasks completed":"tugas selesai","REMAINING":"TERSISA","tasks left":"tugas lagi","YOUR TASKS":"DAFTAR TUGAS","Today":"Hari Ini","All Tasks":"Semua Tugas","Completed":"Selesai","Search":"Cari","All":"Semua","High":"Tinggi","Medium":"Sedang","Low":"Rendah","Nothing here.":"Belum ada tugas.","Add a task and get things moving.":"Tambahkan tugas untuk mulai.","Add Task":"Tambah Tugas","Create a task":"Buat Tugas","NEW TASK":"TUGAS BARU","Task name":"Nama tugas","What needs to be done?":"Apa yang perlu dikerjakan?","Priority":"Prioritas","Deadline":"Tenggat","Create Task":"Buat Tugas","No deadline":"Tanpa tenggat","WORKSPACE":"RUANG KERJA","Calendar":"Kalender","Kanban Board":"Papan Kanban","Habit Tracker":"Pelacak Kebiasaan","Focus Mode":"Mode Fokus","Analytics":"Analitik","Notes":"Catatan","Settings & Backup":"Pengaturan & Cadangan","Upcoming":"Mendatang","Task Templates":"Templat Tugas","Weekly Goals":"Target Mingguan","More":"Lainnya","Archive":"Arsip","Trash":"Sampah","Keyboard shortcuts":"Pintasan keyboard","Help & guide":"Bantuan & panduan","About Taskly":"Tentang Taskly","Download Android app":"Unduh aplikasi Android","Open build downloads":"Buka unduhan hasil build","Archive completed tasks":"Arsipkan tugas selesai","Restore":"Pulihkan","Delete":"Hapus","Empty trash":"Kosongkan sampah","Appearance":"Tampilan","Backup & restore":"Cadangkan & pulihkan","Export backup":"Ekspor cadangan","Import backup":"Impor cadangan","Reminders":"Pengingat","Enable notifications":"Aktifkan notifikasi","Android app":"Aplikasi Android","Data storage":"Penyimpanan data","Install App":"Pasang Aplikasi","My Workspace":"Ruang Kerjaku","Personal":"Pribadi","Set your target":"Atur target","Save goal":"Simpan target"};
const reverse=Object.fromEntries(Object.entries(translations).map(([a,b])=>[b,a]));
const originals=new WeakMap();
function translate(root=document.body){
 const lang=localStorage.getItem("taskly_language")||"en";
 const map=lang==="id"?translations:reverse;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  if(!originals.has(node)) originals.set(node,node.nodeValue);
  const original=originals.get(node),trimmed=original.trim(),value=map[trimmed];
  if(value){const next=original.replace(trimmed,value);if(node.nodeValue!==next)node.nodeValue=next;}
 }
 const elements=[];
 if(root.nodeType===Node.ELEMENT_NODE && root.matches("input,textarea,select"))elements.push(root);
 root.querySelectorAll?.("input,textarea,select").forEach(el=>elements.push(el));
 elements.forEach(el=>["placeholder","title","aria-label"].forEach(attr=>{
  if(!el.hasAttribute(attr))return;
  const key="original"+attr;
  if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);
  const next=map[el.dataset[key]]||el.dataset[key];
  if(el.getAttribute(attr)!==next)el.setAttribute(attr,next);
 }));
 document.documentElement.lang=lang==="id"?"id":"en";
 const select=document.getElementById("languageSelect");if(select)select.value=lang;
}
window.setTasklyLanguage=lang=>{localStorage.setItem("taskly_language",lang==="id"?"id":"en");translate();};
document.addEventListener("change",e=>{if(e.target?.id==="languageSelect")window.setTasklyLanguage(e.target.value);});
const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
 if(node.nodeType===Node.ELEMENT_NODE)translate(node);
 else if(node.nodeType===Node.TEXT_NODE && node.parentElement)translate(node.parentElement);
})));
observer.observe(document.body,{childList:true,subtree:true});
translate();
})();