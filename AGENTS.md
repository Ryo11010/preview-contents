# agents.md — LLMエージェント運用契約（**Artifacts＋単一仕様書＋三つの履歴ファイル**／No‑Plan, No‑Code／会話=1修正／漏れゼロ／日本語徹底／git明示指示主義）

> **要点（TL;DR）**
>
> * 仕様は **`/artifacts/spec.md`** の**単一ファイル**で**追記更新**（常に最新）。
> * 履歴は **三つの“単一ファイル”**で**追記のみ**：
>
>   1. **`/artifacts/history.edits.jsonl`**（**単純な編集履歴**：会話=1修正の要約）
>   2. **`/artifacts/history.success.jsonl`**（**成功事例**のログ）
>   3. **`/artifacts/history.failures.jsonl`**（**失敗事例**のログ）
>      いずれも**追記のみ（過去は一切削除/改変しない）**。
> * **`/artifacts/changes.md`** には各修正の**アプローチ/ロジック詳細**を**追記**（読み物）。
> * **旧体制からの移行**は**初回編集時に必須**：過去の Workset 別ファイルを**三つの履歴ファイル＋spec.md**へ**完全マージ**し、旧履歴系を**削除/アーカイブ**。
> * **各会話=1修正**。毎回、**Plan（相談/承認）→実装→検証→評価直後の記録**。
> * 実装前に**必ず**成功/失敗事例を**参照**（毎回）。
> * **No‑Plan, No‑Code**：承認前は実装出力禁止。
> * **日本語徹底**。**ユーザー指示がない限り git 操作を行わない**（フック/CIでもブロック）。

---

## 0) 前提（解釈の明示）

* 履歴三種は**“管理の正本”**として **JSONL（1 行 1 レコード）**を採用（追記のみ検証が容易）。
* 既存の Workset/Turn 構成は**参照の手がかり**としては残し得ますが、**履歴の正本は三つの JSONL に一本化**します。
* `changes.md` は**詳細なロジックの読み物**として継続（要件に合致：**仕様=spec.md／履歴=3ファイル／詳細=changes.md**）。

---

## 1) 言語・git ポリシー

* **常に日本語で回答**（です/ます調）。他言語は**指示がある場合のみ**。
* **git 操作はユーザーが明示指示した回のみ**（`add/commit/push/pull/merge/rebase/tag` 等）。

  * 本書のフック/CIは **指示証跡（`git-approval.json`）がない push を拒否**します（§14, §15）。

---

## 2) ディレクトリ（核ファイルのみ抜粋）

