/* ============== TENANG SEKARANG — latihan nafas berpandu + grounding 5-4-3-2-1 ============== */
(function(){
const LOG_KEY="calm_tenang_log";
const PATTERNS={
  sigh:{ nama:"Physiological Sigh", ringkas:"Tarik 2 + tarik pendek 1 · hembus panjang 6",
         nota:"Dua tarikan melalui hidung (yang kedua pendek untuk 'penuhkan' paru-paru), kemudian hembus perlahan melalui mulut. Teknik Bab 4 — paling pantas bila dada rasa sesak.",
         fasa:[["in","Tarik nafas (hidung)",2],["in2","Tarik sikit lagi",1],["out","Hembus perlahan (mulut)",6]] },
  box:{ nama:"Box Breathing", ringkas:"4 tarik · 4 tahan · 4 hembus · 4 tahan",
         nota:"Corak segi empat yang stabil. Sesuai sebelum mesyuarat, memandu atau bila fikiran berselerak.",
         fasa:[["in","Tarik nafas",4],["hold","Tahan",4],["out","Hembus",4],["hold2","Tahan",4]] },
  b478:{ nama:"Pernafasan 4-7-8", ringkas:"4 tarik · 7 tahan · 8 hembus",
         nota:"Sesuai sebelum tidur. Mula dengan 4 pusingan sahaja. Jika rasa pening, berhenti dan bernafas biasa.",
         fasa:[["in","Tarik nafas (hidung)",4],["hold","Tahan",7],["out","Hembus (mulut, bunyi 'whoosh')",8]] },
  slow:{ nama:"Nafas Perlahan 5-5", ringkas:"5 tarik · 5 hembus (≈6 nafas seminit)",
         nota:"Paling lembut. Bagus untuk 3–5 minit tenangkan badan secara umum.",
         fasa:[["in","Tarik nafas",5],["out","Hembus",5]] }
};
const GROUND=[
  [5,"benda yang anda NAMPAK","Sebut dalam hati: warna, bentuk, sesuatu yang kecil."],
  [4,"benda yang anda boleh SENTUH","Rasa tekstur: baju, meja, kaki di lantai."],
  [3,"bunyi yang anda DENGAR","Dekat dan jauh: kipas, kenderaan, nafas sendiri."],
  [2,"bau yang anda HIDU","Kalau tiada, ingat dua bau yang anda suka."],
  [1,"perkara baik tentang diri anda","Contoh: “Saya sedang cuba.” Itu sudah cukup."]
];

const html=`
  <div class="tn-hero">
    <div class="tn-eyebrow">Alat segera · 1–5 minit</div>
    <h1 class="tn-title">Tenang <span>sekarang</span></h1>
    <p class="tn-sub">Pilih corak, tekan Mula, dan ikut bulatan. Tak perlu fikir apa-apa lagi.</p>
  </div>

  <div class="tn-pills" id="tnPills" role="tablist"></div>
  <p class="tn-note" id="tnNote"></p>

  <div class="tn-stage" id="tnStage">
    <div class="tn-ring"><div class="tn-orb" id="tnOrb"></div></div>
    <div class="tn-center">
      <div class="tn-phase" id="tnPhase">Sedia</div>
      <div class="tn-count" id="tnCount">—</div>
    </div>
  </div>
  <div class="tn-meta"><span id="tnLeft">1:00</span> · <span id="tnRounds">0 pusingan</span></div>

  <div class="tn-controls">
    <div class="tn-dur" id="tnDur">
      <button data-min="1" class="on">1 min</button><button data-min="2">2 min</button><button data-min="3">3 min</button><button data-min="5">5 min</button>
    </div>
    <button class="tn-start" id="tnStart">Mula</button>
    <label class="tn-vib"><input type="checkbox" id="tnVib" data-nosave checked> Getar pada setiap fasa (Android)</label>
  </div>

  <div class="tn-after" id="tnAfter" hidden>
    <b>Selesai. Bagaimana rasa sekarang?</b>
    <div class="tn-feel">
      <button data-f="baik">😌 Lebih tenang</button><button data-f="sama">😐 Lebih kurang sama</button><button data-f="teruk">😣 Masih teruk</button>
    </div>
    <div class="tn-worse" id="tnWorse" hidden>
      Tak apa — kadang-kadang badan perlukan masa lebih. Cuba <b>Grounding 5-4-3-2-1</b> di bawah, atau hubungi seseorang.
      Jika anda rasa tidak selamat, tekan <b>SOS</b> atau hubungi <a href="tel:999">999</a>.
    </div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Grounding 5-4-3-2-1</h2></div>
    <p class="hint">Bila fikiran laju atau rasa panik, bawa perhatian kembali ke deria. Tekan setiap bulatan bila anda jumpa satu.</p>
    <div class="gr-card" id="grCard"></div>
  </div>

  <div class="section">
    <div class="section-head"><h2>Sesi terakhir anda</h2></div>
    <div id="tnLog" class="tn-log"></div>
  </div>

  <div class="footer-note">Latihan ini membantu menenangkan badan, bukan pengganti rawatan. Jika simptom berterusan lebih 2 minggu atau mengganggu hidup harian, berjumpa doktor atau kaunselor.</div>`;

let timer=null, wake=null, state=null;

function fmtTime(s){ s=Math.max(0,Math.ceil(s)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function readLog(){ try{ return JSON.parse(localStorage.getItem(LOG_KEY)||"[]"); }catch(e){ return []; } }
function writeLog(a){ localStorage.setItem(LOG_KEY, JSON.stringify(a.slice(-60))); }

const M={
  id:"tenang_sekarang", nav:"🫁 Tenang Sekarang", title:"", subtitle:"", skipDateHeader:true, hideHeader:true,
  html,
  init(root){
    this.pat = localStorage.getItem("calm_tenang_pat") || "sigh";
    this.min = 1;
    const pills=root.querySelector("#tnPills");
    pills.innerHTML=Object.entries(PATTERNS).map(([k,p])=>`<button role="tab" data-p="${k}"><b>${p.nama}</b><span>${p.ringkas}</span></button>`).join("");
    pills.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b||state) return; this.pat=b.dataset.p; localStorage.setItem("calm_tenang_pat",this.pat); this.paintPat(root); });
    root.querySelector("#tnDur").addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b||state) return; this.min=+b.dataset.min; root.querySelectorAll("#tnDur button").forEach(x=>x.classList.toggle("on",x===b)); root.querySelector("#tnLeft").textContent=fmtTime(this.min*60); });
    root.querySelector("#tnStart").addEventListener("click",()=> state? this.stop(root,false) : this.start(root));
    root.querySelector("#tnAfter").addEventListener("click",e=>{ const b=e.target.closest("button[data-f]"); if(!b) return; this.feel(root,b.dataset.f); });
    this.paintPat(root); this.renderGround(root, 0, 0); this.renderLog(root);
    root.querySelector("#tnLeft").textContent=fmtTime(this.min*60);
    // hentikan bila pengguna tukar halaman
    this._vis=()=>{ if(document.hidden && state) this.stop(root,false); };
    document.addEventListener("visibilitychange", this._vis);
  },
  paintPat(root){
    root.querySelectorAll("#tnPills button").forEach(b=>b.classList.toggle("on", b.dataset.p===this.pat));
    root.querySelector("#tnNote").textContent=PATTERNS[this.pat].nota;
  },
  async start(root){
    const p=PATTERNS[this.pat];
    root.querySelector("#tnAfter").hidden=true;
    root.querySelector("#tnStart").textContent="Berhenti";
    root.querySelector("#tnStage").classList.add("running");
    state={ i:0, left:0, total:this.min*60, elapsed:0, rounds:0, started:Date.now() };
    try{ if("wakeLock" in navigator) wake=await navigator.wakeLock.request("screen"); }catch(e){}
    this.phase(root, p);
    timer=setInterval(()=>this.tick(root,p), 250);
  },
  phase(root,p){
    const [kind,label,sec]=p.fasa[state.i];
    state.left=sec; state.phaseEnd=Date.now()+sec*1000;
    const orb=root.querySelector("#tnOrb");
    orb.style.transitionDuration=sec+"s";
    const scale = kind==="in"?0.86 : kind==="in2"?1 : (kind==="hold"||kind==="hold2")? orb.dataset.s||0.86 : 0.42;
    orb.dataset.s=scale; orb.style.transform="scale("+scale+")";
    orb.className="tn-orb "+kind;
    root.querySelector("#tnPhase").textContent=label;
    root.querySelector("#tnCount").textContent=sec;
    const vib=root.querySelector("#tnVib");
    if(vib && vib.checked && navigator.vibrate) navigator.vibrate(kind.startsWith("in")?40:(kind.startsWith("hold")?[20,60,20]:80));
  },
  tick(root,p){
    if(!state) return;
    const now=Date.now();
    const remain=(state.phaseEnd-now)/1000;
    root.querySelector("#tnCount").textContent=Math.max(1,Math.ceil(remain));
    const el=(now-state.started)/1000;
    root.querySelector("#tnLeft").textContent=fmtTime(state.total-el);
    if(remain<=0){
      state.i=(state.i+1)%p.fasa.length;
      if(state.i===0){ state.rounds++; root.querySelector("#tnRounds").textContent=state.rounds+" pusingan";
        if(el>=state.total){ this.stop(root,true); return; } }
      this.phase(root,p);
    }
  },
  stop(root,done){
    clearInterval(timer); timer=null;
    try{ wake && wake.release(); }catch(e){} wake=null;
    const s=state; state=null;
    const orb=root.querySelector("#tnOrb"); if(!orb) return;
    orb.style.transitionDuration="1.2s"; orb.style.transform="scale(.55)"; orb.className="tn-orb";
    root.querySelector("#tnStage").classList.remove("running");
    root.querySelector("#tnStart").textContent="Mula semula";
    root.querySelector("#tnPhase").textContent= done? "Bagus." : "Berhenti";
    root.querySelector("#tnCount").textContent= done? "✓" : "—";
    root.querySelector("#tnLeft").textContent=fmtTime(this.min*60);
    if(s && (Date.now()-s.started)>20000){
      this.pending={ t:new Date().toISOString(), p:this.pat, min:Math.round((Date.now()-s.started)/6000)/10, r:s.rounds };
      root.querySelector("#tnAfter").hidden=false; root.querySelector("#tnWorse").hidden=true;
      root.querySelector("#tnAfter").scrollIntoView({behavior:"smooth",block:"center"});
    }
  },
  feel(root,f){
    if(this.pending){ const a=readLog(); a.push(Object.assign(this.pending,{f})); writeLog(a); this.pending=null; this.renderLog(root); }
    root.querySelectorAll("#tnAfter .tn-feel button").forEach(b=>b.classList.toggle("on",b.dataset.f===f));
    root.querySelector("#tnWorse").hidden = f!=="teruk";
  },
  renderGround(root, step, got){
    const card=root.querySelector("#grCard"); if(!card) return;
    if(step>=GROUND.length){
      card.innerHTML=`<div class="gr-done">🌿 Anda kembali ke saat ini. Tarik satu nafas panjang, dan perasan kaki anda di lantai.<br><button class="iconbtn ghost" id="grAgain">Ulang</button></div>`;
      card.querySelector("#grAgain").onclick=()=>this.renderGround(root,0,0); return;
    }
    const [n,what,tip]=GROUND[step];
    card.innerHTML=`
      <div class="gr-step">Langkah ${step+1} / 5</div>
      <div class="gr-q"><span class="gr-n">${n}</span> ${what}</div>
      <div class="gr-tip">${tip}</div>
      <div class="gr-dots">${Array.from({length:n},(_,i)=>`<button class="gr-dot ${i<got?"on":""}" aria-label="${i+1}"></button>`).join("")}</div>
      <div class="gr-bar"><i style="width:${(step/5)*100}%"></i></div>`;
    card.querySelectorAll(".gr-dot").forEach((d,i)=>d.onclick=()=>{
      const g=Math.max(got,i+1);
      if(g>=n) setTimeout(()=>this.renderGround(root,step+1,0),350);
      this.renderGround(root,step,g);
    });
  },
  renderLog(root){
    const el=root.querySelector("#tnLog"); if(!el) return;
    const a=readLog().slice(-5).reverse();
    if(!a.length){ el.innerHTML=`<p class="hint" style="margin:0">Belum ada sesi. Sesi lebih 20 saat akan direkod di sini (dalam telefon anda sahaja).</p>`; return; }
    const F={baik:"😌 Lebih tenang",sama:"😐 Sama",teruk:"😣 Masih teruk"};
    el.innerHTML=a.map(x=>{ const d=new Date(x.t); return `<div class="tn-row"><span>${d.toLocaleDateString("ms-MY",{day:"numeric",month:"short"})} ${d.toLocaleTimeString("ms-MY",{hour:"2-digit",minute:"2-digit"})}</span><span>${(PATTERNS[x.p]||{}).nama||x.p} · ${x.min} min</span><span>${F[x.f]||""}</span></div>`; }).join("");
    const all=readLog(); const baik=all.filter(x=>x.f==="baik").length;
    if(all.length>=3) el.innerHTML+=`<p class="hint" style="margin:10px 0 0">${baik} daripada ${all.length} sesi anda berakhir dengan rasa lebih tenang.</p>`;
  },
  beforeLeave(){ if(state){ clearInterval(timer); timer=null; state=null; try{ wake&&wake.release(); }catch(e){} } if(this._vis) document.removeEventListener("visibilitychange", this._vis); }
};
registerWorksheet(M);
})();
