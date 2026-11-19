const C=__CASE_CONTENT__;
const pair=(en,id)=>({en,id});
class GameError extends Error {constructor(en,id,status=400){super(en);this.translated={en,id};this.status=status}}
const fail=(a,b,s)=>{throw new GameError(a,b,s)};
const clean=(s)=>String(s||'').trim();
const newState=()=>({name:'',avatar:0,language:'en',attempts:[],created:Date.now()});
__NETWORK_ENGINE__
__ACCOUNT_ENGINE__
__PUBLIC_ENGINE__
const OWNER_HTML=__OWNER_HTML__;
const active=s=>s.attempts.filter(a=>a.status==='ACTIVE');
const info=c=>({id:c.id,title:c.title,kind:c.kind,setting:c.setting,brief:c.brief,difficulty:c.difficulty,volume:c.volume||1,series:c.series||null,episode:c.episode||null,sceneCount:c.scenes.length,evidenceCount:c.evidence.length,questionCount:c.questions.length});
function publicState(s){return {...s,attempts:s.attempts.map(a=>({...a})),cases:C.map(c=>({...info(c),unlocked:hollowReady(s,c)})),network:networkView(s)}}
function getAttempt(s,id){const a=s.attempts.find(a=>a.id===id);if(!a)fail('Investigation not found.','Investigasi tidak ditemukan.',404);return a}
const score=a=>Math.max(0,100-a.errors*3-a.hints.length*4);
function toolView(c,a,closed){if(!c.tool||(!closed&&a.stage<c.tool.stage))return null;return {...c.tool,ready:c.tool.refs.every(id=>a.inspected.includes(id)),visited:a.toolPanels?.[c.tool.kind]||[],responses:a.toolResponses||{}}}
function view(s,id){const a=getAttempt(s,id),c=C.find(c=>c.id===a.caseId),closed=a.status==='COMPLETED';return {attempt:a,tool:toolView(c,a,closed),case:info(c),scenes:c.scenes,evidence:c.evidence.filter(e=>closed||e.stage<=a.stage).map(e=>({...e,body:a.inspected.includes(e.id)||closed?e.body:null})),characters:c.characters.filter(ch=>closed||ch.stage<=a.stage).map(({responses,...ch})=>({...ch,transcript:(a.dialogue[ch.id]||[]).map(i=>({question:i,response:responses[i]}))})),questions:c.questions.filter(q=>closed||q.stage===a.stage).map(({answer,hints,explanation,...q})=>({...q,explanation:a.answers.includes(q.id)?explanation:null,usedHints:a.hints.filter(h=>h.q===q.id).map(h=>hints[h.level])})),resolution:closed?c.solution:null,score:score(a)}}
function run(s,b){let result={};if(b.action==='profile'){const name=clean(b.name);if(name.length<2||name.length>30)fail('Use a name between 2 and 30 characters.','Gunakan nama sepanjang 2–30 karakter.');s.name=name;s.avatar=Math.max(0,Math.min(5,Number(b.avatar)||0));s.language=b.language==='id'?'id':'en';return publicState(s)}
 if(b.action==='language'){s.language=b.language==='id'?'id':'en';return publicState(s)}
 if(!s.name)fail('Register your investigator first.','Daftarkan identitas detektif kamu dahulu.');
 if(String(b.action||'').startsWith('network'))return networkAction(s,b);
 if(b.action==='start'){
 const c=C.find(c=>c.id===Number(b.caseId));if(!c)fail('Case not found.','Kasus tidak ditemukan.',404);if(!hollowReady(s,c))fail('Complete the preceding Hollow Network episode first.','Selesaikan episode Hollow Network sebelumnya dahulu.',403);
 const existing=s.attempts.find(a=>a.caseId===c.id&&a.status!=='COMPLETED');
 if(existing&&existing.status==='ACTIVE')return view(s,existing.id);
 if(active(s).length>=2)fail('Your investigation desk is full. Complete or archive an active case first.','Meja investigasi kamu penuh. Selesaikan atau arsipkan satu kasus aktif dahulu.',409);
 if(existing){existing.status='ACTIVE';return view(s,existing.id)}
 const a={id:crypto.randomUUID(),caseId:c.id,status:'ACTIVE',stage:0,inspected:[],answers:[],dialogue:{},hints:[],errors:0,submissions:0,notes:'',pins:[],links:[],toolPanels:{},started:Date.now(),completed:null};s.attempts.push(a);return view(s,a.id)
 }
 const a=getAttempt(s,b.attempt),c=C.find(c=>c.id===a.caseId);
 if(b.action==='archive'){if(a.status!=='ACTIVE')fail('Only an active case can be archived.','Hanya kasus aktif yang bisa diarsipkan.');a.status='ARCHIVED';return publicState(s)}
 if(b.action==='notes'){if(b.notes!==undefined)a.notes=String(b.notes).slice(0,12000);if(b.highlights!==undefined){if(!Array.isArray(b.highlights))fail('Invalid highlights.','Sorotan tidak valid.');a.highlights=b.highlights.slice(0,30).filter(h=>h&&a.inspected.includes(h.evidence)&&typeof h.quote==='string'&&h.quote.length>0&&h.quote.length<=1200&&Object.values(c.evidence.find(e=>e.id===h.evidence)?.body||{}).some(text=>text.includes(h.quote))).map(h=>({evidence:h.evidence,quote:h.quote}));}a.pins=(b.pins||a.pins).filter(x=>a.inspected.includes(x));a.links=(b.links||a.links).filter(x=>a.inspected.includes(x[0])&&a.inspected.includes(x[1]));return {saved:true,view:view(s,a.id)}}
 if(a.status!=='ACTIVE')fail('Resume this investigation to continue.','Lanjutkan investigasi ini untuk melanjutkan.');
 if(b.action==='reviewStage'){const records=c.evidence.filter(e=>e.stage===a.stage);if(!records.length)fail('All records for this stage are already in the archive.','Semua catatan tahap ini sudah tersedia dalam arsip.');for(const e of records)if(!a.inspected.includes(e.id))a.inspected.push(e.id);a.recentEvidence=[...records.map(e=>e.id),...(a.recentEvidence||[]).filter(id=>!records.some(e=>e.id===id))].slice(0,8);return view(s,a.id)}
 if(b.action==='inspect'){const e=c.evidence.find(e=>e.id===b.evidence&&e.stage<=a.stage);if(!e)fail('This evidence is still locked.','Bukti ini masih terkunci.',403);if(!a.inspected.includes(e.id))a.inspected.push(e.id);a.recentEvidence=[e.id,...(a.recentEvidence||[]).filter(id=>id!==e.id)].slice(0,8);return view(s,a.id)}
 if(b.action==='interview'){const ch=c.characters.find(ch=>ch.id===b.character&&ch.stage<=a.stage);const i=Number(b.question);if(i===3&&ch?.evidenceRef&&!a.inspected.includes(ch.evidenceRef))fail('Inspect the linked record before confronting this account.','Periksa catatan terkait sebelum menguji keterangan ini.',403);if(!ch||!Number.isInteger(i)||i<0||i>3)fail('This interview is unavailable.','Wawancara ini belum tersedia.',403);a.dialogue[ch.id]??=[];if(!a.dialogue[ch.id].includes(i))a.dialogue[ch.id].push(i);return view(s,a.id)}
 if(b.action==='tool'){
 const tool=c.tool,panel=Number(b.panel);if(!tool||a.stage<tool.stage||!Number.isInteger(panel)||panel<0||panel>=tool.panes.length)fail('This investigation tool is locked.','Alat investigasi ini terkunci.',403);
 if(!tool.refs.every(id=>a.inspected.includes(id)))fail('Inspect the tool’s referenced evidence first.','Periksa bukti rujukan alat ini dahulu.');
 if(b.choice!==undefined){if(tool.kind!=='choice'||!Number.isInteger(b.choice)||b.choice<0||b.choice>3)fail('Select a valid simulation response.','Pilih respons simulasi yang valid.');a.toolResponses??={};a.toolResponses[panel]=b.choice;}
 a.toolPanels??={};a.toolPanels[tool.kind]??=[];if(!a.toolPanels[tool.kind].includes(panel))a.toolPanels[tool.kind].push(panel);return view(s,a.id)
 }
 if(b.action==='answer'||b.action==='hint'){
 const q=c.questions.find(q=>q.id===b.question&&q.stage===a.stage);if(!q)fail('This checkpoint is locked.','Titik deduksi ini terkunci.',403);
 if(!q.refs.every(id=>a.inspected.includes(id)))fail('Inspect the referenced evidence before making this deduction.','Periksa bukti rujukan sebelum membuat deduksi ini.');
 if(b.action==='hint'){const used=a.hints.filter(h=>h.q===q.id).length;const level=Math.min(used,q.hints.length-1);if(used<q.hints.length)a.hints.push({q:q.id,level});return {hint:q.hints[level],view:view(s,a.id)}}
 if(a.answers.includes(q.id))return {correct:true,view:view(s,a.id)};
 if(!Number.isInteger(b.option)||b.option<0||b.option>3)fail('Choose one option.','Pilih satu jawaban.');
 if(q.stage===c.scenes.length&&!b.confirmed)fail('Confirm your final theory before submitting.','Konfirmasi teori akhir kamu sebelum mengirim.');
 if(c.id===24&&q.stage===c.scenes.length){requireFinalNetwork(s);const qs=c.questions.filter(x=>x.stage===q.stage);if(!qs.slice(0,qs.findIndex(x=>x.id===q.id)).every(x=>a.answers.includes(x.id)))fail('Complete the finale reconstruction in order.','Selesaikan rekonstruksi final secara berurutan.',403);const n=networkStore(s);n.journal.push({at:Date.now(),question:q.id,prompt:q.prompt,option:b.option,selected:q.options[b.option],correct:b.option===q.answer,refs:q.refs,domain:['pattern','synthesis','hypothesis','organization'][qs.findIndex(x=>x.id===q.id)%4]});}
 a.submissions++;
 if(b.option!==q.answer){a.errors++;return {correct:false,feedback:pair('That conclusion goes beyond the evidence. Reopen the cited source and compare the alternatives.','Kesimpulan itu melampaui bukti. Buka lagi sumber rujukan dan bandingkan alternatifnya.'),view:view(s,a.id)}}
 a.answers.push(q.id);
 if(a.stage===c.scenes.length&&c.questions.filter(q=>q.stage===a.stage).every(q=>a.answers.includes(q.id))){a.status='COMPLETED';a.completed=Date.now()}
 return {correct:true,feedback:q.explanation,view:view(s,a.id)}
 }
 if(b.action==='advance'){
 if(a.stage>=c.scenes.length)fail('Submit your final deductions to close the case.','Kirim deduksi akhir untuk menutup kasus.');
 if(!c.evidence.filter(e=>e.stage===a.stage).every(e=>a.inspected.includes(e.id)))fail('Inspect every item in the current scene.','Periksa semua bukti pada lokasi saat ini.');
 if(!c.questions.filter(q=>q.stage===a.stage).every(q=>a.answers.includes(q.id)))fail('Complete the current deduction checkpoints.','Selesaikan titik deduksi saat ini.');
 if(!c.characters.filter(ch=>ch.stage===a.stage).every(ch=>(a.dialogue[ch.id]||[]).length>0))fail('Interview the people available at this scene.','Wawancarai orang yang tersedia di lokasi ini.');
 if(c.tool&&a.stage===c.tool.stage&&(a.toolPanels?.[c.tool.kind]||[]).length<c.tool.panes.length)fail('Examine all four views in the investigation tool.','Periksa keempat tampilan pada alat investigasi.');
 if(c.id===24&&a.stage===c.scenes.length-1)requireFinalNetwork(s);
 a.stage++;return view(s,a.id)
 }
 fail('Unknown action.','Tindakan tidak dikenal.');
}
const json=(v,status=200,headers={})=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
export default {async fetch(req,env){const url=new URL(req.url);if(url.pathname==='/favicon.ico')return new Response(null,{status:204});if(url.pathname==='/control-room')return new Response(OWNER_HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'}});if(!url.pathname.startsWith('/api/'))return publicResponse(url);
 try {
 if(req.method==='POST'&&req.headers.get('Origin')&&req.headers.get('Origin')!==url.origin)fail('Request origin rejected.','Asal permintaan ditolak.',403);
 if(!env.DB)throw new Error('Database binding unavailable');
 if(url.pathname==='/api/owner')return ownerStats(req,env);
 if(url.pathname==='/api/owner-claim'&&!isOwner(req,env))fail('Owner access required.','Akses pemilik diperlukan.',403);
 let token=req.headers.get('Cookie')?.match(/(?:^|; )archive_id=([a-f0-9-]{36})(?:;|$)/)?.[1],cookie={},id;
 if(token){const session=await env.DB.prepare('SELECT investigator_id FROM player_sessions WHERE token=? AND expires_at>?').bind(token,Date.now()).first();if(session)id=session.investigator_id;else {const legacy=await env.DB.prepare('SELECT id FROM investigators WHERE id=?').bind(token).first();if(legacy)id=legacy.id}}
 if(!id){id=crypto.randomUUID();token=crypto.randomUUID();cookie=accountCookie(token,url);await env.DB.prepare('INSERT INTO investigators (id,state) VALUES (?,?)').bind(id,JSON.stringify(newState())).run();await env.DB.prepare('INSERT INTO player_sessions(token,investigator_id,expires_at) VALUES (?,?,?)').bind(token,id,Date.now()+31536000000).run()}
 if(url.pathname==='/api/owner-claim'){if(req.method!=='POST')fail('Method not allowed.','Metode tidak diizinkan.',405);const row=await env.DB.prepare('SELECT state FROM investigators WHERE id=?').bind(id).first();const s=JSON.parse(row.state);if(!s.name)fail('Open DEDUCE and create your investigator profile on this browser first.','Buka DEDUCE dan buat profil detektif kamu pada peramban ini dahulu.');const reserved=await env.DB.prepare('SELECT investigator_id FROM player_accounts WHERE username=?').bind('PEARL777').first();if(reserved&&reserved.investigator_id!==id)fail('PEARL777 is already linked to your other investigator. Sign in with PEARL777 to return to it.','PEARL777 sudah terhubung ke detektif kamu yang lain. Masuk dengan PEARL777 untuk kembali ke sana.',409);const current=await playerAccount(env.DB,id);if(current)await env.DB.prepare('UPDATE player_accounts SET username=? WHERE investigator_id=?').bind('PEARL777',id).run();else await env.DB.prepare('INSERT INTO player_accounts(username,investigator_id,created_at) VALUES (?,?,?)').bind('PEARL777',id,Date.now()).run();return json({username:'PEARL777',name:s.name},200,cookie)}
 if(url.pathname==='/api/presence'&&req.method==='GET'){await env.DB.prepare("UPDATE investigators SET last_seen=? WHERE id=? AND length(json_extract(state,'$.name'))>0 AND last_seen<?").bind(Date.now(),id,Date.now()-60000).run();return json({alive:true},200,cookie)}
 if(req.method==='GET'){const row=await env.DB.prepare('SELECT state,revision FROM investigators WHERE id=?').bind(id).first();const s=JSON.parse(row.state);if(s.name)await touchPlayer(env.DB,id);const account=await playerAccount(env.DB,id);return json(url.pathname==='/api/case'?view(s,url.searchParams.get('attempt')):{...publicState(s),username:account?.username||null},200,cookie)}
 if(req.method!=='POST')return json({error:pair('Method not allowed.','Metode tidak diizinkan.')},405,cookie);
 if(Number(req.headers.get('Content-Length')||0)>30000)fail('Request too large.','Permintaan terlalu besar.',413);
 const b=await req.json();
 if(b.action==='login'){await loginLimit(req,env.DB);const username=String(b.username||'').trim().toUpperCase();if(!/^[A-Z]{5}[0-9]{3}$/.test(username))fail('Enter your five letters and three digits.','Masukkan lima huruf serta tiga angka kamu.');const account=await env.DB.prepare('SELECT investigator_id FROM player_accounts WHERE username=?').bind(username).first();if(!account)fail('That player ID was not found. Check all eight characters.','ID pemain itu tidak ditemukan. Periksa kedelapan karakternya.',404);const next=crypto.randomUUID();await env.DB.prepare('INSERT INTO player_sessions(token,investigator_id,expires_at) VALUES (?,?,?)').bind(next,account.investigator_id,Date.now()+31536000000).run();await touchPlayer(env.DB,account.investigator_id);return json({signedIn:true},200,accountCookie(next,url))}
 if(b.action==='logout'){if(token)await env.DB.prepare('DELETE FROM player_sessions WHERE token=?').bind(token).run();return json({signedOut:true},200,{'Set-Cookie':`archive_id=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${url.protocol==='https:'?'; Secure':''}`})}
 if(b.action==='claimAccount'){const row=await env.DB.prepare('SELECT state FROM investigators WHERE id=?').bind(id).first();if(!JSON.parse(row.state).name)fail('Create your investigator profile first.','Buat profil detektif kamu dahulu.');return json({username:await createAccount(env.DB,id,String(b.prefix||'').trim().toUpperCase())},200,cookie)}
 if(b.action==='profile'&&!await playerAccount(env.DB,id)){if(!/^[A-Z]{5}$/.test(String(b.prefix||'').trim().toUpperCase()))fail('Choose exactly five letters for your player ID.','Pilih tepat lima huruf untuk ID pemain kamu.');}
 for(let i=0;i<8;i++){const row=await env.DB.prepare('SELECT state,revision FROM investigators WHERE id=?').bind(id).first();const s=JSON.parse(row.state);const result=run(s,b);const r=await env.DB.prepare('UPDATE investigators SET state=?,revision=revision+1,last_seen=? WHERE id=? AND revision=?').bind(JSON.stringify(s),Date.now(),id,row.revision).run();if(r.meta.changes){if(b.action==='profile'){const account=await playerAccount(env.DB,id);result.username=account?.username||await createAccount(env.DB,id,String(b.prefix).trim().toUpperCase())}if(b.action==='answer'&&result.view?.case.series&&result.view.attempt.status==='COMPLETED')result.network=networkView(s);return json(result,200,cookie)}}
 fail('Another tab updated your investigation. Please retry.','Tab lain memperbarui investigasi kamu. Coba lagi.',409)
 }catch(e){return json({error:e.translated||pair('The archive could not save this action. Please retry.','Arsip belum bisa menyimpan tindakan ini. Coba lagi.')},e.status||503)}}};
