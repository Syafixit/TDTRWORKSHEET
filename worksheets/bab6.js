/* ============== BAB 6 — Audit Gaya Hidup & Rancangan Tidur ============== */
(function(){
const HARI=["Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu","Ahad"];

const html=`
  <div class="note">Worksheet ni membantu anda lihat keadaan sebenar gaya hidup anda — tanpa menghukum — dan bina satu rancangan kecil yang <b>sustainable</b>. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Audit Gaya Hidup (7 Hari)</h2><span class="chev">▾</span></div>
    <p class="hint">Isi setiap hari dengan jujur. Tujuannya bukan markah sempurna — tapi untuk nampak corak sebenar.</p>

    <div class="domain-title">😴 Tidur</div>
    <div id="tidur"></div>
    <div class="grid2"><div><label>Purata jam tidur/malam</label><input type="text" id="tdr_purata_jam" placeholder="cth: 6.5"></div>
      <div><label>Purata kualiti tidur /5</label><input type="text" id="tdr_purata_kualiti" placeholder="cth: 3"></div></div>
    <div class="mb" style="margin-top:8px;"><label>Pukul biasa saya letak telefon sebelum tidur</label><input type="text" id="tdr_telefon" placeholder="cth: 12:30 mlm (atas katil)"></div>

    <div class="domain-title">🥗 Pemakanan & Hidrasi</div>
    <div id="makan"></div>
    <div class="mb"><label>Minuman paling kerap selain air kosong</label><input type="text" id="mkn_minuman" placeholder="cth: Teh tarik"></div>
    <div class="mb"><label>Makanan yang saya cari bila stres/penat</label><input type="text" id="mkn_stres" placeholder="cth: Snek manis / goreng-goreng"></div>

    <div class="domain-title">🏃 Senaman & Pergerakan</div>
    <div id="senam"></div>
    <div class="risk-pill risk-low" id="senCount" style="margin:6px 0;">Hari aktif: 0 / 7</div>
    <div class="mb"><label>Halangan terbesar untuk bersenam</label><input type="text" id="sen_halangan" placeholder="cth: Tak cukup masa / penat balik kerja"></div>

    <div class="domain-title">📱 Penggunaan Skrin</div>
    <div id="skrin"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Analisis Audit</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Tidur: Adakah saya tidur cukup? Apa paling menghalang tidur berkualiti?</label><textarea id="an_tidur"></textarea></div>
    <div class="mb"><label>Pemakanan: Ada corak makan yang memburukkan mood/tenaga? Bila paling cenderung makan tak sihat?</label><textarea id="an_makan"></textarea></div>
    <div class="mb"><label>Senaman: Bentuk pergerakan paling realistik untuk konsisten minggu ini?</label><textarea id="an_senam"></textarea></div>
    <div class="mb"><label>Skrin: Adakah penggunaan skrin menyumbang tidur kurang berkualiti / kecemasan?</label><textarea id="an_skrin"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Rancangan Tidur Lebih Baik</h2><span class="chev">▾</span></div>
    <div class="grid2"><div><label>Sasaran waktu tidur</label><input type="text" id="c_tidur" placeholder="cth: 11:00 mlm"></div>
      <div><label>Sasaran waktu bangun</label><input type="text" id="c_bangun" placeholder="cth: 6:30 pagi"></div></div>
    <div class="mb" style="margin-top:8px;"><label>Sasaran jumlah jam tidur</label><input type="text" id="c_jam" placeholder="cth: 7.5 jam"></div>

    <div class="domain-title">Sleep Hygiene Checklist</div>
    <div id="hygiene"></div>
    <div class="domain-title">3 amalan saya pilih untuk MULA minggu ini</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="c_amalan1" placeholder="cth: Elak kafein selepas 2 petang"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="c_amalan2"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="c_amalan3"></div>

    <div class="domain-title">Digital Sunset Routine</div>
    <div class="mb"><label>Masa saya mula Digital Sunset</label><input type="text" id="ds_masa" placeholder="cth: 9:30 mlm"></div>
    <div class="mb"><label>Langkah 1</label><input type="text" id="ds_1" placeholder="cth: Letak telefon di luar bilik"></div>
    <div class="mb"><label>Langkah 2</label><input type="text" id="ds_2" placeholder="cth: Tukar ke lampu malap"></div>
    <div class="mb"><label>Langkah 3 (aktiviti pengganti skrin)</label><input type="text" id="ds_3" placeholder="cth: Baca buku 15 minit"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Perubahan Gaya Hidup (14 Hari)</h2><span class="chev">▾</span></div>
    <p class="hint">Pilih <b>SATU</b> perubahan sahaja untuk 14 hari pertama. Konsisten lebih penting dari banyak.</p>
    <div class="mb"><label>Perubahan yang saya pilih</label>
      <select id="d_perubahan"><option value="">— Pilih —</option>
        <option>Tidur 30 minit lebih awal setiap malam</option>
        <option>Gantikan 1 minuman manis/berkafein dengan air kosong</option>
        <option>Berjalan kaki 15 minit setiap hari</option>
        <option>Tiada skrin 30 minit sebelum tidur</option>
        <option>Lain (nyatakan di bawah)</option></select></div>
    <div class="mb"><label>Jika “Lain”, nyatakan</label><input type="text" id="d_perubahan_lain"></div>
    <div class="mb"><label>Kenapa saya pilih perubahan ini?</label><textarea id="d_kenapa"></textarea></div>
    <div class="grid2">
      <div><label>Halangan yang mungkin</label><input type="text" id="d_halangan"></div>
      <div><label>Cara saya akan atasinya</label><input type="text" id="d_cara"></div>
    </div>

    <div class="domain-title">Tracker 14 Hari</div>
    <div class="risk-pill risk-low" id="d14Count" style="margin-bottom:12px;">Hari berjaya: 0 / 14</div>
    <div id="tracker14"></div>
    <div class="mb" style="margin-top:8px;"><label>Apa saya perasan tentang mood & tenaga selepas 14 hari?</label><textarea id="d_mood"></textarea></div>
    <div class="mb"><label>Perubahan seterusnya selepas 14 hari</label><textarea id="d_seterusnya"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Anti-Anxiety Food Swaps</h2><span class="chev">▾</span></div>
    <p class="hint">Kenal pasti 3 swap mudah berdasarkan audit pemakanan anda.</p>
    <div id="swaps"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian F: Refleksi Akhir</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Sebelum audit ini, saya fikir gaya hidup saya adalah:</label><textarea id="f_sebelum"></textarea></div>
    <div class="mb"><label>Selepas audit, saya sedar:</label><textarea id="f_selepas"></textarea></div>
    <div class="mb"><label>Satu perkara gaya hidup yang paling mempengaruhi kesihatan mental saya & perlu ubah segera:</label><textarea id="f_ubah"></textarea></div>
  </div>

  <div class="finish"><b>✅ Ingat:</b> Anda tak perlu jadi sempurna — hanya lebih baik dari semalam. Satu perubahan kecil yang konsisten akan mengubah biologi anda secara perlahan, dan itu membantu minda anda.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const HYGIENE=[
  ["Persekitaran Tidur",["Pastikan bilik gelap (langsir tebal / pelindung mata)","Pastikan bilik sejuk & selesa","Simpan telefon di luar bilik / mod senyap muka bawah","Guna katil hanya untuk tidur — bukan kerja/scroll"]],
  ["Rutin Sebelum Tidur",["Kurangkan skrin 30–60 minit sebelum tidur","Elak berita/media sosial 1 jam sebelum tidur","Aktiviti tenang: baca, journaling, stretching","Minum air suam / teh herba tanpa kafein","Tulis 3 perkara bersyukur / rancangan esok"]],
  ["Tabiat Harian",["Elak kafein selepas 2 petang","Tidur & bangun pada waktu sama setiap hari","Elak tidur siang melebihi 20 minit","Senaman teratur (elak intensiti tinggi 2–3 jam sebelum tidur)"]]
];

const M={
  id:"bab6_audit_gaya_hidup", nav:"Bab 6 · Audit Gaya Hidup", title:"Audit Gaya Hidup & Tidur", subtitle:"Worksheet Bab 6",
  html,

  init(root){
    // Tidur
    const t=root.querySelector("#tidur"); t.innerHTML="";
    HARI.forEach((h,idx)=>{ const i=idx+1; t.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">${h}</span>
      <div class="grid2"><div><label>Tidur pukul</label><input type="text" data-k="tdr_${i}_tidur" placeholder="cth: 11:30 mlm"></div>
        <div><label>Bangun pukul</label><input type="text" data-k="tdr_${i}_bangun" placeholder="cth: 6:30 pagi"></div></div>
      <div class="grid2" style="margin-top:8px;"><div><label>Jumlah jam</label><input type="text" data-k="tdr_${i}_jam" placeholder="cth: 7"></div>
        <div><label>Kualiti 1–5</label><div class="slider-row" style="margin:4px 0 0;"><input type="range" min="1" max="5" value="3" data-k="tdr_${i}_kualiti" oninput="document.getElementById('tk_${i}').textContent=this.value"><span class="val" id="tk_${i}">3</span></div></div></div>
      <label class="chk2" style="margin-top:8px;"><input type="checkbox" data-k="tdr_${i}_kafein"> Kafein selepas 2 petang</label></div>`); });

    // Pemakanan
    const m=root.querySelector("#makan"); m.innerHTML="";
    HARI.forEach((h,idx)=>{ const i=idx+1; m.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">${h}</span>
      <div class="grid2"><div><label>Gelas air (sasaran 8)</label><input type="text" data-k="mkn_${i}_air" placeholder="cth: 5"></div>
        <div><label>Kafein (cawan)</label><input type="text" data-k="mkn_${i}_kafein" placeholder="cth: 2"></div></div>
      <div class="halt-checks" style="margin-top:8px;"><label class="chk2"><input type="checkbox" data-k="mkn_${i}_bergizi"> Makanan bergizi</label>
        <label class="chk2"><input type="checkbox" data-k="mkn_${i}_junk"> Gula/junk tinggi</label></div></div>`); });

    // Senaman
    const s=root.querySelector("#senam"); s.innerHTML="";
    HARI.forEach((h,idx)=>{ const i=idx+1; s.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">${h}</span>
      <div class="grid2"><div><label>Jenis aktiviti</label><input type="text" data-k="sen_${i}_jenis" placeholder="cth: Jalan kaki" oninput="BAB6.updateSen()"></div>
        <div><label>Tempoh</label><input type="text" data-k="sen_${i}_tempoh" placeholder="cth: 20 minit"></div></div>
      <div class="grid2" style="margin-top:8px;"><div><label>Intensiti</label><select data-k="sen_${i}_intensiti"><option value="">—</option><option>Rendah</option><option>Sederhana</option><option>Tinggi</option></select></div>
        <div><label>Rasa selepas</label><input type="text" data-k="sen_${i}_rasa" placeholder="cth: Segar"></div></div></div>`); });

    // Skrin
    const sk=root.querySelector("#skrin"); sk.innerHTML="";
    HARI.forEach((h,idx)=>{ const i=idx+1; sk.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">${h}</span>
      <div class="grid2"><div><label>Masa skrin total (anggaran)</label><input type="text" data-k="skr_${i}_total" placeholder="cth: 6 jam"></div>
        <div><label>Masa skrin sebelum tidur</label><input type="text" data-k="skr_${i}_tidur" placeholder="cth: 1 jam"></div></div>
      <label class="chk2" style="margin-top:8px;"><input type="checkbox" data-k="skr_${i}_doom"> Doomscrolling</label>
      <div class="mb" style="margin-top:6px;"><label>Mood selepas scroll</label><input type="text" data-k="skr_${i}_mood" placeholder="cth: Cemas / kosong"></div></div>`); });

    // Hygiene
    const hy=root.querySelector("#hygiene"); hy.innerHTML="";
    let hi=0; HYGIENE.forEach(grp=>{ let rows=grp[1].map(t=>{hi++; return `<label class="chk"><input type="checkbox" data-k="sh_${hi}"> ${t}</label>`;}).join("");
      hy.insertAdjacentHTML("beforeend",`<div class="check-group"><h3>${grp[0]}</h3>${rows}</div>`); });

    // Tracker 14 hari
    const tr=root.querySelector("#tracker14"); tr.innerHTML="";
    for(let i=1;i<=14;i++){ tr.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Hari ${i}</span>
      <div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="d14_${i}_date"></div>
        <div><label>Buat hari ini?</label><label class="chk2" style="margin-top:9px;"><input type="checkbox" data-k="d14_${i}_done"> Ya</label></div></div>
      <div class="mb" style="margin-top:8px;"><label>Nota</label><input type="text" data-k="d14_${i}_nota"></div></div>`); }

    // Food swaps
    const sw=root.querySelector("#swaps"); sw.innerHTML="";
    for(let i=1;i<=3;i++){ sw.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">${i}</span>
      <div class="mb"><label>Kebiasaan semasa</label><input type="text" data-k="swap_${i}_biasa" placeholder="cth: Teh tarik 3x sehari"></div>
      <div class="grid2"><div><label>Swap lebih baik</label><input type="text" data-k="swap_${i}_swap" placeholder="cth: 1x teh tarik + 2x air kosong"></div>
        <div><label>Bila / situasi</label><input type="text" data-k="swap_${i}_bila" placeholder="cth: Petang ganti air kosong"></div></div></div>`); }
  },
  afterLoad(){ this.refreshLabels(); this.updateSen(); this.updateD14(); },
  onChange(){ this.updateD14(); },

  refreshLabels(){ for(let i=1;i<=7;i++){ const s=document.querySelector('[data-k="tdr_'+i+'_kualiti"]'), v=document.getElementById("tk_"+i); if(s&&v)v.textContent=s.value; } },
  updateSen(){ let c=0; for(let i=1;i<=7;i++){ const e=document.querySelector('[data-k="sen_'+i+'_jenis"]'); if(e&&e.value.trim())c++; }
    const el=document.getElementById("senCount"); if(el){ el.textContent="Hari aktif: "+c+" / 7"; el.className="risk-pill "+(c>=4?"risk-low":(c>=2?"risk-mid":"risk-high")); } },
  updateD14(){ let c=0; for(let i=1;i<=14;i++){ const cb=document.querySelector('[data-k="d14_'+i+'_done"]'); if(cb&&cb.checked)c++; }
    const el=document.getElementById("d14Count"); if(el){ el.textContent="Hari berjaya: "+c+" / 14"; el.className="risk-pill "+(c>=10?"risk-low":(c>=5?"risk-mid":"risk-high")); } }
};
window.BAB6=M;
registerWorksheet(M);
})();
