/* ---------- extra strings ---------- */
Object.assign(T.it,{altT:"Altimetria",results:"Ordine d'arrivo DS",races:"Scegli la corsa",langT:"Lingua",gapT:"Distacchi",stageOf:"Tappa {n} di 21",
  sub_cls:"Dopo la tappa {n}",sub_stg:"21 tappe · {km} km",sub_teams:"10 direttori sportivi",sub_pick:"Un corridore per tappa, mai due volte",yourPos:"La tua posizione",posG:"Posizione in generale",
  open:"aperta",closed:"chiusa",dayN:"Giorno",noPicksYet:"Ancora nessuna scelta",trendTip:"Tocca un nome per evidenziarlo",now:"Ora",done2:"corsa",rest:"Riposo",fin:"Arrivo"});
Object.assign(T.es,{altT:"Altimetría",results:"Orden de llegada de los DD",races:"Elige la carrera",langT:"Idioma",gapT:"Diferencias",stageOf:"Etapa {n} de 21",
  sub_cls:"Tras la etapa {n}",sub_stg:"21 etapas · {km} km",sub_teams:"10 directores deportivos",sub_pick:"Un corredor por etapa, nunca dos veces",yourPos:"Tu posición",posG:"Posición en la general",
  open:"abierta",closed:"cerrada",dayN:"Día",noPicksYet:"Todavía sin elecciones",trendTip:"Toca un nombre para destacarlo",now:"Ahora",done2:"corrida",rest:"Descanso",fin:"Llegada"});
T.it.rules="Regole";T.es.rules="Reglas";

/* ---------- small helpers ---------- */
function stageTitle(s){return s.a===s.b?esc(s.a):`${esc(s.a)}<span class="ar">›</span>${esc(s.b)}`}
function chips(s,dk){return `<div class="chips ${dk?"dk":""}"><span class="chip">${dfmt(s.d)}</span><span class="chip num">${String(s.km).replace(".",",")} ${t("km")}</span><span class="chip"><i style="background:${tyCol(s.ty)}"></i>${t("ty")[s.ty]}</span>${s.top?`<span class="chip">▲ ${t("top")}</span>`:""}</div>`}
function largeTitle(title,sub){return `<div class="lt"><h1>${title}</h1>${sub?`<p>${sub}</p>`:""}</div>`}
function toast(m){const e=$("#toast");e.innerHTML=m;e.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("on"),2600)}
const vib=()=>{try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}};
function topKits(C){if(C.last<0)return [jkind("gen"),"verde","pois"];const sd=standing(C,"gen");return sd.slice(0,3).map(x=>x.n)}

