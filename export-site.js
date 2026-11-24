// Fabrique la version autonome de la page pour un site statique (argospanoptes.fr).
// Usage : node export-site.js <dossier de destination>
// La page attend les polices locales du site à ../polices/polices.css et n'est pas indexée.
const fs=require('fs'),path=require('path');
const dest=process.argv[2];
if(!dest){console.error('Usage : node export-site.js <dossier de destination>');process.exit(1)}
let s=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const take=re=>{const m=s.match(re);if(!m)throw new Error('Introuvable dans index.html : '+re);s=s.replace(re,'');return m[0].trim()};
const title=take(/<title>[^<]*<\/title>\n?/);
take(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/);
take(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/);
if(!s.includes('--body:"Figtree",'))throw new Error('Police de texte introuvable');
s=s.replace('--body:"Figtree",','--body:"Source Sans 3",');
const html=`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex, nofollow, noarchive">
${title}
<link rel="stylesheet" href="../polices/polices.css">
<style>html{color-scheme:light}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}</style>
</head>
<body>
${s.trim()}
</body>
</html>
`;
fs.mkdirSync(path.join(dest,'img'),{recursive:true});
fs.writeFileSync(path.join(dest,'index.html'),html);
for(const f of fs.readdirSync(path.join(__dirname,'img')))fs.copyFileSync(path.join(__dirname,'img',f),path.join(dest,'img',f));
console.log('Page écrite dans',dest,'('+Math.round(html.length/1024)+' Ko)');