```text
/artifacts/
  spec.md                       # 仕様（単一ファイル・追記）
  changes.md                    # 各修正のアプローチ/ロジック（追記）
  history.edits.jsonl           # 単純な編集履歴（追記のみ）
  history.success.jsonl         # 成功事例（追記のみ）
  history.failures.jsonl        # 失敗事例（追記のみ）
  file-map.md                   # ファイル一覧と役割（省略禁止）
  _timeline.md / _catalog.md / _index.json
  worksets/<GID>/...            # 現行 Workset（必要に応じ参照用）
  templates/                    # 各種テンプレートコード例
  _archive/ ...                 # 旧体制の退避先（移行時に使用）
scripts/
  bootstrap.mjs                 # 必要ファイルの自動生成（存在しなければ作成）
  update-gitignore.mjs          # .gitignore を“現行 GID のみ追跡”へ調整
  migrate-append-only-history.mjs # 旧体制から三履歴＋spec.md へマージ（初回必須）
  append-history.mjs            # 追記専用アペンダ（改変を禁止）
  check-history-append-only.mjs # 追記のみかを検査（差分に削除/書換が無いか）
  derive-index.mjs              # Timeline/Index の更新
  git-guard.mjs                 # 指示が無い git 操作の拒否
/mockup/                        # UI モックアップコード（参照専用・原則非編集・コードから直接参照しない）
````

---

## 3) .gitignore 方針（自動生成・自動調整）

* 原則：**`/artifacts` は ignore**。ただし**以下のみ追跡**：

  * `spec.md`, `changes.md`, `history.edits.jsonl`, `history.success.jsonl`, `history.failures.jsonl`
  * `file-map.md`, `_timeline.md`, `_catalog.md`, `_index.json`, `templates/`
  * **“現在の Workset（GID）”**配下のみ unignore（`scripts/update-gitignore.mjs --gid <GID>` で切替）。
* **自動生成**：`node scripts/bootstrap.mjs`（§12 手順 1）

**`.gitignore`（生成内容）抜粋**

```gitignore
# === base ===
.DS_Store
node_modules/
dist/
build/
coverage/
.env
*.log
# === artifacts policy ===
/artifacts/**
!/artifacts/spec.md
!/artifacts/changes.md
!/artifacts/history.edits.jsonl
!/artifacts/history.success.jsonl
!/artifacts/history.failures.jsonl
!/artifacts/file-map.md
!/artifacts/_timeline.md
!/artifacts/_catalog.md
!/artifacts/_index.json
!/artifacts/templates/
# 現行 GID は下記スクリプトで追加：
# scripts/update-gitignore.mjs --gid <GID>
```

### 3.1 初期動作の自動生成の対象（不足があれば必ず作成）

* (A) **CI**: `.github/workflows/artifacts-guard.yml`（§15 の YAML をそのまま使用。無ければ新規作成）
* (B) **PR テンプレート**: `.github/pull_request_template.md`（§16 のテンプレートをそのまま使用）
* (C) **Lint/Formatter/型検査**: スタックに応じた設定ファイルを作成（例：ESLint/Prettier、SwiftLint、ktlint、flake8/black、gofmt/staticcheck、rustfmt/clippy）
* (D) **コミット規約**: `.github/COMMIT_CONVENTION.md` に Conventional Commits の要点を記し、PR チェックで参照
* (E) **git 操作承認スタブ**: `artifacts/worksets/<GID>/meta/git-approval.json` を生成（下記の雛形）。このファイルが無い限り push は不可（§14/§15）

  ```json
  {
    "approvedOps": [],
    "expiresAt": "YYYY-MM-DDThh:mm:ssZ",
    "note": "ユーザーの明示指示に基づく git 操作のみ許可"
  }
  ```
* (G) **索引初期化**: `artifacts/_timeline.md` `artifacts/_index.json` `artifacts/_catalog.md` が無ければ空テンプレで作成

> ルール：**上書き禁止（冪等）**。既存の管理ファイルがある場合は**追記・統合**のみを行い、既存記述を消さない。

---

## 4) 仕様書と履歴の**単一ファイル運用（追記のみ）**

### 4.1 仕様書：`/artifacts/spec.md`

* **1ファイル**に**あらゆる仕様**（UI/機能/API/DB/設定/エラー/性能/セキュリティ/観測/CI）を集約。
* 変更があれば**追記/更新**し、**過去の節は削除しない**（“変遷”を本文で明示）。
* **初回移行時**に旧仕様＋現行コードを観察し**網羅版を作成**（§11, §13.2）。

### 4.2 履歴三種（**Append‑Only**）

* **`history.edits.jsonl`**（1 行 1 修正の**要約**）

  ```json
  {"ts":"2025-12-07T10:15:30Z","gid":"20251207_101530__checkout_refactor","turn":"T03",
   "title":"決済ハンドオフのタイムアウト改善","status":"success|failure|partial",
   "specImpact":false,"successRefs":["S-012"],"failureRefs":["F-021"],"by":"<actor>"}
  ```
* **`history.success.jsonl`**（成功事例）

  ```json
  {"ts":"2025-12-07T10:20:00Z","caseId":"S-012","ref":{"gid":"...","turn":"T03"},
   "summary":"idempotency + backoff で再送統制","reproduce":["..."],"tags":["retry","perf"]}
  ```
* **`history.failures.jsonl`**（失敗事例）

  ```json
  {"ts":"2025-12-07T10:22:00Z","caseId":"F-021","ref":{"gid":"...","turn":"T02"},
   "cause":"競合するタイマー再初期化","prevention":["構造化並行へ統一"],"summary":"...", "tags":["race"]}
  ```
* **禁止**：既存行の改変/削除。**許可**：**末尾への追記のみ**。
* フック/CI と `check-history-append-only.mjs` で**追記のみ**を強制（§14, §15）。

### 4.3 `changes.md`（読み物）

* 各会話=1修正の**アプローチ/ロジック**詳細を**追記**（要約ではなく具体）。
* `history.*.jsonl` が**台帳**、`changes.md` は**解説**という役割分担。

---

## 5) No‑Plan, No‑Code（実装前プラン）

* **Plan（相談/承認）**が **yes** になるまで、**/artifacts 以外の変更禁止**（pre‑commit が拒否）。
* Plan には**失敗/成功事例の参照（各 1 以上）**を**必ず**記載。
* Plan の選択肢は必ず **(A)(B)(C)** のように項目番号を付ける。

