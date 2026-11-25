const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const dir=__dirname;
(async()=>{const b=await chromium.launch();const errs=[];
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+fs.readFileSync(path.join(dir,'index.html'),'utf8')+'</body></html>';
fs.writeFileSync(path.join(dir,'apercu.html'),html);
const url='file://'+path.join(dir,'apercu.html');
for(const [w,h,n] of [[1100,800,'d'],[390,800,'m']]){
 const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
 await p.goto(url);await p.waitForTimeout(800);
 await p.screenshot({path:path.join(dir,n+'-map.png'),fullPage:true});
 for(const s of ['marne','lille','lyon','marseille','bordeaux']){
  await p.goto(url+'#'+s);await p.waitForTimeout(150);
  const count=(await p.$$('#rooms button')).length;
  for(let i=0;i<count;i++){await (await p.$$('#rooms button'))[i].click();{const g=await p.$('.scene > .row .btn.ghost');if(g)await g.click();}
   for(let k=0;k<12;k++){const d=await p.$$('.desk');if(d[k]){await d[k].click();const c=await p.$('.bubble .cat:not(:disabled)');if(c)await c.click();}}
   let c;while((c=await p.$('#scene > .act .item .cat:not(:disabled)')))await c.click();
   {const th=await p.$('.poste .pc:has-text("Théories de la motivation")');if(th){await th.click();if(n==='d')await (await p.$('.theo')).screenshot({path:path.join(dir,'d-theo.png')});if(n==='m')await (await p.$('.theo')).screenshot({path:path.join(dir,'m-theo.png')});await th.click();}}
   {const mi=await p.$('.poste .pc:has-text("Motivation intrinsèque")');if(mi){await mi.click();if(n==='d')await (await p.$('.poste:has-text("Motivation intrinsèque")')).screenshot({path:path.join(dir,'d-intr.png')});await mi.click();}}
   const o=await p.$$('.opt');if(o.length){await o[0].click();await o[1].click();await p.click('.act > .btn');}
   const sg=await p.$$('.seg');if(sg.length){await p.click('.act .btn.ghost');}
   if(n==='m'&&s==='marne'&&i===1)await p.screenshot({path:path.join(dir,'m-room.png'),fullPage:true});
  }
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  console.log(n,s,await p.textContent('#prog'),'overflow',ov);
  if(s==='lille')await p.screenshot({path:path.join(dir,n+'-site.png'),fullPage:true});
 }
 await p.close();}
console.log('errors',errs);await b.close()})();
