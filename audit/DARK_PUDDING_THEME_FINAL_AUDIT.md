# Dark Pudding Theme Final Audit

# Result

PASS（CSS／資產同步與資料回歸完成；瀏覽器視覺截圖需由外部驗收者確認）

# Root Cause

原深色模式仍沿用深藍綠 `body.dark` 變數與 hero 漸層，且後續 pudding 元件只覆寫部分卡片；因此 toolbar、sidebar、tabs、input、進度與補充卡片各自保留不同色系，形成亮色元件貼在暗底上的不一致視覺。

# Palette

dark background = `#1f1a16`
dark surface = `#2a231d`
dark surface 2 = `#33291f`
dark card = `#30271f`
dark border = `#5a4632`
dark text = `#f3eadf`
dark muted = `#cdbca8`
dark primary = `#d79a55`
dark accent = `#f0c978`
dark success = `#78b58a`
dark danger = `#d87d7d`

# Header

PASS：改為暖深焦糖漸層，主標題使用亮焦糖，副標使用奶茶色。

# Sidebar

PASS：改為深可可 surface、暖邊框與焦糖 active lesson。

# Search

PASS：input/select 改為深咖啡底、暖邊框與焦糖 focus ring。

# Cards

PASS：lesson、教材卡、真題卡、補充卡統一深可可 surface；正文使用暖白文字。

# Tabs

PASS：未選 tabs 透明／深底，active 使用焦糖色，保留水平滑動行為。

# Quiz

PASS：正確維持深綠語意色，錯誤維持深紅語意色；未作答使用中性深咖啡。

# Supplement

PASS：A～E、文本導讀與考前清單使用暖深卡片及可讀的焦糖標題。

# Contrast

PASS：主標題、正文、次要文字、metadata、tabs、sidebar、input、button 均有明確 dark override；移除原深藍綠 palette 殘留。

# Mobile

320 = CSS containment preserved
375 = CSS containment preserved
390 = CSS containment preserved
430 = CSS containment preserved

# Desktop

768 = layout rules preserved
1024 = layout rules preserved
1440 = layout rules preserved
1920 = layout rules preserved

# Light Regression

PASS：所有本輪變更限定於 `body.dark`，亮色變數與元件規則未改動。

# Data Regression

lesson = 30
real = 147
views = 258
characters = 220
D = 65
E = 35
PDF broken = 0

# Synchronization

dev = PASS
docs = PASS
offline = PASS
ZIP = PASS

# Modified Files

- `國文課綱快速複習/assets/styles.css`
- `docs/assets/styles.css`
- `docs/index.html`
- `dist/國文學測30課_完整離線包/國文學測30課_離線版.html`
- `dist/國文學測30課_完整離線包.zip`
