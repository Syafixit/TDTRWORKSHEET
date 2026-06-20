/* ============== BAB 10 — Blueprint Wellness Peribadi & Rancangan 90 Hari ============== */
(function(){
const html=`
  <div class="note">Ini dokumen <b>terpenting</b> dalam keseluruhan ebook — tempat semua yang anda pelajari bersatu dalam satu sistem yang unik untuk anda. Ambil masa. Isi dengan serius. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="grid2 no-print">
    <div class="mb"><label>Tarikh Mula</label><input type="date" id="meta_mula" min="2026-01-01" max="2030-12-31"></div>
    <div class="mb"><label>Tarikh 90 Hari (sasaran)</label><input type="date" id="meta_90" min="2026-01-01" max="2030-12-31"></div>
  </div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Refleksi Perjalanan</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Sebelum membaca ebook ini, keadaan saya adalah</label><textarea id="a_sebelum"></textarea></div>
    <div class="mb"><label>Perkara paling berharga yang saya pelajari tentang diri saya</label><textarea id="a_berharga"></textarea></div>
    <div class="domain-title">3 teknik paling berkesan untuk saya (dari semua bab)</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="a_teknik1" placeholder="cth: Physiological Sigh (Bab 4)"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="a_teknik2"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="a_teknik3"></div>
    <div class="mb" style="margin-top:8px;"><label>Satu perubahan kecil yang dah pun berlaku dalam diri saya</label><textarea id="a_perubahan"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Blueprint Wellness Peribadi</h2><span class="chev">▾</span></div>

    <div class="domain-title">🌅 Sistem Pagi Saya (15–20 min)</div>
    <div id="bpagi"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB10.addItem('bpagi')">+ Tambah</button><button type="button" class="del-row" id="bpagiDel" onclick="BAB10.removeItem('bpagi')">– Buang</button></div>
    <div class="mb"><label>Versi minimum (bila betul-betul sibuk/penat)</label><input type="text" id="b_pagi_min" placeholder="cth: 3 nafas dalam + 1 ayat bersyukur"></div>

    <div class="domain-title">🌙 Sistem Malam Saya (10–15 min)</div>
    <div id="bmalam"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB10.addItem('bmalam')">+ Tambah</button><button type="button" class="del-row" id="bmalamDel" onclick="BAB10.removeItem('bmalam')">– Buang</button></div>
    <div class="mb"><label>Versi minimum</label><input type="text" id="b_malam_min"></div>

    <div class="domain-title">📅 Amalan Mingguan</div>
    <div id="bming"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB10.addItem('bming')">+ Tambah</button><button type="button" class="del-row" id="bmingDel" onclick="BAB10.removeItem('bming')">– Buang</button></div>

    <div class="domain-title">🗓️ Amalan Bulanan</div>
    <div id="bbulan"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB10.addItem('bbulan')">+ Tambah</button><button type="button" class="del-row" id="bbulanDel" onclick="BAB10.removeItem('bbulan')">– Buang</button></div>

    <div class="domain-title">🆘 Teknik Kecemasan Emosi (Bab 4 & 9)</div>
    <div class="mb"><label>Bila stres ringan</label><input type="text" id="b_kec_ringan" placeholder="cth: Box breathing 4-4-4-4"></div>
    <div class="mb"><label>Bila anxious / overwhelmed</label><input type="text" id="b_kec_anxious" placeholder="cth: 5-4-3-2-1 Grounding"></div>
    <div class="mb"><label>Bila krisis akut</label><input type="text" id="b_kec_krisis" placeholder="cth: Hubungi Befrienders 03-7627 2929"></div>

    <div class="domain-title">🤝 Sistem Sokongan Sosial (Bab 7)</div>
    <div class="grid2">
      <div><label>Check-in seminggu sekali</label><input type="text" id="b_sos_checkin" placeholder="cth: Aiman"></div>
      <div><label>Hubungi bila betul-betul tak okay</label><input type="text" id="b_sos_krisis" placeholder="cth: Mama"></div>
    </div>
    <div class="halt-checks" style="margin-top:8px;">
      <label class="chk2"><input type="checkbox" data-k="b_helpline_bef"> Befrienders <a href="tel:0376272929">03-7627 2929</a> dah disimpan</label>
      <label class="chk2"><input type="checkbox" data-k="b_helpline_tk"> Talian Kasih <a href="tel:15999">15999</a> dah disimpan</label>
    </div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Rancangan 90 Hari</h2><span class="chev">▾</span></div>

    <div class="domain-title">Langkah 1: Pilih 1–3 Fokus Utama</div>
    <div class="card"><span class="card-tag">Fokus 1</span>
      <div class="mb"><label>Fokus</label><input type="text" id="c_f1" placeholder="cth: Tidur 7 jam setiap malam" oninput="BAB10.refreshFokusLabels()"></div>
      <div class="mb"><label>Kenapa penting</label><input type="text" id="c_f1_kenapa"></div></div>
    <div class="card"><span class="card-tag">Fokus 2</span>
      <div class="mb"><label>Fokus</label><input type="text" id="c_f2" placeholder="cth: Bersenam 3x seminggu" oninput="BAB10.refreshFokusLabels()"></div>
      <div class="mb"><label>Kenapa penting</label><input type="text" id="c_f2_kenapa"></div></div>
    <div class="card"><span class="card-tag">Fokus 3 (opsyenal)</span>
      <div class="mb"><label>Fokus</label><input type="text" id="c_f3"></div>
      <div class="mb"><label>Kenapa penting</label><input type="text" id="c_f3_kenapa"></div></div>

    <div class="domain-title">Langkah 2: Milestone Bulanan</div>
    <div id="milestones"></div>

    <div class="domain-title">Langkah 3: Rancang Untuk Tergelincir</div>
    <div class="check-group"><h3>Masa paling berisiko saya untuk tergelincir</h3>
      <label class="chk"><input type="checkbox" data-k="c_risk_sibuk"> Minggu kerja yang terlalu sibuk</label>
      <label class="chk"><input type="checkbox" data-k="c_risk_jalan"> Perjalanan / bercuti</label>
      <label class="chk"><input type="checkbox" data-k="c_risk_raya"> Cuti perayaan / tempoh kekeluargaan</label>
      <label class="chk"><input type="checkbox" data-k="c_risk_mood"> Bila mood sedang rendah</label></div>
    <div class="mb"><label>Lain-lain</label><input type="text" id="c_risk_lain"></div>
    <div class="mb"><label>Versi minimum yang saya boleh buat dalam keadaan tersukar</label><textarea id="c_min"></textarea></div>
    <div class="mb"><label>Peraturan saya: “Never Miss ____ berturut-turut”</label><input type="text" id="c_nevermiss" placeholder="cth: 2 hari"></div>

    <div class="domain-title">Langkah 4: Semakan Mingguan 5 Minit</div>
    <div class="grid2">
      <div><label>Saya akan buat setiap</label><select id="c_smHari"><option value="">—</option><option>Ahad</option><option>Isnin</option><option>Selasa</option><option>Rabu</option><option>Khamis</option><option>Jumaat</option><option>Sabtu</option></select></div>
      <div><label>Pukul</label><input type="text" id="c_smJam" placeholder="cth: 8:00 mlm"></div>
    </div>
    <p class="hint" style="margin-top:10px;">3 soalan setiap minggu: (1) Apa berjalan baik? (2) Apa tak berjalan, kenapa? (3) Satu pelarasan kecil untuk minggu ini?</p>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Tracker Kemajuan 90 Hari</h2><span class="chev">▾</span></div>

    <div class="sum-stat" style="margin-bottom:10px;">
      <div class="stat-box"><div class="n" id="trkF1">0</div><div class="l" id="trkF1Lbl">Fokus 1 /12</div></div>
      <div class="stat-box"><div class="n" id="trkF2">0</div><div class="l" id="trkF2Lbl">Fokus 2 /12</div></div>
      <div class="stat-box"><div class="n" id="trkAvg">—</div><div class="l">Purata mood /10</div></div>
    </div>

    <div class="domain-title">Semakan Mingguan — 12 Minggu</div>
    <div id="weeks"></div>

    <div class="domain-title" style="margin-top:18px;">Monthly Reset — 3 Bulan</div>
    <div id="reset"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Surat Untuk Diri 90 Hari Dari Sekarang</h2><span class="chev">▾</span></div>
    <div class="note">Bayangkan versi anda yang dah kekalkan amalan, melalui minggu susah & bangkit semula, lebih kenal dirinya. Apa yang anda nak dia tahu?</div>
    <div class="grid2">
      <div><label>Tarikh surat ditulis</label><input type="date" id="e_tarikh_tulis" min="2026-01-01" max="2030-12-31"></div>
      <div><label>Tarikh untuk dibuka (90 hari)</label><input type="date" id="e_tarikh_buka" min="2026-01-01" max="2030-12-31"></div>
    </div>
    <p class="hint" style="margin-top:8px;">💡 <b>Set reminder dalam telefon anda sekarang</b> pada tarikh dibuka.</p>
    <div class="mb"><label>Kepada [nama saya] pada hari itu —</label><textarea id="e_surat" style="min-height:200px;" placeholder="Tulis dari hati. Apa yang anda harap dia ingat tentang kenapa perjalanan ini berbaloi?"></textarea></div>
    <div class="domain-title">Dalam 90 hari, saya harap saya dah:</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="e_harap1"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="e_harap2"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="e_harap3"></div>
    <p class="hint" style="margin-top:10px;font-style:italic;">“Saya menulis ini pada hari saya memilih untuk berubah.”</p>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian F: Refleksi 90 Hari (Selepas Buka Surat)</h2><span class="chev">▾</span></div>
    <p class="hint">Isi selepas 90 hari bila anda buka surat.</p>
    <div class="mb"><label>Tarikh hari ini</label><input type="date" id="f_tarikh" min="2026-01-01" max="2030-12-31"></div>
    <div class="mb"><label>Fokus utama yang paling banyak berubah dalam 90 hari</label><textarea id="f_berubah"></textarea></div>
    <div class="mb"><label>Momen paling mencabar & bagaimana saya melaluinya</label><textarea id="f_cabaran"></textarea></div>
    <div class="mb"><label>Satu perkara tentang diri saya yang saya pelajari dalam 90 hari ini</label><textarea id="f_pelajari"></textarea></div>
    <div class="mb"><label>Adakah saya setia kepada janji dalam surat? Apa yang berbeza?</label><textarea id="f_setia"></textarea></div>
    <div class="mb"><label>Fokus untuk 90 hari seterusnya</label><textarea id="f_seterusnya"></textarea></div>
  </div>

  <div class="finish"><b>🎉 Tahniah</b> — anda telah menyelesaikan keseluruhan ebook “Tenang Di Tengah Ribut.”<br><br>
    Ini <b>bukan</b> penghujung. Ini permulaan yang sebenar.<br>
    Setiap hari yang anda pilih untuk jaga diri — walaupun dalam cara yang paling kecil — adalah kemenangan. <b>Teruskan.</b></div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab10_blueprint_wellness", nav:"Bab 10 · Blueprint 90 Hari", title:"Blueprint Wellness 90 Hari", subtitle:"Worksheet Bab 10",
  html, counts:{bpagi:0,bmalam:0,bming:0,bbulan:0},

  builders:{
    bpagi:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Waktu</label><input type="text" data-k="bpagi_${r}_waktu" placeholder="cth: 6:30"></div><div><label>Aktiviti</label><input type="text" data-k="bpagi_${r}_aktiviti" placeholder="cth: Box breathing"></div></div><div class="grid2" style="margin-top:8px;"><div><label>Tempoh</label><input type="text" data-k="bpagi_${r}_tempoh" placeholder="cth: 2 min"></div><div><label>Bab rujukan</label><input type="text" data-k="bpagi_${r}_bab" placeholder="cth: Bab 4"></div></div></div>`,
    bmalam:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Waktu</label><input type="text" data-k="bmalam_${r}_waktu" placeholder="cth: 10:00"></div><div><label>Aktiviti</label><input type="text" data-k="bmalam_${r}_aktiviti" placeholder="cth: Gratitude 3"></div></div><div class="grid2" style="margin-top:8px;"><div><label>Tempoh</label><input type="text" data-k="bmalam_${r}_tempoh" placeholder="cth: 5 min"></div><div><label>Bab rujukan</label><input type="text" data-k="bmalam_${r}_bab" placeholder="cth: Bab 3"></div></div></div>`,
    bming:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Amalan</label><input type="text" data-k="bming_${r}_amalan" placeholder="cth: Semakan Mingguan"></div><div><label>Hari/Masa</label><input type="text" data-k="bming_${r}_bila" placeholder="cth: Ahad 8mlm"></div></div><div class="mb" style="margin-top:8px;"><label>Tempoh</label><input type="text" data-k="bming_${r}_tempoh" placeholder="cth: 5 min"></div></div>`,
    bbulan:(r)=>`<div class="card"><span class="card-tag">${r}</span><div class="grid2"><div><label>Amalan</label><input type="text" data-k="bbulan_${r}_amalan" placeholder="cth: Monthly Reset Ritual"></div><div><label>Bila</label><input type="text" data-k="bbulan_${r}_bila" placeholder="cth: Awal setiap bulan"></div></div><div class="mb" style="margin-top:8px;"><label>Tempoh</label><input type="text" data-k="bbulan_${r}_tempoh" placeholder="cth: 20–30 min"></div></div>`
  },

  init(root){
    this.counts={bpagi:0,bmalam:0,bming:0,bbulan:0};
    Object.keys(this.builders).forEach(g=>{ root.querySelector("#"+g).innerHTML=""; this.addItem(g); });

    // Milestones (2 fokus × 3 bulan)
    const ms=root.querySelector("#milestones"); ms.innerHTML="";
    [1,2].forEach(f=>{ ms.insertAdjacentHTML("beforeend",`<div class="domain-title" style="font-size:15px;"><span id="msTitle_${f}">FOKUS ${f}</span></div>`);
      [1,2,3].forEach(b=>{ ms.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Bulan ${b}</span>
        <div class="mb"><label>Milestone</label><input type="text" data-k="ms_${f}_${b}_milestone"></div>
        <div class="mb"><label>Bagaimana saya tahu ia berjaya</label><input type="text" data-k="ms_${f}_${b}_jaya"></div></div>`); }); });

    // 12 minggu
    const wk=root.querySelector("#weeks"); wk.innerHTML="";
    for(let i=1;i<=12;i++){ wk.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Minggu ${i}</span>
      <div class="grid2"><div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="wk_${i}_date"></div>
        <div><label>Mood (1–10)</label><div class="slider-row" style="margin:4px 0 0;"><input type="range" min="1" max="10" value="5" data-k="wk_${i}_mood" oninput="document.getElementById('mood_${i}').textContent=this.value; BAB10.updateTracker()"><span class="val" id="mood_${i}">5</span></div></div></div>
      <div class="halt-checks" style="margin-top:8px;">
        <label class="chk2"><input type="checkbox" data-k="wk_${i}_f1"> <span id="wkf1lbl_${i}">Fokus 1</span></label>
        <label class="chk2"><input type="checkbox" data-k="wk_${i}_f2"> <span id="wkf2lbl_${i}">Fokus 2</span></label></div>
      <div class="mb" style="margin-top:8px;"><label>Nota ringkas</label><input type="text" data-k="wk_${i}_nota"></div></div>`); }

    // Monthly Reset × 3
    const rs=root.querySelector("#reset"); rs.innerHTML="";
    for(let b=1;b<=3;b++){ rs.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Bulan ${b} Reset</span>
      <div class="mb"><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="rs_${b}_date"></div>
      <div class="grid2"><div><label>Satu tabiat untuk KEKALKAN</label><input type="text" data-k="rs_${b}_kekal"></div>
        <div><label>Satu tabiat untuk TAMBAH</label><input type="text" data-k="rs_${b}_tambah"></div></div>
      <div class="mb" style="margin-top:8px;"><label>Satu tabiat untuk HENTIKAN</label><input type="text" data-k="rs_${b}_henti"></div>
      <div class="mb"><label>Satu ayat tentang siapa saya mahu jadi bulan ini</label><textarea data-k="rs_${b}_ayat"></textarea></div></div>`); }
  },
  beforeApply(data){ Object.keys(this.builders).forEach(g=>{ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^"+g+"_(\\d+)_")); if(m)mx=Math.max(mx,+m[1]);}); while(this.counts[g]<mx) this.addItem(g); }); },
  afterLoad(){ this.refreshLabels(); this.refreshFokusLabels(); this.updateTracker(); },
  onChange(){ this.updateTracker(); },

  addItem(grp){ this.counts[grp]++; document.getElementById(grp).insertAdjacentHTML("beforeend", this.builders[grp](this.counts[grp])); this.updateDel(grp); },
  removeItem(grp){ if(this.counts[grp]<=1) return; document.getElementById(grp).lastElementChild.remove(); this.counts[grp]--; this.updateDel(grp); App.save(); },
  updateDel(grp){ const b=document.getElementById(grp+"Del"); if(b)b.disabled=this.counts[grp]<=1; },

  refreshLabels(){ for(let i=1;i<=12;i++){ const s=document.querySelector('[data-k="wk_'+i+'_mood"]'), v=document.getElementById("mood_"+i); if(s&&v)v.textContent=s.value; } },
  refreshFokusLabels(){
    const f1=(document.getElementById("c_f1")?.value||"").trim()||"Fokus 1";
    const f2=(document.getElementById("c_f2")?.value||"").trim()||"Fokus 2";
    [1,2].forEach(f=>{ const t=document.getElementById("msTitle_"+f); if(t)t.textContent="FOKUS "+f+": "+(f===1?f1:f2); });
    for(let i=1;i<=12;i++){ const l1=document.getElementById("wkf1lbl_"+i),l2=document.getElementById("wkf2lbl_"+i); if(l1)l1.textContent=f1; if(l2)l2.textContent=f2; }
    document.getElementById("trkF1Lbl").textContent=f1+" /12";
    document.getElementById("trkF2Lbl").textContent=f2+" /12";
  },
  updateTracker(){ let f1=0,f2=0,msum=0,mcnt=0;
    for(let i=1;i<=12;i++){ const c1=document.querySelector('[data-k="wk_'+i+'_f1"]'); if(c1&&c1.checked)f1++;
      const c2=document.querySelector('[data-k="wk_'+i+'_f2"]'); if(c2&&c2.checked)f2++;
      const d=document.querySelector('[data-k="wk_'+i+'_date"]'); const m=document.querySelector('[data-k="wk_'+i+'_mood"]');
      if(d&&d.value&&m){ msum+=+m.value; mcnt++; } }
    const n1=document.getElementById("trkF1"); if(n1)n1.textContent=f1;
    const n2=document.getElementById("trkF2"); if(n2)n2.textContent=f2;
    const avg=document.getElementById("trkAvg"); if(avg)avg.textContent=mcnt?(msum/mcnt).toFixed(1):"—"; }
};
window.BAB10=M;
registerWorksheet(M);
})();
