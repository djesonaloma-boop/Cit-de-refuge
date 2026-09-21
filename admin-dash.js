/* =====================================================
   MI.C.L.A — ADMIN DASHBOARD CORRIGÉ
   Compatible avec eglises.html + eglise.html
   ===================================================== */

if(localStorage.getItem("micla_admin_auth") !== "true"){
    // window.location.replace("admin.html"); // décommente si tu veux protection
}

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");

function ouvrirMenu(){ sidebar.classList.add("open"); overlay.classList.add("show"); }
function fermerMenu(){ sidebar.classList.remove("open"); overlay.classList.remove("show"); }
menuBtn.addEventListener("click", ouvrirMenu);
overlay.addEventListener("click", fermerMenu);

document.querySelectorAll(".nav[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.page;
        if(page) window.location.href = page;
    });
});
document.querySelectorAll(".quick button").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.page;
        if(page) window.location.href = page;
    });
});

/* =========================
   COMPTAGE CORRIGÉ - LIT TOUTES LES CLÉS
========================= */
function getArr(k){ try{ let d=JSON.parse(localStorage.getItem(k)||"[]"); return Array.isArray(d)?d:[]; }catch{ return []; } }

function compterDonnees(){
    // Annonces = pasteur + berger + ancien + chansons
    let annonces = [
        ...getArr("micla_pasteur_annonces"), ...getArr("micla_berger_annonces"),
        ...getArr("micla_pasteur_announcements"), ...getArr("micla_berger_announcements"),
        ...getArr("micla_admin_annonces"), ...getArr("micla_annonces"),
        ...getArr("micla_chansons")
    ];
    let prieres = [
        ...getArr("micla_pasteur_prieres"), ...getArr("micla_berger_prieres"),
        ...getArr("micla_pasteur_prayers"), ...getArr("micla_berger_prayers"),
        ...getArr("micla_admin_prieres"), ...getArr("micla_prieres")
    ];
    let vocaux = [
        ...getArr("micla_pasteur_vocaux"), ...getArr("micla_berger_vocaux"),
        ...getArr("micla_pasteur_audio"), ...getArr("micla_berger_audio"),
        ...getArr("micla_admin_vocaux"), ...getArr("micla_vocaux")
    ];
    let messages = [
        ...getArr("micla_pasteur_messages"), ...getArr("micla_berger_messages"),
        ...getArr("micla_admin_messages"), ...getArr("micla_messages"),
        ...getArr("micla_chat_pasteur"), ...getArr("micla_chat_berger"),
        ...getArr("micla_private_chat_pasteur"), ...getArr("micla_private_chat_berger")
    ];

    document.getElementById("statAnnonces").textContent = annonces.length;
    document.getElementById("statPrieres").textContent = prieres.length;
    document.getElementById("statVocaux").textContent = vocaux.length;
    document.getElementById("statMessages").textContent = messages.length;

    // Met à jour la liste avec 3 points supprimer
    renderListes();
}

/* =========================
   LISTE AVEC 3 POINTS SUPPRIMER
========================= */
function renderListes(){
    // Crée une zone sous stats si elle n'existe pas
    let main = document.querySelector(".main");
    let old = document.getElementById("adminLists");
    if(!old){
        let div = document.createElement("div");
        div.id="adminLists";
        div.innerHTML=`
        <h2 class="section-title">Gérer le contenu (3 points → Supprimer)</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
            <div class="person"><h3>📢 Annonces</h3><div id="listAnnonces"></div></div>
            <div class="person"><h3>🙏 Prières</h3><div id="listPrieres"></div></div>
            <div class="person"><h3>🎙️ Vocaux</h3><div id="listVocaux"></div></div>
            <div class="person"><h3>💬 Messages</h3><div id="listMessages"></div></div>
        </div>
        <style>
        .item-row{display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:10px;padding:10px;margin:6px 0}
        .item-row b{color:var(--gold-light);font-size:13px}
        .dots{position:relative}
        .dots-btn{width:30px;height:30px;border-radius:50%;border:1px solid var(--border);background:transparent;color:#fff;cursor:pointer}
        .dots-menu{position:absolute;right:0;top:32px;background:#0b1c33;border:1px solid var(--border);border-radius:10px;display:none;z-index:5;min-width:130px}
        .dots-menu.show{display:block}
        .dots-menu button{width:100%;padding:10px;border:none;background:transparent;color:#ff7777;text-align:left;cursor:pointer;font-size:12px}
        .dots-menu button:hover{background:rgba(255,0,0,.1)}
        </style>
        `;
        main.appendChild(div);
    }

    function makeList(keys, containerId, type){
        let all=[];
        keys.forEach(k=>{ getArr(k).forEach(it=>{ all.push({...it,_key:k}); }); });
        let html="";
        if(!all.length) html=`<div style="color:var(--muted);font-size:12px;padding:10px">Il n'y a aucun ${type}</div>`;
        else{
            all.slice(0,20).forEach(it=>{
                html+=`
                <div class="item-row">
                    <div><b>${(it.title||it.titre||"Sans titre").substring(0,25)}</b><br><small style="color:var(--muted)">${(it.author||"")}</small></div>
                    <div class="dots">
                        <button class="dots-btn" onclick="this.nextElementSibling.classList.toggle('show')">⋮</button>
                        <div class="dots-menu">
                            <button onclick="supprimer('${it._key}','${it.id}')"><i class="fa-solid fa-trash"></i> Supprimer</button>
                        </div>
                    </div>
                </div>`;
            });
        }
        document.getElementById(containerId).innerHTML=html;
    }

    makeList(["micla_pasteur_annonces","micla_berger_annonces","micla_admin_annonces","micla_pasteur_announcements"],"listAnnonces","annonce");
    makeList(["micla_pasteur_prieres","micla_berger_prieres","micla_admin_prieres"],"listPrieres","prière");
    makeList(["micla_pasteur_vocaux","micla_berger_vocaux","micla_admin_vocaux","micla_pasteur_audio"],"listVocaux","vocal");
    makeList(["micla_pasteur_messages","micla_berger_messages","micla_admin_messages"],"listMessages","message");
}

// FONCTION SUPPRIMER appelée par le menu 3 points
function supprimer(key, id){
    if(!confirm("Supprimer définitivement ?")) return;
    let arr=getArr(key);
    arr=arr.filter(x=>String(x.id)!==String(id));
    localStorage.setItem(key, JSON.stringify(arr));
    // supprime aussi dans les doublons
    if(key.includes("annonces")){ localStorage.setItem("micla_pasteur_announcements", JSON.stringify(getArr("micla_pasteur_annonces"))); localStorage.setItem("micla_berger_announcements", JSON.stringify(getArr("micla_berger_annonces"))); }
    if(key.includes("vocaux")){ localStorage.setItem("micla_pasteur_audio", JSON.stringify(getArr("micla_pasteur_vocaux"))); }
    compterDonnees();
}

// Fermer les menus 3 points si on clique ailleurs
document.addEventListener("click", (e)=>{
    if(!e.target.classList.contains("dots-btn")){
        document.querySelectorAll(".dots-menu").forEach(m=>m.classList.remove("show"));
    }
});

logoutBtn.addEventListener("click", () => {
    if(!confirm("Voulez-vous vraiment vous déconnecter ?")) return;
    localStorage.removeItem("micla_admin_auth");
    window.location.replace("admin.html");
});

compterDonnees();
setInterval(compterDonnees, 3000);