/**
 * 破产债权审查 - 生成破产债权审查意见书及债权审查结果告知书Word文档
 * 依据《破产债权审查标准：原理、规则与案例》专业法律框架
 */

const fs = require('fs');
const os = require('os');

// 获取CJK字体
function getCJKFont() {
    const platform = os.platform();
    if (platform === 'darwin') {
        return 'PingFang SC';
    } else if (platform === 'win32') {
        return 'Microsoft YaHei';
    } else {
        return 'Noto Sans CJK SC';
    }
}

const cjkFont = getCJKFont();

const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel,
    Footer
} = require('docx');

// 创建边框样式
const createBorder = () => ({
    style: BorderStyle.SINGLE,
    size: 1,
    color: "2b6cb0"
});

const border = createBorder();
const borders = {
    top: border, bottom: border, left: border, right: border,
    insideHorizontal: border, insideVertical: border
};

// 创建表格单元格（支持百分比宽度）
function createTableCell(text, widthPercent, isHeader = false) {
    return new TableCell({
        borders,
        width: { size: widthPercent, type: WidthType.PERCENTAGE },
        shading: isHeader ? { fill: "2b6cb0", type: ShadingType.CLEAR } : { fill: "f7fafc", type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        verticalAlign: "center",
        children: [new Paragraph({
            spacing: { line: 276, lineRule: "auto" },
            children: [new TextRun({
                text: text,
                font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont },
                size: isHeader ? 21 : 20,
                bold: isHeader,
                color: isHeader ? "FFFFFF" : "000000"
            })]
        })]
    });
}

// 创建段落
function createParagraph(text, options = {}) {
    const { bold = false, size = 21, alignment = AlignmentType.LEFT, spacing = 200, indent = true } = options;
    return new Paragraph({
        alignment,
        spacing: { before: spacing, after: spacing },
        indent: indent ? { firstLine: 420 } : undefined,
        children: [new TextRun({
            text, font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont }, size, bold
        })]
    });
}

// 创建标题
function createHeading(text, level = 1) {
    const configs = { 1: { size: 28, spacing: 300, bold: true }, 2: { size: 24, spacing: 200, bold: true }, 3: { size: 22, spacing: 150, bold: false } };
    const config = configs[level] || configs[1];
    return new Paragraph({
        spacing: { before: config.spacing, after: 100 },
        children: [new TextRun({
            text, font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont },
            size: config.size, bold: config.bold, color: level === 1 ? "1a365d" : "2b6cb0"
        })]
    });
}

