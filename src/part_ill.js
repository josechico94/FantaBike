/* ---------- illustrations ---------- */
let UID=0;
const JB="M38 14C44 12 48 10 50 9C54 14 66 14 70 9C72 10 76 12 82 14L104 30C106 31 107 33 106 35L97 55C96 57 94 58 92 57L86 54L86 104C86 108 83 110 79 110L41 110C37 110 34 108 34 104L34 54L28 57C26 58 24 57 23 55L14 35C13 33 14 31 16 30Z";
const SLV="M16 30L38 14L41 34L34 54L28 57C26 58 24 57 23 55L14 35C13 33 14 31 16 30ZM104 30L82 14L79 34L86 54L92 57C94 58 96 57 97 55L106 35C107 33 106 31 104 30Z";
const CUFF="M13.6 34.5L23 56.5L28.3 54.2L19.2 31.6ZM106.4 34.5L97 56.5L91.7 54.2L100.8 31.6Z";
function kitOf(kind){
  if(kind==="rossa")return{b:"#d90a1e",a:"#9c0414",c:"#ffffff",p:"plain"};
  if(kind==="gialla")return{b:"#ffd000",a:"#e2b200",c:"#141414",p:"plain"};
  if(kind==="verde")return{b:"#0d9e57",a:"#077a42",c:"#ffffff",p:"plain"};
  if(kind==="pois")return{b:"#fbfbfd",a:"#e3241b",c:"#e3241b",p:"dots"};
  if(kind==="neutral")return{b:"#c3cad5",a:"#a7b0bd",c:"#8b95a4",p:"plain"};
  const k=KIT[kind]||["#64748b","#ffffff","band"];return{b:k[0],a:k[1],c:k[1],p:k[2]};
}
function jersey(kind,opts={}){
  const id="j"+(UID++),k=kitOf(kind);let p="";
  switch(k.p){
    case"dots":for(let y=6,r=0;y<116;y+=12.5,r++)for(let x=(r%2?6:12.5);x<118;x+=13)p+=`<circle cx="${x}" cy="${y}" r="4.3" fill="${k.a}"/>`;break;
    case"plain":p=`<rect x="0" y="0" width="34" height="120" fill="${k.a}" opacity=".35"/><rect x="86" y="0" width="34" height="120" fill="${k.a}" opacity=".35"/>`;break;
    case"sleeves":p=`<path d="${SLV}" fill="${k.a}"/>`;break;
    case"sash":p=`<path d="M20 24L44 10L106 106L80 116Z" fill="${k.a}"/>`;break;
    case"band":p=`<rect x="0" y="54" width="120" height="17" fill="${k.a}"/><rect x="0" y="75" width="120" height="4" fill="${k.a}"/>`;break;
    case"split":p=`<rect x="60" y="0" width="60" height="120" fill="${k.a}"/>`;break;
    case"hoops":p=[40,58,76,94].map(y=>`<rect x="0" y="${y}" width="120" height="9" fill="${k.a}"/>`).join("");break;
    case"chev":p=`<path d="M0 52L60 82L120 52L120 68L60 98L0 68Z" fill="${k.a}"/>`;break;
    case"stripes":p=[40,51,62,73].map(x=>`<rect x="${x}" y="0" width="6" height="120" fill="${k.a}"/>`).join("");break;
  }
  return `<svg class="${opts.cls||"j"}" viewBox="0 0 120 120" aria-hidden="true"><defs><clipPath id="${id}c"><path d="${JB}"/></clipPath>
  <radialGradient id="${id}h" cx=".32" cy=".22" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
  <pattern id="${id}m" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".55" fill="#000" opacity=".07"/></pattern></defs>
  ${opts.noshadow?"":`<ellipse cx="60" cy="114" rx="30" ry="3.6" fill="#000" opacity=".16"/>`}
  <g clip-path="url(#${id}c)"><rect width="120" height="120" fill="${k.b}"/>${p}
   <path d="${CUFF}" fill="${k.c}"/><path d="M13.6 34.5L23 56.5" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/><path d="M106.4 34.5L97 56.5" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>
   <rect x="30" y="100" width="60" height="12" fill="#000" opacity=".14"/>
   <rect x="34" y="40" width="5" height="70" fill="#000" opacity=".08"/><rect x="81" y="40" width="5" height="70" fill="#000" opacity=".08"/>
   <rect width="120" height="120" fill="url(#${id}m)"/><rect width="120" height="120" fill="url(#${id}h)"/>
   <path d="M60 13V108" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/><path d="M60 13V108" stroke="#fff" stroke-opacity=".25" stroke-width=".5" transform="translate(1 0)"/>
  </g>
  <path d="M50 9C54 17 66 17 70 9C66 13 54 13 50 9Z" fill="${k.c}" stroke="#000" stroke-opacity=".25"/>
  <rect x="58.6" y="15" width="2.8" height="7" rx="1.2" fill="#d6dbe3" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>
  <path d="${JB}" fill="none" stroke="#0a0f18" stroke-opacity=".32" stroke-width="1.3"/></svg>`;
}
function jkind(j){return j==="gen"?RACES[RID].lead:j}
const kitColor=n=>{const k=KIT[n];return k?(k[0]==="#f5f5f4"?k[1]:k[0]):"#888"};

