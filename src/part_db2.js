async function writeMine(patch,create){
  if(!DB||BUSY)return false;BUSY=true;render();
  try{const ref=DB.collection("picks").doc(ME);if(create||!PK[ME])await ref.set(patch);else await ref.update(patch);BUSY=false;return true}
  catch(e){BUSY=false;MSG=["err",t("saveErr")];render();return false}
}
async function claim(dt){MSG=null;const o=ownerOf(dt);if(o&&o!==ME){MSG=["err",t("takenErr")];render();return}
  const cur=PK[ME]||{};await writeMine({...cur,dt,since:Date.now()},true);render()}
async function savePick(val){
  const R=RACES[RID],me=myDt(),s=R.stages[PSEL];val=String(val||"").replace(/\s+/g," ").trim();
  if(!val){MSG=["err",t("empty")];render();return}
  if(!isOpen(R,PSEL)){render();return}
  const dup=usedList(R,me,PSEL).find(u=>norm(u.rd)===norm(val));
  if(dup){MSG=["err",t("usedErr").replace("{r}",esc(dup.rd)).replace("{n}",dup.n)];render();return}
  const known=riderNames().find(n=>norm(n)===norm(val));if(known)val=known;
  if(await writeMine({[R.id]:{[String(s.n)]:val}},false)){MSG=null;render();toast("✓ "+t("saved")+" · "+esc(val))}
}
async function clearPick(){const R=RACES[RID];if(!isOpen(R,PSEL))return;if(await writeMine({[R.id]:{[String(R.stages[PSEL].n)]:""}},false)){MSG=null;render()}}
(async()=>{
  try{
    if(!window.claude||!window.claude.use){DBS="off";render();return}
    const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    if(!db||!user){DBS="off";render();return}
    ME=await user.id();if(!ME){DBS="off";render();return}
    try{const c=await user.can("data.write");CANW=c!==false}catch(e){}
    DB=db;try{ADMIN=(await user.isOwner())||(await user.canEdit())}catch(e){}
    db.collection("results").onSnapshot(snap=>{const o={};snap.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});RESDB=o;render()},()=>{});
    db.collection("picks").onSnapshot(snap=>{const o={};snap.docs.forEach(d=>{if(d.exists)o[d.id]=d.data()});PK=o;DBS="on";render()},()=>{DBS="off";render()});
  }catch(e){DBS="off";render()}
})();
