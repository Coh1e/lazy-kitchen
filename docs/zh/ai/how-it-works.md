# AI 工作流 / How it works

LK 的 AI 智能完全在 **maintainer 本机的 CLI agent** 里跑，仓库不存 API key、不调外部服务。

## 一图看懂

```text
仓库 (lazy-kitchen)              maintainer 本机 CLI agent
─────────────────                ─────────────────────────
data/*.yaml          ◄────read───  Cline + DeepSeek
schemas/*.json                       │
skills/add-dish/                     ▼
  workflow.md        ◄──instruct──  跑 add-dish skill 的 5 + 1 步
  examples/*.md                      │
                                     ▼
docs/*.md            ◄──write────  把草稿写回 data/ + docs/
                                     │
                                     ▼
                                   git push (maintainer 手动)
                                     │
                                     ▼
                                   CF Pages 自动部署
                                     │
                                     ▼
                                   站点告示栏自动出现 status: proposed
```

## 5 + 1 步流程概览

详见 `skills/add-dish/workflow.md`，以下是简版:

| Step | 做什么 |
|---|---|
| 1. Analyze | 解析菜名 → 菜系、味型、主食材、工艺 |
| 2. Match | 扫现有 SKU/SOP/Ratio → 给信心评级 |
| 3a. use_existing | 直接组装 dish (现有零件够) |
| 3b. propose_new | 草拟新 SKU/SOP/Ratio |
| 4. Glossary | 新词 → maintainer 审 → append |
| 5. Validate | 跑 3 个校验脚本 → 报告 |
| 6. Cross-CLI review | 按矩阵触发跨家族二审 |

## 7 条硬规则

skill 必须遵守:

1. **不许擅自写文件**（每次写入前展示草稿）
2. **新条目 status = proposed**（不是 draft；自动进告示栏）
3. **glossary 是术语护栏**（不许擅自翻译）
4. **双语强制**（zh + en 双填）
5. **校验闭环**（写完跑 3 个脚本，失败回滚）
6. **不许 git 操作**（输出 commit message 让人手动执行）
7. **不许调外部 API**（模型在 maintainer 的 CLI 里）

## 为什么这样设计

### 为什么 AI 不在仓库里跑？
- 不要 API key 管理负担
- maintainer 自己选模型（成本 / 中英能力 / 隐私）
- 项目长寿：AI 服务商变迁不影响仓库

### 为什么必须人工逐文件确认？
- AI 偶尔会幻觉（错菜系、错术语、错配料）
- maintainer 是审美主导，AI 是劳动力
- 慢 30 秒，省 30 天纠错

### 为什么强制双语？
- glossary 只在两端都全才能闭环
- 公网读者很多是双语阅读者
- 强迫 AI 双填减少"自由发挥乱译"

### 为什么跨 CLI 二审？
- 同模型家族容易共谋同一种偏见
- 跨家族（Anthropic ↔ OpenAI ↔ Google ↔ DeepSeek）能交叉验证
- 比让一个模型"自己审自己"靠谱

## 试一试

确认你装好了一个 agentic CLI（推荐 Cline + DeepSeek，中文场景最佳），然后:

```text
> /add-dish 红烧肉饭
```

skill 会跟你 5 步交互式确认。第一次跑可能花 15 分钟（你需要看每个草稿）；熟了之后 5 分钟搞定一道。
