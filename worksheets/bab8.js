/* ============== BAB 8 — Sistem Wellness, Habit Tracker 30 Hari & Surat ============== */
(function(){
const PILLARS=[
  ["Kesedaran Diri","Saya sedar apa yang saya rasa & fikir, dan bila saya dalam tekanan"],
  ["Regulasi Emosi","Saya boleh rasa emosi sukar tanpa tindakan impulsif yang merugikan"],
  ["Hubungan Menyokong","Saya ada orang yang boleh dipercayai bila perlukan sokongan"],
  ["Makna & Tujuan","Saya tahu apa yang penting & kenapa saya berjuang"],
  ["Kemahiran Praktikal","Saya percaya saya mampu hadapi & selesaikan cabaran"]
];

const html=`
  <div class="note">Worksheet ni pusat kawalan wellness anda — reka sistem harian, pantau tabiat, dan tulis surat yang akan jaga anda pada hari-hari paling gelap. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Resilience Inventory</h2><span class="chev">▾</span></div>
    <p class="hint">Nilai diri dalam setiap tiang resiliensi (1 = sangat lemah, 10 = sangat kuat).</p>
    <div id="res"></div>
    <div id="resSum" class="body-picked" style="margin:6px 0 12px;"></div>
    <div class="mb"><label>Satu tindakan kecil untuk perkuatkan tiang paling lemah saya</label><input type="text" id="a_tindakan"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Clarifikasi Nilai Teras</h2><span class="chev">▾</span></div>
    <div class="mb"><label>1. Di penghujung hayat, apa yang paling penting bagimu?</label><textarea id="b_q1"></textarea></div>
    <div class="mb"><label>2. Dalam situasi paling mencabar, apa yang membuat anda terus bangun?</label><textarea id="b_q2"></textarea></div>
    <div class="mb"><label>3. Siapakah anda yang anda bangga — bukan dari pencapaian, tapi cara anda hidup?</label><textarea id="b_q3"></textarea></div>
    <div class="domain-title">3–5 nilai teras saya</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="b_nilai1" placeholder="cth: Kejujuran"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="b_nilai2"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="b_nilai3"></div>
    <div class="trigger-line"><span class="num">4</span><input type="text" id="b_nilai4"></div>
    <div class="trigger-line"><span class="num">5</span><input type="text" id="b_nilai5"></div>
    <div class="mb" style="margin-top:8px;"><label>Adakah cara saya hidup sekarang selaras dengan nilai ini? Di mana ada jurang?</label><textarea id="b_jurang"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Habit Stacking</h2><span class="chev">▾</span></div>
    <div class="domain-title">Langkah 1: Sauh (Tabiat Sedia Ada)</div>
    <p class="hint">Tabiat yang SUDAH anda buat setiap hari tanpa gagal.</p>
    <div id="sauh"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('sauh')">+ Tambah</button><button type="button" class="del-row" id="sauhDel" onclick="BAB8.removeItem('sauh')">– Buang</button></div>

    <div class="domain-title">Langkah 2: Reka Habit Stack</div>
    <p class="hint">“Selepas saya [SAUH], saya akan [TABIAT BARU] selama [MASA].”</p>
    <div id="stack"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('stack')">+ Tambah</button><button type="button" class="del-row" id="stackDel" onclick="BAB8.removeItem('stack')">– Buang</button></div>

    <div class="domain-title">Langkah 3: If-Then Planning</div>
    <div id="ifthen"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('ifthen')">+ Tambah</button><button type="button" class="del-row" id="ifthenDel" onclick="BAB8.removeItem('ifthen')">– Buang</button></div>

    <div class="domain-title">Langkah 4: Pernyataan Identiti</div>
    <div class="mb"><label>“Saya adalah orang yang…”</label><textarea id="c_identiti" placeholder="cth: jaga kesihatan mentalnya setiap hari, walaupun dalam bentuk kecil"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Sistem Wellness Harian</h2><span class="chev">▾</span></div>
    <div class="domain-title">🌅 Rutin Pagi (15–30 minit)</div>
    <div id="pagi"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('pagi')">+ Tambah</button><button type="button" class="del-row" id="pagiDel" onclick="BAB8.removeItem('pagi')">– Buang</button></div>
    <div class="mb"><label>Rutin pagi saya dalam satu ayat</label><input type="text" id="d_pagi_ayat"></div>

    <div class="domain-title">☀️ Semakan Tengahari (5 minit)</div>
    <div id="tengahari"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('tengahari')">+ Tambah</button><button type="button" class="del-row" id="tengahariDel" onclick="BAB8.removeItem('tengahari')">– Buang</button></div>

    <div class="domain-title">🌙 Rutin Malam (10–20 minit)</div>
    <div id="malam"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB8.addItem('malam')">+ Tambah</button><button type="button" class="del-row" id="malamDel" onclick="BAB8.removeItem('malam')">– Buang</button></div>
    <div class="mb"><label>Rutin malam saya dalam satu ayat</label><input type="text" id="d_malam_ayat"></div>

    <div class="domain-title">📅 Semakan Mingguan (setiap Ahad)</div>
    <div class="mb"><label>1. Apa yang berjalan baik minggu ini?</label><textarea id="d_w1"></textarea></div>
    <div class="mb"><label>2. Tiang resiliensi mana yang perlu lebih perhatian?</label><textarea id="d_w2"></textarea></div>
    <div class="mb"><label>3. Satu pelarasan kecil untuk minggu depan?</label><textarea id="d_w3"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Habit Tracker 30 Hari</h2><span class="chev">▾</span></div>
    <p class="hint">Pilih maksimum 3 tabiat untuk pantau 30 hari. Kurang lebih berkesan.</p>
    <div class="mb"><label>Tabiat 1</label><input type="text" id="habit_1" placeholder="cth: Bersyukur 1 perkara" oninput="BAB8.updateHT()"></div>
    <div class="mb"><label>Tabiat 2</label><input type="text" id="habit_2" placeholder="cth: Jalan 15 minit" oninput="BAB8.updateHT()"></div>
    <div class="mb"><label>Tabiat 3</label><input type="text" id="habit_3" placeholder="cth: Tidur sebelum 11" oninput="BAB8.updateHT()"></div>
    <div class="sum-stat" style="margin-top:6px;">
      <div class="stat-box"><div class="n" id="htn1">0</div><div class="l" id="htl1">Tabiat 1 /30</div></div>
      <div class="stat-box"><div class="n" id="htn2">0</div><div class="l" id="htl2">Tabiat 2 /30</div></div>
      <div class="stat-box"><div class="n" id="htn3">0</div><div class="l" id="htl3">Tabiat 3 /30</div></div>
    </div>
    <div id="ht" style="margin-top:10px;"></div>
    <div class="mb" style="margin-top:8px;"><label>Refleksi 30 hari — Apa yang saya pelajari tentang diri saya?</label><textarea id="e_refleksi"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian F: Surat Untuk Diri Sendiri (Masa Susah)</h2><span class="chev">▾</span></div>
    <div class="note">Tulis surat ini sekarang, ketika anda rasa okay. Ia untuk dibaca pada hari paling gelap — bila rasa tiada harapan atau nak menyerah. Tulis dari hati, dengan kasih sayang.</div>
    <div class="mb"><label>Tarikh surat ini ditulis</label><input type="date" id="f_tarikh" min="2026-01-01" max="2030-12-31"></div>
    <div class="mb"><label>Surat saya (“Kepada [nama], aku tulis ini pada hari aku rasa okay…”)</label><textarea id="f_surat" style="min-height:200px;" placeholder="Tulis dengan kasih sayang — seperti menulis kepada orang yang paling anda sayang."></textarea></div>
    <div class="mb"><label>Saya pernah melalui (cabaran lalu yang saya berjaya survive)</label><textarea id="f_cabaran"></textarea></div>
    <div class="mb"><label>Orang yang ada untuk saya</label><input type="text" id="f_orang"></div>
    <div class="mb"><label>Kalau saya betul-betul tak okay, langkah pertama yang perlu saya buat</label><textarea id="f_langkah" placeholder="cth: Hubungi ____ / Talian Kasih 15999 / Befrienders 03-76272929"></textarea></div>
    <div class="grid2"><div><label>Simpan surat ini di</label><input type="text" id="f_simpan" placeholder="cth: Nota telefon / laci meja"></div>
      <div><label>Beritahu siapa di mana ia disimpan</label><input type="text" id="f_beritahu"></div></div>
  </div>

  <div class="finish"><b>✅ Tahniah — anda hampir selesai.</b> Surat Untuk Diri Sendiri mungkin perkara paling penting yang anda tulis sepanjang ebook ini. Simpan ia dengan selamat.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab8_habit_tracker", nav:"Bab 8 · Habit Tracker", title:"Sistem Wellness & Habit Tracker", subtitle:"Worksheet Bab 8",
  html, counts:{sauh:0,stack:0,ifthen:0,pagi:0,tengahari:0,malam:0},

  builders:{
    sauh:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Tabiat sauh</label><input type="text" data-k="sauh_${r}_tabiat" placeholder="cth: Solat Subuh"></div><div><label>Masa biasa</label><input type="text" data-k="sauh_${r}_masa" placeholder="cth: ~5:30 pagi"></div></div></div>`,
    stack:(r)=>`<div class="card"><span class="card-tag">${r}</span>
      <div class="grid2"><div><label>Selepas saya… (sauh)</label><input type="text" data-k="stack_${r}_sauh" placeholder="cth: solat Subuh"></div><div><label>saya akan… (tabiat baru)</label><input type="text" data-k="stack_${r}_tabiat" placeholder="cth: journaling"></div></div>
      <div class="grid2" style="margin-top:8px;"><div><label>selama (masa)</label><input type="text" data-k="stack_${r}_masa" placeholder="cth: 3 minit"></div>
        <div><label>Kategori</label><select data-k="stack_${r}_kategori"><option value="">—</option><option>Tidur</option><option>Makan</option><option>Senaman</option><option>Minda</option><option>Emosi</option><option>Hubungan</option></select></div></div></div>`,
    ifthen:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Jika (halangan)…</label><input type="text" data-k="ifthen_${r}_jika" placeholder="cth: bangun lambat"></div><div><label>Maka saya akan…</label><input type="text" data-k="ifthen_${r}_maka" placeholder="cth: buat versi 1 minit"></div></div></div>`,
    pagi:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Masa</label><input type="text" data-k="pagi_${r}_masa" placeholder="cth: 6:30"></div><div><label>Aktiviti</label><input type="text" data-k="pagi_${r}_aktiviti" placeholder="cth: Box breathing"></div></div><div class="grid2" style="margin-top:8px;"><div><label>Tempoh</label><input type="text" data-k="pagi_${r}_tempoh" placeholder="cth: 2 min"></div><div><label>Dari Bab</label><input type="text" data-k="pagi_${r}_bab" placeholder="cth: Bab 4"></div></div></div>`,
    tengahari:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Aktiviti</label><input type="text" data-k="tengahari_${r}_aktiviti" placeholder="cth: HALT check"></div><div><label>Tempoh</label><input type="text" data-k="tengahari_${r}_tempoh" placeholder="cth: 1 min"></div></div></div>`,
    malam:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Masa</label><input type="text" data-k="malam_${r}_masa" placeholder="cth: 10:00"></div><div><label>Aktiviti</label><input type="text" data-k="malam_${r}_aktiviti" placeholder="cth: Gratitude 3"></div></div><div class="grid2" style="margin-top:8px;"><div><label>Tempoh</label><input type="text" data-k="malam_${r}_tempoh" placeholder="cth: 5 min"></div><div><label>Dari Bab</label><input type="text" data-k="malam_${r}_bab" placeholder="cth: Bab 3"></div></div></div>`
  },

  init(root){
    // resilience
    const re=root.querySelector("#res"); re.innerHTML="";
    PILLARS.forEach((p,idx)=>{ const i=idx+1; re.insertAdjacentHTML("beforeend",`<div class="card"><b style="font-family:'Quicksand';color:var(--teal-dark);">${p[0]}</b>
      <div style="font-size:13px;color:var(--muted);margin:2px 0 4px;">${p[1]}</div>
      <div class="slider-row"><input type="range" min="1" max="10" value="5" data-k="res_${i}" oninput="BAB8.updateRes()"><span class="val" id="rv_${i}">5</span></div></div>`); });
    // dynamic groups
    this.counts={sauh:0,stack:0,ifthen:0,pagi:0,tengahari:0,malam:0};
    Object.keys(this.builders).forEach(g=>{ root.querySelector("#"+g).innerHTML=""; this.addItem(g); });
    // habit tracker 30 hari
    const ht=root.querySelector("#ht"); ht.innerHTML="";
    for(let i=1;i<=30;i++){ ht.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Hari ${i}</span>
      <input type="date" min="2026-01-01" max="2030-12-31" data-k="ht_${i}_date" style="margin-bottom:8px;">
      <div class="halt-checks"><label class="chk2"><input type="checkbox" data-k="ht_${i}_1"> Tabiat 1</label>
        <label class="chk2"><input type="checkbox" data-k="ht_${i}_2"> Tabiat 2</label>
        <label class="chk2"><input type="checkbox" data-k="ht_${i}_3"> Tabiat 3</label></div>
      <div class="mb" style="margin-top:6px;"><input type="text" data-k="ht_${i}_nota" placeholder="Nota (opsyenal)"></div></div>`); }
  },
  beforeApply(data){ Object.keys(this.builders).forEach(g=>{ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^"+g+"_(\\d+)_")); if(m)mx=Math.max(mx,+m[1]);}); while(this.counts[g]<mx) this.addItem(g); }); },
  afterLoad(){ this.updateRes(); this.updateHT(); },
  onChange(){ this.updateHT(); },

  addItem(grp){ this.counts[grp]++; document.getElementById(grp).insertAdjacentHTML("beforeend", this.builders[grp](this.counts[grp])); this.updateDel(grp); },
  removeItem(grp){ if(this.counts[grp]<=1) return; document.getElementById(grp).lastElementChild.remove(); this.counts[grp]--; this.updateDel(grp); App.save(); },
  updateDel(grp){ const b=document.getElementById(grp+"Del"); if(b)b.disabled=this.counts[grp]<=1; },

  updateRes(){ let sum=0,mxi=0,mni=0; const v=[]; for(let i=1;i<=5;i++){ const s=document.querySelector('[data-k="res_'+i+'"]'); const val=s?+s.value:5; v.push(val); sum+=val; const lbl=document.getElementById("rv_"+i); if(lbl)lbl.textContent=val; }
    v.forEach((x,i)=>{ if(x>v[mxi])mxi=i; if(x<v[mni])mni=i; });
    const el=document.getElementById("resSum"); if(el) el.innerHTML=`Jumlah: <b>${sum}/50</b> &nbsp;·&nbsp; 💪 Terkuat: <b>${PILLARS[mxi][0]}</b> (${v[mxi]}) &nbsp;·&nbsp; ⚠️ Perlu perhatian: <b>${PILLARS[mni][0]}</b> (${v[mni]})`; },
  updateHT(){ const cols=[0,0,0]; for(let i=1;i<=30;i++){ for(let c=1;c<=3;c++){ const cb=document.querySelector('[data-k="ht_'+i+'_'+c+'"]'); if(cb&&cb.checked)cols[c-1]++; } }
    for(let c=1;c<=3;c++){ const n=document.getElementById("htn"+c); if(n)n.textContent=cols[c-1];
      const name=(document.getElementById("habit_"+c)?.value||"").trim(); const l=document.getElementById("htl"+c); if(l)l.textContent=(name?name:("Tabiat "+c))+" /30"; } }
};
window.BAB8=M;
registerWorksheet(M);
})();
