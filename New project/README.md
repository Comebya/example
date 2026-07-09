# 轻账本小程序

一个使用 HTML、CSS、JavaScript 编写的微信小程序风格记账应用。项目不依赖框架和构建工具，直接打开 `index.html` 就能运行，也可以部署到 GitHub Pages。

## 功能

- 本月收入、支出、结余统计
- 新增收入或支出记录
- 快捷分类入口
- 按收入、支出筛选记录
- 删除单条记录
- 支出分类统计
- 使用 `localStorage` 本地保存数据
- 移动端优先的微信小程序风格界面

## 项目结构

```text
.
├── index.html
├── styles.css
├── app.js
├── README.md
├── LICENSE
└── .gitignore
```

## 本地运行

直接双击打开 `index.html`。

也可以用本地静态服务运行：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 发布到 GitHub Pages

1. 在 GitHub 创建一个新仓库。
2. 上传本项目所有文件。
3. 进入仓库的 `Settings`。
4. 打开 `Pages`。
5. `Source` 选择 `Deploy from a branch`。
6. `Branch` 选择 `main`，目录选择 `/root`。
7. 保存后等待部署完成。

部署成功后，访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

## 技术栈

- HTML5
- CSS3
- JavaScript
- localStorage

## 说明

这是一个前端练习项目，适合用于学习移动端布局、原生 JavaScript 交互、本地数据存储和 GitHub Pages 静态部署。
