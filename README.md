# 破产债权审查 (Bankruptcy Claims Review)

<p align="center">
  <strong>依据《破产债权审查标准：原理、规则与案例》专业法律框架，为破产管理人提供标准化、自动化的债权审查工具。</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/版本-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/许可证-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D14.0-brightgreen" alt="Node">
  <img src="https://img.shields.io/badge/语言-中文-red" alt="Language">
</p>

---

## 📋 目录

- [项目概述](#项目概述)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [安装步骤](#安装步骤)
- [使用指南](#使用指南)
- [输出文档说明](#输出文档说明)
- [审查流程](#审查流程)
- [API 文档](#api-文档)
- [法律依据](#法律依据)
- [贡献规范](#贡献规范)
- [许可证](#许可证)
- [联系方式](#联系方式)

---

## 项目概述

破产债权审查技能（Bankruptcy Claims Review）是一款面向破产管理人、律师及法务人员的专业化债权审查工具。本项目依据《破产债权审查标准：原理、规则与案例》的专业法律框架，实现了破产债权审查的标准化流程，覆盖从债权人申报材料读取到最终审查意见书生成的全流程。

### 适用场景

- 企业破产重整/清算案件中的债权审查
- 管理人对债权人申报债权的标准化审查
- 债权审查意见书及告知书的自动化生成
- 破产债权申报材料的结构化整理与分析

---

## 核心功能

### 🔍 自动信息提取

- **支持格式**：PDF、Word（.docx/.doc）、图片（OCR 识别）
- **提取内容**：债权人/债务人信息、债权类型、申报金额、合同条款、利率约定等
- **来源追溯**：每项提取信息标注来源文件名称及页码/位置

### 🧮 利息与违约金自动计算

- 预置 LPR 利率表，支持按发布日期查询
- 利息计算截止日为破产案件受理日（受理日当日不计息）
- 民间借贷利率上限为合同成立时 1 年期 LPR 的 4 倍
- 生成详细的利息/违约金计算明细表

### 📋 智能材料检查

- 自动检查申报材料完整性
- 对缺失材料自动列入补充资料清单
- 对债权人提交的利息计算表进行复核校验

### 📄 文档自动生成

生成三份标准化 Word 文档：

| 文档 | 用途 | 说明 |
|------|------|------|
| **破产债权审查意见书** | 内部使用 | 详版，供管理人法务或律师内部审阅 |
| **债权初审意见告知书** | 对外发送 | 简版，以管理人名义向债权人发出 |
| **补充资料或证据材料清单** | 对外发送 | 列示需债权人补充的材料 |

### 🔗 案件公告信息查询

- 自动查询全国企业破产重整案件信息网
- 提取案件受理时间、债权申报截止时间、管理人信息等
- 查询结果与上传资料冲突时以公告信息为准

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Node.js** | >= 14.0 | 运行环境 |
| [docx](https://www.npmjs.com/package/docx) | ^8.5.0 | Word 文档生成 |
| [nanoid](https://www.npmjs.com/package/nanoid) | latest | 唯一标识生成 |
| [xml-js](https://www.npmjs.com/package/xml-js) | latest | XML 数据处理 |

---

## 项目结构

```
bankruptcy-claims-review/
├── SKILL.md                          # 技能说明文档（完整审查规则与流程）
├── README.md                         # 项目说明文档
├── LICENSE                           # MIT 开源许可证
├── CONTRIBUTING.md                   # 贡献指南
├── CODE_OF_CONDUCT.md                # 行为准则
├── SECURITY.md                       # 安全政策
├── .gitignore                        # Git 忽略规则
└── scripts/
    ├── package.json                  # 依赖配置
    ├── generate_notice.js            # 文档生成主脚本
    └── node_modules/                 # 依赖包
```

---

## 安装步骤

### 环境要求

- **Node.js** >= 14.0
- **npm** >= 6.0（或 yarn）

### 安装

```bash
# 克隆仓库
git clone https://github.com/auctioneer2022/bankruptcy-claims-review.git
cd bankruptcy-claims-review

# 安装依赖
cd scripts
npm install
```

---

## 使用指南

### 快速开始

```bash
cd scripts
npm start
```

运行后将生成三份示例文档：

- `破产债权审查意见书.docx`
- `债权初审意见告知书.docx`
- `补充资料或证据材料清单.docx`

### 自定义数据生成

在代码中替换 `sampleData` 对象即可自定义审查数据：

```javascript
const customData = {
    docNumber: "2024-001",
    caseNo: "（2024）破管字第001号",
    debtorName: "XX有限公司",
    acceptanceDate: "2024年6月15日",
    creditorName: "XXX科技有限公司",
    creditorId: "91110000XXXXXXXXX",
    claimType: "合同债权",
    claimAmount: 5000000.00,
    confirmedAmount: 4800000.00,
    principal: 4500000.00,
    interest: 250000.00,
    penalty: 50000.00,
    fees: 0.00,
    claimNature: "普通债权",
    claimCategory: "合同之债-买卖合同",
    amountReview: "经审查，申报本金4,500,000.00元予以确认...",
    reviewer: "王五",
    reviewer2: "赵六"
};
```

### 作为模块引用

```javascript
const { generateDetailedReview, generateNoticeToCreditor, generateSupplementList } = require('./scripts/generate_notice');

// 生成破产债权审查意见书
const detailedDoc = generateDetailedReview(customData);

// 生成债权初审意见告知书
const noticeDoc = generateNoticeToCreditor(customData);

// 生成补充资料清单
const supplementDoc = generateSupplementList(supplementData);
```

---

## 输出文档说明

### 破产债权审查意见书（详版）

供管理人法务或律师内部使用，包含以下章节：

1. **案件基本信息** — 债务人名称、受理日、案号
2. **债权人基本信息** — 债权人名称、证件号码、联系方式
3. **债权申报情况** — 申报日期、类型、金额明细
4. **审查认定意见**
   - (一) 主体资格审查
   - (二) 债权事实审查（含合同相对性审查）
   - (三) 债权性质认定
   - (四) 债权数额审查（含利息/违约金计算明细）
   - (五) 时效审查
   - (六) 证据审查
5. **审查结论汇总**
6. **风险提示及建议**
7. **审查人员**

### 债权初审意见告知书（简版）

以管理人名义向债权人发出，包含：

1. 债权申报情况
2. 初审意见（确认金额、债权性质）
3. 权利救济（15 日异议期）
4. 联系信息

### 补充资料或证据材料清单

列示需债权人补充的材料，按类别分组：

1. 主体资格证明
2. 债权事实证据
3. 债权数额依据
4. 时效证明材料
5. 其他材料

---

## 审查流程

```
读取申报材料 → 自动提取信息 → 收集案件信息 → 主体资格校验
→ 债权事实审查 → 债权性质认定 → 债权数额审查（含利息计算）
→ 时效审查 → 证据审查 → 材料检查 → 生成审查文档
```

详细审查规则请参阅 [SKILL.md](./SKILL.md)。

---

## API 文档

### `generateDetailedReview(data)`

生成破产债权审查意见书（详版）。

**参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `docNumber` | string | 否 | 文书编号，默认 "[编号]" |
| `caseNo` | string | 否 | 案号 |
| `debtorName` | string | 否 | 债务人名称 |
| `acceptanceDate` | string | 否 | 破产案件受理日 |
| `creditorName` | string | 否 | 债权人名称 |
| `creditorId` | string | 否 | 证件号码/统一社会信用代码 |
| `claimType` | string | 否 | 债权类型 |
| `claimAmount` | number | 否 | 申报金额合计 |
| `confirmedAmount` | number | 否 | 审查确认金额 |
| `principal` | number | 否 | 本金 |
| `interest` | number | 否 | 利息 |
| `penalty` | number | 否 | 违约金 |
| `fees` | number | 否 | 费用 |
| `claimNature` | string | 否 | 债权性质（优先/普通/劣后） |
| `claimCategory` | string | 否 | 债权类别 |
| `amountReview` | string | 否 | 数额审查意见 |
| `reviewer` | string | 否 | 审查人 |
| `reviewer2` | string | 否 | 复核人 |

**返回值：** `Document` 对象（docx 库）

### `generateNoticeToCreditor(data)`

生成债权初审意见告知书（简版）。参数同 `generateDetailedReview`，额外支持：

| 字段 | 类型 | 说明 |
|------|------|------|
| `briefConclusion` | string | 简要审查说明 |
| `contactPerson` | string | 管理人联系人 |
| `contactPhone` | string | 联系电话 |
| `contactAddress` | string | 联系地址 |

### `generateSupplementList(data)`

生成补充资料或证据材料清单。除基础字段外，额外支持：

| 字段 | 类型 | 说明 |
|------|------|------|
| `suppNumber` | string | 补充清单编号 |
| `needSubjectProof` | boolean | 是否需补充主体资格证明 |
| `subjectProofDesc` | string | 主体资格补充说明 |
| `needFactEvidence` | boolean | 是否需补充债权事实证据 |
| `factEvidenceDesc` | string | 债权事实补充说明 |
| `needAmountBasis` | boolean | 是否需补充数额依据 |
| `needTimeProof` | boolean | 是否需补充时效证明 |
| `timeProofDesc` | string | 时效补充说明 |
| `needOtherMaterial` | boolean | 是否需补充其他材料 |

---

## 法律依据

本项目审查规则主要依据以下法律法规：

- 《中华人民共和国企业破产法》
- 《中华人民共和国民法典》
- 《最高人民法院关于适用〈中华人民共和国企业破产法〉若干问题的规定（三）》
- 《最高人民法院关于审理建设工程施工合同纠纷案件适用法律问题的解释（一）》
- 《最高人民法院关于审理民间借贷案件适用法律若干问题的规定》
- 《中华人民共和国民事诉讼法》

---

## 贡献规范

欢迎参与本项目的开发与完善！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细的贡献流程。

### 快速贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某功能'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 发起 Pull Request

---

## 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。

---

## 联系方式

如有问题或建议，请通过以下方式联系：

- **提交 Issue**：[GitHub Issues](https://github.com/auctioneer2022/bankruptcy-claims-review/issues)
- **讨论区**：[GitHub Discussions](https://github.com/auctioneer2022/bankruptcy-claims-review/discussions)

---

<p align="center">
  <sub>依据《破产债权审查标准：原理、规则与案例》专业法律框架构建</sub>
</p>