// 格式化金额
function formatCurrency(amount) {
    return "¥ " + (amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ==================== 生成破产债权审查意见书====================
function generateDetailedReview(data) {
    const children = [];
    const adminName = data.administratorName || (data.debtorName ? data.debtorName + "管理人" : "[管理人名称]");
    const docNumber = data.docNumber || "[编号]";
    
    // 标题
    children.push(createParagraph(adminName, { alignment: AlignmentType.CENTER, size: 24, indent: false }));
    children.push(createParagraph("破产债权审查意见书", { alignment: AlignmentType.CENTER, size: 36, bold: true, indent: false }));
    children.push(createParagraph(`编号：${docNumber}`, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 一、案件基本信息
    children.push(createHeading("一、案件基本信息", 1));
    const caseInfo = [
        ["债务人名称", data.debtorName || ""],
        ["破产案件受理日", data.acceptanceDate || ""],
        ["案号", data.caseNo || ""]
    ];
    children.push(createInfoTable(caseInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 二、债权人基本信息
    children.push(createHeading("二、债权人基本信息", 1));
    const creditorInfo = [
        ["债权人名称", data.creditorName || ""],
        ["证件号码/统一社会信用代码", data.creditorId || ""],
        ["债权人联系人", data.creditorContactPerson || "[待人工填写]"],
        ["债权人联系电话", data.creditorContactPhone || "[待人工填写]"],
        ["债权人联系地址", data.creditorContactAddress || "[待人工填写]"],
        ["代理人姓名", data.agentName || "无"]
    ];
    children.push(createInfoTable(creditorInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 三、债权申报情况
    children.push(createHeading("三、债权申报情况", 1));
    const claimInfo = [
        ["申报日期", data.declareDate || new Date().toLocaleDateString('zh-CN')],
        ["债权类型", data.claimType || ""],
        ["申报本金", formatCurrency(data.principal)],
        ["申报利息", formatCurrency(data.interest)],
        ["申报违约金", formatCurrency(data.penalty)],
        ["申报费用", formatCurrency(data.fees)],
        ["申报金额合计", formatCurrency(data.claimAmount)]
    ];
    children.push(createInfoTable(claimInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 四、审查认定意见
    children.push(createHeading("四、审查认定意见", 1));
    
    // (一) 主体资格审查
    children.push(createHeading("(一) 主体资格审查", 2));
    children.push(createParagraph("1. 债权人主体资格：" + (data.subjectReviewCreditor || "经审查，债权人主体资格合法有效。"), { spacing: 100 }));
    children.push(createParagraph("2. 代理人资格：" + (data.subjectReviewAgent || "无代理人/代理人资格合法有效。"), { spacing: 100 }));
    children.push(createParagraph("3. 审查结论及依据：" + (data.subjectReviewConclusion || "债权人及代理人（如有）主体资格符合法律规定。"), { spacing: 100 }));
    
    // (二) 债权事实审查
    children.push(createHeading("(二) 债权事实审查（含合同相对性审查）", 2));
    children.push(createParagraph("1. 债权发生原因：" + (data.factOrigin || "合同之债"), { spacing: 100 }));
    children.push(createParagraph("2. 合同相对性审查：" + (data.contractRelativity || "经审查，合同签订主体为债务人，债权人为合同相对方，合同相对性成立。"), { spacing: 100 }));
    children.push(createParagraph("3. 债权变更情况：" + (data.factChange || "无变更"), { spacing: 100 }));
    children.push(createParagraph("4. 债权消灭情况：" + (data.factExtinction || "无消灭情形"), { spacing: 100 }));
    children.push(createParagraph("5. 审查结论及依据：" + (data.factConclusion || "债权发生、变更事实清楚，证据充分。"), { spacing: 100 }));
    
    // (三) 债权性质认定
    children.push(createHeading("(三) 债权性质认定", 2));
    children.push(createParagraph("1. 债权性质分析：" + (data.natureAnalysis || "根据申报材料及证据，该债权为普通债权。"), { spacing: 100 }));
    children.push(createParagraph("2. 优先权审查：" + (data.priorityReview || "不适用优先权。"), { spacing: 100 }));
    children.push(createParagraph("3. 审查结论及依据：" + (data.natureConclusion || `认定该债权性质为${data.claimNature || "普通债权"}。`), { spacing: 100 }));
    
    // (四) 债权数额审查
    children.push(createHeading("(四) 债权数额审查", 2));
    children.push(createParagraph("1. 本金审查：" + (data.amountPrincipal || `申报本金${formatCurrency(data.principal)}予以确认。`), { spacing: 100 }));
    children.push(createParagraph("2. 利息审查：" + (data.amountInterest || `利息按合同约定及法律规定计算至破产受理日，确认为${formatCurrency(data.interest)}。`), { spacing: 100 }));
    children.push(createParagraph("3. 违约金审查：" + (data.amountPenalty || `违约金按合同约定计算至破产受理日，确认为${formatCurrency(data.penalty)}。`), { spacing: 100 }));
    children.push(createParagraph("4. 费用审查：" + (data.amountFees || `费用确认为${formatCurrency(data.fees)}。`), { spacing: 100 }));
    children.push(createParagraph("5. 审查结论及依据：" + (data.amountConclusion || data.amountReview || ""), { spacing: 100 }));
    
    // (五) 时效审查
    children.push(createHeading("(五) 时效审查", 2));
    children.push(createParagraph("1. 诉讼时效审查：" + (data.timeLimitation || "经审查，债权诉讼时效符合法律规定。"), { spacing: 100 }));
    children.push(createParagraph("2. 执行时效审查：" + (data.timeExecution || "无执行时效问题/经审查符合法律规定。"), { spacing: 100 }));
    children.push(createParagraph("3. 审查结论及依据：" + (data.timeConclusion || "债权时效符合法律规定。"), { spacing: 100 }));
    
    // (六) 证据审查
    children.push(createHeading("(六) 证据审查", 2));
    children.push(createParagraph("1. 证据真实性审查：" + (data.evidenceAuthenticity || "经审查，提交证据形式真实、内容真实。"), { spacing: 100 }));
    children.push(createParagraph("2. 证据合法性审查：" + (data.evidenceLegality || "经审查，证据主体、形式、取得途径、认定程序合法。"), { spacing: 100 }));
    children.push(createParagraph("3. 证据关联性审查：" + (data.evidenceRelevance || "经审查，证据与待证事实具有证明关系。"), { spacing: 100 }));
    children.push(createParagraph("4. 证明力分析：" + (data.evidenceProbative || "证据具有充分证明力。"), { spacing: 100 }));
    children.push(createParagraph("5. 审查结论及依据：" + (data.evidenceConclusion || "提交证据符合真实性、合法性、关联性要求。"), { spacing: 100 }));
    
    // 五、审查结论汇总
    children.push(createHeading("五、审查结论汇总", 1));
    const summaryInfo = [
        ["申报金额", formatCurrency(data.claimAmount)],
        ["审查确认金额", formatCurrency(data.confirmedAmount)],
        ["债权性质", data.claimNature || "普通债权"],
        ["债权类别", data.claimCategory || ""],
        ["不予认定/部分认定理由", data.rejectionReason || "无"]
    ];
    children.push(createInfoTable(summaryInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 六、风险提示及建议
    children.push(createHeading("六、风险提示及建议", 1));
    children.push(createParagraph(data.riskAndSuggestion || "经审查，未发现重大风险点。建议按程序提交债权人会议审议。", { spacing: 100 }));
    
    // 七、审查人员
    children.push(createHeading("七、审查人员", 1));
    const reviewerInfo = [
        ["审查人", data.reviewer || "[审查人姓名]"],
        ["复核人", data.reviewer2 || "[复核人姓名]"],
        ["审查日期", data.reviewDate || new Date().toLocaleDateString('zh-CN')]
    ];
    children.push(createInfoTable(reviewerInfo));
    
    // 签章
    children.push(createParagraph(" ", { spacing: 400, indent: false }));
    children.push(createParagraph(adminName, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    
    return new Document({
        styles: { default: { document: { run: { font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont }, size: 21 } } } },
        sections: [{
            properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            footers: { default: new Footer({ children: [] }) },
            children: children
        }]
    });
}

// ==================== 生成债权初审意见告知书 ====================
function generateNoticeToCreditor(data) {
    const children = [];
    const adminName = data.administratorName || (data.debtorName ? data.debtorName + "管理人" : "[管理人名称]");
    const docNumber = data.docNumber || "[编号]";
    
    // 标题
    children.push(createParagraph(adminName, { alignment: AlignmentType.CENTER, size: 24, indent: false }));
    children.push(createParagraph("债权初审意见告知书", { alignment: AlignmentType.CENTER, size: 36, bold: true, indent: false }));
    children.push(createParagraph(`编号：${docNumber}`, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    children.push(createParagraph(" ", { spacing: 150, indent: false }));
    
    // 致债权人
    children.push(createParagraph(`致：${data.creditorName || "[债权人名称]"}`, { spacing: 100, indent: false }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 一、债权申报情况
    children.push(createHeading("一、债权申报情况", 1));
    const declareInfo = [
        ["申报日期", data.declareDate || new Date().toLocaleDateString('zh-CN')],
        ["申报金额", `${formatCurrency(data.claimAmount)}（本金${formatCurrency(data.principal)}、利息${formatCurrency(data.interest)}、违约金${formatCurrency(data.penalty)}、费用${formatCurrency(data.fees)}）`]
    ];
    children.push(createInfoTable(declareInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 二、初审意见
    children.push(createHeading("二、初审意见", 1));
    children.push(createParagraph("经审查，管理人对你申报的债权作出如下初审认定：", { spacing: 100 }));
    
    const conclusionInfo = [
        ["初审确认金额", formatCurrency(data.confirmedAmount)],
        ["债权性质", data.claimNature || "普通债权"],
        ["债权类别", data.claimCategory || ""]
    ];
    children.push(createInfoTable(conclusionInfo));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 简要说明
    children.push(createParagraph(data.briefConclusion || data.amountReview || `经审查，申报金额调整为${formatCurrency(data.confirmedAmount)}，债权性质认定为${data.claimNature || "普通债权"}。`, { spacing: 100 }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 三、权利救济
    children.push(createHeading("三、权利救济", 1));
    const reliefItems = [
        "1. 如你对上述初审意见有异议，可在收到本告知书之日起15日内向管理人提出书面异议，并附相关证据材料。",
        "2. 管理人将在收到异议后进行复核，并将最终审查结果提交债权人会议审议。",
        "3. 逾期未提出异议的，视为对初审意见无异议。"
    ];
    reliefItems.forEach(item => children.push(createParagraph(item, { spacing: 100 })));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 四、联系信息
    children.push(createHeading("四、联系信息", 1));
    const contactInfo = [
        ["管理人名称", adminName],
        ["联系人", data.contactPerson || "[联系人]"],
        ["联系电话", data.contactPhone || "[联系电话]"],
        ["联系地址", data.contactAddress || "[联系地址]"]
    ];
    children.push(createInfoTable(contactInfo));
    children.push(createParagraph(" ", { spacing: 200, indent: false }));
    
    // 特此告知
    children.push(createParagraph("特此告知。", { spacing: 100, indent: false }));
    children.push(createParagraph(" ", { spacing: 300, indent: false }));
    
    // 签章
    children.push(createParagraph(`${adminName}（盖章）`, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    children.push(createParagraph(" ", { spacing: 150, indent: false }));
    children.push(createParagraph(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }), { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    
    return new Document({
        styles: { default: { document: { run: { font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont }, size: 21 } } } },
        sections: [{
            properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            footers: { default: new Footer({ children: [] }) },
            children: children
        }]
    });
}

// 辅助函数：创建信息表格
// 创建信息表格（两列，自适应宽度）
function createInfoTable(data) {
    // 判断第一行是否为表头（通过内容判断）
    const isFirstRowHeader = data.length > 0 && 
        ["审查项目", "申报金额", "申报日期", "债权人名称", "债务人名称", "管理人名称", "初审确认金额"].includes(data[0][0]);
    
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [35, 65],
        rows: data.map((row, index) => new TableRow({
            cantSplit: true,
            children: [
                createTableCell(row[0], 35, isFirstRowHeader && index === 0),
                createTableCell(row[1], 65, false)
            ]
        }))
    });
}

// ==================== 生成补充资料或证据材料清单 ====================
function generateSupplementList(data) {
    const children = [];
    const adminName = data.administratorName || (data.debtorName ? data.debtorName + "管理人" : "[管理人名称]");
    const suppNumber = data.suppNumber || "[编号]";
    
    // 标题
    children.push(createParagraph(adminName, { alignment: AlignmentType.CENTER, size: 24, indent: false }));
    children.push(createParagraph("补充资料或证据材料清单", { alignment: AlignmentType.CENTER, size: 36, bold: true, indent: false }));
    children.push(createParagraph(`编号：${suppNumber}`, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    children.push(createParagraph(" ", { spacing: 150, indent: false }));
    
    // 致债权人
    children.push(createParagraph(`致：${data.creditorName || "[债权人名称]"}`, { spacing: 100, indent: false }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 说明
    children.push(createParagraph(`你于${data.declareDate || new Date().toLocaleDateString('zh-CN')}向管理人申报债权，经管理人初步审查，现就你申报的债权需补充以下资料或证据材料：`, { spacing: 100 }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 一、需补充的资料/证据清单
    children.push(createHeading("一、需补充的资料/证据清单", 1));
    
    // 主体资格证明
    if (data.needSubjectProof) {
        children.push(createHeading("1. [ ] 主体资格证明", 2));
        children.push(createParagraph(`说明：${data.subjectProofDesc || "需补充身份证明、营业执照、授权委托书等主体资格证明材料。"}`, { spacing: 100 }));
    }
    
    // 债权事实证据
    if (data.needFactEvidence) {
        children.push(createHeading("2. [ ] 债权事实证据", 2));
        children.push(createParagraph(`说明：${data.factEvidenceDesc || "需补充合同、借据、对账单、送货单等债权事实证据材料。"}`, { spacing: 100 }));
    }
    
    // 债权数额依据
    if (data.needAmountBasis) {
        children.push(createHeading("3. [ ] 债权数额依据", 2));
        children.push(createParagraph(`说明：${data.amountBasisDesc || "需补充利息计算依据、违约金约定、结算文件等债权数额依据材料。"}`, { spacing: 100 }));
    }
    
    // 时效证明材料
    if (data.needTimeProof) {
        children.push(createHeading("4. [ ] 时效证明材料", 2));
        children.push(createParagraph(`说明：${data.timeProofDesc || "需补充催告记录、诉讼文书、仲裁裁决等时效证明材料。"}`, { spacing: 100 }));
    }
    
    // 其他材料
    if (data.needOtherMaterial) {
        children.push(createHeading("5. [ ] 其他材料", 2));
        children.push(createParagraph(`说明：${data.otherMaterialDesc || "其他需要补充的材料。"}`, { spacing: 100 }));
    }
    
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 二、补充期限
    children.push(createHeading("二、补充期限", 1));
    children.push(createParagraph("请你于收到本清单之日起15日内将上述补充材料提交至管理人处。逾期未补充的，管理人将依据现有材料进行审查并出具审查意见。", { spacing: 100 }));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 三、提交方式
    children.push(createHeading("三、提交方式", 1));
    const submitMethods = [
        `现场提交：${data.submitAddress || data.contactAddress || "[地址]"}`,
        `邮寄提交：${data.mailAddress || data.contactAddress || "[地址]"}，邮编：${data.zipCode || "[邮编]"}`,
        `电子邮件：${data.email || "[邮箱]"}（需同时提交纸质材料）`
    ];
    submitMethods.forEach(method => children.push(createParagraph(method, { spacing: 100 })));
    children.push(createParagraph(" ", { spacing: 100, indent: false }));
    
    // 四、联系信息
    children.push(createHeading("四、联系信息", 1));
    const contactInfo = [
        ["管理人名称", adminName],
        ["联系人", data.contactPerson || "[联系人]"],
        ["联系电话", data.contactPhone || "[联系电话]"],
        ["联系地址", data.contactAddress || "[联系地址]"]
    ];
    children.push(createInfoTable(contactInfo));
    children.push(createParagraph(" ", { spacing: 200, indent: false }));
    
    // 特此通知
    children.push(createParagraph("特此通知。", { spacing: 100, indent: false }));
    children.push(createParagraph(" ", { spacing: 300, indent: false }));
    
    // 签章
    children.push(createParagraph(`${adminName}（盖章）`, { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    children.push(createParagraph(" ", { spacing: 150, indent: false }));
    children.push(createParagraph(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }), { alignment: AlignmentType.RIGHT, size: 21, indent: false }));
    
    // 备注
    children.push(createParagraph(" ", { spacing: 300, indent: false }));
    children.push(new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
        spacing: { before: 200 },
        children: [new TextRun({
            text: "备注：本清单仅列示初步审查发现的需补充材料，不排除后续审查中要求补充其他材料的可能。",
            font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont },
            size: 18,
            color: "666666",
            italics: true
        })]
    }));
    
    return new Document({
        styles: { default: { document: { run: { font: { ascii: "Arial", hAnsi: "Arial", eastAsia: cjkFont }, size: 21 } } } },
        sections: [{
            properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
            footers: { default: new Footer({ children: [] }) },
            children: children
        }]
    });
}

// 示例数据
const sampleData = {
    docNumber: "2024-001",
    caseNo: "（2024）破管字第001号",
    debtorName: "XX有限公司",
    acceptanceDate: "2024年6月15日",
    creditorName: "XXX科技有限公司",
    creditorId: "91110000XXXXXXXXX",
    creditorContactPerson: "孙七",
    creditorContactPhone: "13800138000",
    creditorContactAddress: "上海市浦东新区XX路XX号",
    agentName: "张三",
    claimType: "合同债权",
    claimAmount: 5000000.00,
    confirmedAmount: 4800000.00,
    principal: 4500000.00,
    interest: 250000.00,
    penalty: 50000.00,
    fees: 0.00,
    claimNature: "普通债权",
    claimCategory: "合同之债-买卖合同",
    amountReview: "经审查，申报本金4,500,000.00元予以确认，利息按照合同约定及LPR标准计算确认为250,000.00元，违约金因高于造成损失的30%标准，调整为50,000.00元。",
    contactPerson: "李四",
    contactPhone: "010-12345678",
    contactAddress: "北京市朝阳区XX路XX号",
    reviewer: "王五",
    reviewer2: "赵六"
};

// 示例数据（需补充资料的情况）
const sampleSupplementData = {
    ...sampleData,
    suppNumber: "2024-补-001",
    needSubjectProof: true,
    subjectProofDesc: "缺少法定代表人身份证明及授权委托书原件。",
    needFactEvidence: true,
    factEvidenceDesc: "需补充2023年12月至2024年3月期间的送货单及对账单。",
    needAmountBasis: false,
    needTimeProof: true,
    timeProofDesc: "需补充催告履行的书面记录或邮寄凭证。",
    needOtherMaterial: false
};

// 生成文档
async function main() {
    try {
        // 生成破产债权审查意见书（详版）- 仅基于目前材料
        const detailedDoc = generateDetailedReview(sampleData);
        const detailedBuffer = await Packer.toBuffer(detailedDoc);
        fs.writeFileSync("破产债权审查意见书.docx", detailedBuffer);
        console.log("已生成：破产债权审查意见书.docx（仅基于目前材料）");
        
        // 生成债权初审意见告知书（简版）- 仅基于目前材料
        const noticeDoc = generateNoticeToCreditor(sampleData);
        const noticeBuffer = await Packer.toBuffer(noticeDoc);
        fs.writeFileSync("债权初审意见告知书.docx", noticeBuffer);
        console.log("已生成：债权初审意见告知书.docx（仅基于目前材料）");
        
        // 生成补充资料或证据材料清单（如需要）
        const supplementDoc = generateSupplementList(sampleSupplementData);
        const supplementBuffer = await Packer.toBuffer(supplementDoc);
        fs.writeFileSync("补充资料或证据材料清单.docx", supplementBuffer);
        console.log("已生成：补充资料或证据材料清单.docx");
    } catch (error) {
        console.error("生成失败：", error);
    }
}

main();

module.exports = { generateDetailedReview, generateNoticeToCreditor, generateSupplementList };
