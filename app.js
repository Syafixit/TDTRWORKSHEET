/* ================= TENANG DI TENGAH RIBUT — Core App ================= */
(function(){
  const SUPABASE_URL = "https://rqbfgnhgmrdbtalcruoj.supabase.co";
  const SUPABASE_KEY = "sb_publishable_cAEN19NBGDupsNAswwB4rg_UhfY_qI-";
  let sb=null; try{ sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false}}); }catch(e){}

  const KOD_KEY="calm_kod";
  const NAMA_KEY="calm_nama";
  const registry=[];
  let activeId=null;

  function dataKey(id){ return "ws_"+id; }
  function content(){ return document.getElementById("content"); }
  function moduleOf(id){ return registry.find(w=>w.id===id); }
  function activeModule(){ return moduleOf(activeId); }
  function clampDate(s){ return s<"2026-01-01"?"2026-01-01":(s>"2030-12-31"?"2030-12-31":s); }
  function genKod(){ const A="0123456789ABCDEFGHJKMNPQRSTVWXYZ"; const a=new Uint32Array(8); crypto.getRandomValues(a); let s=""; for(let i=0;i<8;i++) s+=A[a[i]%A.length]; return "CALM-"+s.slice(0,4)+"-"+s.slice(4); }
  function currentKod(){ return localStorage.getItem(KOD_KEY)||""; }
  function nama(){ return localStorage.getItem(NAMA_KEY)||null; }

  /* ---------- data ---------- */
  function fields(root){ return root.querySelectorAll("[data-k], input[id], textarea[id], select[id]"); }
  function getData(root){ const d={}; fields(root).forEach(el=>{ if(el.hasAttribute("data-nosave")) return; const k=el.dataset.k||el.id; if(!k) return; d[k]= el.type==="checkbox"?el.checked:el.value; }); return d; }
  function applyData(root,data){ fields(root).forEach(el=>{ const k=el.dataset.k||el.id; if(!(k in data)) return; if(el.type==="checkbox") el.checked=data[k]; else el.value=data[k]; }); }

  let flashT;
  function flashSaved(){ const s=document.getElementById("saveState"); if(!s)return; s.classList.add("show"); clearTimeout(flashT); flashT=setTimeout(()=>s.classList.remove("show"),900); }

  let navRefreshT;
  function saveActive(){
    if(!activeId) return;
    const data=getData(content());
    localStorage.setItem(dataKey(activeId), JSON.stringify(data));
    flashSaved(); scheduleCloud();
    clearTimeout(navRefreshT); navRefreshT=setTimeout(refreshNavProgress, 800);
  }

  /* ---------- router ---------- */
  function showWorksheet(id){
    const w=moduleOf(id); if(!w) return;
    activeId=id;
    localStorage.setItem("calm_last", id);
    const root=content();
    const dateField = w.skipDateHeader ? "" :
      `<div class="ws-date"><label>Tarikh</label><input type="date" data-k="meta_tarikh" min="2026-01-01" max="2030-12-31"></div>`;
    const editionBar = w.hideHeader ? "" : `
      <div class="edition-bar">
        <span class="left">Edisi Premium · 2026</span>
        <span class="right">Tenang Di Tengah Ribut · Worksheet</span>
      </div>`;
    const header = w.hideHeader ? "" : `
      ${editionBar}
      <div class="ws-header">
        <div class="eyebrow">${w.subtitle||""}</div>
        <h1>${w.title}<span class="h1-dot">.</span></h1>
        <div class="sub">Tenang Di Tengah Ribut</div>
        <div class="rule"></div>
        ${dateField}
      </div>`;
    // smooth page transition
    root.classList.remove("page-in");
    void root.offsetWidth; // reflow
    root.innerHTML = `${header}<div class="ws-body">${w.html}</div>`;
    root.classList.add("page-in");
    if(w.init) w.init(root, api);
    // Edisi Premium: split "Bahagian X:" jadi pill badge + tajuk serif
    root.querySelectorAll(".section-head h2").forEach(h2=>{
      if(h2.dataset.styled) return;
      const txt = (h2.textContent||"").trim();
      const m = txt.match(/^(Bahagian\s+[A-Z0-9]+(?:\d*))\s*[:·\-—]\s*(.+)$/i);
      if(m){
        const badge = m[1].toUpperCase().replace(/\s+/g," ");
        const title = m[2].trim();
        const chevSibling = h2.parentElement.querySelector(".chev");
        const lineHTML = `<span class="sec-line"></span>`;
        h2.outerHTML = `<span class="sec-badge">${badge}</span><h2 data-styled="1">${title}</h2>${lineHTML}`;
        // make sure chev is at the end
        if(chevSibling){ chevSibling.parentElement.appendChild(chevSibling); }
      } else {
        // Tiada prefix "Bahagian" — tetap serif title sahaja
        h2.dataset.styled = "1";
      }
    });
    // muat data
    const raw=localStorage.getItem(dataKey(id));
    const data = raw? JSON.parse(raw):null;
    if(data){ if(w.beforeApply) w.beforeApply(data, root); applyData(root, data); }
    const t=root.querySelector('[data-k="meta_tarikh"]'); if(t && !t.value) t.value=clampDate(new Date().toISOString().slice(0,10));
    if(w.afterLoad) w.afterLoad(root, api);
    // UI state
    document.getElementById("topTitle").textContent = w.nav;
    [...document.querySelectorAll(".nav-link")].forEach(a=>a.classList.toggle("active", a.dataset.id===id));
    window.scrollTo(0,0);
    if(window.innerWidth<=860) toggleNav(false);
  }

  /* ---------- sidebar ---------- */
  const NAV_GROUPS = {
    rumah:        {label:"", order:0},
    rekod_sejarah:{label:"", order:0},
    bab1_peta_stres:        {label:"🌱 Permulaan", order:1},
    bab2_peta_badan:        {label:"🌱 Permulaan", order:1},
    bab3_thought_record:    {label:"🛠️ Amalan",    order:2},
    bab4_toolkit_emosi:     {label:"🛠️ Amalan",    order:2},
    bab5_roda_kehidupan:    {label:"🌿 Refleksi",  order:3},
    bab6_audit_gaya_hidup:  {label:"🛠️ Amalan",    order:2},
    bab7_peta_sokongan:     {label:"🌿 Refleksi",  order:3},
    bab8_habit_tracker:     {label:"🛠️ Amalan",    order:2},
    bab9_pelan_kecemasan:   {label:"🆘 Krisis",    order:4},
    bab10_blueprint_wellness:{label:"🌿 Refleksi", order:3}
  };
  function completionFor(id){
    try{
      const raw=localStorage.getItem("ws_"+id); if(!raw) return 0;
      const data=JSON.parse(raw);
      let f=0,t=0;
      Object.values(data).forEach(v=>{ t++;
        if(typeof v==="boolean"){ if(v)f++; }
        else if(typeof v==="string" && v.trim()) f++;
        else if(typeof v==="number") f++;
      });
      return t?Math.min(100,Math.round(f/t*100)):0;
    }catch(e){ return 0; }
  }
  function progressDot(pct){
    if(pct<=0) return `<span class="nav-dot dot-empty" title="Belum mula"></span>`;
    if(pct<30) return `<span class="nav-dot dot-low" title="${pct}% diisi"></span>`;
    if(pct<70) return `<span class="nav-dot dot-mid" title="${pct}% diisi"></span>`;
    return `<span class="nav-dot dot-hi" title="${pct}% diisi"></span>`;
  }
  function buildNav(){
    const nav=document.getElementById("navList");
    const ungrouped = registry.filter(w=>!NAV_GROUPS[w.id] || NAV_GROUPS[w.id].order===0);
    const grouped = registry.filter(w=>NAV_GROUPS[w.id] && NAV_GROUPS[w.id].order>0);
    grouped.sort((a,b)=>NAV_GROUPS[a.id].order - NAV_GROUPS[b.id].order);
    const buckets = {};
    grouped.forEach(w=>{
      const grp = NAV_GROUPS[w.id].label;
      if(!buckets[grp]) buckets[grp]=[];
      buckets[grp].push(w);
    });
    let html = ungrouped.map(w=>{
      const pct = w.id.startsWith("bab")? completionFor(w.id) : -1;
      return `<a class="nav-link" data-id="${w.id}" onclick="App.go('${w.id}')">
        ${pct>=0?progressDot(pct):'<span class="nav-dot dot-feature" title="Halaman utama"></span>'}
        <span class="nav-text">${w.nav}</span>
      </a>`;
    }).join("");
    Object.entries(buckets).forEach(([grp,items])=>{
      html += `<div class="nav-group-label">${grp}</div>`;
      html += items.map(w=>{
        const pct=completionFor(w.id);
        return `<a class="nav-link" data-id="${w.id}" onclick="App.go('${w.id}')">
          ${progressDot(pct)}
          <span class="nav-text">${w.nav}</span>
        </a>`;
      }).join("");
    });
    nav.innerHTML = html;
  }
  function refreshNavProgress(){
    document.querySelectorAll(".nav-link").forEach(a=>{
      const id=a.dataset.id;
      if(!id || !id.startsWith("bab")) return;
      const pct=completionFor(id);
      const dot=a.querySelector(".nav-dot");
      if(!dot) return;
      const cls=pct<=0?"dot-empty":(pct<30?"dot-low":(pct<70?"dot-mid":"dot-hi"));
      dot.className="nav-dot "+cls;
      dot.title=pct<=0?"Belum mula":pct+"% diisi";
    });
  }
  function toggleNav(force){
    const open = (typeof force==="boolean")? force : !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
  }

  /* ---------- cloud ---------- */
  function cloudMsg(t,ok){ const m=document.getElementById("cloudMsg"); if(!m)return; m.textContent=t; m.style.color= ok===false?"#c0392b":"#2f8a4e"; }
  function showKodUI(){ document.getElementById("cloudOff").style.display="none"; document.getElementById("cloudOn").style.display="block"; document.getElementById("kodShow").textContent=currentKod(); document.getElementById("cloudBtn").style.display="flex"; }
  async function pushWorksheet(kod,id){
    const raw=localStorage.getItem(dataKey(id)); if(!raw) return true;
    const {error}=await sb.rpc("save_worksheet",{p_kod:kod,p_worksheet_id:id,p_nama:nama(),p_data:JSON.parse(raw)});
    return !error;
  }
  async function cloudPushAll(kod){ for(const w of registry){ await pushWorksheet(kod,w.id); if(w.onCloudActivate) await w.onCloudActivate(kod, sb); } }
  async function cloudActivate(){
    if(!sb){ cloudMsg("Sambungan awan tak tersedia.",false); return; }
    const kod=genKod(); cloudMsg("Menyimpan…");
    localStorage.setItem(KOD_KEY,kod);
    await cloudPushAll(kod);
    showKodUI(); cloudMsg("Aktif! Simpan kod anda.");
  }
  async function cloudSaveNow(){ const kod=currentKod(); if(!kod||!sb) return; cloudMsg("Menyimpan…"); await pushWorksheet(kod,activeId); cloudMsg("Tersimpan ke awan ✓ "+new Date().toLocaleTimeString("ms-MY")); }
  async function cloudOpen(){
    const kod=(document.getElementById("kodInput").value||"").trim().toUpperCase();
    if(kod.length<8){ cloudMsg("Sila masukkan kod yang sah.",false); return; }
    if(!sb){ cloudMsg("Sambungan awan tak tersedia.",false); return; }
    cloudMsg("Membuka…");
    let found=false;
    for(const w of registry){
      const {data,error}=await sb.rpc("get_worksheet",{p_kod:kod,p_worksheet_id:w.id});
      if(error){ cloudMsg("Ralat: "+error.message,false); return; }
      if(data){ localStorage.setItem(dataKey(w.id), JSON.stringify(data)); found=true; }
    }
    if(!found){ cloudMsg("Kod tak dijumpai. Semak semula.",false); return; }
    localStorage.setItem(KOD_KEY,kod); showKodUI();
    showWorksheet(activeId||registry[0].id);
    cloudMsg("Jawapan dibuka semula ✓");
  }
  function copyKod(){ navigator.clipboard.writeText(currentKod()).then(()=>cloudMsg("Kod disalin ✓")); }
  let cloudT;
  function scheduleCloud(){ const kod=currentKod(); if(!kod||!sb) return; clearTimeout(cloudT); cloudT=setTimeout(()=>pushWorksheet(kod,activeId),2500); }

  /* ---------- actions ---------- */
  function resetActive(){ if(!confirm("Padam jawapan worksheet ini & mula semula? (Kod awan kekal)")) return; localStorage.removeItem(dataKey(activeId)); showWorksheet(activeId); }
  function downloadPDF(){ saveActive(); window.print(); }
  function toggleSec(head){ head.parentElement.classList.toggle("open"); }

  /* ---------- boot ---------- */
  function boot(){
    buildNav();
    // profile nama
    const pn=document.getElementById("profileNama");
    pn.value = localStorage.getItem(NAMA_KEY)||"";
    pn.addEventListener("input", ()=>{ localStorage.setItem(NAMA_KEY, pn.value); });
    // cloud state
    if(currentKod()) showKodUI();
    // delegated auto-save
    content().addEventListener("input", saveActive);
    content().addEventListener("change", e=>{ if(e.target.type==="checkbox"){ saveActive(); const m=activeModule(); if(m && m.onChange) m.onChange(e, content()); } });
    // nav default
    if(window.innerWidth>860) document.body.classList.add("nav-open");
    const last=localStorage.getItem("calm_last");
    const firstTime = !last && !localStorage.getItem(NAMA_KEY);
    showWorksheet((last && moduleOf(last))? last : (firstTime && moduleOf("rumah") ? "rumah" : (moduleOf("rumah")?"rumah":registry[0].id)));
  }

  /* ---------- public API ---------- */
  const api={ get sb(){return sb;}, kod:currentKod, nama, save:saveActive, clampDate, genKod, getData:()=>getData(content()) };
  window.registerWorksheet=function(w){ registry.push(w); };
  window.App={
    boot, go:showWorksheet, toggleNav, toggleSec,
    cloudActivate, cloudOpen, cloudSaveNow, copyKod, resetActive, downloadPDF,
    get sb(){return sb;}, kod:currentKod, save:saveActive, clampDate, genKod
  };
})();
