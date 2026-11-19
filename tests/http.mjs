import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';import worker from '../worker/index.js';
const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync('drizzle/0000_archive.sql','utf8'));sqlite.exec(readFileSync('drizzle/0001_player_accounts.sql','utf8'));
const pause=()=>new Promise(r=>setImmediate(r));
const DB={prepare(sql){let v=[];return {bind(...values){v=values;return this},async first(){await pause();return sqlite.prepare(sql).get(...v)},async run(){await pause();const r=sqlite.prepare(sql).run(...v);return {meta:{changes:Number(r.changes)}}}}}};
let cookie='';async function request(action,data={},method='POST'){const r=await worker.fetch(new Request('https://archive.test/api/'+(method==='GET'?'profile':'action'),{method,headers:{Cookie:cookie,Origin:'https://archive.test','Content-Type':'application/json'},...(method==='POST'?{body:JSON.stringify({action,...data})}:{})}),{DB});if(r.headers.has('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return {status:r.status,body:await r.json()}}
await request('',{},'GET');await request('profile',{name:'Morgan',language:'en',prefix:'MORGN'});
const starts=await Promise.all([1,7,13].map(caseId=>request('start',{caseId})));assert.equal(starts.filter(r=>r.status===200).length,2);assert.equal(starts.filter(r=>r.status===409).length,1);
const p=await request('',{},'GET');assert.equal(p.body.attempts.filter(a=>a.status==='ACTIVE').length,2);const original=p.body.attempts[0];
const saved=await request('notes',{attempt:original.id,notes:'Verified chronology'});assert.equal(saved.status,200);
const restored=await request('',{},'GET');assert.equal(restored.body.attempts[0].notes,'Verified chronology');
const secondCookie=cookie;cookie='';const anon=await request('',{},'GET');assert.equal(anon.body.attempts.length,0);const forbidden=await request('notes',{attempt:original.id,notes:'attack'});assert.notEqual(forbidden.status,200);cookie=secondCookie;
const cross=await worker.fetch(new Request('https://archive.test/api/action',{method:'POST',headers:{Cookie:cookie,Origin:'https://other.test'},body:'{}'}),{DB});assert.equal(cross.status,403);
console.log('PASS D1 compare-and-swap concurrent two-case enforcement, saved-state restoration, identity isolation, origin validation');
