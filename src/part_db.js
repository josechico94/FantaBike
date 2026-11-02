/* ---------- picks (db) ---------- */
let DB=null,ME=null,PK={},DBS="loading",CANW=true,PSEL=null,BUSY=false,MSG=null;
const norm=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const lockAt=s=>new Date(s.d+"T12:00:00+02:00");
function isOpen(R,i){const r=R.res[i];return !(r&&Object.keys(r).length)&&!RESDB[R.id+"_"+R.stages[i].n]&&Date.now()<lockAt(R.stages[i])}
let RESDB={},ADMIN=false;
function findR(m,name){const k=norm(name);const e=Object.entries(m||{}).find(([a])=>norm(a)===k);return e?e[1]:null}
/* stage rows: Excel first; otherwise built from app picks + results entered by the organiser.
   No pick or rider out => time of the slowest DS of the stage, 0 points (S.E.) */
function effRes(R){return R.stages.map((s,i)=>{const x=R.res[i];if(x&&Object.keys(x).length)return x;
  const d=RESDB[R.id+"_"+s.n];if(!d||!d.riders)return null;const rows={};
  DTS.forEach(dt=>{const p=dbPick(R,dt.n,i);const r=p?findR(d.riders,p):null;
    if(r&&!r.out&&r.t>0)rows[dt.n]=[p,r.t,r.b||0,r.p||0,r.g||0,r.k||0,""];
    else rows[dt.n]=[p||"—",0,0,0,r?(r.g||0):0,r?(r.k||0):0,p?"RIT":"SE"]});
  const ok=Object.values(rows).filter(v=>!v[6]);const worst=ok.length?Math.max(...ok.map(v=>v[1]-v[2]+v[3])):0;
  Object.values(rows).forEach(v=>{if(v[6])v[1]=worst});return rows})}
function dups(R,dt){const m={};R.stages.forEach((s,i)=>{const p=pickOf(R,dt,i);if(!p||p==="—")return;const k=norm(p);(m[k]=m[k]||{rd:p,st:[]}).st.push(s.n)});return Object.values(m).filter(x=>x.st.length>1)}
const parseT=v=>{v=String(v||"").trim();if(!v)return 0;const p=v.split(/[^0-9]+/).filter(Boolean).map(Number);if(!p.length||p.length>3)return NaN;while(p.length<3)p.unshift(0);return p[0]*3600+p[1]*60+p[2]};
function resForm(R,i){
  const s=R.stages[i];const riders=[...new Set(DTS.map(d=>dbPick(R,d.n,i)).filter(Boolean))];
  if(!riders.length)return `<p class="note">${t("future")}</p>`;
  const cur=(RESDB[R.id+"_"+s.n]||{}).riders||{};
  return `<form class="pf rf" id="rf" data-i="${i}" autocomplete="off"><label>${t("resT")}</label><p class="muted" style="margin:0;font-size:13px">${t("resSub")}</p>
  <div class="rgrid"><span></span><small>${t("tArr")}</small><small>${t("bonus")} s</small><small>${t("pen")} s</small><small>${t("pts")}</small><small>${t("kom")}</small><small>${t("rit")}</small>
  ${riders.map((r,k)=>{const c=findR(cur,r)||{};return `<b data-rn="${esc(r)}">${esc(r)}</b><input id="rt${k}" aria-label="${t("tArr")} ${esc(r)}" placeholder="h:mm:ss" value="${c.t?hms(c.t):""}"><input id="rb${k}" type="number" min="0" value="${c.b||""}"><input id="rp${k}" type="number" min="0" value="${c.p||""}"><input id="rg${k}" type="number" min="0" value="${c.g||""}"><input id="rk${k}" type="number" min="0" value="${c.k||""}"><input id="ro${k}" type="checkbox" ${c.out?"checked":""}>`}).join("")}</div>
  ${MSG&&MSG[2]==="res"?`<div class="msg ${MSG[0]}">${MSG[1]}</div>`:""}
  <button class="btn" type="submit" ${BUSY?"disabled":""}>${t("resSave")}</button></form>`;
}
async function saveRes(f){
  const R=RACES[RID],i=+f.dataset.i,s=R.stages[i];const names=[...f.querySelectorAll("[data-rn]")].map(b=>b.dataset.rn);const riders={};
  for(let k=0;k<names.length;k++){const tv=parseT(f.querySelector("#rt"+k).value),out=f.querySelector("#ro"+k).checked;
    if(isNaN(tv)||(!out&&!tv)){MSG=["err",t("fmtErr").replace("{r}",esc(names[k])),"res"];render();return}
    const n=id=>Math.max(0,parseInt(f.querySelector("#"+id+k).value)||0);
    riders[names[k]]={t:tv,b:n("rb"),p:n("rp"),g:n("rg"),k:n("rk"),out}}
  BUSY=true;render();
  try{await DB.collection("results").doc(R.id+"_"+s.n).set({riders,ts:Date.now()});BUSY=false;MSG=null;toast("✓ "+t("resSaved"))}
  catch(e){BUSY=false;MSG=["err",t("saveErr"),"res"]}
  render();
}
function ownerOf(dt){let best=null;Object.entries(PK).forEach(([u,d])=>{if(d&&d.dt===dt&&(!best||(d.since||0)<(PK[best].since||0)))best=u});return best}
function myDt(){const d=PK[ME];return d&&d.dt&&ownerOf(d.dt)===ME?d.dt:null}
function dbPick(R,dt,i){const u=ownerOf(dt);const v=u&&PK[u]&&PK[u][R.id]&&PK[u][R.id][String(R.stages[i].n)];return v||null}
function pickOf(R,dt,i){const r=R.res[i];if(r&&r[dt])return r[dt][0];return dbPick(R,dt,i)}
function usedList(R,dt,except){const o=[];R.stages.forEach((s,i)=>{if(i===except)return;const p=pickOf(R,dt,i);if(p)o.push({n:s.n,rd:p})});return o}
function riderNames(){const set=new Map();VUELTA_DATA.res.forEach(r=>Object.values(r).forEach(v=>{const k=norm(v[0]);if(k&&!set.has(k))set.set(k,String(v[0]).trim())}));
  Object.values(PK).forEach(d=>["vuelta","tour"].forEach(k=>Object.values((d&&d[k])||{}).forEach(v=>{const n=norm(v);if(n&&!set.has(n))set.set(n,v)})));
  return [...set.values()].sort((a,b)=>a.localeCompare(b))}
function countdown(dt){let ms=Math.max(0,dt-Date.now());const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);return (d?d+"g ":"").replace("g",L==="it"?"g":"d")+h+"h "+String(m).padStart(2,"0")+"m"}

