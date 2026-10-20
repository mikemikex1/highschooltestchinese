# FINAL RELEASE CLOSEOUT AUDIT

驗證範圍：目前工作區的開發版、dist/國文學測30課_完整離線包/國文學測30課_離線版.html、PDF 與 ZIP。
驗證原則：本輪只讀取、靜態掃描與瀏覽器 runtime 驗證；未修改教材、答案、解析、UI 架構或 quiz 資料。

# Overall

**FINAL RELEASE FAIL**

原因：開發版 index.html 的 JS-disabled fallback 只有索引與提示文字，沒有 30 課主要教材；離線 HTML 有完整 noscript 課程內容。因此 JS-disabled parity 與 Dev/Offline parity 不能判定為 PASS。

# Core

|項目|目前驗證結果|
|---|---:|
|lesson|30|
|real|147|
|rendered unique real cards|148（目前 release gate 的既有計數；lessonData 的 147 筆 real data 均存在）|
|views|258|

離線資料掃描確認 30 個 lesson、147 個 real question IDs，且 real IDs unique count = 147。指定的 15 篇 canonical core texts 均存在；supplement A 的 text records 總數為 17，另含兩筆補充文本。

# Supplement

|項目|結果|
|---|---|
|A|PASS：可由 sidebar/hash 進入，內容非空。|
|B characters|220|
|C|PASS：可由 sidebar/hash 進入，內容非空。|
|D knowledge|65|
|E cram|35；required answer 35/35；pronunciation required 16，present 16/16|
|15 texts|指定 15 篇均存在；總 text records = 17（含額外補充文本）。|

瀏覽器 runtime 直接載入 supplement-a-view-01 至 supplement-e-view-01 均得到一個非空主內容 root；切回 lesson-15-view-01 後 supplement panel 卸載，主內容 root 回到 lesson。

# Placeholder

目前教材資料與離線 HTML 掃描下列字串均為 0 命中：

必背1、必背2、字詞A、TODO、TBD、待補、Lorem、example1、test1。

HTML input 的 placeholder 屬正常搜尋 UI 屬性，不計入教材 placeholder。placeholder count = **0**。

# Duplicate

|範圍|結果|
|---|---:|
|characters exact duplicate|0|
|characters normalized duplicate|0|
|Supplement D canonical duplicate|0|
|core texts canonical duplicate|0|

# Single View

|項目|結果|
|---|---|
|#lesson-view-root exists|YES|
|mounted child|1|
|total views|258|
|average|8.6|
|minimum|5|
|maximum|19|
|atomic split|0|
|LONG_VIEW_REVIEW|0|

瀏覽器 runtime hash 實測 lesson-01-view-01、lesson-15-view-03、lesson-28-view-10、lesson-30-view-05、supplement-a-view-01、supplement-d-view-01、supplement-e-view-01 均可直接顯示；無效 hash 會回到 lesson-01-view-01。每次主內容 root child count = 1。

# Hash

|檢查|結果|
|---|---|
|direct valid hash|PASS|
|hashchange lesson → lesson → supplement → lesson|PASS|
|invalid fallback|PASS，回到 lesson 01 view 01|

# Quiz

## Single choice

實測 question ID：115-Q1（Lesson 02）。

- 提交前：feedback 不存在，selected = 0。
- 選錯並提交：錯選項顯示紅色，你的答案；官方正解顯示綠色，正確答案；其餘錯項保持中性。
- feedback 與解析出現。
- 切 view、切 Lesson 15、再回 Lesson 02 原題：selected/submitted/feedback 仍保留。
- reset 後：feedback 消失、selected = 0、確認按鈕回到 disabled。

## Multiple choice

實測 question ID：113-Q25（Lesson 04），官方答案集合 ABC。

- 少選 AB：整體結果 wrong。
- 精確集合 ABC：結果 correct。
- 多選 ABCD：結果 wrong，額外的 D 顯示錯誤狀態。
- reset 可回到未作答狀態。

## State and mutation

115-Q1 作答前後的 lessonData real JSON snapshot 相同；quiz state 只反映在 runtime interaction state，未改寫 lessonData。單選與多選的實際 browser event 均已驗證。

# Mobile

目前 runtime 與 CSS/DOM 檢查未發現主內容 root 多重 mount、內容被切換頁殘留或固定寬度造成的已知結構性問題。正式 release gate 所要求的 320、375、390、430 四組獨立 viewport 逐項操作未在本輪瀏覽器 connector 中完成，故不把未取得獨立 viewport session 的部分冒充為 PASS。

