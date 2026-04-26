# Chef persona 社区治理 / Persona governance

懒蛋厨房的 chef-bot personas (唐牛 / Remy / ...) **任何人可在社区里提议或弹劾**。
maintainer 终裁，但必须公开理由。

## 当前 personas

| Persona | 菜系覆盖 | LLM | 文件 |
|---|---|---|---|
| **唐牛** | 中餐 (CN/HK/TW/MO) | DeepSeek | `skills/chef-bot/personas/tangniu.md` |
| **Remy / 雷米** | 一切其它 | Gemini | `skills/chef-bot/personas/remy.md` |

## 提议新 persona

1. 想清楚：**与现有 persona 菜系覆盖不重叠**？风格差异化？
2. 复制 `skills/chef-bot/personas/_template.md` 写完整 prompt 草稿
3. 开 [新 Issue → 🍳 提议新 chef persona](https://github.com/Coh1e/lazy-kitchen/issues/new?template=propose-persona.yml)
4. 社区在 issue 里讨论；maintainer 评估
5. maintainer 觉得成熟 → 提 PR 加 `personas/<name>.md` + 改路由 + 加头像
6. PR 合并 → chef-bot Worker 自动 redeploy → endpoint 立即生效

## 弹劾现有 persona

1. 收集**具体证据** —— 至少 3 个 PR/issue 链接说明该 persona 哪里有问题
2. 想好**替代方案** —— 弹劾后由谁兜底
3. 开 [新 Issue → 🚫 弹劾 chef persona](https://github.com/Coh1e/lazy-kitchen/issues/new?template=impeach-persona.yml)
4. 社区讨论；maintainer 决定（可能：改 prompt / 换 LLM / 彻底删除）
5. 决定删除 → 提 PR 删 `personas/<name>.md` + 改路由 fallback
6. PR 合并 → chef-bot Worker 自动 redeploy

无论结果如何，issue 永久保留作为治理 history。

## 轻治理原则

- **maintainer 终裁，无投票门槛** —— 避免 brigading（小群体刷票）
- **maintainer 必须公开理由** —— 在 issue 留言解释决定
- **保留所有提议/弹劾 issue** —— 供后人参考
- **替代方案是硬要求** —— 弹劾必须 propose"由谁接管"，不能纯破坏

## 法律底线（不容讨论）

无论社区多希望：

1. persona **不许复刻真实人物 / 演员 / 名厨**（法律 + 道德）
2. 菜系**不许刻意冒犯**（"X 国黑暗料理" 这种命名 close）
3. **不许加广告位 / 推销 SKU**
4. **不许导向商业销售**

## 提案者要做什么

提议新 persona 必须自己：

- 写 ≥ 200 字 prompt 草稿（不是"中国厨师"这种水货）
- 给头像设计概念（ChatGPT 提示词或草图链接）
- 声明名字 + 头像无 IP 风险

## maintainer 内部判断

公开规则：终裁。**内部如何判断** 见 maintainer 私有笔记（不公开）。
