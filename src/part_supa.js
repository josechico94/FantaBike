/* ---------- Supabase: auth + shared data ---------- */
Object.assign(T.it,{login:"Accedi",signup:"Registrati",email:"Email",password:"Password",name:"Nome",forgot:"Password dimenticata?",
  sendReset:"Invia link",resetSent:"Ti abbiamo mandato un'email con il link per cambiare password.",newPw:"Nuova password",savePw:"Salva password",
  pwSaved:"Password aggiornata.",checkEmail:"Registrazione fatta! Apri l'email che ti abbiamo mandato per confermare l'account, poi accedi.",
  badLogin:"Email o password non corretti.",notConfirmed:"Devi prima confermare l'email: controlla la tua casella di posta.",pwShort:"La password deve avere almeno 6 caratteri.",
  authErr:"Qualcosa è andato storto. Riprova tra poco.",welcome:"La lega di fanta-ciclismo",back:"Torna all'accesso",account:"Account",logout:"Esci",
  admin:"Organizzatore",dsLocked:"Hai già fatto delle scelte: per cambiare DS chiedi all'organizzatore.",closedErr:"Questa tappa è chiusa: non puoi più cambiare la scelta.",
  nocfg:"Manca la configurazione di Supabase (config.js).",exists:"Esiste già un account con questa email: accedi."});
Object.assign(T.es,{login:"Entrar",signup:"Registrarse",email:"Email",password:"Contraseña",name:"Nombre",forgot:"¿Olvidaste la contraseña?",
  sendReset:"Enviar enlace",resetSent:"Te enviamos un email con el enlace para cambiar la contraseña.",newPw:"Nueva contraseña",savePw:"Guardar contraseña",
  pwSaved:"Contraseña actualizada.",checkEmail:"¡Registro hecho! Abre el email que te enviamos para confirmar la cuenta y después entra.",
  badLogin:"Email o contraseña incorrectos.",notConfirmed:"Primero tienes que confirmar el email: revisa tu bandeja de entrada.",pwShort:"La contraseña debe tener al menos 6 caracteres.",
  authErr:"Algo salió mal. Inténtalo de nuevo en un momento.",welcome:"La liga de fanta-ciclismo",back:"Volver a entrar",account:"Cuenta",logout:"Salir",
  admin:"Organizador",dsLocked:"Ya hiciste elecciones: para cambiar de DD pídeselo al organizador.",closedErr:"Esta etapa está cerrada: ya no puedes cambiar la elección.",
  nocfg:"Falta la configuración de Supabase (config.js).",exists:"Ya existe una cuenta con este email: entra."});

let SB=null,AUTH={state:"loading",mode:"login",msg:null},SESSION=null,PROFILES=[],PICKCOUNT={},AUTHBUSY=false;
const SITE=()=>location.origin+location.pathname;

async function loadAll(){
  if(!SB||!SESSION)return;
  try{
    const [pr,pk,rs,cv,ct]=await Promise.all([
      SB.from("profiles").select("id,display_name,ds,is_admin,created_at"),
      SB.from("picks").select("user_id,race,stage,rider"),
      SB.from("results").select("race,stage,riders"),
      SB.rpc("pick_counts",{p_race:"vuelta"}),SB.rpc("pick_counts",{p_race:"tour"})]);
    if(pr.error||pk.error||rs.error)throw pr.error||pk.error||rs.error;
    PROFILES=pr.data;const o={};
    pr.data.forEach(p=>o[p.id]={dt:p.ds,since:Date.parse(p.created_at)||0,name:p.display_name,vuelta:{},tour:{}});
    pk.data.forEach(r=>{if(o[r.user_id]&&o[r.user_id][r.race])o[r.user_id][r.race][String(r.stage)]=r.rider});
    PK=o;const rr={};rs.data.forEach(r=>rr[r.race+"_"+r.stage]={riders:r.riders});RESDB=rr;
    PICKCOUNT={vuelta:Object.fromEntries((cv.data||[]).map(x=>[x.stage,x.n])),tour:Object.fromEntries((ct.data||[]).map(x=>[x.stage,x.n]))};
    const me=pr.data.find(p=>p.id===ME);ADMIN=!!(me&&me.is_admin);DBS="on";CANW=true;
  }catch(e){console.error(e);if(DBS!=="on")DBS="off"}
  render();
}
let reloadT=null;const reload=()=>{clearTimeout(reloadT);reloadT=setTimeout(loadAll,400)};

async function claim(dt){MSG=null;const o=ownerOf(dt);if(o&&o!==ME){MSG=["err",t("takenErr")];render();return}
  BUSY=true;render();const {error}=await SB.from("profiles").update({ds:dt}).eq("id",ME);BUSY=false;
  if(error){MSG=["err",error.code==="23505"?t("takenErr"):t("saveErr")];render();return}
  await loadAll();toast("✓ "+esc(dt))}
