# まなび図鑑 Web

Android `manabi_zukan` の Web 版です。

## 開発

```bash
npm install
npm run sync   # zukan.json と ill_*.png を Android からコピー
npm run dev
```

## 本番ビルド

```bash
npm run sync
npm run build
```

`vercel.json` ではビルド時に `sync` を実行します（リポジトリに画像が無い場合、ビルドマシン上で Android ソースが必要です。通常は `public/assets` をコミットするか、CI で同期します）。
