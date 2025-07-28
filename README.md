# DevContainer Terminal Paste

VS Code 拡張機能：Mac のクリップボードから画像を DevContainer のワークスペースに貼り付けます。

## 機能

- VS Code ターミナルで `Cmd+V` を押すと、クリップボードの画像をワークスペースに保存
- 画像がない場合は通常のテキスト貼り付けを実行
- 保存後、ターミナルに相対パスを自動入力
- 保存先ディレクトリとファイル名パターンをカスタマイズ可能
- 複数の画像形式に対応（PNG, JPG, JPEG, GIF, BMP, TIFF, WebP）
- ファイルからコピーした画像とスクリーンショットの両方に対応

## 使い方

1. 画像をクリップボードにコピー（スクリーンショット等）
2. VS Code ターミナルにフォーカス
3. `Cmd+V` を押す
4. 画像がワークスペースに保存され、パスがターミナルに表示される

## 設定

設定から以下の項目をカスタマイズできます：

- `clipboardImagePaste.saveDir`: 画像保存ディレクトリ（デフォルト: `images`）
- `clipboardImagePaste.fileNamePattern`: ファイル名パターン（デフォルト: `clipboard-{timestamp}.png`）
  - `{timestamp}` は現在時刻に置換されます

## 技術詳細

- macOS の `osascript` と AppleScript を使用してクリップボード画像を取得
- `extensionKind: ["ui", "workspace"]` により、UI 側でクリップボード処理を実行
- VS Code の `workspace.fs` API を使用してファイルを保存
- ファイルURLと画像データの両方のクリップボード形式に対応
- 一時ファイルは保存後に自動削除

## 依存関係

- macOS のみ対応（AppleScript を使用するため）
- VS Code 1.74.0 以上
- 追加の CLI ツールは不要

## 制限事項

- macOS 専用（Windows/Linux では動作しません）
- DevContainer 環境での使用を想定
- ワークスペースフォルダが開かれている必要があります