---

## 6) 成功/失敗の参照（毎回必須）

* 実装前に **`history.success.jsonl`** と **`history.failures.jsonl`** を**必ず参照**し、Plan と `changes.md` に**参照 ID**と**活用方法**を明記。
* 反応（レビュー/追加修正）に**評価**が含まれたら、**該当の history.*.jsonl に追記**（成功/失敗）。

---

## 8) file‑map.md（省略禁止・全列挙）

* **禁止**：`...`/`…`/`etc.`/`<snip>`/`省略`。
* 追加/削除/移動/役割変更は**同ターン内で更新**。CI が網羅 100% を検査。
* `/mockup` 配下も**全ファイルを列挙**し、役割欄に
  **「UI モックアップ参照専用（原則非編集・コードから直接参照しない）」** と明示する。

---

## 9) 出力スタイル／A‑B‑C

* 文章は**日本語**、コードは**全文**、差分は**最小パッチ**。
* 代替案は **`(A)(B)(C)`** を必ず付け、**採用案**を明示。

---

## 10) フルワークフロー（会話＝1修正）

1. **ブートストラップ**：`node scripts/bootstrap.mjs`（不足ファイルを**自動生成**。**管理系（§3.1）** — CI／PR テンプレ／Lint/Formatter/型検査／Commit 規約／`git-approval.json` スタブ など **も無ければ必ず作成**）

2. **初回なら移行**：`node scripts/migrate-append-only-history.mjs`（§11）

3. **GID 切替**：`node scripts/update-gitignore.mjs --gid <GID>`（現行 GID のみ追跡）

4. **Plan（相談/承認）**：成功/失敗参照、A/B/C、承認 yes

5. **実装**：最小パッチ＋全文、`file-map.md` 更新

6. **検証**：Lint/型/ユニット/統合/E2E/セキュリティ/複雑度/循環/重複

7. **評価直後に記録**：

   * `history.edits.jsonl` へ追記（要約）
   * `changes.md` へ追記（アプローチ/ロジック）
   * 仕様影響あり → `spec.md` 更新
   * 反応に評価あり → success/failure へ追記
   * `derive-index.mjs` で索引更新

8. **不要ファイル/フォルダの削除チェック（プレビュー/本番アップロード前）**

   * プレビュー環境/本番環境にアップロードされるディレクトリやパッケージ（例：`deploy/`・`dist/`・`build/` など）に、以下のような開発専用・ドキュメント専用パスが含まれていないかを確認する：

     * `/docs`
     * `/artifacts`
     * `gitgnore`
     * `agents.md`
     * `calude.md`
     * その他、プレビュー/本番環境では明らかに不要なファイル・フォルダ
       （例：ローカルスクリーンショット、設計メモ、巨大サンプルデータ、CI キャッシュ、カバレッジレポートなど）
   * 含まれていた場合は、**アップロード対象から即座に削除**する
     （または `.dockerignore`／デプロイ設定／ビルド設定などで確実に除外するパッチを提案する）。
   * リポジトリのルートに `gitgnore` や `calude.md` のような明らかに不要なファイルが残っている場合は、Plan 内で削除案（A/B/C）を提示し、承認後の実装として削除パッチを出す。
   * `agents.md` や `/artifacts` はリポジトリ管理上は必要だが、**プレビュー/本番の実行環境には原則アップロードしない**こと。

---

## 11) **旧 agents.md からの移行（初回必須・強制）**

> **目的**：Workset ごとに分散していた **編集履歴／成功事例／失敗事例**を、
> **三つの単一ファイル（history.*.jsonl）**に**追記のみ**で統合し、
> **仕様（spec.md）を現行コード観察＋旧資料統合で初期完全化**する。

### 11.1 対象

* 旧 `agents.md`、`/docs/*`、`/artifacts/worksets/*/meta/{logbook.md,outcomes.jsonl,plan.md,evaluation.md}`
* 旧 `/artifacts/success-cases/**`、`/artifacts/failure-cases/**`、`/artifacts/**/contracts/*`、`/docs/specification/*` など

### 11.2 手順（初回編集の**最初に必ず実行**）

