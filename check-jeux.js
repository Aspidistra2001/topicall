// Teste les deux jeux avec un faux relais : les requêtes vers ntfy.sh sont interceptées et servies en mémoire.
const {chromium}=require('playwright');const path=require('path');const S=path.join(__dirname,'jeu-');const U='file://'+path.join(__dirname,'apercu.html')+'#';
(async()=>{const b=await chromium.launch();const errs=[];const store={};let seq=0,down=false;
const relay=async ctx=>{await ctx.route('https://ntfy.sh/**',async r=>{if(down)return r.abort();const u=new URL(r.request().url()),parts=u.pathname.split('/').filter(Boolean),t=parts[0];store[t]=store[t]||[];
  if(r.request().method()==='POST'){const m={id:'m'+(++seq),time:Math.floor(Date.now()/1000),event:'message',topic:t,message:r.request().postData()};store[t].push(m);return r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},contentType:'application/json',body:JSON.stringify(m)})}
  const since=u.searchParams.get('since');let list=store[t];const i=list.findIndex(m=>m.id===since);if(i>=0)list=list.slice(i+1);
  return r.fulfill({status:200,headers:{'access-control-allow-origin':'*'},contentType:'application/x-ndjson',body:list.map(m=>JSON.stringify(m)).join('\n')+'\n'})})};
const joue=async(ctx,k,plan)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(U+k);await p.waitForTimeout(300);const plus=await p.$$('.jeu-l .plus');
  for(let i=0;i<plan.length;i++)for(let j=0;j<plan[i];j++)await plus[i].click();await p.click('#v-jeu > .btn');await p.waitForTimeout(400);return p};
for(const [w,n] of [[1000,'d'],[390,'m']]){
 for(const k of ['encheres','emploi']){
  const prof=await b.newContext({viewport:{width:w,height:900}});await relay(prof);const salle=await prof.newPage();salle.on('pageerror',e=>errs.push(e.message));
  await salle.goto(U+k+'-salle');await salle.waitForTimeout(500);
  const e1=await b.newContext({viewport:{width:w,height:900}});await relay(e1);const p1=await joue(e1,k,[10,5,5]);
  const e2=await b.newContext({viewport:{width:w,height:900}});await relay(e2);const p2=await joue(e2,k,[0,0,0,20]);
  console.log(n,k,'étudiant :',(await p1.textContent('.envoi')).slice(0,34),'| débordement',await p1.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
  // le premier étudiant change d'avis : sa nouvelle mise doit remplacer l'ancienne
  await (await p1.$$('.jeu-l .moins'))[0].click();await (await p1.$$('.jeu-l .plus'))[5].click();await p1.click('#v-jeu > .btn');await p1.waitForTimeout(300);
  await salle.waitForTimeout(9000);
  console.log(n,k,'salle :',await salle.textContent('.score'));
  if(n==='d'&&k==='emploi'){await salle.click('text=Afficher les familles');await salle.screenshot({path:S+'relais-salle.png',fullPage:true});await p1.screenshot({path:S+'relais-etudiant.png',fullPage:true})}
  await salle.click('text=Nouvelle manche');await salle.waitForTimeout(200);console.log(n,k,'après remise à zéro :',await salle.textContent('.score'),'| débordement',await salle.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
  await prof.close();await e1.close();await e2.close()}
 // relais coupé : l'étudiant doit voir le code de secours, l'animateur le champ du chat
 down=true;const c=await b.newContext({viewport:{width:w,height:900}});await relay(c);const p=await joue(c,'encheres',[20]);
 console.log(n,'relais coupé, étudiant :',(await p.textContent('.envoi')).slice(0,40),'| code visible',await p.$eval('.jeu-out details',d=>d.open),await p.textContent('.jeu-code code'));
 const s=await c.newPage();await s.goto(U+'encheres-salle');await s.waitForTimeout(600);await s.fill('#jeu-chat','De Alice : '+await p.textContent('.jeu-code code'));
 console.log(n,'relais coupé, salle :',await s.textContent('.score'));await c.close();down=false}
console.log('erreurs',errs);await b.close()})();
