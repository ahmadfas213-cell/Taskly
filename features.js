(() => {
const $ = (s,root=document) => root.querySelector(s);
const store = (key, fallback) => { try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback} };
let habits = store("taskly_habits",[]);
let notes = localStorage.getItem("taskly_notes") || "";
let monthOffset = 0;
let timerSeconds = 25*60, timerRunning = false, timerInterval = null;
let focusSessions = store("taskly_focus_sessions",0);
let xp = store("taskly_xp",0);
const panel = $("#featurePanel"), taskSection = $(".task-section");
const pages = {calendar:"Calendar",board:"Kanban Board",habits:"Habit Tracker",focus:"Focus Mode",analytics:"Analytics",notes:"Notes",settings:"Settings & Backup",upcoming:"Upcoming",templates:"Task Templates",weekly:"Weekly Goals"};
function shell(title,body){panel.innerHTML='<div class="feature-heading"><div><span class="label">TASKLY WORKSPACE</span><h2>'+title+'</h2></div><span class="feature-muted">Your productivity, in one place</span></div>'+body;}
function showFeature(name){
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll('[data-feature="'+name+'"]').forEach(x=>x.classList.add("active"));
 taskSection.hidden=true; panel.hidden=false; renderFeature(name);
}
function showTasks(page){
 panel.hidden=true; taskSection.hidden=false;
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
}
document.querySelectorAll("[data-feature]").forEach(b=>b.addEventListener("click",()=>showFeature(b.dataset.feature)));
document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>showTasks(b.dataset.page)));
function renderFeature(name){
 if(name==="calendar")return calendar();
 if(name==="board")return board();
 if(name==="habits")return habitView();
 if(name==="focus")return focusView();
 if(name==="analytics")return analytics();
 if(name==="notes")return notesView();
 if(name==="settings")return settingsView();
 if(name==="upcoming")return upcomingView();
 if(name==="templates")return templatesView();
 if(name==="weekly")return weeklyView();
}
function calendar(){
 const date=new Date();date.setDate(1);date.setMonth(date.getMonth()+monthOffset);
 const y=date.getFullYear(),m=date.getMonth(),first=date.getDay(),count=new Date(y,m+1,0).getDate();
 const names=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
 let cells=names.map(n=>'<div class="feature-muted">'+n+'</div>').join("");
 for(let i=0;i<first;i++)cells+='<div></div>';
 for(let d=1;d<=count;d++){const iso=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");const due=tasks.filter(t=>t.deadline===iso);const today=new Date().toDateString()===new Date(y,m,d).toDateString();cells+='<div class="calendar-day '+(today?"today":"")+'"><b>'+d+'</b>'+(due.length?'<span class="dot"></span><small>'+due.length+' task</small>':'')+'</div>';}
 shell("Calendar",'<div class="feature-card"><div class="feature-row" style="justify-content:space-between;margin-bottom:14px"><button class="feature-btn" id="prevMonth">←</button><b>'+date.toLocaleDateString("en-US",{month:"long",year:"numeric"})+'</b><button class="feature-btn" id="nextMonth">→</button></div><div class="calendar-grid">'+cells+'</div></div><p class="feature-muted">Dots mark days with task deadlines.</p>');
 $("#prevMonth").onclick=()=>{monthOffset--;calendar()};$("#nextMonth").onclick=()=>{monthOffset++;calendar()};
}
function board(){
 const groups=[["To Do",t=>!t.completed&&!t.inProgress],["In Progress",t=>!t.completed&&t.inProgress],["Completed",t=>t.completed]];
 shell("Kanban Board",'<div class="kanban">'+groups.map(([label,fn],i)=>'<div class="kanban-col"><h4>'+label+' · '+tasks.filter(fn).length+'</h4>'+tasks.filter(fn).map(t=>'<div class="kanban-task" data-id="'+t.id+'">'+escapeText(t.title)+'<br><small>'+t.priority+'</small></div>').join("")+'</div>').join("")+'</div><p class="feature-muted">Tap a task card to move it to the next column.</p>');
 panel.querySelectorAll(".kanban-task").forEach(el=>el.onclick=()=>{const t=tasks.find(x=>String(x.id)===el.dataset.id);if(!t)return;if(t.completed){t.completed=false;t.inProgress=false}else if(t.inProgress){t.completed=true;t.inProgress=false}else t.inProgress=true;localStorage.setItem("taskly_tasks",JSON.stringify(tasks));if(typeof render==="function")render();board()});
}
function habitView(){
 shell("Habit Tracker",'<div class="feature-card"><form id="habitForm" class="feature-row"><input class="feature-input" id="habitName" placeholder="e.g. Read 20 minutes" required><button class="feature-btn primary">Add habit</button></form><div class="feature-list" id="habitList" style="margin-top:14px">'+habits.map((h,i)=>'<div class="feature-item"><label><input class="habit-check" type="checkbox" data-habit="'+i+'" '+(h.done===new Date().toDateString()?"checked":"")+'> '+escapeText(h.name)+'</label><button class="feature-btn" data-remove-habit="'+i+'">×</button></div>').join("")+'</div></div>');
 $("#habitForm").onsubmit=e=>{e.preventDefault();habits.push({name:$("#habitName").value.trim(),done:""});saveHabits();habitView()};
 panel.querySelectorAll("[data-habit]").forEach(c=>c.onchange=()=>{habits[+c.dataset.habit].done=c.checked?new Date().toDateString():"";saveHabits()});
 panel.querySelectorAll("[data-remove-habit]").forEach(b=>b.onclick=()=>{habits.splice(+b.dataset.removeHabit,1);saveHabits();habitView()});
}
function saveHabits(){localStorage.setItem("taskly_habits",JSON.stringify(habits))}
function focusView(){
 const mins=String(Math.floor(timerSeconds/60)).padStart(2,"0"),secs=String(timerSeconds%60).padStart(2,"0");
 shell("Focus Mode",'<div class="feature-grid"><div class="feature-card"><span class="label">POMODORO TIMER</span><div class="timer-face" id="timerFace">'+mins+':'+secs+'</div><div class="feature-row"><button class="feature-btn primary" id="timerToggle">'+(timerRunning?"Pause":"Start focus")+'</button><button class="feature-btn" id="timerReset">Reset</button><button class="feature-btn" id="timerBreak">5 min break</button></div><p class="feature-muted">A focus session counts when the timer reaches zero.</p></div><div class="feature-card"><span class="label">COMPLETED SESSIONS</span><div class="stat-number">'+focusSessions+'</div><p class="feature-muted">Pomodoro sessions completed on this device.</p></div></div>');
 $("#timerToggle").onclick=()=>{timerRunning=!timerRunning;if(timerRunning)startTimer();else clearInterval(timerInterval);focusView()};
 $("#timerReset").onclick=()=>{timerRunning=false;clearInterval(timerInterval);timerSeconds=1500;focusView()};
 $("#timerBreak").onclick=()=>{timerRunning=false;clearInterval(timerInterval);timerSeconds=300;focusView()};
}
function startTimer(){clearInterval(timerInterval);timerInterval=setInterval(()=>{if(timerSeconds>0){timerSeconds--;const f=$("#timerFace");if(f)f.textContent=String(Math.floor(timerSeconds/60)).padStart(2,"0")+":"+String(timerSeconds%60).padStart(2,"0")}else{timerRunning=false;clearInterval(timerInterval);focusSessions++;xp+=10;localStorage.setItem("taskly_focus_sessions",focusSessions);localStorage.setItem("taskly_xp",xp);if("Notification"in window&&Notification.permission==="granted")new Notification("Focus session complete",{body:"Take a short break."});focusView()}},1000)}
function analytics(){
 const total=tasks.length,done=tasks.filter(t=>t.completed).length,rate=total?Math.round(done/total*100):0;
 const byPriority=["High","Medium","Low"].map(p=>'<div class="feature-item"><span>'+p+'</span><b>'+tasks.filter(t=>t.priority===p).length+'</b></div>').join("");
 const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return {label:d.toLocaleDateString("en-US",{weekday:"short"}),n:tasks.filter(t=>t.completed&&t.createdAt&&new Date(t.createdAt).toDateString()===d.toDateString()).length}});
 shell("Analytics",'<div class="feature-grid"><div class="feature-card"><span class="label">COMPLETION RATE</span><div class="stat-number">'+rate+'%</div><div class="progress-track"><span style="width:'+rate+'%"></span></div></div><div class="feature-card"><span class="label">TOTAL TASKS</span><div class="stat-number">'+total+'</div><p class="feature-muted">'+done+' completed · '+(total-done)+' remaining</p></div><div class="feature-card"><h3>Priority breakdown</h3>'+byPriority+'</div><div class="feature-card"><h3>Productivity level</h3><div class="stat-number">Level '+(1+Math.floor(xp/100))+'</div><p class="feature-muted">'+xp+' XP earned · '+(100-xp%100)+' XP to next level</p><div class="progress-track"><span style="width:'+(xp%100)+'%"></span></div></div><div class="feature-card"><h3>Completed tasks · last 7 days</h3>'+last7.map(x=>'<div class="feature-item"><span>'+x.label+'</span><b>'+x.n+'</b></div>').join("")+'</div><div class="feature-card"><h3>Focus sessions</h3><div class="stat-number">'+focusSessions+'</div></div></div>');
}
function notesView(){
 shell("Notes",'<div class="feature-card"><textarea class="note-area" id="notesArea" placeholder="Write down ideas, reminders, or quick notes...">'+escapeText(notes)+'</textarea><div class="feature-row" style="justify-content:space-between;margin-top:10px"><small class="feature-muted" id="noteStatus">Saved on this device</small><button class="feature-btn primary" id="saveNotes">Save notes</button></div></div>');
 $("#saveNotes").onclick=()=>{notes=$("#notesArea").value;localStorage.setItem("taskly_notes",notes);$("#noteStatus").textContent="Saved just now"};
}
function settingsView(){
 shell("Settings & Backup",'<div class="feature-grid"><div class="feature-card"><h3>Appearance</h3><p class="feature-muted">Switch between light and dark themes.</p><button class="feature-btn" id="themeToggle">Toggle light / dark mode</button></div><div class="feature-card"><h3>Backup & restore</h3><p class="feature-muted">Export your tasks, habits, notes, and progress to a JSON file. Import it on another device.</p><div class="feature-row"><button class="feature-btn primary" id="exportData">Export backup</button><label class="feature-btn">Import backup<input id="importData" type="file" accept="application/json" hidden></label></div></div><div class="feature-card"><h3>Reminders</h3><p class="feature-muted">Allow browser notifications for deadline reminders.</p><button class="feature-btn" id="enableNotifications">Enable notifications</button></div><div class="feature-card"><h3>Android app</h3><p class="feature-muted">Build and download the installable Android APK from the latest successful GitHub Actions run.</p><a class="feature-btn primary" href="https://github.com/ahmadfas213-cell/Taskly/actions/workflows/android-apk.yml" target="_blank" rel="noopener">Get Android APK</a></div><div class="feature-card"><h3>Data storage</h3><p class="feature-muted">Your data is currently stored in this browser using local storage. Cross-device cloud sync requires a backend and account system.</p></div></div>');
 $("#themeToggle").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("taskly_theme",document.body.classList.contains("light")?"light":"dark")};
 $("#exportData").onclick=()=>{const data={tasks,habits,notes,xp,focusSessions,exportedAt:new Date().toISOString()};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="taskly-backup.json";a.click();URL.revokeObjectURL(a.href)};
 $("#importData").onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data.tasks))throw Error();localStorage.setItem("taskly_tasks",JSON.stringify(data.tasks));localStorage.setItem("taskly_habits",JSON.stringify(Array.isArray(data.habits)?data.habits:[]));localStorage.setItem("taskly_notes",data.notes||"");localStorage.setItem("taskly_xp",data.xp||0);localStorage.setItem("taskly_focus_sessions",data.focusSessions||0);alert("Backup restored. Reloading.");location.reload()}catch{alert("File backup tidak valid.")}};
 $("#enableNotifications").onclick=async()=>{if(!("Notification"in window)){alert("Browser ini tidak mendukung notifikasi.");return}const p=await Notification.requestPermission();alert(p==="granted"?"Notifications enabled.":"Notification permission was not granted.")};
}
function upcomingView(){
 const list=tasks.filter(t=>!t.completed&&t.deadline).sort((a,b)=>a.deadline.localeCompare(b.deadline));
 const today=new Date().toISOString().slice(0,10);
 const rows=list.map(t=>'<div class="feature-item"><div><b>'+escapeText(t.title)+'</b><br><small>'+t.deadline+' · '+escapeText(t.priority)+'</small></div><span class="due-badge '+(t.deadline<today?'overdue':t.deadline===today?'due-today':'')+'">'+(t.deadline<today?'Overdue':t.deadline===today?'Today':'Upcoming')+'</span></div>').join("");
 shell("Upcoming Tasks",'<div class="feature-card"><div class="feature-row" style="justify-content:space-between"><b>'+list.length+' scheduled tasks</b><span class="feature-muted">Sorted by deadline</span></div><div class="feature-list" style="margin-top:14px">'+(rows||'<p class="feature-muted">No upcoming deadlines. Add a deadline to a task to see it here.</p>')+'</div></div>');
}
function templatesView(){
 const templates=[["Study session","Review lecture notes and complete exercises","Medium",1],["Project work","Work on the next project milestone","High",2],["Weekly planning","Review goals and plan the upcoming week","Low",0],["Deep work","Complete one important task without distractions","High",0],["Admin & errands","Handle pending messages and small tasks","Low",1]];
 shell("Task Templates",'<div class="feature-grid">'+templates.map((t,i)=>'<div class="feature-card"><span class="label">TEMPLATE '+String(i+1).padStart(2,"0")+'</span><h3 style="margin-top:10px">'+t[0]+'</h3><p class="feature-muted">'+t[1]+'</p><button class="feature-btn primary" data-template="'+i+'">Add to tasks</button></div>').join("")+'</div><p class="feature-muted">Templates create a task with a suggested priority and deadline.</p>');
 panel.querySelectorAll("[data-template]").forEach(b=>b.onclick=()=>{const t=templates[+b.dataset.template];const deadline=new Date();if(t[3])deadline.setDate(deadline.getDate()+t[3]);tasks.unshift({id:Date.now(),title:t[1],priority:t[2],deadline:t[3]?deadline.toISOString().slice(0,10):"",completed:false,createdAt:new Date().toISOString()});localStorage.setItem("taskly_tasks",JSON.stringify(tasks));if(typeof render==="function")render();b.textContent="Added ✓";b.disabled=true});
}
function weeklyView(){
 const now=new Date(),start=new Date(now);start.setHours(0,0,0,0);start.setDate(now.getDate()-((now.getDay()+6)%7));
 const completed=tasks.filter(t=>t.completedAt&&new Date(t.completedAt)>=start).length;
 const goal=store("taskly_weekly_goal",10),rate=Math.min(100,Math.round(completed/goal*100));
 shell("Weekly Goals",'<div class="feature-grid"><div class="feature-card"><span class="label">TASKS COMPLETED THIS WEEK</span><div class="stat-number">'+completed+' / '+goal+'</div><div class="progress-track" style="margin:14px 0"><span style="width:'+rate+'%"></span></div><p class="feature-muted">'+rate+'% of your weekly target</p></div><div class="feature-card"><h3>Set your target</h3><form id="weeklyGoalForm" class="feature-row"><input class="feature-input" id="weeklyGoalInput" type="number" min="1" max="200" value="'+goal+'" required><button class="feature-btn primary">Save goal</button></form><p class="feature-muted">Your goal resets each Monday. Completion tracking starts with tasks completed after this update.</p></div></div>');
 $("#weeklyGoalForm").onsubmit=e=>{e.preventDefault();const n=Math.max(1,Math.min(200,Number($("#weeklyGoalInput").value)||10));localStorage.setItem("taskly_weekly_goal",n);weeklyView()};
}
function escapeText(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
if(localStorage.getItem("taskly_theme")==="light")document.body.classList.add("light");
const originalToggle=window.toggleTask;
if(typeof originalToggle==="function"){window.toggleTask=function(id){const before=tasks.find(t=>t.id===id);if(before&&!before.completed)xp+=10;localStorage.setItem("taskly_xp",xp);originalToggle(id)}}
setInterval(()=>{const due=tasks.filter(t=>!t.completed&&t.deadline===new Date().toISOString().slice(0,10));if(due.length&&"Notification"in window&&Notification.permission==="granted"&&!sessionStorage.getItem("taskly_due_notice")){new Notification("Taskly deadline reminder",{body:due.length+" task(s) due today."});sessionStorage.setItem("taskly_due_notice","1")}},60000);
})();
