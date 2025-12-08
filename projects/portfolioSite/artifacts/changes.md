# Changes (single-file)

> 各会話=1修正のアプローチ/ロジックを追記します。

## 目次

### 2025-12-07 GID=20251205__portfolio-site Turn=TBD — Work カードのフォーカス表示対応
- 目的: 背面のカードも選択して前面で読めるようにし、案件ごとの内容を確認しやすくする。
- 採用: (B) フォーカス中カード導入＋カード/ドットクリックで前面スライド（ホバー依存なし）。
- アプローチ: `Folder` に activeIndex 状態を追加し、カード/ドットのクリックでフォーカス更新。展開時の扇状計算をフォーカス中心に再計算し、スケール/リフト/不透明度で視認性を確保。z-index はインデックス式で固定し、成功事例の edgeAnchorOffset を維持。トークンにフォーカス/非フォーカスのパラメータと決定的 Z 基準を追加。
- 影響: UI/UX (Work セクション)。データ/契約/API 影響なし。
- 非退行: 端カードの内向き展開 (edgeAnchorOffset) を継続。ホバー起点の z-index 変動は採用せず、決定的順序のみ。
- ロールバック: `site/src/components/Folder.tsx` を前バージョンへ戻し、`folderMotion` のフォーカス関連トークンを削除すれば従来挙動に戻る。
- 検証: `npm run lint`（Next lint）で警告/エラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=TBD — Work カードのスクラブ切替追加
- 目的: 背面カードを素早く順送りで確認できるよう、ドット上のスクラブ操作でフォーカスを切替可能にする。
- 採用: ドット列上のマウス移動/ドラッグ/タッチ移動で activeIndex を更新するスクラブを追加（クリック動作は維持）。z-index は従来の決定的算出を継続。
- アプローチ: ドット列コンテナにスクラブ検出を集約し、X 位置からインデックスを計算して `activeIndex` を更新。`folderMotion` にスクラブ用ステップ幅とスロットル値を追加（最小限）。ホバーだけでも切替できるよう、mousedown なしで反応。
- 影響: UI/UX (Work セクション)。データ/契約/API 影響なし。
- 非退行: hover 起点の z-index 変更は行わない。edgeAnchorOffset 挙動を維持。
- ロールバック: スクラブ関連ハンドラとトークンを削除すれば、クリックのみのフォーカス切替に戻る。
- 検証: `npm run lint`（Next lint）で警告/エラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=TBD — ドットの選択中表示を強調
- 目的: 選択中のカードが一目で分かるよう、ドットのアクティブ状態をより視認しやすくする。
- 採用: アクティブドットをサイズアップ＋リング＋強いグローにし、非アクティブとの差を拡大。スクラブ/クリック挙動はそのまま。
- アプローチ: ドットの Tailwind クラスを更新し、active は `w-3 h-3 + ring + 強め shadow`、inactive はやや小さく透過。`aria-current` を付与してアクセシビリティも補強。
- 影響: UI/UX (Work セクション)。データ/契約/API 影響なし。
- 非退行: edgeAnchorOffset や決定的 z-index の方針を維持。スクラブ/クリック操作も変更なし。
- ロールバック: ドットのクラスを元に戻せば従来の表示に戻る。
- 検証: `npm run lint`（Next lint）で警告/エラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=TBD — カードクリックの段階挙動（前面化→詳細遷移）
- 目的: 非最前面カードをクリックしたときはまず前面化のみを行い、最前面のカードをクリックしたときに初めて詳細へ遷移する挙動にする。
- 採用: クリック時の処理を2段階に分離（フォーカス優先 → 同一カード再クリックで `onClick` 実行）。
- アプローチ: `Folder` の `handleCardClick` を改修し、未オープンまたは非アクティブカードは `focusCard` のみを実行。アクティブかつプロジェクトありの場合に限り `onClick(p)` を発火するよう分岐。
- 影響: UI/UX (Work セクション)。データ/契約/API 影響なし。
- 非退行: edgeAnchorOffset・決定的 z-index・スクラブ/ドット操作は従来通り維持。
- ロールバック: `handleCardClick` を元の一括遷移ロジックへ戻せば従来挙動に戻る。
- 検証: `npm run lint`（Next lint）で警告/エラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=20251207_112202__append-only-refactor — Append-only 移行と UI リファクタ
- 参照成功: 20251207_230500__work-card-scrub（決定的 z-index とスクラブ感度を維持）、20251207_231800__work-card-two-step（二段階クリックの安定挙動）。
- 参照失敗: 20251207_150500__work-card-overflow（hover 依存の z-index 変更で不安定化するため採用しない）。
- アプローチ: 旧 success/failure ディレクトリと workset を `migrate-append-only-history.mjs` で JSONL に統合し、`.migration_done` を発行して _archive に退避。`Folder.tsx` を決定的な変換関数に分割し、スクラブ/クリックの処理を `useCallback` で安定化。`ProjectDetailSheet.tsx` はメディアビルダーとギャラリー描画を分離し、Escape キー閉じと ARIA を追加。未使用依存 `framer-motion`/`clsx` を削除。
- 影響: ビルド/CI で append-only 検査を実行可能にし、UI/UX は既存挙動を維持しつつ可読性・安全性を向上。データ契約/API への影響なし。
- ロールバック: JSONL 統合を無効化する場合は `.migration_done` と history.* 追記を元に戻し、_archive から旧 success/failure を復帰。UI は `Folder.tsx` と `ProjectDetailSheet.tsx` を前バージョンへ戻す。
- 検証: `npm run lint`（Next lint）でエラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=20251207_114807__dock-navigation-lock — Dock クリック中のインジケータ揺れ抑止
- 参照成功: 20251207_230500__work-card-scrub（決定論的な state 更新でフリッカー防止）、20251207_231800__work-card-two-step（段階的な状態遷移で誤作動回避）。
- 参照失敗: 20251207_150500__work-card-overflow（途中状態への依存で不安定化した事例を踏まえ、スクロール途中の交差を無視するガードを採用）。
- 採用: Dock タブクリック時に `navigationTargetRef` で目標セクションをロックし、IntersectionObserver は pending ターゲットと一致したときだけ active に反映。フォールバックタイマー(2.5s)とアンマウント時のクリーンアップでロック固着を防止。
- アプローチ: `scrollTo` で pending をセット・timeout を更新し、observer コールバックは pending がある間スキップし目標ヒット時に解除。cleanup 用 `useEffect` を追加。state は `activeSection` の単一ソースを維持し、副作用は限定的に管理。
- 影響: UI/UX の安定化（Dock 選択インジケータが途中経過で揺れない）。データ/契約/API 影響なし。
- ロールバック: `navigationTargetRef` と timeout 管理を削除し、`handleSectionChange` を直接 `setActiveSection` に戻せば従来挙動に戻る。
- 検証: `npm run lint`（Next lint）で警告/エラーなし。

