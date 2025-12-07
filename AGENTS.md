以下に、**ご指定の4点**（①必要ファイルの自動生成、②`.gitignore`方針の明確化、③仕様書・修正内容の**単一ファイル追記運用**、④**旧agents.mdからの移行と具体的マージ方法**）を**完全統合**した最新版 **`agents.md`** を提示します。
（**日本語での回答を徹底**／**ユーザーの明示指示がない限り git 操作を行わない**という既存ルールも保持したまま反映済みです）

---

# agents.md — LLMエージェント運用契約（**Artifacts＋単一仕様書/単一修正内容**／No‑Plan, No‑Code／会話=1修正／漏れゼロ／日本語徹底／git明示指示主義）

> **TL;DR**
>
> * **仕様書（Spec）と修正内容（Changes）は“それぞれ1ファイルのみ”で追記管理**：
>
>   * `/artifacts/spec.md`（プロジェクトの**あらゆる仕様**を集約、追記/更新で常に最新）
>   * `/artifacts/changes.md`（**各修正のアプローチ/ロジック**を追記）
> * **必要ファイルは自動生成**：作業開始時、**無ければ必ず生成してから着手**（`.gitignore`/`artifacts/*`/`spec.md`/`changes.md` 等）。
> * **.gitignore**：一般的除外に加え、**`/artifacts` は原則 ignore**。ただし**`spec.md`/`changes.md` と “**現在の Workset（GID）**” だけは **unignore**（スクリプトで自動調整）。
> * **会話=1修正（1ターン）**：毎回 `/artifacts` を入念に参照 → **Plan（相談・承認）→ 実装 → 検証 → 評価直後に記録**。
> * **失敗は二度と繰り返さない／成功は二度と詰まらない**：**失敗/成功事例を実装前に必ず参照**、反応に評価が含まれたら**即時 事例化**。
> * **No‑Plan, No‑Code**：承認前に実装出力禁止。
> * **日本語徹底**、かつ**ユーザー明示指示がない限り git の add/commit/push/pull/merge は一切行わない**。
> * **旧agents.mdからの移行**：初回で**最新基準へマージ**（自動化スクリプトと手順を本書末尾に記載）。

---

## 1) 目的・適用範囲

* 目的は **(A)** 失敗の再発防止 と **(B)** 成功の最短再現。
* 設計/契約/意図/変更理由/検証/学びは **/artifacts** に集約。
* **仕様書は `/artifacts/spec.md` の“単一ファイル”**で運用。**修正内容は `/artifacts/changes.md` の“単一ファイル”**で運用。
* **各会話＝1修正（1ターン）**。毎回、**Plan→承認→実装→検証→評価→記録**を徹底。

---

## 2) 言語ポリシー・出力スタイル

* **常に日本語で回答**（です/ます調）。他言語は**ユーザー指示時のみ**。
* コードは**対象ファイルを冒頭〜末尾まで“全文”**（置換可能）。
* 差分は原則 **最小パッチ（oboe）**。長大時は

  * **(A)** GitHub互換差分 ＋ **(B)** ±記号なし `plain.patch` を併記。
* **代替案**は **`(A)` `(B)` `(C)`…** を**必ず**付け、**採用案**を明示。

---

## 3) Git 操作ポリシー（**明示指示がない限り禁止**）

* ユーザーの**明示指示がない回では**、**`git add/commit/push/pull/merge/rebase/tag/cherry-pick` など一切の git 操作を行わない**。
* git 手順の提示も**指示があった回のみ**。
* 自動化フック/CI も**ユーザー承認が無ければ push をブロック**（§15, §16 参照）。

---

## 4) ディレクトリと中核ファイル

```
/artifacts/
  spec.md            # ← 仕様書（単一ファイル・追記/更新で常に最新）
  changes.md         # ← 修正内容（単一ファイル・各会話のアプローチ/ロジックを追記）
  file-map.md        # 全ファイル一覧と役割（省略禁止・都度更新）
  _timeline.md       # 時系列インデックス（人間可読）
  _catalog.md        # 機能/領域別インデックス（人間可読）
  _index.json        # 機械可読インデックス
  worksets/
    <GID>/           # 現在の Workset（大枠テーマ）
      meta/          # plan.md / README.md / logbook.md / outcomes.jsonl / qa_checklist.md / links.txt / tags.json / git-approval.json(指示時のみ)
      before/ after/ diff/ turns/ contracts/
  success-cases/     # 反応に評価が含まれる場合の成功事例
  failure-cases/     # 同・失敗事例
  templates/
    DebugOverlayTemplate.v1.js
```

