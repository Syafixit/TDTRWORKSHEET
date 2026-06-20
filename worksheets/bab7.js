/* ============== BAB 7 — Peta Sokongan Sosial & Komunikasi ============== */
(function(){
const NEEDS=[
  "Bila perlukan seseorang untuk mendengar tanpa menghakimi",
  "Bila perlukan nasihat praktikal yang jujur",
  "Bila perlukan bantuan fizikal/praktikal (tumpang kereta, jaga anak)",
  "Bila perlukan gelak & ringankan suasana",
  "Bila perlukan seseorang menemani di saat kritikal",
  "Bila perlukan sokongan kewangan kecemasan"
];
const ALITEMS=[
  "Saya letak telefon & beri perhatian penuh",
  "Saya tak fikir jawapan saya ketika orang bercakap",
  "Saya buat eye contact yang selesa (tak melotot, tak mengelak)",
  "Saya tanya soalan untuk faham lebih, bukan untuk selesaikan masalah",
  "Saya akui perasaan mereka sebelum bagi pandangan saya",
  "Saya tanya dahulu: “Anda nak aku dengar je, atau nak pendapat aku?”",
  "Saya tak memotong perbualan mereka",
  "Saya tak minimakan / membandingkan masalah mereka dengan orang lain"
];

const html=`
  <div class="note">Worksheet ni membantu anda lihat siapa ada dalam hidup anda, jenis sokongan apa yang ada, dan cara meningkatkan kualiti komunikasi. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Peta Sokongan Sosial</h2><span class="chev">▾</span></div>
    <p class="hint"><b>Langkah 1:</b> Isi nama orang dalam hidup anda mengikut kedekatan (guna nama singkat / inisial jika mahu).</p>
    <svg viewBox="0 0 240 240" class="circlesvg">
      <circle cx="120" cy="120" r="104" fill="#EAF2F5" stroke="#B9D3DD"/>
      <circle cx="120" cy="120" r="70" fill="#DCEBF0" stroke="#9CC2CF"/>
      <circle cx="120" cy="120" r="36" fill="#F6D9D2" stroke="#E27D6A"/>
      <text x="120" y="120" id="cDalam" text-anchor="middle" dominant-baseline="middle" font-family="Quicksand" font-weight="700" font-size="20" fill="#c0492f">0</text>
      <text x="120" y="64" id="cTengah" text-anchor="middle" font-family="Quicksand" font-weight="700" font-size="16" fill="#2C6E87">0</text>
      <text x="120" y="26" id="cLuar" text-anchor="middle" font-family="Quicksand" font-weight="700" font-size="14" fill="#5a7480">0</text>
    </svg>
    <p class="hint" style="text-align:center;">🔴 Dalam · 🔵 Tengah · ⚪ Luar — angka dikira automatik dari nama yang anda isi.</p>

    <div class="domain-title" style="color:#c0492f;">Bulatan Dalam — Paling Dekat & Dipercayai (1–3 orang)</div>
    <div id="dalam"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB7.addItem('dalam')">+ Tambah</button><button type="button" class="del-row" id="dalamDel" onclick="BAB7.removeItem('dalam')">– Buang</button></div>

    <div class="domain-title" style="color:var(--teal-dark);">Bulatan Tengah — Rakan Baik & Keluarga Rapat (4–8 orang)</div>
    <div id="tengah"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB7.addItem('tengah')">+ Tambah</button><button type="button" class="del-row" id="tengahDel" onclick="BAB7.removeItem('tengah')">– Buang</button></div>

    <div class="domain-title">Bulatan Luar — Komuniti & Kenalan Bermakna</div>
    <div id="luar"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB7.addItem('luar')">+ Tambah</button><button type="button" class="del-row" id="luarDel" onclick="BAB7.removeItem('luar')">– Buang</button></div>

    <div class="domain-title">Langkah 2: Analisis Peta</div>
    <div class="mb"><label>Adakah bulatan dalam saya cukup? (sekurang-kurangnya 1 orang)</label><textarea id="a_cukup"></textarea></div>
    <div class="mb"><label>Adakah ada “jurang” dalam jenis sokongan? (cth: tiada untuk emosi / praktikal)</label><textarea id="a_jurang"></textarea></div>
    <div class="mb"><label>Siapa yang paling saya abaikan dalam 3 bulan lepas?</label><input type="text" id="a_abai"></div>
    <div class="mb"><label>Siapa yang selalu ada untuk saya tapi saya jarang “balas balik”?</label><input type="text" id="a_balas"></div>

    <div class="domain-title">Langkah 3: Petakan Jenis Sokongan</div>
    <div id="needs"></div>
    <div class="mb" style="margin-top:6px;"><label>Refleksi: Ada baris yang kosong? Apa maknanya bagi anda?</label><textarea id="a_kosong"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Relationship Audit</h2><span class="chev">▾</span></div>
    <p class="hint">Nilai hubungan-hubungan utama: adakah ia mengisi atau menguras anda?</p>
    <div id="rel"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB7.addItem('rel')">+ Tambah hubungan</button><button type="button" class="del-row" id="relDel" onclick="BAB7.removeItem('rel')">– Buang</button></div>
    <div class="mb" style="margin-top:8px;"><label>Hubungan paling “menguras” & satu sempadan kecil yang boleh saya tetapkan</label><textarea id="b_sempadan"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Latihan I-Statement</h2><span class="chev">▾</span></div>
    <p class="hint">Formula: “Saya rasa <b>[emosi]</b> bila <b>[situasi]</b>, kerana <b>[sebab]</b>. Yang saya perlukan adalah <b>[keperluan]</b>.”</p>
    <div id="istate"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Surat Yang Tak Dihantar</h2><span class="chev">▾</span></div>
    <p class="hint">Untuk melepaskan emosi terpendam — bukan untuk dihantar, tapi untuk diri sendiri.</p>
    <div class="mb"><label>Hubungan yang saya pilih (ada perasaan tak selesai)</label><input type="text" id="d_hubungan" placeholder="cth: Ayah / kawan lama"></div>
    <div class="mb"><label>Surat saya (“Kepada ____, Aku nak anda tahu yang…”)</label><textarea id="d_surat" style="min-height:160px;" placeholder="Tulis dengan jujur. Tiada sesiapa akan baca ni."></textarea></div>
    <div class="mb"><label>Apa perasaan saya sekarang berbanding sebelum menulis?</label><textarea id="d_rasa"></textarea></div>
    <div class="mb"><label>Adakah ada sesuatu yang mungkin perlu saya luahkan secara sebenar suatu hari nanti?</label><textarea id="d_luah"></textarea></div>
    <div class="mb"><label>Satu langkah kecil untuk mula menyembuhkan / menerima hubungan ini seadanya</label><textarea id="d_langkah"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Rancangan Tindakan Hubungan</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Satu hubungan yang ingin saya perbaiki / perkukuhkan</label><input type="text" id="e_perbaiki"></div>
    <div class="mb"><label>Satu tindakan kecil yang akan saya ambil minggu ini</label><input type="text" id="e_tindakan"></div>
    <div class="mb"><label>Satu hubungan yang perlu saya tetapkan sempadan</label><input type="text" id="e_sempadan_hub"></div>
    <div class="mb"><label>Sempadan yang akan saya tetapkan (guna I-Statement jika perlu)</label><textarea id="e_sempadan_ayat"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian F: Active Listening Checklist</h2><span class="chev">▾</span></div>
    <p class="hint">Guna selepas perbualan penting untuk nilai kualiti kehadiran anda sebagai pendengar.</p>
    <div class="risk-pill risk-low" id="alCount" style="margin-bottom:12px;">Skor: 0 / 8</div>
    <div class="check-group" id="alList"></div>
    <div class="mb"><label>Apa yang boleh saya perbaiki sebagai pendengar?</label><textarea id="f_perbaiki"></textarea></div>
  </div>

  <div class="finish"><b>✅ Ingat:</b> Hubungan yang sihat dibina perlahan-lahan melalui tindakan kecil yang konsisten. Anda tak perlu betulkan semua hubungan sekarang — pilih satu, mulakan di sana.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab7_peta_sokongan", nav:"Bab 7 · Peta Sokongan", title:"Peta Sokongan Sosial", subtitle:"Worksheet Bab 7",
  html, counts:{dalam:0,tengah:0,luar:0,rel:0},

  builders:{
    dalam:(r)=>`<div class="card"><span class="card-tag">${r}</span>
      <div class="mb"><label>Nama</label><input type="text" data-k="dalam_${r}_nama" placeholder="cth: Mama" oninput="BAB7.updateCircles()"></div>
      <div class="grid2"><div><label>Hubungan</label><input type="text" data-k="dalam_${r}_hub" placeholder="cth: Ibu"></div>
        <div><label>Jenis sokongan utama</label><input type="text" data-k="dalam_${r}_sok" placeholder="cth: Emosi"></div></div></div>`,
    tengah:(r)=>`<div class="card"><span class="card-tag">${r}</span>
      <div class="mb"><label>Nama</label><input type="text" data-k="tengah_${r}_nama" placeholder="cth: Aiz" oninput="BAB7.updateCircles()"></div>
      <div class="grid2"><div><label>Hubungan</label><input type="text" data-k="tengah_${r}_hub" placeholder="cth: Kawan rapat"></div>
        <div><label>Jenis sokongan utama</label><input type="text" data-k="tengah_${r}_sok" placeholder="cth: Praktikal"></div></div></div>`,
    luar:(r)=>`<div class="card"><span class="card-tag">${r}</span>
      <div class="mb"><label>Nama / Kumpulan</label><input type="text" data-k="luar_${r}_nama" placeholder="cth: Geng futsal" oninput="BAB7.updateCircles()"></div>
      <div class="grid2"><div><label>Hubungan</label><input type="text" data-k="luar_${r}_hub" placeholder="cth: Komuniti"></div>
        <div><label>Bagaimana mereka ada untuk saya</label><input type="text" data-k="luar_${r}_cara" placeholder="cth: Tempat lepas tension"></div></div></div>`,
    rel:(r)=>`<div class="card"><span class="card-tag">${r}</span>
      <div class="grid2"><div><label>Nama / Hubungan</label><input type="text" data-k="rel_${r}_nama" placeholder="cth: Rakan sekerja"></div>
        <div><label>Pengisi / Penguras</label><select data-k="rel_${r}_jenis"><option value="">—</option><option>✅ Pengisi</option><option>❌ Penguras</option><option>Bercampur</option></select></div></div>
      <div class="grid2" style="margin-top:8px;"><div><label>Kenapa?</label><input type="text" data-k="rel_${r}_kenapa"></div>
        <div><label>Tindakan yang perlu</label><input type="text" data-k="rel_${r}_tindakan"></div></div></div>`
  },

  init(root){
    this.counts={dalam:0,tengah:0,luar:0,rel:0};
    ['dalam','tengah','luar','rel'].forEach(g=>{ root.querySelector("#"+g).innerHTML=""; this.addItem(g); });
    // needs
    const nd=root.querySelector("#needs"); nd.innerHTML="";
    NEEDS.forEach((t,idx)=>{ const i=idx+1; nd.insertAdjacentHTML("beforeend",`<div class="card"><div style="font-size:13.5px;color:var(--teal-dark);font-family:'Quicksand';font-weight:700;margin-bottom:6px;">${t}</div><input type="text" data-k="need_${i}" placeholder="Siapa yang boleh saya hubungi?"></div>`); });
    // I-Statement 3 situasi
    const is=root.querySelector("#istate"); is.innerHTML="";
    for(let i=1;i<=3;i++){ is.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Situasi ${i}</span>
      <div class="mb"><label>Apa yang biasanya berlaku / saya cakap</label><textarea data-k="is_${i}_biasa"></textarea></div>
      <div class="grid2"><div><label>Saya rasa (emosi)</label><input type="text" data-k="is_${i}_emosi" placeholder="cth: Terbeban"></div>
        <div><label>bila (situasi)</label><input type="text" data-k="is_${i}_situasi" placeholder="cth: kerja dilonggok last minute"></div></div>
      <div class="grid2" style="margin-top:8px;"><div><label>kerana (sebab)</label><input type="text" data-k="is_${i}_sebab" placeholder="cth: saya tak sempat rancang"></div>
        <div><label>yang saya perlukan (keperluan)</label><input type="text" data-k="is_${i}_perlu" placeholder="cth: notis lebih awal"></div></div></div>`); }
    // active listening
    const al=root.querySelector("#alList"); al.innerHTML="<h3>8 Kemahiran Mendengar</h3>"+
      ALITEMS.map((t,i)=>`<label class="chk"><input type="checkbox" data-k="al_${i+1}"> ${t}</label>`).join("");
  },
  beforeApply(data){ ['dalam','tengah','luar','rel'].forEach(g=>{ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^"+g+"_(\\d+)_")); if(m)mx=Math.max(mx,+m[1]);}); while(this.counts[g]<mx) this.addItem(g); }); },
  afterLoad(){ this.updateCircles(); this.updateAL(); },
  onChange(){ this.updateAL(); },

  addItem(grp){ this.counts[grp]++; document.getElementById(grp).insertAdjacentHTML("beforeend", this.builders[grp](this.counts[grp])); this.updateDel(grp); },
  removeItem(grp){ if(this.counts[grp]<=1) return; document.getElementById(grp).lastElementChild.remove(); this.counts[grp]--; this.updateDel(grp); this.updateCircles(); App.save(); },
  updateDel(grp){ const b=document.getElementById(grp+"Del"); if(b)b.disabled=this.counts[grp]<=1; },
  countNames(grp){ let c=0; for(let i=1;i<=this.counts[grp];i++){ const e=document.querySelector('[data-k="'+grp+'_'+i+'_nama"]'); if(e&&e.value.trim())c++; } return c; },
  updateCircles(){ const d=this.countNames('dalam'),t=this.countNames('tengah'),l=this.countNames('luar');
    const set=(id,v)=>{const e=document.getElementById(id); if(e)e.textContent=v;};
    set('cDalam',d); set('cTengah',t); set('cLuar',l); },
  updateAL(){ let c=0; for(let i=1;i<=8;i++){ const cb=document.querySelector('[data-k="al_'+i+'"]'); if(cb&&cb.checked)c++; }
    const el=document.getElementById("alCount"); if(el){ el.textContent="Skor: "+c+" / 8"; el.className="risk-pill "+(c>=6?"risk-low":(c>=3?"risk-mid":"risk-high")); } }
};
window.BAB7=M;
registerWorksheet(M);
})();
