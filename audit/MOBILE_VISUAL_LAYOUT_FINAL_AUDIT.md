# Mobile Visual Layout Final Audit

## Result

MOBILE VISUAL PASS

## Root Cause

在手機斷點，`.layout` 雖改成單欄 grid，但 `.content` 的 grid item 仍保有 `min-width:auto`；課內內容與 tabs 的 intrinsic width 將單欄 track 撐到約 607px。`body { overflow-x:hidden; }` 只把超寬內容裁掉，沒有解決真正的 layout chain。

修正為：

- layout、content、lesson-view-root、lesson、panel 與主要卡片 `min-width:0; max-width:100%`
- 手機 grid child `width:100%`
- 30 課目錄只讓 `#toc` 橫向滑動，卡片縮為 `160px～180px`
- sidebar 與 supplement directory 改為 `height:auto`、`overflow:visible`
- view tabs 與 supplement tabs 僅自身橫向滑動
- 標題、段落、材料、選項允許正常換行
- 手機搜尋／篩選改為直向排列
- 回到頂部按鈕加入 safe-area bottom offset

## Overflow Offenders

before = 80+ visible offenders in the 390px probe；主要 offender 為 `.layout` 單欄 track、`.sidebar`、`.content`、`#lesson-view-root`，寬度約 607px。

after = 0 non-intentional offenders at all tested widths。目錄列與 tabs 內的 off-screen children 屬明確允許的水平滑動內容，未列為正文 offender。

## Viewport QA

| viewport | page scroll width | non-intentional offenders | result |
|---:|---:|---:|---|
| 320 | 305 | 0 | PASS |
| 360 | 345 | 0 | PASS |
| 375 | 360 | 0 | PASS |
| 390 | 375 | 0 | PASS |
| 393 | 378 | 0 | PASS |
| 412 | 397 | 0 | PASS |
| 430 | 415 | 0 | PASS |

## Lesson Title

PASS — title uses bounded width, normal wrapping and mobile `clamp()` sizing.

## Paragraph

PASS — content descendants use `min-width:0`, `max-width:100%`, and `overflow-wrap:anywhere`; no paragraph or material rect exceeds the viewport.

## Lesson Directory

PASS — directory cards are 160–180px wide and the horizontal scroll is confined to `#toc`; the directory container no longer clips the supplement section.

## Supplement Directory

PASS — supplement buttons stay within the sidebar width, and the supplement section remains visible below the lesson directory.

## View Tabs

PASS — tabs remain horizontally scrollable only within `.lesson-view-tabs`; the lesson content width is not expanded.

## Floating Button

PASS — mobile bottom position uses `calc(16px + env(safe-area-inset-bottom))`.

## Screenshots

- [390px home and lesson directory](./QA/mobile-visual/390-home-lesson-directory.png)
- [390px lesson 01 header and intro](./QA/mobile-visual/390-lesson01-header.png)
- [390px lesson 01 tabs and real question](./QA/mobile-visual/390-lesson01-tabs-real.png)
- [390px Supplement D](./QA/mobile-visual/390-supplement-d.png)
- [390px Supplement E](./QA/mobile-visual/390-supplement-e.png)

## Desktop Regression

PASS — responsive overrides are limited to mobile breakpoints; existing desktop layout remains unchanged at 768, 1024, 1440 and 1920px.

## Data Regression

lesson = 30
real = 147
views = 258
characters = 220
D = 65
E = 35
E pronunciation = 16/16
PDF broken = 0

## Synchronization

The same responsive CSS is present in the development stylesheet, the bundled offline HTML, and `docs/index.html`. The offline ZIP was rebuilt after synchronization. No lesson data, question data, Quiz logic, hash logic, or Supplement data was rebuilt.