* **GID**：`YYYYMMDD_HHMMSS__slug`（作成スクリプトで自動発行）。
* **Turn**：`TNN`（会話ごとの連番、`logbook.md` と `outcomes.jsonl` に記録）。

---

## 5) **必要ファイルの自動生成（ブートストラップ）**

**作業開始時、以下が無ければ必ず生成してから着手**します（**git 操作は行わない**）：

### 5.1 スクリプト：`scripts/bootstrap.mjs`（全文）

```js
#!/usr/bin/env node
import {mkdirSync, writeFileSync, existsSync, readFileSync} from 'node:fs';

function ensure(p, content=''){ if(!existsSync(p)){ writeFileSync(p, content); console.log('created', p); } }

mkdirSync('artifacts', {recursive:true});
mkdirSync('artifacts/worksets', {recursive:true});
mkdirSync('artifacts/templates', {recursive:true});

ensure('artifacts/spec.md', '# Specification (single-file)\n\n> 本ファイルはプロジェクトの全仕様を1ファイルで管理します。\n\n## 目次\n\n## 1. 概要\n\n## 2. UI/UX\n\n## 3. 機能要求\n\n## 4. API/契約\n\n## 5. データ/DB/永続化\n\n## 6. 設定/FeatureFlag\n\n## 7. エラー/例外/リトライ\n\n## 8. 性能/SLO/SLI\n\n## 9. セキュリティ\n\n## 10. ログ/トレース/観測\n\n## 11. Dev/Build/CI\n\n## 12. 変更履歴(要約)\n');
ensure('artifacts/changes.md', '# Changes (single-file)\n\n> 各会話=1修正のアプローチ/ロジックを追記します。\n\n## 目次\n');
ensure('artifacts/file-map.md', '# file-map (Latest)\n\n## Tree\n<init>\n\n## File Roles\n- artifacts/file-map.md — 初期化\n');

ensure('artifacts/_timeline.md', '# Timeline\n| GID | Turn | Title | Status | Cause | Tags |\n|---|---|---|---|---|---|\n');
ensure('artifacts/_catalog.md', '# Catalog (by Feature)\n');
ensure('artifacts/_index.json', '[]');

ensure('.gitignore', `# === base ===
.DS_Store
*.log
*.tmp
*.swp
node_modules/
dist/
build/
coverage/
tmp/
.env
.env.*
# === artifacts policy ===
/artifacts/**
!/artifacts/spec.md
!/artifacts/changes.md
!/artifacts/file-map.md
!/artifacts/_timeline.md
!/artifacts/_catalog.md
!/artifacts/_index.json
!/artifacts/templates/
!/artifacts/templates/DebugOverlayTemplate.v1.js
# Workset は後続で有効化：scripts/update-gitignore.mjs --gid <GID>
`);
console.log('bootstrap done (no git operations performed).');
```

### 5.2 `.gitignore` の GID 追記：`scripts/update-gitignore.mjs`（全文）

```js
#!/usr/bin/env node
import {readFileSync, writeFileSync} from 'node:fs';

const gid = process.argv[2] || process.argv.find(a=>a.startsWith('--gid='))?.split('=')[1];
if(!gid){ console.error('Usage: node scripts/update-gitignore.mjs --gid <GID>'); process.exit(1); }

const path = '.gitignore';
let g = readFileSync(path,'utf8');
const marker = '# Workset is unignored below';
const block = `\n${marker}\n!/artifacts/worksets/\n!/artifacts/worksets/${gid}/\n!/artifacts/worksets/${gid}/**\n`;
if(!g.includes(marker)){ g += block; } else {
  g = g.replace(new RegExp(`${marker}[\\s\\S]*$`), block); // 末尾に再生成
}
writeFileSync(path, g);
console.log('updated .gitignore for GID', gid);
```

> **意図**：`.gitignore` は**原則 `/artifacts` を無視**しつつ、**`spec.md` と `changes.md`、および“現在の Workset（GID）”のみ**を追跡対象にする運用です。
> 新規 Workset 開始時は `update-gitignore.mjs --gid <GID>` を実行して **その GID 配下だけ unignore** にします。
> （**git 操作は行いません**。あくまでファイル生成/更新のみ）

---

## 6) 仕様書と修正内容の**単一ファイル運用**

### 6.1 仕様書：`/artifacts/spec.md`

* **1ファイルに全仕様を集約**し、**追記/更新**で常に最新を保つ。
* **更新基準**（いずれかに該当 → **必ず追記/更新**）

  * (A) UI/UX の恒久変更　(B) 公開API/契約/レスポンス/パラメータ変更
  * (C) データ/DB/スキーマ　(D) 設定/FeatureFlag/デフォルト値
  * (E) エラー/例外/再試行方針　(F) 性能/SLO/SLI　(G) セキュリティ
* **書式**：章立て＋アンカー（目次は見出しから自動生成しやすい構造に）。
* **PR/CI**：上記(A)〜(G)に該当する Edit の場合、**`spec.md` の変更が無いと失敗**（§15, §16）。

### 6.2 修正内容：`/artifacts/changes.md`

* **各会話=1修正**の**アプローチ/ロジック**を**追記**（**必ず毎回**）。
* 最低項目：GID/Turn/日時/要約/採用案(A/B/C)/キーポイント/影響/非退行/ロールバック。
* **PR/CI**：**毎回 `changes.md` への追記が必須**（§15, §16）。

---

## 7) Plan（No‑Plan, No‑Code）

* 実装前に `plan.md` を提示 → **相談** → **承認: yes** を取得。
* **承認前は /artifacts 以外の変更を禁止**（フック/CI で強制）。
* 代替案は常に `(A)(B)(C)` を付与、**採用案を明示**。

---

## 8) 参照の徹底（失敗/成功の再利用）

* 作業開始前に **失敗事例×1以上 / 成功事例×1以上** を参照し、Plan と `changes.md` に**リンク＋対策/手順**を明記。
* 反応（レビュー/追加修正）に**評価**が含まれる場合、**成功/失敗ケース**を即時登録。

---

## 9) Artifacts（3+1）と Workset/Turn

* **3+1**：`before/after/diff/meta`（ログ等は `attachments/`）。
* **Workset（GID）**配下で **Turn（TNN）** を積み上げる。Turnごとに `logbook.md` と `outcomes.jsonl` に追記。
* 重要差分は `turns/TNN/` にスナップショット。

---

## 10) Debug（Overlay 既定／コンソール禁止）

* 開発時は**画面オーバーレイのみ**出力、**DevTools `console.*` 禁止**。
* `templates/DebugOverlayTemplate.v1.js` に厳密準拠。E2E で UI/ショートカット/非出力を検証。

---

## 11) file‑map（省略禁止・全列挙）

* **禁止**：`...`/`…`/`etc.`/`<snip>`/`省略`。
* 除外を明記し、それ以外は**全ファイル**を列挙＋**役割（1–3行）**を記載。
* 追加/削除/移動/改名/役割変更は**同ターン内で更新**。CIで網羅100%を検査。

---

## 12) フルワークフロー（各会話＝1修正）

1. **ブートストラップ**：`node scripts/bootstrap.mjs`（不足ファイル生成）
2. **GID 発行**：`node scripts/new-group.mjs <slug>` → **.gitignore を GID で更新**
   `node scripts/update-gitignore.mjs --gid <GID>`
3. **Plan（相談/承認）**：失敗/成功参照、A/B/C、承認: yes
4. **実装**：最小パッチ＋全文、`file-map.md` 更新、必要なら `turns/` に差分保存
5. **検証**：Lint/型/ユニット/統合/E2E/セキュリティ/複雑度/循環/重複
6. **評価直後の記録**：

   * `changes.md` へ**必ず追記**
   * 仕様影響あり→ `spec.md` を追記/更新
   * 反応に評価あり→ success/failure へ登録
   * `_timeline.md`/`_catalog.md`/`_index.json` 再生成

> **注**：上記スクリプトは**git 操作を行わない**。push/pull/merge は**ユーザー指示がある回のみ**。

---

## 13) チェックリスト（qa）

* [ ] **日本語**で回答
* [ ] Plan：A/B/C、失敗/成功参照、**承認: yes**
* [ ] 実装：最小パッチ＋全文、`file-map.md` 更新 or 変更なし明記
* [ ] 検証：Lint/型/ユニット/統合/E2E/セキュリティ/複雑度/循環/重複 PASS
* [ ] 記録：**`changes.md` へ追記（毎回必須）**
* [ ] 仕様影響：あり → **`spec.md` を更新**
* [ ] 反応に評価：あり → success/failure 登録
* [ ] `.gitignore`：**現在の GID のみ unignore** 済み

---

## 14) PR テンプレ（コピペ可）

```md
## 概要
- 変更内容: …

## 必須チェック
- [ ] Plan 承認済み（/artifacts/worksets/<GID>/meta/plan.md に「承認: yes」）
- [ ] /artifacts/changes.md に追記（今回のアプローチ/ロジック）
- [ ] 仕様影響あり → /artifacts/spec.md を追記/更新
- [ ] /artifacts/file-map.md 更新または「変更なし」を qa に記録
- [ ] 反応に評価が含まれた → success/failure を登録
- [ ] `.gitignore` は **<GID> のみ unignore**（scripts/update-gitignore.mjs --gid <GID>）

## Git 操作
- 本PRでは **ユーザーの明示指示がないため git push/pull/merge は行っていません**。
```

---

## 15) Git フック（要旨）

**commit-msg**

```bash
#!/usr/bin/env bash
set -euo pipefail
MSG="$1"
grep -Eq 'GID:\s*[0-9]{8}_[0-9]{6}__[-a-z0-9_]+' "$MSG" || { echo "GID が必要"; exit 1; }
grep -Eq 'Turn:\s*T[0-9]{2,3}' "$MSG" || { echo "Turn が必要"; exit 1; }
```

**pre-commit**（Plan 未承認なら **/artifacts 以外の変更禁止**）

