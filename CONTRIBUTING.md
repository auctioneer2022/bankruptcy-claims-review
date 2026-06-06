# 贡献指南

感谢你对破产债权审查项目的关注！本文档说明了参与本项目贡献的流程与规范。

## 行为准则

本项目遵循 [行为准则](./CODE_OF_CONDUCT.md)。参与贡献即表示你同意遵守其中的条款。

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请通过 [GitHub Issues](https://github.com/auctioneer2022/bankruptcy-claims-review/issues) 提交，并包含以下信息：

- **问题描述**：清晰描述遇到的问题
- **复现步骤**：详细说明如何复现该问题
- **期望行为**：描述你期望的正确行为
- **实际行为**：描述实际发生的错误行为
- **环境信息**：Node.js 版本、操作系统等
- **截图或日志**（如适用）

### 提出新功能

如果你有新功能建议，请提交 Issue 并描述：

- **功能描述**：你希望实现什么功能
- **使用场景**：该功能解决什么问题
- **实现建议**（可选）：你对实现方式的初步想法

### 提交代码

#### 1. Fork 并克隆仓库

```bash
git clone https://github.com/auctioneer2022/bankruptcy-claims-review.git
```

#### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或修复 Bug
git checkout -b fix/bug-description
```

#### 3. 进行开发

确保代码风格一致，遵循现有代码规范。

#### 4. 测试

提交前请在本地运行并验证：

```bash
cd scripts
npm install
npm start
```

确认生成的文档格式正确、内容完整。

#### 5. 提交更改

使用语义化提交信息：

```
feat: 添加建设工程价款优先受偿权审查模块
fix: 修复利息计算中 LPR 利率查询日期格式问题
docs: 更新 README 中的安装说明
refactor: 重构文档生成函数以支持自定义样式
style: 统一代码缩进格式
```

#### 6. 推送并创建 Pull Request

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request，描述你的更改内容。

## 代码规范

### JavaScript

- 使用 UTF-8 编码
- 缩进使用 4 个空格
- 字符串使用单引号
- 行末不加多余空格
- 函数和变量使用 camelCase 命名
- 常量使用 UPPER_SNAKE_CASE 命名

### 文档生成

- 生成的 Word 文档应遵循中国法律文书格式规范
- 段落首行缩进 2 个中文字符（标题和签章部分除外）
- 金额格式统一使用 `¥ X,XXX.XX` 格式
- 日期格式统一使用 `XXXX年XX月XX日` 格式

### 法律内容

- 所有审查规则须引用具体法律条文
- 法律条文引用应准确、完整
- 新增审查规则需在 SKILL.md 中同步更新

## Pull Request 审查流程

1. 维护者将在提交 PR 后进行审查
2. 如需修改，维护者会在 PR 中留言说明
3. 审查通过后，维护者将合并你的 PR
4. 对于重大更改，可能需要多名维护者审查

## 问题与讨论

如有任何疑问，欢迎通过以下方式交流：

- [GitHub Issues](https://github.com/auctioneer2022/bankruptcy-claims-review/issues)
- [GitHub Discussions](https://github.com/auctioneer2022/bankruptcy-claims-review/discussions)

---

再次感谢你的贡献！
