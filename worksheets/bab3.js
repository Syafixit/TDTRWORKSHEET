/* ============== BAB 3 — Tangkap Perangkap Fikiran (Thought Record) ============== */
(function(){
const TRAPS=[
  ["Catastrophising","selalu bayangkan senario paling buruk"],
  ["All-or-Nothing Thinking","tiada ruang tengah, semua hitam atau putih"],
  ["Mind Reading","yakin tahu apa orang lain fikirkan"],
  ["Fortune Telling","ramal masa depan secara negatif"],
  ["Overgeneralisation","satu kejadian jadi kesimpulan keseluruhan"],
  ["Personalisation","salahkan diri untuk perkara di luar kawalan"],
  ["Mental Filter","fokus pada yang buruk, abaikan yang baik"],
  ["Disqualifying the Positive","tolak atau tak percaya perkara baik"],
  ["Emotional Reasoning","perasaan = fakta"],
  ["Should Statements","peraturan rigid untuk diri sendiri & orang lain"]
];

const html=`
  <div class="note">Worksheet ni membantu anda kenal pasti, semak, dan ubah corak fikiran yang tak membantu. Isi bila mood drop atau ada fikiran negatif yang kuat. <b>Jawapan auto-simpan dalam telefon anda.</b></div>

  <div class="section collapsible open">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian A: Kenali Perangkap Fikiran Saya</h2><span class="chev">▾</span></div>
    <p class="hint">Tandakan perangkap fikiran yang paling kerap anda alami.</p>
    <div class="check-group" id="trapList"></div>
    <div class="domain-title">3 perangkap yang PALING kerap berlaku pada saya</div>
    <div class="trigger-line"><span class="num">1</span><input type="text" id="a_trap1" placeholder="cth: Catastrophising"></div>
    <div class="trigger-line"><span class="num">2</span><input type="text" id="a_trap2" placeholder="cth: Mind Reading"></div>
    <div class="trigger-line"><span class="num">3</span><input type="text" id="a_trap3" placeholder="cth: Should Statements"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian B: Thought Record (Kaedah 3C)</h2><span class="chev">▾</span></div>
    <p class="hint">Bila ada fikiran negatif yang kuat, isi langkah-langkah ni. Cuba isi sekurang-kurangnya 5 situasi dalam 2 minggu.</p>
    <div id="sits"></div>
    <div class="row-actions no-print">
      <button type="button" class="add-row" onclick="BAB3.addSit()">+ Tambah situasi</button>
      <button type="button" class="del-row" id="sitDel" onclick="BAB3.removeSit()">– Buang situasi</button>
    </div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian C: “Jika Kawan Saya Yang Cakap Ini…”</h2><span class="chev">▾</span></div>
    <p class="hint">Latihan self-compassion — kita selalu lebih baik menasihati orang lain berbanding diri sendiri.</p>
    <div class="mb"><label>1 fikiran negatif yang paling kerap menyeksa saya</label><textarea id="c_fikiran" placeholder="cth: “Aku memang tak cukup bagus”"></textarea></div>
    <div class="mb"><label>Jika kawan baik datang dengan fikiran sama — apa saya akan cakap pada dia?</label><textarea id="c_kawan" placeholder="cth: “Kamu dah buat yang terbaik, satu kesilapan tak tentukan nilai kamu”"></textarea></div>
    <div class="mb"><label>Sekarang tulis semula nasihat itu — untuk diri saya sendiri</label><textarea id="c_diri" placeholder="Tukar “kamu” kepada “aku”…"></textarea></div>
    <div class="mb"><label>Apa yang berbeza antara cara saya layani kawan vs diri sendiri?</label><textarea id="c_beza" placeholder="cth: Saya jauh lebih keras pada diri sendiri"></textarea></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian D: Gratitude Reframe (7 Hari)</h2><span class="chev">▾</span></div>
    <p class="hint">Tulis 1 perkara <b>spesifik</b> yang anda bersyukur setiap hari — bukan sekadar “aku bersyukur dengan hidup”.</p>
    <div id="grat"></div>
  </div>

  <div class="section collapsible">
    <div class="section-head" onclick="App.toggleSec(this)"><h2>Bahagian E: Refleksi Akhir</h2><span class="chev">▾</span></div>
    <div class="mb"><label>Apa yang paling saya sedar tentang corak fikiran saya?</label><textarea id="e_sedar" placeholder="cth: Saya banyak buat fortune telling bila stres"></textarea></div>
    <div class="mb"><label>Perangkap fikiran mana paling susah untuk saya “keluar”? Kenapa?</label><textarea id="e_susah" placeholder="cth: Should statements — sebab saya rasa ia ‘betul’"></textarea></div>
    <div class="mb"><label>Satu komitmen tentang cara saya akan layani fikiran negatif mulai sekarang</label><textarea id="e_komitmen" placeholder="cth: Berhenti & tanya ‘ada bukti ke?’ sebelum percaya fikiran tu"></textarea></div>
  </div>

  <div class="finish"><b>✅ Ingat:</b> Tujuan bukan untuk hapuskan fikiran negatif — tapi untuk tak bagi ia berkuasa ke atas tindakan & perasaan anda. Setiap kali guna 3C, anda melatih otak berfikir lebih adil.</div>
  <div class="footer-note">Worksheet ni sebahagian dari ebook “Tenang Di Tengah Ribut”.</div>`;

const M={
  id:"bab3_thought_record", nav:"Bab 3 · Thought Record", title:"Tangkap Perangkap Fikiran", subtitle:"Worksheet Bab 3",
  html, sitCount:0,

  init(root){
    // trap checklist
    const tl=root.querySelector("#trapList"); tl.innerHTML=`<h3>10 Perangkap Fikiran</h3>`+
      TRAPS.map((t,i)=>`<label class="chk"><input type="checkbox" data-k="trap_${i+1}"> <span><b>${t[0]}</b> — ${t[1]}</span></label>`).join("");
    // gratitude 7 hari
    const g=root.querySelector("#grat"); g.innerHTML="";
    for(let i=1;i<=7;i++){
      g.insertAdjacentHTML("beforeend",`<div class="card"><span class="card-tag">Hari ${i}</span>
        <div class="mb"><label>Perkara yang saya bersyukur (spesifik)</label><input type="text" data-k="grat_${i}_perkara" placeholder="cth: Mak hantar makanan tengah hari tadi"></div>
        <div class="mb"><label>Kenapa ia bermakna</label><input type="text" data-k="grat_${i}_kenapa" placeholder="cth: Buat saya rasa diingati & disayangi"></div></div>`);
    }
    // situasi (dinamik)
    this.sitCount=0; root.querySelector("#sits").innerHTML=""; this.addSit();
  },
  beforeApply(data){ this.ensureSit(data); },
  afterLoad(){ this.refreshSitLabels(); },

  /* ----- situasi 3C ----- */
  sitHTML(r){ return `<div class="card"><span class="card-tag">Situasi ${r}</span>
    <div class="grid2">
      <div><label>Tarikh</label><input type="date" min="2026-01-01" max="2030-12-31" data-k="sit_${r}_date"></div>
      <div><label>A — Apa yang berlaku? (Pencetus)</label><input type="text" data-k="sit_${r}_cetus" placeholder="cth: Bos tak balas mesej saya"></div>
    </div>
    <div class="mb" style="margin-top:8px;"><label>Fikiran Automatik (apa terlintas di kepala?)</label><textarea data-k="sit_${r}_fikiran" placeholder="cth: “Dia marah dengan aku”"></textarea></div>
    <div class="slider-row"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Intensiti perasaan</span>
      <input type="range" min="0" max="100" value="50" data-k="sit_${r}_before" oninput="document.getElementById('sb_${r}').textContent=this.value+'%'">
      <span class="val" id="sb_${r}">50%</span></div>
    <div class="mb"><label>Perangkap fikiran yang terlibat</label><input type="text" data-k="sit_${r}_perangkap" placeholder="cth: Mind Reading / Fortune Telling"></div>
    <div class="domain-title" style="font-size:14px;margin:10px 0 6px;">B — Semak Bukti</div>
    <div class="grid2">
      <div><label>Bukti yang MENYOKONG fikiran</label><textarea data-k="sit_${r}_sokong" placeholder="cth: Dia memang biasanya balas cepat"></textarea></div>
      <div><label>Bukti yang MENENTANG fikiran</label><textarea data-k="sit_${r}_tentang" placeholder="cth: Dia mungkin sibuk / dalam mesyuarat"></textarea></div>
    </div>
    <div class="mb" style="margin-top:10px;"><label>C — Fikiran Realistik (lebih adil & berasaskan bukti)</label><textarea data-k="sit_${r}_realistik" placeholder="cth: “Mungkin dia sibuk, bukan semestinya marah”"></textarea></div>
    <div class="slider-row"><span style="font-size:13px;color:var(--muted);white-space:nowrap;">Perasaan selepas reframe</span>
      <input type="range" min="0" max="100" value="50" data-k="sit_${r}_after" oninput="document.getElementById('sa_${r}').textContent=this.value+'%'">
      <span class="val" id="sa_${r}">50%</span></div>
  </div>`; },
  addSit(){ this.sitCount++; document.getElementById("sits").insertAdjacentHTML("beforeend", this.sitHTML(this.sitCount)); this.updateSitDel(); },
  removeSit(){ if(this.sitCount<=1) return; document.getElementById("sits").lastElementChild.remove(); this.sitCount--; this.updateSitDel(); App.save(); },
  updateSitDel(){ const b=document.getElementById("sitDel"); if(b)b.disabled=this.sitCount<=1; },
  ensureSit(data){ let mx=1; Object.keys(data).forEach(k=>{const m=k.match(/^sit_(\d+)_/); if(m)mx=Math.max(mx,+m[1]);}); while(this.sitCount<mx) this.addSit(); },
  refreshSitLabels(){ for(let r=1;r<=this.sitCount;r++){
    const b=document.querySelector('[data-k="sit_'+r+'_before"]'), a=document.querySelector('[data-k="sit_'+r+'_after"]');
    const bl=document.getElementById("sb_"+r), al=document.getElementById("sa_"+r);
    if(b&&bl)bl.textContent=b.value+"%"; if(a&&al)al.textContent=a.value+"%"; } }
};
window.BAB3=M;
registerWorksheet(M);
})();
