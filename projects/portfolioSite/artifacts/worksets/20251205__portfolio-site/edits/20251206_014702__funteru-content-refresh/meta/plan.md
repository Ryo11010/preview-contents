# Plan — Edit 20251206_014702__funteru-content-refresh

## 背景 / 目的
- `/site/src/data/*.ts` のコンテンツがモックのままなので、公式サイト `funteru.co.jp` に掲載されている会社情報に差し替え、実在のプロフィール/事業/沿革/連絡先を反映させる。
- 既存のデータドリブン構造（`profile.ts`, `projects.ts`, `timeline.ts`, `config/site.ts` 等）を維持し、UI コンポーネントにハードコードを持ち込まずにコピーのみを更新する。
- 会社情報を可能な限り拾い出し、Hero/Work/Timeline/About セクションやメタデータが一貫した内容になるよう整理する。

## 参照 (Fail-Avoid / Success-Reuse)
- Failure 事例: /artifacts に未登録のため該当なし（ハードコード混入・3+1欠落を特に警戒）。
- Success 事例:
  - 20251205_192700__postcss-explicit-config — 設定を明示してビルド崩れを解消した例。設定/データの集約と明示的指定を踏襲。
  - 20251205_142847__app-debt-burndown — 型付きデータ辞書とガードで UI の安定性を確保。今回も data/config で完結させる。
  - 20251204_230100__app-native-ready — 外部リンク/メール送信をユーティリティに集約。新しい連絡先も utils 経由で扱う。
  - 20251204_214311__app-hardening — セクション分割とトークン集約で可読性を維持。コピー追加時もトークン/データ側に寄せる。

## agents.md 重要ポイント（抜粋）
- ハードコード絶対禁止（章15）：URL/メール/閾値/文言をロジックに直書きせず、設定・定数・文言ファイルへ集約。
- A/B/C 方式で代替案提示と採用案明示（章4/5）。3+1（before/after/diff/meta）と `file-map.md` 更新は必須。
- 命名規則と500行ルール（章13/14）：英語で役割明確、1ファイル500行未満、マジックナンバー排除。
- Webデバッグ方針（章10）：コンソール禁止・オーバーレイ前提（今回はコピー差し替えのみで新規ログを追加しない）。

## 代替案 (A/B/C)
- (A) 公式サイトから会社概要/事業/沿革/問い合わせ情報を収集し、既存の `profile.ts`, `projects.ts`, `timeline.ts`, `config/site.ts`, `config/tokens.ts`（Hero コピー等）にデータとして反映。UI ロジックは変更しない。  
  Pros: データドリブンを維持し変更範囲が限定。Cons: 情報収集に時間がかかる。リスク: 低。
- (B) コンテンツを JSON 化し別ストレージに分離して読み込む形に刷新。  
  Pros: 運用変更に強い。Cons: 実装コスト増・読み込み経路が増えリスク中。リスク: 中。
- (C) Hero/プロフィールのみ最低限差し替え、他はモックのまま残す。  
  Pros: 工数最小。Cons: 情報の不整合が残り UX/信頼性を損なう。リスク: 中。

### 採用案
- **(A) を採用。** 現行のデータ分離設計を活かしつつ、最小変更で実内容を反映できるため。

## 影響範囲
- データ/設定: `site/src/data/profile.ts`, `projects.ts`, `timeline.ts`, `navigation.ts`（必要ならカテゴリ文言）、`site/src/config/site.ts`, `site/src/config/tokens.ts`（Hero コピー等）。
- メタデータ: `layout.tsx` 経由で参照されるサイトタイトル/description/OGP。
- UI: セクションの文言が変わるのみでレイアウト/ロジックは変えない。

## テスト計画
- 自動: `npm run lint`（環境が許せば）。コピー差し替えのみだが lint で差分を検証。
- 手動: `npm run dev` で起動し、Hero/Work/Timeline/About の表示が崩れていないこと、外部リンク/メールが正しい URL/アドレスに飛ぶことを目視確認。
- 実行不可の際は meta/evaluation に理由を記録。

## ハードコードに関する計画
- 取得した会社名/住所/事業/沿革/問い合わせ先/リンクはすべて `config/site.ts` または `data/*.ts` にのみ記載し、コンポーネント側へ直接リテラルを埋め込まない。
- 新規 URL/メール/電話番号は `profile.socials` などデータオブジェクトに集約。`openExternalLink`/`openMailLink` ヘルパー経由で利用。
- しきい値/数値は既存トークンを流用し、新規マジックナンバーを追加しない。

## ロールバック方針
- `data/` と `config/` の変更に限定するため、Git で当該ファイルをリバートすればモック状態に戻せる。3+1 の before/after を保存して差分単位で復旧可能。

## 相談・承認
- status: yes
- approver: user
- time: 2025-12-06T02:25:00Z
- memo: ユーザーより「yes」を受領し、funteru.co.jp の情報取得許可を得たため実装着手。