### 2025-12-07 GID=20251205__portfolio-site Turn=20251207_150000__profile-photo-avatar — About アバターを実写真対応
- 参照成功: 20251205_192700__postcss-explicit-config（アセットパスを明示して読込ミスを防いだ事例を踏襲）。
- 参照失敗: 20251207_150500__work-card-overflow（hover 由来の不安定さを避け、枠サイズ固定＋overflow hidden のみで表示）。
- 採用: `public/images/profile/portrait.jpg` を参照する `photo` フィールドを `Profile` 型に追加し、About セクションのアバターを `next/image` で実写真表示。未設定時は従来のアイコンをフォールバック。
- アプローチ: `Profile` に `photo` 型を追加して `profile.ts` でパス/alt/寸法を設定。`AboutSection` で `next/image` を使い、枠は固定サイズ＋`object-cover`＋overflow hidden、オンラインインジケータは維持。`public/images/profile/portrait.jpg` にプレースホルダを配置し、ユーザー写真に差し替え可能とした。`file-map.md` に新ディレクトリを追記。
- 影響: UI/UX（About セクションのビジュアル）。API/データ契約への影響なし。
- ロールバック: `profile.photo` を削除し、`AboutSection` の `Image` ブロックを元の `User` アイコン表示に戻す。
- 検証: 未実行（lint/テストは今回未実行）。
- 追記: `Image` を `fill`+`object-cover` に変更し、非正方形でも枠内で正方表示に補正。`favicon.ico` プレースホルダを配置して開発時の 404 を抑止。

