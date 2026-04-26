<!-- chef-bot 自动生成的 PR 会覆盖这个 template；人工 PR 用下面 checklist -->

## 改动概述
<!-- 1-2 句说明改了什么，为什么 -->

## 类型
- [ ] 加新菜 / SKU / SOP / Ratio
- [ ] 修术语 (glossary)
- [ ] 改前端 (src/)
- [ ] 改 skill (skills/, .claude/skills/)
- [ ] 改 CI (.github/workflows/)
- [ ] 文档 (docs/, README)
- [ ] 其它

## maintainer review checklist (必填)
- [ ] yaml 字段完整 + schema 通过 (`npm run validate`)
- [ ] 双语完备 (`npm run lint:bilingual`)
- [ ] glossary 新词全在 `glossary_additions` 列出
- [ ] 量度都带 g/ml 换算（不允许"少许/适量"）
- [ ] 跨 CLI 二审 (`cross_reviewed: true`)，approved 状态必须；其它状态可 false
- [ ] 没有引入未在 `data/hardware.yaml` 的硬件
