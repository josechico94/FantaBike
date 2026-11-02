/* ---------- shell ---------- */
const TABS=["home","pick","cls","stg","teams","rules"];
const TITLES={home:null,pick:"pick",cls:"cls",stg:"stg",teams:"teams",rules:"rulesT"};
let LASTTAB=null;
function render(){
  document.documentElement.dataset.race=RID;document.documentElement.lang=L;
  const R=RACES[RID],C=compute(R);
  $("#rc").innerHTML=`${jersey(R.lead,{noshadow:1})}<b>${esc(R.short)}</b><i>▼</i>`;
  $("#lb").textContent=L.toUpperCase();
  $("#qb").setAttribute("aria-pressed",TAB==="rules");
  $("#abt").textContent=TITLES[TAB]?t(TITLES[TAB]):"FantaBike";
  $("#riders").innerHTML=riderNames().map(n=>`<option value="${esc(n)}">`).join("");
  const inp=document.getElementById("rin"),keep=inp?{v:inp.value,f:document.activeElement===inp,st:PSEL,r:RID}:null;
  const open=R.stages.some((s,i)=>isOpen(R,i)&&myDt()&&!dbPick(R,myDt(),i));
  $("#tb").innerHTML=TABS.filter(k=>k!=="rules").map(k=>`<button class="press" data-tab="${k}" ${TAB===k?'aria-current="page"':""}><span class="pl"><svg viewBox="0 0 24 24" aria-hidden="true">${icon(k)}</svg></span>${t(k)}${k==="pick"&&open?'<span class="bd">!</span>':""}</button>`).join("");
  const m=$("#m");const anim=LASTTAB!==TAB;LASTTAB=TAB;
  m.innerHTML=`<div class="scr ${anim?"in":""}">${{home:vHome,pick:vPick,cls:vCls,stg:vStg,teams:vTeams,rules:vRules}[TAB](R,C)}</div>`;
  const ni=document.getElementById("rin");if(ni&&keep&&keep.st===PSEL&&keep.r===RID){ni.value=keep.v;if(keep.f)ni.focus()}
  const b=document.querySelector('#strip [aria-pressed="true"]');if(b)b.scrollIntoView({inline:"center",block:"nearest"});
  onScroll();
}
function go(tab){TAB=tab;if(location.hash!=="#"+tab)history.replaceState(null,"","#"+tab);window.scrollTo(0,0)}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-l],[data-race],[data-tab],[data-j],[data-s],[data-dt],[data-hl],[data-go],[data-claim],[data-unclaim],[data-ps],[data-clear],[data-gopick],[data-sheet]");
  if(!b||b===document.documentElement)return;vib();
  if(b.dataset.sheet){b.dataset.sheet==="race"?raceSheet():langSheet();return}
  if(b.dataset.claim){if(!b.disabled)claim(b.dataset.claim);return}
  if(b.dataset.unclaim){MSG=null;writeMine({dt:null},false).then(()=>render());return}
  if(b.dataset.clear){clearPick();return}
  if(b.dataset.ps){PSEL=+b.dataset.ps;MSG=null;render();return}
  if(b.dataset.gopick){PSEL=+b.dataset.gopick;MSG=null;go("pick");render();return}
  MSG=null;
  if(b.dataset.l){L=b.dataset.l;ls.set("fb-l",L);closeSheet()}
  else if(b.dataset.race){RID=b.dataset.race;ls.set("fb-r",RID);SEL=null;HL=null;PSEL=null;closeSheet();LASTTAB=null;window.scrollTo(0,0)}
  else if(b.dataset.s&&b.dataset.tab){SEL=+b.dataset.s;go(b.dataset.tab)}
  else if(b.dataset.tab){go(b.dataset.tab)}
  else if(b.dataset.go){if(b.dataset.j)CJ=b.dataset.j;go(b.dataset.go)}
  else if(b.dataset.j){CJ=b.dataset.j}
  else if(b.dataset.s){SEL=+b.dataset.s}
  else if(b.dataset.hl){HL=HL===b.dataset.hl?null:b.dataset.hl}
  else if(b.dataset.dt){openDT(b.dataset.dt);return}
  render();
});
document.addEventListener("submit",e=>{if(e.target.id==="pf"){e.preventDefault();savePick(e.target.rin.value)}else if(e.target.id==="rf"){e.preventDefault();saveRes(e.target)}});
$("#scrim").onclick=closeSheet;document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
function onScroll(){$("#ab").classList.toggle("scrolled",window.scrollY>(TAB==="home"?160:50))}
window.addEventListener("scroll",onScroll,{passive:true});
function fromHash(){const h=location.hash.slice(1);if(TABS.includes(h))TAB=h}
window.addEventListener("hashchange",()=>{fromHash();render()});
fromHash();render();