/* ---------- terrain model ---------- */
function rng(seed){let s=(seed*9301+49297)%233280;return()=>{s=(s*9301+49297)%233280;return s/233280}}
const MAXE={flat:220,hilly:950,medium:1450,mountain:2250,itt:160};
function profilePts(s,N=80){
  const r=rng(s.n*7+(RID==="tour"?1000:0)+Math.round(s.km));const pts=[];
  const climbs={flat:0,hilly:5,medium:3,mountain:3,itt:1}[s.ty];
  const centers=[];for(let c=0;c<climbs;c++)centers.push({x:.1+r()*.78,h:(.42+r()*.58),w:.02+r()*(s.ty==="mountain"?.035:.025)});
  if(s.top)centers.push({x:1,h:s.ty==="mountain"?1.05:.8,w:s.ty==="mountain"?.05:.03,fin:1});
  const base=.06+r()*.08;
  for(let i=0;i<=N;i++){const x=i/N;let y=base+(s.ty==="flat"||s.ty==="itt"?Math.sin(x*11+s.n)*.035+Math.sin(x*29)*.015:Math.sin(x*7+s.n)*.03);
    centers.forEach(c=>{y+=c.h*Math.exp(-((x-c.x)**2)/(2*c.w*c.w))});pts.push([x,Math.max(.02,y)])}
  const mx=Math.max(...pts.map(p=>p[1]));const sc=mx>1?1/mx:1;pts.forEach(p=>p[1]*=sc);centers.forEach(c=>c.h*=sc);
  const elev=pts.map(p=>Math.round(40+p[1]*MAXE[s.ty]));
  return {pts,centers,elev,N};
}
const slopeCol=g=>g<3?"var(--g1)":g<6?"var(--g2)":g<9?"var(--g3)":g<12?"var(--g4)":"var(--g5)";
const tyCol=ty=>({flat:"var(--green)",hilly:"var(--amber)",medium:"#f2862e",mountain:"var(--kom)",itt:"var(--blue)"}[ty]);
function bumpPath(pts){let d=`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],m=(a[0]+b[0])/2;d+=` C${m.toFixed(1)} ${a[1].toFixed(1)} ${m.toFixed(1)} ${b[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`}return d}
function smooth(pts){if(pts.length<3)return "M"+pts.map(p=>p.join(" ")).join(" L");let d=`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`}return d}
function miniProf(s){const {pts}=profilePts(s,40);const w=52,h=18;const d="M"+pts.map(p=>(p[0]*w).toFixed(1)+" "+(h-1-p[1]*(h-3)).toFixed(1)).join(" L");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><path d="${d} L${w} ${h} L0 ${h}Z" fill="${tyCol(s.ty)}" opacity=".9"/></svg>`}

/* ---------- cyclist ---------- */
function ik(H,P,a,b){const dx=P[0]-H[0],dy=P[1]-H[1];let d=Math.hypot(dx,dy);d=Math.min(d,a+b-.01);const th=Math.atan2(dy,dx);const al=Math.acos((a*a+d*d-b*b)/(2*a*d));
  const k1=[H[0]+a*Math.cos(th-al),H[1]+a*Math.sin(th-al)],k2=[H[0]+a*Math.cos(th+al),H[1]+a*Math.sin(th+al)];return k1[0]>k2[0]?k1:k2}
function wheel(cx,cy,r){let sp="";for(let i=0;i<8;i++){const a=i*Math.PI/8;sp+=`M${(cx-Math.cos(a)*r*.86).toFixed(1)} ${(cy-Math.sin(a)*r*.86).toFixed(1)}L${(cx+Math.cos(a)*r*.86).toFixed(1)} ${(cy+Math.sin(a)*r*.86).toFixed(1)}`}
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#11151c" stroke-width="3.6"/><circle cx="${cx}" cy="${cy}" r="${r-3.2}" fill="none" stroke="#9aa3b0" stroke-width="1.1"/>
  <g class="wh"><path d="${sp}" stroke="#c4cad3" stroke-width=".6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="transparent"/></g><circle cx="${cx}" cy="${cy}" r="2" fill="#11151c"/>`}
function rider(kind,ph=0){
  const k=kitOf(kind);const BB=[-6,2],H=[-12,-31];const a=ph*Math.PI*2;
  const P1=[BB[0]+7*Math.cos(a),BB[1]+7*Math.sin(a)],P2=[BB[0]-7*Math.cos(a),BB[1]-7*Math.sin(a)];
  const K1=ik(H,P1,19,20),K2=ik(H,P2,19,20);
  const leg=(K,P,c,w)=>`<path d="M${H[0]} ${H[1]}L${K[0].toFixed(1)} ${K[1].toFixed(1)}" stroke="#12161d" stroke-width="${w+2}" stroke-linecap="round"/><path d="M${K[0].toFixed(1)} ${K[1].toFixed(1)}L${P[0].toFixed(1)} ${P[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${(P[0]-3).toFixed(1)} ${(P[1]+.5).toFixed(1)}h7" stroke="#f4f4f4" stroke-width="3" stroke-linecap="round"/>`;
  return `<g class="rdr">${wheel(-30,0,17)}${wheel(30,0,17)}
  ${leg(K2,P2,"#a87556",5)}
  <path d="M-30 0L-6 2L-12 -24ZM-6 2L23 -14L20 -22L-12 -24" fill="none" stroke="${k.b==="#fbfbfd"?"#e3241b":k.b}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M23 -14L30 0" stroke="#2a2f38" stroke-width="2.6"/><path d="M20 -22L27 -23Q32 -23 31 -17Q30 -13 26 -14" fill="none" stroke="#11151c" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M-18 -26.5h11" stroke="#11151c" stroke-width="3.4" stroke-linecap="round"/><circle cx="-6" cy="2" r="4" fill="none" stroke="#5b636f" stroke-width="1.6"/>
  <path d="M-13 -29Q0 -46 15 -41" fill="none" stroke="${k.b}" stroke-width="13" stroke-linecap="round"/>
  <path d="M-13 -29Q0 -46 15 -41" fill="none" stroke="${k.a}" stroke-width="13" stroke-linecap="round" stroke-dasharray="0 14 6 40" opacity=".9"/>
  <path d="M-16 -27Q-9 -33 -4 -33" fill="none" stroke="#12161d" stroke-width="10" stroke-linecap="round"/>
  <path d="M15 -41L20 -31L27 -23" fill="none" stroke="${k.b}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.5 -32L27 -23" stroke="#a87556" stroke-width="3.6" stroke-linecap="round"/>
  ${leg(K1,P1,"#c58b67",5.6)}
  <circle cx="22" cy="-46" r="5.2" fill="#c58b67"/>
  <path d="M14 -48Q17 -56 25 -54Q31 -52 30 -47L22 -46Z" fill="${k.b==="#fbfbfd"?"#ffffff":k.b}" stroke="#11151c" stroke-width="1.2"/>
  <path d="M23 -47.5L29.5 -46.5" stroke="#11151c" stroke-width="2.2" stroke-linecap="round"/></g>`;
}
function cyclist(kind,x,y,sc=1,rot=0,ph=0){return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc})">${rider(kind,ph)}</g>`}

/* ---------- stage scene (hero) ---------- */
function scene(s,{w=390,h=230,riders=[],thumb=false}={}){
  const id="s"+(UID++),r=rng(s.n*13+s.km|0);const {pts,centers}=profilePts(s,60);
  const landTop=h*(thumb?.42:.36),landBot=h-(thumb?6:14);
  const X=x=>x*w,Y=y=>landBot-y*(landBot-landTop);
  let far="",mid="",deco="";
  if(s.ty==="mountain"||s.ty==="medium"){
    const pk=[];let x=-20;while(x<w+40){pk.push([x,h*(.18+r()*.2)]);x+=40+r()*50;pk.push([x,h*(.42+r()*.08)]);x+=20+r()*30}
    far=`<path d="M-20 ${h*.6}L${pk.map(p=>p.map(v=>v.toFixed(1)).join(" ")).join("L")}L${w+40} ${h*.6}Z" fill="var(--sc-far)"/>`;
    if(s.ty==="mountain")pk.forEach((p,i)=>{if(i%2===0&&p[1]<h*.32){const q=pk[i+1]||p,o=pk[i-1]||p;far+=`<path d="M${p[0]} ${p[1]}L${(p[0]+(q[0]-p[0])*.32).toFixed(1)} ${(p[1]+(q[1]-p[1])*.32).toFixed(1)}l-5 4l-5 -3L${(p[0]+(o[0]-p[0])*.3).toFixed(1)} ${(p[1]+(o[1]-p[1])*.3).toFixed(1)}Z" fill="var(--sc-snow)" opacity=".9"/>`}});
  }else if(s.ty==="flat"){
    far=`<rect x="0" y="${h*.46}" width="${w}" height="${h*.2}" fill="var(--sc-sea)"/><path d="M0 ${h*.46}H${w}" stroke="#fff" stroke-opacity=".5"/>`
      +[.2,.34,.55,.7].map(f=>`<path d="M${w*f} ${h*.5+r()*8}h${10+r()*14}" stroke="#fff" stroke-opacity=".45" stroke-width="1.2" stroke-linecap="round"/>`).join("");
    deco=[.07,.15,.24].map((f,i)=>{const tx=w*f,ty=h*(.44-.02*i);return `<g transform="translate(${tx} ${ty})" opacity=".8"><path d="M0 0V-34" stroke="#f3f5f8" stroke-width="2"/><g class="wh" style="animation-duration:${3+i}s"><path d="M0 -34l0 -14M0 -34l12 7M0 -34l-12 7" stroke="#f3f5f8" stroke-width="2" stroke-linecap="round"/></g></g>`}).join("");
  }else if(s.ty==="itt"){
    let bx=0;far="";while(bx<w){const bw=14+r()*26,bh=h*(.1+r()*.22);far+=`<rect x="${bx.toFixed(1)}" y="${(h*.5-bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${(bh+h*.1).toFixed(1)}" fill="var(--sc-far)"/>`;
      for(let wy=h*.5-bh+5;wy<h*.5;wy+=7)for(let wx=bx+3;wx<bx+bw-4;wx+=6)if(r()>.55)far+=`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="2.4" height="3" fill="var(--sc-sun)" opacity=".55"/>`;bx+=bw+2}
  }else{
    far=`<path d="M0 ${h*.5}${[...Array(7)].map((_,i)=>` Q${(i+.5)*w/6} ${h*(.3+r()*.12)} ${(i+1)*w/6} ${h*.48}`).join("")} V${h} H0Z" fill="var(--sc-far)"/>`;
  }
  mid=`<path d="M0 ${h*.58} C${w*.2} ${h*.46} ${w*.35} ${h*.6} ${w*.55} ${h*.52} S${w*.85} ${h*.5} ${w} ${h*.56} V${h} H0Z" fill="var(--sc-mid)" opacity=".85"/>`;
  if(s.ty==="hilly"||s.ty==="medium"){for(let i=0;i<14;i++){const tx=r()*w,ty=h*(.55+r()*.08),ts=4+r()*5;deco+=`<path d="M${tx.toFixed(1)} ${(ty-ts*2.4).toFixed(1)}l${ts} ${ts*2.4}h${-ts*2}Z" fill="var(--sc-land2)" opacity=".9"/>`}
    for(let i=0;i<3;i++){const fy=h*(.6+i*.025);deco+=`<path d="M${w*(.05+i*.3)} ${fy}h${w*.18}" stroke="var(--sc-land1)" stroke-width="2" opacity=".6"/>`}}
  const sun=`<circle cx="${w*.8}" cy="${h*.2}" r="${thumb?14:24}" fill="var(--sc-sun)"/><circle cx="${w*.8}" cy="${h*.2}" r="${thumb?22:40}" fill="var(--sc-sun)" opacity=".25"/>`;
  const cloud=(cx,cy,sz)=>`<g class="cl" opacity=".85"><ellipse cx="${cx}" cy="${cy}" rx="${sz*1.6}" ry="${sz*.55}" fill="var(--sc-cloud)"/><ellipse cx="${cx-sz*.5}" cy="${cy-sz*.35}" rx="${sz*.7}" ry="${sz*.55}" fill="var(--sc-cloud)"/><ellipse cx="${cx+sz*.4}" cy="${cy-sz*.45}" rx="${sz*.8}" ry="${sz*.7}" fill="var(--sc-cloud)"/></g>`;
  const P=pts.map(p=>[X(p[0]),Y(p[1])]);const top=smooth(P);
  const land=`<path d="${top} L${w} ${h} L0 ${h}Z" fill="url(#${id}l)"/>`;
  const road=thumb?"":`<path d="${top}" fill="none" stroke="var(--sc-road)" stroke-width="5" stroke-linecap="round"/><path d="${top}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1" stroke-dasharray="5 6"/>`;
  const fe=P[P.length-1];
  const finish=`<g transform="translate(${(fe[0]-10).toFixed(1)} ${fe[1].toFixed(1)})"><path d="M-14 0V-${thumb?22:34}M14 0V-${thumb?22:34}" stroke="#2a2f38" stroke-width="2.4"/><rect x="-16" y="-${thumb?28:42}" width="32" height="${thumb?8:11}" rx="2" fill="#fff" stroke="#2a2f38"/>${[...Array(8)].map((_,i)=>`<rect x="${-16+i*4}" y="-${thumb?28:42}" width="4" height="${thumb?4:5.5}" fill="${i%2?"#11151c":"#fff"}"/><rect x="${-16+i*4}" y="-${thumb?24:36.5}" width="4" height="${thumb?4:5.5}" fill="${i%2?"#fff":"#11151c"}"/>`).join("")}</g>`;
  const kom=thumb?"":peaks(pts.map(p=>p[1]*1000),180).filter(o=>o.i<58).map(({i})=>{const p=P[i];return `<g transform="translate(${p[0].toFixed(1)} ${(p[1]-14).toFixed(1)})"><path d="M0 8V-6" stroke="#2a2f38" stroke-width="1.4"/><path d="M0 -6h11l-3 4 3 4H0Z" fill="#e3241b"/><circle cx="4.5" cy="-2" r="1.5" fill="#fff"/></g>`}).join("");
  let rd="";
  riders.slice(0,3).forEach((kd,i)=>{const fx=thumb?.6:.5+i*.075;const ix=Math.min(59,Math.round(fx*60));const p=P[ix],q=P[ix+1];const ang=Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI;
    const sc=thumb?.2:.4;rd+=cyclist(kd,p[0],p[1]-17*sc-2.5,sc,ang,(i*.33)%1)});
  return `<svg class="scene" viewBox="0 0 ${w} ${h}" ${thumb?'preserveAspectRatio="xMidYMid slice"':""} role="img" aria-label="${esc(t("ty")[s.ty])}"><defs>
  <linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sc-sky1)"/><stop offset="1" stop-color="var(--sc-sky2)"/></linearGradient>
  <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sc-land1)"/><stop offset="1" stop-color="var(--sc-land2)"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${id}k)"/>${sun}${thumb?"":cloud(w*.22,h*.16,16)+cloud(w*.58,h*.1,11)}${far}${mid}${deco}${land}${road}${kom}${finish}${rd}</svg>`;
}

/* ---------- altimetry chart ---------- */
function peaks(el,minGain){const N=el.length-1,out=[];for(let i=1;i<=N;i++){const w=4;let isMax=true;for(let k=Math.max(0,i-w);k<=Math.min(N,i+w);k++)if(el[k]>el[i])isMax=false;if(!isMax)continue;
  let lo=el[i];for(let k=i;k>=0;k--){lo=Math.min(lo,el[k]);if(el[k]>el[i])break}const gain=el[i]-lo;if(gain>=minGain&&!out.some(o=>Math.abs(o.i-i)<8))out.push({i,gain})}return out}
function altimetry(s,w=360,h=180){
  const id="a"+(UID++);const {pts,centers,elev,N}=profilePts(s,80);const L=34,Rr=10,T=26,B=24;
  const emax=Math.ceil(Math.max(...elev)/250)*250||250;
  const X=x=>L+x*(w-L-Rr),Y=e=>h-B-(e/emax)*(h-T-B);
  const seg=s.km*1000/N;let sl="";
  for(let i=0;i<N;i++){const g=(elev[i+1]-elev[i])/seg*100;const x0=X(i/N),x1=X((i+1)/N);
    sl+=`<path d="M${x0.toFixed(1)} ${Y(elev[i]).toFixed(1)}L${x1.toFixed(1)} ${Y(elev[i+1]).toFixed(1)}L${x1.toFixed(1)} ${h-B}L${x0.toFixed(1)} ${h-B}Z" fill="${slopeCol(g)}"/>`}
  const ridge="M"+elev.map((e,i)=>X(i/N).toFixed(1)+" "+Y(e).toFixed(1)).join("L");
  let grid="";for(let e=0;e<=emax;e+=emax/4){grid+=`<line x1="${L}" x2="${w-Rr}" y1="${Y(e)}" y2="${Y(e)}" stroke="var(--line)"/><text x="${L-5}" y="${Y(e)+3}" text-anchor="end" font-size="9" font-family="IBM Plex Mono,monospace" fill="var(--muted)">${e}</text>`}
  const ticks=[0,.25,.5,.75,1].map(f=>`<text x="${X(f)}" y="${h-8}" font-size="9" font-family="IBM Plex Mono,monospace" fill="var(--muted)" text-anchor="${f===0?"start":f===1?"end":"middle"}">${Math.round(s.km*f)}${f===1?" km":""}</text>`).join("");
  const cat=gain=>gain>1500?"HC":gain>900?"1":gain>550?"2":gain>280?"3":"4";
  const koms=peaks(elev,150).map(({i,gain})=>{const e=elev[i];const fin=i>=N-1;const x=X(i/N)+(fin?-16:0),y=Y(e)-12+(fin?4:0);const lb=cat(gain);
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="${lb==="HC"?-9:-7}" y="-8" width="${lb==="HC"?18:14}" height="13" rx="3" fill="#e3241b"/><text y="2" text-anchor="middle" font-size="9" font-weight="800" font-family="Archivo,sans-serif" fill="#fff">${lb}</text><path d="M0 5V9" stroke="#e3241b"/></g>`}).join("");
  const spr=(s.ty!=="itt"&&s.ty!=="mountain")?(()=>{const i=Math.round(.58*N);return `<g transform="translate(${X(i/N).toFixed(1)} ${(Y(elev[i])-12).toFixed(1)})"><circle r="7" fill="#0d9e57"/><text y="3" text-anchor="middle" font-size="9" font-weight="800" font-family="Archivo,sans-serif" fill="#fff">S</text></g>`})():"";
  const fe=Y(elev[N]);
  const fin=`<g transform="translate(${X(1)} ${fe})"><path d="M0 0V-20" stroke="var(--ink)" stroke-width="1.4"/>${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect x="${c*3}" y="${-20+r*3}" width="3" height="3" fill="${(r+c)%2?"var(--surface)":"var(--ink)"}"/>`).join("")).join("")}</g>`;
  const clock=s.ty==="itt"?`<g transform="translate(${L+14} ${T+4})"><circle r="9" fill="var(--surface)" stroke="var(--blue)" stroke-width="2"/><path d="M0 -5V0L4 2" stroke="var(--blue)" stroke-width="2" fill="none" stroke-linecap="round"/></g>`:"";
  const lbl=(x,anchor,txt)=>`<text x="${x}" y="13" text-anchor="${anchor}" font-size="10.5" font-weight="700" font-family="Archivo,sans-serif" fill="var(--ink2)">${esc(txt)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${t("altT")} ${esc(s.a)} – ${esc(s.b)}"><defs><linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>
  ${grid}${sl}<path d="${ridge}L${X(1)} ${h-B}L${X(0)} ${h-B}Z" fill="url(#${id}f)"/><path d="${ridge}" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
  <text x="${L-5}" y="${T-12}" text-anchor="end" font-size="8.5" font-family="IBM Plex Mono,monospace" fill="var(--muted)">m</text>
  ${lbl(L,"start",s.a)}${s.a!==s.b?lbl(w-Rr,"end",s.b):""}${koms}${spr}${fin}${clock}${ticks}</svg>`;
}
const gradLegend=()=>`<div class="gleg">${[["var(--g1)","0–3%"],["var(--g2)","3–6%"],["var(--g3)","6–9%"],["var(--g4)","9–12%"],["var(--g5)",">12%"]].map(([c,l])=>`<span><i style="background:${c}"></i>${l}</span>`).join("")}</div>`;

/* ---------- misc graphics ---------- */
function ring(pos,tot,kind,label){const r=26,c=2*Math.PI*r,f=pos?Math.max(.06,(tot-pos+1)/tot):0;const col=kind==="verde"?"#0d9e57":kind==="pois"?"#e3241b":"var(--lead)";
  return `<div class="ring"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--surface3)" stroke-width="6"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(c*f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/>
  <text x="32" y="38" text-anchor="middle" font-size="19" font-weight="900" font-style="italic" font-family="Barlow Condensed,Arial Narrow,sans-serif" fill="var(--ink)">${pos?pos+"°":"–"}</text></svg><small>${label}</small></div>`}
function confetti(seed){const r=rng(seed);const c=["var(--lead)","#0d9e57","#e3241b","#2f6fe4","#f2a900"];let o="";for(let i=0;i<26;i++){const x=r()*100,y=r()*70,rt=r()*180;o+=`<rect x="${x.toFixed(1)}%" y="${y.toFixed(1)}%" width="5" height="9" rx="1.5" fill="${c[i%5]}" opacity=".7" transform="rotate(${rt.toFixed(0)} 0 0)" style="transform-box:fill-box;transform-origin:center"/>`}return `<svg class="conf" width="100%" height="100%" aria-hidden="true">${o}</svg>`}
const chev=`<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function icon(n){return{
 home:'<path d="M2 18h20"/><path d="M4 18l4-7 3 3 4-8 5 12"/><path d="M15 6V2.5l3 1-3 1"/>',
 cls:'<path d="M7 21h10M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
 stg:'<path d="M3 20V9l4-3 4 5 4-7 6 8v8z"/><path d="M3 20h18"/>',
 teams:'<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
 pick:'<circle cx="6" cy="16" r="4"/><circle cx="18" cy="16" r="4"/><path d="M6 16l4-8h5l3 8M9.5 8L12 16M14 5h3"/>'}[n]}
