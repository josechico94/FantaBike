/* ---------- state ---------- */
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let L=ls.get("fb-l")||"it", RID=ls.get("fb-r")||"vuelta", TAB="home", CJ="gen", SEL=null, HL=null;
const t=k=>T[L][k];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- formatting ---------- */
const hms=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0")};
const gcT=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h+"h "+String(m).padStart(2,"0")+"' "+String(x).padStart(2,"0")+'"'};
const gapT=s=>{if(s<=0)return "—";s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return "+"+(h?h+"h ":"")+(h||m?String(m).padStart(h?2:1,"0")+"' ":"")+String(x).padStart(2,"0")+'"'};
const dfmt=d=>{const x=new Date(d+"T12:00:00");return x.toLocaleDateString(L==="it"?"it-IT":"es-ES",{weekday:"short",day:"numeric",month:"short"})};