1. **ブートストラップ**：`node scripts/bootstrap.mjs`
2. **統合**：`node scripts/migrate-append-only-history.mjs --commit "初回移行"`

   * 旧の Workset/Turn 情報を走査して

     * **編集履歴** → `history.edits.jsonl` に**追記**
     * **成功事例** → `history.success.jsonl` に**追記**
     * **失敗事例** → `history.failures.jsonl` に**追記**
   * 旧仕様/契約/ドキュメント/コード（API/SQL/型など）を収集し、**`spec.md` を章立てで**初期化（**網羅**）
3. **整合チェック**：`node scripts/check-history-append-only.mjs`（改変無しを確認）
4. **目視レビュー**：`spec.md` を人手で章整理/用語統一/重複除去（削除は不可、**上書きで“更新履歴付き”**に）
5. **旧ファイルの整理**：

   * 履歴系の旧フォルダは **`/artifacts/_archive/` へ移動**（または削除）。
   * 以後の履歴は**三つの JSONL**に**追記のみ**。
6. **フラグ設置**：`/artifacts/.migration_done` を出力。

   * フラグがないと pre‑commit が**すべての実装変更をブロック**（§14）。

> **注意**：本移行では**git の push/pull/merge は行いません**（ユーザー指示がある回のみ）。

---

## 12) 初期化・日常運用のコマンド

```bash
# 1) 初期生成（不足ファイルの自動生成）
node scripts/bootstrap.mjs

# 2) 初回のみ：旧体制から統合マージ（履歴3種＋spec 初期化）
node scripts/migrate-append-only-history.mjs --commit "初回移行"

# 3) GID の切替（現行 GID のみ追跡）
node scripts/update-gitignore.mjs --gid <GID>

# 4) インデックス再生成
node scripts/derive-index.mjs
```

---

## 13) スクリプト（全文／コピペ可）

### 13.1 `scripts/bootstrap.mjs`

