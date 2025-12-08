#!/usr/bin/env node
import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, appendFileSync, renameSync} from 'node:fs';
import {join} from 'node:path';

const OUT_EDITS   = 'artifacts/history.edits.jsonl';
const OUT_SUCC    = 'artifacts/history.success.jsonl';
const OUT_FAIL    = 'artifacts/history.failures.jsonl';
const SPEC        = 'artifacts/spec.md';

function ap(s){ appendFileSync(s.file, s.line + '\n'); }

function init(){
  if(!existsSync('artifacts')) mkdirSync('artifacts',{recursive:true});
  ['history.edits.jsonl','history.success.jsonl','history.failures.jsonl','spec.md']
    .forEach(f=>{ if(!existsSync('artifacts/'+f)) writeFileSync('artifacts/'+f,''); });
}

function migrateFromWorksets(){
  const root='artifacts/worksets'; if(!existsSync(root)) return;
  for(const gid of readdirSync(root)){
    const meta = join(root,gid,'meta');
    // outcomes.jsonl -> edits
    const outcomes = join(meta,'outcomes.jsonl');
    if(existsSync(outcomes)){
      for(const line of readFileSync(outcomes,'utf8').split('\n').filter(Boolean)){
        try{
          const j=JSON.parse(line);
          const rec = {
            ts: new Date().toISOString(),
            gid, turn: j.turn||null, title: j.title||null,
            status: j.status||'pending', specImpact: !!j.specImpact, by: j.by||null
          };
          ap({file:OUT_EDITS, line: JSON.stringify(rec)});
        }catch{}
      }
    }
    // success/failure cases → success/fail
    const succRoot = 'artifacts/success-cases';
    const failRoot = 'artifacts/failure-cases';
    if(existsSync(succRoot)){
      for(const d of readdirSync(succRoot)){
        const p = join(succRoot,d);
        const readme = join(p,'README.md');
        if(existsSync(readme)){
          const rec = {
            ts: new Date().toISOString(),
            caseId: d.replace(/[^\w\-]/g,''),
            ref: {gid},
            summary: readFileSync(readme,'utf8').slice(0,2000),
            reproduce: [], tags:[]
          };
          ap({file:OUT_SUCC, line: JSON.stringify(rec)});
        }
      }
    }
    if(existsSync(failRoot)){
      for(const d of readdirSync(failRoot)){
        const p = join(failRoot,d);
        const readme = join(p,'README.md');
        if(existsSync(readme)){
          const rec = {
            ts: new Date().toISOString(),
            caseId: d.replace(/[^\w\-]/g,''),
            ref: {gid},
            cause: "migrated",
            prevention: [],
            summary: readFileSync(readme,'utf8').slice(0,2000),
            tags:[]
          };
          ap({file:OUT_FAIL, line: JSON.stringify(rec)});
        }
      }
    }
    // plan/evaluation → edits 補完
    const plan = join(meta,'plan.md'); if(existsSync(plan)){
      ap({file:OUT_EDITS, line: JSON.stringify({
        ts:new Date().toISOString(), gid, turn:null, title:`plan:${gid}`,
        status:"pending", specImpact:false, note:"migrated plan"
      })});
    }
    const evalmd = join(meta,'evaluation.md'); if(existsSync(evalmd)){
      ap({file:OUT_EDITS, line: JSON.stringify({
        ts:new Date().toISOString(), gid, turn:null, title:`evaluation:${gid}`,
        status:"info", specImpact:false, note:"migrated evaluation"
      })});
    }
  }
}

function migrateDocsToSpec(){
  // 旧 agents.md / docs / contracts を spec に統合（追記）
  if(existsSync('agents.md')){
    const t=readFileSync('agents.md','utf8');
    appendFileSync(SPEC, `\n\n## 旧 agents.md の要点\n${t.slice(0,4000)}\n`);
  }
  if(existsSync('docs')){
    for(const f of readdirSync('docs',{withFileTypes:true})){
      if(f.isFile() && f.name.endsWith('.md')){
        appendFileSync(SPEC, `\n\n## docs/${f.name}\n${readFileSync(join('docs',f.name),'utf8')}\n`);
      }
    }
  }
  // 契約類
  const root='artifacts';
  const walk=(dir)=>{
    if(!existsSync(dir)) return;
    for(const e of readdirSync(dir,{withFileTypes:true})){
      const p=join(dir,e.name);
      if(e.isDirectory()) walk(p);
      else if(e.isFile()){
        if(/(openapi|schema|\.sql|\.yaml|\.yml)$/i.test(e.name) || /contracts/.test(dir)){
          appendFileSync(SPEC, `\n\n## ${p}\n\`\`\`\n${readFileSync(p,'utf8').slice(0,6000)}\n\`\`\`\n`);
        }
      }
    }
  };
  walk('artifacts');
}

function archiveLegacy(){
  if(!existsSync('artifacts/_archive')) mkdirSync('artifacts/_archive',{recursive:true});
  for(const d of ['success-cases','failure-cases']){
    if(existsSync(`artifacts/${d}`)) renameSync(`artifacts/${d}`, `artifacts/_archive/${d}`);
  }
  // Workset 内の meta/logbook などは残してよい（参照用）: 必要なら個別に整理
}

function main(){
  init();
  migrateFromWorksets();
  migrateDocsToSpec();
  archiveLegacy();
  writeFileSync('artifacts/.migration_done', new Date().toISOString());
  console.log('migration completed. Append-only history initialized.');
}
main();
