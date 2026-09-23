# 樂衍月兔出任務

2026 中秋互動賀卡。45 秒三線跑道，手機／桌機可玩；免登入、不收集個人資料。

- 原創月兔主視覺、樂衍正式 Logo 與品牌色。
- 月餅、星星、守護盾；隕石只減速。
- 切換分頁自動暫停；重玩、本機最高分、預設靜音。
- 1080×1440 PNG 成績賀卡，含可掃描遊戲 QR Code。
- Web Share、複製網址、LINE 分享與不支援瀏覽器的備用流程。
- 自架所有圖片與 QR 程式，不依賴執行期 CDN。

## 本機

`npm ci` 然後 `npm start`，開啟 http://localhost:4183 。
`npm test` 執行邏輯及真實 QR 解碼回歸測試。

## 發布

公開頁面 https://zloojesse.github.io/leyan-moon-rabbit/

GitHub Pages 使用 gh-pages 分支根目錄。更新：

```sh
git add public
git commit -m 'Update game'
git push origin main
git subtree split --prefix public -b pages-next
git push origin pages-next:gh-pages
```

更換網域時，更新 index.html 的 OG URL／圖片網址；分享連結與圖卡 QR 依瀏覽器目前正式網址自動生成。

## 美術

fal-ai/gpt-image-2，Text-to-Image，1024×1024，high；繁體中文提示詞見 docs/art-request.json。
主視覺生成：2026-09-23。品牌 Logo 由樂衍既有品牌素材提供。
QR 使用 qrcode-generator (MIT)，授權在 public/vendor/QR-README.md。

## 驗收

核心邏輯與 QR 解碼 11 項測試通過；Chrome 實際一局完成、圖卡生成、左右移動與結算已驗證。手機尺寸以瀏覽器 viewport 模擬檢查；iOS／Android 原生分享選單需實機確認。
