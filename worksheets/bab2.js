/* ============== BAB 2 — Peta Badan & Burnout Early Warning ============== */
(function(){
const REGIONS=[
 {k:'kepala',label:'Kepala',cx:110,cy:42,rx:20,ry:24},
 {k:'leher',label:'Leher / Tengkuk',cx:110,cy:76,rx:12,ry:10},
 {k:'bahu_kiri',label:'Bahu Kiri',cx:82,cy:96,rx:14,ry:11},
 {k:'bahu_kanan',label:'Bahu Kanan',cx:138,cy:96,rx:14,ry:11},
 {k:'dada',label:'Dada',cx:110,cy:124,rx:24,ry:18},
 {k:'lengan_kiri',label:'Lengan Kiri',cx:58,cy:152,rx:10,ry:42},
 {k:'lengan_kanan',label:'Lengan Kanan',cx:162,cy:152,rx:10,ry:42},
 {k:'perut',label:'Perut',cx:110,cy:174,rx:24,ry:20},
 {k:'pinggang',label:'Pinggang / Belakang',cx:110,cy:236,rx:30,ry:14},
 {k:'peha_kiri',label:'Peha Kiri',cx:90,cy:316,rx:14,ry:50},
 {k:'peha_kanan',label:'Peha Kanan',cx:130,cy:316,rx:14,ry:50},
 {k:'betis_kiri',label:'Betis Kiri',cx:90,cy:416,rx:10,ry:30},
 {k:'betis_kanan',label:'Betis Kanan',cx:130,cy:416,rx:10,ry:30}
];
const BURNOUT=[
 {g:'d1',title:'Dimensi 1: Keletihan Emosi',items:[
   "Saya rasa terkuras habis walaupun dah tidur cukup","Saya rasa penat sebelum hari kerja bermula",
   "Saya rasa tiada tenaga untuk buat perkara yang saya suka","Saya rasa seperti “kosong” di dalam",
   "Saya tak sabar nak cuti, tapi bila cuti pun rasa tak okay"]},
 {g:'d2',title:'Dimensi 2: Sinisme & Jarak Emosi',items:[
   "Saya mula tak peduli dengan kerja/pelajaran seperti dulu","Saya berasa jengkel atau negatif tentang orang sekeliling",
   "Saya buat kerja secara autopilot — badan ada, fikiran entah ke mana","Saya elak interaksi sosial yang sebelum ini saya nikmati",
   "Saya kerap berfikir “apa gunanya semua ni?”"]},
 {g:'d3',title:'Dimensi 3: Hilang Rasa Keberkesanan',items:[
   "Walaupun saya berusaha, hasilnya rasa tak memuaskan","Saya rasa saya tak sebaik yang orang lain fikir",
   "Saya kerap meragui keputusan atau kemampuan diri sendiri","Pujian dari orang lain tak beri saya semangat seperti dulu",
   "Saya rasa sumbangan saya tak penting atau tak dihargai"]}
];

const html=`
  <div class="note">Worksheet ni membantu anda kenal pasti di mana badan menyimpan stres, dan mengesan tanda awal burnout. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Peta Badan Saya</h2><span class="chev">▾</span></div>
    <p class="hint">Ketuk kawasan badan yang paling kerap rasa tegang, sakit, atau tak selesa ketika stres.</p>

    <div class="body-toggle no-print">
      <button type="button" class="bt-opt" data-model="lelaki" onclick="BAB2.switchModel('lelaki')">👨 Lelaki</button>
      <button type="button" class="bt-opt" data-model="perempuan" onclick="BAB2.switchModel('perempuan')">👩 Perempuan</button>
      <button type="button" class="bt-opt" data-model="bertudung" onclick="BAB2.switchModel('bertudung')">🧕 Bertudung</button>
    </div>

    <svg viewBox="0 0 220 460" class="bodysvg" xmlns="http://www.w3.org/2000/svg">
      <!-- BADAN ASAS (sama untuk semua model) -->
      <g id="body-base">
        <!-- Kepala -->
        <ellipse class="skin" cx="110" cy="42" rx="22" ry="26"/>
        <!-- Leher -->
        <path class="skin" d="M 100 64 L 120 64 L 122 86 L 98 86 Z"/>
        <!-- Torso V-terbalik (taper bahu→pinggang) -->
        <path class="skin" d="M 74 88 Q 70 92 70 102 L 73 200 Q 75 215 92 218 L 128 218 Q 145 215 147 200 L 150 102 Q 150 92 146 88 Z"/>
        <!-- Lengan kiri (taper) -->
        <path class="skin" d="M 70 94 Q 56 96 52 106 L 50 184 Q 50 198 58 202 L 66 202 Q 70 198 72 184 L 73 106 Z"/>
        <!-- Lengan kanan -->
        <path class="skin" d="M 150 94 Q 164 96 168 106 L 170 184 Q 170 198 162 202 L 154 202 Q 150 198 148 184 L 147 106 Z"/>
        <!-- Hip/pinggang -->
        <path class="skin" d="M 75 218 L 145 218 Q 152 222 152 240 Q 152 254 146 258 L 74 258 Q 68 254 68 240 Q 68 222 75 218 Z"/>
        <!-- Peha kiri -->
        <path class="skin" d="M 78 258 L 102 258 L 104 386 Q 102 394 90 394 Q 78 394 76 386 Z"/>
        <!-- Peha kanan -->
        <path class="skin" d="M 118 258 L 142 258 L 144 386 Q 142 394 130 394 Q 118 394 116 386 Z"/>
        <!-- Betis kiri -->
        <path class="skin" d="M 80 394 L 100 394 L 98 446 Q 96 450 90 450 Q 84 450 82 446 Z"/>
        <!-- Betis kanan -->
        <path class="skin" d="M 120 394 L 140 394 L 138 446 Q 136 450 130 450 Q 124 450 122 446 Z"/>
      </g>

      <!-- MODEL LELAKI: rambut pendek + singlet + seluar pendek -->
      <g id="model-lelaki" class="model-layer">
        <!-- Rambut pendek (atas kepala) -->
        <path class="hair-short" d="M 88 30 Q 88 14 110 12 Q 132 14 132 30 L 132 46 Q 132 24 110 24 Q 88 24 88 46 Z"/>
        <!-- Singlet: V-neck dengan strap nipis di bahu -->
        <path class="singlet" d="M 82 88 L 96 92 L 110 110 L 124 92 L 138 88 Q 144 90 145 100 L 148 200 Q 146 215 130 218 L 90 218 Q 74 215 72 200 L 75 100 Q 76 90 82 88 Z"/>
        <!-- Seluar pendek (hip → 2/3 peha) -->
        <path class="shorts" d="M 68 218 L 152 218 L 152 258 L 148 318 L 122 318 L 118 258 L 102 258 L 98 318 L 72 318 L 68 258 Z"/>
      </g>

      <!-- MODEL PEREMPUAN: rambut panjang + T-shirt + tracksuit -->
      <g id="model-perempuan" class="model-layer" hidden>
        <!-- Rambut panjang -->
        <path class="hair-long" d="M 84 30 Q 86 12 110 10 Q 134 12 136 30 L 138 96 L 130 96 L 130 46 Q 130 22 110 22 Q 90 22 90 46 L 90 96 L 82 96 Z"/>
        <!-- T-shirt body -->
        <path class="tshirt" d="M 72 88 L 96 94 L 110 110 L 124 94 L 148 88 Q 152 92 152 104 L 150 218 L 70 218 L 68 104 Q 68 92 72 88 Z"/>
        <!-- Lengan T-shirt kiri -->
        <path class="tshirt" d="M 52 100 Q 60 92 72 94 L 73 132 Q 64 134 54 134 Q 50 134 50 128 Z"/>
        <!-- Lengan T-shirt kanan -->
        <path class="tshirt" d="M 168 100 Q 160 92 148 94 L 147 132 Q 156 134 166 134 Q 170 134 170 128 Z"/>
        <!-- Tracksuit panjang -->
        <path class="tracksuit" d="M 68 218 L 152 218 L 152 258 L 146 450 L 122 450 L 118 258 L 102 258 L 98 450 L 74 450 L 68 258 Z"/>
      </g>

      <!-- MODEL BERTUDUNG: tudung + T-shirt lengan panjang + tracksuit -->
      <g id="model-bertudung" class="model-layer" hidden>
        <!-- Tudung (tutup kepala+leher, biar wajah terbuka via fill-rule) -->
        <path class="tudung" fill-rule="evenodd" d="M 78 28 Q 78 6 110 4 Q 142 6 142 28 L 152 96 Q 154 108 144 112 L 76 112 Q 66 108 68 96 Z M 92 38 Q 94 60 110 62 Q 126 60 128 38 Q 128 22 110 22 Q 92 22 92 38 Z"/>
        <!-- T-shirt lengan panjang body -->
        <path class="tshirt-long" d="M 70 100 L 96 100 L 110 116 L 124 100 L 150 100 L 152 218 L 68 218 Z"/>
        <!-- Lengan panjang kiri -->
        <path class="tshirt-long" d="M 50 102 L 73 102 L 73 202 Q 70 206 60 206 Q 48 206 48 200 Z"/>
        <!-- Lengan panjang kanan -->
        <path class="tshirt-long" d="M 147 102 L 170 102 L 172 200 Q 172 206 160 206 Q 150 206 147 202 Z"/>
        <!-- Tracksuit panjang -->
        <path class="tracksuit" d="M 68 218 L 152 218 L 152 258 L 146 450 L 122 450 L 118 258 L 102 258 L 98 450 L 74 450 L 68 258 Z"/>
      </g>

      <!-- ZONES (hotspot klik, kekal di atas) -->
      <g id="zones"></g>
    </svg>
    <div id="bodyChecks" style="display:none;"></div>
    <p id="bodyPicked" class="body-picked">Ketuk kawasan badan di atas.</p>

    <div class="domain-title">Kawasan yang PALING KERAP tegang / sakit</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="a_kawasan1" placeholder="cth: Bahu & tengkuk"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="a_kawasan2" placeholder="cth: Rahang (mengetap gigi)"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="a_kawasan3" placeholder="cth: Perut / pencernaan"></div>
    <div class="mb" style="margin-top:12px;"><label>Bilakah ia paling teruk?</label>
      <textarea id="a_bila" placeholder="cth: Hujung minggu kerja / Sebelum tidur / Selepas mesyuarat"></textarea></div>
    <div class="grid2">
      <div><label>Pernah jumpa doktor untuk simptom ini?</label>
        <select id="a_doktor"><option value="">— Pilih —</option><option>Ya</option><option>Tidak</option></select></div>
      <div><label>Jika ya, apa diagnosis?</label><input type="text" id="a_diagnosis" placeholder="cth: Tension headache"></div>
    </div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Log Body Scan 7 Hari</h2><span class="chev">▾</span></div>
    <p class="hint">Buat Body Scan 5 minit setiap malam sebelum tidur (tahap 1 = ringan, 5 = sangat tegang).</p>
    <div id="scan"></div>
    <div class="mb" style="margin-top:6px;"><label>Corak yang saya perasan selepas 7 hari</label>
      <textarea id="scan_corak" placeholder="cth: Bahu paling tegang pada hari ada banyak mesyuarat"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: HALT Check</h2><span class="chev">▾</span></div>
    <p class="hint">Bila rasa tak keruan, semak: adakah saya <b>H</b>ungry, <b>A</b>ngry, <b>L</b>onely, atau <b>T</b>ired? Catat di sini.</p>
    <div id="halt"></div>
    <div class="row-actions no-print">
      <button type="button" class="add-row" onclick="BAB2.addHalt()">+ Tambah catatan</button>
      <button type="button" class="del-row" id="haltDel" onclick="BAB2.removeHalt()">– Buang catatan</button>
    </div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Burnout Early Warning</h2><span class="chev">▾</span></div>
    <p class="hint">Tandakan setiap kenyataan yang menggambarkan pengalaman anda <b>dalam sebulan lepas</b>. Skor dikira automatik.</p>
    <div id="burnout"></div>
    <div class="domain-title" style="margin-top:6px;">Keputusan Anda</div>
    <div id="burnoutResult"></div>
    <div class="note warn" style="margin-top:14px;">⚠️ Checklist ni alat <b>kesedaran diri</b>, bukan diagnosis. Skor tinggi bermaksud anda perlu jaga diri dengan lebih serius. Jika ragu, berjumpa profesional adalah langkah terbaik.</div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Refleksi Badan & Emosi</h2><span class="chev">▾</span></div>
    <div class="mb"><label>1. Isyarat fizikal manakah yang selama ini saya abaikan?</label><textarea id="e_q1" placeholder="cth: Sakit kepala yang saya anggap biasa / Susah tidur"></textarea></div>
    <div class="mb"><label>2. Jika badan saya boleh bercakap, apa yang ia cuba sampaikan?</label><textarea id="e_q2" placeholder="cth: “Kamu terlalu penat, tolong rehat”"></textarea></div>
    <div class="mb"><label>3. Satu perubahan kecil minggu ini untuk lebih mendengar badan saya:</label><textarea id="e_q3" placeholder="cth: Berhenti seketika & tarik nafas bila bahu mula tegang"></textarea></div>
  </div>

  <div class="finish"><b>✅ Tahniah kerana sampai ke sini.</b> Simpan worksheet ni & ulangi Checklist Burnout setiap bulan untuk pantau perubahan.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab2_peta_badan", nav:"Bab 2 · Peta Badan", title:"Peta Badan & Burnout", subtitle:"Worksheet Bab 2",
  html, haltCount:0,

  init(root){
    // body map
    const zg=root.querySelector("#zones"), bc=root.querySelector("#bodyChecks");
    zg.innerHTML=""; bc.innerHTML="";
    REGIONS.forEach(r=>{
      zg.insertAdjacentHTML("beforeend",`<ellipse class="zone" data-region="${r.k}" cx="${r.cx}" cy="${r.cy}" rx="${r.rx}" ry="${r.ry}" onclick="BAB2.toggleBody('${r.k}')"><title>${r.label}</title></ellipse>`);
      bc.insertAdjacentHTML("beforeend",`<input type="checkbox" data-k="body_${r.k}">`);
    });
    // model preference (lelaki | perempuan | bertudung)
    const savedModel = localStorage.getItem("bab2_model_pref") || "lelaki";
    this.switchModel(savedModel);
    // scan 7 hari
    const sc=root.querySelector("#scan"); sc.innerHTML="";
    for(let i=1;i<=7;i++){
      sc.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Hari ${i}</span>
        <div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="scan_${i}_date"></div>
          <div><label>Kawasan tegang</label><input type="text" data-k="scan_${i}_kawasan" placeholder="cth: Bahu / Rahang / Perut"></div></div>
        <div class="slider-row" style="margin-top:8px;"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Tahap 1–5</span>
          <input type="range" min="1" max="5" value="3" data-k="scan_${i}_tahap" oninput="document.getElementById('scanval_${i}').textContent=this.value">
          <span class="val" id="scanval_${i}">3</span></div>
        <textarea data-k="scan_${i}_note" placeholder="Apa yang berlaku hari ini?"></textarea></div>`);
    }
    // burnout
    const bo=root.querySelector("#burnout"); bo.innerHTML="";
    BURNOUT.forEach(dim=>{ const rows=dim.items.map((t,idx)=>`<label class="chk"><input type="checkbox" data-k="${dim.g}_${idx+1}"> ${t}</label>`).join("");
      bo.insertAdjacentHTML("beforeend",`<div class="check-group"><h3>${dim.title}</h3>${rows}</div>`); });
    // halt
    this.haltCount=0; root.querySelector("#halt").innerHTML=""; this.addHalt();
  },
  beforeApply(data){ this.ensureHaltRows(data); },
  afterLoad(){ this.refreshScanLabels(); this.syncBodyMap(); this.computeBurnout(); },
  onChange(){ this.computeBurnout(); },

  /* body map */
  toggleBody(k){ const cb=document.querySelector('[data-k="body_'+k+'"]'); cb.checked=!cb.checked; this.syncBodyMap(); App.save(); },
  syncBodyMap(){ const picked=[]; REGIONS.forEach(r=>{ const cb=document.querySelector('[data-k="body_'+r.k+'"]'); const z=document.querySelector('.zone[data-region="'+r.k+'"]'); if(cb&&z){ z.classList.toggle("sel",cb.checked); if(cb.checked)picked.push(r.label); } });
    const el=document.getElementById("bodyPicked"); if(el) el.textContent=picked.length?"Dipilih: "+picked.join(", "):"Ketuk kawasan badan di atas."; },
  switchModel(name){
    if(!["lelaki","perempuan","bertudung"].includes(name)) name="lelaki";
    document.querySelectorAll(".model-layer").forEach(g=>{
      // SVG <g> tak respect IDL `hidden` property — guna attribute langsung
      if(g.id==="model-"+name) g.removeAttribute("hidden");
      else g.setAttribute("hidden","");
    });
    document.querySelectorAll(".bt-opt").forEach(b=>{ b.classList.toggle("active", b.dataset.model===name); });
    localStorage.setItem("bab2_model_pref", name);
  },

  /* scan */
  refreshScanLabels(){ for(let i=1;i<=7;i++){ const sl=document.querySelector('[data-k="scan_'+i+'_tahap"]'); const v=document.getElementById("scanval_"+i); if(sl&&v)v.textContent=sl.value; } },

  /* halt */
  haltHTML(r){ return `<div class="card"><span class="card-tag">${r}</span>
    <div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="halt_${r}_date"></div>
      <div><label>Situasi</label><input type="text" data-k="halt_${r}_situasi" placeholder="cth: Lepas balik kerja"></div></div>
    <div class="mb" style="margin-top:8px;"><label>Saya rasa… (tanda yang berkenaan)</label>
      <div class="halt-checks">
        <label class="chk2"><input type="checkbox" data-k="halt_${r}_h"> H — Hungry (Lapar)</label>
        <label class="chk2"><input type="checkbox" data-k="halt_${r}_a"> A — Angry (Marah)</label>
        <label class="chk2"><input type="checkbox" data-k="halt_${r}_l"> L — Lonely (Sunyi)</label>
        <label class="chk2"><input type="checkbox" data-k="halt_${r}_t"> T — Tired (Penat)</label></div></div>
    <div class="mb"><label>Tindakan yang diambil</label><input type="text" data-k="halt_${r}_tindakan" placeholder="cth: Makan dulu, minum air, rehat 5 minit"></div></div>`; },
  addHalt(){ this.haltCount++; document.getElementById("halt").insertAdjacentHTML("beforeend", this.haltHTML(this.haltCount)); this.updateHaltDel(); },
  removeHalt(){ if(this.haltCount<=1) return; document.getElementById("halt").lastElementChild.remove(); this.haltCount--; this.updateHaltDel(); App.save(); },
  updateHaltDel(){ const b=document.getElementById("haltDel"); if(b)b.disabled=this.haltCount<=1; },
  ensureHaltRows(data){ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(/^halt_(\d+)_/); if(m)mx=Math.max(mx,+m[1]);}); while(this.haltCount<mx) this.addHalt(); },

  /* burnout */
  computeBurnout(){ const cnt=g=>[1,2,3,4,5].reduce((s,i)=>{const cb=document.querySelector('[data-k="'+g+'_'+i+'"]');return s+(cb&&cb.checked?1:0);},0);
    const a=cnt('d1'),b=cnt('d2'),c=cnt('d3'),tot=a+b+c; let band,cls,advice;
    if(tot<=3){band="Risiko rendah";cls="risk-low";advice="Teruskan amalan jaga diri.";}
    else if(tot<=7){band="Perlu perhatian";cls="risk-mid";advice="Semak semula sempadan & rehat; guna teknik Bab 4–5.";}
    else if(tot<=11){band="Risiko sederhana tinggi";cls="risk-high";advice="Kurangkan beban segera; pertimbang berbual dengan seseorang yang dipercayai.";}
    else {band="Risiko tinggi";cls="risk-high";advice="Sangat digalakkan berjumpa profesional kesihatan mental.";}
    const el=document.getElementById("burnoutResult"); if(!el) return;
    el.innerHTML=`<div class="sum-stat">
      <div class="stat-box"><div class="n">${a}</div><div class="l">Keletihan Emosi /5</div></div>
      <div class="stat-box"><div class="n">${b}</div><div class="l">Sinisme /5</div></div>
      <div class="stat-box"><div class="n">${c}</div><div class="l">Keberkesanan /5</div></div></div>
      <div class="risk-pill ${cls}">Jumlah ${tot}/15 — ${band}</div>
      <p class="hint" style="margin-top:8px;">${advice}</p>`; }
};
window.BAB2=M;
registerWorksheet(M);
})();
