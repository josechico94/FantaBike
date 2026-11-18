/* ---------- compute ---------- */
function compute(R){
  const res=effRes(R), names=DTS.map(d=>d.n);
  const st=R.stages.map((s,i)=>{const r=res[i];if(!r||!Object.keys(r).length)return"fut";return Object.values(r).some(v=>v[1]>0)?"ok":"neu"});
  const last=st.lastIndexOf("ok")>=st.lastIndexOf("neu")?st.lastIndexOf("ok"):st.lastIndexOf("neu");
  const cum={gen:[],verde:[],pois:[]}, rank={gen:[],verde:[],pois:[]};
  const run={};names.forEach(n=>run[n]={t:0,g:0,p:0});
  const day=[];
  R.stages.forEach((s,i)=>{
    const r=res[i]||{};const rows=[];
    names.forEach(n=>{const v=r[n];if(!v)return;const tot=v[1]-v[2]+v[3];run[n].t+=tot;run[n].g+=v[4];run[n].p+=v[5];rows.push({n,rd:v[0],t:v[1],b:v[2],pe:v[3],tot,g:v[4],k:v[5],f:v[6]||""})});
    if(st[i]==="ok"){rows.sort((a,b)=>a.tot-b.tot);rows.forEach((x,j)=>x.gap=x.tot-rows[0].tot)}
    day.push(rows);
    const snap=n=>({...run[n]});
    cum.gen.push(Object.fromEntries(names.map(n=>[n,snap(n)])));
    if(st[i]!=="fut"){
      rank.gen[i]=ranker(names,n=>run[n].t,1);rank.verde[i]=ranker(names,n=>run[n].g,-1);rank.pois[i]=ranker(names,n=>run[n].p,-1);
    }
  });
  const totals=last>=0?cum.gen[last]:Object.fromEntries(names.map(n=>[n,{t:0,g:0,p:0}]));
  // stage wins per DT
  const wins={};names.forEach(n=>wins[n]=0);
  day.forEach((rows,i)=>{if(st[i]!=="ok")return;rows.filter(x=>x.gap===0).forEach(x=>wins[x.n]++)});
  return {st,last,day,cum,rank,totals,wins};
}
function ranker(names,f,dir){const s=[...names].sort((a,b)=>dir*(f(a)-f(b))||a.localeCompare(b));const o={};let p=0,prev=null;s.forEach((n,i)=>{const v=f(n);if(v!==prev){p=i+1;prev=v}o[n]=p});return o}
function standing(C,j,idx){
  const i=idx??C.last; if(i<0)return DTS.map(d=>({n:d.n,v:0,pos:"–"}));
  const tot=C.cum.gen[i], key={gen:"t",verde:"g",pois:"p"}[j], dir=j==="gen"?1:-1;
  const rk=C.rank[j][i];
  const prevI=(()=>{for(let k=i-1;k>=0;k--)if(C.rank[j][k])return k;return -1})();
  return DTS.map(d=>({n:d.n,v:tot[d.n][key],pos:rk[d.n],mv:prevI>=0?C.rank[j][prevI][d.n]-rk[d.n]:0})).sort((a,b)=>a.pos-b.pos||a.n.localeCompare(b.n));
}