/* ---------- HOME ---------- */
function vHome(R,C){
  if(C.last<0)return vPre(R,C);
  const s=R.stages[C.last],nx=R.stages[C.last+1],rows=C.day[C.last];
  const hero=`<section class="hero bleed">${scene(s,{riders:topKits(C)})}<div class="ov"><span class="tag">${t("stage")} ${s.n} · ${t("done2")}</span><h1>${stageTitle(s)}</h1>${chips(s)}</div></section>`;
  let win="";
  if(C.st[C.last]==="ok"&&rows.length){const w=rows.filter(x=>x.gap===0);
    win=`<button class="card dayw press" data-dt="${esc(w[0].n)}">${jersey(w[0].n)}<div class="t"><div class="eb">${t("dayWin")}</div><b>${w.map(x=>esc(x.n)).join(", ")}</b><div class="muted" style="font-size:13px">${t("with")} ${[...new Set(w.map(x=>esc(x.rd)))].join(", ")}</div></div><div class="tm">${hms(w[0].tot)}<small>${t("total")}</small></div></button>`}
  else if(C.st[C.last]==="neu")win=`<p class="note">${t("neutral")}</p>`;
  const J=["gen","verde","pois"].map(j=>{const sd=standing(C,j);const top=sd.filter(x=>x.pos===sd[0].pos);const v=j==="gen"?gcT(sd[0].v):sd[0].v+" "+t("points");
    return `<button class="jt ${j} press" data-go="cls" data-j="${j}"><div class="jb"><div class="l">${t(jkind(j))}</div><b>${top.map(x=>esc(x.n)).join(" / ")}</b><div class="v">${v}</div></div>${jersey(jkind(j))}</button>`}).join("");
  const sd=standing(C,"gen");const p=[sd[1],sd[0],sd[2]];
  const pod=`<div class="card"><div class="podw">${confetti(C.last+3)}<div class="podium">${p.map(x=>`<button class="pod press" data-dt="${esc(x.n)}">${jersey(x.n)}<div class="n">${esc(x.n)}</div><div class="g">${x===sd[0]?gcT(x.v):gapT(x.v-sd[0].v)}</div><div class="blk"><span>${x.pos}</span></div></button>`).join("")}</div></div></div>`;
  return `${hero}${win}
  <section><div class="sh2"><h2>${t("leader")}</h2><span class="eb">${t("after")} ${s.n}</span></div><div class="hs bleed">${J}</div></section>
  <section><div class="sh2"><h2>${t("podium")}</h2><span class="eb">${t(R.lead)}</span></div>${pod}</section>
  <section><div class="sh2"><h2>${t("road")}</h2><span class="eb">${C.last+1} ${t("done")} · ${20-C.last} ${t("left")}</span></div><div class="card route">${routeMap(R,C)}${routeLegend()}</div></section>
  ${nx?nextCard(R,C.last+1):""}`;
}
function nextCard(R,i){const s=R.stages[i];const open=isOpen(R,i);
  return `<section><div class="sh2"><h2>${t("next")}</h2><span class="eb">${t("stage")} ${s.n}</span></div><button class="card nx press" data-s="${i}" data-tab="stg">${scene(s,{w:120,h:120,thumb:true,riders:[jkind("gen")]})}<div class="t"><b>${stageTitle(s)}</b>${chips(s,1)}${open?`<span class="eb" style="color:var(--green)">${t("closesIn")} · ${countdown(lockAt(s))}</span>`:""}</div></button></section>`}
function routeLegend(){return `<div class="rleg">${["flat","hilly","medium","mountain","itt"].map(k=>`<span><i style="background:${tyCol(k)}"></i>${t("ty")[k]}</span>`).join("")}</div>`}
function routeMap(R,C){
  const w=360,h=150,cols=11;const pos=i=>{const row=i<cols?0:1;const k=row?i-cols:i;const x=row?w-26-k*(w-52)/(cols-1):26+k*(w-52)/(cols-1);return [x,row?112:40]};
  let path=`M${pos(0).join(" ")}`;for(let i=1;i<21;i++){const [x,y]=pos(i),[px,py]=pos(i-1);if(i===cols){path+=` C${px+44} ${py} ${x+44} ${y} ${x} ${y}`}else path+=` L${x} ${y}`}
  const cur=C.last;let pins="";
  R.stages.forEach((s,i)=>{const [x,y]=pos(i);const st=C.st[i];const done=st!=="fut";const isCur=i===cur;
    pins+=`<g transform="translate(${x} ${y})">${isCur?`<circle r="14" fill="var(--lead)" opacity=".18"/>`:""}<circle r="${isCur?10:8.5}" fill="${done?tyCol(s.ty):"var(--surface)"}" stroke="${done?"var(--surface)":tyCol(s.ty)}" stroke-width="2.4"/>
    <text y="3.5" text-anchor="middle" font-size="${isCur?10:9}" font-weight="800" font-family="Archivo,sans-serif" fill="${done?"#fff":"var(--ink2)"}">${s.n}</text></g>`});
  let rest="";R.stages.forEach((s,i)=>{if(i&&((new Date(s.d)-new Date(R.stages[i-1].d))/864e5)>1){const a=pos(i-1),b=pos(i);const mx=(a[0]+b[0])/2+(i===cols?40:0),my=(a[1]+b[1])/2;
    rest+=`<g transform="translate(${mx} ${my-(i===cols?0:16)})"><rect x="-21" y="-7" width="42" height="13" rx="6.5" fill="var(--surface2)" stroke="var(--line)"/><text y="3" text-anchor="middle" font-size="7" font-weight="800" fill="var(--muted)" font-family="Archivo,sans-serif">${t("rest").toUpperCase()}</text></g>`}});
  const cp=cur>=0?pos(cur):pos(0);
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${t("road")}"><path d="${path}" fill="none" stroke="var(--surface3)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${path}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 5" opacity=".7"/>${rest}${pins}${cyclist(jkind("gen"),cp[0],cp[1]-17,.34,0,.2)}</svg>`;
}
function vPre(R,C){
  const st=new Date(R.start+"T13:00:00+02:00");let ms=Math.max(0,st-Date.now());
  const d=Math.floor(ms/864e5),hh=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4);const s0=R.stages[0];
  const cnt=k=>R.stages.filter(s=>s.ty===k).length;
  const J=["gen","verde","pois"].map(j=>`<div class="jt ${j}"><div class="jb"><div class="l">${t(jkind(j))}</div><b>—</b><div class="v">&nbsp;</div></div>${jersey(jkind(j))}</div>`).join("");
  return `<section class="hero bleed">${scene(s0,{riders:[jkind("gen"),"verde","pois"]})}<div class="ov"><span class="tag">${t("grand")}</span><h1>${stageTitle(s0)}</h1>${chips(s0)}</div></section>
  <section class="card"><div class="eb" style="padding:14px 14px 0">${t("startsIn")}</div><div class="cdw"><div><b class="num">${d}</b><small>${t("days")}</small></div><div><b class="num">${hh}</b><small>${t("hours")}</small></div><div><b class="num">${m}</b><small>${t("min")}</small></div></div>
   <div style="padding:0 14px 14px"><button class="cta press" data-tab="pick" style="width:100%">${t("goPick")}</button></div></section>
  <section><div class="sh2"><h2>${t("leader")}</h2></div><div class="hs bleed">${J}</div><p class="note" style="margin-top:6px">${t("noRes")}</p></section>
  <section><div class="sh2"><h2>${t("road")}</h2><span class="eb">${R.km} ${t("km")}</span></div><div class="card"><div class="mix">${["mountain","hilly","flat","itt"].map(k=>`<div>${miniProf({n:k.length+3,km:150,ty:k,top:k==="mountain"})}<b>${cnt(k)+(k==="hilly"?cnt("medium"):0)}</b><small>${t("ty")[k]}</small></div>`).join("")}</div>${routeMap(R,C)}${routeLegend()}</div></section>`;
}

