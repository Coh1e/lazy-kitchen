# 怎么参与 / How to participate

懒蛋厨房 是 **maintainer 主导 + 社区共建** 的项目。
不论你的厨艺水平如何，下面任何一种参与都欢迎。

## 三种参与方式

### A. 用 Giscus 投票 / 评论（最低门槛）

每道菜的页面底部嵌入了 GitHub Discussions。你可以:

- 👍 / 👎 一键投票
- 留中英文评论（"这道菜的醋应该用 cane vinegar 而不是 rice vinegar"）
- 看其他人的讨论

**前提**：登录 GitHub 账号（一次注册，永久使用）。

### B. 提 GitHub Issue（中等门槛）

适合系统性反馈:

| Issue 类型 | 例子 |
|---|---|
| 菜系不准 | "这不是正宗韩式酱蟹，韩国人不会用 X 调料" |
| 术语错 | "glossary 里 '老抽' 翻成 dark soy sauce 没问题，但 alias_en 应加 'sweet dark soy'" |
| 硬件需求漏标 | "这道菜其实需要烤箱，hardware_extension 没列" |
| 时间不实 | "20 分钟 hands_on 做不出来，应该 35 分钟" |
| 食安风险 | "真空袋的耐温没说清楚，新手可能用错" |
| 翻译质量 | "英文步骤翻译有歧义" |

→ 在 GitHub repo 的 Issues 标签页提即可。

### C. 提 GitHub PR（高门槛）

直接改 yaml + docs，maintainer review 后 merge。适合:

- 加新菜（自己跑过 add-dish skill 后）
- 修术语
- 改 SOP 步骤
- 加 buying_guide 细节
- 修翻译

PR 要遵守:

- 通过 `bun run scripts/validate-data.ts`
- 通过 `bun run scripts/lint-bilingual.ts`
- 跨 CLI 二审过（理想）或在 PR 里说明跳过原因

## maintainer 怎么处理反馈

```text
GitHub Discussions 评论     →  maintainer 个人判断 → 改 yaml → push
GitHub Issue                →  maintainer 评估 → label / fix / close
GitHub PR                   →  review → 改 yaml 验证 → merge or request changes
```

回复时间不保证。这是个人项目。

## 上限

- 不接受"我觉得这道菜应该叫 XXX 才对" 的纯品味争论（建议另开 fork）
- 不接受"加这个酱料、加那个酱料"的功能蔓延（违反"硬件极简"原则）
- 不接受"做个 App 吧" 的转方向请求（这就是个静态站 + skill）

## 你能做主的范围

- 你 fork 后可以加任何菜，状态可以全部 approved，让你自己用
- 你不需要把改动 merge 回主仓库
- 主仓库只是"懒蛋厨房 official 视角"；你的厨房是你的厨房