async function unclaim(){MSG=null;BUSY=true;const {error}=await SB.from("profiles").update({ds:null}).eq("id",ME);BUSY=false;
  if(error){toast(/ds_locked/.test(error.message)?t("dsLocked"):t("saveErr"));render();return}await loadAll()}
async function savePick(val){
  const R=RACES[RID],me=myDt(),s=R.stages[PSEL];val=String(val||"").replace(/\s+/g," ").trim();
  if(!val){MSG=["err",t("empty")];render();return}
  if(!isOpen(R,PSEL)){MSG=["err",t("closedErr")];render();return}
  const dup=usedList(R,me,PSEL).find(u=>norm(u.rd)===norm(val));
  if(dup){MSG=["err",t("usedErr").replace("{r}",esc(dup.rd)).replace("{n}",dup.n)];render();return}
  const known=riderNames().find(n=>norm(n)===norm(val));if(known)val=known;
  BUSY=true;render();
  const {error}=await SB.from("picks").upsert({user_id:ME,race:R.id,stage:s.n,rider:val,updated_at:new Date().toISOString()},{onConflict:"user_id,race,stage"});
  BUSY=false;
  if(error){MSG=["err",error.code==="23505"?t("usedErr").replace("{r}",esc(val)).replace(" {n}","").replace("{n}",""):error.code==="42501"?t("closedErr"):t("saveErr")];render();return}
  MSG=null;await loadAll();toast("✓ "+t("saved")+" · "+esc(val));
}
async function clearPick(){const R=RACES[RID];if(!isOpen(R,PSEL))return;
  const {error}=await SB.from("picks").delete().match({user_id:ME,race:R.id,stage:R.stages[PSEL].n});if(error){toast(t("saveErr"));return}MSG=null;await loadAll()}
async function saveRes(f){
  const R=RACES[RID],i=+f.dataset.i,s=R.stages[i];const names=[...f.querySelectorAll("[data-rn]")].map(b=>b.dataset.rn);const riders={};
  for(let k=0;k<names.length;k++){const tv=parseT(f.querySelector("#rt"+k).value),out=f.querySelector("#ro"+k).checked;
    if(isNaN(tv)||(!out&&!tv)){MSG=["err",t("fmtErr").replace("{r}",esc(names[k])),"res"];render();return}
    const n=id=>Math.max(0,parseInt(f.querySelector("#"+id+k).value)||0);
    riders[names[k]]={t:tv,b:n("rb"),p:n("rp"),g:n("rg"),k:n("rk"),out}}
  BUSY=true;render();
  const {error}=await SB.from("results").upsert({race:R.id,stage:s.n,riders,updated_at:new Date().toISOString()},{onConflict:"race,stage"});
  BUSY=false;if(error){MSG=["err",t("saveErr"),"res"];render();return}
  MSG=null;await loadAll();toast("✓ "+t("resSaved"));
}

