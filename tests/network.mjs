import assert from 'node:assert/strict';
import {C,NQ,run,newState,view,networkView} from '../worker/index.js';
const s=newState();run(s,{action:'profile',name:'Network Detective'});
assert.throws(()=>run(s,{action:'start',caseId:20}),/preceding/);
assert.equal(networkView(s).nodes.filter(n=>n.unlocked).length,0);
assert(!JSON.stringify(networkView(s)).includes('L7N042'));
const a=run(s,{action:'start',caseId:19}).attempt;run(s,{action:'archive',attempt:a.id});assert.throws(()=>run(s,{action:'start',caseId:20}),/preceding/);
for(const c of C.filter(c=>c.series)){
 const aid=run(s,{action:'start',caseId:c.id}).attempt.id;
 for(let stage=0;stage<c.scenes.length;stage++){
  for(const e of c.evidence.filter(e=>e.stage===stage))run(s,{action:'inspect',attempt:aid,evidence:e.id});
  for(const ch of c.characters.filter(ch=>ch.stage===stage))run(s,{action:'interview',attempt:aid,character:ch.id,question:0});
  for(const q of c.questions.filter(q=>q.stage===stage))run(s,{action:'answer',attempt:aid,question:q.id,option:q.answer});
  if(c.tool?.stage===stage)for(let panel=0;panel<4;panel++)run(s,{action:'tool',attempt:aid,panel});
  if(c.id===24&&stage===c.scenes.length-1){assert.throws(()=>run(s,{action:'advance',attempt:aid}),/Review all five/);for(let node=19;node<24;node++)run(s,{action:'networkReview',node});assert.throws(()=>run(s,{action:'advance',attempt:aid}),/four cross/);for(const q of NQ){const prior=networkView(s).questions.find(x=>x.id===q.id);assert.equal(prior.explanation,null);assert(!('answer' in prior));run(s,{action:'networkAnswer',question:q.id,option:(q.answer+1)%4});run(s,{action:'networkAnswer',question:q.id,option:q.answer})}}
  run(s,{action:'advance',attempt:aid});
 }
 const finals=c.questions.filter(q=>q.stage===c.scenes.length);
 if(c.id===24)assert.throws(()=>run(s,{action:'answer',attempt:aid,question:finals[1].id,option:finals[1].answer,confirmed:true}),/in order/);
 for(const q of finals)run(s,{action:'answer',attempt:aid,question:q.id,option:q.answer,confirmed:true});
 assert.equal(view(s,aid).attempt.status,'COMPLETED');assert.equal(networkView(s).nodes.filter(n=>n.unlocked).length,c.episode);
 if(c.id===20){run(s,{action:'networkHypothesis',from:19,to:20,status:'SUSPECTED'});run(s,{action:'networkHypothesis',from:19,to:20,status:'DISPROVEN'})}
}
const restored=JSON.parse(JSON.stringify(s)),n=networkView(restored);assert(n.declassified);assert.equal(n.hypotheses.length,2);assert.equal(n.journal.length,16);assert.equal(n.correct,12);assert.equal(n.errors,4);assert.equal(n.score,75);assert.equal(n.nodes[5].records.length,3);
console.log('PASS all six sequential journeys, archive lock, progressive intelligence secrecy, five-node review and cross-challenge finale gates, ordered finale, immutable theory history, persistence and network score');