### 2025-12-07 GID=20251205__portfolio-site Turn=20251207_170000__project-gallery-dir — プロジェクト詳細の画像ディレクトリ指定と自動リサイズ
- 参照成功: 20251207_150000__profile-photo-avatar（`next/image` で `fill`+`object-cover` を使い、差し替え可能なローカル画像運用を踏襲）。
- 参照失敗: 20251207_150500__work-card-overflow（決定的な並びとインデックスリセットを守り、ギャラリーのチラつきを防止）。
- 採用: 各プロジェクトに `galleryDir` を追加し、`public/images/<galleryDir>/` 配下の画像を自動列挙する API (`/api/project-gallery/[projectId]`) を新設。ディレクトリが空/不在の場合は既存の `gallery` 配列（外部 URL）をフォールバック。
- アプローチ: `Project` 型と `projects.ts` に `galleryDir` を定義しデフォルトを `projects/<id>` に設定。API は `dir` をサニタイズして `public/images` 配下のみ許可し、許可拡張子 (jpg/jpeg/png/webp/avif/svg) を名前昇順で返却。`ProjectDetailSheet` はフェッチ結果を優先しつつ `cache: 'no-store'` で即時反映し、データ切替時にスクロール/インデックスをリセット。`public/images/projects` 以下に各 ID 用ディレクトリと README を追加して配置手順を明示。
- 影響: データ/API（`galleryDir` 追加、列挙 API 追加）、UI/UX（ディレクトリ差し替えでギャラリー更新可能）。
- ロールバック: `galleryDir` を削除し API を参照しないようにし、`ProjectDetailSheet` のフェッチロジックを元の静的 `gallery` のみ参照に戻す。ディレクトリ/README は任意で削除可。
- 検証: `npm run lint`（Next lint）。

### 2025-12-08 GID=20251205__portfolio-site Turn=20251208_053547__nav-gallery-refactor — Dockナビ決定化とギャラリー取得の安定化リファクタ
- 参照成功: 20251207_114807__dock-navigation-lock（目標到達までロックする設計を踏襲）、20251207_170000__project-gallery-dir（APIフェッチ＋フォールバック設計を再利用）。
- 参照失敗: F-20251207_180329__debug-overlay-position-drift（不要な再適用で状態がドリフトする事例を避け、差分更新に限定）。
- アプローチ: `use-dock-navigation` を新設し、scrollTo と IntersectionObserver を一本化。pending ロック中は目標一致時のみ active を更新し、2.5s タイマーで固着を防止。`use-section-observer` は監視対象/threshold 可変＋最後の通知IDで冗長通知を抑制。`ProjectDetailSheet` に `useProjectGallery` を追加し、AbortController 付きでギャラリー取得をキャンセル安全にしつつ、フェール時は静的ギャラリーへフォールバック。スクロールインジケータは step 0 ガードと差分更新のみで安定化。
- 影響: UI/UX は不変（ナビ/シート挙動を安定化）。データ/API 変更なし（既存 API 利用のみ）。
- ロールバック: `use-dock-navigation` を削除して旧 `page.tsx` のローカル state/Observer に戻し、`ProjectDetailSheet` をフェッチ useEffect 方式へ戻せば元の挙動に復帰。
- 検証: `npm run lint`（Next lint）。

