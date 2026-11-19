import assert from 'node:assert/strict';
import {C,NQ,run,newState,view,networkView} from '../worker/index.js';
const s=newState();assert.throws(()=>run(s,{action:'profile',name:'A'}));run(s,{action:'profile',name:'Morgan',language:'id'});
assert.equal(s.language,'id');
const first=run(s,{action:'start',caseId:1});const second=run(s,{action:'start',caseId:2});assert.throws(()=>run(s,{action:'start',caseId:3}),/desk is full/);
run(s,{action:'archive',attempt:second.attempt.id});const third=run(s,{action:'start',caseId:3});assert.throws(()=>run(s,{action:'start',caseId:2}),/desk is full/);run(s,{action:'archive',attempt:third.attempt.id});run(s,{action:'start',caseId:2});
assert.throws(()=>run(s,{action:'advance',attempt:first.attempt.id}),/Inspect/);
assert.throws(()=>run(s,{action:'inspect',attempt:first.attempt.id,evidence:'E01-10'}),/locked/);
assert.throws(()=>run(s,{action:'answer',attempt:first.attempt.id,question:C[0].questions.at(-1).id,option:0}),/locked/);
assert(!JSON.stringify(view(s,first.attempt.id)).includes('"answer":'));
for(const c of C){const p=newState();run(p,{action:'profile',name:'Detektif Arl',language:'id'});if(c.series)for(let id=19;id<c.id;id++)p.attempts.push({caseId:id,status:'COMPLETED'});if(c.id===24){for(let node=19;node<24;node++)run(p,{action:'networkReview',node});for(const q of NQ)run(p,{action:'networkAnswer',question:q.id,option:q.answer})}const v=run(p,{action:'start',caseId:c.id});const aid=v.attempt.id;
 for(const e of c.evidence){assert(e.body.en&&e.body.id&&e.title.en&&e.title.id);assert(e.stage<c.scenes.length)}
 assert.equal(c.evidence.length,[10,10,14,14,18,18,12,12,16,16,20,20,12,12,16,16,20,20,14,14,16,16,20,22][c.id-1]);assert.equal(c.scenes.length,[5,5,7,7,9,9,5,5,7,7,9,9,5,5,7,7,9,9,5,5,7,7,9,9][c.id-1]);assert(c.characters.length>=[4,4,5,5,6,6,4,4,5,5,6,6,4,4,5,5,6,6,4,4,5,5,6,6][c.id-1]);
 for(const q of c.questions){assert.equal(q.options.length,4);assert(q.answer>=0&&q.answer<4);assert(q.prompt.en&&q.prompt.id&&q.explanation.en&&q.explanation.id);assert.equal(new Set(q.options.map(o=>o.en)).size,4);for(const o of q.options)assert(o.en&&o.id);for(const ref of q.refs)assert(c.evidence.some(e=>e.id===ref&&e.stage<=q.stage))}
 for(let stage=0;stage<c.scenes.length;stage++){
  for(const e of c.evidence.filter(e=>e.stage===stage))run(p,{action:'inspect',attempt:aid,evidence:e.id});
  for(const ch of c.characters.filter(ch=>ch.stage===stage)){for(let i=0;i<4;i++){const r=run(p,{action:'interview',attempt:aid,character:ch.id,question:i});assert(r.characters.find(x=>x.id===ch.id).transcript.at(-1).response.id)}}
  for(const q of c.questions.filter(q=>q.stage===stage)){
   const before=view(p,aid).score;const bad=run(p,{action:'answer',attempt:aid,question:q.id,option:(q.answer+1)%4});assert.equal(bad.correct,false);assert(!bad.feedback.en.includes(q.options[q.answer].en));assert.equal(view(p,aid).score,Math.max(0,before-3));
   const res=run(p,{action:'answer',attempt:aid,question:q.id,option:q.answer});assert(res.correct)
  }
  if(c.tool&&stage===c.tool.stage){assert.throws(()=>run(p,{action:'advance',attempt:aid}),/four views/);for(let panel=0;panel<4;panel++)run(p,{action:'tool',attempt:aid,panel});assert.equal(view(p,aid).tool.visited.length,4);if(c.tool.kind==='choice'){run(p,{action:'tool',attempt:aid,panel:1,choice:2});assert.equal(view(p,aid).tool.responses[1],2)}}
  run(p,{action:'language',language:stage%2?'en':'id'});assert.equal(p.attempts.find(a=>a.id===aid).stage,stage);run(p,{action:'advance',attempt:aid});
 }
 for(const q of c.questions.filter(q=>q.stage===c.scenes.length)){
  assert.throws(()=>run(p,{action:'answer',attempt:aid,question:q.id,option:q.answer}),/Confirm/);
  run(p,{action:'answer',attempt:aid,question:q.id,option:q.answer,confirmed:true})
 }
 assert.equal(p.attempts.find(a=>a.id===aid).status,'COMPLETED');assert(view(p,aid).resolution.id);assert.equal(p.attempts.find(a=>a.id===aid).answers.length,c.questions.length);
 const fresh=run(p,{action:'start',caseId:c.id});assert.notEqual(fresh.attempt.id,aid);assert.equal(p.attempts.filter(a=>a.id).length,2);
 console.log('PASS case',c.id,'complete bilingual journey,',c.evidence.length,'evidence,',c.questions.length,'questions');
}
// Hints are charged only for new levels, and survive state serialization.
const q=C[0].questions[0];run(s,{action:'inspect',attempt:first.attempt.id,evidence:q.refs[0]});for(let i=0;i<4;i++)run(s,{action:'hint',attempt:first.attempt.id,question:q.id});assert.equal(s.attempts[0].hints.length,2);const restored=JSON.parse(JSON.stringify(s));assert.equal(view(restored,first.attempt.id).attempt.hints.length,2);
assert.equal(C.length,24);
for(const c of C.filter(c=>c.volume>=2)){assert(c.tool);for(const ref of c.tool.refs)assert(c.evidence.some(e=>e.id===ref&&e.stage<=c.tool.stage));const p=newState();run(p,{action:'profile',name:'Morgan'});if(c.series)for(let id=19;id<c.id;id++)p.attempts.push({caseId:id,status:'COMPLETED'});if(c.id===24){for(let node=19;node<24;node++)run(p,{action:'networkReview',node});for(const q of NQ)run(p,{action:'networkAnswer',question:q.id,option:q.answer})}const v=run(p,{action:'start',caseId:c.id});assert.equal(v.tool,null);assert.throws(()=>run(p,{action:'tool',attempt:v.attempt.id,panel:0}),/locked/);assert.equal(v.case.volume,c.volume)}
console.log('PASS active limits, archive/resume, replay isolation, anti-skip, payload secrecy, validation, hint persistence');

for(let d=0;d<3;d++)assert.equal(C.filter(c=>c.difficulty===d).length,8);
function localizedCheck(v){if(Array.isArray(v))v.forEach(localizedCheck);else if(v&&typeof v==='object'){if('en' in v){assert.equal(typeof v.en,'string');assert.equal(typeof v.id,'string');assert(!/\banda\b/i.test(v.id),'Forbidden Indonesian player pronoun');}Object.values(v).forEach(localizedCheck)}}localizedCheck(C);
console.log('PASS 24 bilingual cases, balanced difficulties, unique options and kamu-only Indonesian content');