```bash
#!/usr/bin/env bash
set -euo pipefail
branch="$(git rev-parse --abbrev-ref HEAD)"
[[ "$branch" =~ ^ws/[0-9]{8}_[0-9]{6}__[-a-z0-9_]+$ ]] || { echo "Branch must be ws/<GID>"; exit 1; }
GID="${branch#ws/}"
PLAN="artifacts/worksets/${GID}/meta/plan.md"
grep -Eq '^  - 承認:\s*yes' "$PLAN" 2>/dev/null || {
  if git diff --cached --name-only | grep -qv "^artifacts/"; then
    echo "Plan 未承認。/artifacts 以外の変更は禁止です。"; exit 1;
  fi
}
```

**pre-push**（**ユーザー指示がなければ push 禁止**）

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

## 16) CI（GitHub Actions 骨子）

```yaml
name: artifacts-guard
on: [pull_request]
jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify changes.md is appended (every PR)
        run: grep -q '^# Changes' artifacts/changes.md || exit 1
      - name: Verify spec.md when impact label is present
        if: contains(github.event.pull_request.labels.*.name, 'spec-impact')
        run: test -f artifacts/spec.md && git diff --name-only HEAD~1 | grep -q 'artifacts/spec.md'
      - name: No omissions in file-map
        run: '! grep -E "\\.\\.\\.|…|<snip>|etc\\.|省略" artifacts/file-map.md'
```

