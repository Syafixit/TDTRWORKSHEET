/* ============== RUMAH — Landing / Welcome ============== */
(function(){
const QUOTES=[
  ["Tenang bukan ketiadaan ribut, tapi keupayaan untuk bernafas dalamnya.","Refleksi"],
  ["Anda tak perlu sempurna hari ini — cuma jujur.","Pengingat lembut"],
  ["Langkah kecil yang konsisten ubah arah hidup. Bukan satu lompatan.","Tabiat"],
  ["Beri diri anda belas kasihan yang sama seperti anda beri kawan baik.","Self-compassion"],
  ["Badan anda tahu sebelum minda anda akui. Dengar isyarat itu.","Kesedaran"],
  ["Anda dah sampai di sini. Itu sahaja dah satu kemenangan.","Penghargaan"],
  ["Hari ini cukup walaupun anda hanya buat satu perkara untuk jaga diri.","Kemurahan hati"],
  ["Sempadan bukan dinding — ia jambatan ke hubungan yang lebih sihat.","Sempadan"],
  ["Stres bukan musuh. Ia isyarat — tanya apa yang ia cuba beritahu.","Perspektif"],
  ["Anda bukan sendirian. Ramai berjalan di laluan sama, dalam diam.","Perpaduan"]
];

function todayQuote(){
  const d=new Date();
  const seed=d.getFullYear()*1000+d.getMonth()*40+d.getDate();
  return QUOTES[seed%QUOTES.length];
}
function greeting(){
  const h=new Date().getHours();
  if(h<5) return "Lewat malam ya?";
  if(h<12) return "Selamat pagi";
  if(h<15) return "Selamat tengah hari";
  if(h<19) return "Selamat petang";
  return "Selamat malam";
}
function fmt(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }

const PATH=[
  {id:"bab1_peta_stres", title:"Peta Stres Saya", sub:"Bab 1 · 10 minit", group:"permulaan"},
  {id:"bab2_peta_badan", title:"Peta Badan & Burnout", sub:"Bab 2 · 15 minit", group:"permulaan"},
  {id:"bab3_thought_record", title:"Tangkap Perangkap Fikiran", sub:"Bab 3 · 12 minit", group:"amalan"},
  {id:"bab4_toolkit_emosi", title:"Toolkit Darurat Emosi", sub:"Bab 4 · 20 minit", group:"amalan"},
  {id:"bab5_roda_kehidupan", title:"Roda Kehidupan", sub:"Bab 5 · 15 minit", group:"refleksi"},
  {id:"bab6_audit_gaya_hidup", title:"Audit Gaya Hidup", sub:"Bab 6 · 20 minit", group:"amalan"},
  {id:"bab7_peta_sokongan", title:"Peta Sokongan Sosial", sub:"Bab 7 · 12 minit", group:"refleksi"},
  {id:"bab8_habit_tracker", title:"Habit Tracker 30 Hari", sub:"Bab 8 · 15 minit", group:"amalan"},
  {id:"bab9_pelan_kecemasan", title:"Pelan Kecemasan", sub:"Bab 9 · 10 minit", group:"krisis"},
  {id:"bab10_blueprint_wellness", title:"Blueprint 90 Hari", sub:"Bab 10 · 25 minit", group:"refleksi"}
];

const html=`
  <div class="hero-card">
    <div class="hero-greet"><span id="rumahGreet">Selamat datang</span><span id="rumahNama"></span></div>
    <div class="hero-title">Tenang di tengah <span class="hero-accent">ribut</span></div>
    <div class="hero-sub">Tarik nafas perlahan-lahan. Anda dah berjaya datang ke sini hari ini — itu satu langkah berani.</div>

    <div class="hero-stats">
      <div class="hstat"><div class="hstat-n" id="rumahDays">0</div><div class="hstat-l">Hari ada rekod</div></div>
      <div class="hstat"><div class="hstat-n" id="rumahStreak">0</div><div class="hstat-l">Streak terpanjang</div></div>
      <div class="hstat"><div class="hstat-n" id="rumahCompletion">0%</div><div class="hstat-l">Worksheet diisi</div></div>
    </div>
  </div>

  <div class="section quote-card">
    <div class="quote-mark">“</div>
    <div class="quote-text" id="rumahQuote">—</div>
    <div class="quote-tag" id="rumahQuoteTag">—</div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Mula di sini</h2></div>
    <p class="hint">Pilihan disusun ikut perjalanan. Tiada keperluan ikut urutan — pilih yang paling relevan sekarang.</p>
    <button class="cta-card" onclick="App.go('bab1_peta_stres')">
      <div class="cta-icon">📈</div>
      <div class="cta-body">
        <div class="cta-title">Rekod stres hari ini</div>
        <div class="cta-sub">Buka Jurnal Stres Harian — 1 minit</div>
      </div>
      <div class="cta-arrow">›</div>
    </button>
    <button class="cta-card" onclick="App.go('rekod_sejarah')">
      <div class="cta-icon">📅</div>
      <div class="cta-body">
        <div class="cta-title">Lihat perjalanan saya</div>
        <div class="cta-sub">Kalendar semua rekod anda</div>
      </div>
      <div class="cta-arrow">›</div>
    </button>
    <button class="cta-card crisis" onclick="App.go('bab9_pelan_kecemasan')">
      <div class="cta-icon">🆘</div>
      <div class="cta-body">
        <div class="cta-title">Saya perlukan bantuan sekarang</div>
        <div class="cta-sub">Pelan kecemasan & nombor talian</div>
      </div>
      <div class="cta-arrow">›</div>
    </button>
  </div>

  <div class="section">
    <div class="section-head"><h2>Perjalanan 10 Bab</h2></div>
    <p class="hint">Setiap kad tunjuk progres anda. Tap untuk teruskan.</p>
    <div id="rumahPath" class="path-list"></div>
  </div>

  <div class="footer-note">Tenang Di Tengah Ribut — Panduan praktikal pengurusan stres & kecemasan untuk rakyat Malaysia. Privasi anda terpelihara: tiada akaun, tiada email. Anonymous by design. 🌿</div>`;

const M={
  id:"rumah", nav:"🏡 Rumah", title:"", subtitle:"", skipDateHeader:true, hideHeader:true,
  html,
  init(root){
    document.getElementById("rumahGreet").textContent=greeting();
    const nama=(localStorage.getItem("calm_nama")||"").trim();
    document.getElementById("rumahNama").textContent = nama? ", "+nama+" 🌿" : " 🌿";
    const [q,tag]=todayQuote();
    document.getElementById("rumahQuote").textContent=q;
    document.getElementById("rumahQuoteTag").textContent=tag;
    this.renderPath();
    this.renderStats();
  },
  renderPath(){
    const el=document.getElementById("rumahPath"); if(!el) return;
    el.innerHTML = PATH.map((p,i)=>{
      const pct=this.completionFor(p.id);
      const barCls=pct>=70?"hi":(pct>=30?"mid":"lo");
      const num=i+1;
      const groupChip={
        permulaan:"🌱 Permulaan", amalan:"🛠️ Amalan", krisis:"🆘 Krisis", refleksi:"🌿 Refleksi"
      }[p.group]||"";
      return `<button class="path-card" onclick="App.go('${p.id}')">
        <div class="path-num">${String(num).padStart(2,'0')}</div>
        <div class="path-body">
          <div class="path-title">${p.title}</div>
          <div class="path-sub"><span class="path-chip">${groupChip}</span> · ${p.sub}</div>
          <div class="path-bar"><div class="path-bar-fill ${barCls}" style="width:${pct}%"></div></div>
        </div>
        <div class="path-arrow">›</div>
      </button>`;
    }).join("");
  },
  completionFor(id){
    try{
      const raw=localStorage.getItem("ws_"+id); if(!raw) return 0;
      const data=JSON.parse(raw);
      const keys=Object.keys(data);
      if(!keys.length) return 0;
      let filled=0, total=0;
      keys.forEach(k=>{
        const v=data[k]; total++;
        if(typeof v==="boolean"){ if(v) filled++; }
        else if(typeof v==="string" && v.trim()){ filled++; }
        else if(typeof v==="number"){ filled++; }
      });
      if(!total) return 0;
      return Math.min(100, Math.round(filled/total*100));
    }catch(e){ return 0; }
  },
  renderStats(){
    let days=0, sumPct=0;
    PATH.forEach(p=>{ sumPct += this.completionFor(p.id); });
    const overall = Math.round(sumPct/PATH.length);
    // hari rekod dari stress logs
    try{
      const raw=localStorage.getItem("stresslogs_bab1_peta_stres");
      if(raw){ days = Object.keys(JSON.parse(raw)).length; }
    }catch(e){}
    // streak (longest dari stress logs)
    let streak=0, cur=0;
    try{
      const raw=localStorage.getItem("stresslogs_bab1_peta_stres");
      if(raw){
        const obj=JSON.parse(raw);
        const dates=Object.keys(obj).sort();
        let prev=null;
        dates.forEach(d=>{
          if(prev){
            const pd=new Date(prev), cd=new Date(d);
            const diff=(cd-pd)/(1000*60*60*24);
            if(diff===1) cur++; else cur=1;
          } else cur=1;
          if(cur>streak) streak=cur;
          prev=d;
        });
      }
    }catch(e){}
    document.getElementById("rumahDays").textContent=days;
    document.getElementById("rumahStreak").textContent=streak;
    document.getElementById("rumahCompletion").textContent=overall+"%";
  }
};
window.RUMAH=M;
registerWorksheet(M);
})();