```js
#!/usr/bin/env node
import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
const ensure=(p,c='')=>{ if(!existsSync(p)){ writeFileSync(p,c); console.log('created',p); } };

mkdirSync('artifacts',{recursive:true});
mkdirSync('artifacts/worksets',{recursive:true});
mkdirSync('artifacts/templates',{recursive:true});
mkdirSync('scripts',{recursive:true});

ensure('artifacts/spec.md', '# Specification (single-file)\n\n## 目次\n');
ensure('artifacts/changes.md','# Changes (single-file)\n\n## 目次\n');
ensure('artifacts/history.edits.jsonl','');
ensure('artifacts/history.success.jsonl','');
ensure('artifacts/history.failures.jsonl','');
ensure('artifacts/file-map.md','# file-map (Latest)\n\n## Tree\n<init>\n\n## File Roles\n- artifacts/file-map.md — 初期化\n');
ensure('artifacts/_timeline.md','# Timeline\n| ts | gid | turn | title | status |\n|---|---|---|---|---|\n');
ensure('artifacts/_catalog.md','# Catalog\n');
ensure('artifacts/_index.json','[]');

ensure('.gitignore',
`# base
.DS_Store
node_modules/
dist/
build/
coverage/
.env
*.log
# artifacts policy
/artifacts/**
!/artifacts/spec.md
!/artifacts/changes.md
!/artifacts/history.edits.jsonl
!/artifacts/history.success.jsonl
!/artifacts/history.failures.jsonl
!/artifacts/file-map.md
!/artifacts/_timeline.md
!/artifacts/_catalog.md
!/artifacts/_index.json
!/artifacts/templates/
# GID unignore will be appended by scripts/update-gitignore.mjs
`);
console.log('bootstrap done.');
```

### 13.2 `scripts/migrate-append-only-history.mjs`

```js
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
```

### 13.3 `scripts/update-gitignore.mjs`

```js
#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';
const gid = process.argv.find(a=>a.startsWith('--gid='))?.split('=')[1] || '';
if(!gid){ console.error('Usage: node scripts/update-gitignore.mjs --gid <GID>'); process.exit(1); }
const path='.gitignore'; let g=readFileSync(path,'utf8');
const marker='# Workset is unignored below';
const block = `\n${marker}\n!/artifacts/worksets/\n!/artifacts/worksets/${gid}/\n!/artifacts/worksets/${gid}/**\n`;
g = g.includes(marker) ? g.replace(new RegExp(`${marker}[\\s\\S]*$`), block) : g + block;
writeFileSync(path,g); console.log('updated .gitignore for GID', gid);
```

### 13.4 `scripts/append-history.mjs`

```js
#!/usr/bin/env node
import {appendFileSync} from 'node:fs';
const file = process.argv[2];
const json = process.argv.slice(3).join(' ');
try{ JSON.parse(json); }catch{ console.error('Invalid JSON'); process.exit(1); }
appendFileSync(file, json + '\n'); console.log('appended to', file);
```

### 13.5 `scripts/check-history-append-only.mjs`

```js
#!/usr/bin/env node
import {execSync} from 'node:child_process';

const files = [
  'artifacts/history.edits.jsonl',
  'artifacts/history.success.jsonl',
  'artifacts/history.failures.jsonl'
];

const base = process.env.GITHUB_BASE || 'HEAD~1';
const head = process.env.GITHUB_HEAD || 'HEAD';

for(const f of files){
  try{
    const diff = execSync(`git diff --unified=0 ${base}...${head} -- "${f}"`,{stdio:'pipe'}).toString();
    // 許容：追加(+)、末尾 newline のみ。禁止：削除(-)・置換・先頭/中間への挿入
    if(/^\-/.test(diff.replace(/^[^+\-]+/mg,''))){ // 何らかの '-' 行
      console.error('ERROR: append-only violated in', f); process.exit(1);
    }
  }catch(e){ /* no diff or file new */ }
}
console.log('append-only OK');
```

### 13.6 `scripts/derive-index.mjs`

```js
#!/usr/bin/env node
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
const edits = existsSync('artifacts/history.edits.jsonl') ? readFileSync('artifacts/history.edits.jsonl','utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l)) : [];
const rows = edits.map(e=>({ts:e.ts,gid:e.gid,turn:e.turn||'',title:e.title||'',status:e.status||''}));

let md = '# Timeline\n| ts | gid | turn | title | status |\n|---|---|---|---|---|\n';
for(const r of rows) md += `| ${r.ts||''} | ${r.gid||''} | ${r.turn||''} | ${r.title||''} | ${r.status||''} |\n`;
writeFileSync('artifacts/_timeline.md', md);
writeFileSync('artifacts/_index.json', JSON.stringify(rows,null,2));
console.log('index derived.');
```

---

## 14) Git フック（**ユーザー指示がない push を禁止**／**移行未完は実装禁止**）

**.git/hooks/commit-msg**

```bash
#!/usr/bin/env bash
set -euo pipefail
MSG="$1"
grep -Eq 'GID:\s*[0-9]{8}_[0-9]{6}__[-a-z0-9_]+' "$MSG" || { echo "GID が必要"; exit 1; }
grep -Eq 'Turn:\s*T[0-9]{2,3}' "$MSG" || { echo "Turn が必要"; exit 1; }
```

**.git/hooks/pre-commit**

```bash
#!/usr/bin/env bash
set -euo pipefail
# 初回移行が済んでいなければ実装禁止
if [ ! -f artifacts/.migration_done ]; then
  echo "初回移行未完：node scripts/migrate-append-only-history.mjs を先に実行してください。"; exit 1;
fi
# Plan 未承認なら /artifacts 以外を禁止（任意で導入）
# ...（既存の Plan チェックをここに）
```

**.git/hooks/pre-push**

```bash
#!/usr/bin/env bash
set -euo pipefail
APPROVAL=$(ls artifacts/worksets/*/meta/git-approval.json 2>/dev/null | head -1 || true)
if [[ -z "$APPROVAL" ]]; then
  echo "ユーザーの明示指示（git-approval.json）が無いため push を中止します。"; exit 1
fi
grep -q '"approvedOps": *\[[^]]*push' "$APPROVAL" || { echo "push は許可されていません"; exit 1; }
```

---

## 15) CI（Artifacts ガード）

```yaml
name: artifacts-guard
on: [pull_request]
jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Append-only history
        run: node scripts/check-history-append-only.mjs
      - name: Changes appended every PR
        run: test -f artifacts/changes.md && grep -q '^# ' artifacts/changes.md
      - name: Spec required when label 'spec-impact'
        if: contains(github.event.pull_request.labels.*.name, 'spec-impact')
        run: git diff --name-only HEAD~1 | grep -q 'artifacts/spec.md'
      - name: file-map no omissions
        run: '! grep -E "\\.\\.\\.|…|<snip>|etc\\.|省略" artifacts/file-map.md'
```

---

## 16) PR テンプレ

```md
## 概要
- 変更内容: …

## 必須チェック
- [ ] Plan 承認済み（yes）
- [ ] /artifacts/changes.md に追記（今回のアプローチ/ロジック）
- [ ] 仕様影響あり → /artifacts/spec.md を追記/更新（過去は残し“更新”で表現）
- [ ] /artifacts/history.edits.jsonl に追記（要約）
- [ ] 反応に評価あり → success/fail の JSONL に追記
- [ ] /artifacts/file-map.md 更新（省略なし）
- [ ] `.gitignore` は現行 GID のみ unignore（scripts/update-gitignore.mjs --gid <GID>）

## Git 操作
- この PR では **ユーザーの明示指示が無いため push/pull/merge は行っていません**。
```

---

## 17) チェックリスト（各会話=1修正）

* [ ] **日本語**で回答
* [ ] Plan：成功/失敗参照（各 1 以上）・A/B/C・承認 yes
* [ ] 実装：最小パッチ＋全文／`file-map.md` 更新
* [ ] 検証：Lint/型/ユニット/統合/E2E/セキュリティ/複雑度/循環/重複 PASS
* [ ] 記録：`history.edits.jsonl`／`changes.md` に追記
* [ ] 評価反映：成功/失敗 JSONL へ追記
* [ ] 仕様影響：`spec.md` を追記/更新
* [ ] `.gitignore`：現行 GID のみ unignore
* [ ] プレビュー/本番アップロード対象から、`/docs`・`/artifacts`・`gitgnore`・`agents.md`・`calude.md` などの不要ファイル/フォルダを削除または確実に除外

---

## 18) 仕様更新の基準（`spec.md` を更新する場合）

* (A) UI/機能の恒久仕様、(B) API/契約、(C) データ/DB、(D) 設定/Flag、(E) エラー/再試行、(F) 性能/SLO/SLI、(G) セキュリティ。
* **削除せず追記/更新**で“変遷”を残す（過去を消さない）。

---

## 19) マージ後の旧履歴の扱い

* 履歴の正本は **`history.*.jsonl` の三つのみ**。
* 旧 `success-cases/` `failure-cases/` は **`_archive/` へ移動**（または削除）。
* 以降、**追記先は常に三つの JSONL**。Workset/Turn は参照用に最小限維持可。

---

## 20) 例：追記コマンド

```bash
node scripts/append-history.mjs artifacts/history.edits.jsonl \
'{"ts":"2025-12-07T10:15:30Z","gid":"20251207_101530__checkout_refactor","turn":"T03","title":"決済ハンドオフ改善","status":"success","specImpact":false,"successRefs":["S-012"],"failureRefs":["F-021"]}'
```

---

## 21) `/mockup` ディレクトリの扱い（UI モックアップ参照専用）

* `/mockup` はリポジトリ直下に置かれる**UI モックアップコード専用フォルダ**であり、
  **基本的に編集しない・コードから直接参照しない・必要なときだけ参照する**ための領域とする。

* (A) **参照トリガ**

  * ユーザーが明示的に
    「`/mockup` を見て」「モックアップを参照して」「mockup 内のコードを参考にして」
    などと指示した場合にのみ、/mockup 配下のファイル内容を読む。
  * エージェント側から**自発的に `/mockup` 内コードを探索・参照しない**。

* (B) **編集禁止**

  * ユーザーが明示的に
    「`/mockup` を修正して」「モックアップ側も書き換えて」
    と指示した場合を除き、/mockup 配下のファイルを**一切変更しない**。
  * 提案パッチや PR 差分の対象にも、原則として `/mockup` 配下を含めない。

* (C) **コードからの直接参照禁止**

  * 本番コード／ライブラリ／テストコードから `/mockup` 配下を
    `import` / `require` / ビルド入力（bundler のエントリ）として使用しない。
  * `/mockup` はあくまで **人間が UI を検討するためのモックアップ・サンプルコード集** であり、
    ランタイム挙動やビルド成果物には関与させない。

* (D) **file-map への記載**

  * `file-map.md` では `/mockup` 以下の**全ファイルを省略なく列挙**し、役割欄に
    **「UI モックアップ参照専用（原則非編集・コードから直接参照しない）」**
    と明記する。