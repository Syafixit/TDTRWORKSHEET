/* ============== BAB 5 — Roda Kehidupan, Energy Audit & Sempadan ============== */
(function(){
const DOMAINS=[
  ["Kerja / Kerjaya","Kerja","Adakah kerja anda bermakna & sustainable?"],
  ["Kewangan","Wang","Adakah anda rasa selamat & terkawal dari segi kewangan?"],
  ["Kesihatan Fizikal","Fizikal","Adakah anda menjaga badan dengan baik?"],
  ["Kesihatan Mental & Emosi","Mental","Adakah anda rasa okay di dalam?"],
  ["Hubungan (Pasangan/Keluarga)","Keluarga","Adakah hubungan rapat anda memuaskan & menyokong?"],
  ["Hubungan Sosial & Kawan","Sosial","Adakah anda ada sokongan sosial yang cukup?"],
  ["Pertumbuhan Diri","Tumbuh","Adakah anda berkembang sebagai individu?"],
  ["Rehat, Hobi & Keseronokan","Rehat","Adakah anda ada masa untuk diri & benda yang anda suka?"]
];
const CX=160, CY=160, MAXR=118, N=8;
function pt(i,r){ const a=(-90+i*(360/N))*Math.PI/180; return [CX+r*Math.cos(a), CY+r*Math.sin(a)]; }

const html=`
  <div class="note">Worksheet ni membantu anda lihat gambaran besar kehidupan, kenal pasti jurang, dan bina alat untuk urus tenaga & sempadan. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Roda Kehidupan</h2><span class="chev">▾</span></div>
    <p class="hint">Nilai kepuasan anda dalam 8 domain (1 = sangat tak puas, 10 = sangat puas) berdasarkan keadaan <i>sekarang</i>. Roda di bawah berubah secara langsung.</p>
    <svg viewBox="0 0 320 320" class="wheelsvg">
      <g id="wheelGrid"></g>
      <polygon id="wheelPoly" fill="rgba(226,125,106,.32)" stroke="#E27D6A" stroke-width="2"></polygon>
      <g id="wheelDots"></g>
    </svg>
    <div id="wheelAnalysis" class="body-picked" style="margin-bottom:12px;"></div>
    <div id="wheelDomains"></div>

    <div class="domain-title">Analisis Roda</div>
    <div class="mb"><label>Domain paling mengejutkan saya bila refleksi</label><input type="text" id="w_kejut" placeholder="cth: Rehat — rupanya saya langsung tak luangkan masa"></div>
    <div class="mb"><label>Jika roda ni tayar kereta — domain mana paling “kemek”?</label><input type="text" id="w_kemek" placeholder="cth: Kesihatan fizikal"></div>
    <div class="mb"><label>Satu domain yang ingin saya fokus tingkatkan dalam 90 hari</label><input type="text" id="w_fokus" placeholder="cth: Hubungan sosial"></div>
    <div class="mb"><label>Satu tindakan kecil untuk domain itu minggu ini</label><input type="text" id="w_tindakan" placeholder="cth: Hubungi seorang kawan lama"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Energy Audit</h2><span class="chev">▾</span></div>
    <p class="hint"><b>Langkah 1:</b> Senaraikan apa yang mengisi vs menguras tenaga anda.</p>
    <div class="domain-title" style="color:#2f8a4e;">✅ Mengisi Tenaga Saya</div>
    <div id="isi"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB5.addItem('isi')">+ Tambah</button><button type="button" class="del-row" id="isiDel" onclick="BAB5.removeItem('isi')">– Buang</button></div>
    <div class="domain-title" style="color:var(--coral);">❌ Menguras Tenaga Saya</div>
    <div id="kuras"></div>
    <div class="row-actions no-print"><button type="button" class="add-row" onclick="BAB5.addItem('kuras')">+ Tambah</button><button type="button" class="del-row" id="kurasDel" onclick="BAB5.removeItem('kuras')">– Buang</button></div>

    <div class="domain-title">Langkah 2: Analisis</div>
    <div class="grid2">
      <div><label>% masa pada perkara MENGURAS</label><input type="text" id="e_kuras_pct" placeholder="cth: 40%"></div>
      <div><label>% masa pada perkara MENGISI</label><input type="text" id="e_isi_pct" placeholder="cth: 25%"></div>
    </div>
    <div class="mb" style="margin-top:8px;"><label>Penguras terbesar yang BOLEH saya kurangkan/hapuskan</label><input type="text" id="e_kurang" placeholder="cth: Scroll media sosial waktu malam"></div>
    <div class="mb"><label>Pengisi yang SELALU saya tangguhkan / abaikan</label><input type="text" id="e_tangguh" placeholder="cth: Bersenam pagi"></div>

    <div class="domain-title">Langkah 3: Rancangan Tindakan</div>
    <div class="card"><b>Kurangkan 1 penguras</b><div class="grid2" style="margin-top:8px;"><div><label>Apa</label><input type="text" id="e3_kurang_apa"></div><div><label>Bila</label><input type="text" id="e3_kurang_bila"></div></div></div>
    <div class="card"><b>Tambah 1 pengisi</b><div class="grid2" style="margin-top:8px;"><div><label>Apa</label><input type="text" id="e3_tambah_apa"></div><div><label>Bila</label><input type="text" id="e3_tambah_bila"></div></div></div>
    <div class="card"><b>Jadualkan 1 masa rehat sedar</b><div class="grid2" style="margin-top:8px;"><div><label>Apa</label><input type="text" id="e3_rehat_apa"></div><div><label>Bila</label><input type="text" id="e3_rehat_bila"></div></div></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: Eisenhower Matrix</h2><span class="chev">▾</span></div>
    <p class="hint">Isi tugasan minggu ini ikut kuadran.</p>
    <div class="grid2">
      <div class="card" style="background:#EAF4EE;"><b style="color:#2f8a4e;">Q1 · Buat Segera</b><div style="font-size:12px;color:var(--muted);">Urgent + Penting</div><textarea id="eis_q1" placeholder="Satu tugasan satu baris"></textarea></div>
      <div class="card" style="background:var(--teal-soft);"><b style="color:var(--teal-dark);">Q2 · Jadualkan</b><div style="font-size:12px;color:var(--muted);">Penting + Tak Urgent</div><textarea id="eis_q2"></textarea></div>
      <div class="card" style="background:var(--cream);"><b style="color:#9a7b2e;">Q3 · Delegasi / Minimakan</b><div style="font-size:12px;color:var(--muted);">Urgent + Tak Penting</div><textarea id="eis_q3"></textarea></div>
      <div class="card" style="background:#FBE6E1;"><b style="color:#c0492f;">Q4 · Hapuskan / Elakkan</b><div style="font-size:12px;color:var(--muted);">Tak Urgent + Tak Penting</div><textarea id="eis_q4"></textarea></div>
    </div>
    <div class="mb" style="margin-top:10px;"><label>Refleksi: Di kuadran mana saya paling banyak habiskan masa sekarang?</label><textarea id="eis_refleksi"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Script Sempadan Peribadi</h2><span class="chev">▾</span></div>
    <p class="hint">Tulis script ini guna bahasa & situasi anda sendiri supaya rasa semula jadi bila digunakan.</p>
    <div class="mb"><label>Situasi 1: Menolak kerja tambahan / permintaan bos melebihi kapasiti</label><textarea id="s_1" placeholder="cth: “Saya nak pastikan kerja sedia ada siap dengan baik. Boleh kita bincang keutamaan dulu?”"></textarea></div>
    <div class="mb"><label>Situasi 2: Menolak permintaan kawan/saudara bila anda penat</label><textarea id="s_2" placeholder="cth: “Aku nak tolong, tapi aku betul-betul kena rehat hari ni.”"></textarea></div>
    <div class="mb"><label>Situasi 3: Menetapkan sempadan masa kerja (terutama remote)</label><textarea id="s_3" placeholder="cth: “Saya online sampai 6 petang. Mesej selepas tu saya balas esok pagi.”"></textarea></div>
    <div class="mb"><label>Situasi 4: Satu situasi anda perlukan sempadan tapi selalu gagal — terangkan</label><textarea id="s_4_situasi" placeholder="Terangkan situasinya"></textarea></div>
    <div class="mb"><label>Script saya untuk situasi 4</label><textarea id="s_4" placeholder="Tulis ayat anda sendiri"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Shutdown Ritual Saya</h2><span class="chev">▾</span></div>
    <p class="hint">Reka ritual 5–15 minit selepas waktu kerja.</p>
    <div class="mb"><label>Langkah 1 (Semak & Tutup)</label><textarea id="sd_1" placeholder="cth: Semak to-do esok, tutup semua tab kerja"></textarea></div>
    <div class="mb"><label>Langkah 2 (Isyarat Peralihan)</label><textarea id="sd_2" placeholder="cth: Tukar baju / jalan kaki sekejar / minum teh"></textarea></div>
    <div class="mb"><label>Langkah 3 (Ayat Penutup — sebut atau tulis)</label><input type="text" id="sd_ayat" placeholder="cth: “Kerja dah tamat untuk hari ni. Aku dah cukup.”"></div>
    <div class="mb"><label>Masa saya akan buat ritual ini setiap hari</label><input type="text" id="sd_masa" placeholder="cth: 6:00 petang"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian F: Refleksi Akhir</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Apa yang paling mengejutkan saya tentang cara saya urus tenaga & sempadan?</label><textarea id="f_kejut"></textarea></div>
    <div class="mb"><label>Satu perubahan terkecil yang boleh beri impak paling besar sekarang</label><textarea id="f_impak"></textarea></div>
  </div>

  <div class="finish"><b>✅ Ingat:</b> Anda tak perlu ubah segalanya sekaligus. Pilih satu perkara, buat dengan konsisten, dan biarkan kejayaan kecil bina momentum.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab5_roda_kehidupan", nav:"Bab 5 · Roda Kehidupan", title:"Roda Kehidupan & Sempadan", subtitle:"Worksheet Bab 5",
  html, counts:{isi:0,kuras:0},

  init(root){
    // grid roda
    let g="";
    [2,4,6,8,10].forEach(l=>{ const p=Array.from({length:N},(_,i)=>pt(i,l/10*MAXR).join(",")).join(" "); g+=`<polygon points="${p}" fill="none" stroke="#DCE7EB" stroke-width="1"/>`; });
    for(let i=0;i<N;i++){ const [x,y]=pt(i,MAXR); g+=`<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="#DCE7EB" stroke-width="1"/>`; }
    DOMAINS.forEach((d,i)=>{ const [x,y]=pt(i,MAXR+15); g+=`<text x="${x}" y="${y}" font-size="11" fill="#2C6E87" text-anchor="middle" dominant-baseline="middle" font-family="Quicksand" font-weight="600">${d[1]}</text>`; });
    root.querySelector("#wheelGrid").innerHTML=g;
    // domain sliders
    const wd=root.querySelector("#wheelDomains"); wd.innerHTML="";
    DOMAINS.forEach((d,idx)=>{ const i=idx+1;
      wd.insertAdjacentHTML("beforeend",`<div class="card"><b style="font-family:'Quicksand';color:var(--teal-dark);">${i}. ${d[0]}</b>
        <div style="font-size:13px;color:var(--muted);margin:2px 0 4px;">${d[2]}</div>
        <div class="slider-row"><input type="range" min="1" max="10" value="5" data-k="wheel_${i}" oninput="BAB5.onWheel()"><span class="val" id="wv_${i}">5</span></div></div>`);
    });
    // energy lists
    this.counts={isi:0,kuras:0};
    root.querySelector("#isi").innerHTML=""; root.querySelector("#kuras").innerHTML="";
    this.addItem('isi'); this.addItem('kuras');
    // wheel input listeners already inline (onWheel)
  },
  beforeApply(data){
    ['isi','kuras'].forEach(grp=>{ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(new RegExp("^"+grp+"_(\\d+)$")); if(m)mx=Math.max(mx,+m[1]);}); while(this.counts[grp]<mx) this.addItem(grp); });
  },
  afterLoad(){ this.refreshWheelLabels(); this.drawWheel(); },

  /* ---- roda ---- */
  onWheel(){ this.refreshWheelLabels(); this.drawWheel(); },
  refreshWheelLabels(){ for(let i=1;i<=N;i++){ const s=document.querySelector('[data-k="wheel_'+i+'"]'), v=document.getElementById("wv_"+i); if(s&&v)v.textContent=s.value; } },
  vals(){ return DOMAINS.map((d,idx)=>{ const s=document.querySelector('[data-k="wheel_'+(idx+1)+'"]'); return s?+s.value:5; }); },
  drawWheel(){ const rs=this.vals();
    const poly=rs.map((r,i)=>pt(i,r/10*MAXR).join(",")).join(" ");
    const pl=document.getElementById("wheelPoly"); if(pl) pl.setAttribute("points",poly);
    const dg=document.getElementById("wheelDots"); if(dg) dg.innerHTML=rs.map((r,i)=>{const[x,y]=pt(i,r/10*MAXR);return `<circle cx="${x}" cy="${y}" r="3" fill="#E27D6A"/>`;}).join("");
    // analisis auto
    let mxi=0,mni=0; rs.forEach((r,i)=>{ if(r>rs[mxi])mxi=i; if(r<rs[mni])mni=i; });
    const el=document.getElementById("wheelAnalysis");
    if(el) el.innerHTML=`💪 Kekuatan: <b>${DOMAINS[mxi][0]}</b> (${rs[mxi]}/10) &nbsp;·&nbsp; ⚠️ Perlu perhatian: <b>${DOMAINS[mni][0]}</b> (${rs[mni]}/10)`;
  },

  /* ---- energy lists ---- */
  addItem(grp){ this.counts[grp]++; const r=this.counts[grp];
    document.getElementById(grp).insertAdjacentHTML("beforeend",
      `<div class="trigger-line"><span class="num">${r}</span><input type="text" data-k="${grp}_${r}" placeholder="${grp==='isi'?'cth: Jalan kaki pagi':'cth: Mesyuarat panjang tanpa agenda'}"></div>`);
    this.updateDel(grp); },
  removeItem(grp){ if(this.counts[grp]<=1) return; const c=document.getElementById(grp); c.lastElementChild.remove(); this.counts[grp]--; this.updateDel(grp); App.save(); },
  updateDel(grp){ const b=document.getElementById(grp+"Del"); if(b)b.disabled=this.counts[grp]<=1; }
};
window.BAB5=M;
registerWorksheet(M);
})();