320 = REVIEW REQUIRED  
375 = REVIEW REQUIRED  
390 = REVIEW REQUIRED  
430 = REVIEW REQUIRED

# Desktop

目前 runtime 的 sticky sidebar、lesson tabs、pager、quiz 與 supplement 結構存在且可操作；768、1024、1440、1920 的獨立 viewport 逐項人工視覺驗證未完成，因此不宣告完整 PASS。

768 = REVIEW REQUIRED  
1024 = REVIEW REQUIRED  
1440 = REVIEW REQUIRED  
1920 = REVIEW REQUIRED

# JS Disabled

|版本|結果|證據|
|---|---|---|
|dev 國文課綱快速複習/index.html|FAIL|noscript 只有課程索引/提示，不含 30 課主要教材。|
|offline dist/國文學測30課_完整離線包/國文學測30課_離線版.html|PASS|離線 HTML 含完整 noscript 課程文章。|
|parity|FAIL|dev 與 offline 的 JS-disabled 可讀內容不同。|

# Dev Offline

資料層掃描結果：

- lesson count：30 / 30
- real data：147 / 147
- lesson views：258 / 258
- characters：220 / 220
- Supplement D：65 / 65
- Supplement E：35 / 35
- 指定 15 篇核心文本：15 / 15
- offline dependencies：0 CDN、0 external JS、0 external CSS、0 fetch、0 XHR、0 localhost/backend URL

資料層主要數量一致；但 JS-disabled fallback 不一致，故整體 Dev/Offline parity = FAIL。

# Dependencies

離線 HTML 靜態掃描：CDN = 0、external JS = 0、external CSS = 0、fetch = 0、XHR = 0、localhost = 0、backend required = 0。

# file

離線 HTML 的檔案依賴、相對 PDF 路徑與內嵌資料均可由本地 HTTP serving copy 啟動；本輪瀏覽器 connector 對直接 file:// 導航回傳 ERR_UNEXPECTED，因此沒有把 HTTP copy 的結果冒充成 direct-file browser PASS。file:// = REVIEW REQUIRED。

# PDF

- PDF total = 19
- broken = 0（19 個檔案均存在且檔案大小大於 0）
- 年度抽查檔案：111、112、113、114、115 均有相對路徑 PDF；114 年目前檔案盤點為 3 份，總數仍為 19。

# ZIP

- path: dist/國文學測30課_完整離線包.zip
- size: 7,693,308 bytes
- structure: PASS
- ZIP 內含 國文學測30課_離線版.html、PDFs/、README.txt
- README 說明解壓縮、直接打開 HTML、離線使用、PDF 資料夾不要移動與建議瀏覽器。

# SOURCE_PENDING

count = 8  
items = 大同與小康、桃花源記、師說、虯髯客傳、晚遊六橋待月記、勸和論、鹿港乘桴記、畫菊自序  
retained honestly = YES

目前資料以補充/摘要性質提供，未將這 8 篇標成官方全文或完整原文解析已核對。SOURCE_PENDING 在本輪不是內容數量 blocker。

# Manual Review

建議 PM 人工查看：

- Lesson 01：view 01
- Lesson 15：view 03
- Lesson 28：view 10 與 last view
- Lesson 30：view 05
- Supplement A：任一指定核心文本卡與 guide accordion
- Supplement B：至少一張高重要度字詞卡與搜尋結果
- Supplement D：至少 6 張不同類型卡，包含史記、司馬遷、賦、表、書、論/說等搜尋詞結果
- Supplement E：至少 10 張卡，抽看字音、字形、成語、文言、國學常識
- 115-Q1：單選提交、錯選、reset、切頁返回
- 113-Q25：多選少選、exact set、多選一項

# Release Gate Summary

目前可確認：30 lessons、147 real、148 rendered-card release count、258 views、220 characters、Supplement D 65、Supplement E 35、E pronunciation 16/16、15 篇指定核心文本、placeholder 0、duplicate 0、Single View runtime root = 1、hash runtime PASS、quiz single/multiple/state/mutation PASS、PDF broken = 0、ZIP structure PASS。

目前不能宣告 FINAL RELEASE PASS 的項目：

1. 開發版 JS-disabled fallback 不是 30 課主要教材，造成 JS-disabled parity FAIL。
2. 本輪 connector 無法完成 direct file:// browser session，故 file:// 不宣告 PASS。
3. 本輪獨立 mobile/desktop viewport session 未完成，故不把各 viewport 冒充 PASS。

以上為目前版本的驗證紀錄，不是教材修復或自我 PASS 宣告。
