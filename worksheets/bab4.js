/* ============== BAB 4 — Toolkit Darurat Emosi & Mindfulness 21 Hari ============== */
(function(){
const TECHNIQUES=[
  "Box Breathing (4-4-4-4)","Pernafasan 4-7-8","Physiological Sigh","5-4-3-2-1 Grounding",
  "Air Sejuk / Ais","Physical Anchoring (kaki ke lantai)","RAIN Technique","Body Scan 5 Minit (Bab 2)",
  "Micro-mindfulness semasa makan","Micro-mindfulness semasa mandi"
];
const WEEKS=[["Minggu 1 (Hari 1–7)",1,7],["Minggu 2 (Hari 8–14)",8,14],["Minggu 3 (Hari 15–21)",15,21]];

const html=`
  <div class="note">Worksheet ni ada dua bahagian utama: membina <b>Toolkit Darurat Emosi</b> peribadi, dan log amalan mindfulness selama <b>21 hari</b>. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Toolkit Darurat Emosi</h2><span class="chev">▾</span></div>
    <p class="hint"><b>Langkah 1:</b> Cuba setiap teknik sekurang-kurangnya sekali, dan beri rating keberkesanan untuk diri anda.</p>
    <div id="tech"></div>

    <div class="domain-title">Langkah 2: Bina Toolkit Peribadi</div>
    <div class="card"><b>Bila STRES HARIAN (tahap 4–6)</b>
      <div class="mb" style="margin-top:8px;"><label>Teknik pilihan</label><input type="text" data-k="l2_harian_teknik" placeholder="cth: Box breathing"></div>
      <div class="mb"><label>Bila saya akan gunakannya</label><input type="text" data-k="l2_harian_bila" placeholder="cth: Setiap kali sebelum mesyuarat"></div></div>
    <div class="card"><b>Bila OVERWHELMED / ANXIOUS (tahap 7–8)</b>
      <div class="mb" style="margin-top:8px;"><label>Teknik pilihan</label><input type="text" data-k="l2_anxious_teknik" placeholder="cth: 5-4-3-2-1 Grounding"></div>
      <div class="mb"><label>Langkah pertama yang akan saya buat</label><input type="text" data-k="l2_anxious_langkah" placeholder="cth: Duduk & rasa kaki ke lantai"></div></div>
    <div class="card"><b>Bila PANIK / KRITIKAL (tahap 9–10)</b>
      <div class="mb" style="margin-top:8px;"><label>Teknik pilihan</label><input type="text" data-k="l2_panik_teknik" placeholder="cth: Physiological sigh + air sejuk"></div>
      <div class="mb"><label>Satu ayat yang akan saya ulang kepada diri</label><input type="text" data-k="l2_panik_ayat" placeholder="cth: “Ini akan berlalu. Aku selamat sekarang.”"></div></div>
    <div class="card"><b>Bila TAK BOLEH TIDUR (fikiran tak berhenti)</b>
      <div class="mb" style="margin-top:8px;"><label>Teknik pilihan</label><input type="text" data-k="l2_tidur_teknik" placeholder="cth: Pernafasan 4-7-8"></div></div>
    <div class="card"><b>Bila perlu RESET CEPAT (&lt;2 minit, di pejabat)</b>
      <div class="mb" style="margin-top:8px;"><label>Teknik pilihan</label><input type="text" data-k="l2_reset_teknik" placeholder="cth: Box breathing 4 pusingan"></div></div>

    <div class="domain-title">Langkah 3: Ringkasan Toolkit (untuk screenshot)</div>
    <div id="toolkitCard" class="check-group" style="background:var(--teal-soft);border-style:dashed;"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Mindfulness Log 21 Hari</h2><span class="chev">▾</span></div>
    <p class="hint">Setiap hari, tanda jika anda buat sekurang-kurangnya 1 amalan mindfulness/pernafasan sedar. Catat teknik, tempoh & rasa.</p>
    <div class="risk-pill risk-low" id="mindCount" style="margin-bottom:12px;">0 / 21 hari diamalkan</div>
    <div id="mind"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Latihan RAIN</h2><span class="chev">▾</span></div>
    <p class="hint">Pilih 1 emosi kuat yang anda alami minggu ini, dan bawa ia melalui proses RAIN.</p>
    <div class="mb"><label>Emosi yang saya pilih</label><input type="text" data-k="rain_emosi" placeholder="cth: Cemas / Marah / Sedih"></div>
    <div class="mb"><label>R — Recognise: Nama emosi ini dengan tepat</label><input type="text" data-k="rain_recognise" placeholder="cth: Bukan ‘tak okay’ — ini ‘rasa tak cukup bagus’"></div>
    <div class="slider-row"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Intensiti awal</span>
      <input type="range" min="0" max="10" value="5" data-k="rain_before" oninput="document.getElementById('rb').textContent=this.value+'/10'"><span class="val" id="rb">5/10</span></div>
    <div class="mb"><label>A — Allow: “Saya sedar saya rasa ___, dan saya benarkan perasaan ini ada sekarang.”</label><textarea data-k="rain_allow" placeholder="Tulis ayat penuh untuk diri anda"></textarea></div>
    <div class="grid2">
      <div><label>I — Investigate: Di mana dalam badan?</label><input type="text" data-k="rain_badan" placeholder="cth: Dada / perut / tekak"></div>
      <div><label>Apa emosi ini cuba sampaikan?</label><input type="text" data-k="rain_mesej" placeholder="cth: Aku perlu rehat"></div>
    </div>
    <div class="grid2" style="margin-top:8px;">
      <div><label>N — Nurture: Apa saya perlukan sekarang?</label><input type="text" data-k="rain_perlu" placeholder="cth: Belas kasihan pada diri"></div>
      <div><label>Satu tindakan kecil</label><input type="text" data-k="rain_tindakan" placeholder="cth: Minum air & tarik nafas 3 kali"></div>
    </div>
    <div class="slider-row" style="margin-top:8px;"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Intensiti selepas RAIN</span>
      <input type="range" min="0" max="10" value="5" data-k="rain_after" oninput="document.getElementById('ra').textContent=this.value+'/10'"><span class="val" id="ra">5/10</span></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Refleksi 21 Hari</h2><span class="chev">▾</span></div>
    <p class="hint">Isi selepas selesai 21 hari.</p>
    <div class="risk-pill risk-low" id="mindCount2" style="margin-bottom:12px;">Jumlah hari diamalkan: 0 / 21</div>
    <div class="mb"><label>Teknik yang paling kerap saya guna</label><input type="text" data-k="d_teknik" placeholder="cth: Box breathing"></div>
    <div class="mb"><label>Perubahan terbesar yang saya perasan dalam diri</label><textarea id="d_perubahan" placeholder="cth: Saya kurang reaktif bila marah"></textarea></div>
    <div class="mb"><label>Halangan terbesar & bagaimana saya atasinya</label><textarea id="d_halangan" placeholder="cth: Lupa — saya set peringatan di telefon"></textarea></div>
    <div class="mb"><label>Adakah saya akan teruskan amalan ini? Kenapa?</label><textarea id="d_teruskan" placeholder="cth: Ya, sebab ia betul-betul bantu saya tidur"></textarea></div>
  </div>

  <div class="finish"><b>✅ Ingat:</b> Konsistensi lebih penting dari kesempurnaan. Kalau tertinggal sehari, jangan berhenti — teruskan esoknya. Satu hari tertinggal tak membatalkan hari-hari yang dah anda buat.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab4_toolkit_emosi", nav:"Bab 4 · Toolkit Emosi", title:"Toolkit Darurat Emosi", subtitle:"Worksheet Bab 4",
  html,

  init(root){
    // teknik (Langkah 1)
    const te=root.querySelector("#tech"); te.innerHTML="";
    TECHNIQUES.forEach((name,idx)=>{ const i=idx+1;
      te.insertAdjacentHTML("beforeend",`<div class="card"><b style="font-family:'Quicksand';color:var(--teal-dark);">${name}</b>
        <div class="halt-checks" style="margin-top:6px;"><label class="chk2"><input type="checkbox" data-k="t${i}_cuba"> Dah cuba</label></div>
        <div class="slider-row"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Rating 1–5</span>
          <input type="range" min="1" max="5" value="3" data-k="t${i}_rating" oninput="document.getElementById('trate_${i}').textContent=this.value"><span class="val" id="trate_${i}">3</span></div>
        <input type="text" data-k="t${i}_nota" placeholder="Catatan ringkas (opsyenal)"></div>`);
    });
    // mindfulness 21 hari
    const md=root.querySelector("#mind"); md.innerHTML="";
    WEEKS.forEach((w,wi)=>{ md.insertAdjacentHTML("beforeend",`<div class="domain-title">${w[0]}</div>`);
      for(let i=w[1];i<=w[2];i++){
        md.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Hari ${i}</span>
          <div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="mind_${i}_date"></div>
            <div><label>Amalan hari ini?</label><label class="chk2" style="margin-top:9px;"><input type="checkbox" data-k="mind_${i}_done"> Ya, saya buat</label></div></div>
          <div class="grid2" style="margin-top:8px;"><div><label>Teknik</label><input type="text" data-k="mind_${i}_teknik" placeholder="cth: Box breathing"></div>
            <div><label>Tempoh</label><input type="text" data-k="mind_${i}_tempoh" placeholder="cth: 5 minit"></div></div>
          <div class="mb" style="margin-top:8px;"><label>Bagaimana rasa?</label><input type="text" data-k="mind_${i}_rasa" placeholder="cth: Lebih tenang & fokus"></div></div>`);
      }
      md.insertAdjacentHTML("beforeend",`<div class="mb"><label>Refleksi ${w[0]}</label><textarea data-k="mind_ref${wi+1}" placeholder="${wi===0?'Hari mana paling mudah/susah? Kenapa?':(wi===1?'Ada perubahan berbanding minggu 1?':'Adakah amalan ini dah rasa lebih automatik?')}"></textarea></div>`);
    });
    // toolkit summary listeners
    root.querySelectorAll('[data-k^="l2_"][data-k$="_teknik"]').forEach(el=>el.addEventListener("input",()=>this.renderToolkit()));
  },
  afterLoad(){ this.refreshLabels(); this.renderToolkit(); this.updateCount(); },
  onChange(){ this.updateCount(); },

  refreshLabels(){
    for(let i=1;i<=10;i++){ const sl=document.querySelector('[data-k="t'+i+'_rating"]'), v=document.getElementById("trate_"+i); if(sl&&v)v.textContent=sl.value; }
    const rb=document.querySelector('[data-k="rain_before"]'), rbl=document.getElementById("rb"); if(rb&&rbl)rbl.textContent=rb.value+"/10";
    const ra=document.querySelector('[data-k="rain_after"]'), ral=document.getElementById("ra"); if(ra&&ral)ral.textContent=ra.value+"/10";
  },
  renderToolkit(){ const g=k=>{const e=document.querySelector('[data-k="'+k+'"]'); return (e&&e.value.trim())?e.value:"—";};
    const el=document.getElementById("toolkitCard"); if(!el) return;
    el.innerHTML=`<h3 style="text-align:center;color:var(--teal-dark);">🧰 TOOLKIT DARURAT EMOSI SAYA</h3>
      <div style="font-size:14px;line-height:2;">
      <b>Stres harian:</b> ${g("l2_harian_teknik")}<br>
      <b>Anxious / Overwhelmed:</b> ${g("l2_anxious_teknik")}<br>
      <b>Panik akut:</b> ${g("l2_panik_teknik")}<br>
      <b>Tak boleh tidur:</b> ${g("l2_tidur_teknik")}<br>
      <b>Reset pantas:</b> ${g("l2_reset_teknik")}</div>`; },
  updateCount(){ let c=0; for(let i=1;i<=21;i++){ const cb=document.querySelector('[data-k="mind_'+i+'_done"]'); if(cb&&cb.checked)c++; }
    const cls=c>=15?"risk-low":(c>=7?"risk-mid":"risk-high");
    const a=document.getElementById("mindCount"); if(a){ a.textContent=c+" / 21 hari diamalkan"; a.className="risk-pill "+cls; }
    const b=document.getElementById("mindCount2"); if(b){ b.textContent="Jumlah hari diamalkan: "+c+" / 21"; b.className="risk-pill "+cls; } }
};
window.BAB4=M;
registerWorksheet(M);
})();