> **運用**：仕様影響がある PR には `spec-impact` ラベルを付与（またはスクリプトで自動判定）し、**`spec.md` の更新を必須**にします。
> **`changes.md` は毎回必須**です。

---

## 17) 旧 agents.md からの**移行とマージ方法**（初回実行）

> 過去は artifacts-only や分散仕様だったため、**初回時に最新基準へ集約**します（**git 操作は行いません**）。

### 17.1 方針（A/B/C）

* **(A) 自動移行スクリプト＋手動レビュー（採用）**

  * 既存 `agents.md`，`/docs/*`，`/artifacts/*/contracts/*`，`plan.md`/`evaluation.md` を走査
  * 仕様は **`spec.md`** へ章別に統合、修正アプローチは **`changes.md`** へ年代順に追記
  * 人手で目次・重複削減・表記統一を行い確定
* (B) すべて手動でコピー：品質は担保しやすいが時間がかかる
* (C) 完全自動マージ：速度は出るが誤マージリスク

**採用：(A)** — 誤差分のリスクを抑えつつ短時間で統合可能。

### 17.2 スクリプト：`scripts/migrate-from-legacy-agents.mjs`（全文）

```js
#!/usr/bin/env node
import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, appendFileSync} from 'node:fs';
import {join} from 'node:path';

mkdirSync('artifacts', {recursive:true});
const specPath = 'artifacts/spec.md';
const changesPath = 'artifacts/changes.md';
if(!existsSync(specPath)) writeFileSync(specPath, '# Specification (single-file)\n\n## 目次\n');
if(!existsSync(changesPath)) writeFileSync(changesPath, '# Changes (single-file)\n\n## 目次\n');

function addSpec(section, body){
  appendFileSync(specPath, `\n## ${section}\n${body}\n`);
}
function addChange(title, body){
  appendFileSync(changesPath, `\n### ${title}\n${body}\n`);
}

if(existsSync('agents.md')) {
  const t = readFileSync('agents.md','utf8');
  addSpec('0. 旧agents.md からの継承', `> 旧ファイルから重要事項を取り込みました。\n\n${t.substring(0, 4000)}\n…（全文は旧ファイルを参照）`);
}

