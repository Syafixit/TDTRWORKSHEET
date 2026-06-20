/* ============== BAB 1 — Peta Stres Saya + Jurnal Stres Harian ============== */
(function(){
const DOMAINS=[
  {title:"Domain 1: Kerja / Pelajaran", ph:{
    cetus:"cth: Deadline menumpuk / Banyak kerja serentak / Exam minggu depan",
    badan:"cth: Bahu tegang / Sakit kepala / Susah tidur",
    fikir:"cth: “Tak sempat nak siap” / “Aku akan gagal”",
    laku:"cth: Procrastinate / Scroll phone / Skip makan"}},
  {title:"Domain 2: Hubungan (Keluarga / Rakan / Pasangan)", ph:{
    cetus:"cth: Konflik dengan ibu bapa / Salah faham dengan kawan / Rasa diabaikan",
    badan:"cth: Perut tak selesa / Dada sesak / Sebak",
    fikir:"cth: “Mereka tak faham aku” / “Aku keseorangan”",
    laku:"cth: Diam, tarik diri / Elak berjumpa / Mudah marah"}},
  {title:"Domain 3: Diri Sendiri (Jangkaan, Tekanan Dalaman, Tabiat)", ph:{
    cetus:"cth: Rasa tak cukup baik / Terlalu perfect / Bandingkan diri dengan orang",
    badan:"cth: Dada berat / Letih sentiasa / Badan tegang",
    fikir:"cth: “Kenapa aku tak boleh?” / “Orang lain lebih hebat”",
    laku:"cth: Kerja lebih masa / Tak rehat / Kritik diri sendiri"}}
];
const DOW=["Isn","Sel","Rab","Kha","Jum","Sab","Ahd"];
const LOGS_KEY="stresslogs_bab1_peta_stres";

const html=`
  <div class="note">Worksheet ni untuk diri anda sendiri. Tiada jawapan betul atau salah. Tulis dengan jujur. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open" id="tracker">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>📈 Jurnal Stres Harian</h2><span class="chev">▾</span></div>
    <p class="hint">Rekod tahap stres setiap hari. Pilih mana-mana tarikh untuk lihat balik, dan tengok ringkasan mingguan / bulanan. Data kekal walaupun tahun depan (bila Simpan Awan aktif).</p>
    <div class="card no-print">
      <div class="trk-nav">
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="navbtn" onclick="BAB1.trkShift(-1)">‹</button>
          <input type="date" id="trkDate" data-nosave min="2026-01-01" max="2030-12-31" onchange="BAB1.trkLoadDay()">
          <button class="navbtn" onclick="BAB1.trkShift(1)">›</button>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="chip" onclick="BAB1.trkToday()">Hari Ini</button>
          <button class="chip" onclick="BAB1.trkLastWeek()">Minggu Lepas</button>
        </div>
      </div>
      <div class="slider-row" style="margin-top:14px;">
        <input type="range" min="1" max="10" value="5" id="trkLevel" data-nosave oninput="BAB1.trkLevelLbl()">
        <span class="val" id="trkVal">5</span>
      </div>
      <textarea id="trkNote" data-nosave placeholder="Nota ringkas — apa yang berlaku hari ini?"></textarea>
      <button class="iconbtn primary" style="width:100%;justify-content:center;margin-top:10px;" onclick="BAB1.trkSave()">💾 Simpan Hari Ini</button>
      <div id="trkMsg" style="font-size:13px;text-align:center;margin-top:7px;color:var(--teal-dark);"></div>
    </div>
    <div class="tabs no-print">
      <button class="tab active" id="tabWeek" onclick="BAB1.trkView('week')">Ringkasan Minggu</button>
      <button class="tab" id="tabMonth" onclick="BAB1.trkView('month')">Ringkasan Bulan</button>
    </div>
    <div id="summary"></div>
    <div class="mb" style="margin-top:16px;"><label>Refleksi: Apa yang berbeza pada hari yang paling berat?</label>
      <textarea id="a_refleksi" placeholder="Apa yang berlaku pada hari tu? Apa yang buat ia berbeza?"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Peta Stres Saya</h2><span class="chev">▾</span></div>
    <p class="hint">Fikirkan minggu atau bulan lepas. Isi setiap kotak dengan jujur.</p>
    <div id="domains"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Trigger Utama Saya</h2><span class="chev">▾</span></div>
    <p class="hint">Berdasarkan Bahagian A, kenal pasti 3 pencetus stres paling besar dalam hidup anda sekarang.</p>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="c_trigger1" placeholder="cth: Beban kerja yang tak munasabah"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="c_trigger2" placeholder="cth: Masalah kewangan yang berterusan"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="c_trigger3" placeholder="cth: Kurang masa untuk diri sendiri"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Window of Tolerance</h2><span class="chev">▾</span></div>
    <p class="hint">Tandakan yang paling menggambarkan diri anda minggu ini.</p>
    <div class="check-group cg-overwhelm"><h3>Lebih kerap rasa TERLALU BANYAK (overwhelmed)</h3>
      <label class="chk"><input type="checkbox" data-k="d_ow1"> Mudah panik atau anxious</label>
      <label class="chk"><input type="checkbox" data-k="d_ow2"> Fikiran berputar-putar, sukar fokus</label>
      <label class="chk"><input type="checkbox" data-k="d_ow3"> Mudah menangis atau marah tanpa sebab besar</label>
      <label class="chk"><input type="checkbox" data-k="d_ow4"> Rasa badan sentiasa tegang</label></div>
    <div class="check-group cg-shutdown"><h3>Lebih kerap rasa MATI RASA (shutdown)</h3>
      <label class="chk"><input type="checkbox" data-k="d_sd1"> Rasa kosong, tak berminat dengan apa-apa</label>
      <label class="chk"><input type="checkbox" data-k="d_sd2"> Sukar rasa seronok walaupun buat benda yang disukai</label>
      <label class="chk"><input type="checkbox" data-k="d_sd3"> Rasa jauh dari orang sekeliling</label>
      <label class="chk"><input type="checkbox" data-k="d_sd4"> Malas untuk bergerak atau buat apa-apa</label></div>
    <div class="check-group cg-safe"><h3>Lebih kerap DALAM ZON SELAMAT</h3>
      <label class="chk"><input type="checkbox" data-k="d_sf1"> Boleh fikir dengan jernih</label>
      <label class="chk"><input type="checkbox" data-k="d_sf2"> Boleh hadap cabaran tanpa rasa lemas</label>
      <label class="chk"><input type="checkbox" data-k="d_sf3"> Emosi rasa stabil walaupun ada tekanan</label>
      <label class="chk"><input type="checkbox" data-k="d_sf4"> Boleh berehat dan nikmati masa lapang</label></div>
    <div class="mb"><label>Nota saya tentang zon saya sekarang</label><textarea id="d_nota"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Rumusan Minggu Ini</h2><span class="chev">▾</span></div>
    <p class="hint">Selepas seminggu memerhati diri, jawab soalan-soalan ini.</p>
    <div class="mb"><label>Corak yang saya perasan tentang stres saya</label><textarea id="e_corak" placeholder="cth: Stres saya naik bila kerja menumpuk hujung minggu / bila kurang tidur"></textarea></div>
    <div class="mb"><label>Satu perkara yang saya belajar tentang diri saya</label><textarea id="e_belajar" placeholder="cth: Saya rupanya pendam perasaan sampai badan jadi tegang"></textarea></div>
    <div class="mb"><label>Satu tindakan kecil yang saya akan ambil</label><textarea id="e_tindakan" placeholder="cth: Tidur lebih awal / Berehat 10 minit setiap petang / Cakap dengan kawan"></textarea></div>
  </div>

  <div class="finish"><b>✅ Tahniah.</b> Dengan habiskan worksheet ni, anda dah tengok diri sendiri dengan jujur — permulaan yang kukuh. Simpan worksheet ni; anda akan merujuknya semula di Bab 10.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab1_peta_stres", nav:"Bab 1 · Peta Stres", title:"Peta Stres Saya", subtitle:"Worksheet Bab 1",
  html,
  rowCount:[0,0,0], trkLogs:{}, trkMode:"week",

  init(root){
    this.rowCount=[0,0,0];
    const domEl=root.querySelector("#domains"); domEl.innerHTML="";
    DOMAINS.forEach((dom,di)=>{
      domEl.insertAdjacentHTML("beforeend",
        `<div class="domain-title">${dom.title}</div><div id="dom_${di}"></div>
         <div class="row-actions no-print">
           <button type="button" class="add-row" onclick="BAB1.addRow(${di})">+ Tambah pencetus</button>
           <button type="button" class="del-row" id="del_${di}" onclick="BAB1.removeRow(${di})">– Buang pencetus</button>
         </div>`);
      this.addRow(di);
    });
    this.trkLogs=this.loadLogs(); this.trkMode="week";
  },
  beforeApply(data){ this.ensureRows(data); },
  afterLoad(){
    const d=document.getElementById("trkDate"); if(d) d.value=App.clampDate(this.fmt(new Date()));
    this.trkLoadDay();
    if(App.kod()) this.trkFetchRange().then(()=>this.renderSummary());
  },
  async onCloudActivate(kod, sb){ for(const [date,e] of Object.entries(this.loadLogs())){ await sb.rpc("save_stress_log",{p_kod:kod,p_date:date,p_level:e.level,p_note:e.note||null}); } },

  /* ----- domains ----- */
  rowHTML(di,r){ const p=DOMAINS[di].ph; return `<div class="card"><span class="card-tag">${r}</span>
    <div class="mb"><label>Pencetus Stres</label><textarea data-k="b_${di}_${r}_cetus" placeholder="${p.cetus}"></textarea></div>
    <div class="grid2"><div><label>Reaksi Badan</label><textarea data-k="b_${di}_${r}_badan" placeholder="${p.badan}"></textarea></div>
      <div><label>Reaksi Fikiran</label><textarea data-k="b_${di}_${r}_fikir" placeholder="${p.fikir}"></textarea></div></div>
    <div class="mb" style="margin-top:10px;"><label>Reaksi Tingkah Laku</label><textarea data-k="b_${di}_${r}_laku" placeholder="${p.laku}"></textarea></div></div>`; },
  addRow(di){ this.rowCount[di]++; document.getElementById("dom_"+di).insertAdjacentHTML("beforeend", this.rowHTML(di,this.rowCount[di])); this.updateDel(di); },
  removeRow(di){ if(this.rowCount[di]<=1) return; document.getElementById("dom_"+di).lastElementChild.remove(); this.rowCount[di]--; this.updateDel(di); App.save(); },
  updateDel(di){ const b=document.getElementById("del_"+di); if(b) b.disabled=this.rowCount[di]<=1; },
  ensureRows(data){ for(let di=0;di<DOMAINS.length;di++){ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^b_"+di+"_(\\d+)_")); if(m)mx=Math.max(mx,+m[1]);}); while(this.rowCount[di]<mx) this.addRow(di); } },

  /* ----- tracker ----- */
  loadLogs(){ try{ return JSON.parse(localStorage.getItem(LOGS_KEY)||"{}"); }catch(e){ return {}; } },
  persistLogs(){ localStorage.setItem(LOGS_KEY, JSON.stringify(this.trkLogs)); },
  fmt(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); },
  parseD(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); },
  fmtNice(ds){ if(!ds)return"-"; const d=this.parseD(ds); return d.getDate()+"/"+(d.getMonth()+1); },
  tdate(){ return document.getElementById("trkDate").value; },
  trkLevelLbl(){ document.getElementById("trkVal").textContent=document.getElementById("trkLevel").value; },
  trkLoadDay(){ const e=this.trkLogs[this.tdate()];
    document.getElementById("trkLevel").value=e?e.level:5;
    document.getElementById("trkNote").value=e?(e.note||""):"";
    this.trkLevelLbl();
    document.getElementById("trkMsg").textContent=e?"Direkod sebelum ni — boleh kemas kini.":"";
    this.renderSummary(); },
  trkShift(n){ const c=this.parseD(this.tdate()); c.setDate(c.getDate()+n); document.getElementById("trkDate").value=App.clampDate(this.fmt(c)); this.trkLoadDay(); },
  trkToday(){ document.getElementById("trkDate").value=App.clampDate(this.fmt(new Date())); this.trkLoadDay(); },
  trkLastWeek(){ const c=new Date(); c.setDate(c.getDate()-7); document.getElementById("trkDate").value=App.clampDate(this.fmt(c)); this.trkLoadDay(); },
  async trkSave(){ const date=this.tdate(), level=+document.getElementById("trkLevel").value, note=document.getElementById("trkNote").value;
    this.trkLogs[date]={level,note}; this.persistLogs(); this.renderSummary();
    const kod=App.kod();
    if(kod&&App.sb){ const {error}=await App.sb.rpc("save_stress_log",{p_kod:kod,p_date:date,p_level:level,p_note:note||null});
      document.getElementById("trkMsg").textContent=error?("Disimpan dlm telefon. Awan gagal: "+error.message):"Disimpan ke telefon & awan ✓"; }
    else document.getElementById("trkMsg").textContent="Disimpan dlm telefon ✓ (Aktifkan Simpan Awan untuk kekal selamanya)"; },
  weekRange(date){ const d=this.parseD(date), wd=(d.getDay()+6)%7, mon=new Date(d); mon.setDate(d.getDate()-wd); const a=[]; for(let i=0;i<7;i++){const x=new Date(mon);x.setDate(mon.getDate()+i);a.push(this.fmt(x));} return a; },
  monthRange(date){ const d=this.parseD(date),y=d.getFullYear(),m=d.getMonth(),n=new Date(y,m+1,0).getDate(); const a=[]; for(let i=1;i<=n;i++)a.push(this.fmt(new Date(y,m,i))); return a; },
  barCls(v){ return v>=7?"hi":(v>=4?"mid":"lo"); },
  renderSummary(){ const date=this.tdate(); const days=this.trkMode==="week"?this.weekRange(date):this.monthRange(date);
    let sum=0,cnt=0,hi=0,mxV=-1,mxD="";
    const bars=days.map((ds,i)=>{ const e=this.trkLogs[ds],v=e?e.level:0;
      if(e){sum+=v;cnt++;if(v>=7)hi++;if(v>mxV){mxV=v;mxD=ds;}}
      const h=v?Math.round(v/10*100):0;
      const lbl=this.trkMode==="week"?DOW[i]:((i%5===0||i===days.length-1)?String(i+1):"");
      const sel=ds===date?"outline:2px solid var(--coral);outline-offset:1px;":"";
      const eb=e?"":"background:#E2E9EC;";
      return `<div class="bar-wrap"><div class="bar ${e?this.barCls(v):''}" style="height:${h}%;${eb}${sel}"></div><div class="bar-lbl">${lbl}</div></div>`; }).join("");
    const avg=cnt?(sum/cnt).toFixed(1):"—"; const lbl=this.trkMode==="week"?"Purata Minggu":"Purata Bulan";
    document.getElementById("summary").innerHTML=`<div class="sum-stat">
      <div class="stat-box"><div class="n">${avg}</div><div class="l">${lbl} (/10)</div></div>
      <div class="stat-box"><div class="n">${cnt}</div><div class="l">Hari direkod</div></div>
      <div class="stat-box"><div class="n">${hi}</div><div class="l">Hari stres tinggi (≥7)</div></div></div>
      <div class="bars">${bars}</div>
      ${cnt?`<p class="hint" style="margin-top:6px;">Hari paling berat: <b>${this.fmtNice(mxD)}</b> (${mxV}/10).</p>`:`<p class="hint" style="margin-top:6px;">Belum ada rekod untuk tempoh ni. Mula rekod di atas.</p>`}`; },
  async trkView(mode){ this.trkMode=mode;
    document.getElementById("tabWeek").classList.toggle("active",mode==="week");
    document.getElementById("tabMonth").classList.toggle("active",mode==="month");
    await this.trkFetchRange(); this.renderSummary(); },
  async trkFetchRange(){ const kod=App.kod(); if(!kod||!App.sb) return;
    const days=this.trkMode==="week"?this.weekRange(this.tdate()):this.monthRange(this.tdate());
    const {data,error}=await App.sb.rpc("get_stress_logs",{p_kod:kod,p_from:days[0],p_to:days[days.length-1]});
    if(error||!data) return; data.forEach(r=>{ this.trkLogs[r.log_date]={level:r.level,note:r.note}; }); this.persistLogs(); }
};
window.BAB1=M;
registerWorksheet(M);
})();