/* ---------- auth screens ---------- */
function vAuth(){
  const R=RACES[RID],s0=R.stages[0];const m=AUTH.mode,msg=AUTH.msg;
  if(AUTH.state==="nocfg")return `<div class="scr"><p class="note">${t("nocfg")}</p></div>`;
  if(AUTH.state==="loading")return `<div class="scr"><p class="note">${t("loading")}</p></div>`;
  const field=(id,type,label,ac,extra="")=>`<label class="af"><span>${label}</span><input id="${id}" name="${id}" type="${type}" autocomplete="${ac}" required ${extra}></label>`;
  let form;
  if(AUTH.state==="recovery")form=`<form id="af" data-m="recovery" class="authf"><h2>${t("newPw")}</h2>${field("pw","password",t("newPw"),"new-password",'minlength="6"')}<button class="cta press" ${AUTHBUSY?"disabled":""}>${t("savePw")}</button></form>`;
  else if(m==="reset")form=`<form id="af" data-m="reset" class="authf"><h2>${t("forgot")}</h2>${field("em","email",t("email"),"email")}<button class="cta press" ${AUTHBUSY?"disabled":""}>${t("sendReset")}</button><button type="button" class="lnk" data-am="login">${t("back")}</button></form>`;
  else form=`<div class="lang" role="tablist" style="margin-bottom:14px"><button type="button" data-am="login" aria-pressed="${m==="login"}">${t("login")}</button><button type="button" data-am="signup" aria-pressed="${m==="signup"}">${t("signup")}</button></div>
    <form id="af" data-m="${m}" class="authf">${m==="signup"?field("nm","text",t("name"),"name",'maxlength="40"'):""}${field("em","email",t("email"),"email")}${field("pw","password",t("password"),m==="signup"?"new-password":"current-password",'minlength="6"')}
    <button class="cta press" ${AUTHBUSY?"disabled":""}>${m==="signup"?t("signup"):t("login")}</button>${m==="login"?`<button type="button" class="lnk" data-am="reset">${t("forgot")}</button>`:""}</form>`;
  return `<section class="hero">${scene(s0,{riders:[jkind("gen"),"verde","pois"]})}<div class="ov"><div class="brand">Fanta<i>Bike</i></div><p style="margin:4px 0 0;opacity:.8">${t("welcome")} · ${esc(R.name)}</p></div></section>
  <div class="scr"><section class="card" style="padding:16px">${msg?`<div class="msg ${msg[0]}" style="margin-bottom:12px">${msg[1]}</div>`:""}${form}</section></div>`;
}
async function submitAuth(f){
  const m=f.dataset.m,em=f.em?f.em.value.trim():"",pw=f.pw?f.pw.value:"",nm=f.nm?f.nm.value.trim():"";
  if(pw&&pw.length<6){AUTH.msg=["err",t("pwShort")];render();return}
  AUTHBUSY=true;AUTH.msg=null;render();let r;
  try{
    if(m==="login"){r=await SB.auth.signInWithPassword({email:em,password:pw});
      if(r.error)AUTH.msg=["err",/confirm/i.test(r.error.message)?t("notConfirmed"):/invalid/i.test(r.error.message)?t("badLogin"):t("authErr")]}
    else if(m==="signup"){r=await SB.auth.signUp({email:em,password:pw,options:{data:{name:nm},emailRedirectTo:SITE()}});
      if(r.error)AUTH.msg=["err",/registered|exists/i.test(r.error.message)?t("exists"):t("authErr")];
      else if(r.data&&r.data.user&&r.data.user.identities&&r.data.user.identities.length===0){AUTH.msg=["err",t("exists")];AUTH.mode="login"}
      else if(!r.data.session){AUTH.msg=["ok",t("checkEmail")];AUTH.mode="login"}}
    else if(m==="reset"){r=await SB.auth.resetPasswordForEmail(em,{redirectTo:SITE()});AUTH.msg=r.error?["err",t("authErr")]:["ok",t("resetSent")]}
    else if(m==="recovery"){r=await SB.auth.updateUser({password:pw});if(r.error)AUTH.msg=["err",t("authErr")];else{AUTH.state="in";toast("✓ "+t("pwSaved"));await loadAll()}}
  }catch(e){AUTH.msg=["err",t("authErr")]}
  AUTHBUSY=false;render();
}
function accountSheet(){
  const me=PROFILES.find(p=>p.id===ME)||{};const ds=myDt();
  openSheet(`<div style="padding:4px 16px 0"><div class="card me" style="margin-top:6px">${ds?jersey(ds):jersey("neutral")}<div class="t"><div class="eb">${t("account")}${ADMIN?" · "+t("admin"):""}</div><b>${esc(me.display_name||"")}</b><small class="muted">${esc((SESSION&&SESSION.user.email)||"")}</small>${ds?`<small class="muted" style="display:block">${t("ds")}: ${esc(ds)}</small>`:""}</div></div>
  <div style="display:grid;gap:10px;margin-top:14px"><button class="cta sec press" data-tab="rules" data-close="1">${t("rulesT")}</button><button class="cta press" id="lo" style="background:var(--kom);color:#fff">${t("logout")}</button></div></div>`);
  $("#lo").onclick=async()=>{closeSheet();await SB.auth.signOut()}}

/* ---------- boot ---------- */
(async()=>{
  await 0; // let the shell finish defining itself
  if(!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY||!window.supabase){AUTH.state="nocfg";DBS="off";render();return}
  SB=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  SB.auth.onAuthStateChange((ev,session)=>{setTimeout(()=>{
    SESSION=session;ME=session?session.user.id:null;
    if(ev==="PASSWORD_RECOVERY"){AUTH.state="recovery";render();return}
    if(session&&AUTH.state!=="recovery"){const was=AUTH.state;AUTH.state="in";if(was!=="in"){AUTH.msg=null;DBS="loading";loadAll()}else render()}
    else if(!session){AUTH.state="out";PK={};RESDB={};PROFILES=[];DBS="loading";render()}
  },0)});
  const {data}=await SB.auth.getSession();
  if(!data.session&&AUTH.state==="loading"){AUTH.state="out";render()}
  SB.channel("fb").on("postgres_changes",{event:"*",schema:"public",table:"picks"},reload)
    .on("postgres_changes",{event:"*",schema:"public",table:"results"},reload)
    .on("postgres_changes",{event:"*",schema:"public",table:"profiles"},reload).subscribe();
  setInterval(()=>{if(AUTH.state==="in"&&!document.hidden)loadAll()},60000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&AUTH.state==="in")loadAll()});
})();