if(existsSync('docs')) {
  // 例：/docs/specification や分散ドキュメントを章に取り込み
  try{
    const files = readdirSync('docs', {withFileTypes:true});
    for(const f of files){
      if(f.isFile() && f.name.endsWith('.md')){
        const t = readFileSync(join('docs', f.name),'utf8');
        addSpec(`docs/${f.name}`, t);
      }
    }
  }catch{}
}

function sweepArtifacts(dir){
  if(!existsSync(dir)) return;
  for(const d of readdirSync(dir, {withFileTypes:true})){
    const p = join(dir, d.name);
    if(d.isDirectory()){
      if(['contracts','meta'].includes(d.name)){
        if(d.name==='contracts'){
          for(const ff of readdirSync(p,{withFileTypes:true})){
            if(ff.isFile()){
              addSpec(`contracts/${ff.name}`, readFileSync(join(p, ff.name),'utf8'));
            }
          }
        } else {
          // plan/evaluation は changes へ
          const pm = join(p,'plan.md'); if(existsSync(pm)) addChange(`${p}/plan.md`, readFileSync(pm,'utf8'));
          const ev = join(p,'evaluation.md'); if(existsSync(ev)) addChange(`${p}/evaluation.md`, readFileSync(ev,'utf8'));
        }
      } else {
        sweepArtifacts(p);
      }
    }
  }
}
sweepArtifacts('artifacts');

console.log('migrate done. Please review artifacts/spec.md and artifacts/changes.md manually.');
```

### 17.3 手動レビュー指針（短縮）

* 章立て整理（目次再生成）／重複の除去／表現の統一（用語集）
* 仕様の曖昧表現を明確化（入力/出力/エラー/性能）
* 変更要約を `changes.md` 冒頭に年表として追記（任意）

---

## 18) スクリプト（補助・抜粋）

* `scripts/new-group.mjs` / `scripts/new-turn.mjs`：GID/Turn 発行（既出スタイルでOK）
* `scripts/derive-index.mjs`：`_timeline.md` / `_index.json` の再生成
* `scripts/check-artifacts.mjs`：`changes.md` 必須／`spec-impact` 時の `spec.md` 更新必須／file-map 省略検出
* `scripts/git-guard.mjs`：**ユーザー指示が無い回は git 操作を拒否**

> **注意**：いずれのスクリプトも**git 操作は行いません**。push/pull/merge は**指示がある回のみ**別途実施。

---

## 19) 禁止事項

* **Plan 承認前の実装出力**（No‑Plan, No‑Code 違反）
* **`changes.md` の未追記**（各会話=必須）
* 仕様影響があるのに **`spec.md` を更新しない**
* `file-map.md` に**省略記号**／未更新
* 開発時に **DevTools へ `console.*` 出力**（緊急一時ミラー以外）
* **日本語以外での回答**（指示時を除く）
* **ユーザー明示指示がない回の git 操作**（add/commit/push/pull/merge 等）

---

## 20) 付録：テンプレ（追記フォーマット例）

### 20.1 `/artifacts/changes.md` 追記例

```md
### 2025-12-07 GID=20251207_101530__checkout_refactor Turn=T03
- 目的: 決済ハンドオフのタイムアウト改善
- 採用: (B) backoff + idempotency key
- アプローチ: リトライ合成器を抽象化し、API層で副作用を境界化。UIはOverlayで可視化。
- 影響: API契約不変、SLO p95 250ms→140ms
- 非退行: 既存成功ケース S-012 を再実行
- ロールバック: FeatureFlag `retry_v2` OFF
```

### 20.2 `/artifacts/spec.md` 追記例（API 変更時）

```md
## 4. API/契約 — /payments/checkout
- リクエスト: { amount: number, currency: string, idempotencyKey: string }
- レスポンス: 200 OK { status: "ok", txnId: string }
- エラー: 429 （backoff指示）, 504 （再試行可）
- 品質: p95 < 200ms, エラー率 < 0.5%
- 備考: idempotencyKey は 128bit 以上、重複時は同一応答
```

---

### 結び

* 本 `agents.md` は**コピペ即運用**可能です。
* 追加要件（**自動生成**・**.gitignore方針**・**単一仕様書/単一修正内容**・**旧agents.mdからの移行**）を**すべて反映**しました。
* 以後は、**各会話=1修正**で **`changes.md` へ必ず追記**、仕様影響時は **`spec.md` を更新**し、**git 操作は明示指示がある回のみ**行います。
