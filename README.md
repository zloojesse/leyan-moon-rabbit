# 樂衍月兔出任務

2026 中秋互動賀卡。45 秒三線跑道，手機／桌機可玩；免登入、不收集個人資料。

- 原創月兔主視覺、樂衍正式 Logo 與品牌色。
- 月餅、星星、守護盾；隕石只減速。
- 切換分頁自動暫停；重玩、本機最高分、預設靜音。
- 1080×1440 PNG 中秋賀卡：6 款不同插畫與祝福、4 種依成績變化的稱號，放大樂衍祝福，不含 QR Code。
- Web Share、複製網址、LINE 分享與不支援瀏覽器的備用流程。
- 前六局每局解鎖一款未收集圖卡；集滿後隨機，重複卡保留最高分版本。
- 我的圖鑑可重看與下載；收藏存在這台裝置，清除瀏覽器資料會重置。
- 電腦版結算卡自然長高，不使用內部捲軸；手機控制鈕保留安全空間。
- 自架所有圖片，不依賴執行期 CDN。

## 本機

`npm ci` 然後 `npm start`，開啟 http://localhost:4183 。
`npm test` 執行遊戲邏輯回歸測試。

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

更換網域時，更新 index.html 的 OG URL／圖片網址；分享連結依瀏覽器目前正式網址自動生成。

## 美術

fal-ai/gpt-image-2，Text-to-Image，1024×1024，high；繁體中文提示詞見 docs/art-request.json。
主視覺生成：2026-09-23。品牌 Logo 由樂衍既有品牌素材提供。


## 驗收

遊戲與收藏邏輯共 16 項測試通過（初版 QR 已依需求移除）；Chrome 實際一局完成、圖卡生成、左右移動與結算已驗證。手機尺寸以瀏覽器 viewport 模擬檢查；iOS／Android 原生分享選單需實機確認。

## 六款插畫

月光啟程／桂月茶敘／星河快遞／雲海望月／月宮烘焙／滿月團圓。
新增五張使用 fal-ai/gpt-image-2/edit，參考自有原始月兔視覺，1024×1024、high；完整繁中提示詞與參數見 docs/collection-art/*-request.json。
