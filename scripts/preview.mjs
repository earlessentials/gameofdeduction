import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync,statSync} from 'node:fs';
let worker,loaded=0; async function latestWorker(){const stamp=statSync('worker/index.js').mtimeMs;if(stamp!==loaded){worker=(await import('../worker/index.js?version='+stamp)).default;loaded=stamp}return worker}
mkdirSync('.local',{recursive:true});
const db=new DatabaseSync('.local/preview.sqlite');
db.exec('CREATE TABLE IF NOT EXISTS preview_migrations(name TEXT PRIMARY KEY)');
for(const tag of ['0000_archive','0001_player_accounts']){if(!db.prepare('SELECT name FROM preview_migrations WHERE name=?').get(tag)){try{db.exec(readFileSync('drizzle/'+tag+'.sql','utf8'))}catch(e){if(tag!=='0000_archive'||!e.message.includes('already exists'))throw e}db.prepare('INSERT INTO preview_migrations(name) VALUES (?)').run(tag)}}
const DB={prepare(sql){let values=[];return {bind(...v){values=v;return this},async first(){return db.prepare(sql).get(...values)},async run(){const r=db.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}}}}}};
createServer(async(req,res)=>{try{let chunks=[];for await(const ch of req)chunks.push(ch);const body=Buffer.concat(chunks);const request=new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,...(body.length?{body}:{} )});const response=await (await latestWorker()).fetch(request,{DB,OWNER_DASHBOARD_KEY:process.env.OWNER_DASHBOARD_KEY});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){console.error(e.message);res.writeHead(500);res.end('Preview request failed')}}).listen(4317,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4317'));