/* ---------- STANDINGS ---------- */
function vCls(R,C){
  const seg=`<div class="seg" role="tablist">${["gen","verde","pois"].map(j=>`<button role="tab" data-j="${j}" aria-pressed="${CJ===j}">${jersey(jkind(j),{noshadow:1})}${j==="gen"?t("gen"):j==="verde"?t("pts"):t("kom")}</button>`).join("")}</div>`;
  const head=largeTitle(t("cls"),C.last>=0?t("sub_cls").replace("{n}",C.last+1):"");
  if(C.last<0)return head+seg+`<p class="note">${t("noRes")}</p>`;
  const sd=standing(C,CJ),L0=sd[0];const leaders=sd.filter(x=>x.pos===1);const team=n=>DTS.find(d=>d.n===n).t;
  const maxGap=Math.max(1,...sd.map(x=>Math.abs(x.v-L0.v)));
  const val=x=>CJ==="gen"?(x.pos===1?gcT(x.v):gapT(x.v-L0.v)):x.v;
  const sub=x=>CJ==="gen"?(x.pos===1?"":gcT(x.v)):(x.pos===1?t("points"):"−"+(L0.v-x.v));
  const barW=x=>CJ==="gen"?100-Math.round(Math.abs(x.v-L0.v)/maxGap*80):Math.round(x.v/Math.max(1,L0.v)*100);
  const barC=CJ==="gen"?"var(--lead)":CJ==="verde"?"#0d9e57":"#e3241b";
  const me=myDt();
  const rows=sd.map(x=>`<li><button class="row press" data-dt="${esc(x.n)}" ${x.n===me?'style="background:var(--lead-soft)"':""}><span class="pos">${x.pos}</span>${jersey(x.n)}<span class="nm"><b>${esc(x.n)}${x.mv?`<span class="mv ${x.mv>0?"up":"dn"}">${x.mv>0?"▲"+x.mv:"▼"+(-x.mv)}</span>`:""}</b><small>${esc(team(x.n))}</small><span class="bar"><i style="width:${barW(x)}%;--c:${barC}"></i></span></span><span class="r">${val(x)}<small>${sub(x)}</small></span>${chev}</button></li>`).join("");
  return `${head}${seg}
  <div class="lb ${CJ==="gen"?"":CJ} in">${jersey(jkind(CJ))}<div class="t"><div class="l">${t(jkind(CJ))}</div><h3>${leaders.map(x=>esc(x.n)).join(" / ")}</h3><div class="v">${CJ==="gen"?gcT(L0.v):L0.v+" "+t("points")}</div></div></div>
  <ul class="gl">${rows}</ul>
  <section class="card chart"><div class="hd"><h2 style="font-size:22px">${t("trend")}</h2><div class="eb" style="margin-top:4px">${t("trendTip")}</div></div>
  <div class="legend">${DTS.map(d=>`<button data-hl="${esc(d.n)}" aria-pressed="${HL===d.n}">${jersey(d.n,{noshadow:1})}${esc(d.n)}</button>`).join("")}</div>
  <div class="wrap">${bump(R,C)}</div></section>`;
}
function bump(R,C){
  const idx=[];C.rank[CJ].forEach((r,i)=>{if(r)idx.push(i)});
  const w=600,h=300,l=30,rgt=104,tp=16,bt=26;const X=k=>l+k*(w-l-rgt)/Math.max(1,idx.length-1),Y=p=>tp+(p-1)*(h-tp-bt)/9;
  let g="";for(let p=1;p<=10;p++)g+=`<line x1="${l}" x2="${w-rgt}" y1="${Y(p)}" y2="${Y(p)}" stroke="var(--line)" stroke-dasharray="${p===1?"":"2 4"}"/><text x="${l-10}" y="${Y(p)+3.5}" text-anchor="end" font-size="10.5" font-weight="${p===1?800:500}" font-family="IBM Plex Mono,monospace" fill="${p===1?"var(--ink)":"var(--muted)"}">${p}</text>`;
  idx.forEach((i,k)=>{if(k%2===0||k===idx.length-1)g+=`<text x="${X(k)}" y="${h-8}" text-anchor="middle" font-size="10" font-family="IBM Plex Mono,monospace" fill="var(--muted)">T${i+1}</text>`});
  const lines=DTS.map(d=>{const pts=idx.map((i,k)=>[X(k),Y(C.rank[CJ][i][d.n])]);const on=!HL||HL===d.n;const hi=HL===d.n;const c=kitColor(d.n);const e=pts[pts.length-1];
    return {on,svg:`<g opacity="${on?1:.12}">${hi?`<path d="${bumpPath(pts)}" fill="none" stroke="${c}" stroke-width="10" opacity=".18" stroke-linecap="round"/>`:""}<path d="${bumpPath(pts)}" fill="none" stroke="${c}" stroke-width="${hi?3.6:2.4}" stroke-linecap="round"/>
    ${hi?pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="var(--surface)" stroke="${c}" stroke-width="2"/>`).join(""):""}
    <g transform="translate(${e[0]+4} ${e[1]-10})"><svg width="20" height="20" viewBox="0 0 120 120">${jersey(d.n,{noshadow:1}).replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}</svg></g>
    <text x="${e[0]+27}" y="${e[1]+4}" font-size="11.5" font-weight="700" font-family="Archivo,sans-serif" fill="var(--ink)">${esc(d.n)}</text></g>`}});
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${t("trend")}">${g}${lines.filter(x=>!x.on).map(x=>x.svg).join("")}${lines.filter(x=>x.on).map(x=>x.svg).join("")}</svg>`;
}

/* ---------- STAGES ---------- */
function stageChips(R,C,sel,attr,filter){return `<div class="sc bleed" id="strip">${R.stages.map((s,i)=>filter&&!filter(i)?"":`<button class="press" data-${attr}="${i}" aria-pressed="${i===sel}" aria-label="${t("stage")} ${s.n}">${attr==="s"?`<span class="st ${C.st[i]==="fut"?"fut":C.st[i]==="neu"?"neu":""}"></span>`:(dbPick(R,myDt(),i)?'<span class="ck">✓</span>':"")}<b>${s.n}</b>${miniProf(s)}<small>${dfmt(s.d).replace(/\.$/,"").split(" ").slice(1).join(" ")}</small></button>`).join("")}</div>`}
function vStg(R,C){
  if(SEL==null)SEL=C.last>=0?Math.min(20,C.last):0;
  const s=R.stages[SEL],rows=C.day[SEL]||[];let body="";
  if(C.st[SEL]==="fut")body=futBody(R,SEL);
  else{const ok=C.st[SEL]==="ok";const sorted=ok?rows:[...rows].sort((a,b)=>(b.g+b.k)-(a.g+a.k));
    body=(C.st[SEL]==="neu"?`<p class="note">${t("neutral")}</p>`:"")+`<div class="sh2" style="margin-bottom:-6px"><h2>${t("results")}</h2></div><ul class="gl">${sorted.map(x=>`<li><button class="row press" data-dt="${esc(x.n)}" style="grid-template-columns:28px 40px minmax(0,1fr) auto 10px"><span class="pos">${ok?sorted.findIndex(y=>y.tot===x.tot)+1:"·"}</span>${jersey(x.n)}<span class="nm"><b>${esc(x.n)}</b><span class="ln"><span class="rd">${esc(x.rd)}</span>${x.b?`<span class="tg b">−${x.b}"</span>`:""}${x.pe?`<span class="tg">+${x.pe}"</span>`:""}${x.g?`<span class="tg g">${x.g} P</span>`:""}${x.k?`<span class="tg k">${x.k} M</span>`:""}${x.f?`<span class="tg x">${x.f==="SE"?t("noChoice"):t("retired")}</span>`:""}</span></span><span class="r">${ok?(x.gap===0?hms(x.tot):gapT(x.gap)):"—"}${ok&&x.gap>0?`<small>${hms(x.tot)}</small>`:""}</span>${chev}</button></li>`).join("")}</ul>`}
  if(ADMIN&&C.st[SEL]!=="fut"&&RESDB[R.id+"_"+s.n]&&!(R.res[SEL]&&Object.keys(R.res[SEL]).length))body+=`<details class="card"><summary class="lnk" style="padding:14px;display:block">${t("editRes")}</summary>${resForm(R,SEL)}</details>`;
  return `${largeTitle(t("stg"),t("sub_stg").replace("{km}",R.km))}${stageChips(R,C,SEL,"s")}
  <section class="hero bleed" style="margin-top:0">${scene(s,{riders:C.st[SEL]==="fut"?[jkind("gen")]:(C.day[SEL]||[]).slice(0,3).map(x=>x.n)})}<div class="ov"><span class="tag">${t("stageOf").replace("{n}",s.n)}</span><h1>${stageTitle(s)}</h1>${chips(s)}</div></section>
  <section class="card alt"><div class="hd"><h2 style="font-size:21px">${t("altT")}</h2><span class="eb">${String(s.km).replace(".",",")} km</span></div>${altimetry(s)}${gradLegend()}</section>
  ${body}`;
}
function futBody(R,i){
  const open=isOpen(R,i),me=myDt();
  if(open){const n=DTS.filter(d=>dbPick(R,d.n,i)).length;const mine=me&&dbPick(R,me,i);
    return `<section class="card stat2"><div class="t"><div class="eb">${t("closesIn")} · ${countdown(lockAt(R.stages[i]))}</div><b>${n}/10 ${t("chose")}</b>${me?`<div class="muted" style="font-size:13px;margin-top:3px">${t("yourPick")}: <strong style="color:var(--ink)">${mine?esc(mine):"—"}</strong></div>`:""}<div class="pbar"><i style="width:${n*10}%"></i></div></div><button class="cta press" data-gopick="${i}">${t("pick")}</button></section><p class="note">${t("lockNote")}</p>`}
  const any=DTS.some(d=>dbPick(R,d.n,i));
  if(!any)return `<p class="note">${t("future")}</p>`;
  const form=ADMIN?`<section class="card">${resForm(R,i)}</section>`:"";
  return `<div class="sh2" style="margin-bottom:-6px"><h2>${t("revealed")}</h2></div><ul class="gl">${DTS.map(d=>{const p=dbPick(R,d.n,i);return `<li><button class="row press" data-dt="${esc(d.n)}" style="grid-template-columns:40px minmax(0,1fr) auto 10px">${jersey(d.n)}<span class="nm"><b>${esc(d.n)}</b><small>${p?esc(p):t("none")}</small></span><span></span>${chev}</button></li>`}).join("")}</ul>${form}`;
}

/* ---------- PICK ---------- */
function vPick(R,C){
  const head=largeTitle(t("pick"),t("sub_pick"));
  if(DBS==="loading")return head+`<p class="note">${t("loading")}</p>`;
  if(DBS==="off")return head+`<p class="note">${t("signin")}</p>`;
  const me=myDt();
  if(!me)return largeTitle(t("who"),t("whoSub"))+(MSG?`<div class="msg ${MSG[0]}">${MSG[1]}</div>`:"")+`<div class="teams">${DTS.map(d=>{const o=ownerOf(d.n);const tk=o&&o!==ME;
    return `<button class="tc press" data-claim="${esc(d.n)}" ${tk||!CANW?"disabled":""} style="--k1:${KIT[d.n][0]};--k2:${shade(KIT[d.n][0])}"><div class="top">${jersey(d.n)}</div><div class="bd"><b>${esc(d.n)}</b><small>${esc(d.t)}</small>${tk?`<span class="wx">${t("taken")}</span>`:""}</div></button>`}).join("")}</div>`;
  const open=R.stages.map((s,i)=>i).filter(i=>isOpen(R,i));
  const meCard=`<div class="card me">${jersey(me)}<div class="t"><div class="eb">${t("ds")}</div><b>${esc(me)}</b><small class="muted">${esc(DTS.find(d=>d.n===me).t)}</small></div><button class="lnk" data-unclaim="1">${t("change")}</button></div>`;
  if(!CANW)return head+meCard+`<p class="note">${t("readonly")}</p>`;
  if(!open.length)return head+meCard+`<p class="note">${t("noOpen")}</p>`;
  if(PSEL==null||!open.includes(PSEL))PSEL=open[0];
  const s=R.stages[PSEL],cur=dbPick(R,me,PSEL),used=usedList(R,me,-1),dd=dups(R,me);
  return `${head}${meCard}${stageChips(R,C,PSEL,"ps",i=>open.includes(i))}
  <section class="card"><div class="hero" style="margin:0">${scene(s,{h:180,riders:[me]})}<div class="ov"><span class="tag">${t("stage")} ${s.n}</span> <span class="chip" style="margin-left:4px">${t("closesIn")} · ${countdown(lockAt(s))}</span><h1 style="font-size:28px">${stageTitle(s)}</h1></div></div>
   <form class="pf" id="pf" autocomplete="off">
    ${cur?`<div class="cur">${jersey(me,{noshadow:1})}<div><div class="eb">${t("nowPick")}</div><b>${esc(cur)}</b></div></div>`:""}
    <label for="rin">${t("yourPick")}</label>
    <div class="fld"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="rin" name="rin" list="riders" placeholder="${t("ph")}" value="${cur?esc(cur):""}" enterkeyhint="done"></div>
    ${MSG&&MSG[2]!=="res"?`<div class="msg ${MSG[0]}">${MSG[1]}</div>`:""}
    <button class="cta press" type="submit" ${BUSY?"disabled":""}>${t("save")}</button>
    ${cur?`<button type="button" class="lnk" style="justify-self:center" data-clear="1">${t("clear")}</button>`:""}
   </form></section>
  ${dd.map(x=>`<div class="msg err">${t("dupT")}: ${esc(x.rd)} (${x.st.map(k=>"T"+k).join(", ")})</div>`).join("")}
  <p class="note">${t("lockNote")}</p>
  <section><div class="sh2"><h2 style="font-size:20px">${t("used")}</h2><span class="eb">${used.length}/21</span></div>${used.length?`<div class="used">${used.map(u=>`<span><small>T${u.n}</small>${esc(u.rd)}</span>`).join("")}</div>`:`<p class="note">${t("noPicksYet")}</p>`}</section>`;
}

/* ---------- TEAMS ---------- */
function shade(hex,f=-.38){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=v=>Math.max(0,Math.min(255,Math.round(f<0?v*(1+f):v+(255-v)*f)));return "#"+[m(r),m(g),m(b)].map(v=>v.toString(16).padStart(2,"0")).join("")}
function vTeams(R,C){
  const sd=standing(C,"gen");const ord=C.last>=0?sd.map(x=>x.n):DTS.map(d=>d.n);
  return `${largeTitle(t("teams"),t("sub_teams"))}<div class="teams">${ord.map(n=>{const d=DTS.find(x=>x.n===n);const tt=C.totals[n];const p=sd.find(x=>x.n===n);const k=KIT[n];
   return `<button class="tc press" data-dt="${esc(n)}" style="--k1:${k[0]==="#f5f5f4"?"#dfe3ea":k[0]};--k2:${shade(k[0]==="#f5f5f4"?"#9aa6b8":k[0])}"><div class="top">${C.last>=0?`<span class="rk ${p.pos===1?"l":""}">${p.pos}</span>`:""}${jersey(n)}</div>
   <div class="bd"><b>${esc(d.t)}</b><small>${esc(n)}${n===myDt()?" · "+(L==="it"?"tu":"tú"):""}</small><div class="ic"><span style="background:var(--lead-soft)">${C.last>=0?(p.pos===1?gcT(tt.t).split(" ")[0]:gapT(tt.t-sd[0].v)):"—"}</span><span style="color:#0d9e57">${tt.g}P</span><span style="color:#e3241b">${tt.p}M</span></div>${dups(R,n).length?`<span class="wx">${t("dupT")}</span>`:""}</div></button>`}).join("")}</div>`;
}

/* ---------- RULES ---------- */
function vRules(){
  return `${largeTitle(t("rulesT"))}<section class="card rules">
  <div class="rule"><svg viewBox="-50 -60 100 72" aria-hidden="true"><circle cx="0" cy="-20" r="40" fill="var(--lead-soft)"/>${cyclist(jkind("gen"),0,0,.95)}</svg><div><h3>${t("r1h")}</h3><p>${t("r1")}</p></div></div>
  <div class="rule">${jersey(jkind("gen"))}<div><h3>${t("r2h")}</h3><p>${t("r2")}</p></div></div>
  <div class="formula">${L==="it"?"tempo = arrivo − abbuoni + penalità":"tiempo = llegada − bonificaciones + penalizaciones"}<br>${L==="it"?"generale = Σ tempo (tappe 1–21)":"general = Σ tiempo (etapas 1–21)"}</div>
  <div class="rule">${jersey("verde")}<div><h3>${t("r3h")}</h3><p>${t("r3")}</p></div></div>
  <div class="rule">${jersey("pois")}<div><h3>${t("r4h")}</h3><p>${t("r4")}</p></div></div>
  <div class="rule">${jersey("neutral")}<div><h3>${t("r5h")}</h3><p>${t("r5")}</p></div></div></section>
  <p class="muted" style="font-size:12px;margin:0 4px">${t("src")}</p>`;
}

/* ---------- SHEETS ---------- */
function openSheet(html,kv){const sh=$("#sh");sh.innerHTML=`<div class="grab" id="grab"></div><button class="shx press" id="x" aria-label="Chiudi"><svg viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12"/></svg></button>`+html;
  sh.style.removeProperty("--dy");if(kv)Object.entries(kv).forEach(([k,v])=>sh.style.setProperty(k,v));sh.scrollTop=0;
  $("#scrim").classList.add("on");sh.classList.add("on");$("#x").onclick=closeSheet;setTimeout(()=>$("#x").focus({preventScroll:true}),50);vib()}
function closeSheet(){$("#scrim").classList.remove("on");$("#sh").classList.remove("on")}
function openDT(n){
  const R=RACES[RID],C=compute(R);const d=DTS.find(x=>x.n===n);const tt=C.totals[n];const k=KIT[n];
  const sd=standing(C,"gen"),p=sd.find(x=>x.n===n),pv=standing(C,"verde").find(x=>x.n===n),pp=standing(C,"pois").find(x=>x.n===n);
  let best=-1,bp=99;C.day.forEach((rows,i)=>{if(C.st[i]!=="ok")return;const kk=rows.findIndex(x=>x.n===n);if(kk<0)return;const pos=rows.findIndex(y=>y.tot===rows[kk].tot)+1;if(pos<bp){bp=pos;best=i}});
  const has=C.last>=0;
  const spark=has?(()=>{const idx=[];C.rank.gen.forEach((r,i)=>{if(r)idx.push(i)});const w=320,h=70;const X=j=>8+j*(w-16)/Math.max(1,idx.length-1),Y=q=>8+(q-1)*(h-16)/9;const pts=idx.map((i,j)=>[X(j),Y(C.rank.gen[i][n])]);const c=kitColor(n);const e=pts[pts.length-1];
    return `<section class="card" style="padding:12px 12px 8px"><div class="eb" style="margin:0 4px 6px">${t("posG")}</div><svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${[1,5,10].map(q=>`<line x1="8" x2="${w-8}" y1="${Y(q)}" y2="${Y(q)}" stroke="var(--line)" stroke-dasharray="2 4"/>`).join("")}<path d="${bumpPath(pts)} L${e[0]} ${h} L8 ${h}Z" fill="${c}" opacity=".12"/><path d="${bumpPath(pts)}" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${e[0]}" cy="${e[1]}" r="4.5" fill="var(--surface)" stroke="${c}" stroke-width="2.4"/></svg></section>`})():"";
  const tl=R.stages.map((s,i)=>{let r=(C.day[i]||[]).find(x=>x.n===n);const pos=r&&C.st[i]==="ok"?C.day[i].findIndex(y=>y.tot===r.tot)+1:null;
    if(!r){const pk=dbPick(R,n,i);if(pk)r={rd:isOpen(R,i)&&n!==myDt()?t("hidden"):pk,g:0,k:0}}
    return `<li class="${i===best?"best":""}"><span class="sn">T${s.n}</span><span class="dot" style="background:${tyCol(s.ty)}"></span><b>${r?esc(r.rd):"—"}</b><span class="p">${[pos?pos+"°":"",r&&r.g?r.g+"P":"",r&&r.k?r.k+"M":""].filter(Boolean).join(" · ")}</span></li>`}).join("");
  openSheet(`<div class="shh">${jersey(n)}<div class="t"><div class="eb">${t("ds")} · ${esc(n)}</div><h2>${esc(d.t)}</h2><div class="mono" style="font-size:13px;margin-top:4px;opacity:.9">${has?gcT(tt.t):""}</div></div></div>
  <div class="shb"><div class="rings">${ring(has?p.pos:0,10,"gen",has?(p.pos===1?t("leader"):gapT(tt.t-sd[0].v)):t(jkind("gen")))}${ring(has?pv.pos:0,10,"verde",tt.g+" "+t("points"))}${ring(has?pp.pos:0,10,"pois",tt.p+" "+t("points"))}</div>
  ${has?`<p class="note">${C.wins[n]} ${t("stageWin")}${best>=0?` · ${t("best")}: ${t("stage")} ${best+1} (${bp}°)`:""}</p>`:""}
  ${dups(R,n).map(x=>`<div class="msg err">${t("dupT")}: ${esc(x.rd)} (${x.st.map(q=>"T"+q).join(", ")})</div>`).join("")}
  ${spark}<div class="eb" style="margin:0 4px">${t("picks")}</div><ul class="tl">${tl}</ul></div>`,{"--k1":k[0]==="#f5f5f4"?"#c9d0da":k[0],"--k2":shade(k[0]==="#f5f5f4"?"#7f8a9b":k[0])});
}
function raceSheet(){openSheet(`<div style="padding:4px 16px 0"><h2 style="font-size:26px;margin:4px 0 12px">${t("races")}</h2><div class="card">${Object.values(RACES).map(r=>`<button class="opt press" data-race="${r.id}">${jersey(r.lead)}<span><b>${esc(r.name)}</b><small>${r.sub} · ${r.km} km</small></span>${RID===r.id?'<span class="ck">✓</span>':""}</button>`).join("")}</div></div>`)}
function langSheet(){openSheet(`<div style="padding:4px 16px 0"><h2 style="font-size:26px;margin:4px 0 12px">${t("langT")}</h2><div class="lang">${[["it","Italiano"],["es","Español"]].map(([k,v])=>`<button data-l="${k}" aria-pressed="${L===k}">${v}</button>`).join("")}</div></div>`)}
/* drag to close */
(()=>{let y0=null,dy=0;const sh=()=>$("#sh");
  document.addEventListener("pointerdown",e=>{if(!e.target.closest("#grab,.shh"))return;y0=e.clientY;dy=0;sh().classList.add("drag")});
  document.addEventListener("pointermove",e=>{if(y0==null)return;dy=Math.max(0,e.clientY-y0);sh().style.setProperty("--dy",dy+"px")});
  const end=()=>{if(y0==null)return;sh().classList.remove("drag");if(dy>90)closeSheet();sh().style.removeProperty("--dy");y0=null};
  document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end)})();
