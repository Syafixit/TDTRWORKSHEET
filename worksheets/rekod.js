/* ============== REKOD / SEJARAH — Kalendar Bulanan ============== */
(function(){
const HEADERS=["Isn","Sel","Rab","Kha","Jum","Sab","Ahd"];
const SHEET_LABELS={
  bab1_peta_stres:"Bab 1 · Peta Stres",
  bab2_peta_badan:"Bab 2 · Peta Badan",
  bab3_thought_record:"Bab 3 · Thought Record",
  bab4_toolkit_emosi:"Bab 4 · Toolkit Emosi",
  bab5_roda_kehidupan:"Bab 5 · Roda Kehidupan",
  bab6_audit_gaya_hidup:"Bab 6 · Audit Gaya Hidup",
  bab7_peta_sokongan:"Bab 7 · Peta Sokongan",
  bab8_habit_tracker:"Bab 8 · Habit Tracker",
  bab9_pelan_kecemasan:"Bab 9 · Pelan Kecemasan",
  bab10_blueprint_wellness:"Bab 10 · Blueprint 90 Hari"
};
const MONTHS=["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"];

function fmt(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function parseD(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function inRange(s){ return s>="2026-01-01" && s<="2030-12-31"; }
function clampYM(y,m){ // clamp navigation
  let d=new Date(y,m,1);
  if(d<new Date(2026,0,1)) d=new Date(2026,0,1);
  if(d>new Date(2030,11,1)) d=new Date(2030,11,1);
  return {y:d.getFullYear(), m:d.getMonth()};
}
function barCls(v){ return v>=7?"hi":(v>=4?"mid":"lo"); }

const html=`
  <div class="note">Tab ini tunjuk semua tarikh yang anda dah isi — dari Jurnal Stres Harian sampai tracker dalam Bab 2, 4, 6, 8, dan 10. Klik tarikh untuk lihat ringkasan.</div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>📅 Kalendar Saya</h2><span class="chev">▾</span></div>

    <div class="cal-monthbar">
      <button class="navbtn" onclick="REKOD.shift(-1)" title="Bulan sebelumnya">‹</button>
      <div class="month-label" id="calMonth">—</div>
      <button class="navbtn" onclick="REKOD.shift(1)" title="Bulan seterusnya">›</button>
      <button class="chip" onclick="REKOD.today()">Hari Ini</button>
    </div>

    <div class="sum-stat">
      <div class="stat-box"><div class="n" id="calStatDays">0</div><div class="l">Hari ada rekod</div></div>
      <div class="stat-box"><div class="n" id="calStatAvg">—</div><div class="l">Purata stres /10</div></div>
      <div class="stat-box"><div class="n" id="calStatStreak">0</div><div class="l">Streak terpanjang</div></div>
    </div>

    <div class="cal-grid" id="calHead"></div>
    <div class="cal-grid" id="calDays" style="margin-top:4px;"></div>

    <div class="cal-legend">
      <span><span class="dot" style="background:#5BB873"></span>Stres rendah (1–3)</span>
      <span><span class="dot" style="background:#E8A93C"></span>Sederhana (4–6)</span>
      <span><span class="dot" style="background:#E2685A"></span>Tinggi (7–10)</span>
      <span><span class="dot" style="background:#7BA7C0"></span>Ada worksheet</span>
    </div>

    <div id="calDetail"></div>

    <div id="calStatus" style="font-size:13px;color:var(--muted);text-align:center;margin-top:10px;"></div>
  </div>`;

const M={
  id:"rekod_sejarah",
  nav:"📅 Rekod / Sejarah",
  title:"Rekod / Sejarah",
  subtitle:"Gambaran Perjalanan Anda",
  skipDateHeader:true,
  html,
  view:{y:new Date().getFullYear(), m:new Date().getMonth()},
  selected:null,
  data:{}, // { 'YYYY-MM-DD': { stress:{level,note}, sheets:Set } }
  sheetsLoaded:false,

  async init(root){
    // header hari
    document.getElementById("calHead").innerHTML = HEADERS.map(h=>`<div class="cal-head">${h}</div>`).join("");
    this.view={y:new Date().getFullYear(), m:new Date().getMonth()};
    this.view = clampYM(this.view.y, this.view.m);
    this.selected=null;
    this.data={};
    this.gatherLocal();
    this.render();
    // tarik dari awan (background)
    await this.gatherCloud();
    this.render();
  },
  afterLoad(){ /* nothing to apply */ },

  /* ---------- agregat data ---------- */
  ensureSlot(date){ if(!this.data[date]) this.data[date]={stress:null, sheets:new Set()}; return this.data[date]; },

  gatherLocal(){
    // stress logs (Bab 1)
    try{
      const raw=localStorage.getItem("stresslogs_bab1_peta_stres");
      if(raw){ const logs=JSON.parse(raw);
        Object.entries(logs).forEach(([d,e])=>{ if(inRange(d)){ const s=this.ensureSlot(d); s.stress={level:e.level,note:e.note||""}; s.sheets.add("bab1_peta_stres"); } }); }
    }catch(e){}
    // worksheets — scan setiap blob ws_*, ambil semua kunci *_date dan meta_tarikh
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k||!k.startsWith("ws_")) continue;
      const sheetId=k.slice(3);
      try{
        const blob=JSON.parse(localStorage.getItem(k)||"{}");
        Object.entries(blob).forEach(([key,val])=>{
          if(typeof val!=="string") return;
          if(!(/_date$/.test(key) || key==="meta_tarikh")) return;
          if(!/^\d{4}-\d{2}-\d{2}$/.test(val)) return;
          if(!inRange(val)) return;
          this.ensureSlot(val).sheets.add(sheetId);
        });
      }catch(e){}
    }
  },

  async gatherCloud(){
    if(!App.kod() || !App.sb) return;
    const status=document.getElementById("calStatus"); if(status) status.textContent="Memuat dari awan…";
    try{
      // stress logs (full julat 2026–2030)
      const {data:logs}=await App.sb.rpc("get_stress_logs",{p_kod:App.kod(),p_from:"2026-01-01",p_to:"2030-12-31"});
      if(logs) logs.forEach(r=>{ const s=this.ensureSlot(r.log_date); s.stress={level:r.level,note:r.note||""}; s.sheets.add("bab1_peta_stres"); });
      // worksheets — fetch sekali untuk semua bab
      if(!this.sheetsLoaded){
        for(const id of Object.keys(SHEET_LABELS)){
          const {data:blob}=await App.sb.rpc("get_worksheet",{p_kod:App.kod(),p_worksheet_id:id});
          if(!blob) continue;
          Object.entries(blob).forEach(([key,val])=>{
            if(typeof val!=="string") return;
            if(!(/_date$/.test(key) || key==="meta_tarikh")) return;
            if(!/^\d{4}-\d{2}-\d{2}$/.test(val)) return;
            if(!inRange(val)) return;
            this.ensureSlot(val).sheets.add(id);
          });
        }
        this.sheetsLoaded=true;
      }
      if(status) status.textContent="";
    }catch(e){
      if(status) status.textContent="Gagal muat awan. Tunjuk data telefon sahaja.";
    }
  },

  /* ---------- navigasi ---------- */
  shift(n){
    let m=this.view.m+n, y=this.view.y;
    if(m<0){m=11;y--;} if(m>11){m=0;y++;}
    this.view=clampYM(y,m); this.selected=null; this.render();
  },
  today(){ const d=new Date(); this.view=clampYM(d.getFullYear(), d.getMonth()); this.selected=fmt(d); this.render(); },

  /* ---------- render ---------- */
  render(){
    const {y,m}=this.view;
    document.getElementById("calMonth").textContent=MONTHS[m]+" "+y;

    // first day, last day
    const first=new Date(y,m,1);
    const last=new Date(y,m+1,0);
    // weekday Isnin=0 ... Ahd=6
    const fwd=(first.getDay()+6)%7;
    const daysIn=last.getDate();

    // bina 6 baris × 7 kolum
    const cells=[];
    for(let i=0;i<fwd;i++){
      const pd=new Date(y,m,1-(fwd-i));
      cells.push({date:fmt(pd), day:pd.getDate(), muted:true});
    }
    for(let d=1;d<=daysIn;d++){
      cells.push({date:fmt(new Date(y,m,d)), day:d, muted:false});
    }
    while(cells.length<42){
      const nd=new Date(y,m,daysIn+(cells.length-(fwd+daysIn))+1);
      cells.push({date:fmt(nd), day:nd.getDate(), muted:true});
    }

    const todayStr=fmt(new Date());
    const html=cells.map(c=>{
      const slot=this.data[c.date];
      const cls=["cal-day"];
      if(c.muted) cls.push("muted");
      if(c.date===todayStr) cls.push("today");
      if(slot && !c.muted) cls.push("has-entry");
      if(c.date===this.selected) cls.push("sel");
      let dots="";
      if(slot && !c.muted){
        if(slot.stress) dots+=`<span class="cal-dot ${barCls(slot.stress.level)}"></span>`;
        const sheetCount = [...slot.sheets].filter(s=>s!=="bab1_peta_stres").length;
        if(sheetCount>0 && !slot.stress) dots+=`<span class="cal-dot sheet"></span>`;
        else if(sheetCount>0) dots+=`<span class="cal-dot sheet"></span>`;
      }
      const onClick = c.muted ? "" : `onclick="REKOD.pick('${c.date}')"`;
      return `<div class="${cls.join(' ')}" ${onClick}><div>${c.day}</div><div class="cal-dots">${dots}</div></div>`;
    }).join("");
    document.getElementById("calDays").innerHTML=html;

    this.renderStats();
    this.renderDetail();
  },

  renderStats(){
    const {y,m}=this.view;
    let days=0, sum=0, cnt=0, bestStreak=0, currentStreak=0;
    const daysIn=new Date(y,m+1,0).getDate();
    for(let d=1;d<=daysIn;d++){
      const slot=this.data[fmt(new Date(y,m,d))];
      const hasAny = slot && (slot.stress || slot.sheets.size>0);
      if(hasAny) days++;
      if(slot && slot.stress){ sum+=slot.stress.level; cnt++; currentStreak++; if(currentStreak>bestStreak) bestStreak=currentStreak; }
      else currentStreak=0;
    }
    document.getElementById("calStatDays").textContent=days;
    document.getElementById("calStatAvg").textContent=cnt?(sum/cnt).toFixed(1):"—";
    document.getElementById("calStatStreak").textContent=bestStreak;
  },

  pick(date){ this.selected=date; this.render(); },

  renderDetail(){
    const el=document.getElementById("calDetail");
    if(!this.selected){ el.innerHTML=""; return; }
    const slot=this.data[this.selected];
    const d=parseD(this.selected);
    const niceDate=`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if(!slot){ el.innerHTML=`<div class="cal-detail"><h3>${niceDate}</h3><div class="meta">Tiada rekod pada tarikh ini.</div></div>`; return; }
    let body="";
    if(slot.stress){
      const cls=barCls(slot.stress.level);
      const word=cls==="hi"?"Tinggi":(cls==="mid"?"Sederhana":"Rendah");
      body+=`<div style="margin:4px 0 10px;"><b>Tahap stres:</b> ${slot.stress.level}/10 (${word})${slot.stress.note?`<br><b>Nota:</b> ${slot.stress.note}`:""}</div>`;
    }
    const sheets=[...slot.sheets].filter(s=>s!=="bab1_peta_stres" || !slot.stress);
    if(sheets.length){
      body+=`<div style="margin-top:8px;"><b>Worksheet yang ada tarikh ini:</b><br>`+
        sheets.map(s=>`<span class="cal-sheet-chip" onclick="App.go('${s}')">${SHEET_LABELS[s]||s}</span>`).join("")+`</div>`;
    }
    el.innerHTML=`<div class="cal-detail"><h3>${niceDate}</h3>${body}</div>`;
  }
};
window.REKOD=M;
registerWorksheet(M);
})();
