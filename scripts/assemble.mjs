import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const page=readFileSync('worker/page.html','utf8'),css=readFileSync('worker/ui.css','utf8');
const client=page.split('<script>')[1].split('</script>')[0];
const version=createHash('sha256').update(css+client).digest('hex').slice(0,16);
const html=page.replace('<style>__UI_CSS__</style>','<link rel="stylesheet" href="/assets/ui.css?v='+version+'">').replace('<script>'+client+'</script>','<script defer src="/assets/app.js?v='+version+'"></script>');
const server=readFileSync('worker/server.js','utf8').replace('__CASE_CONTENT__',readFileSync('worker/content.json','utf8')).replace('__PUBLIC_ENGINE__',readFileSync('worker/public-pages.js','utf8').replace('__SOCIAL_IMAGE__',JSON.stringify(readFileSync('worker/social-card.png').toString('base64')))).replace('__ACCOUNT_ENGINE__',readFileSync('worker/accounts.js','utf8')).replace('__OWNER_HTML__',JSON.stringify(readFileSync('worker/owner.html','utf8'))).replace('__NETWORK_ENGINE__',readFileSync('worker/network-engine.js','utf8').replace('__NETWORK_CONTENT__',readFileSync('worker/network.json','utf8')));
writeFileSync('worker/index.js','const HTML='+JSON.stringify(html)+';\nconst CLIENT_JS='+JSON.stringify(client)+';\nconst UI_CSS='+JSON.stringify(css)+';\nconst ASSET_VERSION='+JSON.stringify(version)+';\n'+server+'\nexport {C,NQ,run,newState,view,networkView};\n');
console.log('Assembled server, cacheable browser assets and bilingual UI.');
