import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';import {C,NQ,run,newState,view,networkView} from '../worker/index.js';
const source=readFileSync('worker/page.html','utf8').split('<script>')[1].split('</script>')[0];
const boot=source.lastIndexOf('\n(async()=>');assert(boot>0);
const ctx=vm.createContext({localStorage:{getItem:()=>null},document:{addEventListener:()=>{}},window:{addEventListener:()=>{}},console,Date,setTimeout,clearTimeout});vm.runInContext(source.slice(0,boot),ctx);
for(const c of C){const state=newState();run(state,{action:'profile',name:'Test Investigator'});if(c.series)for(let id=19;id<c.id;id++)state.attempts.push({id:'fixture-'+id,caseId:id,status:'COMPLETED',stage:C.find(c=>c.id===id).scenes.length,inspected:[],answers:[],hints:[],submissions:0,errors:0,pins:[],links:[]});const a=run(state,{action:'start',caseId:c.id}).attempt;
 if(c.tool){for(let stage=0;stage<=c.tool.stage;stage++){
  for(const e of c.evidence.filter(e=>e.stage===stage))run(state,{action:'inspect',attempt:a.id,evidence:e.id});
  for(const ch of c.characters.filter(ch=>ch.stage===stage))run(state,{action:'interview',attempt:a.id,character:ch.id,question:0});
  for(const q of c.questions.filter(q=>q.stage===stage))run(state,{action:'answer',attempt:a.id,question:q.id,option:q.answer});
  if(stage<c.tool.stage){if(c.tool.stage===stage)for(let panel=0;panel<4;panel++)run(state,{action:'tool',attempt:a.id,panel});run(state,{action:'advance',attempt:a.id})}
 }for(let panel=0;panel<4;panel++)run(state,{action:'tool',attempt:a.id,panel})}
 ctx.data=view(state,a.id);ctx.publicProfile={...state,network:networkView(state),cases:C.map(c=>({unlocked:true,series:c.series,episode:c.episode,id:c.id,title:c.title,kind:c.kind,brief:c.brief,setting:c.setting,volume:c.volume,difficulty:c.difficulty,evidenceCount:c.evidence.length,questionCount:c.questions.length}))};
 for(const language of ['en','id']){ctx.language=language;vm.runInContext('current=data;profile=publicProfile;lang=language',ctx);const page=vm.runInContext('workspace()',ctx);assert(page.includes('class="scene-main"'));assert(!page.includes('undefined'),'No undefined in rendered workspace for '+c.id);if(c.tool){const html=vm.runInContext('caseTool()',ctx);assert(html.includes(c.tool.title[language]));assert.equal((html.match(/data-tool-panel=/g)||[]).length,4);assert(!/\banda\b/i.test(html));}
 const card=vm.runInContext('detail('+c.id+')',ctx);assert(card.includes(String(c.id).padStart(3,'0')));assert(!card.includes('undefined'));}
}
for(const language of ['en','id']){ctx.language=language;vm.runInContext('lang=language;selectedVolume=3;selectedFilter=-1',ctx);const catalogue=vm.runInContext('cards()',ctx);assert.equal((catalogue.match(/class="case-card"/g)||[]).length,6);assert(catalogue.includes(language==='en'?'The Unseen Patterns':'Pola yang Tak Terlihat'));}
console.log('PASS all 24 localized workspace/detail renders, 18 instrument UIs, Volume III filtering and case numbering');

for(const language of ["en","id"]){ctx.language=language;vm.runInContext("lang=language",ctx);for(const name of ["hollowPage","networkPage"]){const html=vm.runInContext(name+"()",ctx);assert(!html.includes("undefined"),name);assert(!/\banda\b/i.test(html))}}
console.log("PASS Hollow Network folder and localized intelligence board renders");
ctx.fullNetwork=networkView({attempts:C.filter(c=>c.series).map(c=>({caseId:c.id,status:'COMPLETED'})),network:{reviewed:[19,20,21,22,23,24],hypotheses:[],verified:NQ.map(q=>q.id),journal:NQ.map(q=>({question:q.id,prompt:q.prompt,selected:q.options[q.answer],correct:true,refs:q.refs,domain:q.domain}))}});
for(const language of ['en','id']){ctx.language=language;vm.runInContext('lang=language;profile.network=fullNetwork',ctx);const html=vm.runInContext('networkPage()',ctx);assert(!html.includes('undefined'));assert(html.includes('L7N042'));assert(html.includes('Celia Rook'));assert(html.includes(language==='en'?'Network Declassification Report'.toUpperCase():'LAPORAN DEKLASIFIKASI JARINGAN'));}
console.log('PASS complete localized declassification report, canonical code, identities and scoring UI');
