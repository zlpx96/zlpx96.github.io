#!/usr/bin/env python3
"""将正文目录下的Markdown文件转换为HTML页面"""

import markdown
import os
import re

POSTS_DIR = os.path.join(os.path.dirname(__file__), "posts")
SOURCE_DIR = os.path.join(os.path.dirname(__file__), "..", "正文")

# 文章元数据：(md文件名, html文件名, 标题, 描述)
ARTICLES = [
    ("第1篇-OpenClaw是什么.md", "01-what-is-openclaw.html",
     "OpenClaw是什么？AI从聊天工具到数字员工的进化", "约1,850字"),
    ("第2篇-从周末项目到全球第一.md", "02-founder-story.html",
     "从周末项目到全球第一：OpenClaw创始人的传奇故事", "约1,750字"),
    ("第3篇-技术架构深度解析.md", "03-architecture.html",
     "OpenClaw技术架构深度解析：为什么它比其他AI Agent更强？", "约1,850字"),
    ("第4篇-10分钟部署保姆级教程.md", "04-deployment.html",
     "10分钟部署你的第一个OpenClaw：保姆级教程", "约1,700字"),
    ("第5篇-接入微信飞书钉钉.md", "05-channels.html",
     "接入微信、飞书、钉钉：让OpenClaw成为你的工作助手", "约1,800字"),
    ("第6篇-ClawHub技能市场.md", "06-clawhub-skills.html",
     "ClawHub技能市场：13,729个技能如何让AI无所不能", "约1,750字"),
    ("第7篇-模型配置指南.md", "07-model-config.html",
     "模型配置指南：从GPT到国产大模型的全面支持", "约1,650字"),
    ("第8篇-安全事件簿.md", "08-security.html",
     "OpenClaw安全事件簿：那些踩过的坑和防范指南", "约1,900字"),
    ("第9篇-Moltbook-AI社交网络实验.md", "09-moltbook.html",
     "Moltbook：AI Agent的社交网络实验", "约1,550字"),
    ("第10篇-OpenClaw-vs-Claude-Code.md", "10-vs-claude-code.html",
     "OpenClaw vs Claude Code：谁才是AI编程的未来？", "约1,750字"),
]


def make_html(title, body_html, prev_link=None, prev_title=None, next_link=None, next_title=None):
    nav_html = ""
    if prev_link or next_link:
        parts = []
        if prev_link:
            parts.append(f'<a href="{prev_link}">&larr; {prev_title}</a>')
        else:
            parts.append("<span></span>")
        if next_link:
            parts.append(f'<a href="{next_link}">{next_title} &rarr;</a>')
        else:
            parts.append("<span></span>")
        nav_html = f'<nav class="post-nav">{"".join(parts)}</nav>'

    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - 飘雪思考</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>

<header class="site-header">
  <div class="inner">
    <a href="../" class="site-title"><span>飘雪</span>思考</a>
    <nav class="site-nav">
      <a href="../">首页</a>
      <a href="https://github.com/zlpx96" target="_blank">GitHub</a>
    </nav>
  </div>
</header>

<main class="container">
  <article>
    <div class="article-header">
      <a href="../" class="back">&larr; 返回文章列表</a>
      <h1>{title}</h1>
      <div class="meta">飘雪思考 &middot; OpenClaw从入门到精通系列</div>
    </div>
    <div class="article-body">
{body_html}
    </div>
    {nav_html}
  </article>
</main>

<footer class="site-footer">
  <p>&copy; 2026 飘雪思考 &middot; 基于《OpenClaw橙皮书》整理 &middot; Hosted on GitHub Pages</p>
</footer>

</body>
</html>"""


def main():
    os.makedirs(POSTS_DIR, exist_ok=True)

    md_ext = ["tables", "fenced_code", "codehilite", "nl2br"]

    for i, (md_file, html_file, title, _desc) in enumerate(ARTICLES):
        md_path = os.path.join(SOURCE_DIR, md_file)
        if not os.path.exists(md_path):
            print(f"  SKIP  {md_file} (not found)")
            continue

        with open(md_path, "r", encoding="utf-8") as f:
            md_text = f.read()

        # 去掉markdown开头的一级标题（HTML模板里已有h1）
        md_text = re.sub(r"^#\s+.+\n", "", md_text, count=1)

        body_html = markdown.markdown(md_text, extensions=md_ext)

        # prev / next links
        prev_link = ARTICLES[i - 1][1] if i > 0 else None
        prev_title = ARTICLES[i - 1][2] if i > 0 else None
        next_link = ARTICLES[i + 1][1] if i < len(ARTICLES) - 1 else None
        next_title = ARTICLES[i + 1][2] if i < len(ARTICLES) - 1 else None

        html = make_html(title, body_html, prev_link, prev_title, next_link, next_title)

        out_path = os.path.join(POSTS_DIR, html_file)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"  OK    {html_file}")

    print(f"\nDone! {len(ARTICLES)} pages generated in {POSTS_DIR}")


if __name__ == "__main__":
    main()
