let responsableActuel="pasteur";
let editingId={msg:null,vocal:null,prayer:null,annonce:null};
let mediaRecorder=null,audioChunks=[],recordedBlob=null,timer=null,sec=0;

function key(t){ return `micla_${responsableActuel}_${t}`; }
function getData(k){ try{ let d=JSON.parse(localStorage.getItem(k)); return Array.isArray(d)?d:[]; }catch{ return []; } }
function saveData(k,d){
  const j=JSON.stringify(d);
  localStorage.setItem(k,j);
  // SAUVEGARDE DOUBLE pour compatibilité avec eglises.html
  if(k.includes("_annonces")){ localStorage.setItem(`micla_${responsableActuel}_announcements`,j); }
  if(k.includes("_vocaux")){ localStorage.setItem(`micla_${responsableActuel}_audio`,j); }
  if(k.includes("_prieres")){ localStorage.setItem(`micla_${responsableActuel}_prayers`,j); }
}
function genId(){return Date.now().toString()+Math.random().toString(36).slice(2,6);}
function esc(t){return String(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function toast(m){ let t=document.getElementById("toast"); t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2500); }
function fmtDate(d){ try{return new Date(d).toLocaleDateString("fr-FR");}catch{return "";}}

function changeResponsable(){
  responsableActuel=document.getElementById("responsable").value;
  loadAll(); toast("Mode "+responsableActuel);
}
function logout(){ localStorage.removeItem("micla_admin_auth"); location.href="admin.html"; }

// MESSAGES -> bouton Message
function saveMessage(){
  let title=document.getElementById("messageTitle").value.trim();
  let author=document.getElementById("messageAuthor").value.trim();
  let content=document.getElementById("messageContent").value.trim();
  if(!title||!content) return toast("Titre + message requis");
  let arr=getData(key("messages"));
  if(editingId.msg){ let i=arr.findIndex(x=>x.id===editingId.msg); if(i>-1) arr[i]={...arr[i],title,author,content}; editingId.msg=null; }
  else arr.unshift({id:genId(),title,author,content,date:new Date().toISOString()});
  saveData(key("messages"),arr);
  document.getElementById("messageTitle").value=""; document.getElementById("messageContent").value="";
  renderMessages(); toast("Message publié ✅ Va dans Église > Message");
}
function renderMessages(){
  let list=document.getElementById("messageList"); let arr=getData(key("messages"));
  list.innerHTML=arr.length?"":`<div class="empty">Aucun message</div>`;
  list.innerHTML+=arr.map(i=>`<div class="item"><div class="item-title">${esc(i.title)}</div><div class="item-meta">${esc(i.author)} • ${fmtDate(i.date)}</div><div class="item-content">${esc(i.content)}</div><div class="item-actions"><button class="btn btn-danger" onclick="delMsg('${i.id}')">Supprimer</button></div></div>`).join("");
}
function delMsg(id){ if(!confirm("Supprimer?")) return; saveData(key("messages"), getData(key("messages")).filter(x=>x.id!==id)); renderMessages(); }
function cancelMessageEdit(){ editingId.msg=null; document.getElementById("messageTitle").value=""; document.getElementById("messageAuthor").value=""; document.getElementById("messageContent").value=""; }

// VOCAUX -> bouton Vocaux
function fmtTime(s){ return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }
async function startRecording(){
  try{
    let stream=await navigator.mediaDevices.getUserMedia({audio:true});
    audioChunks=[]; mediaRecorder=new MediaRecorder(stream);
    mediaRecorder.ondataavailable=e=>{ if(e.data.size>0) audioChunks.push(e.data); };
    mediaRecorder.onstop=()=>{ recordedBlob=new Blob(audioChunks,{type:"audio/webm"}); let url=URL.createObjectURL(recordedBlob); let a=document.getElementById("audioPreview"); a.src=url; a.hidden=false; document.getElementById("publishVocalBtn").disabled=false; document.getElementById("recordStatus").textContent="Enregistrement terminé"; };
    mediaRecorder.start(); sec=0; document.getElementById("recordTimer").textContent="00:00";
    timer=setInterval(()=>{ sec++; document.getElementById("recordTimer").textContent=fmtTime(sec); },1000);
    document.getElementById("startRecordBtn").disabled=true; document.getElementById("stopRecordBtn").disabled=false;
    document.getElementById("recordStatus").textContent="🔴 Enregistrement...";
  }catch{ toast("Micro refusé"); }
}
function stopRecording(){
  if(mediaRecorder && mediaRecorder.state!=="inactive") mediaRecorder.stop();
  if(mediaRecorder?.stream) mediaRecorder.stream.getTracks().forEach(t=>t.stop());
  clearInterval(timer); document.getElementById("startRecordBtn").disabled=false; document.getElementById("stopRecordBtn").disabled=true;
}
function toBase64(blob){ return new Promise((res,rej)=>{ let r=new FileReader(); r.onloadend=()=>res(r.result); r.onerror=rej; r.readAsDataURL(blob); }); }
async function saveVocal(){
  if(!recordedBlob) return toast("Enregistre d'abord");
  let title=document.getElementById("vocalTitle").value.trim(); let author=document.getElementById("vocalAuthor").value.trim();
  if(!title) return toast("Titre requis");
  let audio=await toBase64(recordedBlob);
  let arr=getData(key("vocaux"));
  arr.unshift({id:genId(),title,author,audio,url:audio,date:new Date().toISOString(),duration:document.getElementById("recordTimer").textContent});
  saveData(key("vocaux"),arr);
  cancelVocalEdit(); renderVocaux(); toast("Vocal publié ✅ Va dans Église > Vocaux");
}
function renderVocaux(){
  let list=document.getElementById("vocalList"); let arr=getData(key("vocaux"));
  list.innerHTML=arr.length?"":`<div class="empty">Aucun vocal</div>`;
  list.innerHTML+=arr.map(i=>`<div class="item"><div class="item-title">${esc(i.title)}</div><audio controls src="${i.audio}"></audio><div class="item-actions"><button class="btn btn-danger" onclick="delVocal('${i.id}')">Supprimer</button></div></div>`).join("");
}
function delVocal(id){ if(!confirm("Supprimer?")) return; saveData(key("vocaux"), getData(key("vocaux")).filter(x=>x.id!==id)); renderVocaux(); }
function cancelVocalEdit(){
  recordedBlob=null; clearInterval(timer); sec=0;
  document.getElementById("vocalTitle").value=""; document.getElementById("vocalAuthor").value="";
  document.getElementById("recordTimer").textContent="00:00"; document.getElementById("recordStatus").textContent="Prêt pour l'enregistrement";
  let a=document.getElementById("audioPreview"); a.pause(); a.hidden=true; a.removeAttribute("src");
  document.getElementById("publishVocalBtn").disabled=true; document.getElementById("startRecordBtn").disabled=false; document.getElementById("stopRecordBtn").disabled=true;
}

// PRIERES -> bouton Prière
function savePrayer(){
  let title=document.getElementById("prayerTitle").value.trim();
  let author=document.getElementById("prayerAuthor").value.trim();
  let content=document.getElementById("prayerContent").value.trim();
  if(!title||!content) return toast("Titre + prière requis");
  let arr=getData(key("prieres"));
  arr.unshift({id:genId(),title,author,content,text:content,texte:content,date:new Date().toISOString()});
  saveData(key("prieres"),arr);
  document.getElementById("prayerTitle").value=""; document.getElementById("prayerContent").value="";
  renderPrayers(); toast("Prière publiée ✅ Va dans Église > Prière");
}
function renderPrayers(){
  let list=document.getElementById("prayerList"); let arr=getData(key("prieres"));
  list.innerHTML=arr.length?"":`<div class="empty">Aucune prière</div>`;
  list.innerHTML+=arr.map(i=>`<div class="item"><div class="item-title">${esc(i.title)}</div><div class="item-content">${esc(i.content||i.text)}</div><div class="item-actions"><button class="btn btn-danger" onclick="delPray('${i.id}')">Supprimer</button></div></div>`).join("");
}
function delPray(id){ if(!confirm("Supprimer?")) return; saveData(key("prieres"), getData(key("prieres")).filter(x=>x.id!==id)); renderPrayers(); }
function cancelPrayerEdit(){ document.getElementById("prayerTitle").value=""; document.getElementById("prayerAuthor").value=""; document.getElementById("prayerContent").value=""; }

// ANNONCES -> bouton Annonces
function saveAnnouncement(){
  let title=document.getElementById("announcementTitle").value.trim();
  let date=document.getElementById("announcementDate").value;
  let time=document.getElementById("announcementTime").value;
  let place=document.getElementById("announcementPlace").value.trim();
  let content=document.getElementById("announcementContent").value.trim();
  if(!title||!content) return toast("Titre + annonce requis");
  let arr=getData(key("annonces"));
  arr.unshift({id:genId(),title,titre:title,content,text:content,message:content,dateEvent:date,time,place,date:new Date().toISOString()});
  saveData(key("annonces"),arr);
  document.getElementById("announcementTitle").value=""; document.getElementById("announcementContent").value="";
  renderAnnouncements(); toast("Annonce publiée ✅ Va dans Église > Annonces");
}
function renderAnnouncements(){
  let list=document.getElementById("announcementList"); let arr=getData(key("annonces"));
  list.innerHTML=arr.length?"":`<div class="empty">Aucune annonce</div>`;
  list.innerHTML+=arr.map(i=>`<div class="item"><div class="item-title">${esc(i.title)}</div><div class="item-meta">${i.dateEvent||""} ${i.time||""} ${i.place||""}</div><div class="item-content">${esc(i.content||i.text)}</div><div class="item-actions"><button class="btn btn-danger" onclick="delAnnonce('${i.id}')">Supprimer</button></div></div>`).join("");
}
function delAnnonce(id){ if(!confirm("Supprimer?")) return; saveData(key("annonces"), getData(key("annonces")).filter(x=>x.id!==id)); renderAnnouncements(); }
function cancelAnnouncementEdit(){ document.getElementById("announcementTitle").value=""; document.getElementById("announcementDate").value=""; document.getElementById("announcementTime").value=""; document.getElementById("announcementPlace").value=""; document.getElementById("announcementContent").value=""; }

// CONTACTS
function saveCall(){
  let name=document.getElementById("callName").value.trim(); let num=document.getElementById("callNumber").value.trim();
  if(!num) return toast("Numéro requis");
  localStorage.setItem(key("call"), JSON.stringify({name,number:num})); renderCall(); toast("Appel enregistré");
}
function renderCall(){
  let d=null; try{d=JSON.parse(localStorage.getItem(key("call"))||"null");}catch{}
  let p=document.getElementById("callPreview");
  if(!d){ p.textContent="Aucun numéro."; return; }
  document.getElementById("callName").value=d.name||""; document.getElementById("callNumber").value=d.number||"";
  p.innerHTML=`<strong>📞 ${esc(d.name)}</strong><br>${esc(d.number)}`;
}
function saveWhatsApp(){
  let name=document.getElementById("whatsappName").value.trim(); let num=document.getElementById("whatsappNumber").value.trim();
  if(!num) return toast("Numéro requis");
  localStorage.setItem(key("whatsapp"), JSON.stringify({name,number:num})); renderWhatsApp(); toast("WhatsApp enregistré");
}
function renderWhatsApp(){
  let d=null; try{d=JSON.parse(localStorage.getItem(key("whatsapp"))||"null");}catch{}
  let p=document.getElementById("whatsappPreview");
  if(!d){ p.textContent="Aucun WhatsApp."; return; }
  document.getElementById("whatsappName").value=d.name||""; document.getElementById("whatsappNumber").value=d.number||"";
  p.innerHTML=`<strong>🟢 ${esc(d.name)}</strong><br>${esc(d.number)}`;
}
function loadAll(){ renderMessages(); renderVocaux(); renderPrayers(); renderAnnouncements(); renderCall(); renderWhatsApp(); }
document.addEventListener("DOMContentLoaded", loadAll);