### 2025-12-08 GID=20251205__portfolio-site Turn=20251208_123000__portfolio-site-official-listing — ポートフォリオサイトを Official Site & Timeline に追加
- 参照成功: 20251207_135000__project-gallery-dir（ギャラリーが空でも安全にフォールバックする運用を踏襲）。
- 参照失敗: 20251207_150500__work-card-overflow（カード重なりを崩さないようレイアウト/アニメは一切変更しない）。
- アプローチ: `projects.ts` に `portfolio-site`（web）を追加し、タグライン/機能/技術スタック/`galleryDir`/`webUrl`(ルート) を定義。`timeline.ts` に公開エントリを追加し、`projectId` で詳細シートと連動。既存 UI ロジックは未変更でデータ差し替えのみ。
- 影響: コンテンツ追加のみ（Work の Official Site カテゴリと Journey のピルが1件増える）。仕様/API 変更なし。
- ロールバック: `projects.ts` の該当エントリと `timeline.ts` の1件を削除すれば元に戻る。
- 検証: `npm run lint`（Next lint）。

### 2025-12-08 GID=20251205__portfolio-site Turn=TBD — Hero Contact を About へのスクロールに変更
- 参照成功: 20251207_114807__dock-navigation-lock（scrollToSection で決定的に目標セクションへ移動する設計を踏襲）。
- 参照失敗: F-20251207_180329__debug-overlay-position-drift（不要な機能を残して状態がドリフトした事例を避け、メール起動の責務を About のみに集約）。
- 採用: Hero の Contact Me ボタンは `scrollToSection('about')` に変更し、メール送信は About セクションのメールアイコンだけに残す。ラベル/アイコンは現状維持。
- アプローチ: `page.tsx` で Hero 用のハンドラを `handleHeroContact` として分離し About 導線へ接続。メール起動は `handleContactEmail` に集約し About セクションへ渡す。scrollToSection を共有することで Dock/セクション間のナビ挙動を決定的に統一。
- 影響: UI/UX（Hero ボタン動作のみ変更）。データ/契約/API 変更なし。
- 検証: 未実行（動作はブラウザでのスクロール確認を想定）。

### 2025-12-08 GID=20251205__portfolio-site Turn=20251208_083928__timeline-palette-a — Timeline 配色を朝焼け→蒼のグラデ＋プラットフォーム別グラスに刷新
- 参照成功: 20251208_072112__timeline-platform-icons（プラットフォーム別の決定的なアイコン選択を維持）。
- 参照失敗: 20251207_150500__work-card-overflow（ホバー強調で不安定化した事例を避け、演出は色味中心に限定）。
- 採用: 縦ラインを朝焼け→蒼のグラデーションに変更し、アイコン気泡をプラットフォーム別のガラスグラデ＋カラーリング（app=サンセット、web=シーグラス、client=フォレスト、other=ラベンダー）に。年月バッジも同系の淡色に揃え、ロジックや動きは不変。
- アプローチ: `TimelineSection` 内にプラットフォーム別パレットを定義し、背景グラデ・リング・アイコン色・バッジ色をマッピング。縦ラインを 3px のグラデ線に差し替え、既存の hover スケールのみ維持して演出を抑制。
- 影響: UI/配色のみ。データ/ロジック/挙動変更なし。
- ロールバック: `timelinePalette` を削除し、気泡を白背景＋薄グレー縁、縦ラインを `bg-gradient-to-b from-transparent via-slate-300 to-transparent` へ戻す。
- 検証: 未実行（スタイル変更のみのため、後続でブラウザ目視を推奨）。

### 2025-12-08 GID=20251205__portfolio-site Turn=20251208_084442__timeline-bubble-white — アイコン気泡を白ベースに戻し色リングのみ残す
- 参照成功: 20251208_072112__timeline-platform-icons（プラットフォーム別の決定的なアイコン選択を維持）。
- 参照失敗: 20251207_150500__work-card-overflow（過剰な演出で不安定になる例を避け、色リングのみの静的演出に限定）。
- 採用: 気泡背景を全プラットフォームで白 (`bg-white` + `backdrop-blur-lg`) に戻し、リング/アイコン色/バッジ色だけをプラットフォーム別に残す。縦ラインの朝焼け→蒼グラデは継続。
- 影響: UI/配色のみ。データ/ロジック/挙動変更なし。
- ロールバック: `timelinePalette` の `bubbleClass` を各プラットフォームのカラーグラデに戻す。
- 検証: 未実行（スタイル変更のみ、ブラウザ目視推奨）。
