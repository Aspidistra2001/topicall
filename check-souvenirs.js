// Teste « Deux souvenirs » avec un faux relais.
const {chromium}=require('playwright');const path=require('path');const S=path.join(__dirname,'jeu-');const U='file://'+path.join(__dirname,'apercu.html')+'#';
(async()=>{const b=await chromium.launch();const errs=[];const store={};let seq=0,down=false;
const relay=async ctx=>{await ctx.route('https://ntfy.sh/**',async r=>{if(down)return r.abort();const u=new URL(r.request().url()),t=u.pathname.split('/').filter(Boolean)[0];store[t]=store[t]||[];
  if(r.request().method()==='POST'){const m={id:'m'+(++seq),time:Math.floor(Date.now()/1000),event:'message',topic:t,message:r.request().postData()};store[t].push(m);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(m)})}
  const since=u.searchParams.get('since');let list=store[t];const i=list.findIndex(m=>m.id===since);if(i>=0)list=list.slice(i+1);
  return r.fulfill({status:200,contentType:'application/x-ndjson',body:list.map(m=>JSON.stringify(m)).join('\n')+'\n'})})};
// rep : six réponses, 1 = oui, 0 = non
const joue=async(ctx,rep)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(U+'souvenirs');await p.waitForTimeout(300);
  await p.fill('#sv-t0','Le dossier de groupe en économie, la veille du rendu.');const rows=await p.$$('.sv-q');
  for(let i=0;i<6;i++)await (await rows[i].$$('button'))[rep[i]?0:1].click();await p.click('#v-jeu > .btn');await p.waitForTimeout(400);return p};
for(const [w,n] of [[1000,'d'],[390,'m']]){
 const prof=await b.newContext({viewport:{width:w,height:900}});await relay(prof);const salle=await prof.newPage();salle.on('pageerror',e=>errs.push(e.message));await salle.goto(U+'souvenirs-salle');await salle.waitForTimeout(500);
 const e1=await b.newContext({viewport:{width:w,height:900}});await relay(e1);const p1=await joue(e1,[1,1,1,0,1,0]);
 const e2=await b.newContext({viewport:{width:w,height:900}});await relay(e2);const p2=await joue(e2,[1,0,1,1,0,0]);
 console.log(n,'étudiant :',(await p1.textContent('.envoi')).slice(0,36),'| code',await p1.textContent('.jeu-code code'),'| débordement',await p1.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
 await salle.waitForTimeout(9000);console.log(n,'salle :',await salle.textContent('.score'),'|',(await salle.$$eval('.mz-v',a=>a.map(x=>x.textContent))).join(' '),'| débordement',await salle.evaluate(()=>document.documentElement.scrollWidth-innerWidth));
 await p1.screenshot({path:S+'souv-etu-'+n+'.png',fullPage:true});await salle.screenshot({path:S+'souv-salle-'+n+'.png',fullPage:true});
 await salle.click('text=Nouvelle manche');await salle.waitForTimeout(200);console.log(n,'après remise à zéro :',await salle.textContent('.score'));
 down=true;const p3=await joue(e2,[0,0,0,0,0,0]);console.log(n,'relais coupé :',(await p3.textContent('.envoi')).slice(0,38),'| code visible',await p3.$eval('.jeu-out details',d=>d.open));down=false;
 await prof.close();await e1.close();await e2.close()}
console.log('erreurs',errs);await b.close()})();
