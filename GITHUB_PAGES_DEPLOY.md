# GitHub Pages 部署

本 repo 是純靜態網站，GitHub Pages 發布目錄為 `docs/`。

1. 建立 GitHub repository。
2. 將本 repo push 到 `main` branch。
3. 開啟 repository 的 **Settings**。
4. 進入 **Pages**。
5. 在 **Build and deployment** 選擇 **Deploy from a branch**。
6. Branch 選 `main`。
7. Folder 選 `/docs`。
8. 按 **Save**。
9. 等待 GitHub Pages 完成部署。
10. 開啟 `https://USERNAME.github.io/REPOSITORY/`。

網站使用 hash routing，例如 `#lesson-15-view-03`，重新整理不需要 server rewrite。

離線 ZIP 位於 `release/國文學測30課_完整離線包.zip`；不要把整個 `香魚學測` 資料夾當成此網站的 repository，也不要移動 `docs/PDFs/`。

本 repo 未設定 custom domain 或 CNAME。若未來需要，請在 GitHub Pages Settings 中另行設定。
