# 史可 · 项目作品集

四个 AI 交付项目的对外页面，以及一页可打印总览。

- `index.html` — 项目总览（4 项 + 交付方法）
- `video-pipeline.html` — 内容生产自动化流水线案例（ASR → 解说 → TTS → 剪辑 → 9 项门禁）
- `book-corpus/` — 企业知识库检索问答的静态橱窗与 89s 演示（源仓库 [sk123qaq/book-corpus](https://github.com/sk123qaq/book-corpus)）
- `assets/overview-1page.pdf` — 1 页总览，可直接附件发送
- `assets/resume.pdf` — 简历

## 重新生成

页面是纯静态 HTML + 内联 CSS/JS，无构建步骤。

```bash
# 本地预览
python3 -m http.server 8899   # 打开 http://127.0.0.1:8899/index.html

# 重新导出 1 页总览 PDF（打印样式把内容压进 A4 一页）
google-chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=assets/overview-1page.pdf http://127.0.0.1:8899/index.html
pdftoppm -png -r 100 assets/overview-1page.pdf /tmp/check   # 目视核对仍是 1 页
```

打印样式（`@media print`）里被隐藏的部分：交付方法段、每个项目的「为什么值得给客户看」、
事实表的第 5 项、页脚底注。改注意到 `index.html` 末尾的 print 块，并重跑上面两条命令确认页数。

## 素材来源

- 视频案例的数字全部取自本机工作目录
  `视频剪辑/是大臣第三季/是,大臣S3特别篇-党派之戏/work/`：
  `out/selfcheck.txt`（29 段切点表）、`out/cut_audit.txt`（首轮审计）、`out/verify*`（9 项核对）、
  成片 ffprobe 时长 1342.5s。
- 流水线脚本在 [useful_skill / video-commentary](https://github.com/sk123qaq/useful_skill/tree/main/video-commentary)。
