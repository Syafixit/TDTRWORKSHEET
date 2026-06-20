/* ============== BAB 9 — Pelan Kecemasan Emosi & Panduan Krisis ============== */
(function(){
const html=`
  <div class="note warn">⚠️ <b>Dokumen peribadi yang sangat penting.</b> Isi dengan jujur & simpan di tempat mudah dicapai. Kongsi dengan orang yang dipercayai.<br><br>
    <b>Jika anda dalam krisis sekarang:</b><br>
    <a class="callbtn" href="tel:0376272929">📞 Befrienders KL · 03-7627 2929</a>
    <a class="callbtn" href="tel:15999">📞 Talian Kasih · 15999</a>
    <span style="font-size:12.5px;">(24 jam, percuma)</span></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Nombor Yang Perlu Saya Tahu</h2><span class="chev">▾</span></div>
    <p class="hint">Simpan nombor ini dalam telefon anda SEKARANG.</p>
    <div class="card"><label class="chk2"><input type="checkbox" data-k="nom_befrienders"> <span><b>Befrienders KL</b> — <a href="tel:0376272929">03-7627 2929</a> &nbsp;(dah simpan)</span></label>
      <label class="chk2" style="margin-top:6px;"><input type="checkbox" data-k="nom_talian"> <span><b>Talian Kasih</b> — <a href="tel:15999">15999</a> &nbsp;(dah simpan)</span></label>
      <label class="chk2" style="margin-top:6px;"><input type="checkbox" data-k="nom_miasa"> <span><b>MIASA</b> — <a href="tel:0327806803">03-2780 6803</a> &nbsp;(dah simpan)</span></label></div>
    <div class="grid2"><div><label>Hospital berdekatan saya</label><input type="text" data-k="nom_hospital" placeholder="Nama / nombor"></div>
      <div><label>Klinik Kesihatan berdekatan</label><input type="text" data-k="nom_klinik" placeholder="Nama / nombor"></div></div>

    <div class="domain-title">Orang peribadi yang boleh saya hubungi dalam krisis</div>
    <div id="krisis"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB9.addItem('krisis')">+ Tambah</button><button type="button" class="del-row" id="krisisDel" onclick="BAB9.removeItem('krisis')">– Buang</button></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Panic Attack Survival Kit</h2><span class="chev">▾</span></div>
    <div class="check-group" style="background:var(--teal-soft);border-style:dashed;">
      <h3 style="text-align:center;">🆘 PANIC ATTACK SURVIVAL KIT</h3>
      <div style="font-size:14.5px;line-height:1.9;">
        <b>1. Sedar:</b> “Ini serangan panik. Ia tak bahaya. Ia akan berlalu.”<br>
        <b>2. Physiological Sigh:</b> Sedut dalam → sedut lagi → hembus PANJANG. Ulang 3×.<br>
        <b>3. Kaki ke lantai,</b> tangan ke peha. Rasa berat badan anda.<br>
        <b>4. Namakan 5 benda</b> yang anda NAMPAK sekarang.<br>
        <b>5. Tunggu. Jangan lawan.</b> Ia AKAN berlalu.</div>
    </div>
    <div class="mb"><label>Tambahan peribadi saya (benda/orang yang buat saya rasa selamat)</label><textarea id="b_tambahan" placeholder="cth: Dengar lagu tertentu / peluk bantal / hubungi Mak"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Pelan Kecemasan Emosi</h2><span class="chev">▾</span></div>

    <div class="domain-title">C1: Tanda Amaran Awal Saya</div>
    <div class="check-group"><h3>Perubahan Fizikal</h3>
      <label class="chk"><input type="checkbox" data-k="c1_f1"> Tidur terganggu (tak boleh tidur / tidur terlalu banyak)</label>
      <label class="chk"><input type="checkbox" data-k="c1_f2"> Selera makan berubah</label>
      <label class="chk"><input type="checkbox" data-k="c1_f3"> Sakit kepala / ketegangan badan tak biasa</label>
      <label class="chk"><input type="checkbox" data-k="c1_f4"> Keletihan ketara walaupun dah rehat</label></div>
    <div class="check-group"><h3>Perubahan Emosi</h3>
      <label class="chk"><input type="checkbox" data-k="c1_e1"> Mudah menangis / rasa kosong tanpa sebab</label>
      <label class="chk"><input type="checkbox" data-k="c1_e2"> Mudah marah / irritable lebih dari biasa</label>
      <label class="chk"><input type="checkbox" data-k="c1_e3"> Rasa tiada harapan atau “apa gunanya”</label>
      <label class="chk"><input type="checkbox" data-k="c1_e4"> Rasa terasing dari orang sekeliling</label></div>
    <div class="check-group"><h3>Perubahan Tingkah Laku</h3>
      <label class="chk"><input type="checkbox" data-k="c1_t1"> Tarik diri dari orang yang saya sayangi</label>
      <label class="chk"><input type="checkbox" data-k="c1_t2"> Berhenti buat perkara yang biasanya saya suka</label>
      <label class="chk"><input type="checkbox" data-k="c1_t3"> Abaikan tanggungjawab asas</label>
      <label class="chk"><input type="checkbox" data-k="c1_t4"> Scroll telefon berlebihan / escapism</label></div>
    <div class="mb"><label>Tanda amaran paling awal yang SPESIFIK untuk saya</label><textarea id="c1_spesifik"></textarea></div>

    <div class="domain-title">C2: Pelan Tindakan Mengikut Tahap</div>
    <div class="card" style="background:#FBF6E3;border-color:#E8C75A;"><b style="color:#9a7b2e;">🟡 TAHAP KUNING — Terbeban tapi masih boleh fungsi (stres 6–7)</b>
      <div class="mb" style="margin-top:8px;"><label>Tindakan yang akan saya ambil</label><textarea data-k="c2_kuning_tindakan" placeholder="1. ... &#10;2. ... &#10;3. ..."></textarea></div>
      <div class="mb"><label>Orang yang akan saya hubungi</label><input type="text" data-k="c2_kuning_orang"></div></div>
    <div class="card" style="background:#FBEBDD;border-color:#E59A5B;"><b style="color:#b5651d;">🟠 TAHAP OREN — Sangat terbeban, sukar untuk fungsi (stres 8–9)</b>
      <div class="mb" style="margin-top:8px;"><label>Tindakan segera</label><textarea data-k="c2_oren_tindakan" placeholder="1. ... &#10;2. ..."></textarea></div>
      <div class="grid2"><div><label>Orang yang akan saya hubungi</label><input type="text" data-k="c2_oren_orang"></div>
        <div><label>Tempat selamat untuk saya pergi</label><input type="text" data-k="c2_oren_tempat"></div></div></div>
    <div class="card" style="background:#FBE0DB;border-color:#D9534F;"><b style="color:#c0392b;">🔴 TAHAP MERAH — Krisis, ada fikiran menyakiti diri / tak mahu teruskan hidup</b>
      <p style="font-size:14px;margin:8px 0;"><b>Langkah pertama — hubungi SEKARANG:</b><br>
        <a class="callbtn" href="tel:0376272929">📞 Befrienders 03-7627 2929</a> <a class="callbtn" href="tel:15999">📞 Talian Kasih 15999</a></p>
      <p style="font-size:13.5px;color:#7a3a2c;">Atau pergi ke Jabatan Kecemasan hospital & katakan: <i>“Saya ada fikiran untuk menyakiti diri. Saya perlukan bantuan.”</i></p>
      <div class="mb"><label>Orang yang akan saya hubungi selepas itu</label><input type="text" data-k="c2_merah_orang"></div></div>

    <div class="domain-title">C3: Perkara Yang Membantu Saya</div>
    <div id="bantu"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB9.addItem('bantu')">+ Tambah</button><button type="button" class="del-row" id="bantuDel" onclick="BAB9.removeItem('bantu')">– Buang</button></div>
    <div class="mb"><label>Perkara yang TIDAK membantu & perlu saya elakkan</label><textarea id="c3_elak"></textarea></div>

    <div class="domain-title">C4: Maklumat Untuk Orang Yang Membantu Saya</div>
    <div class="mb"><label>Cara terbaik untuk sokong saya</label><textarea id="c4_sokong"></textarea></div>
    <div class="mb"><label>Perkara yang JANGAN dibuat bila saya dalam krisis</label><textarea id="c4_jangan"></textarea></div>
    <div class="mb"><label>Maklumat perubatan relevan (alahan ubat, kondisi sedia ada)</label><textarea id="c4_perubatan"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Worry Postponement Log</h2><span class="chev">▾</span></div>
    <p class="hint">Rekod kebimbangan yang anda “tangguhkan” ke masa yang dijadualkan.</p>
    <div class="mb"><label>Masa “Risau” yang saya jadualkan setiap hari</label><input type="text" id="d_masa" placeholder="cth: 7:00 petang, 15 minit"></div>
    <div id="worry"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB9.addItem('worry')">+ Tambah</button><button type="button" class="del-row" id="worryDel" onclick="BAB9.removeItem('worry')">– Buang</button></div>
    <div class="mb" style="margin-top:8px;"><label>Refleksi: Berapa % kebimbangan yang ternyata “tak boleh buat apa-apa” selepas reflect dengan tenang?</label><input type="text" id="d_refleksi" placeholder="cth: ~70%"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Panduan Cari Bantuan Profesional</h2><span class="chev">▾</span></div>
    <div class="check-group"><h3>Jenis bantuan yang mungkin saya perlukan</h3>
      <label class="chk"><input type="checkbox" data-k="e_kaunseling"> Kaunseling — stres, pelarasan hidup, sokongan emosi</label>
      <label class="chk"><input type="checkbox" data-k="e_psikologi"> Psikologi klinikal — terapi mendalam (CBT, dll.)</label>
      <label class="chk"><input type="checkbox" data-k="e_psikiatri"> Psikiatri — penilaian klinikal, mungkin termasuk ubat</label>
      <label class="chk"><input type="checkbox" data-k="e_spiritual"> Sokongan spiritual / agama</label>
      <label class="chk"><input type="checkbox" data-k="e_sebaya"> Kumpulan sokongan rakan sebaya</label></div>
    <div class="domain-title">Sumber yang akan saya cuba</div>
    <div id="sumber"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB9.addItem('sumber')">+ Tambah</button><button type="button" class="del-row" id="sumberDel" onclick="BAB9.removeItem('sumber')">– Buang</button></div>
    <div class="domain-title">Halangan saya & cara mengatasinya</div>
    <div id="halangan"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB9.addItem('halangan')">+ Tambah</button><button type="button" class="del-row" id="halanganDel" onclick="BAB9.removeItem('halangan')">– Buang</button></div>
  </div>

  <div class="finish"><b>✅ Anda dah buat sesuatu yang berani hari ini</b> — bersedia untuk masa susah sebelum ia berlaku. Simpan worksheet ni & semak semula setiap 3 bulan.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab9_pelan_kecemasan", nav:"Bab 9 · Pelan Kecemasan", title:"Pelan Kecemasan Emosi", subtitle:"Worksheet Bab 9",
  html, counts:{krisis:0,bantu:0,worry:0,sumber:0,halangan:0},

  builders:{
    krisis:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Nama</label><input type="text" data-k="krisis_${r}_nama"></div><div><label>Hubungan</label><input type="text" data-k="krisis_${r}_hub"></div></div><div class="mb" style="margin-top:8px;"><label>Nombor</label><input type="text" data-k="krisis_${r}_nom"></div></div>`,
    bantu:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Perkara</label><input type="text" data-k="bantu_${r}_perkara" placeholder="cth: Jalan kaki di taman"></div><div><label>Kenapa ia membantu</label><input type="text" data-k="bantu_${r}_kenapa" placeholder="cth: Tenangkan fikiran"></div></div></div>`,
    worry:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="worry_${r}_date"></div><div><label>Boleh buat sesuatu?</label><select data-k="worry_${r}_boleh"><option value="">—</option><option>Ya</option><option>Tak</option></select></div></div><div class="mb" style="margin-top:8px;"><label>Kebimbangan</label><input type="text" data-k="worry_${r}_bimbang"></div><div class="mb"><label>Tindakan / kesimpulan</label><input type="text" data-k="worry_${r}_tindakan"></div></div>`,
    sumber:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Nama / Perkhidmatan</label><input type="text" data-k="sumber_${r}_nama" placeholder="cth: Klinik Kesihatan"></div><div><label>Jenis</label><input type="text" data-k="sumber_${r}_jenis" placeholder="cth: Percuma/Subsidi"></div></div><div class="grid2" style="margin-top:8px;"><div><label>Kos anggaran</label><input type="text" data-k="sumber_${r}_kos" placeholder="cth: Rendah"></div><div><label>Langkah pertama</label><input type="text" data-k="sumber_${r}_langkah" placeholder="cth: Buat temujanji"></div></div></div>`,
    halangan:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Halangan</label><input type="text" data-k="halangan_${r}_hal" placeholder="cth: Takut stigma"></div><div><label>Cara atasi</label><input type="text" data-k="halangan_${r}_cara" placeholder="cth: Sesi adalah sulit"></div></div></div>`
  },

  init(root){
    this.counts={krisis:0,bantu:0,worry:0,sumber:0,halangan:0};
    Object.keys(this.builders).forEach(g=>{ root.querySelector("#"+g).innerHTML=""; this.addItem(g); });
  },
  beforeApply(data){ Object.keys(this.builders).forEach(g=>{ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^"+g+"_(\\d+)_")); if(m)mx=Math.max(mx,+m[1]);}); while(this.counts[g]<mx) this.addItem(g); }); },

  addItem(grp){ this.counts[grp]++; document.getElementById(grp).insertAdjacentHTML("beforeend", this.builders[grp](this.counts[grp])); this.updateDel(grp); },
  removeItem(grp){ if(this.counts[grp]<=1) return; document.getElementById(grp).lastElementChild.remove(); this.counts[grp]--; this.updateDel(grp); App.save(); },
  updateDel(grp){ const b=document.getElementById(grp+"Del"); if(b)b.disabled=this.counts[grp]<=1; }
};
window.BAB9=M;
registerWorksheet(M);
})();
